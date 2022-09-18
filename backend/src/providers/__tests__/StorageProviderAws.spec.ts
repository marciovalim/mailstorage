import { find } from '../../core/DependencyInjection';
import { RandomProvider, randomProviderAlias } from '../random/RandomProvider';
import { StorageProviderAws } from '../storage/implementations/StorageProviderAws';

describe('StorageProviderAws', () => {
	const randomProvider = find<RandomProvider>(randomProviderAlias);
	const storageProvider = new StorageProviderAws(randomProvider);

	it('should save to cloud', async () => {
		await storageProvider.saveFile('test', 't');
	});
});
