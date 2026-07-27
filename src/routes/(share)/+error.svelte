<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Not Found - slabs</title>
</svelte:head>

<div class="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center">
	<img src="/favicon.svg" alt="slabs" class="mx-auto h-12 w-12" />
	<h1 class="mt-4 font-display text-xl font-bold text-[var(--text)]">
		{page.status}
	</h1>
	<p class="mt-4 text-sm text-[var(--text-muted)]">
		{page.error?.message ?? 'This shared note does not exist or has been removed.'}
	</p>
</div>
