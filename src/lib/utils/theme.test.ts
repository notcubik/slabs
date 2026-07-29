// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { AccentColor } from '$lib/types/preferences.js';

// Mock $app/environment
vi.mock('$app/environment', () => ({ browser: true }));

describe('applyTheme', () => {
	let applyTheme: (theme: 'system' | 'light' | 'dark') => void;

	beforeEach(async () => {
		// Reset DOM
		document.documentElement.removeAttribute('data-theme');
		const meta = document.querySelector('meta[name="theme-color"]');
		if (meta) meta.remove();
		const metaEl = document.createElement('meta');
		metaEl.setAttribute('name', 'theme-color');
		metaEl.setAttribute('content', '#F4F4F5');
		document.head.appendChild(metaEl);

		// Reset module state
		vi.resetModules();
		const mod = await import('$lib/utils/theme.svelte.js');
		applyTheme = mod.applyTheme;
	});

	it('sets data-theme="dark" for dark mode', () => {
		applyTheme('dark');
		expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
	});

	it('removes data-theme for light mode', () => {
		document.documentElement.setAttribute('data-theme', 'dark');
		applyTheme('light');
		expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
	});

	it('updates meta theme-color for dark mode', () => {
		applyTheme('dark');
		const meta = document.querySelector('meta[name="theme-color"]');
		expect(meta?.getAttribute('content')).toBe('#1A1C23');
	});

	it('updates meta theme-color for light mode', () => {
		applyTheme('dark');
		applyTheme('light');
		const meta = document.querySelector('meta[name="theme-color"]');
		expect(meta?.getAttribute('content')).toBe('#F4F4F5');
	});

	it('falls back to system for unknown values', () => {
		// matchMedia returns false by default in jsdom → resolves to light
		applyTheme('invalid' as 'system' | 'light' | 'dark');
		expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
	});

	it('resolves system preference to dark when prefers-color-scheme is dark', () => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: vi.fn().mockImplementation((query: string) => ({
				matches: query === '(prefers-color-scheme: dark)',
				media: query,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn()
			}))
		});
		applyTheme('system');
		expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
	});
});

describe('applyAccentColor', () => {
	let applyAccentColor: (accentColor: AccentColor) => void;

	beforeEach(async () => {
		document.documentElement.removeAttribute('data-color');
		vi.resetModules();
		const mod = await import('$lib/utils/theme.svelte.js');
		applyAccentColor = mod.applyAccentColor;
	});

	it('sets data-color attribute', () => {
		applyAccentColor('amber');
		expect(document.documentElement.getAttribute('data-color')).toBe('amber');
	});

	it('changes data-color when switching accents', () => {
		applyAccentColor('amber');
		applyAccentColor('ocean');
		expect(document.documentElement.getAttribute('data-color')).toBe('ocean');
	});
});
