import type { NoteColor } from '$lib/types/index.js';

export const NOTE_COLORS: Record<NoteColor, { bg: string; label: string }> = {
	default: { bg: '#ffffff', label: 'Default' },
	coral: { bg: '#FEE2E2', label: 'Coral' },
	peach: { bg: '#FFEDD5', label: 'Peach' },
	sand: { bg: '#FEF9C3', label: 'Sand' },
	mint: { bg: '#DCFCE7', label: 'Mint' },
	sage: { bg: '#D1FAE5', label: 'Sage' },
	fog: { bg: '#DBEAFE', label: 'Fog' },
	storm: { bg: '#E0E7FF', label: 'Storm' },
	dusk: { bg: '#EDE9FE', label: 'Dusk' },
	blossom: { bg: '#FCE7F3', label: 'Blossom' },
	clay: { bg: '#F5F5F4', label: 'Clay' },
	chalk: { bg: '#F9FAFB', label: 'Chalk' }
};

export const NOTE_COLORS_DARK: Record<NoteColor, { bg: string; label: string }> = {
	default: { bg: '#1a1d27', label: 'Default' },
	coral: { bg: '#451A1A', label: 'Coral' },
	peach: { bg: '#431407', label: 'Peach' },
	sand: { bg: '#3B3006', label: 'Sand' },
	mint: { bg: '#14532D', label: 'Mint' },
	sage: { bg: '#064E3B', label: 'Sage' },
	fog: { bg: '#1E3A5F', label: 'Fog' },
	storm: { bg: '#1E1B4B', label: 'Storm' },
	dusk: { bg: '#2E1065', label: 'Dusk' },
	blossom: { bg: '#500724', label: 'Blossom' },
	clay: { bg: '#27272A', label: 'Clay' },
	chalk: { bg: '#1F2937', label: 'Chalk' }
};

export function getNoteColor(color: NoteColor, isDark: boolean): string {
	const map = isDark ? NOTE_COLORS_DARK : NOTE_COLORS;
	return (map[color] ?? map.default).bg;
}

export const COLOR_OPTIONS = Object.entries(NOTE_COLORS).map(([value, { label }]) => ({
	value: value as NoteColor,
	label
}));
