import { TemplaterHandleBars } from '../implementations/TemplaterHandleBars';
import { Templater } from '../Templater';

describe('Templater', () => {
	describe('TemplaterHandleBars', () => {
		const templater: Templater = new TemplaterHandleBars();

		it('should render a template', async () => {
			const html = 'Hello {{name}}';
			const replacements = { name: 'John' };

			const result = await templater.render(html, replacements);

			expect(result).toBe('Hello John');
		});
	});
});
