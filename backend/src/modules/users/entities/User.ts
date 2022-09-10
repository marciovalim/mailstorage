export class User {
	email: string;
	verificationCodes: [VerificationCode | undefined, VerificationCode | undefined];
	files: string[];

	constructor(email: string) {
		this.email = email;
		this.verificationCodes = [undefined, undefined];
		this.files = [];
	}
}

export type VerificationCode = {
	code: string;

	/**
   * Time to live in seconds
   */
	secondsToLive: number;
};
