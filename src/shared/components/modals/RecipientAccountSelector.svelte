<script lang="ts">
    import { IAccountState, selectedAccount } from '@core/account'
    import { visibleActiveAccounts } from '@core/profile'
    import { AccountLabel, Modal, Text } from 'shared/components'
    import { TextType } from 'shared/components/Text.svelte'
    import { truncateString } from 'shared/lib/helpers'
    import { fade } from 'svelte/transition'

    export let modal: Modal
    export let searchValue: string
    export let selected: IAccountState
    export let disableOnClickOutside: boolean = false

    $: otherAccounts = $visibleActiveAccounts?.filter((account) => account.id !== $selectedAccount.id)
    $: filteredAccounts = otherAccounts?.filter(
        (account) =>
            account.name.toLowerCase().includes(searchValue?.toLowerCase() ?? '') ||
            account.depositAddress.toLowerCase().includes(searchValue?.toLowerCase() ?? '')
    )

    function onClick(_selected: IAccountState): void {
        modal?.close()
        selected = _selected
    }
</script>

{#if filteredAccounts?.length > 0}
    <Modal {disableOnClickOutside} bind:this={modal} position={{ left: '0', top: '100%' }} classes="w-full p-4">
        <recipient-account-picker-modal
            class="max-h-64 flex flex-col space-y-1 scrollable-y"
            in:fade={{ duration: 100 }}
        >
            {#each filteredAccounts as account}
                <button
                    on:click={() => onClick(account)}
                    class="w-full flex flex-row flex-1 justify-between px-2 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-20"
                >
                    <AccountLabel {account} />
                    <Text type={TextType.pre} fontSize="sm" color="gray-600"
                        >{truncateString(account?.depositAddress, 10, 10)}</Text
                    >
                </button>
            {/each}
        </recipient-account-picker-modal>
    </Modal>
{/if}
