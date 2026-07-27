import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { getUserId } from '$lib/server/api-utils.js';
import { unlockNote } from '$lib/server/notes-service.js';

export const POST: RequestHandler = async ({ params, request, ...event }) => {
	const userId = getUserId(event);
	const { password } = await request.json();

	if (!password || typeof password !== 'string') {
		throw error(400, 'Password is required');
	}

	const note = await unlockNote(db, userId, params.id, password);
	if (!note) throw error(401, 'Invalid password');

	return json(note);
};
