<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	let isMobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

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
	<div class="relative">
		<header class="sticky top-0 z-50 border-b bg-base-100/80 backdrop-blur-lg">
			<nav class="container mx-auto flex h-16 items-center justify-between px-4">
				<div class="flex items-center gap-12">
					<a href="/" class="text-xl font-semibold tracking-tight">roication</a>
					<div class="hidden items-center gap-8 md:flex">
						<a href="/ratgeber" class="text-base-content/70 hover:text-base-content">Ratgeber</a>
						<a href="/calculator" class="text-base-content/70 hover:text-base-content">Rechner</a>
						<a
							href="/expertenrechner"
							class="flex items-center gap-2 text-base-content/70 hover:text-base-content"
						>
							Expertenrechner
							<span class="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">Coming soon</span
							>
						</a>
					</div>
				</div>
				<div class="flex items-center">
					<button class="md:hidden" aria-label="Menu" onclick={toggleMobileMenu}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>
			</nav>
		</header>

		{#if isMobileMenuOpen}
			<div
				class="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm md:hidden"
				onclick={toggleMobileMenu}
				onkeydown={toggleMobileMenu}
				role="button"
				tabindex="0"
			>
				<div
					class="border-b bg-base-100 px-4 py-6 shadow-lg"
					onclick={(e) => e.stopPropagation()}
					onkeydown={(e) => e.stopPropagation()}
					role="presentation"
				>
					<div class="container mx-auto">
						<nav class="flex flex-col">
							<a
								href="/ratgeber"
								class="flex items-center border-b border-base-200 py-4 text-lg text-base-content/70 transition-colors hover:text-base-content active:text-base-content"
								onclick={toggleMobileMenu}
							>
								Ratgeber
							</a>
							<a
								href="/calculator"
								class="flex items-center border-b border-base-200 py-4 text-lg text-base-content/70 transition-colors hover:text-base-content active:text-base-content"
								onclick={toggleMobileMenu}
							>
								Rechner
							</a>
							<a
								href="/expertenrechner"
								class="flex items-center gap-2 py-4 text-lg text-base-content/70 transition-colors hover:text-base-content active:text-base-content"
								onclick={toggleMobileMenu}
							>
								Expertenrechner
								<span class="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary"
									>Coming soon</span
								>
							</a>
						</nav>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t bg-base-300 px-4 py-8 md:py-12">
		<div class="container mx-auto grid gap-8 text-center md:grid-cols-3 md:gap-12 md:text-left">
			<div>
				<h3 class="mb-3 font-medium md:mb-4">Über uns</h3>
				<p class="text-base-content/70">
					© {new Date().getFullYear()} roication.<br />All rights reserved.
				</p>
			</div>

			<div>
				<h3 class="mb-3 font-medium md:mb-4">Tools</h3>
				<div class="flex flex-col gap-1.5 md:gap-2">
					<a href="/calculator" class="text-base-content/70 hover:text-base-content"
						>Schnellrechner</a
					>
					<a href="/expertenrechner" class="text-base-content/70 hover:text-base-content"
						>Experten Rechner</a
					>
					<a href="/ratgeber" class="text-base-content/70 hover:text-base-content">Ratgeber</a>
				</div>
			</div>

			<div>
				<h3 class="mb-3 font-medium md:mb-4">Rechtliches</h3>
				<div class="flex flex-col gap-1.5 md:gap-2">
					<a href="/impressum" class="text-base-content/70 hover:text-base-content">Impressum</a>
					<a href="/datenschutz" class="text-base-content/70 hover:text-base-content">Datenschutz</a
					>
				</div>
			</div>
		</div>
	</footer>
</div>
