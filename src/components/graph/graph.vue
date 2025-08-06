<!-- src/components/graph/graph.vue -->
<template>
  <div ref="chartContainer" class="graph-container"></div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Graph',
  props: {
    data: {
      type: Object,
      default: () => ({
        nodes: [
          { id: "A", group: 1 },
          { id: "B", group: 1 },
          { id: "C", group: 2 },
          { id: "D", group: 2 },
          { id: "E", group: 2 }
        ],
        links: [
          { source: "A", target: "B", value: 1 },
          { source: "B", target: "C", value: 2 },
          { source: "C", target: "D", value: 1 },
          { source: "D", target: "E", value: 1 },
          { source: "E", target: "A", value: 2 }
        ]
      })
    }
  },
  data() {
    return {
      simulation: null,
      svg: null,
      width: 0,
      height: 0,
      resizeObserver: null
    }
  },
  mounted() {
    this.initializeSize()
    this.createChart()
    this.setupResizeObserver()
  },
  beforeUnmount() {
    // Clean up the simulation when component is destroyed
    if (this.simulation) {
      this.simulation.stop()
    }
    // Clean up the resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  },
  watch: {
    data: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  methods: {
    initializeSize() {
      const container = this.$refs.chartContainer
      const rect = container.getBoundingClientRect()
      this.width = rect.width || 300
      this.height = rect.height || 300
    },

    setupResizeObserver() {
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect
            if (width > 0 && height > 0) {
              this.width = width
              this.height = height
              this.updateChartSize()
            }
          }
        })
        this.resizeObserver.observe(this.$refs.chartContainer)
      } else {
        // Fallback for browsers without ResizeObserver
        window.addEventListener('resize', this.handleWindowResize)
      }
    },

    handleWindowResize() {
      const container = this.$refs.chartContainer
      const rect = container.getBoundingClientRect()
      const newWidth = rect.width
      const newHeight = rect.height
      
      if (newWidth !== this.width || newHeight !== this.height) {
        this.width = newWidth
        this.height = newHeight
        this.updateChartSize()
      }
    },

    updateChartSize() {
      if (this.svg) {
        this.svg
          .attr("width", this.width)
          .attr("height", this.height)
          .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
        
        // Update force simulation center
        if (this.simulation) {
          this.simulation
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .alpha(0.3)
            .restart()
        }
      }
    },

    createChart() {
      // Clear any existing content
      d3.select(this.$refs.chartContainer).selectAll("*").remove()

      // Specify the color scale
      const color = d3.scaleOrdinal(d3.schemeCategory10)

      // The force simulation mutates links and nodes, so create a copy
      const links = this.data.links.map(d => ({...d}))
      const nodes = this.data.nodes.map(d => ({...d}))

      // Create a simulation with several forces
      this.simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id))
          .force("charge", d3.forceManyBody())
          .force("x", d3.forceX())
          .force("y", d3.forceY())

      // Create the SVG container
      this.svg = d3.select(this.$refs.chartContainer)
          .append("svg")
          .attr("width", this.width)
          .attr("height", this.height)
          .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
          .attr("style", "max-width: 100%; height: auto;")

      // Add a line for each link
      const link = this.svg.append("g")
          .attr("stroke", "#999")
          .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
          .attr("stroke-width", d => Math.sqrt(d.value))

      // Add a circle for each node
      const node = this.svg.append("g")
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
          .attr("r", 5)
          .attr("fill", d => color(d.group))

      // Add titles to nodes
      node.append("title")
          .text(d => d.id)

      // Add drag behavior
      node.call(d3.drag()
            .on("start", this.dragstarted)
            .on("drag", this.dragged)
            .on("end", this.dragended))

      // Set the position attributes of links and nodes each time the simulation ticks
      this.simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
      })
    },

    updateChart() {
      // Recreate the chart when data changes
      this.createChart()
    },

    // Reheat the simulation when drag starts, and fix the subject position
    dragstarted(event) {
      if (!event.active) this.simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    },

    // Update the subject (dragged node) position during drag
    dragged(event) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    },

    // Restore the target alpha so the simulation cools after dragging ends
    // Unfix the subject position now that it's no longer being dragged
    dragended(event) {
      if (!event.active) this.simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }
  }
}
</script>

<style scoped>
.graph-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>