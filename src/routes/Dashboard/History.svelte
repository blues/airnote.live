<script>
  import { format, parse } from 'date-fns';

  import { DATE_FORMAT_KEY } from '../../constants';
  import { getDisplay } from '../../services/air';

  function getLastSevenDays() {
    // Get the last eight days, and then splice off today as we don’t want to
    // show the current day.
    const lastEightDays = [...Array(8)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return format(d, DATE_FORMAT_KEY);
    });
    return lastEightDays.splice(1).reverse();
  }

  function getDayDisplay(day) {
    const date = parse(day, DATE_FORMAT_KEY, new Date());
    return format(date, 'EEEE') + '<br>' + format(date, 'MMMM dd');
  }

  export let data;

  let historyFilter = 'aqi';
</script>

<h3 class="history-heading">
  {
    historyFilter == 'aqi' ? 'Air Quality Index' :
    historyFilter == 'pm2_5' ? 'PM2.5' : 'PM10'
  }
  Average (Last 7 Days)
</h3>
<div class="history">
  {#each getLastSevenDays() as day}
    <div>
      <span>{@html getDayDisplay(day)}</span>
      <div
        class="history-box"
        style="background-color: {getDisplay(historyFilter, data[historyFilter][day]).color}"
      >
        <div class="history-value">{data[historyFilter][day] || '—'}</div>
        <div class="history-description">{getDisplay(historyFilter, data[historyFilter][day]).text}</div>
      </div>
    </div>
  {/each}
</div>
<div class="button-group">
  <button
    class={historyFilter == 'aqi' ? 'active' : ''}
    on:click={() => historyFilter = 'aqi'}>
    Air Quality Index
  </button>
  <button
    class={historyFilter == 'pm2_5' ? 'active' : ''}
    on:click={() => historyFilter = 'pm2_5'}>
    PM2.5
  </button>
  <button
    class={historyFilter == 'pm10_0' ? 'active' : ''}
    on:click={() => historyFilter = 'pm10_0'}>
    PM10
  </button>
</div>

<style>
  .history-heading {
    margin-bottom: 0;
  }
  .history {
    display: grid;
    grid-template-columns: 14.28% 14.28% 14.28% 14.28% 14.28% 14.28% 14.28%;
    text-align: center;
    font-size: 0.8rem;
  }
  @media (max-width: 775px) {
    .history {
      grid-template-rows: 50% 50%;
      grid-template-columns: 25% 25% 25% 25%;
    }
  }
  @media (max-width: 500px) {
    .history {
      grid-template-rows: 33% 33% 33%;
      grid-template-columns: 33% 33% 33%;
    }
  }
  .history > div {
    padding-top: 1rem;
  }
  .history .history-box {
    padding: 0 0 0.25rem 0;
    margin: 0.75em 1.5em 0 1.5em;
    color: white;
    border-radius: 5px;
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
  .button-group button.active {
    border: 1px solid transparent;
  }
  .button-group button:hover {
    background: var(--primary);
  }
  .button-group button:not(.active) {
    background: white;
    color: inherit;
    border: 1px solid var(--primary);
    color: var(--primary);
  }
</style>