import { browser } from '$app/environment';
import type { ColorScheme } from '$lib/types/preferences.js';

const LIGHT_THEME_COLOR = '#f8f9fc';
const DARK_THEME_COLOR = '#0f1117';

let darkMode = $state(false);

export function getIsDarkMode(): boolean {
	return darkMode;
}

export function applyTheme(theme: 'system' | 'light' | 'dark'): void {
	if (!browser) return;

	// Validate input
	if (theme !== 'system' && theme !== 'light' && theme !== 'dark') {
		theme = 'system';
	}

	// Resolve system preference
	let resolved = theme;
	if (theme === 'system') {
		const prefersDark =
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-color-scheme: dark)').matches;
		resolved = prefersDark ? 'dark' : 'light';
	}

	const isDark = resolved === 'dark';
	darkMode = isDark;

	if (isDark) {
		document.documentElement.setAttribute('data-theme', 'dark');
	} else {
		document.documentElement.removeAttribute('data-theme');
	}

	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) {
		meta.setAttribute('content', isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR);
	}
}

export function applyColorScheme(colorScheme: ColorScheme): void {
	if (!browser) return;
	document.documentElement.setAttribute('data-color', colorScheme);
}
