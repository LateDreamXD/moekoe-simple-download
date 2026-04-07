import { defineConfig, type UserConfig } from 'tsdown';
import vue from 'unplugin-vue/rolldown';

const shared: UserConfig = {
	css: {
		fileName: 'content.css',
		minify: true,
	},
	copy: {
		from: 'public/**/*',
		to: 'dist'
	},
	platform: 'browser',
	minify: true,
	format: 'iife',
	tsconfig: 'tsconfig.app.json'
}

export default defineConfig([{
	define: { isProd: JSON.stringify(true) },
	deps: {
		alwaysBundle: ['vue'],
		onlyBundle: false,
	},
	entry: { content: 'src/content/index.ts' },
	plugins: [vue()],
	...shared
}, {
	entry: { api: 'src/content/api.ts' },
	...shared
}]);
