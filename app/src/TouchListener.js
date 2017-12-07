class TouchListener {
  constructor(renderer, stage) {

    this.renderer = renderer
    this.deltaFactor = 10
    this.speedFactor = 1.2
    this.listened = []
    this.touchMove = { x: renderer.width/2, y: renderer.height/2 }
    this.touchPos = { x: renderer.width/2, y: renderer.height/2 }
    this.deltaPos = { x: 0, y: 0 } 
    this.currentTouch = false

    stage.on('touchstart', ({ data: { global, identifier } }) => {
      
      if(!this.currentTouch){ // No double touch
        this.currentTouch = identifier
        this.touchMove = {
          x: global.x,
          y: global.y
        }
      }
    })
    stage.on('touchend', () => { this.currentTouch = false })
    stage.on('touchmove', ({ data: { global, identifier } }) => {
      if(this.currentTouch == identifier){ // No double touch     
        this.touchPos = {
          x: this.touchPos.x - Math.round((global.x - this.touchMove.x) * this.speedFactor),
          y: this.touchPos.y - Math.round((global.y - this.touchMove.y) * this.speedFactor)
        }
        this.touchMove = {
          x: global.x,
          y: global.y
        }
      }
    })

  }

  add(sprite) {
    this.touchPos.x = -Math.round(this.renderer.width / 2 - sprite.width / 2)
    this.touchPos.y = -Math.round(this.renderer.height / 2 - sprite.height / 2)

    this.listened.push(sprite)
  }

  remove(sprite) {
    this.listened = this.listened.filter(listenedSprite => listenedSprite !== sprite)
  }

}
module.exports = TouchListener