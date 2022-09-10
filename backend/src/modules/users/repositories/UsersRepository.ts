import { User } from '../entities/User';

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
}

export const usersRepositoryAlias = 'UsersRepository';
