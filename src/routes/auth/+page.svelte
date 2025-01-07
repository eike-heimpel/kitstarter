<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
	let activeTab = 'login';
</script>

<div class="flex min-h-[80vh] items-center justify-center">
	<div class="w-full max-w-md rounded-lg bg-base-200 p-8 shadow-xl">
		{#if form?.error}
			<div class="alert alert-error mb-4">
				<span>{form.error}</span>
			</div>
		{/if}
		{#if form?.message}
			<div class="alert alert-success mb-4">
				<span>{form.message}</span>
			</div>
		{/if}

		<div class="tabs-boxed tabs mb-6">
			<button
				class="tab {activeTab === 'login' ? 'tab-active' : ''}"
				on:click={() => (activeTab = 'login')}>Login</button
			>
			<button
				class="tab {activeTab === 'signup' ? 'tab-active' : ''}"
				on:click={() => (activeTab = 'signup')}>Sign up</button
			>
		</div>

		{#if activeTab === 'login'}
			<div class="space-y-6">
				<form method="POST" class="space-y-4" action="?/login">
					<div class="form-control">
						<label class="label" for="login-email">
							<span class="label-text">Email</span>
						</label>
						<input
							id="login-email"
							name="email"
							type="email"
							required
							class="input input-bordered w-full"
							placeholder="your@email.com"
						/>
					</div>

					<div class="form-control">
						<label class="label" for="login-password">
							<span class="label-text">Password</span>
						</label>
						<input
							id="login-password"
							name="password"
							type="password"
							required
							class="input input-bordered w-full"
							placeholder="••••••••"
						/>
					</div>

					<button class="btn btn-primary w-full">Login</button>
				</form>

				<div class="divider">OR</div>

				<form method="POST" action="?/magicLink" class="space-y-4">
					<div class="form-control">
						<input
							name="email"
							type="email"
							required
							class="input input-bordered w-full"
							placeholder="your@email.com"
						/>
					</div>
					<button class="btn btn-outline w-full">Login with Magic Link</button>
				</form>
			</div>
		{:else}
			<div class="space-y-6">
				<form method="POST" class="space-y-4" action="?/signup">
					<div class="form-control">
						<label class="label" for="signup-email">
							<span class="label-text">Email</span>
						</label>
						<input
							id="signup-email"
							name="email"
							type="email"
							required
							class="input input-bordered w-full"
							placeholder="your@email.com"
						/>
					</div>

					<div class="form-control">
						<label class="label" for="signup-password">
							<span class="label-text">Password</span>
						</label>
						<input
							id="signup-password"
							name="password"
							type="password"
							required
							class="input input-bordered w-full"
							placeholder="••••••••"
							minlength="6"
						/>
						<div class="label">
							<span class="label-text-alt">Must be at least 6 characters</span>
						</div>
					</div>

					<button class="btn btn-primary w-full">Sign up</button>
				</form>

				<div class="divider">OR</div>

				<form method="POST" action="?/magicLink" class="space-y-4">
					<div class="form-control">
						<input
							name="email"
							type="email"
							required
							class="input input-bordered w-full"
							placeholder="your@email.com"
						/>
					</div>
					<button class="btn btn-outline w-full">Sign up with Magic Link</button>
				</form>
			</div>
		{/if}
	</div>
</div>
