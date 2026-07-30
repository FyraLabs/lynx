import { z } from 'zod';

export const CreateLinkForm = z.object({
	slug: z
		.string()
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			'Slug must be lowercase letters, numbers, and hyphens only'
		),
	url: z.url('URL must be a valid URL')
});
