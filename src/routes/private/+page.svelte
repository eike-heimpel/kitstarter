<script lang="ts">
	import { invalidate } from '$app/navigation';
	import type { EventHandler } from 'svelte/elements';

	import type { PageData } from './$types';

	let { data } = $props();
	let { supabase, user } = $derived(data);
</script>

Test
