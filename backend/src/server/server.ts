import { DependencyInjection, find } from '../core/DependencyInjection';
import { Environment } from '../core/Environment';
import { PM2 } from '../core/PM2';
import { RedisProvider, redisProviderAlias } from '../providers/redis/RedisProvider';
import { app } from './app';

Environment.assertInitialized();
DependencyInjection.assertInitialized();
const server = app.listen(Environment.vars.PORT, onListening);
PM2.onClose(shutDownGracefully);

async function onListening() {
	await find<RedisProvider>(redisProviderAlias).open();
	PM2.emitReady();
	console.log('🚀 Server is running with a change!');
}

function shutDownGracefully() {
	server.close(async () => {
		await find<RedisProvider>(redisProviderAlias).close();
		process.exit(0);
	});
}
