export type RandomProvider = {
	string(length: number, type: 'alpha' | 'numeric' | 'alphanumeric'): string;
	integer(min: number, max: number): number;
}

export const randomProviderAlias = 'RandomProvider';
