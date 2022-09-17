import { inject, injectable } from 'tsyringe';

import { RandomProvider, randomProviderAlias } from '../../random/RandomProvider';
import { StorageProvider } from '../StorageProvider';

@injectable()
export class StorageProviderLocal implements StorageProvider {
	constructor(
		@inject(randomProviderAlias)
		private randomProvider: RandomProvider,
	) {}

	async saveFile(key: string, content: string): Promise<string> {
		return this.randomProvider.string(10, 'alpha');
	}

	generateFileName(group: string): string {
		return `${group}/${this.randomProvider.string(8, 'alpha')}`;
	}
}
