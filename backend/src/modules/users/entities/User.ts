import { Environment } from '../../../core/Environment';

export class User {
	email: string;
	verificationCodes: [VerificationCode | undefined, VerificationCode | undefined];
	files: UserFile[];

	constructor(email: string) {
		this.email = email;
		this.verificationCodes = [undefined, undefined];
		this.files = [];
	}

	getBytesUsed(): number {
		return this.files.reduce((acc, curr) => acc + curr.bytes, 0);
	}

	getRemainingBytes(): number {
		return Environment.vars.BYTES_LIMIT_PER_USER - this.getBytesUsed();
	}
}

export type VerificationCode = {
	code: string;

	/**
   * Time to live in seconds
   */
	secondsToLive: number;
};

export type UserFile = {
	bytes: number;
	link: string;
}
