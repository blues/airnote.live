<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { NotificationDisplay, notifier } from '@beyonk/svelte-notifications';
	import { APP_UID, RADNOTE_PRODUCT_UID } from '$lib/constants';
	import { getCurrentDeviceFromUrl } from '$lib/services/device';
	import DeviceSettings from './DeviceSettings.svelte';
	import DeviceOwner from './DeviceOwner.svelte';
	import {
		deviceName,
		displayValue,
		indoorDevice,
		sampleFrequencyUSB,
		sampleFrequencyFull,
		sampleFrequencyLow,
		contactName,
		contactEmail,
		contactAffiliation
	} from '$lib/stores/settingsStore';
	import { deviceDisplayOptions } from '$lib/services/device';
	import type { AirnoteDevice } from '$lib/services/DeviceModel';
	import { ERROR_TYPE } from '$lib/constants/ErrorTypes';
	import { renderErrorMessage } from '$lib/util/errors';

	export let pin: string | (string | null)[] = '';
	export let deviceUID: string = '';
	export let internalNav: string | (string | null)[] = 'false';
	export let productUID: string | (string | null)[] = '';

	let enableFields = false;
	let error = false;
	let errorType: string;

	let eventsUrl = `https://notehub.io/project/${APP_UID}/events`;
	$: if (deviceUID) {
		eventsUrl = `https://notehub.io/project/${APP_UID}/events?queryDevice=${deviceUID}`;
	}

	export let data;

	if (data.error !== undefined) {
		if (data.error.errorType === ERROR_TYPE.MISSING_PIN) {
			error = true;
			errorType = ERROR_TYPE.MISSING_PIN;
		}
		if (data.error.errorType === ERROR_TYPE.INVALID_PIN) {
			error = true;
			errorType = ERROR_TYPE.INVALID_PIN;
		}
		if (data.error.errorType === ERROR_TYPE.NOTEHUB_ERROR) {
			error = true;
			errorType = ERROR_TYPE.NOTEHUB_ERROR;
		}
	} else {
		enableFields = true;
	}

	const updateSettingsFromEnvVars = (data: { [property: string]: string }) => {
		if (data['_sn']) $deviceName = data['_sn'];
		if (data['_air_mins']) {
			// Split semi-colon list into an array for parsing and reassembly
			// "usb:15;high:123;normal:123;low:720;0"
			let airMinsVals = data['_air_mins'].split(';').map((item) => item.split(':'));
			for (let index = 0; index < airMinsVals.length; index++) {
				const element = airMinsVals[index];
				switch (element[0]) {
					case 'usb':
						$sampleFrequencyUSB = element[1];
						break;
					case 'high':
						$sampleFrequencyFull = element[1];
						break;
					case 'low':
						$sampleFrequencyLow = element[1];
						break;
				}
			}
		}
		if (data['_air_indoors']) $indoorDevice = data['_air_indoors'] === '0' ? false : true;
		if (data['_air_status']) $displayValue = data['_air_status'];
		if (data['_contact_name']) $contactName = data['_contact_name'];
		if (data['_contact_email']) $contactEmail = data['_contact_email'];
		if (data['_contact_affiliation']) $contactAffiliation = data['_contact_affiliation'];
	};

	if (data.notehubResponse) {
		updateSettingsFromEnvVars(data.notehubResponse);
	}

	if (productUID === RADNOTE_PRODUCT_UID) {
		$displayValue = 'usv';

		deviceDisplayOptions.splice(0, 0, {
			value: 'usv',
			text: 'Microsieverts per Hour (default)'
		});
		deviceDisplayOptions.push({ value: 'mrem', text: 'Milirem per Hour' });
		deviceDisplayOptions.push({ value: 'cpm', text: 'LND712 Counts Per Minute' });
	} else {
		$displayValue = 'pm2.5';

		deviceDisplayOptions.splice(0, 0, { value: 'pm2.5', text: 'PM2.5 (default)' });
		deviceDisplayOptions.push({ value: 'pm1.0', text: 'PM1.0' });
		deviceDisplayOptions.push({ value: 'pm10.0', text: 'PM10.0' });
	}

	const handleSettingsSaved = () => {
		notifier.success('Settings saved.', 3000);
	};

	const handleSettingsError = () => {
		error = true;
		errorType = ERROR_TYPE.UPDATE_ERROR;
	};

	onMount(() => {
		const currentDevice: AirnoteDevice = getCurrentDeviceFromUrl(location);
		pin = currentDevice.pin ? currentDevice.pin : '';
		deviceUID = currentDevice.deviceUID ? currentDevice.deviceUID : '';
		internalNav = currentDevice.internalNav ? currentDevice.internalNav : 'false';
		productUID = currentDevice.productUID ? currentDevice.productUID : '';

		/* Notehub links to a device’s dashboard using `/${deviceUID}` with no pin,
    and we want Notehub users to view the device’s dashboard, and not the
    settings page when first directed there from Notehub. */
		if (deviceUID && location.pathname === '/' + deviceUID && !pin && internalNav === 'false') {
			goto(`/${deviceUID}/dashboard`, { replaceState: true });
		}
	});
</script>

<svelte:head>
	<title>Airnote Device Configuration</title>
</svelte:head>

{#if error}
	{@html renderErrorMessage(errorType, deviceUID)}
{/if}

<section>
	<h1>Welcome to Airnote!</h1>
	<p>You're now part of a community of citizens helping to monitor the air we breathe.</p>
	<p>You can view your device’s dashboard or use the forms below to personalize your device.</p>
	<p>
		<a href="/{deviceUID}/dashboard" class="btn">View your device’s dashboard</a>
	</p>
	<p>
		<i>
			For help setting up your Airnote, visit
			<a href="https://start.airnote.live">start.airnote.live</a>.
		</i>
	</p>
</section>

<hr />

<NotificationDisplay />

<section>
	<DeviceSettings
		{enableFields}
		{deviceDisplayOptions}
		on:settingsSaved={() => handleSettingsSaved()}
		on:settingsError={() => handleSettingsError()}
		{pin}
	/>
</section>

<hr />

<section>
	<DeviceOwner
		{enableFields}
		on:settingsSaved={() => handleSettingsSaved()}
		on:settingsError={() => handleSettingsError()}
		{pin}
	/>
</section>

<hr />

<section>
	<p>
		<a href={eventsUrl} target="_new" data-cy="notehub-link">
			View live Airnote events on Notehub.io
		</a>
	</p>
</section>

<hr />

<section>
	<p>
		<i>
			By using your Airnote device, or completing the optional fields on this page, you consent to
			openly sharing your device data and the optional contact information under Creative Commons
			CC0. For the benefit of the community, all devices' data, maps, dashboards, and contact
			information are openly published to the public. If you do not wish your contact information to
			be published, please do not supply it.
		</i>
	</p>
</section>

<style>
	h1,
	a,
	p {
		text-align: center;
	}
	section {
		margin: 0 auto;
		text-align: left;
	}
	@media (max-width: 992px) {
		section {
			max-width: 720px;
			padding: 0 1rem;
		}
	}
</style>
