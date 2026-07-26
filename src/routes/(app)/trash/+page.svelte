<script lang="ts">
	import NotesView from '$lib/components/NotesView.svelte';
</script>

<svelte:head>
	<title>Trash - Slabs</title>
</svelte:head>

<NotesView filter="trashed" />
