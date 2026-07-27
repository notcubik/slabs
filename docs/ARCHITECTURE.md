# Architecture

## Overview

Slabs follows a **local-first** architecture where the client (browser) is the primary data store and the server acts as a sync target and backup.

```
┌─────────────────────────────┐
│         Browser (PWA)        │
│  ┌───────────┐ ┌──────────┐ │
│  │  Svelte   │ │ IndexedDB│ │
│  │  Stores   │◄│  (idb)   │ │
│  └─────┬─────┘ └────┬─────┘ │
│        │             │       │
│  ┌─────▼─────────────▼─────┐ │
│  │      Sync Engine        │ │
│  │  (LWW CRDT + Queue)    │ │
│  └──────────┬──────────────┘ │
└─────────────┼────────────────┘
              │ HTTP (JSON)
┌─────────────▼────────────────┐
│         Server (Node.js)      │
│  ┌──────────┐ ┌────────────┐ │
│  │ SvelteKit│ │   SQLite   │ │
│  │   API    │◄│ (Drizzle)  │ │
│  └──────────┘ └────────────┘ │
└──────────────────────────────┘
```

## Data Flow

### Read Path
1. User opens app
2. Svelte stores read from IndexedDB (instant)
3. Background sync pulls latest from server
4. If newer data found, IDB is updated, stores react

### Write Path
1. User creates/edits note
2. Change written to IndexedDB immediately
3. Change added to sync queue
4. Background sync pushes queue to server
5. Server applies changes with LWW resolution

### Conflict Resolution (LWW)
For a single-user app with multiple devices:
- Each note has an `updatedAt` timestamp and `version` number
- When merging: newer timestamp wins
- If timestamps match: higher version wins
- If both match: local version is preferred

### Attachment Data Flow
1. User drops/picks image in NoteEditor
2. Client optimizes: resize ≤1920px, compress to WebP, generate 200px thumbnail
3. **Online**: POST optimized + thumbnail to `/api/notes/{id}/attachments` → server saves to `data/attachments/` + DB
4. **Offline**: store blobs in IDB `pendingAttachments` store → display via `URL.createObjectURL()` → on reconnect, sync pushes to server
5. **Display**: NoteCard uses `&thumb=1` URL (200px WebP), editor shows full-size
6. **SW Caching**: `CacheFirst` rule caches attachment URLs — previously-viewed images available offline

## Tech Stack Rationale

### SvelteKit
- Smallest bundle size of major frameworks
- Built-in SSR, routing, API routes
- Svelte 5 runes for reactive state
- Native service worker support via @vite-pwa/sveltekit

### SQLite + Drizzle
- Zero-config database (single file)
- WAL mode for concurrent reads
- Drizzle provides type-safe queries without ORM overhead
- Perfect for single-user self-hosted apps

### IndexedDB (idb)
- Browser-native storage (no size limits like localStorage)
- Async API doesn't block main thread
- `idb` library provides Promise-based wrapper
- Survives browser restarts

### Tailwind CSS 4
- Utility-first, tree-shakeable
- Built-in dark mode support (`dark:` variants)
- New v4 uses Vite plugin (faster builds)

### Argon2
- Memory-hard password hashing (resists GPU attacks)
- See [AUTH.md](AUTH.md) for authentication details

## Database Schema

See `src/lib/server/db/schema.ts` for the complete Drizzle schema.

Key tables:
- `users` - User accounts (password hash, OAuth provider link, role)
- `sessions` - Auth sessions (30-day TTL)
- `notes` - Core note data with version tracking
- `tags` - Unique tag names
- `note_tags` - Many-to-many note ↔ tag
- `attachments` - Image file metadata (path + thumbnailPath)
- `api_keys` - MCP API keys (SHA-256 hashed, prefix for display)
- `note_collaborators` - Sharing relationships (noteId + userId + addedBy)
- `note_user_state` - Per-user pin/archive/sortOrder for shared notes
- `shared_notes` - Public share links (noteId → token, 1:1 with cascade delete)
- `sync_log` - Sync operation history

### Nested Checklist Serialization

Checklist items are stored as plain text in the note `content` field, one item per line. Child items use a 2-space indent prefix:

```
- [ ] Parent item
  - [ ] Child item
  - [x] Checked child item
- [x] Another parent
```

- A line starting with `  - [ ]` or `  - [x]` (2 spaces) is parsed as a child of the preceding top-level item.
- The `parentId` field on `ChecklistItem` is **runtime-only** — it is derived from position during parsing and never stored explicitly.
- This format is fully backward compatible: flat checklists (no indented lines) parse identically to before.

### Collaboration Access Control

Notes support sharing with other users on the same instance:

- **Owner**: Full control (edit, trash, delete, share/unshare)
- **Collaborator**: Can edit content, color, checklist mode; has independent pin/archive/sortOrder state via `note_user_state`
- Access checks use `canAccessNote()` / `requireNoteAccess()` / `requireNoteOwnership()` helpers
- `note_user_state` stores per-user view state (pinned, archived, sortOrder) — collaborators see their own organization
- When owner trashes a note, it vanishes for all collaborators
- Collaborators can leave (remove themselves) from shared notes

## MCP Server

Slabs includes a built-in [Model Context Protocol](https://modelcontextprotocol.io/) server that allows AI assistants (Claude Code, Claude Desktop, etc.) to interact with notes programmatically.

### Architecture
- **Endpoint**: `POST /api/mcp` (Streamable HTTP transport)
- **Auth**: Bearer token via API keys (generated in Settings)
- **Sessions**: Stateful per MCP spec — session ID in `mcp-session-id` header
- **Transport**: `WebStandardStreamableHTTPServerTransport` (works with SvelteKit's Web Standard Request/Response)

### Shared Logic
MCP tool handlers and REST API routes both call the same service layer (`src/lib/server/notes-service.ts`). This avoids duplicating business logic:

```
REST API routes ──┐
                  ├──► notes-service.ts ──► Drizzle DB
MCP tool handlers ┘
```

### Tools (14)
`list_notes`, `get_note`, `create_note`, `update_note`, `trash_note`, `restore_note`, `archive_note`, `unarchive_note`, `delete_note`, `search_notes`, `list_tags`, `pin_note`, `reorder_notes`, `upload_image`

## Dark Mode

Theme switching uses CSS variable overrides on the `<html>` element:

- **CSS**: `[data-theme="dark"]` attribute on `<html>` overrides all `--bg-*`, `--text-*`, `--border-*`, and `--primary-*` variables defined in `src/app.css`
- **Persistence**: preference stored as `theme` in the existing `userPreferences` key-value system (values: `"system"` | `"light"` | `"dark"`)
- **FOUC prevention**: a blocking inline `<script>` in `app.html` reads the preference from localStorage and sets `data-theme` before any content renders
- **Reactivity**: a `$effect` in the root `+layout.svelte` watches the theme store and updates `document.documentElement.dataset.theme` on change
- **Note card colors**: `getNoteColor()` in `src/lib/utils/colors.ts` accepts a `dark` boolean and returns the appropriate color variant per theme

### Accent Color System

Six accent colors are available via the `data-color` attribute on `<html>`, independent of light/dark mode:

- **Implementation**: `[data-color="..."]` selectors in `src/app.css` override only `--primary` and `--primary-hover` for both light and dark modes
- **Persistence**: stored as `accentColor` in the `userPreferences` key-value system (values: `"slates"` | `"amber"` | `"emerald"` | `"ocean"` | `"rose"` | `"violet"`)
- **Picker UI**: `ThemePicker.svelte` renders color circles with selection ring feedback
- **CSS cascade**: accent color overrides sit after both `:root` defaults and `[data-theme="dark"]` overrides, ensuring the accent color always wins for `--primary`

### Tag Management

Tags are managed through a dedicated server module (`src/lib/server/tags.ts`) and API routes (`/api/tags`):

- **CRUD operations**: create (via `syncNoteTags`), rename (PATCH), delete (DELETE)
- **Deduplication**: `syncNoteTags` upserts tag rows by name+userId, preventing duplicates
- **Cascade behavior**: deleting a tag via the API removes the tag row; orphaned `note_tags` associations are cleaned up automatically
- **Per-user scoping**: tags are scoped to the user who created them (`tags.userId`)

### Save State Tracking

Notes track save state client-side to provide visual feedback:

- **States**: `"saved"` | `"saving"` | `"unsaved"` — tracked per-note in the editor component
- **Transitions**: content edits trigger `"unsaved"`, successful API write triggers `"saved"`, in-flight request triggers `"saving"`
- **Auto-save**: editor close triggers a final save if there are pending changes
- **Sync integration**: save state is independent of sync status — a note can be saved locally but pending server sync

## File Organization

```
src/lib/server/    # Server-only code (DB, auth, attachments, notes-service)
src/lib/server/mcp/ # MCP server + tool definitions
src/lib/sync/      # Sync engine (shared types, server + client implementations)
src/lib/stores/    # Svelte reactive stores (notes, theme, auth, search)
src/lib/components/ # Svelte UI components
src/lib/utils/     # Pure utility functions (markdown, tags, colors)
src/lib/types/     # TypeScript type definitions
src/routes/api/    # REST API + MCP endpoints
src/routes/        # Page routes (SvelteKit file-based routing)
```
