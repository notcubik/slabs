<script lang="ts">
	import NoteCard from './NoteCard.svelte';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import type { Note } from '$lib/types/index.js';

	interface Props {
		notes: Note[];
		label?: string;
		onEdit: (note: Note) => void;
		onUnlock?: (note: Note) => void;
		draggable?: boolean;
		dndType?: string;
		onReorder?: (noteIds: string[]) => void;
	}

	let { notes, label = '', onEdit, onUnlock, draggable = false, dndType = 'notes', onReorder }: Props = $props();

	let localItems = $state<Note[]>([]);

	$effect(() => {
		localItems = [...notes];
	});

	const flipDurationMs = 150;

	function handleConsider(e: CustomEvent<DndEvent<Note>>) {
		localItems = e.detail.items;
	}

	function handleFinalize(e: CustomEvent<DndEvent<Note>>) {
		localItems = e.detail.items;
		onReorder?.(localItems.map((n) => n.id));
	}

	let displayItems = $derived(draggable ? localItems : notes);
</script>

{#if displayItems.length > 0}
	{#if label}
		<p class="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
	{/if}
	{#if draggable}
		<div
			class="note-grid-mobile columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4"
			data-testid="note-grid"
			use:dndzone={{ items: localItems, flipDurationMs, type: dndType, dropTargetStyle: {}, delayTouchStart: 400 }}
			onconsider={handleConsider}
			onfinalize={handleFinalize}
		>
		{#each localItems as note (note.id)}
			<div class="mb-4 break-inside-avoid outline-none" animate:flip={{ duration: flipDurationMs }}>
				<NoteCard {note} {onEdit} {onUnlock} />
			</div>
		{/each}
	</div>
{:else}
	<div class="note-grid-mobile columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4" data-testid="note-grid">
		{#each displayItems as note (note.id)}
			<div class="mb-4 break-inside-avoid">
				<NoteCard {note} {onEdit} {onUnlock} />
			</div>
		{/each}
		</div>
	{/if}
{/if}
