export const check = () =>
	document.title.toLowerCase().includes('moekoe') ||
	(document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content?.toLowerCase().includes('moekoe');
