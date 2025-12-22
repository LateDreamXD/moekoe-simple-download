import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: {
		content: 'src/content/index.ts'
	},
	minify: true,
	dts: false,
	format: 'iife'
});
