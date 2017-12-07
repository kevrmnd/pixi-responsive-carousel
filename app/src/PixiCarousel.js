const detectIt = require('detect-it')
const { default: { hasTouch } } = detectIt
const TweenLite = require('gsap')
const MouseListener = require('./MouseListener')
const TouchListener = require('./TouchListener')
const Slide = require('./Slide')

class PixiCarousel {
  constructor({ container = 'body', background = 0xffffff,  current = 0, arrows, pagination, speed, slides }) {

    this.domContainer = document.querySelector(container)
    this.background = background
    this.tempSlides = slides
    this.current = current
    this.arrows = arrows
    this.pagination = pagination
    this.speed = speed
    this.slides = []
    this.sliding = false

    // Binding
    this.init = this.init.bind(this)
    this.getPreviousSlide = this.getPreviousSlide.bind(this)
    this.getNextSlide = this.getNextSlide.bind(this)
    this.goToSlide = this.goToSlide.bind(this)
    this.mouseLoop = this.mouseLoop.bind(this)
    this.touchLoop = this.touchLoop.bind(this)

    // Load ressources
    const loader = new PIXI.loaders.Loader()
    this.tempSlides.map((slide, index) => {
      loader.add(`slide${index}`, slide.url)
    })
    loader.load(this.init)

  }

  init() {

    // Init pixi
    PIXI.utils.skipHello() // Hide pixi console log
    this.app = new PIXI.Application({
      width: this.domContainer.clientWidth,
      height: this.domContainer.clientHeight,
      // antialias: true, 
      backgroundColor: this.background
    })
    const { renderer, stage } = this.app
    renderer.ratio = renderer.height / renderer.width
    this.domContainer.appendChild(renderer.view)
    stage.interactive = true

    // Create Slider container
    this.container = new PIXI.Container()
    stage.addChild(this.container)

    // Create slides
    this.tempSlides.map(tempSlide => {
      this.slides.push(new Slide(tempSlide.url, renderer))
    })

    // First slide is directly visible
    const { sprite: currentSprite, mask: currentMask, container: currentContainer } = this.slides[this.current]
    currentMask.x = 0
    this.container.addChild(currentContainer)

    // Listener : Check if it's a mouse or touch device
    if(!hasTouch) {
      this.listener = new MouseListener(renderer, stage)
      this.listener.add(currentSprite)
      this.mouseLoop()
    }else{
      this.listener = new TouchListener(renderer, stage)
      this.listener.add(currentSprite)
      this.touchLoop()
    }

    // Create arrows
    if(this.arrows){
      const { prev, next } = this.arrows
      const _this = this
      this.domContainer.querySelector(prev).addEventListener('click', () => {
        this.goToSlide(this.getPreviousSlide(), false)
      })
      this.domContainer.querySelector(next).addEventListener('click', () => {
        this.goToSlide(this.getNextSlide())
      })
    }

    // Create Pagination
    if(this.pagination){
      // this.pagination
      this.slides.map((slide, index) => {
        // Create bullets
        const span = document.createElement('span')
        span.setAttribute('data-id', index)
        span.classList.add('pagination-bullet')
        if(this.current == index){
          span.classList.add('active')
        }
        this.domContainer.querySelector(this.pagination).appendChild(span)
      })
      // Listen bullets click
      this.domContainer.querySelector(this.pagination).addEventListener('click', (e) => {
        if(e.target.classList.contains('pagination-bullet')){
          this.goToSlide(parseInt(e.target.getAttribute('data-id')))
        }
      })
    }

  }

  getPreviousSlide() {
    if(this.current == 0){ 
      return this.slides.length - 1
    }else{
      return this.current - 1 
    }
  }

  getNextSlide() {
    if(this.current == this.slides.length - 1){
      return 0
    }else{
      return this.current + 1 
    }
  }

  goToSlide(next, right = true) {
    if(this.current === next || this.sliding){ return false } // if we try to slide on same or we are sliding -> nope
    this.sliding = true
    
    const { renderer } = this.app
    const { mask: currentMask, container: currentContainer, sprite: currentSprite } = this.slides[this.current]   
    const { mask: nextMask, container: nextContainer, sprite: nextSprite } = this.slides[next]
    let direction = -1

    // Direction handler
    if(right){
      nextContainer.x = renderer.width / 6
      nextMask.x = renderer.width - nextContainer.x
    }else{ 
      direction = 1
      nextContainer.x = -renderer.width / 6
      nextMask.x = -renderer.width - nextContainer.x
    }

    // Add new slide
    this.container.addChild(nextContainer)

    if(hasTouch){
      this.listener.remove(currentSprite)
      this.slides[next].center()
    }else{
      this.listener.add(nextSprite)
    }
    
    // Slide animation
    const _this = this
    // Paralax effect on next slide
    TweenLite.to(nextContainer, this.speed, { x: 0, ease: Power2.easeInOut })
    // Next Mask animation
    TweenLite.to(nextMask, this.speed, { x: 0, ease: Power4.easeInOut, onComplete() {
      // At the end of anim : remove listener, slide removed, current slide updated
      if(!hasTouch){
        _this.listener.remove(currentSprite)
      }else{
        _this.listener.add(nextSprite)
      }
      _this.container.removeChild(currentContainer)
      _this.sliding = false
      _this.current = next
    } })

    // Update pagination
    if(this.pagination){
      this.domContainer.querySelector(this.pagination)
        .querySelector('.active').classList.remove('active')
      this.domContainer.querySelector(this.pagination)
      .querySelector(`[data-id="${next}"]`).classList.add('active')
    }
  }

  mouseLoop() {
    const { renderer } = this.app
    const{ mousePos, deltaPos, deltaFactor, listened } = this.listener

    listened.map(sprite => {
      // Position of the mouse in the renderer
      sprite.tempPos.x = Math.round(((mousePos.x * sprite.limit.x) / -renderer.width))
      sprite.tempPos.y = Math.round(((mousePos.y * sprite.limit.y) / -renderer.height))
      // Calculate the difference between sprite and mouse to get the delta
      deltaPos.x = Math.round((sprite.tempPos.x - sprite.x) * 10) / 10
      deltaPos.y = Math.round((sprite.tempPos.y - sprite.y) * 10) / 10
      // Sprite moved with the delta factor
      sprite.x += deltaPos.x / deltaFactor
      sprite.y += deltaPos.y / deltaFactor
    })

    requestAnimationFrame(this.mouseLoop)
  }

  touchLoop() {
    const { renderer } = this.app
    const{ touchPos, touchMove, deltaPos, deltaFactor, listened } = this.listener

    listened.map(sprite => {
      // Desired position of the mouse in the renderer
      sprite.tempPos.x = Math.round(-touchPos.x)  
      sprite.tempPos.y = Math.round(-touchPos.y)
      // Calculate the difference between sprite and mouse to get the delta
      deltaPos.x = Math.round((sprite.tempPos.x - sprite.x) * 10) / 10
      deltaPos.y = Math.round((sprite.tempPos.y - sprite.y) * 10) / 10
      // Sprite moved with the delta factor
      sprite.x += deltaPos.x / deltaFactor
      sprite.y += deltaPos.y / deltaFactor
      // Damping effect
      if(sprite.x > 0){
        touchPos.x = 1
      }else if(sprite.x < -sprite.limit.x ){
        touchPos.x = sprite.limit.x - 1
      }
      if(sprite.y > 0){
        touchPos.y = 1
      }else if(sprite.y < -sprite.limit.y ){
        touchPos.y = sprite.limit.y - 1
      }
    })

    requestAnimationFrame(this.touchLoop)
  }

}
module.exports = PixiCarousel