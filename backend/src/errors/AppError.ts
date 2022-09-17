export class AppError {
	constructor(
		public readonly statusCode: number,
		public readonly reason: string | null,
		public readonly payload = {},
	) {}
}
