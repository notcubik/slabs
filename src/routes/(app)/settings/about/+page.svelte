<script lang="ts">
	import { page } from '$app/stores';

	let appVersion = $derived($page.data.appVersion);
</script>

<div class="space-y-8">
	<div class="flex items-center gap-3">
		<h2 class="font-display text-xl font-bold text-[var(--text)]">About Slabs</h2>
		<span
			class="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-alt)] px-2 py-0.5 text-xs font-medium text-[var(--text-muted)]"
		>
			v{appVersion}
		</span>
	</div>

	<section
		class="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--card-shadow)]"
	>
		<h3 class="font-display text-sm font-bold text-[var(--text)]">What is Slabs?</h3>
		<p class="text-sm leading-relaxed text-[var(--text-muted)]">
			A self-hostable, offline-first note-taking app. Your notes, your server, your rules.
			Built with care for speed, privacy, and simplicity.
		</p>
	</section>

	<section
		class="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--card-shadow)]"
	>
		<h3 class="font-display text-sm font-bold text-[var(--text)]">Open Source</h3>
		<p class="text-sm leading-relaxed text-[var(--text-muted)]">
			Slabs is licensed under the MIT License. Source code is available on
			<a
				href="https://github.com/notcubik/slabs"
				target="_blank"
				rel="noopener noreferrer"
				class="text-[var(--primary)] underline-offset-2 hover:underline">GitHub</a
			>.
		</p>
	</section>

	<section
		class="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--card-shadow)]"
	>
		<h3 class="font-display text-sm font-bold text-[var(--text)]">Feedback</h3>
		<p class="text-sm leading-relaxed text-[var(--text-muted)]">
			Found a bug or have a feature request? Open an issue on
			<a
				href="https://github.com/notcubik/slabs/issues"
				target="_blank"
				rel="noopener noreferrer"
				class="text-[var(--primary)] underline-offset-2 hover:underline">GitHub Issues</a
			>.
		</p>
	</section>

	<section
		class="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-[var(--card-shadow)]"
	>
		<h3 class="font-display text-sm font-bold text-[var(--text)]">Tech Stack</h3>
		<p class="text-sm leading-relaxed text-[var(--text-muted)]">
			SvelteKit, SQLite, Drizzle ORM. Offline-first PWA with CRDT-based sync.
		</p>
	</section>
</div>
