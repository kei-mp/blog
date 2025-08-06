// src/components/graph/transform.js
import { getCollection } from 'astro:content';

export async function getGraphData() {
	const allContent = await getCollection('content')

	function createGraphData(content) {
		const nodes = []
		const links = []
		const tagNodes = new Set()

		// create nodes for blog posts (group 1)
    const blogPosts = content.filter(item =>
			item.id.startsWith('blog/') || item.id.includes('/blog/')
		)
		blogPosts.forEach(post => {
      nodes.push({
        id: post.data.title,
        group: 1,
        type: 'blog',
        url: `/${post.id}`,
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

		// create nodes for projects (group 2)
    const projects = content.filter(item =>
			item.id.startsWith('proj/') || item.id.includes('/proj')
		)
		projects.forEach(project => {
      nodes.push({
        id: project.data.title, 
        group: 2,
        type: 'project',
        url: `/${project.id}`,
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

		// create nodes for tags (group 3)
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