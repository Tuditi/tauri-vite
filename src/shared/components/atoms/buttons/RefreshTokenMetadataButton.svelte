<script lang="ts">
    import { localize } from '@core/i18n'
    import { refreshAccountAssetsForActiveProfile } from '@core/wallet'
    import { showAppNotification } from '@lib/notifications'
    import { closePopup, openPopup } from '@lib/popup'
    import { OnboardingButton } from 'shared/components'

    function refreshTokenMetadata() {
        refreshAccountAssetsForActiveProfile(true)
        showAppNotification({
            type: 'success',
            message: localize('notifications.refreshTokenMetadata.success'),
            alert: true,
        })
        closePopup()
    }

    function handleRefreshTokenMetadata() {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('actions.refreshTokenMetadata'),
                hint: localize('general.refreshTokenMetadataHint'),
                warning: true,
                confirmText: localize('actions.reset'),
                onConfirm: refreshTokenMetadata,
            },
        })
    }
</script>

<OnboardingButton
    primaryText={localize('actions.refreshTokenMetadata')}
    secondaryText={localize('general.refreshTokenMetadataDescription')}
    onClick={handleRefreshTokenMetadata}
/>
