import { redisProvider } from '../core/DependencyInjection';
import { PM2 } from '../core/PM2';
import { app } from './app';

const server = app.listen(3333, onListening);
PM2.onClose(shutDownGracefully);

async function onListening() {
	await redisProvider.open();
	PM2.emitReady();
	console.log('🚀 Server is running!');
}

function shutDownGracefully() {
	server.close(async () => {
		await redisProvider.close();
		process.exit(0);
	});
}
