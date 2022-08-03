import { defineConfig } from 'vite'
import * as path from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
    // prevent vite from obscuring rust errors
    clearScreen: false,
    // Tauri expects a fixed port, fail if that port is not available
    server: {
        strictPort: true,
    },
    // to make use of `TAURI_PLATFORM`, `TAURI_ARCH`, `TAURI_FAMILY`,
    // `TAURI_PLATFORM_VERSION`, `TAURI_PLATFORM_TYPE` and `TAURI_DEBUG`
    // env variables
    envPrefix: ['VITE_', 'TAURI_'],
    build: {
        // Tauri supports es2021
        target: ['es2021', 'chrome100', 'safari13'],
        // don't minify for debug builds
        minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
        // produce sourcemaps for debug builds
        sourcemap: !!process.env.TAURI_DEBUG,
    },
    plugins: [svelte()],
    resolve: {
        alias: [
            { find: '@auxiliary', replacement: path.resolve(__dirname, 'src/shared/lib/auxiliary') },
            { find: '@contexts', replacement: path.resolve(__dirname, 'src/shared/lib/contexts') },
            { find: '@core', replacement: path.resolve(__dirname, 'src/shared/lib/core') },
            { find: '@features', replacement: path.resolve(__dirname, 'src/shared/lib/features') },
            { find: '@lib', replacement: path.resolve(__dirname, 'src/shared/lib') },
            { find: 'shared', replacement: path.resolve(__dirname, 'src/shared') },
        ],
    },
})
