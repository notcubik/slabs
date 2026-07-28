import { browser } from '$app/environment';
import type { AccentColor } from '$lib/types/preferences.js';

const LIGHT_THEME_COLOR = '#F4F4F5';
const DARK_THEME_COLOR = '#0F1117';
const DARK_CONTRAST_THEME_COLOR = '#09090B';

let darkMode = $state(false);

export function getIsDarkMode(): boolean {
	return darkMode;
}

export function applyTheme(theme: 'system' | 'light' | 'dark' | 'dark-contrast'): void {
	if (!browser) return;

	const validThemes = ['system', 'light', 'dark', 'dark-contrast'] as const;
	if (!validThemes.includes(theme as typeof validThemes[number])) {
		theme = 'system';
	}

	let resolved: 'light' | 'dark' | 'dark-contrast' = theme as 'light' | 'dark' | 'dark-contrast';
	if (theme === 'system') {
		const prefersDark =
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-color-scheme: dark)').matches;
		resolved = prefersDark ? 'dark' : 'light';
	}

	const isDark = resolved !== 'light';
	darkMode = isDark;

	if (resolved === 'light') {
		document.documentElement.removeAttribute('data-theme');
	} else {
		document.documentElement.setAttribute('data-theme', resolved);
	}

	const color = resolved === 'dark-contrast' ? DARK_CONTRAST_THEME_COLOR : isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR;
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) {
		meta.setAttribute('content', color);
	}
}

export function applyAccentColor(accentColor: AccentColor): void {
	if (!browser) return;
	document.documentElement.setAttribute('data-color', accentColor);
}
