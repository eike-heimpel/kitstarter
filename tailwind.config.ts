import containerQueries from '@tailwindcss/container-queries';
import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	plugins: [containerQueries, daisyui],

	daisyui: {
		themes: ['light', 'dark', 'cupcake'], // Add a few starter themes
		darkTheme: 'dark', // Name of the dark theme
		base: true, // Applies background color and foreground color for root element
		themeRoot: ':root', // The element that receives theme color CSS variables, default is :root
		logs: false, // Disable console logs
	}
} satisfies Config;
