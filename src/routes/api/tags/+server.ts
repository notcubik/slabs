import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { tags } from '$lib/server/db/schema.js';
import { eq, and } from 'drizzle-orm';
import { getUserId } from '$lib/server/api-utils.js';

export const GET: RequestHandler = async (event) => {
	const userId = getUserId(event);
	const allTags = await db.select().from(tags).where(eq(tags.userId, userId));
	return json(allTags);
};

export const PATCH: RequestHandler = async (event) => {
	const userId = getUserId(event);
	const { id, name } = await event.request.json();
	if (!id || !name) return json({ error: 'id and name are required' }, { status: 400 });
	const sanitized = name.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
	if (!sanitized) return json({ error: 'Invalid tag name' }, { status: 400 });
	await db.update(tags).set({ name: sanitized }).where(and(eq(tags.id, id), eq(tags.userId, userId)));
	return json({ ok: true });
};

export const DELETE: RequestHandler = async (event) => {
	const userId = getUserId(event);
	const { id } = await event.request.json();
	if (!id) return json({ error: 'id is required' }, { status: 400 });
	await db.delete(tags).where(and(eq(tags.id, id), eq(tags.userId, userId)));
	return json({ ok: true });
};
