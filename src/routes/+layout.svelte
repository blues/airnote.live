<script lang="ts">
  import { onNavigate } from '$app/navigation';
  import Header from '$lib/layout/Header.svelte';
  import Footer from '$lib/layout/Footer.svelte';
  import Analytics from '$lib/components/analytics.svelte';
  import '../app.css';
  import './styles.css';

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<Analytics />

<div class="app">
  <Header />

  <main>
    <div class="container">
      <slot />
      <hr />
    </div>
  </main>

  <Footer />
</div>

<style>
  main {
    padding: 0 1rem;
    margin: 0 auto;
  }

  .container {
    max-width: 960px;
    margin: 0 auto;
  }
</style>
