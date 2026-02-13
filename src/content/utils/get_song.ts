const getCurrent = (): {
	name: string,
	author: string,
	img: string,
	url: string,
	hash: string
}|null => {
	const current_song = localStorage.getItem('current_song');
	if(current_song) return JSON.parse(current_song);
	else return null;
}

export { getCurrent };
export default {
	getCurrent
};
