<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import { Animation, Button, ImportTextfield, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { importType, isGettingMigrationData } from '@contexts/onboarding'

    const dispatch = createEventDispatcher()

    let input = ''

    function handleContinueClick(): void {
        dispatch('next', { migrationSeed: input })
    }

    function handleBackClick(): void {
        if (!$isGettingMigrationData) {
            dispatch('previous')
        }
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{localize(`views.importFromText.${$importType}.title`)}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize(`views.importFromText.${$importType}.body`)}</Text>
        <Text type="h5" classes="mb-3">{localize(`views.importFromText.${$importType}.enter`)}</Text>
        <ImportTextfield disabled={$isGettingMigrationData} type={$importType} bind:value={input} />
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button classes="flex-1" disabled={input.length === 0 || $isGettingMigrationData} onClick={handleContinueClick}>
            {#if $isGettingMigrationData}
                <Spinner
                    busy={$isGettingMigrationData}
                    message={localize('views.migrate.restoringWallet')}
                    classes="justify-center"
                />
            {:else}{localize('actions.continue')}{/if}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-from-text-desktop" />
    </div>
</OnboardingLayout>
