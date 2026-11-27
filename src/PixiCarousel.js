import { Application, Assets, Container } from 'pixi.js'
import { gsap } from 'gsap'
import { primaryInput } from 'detect-it'
import MouseListener from './MouseListener.js'
import TouchListener from './TouchListener.js'
import Slide from './Slide.js'

const isTouch = primaryInput === 'touch'

// Frame-rate independent easing: same feel at 60Hz, 120Hz or 144Hz
const easeFactor = (deltaFactor, deltaTime) => 1 - Math.pow(1 - 1 / deltaFactor, deltaTime)

export default class PixiCarousel {
  constructor({
    container = 'body',
    background = 0xffffff,
    current = 0,
    arrows,
    pagination,
    speed = 1.2,
    slides = [],
  }) {
    this.domContainer = typeof container === 'string' ? document.querySelector(container) : container
    this.background = background
    this.current = current
    this.arrows = arrows
    this.pagination = pagination && this.domContainer.querySelector(pagination)
    this.speed = speed
    this.slides = []
    this.moving = new Set() // Slides whose sprite follows the pointer
    this.sliding = false
    this.domEvents = new AbortController()

    this.ready = this.init(slides)
  }

  async init(slidesData) {
    const app = new Application()
    // Create the renderer and load every picture in parallel
    const [, textures] = await Promise.all([
      app.init({
        resizeTo: this.domContainer,
        background: this.background,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      }),
      Assets.load(slidesData.map(({ url }) => url)),
    ])
    this.app = app
    this.domContainer.prepend(app.canvas)

    const { stage, screen, renderer, ticker } = app
    stage.eventMode = 'static'
    stage.hitArea = screen

    this.container = new Container()
    stage.addChild(this.container)

    this.slides = slidesData.map(({ url }) => new Slide(textures[url], screen))

    // First slide is directly visible
    const first = this.slides[this.current]
    first.mask.x = 0
    this.container.addChild(first.container)

    this.listener = isTouch ? new TouchListener(stage) : new MouseListener(stage, screen)
    this.listener.focus(first)
    this.moving.add(first)

    ticker.add(isTouch ? this.touchLoop : this.mouseLoop)
    renderer.on('resize', this.onResize)

    this.createArrows()
    this.createPagination()
  }

  createArrows() {
    if (!this.arrows) return
    const { signal } = this.domEvents
    const { prev, next } = this.arrows
    this.domContainer.querySelector(prev)
      ?.addEventListener('click', () => this.goToSlide(this.getPreviousSlide(), false), { signal })
    this.domContainer.querySelector(next)
      ?.addEventListener('click', () => this.goToSlide(this.getNextSlide(), true), { signal })
  }

  createPagination() {
    if (!this.pagination) return
    const bullets = this.slides.map((slide, index) => {
      const bullet = document.createElement('button')
      bullet.type = 'button'
      bullet.className = 'pagination-bullet'
      bullet.dataset.id = index
      bullet.setAttribute('aria-label', `Go to slide ${index + 1}`)
      bullet.classList.toggle('active', index === this.current)
      return bullet
    })
    this.pagination.append(...bullets)
    this.pagination.addEventListener('click', ({ target }) => {
      if (target.classList.contains('pagination-bullet')) {
        this.goToSlide(Number(target.dataset.id))
      }
    }, { signal: this.domEvents.signal })
  }

  updatePagination(index) {
    if (!this.pagination) return
    this.pagination.querySelectorAll('.pagination-bullet').forEach((bullet, i) => {
      bullet.classList.toggle('active', i === index)
    })
  }

  getPreviousSlide() {
    return (this.current - 1 + this.slides.length) % this.slides.length
  }

  getNextSlide() {
    return (this.current + 1) % this.slides.length
  }

  // `forward` defaults to the natural direction from the current slide
  goToSlide(index, forward = index > this.current) {
    if (index === this.current || this.sliding || !this.slides[index]) return false
    this.sliding = true

    const { width } = this.app.screen
    const current = this.slides[this.current]
    const next = this.slides[index]
    const direction = forward ? 1 : -1

    // Parallax start position + mask just off-screen
    next.container.x = direction * width / 6
    next.mask.x = direction * width - next.container.x
    this.container.addChild(next.container)

    if (isTouch) {
      this.moving.delete(current)
      next.center()
    } else {
      this.moving.add(next)
    }

    this.updatePagination(index)

    gsap.to(next.container, { x: 0, duration: this.speed, ease: 'power2.inOut' })
    gsap.to(next.mask, {
      x: 0,
      duration: this.speed,
      ease: 'power4.inOut',
      onComplete: () => {
        if (isTouch) {
          this.listener.focus(next)
          this.moving.add(next)
        } else {
          this.moving.delete(current)
        }
        this.container.removeChild(current.container)
        this.current = index
        this.sliding = false
      },
    })
    return true
  }

  mouseLoop = ({ deltaTime }) => {
    const { width, height } = this.app.screen
    const { position, deltaFactor } = this.listener
    const t = easeFactor(deltaFactor, deltaTime)

    for (const { sprite, limit } of this.moving) {
      // Map the pointer position on the screen to the sprite's movable area
      const targetX = -(position.x / width) * limit.x
      const targetY = -(position.y / height) * limit.y
      sprite.x += (targetX - sprite.x) * t
      sprite.y += (targetY - sprite.y) * t
    }
  }

  touchLoop = ({ deltaTime }) => {
    const { position, deltaFactor } = this.listener
    const t = easeFactor(deltaFactor, deltaTime)

    for (const { sprite, limit } of this.moving) {
      sprite.x += (-position.x - sprite.x) * t
      sprite.y += (-position.y - sprite.y) * t

      // Damping effect: bounce back when dragged past the edges
      if (sprite.x > 0) position.x = 1
      else if (sprite.x < -limit.x) position.x = limit.x - 1
      if (sprite.y > 0) position.y = 1
      else if (sprite.y < -limit.y) position.y = limit.y - 1
    }
  }

  onResize = () => {
    const { screen } = this.app
    this.slides.forEach(slide => slide.layout(screen))
    this.listener.focus(this.slides[this.current])
  }

  destroy() {
    this.domEvents.abort()
    this.listener?.destroy()
    this.pagination?.replaceChildren()
    gsap.killTweensOf(this.slides.flatMap(({ container, mask }) => [container, mask]))
    this.app?.destroy({ removeView: true }, { children: true })
  }
}
