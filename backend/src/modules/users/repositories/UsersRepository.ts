import { User, UserFile } from '../entities/User';

export type SaveVerificationDTO = {
	email: string;
	verification: {
		code: string
		slot: 1 | 2;
		secondsToLive: number;
	}
}

export type UsersRepository = {
	saveVerification({ email, verification }: SaveVerificationDTO): Promise<void>;
	findByEmail(email: string): Promise<User>;
	saveFile(email: string, userFile: UserFile): Promise<void>;
	deleteFile(email: string, userFile: UserFile): Promise<void>;
}

export const usersRepositoryAlias = 'UsersRepository';
