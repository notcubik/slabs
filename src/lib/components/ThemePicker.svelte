<script lang="ts">
	import { updatePreference, getPreferences } from '$lib/stores/preferences.svelte.js';

	const prefs = $derived(getPreferences());

	const accents = [
		{ id: 'slates' as const, label: 'Slate', color: '#6366F1' },
		{ id: 'amber' as const, label: 'Amber', color: '#D97706' },
		{ id: 'emerald' as const, label: 'Emerald', color: '#059669' },
		{ id: 'ocean' as const, label: 'Ocean', color: '#0891B2' },
		{ id: 'rose' as const, label: 'Rose', color: '#E11D48' },
		{ id: 'violet' as const, label: 'Violet', color: '#7C3AED' },
		{ id: 'sky' as const, label: 'Sky', color: '#0284C7' },
		{ id: 'teal' as const, label: 'Teal', color: '#0D9488' },
		{ id: 'lime' as const, label: 'Lime', color: '#65A30D' },
		{ id: 'orange' as const, label: 'Orange', color: '#EA580C' },
		{ id: 'pink' as const, label: 'Pink', color: '#DB2777' },
		{ id: 'purple' as const, label: 'Purple', color: '#9333EA' },
		{ id: 'indigo' as const, label: 'Indigo', color: '#4F46E5' },
		{ id: 'red' as const, label: 'Red', color: '#DC2626' },
		{ id: 'green' as const, label: 'Green', color: '#16A34A' },
		{ id: 'blue' as const, label: 'Blue', color: '#2563EB' },
		{ id: 'yellow' as const, label: 'Yellow', color: '#CA8A04' },
		{ id: 'cyan' as const, label: 'Cyan', color: '#06B6D4' }
	];

	let customHex = $state(prefs.customAccentColor || '#6366F1');

	function applyCustomColor(hex: string) {
		if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
		customHex = hex;
		updatePreference('accentColor', 'custom');
		updatePreference('customAccentColor', hex);
	}
</script>

<div class="space-y-3">
	<div class="flex flex-wrap gap-3" data-testid="theme-picker">
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

	<!-- Custom color -->
	<div class="flex items-center gap-3 pt-2">
		<input
			type="color"
			value={prefs.accentColor === 'custom' ? customHex : '#6366F1'}
			oninput={(e) => applyCustomColor((e.target as HTMLInputElement).value)}
			class="h-9 w-9 cursor-pointer rounded-full border-0 bg-transparent p-0"
		/>
		<input
			type="text"
			value={prefs.accentColor === 'custom' ? customHex : ''}
			oninput={(e) => {
				const val = (e.target as HTMLInputElement).value;
				if (/^#[0-9a-fA-F]{6}$/.test(val)) applyCustomColor(val);
			}}
			placeholder="#6366F1"
			class="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)]"
		/>
		<span class="text-xs text-[var(--text-muted)]">Custom</span>
	</div>
</div>