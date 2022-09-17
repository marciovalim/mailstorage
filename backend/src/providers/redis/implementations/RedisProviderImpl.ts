import { createClient, RedisClientType } from 'redis';

import { Environment } from '../../../core/Environment';
import { Utils } from '../../../utils/Utils';
import { RedisProvider, TimedValue } from '../RedisProvider';

export class RedisProviderImpl implements RedisProvider {
	private client: RedisClientType | null = null;

	async open(): Promise<void> {
		const username = Environment.vars.REDIS_USERNAME;
		const password = Environment.vars.REDIS_PASSWORD;
		const host = Environment.getType() === 'test' ? Environment.vars.REDIS_HOST_TEST : Environment.vars.REDIS_HOST;
		const port = Environment.vars.REDIS_PORT;
		const url = `redis://${username}:${password}@${host}:${port}`;

		this.client = createClient({ url, password });
		this.client.on('error', (err) => {
			throw new Error(err);
		});

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

	async pushToList(key: string, value: string): Promise<void> {
		await this.client!.rPush(key, value);
	}

	async removeAllFromList(key: string, value: string): Promise<void> {
		await this.client!.lRem(key, 0, value);
	}

	async clearKeysContaining(str: string): Promise<void> {
		const keys = await this.client!.keys(`*${str}*`);
		if (keys.length === 0) return;

		await this.client!.del(keys);
	}
}
