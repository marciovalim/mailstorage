export class DateProvided {
	constructor(private readonly date: Date) {}

	get inSeconds(): number {
		return Math.floor(this.date.getTime() / 1000);
	}

	get inMilliseconds(): number {
		return this.date.getTime();
	}
}
