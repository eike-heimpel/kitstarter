<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	let { data } = $props();
	let { session, supabase } = $derived(data);

	// Mock user data
	const userStats = [
		{ label: 'Member Since', value: 'January 2024' },
		{ label: 'Projects Created', value: '8' },
		{ label: 'Tasks Completed', value: '47' },
		{ label: 'Contributions', value: '156' }
	];

	const preferences = [
		{ id: 'notifications', label: 'Email Notifications', enabled: true },
		{ id: 'darkMode', label: 'Dark Mode', enabled: false },
		{ id: 'newsletter', label: 'Weekly Newsletter', enabled: true }
	];

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error logging out:', error.message);
		}
		invalidateAll();
	}
</script>

<div class="space-y-6">
	<!-- Profile Header -->
	<div class="rounded-box bg-base-100 p-6 shadow-lg">
		<div class="flex flex-col items-center gap-6 sm:flex-row">
			<div class="avatar placeholder online">
				<div
					class="w-24 rounded-full bg-primary text-primary-content ring ring-secondary ring-offset-2"
				>
					<span class="text-3xl">{session?.user?.email?.charAt(0).toUpperCase()}</span>
				</div>
			</div>
			<div class="text-center sm:text-left">
				<h1 class="text-3xl font-bold">{session?.user?.email?.split('@')[0]}</h1>
				<p class="text-base-content/70">{session?.user?.email}</p>
				<div class="mt-4">
					<button class="hover-lift btn btn-primary">Edit Profile</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each userStats as stat}
			<div class="hover-lift card bg-base-100">
				<div class="card-body text-center">
					<h3 class="text-base font-medium text-base-content/70">{stat.label}</h3>
					<div class="text-2xl font-bold">{stat.value}</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Account Settings -->
	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Personal Information -->
		<div class="rounded-box bg-base-100 p-6 shadow-lg">
			<h2 class="mb-6 text-2xl font-bold">Personal Information</h2>
			<div class="space-y-4">
				<div class="form-control">
					<label class="label" for="displayName">
						<span class="label-text">Display Name</span>
					</label>
					<input
						type="text"
						id="displayName"
						class="input input-bordered"
						value={session?.user?.email?.split('@')[0]}
					/>
				</div>
				<div class="form-control">
					<label class="label" for="bio">
						<span class="label-text">Bio</span>
					</label>
					<textarea
						id="bio"
						class="textarea textarea-bordered h-24"
						placeholder="Tell us about yourself..."
					></textarea>
				</div>
				<button class="btn btn-primary">Save Changes</button>
			</div>
		</div>

		<!-- Preferences -->
		<div class="rounded-box bg-base-100 p-6 shadow-lg">
			<h2 class="mb-6 text-2xl font-bold">Preferences</h2>
			<div class="space-y-4">
				{#each preferences as pref}
					<div class="flex items-center justify-between rounded-lg bg-base-200 p-4">
						<span class="font-medium">{pref.label}</span>
						<input type="checkbox" class="toggle toggle-primary" checked={pref.enabled} />
					</div>
				{/each}
			</div>
		</div>

		<!-- Connected Accounts -->
		<div class="rounded-box bg-base-100 p-6 shadow-lg">
			<h2 class="mb-6 text-2xl font-bold">Connected Accounts</h2>
			<div class="space-y-4">
				<button class="btn btn-outline w-full justify-start gap-2">
					<span class="text-xl">🐙</span>
					Connect GitHub
				</button>
				<button class="btn btn-outline w-full justify-start gap-2">
					<span class="text-xl">🐦</span>
					Connect Twitter
				</button>
				<button class="btn btn-outline w-full justify-start gap-2">
					<span class="text-xl">💼</span>
					Connect LinkedIn
				</button>
			</div>
		</div>

		<!-- Danger Zone -->
		<div class="rounded-box border-2 border-error bg-base-100 p-6">
			<h2 class="mb-6 text-2xl font-bold text-error">Danger Zone</h2>
			<div class="space-y-4">
				<div class="flex items-center justify-between gap-4">
					<div>
						<h3 class="font-medium">Logout from Account</h3>
						<p class="text-sm text-base-content/70">Sign out from your current session</p>
					</div>
					<button class="hover-lift btn btn-outline btn-error" on:click={handleLogout}>
						Logout
					</button>
				</div>
				<div class="my-4 border-t border-base-300"></div>
				<div class="flex items-center justify-between gap-4">
					<div>
						<h3 class="font-medium">Delete Account</h3>
						<p class="text-sm text-base-content/70">
							Once you delete your account, there is no going back. Please be certain.
						</p>
					</div>
					<button class="hover-lift btn btn-error">Delete</button>
				</div>
			</div>
		</div>
	</div>
</div>
