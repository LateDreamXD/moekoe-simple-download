export default class Options {
	private static readonly storage_key = 'simple-download-option';
	private options: {download: 'fetch' | 'direct'} = {
		download: 'fetch'
	};

	constructor() {
		const saved_options = localStorage.getItem(Options.storage_key);
		if(saved_options) this.options = JSON.parse(saved_options);
	}

	get option() {
		return this.options;
	}

	public set(option: {download: 'fetch' | 'direct'}) {
		this.options = option;
		localStorage.setItem(Options.storage_key, JSON.stringify(option));
	}
}
