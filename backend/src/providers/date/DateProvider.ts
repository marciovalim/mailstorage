import { DateProvided } from './DateProvided';

export type DateProvider = {
	nowPlusHours(hours: number): DateProvided;
}

export const dateProviderAlias = 'DateProvider';
