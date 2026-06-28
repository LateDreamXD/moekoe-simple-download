import type { UserConfig } from 'vite';
import { resolve } from 'path';
import vue from 'unplugin-vue/vite';

import version from './version';

export default <UserConfig> {
	define: { isProd: JSON.stringify(false), version },
	plugins: [vue()],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src/content')
		}
	}
}
