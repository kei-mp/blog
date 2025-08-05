<!-- src/components/Digraph.vue -->
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
  const padding = 40;

  // Clear any existing SVG
  d3.select(graphContainer.value).selectAll('*').remove();

  svg = d3.select(graphContainer.value)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // Extract unique tags from all posts
  const allTags = new Set();
  posts.value.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => allTags.add(tag));
    }
  });

  // Create tag nodes
  const tagNodes = Array.from(allTags).map(tag => ({
    id: `tag-${tag}`,
    title: tag,
    type: 'tag',
    x: undefined,
    y: undefined
  }));

  // Create post nodes
  const postNodes = posts.value.map(post => ({
    ...post,
    type: 'post'
  }));

  // Combine all nodes
  const allNodes = [...postNodes, ...tagNodes];

  // Create links between posts and their tags
  const links = [];
  posts.value.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => {
        links.push({
          source: post.id,
          target: `tag-${tag}`,
          type: 'post-tag'
        });
      });
    }
  });

  // Create link elements first (so they appear behind nodes)
  const linkElements = svg.selectAll('.link')
    .data(links)
    .join('line')
    .attr('class', 'link')
    .attr('stroke', 'var(--link-color)')
    .attr('stroke-width', 1)
    .attr('stroke-opacity', 0.6);

  // Create node groups
  const nodeGroups = svg.selectAll('.node')
    .data(allNodes)
    .join('g')
    .attr('class', 'node')
    .style('cursor', d => d.type === 'post' ? 'pointer' : 'default')
    .on('click', (event, d) => {
      if (d.type === 'post') {
        window.location.href = `/${d.slug}`;
      }
    });

  // Add circles for nodes
  nodeGroups.append('circle')
    .attr('r', d => d.type === 'post' ? 6 : 4)
    .attr('fill', d => d.type === 'post' ? '#2337ff' : '#ff6b35')
    .on('mouseover', function(event, d) {
      d3.select(this)
        .attr('fill', d => d.type === 'post' ? '#4757ff' : '#ff8c5a')
        .attr('r', d => d.type === 'post' ? 8 : 6);
      
      // Highlight connected links
      linkElements
        .attr('stroke-opacity', link => 
          link.source.id === d.id || link.target.id === d.id ? 1 : 0.2
        )
        .attr('stroke-width', link => 
          link.source.id === d.id || link.target.id === d.id ? 2 : 1
        );
    })
    .on('mouseout', function(event, d) {
      d3.select(this)
        .attr('fill', d => d.type === 'post' ? '#2337ff' : '#ff6b35')
        .attr('r', d => d.type === 'post' ? 6 : 4);
      
      // Reset link highlighting
      linkElements
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 1);
    });

  // Add text labels
  nodeGroups.append('text')
    .text(d => d.title)
    .attr('font-size', d => d.type === 'post' ? '8px' : '7px')
    .attr('text-anchor', 'middle')
    .attr('dy', d => d.type === 'post' ? '-10px' : '-8px')
    .style('fill', 'var(--node-text-color)')
    .style('pointer-events', 'none')
    .style('font-weight', d => d.type === 'tag' ? 'bold' : 'normal');

  // Create simulation
  simulation = d3.forceSimulation(allNodes)
    .force('link', d3.forceLink(links)
      .id(d => d.id)
      .distance(50)
      .strength(0.3)
    )
    .force('charge', d3.forceManyBody()
      .strength(d => d.type === 'post' ? -150 : -100)
    )
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide()
      .radius(d => d.type === 'post' ? 35 : 25)
    )
    .force('x', d3.forceX(width / 2).strength(0.05))
    .force('y', d3.forceY(height / 2).strength(0.05));

  simulation.on('tick', () => {
    // Update link positions
    linkElements
      .attr('x1', d => Math.max(padding, Math.min(width - padding, d.source.x)))
      .attr('y1', d => Math.max(padding, Math.min(height - padding, d.source.y)))
      .attr('x2', d => Math.max(padding, Math.min(width - padding, d.target.x)))
      .attr('y2', d => Math.max(padding, Math.min(height - padding, d.target.y)));

    // Update node positions
    nodeGroups.attr('transform', d => {
      const x = Math.max(padding, Math.min(width - padding, d.x));
      const y = Math.max(padding, Math.min(height - padding, d.y));
      return `translate(${x},${y})`;
    });
  });
};

const updateGraph = () => {
  if (!svg || !simulation) return;
  
  const { width, height } = getContainerDimensions();
  const padding = 40;

  // Update SVG viewBox
  svg.attr('viewBox', `0 0 ${width} ${height}`);

  // Update simulation forces
  simulation
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX(width / 2).strength(0.05))
    .force('y', d3.forceY(height / 2).strength(0.05))
    .alpha(0.3)
    .restart();

  // Update tick handler for new dimensions
  simulation.on('tick', () => {
    svg.selectAll('.link')
      .attr('x1', d => Math.max(padding, Math.min(width - padding, d.source.x)))
      .attr('y1', d => Math.max(padding, Math.min(width - padding, d.source.y)))
      .attr('x2', d => Math.max(padding, Math.min(width - padding, d.target.x)))
      .attr('y2', d => Math.max(padding, Math.min(width - padding, d.target.y)));

    svg.selectAll('.node').attr('transform', d => {
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
  min-height: 100px;
  background-color: var(--background);
  --node-text-color: var(--text);
  --link-color: var(--text-muted, #666);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow-color);
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