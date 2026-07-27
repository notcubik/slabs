<script lang="ts">
	import { page } from '$app/state';
	import { User, Cpu, ShieldCheck, SlidersHorizontal, Info, Tag } from 'lucide-svelte';

	let { data, children } = $props();
	let pathname = $derived(page.url.pathname);

	const tabs = [
		{ href: '/settings/preferences', label: 'Preferences', icon: SlidersHorizontal, testid: 'settings-nav-preferences' },
		{ href: '/settings/profile', label: 'Profile', icon: User, testid: '' },
		{ href: '/settings/mcp', label: 'API', icon: Cpu, testid: '' },
		{ href: '/settings/tags', label: 'Tags', icon: Tag, testid: '' },
	];
	const adminTabs = [
		{ href: '/settings/users', label: 'Users', icon: ShieldCheck, testid: '' },
	];
	const bottomTabs = [
		{ href: '/settings/about', label: 'About', icon: Info, testid: '' },
	];
</script>

<svelte:head>
	<title>Settings - slabs</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8 anim-fade-in">
	<h1 class="mb-6 font-display text-2xl font-bold text-[var(--text)]">Settings</h1>

	<div class="flex flex-col gap-6 md:flex-row">
		<nav class="w-full shrink-0 md:w-48">
			<ul class="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
				{#each tabs as tab}
					<li>
						<a
							href={tab.href}
							class="sidebar-nav-item {pathname === tab.href ? 'active' : ''}"
							data-testid={tab.testid || undefined}
						>
							<tab.icon size={16} />
							{tab.label}
						</a>
					</li>
				{/each}
				{#if data.user?.role === 'admin'}
					{#each adminTabs as tab}
						<li>
							<a href={tab.href} class="sidebar-nav-item {pathname === tab.href ? 'active' : ''}">
								<tab.icon size={16} />
								{tab.label}
							</a>
						</li>
					{/each}
				{/if}
				{#each bottomTabs as tab}
					<li>
						<a href={tab.href} class="sidebar-nav-item {pathname === tab.href ? 'active' : ''}">
							<tab.icon size={16} />
							{tab.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="min-w-0 flex-1">
			{@render children()}
		</div>
	</div>
</div>
