<script lang="ts">
	import { COLOR_OPTIONS, getVividColor } from '$lib/utils/colors.js';
	import { getIsDarkMode } from '$lib/utils/theme.svelte.js';
	import type { NoteColor } from '$lib/types/index.js';

	interface Props {
		selected: NoteColor;
		onSelect: (color: NoteColor) => void;
	}

	let { selected, onSelect }: Props = $props();
</script>

<div class="flex flex-wrap gap-1.5" data-testid="color-picker">
	{#each COLOR_OPTIONS as option}
		{@const vivid = getVividColor(option.value, getIsDarkMode())}
		<button
			onclick={() => onSelect(option.value)}
			class="h-7 w-7 rounded-full border-2 transition-all duration-150 hover:scale-110 active:scale-95 {selected === option.value ? 'ring-2 ring-offset-1 ring-[var(--primary)] scale-110' : 'border-[var(--border-subtle)]'}"
			style="background-color: {vivid.bg}; border-color: {vivid.border};"
			title={option.label}
			data-testid="color-{option.value}"
		></button>
	{/each}
</div>
