# Screenshot Automation for Landing Page

## Overview

A Playwright-based script that seeds the Slabs app with demo data, captures 10 screenshots (7 desktop + 3 mobile) for the landing page, and commits them. Triggered manually via a GitHub Actions workflow.

## Seed Data — Demo Content

### Users

| User | Email | Role | Purpose |
|------|-------|------|---------|
| Slabs Admin | admin@slabs.app | admin | Main user, owns all notes |
| Alice Chen | alice@slabs.app | user | Collaborator for sharing screenshot |

### Tags

`baking`, `dev`, `devops`, `homelab`, `personal`, `reading`, `weekend`

### Notes

| # | Title | Color | Mode | Tags | Pinned |
|---|-------|-------|------|------|--------|
| 1 | Cookie Recipe | sand | checklist | #baking | yes |
| 2 | Self-Hosting Stack | fog | rich text | #homelab, #devops | no |
| 3 | Back to Retro Gaming | peach | rich text | #reading, #personal | no |
| 4 | The Best Software Is the Software You Own | coral | rich text | #personal | no |
| 5 | Weekend Plans | mint | rich text | #personal, #weekend | no |
| 6 | Ancient Flute Harmonica Discovered | chalk | rich text | #reading | no |
| 7 | Baking code for the... | clay | checklist | #dev | no |

### Image Attachments

**Pixel-art image** — generated programmatically as a PNG, attached as featured image to "Cookie Recipe" note.

### Version History

Send 4-5 `PATCH /api/notes/:id` calls to "Self-Hosting Stack" with varying content for version history entries.

### API Keys

| Name | Purpose |
|------|---------|
| Claude Code | For MCP integration screenshot |
| N8N | For automation screenshot |

## Screenshot Capture Plan

### Desktop (1280x800)

| # | Filename | View | Capture Steps |
|---|----------|------|---------------|
| 1 | screenshot-grid.png | Home grid | Navigate to `/`, wait for notes to render |
| 2 | screenshot-editor.png | Note editor | Click "Self-Hosting Stack" note |
| 3 | screenshot-checklist.png | Checklist mode | Click "Cookie Recipe" note |
| 4 | screenshot-sharing.png | Share dialog | Open a note, click share button |
| 5 | screenshot-history.png | Version history | Open "Self-Hosting Stack", click history |
| 6 | screenshot-attachments.png | Attachments | Open "Cookie Recipe" note |
| 7 | screenshot-api.png | Settings > API/MCP | Navigate to `/settings/mcp` |

### Mobile (390x844)

| # | Filename | View | Capture Steps |
|---|----------|------|---------------|
| 1 | screenshot-mobile-grid.png | Home grid | Navigate to `/` |
| 2 | screenshot-mobile-editor.png | Note editor | Open "Self-Hosting Stack" note |
| 3 | screenshot-mobile-checklist.png | Checklist | Open "Cookie Recipe" note |

## GitHub Actions Workflow

**File**: `.github/workflows/screenshots.yml`

```yaml
name: Screenshots

on:
  workflow_dispatch:

permissions:
  contents: write

jobs:
  screenshots:
    name: Capture Landing Page Screenshots
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: latest
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - name: Install Playwright browsers and system deps
        run: pnpm exec playwright install --with-deps chromium
      - name: Build app
        run: pnpm build
        env:
          DATABASE_URL: ./data/screenshots.db
      - name: Capture screenshots
        run: pnpm exec tsx scripts/screenshots.ts
        env:
          DATABASE_URL: ./data/screenshots.db
      - name: Commit screenshots
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add website/assets/screenshot-*.png
          git diff --cached --quiet && echo "No screenshot changes" && exit 0
          git commit -m "chore: update landing page screenshots [skip ci]"
          git push origin main
```

## Dependencies

No new dependencies. Uses:
- `playwright` (already in devDependencies for e2e tests)
- `tsx` (already in devDependencies for other scripts)
- Node.js built-in `fs`, `path`, `Buffer` for pixel-art PNG generation
- SvelteKit's preview server (spawned as child process via `pnpm preview`)
