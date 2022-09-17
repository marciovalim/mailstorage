import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { Controller } from '../../../core/Controller';
import { AppError } from '../../../errors/AppError';
import { FileManager, fileManagerAlias } from '../../../providers/file-manager/FileManager';
import { UploadUserFileUseCase } from '../usecases/UploadUserFileUseCase';

@injectable()
export class UploadUserFileController implements Controller {
	constructor(
	@inject(UploadUserFileUseCase)
	private uploadUserFileUseCase: UploadUserFileUseCase,

	@inject(fileManagerAlias)
	private fileManager: FileManager,

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
			await this.fileManager.delete(req.file.path);
		}

		return res.status(200).json();
	}
}
