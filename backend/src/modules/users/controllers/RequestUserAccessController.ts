import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import * as yup from 'yup';

import { Controller } from '../../../core/Controller';
import { RequestUserAccessUseCase } from '../usecases/RequestUserAccessUseCase';

@injectable()
export class RequestUserAccessController implements Controller {
	constructor(
    @inject(RequestUserAccessUseCase)
		private requestUserAccessUseCase: RequestUserAccessUseCase,
	) {}

	private bodySchema = yup.object({
		email: yup.string().email().required(),
	});

	async handle(req: Request, res: Response): Promise<Response> {
		const body = await this.bodySchema.validate(req.body, { abortEarly: false });

		await this.requestUserAccessUseCase.execute(body.email);

		return res.status(204).json({ email: body.email });
	}
}
