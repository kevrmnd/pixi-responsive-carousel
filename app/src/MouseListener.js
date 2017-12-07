class MouseListener {
  constructor(renderer, stage) {

    this.deltaFactor = 20
    this.listened = []
    this.mousePos = { x: renderer.width / 2, y: renderer.height / 2 }
    this.deltaPos = { x: renderer.width / 2, y: renderer.height / 2 }
    stage.on('mousemove', ({ data: { global } }) => {
      this.mousePos.x = global.x
      this.mousePos.y = global.y
    })

  }

  add(sprite) {
    this.listened.push(sprite)
  }

  remove(sprite) {
    this.listened = this.listened.filter(listenedSprite => listenedSprite !== sprite)
  }

}
module.exports = MouseListener