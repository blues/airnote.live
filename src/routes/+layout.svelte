<script lang="ts">
	import Header from '$lib/layout/Header.svelte';
	import Footer from '$lib/layout/Footer.svelte';
	import '../app.css';
	import './styles.css';
</script>

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
