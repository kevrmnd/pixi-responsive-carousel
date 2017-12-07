const PixiCarousel = require('src/PixiCarousel')

document.addEventListener('DOMContentLoaded', () => {
  
  const params = {
    container: '#pixi',
    background: 0xffffff,
    current: 0,
    arrows: {
      prev: '#prev',
      next: '#next'
    },
    pagination: '#pagination',
    speed: 1.2,
    slides: [
      { 
        url: 'img/photo-1.jpeg', 
        markers: [
          {
            id: 0,
            name: 'Label court',
            details: 'Détail sur l\'univers. On y met un texte court mais efficace. Cordialement.',
            position: { 
              x: 20, 
              y: 20 
            }
          },
          {
            id: 1,
            name: 'Label un peu long',
            details: 'Détail sur l\'univers. On y met un texte court mais efficace. Cordialement.',
            position: { 
              x: 60, 
              y: 20 
            }
          }
        ] 
      },
      { 
        url: 'img/photo-2.jpeg', 
        markers: [
          {
            id: 0,
            name: 'Label court',
            details: 'Détail sur l\'univers. On y met un texte court mais efficace. Cordialement.',
            position: { 
              x: 20, 
              y: 20 
            }
          },
          {
            id: 1,
            name: 'Label un peu long',
            details: 'Détail sur l\'univers. On y met un texte court mais efficace. Cordialement.',
            position: { 
              x: 60, 
              y: 20 
            }
          }
        ] 
      },
      { 
        url: 'img/photo-3.jpeg', 
        markers: [
          {
            id: 0,
            name: 'Label court',
            details: 'Détail sur l\'univers. On y met un texte court mais efficace. Cordialement.',
            position: { 
              x: 20, 
              y: 20 
            }
          },
          {
            id: 1,
            name: 'Label un peu long',
            details: 'Détail sur l\'univers. On y met un texte court mais efficace. Cordialement.',
            position: { 
              x: 60, 
              y: 20 
            }
          }
        ] 
      },
      { 
        url: 'img/photo-4.jpeg', 
        markers: [
          {
            id: 0,
            name: 'Label court',
            details: 'Détail sur l\'univers. On y met un texte court mais efficace. Cordialement.',
            position: { 
              x: 20, 
              y: 20 
            }
          },
          {
            id: 1,
            name: 'Label un peu long',
            details: 'Détail sur l\'univers. On y met un texte court mais efficace. Cordialement.',
            position: { 
              x: 60, 
              y: 20 
            }
          }
        ] 
      },
    ]
  }

  const pixiCarousel = new PixiCarousel(params)

})
