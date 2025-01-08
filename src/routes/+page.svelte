<script lang="ts">
	import { topPosts } from './ratgeber/data';
</script>

<div class="mx-auto max-w-[1400px] px-4">
	<!-- Hero Section -->
	<section class="grid items-center gap-8 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
		<div class="max-w-xl">
			<h1 class="mb-6 text-4xl font-bold tracking-tight text-base-content lg:text-5xl">
				Urlaub machen und Geld verdienen.
			</h1>
			<p class="mb-8 text-lg text-base-content/70 lg:text-xl">
				Wir helfen dir dabei, die Rentabilität deiner Ferienimmobilie zu planen. Mit unserem
				kostenlosen Renditerechner und Ratgeber zum Erfolg.
			</p>
			<div class="flex flex-wrap gap-4">
				<a
					href="/calculator"
					class="hover:bg-primary-focus inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-white transition-colors"
				>
					Zum Schnellrechner
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</a>
				<a
					href="/ratgeber"
					class="inline-flex items-center gap-2 rounded-full border border-base-content/20 px-6 py-3 font-medium text-base-content transition-colors hover:bg-base-200"
				>
					Zum Ratgeber
					<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</a>
			</div>
		</div>

		<div
			class="relative aspect-[4/3] overflow-hidden rounded-3xl bg-base-200 shadow-2xl lg:aspect-[16/10]"
		>
			<img
				src="/hero-cabin.jpg"
				alt="Gemütliche Berghütte im Winter"
				class="h-full w-full object-cover"
			/>
		</div>
	</section>

	<!-- Blog Section -->
	<section class="py-16 lg:py-24">
		<div class="mb-12 text-center">
			<h2 class="mb-4 text-3xl font-bold tracking-tight text-base-content lg:text-4xl">
				Ferienimmobilien-Ratgeber
			</h2>
			<p class="mx-auto max-w-2xl text-lg text-base-content/70">
				Entdecken Sie wertvolle Einblicke und Expertentipps für Ihre Ferienimmobilie
			</p>
		</div>

		<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{#each topPosts as post}
				<a
					href="/ratgeber/{post.id}"
					class="group overflow-hidden rounded-2xl border border-base-content/10 bg-base-100 transition-all hover:border-base-content/20 hover:shadow-lg"
				>
					<div class="aspect-[3/2] overflow-hidden">
						<img
							src={post.id === 1
								? '/marketing-meeting.jpg'
								: post.id === 2
									? '/real-estate.jpg'
									: '/tenant-management.jpg'}
							alt=""
							class="h-full w-full object-cover transition-transform group-hover:scale-105"
						/>
					</div>
					<div class="p-6">
						<div class="mb-3 flex items-center gap-3">
							<span class="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
								>{post.category}</span
							>
							<time class="text-sm text-base-content/50"
								>{new Date(post.publishedAt).toLocaleDateString('de-DE', {
									year: 'numeric',
									month: 'short',
									day: 'numeric'
								})}</time
							>
						</div>
						<h3 class="mb-2 text-lg font-semibold text-base-content group-hover:text-primary">
							{post.title}
						</h3>
						<p class="text-base-content/70">{post.description}</p>
					</div>
				</a>
			{/each}
		</div>

		<div class="mt-12 text-center">
			<a
				href="/ratgeber"
				class="inline-flex items-center gap-2 rounded-full border border-base-content/20 px-6 py-3 font-medium text-base-content transition-colors hover:bg-base-200"
			>
				Mehr erfahren
				<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</a>
		</div>
	</section>
</div>
