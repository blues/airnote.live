<script>
  import {
		Jumbotron,
		Button,
    Col,
		Row } from 'sveltestrap';
</script>

<Jumbotron class='no-bg'>
  <h5>
    Welcome to Airnote!
  </h5>
  <p>A global partnership between
    <a href="https://safecast.org" target="_new">Safecast</a> &amp;
    <a href="https://blues.io" target="_net">Blues Wireless</a>.
    Powered by a community of citizens monitoring the air we breathe.
  </p>
  <p>
    To get started with your Airnote, visit the
    <a href="https://start.airnote.live" target="new">guide
    at start.airnote.live</a>.
  </p>
  <Row>
    <Col>
        <Button color="primary" href="https://start.airnote.live">Set up my Airnote</Button>
    </Col>
  </Row>
  <p>
    To join the network, visit the
    <a href="https://shop.blues.io/products/airnote" target="new">Blues Wireless shop</a> to purchase
    your own cellular-powered air quality monitoring device.
  </p>
  <Row>
    <Col>
        <Button color="primary" href="https://shop.blues.io/products/airnote">Buy an Airnote</Button>
    </Col>
  </Row>
  <Row>
    <Col>
        <Button color="primary" href="https://grafana.safecast.cc/d/t_Z6DlbGz/safecast-all-airnotes?orgId=1">View the Airnote Global Map</Button>
    </Col>
  </Row>
</Jumbotron>

<style>
  :global(div.row) {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  :global(div.row a.btn-primary:visited) {
    color: #f4f4f4;;
  }
</style>
