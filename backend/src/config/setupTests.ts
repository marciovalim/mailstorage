import 'reflect-metadata';
import { DependencyInjection } from '../core/DependencyInjection';

jest.setTimeout(30 * 1000);
DependencyInjection.assertInitialized();
