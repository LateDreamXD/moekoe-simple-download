import type { UserConfig } from 'vite';
import { resolve } from 'path';
import vue from 'unplugin-vue/vite';

export default <UserConfig> {
	define: { isProd: JSON.stringify(false) },
	plugins: [vue()],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src/content')
		}
	}
}
