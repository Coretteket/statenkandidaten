const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: { extend: { fontFamily: { sans: ['var(--base-font)', fontFamily.sans] } } },
	future: { hoverOnlyWhenSupported: true },
	plugins: [],
};
