<script lang="ts">
	import { goto } from '$app/navigation';

	let email = $state('');
	let displayName = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let errorMsg = $state('');
	let loading = $state(false);

	async function handleSetup(e: Event) {
		e.preventDefault();
		errorMsg = '';

		if (!email) {
			errorMsg = 'Email is required';
			return;
		}

		if (password.length < 8) {
			errorMsg = 'Password must be at least 8 characters';
			return;
		}

		if (password !== confirmPassword) {
			errorMsg = 'Passwords do not match';
			return;
		}

		loading = true;

		try {
			const res = await fetch('/api/auth/setup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, displayName, password })
			});

			if (res.ok) {
				goto('/');
			} else {
				const data = await res.json();
				errorMsg = data.message || 'Setup failed';
			}
		} catch {
			errorMsg = 'Connection error';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Setup - slabs</title>
</svelte:head>

<div class="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-[var(--card-shadow)] anim-pop-in">
	<div class="mb-6 text-center">
		<div class="relative mx-auto mb-3 h-12 w-12">
			<div class="absolute inset-0 rounded-full bg-[var(--primary)] opacity-10 blur-md"></div>
			<img src="/favicon.svg" alt="slabs" class="relative mx-auto h-12 w-12" />
		</div>
		<h1 class="font-display text-xl font-bold text-[var(--text)]">Welcome to slabs</h1>
		<p class="mt-2 text-sm text-[var(--text-muted)]">Create your admin account to get started</p>
	</div>

	<form onsubmit={handleSetup}>
		{#if errorMsg}
			<div class="mb-4 rounded-lg border border-[var(--error-border)] bg-[var(--error-bg)] p-3 text-sm text-[var(--error-text)] anim-fade-in" data-testid="error-message">
				{errorMsg}
			</div>
		{/if}

		<input
			type="email"
			bind:value={email}
			placeholder="Email"
			class="mb-3 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-150"
			data-testid="email-input"
			required
		/>

		<input
			type="text"
			bind:value={displayName}
			placeholder="Display name (optional)"
			class="mb-3 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-150"
			data-testid="display-name-input"
		/>

		<input
			type="password"
			bind:value={password}
			placeholder="Password (min 8 characters)"
			class="mb-3 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-150"
			data-testid="password-input"
			required
			/>

		<input
			type="password"
			bind:value={confirmPassword}
			placeholder="Confirm password"
			class="mb-4 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-150"
			data-testid="confirm-password-input"
			required
			/>

		<button
			type="submit"
			disabled={loading}
			class="w-full rounded-lg bg-[var(--primary)] py-3 text-sm font-medium text-white transition-all duration-150 hover:bg-[var(--primary-hover)] hover:shadow-lg hover:shadow-[var(--primary)]/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
			data-testid="setup-btn"
		>
			{loading ? 'Setting up...' : 'Create account & start'}
		</button>
	</form>
</div>
