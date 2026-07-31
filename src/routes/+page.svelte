<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import CreateLinkDialog from './create-link-dialog.svelte';
	import cat from './cat.txt?raw';
	import TrashIcon from '$lib/assets/trash.svg?raw';

	const { data } = $props();
</script>

<main class="mx-auto max-w-4xl p-4">
	{#if data.links}
		<div class="mb-4 flex items-center justify-between">
			<h1 class="text-3xl font-bold">Lynx</h1>
			<CreateLinkDialog form={data.createLinkForm} />
		</div>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-25">Slug</Table.Head>
					<Table.Head>URL</Table.Head>
					<Table.Head class="text-end">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.links as link (link.id)}
					<Table.Row>
						<Table.Cell class="font-medium">{link.slug}</Table.Cell>
						<Table.Cell
							><a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a
							></Table.Cell
						>
						<Table.Cell class="text-end">
							<form action="?/deleteLink" method="POST" use:enhance>
								<input type="hidden" name="id" value={link.id} />
								<Button variant="outline" size="sm" type="submit"
									><span class="dark:invert">
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										{@html TrashIcon}</span
									></Button
								>
							</form>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		<div class="flex flex-col items-center gap-4">
			<!-- https://user.xmission.com/~emailbox/ascii_cats.htm -->
			<pre class="mt-8">{cat}</pre>
			<form method="POST" action="?/login" use:enhance>
				<Button type="submit" variant="ghost">Login</Button>
			</form>
		</div>
	{/if}
</main>
