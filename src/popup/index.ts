import { version } from '../../package.json';

const egg = document.getElementById('egg')!;
egg.addEventListener('mouseover', () => {
	egg.innerHTML = '(・ω・) !';
	setTimeout(() => egg.innerHTML = 'Ciallo～(∠・ω< )⌒★', 700);
	setTimeout(() => egg.innerHTML = '(-. -) zZ', 2500);
});

const versionEle = document.getElementById('version')!;
versionEle.textContent = `v${version}`;
