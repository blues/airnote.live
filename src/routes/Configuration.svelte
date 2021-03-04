<script>
	import { onMount } from 'svelte';
  import {
		Alert,
		Jumbotron,
		Col,
		Row
	} from 'sveltestrap';
	import { NotificationDisplay, notifier } from '@beyonk/svelte-notifications';
	import queryString from 'query-string';
	import Settings from '../components/Settings.svelte';
	import Owner from '../components/Owner.svelte';
	import { airnoteProductUID, notehubAPIBase } from '../constants';
	import {
		deviceName,
		airSampleSecs,
		displayValue,
		contactName,
		contactEmail,
		contactAffiliation
	} from '../settingsStore';

	let pin;
	let productUID;
	let fetchError = false;
	let saveError = false;
	let notify;

	export let deviceUID;
	export let enableFields = true;

	if (typeof window != 'undefined') {
		const query = queryString.parse(window.location.search);
		pin = query["pin"] ? query["pin"] : '';
		productUID = query["product"] ? query["product"] : airnoteProductUID;
	}

	const displayOptions = [
		{value: "tempc", text: "Temp (°C)"},
    {value: "tempf", text: "Temp (°F)"},
    {value: "humid", text:"Humidity"},
		{value: "press", text: "Barometric Pressue"},
	];

	if (productUID === "org.airnote.solar.rad.v1") {
		$displayValue = "cpm";

		displayOptions.splice(0, 0, {value: "cpm", text: "LND712 Counts Per Minute (default)"});
		displayOptions.push({value: "mrem", text: "Milirem per Hour"});
		displayOptions.push({value: "usv", text: "Microsieverts per Hour"});
	} else {
		$displayValue = "pm2.5";

		displayOptions.splice(0, 0, {value: "pm2.5", text: "PM2.5 (default)"});
		displayOptions.push({value: "pm1.0", text: "PM1.0"});
		displayOptions.push({value: "pm10.0", text: "PM10.0"});
	}

	const createBodyFromStore = () => {
		return {
			"environment_variables": {
				"_sn": $deviceName,
				"_air_sample_secs": $airSampleSecs.toString(),
				"_air_status": $displayValue,
				"_contact_name": $contactName,
				"_contact_email": $contactEmail,
				"_contact_affiliation": $contactAffiliation,
			}
		};
	};

	const updateSettingsFromEnvVars = (data) => {
		if (data["_sn"]) $deviceName = data["_sn"];
		if (data["_air_sample_secs"]) $airSampleSecs = data["_air_sample_secs"];
		if (data["_air_status"]) $displayValue = data["_air_status"];
		if (data["_contact_name"]) $contactName = data["_contact_name"];
		if (data["_contact_email"]) $contactEmail = data["_contact_email"];
		if (data["_contact_affiliation"]) $contactAffiliation = data["_contact_affiliation"];
	}

	const handleSettingsSave = async () => {
		const varsBody = createBodyFromStore();
		const url = `${notehubAPIBase}/v1/products/${airnoteProductUID}/devices/${deviceUID}/environment_variables_with_pin`;
		const headers = {
			'Content-Type': 'application/json',
			'X-Auth-Token': pin
		};

		const response = await fetch(url, {
			method: 'PUT',
			headers: headers,
			body: JSON.stringify(varsBody)
		});
		if (response.status !== 200) {
			saveError = true;
		} else {
			notifier.success('Settings saved.');
		}
	}

	onMount(async () => {
		// If no Pin, Get Env Vars using legacy req API
		if (pin === '') {
			enableFields = false;
			const envVarsReadOnlyUrl = `${notehubAPIBase}/req?product="${airnoteProductUID}"&device="${deviceUID}"`;
			const envVarsReadOnlyPayload = '{"req":"hub.env.get","scope":"device"}';

			const response = await fetch(envVarsReadOnlyUrl, {
				method: 'POST',
				body: envVarsReadOnlyPayload
			});
			const data = await response.json();

			// Get current Env Vars from response
			const envVars = data["env"];
			// Populate settings object
			updateSettingsFromEnvVars(envVars);

		} else { // If Pin, Get Env Vars using new V1 API
			const envVarsReadWriteUrl = `${notehubAPIBase}/v1/products/${airnoteProductUID}/devices/${deviceUID}/environment_variables_with_pin`;
			const envVarsReadWriteHeader = { 'X-Auth-Token': pin };

			try {
				const response = await fetch(envVarsReadWriteUrl, {
					headers: envVarsReadWriteHeader
				});
				if (response.status !== 200) {
					fetchError = true;
					enableFields = false;
				} else {
					const data = await response.json();

					// Get current Env Vars from response
					const envVars = data["environment_variables"];
					// Populate settings object
					updateSettingsFromEnvVars(envVars);
				}
			} catch (error) {
				fetchError = true;
				enableFields = false;
			}
		}
	});
</script>

{#if pin === ''}
	<Alert color="warning" isOpen={true}>
		<h4 class="alert-heading text-capitalize">No PIN provided</h4>
		You can view this page in read-only mode, but cannot edit device
		configuration settings.
	</Alert>
{/if}
{#if fetchError}
	<Alert color="danger" isOpen={true}>
		<h4 class="alert-heading text-capitalize">Unable to fetch device details.</h4>
		Please check the DeviceID and Pin provided.
	</Alert>
{/if}
{#if saveError}
	<Alert color="danger" isOpen={true}>
		<h4 class="alert-heading text-capitalize">Unable to safe configuration
			settings. Please try again later.
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

<NotificationDisplay bind:this={notify} />
<Settings
	enableFields={enableFields}
	displayOptions={displayOptions}
	on:submit={handleSettingsSave}
/>
<hr class='my-4' />
<Owner
	enableFields={enableFields}
	on:submit={handleSettingsSave}
/>

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

	:global(.toast) {
		opacity: unset;
	}
</style>