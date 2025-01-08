<script lang="ts">
	import { fly, fade, scale } from 'svelte/transition';
	import { toasts, removeToast } from './toastStore';

	const alertClasses = {
		success: 'alert-success',
		error: 'alert-error',
		info: 'alert-info',
		warning: 'alert-warning'
	};
</script>

{#if $toasts.length}
	<div class="toast toast-end z-50">
		{#each $toasts as toast (toast.id)}
			<div
				class="alert {alertClasses[
					toast.type
				]} h-auto min-h-0 rounded-lg px-4 py-2 text-sm shadow-md"
				in:fly|local={{ y: 30, duration: 400 }}
				out:fade|local={{ duration: 300 }}
				on:click={() => removeToast(toast.id)}
				role="alert"
			>
				<span class="opacity-90">{toast.message}</span>
			</div>
		{/each}
	</div>
{/if}

<style>
	.alert {
		backdrop-filter: blur(8px);
		transform-origin: right;
	}

	/* Make the alert colors more subtle */
	:global(.alert-success) {
		@apply bg-success/80 text-success-content/90;
	}
	:global(.alert-error) {
		@apply bg-error/80 text-error-content/90;
	}
	:global(.alert-info) {
		@apply bg-info/80 text-info-content/90;
	}
	:global(.alert-warning) {
		@apply bg-warning/80 text-warning-content/90;
	}
</style>
