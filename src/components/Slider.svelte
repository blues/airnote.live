<script>
  import { onMount } from 'svelte';
  import { sampleFrequencyFull } from '../settingsStore';

  export let enableFields;

  sampleFrequencyFull.subscribe(value => {
    const allRanges = document.querySelectorAll(".frequency-wrap");
    if (allRanges.length > 0) {
      const frequency = allRanges[0].querySelector("#sampleFrequency");
      const popup = allRanges[0].querySelector(".frequencyPopup");

      setPopup(frequency, popup, value);
    }
  });

  const setPopup = (frequency, popup, value) => {
    const val = value ? value : frequency.value;
    const min = frequency.min ? frequency.min : 0;
    const max = frequency.max ? frequency.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));
    popup.innerHTML = val;

    popup.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
  };

  onMount(() => {
    const allRanges = document.querySelectorAll(".frequency-wrap");
    allRanges.forEach(wrap => {
      const frequency = wrap.querySelector("#sampleFrequency");
      const popup = wrap.querySelector(".frequencyPopup");

      frequency.addEventListener("input", () => {
        setPopup(frequency, popup);
      });
      setPopup(frequency, popup);
    });
  });
</script>

<div class="frequency-wrap">
  <input type="range"
    name="frequency"
    id="sampleFrequency"
    disabled={enableFields ? null : 'disabled'}
    min="15" max="1440"
    bind:value={$sampleFrequencyFull}
    step="5" />
  <output class="frequencyPopup"></output>
</div>
<span class="min-val">15 min</span>
<span class="max-val">1440 min</span>

<style>
  .frequency-wrap {
    position: relative;
  }
  input {
    border: none;
    height: 1px;
    outline: none;
    transition: background 450ms ease-in;
    -webkit-appearance: none;
    margin-top: 2rem;
  }

  .frequencyPopup {
    font-weight: 600;
    padding: 4px 12px;
    position: absolute;
    transform: translateX(-50%);
  }
  .frequencyPopup::after {
    content: " min";
    position: absolute;
    width: 2px;
    height: 2px;
    color: #1B3A52;
    top: 4px;
    right: 15%;
  }

  :global(input[type=range]::-webkit-slider-runnable-track) {
    width: 100%;
    height: 2px;
    cursor: pointer;
    background: #ced9e1;
    border-radius: 25px;
  }

  :global(input[type=range]::-webkit-slider-thumb) {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #1B3A52;
    box-shadow: 0 0 4px 0 rgba(0,0,0, 1);
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -8px;
  }

  .min-val, .max-val {
    color: #A0AFB9;
  }
  .max-val {
    float: right;
  }
</style>