import containerQueries from '@tailwindcss/container-queries';
import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#4ECDC4',
					focus: '#45b8b0'
				}
			},
			fontFamily: {
				sans: ['Geist', 'system-ui', 'sans-serif']
			},
			fontWeight: {
				normal: '450', // Slightly heavier than default 400 for better readability
				medium: '500',
				semibold: '600',
				bold: '700'
			},
			borderRadius: {
				'4xl': '2rem'
			}
		}
	},

	plugins: [containerQueries, daisyui],

	daisyui: {
		themes: [
			{
				light: {
					'primary': '#4ECDC4',
					'primary-focus': '#45b8b0',
					'primary-content': '#ffffff',
					'secondary': '#2C3E50',
					'secondary-focus': '#1a252f',
					'secondary-content': '#ffffff',
					'accent': '#37B6AB',
					'neutral': '#3D4451',
					'base-100': '#FFFFFF',
					'base-200': '#F8F9FA',
					'base-300': '#E9ECEF',
					'base-content': '#1e293b',
					'info': '#3ABFF8',
					'success': '#36D399',
					'warning': '#FBBD23',
					'error': '#F87272'
				}
			}
		],
		base: true,
		themeRoot: ':root',
		logs: false
	}
} satisfies Config;
