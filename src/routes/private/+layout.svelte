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

<div class="drawer min-h-screen lg:drawer-open">
	<input id="drawer-toggle" type="checkbox" class="drawer-toggle" />

	<div class="drawer-content flex flex-col">
		<!-- Top navigation bar -->
		<div class="navbar bg-base-100 lg:hidden">
			<div class="flex-none">
				<label for="drawer-toggle" class="btn btn-square btn-ghost drawer-button">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="inline-block h-5 w-5 stroke-current"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						></path>
					</svg>
				</label>
			</div>
			<div class="flex-1">
				<span class="text-xl font-semibold">Dashboard</span>
			</div>
			<div class="flex-none">
				<button class="btn btn-square btn-ghost" on:click={handleLogout}>
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
				</button>
			</div>
		</div>

		<!-- Page content -->
		<main class="flex-1 p-4">
			{@render children()}
		</main>
	</div>

	<!-- Side navigation -->
	<div class="drawer-side">
		<label for="drawer-toggle" aria-label="close sidebar" class="drawer-overlay"></label>
		<div class="min-h-full w-80 bg-base-200 p-4 text-base-content">
			<!-- User profile -->
			<div class="mb-6 flex items-center gap-4 rounded-lg bg-base-100 p-4">
				<div class="avatar placeholder">
					<div class="w-12 rounded-full bg-neutral text-neutral-content">
						<span class="text-xl">{session?.user?.email?.charAt(0).toUpperCase()}</span>
					</div>
				</div>
				<div class="flex-1 truncate">
					<div class="font-medium">{session?.user?.email}</div>
				</div>
			</div>

			<!-- Navigation -->
			<ul class="menu rounded-box">
				<li>
					<button on:click={() => goto('/private')} class="btn btn-primary"> Dashboard </button>
				</li>
			</ul>

			<!-- Logout button -->
			<div class="mt-auto pt-6">
				<button class="btn btn-outline btn-block" on:click={handleLogout}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-2 h-5 w-5"
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
		</div>
	</div>
</div>
