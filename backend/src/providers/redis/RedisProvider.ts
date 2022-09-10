export type RedisProvider = {
	open(): Promise<void>;
	close(): Promise<void>;
	getStr(key: string): Promise<TimedValue | null>;
	getList(key: string): Promise<string[]>;
	setStr(key: string, value: string, secondsToLive: number): Promise<void>;
}

export type TimedValue = {
	value: string;
	secondsToLive: number;
}

export const redisProviderAlias = 'RedisProvider';
