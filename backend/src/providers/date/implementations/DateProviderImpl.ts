import { injectable } from 'tsyringe';

import { DateProvider } from '../DateProvider';

@injectable()
export class DateProviderImpl implements DateProvider {
	oneFromNowInMilliseconds(): number {
		const millisecondsSinceEpoch = new Date().getTime();
		const oneHourMilliseconds = 60 * 60 * 1000;
		return millisecondsSinceEpoch + oneHourMilliseconds;
	}
}
