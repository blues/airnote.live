<script>
  import { Router, Route } from "svelte-routing";
  import { Container, Row, Col } from "sveltestrap";
  import Configuration from "./routes/Configuration.svelte";
  import Home from "./routes/Home.svelte";

  export let url = "";
</script>

<Router url="{url}">
  <div>
    <div class='logo'>
      <img src='./images/airnote.svg' alt="Airnote Logo" />
    </div>
    <main>
      <Container>
        <Route path="/:deviceUID" component="{Configuration}" />
        <Route path="/"><Home /></Route>
        <hr class='my-4' />
        <Row>
          <Col>
            Cloud-connected by <br/>
            <a target='_blank' href='https://blues.io/products'>Notecard</a>
          </Col>
        </Row>
        <br/>
        <Row>
          <Col>
            Developed by <br/>
            <a target='_blank' href='https://blues.io'>Blues Inc.</a>
          </Col>
        </Row>
      </Container>
    </main>
  </div>
</Router>

<style>
	@import 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';

	:global(body) {
		font-family: 'Barlow', sans-serif;
		font-style: normal;
		font-weight: normal;
		font-size: 18px;
		color: #1B3A52;
	}

	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
  :global(.logo) {
		background-color: #1B3A52;
		width: 100%;
		height: 200px;
		padding: 0;
		margin: 0;
		text-align: center;
	}

	:global(.logo img) {
		margin-top: 80px;
	}

  :global(.btn) {
    color: #f4f4f4;
  }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>