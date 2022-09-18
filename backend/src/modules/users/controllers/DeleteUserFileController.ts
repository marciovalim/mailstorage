import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { DeleteUserFileUseCase } from '../usecases/DeleteUserFileUseCase';

@injectable()
export class DeleteUserFileController {
	constructor(
		@inject(DeleteUserFileUseCase)
		private deleteUserFileUseCase: DeleteUserFileUseCase,
	) {}

	async handle(req: Request, res: Response): Promise<Response> {
		await this.deleteUserFileUseCase.execute({
			email: req.user!.email,
			link: req.params.id.toString(),
		});

		return res.status(204).send();
	}
}
