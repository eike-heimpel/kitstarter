import containerQueries from '@tailwindcss/container-queries';
import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			animation: {
				'bounce-slow': 'bounce 3s infinite',
				'pulse-slow': 'pulse 3s infinite'
			},
			borderRadius: {
				'4xl': '2rem',
				'5xl': '2.5rem'
			},
			fontFamily: {
				'display': ['system-ui', 'sans-serif']
			}
		}
	},

	plugins: [containerQueries, daisyui],

	daisyui: {
		themes: [
			{
				playful: {
					"primary": "#FF6B6B",
					"secondary": "#4ECDC4",
					"accent": "#FFE66D",
					"neutral": "#2A363B",
					"base-100": "#FFFFFF",
					"info": "#3ABFF8",
					"success": "#36D399",
					"warning": "#FBBD23",
					"error": "#F87272",
					"--rounded-box": "1.5rem",
					"--rounded-btn": "1.5rem",
					"--rounded-badge": "1.9rem",
					"--animation-btn": "0.3s",
					"--animation-input": "0.3s",
					"--btn-focus-scale": "0.95",
					"--border-btn": "2px",
					"--tab-border": "2px",
					"--tab-radius": "0.7rem",
				},
			},
			"retro",
			"garden",
			"cupcake",
			"dark"
		],
		darkTheme: "dark",
		base: true,
		themeRoot: ":root",
		logs: false,
	}
} satisfies Config;
