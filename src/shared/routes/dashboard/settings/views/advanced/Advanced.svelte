<script lang="ts">
    import { HR } from 'shared/components'
    import { activeProfile, isLedgerProfile } from '@core/profile'
    import { AdvancedSettings } from '@core/router'
    import {
        CrashReporting,
        DeepLinks,
        Diagnostics,
        ErrorLog,
        HiddenAccounts,
        MigrateLedgerIndex,
        NetworkConfiguration,
        WalletFinder,
    } from './'
    import features from 'shared/features/features'

    const settings: {
        component: unknown
        childRoute: AdvancedSettings
        requireLogin?: boolean
        requireLedger?: boolean
    }[] = [
        { component: NetworkConfiguration, childRoute: AdvancedSettings.NetworkConfiguration, requireLogin: true },
        { component: DeepLinks, childRoute: AdvancedSettings.DeepLinks },
        { component: WalletFinder, childRoute: AdvancedSettings.WalletFinder, requireLogin: true },
        { component: HiddenAccounts, childRoute: AdvancedSettings.HiddenAccounts, requireLogin: true },
        { component: ErrorLog, childRoute: AdvancedSettings.ErrorLog },
        { component: CrashReporting, childRoute: AdvancedSettings.CrashReporting },
        { component: Diagnostics, childRoute: AdvancedSettings.Diagnostics },
        { component: MigrateLedgerIndex, childRoute: AdvancedSettings.MigrateLedgerIndex, requireLedger: true },
    ]
    const visibleSettings = settings.filter((setting) => features?.settings?.advanced?.[setting.childRoute]?.enabled)

    const { loggedIn } = $activeProfile
</script>

<div>
    {#each visibleSettings as { component, childRoute, requireLogin, requireLedger }, index}
        {#if (!requireLogin || (requireLogin && $loggedIn)) && (!requireLedger || (requireLedger && $isLedgerProfile))}
            <section id={childRoute} class="w-full sm:w-3/4">
                <svelte:component this={component} id={childRoute} />
            </section>
            {#if index < visibleSettings.length - 1}
                <HR classes="pb-5 mt-5 justify-center" />
            {/if}
        {/if}
    {/each}
</div>
