import { ValidationError } from 'yup';

export class Validator {
	static formatYupErrors(err: ValidationError): object {
		return err.inner.reduce((acc: any, err: any) => ({ ...acc, [err.path]: err.message }), {});
	}
}
