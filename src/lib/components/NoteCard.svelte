<script lang="ts">
	import { getNoteColor } from '$lib/utils/colors.js';
	import { getIsDarkMode } from '$lib/utils/theme.svelte.js';
	import { renderMarkdown } from '$lib/utils/markdown.js';
	import { togglePin, trashNote, archiveNote, unarchiveNote, restoreNote, deleteNote, leaveNote, currentFilter } from '$lib/stores/notes.js';
	import ImageLightbox from './ImageLightbox.svelte';
	import SharingIndicator from './SharingIndicator.svelte';
	import type { Note } from '$lib/types/index.js';
	import Undo2 from 'lucide-svelte/icons/undo-2';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import Pin from 'lucide-svelte/icons/pin';
	import Archive from 'lucide-svelte/icons/archive';
	import ArchiveRestore from 'lucide-svelte/icons/archive-restore';
	import UserMinus from 'lucide-svelte/icons/user-minus';
	import Lock from 'lucide-svelte/icons/lock';
	import { tooltip } from '$lib/utils/tooltip.js';
	import { linkifyText } from '$lib/utils/checklist.js';

	interface ChecklistItem {
		text: string;
		checked: boolean;
		indented: boolean;
	}

	interface Props {
		note: Note;
		onEdit: (note: Note) => void;
		onUnlock?: (note: Note) => void;
		fullHeight?: boolean;
	}

	let { note, onEdit, onUnlock, fullHeight = false }: Props = $props();

	$effect(() => {
		cardStyle = `background-color: ${getNoteColor(note.color, getIsDarkMode())}`;
	});

	let cardStyle = $state('');
	let lightboxSrc = $state<string | null>(null);
	let lightboxAlt = $state('');

	const renderedContent = $derived(renderMarkdown(note.content));

	const checklistItems = $derived<ChecklistItem[]>(
		note.checklistMode
			? note.content.split('\n').filter(l => l.trim()).map(line => {
					const indented = line.startsWith('  - [');
					return {
						text: line.replace(/^ {0,2}- \[[ x]\] /, ''),
						checked: /^ {0,2}- \[x\] /.test(line),
						indented
					};
				})
			: []
	);

	const activeChecklistItems = $derived(checklistItems.filter(i => !i.checked));
	const doneChecklistItems = $derived(checklistItems.filter(i => i.checked));
	const sortedChecklistItems = $derived([...activeChecklistItems, ...doneChecklistItems]);

	const featuredAttachments = $derived((note.attachments ?? []).filter(a => a.featured));

	// Dynamic height: estimate based on content length
	const contentLength = $derived(
		(note.title?.length ?? 0) + (note.content?.length ?? 0) +
		(checklistItems.length * 30)
	);
	const isCompact = $derived(contentLength < 120);
	const isMedium = $derived(contentLength >= 120 && contentLength < 400);

	const isHidden = $derived(note.isHidden ?? false);

	function handleClick() {
		if (isHidden && onUnlock) {
			onUnlock(note);
		} else {
			onEdit(note);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleClick();
		}
	}

	function stop(fn: () => void) {
		return (e: Event) => {
			e.stopPropagation();
			fn();
		};
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
<article
	class="group relative cursor-pointer rounded-xl border border-[var(--border-subtle)] p-4 text-[var(--text)] outline-none transition-all duration-150 hover:border-[var(--primary)]/40 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] overflow-hidden flex flex-col {fullHeight ? 'h-full' : ''} {isCompact ? 'min-h-[6rem]' : isMedium ? 'min-h-[10rem]' : 'min-h-[14rem]'}"
	style={cardStyle}
	onclick={handleClick}
	onkeydown={handleKeydown}
	role="button"
	tabindex="0"
	data-testid="note-card"
	data-note-id={note.id}
>
	<!-- Thumbnail strip -->
	{#if featuredAttachments.length > 0}
		<div class="-mx-4 -mt-4 mb-3 flex overflow-hidden rounded-t-xl" data-testid="card-thumbnails">
			{#each featuredAttachments.slice(0, 3) as attachment}
				<div class="relative min-w-0 flex-1">
					<button
						type="button"
						class="h-20 w-full cursor-pointer p-0 border-0 bg-transparent"
						onclick={(e) => { e.stopPropagation(); lightboxSrc = `/api/notes/${note.id}/attachments?attachmentId=${attachment.id}`; lightboxAlt = attachment.filename; }}
						data-testid="card-thumbnail"
					>
						<img
							src="/api/notes/{note.id}/attachments?attachmentId={attachment.id}&thumb=1"
							alt={attachment.filename}
							class="h-20 w-full object-cover"
							loading="lazy"
						/>
					</button>
				</div>
			{/each}
			{#if featuredAttachments.length > 3}
				<div class="absolute right-1 top-1 rounded-lg bg-black/60 px-1.5 py-0.5 text-xs font-medium text-white" data-testid="card-thumbnail-count">
					+{featuredAttachments.length - 3}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Status indicators (top-right) -->
	<div class="absolute top-2 right-2 flex items-center gap-0.5">
		{#if isHidden}
			<span class="rounded-lg p-1 text-[var(--text-muted)]" use:tooltip={"Hidden"}>
				<Lock class="h-3.5 w-3.5" />
			</span>
		{/if}
		{#if note.shareToken || (note.isShared && note.collaborators)}
			<SharingIndicator
				shareToken={note.shareToken}
				collaborators={note.collaborators ?? []}
				isOwner={note.isOwner ?? true}
			/>
		{/if}
		{#if note.pinned}
			<button
				onclick={stop(() => togglePin(note.id, note.pinned))}
				class="rounded-lg p-1 text-[var(--primary)] hover:bg-[var(--primary-muted)] transition-colors"
				use:tooltip={"Unpin"}
				data-testid="pin-indicator"
			>
				<Pin class="h-3.5 w-3.5 fill-[var(--primary)] rotate-45" />
			</button>
		{/if}
	</div>

	{#if isHidden}
		<!-- Hidden note placeholder -->
		<div class="flex flex-1 flex-col items-center justify-center gap-2 text-center">
			<Lock class="h-6 w-6 text-[var(--text-muted)]/50" />
			<p class="text-xs text-[var(--text-muted)]/70">Click to unlock</p>
		</div>
	{:else}
		{#if note.title}
			<h3 class="mb-1.5 text-sm font-semibold text-[var(--text)] leading-snug">{note.title}</h3>
		{/if}

		{#if note.checklistMode && checklistItems.length > 0}
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<ul class="space-y-1.5 mb-4" data-testid="note-checklist-preview"
			onclick={(e) => { if ((e.target as HTMLElement).closest('a')) e.stopPropagation(); }}
			onkeydown={(e) => { if ((e.target as HTMLElement).closest('a')) e.stopPropagation(); }}>
			{#each sortedChecklistItems.slice(0, 8) as item}
				<li class="flex items-start gap-2 text-sm {item.indented ? 'pl-4 ' : ''}{item.checked ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text)]'}"
					data-testid={item.indented ? 'card-checklist-child' : undefined}>
					<input
						type="checkbox"
						checked={item.checked}
						disabled
						class="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-[var(--border-subtle)] text-[var(--primary)]"
						data-testid="card-checklist-checkbox"
					/>
					<span class="break-words min-w-0">{@html linkifyText(item.text)}</span>
				</li>
			{/each}
			{#if checklistItems.length > 8}
				<li class="text-xs text-[var(--text-muted)]">+{checklistItems.length - 8} more</li>
			{/if}
		</ul>
	{:else if note.content}
		<div class="prose prose-sm line-clamp-6 max-w-none text-sm text-[var(--text-muted)] leading-relaxed" data-testid="note-content-preview">
			{@html renderedContent}
		</div>
	{/if}
	{/if}

	{#if note.tags && note.tags.length > 0}
		<div class="mt-auto pt-2 flex flex-wrap gap-1">
			{#each note.tags.slice(0, 3) as tag}
				<span class="rounded-md bg-[var(--primary-muted)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--primary)]">{tag}</span>
			{/each}
			{#if note.tags.length > 3}
				<span class="rounded-md bg-[var(--bg-surface-alt)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">+{note.tags.length - 3}</span>
			{/if}
		</div>
	{/if}

	<!-- Action buttons -->
	<div class="absolute bottom-1.5 right-1.5 flex gap-0.5 max-md:opacity-100 md:opacity-0 transition-opacity md:group-hover:opacity-100">
		{#if $currentFilter === 'trashed'}
			<button
				onclick={stop(() => restoreNote(note.id))}
				class="rounded-lg p-1.5 text-[var(--text)] hover:bg-[var(--bg-surface-alt)] transition-colors"
				use:tooltip={"Restore"}
				data-testid="restore-btn"
			>
				<Undo2 class="h-3.5 w-3.5" />
			</button>
			<button
				onclick={stop(() => deleteNote(note.id))}
				class="rounded-lg p-1.5 text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-colors"
				use:tooltip={"Delete forever"}
				data-testid="delete-forever-btn"
			>
				<Trash2 class="h-3.5 w-3.5" />
			</button>
		{:else}
			{#if !note.pinned}
				<button
					onclick={stop(() => togglePin(note.id, note.pinned))}
					class="rounded-lg p-1.5 text-[var(--text)] hover:bg-[var(--bg-surface-alt)] transition-colors"
					use:tooltip={"Pin"}
					data-testid="pin-btn"
				>
					<Pin class="h-3.5 w-3.5" />
				</button>
			{/if}
			{#if $currentFilter === 'archived'}
				<button
					onclick={stop(() => unarchiveNote(note.id))}
					class="rounded-lg p-1.5 text-[var(--text)] hover:bg-[var(--bg-surface-alt)] transition-colors"
					use:tooltip={"Unarchive"}
					data-testid="unarchive-btn"
				>
					<ArchiveRestore class="h-3.5 w-3.5" />
				</button>
			{:else}
				<button
					onclick={stop(() => archiveNote(note.id))}
					class="rounded-lg p-1.5 text-[var(--text)] hover:bg-[var(--bg-surface-alt)] transition-colors"
					use:tooltip={"Archive"}
					data-testid="archive-btn"
				>
					<Archive class="h-3.5 w-3.5" />
				</button>
			{/if}
			{#if note.isShared && !note.isOwner}
				<button
					onclick={stop(() => leaveNote(note.id))}
					class="rounded-lg p-1.5 text-[var(--text)] hover:bg-[var(--bg-surface-alt)] transition-colors"
					use:tooltip={"Leave note"}
					data-testid="leave-btn"
				>
					<UserMinus class="h-3.5 w-3.5" />
				</button>
			{:else}
				<button
					onclick={stop(() => trashNote(note.id))}
					class="rounded-lg p-1.5 text-[var(--text)] hover:bg-[var(--bg-surface-alt)] transition-colors"
					use:tooltip={"Trash"}
					data-testid="trash-btn"
				>
					<Trash2 class="h-3.5 w-3.5" />
				</button>
			{/if}
		{/if}
	</div>

	{#if lightboxSrc}
		<ImageLightbox src={lightboxSrc} alt={lightboxAlt} onClose={() => lightboxSrc = null} />
	{/if}
</article>
