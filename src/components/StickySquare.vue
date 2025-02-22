<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';

const graphContainer = ref(null);

// This will store our blog post data
const posts = ref([]);

// Fetch blog posts data when component mounts
onMounted(async () => {
  try {
    // Get all blog posts using Astro's content collections API
    const response = await fetch('/api/posts.json');
    posts.value = await response.json();
    
    createGraph();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }
});

const createGraph = () => {
  const width = 200;
  const height = 200;

  // Create the SVG container
  const svg = d3.select(graphContainer.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // Create the simulation
  const simulation = d3.forceSimulation(posts.value)
    .force('charge', d3.forceManyBody().strength(-50))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(10));

  // Create the nodes
  const nodes = svg.selectAll('circle')
    .data(posts.value)
    .join('circle')
    .attr('r', 5)
    .attr('fill', '#2337ff')
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      window.location.href = `/blog/${d.slug}`;
    });

  // Update node positions on each simulation tick
  simulation.on('tick', () => {
    nodes
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
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