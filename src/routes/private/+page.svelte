<script lang="ts">
	let { data } = $props();
	let { session } = $derived(data);
</script>

<div class="prose max-w-none">
	<h1>Welcome to your Dashboard</h1>
	<p>
		You're logged in as <span class="font-medium">{session?.user?.email}</span>. Use the navigation
		menu to explore your private content.
	</p>
</div>
