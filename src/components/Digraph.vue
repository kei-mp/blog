// Digraph.vue
<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import * as d3 from 'd3';

const graphContainer = ref(null);
const posts = ref([]);
let svg = null;
let simulation = null;
let resizeObserver = null;

onMounted(async () => {
  try {
    const response = await fetch('/api/posts.json');
    const data = await response.json();
    posts.value = data.map(post => ({
      ...post,
      slug: post.slug || post.id
    }));
    
    createGraph();
    setupResizeObserver();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (simulation) {
    simulation.stop();
  }
});

const getContainerDimensions = () => {
  if (!graphContainer.value) return { width: 200, height: 200 };
  
  const rect = graphContainer.value.getBoundingClientRect();
  return {
    width: rect.width || 200,
    height: rect.height || 200
  };
};

const setupResizeObserver = () => {
  if (!window.ResizeObserver) {
    // fallback for older browsers
    window.addEventListener('resize', updateGraph);
    return;
  }

  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      updateGraph();
    }
  });

  resizeObserver.observe(graphContainer.value);
};

const createGraph = () => {
  const { width, height } = getContainerDimensions();
  const padding = 20;

  // clear any existing SVG
  d3.select(graphContainer.value).selectAll('*').remove();

  svg = d3.select(graphContainer.value)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // create nodes
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
    .style('pointer-events', 'none');

  // create simulation
  simulation = d3.forceSimulation(posts.value)
    .force('charge', d3.forceManyBody().strength(-100))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(30))
    .force('x', d3.forceX(width / 2).strength(0.1))
    .force('y', d3.forceY(height / 2).strength(0.1));

  simulation.on('tick', () => {
    nodes.attr('transform', d => {
      const x = Math.max(padding, Math.min(width - padding, d.x));
      const y = Math.max(padding, Math.min(height - padding, d.y));
      return `translate(${x},${y})`;
    });
  });
};

const updateGraph = () => {
  if (!svg || !simulation) return;
  
  const { width, height } = getContainerDimensions();
  const padding = 20;

  // update SVG viewBox
  svg.attr('viewBox', `0 0 ${width} ${height}`);

  // update simulation forces
  simulation
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX(width / 2).strength(0.1))
    .force('y', d3.forceY(height / 2).strength(0.1))
    .alpha(0.3) // Restart simulation with some energy
    .restart();

  // update tick handler for new dimensions
  simulation.on('tick', () => {
    svg.selectAll('g').attr('transform', d => {
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
  width: 100%;
  height: 100%;
  min-height: 100px; /* fallback */
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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