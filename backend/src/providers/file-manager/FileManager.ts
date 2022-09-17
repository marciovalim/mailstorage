export type FileManager = {
	read(path: string): Promise<string>;
	countFiles(directory: string): Promise<number>;
	delete(path: string): Promise<void>;
	getByteSize(path: string): Promise<number>;
}

export const fileManagerAlias = 'FileManager';
