<script lang="ts">
  export let data;
</script>

<!-- todo add description and page title from og site  -->
<svelte:head>
  <title>Airnote Quickstart Guide</title>
</svelte:head>

<h1>Airnote Quickstart Documentation</h1>

{#each data.docs as doc}
  <svelte:component this={doc.content} />
{/each}
