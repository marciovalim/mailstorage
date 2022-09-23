import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { Controller } from '../../../core/Controller';
import { ConfirmUserAccessUseCase } from '../usecases/ConfirmUserAccessUseCase';

@injectable()
export class ConfirmUserAccessController implements Controller {
	constructor(
    @inject(ConfirmUserAccessUseCase)
    private confirmUserAccessUseCase: ConfirmUserAccessUseCase,
	) {}

	private bodyShema = yup.object({
		email: yup.string().email().required(),
		code: yup.string().required(),
	});

	async handle(req: Request, res: Response): Promise<Response> {
		throw new Error('Testing sentry.');

		const body = await this.bodyShema.validate(req.body, { abortEarly: false });

		const confirmRes = await this.confirmUserAccessUseCase.execute(body);

		res.status(confirmRes.result === 'SUCCESS' ? 200 : 400);
		return res.json(confirmRes);
	}
}
