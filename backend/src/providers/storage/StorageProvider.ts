export type StorageProvider = {
	saveFile(group: string, content: string): Promise<string>;
	deleteFile(link: string): Promise<void>;
	generateFileName(group: string): string;
}

export const storageProviderAlias = 'StorageProvider';
