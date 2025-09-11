<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { enhance } from '$app/forms';
  import { routingUrl } from '$lib/stores/settingsStore';
  import type { PotentiallyNullDeviceDetails } from '$lib/services/DeviceModel';

  export let enableFields: boolean;
  export let pin: PotentiallyNullDeviceDetails = '';

  const dispatch = createEventDispatcher();

  let formResponse: string;
  $: if (formResponse === 'success') {
    dispatch('settingsSaved');
    formResponse = '';
  } else if (formResponse === 'failure') {
    dispatch('settingsError');
    formResponse = '';
  }
</script>

<h4 data-cy="device-advanced-title">Advanced</h4>

<form
  method="POST"
  use:enhance={() => {
    return async ({ result }) => {
      formResponse = result.type;
    };
  }}
  action="?&pin={pin}&/saveSettings"
>
  <div>
    <label for="routingUrl">Routing URL</label>
    <input
      disabled={!enableFields}
      type="url"
      name="routingUrl"
      bind:value={$routingUrl}
      id="routingUrl"
      placeholder="https://your-server.com/webhook"
    />
    <p class="help-text">
      When set, Notehub forwards all incoming data from your Airnote to the
      specified URL as a POST request, with the data included in the request
      body.
    </p>
  </div>

  {#if enableFields}
    <div class="form-buttons">
      <button>Update Advanced Settings</button>
    </div>
  {/if}
</form>

<style>
  h4 {
    text-align: center;
  }
  .form-buttons {
    text-align: center;
  }
  .help-text {
    font-size: 0.9em;
    color: var(--grey);
    margin-top: 0;
    margin-bottom: 1rem;
  }
</style>
