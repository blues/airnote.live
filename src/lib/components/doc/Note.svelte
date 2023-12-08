<script lang="ts">
  import CalloutNoteImg from '$lib/images/callout-note.svg';
</script>

<!-- todo rename classes here -->
<div class="callout">
  <header>
    <img alt="" src={CalloutNoteImg} />
    <span>Note</span>
  </header>
  <div class="border">
    <div class="margin">
      <div class="details"><slot /></div>
    </div>
  </div>
</div>

<style>
  header {
    background-color: var(--notehubBlueTintLighter);
    color: var(--white);
    font-size: 18px;
    font-weight: bold;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .callout {
    box-sizing: border-box;
    margin-top: 1.125rem;
    margin-bottom: 1.125rem;
    overflow: hidden;
    padding: 1rem 0;
  }

  header img {
    margin: 0 10px 0 0;
    height: 18px;
  }

  .callout .border {
    overflow: auto; /* so margins of children are contained. */
    border-right: 2px solid var(--notehubBlueTintLighter);
    border-left: 2px solid var(--notehubBlueTintLighter);
    border-bottom: 2px solid var(--notehubBlueTintLighter);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .margin {
    margin: 15px;
  }
</style>
