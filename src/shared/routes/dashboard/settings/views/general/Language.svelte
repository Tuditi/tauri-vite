<script lang="ts">
    import { Dropdown, Text } from 'shared/components'
    import { appSettings } from '@core/app'
    import { SUPPORTED_LOCALES, localize, setLanguage } from '@core/i18n'
    import { refreshBalanceOverview } from 'shared/lib/wallet'

    $: languageList = Object.values(SUPPORTED_LOCALES).map((locale) => ({ value: locale, label: locale }))

    const handleLanguage = (item) => {
        setLanguage(item)
        refreshBalanceOverview()
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.language.title')}</Text>
<Dropdown
    sortItems={true}
    onSelect={handleLanguage}
    value={SUPPORTED_LOCALES[$appSettings.language]}
    items={languageList}
/>
