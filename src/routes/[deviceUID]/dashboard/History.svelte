<script lang="ts">
	import { format, parse } from 'date-fns';
	import { DATE_FORMAT_KEY } from '$lib/constants';
	import { getDisplay } from '$lib/services/air';
	import type { AirnoteHistoryReadings } from '$lib/services/AirHistoryModel';

	function getLastSevenDays(): string[] {
		// Get the last eight days, and then splice off today as we don’t want to
		// show the current day.
		const lastEightDays = [...Array(8)].map((_, i) => {
			const d = new Date();
			d.setDate(d.getDate() - i);
			return format(d, DATE_FORMAT_KEY);
		});
		return lastEightDays.splice(1).reverse();
	}

	function getDayDisplay(day: string): string {
		const date = parse(day, DATE_FORMAT_KEY, new Date());
		return '<div>' + format(date, 'EEEE') + '</div>' + '<div>' + format(date, 'MMMM dd') + '</div>';
	}

	export let data: AirnoteHistoryReadings = {
		aqi: {},
		pm1_0: {},
		pm2_5: {},
		pm10_0: {}
	};

	let historyFilter: keyof AirnoteHistoryReadings = 'aqi';
</script>

<h3 class="history-heading" data-cy="history-heading">
	{#if historyFilter == 'aqi'}
		Air Quality Index
	{:else if historyFilter == 'pm1_0'}
		PM1
	{:else if historyFilter === 'pm2_5'}
		PM2.5
	{:else}
		PM10
	{/if}
	Average (Last 7 Days)
</h3>
<div class="history">
	{#each getLastSevenDays() as day}
		<div>
			{@html getDayDisplay(day)}
			<div
				class="history-box"
				style="background-color: {getDisplay(historyFilter, data[historyFilter][day])
					.color}; color: {getDisplay(historyFilter, data[historyFilter][day]).textColor}; "
			>
				<div class="history-value">
					{!data[historyFilter][day] ? '-' : data[historyFilter][day]}
				</div>
				<div class="history-description">
					{getDisplay(historyFilter, data[historyFilter][day]).text}
				</div>
			</div>
		</div>
	{/each}
</div>
<div class="button-group">
	<button class={historyFilter == 'aqi' ? 'active' : ''} on:click={() => (historyFilter = 'aqi')}>
		Air Quality Index
	</button>

	<button
		class={historyFilter == 'pm1_0' ? 'active' : ''}
		on:click={() => (historyFilter = 'pm1_0')}
	>
		PM1
	</button>

	<button
		class={historyFilter == 'pm2_5' ? 'active' : ''}
		on:click={() => (historyFilter = 'pm2_5')}
	>
		PM2.5
	</button>
	<button
		class={historyFilter == 'pm10_0' ? 'active' : ''}
		on:click={() => (historyFilter = 'pm10_0')}
	>
		PM10
	</button>
</div>

<style>
	.history-heading {
		margin-bottom: 0;
	}

	.history {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		text-align: center;
		font-size: 0.8rem;
	}

	@media (max-width: 775px) {
		.history {
			grid-template-rows: repeat(2, 1fr);
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (max-width: 500px) {
		.history {
			grid-template-rows: repeat(3, 1fr);
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.history > div {
		padding-top: 1rem;
	}

	.history .history-box {
		padding: 0.4rem 0 0.65rem 0;
		margin: 0.75em 1.5em 0 1.5em;
		color: var(--white);
		border-radius: 5px;
		line-height: 1.3;
	}

	.history .history-value {
		font-weight: 500;
		font-size: 2em;
	}

	.history .history-description {
		font-size: 0.8rem;
	}

	.button-group {
		text-align: center;
		margin-top: 1.5rem;
	}

	.button-group button {
		margin-bottom: 0.5rem;
	}

	.button-group button.active {
		border: 1px solid transparent;
	}

	.button-group button:hover {
		background: var(--primaryBlue);
	}

	.button-group button:not(.active) {
		background: white;
		color: inherit;
		border: 1px solid var(--primaryBlue);
		color: var(--primaryBlue);
	}
</style>
