// Tracks the mouse position over the stage
export default class MouseListener {
  constructor(stage, screen) {
    this.stage = stage
    this.deltaFactor = 20
    this.position = { x: screen.width / 2, y: screen.height / 2 }

    this.onMove = ({ global }) => {
      this.position.x = global.x
      this.position.y = global.y
    }
    stage.on('globalpointermove', this.onMove)
  }

  // Nothing to reset: the target always follows the pointer
  focus() {}

  destroy() {
    this.stage.off('globalpointermove', this.onMove)
  }
}
