---
title: 'How I built the Graph'
description: 'Have these for future reference but also to help others discover them'
pubDate: 'Mar 06 2025'
heroImage: '/digraph.png'
---

The blog post graph on the homepage is a force-directed graph using the [d3-force](https://d3js.org/d3-force) javascript library. It takes inspiration from the note-graph built into the Obsidian note taking app. I don't personnaly use Obisidian and prefer simple note taking apps or just pen and paper. In fact I believe a lot of developers use complicated note-taking tools and systems like Obsidian to feel productive and end up spending more time creating the perfect productivity system instead of being productive. That's in part why I believe [productivity systems should be like Subway](subway).

The blog itself is built using Astro javascript framework using markdown content files that are rendered into html and uploaded to the Cloudflare CDN so that it's fast loading (and free to serve) for users, no matter where they are in the world. This is done as a built step on commits to the main branch or for pull requests (that spin up separate sites for review) using GitHub Actions.

You can find the source code for the [Graph](https://github.com/kei-mp/blog/blob/master/src/components/Digraph.vue) or [Blog](https://github.com/kei-mp/blog) on my GitHub.