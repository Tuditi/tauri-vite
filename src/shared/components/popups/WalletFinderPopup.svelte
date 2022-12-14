<script lang="ts">
    import { Button, KeyValueBox, Spinner, Text, TextHint } from 'shared/components'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { showAppNotification } from 'shared/lib/notifications'
    import { displayNotificationForLedgerProfile, isLedgerConnected } from 'shared/lib/ledger'
    import { localize } from '@core/i18n'
    import {
        activeAccounts,
        activeProfile,
        INITIAL_ACCOUNT_GAP_LIMIT,
        INITIAL_ADDRESS_GAP_LIMIT,
        isLedgerProfile,
        isSoftwareProfile,
        recoverAndLoadAccounts,
        visibleActiveAccounts,
    } from '@core/profile'
    import { formatTokenAmountBestMatch } from '@core/wallet'
    import { BASE_TOKEN } from '@core/network'
    import { sumBalanceForAccounts } from '@core/account'
    import { FontWeightText } from '../Text.svelte'

    export let searchForBalancesOnLoad = false

    const { isStrongholdLocked, type } = $activeProfile

    const accountGapLimitIncrement = INITIAL_ACCOUNT_GAP_LIMIT[type]
    const addressGapLimitIncrement = INITIAL_ADDRESS_GAP_LIMIT[type]
    let previousAccountGapLimit = 0
    let previousAddressGapLimit = 0
    let currentAccountGapLimit = accountGapLimitIncrement
    let currentAddressGapLimit = addressGapLimitIncrement
    let error = ''
    let isBusy = false
    let hasUsedWalletFinder = false

    $: searchForBalancesOnLoad && !$isStrongholdLocked && handleFindBalances()
    $: totalBalance = sumBalanceForAccounts($visibleActiveAccounts)

    async function handleFindBalances() {
        if ($isSoftwareProfile && $isStrongholdLocked) {
            openPopup({
                type: 'password',
                props: {
                    onSuccess: function () {
                        openPopup({
                            type: 'walletFinder',
                            props: { searchForBalancesOnLoad: true },
                        })
                    },
                    onCancelled: function () {
                        openPopup({
                            type: 'walletFinder',
                        })
                    },
                },
            })
        } else {
            try {
                error = ''
                isBusy = true

                if ($isLedgerProfile && !isLedgerConnected()) {
                    isBusy = false

                    displayNotificationForLedgerProfile('warning')

                    return
                }

                await recoverAndLoadAccounts(currentAccountGapLimit, currentAddressGapLimit)

                previousAccountGapLimit = currentAccountGapLimit
                previousAddressGapLimit = currentAddressGapLimit
                currentAccountGapLimit += accountGapLimitIncrement
                currentAddressGapLimit += addressGapLimitIncrement
                hasUsedWalletFinder = true
            } catch (err) {
                error = localize(err.error)

                if ($isLedgerProfile) {
                    displayNotificationForLedgerProfile('error', true, true, false, false, err)
                } else {
                    showAppNotification({
                        type: 'error',
                        message: localize(err.error),
                    })
                }
            } finally {
                isBusy = false
            }
        }
    }

    function handleCancelClick() {
        closePopup()
    }
</script>

<Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeightText.semibold} classes="mb-6"
    >{localize('popups.walletFinder.title')}</Text
>

<div class="space-y-4">
    <Text type="p" color="gray-600" fontSize="15" lineHeight="5">{localize('popups.walletFinder.body')}</Text>

    <div class="w-full flex-col space-y-2">
        <KeyValueBox
            keyText={localize('popups.walletFinder.accountsSearched')}
            valueText={previousAccountGapLimit || '-'}
        />
        <KeyValueBox
            keyText={localize('popups.walletFinder.accountsFound')}
            valueText={$activeAccounts.length || '0'}
        />
        <KeyValueBox
            keyText={localize('popups.walletFinder.totalWalletBalance')}
            valueText={formatTokenAmountBestMatch(totalBalance, BASE_TOKEN[$activeProfile.networkProtocol])}
        />
    </div>

    {#if true}
        <TextHint warning text={localize('popups.walletFinder.searchAgainHint')} />
    {/if}
</div>

<div class="flex flex-row flex-nowrap w-full space-x-4 mt-6">
    <Button classes="w-full" secondary onClick={handleCancelClick} disabled={isBusy}>
        {localize('actions.cancel')}
    </Button>
    <Button classes="w-full" onClick={handleFindBalances} disabled={isBusy}>
        {#if isBusy}
            <Spinner busy={true} message={localize('actions.searching')} classes="justify-center" />
        {:else if hasUsedWalletFinder}
            {localize('actions.searchAgain')}
        {:else}
            {localize('actions.search')}
        {/if}
    </Button>
</div>
