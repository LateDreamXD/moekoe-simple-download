import type { UserConfig } from 'vite';
import { resolve } from 'path';
import vue from 'unplugin-vue/vite';
import raw from 'unplugin-raw/vite';

export default <UserConfig> {
	define: { isProd: JSON.stringify(false) },
	plugins: [vue(), raw()],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src/content')
		}
	}
}
