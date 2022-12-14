<script lang="ts">
    import { Icon, Text, Tooltip } from 'shared/components'
    import { appSettings } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        getFormattedMinimumRewards,
        getTimeUntilMinimumAirdropReward,
        getUnstakedFunds,
        hasAccountReachedMinimumAirdrop,
        isAccountStaked,
        isStakingPossible,
    } from 'shared/lib/participation/staking'
    import {
        assemblyStakingEventState,
        assemblyStakingRemainingTime,
        isPartiallyStaked,
        participationOverview,
        selectedAccountParticipationOverview,
        shimmerStakingEventState,
        stakedAccounts,
    } from 'shared/lib/participation/stores'
    import { ParticipationEventState, StakingAirdrop } from 'shared/lib/participation/types'
    import { openPopup } from 'shared/lib/popup'
    import { getBestTimeDuration } from 'shared/lib/time'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { capitalize } from 'shared/lib/utils'
    import { selectedAccount, IAccountState } from '@core/account'
    import { IAsset } from '@core/wallet'

    export let asset: IAsset

    type TooltipText = {
        title: string
        body: string[]
    }

    const airdrop = StakingAirdrop.Assembly
    const isAssembly = airdrop === StakingAirdrop.Assembly
    let stakingEventState = ParticipationEventState.Inactive
    $: stakingEventState = isAssembly ? $assemblyStakingEventState : $shimmerStakingEventState

    let isBelowMinimumRewards: boolean
    let showTooltip = false
    let tooltipAnchor: HTMLElement
    let tooltipText: TooltipText
    let remainingTime: number

    const FIAT_PLACEHOLDER = '---'

    $: isDarkModeEnabled = $appSettings.darkMode
    $: isPartiallyStakedAndCanStake = $isPartiallyStaked && isStakingPossible(stakingEventState)
    $: hasStakingEnded = stakingEventState === ParticipationEventState.Ended
    $: $participationOverview, (tooltipText = getLocalizedTooltipText())
    $: remainingTime = asset?.metadata.name === 'Assembly' ? $assemblyStakingRemainingTime : 0
    $: {
        if (hasAccountReachedMinimumAirdrop() && !isStakingPossible(stakingEventState)) {
            isBelowMinimumRewards = false
        } else {
            isBelowMinimumRewards =
                $selectedAccountParticipationOverview?.[`${airdrop}RewardsBelowMinimum`] > 0 &&
                $selectedAccountParticipationOverview?.[`${airdrop}Rewards`] <= 0
        }
    }
    $: showWarningState =
        isPartiallyStakedAndCanStake ||
        (isBelowMinimumRewards && !getAccount($stakedAccounts) && isStakingPossible(stakingEventState)) ||
        (isBelowMinimumRewards && hasStakingEnded)

    function toggleTooltip(): void {
        showTooltip = !showTooltip
    }

    function handleTileClick(): void {
        openPopup({ type: 'airdropNetworkInfo', props: { airdrop } })
    }

    function getAccount(accounts: IAccountState[]): IAccountState {
        return accounts?.find((account) => account.getAlias() === $selectedAccount?.getAlias())
    }

    function getLocalizedTooltipText(): TooltipText {
        if (isPartiallyStakedAndCanStake) {
            return {
                title: localize('tooltips.partiallyStakedFunds.title', {
                    values: { amount: formatUnitBestMatch(getUnstakedFunds()) },
                }),
                body: [localize('tooltips.partiallyStakedFunds.body')],
            }
        } else if (isBelowMinimumRewards) {
            const minimumRewards = getFormattedMinimumRewards(airdrop)
            if (hasStakingEnded) {
                return {
                    title: localize('tooltips.stakingMinRewards.title'),
                    body: [
                        localize('tooltips.stakingMinRewards.bodyDidNotReachMin', {
                            values: {
                                airdrop: capitalize(airdrop),
                                airdropRewardMin: minimumRewards,
                            },
                        }),
                    ],
                }
            } else if (!isAccountStaked($selectedAccount?.id) && isStakingPossible(stakingEventState)) {
                const timeNeeded = getTimeUntilMinimumAirdropReward(airdrop)
                const _getBody = () => {
                    if (timeNeeded) {
                        const body = localize('tooltips.stakingMinRewards.bodyBelowMin', {
                            values: {
                                airdrop: capitalize(airdrop),
                                airdropRewardMin: minimumRewards,
                            },
                        })
                        if (timeNeeded > remainingTime) {
                            return [body, localize('tooltips.stakingMinRewards.bodyWillNotReachMin')]
                        } else {
                            return [
                                body,
                                localize('tooltips.stakingMinRewards.bodyWillReachMin', {
                                    values: { duration: getBestTimeDuration(remainingTime) },
                                }),
                            ]
                        }
                    }
                    return []
                }
                return {
                    title: localize('tooltips.stakingMinRewards.title'),
                    body: _getBody(),
                }
            }
        }
    }
</script>

<button
    style="--asset-color: {asset?.metadata.primaryColor}"
    class="w-full flex flex-row justify-between items-center space-x-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 p-4 rounded-2xl airdrop"
    class:darkmode={isDarkModeEnabled}
    on:click={handleTileClick}
>
    <div class="flex flex-row items-center space-x-4">
        <div class="icon h-8 w-8 rounded-full flex items-center justify-center p-1">
            <Icon classes="text-gray-900" icon={asset?.metadata.name?.toLocaleLowerCase()} height="100%" width="100%" />
        </div>
        <div class="flex flex-col flex-wrap space-y-1 text-left">
            <div class="flex flex-row items-center space-x-1">
                <Text classes="font-semibold">{asset?.metadata.name}</Text>
                {#if showWarningState && tooltipText?.body.length > 0}
                    <div bind:this={tooltipAnchor} on:mouseenter={toggleTooltip} on:mouseleave={toggleTooltip}>
                        <Icon
                            icon="exclamation"
                            width="17"
                            height="17"
                            classes="fill-current text-yellow-600 group-hover:text-gray-900"
                        />
                    </div>
                {/if}
            </div>
            <Text secondary smaller>{asset?.fiatPrice ? asset?.fiatPrice : FIAT_PLACEHOLDER}</Text>
        </div>
    </div>
    <div class="flex flex-col flex-wrap space-y-1 text-right">
        <div class="flex flex-row">
            <Text classes="font-semibold">{asset?.balance.total}</Text>
        </div>
        <Text secondary smaller>{asset?.fiatBalance ? `??? ${asset?.fiatBalance}` : FIAT_PLACEHOLDER}</Text>
    </div>
</button>
{#if showTooltip && tooltipText?.body.length > 0}
    <Tooltip anchor={tooltipAnchor} position="right">
        <Text type="p" classes="text-gray-900 bold mb-2 text-left">{tooltipText?.title}</Text>
        {#each tooltipText?.body as paragraph}
            <Text
                type="p"
                secondary
                classes="text-left {tooltipText?.body.indexOf(paragraph) !== tooltipText?.body.length - 1 && 'mb-2'}"
            >
                {paragraph}
            </Text>
        {/each}
    </Tooltip>
{/if}

<style type="text/scss">
    .icon {
        background-color: var(--asset-color);
    }
</style>
