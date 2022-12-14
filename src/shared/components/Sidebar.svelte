<script lang="ts">
    import {
        Drawer,
        Icon,
        ProfileActionsModal,
        SidebarTab,
        Text,
        Modal,
        NetworkIndicator,
        NotificationBadge,
    } from 'shared/components'
    import { appVersionDetails, mobile } from '@core/app'
    import { getInitials, isRecentDate } from '@lib/helpers'
    import { isStakingPossible } from '@lib/participation'
    import {
        assemblyStakingEventState,
        partiallyUnstakedAmount,
        shimmerStakingEventState,
    } from '@lib/participation/stores'
    import { activeProfile } from '@core/profile'
    import {
        dashboardRoute,
        dashboardRouter,
        DashboardRoute,
        resetWalletRoute,
        settingsRoute,
        settingsRouter,
        SettingsRoute,
        SidebarTab as SidebarTabType,
    } from '@core/router'
    import { Settings } from 'shared/routes'
    import { localize } from '@core/i18n'
    import features from 'shared/features/features'

    let profileModal: Modal
    let drawer: Drawer
    let prevPartiallyUnstakedAmount = 0 // store the previous unstaked funds to avoid notifying when unstaked funds decrease
    let showStakingNotification = false

    const profileColor = 'blue' // TODO: each profile has a different color

    const { shouldOpenProfileModal } = $activeProfile

    $: profileInitial = getInitials($activeProfile?.name, 1)
    $: $dashboardRoute,
        $assemblyStakingEventState,
        $shimmerStakingEventState,
        $partiallyUnstakedAmount,
        manageUnstakedAmountNotification()

    // $: $activeProfile?.hasVisitedStaking, showStakingNotification, updateSidebarNotification()
    $: lastStrongholdBackupTime = $activeProfile?.lastStrongholdBackupTime
    $: lastBackupDate = lastStrongholdBackupTime ? new Date(lastStrongholdBackupTime) : null
    $: isBackupSafe = lastBackupDate && isRecentDate(lastBackupDate)?.lessThanThreeMonths

    const sidebarTabs: SidebarTabType[] = [
        ...(features?.wallet?.enabled
            ? [
                  {
                      icon: 'wallet',
                      label: localize('tabs.wallet'),
                      route: DashboardRoute.Wallet,
                      onClick: openWallet,
                  },
              ]
            : []),
        ...(features?.staking?.enabled
            ? [
                  {
                      icon: 'tokens',
                      label: localize('tabs.staking'),
                      route: DashboardRoute.Staking,
                      onClick: openStaking,
                  },
              ]
            : []),
        ...(features?.developerTools?.enabled
            ? [
                  {
                      icon: 'tools',
                      label: localize('tabs.developerTools'),
                      route: DashboardRoute.DeveloperTools,
                      onClick: openDeveloperTools,
                  },
              ]
            : []),
    ]

    function openWallet() {
        resetWalletRoute()
    }

    function openStaking() {
        $dashboardRouter.goTo(DashboardRoute.Staking)
    }

    function openDeveloperTools() {
        $dashboardRouter.goTo(DashboardRoute.DeveloperTools)
    }

    // function updateSidebarNotification() {
    //     sidebarTabs = sidebarTabs.map((tab) => {
    //         if (DashboardRoute.Staking === tab.route) {
    //             tab.notificationType = !$activeProfile?.hasVisitedStaking
    //                 ? 'error'
    //                 : showStakingNotification
    //                 ? 'warning'
    //                 : null
    //         }
    //         return tab
    //     })
    // }

    function manageUnstakedAmountNotification() {
        if (isStakingPossible($assemblyStakingEventState) || isStakingPossible($shimmerStakingEventState)) {
            if ($dashboardRoute !== DashboardRoute.Staking && $partiallyUnstakedAmount > prevPartiallyUnstakedAmount) {
                showStakingNotification = true
            } else {
                showStakingNotification = false
            }
            prevPartiallyUnstakedAmount = $partiallyUnstakedAmount
        } else {
            showStakingNotification = false
        }
    }

    function handleBackClick() {
        if ($settingsRoute === SettingsRoute.Init) {
            drawer?.close()
        } else {
            $settingsRouter.previous()
        }
    }
</script>

{#if $mobile}
    <button
        class="menu-button z-10 w-9 h-9 flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100"
        on:click={() => drawer.open()}
    >
        <span class="text-12 text-center text-white uppercase">{profileInitial || 'A'}</span>
    </button>
    <Drawer bind:this={drawer} fromRight={true} dimLength={0} opened={false} fullScreen classes="flex">
        <div class="flex flex-col flex-1">
            <header
                class="w-full px-8 py-3 mb-6 flex items-centers justify-center bg-white dark:bg-gray-800"
                on:click={handleBackClick}
            >
                <Icon icon="arrow-left" classes="absolute left-6 text-gray-500 text-blue-500" />
                <Text type="h4" classes="text-center">
                    {localize(
                        $settingsRoute === SettingsRoute.Init
                            ? 'general.yourWallets'
                            : `views.settings.${$settingsRoute}.title`
                    )}
                </Text>
            </header>
            {#if $settingsRoute === SettingsRoute.Init}
                <!-- TODO: add real profile data -->
                <div class="flex flex-row items-center space-x-6 mb-7 px-6 w-full">
                    <div
                        class="w-16 h-16 flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100"
                    >
                        <span class="text-20 text-center text-white uppercase font-semibold"
                            >{profileInitial || 'A'}</span
                        >
                    </div>
                    <Text type="h4">John Doe</Text>
                </div>
            {/if}
            <Settings {localize} />
        </div>
    </Drawer>
{:else}
    <aside
        class="flex flex-col justify-center items-center bg-white dark:bg-gray-800 relative w-20 px-5 pt-10 pb-5 border-solid border-r border-gray-100 dark:border-gray-800"
    >
        <nav class="flex flex-grow flex-col items-center justify-between">
            <div class="flex flex-col items-center">
                <NetworkIndicator />
            </div>
            <div class="flex flex-col flex-auto items-center justify-center mb-7 space-y-8">
                {#each sidebarTabs as tab}
                    <div class="flex">
                        <SidebarTab {tab} />
                    </div>
                {/each}
            </div>
            <div class="flex flex-col  items-center">
                <button
                    class="w-10 h-10 relative flex items-center justify-center rounded-full bg-{profileColor}-500 leading-100"
                    on:click={profileModal?.open}
                >
                    <span class="text-12 text-center text-white uppercase">{profileInitial}</span>
                    {#if !$shouldOpenProfileModal && (!isBackupSafe || !$appVersionDetails.upToDate)}
                        <NotificationBadge />
                    {/if}
                </button>
            </div>
        </nav>
        <ProfileActionsModal bind:modal={profileModal} />
    </aside>
{/if}

<style type="text/scss">
    :global(body.platform-win32) aside {
        @apply -top-0;
        @apply pt-10;
    }
    .menu-button {
        position: absolute;
        top: calc(env(safe-area-inset-top) * 2.2);
        right: 30px;
    }
    header {
        position: sticky;
        top: 0;
        padding-top: calc(env(safe-area-inset-top) * 2.2);
        z-index: 10;
    }
</style>
