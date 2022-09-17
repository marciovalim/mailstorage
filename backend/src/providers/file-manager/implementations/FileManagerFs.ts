import fs from 'fs';

import { FileManager } from '../FileManager';

export class FileManagerFs implements FileManager {
	async read(path: string): Promise<string> {
		return fs.promises.readFile(path, 'utf8');
	}

	async countFiles(directory: string): Promise<number> {
		const files = await fs.promises.readdir(directory);
		return files.length;
	}

	async delete(path: string): Promise<void> {
		await fs.promises.unlink(path);
	}

	async getByteSize(path: string): Promise<number> {
		const stats = await fs.promises.stat(path);
		return stats.size;
	}
}
