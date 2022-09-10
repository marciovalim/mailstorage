import { User } from '../../entities/User';
import { SaveVerificationDTO, UsersRepository } from '../UsersRepository';

export class UsersRepositoryInMemory implements UsersRepository {
	public users : User[] = [];

	async saveVerification({ email, verification }: SaveVerificationDTO): Promise<void> {
		const user = await this.findByEmail(email);

		const index = verification.slot - 1;
		user.verificationCodes[index] = {
			code: verification.code,
			secondsToLive: verification.secondsToLive,
		};

		this.users = this.users.filter((u) => u.email !== email);
		this.users.push(user);
	}

	async findByEmail(email: string): Promise<User> {
		const user = this.users.find((user) => user.email === email);
		if (user) return user;

		const emptyUser = new User(email);
		emptyUser.verificationCodes = [undefined, undefined];
		emptyUser.files = [];
		return emptyUser;
	}
}
