<script lang="ts">
  import { page } from '$app/stores';
  import { GA_MEASUREMENT_ID } from '$lib/constants';

  export let id = GA_MEASUREMENT_ID;

  $: if (typeof gtag !== 'undefined' && import.meta.env.PROD === true) {
    gtag('config', id, {
      page_title: document.title,
      page_path: $page.url.pathname
    });
  }

  console.log('mode ', import.meta.env.MODE);
</script>

<svelte:head>
  <script async src="https://www.googletagmanager.com/gtag/js?id={id}"></script>
  {@html `<script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', "${id}");
  </script>`}
</svelte:head>
