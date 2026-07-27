<script lang="ts">
	interface Props {
		tag: string;
		active?: boolean;
		onclick?: () => void;
	}

	let { tag, active = false, onclick }: Props = $props();
</script>

{#if onclick}
	<button
		{onclick}
		class="whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium transition-all duration-150 {active
			? 'bg-[var(--primary)] text-white shadow-sm shadow-[var(--primary)]/20'
			: 'bg-[var(--bg-surface-alt)] text-[var(--text-muted)] hover:bg-[var(--primary-muted)] hover:text-[var(--primary)] active:scale-95'}"
		data-testid="tag-chip"
	>
		{tag}
	</button>
{:else}
	<span
		class="rounded-md bg-[var(--bg-surface-alt)] px-2 py-0.5 text-xs font-medium text-[var(--text-muted)]"
		data-testid="tag-chip"
	>
		{tag}
	</span>
{/if}
