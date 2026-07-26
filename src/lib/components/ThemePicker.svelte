<script lang="ts">
	import { updatePreference, getPreferences } from '$lib/stores/preferences.svelte.js';

	const prefs = getPreferences();

	const themes = [
		{ id: 'slates' as const, label: 'Slates', color: '#3B82F6' },
		{ id: 'amber' as const, label: 'Amber', color: '#F59E0B' },
		{ id: 'emerald' as const, label: 'Emerald', color: '#10B981' },
		{ id: 'ocean' as const, label: 'Ocean', color: '#06B6D4' },
		{ id: 'violet' as const, label: 'Violet', color: '#8B5CF6' },
		{ id: 'rose' as const, label: 'Rose', color: '#F43F5E' }
	];
</script>

<div class="flex gap-3" data-testid="theme-picker">
	{#each themes as theme}
		<button
			onclick={() => updatePreference('colorScheme', theme.id)}
			class="group relative h-10 w-10 rounded-full transition-all {prefs.colorScheme === theme.id ? 'ring-2 ring-offset-2 ring-[var(--text)]' : 'hover:scale-110'}"
			style="background-color: {theme.color}"
			title={theme.label}
			data-testid="theme-{theme.id}"
		>
			{#if prefs.colorScheme === theme.id}
				<span class="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">✓</span>
			{/if}
		</button>
	{/each}
</div>
