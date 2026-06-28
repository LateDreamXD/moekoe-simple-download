import { defineConfig, type UserConfig } from 'tsdown';
import vue from 'unplugin-vue/rolldown';

import version from './version';

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
	define: { isProd: JSON.stringify(true), version: JSON.stringify(version) },
	deps: {
		alwaysBundle: ['vue', '@baptistecdr/aria2'],
		onlyBundle: false,
	},
	entry: { content: 'src/content/index.ts' },
	plugins: [vue()],
	...shared
}, {
	entry: { api: 'src/content/api.ts' },
	...shared
}]);
