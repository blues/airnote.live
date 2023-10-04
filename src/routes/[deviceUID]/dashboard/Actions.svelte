<script lang="ts">
  import { unparse } from 'papaparse';
  import DownloadIcon from '$lib/icons/DownloadIcon.svelte';
  import PrintIcon from '$lib/icons/PrintIcon.svelte';
  import ShareIcon from '$lib/icons/ShareIcon.svelte';
  import type { AirnoteReading } from '$lib/services/AirReadingModel';
  import { shareDashboard } from '$lib/util/share';

  export let data: AirnoteReading[];
  export let deviceUID: string;

  const downloadData = () => {
    const csv = 'data:text/csv;charset=utf-8,' + unparse(data);
    const encodedURI = encodeURI(csv);

    var link = document.createElement('a');
    link.setAttribute('href', encodedURI);
    link.setAttribute('download', 'airnote.csv');
    link.click();
  };
</script>

<div class="actions">
  <button on:click={downloadData}>
    <DownloadIcon />
    <span>Download</span>
  </button>

  <button on:click={() => window.print()}>
    <PrintIcon />
    <span>Print</span>
  </button>

  <button on:click={() => shareDashboard(deviceUID)}>
    <ShareIcon />
    <span>Share</span>
  </button>
</div>

<style>
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1.5rem;
  }
  .actions button {
    background: transparent;
    color: var(--gray1);
    font-size: 0.75em;
    padding: 0;
  }
  .actions button:hover {
    color: var(--gray4);
  }
  .actions span {
    padding-top: 6px;
    display: block;
  }
</style>
