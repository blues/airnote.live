<script lang="ts">
	let numberOfRecommendations = 2;
	let recommendationToShow = Math.floor(Math.random() * numberOfRecommendations) + 1;
</script>

{#if recommendationToShow == 1}
	<p>
		Particle pollution can be high any time of day. Since vehicle exhaust contains particle
		pollution, limit activity near idling cars and buses and near busy roads, especially during rush
		hours. Also, limit outdoor activity when there is smoke in the air.
	</p>
	<a
		href="https://www.airnow.gov/publications/activity-guides/air-quality-and-outdoor-activity-guidance-for-schools/"
	>
		Learn more
	</a>
{/if}

{#if recommendationToShow == 2}
	<p>
		When particle pollution levels are high outdoors, they can be high indoors – unless your
		building has a good filtration system. You can help keep your indoor particle levels low by:
	</p>
	<ul>
		<li>Eliminating tobacco smoke</li>
		<li>Reducing your use of wood stoves and fireplaces</li>
		<li>Using HEPA air filters and air cleaners designed to reduce particles</li>
	</ul>
	<a href="https://www.airnow.gov/sites/default/files/2021-03/air-quality-guide_pm_2015_0.pdf">
		Learn More
	</a>
{/if}
