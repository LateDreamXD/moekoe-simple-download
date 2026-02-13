import { defineConfig } from 'tsdown';
import vue from 'unplugin-vue/rolldown';
import raw from 'unplugin-raw/rolldown';
import scss from 'rollup-plugin-scss';

export default defineConfig({
	define: { isProd: JSON.stringify(true) },
	noExternal: ['vue'],
	entry: { content: 'src/content/index.ts' },
	plugins: [vue(), raw(), scss({
		fileName: 'content.css',
		sass: await import('sass-embedded'),
		outputStyle: 'compressed'
	})],
	platform: 'browser',
	minify: true,
	format: 'iife',
	tsconfig: 'tsconfig.app.json'
});
