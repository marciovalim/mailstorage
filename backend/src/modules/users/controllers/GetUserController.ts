import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { GetUserUseCase } from '../usecases/GetUserUseCase';

@injectable()
export class GetUserController {
	constructor(
		@inject(GetUserUseCase)
		private getUserUseCase: GetUserUseCase,
	) {}

	async handle(req: Request, res: Response): Promise<Response> {
		const user = await this.getUserUseCase.execute({ email: req.user!.email });

		return res.json(user);
	}
}
