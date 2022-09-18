import AWS from 'aws-sdk';
import { inject, injectable } from 'tsyringe';

import { Environment } from '../../../core/Environment';
import { RandomProvider, randomProviderAlias } from '../../random/RandomProvider';
import { StorageProvider } from '../StorageProvider';

@injectable()
export class StorageProviderAws implements StorageProvider {
	private client: AWS.S3;
	private savedCount = 0;

	constructor(
		@inject(randomProviderAlias)
		private randomProvider: RandomProvider,
	) {
		this.client = new AWS.S3({
			apiVersion: '2006-03-01',
			region: Environment.vars.AWS_REGION,
		});
	}

	async saveFile(group: string, content: string): Promise<string> {
		if (Environment.vars.NODE_ENV === 'test' && this.savedCount > 0) {
			throw new Error('StorageProviderAws should not be used in test environment more than once');
		}

		this.savedCount++;
		const res = await this.client.upload({
			Bucket: Environment.vars.AWS_BUCKET_NAME,
			Key: this.generateFileName(group),
			Body: content,
		}).promise();

		return res.Location;
	}

	generateFileName(group: string): string {
		return `${group}/${this.randomProvider.string(8, 'alpha')}`;
	}

	async deleteFile(link: string): Promise<void> {
		const key = link.split('amazonaws.com/').pop() ?? link;
		await this.client.deleteObject({
			Bucket: Environment.vars.AWS_BUCKET_NAME,
			Key: key,
		}).promise();
	}
}
