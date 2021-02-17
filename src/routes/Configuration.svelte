<script>
  import {
		Alert,
		Container,
		Jumbotron,
		Col,
		Row } from 'sveltestrap';
	import queryString from "query-string";
	import Settings from '../components/Settings.svelte';
	import Owner from '../components/Owner.svelte';

	export let deviceUID;
	export let pin;
	let visible = true;

	if (typeof window != 'undefined') {
		const query = queryString.parse(window.location.search);
		pin = query["pin"] ? query["pin"] : '';
	}
</script>

		{#if pin === ''}
			<Alert color="danger" isOpen={visible} toggle={() => (visible = false)}>
				<h4 class="alert-heading text-capitalize">No PIN provided</h4>
				You can view this page in read-only mode, but cannot edit device
				configuration settings.
			</Alert>
		{/if}
		<Jumbotron class='no-bg'>
			<h5>
				Thank you for joining the global Airnote network!
			</h5>
			<p>You're now part of a community of citizens helping to
				monitor the air we breathe.</p><p>Use the fields below to
				personalize your device, or click the links to
				view charts for your device and the global Safecast map.
			</p>
			<hr class='my-4' />
			<Row>
				<Col><i>dev:{deviceUID}</i></Col>
			</Row>
			<Row>
				<Col><h4>Safecast</h4></Col>
			</Row>
			<Row class="links">
				<Col>
					<a href='http://tt.safecast.org/id/note:dev:{deviceUID}'>Device Charts</a>
				</Col>
				<div class='separator'>|</div>
				<Col>
					<a href='http://tt.safecast.org/map/note:dev:{deviceUID}'>Global Map</a>
				</Col>
			</Row>
			<hr class='my-4' />
			<p>
				<i>
					For help setting-up your Airnote, visit
					<a href='https://start.airnote.live'>start.airnote.live</a>
				</i>
			</p>
		</Jumbotron>

		<Settings pin={pin} />
		<hr class='my-4' />
		<Owner pin={pin} />

		<hr class='my-4' />
		<Row>
			<Col>
				<i>
					By using your Airnote device, or completing the optional fields
					on this page, you consent to share your device data and the optional
					contact information with Blues Inc. for the purposes of publishing
					public maps and device dashboards.
				</i>
			</Col>
		</Row>

<style>

	:global(h4) {
		font-weight: bold;
		font-size: 20px;
		line-height: 28px;
		text-align: center;
		letter-spacing: 0.01em;
		color: #050607;
	}

	:global(.links) {
		text-align: center;
		line-height: 38px;
	}


	:global(.no-bg) {
		background-color: #fff;
	}

	.separator {
		font-size: 1.5rem;
		color: #CED9E1;
	}

	:global(a) {
		font-size: 18px;
		line-height: 22px;
		text-align: center;
		color: #00B9FF;
	}

	:global(.btn) {
		background-color: #00B9FF;
		border-color: #00B9FF;
	}

	:global(.jumbotron) {
		margin-bottom: 0;
		padding: 0;
	}
</style>