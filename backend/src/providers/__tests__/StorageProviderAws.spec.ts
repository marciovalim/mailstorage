import AWS from 'aws-sdk';

import { find } from '../../core/DependencyInjection';
import { Environment } from '../../core/Environment';
import { RandomProvider, randomProviderAlias } from '../random/RandomProvider';
import { StorageProviderAws } from '../storage/implementations/StorageProviderAws';

describe('StorageProviderAws', () => {
	const randomProvider = find<RandomProvider>(randomProviderAlias);
	const storageProvider = new StorageProviderAws(randomProvider);

	let fileLink: string;

	it('should save to cloud', async () => {
		fileLink = await storageProvider.saveFile('test', 't');
	});

	it('should delete from cloud', async () => {
		await storageProvider.deleteFile(fileLink);

		const s3 = new AWS.S3({
			apiVersion: '2006-03-01',
			region: Environment.vars.AWS_REGION,
		});

		const fileExists = await s3
			.headObject({
				Bucket: Environment.vars.AWS_BUCKET_NAME,
				Key: fileLink.split('amazonaws.com/').pop() ?? fileLink,
			})
			.promise()
			.then(
				() => true,
				(err) => {
					if (err.code === 'NotFound') {
						return false;
					}
					throw err;
				},
			);

		expect(fileExists).toBe(false);
	});
});
