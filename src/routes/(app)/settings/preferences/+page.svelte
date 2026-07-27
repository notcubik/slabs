<script lang="ts">
	import ColorPicker from '$lib/components/ColorPicker.svelte';
	import ThemePicker from '$lib/components/ThemePicker.svelte';
	import { getPreferences, updatePreference } from '$lib/stores/preferences.svelte.js';
	import type { NoteColor } from '$lib/types/index.js';

	const prefs = $derived(getPreferences());
</script>

<div class="space-y-8">
	<h2 class="font-display text-xl font-bold text-[var(--text)]">Preferences</h2>

	<!-- Theme -->
	<div class="space-y-3">
		<span class="block text-sm font-semibold text-[var(--text)]">Theme</span>
		<div class="flex gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1" role="group" aria-label="Theme">
			{#each [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']] as [value, label]}
				<button
					onclick={() => updatePreference('theme', value as 'system' | 'light' | 'dark')}
					class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors {prefs.theme === value ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}"
					data-testid="pref-theme-{value}"
				>
					{label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Color scheme -->
	<div class="space-y-3">
		<span class="block text-sm font-semibold text-[var(--text)]">Color scheme</span>
		<ThemePicker />
	</div>

	<!-- Default note mode -->
	<div class="space-y-3">
		<span class="block text-sm font-semibold text-[var(--text)]">Default note mode</span>
		<div class="flex gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1" role="group" aria-label="Default note mode">
			<button
				onclick={() => updatePreference('defaultNoteMode', 'richtext')}
				class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors {prefs.defaultNoteMode === 'richtext' ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}"
				data-testid="pref-mode-richtext"
			>
				Rich text
			</button>
			<button
				onclick={() => updatePreference('defaultNoteMode', 'markdown')}
				class="flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors {prefs.defaultNoteMode === 'markdown' ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}"
				data-testid="pref-mode-markdown"
			>
				Markdown
			</button>
		</div>
	</div>

	<!-- Default note color -->
	<div class="space-y-3">
		<span class="block text-sm font-semibold text-[var(--text)]">Default note color</span>
		<ColorPicker
			selected={prefs.defaultNoteColor}
			onSelect={(color: NoteColor) => updatePreference('defaultNoteColor', color)}
		/>
	</div>

	<!-- Toggles -->
	<div class="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
		<div class="flex items-center justify-between">
			<label for="hide-footer" class="text-sm text-[var(--text)]">Hide footer</label>
			<input
				type="checkbox"
				id="hide-footer"
				checked={prefs.hideFooter}
				onchange={() => updatePreference('hideFooter', !prefs.hideFooter)}
				class="h-4 w-4 rounded-lg"
				data-testid="pref-hide-footer"
			/>
		</div>
		<div class="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
			<label for="sidebar-default" class="text-sm text-[var(--text)]">Start with sidebar collapsed</label>
			<input
				type="checkbox"
				id="sidebar-default"
				checked={prefs.sidebarDefaultState === 'collapsed'}
				onchange={() => updatePreference('sidebarDefaultState', prefs.sidebarDefaultState === 'collapsed' ? 'open' : 'collapsed')}
				class="h-4 w-4 rounded-lg"
				data-testid="pref-sidebar-default"
			/>
		</div>
	</div>

	<!-- Email notifications -->
	<div class="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
		<span class="block text-sm font-semibold text-[var(--text)]">Email notifications</span>
		<div class="flex items-center justify-between">
			<label for="notify-on-share" class="text-sm text-[var(--text)]">Note shared with me</label>
			<input
				type="checkbox"
				id="notify-on-share"
				checked={prefs.notifyOnShare}
				onchange={() => updatePreference('notifyOnShare', !prefs.notifyOnShare)}
				class="h-4 w-4 rounded-lg"
				data-testid="pref-notify-on-share"
			/>
		</div>
		<div class="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
			<label for="notify-on-collab-removed" class="text-sm text-[var(--text)]">Removed from shared note</label>
			<input
				type="checkbox"
				id="notify-on-collab-removed"
				checked={prefs.notifyOnCollabRemoved}
				onchange={() => updatePreference('notifyOnCollabRemoved', !prefs.notifyOnCollabRemoved)}
				class="h-4 w-4 rounded-lg"
				data-testid="pref-notify-on-collab-removed"
			/>
		</div>
		<div class="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
			<label for="notify-on-note-deleted" class="text-sm text-[var(--text)]">Shared note deleted</label>
			<input
				type="checkbox"
				id="notify-on-note-deleted"
				checked={prefs.notifyOnNoteDeleted}
				onchange={() => updatePreference('notifyOnNoteDeleted', !prefs.notifyOnNoteDeleted)}
				class="h-4 w-4 rounded-lg"
				data-testid="pref-notify-on-note-deleted"
			/>
		</div>
	</div>
</div>
