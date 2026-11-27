// Tracks a single-finger drag over the stage
export default class TouchListener {
  constructor(stage) {
    this.stage = stage
    this.deltaFactor = 10
    this.speedFactor = 1.2
    this.position = { x: 0, y: 0 } // Desired offset of the sprite (inverted)
    this.last = { x: 0, y: 0 }
    this.pointerId = null

    this.onDown = ({ pointerId, global }) => {
      if (this.pointerId !== null) return // Ignore multi-touch
      this.pointerId = pointerId
      this.last.x = global.x
      this.last.y = global.y
    }
    this.onMove = ({ pointerId, global }) => {
      if (pointerId !== this.pointerId) return
      this.position.x -= Math.round((global.x - this.last.x) * this.speedFactor)
      this.position.y -= Math.round((global.y - this.last.y) * this.speedFactor)
      this.last.x = global.x
      this.last.y = global.y
    }
    this.onUp = ({ pointerId }) => {
      if (pointerId === this.pointerId) this.pointerId = null
    }

    stage.on('pointerdown', this.onDown)
    stage.on('globalpointermove', this.onMove)
    stage.on('pointerup', this.onUp)
    stage.on('pointerupoutside', this.onUp)
    stage.on('pointercancel', this.onUp)
  }

  // Start the drag from the slide's centered position
  focus(slide) {
    this.position.x = Math.round(slide.limit.x / 2)
    this.position.y = Math.round(slide.limit.y / 2)
  }

  destroy() {
    this.stage.off('pointerdown', this.onDown)
    this.stage.off('globalpointermove', this.onMove)
    this.stage.off('pointerup', this.onUp)
    this.stage.off('pointerupoutside', this.onUp)
    this.stage.off('pointercancel', this.onUp)
  }
}
