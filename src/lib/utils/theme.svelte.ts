import { browser } from '$app/environment';
import type { AccentColor } from '$lib/types/preferences.js';

const LIGHT_THEME_COLOR = '#F4F4F5';
const DARK_THEME_COLOR = '#1A1C23';
const DARK_CONTRAST_THEME_COLOR = '#09090B';

let darkMode = $state(false);

export function getIsDarkMode(): boolean {
	return darkMode;
}

function parseHex(hex: string): { r: number; g: number; b: number } | null {
	const m = /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.exec(hex);
	if (!m) return null;
	return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function hexToRgba(hex: string, alpha: number): string {
	const p = parseHex(hex);
	if (!p) return `rgba(99,102,241,${alpha})`;
	return `rgba(${p.r},${p.g},${p.b},${alpha})`;
}

function lighten(hex: string, amount: number): string {
	const p = parseHex(hex);
	if (!p) return hex;
	const r = Math.min(255, Math.round(p.r + (255 - p.r) * amount));
	const g = Math.min(255, Math.round(p.g + (255 - p.g) * amount));
	const b = Math.min(255, Math.round(p.b + (255 - p.b) * amount));
	return `rgb(${r},${g},${b})`;
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

export function applyAccentColor(accentColor: AccentColor, customHex?: string): void {
	if (!browser) return;

	if (accentColor === 'custom' && customHex) {
		const p = parseHex(customHex);
		if (p) {
			document.documentElement.setAttribute('data-color', 'custom');
			document.documentElement.style.setProperty('--primary', customHex);
			const hover = lighten(customHex, -0.15);
			document.documentElement.style.setProperty('--primary-hover', hover);
			document.documentElement.style.setProperty('--primary-subtle', hexToRgba(customHex, 0.06));
			document.documentElement.style.setProperty('--primary-muted', hexToRgba(customHex, 0.12));
			return;
		}
	}

	document.documentElement.removeAttribute('data-color');
	// Force re-flow so CSS rules apply
	void document.documentElement.offsetWidth;
	document.documentElement.setAttribute('data-color', accentColor);
}
