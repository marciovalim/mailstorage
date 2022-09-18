import { inject, injectable } from 'tsyringe';

import { Environment } from '../../../core/Environment';
import { UseCase } from '../../../core/UseCase';
import { AppError } from '../../../errors/AppError';
import { fileManagerAlias, FileManager } from '../../../providers/file-manager/FileManager';
import { StorageProvider, storageProviderAlias } from '../../../providers/storage/StorageProvider';
import { usersRepositoryAlias, UsersRepository } from '../repositories/UsersRepository';

export type UploadUserFileRequest = {
	userEmail: string;
	filePath: string;
}

export type UploadUserFileResponse = {
	link: string;
}

@injectable()
export class UploadUserFileUseCase implements UseCase<UploadUserFileRequest, UploadUserFileResponse> {
	constructor(
    @inject(fileManagerAlias)
    private fileManager: FileManager,

    @inject(storageProviderAlias)
    private storageProvider: StorageProvider,

    @inject(usersRepositoryAlias)
    private usersRepository: UsersRepository,
	) {}

	async execute(input: UploadUserFileRequest): Promise<UploadUserFileResponse> {
		const user = await this.usersRepository.findByEmail(input.userEmail);
		const newFileSize = await this.fileManager.getByteSize(input.filePath);

		if (newFileSize > Environment.vars.BYTES_LIMIT_PER_FILE) {
			throw new AppError(400, 'FILE_TOO_BIG', {
				maxBytesPerFile: Environment.vars.BYTES_LIMIT_PER_FILE,
			});
		}

		if (user.getRemainingBytes() < newFileSize) {
			throw new AppError(403, 'BYTES_LIMIT_REACHED');
		}

		if (user.files.length >= Environment.vars.FILES_LIMIT_PER_USER) {
			throw new AppError(403, 'FILES_LIMIT_REACHED');
		}

		const fileContent = await this.fileManager.read(input.filePath);
		const storageLink = await this.storageProvider.saveFile(input.userEmail, fileContent);

		await this.usersRepository.saveFile(input.userEmail, {
			bytes: newFileSize,
			link: storageLink,
		});

		return { link: storageLink };
	}
}
