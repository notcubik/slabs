<script lang="ts">
	import { updatePreference, getPreferences } from '$lib/stores/preferences.svelte.js';

	const prefs = $derived(getPreferences());

	const accents = [
		{ id: 'slates' as const, label: 'Slate', color: '#6366F1' },
		{ id: 'amber' as const, label: 'Amber', color: '#D97706' },
		{ id: 'emerald' as const, label: 'Emerald', color: '#059669' },
		{ id: 'ocean' as const, label: 'Ocean', color: '#0891B2' },
		{ id: 'rose' as const, label: 'Rose', color: '#E11D48' },
		{ id: 'violet' as const, label: 'Violet', color: '#7C3AED' }
	];
</script>

<div class="flex gap-3" data-testid="theme-picker">
	{#each accents as accent}
		<button
			onclick={() => updatePreference('accentColor', accent.id)}
			class="group flex flex-col items-center gap-1.5"
			title={accent.label}
			data-testid="theme-{accent.id}"
		>
			<div
				class="h-9 w-9 rounded-full transition-all {prefs.accentColor === accent.id ? 'ring-2 ring-offset-2 ring-[var(--text)] scale-110' : 'hover:scale-110'}"
				style="background-color: {accent.color}"
			>
				{#if prefs.accentColor === accent.id}
					<span class="flex h-full items-center justify-center text-white text-xs font-bold">&#10003;</span>
				{/if}
			</div>
			<span class="text-[10px] font-medium text-[var(--text-muted)]">{accent.label}</span>
		</button>
	{/each}
</div>
