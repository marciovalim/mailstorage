import Handlebars from 'handlebars';

import { Templater, TemplaterReplacements } from '../Templater';

export class TemplaterHandleBars implements Templater {
	async render(html: string, replacements: TemplaterReplacements): Promise<string> {
		const template = Handlebars.compile(html);
		return template(replacements, replacements);
	}
}
