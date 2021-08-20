<script>
  import { createEventDispatcher } from 'svelte';
  import {
    contactName,
    contactEmail,
    contactAffiliation
  } from '../settingsStore';

  const dispatch = createEventDispatcher();

  export let enableFields;

  const save = () => dispatch('submit');
</script>

<h4>Device Owner Info</h4>

<form>
  <div>
    <label for="ownerName">Name</label>
    <input
      disabled={enableFields ? null : 'disabled'}
      type="text"
      name="ownerName"
      bind:value={$contactName}
      id="ownerName"
      placeholder="Ada Lovelace" />
  </div>
  <div>
    <label for="companyName">Affiliation</label>
    <input
      disabled={enableFields ? null : 'disabled'}
      type="text"
      name="companyName"
      bind:value={$contactAffiliation}
      id="companyName"
      placeholder="Blues Inc." />
  </div>
  <div>
    <label for="ownerEmail">Contact Email</label>
    <input
      disabled={enableFields ? null : 'disabled'}
      type="email"
      name="ownerEmail"
      bind:value={$contactEmail}
      id="ownerEmail"
      placeholder="ada@blues.com" />
  </div>
</form>

{#if enableFields}
  <div>
    <button on:click={save}>Update Device Owner</button>
  </div>
{/if}