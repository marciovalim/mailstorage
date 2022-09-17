namespace Express{
	export type Request = {
		user?: {
			email: string;
		}

		file?: {
			path: string;
		}
	}
}
