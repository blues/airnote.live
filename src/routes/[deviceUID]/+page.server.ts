import { fail } from '@sveltejs/kit';
import {
	getDeviceEnvironmentVariables,
	getDeviceEnvironmentVariablesByPin,
	updateDeviceEnvironmentVariablesByPin
} from '$lib/services/notehub';
import { ERROR_TYPE } from '$lib/constants/ErrorTypes.js';
import {
	deviceName,
	displayValue,
	indoorDevice,
	sampleFrequencyFull,
	sampleFrequencyLow,
	sampleFrequencyUSB,
	contactName,
	contactEmail,
	contactAffiliation
} from '$lib/stores/settingsStore';
import { get } from 'svelte/store';
import type { DeviceEnvVars } from '$lib/services/DeviceEnvVarModel.js';

export async function load({ params, url }) {
	const deviceUID = params.deviceUID;
	const pin = url.searchParams.get('pin');

	let notehubError: { status: number } | undefined;
	let error;
	let notehubResponse;

	const envVarResponse = await getDeviceEnvironmentVariables(deviceUID).catch((err) => {
		console.error(err);
		notehubError = err;
	});

	if (envVarResponse) {
		notehubResponse = envVarResponse.environment_variables;
	}

	if (pin === '') {
		error = { errorType: ERROR_TYPE.MISSING_PIN };
	} else if (pin !== null) {
		await getDeviceEnvironmentVariablesByPin(deviceUID, pin).catch((err) => {
			console.error(err);
			error = { errorType: ERROR_TYPE.INVALID_PIN };
		});
	}

	if (notehubError) {
		error = { errorType: ERROR_TYPE.NOTEHUB_ERROR };
	}

	return { notehubResponse, error };
}

export const actions = {
	saveSettings: async ({ params, url, request }) => {
		let notehubError: { status: number } | undefined;
		let error;

		const deviceUID = params.deviceUID;
		const pin = url.searchParams.get('pin');
		const body = await request.formData();
		const formattedBody: DeviceEnvVars = createEnvVarBody(body);
		if (pin === '') {
			error = { errorType: ERROR_TYPE.MISSING_PIN };
		} else if (pin !== null) {
			await updateDeviceEnvironmentVariablesByPin(deviceUID, pin, formattedBody).catch((err) => {
				console.error(err);
				notehubError = err;
			});

			if (notehubError) {
				error = { errorType: ERROR_TYPE.UPDATE_ERROR };
				return fail(500, { error });
			}

			return { success: true };
		}
	}
};

function createEnvVarBody(formData: FormData) {
	return {
		_sn: formData.get('deviceName') ? formData.get('deviceName') : get(deviceName),
		_air_mins: `usb:${get(sampleFrequencyUSB)};high:${
			formData.get('sampleFrequencyFull')
				? formData.get('sampleFrequencyFull')
				: get(sampleFrequencyFull)
		};normal:${
			formData.get('sampleFrequencyFull')
				? formData.get('sampleFrequencyFull')
				: get(sampleFrequencyFull)
		};low:${get(sampleFrequencyLow)};43200`,
		_air_indoors: formData.get('indoorDevice')
			? formData.get('indoorDevice') === 'on'
				? '1'
				: '0'
			: get(indoorDevice)
			? '1'
			: '0',
		_air_status: formData.get('displayValue') ? formData.get('displayValue') : get(displayValue),
		_contact_name: formData.get('contactName') ? formData.get('contactName') : get(contactName),
		_contact_email: formData.get('contactEmail') ? formData.get('contactEmail') : get(contactEmail),
		_contact_affiliation: formData.get('contactAffiliation')
			? formData.get('contactAffiliation')
			: get(contactAffiliation)
	};
}
