<script lang="ts">
    import { localize } from '@core/i18n'
    import { DashboardRoute, dashboardRoute, SettingsRoute, settingsRoute, settingsRouter } from '@core/router'
    import { AccountSwitcher, Icon, Text } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { popupState } from 'shared/lib/popup'
    import { onMount } from 'svelte'

    export let classes = ''

    let os = ''

    $: showBackButton = isCorrectRoute($settingsRoute)
    $: showingPopup = $popupState.active && $popupState.type !== 'busy'

    onMount(async () => {
        os = await Platform.getOS()
    })

    function isCorrectRoute(route: SettingsRoute): boolean {
        return route !== SettingsRoute.Init
    }

    function handleBackClick(): void {
        switch ($dashboardRoute) {
            case DashboardRoute.Settings:
                $settingsRouter.previous()
                break
            default:
                break
        }
    }
</script>

<div
    class="fixed top-0 left-20 flex flex-row justify-center items-center py-2 w-full z-10 {os === 'win32' &&
    showingPopup
        ? 'opacity-50 pointer-events-none'
        : ''} {classes}"
>
    {#if showBackButton}
        <button on:click={handleBackClick} class="absolute left-2 cursor-pointer" style="-webkit-app-region: none;">
            <div class="flex items-center space-x-2 ">
                <Icon width="18" icon="arrow-left" classes="text-gray-800 dark:text-gray-500" />
                <Text overrideColor classes="text-gray-800 dark:text-gray-500">{localize('actions.back')}</Text>
            </div>
        </button>
    {/if}
    <AccountSwitcher />
</div>

<style type="text/scss">
    div {
        width: calc(100% - 14rem);
    }
</style>
