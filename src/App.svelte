<script lang="ts">
    import { onMount } from 'svelte';
    import { invoke } from '@tauri-apps/api'
    
    import Counter from './lib/Counter.svelte'

    onMount(() => {
        invoke("my_custom_command")
    })
</script>

<main>
  <div class="card">
    <Counter />
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>

<style>
  .read-the-docs {
    color: #888;
  }
</style>