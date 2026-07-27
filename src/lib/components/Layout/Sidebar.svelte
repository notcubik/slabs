<script lang="ts">
	import { page } from '$app/state';
	import { allTags, selectedTag, currentFilter } from '$lib/stores/notes.js';
	import { StickyNote, Archive, Trash2, Tag, Settings } from 'lucide-svelte';

	interface Props {
		open: boolean;
		onClose?: () => void;
	}

	let { open, onClose }: Props = $props();

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

	const navItems = [
		{ href: '/', label: 'All Notes', icon: StickyNote, match: (p: string) => p === '/' },
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
	class="fixed left-0 top-14 z-20 h-[calc(100vh-3.5rem)] w-60 transform bg-[var(--sidebar-bg)] transition-transform duration-200 ease-out {open ? 'translate-x-0' : '-translate-x-full'}"
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
					{#if $selectedTag.length > 0}
						<button
							onclick={() => selectedTag.set([])}
							class="text-[10px] font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
						>
							Clear
						</button>
					{/if}
				</div>
				<ul class="space-y-0.5">
					{#each $allTags as tag}
						<li>
							<button
								onclick={() => { toggleSidebarTag(tag); closeMobile(); }}
								class="sidebar-nav-item {$selectedTag.includes(tag) ? 'active' : ''}"
							>
								<Tag size={14} />
								<span class="truncate">{tag}</span>
							</button>
						</li>
					{/each}
				</ul>
			</div>
		{:else}
			<div class="flex-1"></div>
		{/if}

		<div class="pt-2">
			<a
				href="/settings"
				class="sidebar-nav-item {page.url.pathname.startsWith('/settings') ? 'active' : ''}"
				onclick={closeMobile}
				data-testid="settings-link"
			>
				<Settings size={16} />
				Settings
			</a>
		</div>
	</nav>
</aside>
