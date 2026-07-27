<script lang="ts">
	import NotesView from '$lib/components/NotesView.svelte';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>#{page.params.name} - slabs</title>
</svelte:head>

<NotesView filter="all" tag={page.params.name} />
