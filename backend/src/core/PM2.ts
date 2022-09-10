export class PM2 {
	static onClose(callback: () => void): void {
		process.on('SIGINT', callback);
		process.on('SIGTERM', callback);
	}

	static emitReady(): void {
		process.send!('ready');
	}
}
