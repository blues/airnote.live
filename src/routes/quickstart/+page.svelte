<script lang="ts">
  export let data;
</script>

<svelte:head>
  <title>Airnote Quickstart</title>
</svelte:head>

<svelte:component this={data.content} />
