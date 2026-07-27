import { describe, it, expect } from 'vitest';
import { getNoteColor, NOTE_COLORS, NOTE_COLORS_DARK } from '$lib/utils/colors.js';

describe('getNoteColor', () => {
	it('returns light color when isDark is false', () => {
		expect(getNoteColor('default', false)).toBe('#FFFFFF');
		expect(getNoteColor('coral', false)).toBe('#FFF1F2');
	});

	it('returns dark color when isDark is true', () => {
		expect(getNoteColor('default', true)).toBe('#18181B');
		expect(getNoteColor('coral', true)).toBe('#2D1518');
	});

	it('returns default color for unknown color name', () => {
		expect(getNoteColor('unknown' as any, false)).toBe('#FFFFFF');
		expect(getNoteColor('unknown' as any, true)).toBe('#18181B');
	});

	it('has matching keys in light and dark color maps', () => {
		const lightKeys = Object.keys(NOTE_COLORS).sort();
		const darkKeys = Object.keys(NOTE_COLORS_DARK).sort();
		expect(lightKeys).toEqual(darkKeys);
	});
});
