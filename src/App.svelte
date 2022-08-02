<script lang="ts">
    import { onMount } from 'svelte'
    import { invoke } from '@tauri-apps/api'
    import { isLocaleLoaded, _ } from '@core/i18n'
    import { Popup, Route, TitleBar, ToastContainer } from 'shared/components'
    import { popupState } from '@lib/popup'
    import { goto } from 'shared/lib/helpers'

    import Counter from './lib/Counter.svelte'
    import {
        BackupRouter,
        BalanceView,
        ClaimRewardsView,
        CongratulationsView,
        CrashReportingView,
        CreateView,
        Dashboard,
        ImportRouter,
        LanguageAndAppearanceView,
        LedgerRouter,
        LegalView,
        LoginRouter,
        MigrateRouter,
        OnboardingCustomNetworkView,
        OnboardingNetworkView,
        OnboardingProtocolView,
        PasswordView,
        ProfileView,
        ProtectRouter,
        SecureView,
        Settings,
        SetupView,
        Splash,
        WelcomeView,
    } from 'shared/routes'
    import { AppRoute } from '@core/router'

    let splash = true
    let settings = false

    onMount(() => {
        invoke('my_custom_command')
    })
</script>

<main>
    <div class="card">
        <Counter />
    </div>

    <TitleBar>
        <!-- empty div to avoid auto-purge removing dark classes -->
        <div class="scheme-dark" />
        {#if !$isLocaleLoaded || splash}
            <Splash />
        {:else}
            {#if $popupState.active}
                <Popup
                    type={$popupState.type}
                    props={$popupState.props}
                    hideClose={$popupState.hideClose}
                    fullScreen={$popupState.fullScreen}
                    transition={$popupState.transition}
                    overflow={$popupState.overflow}
                    relative={$popupState.relative}
                    locale={$_}
                />
            {/if}
            <Route route={AppRoute.Welcome}>
                <WelcomeView />
            </Route>
            <Route route={AppRoute.Legal}>
                <LegalView />
            </Route>
            <Route route={AppRoute.CrashReporting}>
                <CrashReportingView />
            </Route>
            <Route route={AppRoute.LanguageAndAppearance}>
                <LanguageAndAppearanceView locale={$_} />
            </Route>
            <Route route={AppRoute.Profile}>
                <ProfileView />
            </Route>
            <Route route={AppRoute.Setup}>
                <SetupView />
            </Route>
            <!-- TODO: fix ledger -->
            <Route route={AppRoute.Create}>
                <CreateView />
            </Route>
            <Route route={AppRoute.Protocol}>
                <OnboardingProtocolView />
            </Route>
            <Route route={AppRoute.Network}>
                <OnboardingNetworkView />
            </Route>
            <Route route={AppRoute.CustomNetwork}>
                <OnboardingCustomNetworkView />
            </Route>
            <Route route={AppRoute.LedgerSetup}>
                <LedgerRouter />
            </Route>
            <!--  -->
            <Route route={AppRoute.Secure}>
                <SecureView />
            </Route>
            <Route route={AppRoute.Password}>
                <PasswordView />
            </Route>
            <Route route={AppRoute.Protect} transition={false}>
                <ProtectRouter />
            </Route>
            <Route route={AppRoute.Backup} transition={false}>
                <BackupRouter />
            </Route>
            <Route route={AppRoute.Import} transition={false}>
                <ImportRouter />
            </Route>
            <Route route={AppRoute.Balance}>
                <BalanceView />
            </Route>
            <Route route={AppRoute.ClaimRewards}>
                <ClaimRewardsView />
            </Route>
            <Route route={AppRoute.Migrate}>
                <MigrateRouter {goto} />
            </Route>
            <Route route={AppRoute.Congratulations}>
                <CongratulationsView {goto} />
            </Route>
            <Route route={AppRoute.Dashboard}>
                <Dashboard locale={$_} {goto} />
            </Route>
            <Route route={AppRoute.Login}>
                <LoginRouter {goto} />
            </Route>
            {#if settings}
                <Settings locale={$_} handleClose={() => (settings = false)} />
            {/if}

            <ToastContainer />
        {/if}
    </TitleBar>
    <p>
        Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank">SvelteKit</a>, the official Svelte
        app framework powered by Vite!
    </p>
</main>
