<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

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

<div class="flex min-h-screen flex-col" data-theme="playful">
	<div class="navbar bg-base-100 shadow-md">
		<div class="flex-1">
			<a href="/" class="font-display hover-lift btn btn-ghost gap-2 text-2xl">
				<span class="text-primary">Kit</span>
				<span class="text-secondary">Starter</span>
			</a>
		</div>
		<div class="flex-none gap-2">
			{#if session}
				<a href="/private" class="btn btn-ghost btn-outline hover:btn-secondary">Dashboard</a>
			{:else}
				<a href="/auth" class="btn btn-primary">Sign In</a>
			{/if}
		</div>
	</div>

	<div class="flex-1 bg-base-100/50 p-4">
		<div class="container mx-auto">
			{@render children()}
		</div>
	</div>

	<footer class="footer footer-center bg-base-200 p-4 text-base-content">
		<div>
			<p class="text-shadow">Made with 💖 using SvelteKit</p>
		</div>
	</footer>
</div>
