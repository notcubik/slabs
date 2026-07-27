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

<header class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-[var(--border-subtle)] bg-[var(--header-bg)] backdrop-blur-md px-4">
	{#if mobileSearchOpen}
		<div class="flex flex-1 items-center gap-2 lg:hidden">
			<SearchBar onClose={() => (mobileSearchOpen = false)} />
		</div>
	{:else}
		<button
			onclick={onMenuToggle}
			class="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--primary-subtle)] hover:text-[var(--text)] transition-all duration-150 active:scale-95"
			aria-label="Toggle sidebar"
		>
			<Menu class="h-5 w-5" />
		</button>

		<a href="/" class="flex items-center gap-2 transition-opacity duration-150 hover:opacity-80">
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

		<div class="flex items-center gap-2">
			<SyncIndicator />
		</div>
	{/if}
</header>
