<script setup>
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';

const graphContainer = ref(null);
const posts = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('/api/posts.json');
    const data = await response.json();
    posts.value = data.map(post => ({
      ...post,
      slug: post.slug || post.id
    }));
    
    createGraph();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }
});

const createGraph = () => {
  // responsive on mobile
  const width = window.innerWidth <= 720 ? window.innerWidth - 40 : 200;
  const height = window.innerWidth <= 720 ? 200 : 200;
  const padding = 20;

  const svg = d3.select(graphContainer.value)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  // group for each node that will contain both circle and text
  const nodes = svg.selectAll('g')
    .data(posts.value)
    .join('g')
    .style('cursor', 'pointer')
    .on('click', (event, d) => {
      window.location.href = `/${d.slug}`;
    });

  nodes.append('circle')
    .attr('r', 4)
    .attr('fill', '#2337ff')
    .on('mouseover', function() {
      d3.select(this)
        .attr('fill', '#4757ff')
        .attr('r', 6);
    })
    .on('mouseout', function() {
      d3.select(this)
        .attr('fill', '#2337ff')
        .attr('r', 4);
    });

  nodes.append('text')
    .text(d => d.title)
    .attr('font-size', '8px')
    .attr('text-anchor', 'middle')
    .attr('dy', '-8px')
    .style('pointer-events', 'none'); // prevent text from interfering with hover/click

  // update simulation with adjusted forces
  const simulation = d3.forceSimulation(posts.value)
    .force('charge', d3.forceManyBody().strength(-100)) // increased repulsion
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(30)) // increased collision radius
    .force('x', d3.forceX(width / 2).strength(0.1))
    .force('y', d3.forceY(height / 2).strength(0.1));

  // update node positions on each simulation tick
  simulation.on('tick', () => {
    nodes.attr('transform', d => {
      const x = Math.max(padding, Math.min(width - padding, d.x));
      const y = Math.max(padding, Math.min(height - padding, d.y));
      return `translate(${x},${y})`;
    });
  });
};
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
  z-index: 10;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: visible;
  grid-column: 2;
}

/* media query for mobile screens */
@media (max-width: 720px) {
  .graph-view {
    grid-column: 1;
    width: 100%;
    margin-bottom: 2em;
    position: relative;
  }
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