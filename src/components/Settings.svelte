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
		displayValue
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
    <Label for="displayValue">LCD display value</Label>
    <Input disabled={!enableFields ? 'disabled' : ''}
      bind:value={$displayValue}
      type="select" name="display" id="displayValue">
      {#each displayOptions as option}
        <option value="{option["value"]}">{option["text"]}</option>
      {/each}
    </Input>
  </FormGroup>
  <FormGroup>
    <Label for="sampleFrequency">Sample frequency</Label>
    <Slider enableFields={enableFields} />
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
</style>