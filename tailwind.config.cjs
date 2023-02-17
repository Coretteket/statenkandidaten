const { fontFamily } = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: { sans: ['var(--base-font)', fontFamily.sans] },
			screens: { '2xs': '360px', xs: '380px', lg: '900px', xl: '1024px', '2xl': '1280px' },
			gridTemplateColumns: { 'content-sidebar': 'minmax(0, 1fr) 22rem' },
		},
	},
	future: { hoverOnlyWhenSupported: true },
	plugins: [
		require('@tailwindcss/forms')({ strategy: 'class' }),
		plugin(({ addVariant, addUtilities, matchUtilities }) => {
			addVariant('tap', ['@media(hover: hover) and (pointer: fine) { &:hover }', '&:active']);
			addVariant('kid', '&>*');
			addVariant('kids', '& *');
			addUtilities({
				'.scrollbar-hidden': {
					'scrollbar-width': 'none',
					'&::-webkit-scrollbar': { display: 'none', '-webkit-appearance': 'none' },
				},
			});
			matchUtilities(
				{
					'overflow-fade': (dir) => {
						const size = dir === 'top' || dir === 'bottom' ? '80%' : '95%';
						return {
							'-webkit-mask-image': `linear-gradient(${dir}, #000 ${size}, transparent)`,
						};
					},
				},
				{ values: { top: '0deg', right: '90deg', bottom: '180deg', left: '270deg' } },
			);
		}),
	],
};
