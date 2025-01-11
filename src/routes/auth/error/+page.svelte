<script lang="ts">
	import { page } from '$app/stores';
	import DOMPurify from 'dompurify';

	$: errorMessage =
		$page.url.searchParams.get('error') || 'An error occurred during authentication.';
	$: sanitizedError = DOMPurify.sanitize(errorMessage);
</script>

<div class="flex min-h-[80vh] items-center justify-center">
	<div class="w-full max-w-md rounded-lg bg-base-200 p-8 shadow-xl">
		<h1 class="mb-4 text-2xl font-bold text-error">Authentication Error</h1>
		<p class="mb-6" data-testid="error-message">{sanitizedError}</p>
		<a href="/auth" class="btn btn-primary w-full">Back to Login</a>
	</div>
</div>
