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
    // clean up the simulation when component is destroyed
    if (this.simulation) {
      this.simulation.stop()
    }
    // clean up the resize observer
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
        // fallback for browsers without ResizeObserver
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

        // update force simulation center
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
      d3.select(this.$refs.chartContainer).selectAll("*").remove()

			// custom color scale
			const colorScale = [
				"#1f77b4", // blue
				"#ff7f0e", // orange
				"#999", // grey
			]
      const color = d3.scaleOrdinal(colorScale)

      // the force simulation mutates links and nodes, so create a copy
      const links = this.data.links.map(d => ({ ...d }))
      const nodes = this.data.nodes.map(d => ({ ...d }))

      // store reference to this component for use in the force
      const self = this

      // custom force to constrain nodes to viewport bounds
      function boundingForce() {
        const padding = 20
        const minX = -self.width / 2 + padding
        const maxX = self.width / 2 - padding
        const minY = -self.height / 2 + padding
        const maxY = self.height / 2 - padding

        for (let node of nodes) {
          node.x = Math.max(minX, Math.min(maxX, node.x || 0))
          node.y = Math.max(minY, Math.min(maxY, node.y || 0))
        }
      }

      // create a simulation with several forces
      this.simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("x", d3.forceX().strength(0.1))
        .force("y", d3.forceY().strength(0.1))
        .force("bounds", boundingForce)

      // create the SVG container
      this.svg = d3.select(this.$refs.chartContainer)
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])
        .attr("style", "max-width: 100%; height: auto;")

      // add a line for each link
      const link = this.svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value))

      // add a circle for each node
      const node = this.svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", d => color(d.group))
        .style("cursor", d => (d.type === "blog" || d.type === "project") ? "pointer" : "default")
        .on('click', (_event, d) => {
          if (d.url) {
            // dispatch a custom event to be handled on astro side
            const navigateEvent = new CustomEvent('astro:navigate', {
              bubbles: true,
              composed: true,
              detail: { url: d.url },
            });
            window.dispatchEvent(navigateEvent);
          }
        });

      // always visible labels for tag nodes
      const tagLabels = this.svg.append("g")
        .selectAll("text")
        .data(nodes.filter(d => d.type === "tag"))
        .join("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.8em")
        .attr("font-size", 12)
        .attr("fill", "var(--text)")
        .text(d => d.id)

      // tooltip for blog/project nodes
      const tooltip = d3.select(this.$refs.chartContainer)
        .append("div")
        .attr("class", "graph-tooltip")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("background", "var(--background)")
        .style("border", "1px solid #ccc")
        .style("padding", "4px 8px")
        .style("border-radius", "4px")
        .style("font-size", "13px")
        .style("box-shadow", "0 2px 8px rgba(0,0,0,0.1)")
        .style("display", "none")

      node.on("mouseover", function (event, d) {
        if (d.type === "blog" || d.type === "project") {
          tooltip
            .style("display", "block")
            .html(`<strong>${d.id}</strong>${d.description ? `<br>${d.description}` : ""}`)
        }
      })
        .on("mousemove", function (event) {
          tooltip
            .style("left", (event.offsetX + 15) + "px")
            .style("top", (event.offsetY - 10) + "px")
        })
        .on("mouseout", function (event, d) {
          tooltip.style("display", "none")
        })

      // add drag behavior
      node.call(d3.drag()
        .on("start", this.dragstarted)
        .on("drag", this.dragged)
        .on("end", this.dragended))

      // set the position attributes of links and nodes each time the simulation ticks
      this.simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y)

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)

        tagLabels
          .attr("x", d => d.x)
          .attr("y", d => d.y)
      })
    },
    updateChartSize() {
      if (this.svg) {
        this.svg
          .attr("width", this.width)
          .attr("height", this.height)
          .attr("viewBox", [-this.width / 2, -this.height / 2, this.width, this.height])

        // update force simulation - the bounding force will automatically use new width/height
        if (this.simulation) {
          this.simulation
            .force("x", d3.forceX().strength(0.1))
            .force("y", d3.forceY().strength(0.1))
            .alpha(0.3)
            .restart()
        }
      }
    },

    // reheat the simulation when drag starts, and fix the subject position
    dragstarted(event) {
      if (!event.active) this.simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    },

    // update the subject (dragged node) position during drag
    dragged(event) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    },

    // restore the target alpha so the simulation cools after dragging ends
    // unfix the subject position now that it's no longer being dragged
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

.graph-tooltip {
  z-index: 10;
  pointer-events: none;
}
</style>