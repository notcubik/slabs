<script lang="ts">
	import { updatePreference, getPreferences } from '$lib/stores/preferences.svelte.js';

	const prefs = getPreferences();

	const themes = [
		{ id: 'slates' as const, label: 'Slate', colors: ['#E4E4E7', '#6366F1', '#F7F7F8'] },
		{ id: 'amber' as const, label: 'Amber', colors: ['#FDE68A', '#D97706', '#FFFBEB'] },
		{ id: 'emerald' as const, label: 'Emerald', colors: ['#A7F3D0', '#059669', '#ECFDF5'] },
		{ id: 'ocean' as const, label: 'Ocean', colors: ['#A5F3FC', '#0891B2', '#ECFEFF'] },
		{ id: 'rose' as const, label: 'Rose', colors: ['#FECDD3', '#E11D48', '#FFF1F2'] },
		{ id: 'midnight' as const, label: 'Midnight', colors: ['#2A2640', '#A78BFA', '#151321'] },
		{ id: 'forest' as const, label: 'Forest', colors: ['#BBF7D0', '#16A34A', '#F0FDF4'] }
	];
</script>

<div class="grid grid-cols-7 gap-3" data-testid="theme-picker">
	{#each themes as theme}
		<button
			onclick={() => updatePreference('colorScheme', theme.id)}
			class="group flex flex-col items-center gap-1.5"
			title={theme.label}
			data-testid="theme-{theme.id}"
		>
			<div
				class="relative h-10 w-full rounded-xl transition-all {prefs.colorScheme === theme.id ? 'ring-2 ring-offset-2 ring-[var(--text)] scale-105' : 'hover:scale-105'}"
			>
				<div class="absolute inset-0 rounded-xl overflow-hidden flex">
					<div class="w-1/3 h-full" style="background-color: {theme.colors[0]}"></div>
					<div class="w-1/3 h-full" style="background-color: {theme.colors[1]}"></div>
					<div class="w-1/3 h-full" style="background-color: {theme.colors[2]}"></div>
				</div>
			</div>
			<span class="text-[10px] font-medium text-[var(--text-muted)]">{theme.label}</span>
		</button>
	{/each}
</div>
