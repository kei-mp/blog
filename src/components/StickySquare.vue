<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';

const graphContainer = ref(null);

// This will store our blog post data
const posts = ref([]);

// Fetch blog posts data when component mounts
onMounted(async () => {
  try {
    const response = await fetch('/api/posts.json');
    const data = await response.json();
    // Transform the data to include necessary properties
    posts.value = data.map(post => ({
      ...post,
      slug: post.slug || post.id // Use slug if available, fallback to id
    }));
    
    createGraph();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }
});

const createGraph = () => {
  const width = 200;
  const height = 200;
  const padding = 10; // Padding from edges

  // Create the SVG container
  const svg = d3.select(graphContainer.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Create the simulation with adjusted forces
  const simulation = d3.forceSimulation(posts.value)
    .force('charge', d3.forceManyBody().strength(-30)) // Reduced repulsion
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(6))
    // Add x and y forces to keep nodes within bounds
    .force('x', d3.forceX(width / 2).strength(0.1))
    .force('y', d3.forceY(height / 2).strength(0.1));

  // Create the nodes
  const nodes = svg.selectAll('circle')
    .data(posts.value)
    .join('circle')
    .attr('r', 4)
    .attr('fill', '#2337ff')
    .style('cursor', 'pointer');

  // Add hover effects
  nodes
    .on('mouseover', function() {
      d3.select(this)
        .attr('fill', '#4757ff')
        .attr('r', 6);
    })
    .on('mouseout', function() {
      d3.select(this)
        .attr('fill', '#2337ff')
        .attr('r', 4);
    })
    .on('click', (event, d) => {
      // Navigate to the blog post using the slug from frontmatter
      window.location.href = `/blog/${d.slug}`;
    });

  // Update node positions on each simulation tick
  simulation.on('tick', () => {
    nodes.attr('cx', d => {
      return Math.max(padding, Math.min(width - padding, d.x));
    })
    .attr('cy', d => {
      return Math.max(padding, Math.min(height - padding, d.y));
    });
  });
}
</script>

<template>
  <div class="graph-view" ref="graphContainer">
    <div v-if="!posts.length" class="loading">
      Loading graph...
    </div>
  </div>
</template>

<style scoped>
.graph-view {
  width: 200px;
  height: 200px;
  background-color: #ffffff;
  position: sticky;
  top: 1em;
  float: right;
  margin-right: -250px;
  z-index: 10;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* Ensure nothing renders outside the container */
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 0.8em;
  color: #666;
}
</style> 