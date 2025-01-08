<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userAuth } from '$lib/config';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<div class="flex min-h-screen flex-col">
	<div class="navbar border-b bg-base-100">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost gap-2 text-xl"> KitStarter </a>
		</div>
		{#if userAuth}
			<div class="flex-none">
				{#if session}
					<a href="/private" class="btn btn-ghost">Dashboard</a>
				{:else}
					<a href="/auth" class="btn btn-primary">Sign In</a>
				{/if}
			</div>
		{/if}
	</div>

	<div class="flex-1">
		{@render children()}
	</div>
</div>
