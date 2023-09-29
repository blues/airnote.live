<svelte:head>
	<title>Welcome to Airnote</title>
</svelte:head>

<section>
	<h1 data-cy="page-title">Welcome to Airnote!</h1>

	<p>
		A global partnership between
		<a href="https://safecast.org" target="_new">Safecast</a> &amp;
		<a href="https://blues.io" target="_net">Blues</a>. Powered by a community of citizens
		monitoring the air we breathe.
	</p>
	<p>
		To get started with your Airnote, visit the
		<a href="https://start.airnote.live" target="new">guide at start.airnote.live</a>.
	</p>

	<a href="https://start.airnote.live" class="btn" data-cy="setup-airnote-btn">Set up my Airnote</a>
</section>

<hr />

<section>
	<p>
		To join the network, visit the
		<a href="https://shop.blues.io/products/airnote" target="new">Blues shop</a> to purchase your own
		cellular-powered air quality monitoring device.
	</p>

	<a href="https://shop.blues.io/products/airnote" class="btn" data-cy="buy-airnote-btn"
		>Buy an Airnote</a
	>
</section>

<style>
	h1 {
		text-align: center;
	}
	section {
		margin: 20px auto 0 auto;
		text-align: center;
	}
	@media (max-width: 992px) {
		section {
			max-width: 720px;
			padding: 0 1rem;
		}
	}
	.btn {
		display: inline-block;
		margin-bottom: 10px;
	}
</style>
