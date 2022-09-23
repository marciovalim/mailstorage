import { RedisClientType } from 'redis';

export type RedisProvider = {
	open(): Promise<void>;
	close(): Promise<void>;
	getStr(key: string): Promise<TimedValue | null>;
	setStr(key: string, value: string, secondsToLive: number): Promise<void>;
	getList(key: string): Promise<string[]>;
	pushToList(key: string, value: string): Promise<void>;
	removeAllFromList(key: string, value: string): Promise<void>;
	clearKeysContaining(pattern: string): Promise<void>;
	getLowLevelClient(): RedisClientType;
}

export type TimedValue = {
	value: string;
	secondsToLive: number;
}

export const redisProviderAlias = 'RedisProvider';
