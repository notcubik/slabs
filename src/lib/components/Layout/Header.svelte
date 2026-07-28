<script lang="ts">
	import SearchBar from '../SearchBar.svelte';
	import SyncIndicator from '../SyncIndicator.svelte';
	import Search from 'lucide-svelte/icons/search';
	import Settings from 'lucide-svelte/icons/settings';
	import { page } from '$app/state';

	interface Props {
		onMenuToggle: () => void;
		user?: { id?: number; displayName?: string | null; email?: string; role?: string; avatar?: string | null } | null;
	}

	let { onMenuToggle, user = null }: Props = $props();
	let mobileSearchOpen = $state(false);

	const userInitials = $derived(() => {
		if (!user) return '?';
		const name = user.displayName || user.email || '';
		const parts = name.split(/[\s@]/).filter(Boolean);
		return parts.length >= 2
			? (parts[0][0] + parts[1][0]).toUpperCase()
			: name.slice(0, 2).toUpperCase();
	});
</script>

<header class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-[var(--border-subtle)] bg-[var(--header-bg)] backdrop-blur-md px-4">
	{#if mobileSearchOpen}
		<div class="flex flex-1 items-center gap-2 lg:hidden">
			<SearchBar onClose={() => (mobileSearchOpen = false)} />
		</div>
	{:else}
		<a
			href="/"
			class="flex items-center gap-2 transition-opacity duration-150 hover:opacity-80"
			onclick={(e) => { e.preventDefault(); onMenuToggle(); }}
		>
			<img src="/favicon.svg" alt="" class="h-7 w-7 shrink-0" />
			<h1 class="text-lg font-bold tracking-tight text-[var(--text)]" style="font-family: 'Sora', system-ui, sans-serif;">slabs</h1>
		</a>

		<div class="mx-4 hidden flex-1 lg:block">
			<SearchBar />
		</div>

		<button
			onclick={() => (mobileSearchOpen = true)}
			class="ml-auto rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--primary-subtle)] hover:text-[var(--text)] transition-all duration-150 active:scale-95 lg:hidden"
			aria-label="Search"
		>
			<Search class="h-5 w-5" />
		</button>

		<div class="flex items-center gap-1">
			<SyncIndicator />
			<a
				href="/settings"
				class="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--primary-subtle)] hover:text-[var(--text)] transition-all duration-150 active:scale-95"
				aria-label="Settings"
			>
				<Settings class="h-5 w-5" />
			</a>
		{#if user}
			<a
				href="/settings/profile"
				class="ml-1 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[var(--primary-subtle)] text-xs font-semibold text-[var(--primary)] transition-all duration-150 hover:shadow-md active:scale-95"
				aria-label="Profile"
			>
				{#if user.avatar}
					<img src="/api/user/avatar?userId={user.id}" alt="" class="h-full w-full object-cover" />
				{:else}
					{userInitials()}
				{/if}
			</a>
		{/if}
		</div>
	{/if}
</header>
