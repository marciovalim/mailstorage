export type JwtProvider = {
	generate(input: JwtInput): Promise<JwtResponse>;
	verify(token: string): Promise<object | null>;
}

export type JwtInput = {
	subject: string;
}

export type JwtResponse = {
	token: string;
	exp: number;
}

export const jwtProviderAlias = 'JwtProvider';
