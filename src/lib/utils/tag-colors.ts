const TAG_PALETTE = [
	{ dot: '#6366F1', bg: 'rgba(99,102,241,0.1)', text: '#6366F1' },
	{ dot: '#D97706', bg: 'rgba(217,119,6,0.1)', text: '#D97706' },
	{ dot: '#059669', bg: 'rgba(5,150,105,0.1)', text: '#059669' },
	{ dot: '#0891B2', bg: 'rgba(8,145,178,0.1)', text: '#0891B2' },
	{ dot: '#E11D48', bg: 'rgba(225,29,72,0.1)', text: '#E11D48' },
	{ dot: '#7C3AED', bg: 'rgba(124,58,237,0.1)', text: '#7C3AED' },
	{ dot: '#0284C7', bg: 'rgba(2,132,199,0.1)', text: '#0284C7' },
	{ dot: '#0D9488', bg: 'rgba(13,148,136,0.1)', text: '#0D9488' },
	{ dot: '#65A30D', bg: 'rgba(101,163,13,0.1)', text: '#65A30D' },
	{ dot: '#EA580C', bg: 'rgba(234,88,12,0.1)', text: '#EA580C' },
	{ dot: '#DB2777', bg: 'rgba(219,39,119,0.1)', text: '#DB2777' },
	{ dot: '#9333EA', bg: 'rgba(147,51,234,0.1)', text: '#9333EA' }
];

const TAG_PALETTE_DARK = [
	{ dot: '#818CF8', bg: 'rgba(129,140,248,0.15)', text: '#818CF8' },
	{ dot: '#FBBF24', bg: 'rgba(251,191,36,0.15)', text: '#FBBF24' },
	{ dot: '#34D399', bg: 'rgba(52,211,153,0.15)', text: '#34D399' },
	{ dot: '#22D3EE', bg: 'rgba(34,211,238,0.15)', text: '#22D3EE' },
	{ dot: '#FB7185', bg: 'rgba(251,113,133,0.15)', text: '#FB7185' },
	{ dot: '#A78BFA', bg: 'rgba(167,139,250,0.15)', text: '#A78BFA' },
	{ dot: '#38BDF8', bg: 'rgba(56,189,248,0.15)', text: '#38BDF8' },
	{ dot: '#2DD4BF', bg: 'rgba(45,212,191,0.15)', text: '#2DD4BF' },
	{ dot: '#A3E635', bg: 'rgba(163,230,53,0.15)', text: '#A3E635' },
	{ dot: '#FB923C', bg: 'rgba(251,146,60,0.15)', text: '#FB923C' },
	{ dot: '#F472B6', bg: 'rgba(244,114,182,0.15)', text: '#F472B6' },
	{ dot: '#C084FC', bg: 'rgba(192,132,252,0.15)', text: '#C084FC' }
];

function hashTag(name: string): number {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = ((hash << 5) - hash) + name.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

export interface TagStyle {
	dot: string;
	bg: string;
	text: string;
}

export function getTagStyle(name: string, isDark: boolean): TagStyle {
	const palette = isDark ? TAG_PALETTE_DARK : TAG_PALETTE;
	const index = hashTag(name) % palette.length;
	return palette[index];
}

export function getTagDotColor(name: string): string {
	const index = hashTag(name) % TAG_PALETTE.length;
	return TAG_PALETTE[index].dot;
}
