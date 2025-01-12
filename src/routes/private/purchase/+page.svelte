<script>
	import { onMount } from 'svelte';

	onMount(() => {
		// Load Lemon Squeezy script dynamically
		const script = document.createElement('script');
		script.src = 'https://assets.lemonsqueezy.com/lemon.js';
		script.defer = true;
		document.body.appendChild(script);
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-base-200 p-4">
	<div class="card w-96 bg-base-100 shadow-xl">
		<div class="card-body items-center text-center">
			<h2 class="card-title mb-4">Purchase Test Product</h2>
			<a
				href="https://moog.lemonsqueezy.com/buy/f3d6235d-f260-4217-9d2a-a10460f3d320?embed=1"
				class="lemonsqueezy-button btn btn-primary btn-lg gap-2 transition-all duration-200 hover:brightness-110"
			>
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
						d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
					/>
				</svg>
				Buy Test Product
			</a>
			<div class="mt-4">
				<a
					href="https://moog.lemonsqueezy.com/billing"
					class="link link-primary text-sm hover:underline"
					target="_blank"
					rel="noopener noreferrer"
				>
					Visit Your Customer Portal
				</a>
			</div>
		</div>
	</div>
</div>
