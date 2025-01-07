<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-base-200">
	<!-- Hero Section -->
	<div class="hero min-h-[60vh] bg-base-100">
		<div class="hero-content text-center">
			<div class="max-w-3xl">
				<h1 class="mb-8 text-5xl font-bold">KitStarter Template</h1>
				<p class="mb-8 text-xl">
					A production-ready SvelteKit template with authentication, TypeScript, and modern styling
				</p>
				<button class="btn btn-primary btn-lg" on:click={() => goto('/auth')}>
					Get Started →
				</button>
			</div>
		</div>
	</div>

	<!-- Features Section -->
	<div class="px-4 py-20">
		<div class="mx-auto max-w-6xl">
			<h2 class="mb-12 text-center text-3xl font-bold">Built With Modern Stack</h2>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<!-- SvelteKit -->
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body">
						<h3 class="card-title">SvelteKit</h3>
						<p>Full-stack framework with server-side rendering and API routes</p>
					</div>
				</div>

				<!-- Authentication -->
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body">
						<h3 class="card-title">Authentication Ready</h3>
						<p>Secure authentication system with protected routes</p>
					</div>
				</div>

				<!-- DaisyUI/Tailwind -->
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body">
						<h3 class="card-title">Modern Styling</h3>
						<p>DaisyUI components with Tailwind CSS for rapid development</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Getting Started Section -->
	<div class="bg-base-100 px-4 py-20">
		<div class="mx-auto max-w-3xl text-center">
			<h2 class="mb-8 text-3xl font-bold">Use This Template</h2>
			<div class="mockup-code mb-8 text-left">
				<pre data-prefix="$"><code>git clone https://github.com/yourusername/kitstarter.git</code
					></pre>
				<pre data-prefix="$"><code>cd kitstarter</code></pre>
				<pre data-prefix="$"><code>npm install</code></pre>
				<pre data-prefix="$"><code>npm run dev</code></pre>
			</div>
			<p class="text-lg opacity-80">
				Clone the repository, install dependencies, and start building your next project with a
				solid foundation.
			</p>
		</div>
	</div>
</div>
