import type { NoteColor } from './index.js';

export type AccentColor = 'slates' | 'amber' | 'emerald' | 'ocean' | 'rose' | 'violet' | 'sky' | 'teal' | 'lime' | 'orange' | 'pink' | 'purple' | 'indigo' | 'red' | 'green' | 'blue' | 'yellow' | 'cyan' | 'custom';
export type ThemeValue = 'system' | 'light' | 'dark' | 'dark-contrast';
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type TimeFormat = '12h' | '24h';

export interface UserPreferences {
	theme: ThemeValue;
	accentColor: AccentColor;
	customAccentColor: string;
	defaultNoteMode: 'richtext' | 'markdown';
	defaultNoteColor: NoteColor;
	hideFooter: boolean;
	sidebarDefaultState: 'open' | 'collapsed';
	notifyOnShare: boolean;
	notifyOnCollabRemoved: boolean;
	notifyOnNoteDeleted: boolean;
	dateFormat: DateFormat;
	timeFormat: TimeFormat;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
	theme: 'system',
	accentColor: 'slates',
	customAccentColor: '#6366F1',
	defaultNoteMode: 'richtext',
	defaultNoteColor: 'default',
	hideFooter: false,
	sidebarDefaultState: 'open',
	notifyOnShare: true,
	notifyOnCollabRemoved: true,
	notifyOnNoteDeleted: true,
	dateFormat: 'MM/DD/YYYY',
	timeFormat: '12h'
};

export const BOOLEAN_PREF_KEYS: ReadonlySet<keyof UserPreferences> = new Set([
	'hideFooter',
	'notifyOnShare',
	'notifyOnCollabRemoved',
	'notifyOnNoteDeleted'
]);
