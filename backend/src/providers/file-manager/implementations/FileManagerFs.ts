import fs from 'fs';

import { FileManager } from '../FileManager';

export class FileManagerFs implements FileManager {
	async read(path: string): Promise<string> {
		return fs.promises.readFile(path, 'utf8');
	}
}
