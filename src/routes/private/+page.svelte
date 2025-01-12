<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionResult, SubmitFunction } from '@sveltejs/kit';
	import NotificationToast from '$lib/components/NotificationToast.svelte';
	import { addToast } from '$lib/components/toastStore';

	type FormActionResult = ActionResult & {
		type: 'success' | 'failure';
		data?: { error?: string };
	};

	let { data } = $props();
	let { session } = $derived(data);

	let showPasswordForm = $state(false);

	const userStats = {
		joinedDate: new Date(session?.user?.created_at || Date.now()).toLocaleDateString(),
		lastLogin: new Date(session?.user?.last_sign_in_at || Date.now()).toLocaleDateString(),
		accountType: session?.user?.role || 'Free Plan',
		userId: session?.user?.id || 'N/A'
	};

	const userMetadata = session?.user?.user_metadata || {};

	async function handleSignOut() {
		const response = await fetch('/auth/signout', { method: 'POST' });
		if (!response.ok) console.error('Error signing out');
	}
</script>

<NotificationToast />

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<!-- Profile Header -->
	<div class="card mb-6 bg-base-100 shadow">
		<div class="card-body">
			<div class="flex items-center space-x-4">
				<div class="avatar placeholder">
					<div class="w-16 rounded-full bg-base-300">
						{#if userMetadata.avatar_url}
							<img
								src={userMetadata.avatar_url}
								alt="Profile"
								class="h-full w-full rounded-full object-cover"
							/>
						{:else}
							<span class="text-2xl">{session?.user?.email?.[0].toUpperCase()}</span>
						{/if}
					</div>
				</div>
				<div>
					<h1 class="text-2xl font-bold">
						Welcome back{#if userMetadata.full_name}, {userMetadata.full_name}{/if}!
					</h1>
					<p class="text-base-content/70">{session?.user?.email}</p>
					{#if session?.user?.phone}
						<p class="text-sm text-base-content/60">{session.user.phone}</p>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- User Stats -->
	<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
		<div class="card bg-base-100 shadow">
			<div class="card-body">
				<h3 class="text-sm font-medium text-base-content/70">Member Since</h3>
				<p class="text-2xl font-semibold">{userStats.joinedDate}</p>
			</div>
		</div>
		<div class="card bg-base-100 shadow">
			<div class="card-body">
				<h3 class="text-sm font-medium text-base-content/70">Last Login</h3>
				<p class="text-2xl font-semibold">{userStats.lastLogin}</p>
			</div>
		</div>
		<div class="card bg-base-100 shadow">
			<div class="card-body">
				<h3 class="text-sm font-medium text-base-content/70">Account Type</h3>
				<p class="text-2xl font-semibold">{userStats.accountType}</p>
			</div>
		</div>
		<div class="card bg-base-100 shadow">
			<div class="card-body">
				<h3 class="text-sm font-medium text-base-content/70">User ID</h3>
				<p class="truncate text-2xl font-semibold">{userStats.userId}</p>
			</div>
		</div>
	</div>

	<!-- Purchase Section -->
	<div class="card mb-6 bg-base-100 shadow">
		<div class="card-body">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-xl font-semibold">Upgrade Your Account</h2>
					<p class="text-base-content/70">
						Get access to premium features and support our development
					</p>
				</div>
				<a href="/private/purchase" class="btn btn-primary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
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
					View Plans
				</a>
			</div>
		</div>
	</div>

	<!-- Password Change Section -->
	<div class="mx-auto max-w-lg">
		<button class="btn btn-primary w-full" on:click={() => (showPasswordForm = !showPasswordForm)}>
			{showPasswordForm ? 'Hide Password Form' : 'Change Password'}
		</button>

		{#if showPasswordForm}
			<div class="card mt-4 bg-base-100 shadow">
				<div class="card-body">
					<form
						method="POST"
						action="?/changePassword"
						use:enhance={() => {
							return async ({ result }) => {
								const formResult = result as FormActionResult;
								if (formResult.type === 'failure') {
									addToast(formResult.data?.error || 'Failed to change password', 'error');
								} else {
									addToast('Password changed successfully', 'success');
									showPasswordForm = false;
								}
							};
						}}
						class="space-y-4"
					>
						<div class="form-control w-full">
							<label class="label" for="currentPassword">
								<span class="label-text">Current Password</span>
							</label>
							<input
								type="password"
								name="currentPassword"
								id="currentPassword"
								class="input input-bordered w-full"
								required
								minlength="6"
							/>
						</div>

						<div class="form-control w-full">
							<label class="label" for="newPassword">
								<span class="label-text">New Password</span>
							</label>
							<input
								type="password"
								name="newPassword"
								id="newPassword"
								class="input input-bordered w-full"
								required
								minlength="6"
							/>
						</div>

						<div class="form-control w-full">
							<label class="label" for="confirmPassword">
								<span class="label-text">Confirm New Password</span>
							</label>
							<input
								type="password"
								name="confirmPassword"
								id="confirmPassword"
								class="input input-bordered w-full"
								required
								minlength="6"
							/>
						</div>

						<button type="submit" class="btn btn-primary w-full">Change Password</button>
					</form>
				</div>
			</div>
		{/if}
	</div>
</div>
