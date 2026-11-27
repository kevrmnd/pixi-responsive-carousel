import './styles.css'
import PixiCarousel from './PixiCarousel.js'

const details = 'Détail sur l\'univers. On y met un texte court mais efficace. Cordialement.'
const markers = [
  { id: 0, name: 'Label court', details, position: { x: 20, y: 20 } },
  { id: 1, name: 'Label un peu long', details, position: { x: 60, y: 20 } },
]

const carousel = new PixiCarousel({
  container: '#pixi',
  background: 0xffffff,
  current: 0,
  arrows: {
    prev: '#prev',
    next: '#next',
  },
  pagination: '#pagination',
  speed: 1.2,
  slides: [1, 2, 3, 4].map(n => ({ url: `img/photo-${n}.jpeg`, markers })),
})

// Clean up on hot reload in dev
if (import.meta.hot) {
  import.meta.hot.dispose(() => carousel.destroy())
}
