export type RandomProvider = {
	string(length: number, type: 'alpha' | 'numeric' | 'alphanumeric'): string;
}

export const randomProviderAlias = 'RandomProvider';
