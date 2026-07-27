<script lang="ts">
	import { Pencil, Trash2, Check, X } from 'lucide-svelte';

	let tags = $state<{ id: number; name: string }[]>([]);
	let editingId = $state<number | null>(null);
	let editName = $state('');
	let deleteConfirmId = $state<number | null>(null);

	async function loadTags() {
		const res = await fetch('/api/tags');
		if (res.ok) tags = await res.json();
	}

	async function renameTag(id: number) {
		if (!editName.trim()) return;
		await fetch('/api/tags', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id,
				name: editName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '')
			})
		});
		editingId = null;
		await loadTags();
	}

	async function deleteTag(id: number) {
		await fetch('/api/tags', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
		deleteConfirmId = null;
		await loadTags();
	}

	$effect(() => {
		loadTags();
	});
</script>

<svelte:head><title>Manage Tags - slabs</title></svelte:head>

<div class="max-w-2xl">
	<h1 class="mb-6 text-2xl font-bold text-[var(--text)]">Manage Tags</h1>

	{#if tags.length === 0}
		<p class="text-sm text-[var(--text-muted)]">
			No tags yet. Tags are created automatically when you add #hashtags to your notes.
		</p>
	{:else}
		<div class="space-y-2">
			{#each tags as tag (tag.id)}
				<div
					class="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3"
				>
					{#if editingId === tag.id}
						<input
							type="text"
							bind:value={editName}
							onkeydown={(e) => {
								if (e.key === 'Enter') renameTag(tag.id);
								if (e.key === 'Escape') editingId = null;
							}}
							class="flex-1 rounded-lg border border-[var(--primary)] bg-[var(--bg-base)] px-2 py-1 text-sm text-[var(--text)] outline-none"
							data-testid="tag-rename-input"
						/>
						<button
							onclick={() => renameTag(tag.id)}
							class="p-1.5 rounded-lg text-[var(--primary)] hover:bg-[var(--border)]/10"><Check
								size={16}
							/></button
						>
						<button
							onclick={() => (editingId = null)}
							class="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--border)]/10"><X
								size={16}
							/></button
						>
					{:else}
						<span class="flex-1 text-sm font-medium text-[var(--text)]">#{tag.name}</span>
						<button
							onclick={() => {
								editingId = tag.id;
								editName = tag.name;
							}}
							class="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--border)]/10"
							data-testid="rename-tag-btn"><Pencil size={14} /></button
						>
						{#if deleteConfirmId === tag.id}
							<button
								onclick={() => deleteTag(tag.id)}
								class="px-3 py-1 rounded-lg text-xs text-white bg-[var(--destructive)] hover:opacity-80"
								>Delete</button
							>
							<button
								onclick={() => (deleteConfirmId = null)}
								class="px-3 py-1 text-xs rounded-lg border border-[var(--border-subtle)] hover:border-[var(--primary)]"
								>Cancel</button
							>
						{:else}
							<button
								onclick={() => (deleteConfirmId = tag.id)}
								class="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--destructive)] hover:bg-[var(--border)]/10"
								data-testid="delete-tag-btn"><Trash2 size={14} /></button
							>
						{/if}
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
