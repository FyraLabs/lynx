import { getDb } from '$lib/server/db/index.js';
import { link } from '$lib/server/db/schema.js';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { zod4 } from 'sveltekit-superforms/adapters';
import { CreateLinkForm } from './schema.ts';
import { setError, superValidate } from 'sveltekit-superforms';
import { desc, eq } from 'drizzle-orm';

function randomSlug(length = 6): string {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const bytes = crypto.getRandomValues(new Uint8Array(length));
	return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
}

export const load = async (event) => {
	if (!event.locals.user) return {};

	const db = getDb(event.platform!.env.DB);

	return {
		links: await db.select().from(link).orderBy(desc(link.createdAt)),
		createLinkForm: await superValidate(zod4(CreateLinkForm))
	};
};

export const actions = {
	login: async (event) => {
		const response = await event.locals.auth.api.signInWithOAuth2({
			body: {
				providerId: 'sso'
			}
		});

		if (response.redirect) {
			return redirect(303, response.url);
		}
	},
	createLink: async (event) => {
		if (!event.locals.user) return fail(401);

		const form = await superValidate(event, zod4(CreateLinkForm));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const slug = form.data.slug || randomSlug();

		const db = getDb(event.platform!.env.DB);
		const results = await db
			.insert(link)
			.values({
				slug,
				url: form.data.url
			})
			.onConflictDoNothing()
			.returning();

		if (results.length === 0) {
			return setError(form, 'slug', 'Slug already exists');
		}

		await event.platform!.env.KV.put(`link:${slug}`, JSON.stringify({ url: form.data.url }));

		return {
			form
		};
	},
	deleteLink: async (event) => {
		if (!event.locals.user) return fail(401);

		const formData = await event.request.formData();
		const id = formData.get('id');
		if (typeof id !== 'string') return fail(400, 'Invalid ID');

		const db = getDb(event.platform!.env.DB);
		await db.delete(link).where(eq(link.id, id));

		await event.platform!.env.KV.delete(`link:${id}`);
	}
} satisfies Actions;
