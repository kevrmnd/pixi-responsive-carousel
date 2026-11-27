# Pixi Responsive Carousel

A responsive carousel wich handles any size and ratio of images. Enjoy a smooth mouse related movement on desktop and a nice swipe effect on touch devices.

No need to truncate your pictures, they will all be fully visible.

## Demo

Check it with a desktop and a touch device : [Here.](https://kevrmnd.github.io/pixi-responsive-carousel/)



## Customizable

You can esilly use your dom elements as navigation arrows or pagination. This means you can manage the way it looks in your own css files. :ok_hand:

## Dependencies

It uses [PixiJS 8](https://pixijs.com/) to render, [GSAP 3](https://gsap.com/) to animate and [detect-it](https://github.com/rafgraph/detect-it) to choose between mouse and touch behaviour.

## Development

The project is built with [Vite](https://vite.dev).

```bash
npm install
npm run dev      # dev server with hot reload
npm run build    # production build in dist/
npm run preview  # serve the production build locally
```

Every push on `master` builds the project and deploys `dist/` to GitHub Pages (`.github/workflows/deploy.yml`).
