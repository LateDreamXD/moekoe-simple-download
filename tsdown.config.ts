import { defineConfig } from 'tsdown';
import vue from 'unplugin-vue/rolldown';
import scss from 'rollup-plugin-scss';

export default defineConfig({
	define: { isProd: JSON.stringify(true) },
	noExternal: ['vue'],
	inlineOnly: false,
	entry: { content: 'src/content/index.ts' },
	plugins: [vue(), scss({
		fileName: 'content.css',
		sass: await import('sass-embedded'),
		outputStyle: 'compressed'
	})],
	platform: 'browser',
	minify: true,
	format: 'iife',
	tsconfig: 'tsconfig.app.json'
});
