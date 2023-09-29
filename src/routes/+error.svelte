<script lang="ts">
	import { page } from '$app/stores';
	import { renderErrorMessage } from '$lib/util/errors';

	let errorType = '';
	let deviceUID = '';
	if ($page.error?.deviceUID) {
		deviceUID = $page.error.deviceUID;
	}
	if ($page.error?.errorType) {
		errorType = $page.error.errorType;
	}
</script>

<div class="error">
	{@html renderErrorMessage(errorType, deviceUID)}
</div>

<style>
	.error {
		min-height: 200px;
	}
</style>
