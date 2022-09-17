import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { Controller } from '../../../core/Controller';
import { fileManager } from '../../../core/DependencyInjection';
import { AppError } from '../../../errors/AppError';
import { UploadUserFileUseCase } from '../usecases/UploadUserFileUseCase';

@injectable()
export class UploadUserFileController implements Controller {
	constructor(
	@inject(UploadUserFileUseCase)
private uploadUserFileUseCase: UploadUserFileUseCase,
	) {}

	async handle(req: Request, res: Response): Promise<Response> {
		if (!req.file) {
			throw new AppError(400, null, { result: 'FILE_NOT_SENT' });
		}

		try {
			await this.uploadUserFileUseCase.execute({
				userEmail: req.user!.email,
				filePath: req.file.path,
			});
		} finally {
			await fileManager.delete(req.file.path);
		}

		return res.status(200).json();
	}
}
