<script lang="ts">
    import { Text } from 'shared/components'
    import { FontWeightText, TextType } from 'shared/components/Text.svelte'
    import { ITokenMetadata, formatTokenAmountBestMatch, formatTokenAmountPrecise } from '@core/wallet'

    export let amount = 0
    export let tokenMetadata: ITokenMetadata

    let showPreciseValue = false
    function togglePreciseValue() {
        showPreciseValue = !showPreciseValue
    }
</script>

{#if amount}
    <button on:click={togglePreciseValue}>
        <Text type={TextType.h1} fontWeight={FontWeightText.semibold}>
            {showPreciseValue
                ? formatTokenAmountPrecise(amount, tokenMetadata)
                : formatTokenAmountBestMatch(amount, tokenMetadata)}
        </Text>
    </button>
{/if}
