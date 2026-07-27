<script lang="ts">
	import { allTags, selectedTag } from '$lib/stores/notes.js';
	import TagChip from './TagChip.svelte';

	function toggleTag(tag: string) {
		selectedTag.update((current) => {
			if (current.includes(tag)) {
				return current.filter((t) => t !== tag);
			}
			return [...current, tag];
		});
	}

	function clearTags() {
		selectedTag.set([]);
	}

	function isTagActive(tag: string): boolean {
		return $selectedTag.includes(tag);
	}
</script>

{#if $allTags.length > 0}
	<div class="flex items-center gap-2">
		<div class="tag-scroll flex gap-1.5 overflow-x-auto max-md:flex-nowrap md:flex-wrap" data-testid="tag-filter">
			{#each $allTags as tag}
				<TagChip {tag} active={isTagActive(tag)} onclick={() => toggleTag(tag)} />
			{/each}
		</div>
		{#if $selectedTag.length > 0}
			<button
				onclick={clearTags}
				class="whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--destructive)] transition-all duration-150 active:scale-95"
				data-testid="clear-tags-btn"
			>
				Clear
			</button>
		{/if}
	</div>
{/if}

<style>
	.tag-scroll {
		scrollbar-width: none;
	}
	.tag-scroll::-webkit-scrollbar {
		display: none;
	}
</style>
