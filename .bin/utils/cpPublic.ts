import fs from 'fs';
import path from 'path';

const public_path = path.join(process.cwd(), 'public');
const dist_path = path.join(process.cwd(), 'dist');

try {
	fs.readdirSync(public_path).forEach(file => {
		fs.cp(path.join(public_path, file), path.join(dist_path, file), () => {})
	});
} catch {}
