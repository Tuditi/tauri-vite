<script lang="ts">
    import { localize } from '@core/i18n'
    import { openPopup } from '@lib/popup'

    function handleReceiveClick() {
        openPopup({
            type: 'receiveAddress',
        })
    }
</script>

<button
    class="action p-3 w-full text-center rounded-lg font-medium text-14 bg-blue-500 text-white"
    on:click={handleReceiveClick}
>
    {localize('actions.receive')}
</button>
