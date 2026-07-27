import type { NoteColor } from '$lib/types/index.js';

export const NOTE_COLORS: Record<NoteColor, { bg: string; label: string }> = {
	default: { bg: '#FFFFFF', label: 'Default' },
	coral: { bg: '#FFF1F2', label: 'Coral' },
	peach: { bg: '#FFF7ED', label: 'Peach' },
	sand: { bg: '#FEFCE8', label: 'Sand' },
	mint: { bg: '#F0FDF4', label: 'Mint' },
	sage: { bg: '#ECFDF5', label: 'Sage' },
	fog: { bg: '#EFF6FF', label: 'Fog' },
	storm: { bg: '#EEF2FF', label: 'Storm' },
	dusk: { bg: '#F5F3FF', label: 'Dusk' },
	blossom: { bg: '#FDF2F8', label: 'Blossom' },
	clay: { bg: '#FAFAFA', label: 'Clay' },
	chalk: { bg: '#F8FAFC', label: 'Chalk' }
};

export const NOTE_COLORS_DARK: Record<NoteColor, { bg: string; label: string }> = {
	default: { bg: '#18181B', label: 'Default' },
	coral: { bg: '#2D1518', label: 'Coral' },
	peach: { bg: '#2D1E14', label: 'Peach' },
	sand: { bg: '#2D2A14', label: 'Sand' },
	mint: { bg: '#143520', label: 'Mint' },
	sage: { bg: '#0F2E1E', label: 'Sage' },
	fog: { bg: '#1A2744', label: 'Fog' },
	storm: { bg: '#1C1B3A', label: 'Storm' },
	dusk: { bg: '#231745', label: 'Dusk' },
	blossom: { bg: '#3B1528', label: 'Blossom' },
	clay: { bg: '#212124', label: 'Clay' },
	chalk: { bg: '#1C1F26', label: 'Chalk' }
};

export function getNoteColor(color: NoteColor, isDark: boolean): string {
	const map = isDark ? NOTE_COLORS_DARK : NOTE_COLORS;
	return (map[color] ?? map.default).bg;
}

export const COLOR_OPTIONS = Object.entries(NOTE_COLORS).map(([value, { label }]) => ({
	value: value as NoteColor,
	label
}));
