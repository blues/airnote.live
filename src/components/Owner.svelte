<script>
  import { createEventDispatcher } from 'svelte';
  import {
    Button,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row
  } from 'sveltestrap';
  import {
		contactName,
		contactEmail,
		contactAffiliation
	} from '../settingsStore';

  const dispatch = createEventDispatcher();

  export let enableFields;

  const save = () => dispatch('submit');
</script>

<Row>
  <Col><h4>Device Owner Info</h4></Col>
</Row>

<Form>
  <FormGroup>
    <Label for="ownerName">Name</Label>
    <Input
      disabled={!enableFields ? 'disabled' : ''}
      type="text"
      name="ownerName"
      bind:value={$contactName}
      id="ownerName"
      placeholder="Ada Lovelace" />
  </FormGroup>
  <FormGroup>
    <Label for="companyName">Affiliation</Label>
    <Input
      disabled={!enableFields ? 'disabled' : ''}
      type="text"
      name="companyName"
      bind:value={$contactAffiliation}
      id="companyName"
      placeholder="Blues Inc." />
  </FormGroup>
  <FormGroup>
    <Label for="ownerEmail">Contact Email</Label>
    <Input
      disabled={!enableFields ? 'disabled' : ''}
      type="email"
      name="ownerEmail"
      bind:value={$contactEmail}
      id="ownerEmail"
      placeholder="ada@blues.com" />
  </FormGroup>
</Form>

{#if enableFields}
<Row>
  <Col>
    <Button color="primary" on:click={save}>Update Device Owner</Button>
  </Col>
</Row>
{/if}