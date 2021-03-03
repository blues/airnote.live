<script>
  import {
    Button,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row
  } from 'sveltestrap';

  export let enableFields;
  export let settings;
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
      bind:value={settings["_contact_name"]}
      id="ownerName"
      placeholder="Ada Lovelace" />
  </FormGroup>
  <FormGroup>
    <Label for="companyName">Affiliation</Label>
    <Input
      disabled={!enableFields ? 'disabled' : ''}
      type="text"
      name="companyName"
      bind:value={settings["_contact_affiliation"]}
      id="companyName"
      placeholder="Blues Inc." />
  </FormGroup>
  <FormGroup>
    <Label for="ownerEmail">Contact Email</Label>
    <Input
      disabled={!enableFields ? 'disabled' : ''}
      type="email"
      name="ownerEmail"
      bind:value={settings["_contact_email"]}
      id="ownerEmail"
      placeholder="ada@blues.com" />
  </FormGroup>
</Form>

{#if enableFields}
<Row>
  <Col>
    <Button color="primary">Update Device Owner</Button>
  </Col>
</Row>
{/if}