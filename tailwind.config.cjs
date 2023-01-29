const { fontFamily } = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: { sans: ['var(--base-font)', fontFamily.sans] },
			screens: { '2xs': '360px', xs: '380px', lg: '900px', xl: '1024px', '2xl': '1280px' },
			gridTemplateColumns: { 'content-sidebar': '1fr 20rem' },
		},
	},
	future: { hoverOnlyWhenSupported: true },
	plugins: [
		require('@tailwindcss/forms')({ strategy: 'class' }),
		plugin(({ addVariant }) => {
			addVariant('tap', ['@media(hover: hover) and (pointer: fine) { &:hover }', '&:active']);
			addVariant('kid', '&>*');
			addVariant('kids', '& *');
		}),
	],
};
