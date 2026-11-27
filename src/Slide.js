import { Container, Graphics, Sprite } from 'pixi.js'

// The picture is scaled slightly larger than the screen so it can move around
const OVERSIZE = 1.05

export default class Slide {
  constructor(texture, screen) {
    this.container = new Container()
    this.sprite = new Sprite(texture)
    this.mask = new Graphics()
    this.limit = { x: 0, y: 0 } // How far the sprite can move on each axis

    this.sprite.mask = this.mask
    this.container.addChild(this.sprite, this.mask)

    this.layout(screen)
    this.mask.x = screen.width // Hidden until it becomes the current slide
  }

  // Size the sprite to cover the screen (+5%) whatever the picture ratio,
  // and redraw the mask. Called on creation and on every resize.
  layout(screen) {
    this.screen = screen
    const { width, height } = screen
    const { width: textureWidth, height: textureHeight } = this.sprite.texture

    this.sprite.scale.set(Math.max(width / textureWidth, height / textureHeight) * OVERSIZE)
    this.limit.x = this.sprite.width - width
    this.limit.y = this.sprite.height - height
    this.center()

    this.mask.clear().rect(0, 0, width, height).fill(0xffffff)
  }

  center() {
    this.sprite.x = -Math.round(this.limit.x / 2)
    this.sprite.y = -Math.round(this.limit.y / 2)
  }
}
