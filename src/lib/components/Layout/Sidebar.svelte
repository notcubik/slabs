<script lang="ts">
	import { page } from '$app/state';
	import { allTags, selectedTag, currentFilter, loadNotes } from '$lib/stores/notes.js';
	import { StickyNote, Archive, Trash2, Tag, Pencil, Check, X, Plus, Bell } from 'lucide-svelte';

	interface Props {
		open: boolean;
		onClose?: () => void;
	}

	let { open, onClose }: Props = $props();

	let tagsWithId = $state<{ id: number; name: string }[]>([]);
	let editingTagId = $state<number | null>(null);
	let editName = $state('');
	let deleteConfirmId = $state<number | null>(null);
	let newTagName = $state('');
	let showTagInput = $state(false);

	function closeMobile() {
		if (window.matchMedia('(max-width: 1023px)').matches) {
			onClose?.();
		}
	}

	function toggleSidebarTag(tag: string) {
		selectedTag.update((current) => {
			if (current.includes(tag)) {
				return current.filter((t) => t !== tag);
			}
			return [...current, tag];
		});
	}

	async function loadTags() {
		const res = await fetch('/api/tags');
		if (res.ok) tagsWithId = await res.json();
	}

	async function renameTag(id: number) {
		if (!editName.trim()) return;
		const res = await fetch('/api/tags', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id,
				name: editName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '')
			})
		});
		if (res.ok) {
			editingTagId = null;
			await loadTags();
			await loadNotes();
		}
	}

	async function deleteTag(id: number) {
		const res = await fetch('/api/tags', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
		if (res.ok) {
			deleteConfirmId = null;
			selectedTag.update((current) => {
				const tag = tagsWithId.find(t => t.id === id);
				return tag ? current.filter(t => t !== tag.name) : current;
			});
			await loadTags();
			await loadNotes();
		}
	}

	async function createTag() {
		const name = newTagName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
		if (!name) return;
		const res = await fetch('/api/tags', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name })
		});
		if (res.ok) {
			newTagName = '';
			showTagInput = false;
			await loadTags();
		}
	}

	$effect(() => {
		if (open) loadTags();
	});

	const navItems = [
		{ href: '/', label: 'Notes', icon: StickyNote, match: (p: string) => p === '/' },
		{ href: '/reminders', label: 'Reminders', icon: Bell, match: (p: string) => p === '/reminders' },
		{ href: '/archive', label: 'Archive', icon: Archive, match: (p: string) => p === '/archive' },
		{ href: '/trash', label: 'Trash', icon: Trash2, match: (p: string) => p === '/trash' }
	];
</script>

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 top-14 z-10 bg-black/20 backdrop-blur-sm lg:hidden anim-fade-in"
		onclick={onClose}
		onkeydown={(e) => { if (e.key === 'Escape') onClose?.(); }}
	></div>
{/if}

<aside
	class="fixed left-0 top-14 z-20 h-[calc(100vh-3.5rem)] w-72 transform bg-[var(--bg-base)] transition-transform duration-200 ease-out {open ? 'translate-x-0' : '-translate-x-full'}"
>
	<nav class="flex h-full flex-col p-3">
		<ul class="space-y-0.5">
			{#each navItems as item}
				<li>
					<a
						href={item.href}
						onclick={closeMobile}
						class="sidebar-nav-item {item.match(page.url.pathname) ? 'active' : ''}"
					>
						<item.icon size={16} />
						{item.label}
					</a>
				</li>
			{/each}
		</ul>

		{#if $allTags.length > 0}
			<div class="mt-5 flex-1 overflow-y-auto">
				<div class="mb-2 flex items-center justify-between px-3">
					<h3 class="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">Tags</h3>
					<div class="flex items-center gap-1">
						{#if $selectedTag.length > 0}
							<button
								onclick={() => selectedTag.set([])}
								class="text-[10px] font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
							>
								Clear
							</button>
						{/if}
						<button
							onclick={() => { showTagInput = !showTagInput; }}
							class="rounded p-0.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-subtle)] transition-all duration-150"
							aria-label="Manage tags"
						>
							<Pencil size={12} />
						</button>
					</div>
				</div>

				{#if showTagInput}
					<div class="mb-2 px-3 anim-fade-in">
						<form
							onsubmit={(e) => { e.preventDefault(); createTag(); }}
							class="flex items-center gap-1"
						>
							<input
								type="text"
								bind:value={newTagName}
								placeholder="new-tag"
								class="flex-1 rounded-md border border-[var(--border)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors duration-150"
							/>
							<button
								type="submit"
								class="rounded-md p-1 text-[var(--primary)] hover:bg-[var(--primary-subtle)] transition-colors duration-150"
							>
								<Check size={12} />
							</button>
							<button
								type="button"
								onclick={() => { showTagInput = false; newTagName = ''; }}
								class="rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--bg-surface-alt)] transition-colors duration-150"
							>
								<X size={12} />
							</button>
						</form>
					</div>
				{/if}

				<ul class="space-y-0.5">
					{#each tagsWithId as tag (tag.id)}
						{#if editingTagId === tag.id}
							<li class="anim-fade-in">
								<div class="flex items-center gap-1 px-2">
									<input
										type="text"
										bind:value={editName}
										onkeydown={(e) => {
											if (e.key === 'Enter') renameTag(tag.id);
											if (e.key === 'Escape') editingTagId = null;
										}}
										class="flex-1 rounded-md border border-[var(--primary)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text)] outline-none"
									/>
									<button
										onclick={() => renameTag(tag.id)}
										class="rounded p-0.5 text-[var(--primary)] hover:bg-[var(--primary-subtle)]"
									>
										<Check size={12} />
									</button>
									<button
										onclick={() => editingTagId = null}
										class="rounded p-0.5 text-[var(--text-muted)] hover:bg-[var(--bg-surface-alt)]"
									>
										<X size={12} />
									</button>
								</div>
							</li>
						{:else}
							<li class="group/tag">
								<div class="flex items-center">
									<button
										onclick={() => { toggleSidebarTag(tag.name); closeMobile(); }}
										class="sidebar-nav-item flex-1 {$selectedTag.includes(tag.name) ? 'active' : ''}"
									>
										<Tag size={14} />
										<span class="truncate">{tag.name}</span>
									</button>
									<div class="mr-1 flex items-center gap-0.5 opacity-0 group-hover/tag:opacity-100 transition-opacity duration-150">
										{#if deleteConfirmId === tag.id}
											<button
												onclick={() => deleteTag(tag.id)}
												class="rounded p-0.5 text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
											>
												<Check size={11} />
											</button>
											<button
												onclick={() => deleteConfirmId = null}
												class="rounded p-0.5 text-[var(--text-muted)] hover:bg-[var(--bg-surface-alt)]"
											>
												<X size={11} />
											</button>
										{:else}
											<button
												onclick={() => { editingTagId = tag.id; editName = tag.name; }}
												class="rounded p-0.5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-surface-alt)]"
											>
												<Pencil size={11} />
											</button>
											<button
												onclick={() => deleteConfirmId = tag.id}
												class="rounded p-0.5 text-[var(--text-muted)] hover:text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
											>
												<Trash2 size={11} />
											</button>
										{/if}
									</div>
								</div>
							</li>
						{/if}
					{/each}
				</ul>
			</div>
		{:else}
			<div class="flex-1"></div>
		{/if}
	</nav>
</aside>
