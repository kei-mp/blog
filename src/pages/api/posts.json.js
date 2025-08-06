// src/pages/api/posts.json.js
import { getCollection } from 'astro:content';

export async function GET() {
  try {
    const posts = await getCollection('content');
    
    // Transform posts into the format we need for the graph
    const graphData = posts.map(post => ({
      id: post.id,
      slug: post.slug,
      title: post.data.title,
      tags: post.data.tags || [],
      x: undefined,  // D3 will set these
      y: undefined   // D3 will set these
    }));

    return new Response(JSON.stringify(graphData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to fetch blog posts'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 