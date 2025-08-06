// src/components/graph/transform.js
import { getCollection } from 'astro:content';

export async function getGraphData() {

	// Fetch all content
	const allContent = await getCollection('content')

	// Transform content into graph data
	function createGraphData(content) {
		const nodes = []
		const links = []
		const tagNodes = new Set()

		// Separate content by type (assuming you have a way to distinguish)
		// If you don't have a type field, you could use folder structure or filename patterns
		const blogPosts = content.filter(item =>
			item.id.startsWith('blog/') || item.id.includes('/blog/')
		)
		const projects = content.filter(item =>
			item.id.startsWith('proj/') || item.id.includes('/proj')
		)

		// Create nodes for blog posts (group 1)
		blogPosts.forEach(post => {
			nodes.push({
				id: post.data.title,
				group: 1,
				type: 'blog',
				slug: post.slug,
				description: post.data.description
			})

			// Create links to tags
			if (post.data.tags) {
				post.data.tags.forEach(tag => {
					tagNodes.add(tag)
					links.push({
						source: post.data.title,
						target: tag,
						value: 1
					})
				})
			}
		})

		// Create nodes for projects (group 2)
		projects.forEach(project => {
			nodes.push({
				id: project.data.title,
				group: 2,
				type: 'project',
				slug: project.slug,
				description: project.data.description
			})

			// Create links to tags
			if (project.data.tags) {
				project.data.tags.forEach(tag => {
					tagNodes.add(tag)
					links.push({
						source: project.data.title,
						target: tag,
						value: 1
					})
				})
			}
		})

		// Create nodes for tags (group 3)
		tagNodes.forEach(tag => {
			nodes.push({
				id: tag,
				group: 3,
				type: 'tag'
			})
		})

		return { nodes, links }
	}

	return createGraphData(allContent);
}