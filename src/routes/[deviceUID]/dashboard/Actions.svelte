<script lang="ts">
  import DownloadIcon from '$lib/icons/DownloadIcon.svelte';
  import PrintIcon from '$lib/icons/PrintIcon.svelte';
  import ShareIcon from '$lib/icons/ShareIcon.svelte';
  import { shareDashboard } from '$lib/util/share';

  export let deviceUID: string;
</script>

<div class="actions">
  <a rel="external" href={`/api/download?deviceUID=${deviceUID}`}>
    <button>
      <DownloadIcon />
      <span>Download</span>
    </button>
  </a>

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
    color: var(--notehubBlue);
    font-size: 0.75rem;
    padding: 0;
  }
  .actions button:hover {
    color: var(--notehubBlueTintLighter);
  }
  .actions span {
    padding-top: 6px;
    display: block;
  }
</style>
