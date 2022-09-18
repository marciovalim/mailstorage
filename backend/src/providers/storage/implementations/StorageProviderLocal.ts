import { inject, injectable } from 'tsyringe';

import { RandomProvider, randomProviderAlias } from '../../random/RandomProvider';
import { StorageProvider } from '../StorageProvider';

@injectable()
export class StorageProviderLocal implements StorageProvider {
	constructor(
		@inject(randomProviderAlias)
		private randomProvider: RandomProvider,
	) {}

	async saveFile(group: string, _content: string): Promise<string> {
		return this.generateFileName(group);
	}

	generateFileName(group: string): string {
		return `${group}/${this.randomProvider.string(8, 'alpha')}`;
	}

	async deleteFile(link: string): Promise<void> {
		return Promise.resolve();
	}
}
