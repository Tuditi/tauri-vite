<script lang="ts">
    import { onMount } from 'svelte'
    import { invoke } from '@tauri-apps/api'

    import Counter from './lib/Counter.svelte'
    import { Splash } from 'shared/routes'


    onMount(() => {
        invoke('my_custom_command')
    })
</script>

<main>
    <div class="card">
        <Counter />
    </div>

    <Splash />

    <p>
        Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank">SvelteKit</a>, the official Svelte
        app framework powered by Vite!
    </p>
</main>
