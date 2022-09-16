export type Templater = {
	render(html: string, replacements: TemplaterReplacements): Promise<string>;
}

export type TemplaterReplacements = {
	[key: string]: string | number | boolean;
}

export const templaterAlias = 'Templater';
