import * as dotenv from 'dotenv';
import * as yup from 'yup';
import { InferType } from 'yup';

import { Validator } from './Validator';

export class Environment {
	private static varsSchema = yup.object({
		REDIS_HOST: yup.string().required(),
		REDIS_PORT: yup.string().required(),
		REDIS_USERNAME: yup.string().required(),
		REDIS_PASSWORD: yup.string().required(),
	});

	static vars: InferType<typeof Environment.varsSchema>;

	static async assertInitialized() {
		if (Environment.isInitialzed()) return;
		const nodeEnv = process.env.NODE_ENV;
		if (!nodeEnv) throw new Error('NODE_ENV is not defined');
		if (!['dev', 'test', 'prod'].includes(nodeEnv)) throw new Error('NODE_ENV is invalid');

		dotenv.config({ path: `env/${nodeEnv}.env` });
		Environment.vars = await Validator.castObject<InferType<typeof Environment.varsSchema>>(Environment.varsSchema, process.env, 'environment variables');
	}

	private static isInitialzed() {
		return Environment.vars !== undefined;
	}
}
