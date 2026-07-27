export const BASE_URL = 'http://localhost:4173';
export const SCREENSHOT_DB = './data/screenshots.db';
export const OUTPUT_DIR = 'website/assets';

export const DESKTOP_VIEWPORT = { width: 1280, height: 800 };
export const MOBILE_VIEWPORT = { width: 390, height: 844 };

export const ADMIN = {
	email: 'admin@slabs.app',
	displayName: 'Slabs Admin',
	password: crypto.randomUUID()
};

export const COLLABORATOR = {
	email: 'alice@slabs.app',
	displayName: 'Alice Chen',
	password: crypto.randomUUID()
};
