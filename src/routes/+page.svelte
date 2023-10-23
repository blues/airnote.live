<script lang="ts">
  import { applyAction, enhance } from '$app/forms';

  export let data;
  export let form;

  let loading = false;
  let showSuccessMessage = false;
  let showErrorMessage = false;

  $: console.log('form ', form);

  $: if (form && form.uid && form.label) {
    showSuccessMessage = true;
  } else if (form && form.error === 'Unauthorized') {
    showErrorMessage = true;
  }
</script>

<svelte:head>
  <title>Welcome to Airnote</title>
</svelte:head>

<section>
  <h1 data-cy="page-title">Welcome to Airnote!</h1>

  {#if form?.success || data?.user_token}
    <p>Welcome back {data.user_token}!</p>
  {/if}

  <p>
    A global partnership between
    <a href="https://safecast.org" target="_new">Safecast</a> &amp;
    <a href="https://blues.io" target="_net">Blues</a>. Powered by a community
    of citizens monitoring the air we breathe.
  </p>
  <p>
    To get started with your Airnote, visit the
    <a href="https://start.airnote.live" target="new"
      >guide at start.airnote.live</a
    >.
  </p>

  <a href="https://start.airnote.live" class="btn" data-cy="setup-airnote-btn"
    >Set up my Airnote</a
  >
</section>

<hr />

<section>
  <p>
    To join the network, visit the
    <a href="https://shop.blues.io/products/airnote" target="new">Blues shop</a>
    to purchase your own cellular-powered air quality monitoring device.
  </p>

  <a
    href="https://shop.blues.io/products/airnote"
    class="btn"
    data-cy="buy-airnote-btn">Buy an Airnote</a
  >
</section>

<section>
  <p>
    This is purely a Notehub auth POC section to see what works and what
    doesn't. For my first trick I will attempt auth with NotehubJS
  </p>

  <form method="POST" use:enhance action="?/loginViaNotehubJs">
    <label for="email">Email</label>
    <input type="email" name="email" id="email" placeholder="email@email.com" />
    <label for="password">Password</label>
    <input
      type="password"
      name="password"
      id="password"
      placeholder="password"
    />

    <div class="form-buttons">
      <button>Log In</button>
    </div>
  </form>
</section>

{#if data.notehub_projects}
  <section>
    <p>Here's a list of all your Notehub projects.</p>
    <select>
      {#each data.notehub_projects as project}
        <option value={project.uid}
          >Project Label: {project.label} - Project ID: {project.uid}</option
        >
      {/each}
    </select>
    <p>Would you like to create a new Notehub project?</p>
    <form
      method="POST"
      use:enhance={() => {
        loading = true;
        return async ({ result }) => {
          console.log(result);
          loading = false;
          await applyAction(result);
        };
      }}
      action="?/createNotehubProject"
    >
      <label for="project_name">Project Name</label>
      <input
        type="text"
        name="project_name"
        id="project_name"
        placeholder="Your Project"
      />
      <div class="form-buttons">
        <button>Create Project</button>
      </div>
    </form>
    {#if loading}
      <p>Creating your new Notehub project...</p>
    {/if}
    {#if showSuccessMessage && form}
      <p>Congrats - your new Notehub project was created!</p>
      <p>Project Name: {form.label}</p>
      <p>Project UID: {form.uid}</p>
    {/if}
    {#if showErrorMessage && form}
      <p>Sorry - there was an error creating your new Notehub project.</p>
      <p>Try logging back in then create your project again.</p>
    {/if}
  </section>
{/if}

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
