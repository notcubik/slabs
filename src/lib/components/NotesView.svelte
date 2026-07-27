<script lang="ts">
	import NoteGrid from '$lib/components/NoteGrid.svelte';
	import NoteEditor from '$lib/components/NoteEditor.svelte';
	import TagFilter from '$lib/components/TagFilter.svelte';
	import { pinnedNotes, unpinnedNotes, selectedTag, currentFilter, notes, notesLoaded, loadNotes, updateSortOrders } from '$lib/stores/notes.js';
	import { onMount } from 'svelte';
	import { replaceState } from '$app/navigation';
	import type { Note, NoteFilter } from '$lib/types/index.js';
	import Plus from 'lucide-svelte/icons/plus';
	import SquareCheck from 'lucide-svelte/icons/square-check';
	import { tooltip } from '$lib/utils/tooltip.js';

	interface Props {
		filter: NoteFilter;
		tag?: string | null;
	}

	let { filter, tag = null }: Props = $props();

	let editingNote: Note | null = $state(null);
	let showNewNote = $state(false);
	let newNoteChecklist = $state(false);

	$effect(() => {
		currentFilter.set(filter);
		selectedTag.set(tag ? [tag] : []);
		loadNotes(filter);
	});

	function openEditor(note: Note) {
		editingNote = note;
		replaceState(`#${note.id}`, {});
	}

	function closeEditor() {
		editingNote = null;
		showNewNote = false;
		newNoteChecklist = false;
		replaceState(location.pathname, {});
	}

	function handleReorder(noteIds: string[]) {
		const orders = noteIds.map((id, index) => ({ id, sortOrder: index }));
		updateSortOrders(orders);
	}

	onMount(() => {
		const hash = location.hash.slice(1);
		if (!hash) return;

		const unsubscribe = notes.subscribe(($notes) => {
			if ($notes.length === 0) return;
			const note = $notes.find((n) => n.id === hash);
			if (note) editingNote = note;
			unsubscribe();
		});
	});
</script>

{#if filter === 'all' && !tag}
	<div class="mx-auto mb-6 hidden max-w-xl md:block">
		<div class="flex cursor-pointer items-center gap-0 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-surface)] transition-colors hover:border-[var(--primary)]/40 hover:bg-[var(--primary-muted)]/30">
			<button
				onclick={() => (showNewNote = true)}
				class="flex flex-1 cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
				data-testid="new-note-btn"
			>
				<Plus class="h-4 w-4" />
				New note...
			</button>
			<button
				onclick={() => { newNoteChecklist = true; showNewNote = true; }}
				class="cursor-pointer rounded-xl p-3 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
				use:tooltip={"New checklist"}
				data-testid="new-checklist-btn"
			>
				<SquareCheck class="h-4 w-4" />
			</button>
		</div>
	</div>
	<button
		onclick={() => (showNewNote = true)}
		class="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-lg transition-all hover:bg-[var(--primary-hover)] hover:shadow-xl md:hidden"
		aria-label="Add a note"
		data-testid="new-note-fab"
	>
		<Plus class="h-5 w-5" />
	</button>
{/if}

{#if filter === 'all' && !tag}
	<div class="mb-4">
		<TagFilter />
	</div>
{/if}

{#if filter === 'archived'}
	<h2 class="mb-4 font-display text-lg font-semibold text-[var(--text)]">Archive</h2>
{:else if filter === 'trashed'}
	<h2 class="mb-4 font-display text-lg font-semibold text-[var(--text)]">Trash</h2>
{:else if tag}
	<h2 class="mb-4 font-display text-lg font-semibold text-[var(--text)]">#{tag}</h2>
{:else if $selectedTag.length > 0}
	<h2 class="mb-4 font-display text-lg font-semibold text-[var(--text)]">{$selectedTag.join(', ')}</h2>
{/if}

{#if $pinnedNotes.length > 0}
	<div class="mb-6">
		<div class="mb-2 flex items-center gap-2 px-1">
			<p class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Pinned</p>
		</div>
		<NoteGrid notes={$pinnedNotes} onEdit={openEditor} draggable dndType="pinned-notes" onReorder={handleReorder} />
	</div>
{/if}

<NoteGrid
	notes={$unpinnedNotes}
	label={$pinnedNotes.length > 0 ? 'Others' : ''}
	onEdit={openEditor}
	draggable
	dndType="unpinned-notes"
	onReorder={handleReorder}
/>

{#if $notesLoaded && $pinnedNotes.length === 0 && $unpinnedNotes.length === 0}
	<div class="flex flex-col items-center justify-center py-24 text-[var(--text-muted)]">
		<img src="/favicon.svg" alt="" class="mb-4 h-16 w-16 opacity-40" />
		<p class="font-display text-sm font-medium">
			{#if filter === 'trashed'}
				Trash is empty
			{:else if filter === 'archived'}
				No archived notes
			{:else if tag}
				No notes with tag "{tag}"
			{:else if $selectedTag.length > 0}
				No matching notes
			{:else}
				No notes yet
			{/if}
		</p>
		<p class="mt-1 text-xs text-[var(--text-muted)]/60">Create one to get started</p>
	</div>
{/if}

{#if showNewNote}
	<NoteEditor note={null} isNew={true} initialChecklistMode={newNoteChecklist} onClose={closeEditor} />
{/if}

{#if editingNote}
	<NoteEditor note={editingNote} onClose={closeEditor} />
{/if}
