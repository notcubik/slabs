<script lang="ts">
	import X from 'lucide-svelte/icons/x';
	import Lock from 'lucide-svelte/icons/lock';
	import { tooltip } from '$lib/utils/tooltip.js';

	interface Props {
		title?: string;
		description?: string;
		submitLabel?: string;
		onSubmit: (password: string) => Promise<void> | void;
		onClose: () => void;
	}

	let {
		title = 'Enter password',
		description = 'This note is hidden. Enter the password to access it.',
		submitLabel = 'Unlock',
		onSubmit,
		onClose
	}: Props = $props();

	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}

	async function handleSubmit() {
		if (!password.trim()) {
			error = 'Password is required';
			return;
		}
		loading = true;
		error = '';
		try {
			await onSubmit(password);
		} catch {
			error = 'Incorrect password';
		} finally {
			loading = false;
		}
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 pt-20 pb-10 animate-[fade-in_150ms_ease-out]"
	onclick={onClose}
	onkeydown={handleKeydown}
	data-testid="password-modal-overlay"
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="mx-4 w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] shadow-[var(--card-shadow)] animate-[pop-in_150ms_ease-out]"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		data-testid="password-modal"
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
			<div class="flex items-center gap-2">
				<Lock class="h-4 w-4 text-[var(--text-muted)]" />
				<h2 class="text-sm font-semibold text-[var(--text)]">{title}</h2>
			</div>
			<button
				onclick={onClose}
				class="rounded-lg p-1 hover:bg-[var(--border)]/10"
				title="Close"
			>
				<X class="h-4 w-4" />
			</button>
		</div>

		<!-- Body -->
		<div class="px-4 py-4">
			{#if description}
				<p class="mb-3 text-sm text-[var(--text-muted)]">{description}</p>
			{/if}

			<form
				onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}
				class="space-y-3"
			>
				<div>
					<input
						type="password"
						placeholder="Password"
						bind:value={password}
						class="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]"
						data-testid="password-input"
						autofocus
					/>
					{#if error}
						<p class="mt-1 text-xs text-[var(--destructive)]" data-testid="password-error">{error}</p>
					{/if}
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-50"
					data-testid="password-submit-btn"
				>
					{loading ? 'Verifying...' : submitLabel}
				</button>
			</form>
		</div>
	</div>
</div>
