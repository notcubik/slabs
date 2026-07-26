<script lang="ts">
	import NotesView from '$lib/components/NotesView.svelte';
</script>

<svelte:head>
	<title>Archive - Slabs</title>
</svelte:head>

<NotesView filter="archived" />
