export type StorageProvider = {
	saveFile(group: string, content: string): Promise<string>;
	generateFileName(group: string): string;
}

export const storageProviderAlias = 'StorageProvider';
