import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const proj = defineCollection({
	loader: glob({ base: './src/content/proj', pattern: '**/*.{md,mdx}' }),
	// type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const content = defineCollection({
	loader: glob({ base: './src/content', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

export const collections = { blog, proj, content };
