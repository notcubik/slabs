import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { getUserId } from '$lib/server/api-utils.js';
import { existsSync, mkdirSync } from 'fs';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';

const DATA_DIR = process.env.DATA_DIR || './data';
const AVATARS_DIR = join(DATA_DIR, 'avatars');

if (!existsSync(AVATARS_DIR)) {
	mkdirSync(AVATARS_DIR, { recursive: true });
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export const POST: RequestHandler = async (event) => {
	const userId = getUserId(event);
	const formData = await event.request.formData();
	const file = formData.get('avatar') as File | null;

	if (!file || file.size === 0) {
		return json({ error: 'No file provided' }, { status: 400 });
	}

	if (!ALLOWED_TYPES.includes(file.type)) {
		return json({ error: 'Invalid file type. Use JPG, PNG, WebP, or GIF.' }, { status: 400 });
	}

	if (file.size > MAX_SIZE) {
		return json({ error: 'File too large. Max 2MB.' }, { status: 400 });
	}

	const ext = file.type.split('/')[1] || 'jpg';
	const filename = `${userId}.${ext}`;
	const filePath = join(AVATARS_DIR, filename);

	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(filePath, buffer);

	// Delete old avatar if extension changed
	const existing = db.select({ avatar: users.avatar }).from(users).where(eq(users.id, userId)).get();
	if (existing?.avatar && existing.avatar !== ext) {
		try {
			await unlink(join(AVATARS_DIR, `${userId}.${existing.avatar}`));
		} catch {
			// old file may not exist
		}
	}

	db.update(users).set({ avatar: ext }).where(eq(users.id, userId)).run();

	return json({ ok: true, avatar: ext });
};

export const DELETE: RequestHandler = async (event) => {
	const userId = getUserId(event);
	const existing = db.select({ avatar: users.avatar }).from(users).where(eq(users.id, userId)).get();

	if (existing?.avatar) {
		try {
			await unlink(join(AVATARS_DIR, `${userId}.${existing.avatar}`));
		} catch {
			// file may not exist
		}
	}

	db.update(users).set({ avatar: null }).where(eq(users.id, userId)).run();

	return json({ ok: true });
};

export const GET: RequestHandler = async (event) => {
	const userId = event.url.searchParams.get('userId');
	if (!userId) return json({ error: 'userId required' }, { status: 400 });

	const user = db.select({ avatar: users.avatar }).from(users).where(eq(users.id, Number(userId))).get();
	if (!user?.avatar) return json({ error: 'No avatar' }, { status: 404 });

	const filePath = join(AVATARS_DIR, `${userId}.${user.avatar}`);
	if (!existsSync(filePath)) return json({ error: 'File not found' }, { status: 404 });

	const { readFile } = await import('fs/promises');
	const data = await readFile(filePath);
	const mimeTypes: Record<string, string> = {
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		webp: 'image/webp',
		gif: 'image/gif'
	};

	return new Response(data, {
		headers: {
			'Content-Type': mimeTypes[user.avatar] || 'image/jpeg',
			'Cache-Control': 'public, max-age=86400'
		}
	});
};
