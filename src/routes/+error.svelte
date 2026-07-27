<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Error - slabs</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
	<div class="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center">
		<img src="/favicon.svg" alt="slabs" class="mx-auto h-12 w-12" />
		<h1 class="mt-4 font-display text-xl font-bold text-[var(--text)]">
			{page.status}
		</h1>
		<p class="mt-4 text-sm text-[var(--text-muted)]">
			{page.error?.message ?? 'Something went wrong'}
		</p>
		<a
			href="/"
			class="mt-6 inline-block rounded-lg bg-[var(--primary)] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
		>
			Back to notes
		</a>
	</div>
</div>
