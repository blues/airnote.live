<script>
  import { format, parse } from "date-fns";
  import { DATE_FORMAT_KEY } from "../../constants";
  import { getDisplay } from "../../services/air";

  function getLastSevenDays() {
    // Get the last eight days, and then splice off today as we don’t want to
    // show the current day.
    const lastEightDays = [...Array(8)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return format(d, DATE_FORMAT_KEY);
    });
    return lastEightDays.splice(1).reverse();
  }

  function getDayDisplay(day) {
    const date = parse(day, DATE_FORMAT_KEY, new Date());
    return (
      "<div>" +
      format(date, "EEEE") +
      "</div>" +
      "<div>" +
      format(date, "MMMM dd") +
      "</div>"
    );
  }

  // export let data;

  const data = {
    aqi: {
      "August 03 2022": 0,
      "August 02 2022": null,
      "August 01 2022": 4,
      "July 31 2022": 101,
      "July 30 2022": 151,
      "July 29 2022": 201,
      "July 28 2022": 301,
      "July 27 2022": 75,
      "July 26 2022": null,
    },
    pm1_0: {
      "August 03 2022": 6,
      "August 02 2022": 6,
      "August 01 2022": 5,
      "July 31 2022": null,
      "July 30 2022": 5,
      "July 29 2022": 6,
      "July 28 2022": 5,
      "July 27 2022": 3,
      "July 26 2022": null,
    },
    pm2_5: {
      "August 03 2022": 9,
      "August 02 2022": 9,
      "August 01 2022": 8,
      "July 31 2022": 6,
      "July 30 2022": 8,
      "July 29 2022": 9,
      "July 28 2022": 8,
      "July 27 2022": 5,
      "July 26 2022": 2,
    },
    pm10_0: {
      "August 03 2022": 9,
      "August 02 2022": 10,
      "August 01 2022": 8,
      "July 31 2022": 6,
      "July 30 2022": 9,
      "July 29 2022": 9,
      "July 28 2022": 8,
      "July 27 2022": 5,
      "July 26 2022": 2,
    },
  };
  console.log(JSON.stringify(data));

  let historyFilter = "aqi";
</script>

<h3 class="history-heading">
  {#if historyFilter == "aqi"}
    Air Quality Index
  {:else if historyFilter == "pm1_0"}
    PM1
  {:else if historyFilter === "pm2_5"}
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
        style="background-color: {getDisplay(
          historyFilter,
          data[historyFilter][day]
        ).color}; color: {getDisplay(historyFilter, data[historyFilter][day])
          .textColor}; "
      >
        <div class="history-value">
          {Number.isNaN(data[historyFilter][day])
            ? "-"
            : data[historyFilter][day]}
        </div>
        <div class="history-description">
          {getDisplay(historyFilter, data[historyFilter][day]).text}
        </div>
      </div>
    </div>
  {/each}
</div>
<div class="button-group">
  <button
    class={historyFilter == "aqi" ? "active" : ""}
    on:click={() => (historyFilter = "aqi")}
  >
    Air Quality Index
  </button>

  <button
    class={historyFilter == "pm1_0" ? "active" : ""}
    on:click={() => (historyFilter = "pm1_0")}
  >
    PM1
  </button>

  <button
    class={historyFilter == "pm2_5" ? "active" : ""}
    on:click={() => (historyFilter = "pm2_5")}
  >
    PM2.5
  </button>
  <button
    class={historyFilter == "pm10_0" ? "active" : ""}
    on:click={() => (historyFilter = "pm10_0")}
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
    color: white;
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
