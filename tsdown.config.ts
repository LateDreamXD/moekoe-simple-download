import { defineConfig } from 'tsdown';
import vue from 'unplugin-vue/rolldown';

export default defineConfig({
	define: { isProd: JSON.stringify(true) },
	deps: {
		alwaysBundle: ['vue'],
		onlyBundle: false,
	},
	entry: { content: 'src/content/index.ts' },
	plugins: [vue()],
	css: {
		fileName: 'content.css',
		minify: true,
	},
	platform: 'browser',
	minify: true,
	format: 'iife',
	tsconfig: 'tsconfig.app.json'
});
