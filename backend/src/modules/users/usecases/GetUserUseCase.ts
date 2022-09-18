import { inject, injectable } from 'tsyringe';

import { UseCase } from '../../../core/UseCase';
import { User } from '../entities/User';
import { UsersRepository } from '../repositories/UsersRepository';

export type GetUserRequest = {
	email: string;
}

@injectable()
export class GetUserUseCase implements UseCase<GetUserRequest, User> {
	constructor(
    @inject('UsersRepository')
    private usersRepository: UsersRepository,
	) {}

	async execute(input: GetUserRequest): Promise<User> {
		return this.usersRepository.findByEmail(input.email);
	}
}
