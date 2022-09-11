import 'reflect-metadata';
import { DependencyInjection } from '../core/DependencyInjection';
import { Environment } from '../core/Environment';

Environment.assertInitialized();
jest.setTimeout(30 * 1000);
DependencyInjection.assertInitialized();
