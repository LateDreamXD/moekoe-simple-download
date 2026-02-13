<script setup lang="ts">
import { ref, onMounted } from 'vue';

const { options, defaultOptions, version } = defineProps<{
	options: SDOptionsV1;
	defaultOptions: SDOptionsV1;
	version: string;
}>();

const isMenuVisible = ref(false);

// follow moekoe theme
const theme = ref(localStorage.getItem('theme') || 'auto');
if(theme.value === 'auto')
	theme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

function formatHelp() {
	// just keep this indent
	alert(`ℹ️ 可用的占位符：
        - {artist}: 歌手
        - {title}: 歌名
        - {ext}: 文件扩展名`);
}

function resetOptions() {
	if(confirm('🤔 你确定要重置吗？将无法恢复')) {
		localStorage.removeItem('latedream:simple_download_options');
		Object.assign(options, defaultOptions);
	}
}

function saveOptions() {
	if(options.download_method === 'fetch' && !options.filename_format) {
		alert('😵 文件名格式不能为空');
		return;
	}
	localStorage.setItem('latedream:simple_download_options', JSON.stringify(options));
}

function toggleMenu(el: HTMLDivElement) {
	el.classList.toggle('close');
	isMenuVisible.value = !isMenuVisible.value;
}

onMounted(() => {
	if(options.version !== version) {
		const initVersion = () => {
			options.version = version;
			localStorage.setItem('latedream:simple_download_options', JSON.stringify(options));
			document.removeEventListener('mousedown', initVersion);
		}
		document.addEventListener('mousedown', initVersion);
	}
});
</script>

<template>
	<span v-if="options.version !== version" :class="['updated', theme]">
		<p style="text-align: right;">
			ヾ(≧▽≦*)o 好久不见！Simple Download 刚刚更新到了 v{{ version }}<br>
			点击右侧图标体验全新的功能 👉
		</p>
		<p style="display: flex; justify-content: space-between;">
			<a :href="`https://github.com/LateDreamXD/simple-download/releases/tag/v${version}`"
				target="_blank" rel="noopener">
				点我查看更新日志
			</a>
			<span>此消息每次更新后都会显示</span>
		</p>
	</span>
	<button :class="{'menu-toggle': true, 'updated': options.version !== version}"
		data-type="icon" @click="toggleMenu($refs.menu as HTMLDivElement)" title="配置 Simple Download">
		<img draggable="false" src="https://assets.latedream.qzz.io/icons/moekoe_girl_cool_icon.png" />
	</button>
	<div ref="menu" v-show="isMenuVisible" :class="['menu', theme, 'close']">
		<span class="title-panel">
			<img draggable="false" src="https://assets.latedream.qzz.io/icons/moekoe_girl_cool_icon.png" width="32" height="32" />
			<span class="title">Simple Download<sup v-text="`v${version}`" /></span>
			<button data-type="icon" @click="toggleMenu($refs.menu as HTMLDivElement)"><i class="fas fa-xmark" /></button>
		</span>
		<span class="separator" />
		<span class="menu-item">
			<label for="download-mode">
				下载方式
				<small v-if="options.download_method === 'fetch'">(～￣▽￣)～</small>
				<small v-else>～(￣▽￣～)</small>
			</label>
			<select id="download-mode" v-model="options.download_method">
				<option value="fetch">Fetch API</option>
				<option value="direct">直接下载</option>
			</select>
		</span>
		<span v-if="options.download_method === 'fetch'" class="menu-item">
			<label for="filename-format" class="help" @click="formatHelp">文件名格式<sup>?</sup></label>
			<input id="filename-format" v-model="options.filename_format" type="text" required />
		</span>
		<span class="separator" />
		<span class="menu-item">
			<label for="check-update">
				检查更新
				<small>每次启动时检查更新</small>
			</label>
			<input id="check-update" type="checkbox" role="switch" v-model="options.check_update" />
		</span>
		<span class="menu-item">
			<i style="opacity: 0.05;">@LateDreamXD</i>
			<span class="menu-actions">
				<button @click="resetOptions" type="reset">重置</button>
				<button @click="saveOptions" type="submit">保存</button>
			</span>
		</span>
	</div>
</template>

<style lang="scss" scoped>
@mixin dark {
	color-scheme: dark;
	--color: #fff;
	--border-color: rgba(255, 255, 255, 0.1);
	--background-color: #222323;
}
@mixin light {
	color-scheme: light;
	--color: #000;
	--border-color: rgba(0, 0, 0, 0.1);
	--background-color: #fff;
}
@keyframes menu-show {
	from {
		opacity: 0;
		transform: translateX(10px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}
@keyframes menu-hide {
	from {
		display: block;
		opacity: 1;
		transform: translateX(0);
	}
	to {
		display: none;
		opacity: 0;
		transform: translateX(10px);
	}
}
@keyframes pulse {
	0% { outline-color: red; }
	25% { outline-color: green; }
	50% { outline-color: blue; }
	75% { outline-color: green; }
	100% { outline-color: red; }
}
.updated {
	animation: menu-show 0.2s ease-in-out;
	position: fixed;
	padding: 0.5rem;
	top: 5%;
	right: 32px;
	border: 1px solid var(--border-color);
	border-radius: 4px;
	color: var(--color);
	background-color: var(--background-color);
	z-index: 100;
	&.dark {
		@include dark;
	}
	&.light {
		@include light;
	}
}
.menu-toggle[data-type="icon"] {
	position: fixed;
	top: 10%;
	opacity: 0.2;
	right: -14px;
	width: 32px;
	height: 32px;
	transform: rotate(-45deg);
	transition: right 0.2s ease-in-out, opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
	z-index: 99;
	&:hover {
		animation: none !important;
		transform: rotate(0deg);
		background-color: transparent;
		right: 6px;
		opacity: 1;
	}
	&.updated {
		opacity: 1;
		outline: 4px solid transparent;
		animation: pulse 2s ease-in-out infinite;
	}
}
.menu {
	position: fixed;
	top: 5%;
	right: 8px;
	animation: menu-show 0.2s ease-in-out;
	width: 350px;
	padding: 0.5rem;
	border: 1px solid;
	border-radius: 6px;
	display: flex;
	gap: 0.5rem;
	flex-direction: column;
	color: var(--color);
	border-color: var(--border-color);
	background-color: var(--background-color);
	user-select: none;
	z-index: 100;
	&.close {
		animation: menu-hide 0.2s ease-in-out;
	}
	&.dark {
		@include dark;
	}
	&.light {
		@include light;
	}
	.separator {
		display: block;
		width: 100%;
		height: 1px;
		margin: 0.6rem 0;
		background-color: var(--border-color);
	}
	.title-panel {
		display: flex;
		align-items: center;
		justify-content: space-around;
		.title {
			font-size: 1.1rem;
			font-weight: bold;
			text-align: center;
		}
	}
	.menu-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		label {
			small {
				color: grey;
			}
			&.help {
				cursor: help;
				border-bottom: 1px dotted currentColor;
			}
			&:not(.help):not(.inline) {
				display: flex;
				flex-direction: column;
			}
		}
		input, select {
			padding: 0.2rem;
			height: fit-content;
			border-color: var(--border-color);
			border-radius: 4px;
		}
		input[type="checkbox"][role="switch"] {
			appearance: none;
			width: 32px;
			height: 16px;
			border-radius: 8px;
			background-color: grey;
			position: relative;
			cursor: pointer;
			border: 2px solid var(--border-color);
			&:hover {
				border-color: #ff149159;
			}
			&::before {
				content: '';
				display: block;
				width: 14px;
				height: 14px;
				border-radius: 50%;
				background-color: var(--color);
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
				transition: left 0.2s ease-in-out, background-color 0.2s ease-in-out;
			}
			&:checked {
				background-color: #ff1493;
				&::before {
					left: 14px;
				}
			}
		}
	}
	.menu-actions {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		gap: 0.5rem;
		button {
			padding: 0.2rem 0.5rem;
			border-color: var(--border-color);
			border-radius: 4px;
			cursor: pointer;
			transition: background-color 0.2s ease-in-out;
			&[type="reset"] {
				background-color: var(--border-color);
				&:hover {
					background-color: rgb(150, 150, 150);
				}
			}
			&[type="submit"] {
				background-color: #ff1493;
				color: #fff;
				&:hover {
					background-color: #ff69b4;
				}
			}
		}
	}
}
button[data-type="icon"] {
	background-color: transparent;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	padding: 0;
	width: 24px;
	height: 24px;
	transition: background-color 0.2s ease-in-out;
	&:hover {
		background-color: grey;
	}
	&:active {
		background-color: transparent;
	}
	:deep(svg), img {
		width: 100%;
		height: 100%;
	}
}
:deep(svg) {
	fill: currentColor;
}
</style>
