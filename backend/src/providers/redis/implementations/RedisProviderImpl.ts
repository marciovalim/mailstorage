import { createClient, RedisClientType } from 'redis';

import { Environment } from '../../../core/Environment';
import { RedisProvider, TimedValue } from '../RedisProvider';

export class RedisProviderImpl implements RedisProvider {
	private client: RedisClientType | null = null;

	async open(): Promise<void> {
		// const user = `:${Environment.getVar('REDIS_PASSWORD')}@`;
		const host = Environment.vars.REDIS_HOST;
		const port = Environment.vars.REDIS_PORT;
		this.client = createClient({
			url: `redis://${host}:${port}`, // TODO: setup password
			// url: `redis://${user}${host}:${port}`,
			// password: Environment.getVar('REDIS_PASSWORD'),
		});

		this.client.on('error', (err) => console.log('Redis Client Error', err));
		await this.client.connect();
	}

	async close(): Promise<void> {
		if (!this.client?.isOpen) return;
		await this.client?.quit();
	}

	async getStr(key: string): Promise<TimedValue | null> {
		const value = await this.client!.get(key);
		if (!value) return null;

		const secondsToLive = await this.client!.ttl(key);
		return { value, secondsToLive };
	}

	async getList(key: string): Promise<string[]> {
		return this.client!.lRange(key, 0, -1);
	}

	async setStr(key: string, value: string, secondsToLive: number): Promise<void> {
		await this.client!.set(key, value, {
			EX: secondsToLive,
		});
	}
}
