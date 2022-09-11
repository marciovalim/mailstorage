import { AnySchema, ValidationError } from 'yup';

export class Validator {
	static async castObject<T>(schema: AnySchema, object: any, namespace: string) : Promise<T> {
		try {
			await schema.validate(object, { abortEarly: false });
		} catch (err) {
			const isYupError = err instanceof ValidationError;
			if (!isYupError) throw err;

			const yupErrors = err.inner.reduce((acc: any, err: any) => ({ ...acc, [err.path]: err.message }), {});
			const errors = { [namespace]: yupErrors };
			throw new Error(JSON.stringify(errors));
		}

		return schema.cast(object);
	}
}
