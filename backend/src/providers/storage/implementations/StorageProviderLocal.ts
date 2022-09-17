import { randomProvider } from '../../../core/DependencyInjection';
import { StorageProvider } from '../StorageProvider';

export class StorageProviderLocal implements StorageProvider {
	async saveFile(key: string, content: string): Promise<string> {
		return randomProvider.string(10, 'alpha');
	}
}
