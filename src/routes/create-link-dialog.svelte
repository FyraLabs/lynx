<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { CreateLinkForm } from './schema';
	import { z } from 'zod';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { untrack } from 'svelte';

	let { form: initialForm }: { form: SuperValidated<z.infer<typeof CreateLinkForm>> } = $props();

	let open = $state(false);

	const form = superForm(
		untrack(() => initialForm),
		{
			validators: zod4Client(CreateLinkForm),
			onUpdate({ form }) {
				if (form.valid) {
					open = false;
				}
			}
		}
	);

	const { form: formData, enhance } = form;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button variant="outline" {...props}>New Link</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>New Link</Dialog.Title>
			<Dialog.Description>
				Once you create a link, it will be made immedately available and public for use.
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/createLink" use:enhance>
			<Form.Field {form} name="slug" class="mb-2">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Slug</Form.Label>
						<Input
							placeholder="Leave blank for random"
							{...props}
							bind:value={$formData.slug}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="url" class="mb-2">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>URL</Form.Label>
						<Input placeholder="https://calico.corp" {...props} bind:value={$formData.url} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Dialog.Footer>
				<Form.Button>Create</Form.Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
