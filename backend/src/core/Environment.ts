import * as dotenv from 'dotenv';
import * as yup from 'yup';
import { InferType } from 'yup';

import { Validator } from './Validator';

export class Environment {
	private static varsSchema = yup.object({
		NODE_ENV: yup.string().required().oneOf(['dev', 'test', 'prod']),
		REDIS_HOST: yup.string().required(),
		REDIS_HOST_TEST: yup.string().required(),
		REDIS_PORT: yup.string().required(),
		REDIS_USERNAME: yup.string().required(),
		REDIS_PASSWORD: yup.string().required(),
		AWS_ACCESS_KEY_ID: yup.string().required(),
		AWS_SECRET_ACCESS_KEY: yup.string().required(),
		AWS_REGION: yup.string().required(),
		MAIL_FROM: yup.string().required(),
		MAIL_WELCOME_MSG: yup.string().required(),
		MAIL_WELCOME_BACK_MSG: yup.string().required(),
		AWS_VERIFIED_MAIL_RECIPIENT: yup.string().required(),
		JWT_SECRET: yup.string().required(),
	});

	static vars: InferType<typeof Environment.varsSchema>;

	static async assertInitialized() {
		if (Environment.isInitialized()) return;
		dotenv.config();

		try {
			Environment.vars = await this.varsSchema.validate(process.env, { abortEarly: false });
		} catch (err) {
			if (err instanceof yup.ValidationError) {
				const formatted = await Validator.formatYupErrors(err);
				throw new Error(JSON.stringify({
					environment: formatted,
				}));
			}
		}
	}

	private static isInitialized() {
		return Environment.vars !== undefined;
	}

	static getType(): 'dev' | 'test' | 'prod' {
		return process.env.NODE_ENV as 'dev' | 'test' | 'prod';
	}
}
