<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex min-h-[80vh] items-center justify-center p-4">
	<div class="max-w-md text-center">
		<h1 class="mb-4 text-3xl font-bold">Authentication Error</h1>
		<div class="alert alert-error">
			<span>{$page.error?.message || 'An unexpected error occurred'}</span>
		</div>
		<a href="/auth" class="btn btn-primary mt-4">Back to Login</a>
	</div>
</div>
