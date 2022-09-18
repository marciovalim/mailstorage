import { inject, injectable } from 'tsyringe';

import { UseCase } from '../../../core/UseCase';
import { AppError } from '../../../errors/AppError';
import { StorageProvider, storageProviderAlias } from '../../../providers/storage/StorageProvider';
import { UsersRepository, usersRepositoryAlias } from '../repositories/UsersRepository';

export type DeleteUserFileRequest = {
	email: string;
	link: string;
}

@injectable()
export class DeleteUserFileUseCase implements UseCase<DeleteUserFileRequest, void> {
	constructor(
    @inject(usersRepositoryAlias)
    private usersRepository: UsersRepository,

		@inject(storageProviderAlias)
		private storageProvider: StorageProvider,
	) {}

	async execute(data: DeleteUserFileRequest): Promise<void> {
		const user = await this.usersRepository.findByEmail(data.email);
		const matchedFile = user.files.find((file) => {
			const fileLinkEnd = decodeURIComponent(file.link).split('amazonaws.com/').pop();
			return fileLinkEnd === decodeURIComponent(data.link);
		});
		if (!matchedFile) {
			throw new AppError(404, null);
		}

		await this.usersRepository.deleteFile(data.email, matchedFile);
		await this.storageProvider.deleteFile(data.link);
	}
}
