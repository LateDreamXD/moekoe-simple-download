<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import logger from './utils/logger';

const { options, defaultOptions, refreshOptions, version } = defineProps<{
	options: SDOptionsV1;
	defaultOptions: SDOptionsV1;
	refreshOptions: Function;
	version: string;
}>();
(() => {
	Object.keys(defaultOptions).forEach(key => {
		if(!options[key]) options[key] = defaultOptions[key];
	});
})();

const icon = isProd? chrome.runtime.getURL('icon.png'): '/icon.png';
const isMenuVisible = ref(false);
const menuBtnPos = ref<{
	left?: string;
	top?: string;
}>({});
const lastMenuBtnPos = ref<{
	left?: string;
	top?: string;
}>({});

const isDragging = ref(false);
const isExperimental = ref(false);

function updateEdge(pos?: {x?: number, y?: number}) {
	const edgeThreshold = 50;
	const w = window.innerWidth;
	// const h = window.innerHeight;
	const x = pos?.x || parseInt(menuBtnPos.value.left || '0');
	// const y = pos?.y || parseInt(menuBtnPos.value.top || '0');

	if (x < edgeThreshold) return 'left';
	if (x > w - 16 - edgeThreshold) return 'right';
	// if (y < edgeThreshold) return 'top';
	// if (y > h - 16 - edgeThreshold) return 'bottom';
	return 'none';
}

const currentEdge = ref(updateEdge());

function handleDragStart(e: DragEvent) {
	isDragging.value = true;
}

function handleDragEnd(e: DragEvent) {
	isDragging.value = false;
	if(e.clientX === 0 && e.clientY === 0) return;
	const w = window.innerWidth;
	const h = window.innerHeight;
	lastMenuBtnPos.value = menuBtnPos.value;
	const newPos = {
		left: '0',
		top: '0'
	};
	if(e.clientX > w - 32) newPos.left = (w - 32) + 'px';
	else if(e.clientX < 0) newPos.left = '-16px';
	else newPos.left = e.clientX + 'px';
	if(e.clientY > h - 32) newPos.top = (h - 32) + 'px';
	else if(e.clientY < 0) newPos.top = '-16px';
	else newPos.top = e.clientY + 'px';

	currentEdge.value = updateEdge({x: e.clientX, y: e.clientY});
	if(currentEdge.value === 'left') newPos.left = '-16px';
	else if(currentEdge.value === 'right') newPos.left = w - 16 + 'px';
	// else if(currentEdge.value === 'top') newPos.top = '-16px';
	// else if(currentEdge.value === 'bottom') newPos.top = h - 32 + 'px';

	menuBtnPos.value = newPos;
	options.menuBtnPosition = {
		x: parseInt(menuBtnPos.value.left!.replace('px', '')),
		y: parseInt(menuBtnPos.value.top!.replace('px', ''))
	}
	localStorage.setItem('latedream:simple_download_options', JSON.stringify(options));
}

function handleMouseEnter() {
	const newPos = menuBtnPos.value;
	if(currentEdge.value === 'left') newPos.left = options.menuBtnPosition.x + 24 + 'px';
	else if(currentEdge.value === 'right') newPos.left = options.menuBtnPosition.x - 24 + 'px';
	// else if(currentEdge.value === 'top') newPos.top = options.menuBtnPosition.y + 16 + 'px';
	// else if(currentEdge.value === 'bottom') newPos.top = options.menuBtnPosition.y - 32 + 'px';
	menuBtnPos.value = newPos;
}

function handleMouseLeave() {
	const newPos = menuBtnPos.value;
	if(currentEdge.value === 'left') newPos.left = '-16px';
	else if(currentEdge.value === 'right') newPos.left = options.menuBtnPosition.x + 'px';
	// else if(currentEdge.value === 'top') newPos.top = '-16px';
	// else if(currentEdge.value === 'bottom') newPos.top = options.menuBtnPosition.y + 'px';
	menuBtnPos.value = newPos;
}

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
	if(!options.experimental_features.aria2_download && options.download_method === 'aria2')
		options.download_method = 'fetch';
	localStorage.setItem('latedream:simple_download_options', JSON.stringify(options));
	alert('保存成功');
}

function toggleMenu(el: HTMLDivElement) {
	el.classList.toggle('close');
	isMenuVisible.value = !isMenuVisible.value;
	refreshOptions();
}

function parsePosition(pos: SDOptionsV1['menuBtnPosition']) {
	menuBtnPos.value = {
		left: pos.x + 'px',
		top: pos.y + 'px',
	}
	logger.log('new position:', menuBtnPos.value);
}

onMounted(() => {
	if(options.version !== version) {
		const initVersion = () => {
			options.version = version;
			localStorage.setItem('latedream:simple_download_options', JSON.stringify(options));
		}
		document.addEventListener('mousedown', initVersion, { once: true });
	}

	parsePosition(options.menuBtnPosition);
	currentEdge.value = updateEdge();
});

onUnmounted(() => {
});
</script>

<template>
	<button :class="{'menu-toggle': true, 'updated': options.version !== version}"
		data-type="icon" @click="isDragging || toggleMenu($refs.menu as HTMLDivElement)"
		title="配置 Simple Download" draggable="true" :style="menuBtnPos"
		@dragstart="handleDragStart" @dragend="handleDragEnd"
		@mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
		:data-edge="currentEdge" :data-dragging="isDragging">
		<img draggable="false" :src="icon" />
	</button>
	<div ref="menu" v-show="isMenuVisible" :class="['menu', theme, 'close']" :style="{
		left: options.menuBtnPosition.x + (currentEdge === 'right' ? -380 : 24) + 'px',
		top: options.menuBtnPosition.y - 24 + 'px'
	}">
		<form @submit.prevent="saveOptions" @reset.prevent="resetOptions">
		<span class="title-panel">
			<button type="button" data-type="icon" :title="isExperimental? '返回': '实验性功能'" @click="isExperimental = !isExperimental">
				<i class="fas" :class="{ 'fa-flask': !isExperimental, 'fa-angle-left': isExperimental }" />
			</button>
			<img draggable="false" :src="icon" width="32" height="32" />
			<span class="title">Simple Download<sup v-text="`v${version}`" /></span>
			<button type="button" data-type="icon" @click="toggleMenu($refs.menu as HTMLDivElement)"><i class="fas fa-xmark" /></button>
		</span>
		<div v-if="isExperimental" class="experimental-features">
			<span class="experimental-tip">这些功能可能出错，请在 <a href="https://github.com/LateDreamXD/moekoe-simple-download/issues/new?template=bug_report.yml" target="_blank">Issue Tracker</a> 提交你遇到的问题。</span>
			<span class="menu-item">
				<label for="enable-aria2">启用 Aria2 下载方式</label>
				<input id="enable-aria2" type="checkbox" role="switch" v-model="options.experimental_features.aria2_download" />
			</span>
		</div>
		<div v-else class="features">
			<span class="separator" />
			<span class="menu-item">
				<label for="download-mode">
					下载方式
					<small v-if="options.download_method === 'fetch'">(～￣▽￣)～</small>
					<small v-else>～(￣▽￣～)</small>
				</label>
				<select v-if="options.experimental_features.aria2_download" id="download-mode" v-model="options.download_method">
					<optgroup label="实验性">
						<option value="aria2">Aria2</option>
					</optgroup>
					<optgroup label="稳定性">
						<option value="fetch">Fetch API</option>
						<option value="direct">直接下载</option>
					</optgroup>
				</select>
				<select v-else id="download-mode" v-model="options.download_method">
					<option value="fetch">Fetch API</option>
					<option value="direct">直接下载</option>
				</select>
			</span>
			<span v-if="options.download_method === 'fetch' || options.download_method === 'aria2'" class="menu-item">
				<label for="filename-format" class="help" @click="formatHelp">文件名格式<sup>?</sup></label>
				<input id="filename-format" v-model="options.filename_format" type="text" required />
			</span>
			<div v-if="options.download_method === 'aria2'" class="aria2-items">
				<span class="experimental-tip">这是实验性功能，可能出错，请在 <a href="https://github.com/LateDreamXD/moekoe-simple-download/issues/new?template=bug_report.yml" target="_blank">Issue Tracker</a> 提交你遇到的问题。</span>
				<span class="menu-item">
					<label for="aria2-protocol">通讯协议</label>
					<select id="aria2-protocol" v-model="options.aria2_options.protocol">
						<option value="http">HTTP</option>
						<option value="ws">WebSocket</option>
					</select>
				</span>
				<span class="menu-item">
					<label for="aria2-protocol">安全连接</label>
					<select id="aria2-protocol" v-model="options.aria2_options.connection.secure">
						<option :value="undefined">自动</option>
						<option :value="true">强制启用</option>
						<option :value="false">强制禁用</option>
					</select>
				</span>
				<span class="menu-item">
					<label for="aria2-dir">下载目录</label>
					<input id="aria2-dir" placeholder="/" v-model="options.aria2_options.dir" type="text" />
				</span>
				<span class="menu-item">
					<label for="aria2-host">Aria2 主机地址</label>
					<input id="aria2-host" placeholder="localhost" v-model="options.aria2_options.connection.host" type="text" />
				</span>
				<span class="menu-item">
					<label for="aria2-host">Aria2 主机端口</label>
					<input id="aria2-host" placeholder="6800" v-model="options.aria2_options.connection.port" type="number" min="1" max="65535" step="1" />
				</span>
				<span class="menu-item">
					<label for="aria2-secret">密钥</label>
					<input id="aria2-secret" v-model="options.aria2_options.connection.secret" type="password" />
				</span>
				<span class="menu-item">
					<label for="aria2-path">请求路径</label>
					<input id="aria2-path" placeholder="/jsonrpc" v-model="options.aria2_options.connection.path" type="text" />
				</span>
			</div>
			<span class="separator" />
			<span class="menu-item">
				<label for="check-update">
					检查更新
					<small>每次启动时检查更新</small>
				</label>
				<input id="check-update" type="checkbox" role="switch" v-model="options.check_update" />
			</span>
		</div>
		<span class="menu-item end">
			<i style="opacity: 0.05;">@LateDreamXD</i>
			<span class="menu-actions">
				<button type="reset">重置</button>
				<button type="submit">保存</button>
			</span>
		</span>
		</form>
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
		transform: translateY(-24px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
@keyframes menu-hide {
	from {
		display: flex;
		opacity: 1;
		transform: translateY(0);
	}
	to {
		display: none;
		opacity: 0;
		transform: translateY(-24px);
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
	cursor: move;
	position: fixed;
	opacity: 0.2;
	width: 32px;
	height: 32px;
	transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out, top 0.02s ease-in-out, left 0.02s ease-in-out, right 0.02s ease-in-out, bottom 0.02s ease-in-out;
	z-index: 99;

	&[data-dragging="true"] {
		cursor: move;
	}
	
	&[data-edge="none"] {
		transform: rotate(0deg);
		&:hover {
			animation: none !important;
			background-color: transparent;
			right: 6px;
			opacity: 1;
		}
	}
	
	&[data-edge="right"] {
		transform: rotate(-45deg);
		&:hover {
			animation: none !important;
			transform: rotate(0deg);
			background-color: transparent;
			left: 6px;
			opacity: 1;
		}
	}
	
	&[data-edge="left"] {
		transform: rotate(45deg);
		&:hover {
			animation: none !important;
			transform: rotate(0deg);
			background-color: transparent;
			right: 6px;
			opacity: 1;
		}
	}
	
	&[data-edge="top"] {
		transform: rotate(180deg);
		&:hover {
			animation: none !important;
			transform: rotate(0deg);
			background-color: transparent;
			bottom: 6px;
			opacity: 1;
		}
	}
	
	&[data-edge="bottom"] {
		transform: rotate(0deg);
		&:hover {
			animation: none !important;
			transform: rotate(0deg);
			background-color: transparent;
			top: 6px;
			opacity: 1;
		}
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
	.features, .experimental-features {
		padding: 1.5rem 0;
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
	.experimental-tip {
		color: orange;
		display: block;
		text-align: center;
		font-size: 0.75rem;
		unicode-bidi: isolate;
	}
	.menu-item {
		padding: 0.4rem 0;
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
				background-color: #ff1493 !important;
				color: #fff;
				&:hover {
					background-color: #ff69b4 !important;
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
form {
	margin: 0;
}
:deep(svg) {
	fill: currentColor;
}
</style>
