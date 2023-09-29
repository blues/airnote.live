<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { enhance } from '$app/forms';
	import Slider from './Slider.svelte';
	import { deviceName, displayValue, indoorDevice } from '$lib/stores/settingsStore';
	import type { DeviceDisplayOption } from '$lib/services/DeviceDisplayModel';

	export let enableFields: boolean;
	export let deviceDisplayOptions: DeviceDisplayOption[] = [];
	export let pin: string | (string | null)[] = '';

	const dispatch = createEventDispatcher();

	let formResponse: string;
	$: if (formResponse === 'success') {
		dispatch('settingsSaved');
		formResponse = '';
	} else if (formResponse === 'failure') {
		dispatch('settingsError');
		formResponse = '';
	}
</script>

<h4 data-cy="device-settings-title">Device Settings</h4>

<form
	method="POST"
	use:enhance={() => {
		return async ({ result }) => {
			formResponse = result.type;
		};
	}}
	action="?&pin={pin}&/saveSettings"
>
	<div>
		<label for="deviceName">Device name</label>
		<input
			disabled={!enableFields}
			type="text"
			name="deviceName"
			id="deviceName"
			bind:value={$deviceName}
			placeholder="my-airnote-name"
		/>
	</div>

	<div>
		<label for="displayValue"> Airnote screen display value </label>
		<select
			disabled={!enableFields}
			bind:value={$displayValue}
			name="displayValue"
			id="displayValue"
		>
			{#each deviceDisplayOptions as option}
				<option value={option['value']}>{option['text']}</option>
			{/each}
		</select>
	</div>

	<div>
		<label for="sampleFrequency">Sample frequency (minutes)</label>
		<Slider {enableFields} />
	</div>

	<div>
		<label class="checkbox-label">
			<input
				disabled={!enableFields}
				bind:checked={$indoorDevice}
				type="checkbox"
				name="indoorDevice"
				id="indoorDevice"
			/>
			<span> Indoor device (Will not be visible on the Safecast global map) </span>
		</label>
	</div>

	{#if enableFields}
		<div class="form-buttons">
			<button>Update Device Settings</button>
		</div>
	{/if}
</form>

<style>
	h4 {
		text-align: center;
	}
	label[for='sampleFrequency'] {
		margin-bottom: 0.5rem;
	}
	.form-buttons {
		text-align: center;
	}

	input[type='checkbox'] {
		width: auto;
		margin-right: 0.25rem;
		padding: 0;
		vertical-align: -webkit-baseline-middle;
	}

	.checkbox-label {
		margin-top: 1rem;
	}
</style>
