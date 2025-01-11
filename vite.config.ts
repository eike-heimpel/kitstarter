import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			exclude: [
				// Build and test artifacts
				'coverage/**',
				'dist/**',
				'.vercel/**',
				'.svelte-kit/**',
				'test/**',
				'src/test/**',
				'**/__tests__/**',
				'**/*.test.ts',

				// Type definitions and re-exports
				'**/*.d.ts',
				'**/types.ts',
				'**/index.ts',

				// Svelte components (better tested with e2e/component tests)
				'**/*.svelte',

				// Route files (mostly configuration)
				'**/+layout.{ts,js}',
				'**/+page.{ts,js}',

				// Configuration files
				'*.config.{js,ts}',
				'*.{js,ts,json,md}',

				// Environment setup
				'src/app.d.ts',
				'src/hooks.server.ts'
			],
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 80,
				statements: 80
			}
		}
	}
});
