import { getPreferences } from '$lib/stores/preferences.svelte.js';
import type { DateFormat, TimeFormat } from '$lib/types/preferences.js';

export function formatDate(date: Date | string, format?: DateFormat): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	const fmt = format ?? getPreferences().dateFormat;
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');

	switch (fmt) {
		case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
		case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
		default: return `${month}/${day}/${year}`;
	}
}

export function formatTime(date: Date | string, format?: TimeFormat): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	const fmt = format ?? getPreferences().timeFormat;

	if (fmt === '24h') {
		return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
	}

	let hours = d.getHours();
	const ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12 || 12;
	return `${hours}:${String(d.getMinutes()).padStart(2, '0')} ${ampm}`;
}

export function formatDateTime(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	const prefs = getPreferences();
	const df = formatDate(d, prefs.dateFormat);
	const tf = formatTime(d, prefs.timeFormat);
	return `${df} ${tf}`;
}
