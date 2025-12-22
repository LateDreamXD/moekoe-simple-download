(() => {
	const egg = document.getElementById('egg');
	egg.addEventListener('mouseover', () => {
		egg.innerHTML = '(・ω・) !';
		setTimeout(() => egg.innerHTML = 'Ciallo～(∠・ω< )⌒★', 700);
		setTimeout(() => egg.innerHTML = '(-. -) zZ', 2500);
	});

	// const current_version = '0.1.0';
	// document.getElementById('version').textContent = current_version;

})();
