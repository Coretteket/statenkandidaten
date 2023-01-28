module.exports = {
	overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
	plugins: [import('prettier-plugin-svelte'), import('prettier-plugin-tailwindcss')],
	pluginSearchDirs: ['.'],
	printWidth: 100,
	useTabs: true,
	singleQuote: true,
	trailingComma: 'all',
};
