import { error, redirect, type RequestEvent } from '@sveltejs/kit';

const logPlausibleEvent = async (event: RequestEvent) =>
	await fetch('https://plausible.fyralabs.com/api/event', {
		method: 'POST',
		body: JSON.stringify({
			domain: 'fyra.to',
			name: 'pageview',
			url: event.url.href,
			referrer: event.request.headers.get('Referer'),
			interactive: false
		}),
		headers: {
			'Content-Type': 'application/json',
			'User-Agent': event.request.headers.get('User-Agent')!,
			'x-plausible-ip': event.getClientAddress()
		}
	});

export const GET = async (event) => {
	const slug = event.params.slug;

	const link = (await event.platform!.env.KV.get(`link:${slug}`, { type: 'json' })) as {
		url: string;
	} | null;
	if (!link) {
		error(404, 'Link not found');
	}

	event.platform!.ctx.waitUntil(logPlausibleEvent(event));

	redirect(302, link.url);
};
