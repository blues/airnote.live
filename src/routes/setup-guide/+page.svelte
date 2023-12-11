<script lang="ts">
  export let data;
</script>

<svelte:head>
  <title>Airnote Quickstart Guide</title>
</svelte:head>

{#each data.docs as doc}
  <svelte:component this={doc.content} />
{/each}
