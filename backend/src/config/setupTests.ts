import 'reflect-metadata';
import { DependencyInjection } from '../core/DependencyInjection';
import { Environment } from '../core/Environment';

jest.setTimeout(30 * 1000);

Environment.assertInitialized();
Environment.vars.STORAGE_PROVIDER = 'local';

DependencyInjection.assertInitialized();
