<script lang="ts">
	let { children } = $props();
</script>

<div class="relative flex min-h-screen items-center justify-center bg-[var(--bg-base)] text-[var(--text)] overflow-hidden">
	<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary-subtle),_transparent_70%)] pointer-events-none"></div>
	<div class="relative z-10">
		{@render children()}
	</div>
</div>
