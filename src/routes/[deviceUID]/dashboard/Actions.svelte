<script lang="ts">
  import DownloadIcon from '$lib/icons/DownloadIcon.svelte';
  import PrintIcon from '$lib/icons/PrintIcon.svelte';
  import ShareIcon from '$lib/icons/ShareIcon.svelte';
  import { shareDashboard } from '$lib/util/share';

  export let deviceUID: string;
  export let isIndoor: boolean = false;
</script>

<div class="actions">
  {#if isIndoor}
    <div
      class="indoor-badge"
      title="This device is marked as an indoor device. You can change this designation in the device's settings."
    >
      Indoor Device
    </div>
  {/if}
  <div class="action-buttons">
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
</div>

<style>
  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .indoor-badge {
    background: var(--bannerBlue);
    color: var(--notehubBlue);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
  }
  .action-buttons {
    display: flex;
    gap: 1.5rem;
    margin-left: auto;
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
