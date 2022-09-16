export type FileManager = {
	read(path: string): Promise<string>;
}

export const fileManagerAlias = 'FileManager';
