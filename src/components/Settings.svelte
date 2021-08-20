<script>
  import { createEventDispatcher } from 'svelte';
  import Slider from './Slider.svelte';
  import {
    deviceName,
    displayValue,
    indoorDevice
  } from '../settingsStore';

  const dispatch = createEventDispatcher();

  export let enableFields;
  export let displayOptions;

  const save = () => dispatch('submit');
</script>

<h4>Device Settings</h4>

<form>
  <div>
    <label for="deviceName">Device name</label>
    <input
      disabled={enableFields ? null : 'disabled'}
      type="text"
      name="name"
      id="deviceName"
      bind:value={$deviceName}
      placeholder="my-airnote-name" />
  </div>

  <div>
    <label for="displayValue">
      Airnote screen display value
    </label>
    <select disabled={!enableFields ? 'disabled' : ''}
      bind:value={$displayValue}
      name="display" id="displayValue">
      {#each displayOptions as option}
        <option value="{option["value"]}">{option["text"]}</option>
      {/each}
    </select>
  </div>

  <div>
    <label for="sampleFrequency">Sample frequency (minutes)</label>
    <Slider enableFields={enableFields} />
  </div>

  <div>
    <label class="checkbox-label">
      <input
        disabled={!enableFields ? 'disabled' : ''}
        bind:checked={$indoorDevice}
        type="checkbox" name="indoor" id="indoorDevice"
      />
      <span>
        Indoor device (Will not be visible on the
        Safecast global map)
      </span>
    </label>
  </div>
</form>

{#if enableFields}
  <div>
    <button on:click={save}>Update Device Settings</button>
  </div>
{/if}
