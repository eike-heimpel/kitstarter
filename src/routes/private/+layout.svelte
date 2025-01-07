<script lang="ts">
	import { invalidateAll, goto } from '$app/navigation';
	let { data, children } = $props();
	let { supabase, session } = $derived(data);

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error logging out:', error.message);
		}
		invalidateAll();
	}
</script>

<div class="flex min-h-screen bg-base-200/50">
	<!-- Sidebar -->
	<aside
		class="fixed bottom-0 left-0 top-0 z-50 hidden w-72 transform bg-base-100 shadow-2xl transition-transform lg:block"
	>
		<div class="flex h-full flex-col p-6">
			<!-- Logo -->
			<div class="mb-8">
				<a href="/" class="font-display text-2xl">
					<span class="text-primary">Kit</span>
					<span class="text-secondary">Starter</span>
				</a>
			</div>

			<!-- User profile -->
			<div class="mb-8 rounded-box bg-base-200 p-6 text-center">
				<div class="avatar placeholder online mb-4">
					<div
						class="w-20 rounded-full bg-primary text-primary-content ring ring-secondary ring-offset-2"
					>
						<span class="text-3xl">{session?.user?.email?.charAt(0).toUpperCase()}</span>
					</div>
				</div>
				<div class="truncate text-lg font-medium">{session?.user?.email}</div>
				<div class="mt-2 text-sm text-base-content/70">Welcome back!</div>
			</div>

			<!-- Navigation -->
			<nav class="flex-1">
				<ul class="menu gap-2 rounded-box bg-base-200 p-4">
					<li>
						<a href="/private" class="hover-lift active:!bg-primary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
								/>
							</svg>
							Dashboard
						</a>
					</li>
					<li>
						<a href="/private/user" class="hover-lift active:!bg-primary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/>
							</svg>
							Profile
						</a>
					</li>
				</ul>
			</nav>

			<!-- Logout button -->
			<button class="btn btn-outline mt-6 gap-2 hover:btn-error" on:click={handleLogout}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
					/>
				</svg>
				Logout
			</button>
		</div>
	</aside>

	<!-- Mobile navigation -->
	<div class="navbar sticky top-0 z-40 bg-base-100 shadow-md lg:hidden">
		<div class="flex-1">
			<button class="btn btn-ghost text-lg">
				<span class="text-primary">Kit</span>
				<span class="text-secondary">Starter</span>
			</button>
		</div>
		<div class="flex-none">
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="avatar btn btn-circle btn-ghost">
					<div class="w-10 rounded-full bg-primary text-primary-content">
						<span class="text-lg">{session?.user?.email?.charAt(0).toUpperCase()}</span>
					</div>
				</div>
				<ul
					tabindex="0"
					class="menu dropdown-content menu-sm z-50 mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
				>
					<li><a href="/private">Dashboard</a></li>
					<li><a href="/private/user">Profile</a></li>
					<li><button on:click={handleLogout}>Logout</button></li>
				</ul>
			</div>
		</div>
	</div>

	<!-- Main content -->
	<main class="flex-1 px-4 pb-8 pt-4 lg:ml-72">
		<div class="container mx-auto">
			{@render children()}
		</div>
	</main>
</div>
