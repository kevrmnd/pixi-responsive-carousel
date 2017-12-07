class Slide {
  constructor(url, renderer) {

    this.renderer = renderer

    // Create a container
    this.container = new PIXI.Container()

    // Create Sprite
    this.sprite = PIXI.Sprite.fromImage(url)
    this.sprite.rootHeight = this.sprite.height
    this.sprite.rootWidth = this.sprite.width
    this.sprite.ratio = this.sprite.rootHeight / this.sprite.rootWidth
    this.sprite.tempPos = { x: 0, y: 0 }
    
    if(this.sprite.ratio < renderer.ratio){
      // Horizontal centering if image w/ bigger width ratio
      this.sprite.height = renderer.height + (renderer.height * 5) / 100 // 5% more
      this.sprite.width = Math.round((this.sprite.rootWidth * this.sprite.height) / this.sprite.rootHeight)
      this.sprite.x = Math.round(renderer.width / 2 - this.sprite.width / 2)
      this.sprite.y = Math.round(renderer.height / 2 - this.sprite.height / 2)
    }else{     
      // Vertical centering if image w/ smaller width ratio
      this.sprite.width = renderer.width + (renderer.width * 5) / 100 // 5% more
      this.sprite.height = Math.round((this.sprite.rootHeight * this.sprite.width) / this.sprite.rootWidth)
      this.sprite.x = Math.round(renderer.width / 2 - this.sprite.width / 2)
      this.sprite.y = Math.round(renderer.height / 2 - this.sprite.height / 2)
    }

    this.sprite.limit = {} // Sprite limits
    this.sprite.limit.x = this.sprite.width - renderer.width
    this.sprite.limit.y = this.sprite.height - renderer.height

    this.container.addChild(this.sprite)

    // Create mask
    this.mask = new PIXI.Graphics()
    this.mask.lineStyle(0)
      .beginFill(0xFFFFFF)
      .moveTo(0,0)
      .lineTo(renderer.width, 0)
      .lineTo(renderer.width, renderer.height)
      .lineTo(0, renderer.height)
      .endFill()
    this.mask.x = renderer.width

    this.sprite.mask = this.mask
    this.container.addChild(this.mask)

  }

  center() {
    this.sprite.x = Math.round(this.renderer.width / 2 - this.sprite.width / 2)
    this.sprite.y = Math.round(this.renderer.height / 2 - this.sprite.height / 2)
  }

}
module.exports = Slide