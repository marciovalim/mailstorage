import { ValidationError } from 'yup';

export class Validator {
	static async formatYupErrors(err: ValidationError) {
		return err.inner.reduce((acc: any, err: any) => ({ ...acc, [err.path]: err.message }), {});
	}
}
