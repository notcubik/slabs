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

export const NOTE_COLORS_VIVID: Record<NoteColor, { bg: string; border: string; label: string }> = {
	default: { bg: '#E4E4E7', border: '#A1A1AA', label: 'Default' },
	coral: { bg: '#FDA4AF', border: '#FB7185', label: 'Coral' },
	peach: { bg: '#FDBA74', border: '#FB923C', label: 'Peach' },
	sand: { bg: '#FDE047', border: '#FACC15', label: 'Sand' },
	mint: { bg: '#86EFAC', border: '#4ADE80', label: 'Mint' },
	sage: { bg: '#6EE7B7', border: '#34D399', label: 'Sage' },
	fog: { bg: '#93C5FD', border: '#60A5FA', label: 'Fog' },
	storm: { bg: '#A5B4FC', border: '#818CF8', label: 'Storm' },
	dusk: { bg: '#C4B5FD', border: '#A78BFA', label: 'Dusk' },
	blossom: { bg: '#F9A8D4', border: '#F472B6', label: 'Blossom' },
	clay: { bg: '#D6D3D1', border: '#A8A29E', label: 'Clay' },
	chalk: { bg: '#CBD5E1', border: '#94A3B8', label: 'Chalk' }
};

export const NOTE_COLORS_VIVID_DARK: Record<NoteColor, { bg: string; border: string; label: string }> = {
	default: { bg: '#3F3F46', border: '#71717A', label: 'Default' },
	coral: { bg: '#FB7185', border: '#FDA4AF', label: 'Coral' },
	peach: { bg: '#FB923C', border: '#FDBA74', label: 'Peach' },
	sand: { bg: '#FACC15', border: '#FDE047', label: 'Sand' },
	mint: { bg: '#4ADE80', border: '#86EFAC', label: 'Mint' },
	sage: { bg: '#34D399', border: '#6EE7B7', label: 'Sage' },
	fog: { bg: '#60A5FA', border: '#93C5FD', label: 'Fog' },
	storm: { bg: '#818CF8', border: '#A5B4FC', label: 'Storm' },
	dusk: { bg: '#A78BFA', border: '#C4B5FD', label: 'Dusk' },
	blossom: { bg: '#F472B6', border: '#F9A8D4', label: 'Blossom' },
	clay: { bg: '#A8A29E', border: '#D6D3D1', label: 'Clay' },
	chalk: { bg: '#94A3B8', border: '#CBD5E1', label: 'Chalk' }
};

export function getNoteColor(color: NoteColor, isDark: boolean): string {
	const map = isDark ? NOTE_COLORS_DARK : NOTE_COLORS;
	return (map[color] ?? map.default).bg;
}

export function getVividColor(color: NoteColor, isDark: boolean): { bg: string; border: string } {
	const map = isDark ? NOTE_COLORS_VIVID_DARK : NOTE_COLORS_VIVID;
	const entry = map[color] ?? map.default;
	return { bg: entry.bg, border: entry.border };
}

export const COLOR_OPTIONS = Object.entries(NOTE_COLORS).map(([value, { label }]) => ({
	value: value as NoteColor,
	label
}));
