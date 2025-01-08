<script lang="ts">
	import { page } from '$app/stores';
	import { type BlogPost, topPosts } from '../data';

	$: post = topPosts.find((p: BlogPost) => p.id === parseInt($page.params.id));
</script>

{#if post}
	<div class="mx-auto max-w-3xl px-4 py-16">
		<div class="mb-3 flex items-center gap-3">
			<span class="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">{post.category}</span>
			<time class="text-sm text-base-content/50"
				>{new Date(post.publishedAt).toLocaleDateString('de-DE', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}</time
			>
		</div>
		<h1 class="mb-8 text-4xl font-bold tracking-tight text-base-content">{post.title}</h1>
		<p class="text-lg text-base-content/70">{post.description}</p>
	</div>
{:else}
	<div class="flex min-h-[50vh] items-center justify-center">
		<p class="text-base-content/70">Artikel nicht gefunden</p>
	</div>
{/if}
