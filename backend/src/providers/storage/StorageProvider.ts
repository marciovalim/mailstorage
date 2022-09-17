export type StorageProvider = {
	saveFile(key: string, content: string): Promise<string>;
}

export const storageProviderAlias = 'StorageProvider';
