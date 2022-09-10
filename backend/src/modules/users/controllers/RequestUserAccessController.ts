import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { Controller } from '../../../core/Controller';
import { RequestUserAccessUseCase } from '../usecases/RequestUserAccessUseCase';

@injectable()
export class RequestUserAccessController implements Controller {
	constructor(
    @inject(RequestUserAccessUseCase)
		private requestUserAccessUseCase: RequestUserAccessUseCase,
	) {}

	async handle(req: Request, res: Response): Promise<Response> {
		const { email } = req.body;

		await this.requestUserAccessUseCase.execute(email);

		return res.status(204).json({ email });
	}
}
