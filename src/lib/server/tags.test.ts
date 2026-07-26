import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDb } from './db/test-helpers.js';
import { notes, tags, noteTags, users } from './db/schema.js';
import { eq } from 'drizzle-orm';
import type { Db } from './db/index.js';
import { fetchTagsForNotes, syncNoteTags } from './tags.js';

let db: Db;
const USER_ID = 1;

function seedUser() {
	db.insert(users)
		.values({ email: 'test@test.com', displayName: 'Test', role: 'admin', authProvider: 'password', createdAt: new Date() })
		.run();
}

function seedNote(id: string) {
	db.insert(notes)
		.values({ id, userId: USER_ID, title: '', content: '', createdAt: new Date(), updatedAt: new Date() })
		.run();
}

beforeEach(() => {
	const testDb = createTestDb();
	db = testDb.db;
	seedUser();
});

describe('syncNoteTags', () => {
	it('should create new tags and associations', () => {
		seedNote('n1');
		syncNoteTags(db, 'n1', ['todo', 'urgent'], USER_ID);

		const tagRows = db.select().from(tags).all();
		expect(tagRows).toHaveLength(2);

		const associations = db.select().from(noteTags).all();
		expect(associations).toHaveLength(2);
	});

	it('should remove old associations and add new ones', () => {
		seedNote('n1');
		syncNoteTags(db, 'n1', ['old-tag'], USER_ID);
		syncNoteTags(db, 'n1', ['new-tag'], USER_ID);

		const map = fetchTagsForNotes(db, ['n1']);
		expect(map.get('n1')).toEqual(['new-tag']);
	});

	it('should handle empty tag list (removes all)', () => {
		seedNote('n1');
		syncNoteTags(db, 'n1', ['tag1', 'tag2'], USER_ID);
		syncNoteTags(db, 'n1', [], USER_ID);

		const associations = db.select().from(noteTags).where(eq(noteTags.noteId, 'n1')).all();
		expect(associations).toHaveLength(0);
	});

	it('should deduplicate existing tags', () => {
		seedNote('n1');
		seedNote('n2');
		syncNoteTags(db, 'n1', ['shared-tag'], USER_ID);
		syncNoteTags(db, 'n2', ['shared-tag'], USER_ID);

		// Should reuse the same tag row
		const tagRows = db.select().from(tags).all();
		expect(tagRows).toHaveLength(1);
	});
});

describe('fetchTagsForNotes', () => {
	it('should return Map of noteId to tag names', () => {
		seedNote('n1');
		seedNote('n2');
		syncNoteTags(db, 'n1', ['alpha', 'beta'], USER_ID);
		syncNoteTags(db, 'n2', ['gamma'], USER_ID);

		const map = fetchTagsForNotes(db, ['n1', 'n2']);
		expect(map.get('n1')).toHaveLength(2);
		expect(map.get('n1')).toContain('alpha');
		expect(map.get('n1')).toContain('beta');
		expect(map.get('n2')).toEqual(['gamma']);
	});

	it('should return empty map for empty noteIds', () => {
		const map = fetchTagsForNotes(db, []);
		expect(map.size).toBe(0);
	});
});

describe('tag rename', () => {
	it('should rename a tag by updating the name field', () => {
		seedNote('n1');
		syncNoteTags(db, 'n1', ['old-name'], USER_ID);
		const tagRow = db.select().from(tags).where(eq(tags.name, 'old-name')).get();
		expect(tagRow).toBeDefined();

		db.update(tags).set({ name: 'new-name' }).where(eq(tags.id, tagRow!.id)).run();

		const renamed = db.select().from(tags).where(eq(tags.name, 'new-name')).get();
		expect(renamed).toBeDefined();
		expect(renamed!.id).toBe(tagRow!.id);
	});

	it('should preserve note associations after rename', () => {
		seedNote('n1');
		syncNoteTags(db, 'n1', ['work'], USER_ID);
		const tagRow = db.select().from(tags).where(eq(tags.name, 'work')).get();

		db.update(tags).set({ name: 'office' }).where(eq(tags.id, tagRow!.id)).run();

		const map = fetchTagsForNotes(db, ['n1']);
		expect(map.get('n1')).toContain('office');
		expect(map.get('n1')).not.toContain('work');
	});
});

describe('tag delete', () => {
	it('should delete a tag by id', () => {
		seedNote('n1');
		syncNoteTags(db, 'n1', ['to-delete'], USER_ID);
		const tagRow = db.select().from(tags).where(eq(tags.name, 'to-delete')).get();
		expect(tagRow).toBeDefined();

		db.delete(tags).where(eq(tags.id, tagRow!.id)).run();

		const deleted = db.select().from(tags).where(eq(tags.name, 'to-delete')).get();
		expect(deleted).toBeUndefined();
	});

	it('should remove note associations when tag is deleted', () => {
		seedNote('n1');
		syncNoteTags(db, 'n1', ['tag-1'], USER_ID);
		const tagRow = db.select().from(tags).where(eq(tags.name, 'tag-1')).get();

		db.delete(noteTags).where(eq(noteTags.tagId, tagRow!.id)).run();
		db.delete(tags).where(eq(tags.id, tagRow!.id)).run();

		const map = fetchTagsForNotes(db, ['n1']);
		expect(map.get('n1')).toBeUndefined();
	});
});
