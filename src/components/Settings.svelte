<script>
  import { createEventDispatcher } from 'svelte';
  import Slider from './Slider.svelte';
  import {
    Button,
    Col,
    Row,
    Form,
    FormGroup,
    Input,
    Label
  } from 'sveltestrap';
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

<Row>
  <Col><h4>Device Settings</h4></Col>
</Row>

<Form>
  <FormGroup>
    <Label for="deviceName">Device name</Label>
    <Input
      disabled={!enableFields ? 'disabled' : ''}
      type="text"
      name="name"
      id="deviceName"
      bind:value={$deviceName}
      placeholder="my-airnote-name" />
  </FormGroup>
  <FormGroup>
    <Label for="displayValue">Airnote screen display value</Label>
    <Input disabled={!enableFields ? 'disabled' : ''}
      bind:value={$displayValue}
      type="select" name="display" id="displayValue">
      {#each displayOptions as option}
        <option value="{option["value"]}">{option["text"]}</option>
      {/each}
    </Input>
  </FormGroup>
  <FormGroup>
    <Label for="sampleFrequency">Sample frequency (minutes)</Label>
    <Slider enableFields={enableFields} />
  </FormGroup>
  <FormGroup class="checkbox-group">
    <Label for="sampleFrequency">
      <Input disabled={!enableFields ? 'disabled' : ''}
        bind:checked={$indoorDevice}
        type="checkbox" name="indoor" id="indoorDevice"
      />
      Indoor device (Will not be visible on the
      Safecast global map)
    </Label>
  </FormGroup>
</Form>

{#if enableFields}
<Row>
  <Col>
    <Button color="primary" on:click={save}>Update Device Settings</Button>
  </Col>
</Row>
{/if}

<style>
  :global(.form-group) {
    text-align: left;
  }

  :global(.form-group label) {
    color: #416681;
  }

  :global(.form-control) {
    border: 1px solid #DDE4E9;
  }

  :global(.form-control::placeholder) {
    color: #A0AFB9;
  }

  :global(.checkbox-group) {
    margin-left: 25px;
  }

  :global(.form-check-input) {
    margin-top: .5rem;
  }
</style>