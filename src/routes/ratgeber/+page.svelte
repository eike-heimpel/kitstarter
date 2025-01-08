<script lang="ts">
	import { topPosts, type BlogPost } from './data';
	import { writable, derived } from 'svelte/store';

	// Filter states
	const searchQuery = writable('');
	const selectedCategory = writable('Alle Kategorien');
	const selectedTimeframe = writable('Alle Zeiträume');

	// Get unique categories
	const categories = ['Alle Kategorien', ...new Set(topPosts.map((post) => post.category))];

	// Time periods
	const timeframes = ['Alle Zeiträume', 'Letzte Woche', 'Letzter Monat', 'Letztes Jahr'];

	// Filter posts based on search and filters
	const filteredPosts = derived(
		[searchQuery, selectedCategory, selectedTimeframe],
		([$searchQuery, $selectedCategory, $selectedTimeframe]) => {
			return topPosts.filter((post) => {
				const matchesSearch =
					post.title.toLowerCase().includes($searchQuery.toLowerCase()) ||
					post.description.toLowerCase().includes($searchQuery.toLowerCase());

				const matchesCategory =
					$selectedCategory === 'Alle Kategorien' || post.category === $selectedCategory;

				// Simple timeframe filter - can be enhanced with actual date logic
				const matchesTimeframe = $selectedTimeframe === 'Alle Zeiträume';

				return matchesSearch && matchesCategory && matchesTimeframe;
			});
		}
	);

	// Format date
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('de-DE', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	// Image mapping
	const imageMap = {
		Investment: '/real-estate.jpg',
		Analyse: '/marketing-meeting.jpg',
		Vermietung: '/tenant-management.jpg'
	};
</script>

<div class="container mx-auto max-w-6xl px-4 py-8">
	<div class="dark:prose-invert prose mb-8 max-w-none">
		<h1 class="text-4xl font-bold md:text-5xl">Ferienimmobilien-Ratgeber</h1>
	</div>

	<!-- Search and Filters -->
	<div class="mb-8 flex flex-wrap gap-4">
		<div class="min-w-[240px] flex-1">
			<input
				type="text"
				placeholder="Suche nach Artikeln..."
				class="input input-bordered w-full"
				bind:value={$searchQuery}
			/>
		</div>
		<div class="min-w-[180px]">
			<select class="select select-bordered w-full" bind:value={$selectedCategory}>
				{#each categories as category}
					<option value={category}>{category}</option>
				{/each}
			</select>
		</div>
		<div class="min-w-[180px]">
			<select class="select select-bordered w-full" bind:value={$selectedTimeframe}>
				{#each timeframes as timeframe}
					<option value={timeframe}>{timeframe}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Posts Grid -->
	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each $filteredPosts as post}
			<div
				class="group relative overflow-hidden rounded-xl bg-base-100 shadow-lg transition-all hover:shadow-xl"
			>
				<a href="/ratgeber/{post.id}" class="block">
					<img
						src={imageMap[post.category as keyof typeof imageMap]}
						alt={post.title}
						class="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
						loading="lazy"
					/>
					<div class="p-6">
						<div class="mb-4 flex items-center gap-3">
							<span class="badge badge-primary text-xs uppercase">{post.category}</span>
							<span class="text-sm text-base-content/60">{formatDate(post.publishedAt)}</span>
						</div>
						<h2 class="mb-3 text-xl font-semibold leading-tight">{post.title}</h2>
						<p class="mb-4 text-base-content/70">{post.description}</p>
						<div class="flex items-center">
							<span class="hover:text-primary-focus text-primary">Weiterlesen</span>
						</div>
					</div>
				</a>
			</div>
		{/each}
	</div>
</div>
