<script lang="ts">
    import { localize } from '@core/i18n'
    import { openPopup } from '@lib/popup'
    import { OnboardingButton } from 'shared/components/atoms'

    function handleSendClick() {
        openPopup({
            type: 'sendForm',
            overflow: true,
        })
    }
</script>

<OnboardingButton
    primaryText={localize('general.sendFunds')}
    secondaryText={localize('general.sendTokensToAddress')}
    onClick={handleSendClick}
/>
