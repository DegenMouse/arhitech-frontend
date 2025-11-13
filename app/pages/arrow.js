export class Arrow {
    constructor(fromEl, toEl, options = {}) {
      this.fromEl = fromEl
      this.toEl = toEl
      this.color = options.color || 'black'
      this.width = options.width || 2
      this.dashed = options.dashed || false
      this.line = null
    }
  
    drawLine(svg) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.style.stroke = this.color
      line.style.strokeWidth = this.width
      if (this.dashed) line.setAttribute('stroke-dasharray', '6 3')
      line.setAttribute('marker-end', 'url(#arrow)')
      svg.appendChild(line)
      this.line = line
      this.updatePosition()
    }
  
    updatePosition() {
      if (!this.fromEl || !this.toEl || !this.line) return
      const rectA = this.fromEl.getBoundingClientRect()
      const rectB = this.toEl.getBoundingClientRect()
      const svgRect = this.line.ownerSVGElement.getBoundingClientRect()
  
      const x1 = rectA.right - svgRect.left
      const y1 = rectA.top + rectA.height / 2 - svgRect.top
      const x2 = rectB.left - svgRect.left
      const y2 = rectB.top + rectB.height / 2 - svgRect.top
  
      this.line.setAttribute('x1', x1)
      this.line.setAttribute('y1', y1)
      this.line.setAttribute('x2', x2)
      this.line.setAttribute('y2', y2)
    }
  
    remove() {
      if (this.line) this.line.remove()
    }
  }
  