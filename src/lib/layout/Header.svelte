<script lang="ts">
	import { onMount } from 'svelte';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import MenuIcon from '$lib/icons/MenuIcon.svelte';
	import AirnoteLogo from '$lib/images/airnote.svg';
	import { getCurrentDeviceFromUrl } from '$lib/services/device';
	import type { AirnoteDevice } from '$lib/services/DeviceModel';

	let menuOpen = false;
	const toggleMenu = () => (menuOpen = !menuOpen);

	let pin: string | (string | null)[] = '';
	let productUID: string | (string | null)[] = '';
	let deviceUID: string = '';

	onMount(() => {
		const location = window.location;
		const currentDevice: AirnoteDevice = getCurrentDeviceFromUrl(location);

		pin = currentDevice.pin ? currentDevice.pin : '';
		productUID = currentDevice.productUID ? currentDevice.productUID : '';
		deviceUID = currentDevice.deviceUID ? currentDevice.deviceUID : '';
	});
</script>

<header>
	<a href="/">
		<img alt="Airnote logo" src={AirnoteLogo} />
	</a>
	{#if deviceUID}
		<ul class={menuOpen ? 'open' : ''}>
			<li>
				<a
					href="/{deviceUID}?product={productUID}&pin={pin}&internalNav=true"
					data-cy="settings-link"
				>
					Settings
				</a>
			</li>
			<li>
				<a href="/{deviceUID}/dashboard" data-cy="dashboard-link"> Dashboard </a>
			</li>
		</ul>
		<button class="svg-button" on:click={toggleMenu}>
			{#if menuOpen}<CloseIcon />{/if}
			{#if !menuOpen}<MenuIcon />{/if}
		</button>
	{/if}
</header>

<style>
	header {
		background: var(--notehubBlue);
		display: flex;
	}
	header img {
		height: 24px;
		margin: 1.25rem 0.5rem 1.25rem 1rem;
		vertical-align: middle;
	}
	header ul {
		padding: 0;
		display: flex;
		list-style: none;
		color: var(--white);
		flex-grow: 1;
		align-self: center;
		justify-content: flex-end;
		margin-right: 1rem;
	}
	header li {
		padding-left: 1rem;
	}
	header ul a {
		color: var(--white);
	}
	header .svg-button {
		border: 1px solid var(--white);
		align-self: center;
		margin-right: 1rem;
		justify-content: center;
		align-items: center;
		display: none;
	}

	@media (max-width: 600px) {
		header {
			justify-content: space-between;
			position: relative;
		}
		header ul {
			position: absolute;
			top: 48px;
			left: 0;
			z-index: 2;
			width: 100%;
			background: var(--notehubBlue);
			display: none;
			text-align: center;
		}
		header ul.open {
			display: block;
		}
		header li {
			display: block;
			padding: 1rem;
			border: 1px solid var(--white);
			border-width: 1px 0;
		}
		header .svg-button {
			display: flex;
		}
	}
</style>
