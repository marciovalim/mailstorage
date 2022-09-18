import { injectable } from 'tsyringe';

import { DateProvided } from '../DateProvided';
import { DateProvider } from '../DateProvider';

@injectable()
export class DateProviderImpl implements DateProvider {
	nowPlusHours(hours: number): DateProvided {
		const millisecondsSinceEpoch = new Date().getTime();
		const oneHourMilliseconds = 60 * 60 * 1000;

		return new DateProvided(new Date(millisecondsSinceEpoch + (hours * oneHourMilliseconds)));
	}
}
