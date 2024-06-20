<script lang="ts">
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import CloseIcon from '$lib/icons/CloseIcon.svelte';
  import MenuIcon from '$lib/icons/MenuIcon.svelte';
  import AirnoteLogo from '$lib/images/airnote.svg';
  import { getCurrentDeviceFromUrl } from '$lib/services/device';
  import type {
    AirnoteDevice,
    PotentiallyNullDeviceDetails
  } from '$lib/services/DeviceModel';
  import { identity } from '$lib/stores/identityStore';
  import { fetchOryLoginUrl } from '$lib/ory/kratos';

  afterNavigate(() => {
    if (menuOpen === false) return;
    return (menuOpen = false);
  });

  let menuOpen = false;
  const toggleMenu = () => (menuOpen = !menuOpen);

  let pin: PotentiallyNullDeviceDetails = '';
  let productUID: PotentiallyNullDeviceDetails = '';
  let deviceUID: string = '';

  let activePage: string | null = '';
  $: activePage = $page.route.id;

  let userIdentity = get(identity);
  let oryLoginUrl = '';

  onMount(async () => {
    const location = window.location;
    const currentDevice: AirnoteDevice = getCurrentDeviceFromUrl(location);

    pin = currentDevice.pin ? currentDevice.pin : '';
    productUID = currentDevice.productUID ? currentDevice.productUID : '';
    deviceUID = currentDevice.deviceUID ? currentDevice.deviceUID : '';

    if (userIdentity === null) {
      oryLoginUrl = await fetchOryLoginUrl();
    }
  });
</script>

<header>
  <a href="/">
    <img alt="Airnote logo" src={AirnoteLogo} />
  </a>
  <ul class={menuOpen ? 'open' : ''}>
    <li>
      <a
        href="/quickstart"
        data-cy="quickstart-link"
        class:active={activePage === '/quickstart'}>Quickstart</a
      >
    </li>
    {#if deviceUID}
      <li>
        <a
          href="/{deviceUID}?product={productUID}&pin={pin}&internalNav=true"
          data-cy="settings-link"
          class:active={activePage === '/[deviceUID]'}
        >
          Settings
        </a>
      </li>
      <li>
        <a
          href="/{deviceUID}/dashboard"
          data-cy="dashboard-link"
          class:active={activePage && activePage.includes('/dashboard')}
        >
          Dashboard
        </a>
      </li>
    {/if}
    {#if userIdentity !== null && userIdentity.traits.full_name !== ''}
      <li>Hi, {userIdentity?.traits.full_name}</li>
    {:else if userIdentity === null && oryLoginUrl !== ''}
      <li><a href={oryLoginUrl}>Sign in</a></li>
    {/if}
  </ul>
  <button class="svg-button" on:click={toggleMenu}>
    {#if menuOpen}<CloseIcon />{/if}
    {#if !menuOpen}<MenuIcon />{/if}
  </button>
</header>

<style>
  header {
    background: var(--notehubBlue);
    display: flex;

    /* CSS nesting @media queries inside different selectors: https://developer.chrome.com/docs/css-ui/css-nesting */
    @media (max-width: 600px) {
      justify-content: space-between;
      position: relative;
    }
    & :is(img) {
      height: 24px;
      margin: 1.25rem 0.5rem 1.25rem 1rem;
      vertical-align: middle;
    }

    & :is(ul) {
      padding: 0;
      display: flex;
      list-style: none;
      color: var(--white);
      flex-grow: 1;
      align-self: center;
      justify-content: flex-end;
      margin-right: 1rem;

      @media (max-width: 600px) {
        position: absolute;
        top: 48px;
        left: 0;
        z-index: 2;
        width: 100%;
        background: var(--notehubBlue);
        display: none;
        text-align: center;

        &.open {
          display: block;
        }
      }

      & :is(li) {
        padding-left: 1rem;

        @media (max-width: 600px) {
          display: block;
          padding: 1rem;
          border: 1px solid var(--white);
          border-width: 1px 0;
        }

        & :is(a) {
          color: var(--white);
        }

        & :is(.active) {
          font-weight: 600;
        }
      }
    }

    & .svg-button {
      border: 1px solid var(--white);
      align-self: center;
      margin-right: 1rem;
      justify-content: center;
      align-items: center;
      display: none;

      @media (max-width: 600px) {
        display: flex;
      }
    }
  }
</style>
