import type { NoteColor } from './index.js';

export type ColorScheme = 'slates' | 'amber' | 'emerald' | 'ocean' | 'rose' | 'midnight' | 'forest';

export interface UserPreferences {
	theme: 'system' | 'light' | 'dark';
	colorScheme: ColorScheme;
	defaultNoteMode: 'richtext' | 'markdown';
	defaultNoteColor: NoteColor;
	hideFooter: boolean;
	sidebarDefaultState: 'open' | 'collapsed';
	notifyOnShare: boolean;
	notifyOnCollabRemoved: boolean;
	notifyOnNoteDeleted: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
	theme: 'system',
	colorScheme: 'slates',
	defaultNoteMode: 'richtext',
	defaultNoteColor: 'default',
	hideFooter: false,
	sidebarDefaultState: 'open',
	notifyOnShare: true,
	notifyOnCollabRemoved: true,
	notifyOnNoteDeleted: true
};

export const BOOLEAN_PREF_KEYS: ReadonlySet<keyof UserPreferences> = new Set([
	'hideFooter',
	'notifyOnShare',
	'notifyOnCollabRemoved',
	'notifyOnNoteDeleted'
]);
