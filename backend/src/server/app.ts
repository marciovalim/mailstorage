import 'express-async-errors';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import express from 'express';

import { Environment } from '../core/Environment';
import { handleErrors } from './middlewares/handleErrors';
import { rateLimiter } from './middlewares/rateLimiter';
import { appRouter } from './routes/router';

const app = express();

if (Environment.getType() === 'prod') {
	Sentry.init({
		dsn: Environment.vars.SENTRY_DSN,
		integrations: [
			new Sentry.Integrations.Http({ tracing: true }),
			new Tracing.Integrations.Express({ app }),
		],
		tracesSampleRate: 1.0,
	});
	app.use(Sentry.Handlers.requestHandler());
	app.use(Sentry.Handlers.tracingHandler());
}

app.use(express.json());
app.use(rateLimiter);
app.use(appRouter);

if (Environment.getType() === 'prod') {
	app.use(Sentry.Handlers.errorHandler());
}
app.use(handleErrors);

export { app };
