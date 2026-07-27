<script lang="ts">
	import SearchBar from '../SearchBar.svelte';
	import SyncIndicator from '../SyncIndicator.svelte';
	import Menu from 'lucide-svelte/icons/menu';
	import Search from 'lucide-svelte/icons/search';

	interface Props {
		onMenuToggle: () => void;
	}

	let { onMenuToggle }: Props = $props();
	let mobileSearchOpen = $state(false);
</script>

<header class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-[var(--border)] bg-[var(--header-bg)] backdrop-blur-md px-4">
	{#if mobileSearchOpen}
		<div class="flex flex-1 items-center gap-2 lg:hidden">
			<SearchBar onClose={() => (mobileSearchOpen = false)} />
		</div>
	{:else}
		<button
			onclick={onMenuToggle}
			class="rounded-lg p-1.5 hover:bg-[var(--bg-surface-alt)] transition-colors"
			aria-label="Toggle sidebar"
		>
			<Menu class="h-5 w-5 text-[var(--text-muted)]" />
		</button>

		<div class="flex items-center gap-2.5">
			<img src="/favicon.svg" alt="" class="h-7 w-7" />
			<h1 class="font-display text-lg font-semibold tracking-tight text-[var(--text)]">slabs</h1>
		</div>

		<div class="mx-4 hidden flex-1 lg:block">
			<SearchBar />
		</div>

		<button
			onclick={() => (mobileSearchOpen = true)}
			class="ml-auto rounded-lg p-1.5 hover:bg-[var(--bg-surface-alt)] transition-colors lg:hidden"
			aria-label="Search"
		>
			<Search class="h-5 w-5 text-[var(--text-muted)]" />
		</button>

		<div class="flex items-center gap-2">
			<SyncIndicator />
		</div>
	{/if}
</header>
