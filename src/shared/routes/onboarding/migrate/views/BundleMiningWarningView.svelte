<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { BundleMiningLayout, Button, Icon, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { Platform } from '@lib/platform'
    import { walletSetupType } from '@lib/wallet'
    import { SetupType } from '@lib/typings/setup'

    const legacyLedger = $walletSetupType === SetupType.TrinityLedger
    const dispatch = createEventDispatcher()

    function handleContinueClick(): void {
        dispatch('next')
    }

    function handleBackClick(): void {
        dispatch('previous')
    }
</script>

<!-- TODO: missing mobile -->
<BundleMiningLayout
    onBackClick={handleBackClick}
    showLedgerProgress={legacyLedger}
    showLedgerVideoButton={legacyLedger}
>
    <div slot="icon_boxed">
        <div class="flex justify-center items-center rounded-2xl w-12 h-12 bg-orange-600 shadow-lg">
            <Icon boxed="true" icon="warning-filled" classes="text-white" />
        </div>
    </div>
    <div slot="box_content">
        <Text type="h2" classes="mb-5 text-center">{localize('views.bundleMiningWarning.title')}</Text>
        <Text type="p" secondary classes="mb-4 text-center">{localize('views.bundleMiningWarning.body1')}</Text>
        <Text type="p" secondary classes="mb-8 text-center">{localize('views.bundleMiningWarning.body2')}</Text>
        <div class="flex flex-col flex-grow items-center">
            <Button
                secondary
                classes="w-56"
                onClick={() => Platform.openUrl('https://firefly.iota.org/faq#spent-addresses')}
            >
                {localize('views.bundleMiningWarning.learn')}
            </Button>
        </div>
    </div>
    <div slot="actions">
        <Button classes="w-64 my-8" onClick={handleContinueClick}>{localize('actions.continue')}</Button>
    </div>
</BundleMiningLayout>
