<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { enhance } from '$app/forms';
	import { contactName, contactEmail, contactAffiliation } from '$lib/stores/settingsStore';

	export let enableFields: boolean;
	export let pin: string | (string | null)[] = '';

	const dispatch = createEventDispatcher();

	let formResponse: string;
	$: if (formResponse === 'success') {
		dispatch('settingsSaved');
	} else if (formResponse === 'failure') {
		dispatch('settingsError');
	}
</script>

<h4 data-cy="device-owner-title">Device Owner Info</h4>

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
		<label for="ownerName">Name</label>
		<input
			disabled={!enableFields}
			type="text"
			name="contactName"
			bind:value={$contactName}
			id="ownerName"
			placeholder="Ada Lovelace"
		/>
	</div>

	<div>
		<label for="companyName">Affiliation</label>
		<input
			disabled={!enableFields}
			type="text"
			name="contactAffiliation"
			bind:value={$contactAffiliation}
			id="companyName"
			placeholder="Blues Inc."
		/>
	</div>

	<div>
		<label for="ownerEmail">Contact Email</label>
		<input
			disabled={!enableFields}
			type="email"
			name="contactEmail"
			bind:value={$contactEmail}
			id="ownerEmail"
			placeholder="ada@blues.com"
		/>
	</div>

	{#if enableFields}
		<div class="form-buttons">
			<button>Update Device Owner</button>
		</div>
	{/if}
</form>

<style>
	h4 {
		text-align: center;
	}
	.form-buttons {
		text-align: center;
	}
</style>
