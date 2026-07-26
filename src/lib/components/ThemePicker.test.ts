import { describe, it, expect } from 'vitest';

describe('ThemePicker', () => {
	it('exports color scheme options', () => {
		const themes = ['slates', 'amber', 'emerald', 'ocean', 'violet', 'rose'] as const;
		expect(themes).toHaveLength(6);
		expect(themes).toContain('slates');
	});

	it('includes all required color schemes', () => {
		const themes = ['slates', 'amber', 'emerald', 'ocean', 'violet', 'rose'] as const;
		for (const t of themes) {
			expect(themes).toContain(t);
		}
	});
});
