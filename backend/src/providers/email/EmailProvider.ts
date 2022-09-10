export type SendMailDTO = {
	email: string;
	subject: string;
	body: string;
}

export type EmailProvider = {
	sendMail (data: SendMailDTO): Promise<void>;
}

export const emailProviderAlias = 'EmailProvider';
