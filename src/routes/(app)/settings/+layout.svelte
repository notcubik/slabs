<script lang="ts">
	import { page } from '$app/state';
	import { User, Cpu, ShieldCheck, SlidersHorizontal, Info, Tag } from 'lucide-svelte';

	let { data, children } = $props();
	let pathname = $derived(page.url.pathname);
</script>

<svelte:head>
	<title>Settings - Slabs</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-6 font-display text-2xl font-bold text-[var(--text)]">Settings</h1>

	<div class="flex flex-col gap-6 md:flex-row">
		<nav class="w-full shrink-0 md:w-48">
			<ul class="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
				<li>
					<a
						href="/settings/preferences"
						class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors {pathname === '/settings/preferences' ? 'bg-[var(--primary-muted)] text-[var(--primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--text)]'}"
						data-testid="settings-nav-preferences"
					>
						<SlidersHorizontal size={16} />
						Preferences
					</a>
				</li>
				<li>
					<a
						href="/settings/profile"
						class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors {pathname === '/settings/profile' ? 'bg-[var(--primary-muted)] text-[var(--primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--text)]'}"
					>
						<User size={16} />
						Profile
					</a>
				</li>
				<li>
					<a
						href="/settings/mcp"
						class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors {pathname === '/settings/mcp' ? 'bg-[var(--primary-muted)] text-[var(--primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--text)]'}"
					>
						<Cpu size={16} />
						API
					</a>
				</li>
				<li>
					<a
						href="/settings/tags"
						class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors {pathname === '/settings/tags' ? 'bg-[var(--primary-muted)] text-[var(--primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--text)]'}"
					>
						<Tag size={16} />
						Tags
					</a>
				</li>
			{#if data.user?.role === 'admin'}
				<li>
					<a
						href="/settings/users"
						class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors {pathname === '/settings/users' ? 'bg-[var(--primary-muted)] text-[var(--primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--text)]'}"
					>
						<ShieldCheck size={16} />
						Users
					</a>
				</li>
			{/if}
			<li>
				<a
					href="/settings/about"
					class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors {pathname === '/settings/about' ? 'bg-[var(--primary-muted)] text-[var(--primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--text)]'}"
				>
					<Info size={16} />
					About
				</a>
			</li>
			</ul>
		</nav>

		<div class="min-w-0 flex-1">
			{@render children()}
		</div>
	</div>
</div>
