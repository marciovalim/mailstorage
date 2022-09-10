import { RandomProvider } from '../RandomProvider';

export class RandomProviderImpl implements RandomProvider {
	string(length: number, type: 'alpha' | 'numeric' | 'alphanumeric'): string {
		const possible = {
			alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
			numeric: '0123456789',
			alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
		}[type];
		let text = '';
		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
}
