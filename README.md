# A Little Something For You

An interactive digital bouquet you can gift someone: the site asks their name, asks (politely) if it can flirt with them, then reveals three rotatable 3D bouquets - tulips, a garden box, and wildflowers - rendered live in their browser.

Live demo: https://3d-bouquet.vercel.app

Perfect as a birthday surprise, a friendship-day gift, an anniversary note, or any "thinking of you" moment. Send the link, they enter their name, and the flowers are for them.

## What it does

1. Asks what to call them (name or nickname).
2. Asks "Do you mind if I flirt with you?" - answering is optional, flowers either way.
3. Reveals a full-screen 3D garden with three bouquets they can rotate, plus sticker art.

Privacy: there is no backend. Names and answers stay on the visitor's device and are never sent anywhere.

## Tech stack

- **React 18** + **TypeScript** - UI and the step-by-step gift flow (`src/App.tsx`)
- **Vite 5** - dev server and build
- **Raw WebGL** - the 3D flower scene (`src/FlowerScene.tsx`); no 3D library, the bouquets are generated and rendered directly against the WebGL API
- Plain CSS for the floral design (`src/style.css`)

## Run locally

```
npm install
npm run dev
```

Then open the printed local URL (default http://localhost:5173).

## Build

```
npm run build
```

Outputs a static site to `dist/`.

## Deploy

Any static host works. It is live on Vercel as a zero-config Vite project (Build Command `vite build`, Output Directory `dist`).

## Make it yours (gift it to someone)

- **Change the words**: the greeting, questions, and messages are all in `src/App.tsx`.
- **Swap the stickers**: the two stickers are inlined as data URIs in `src/photosData.ts` (keeps the repo self-contained). Replace the data URIs there, or drop your own PNGs into `src/photos/` and import them in `src/App.tsx`.
- **Restyle**: colors, fonts, and layout live in `src/style.css`.
- **New bouquets**: the flowers are procedural - tweak shapes and colors in `src/FlowerScene.tsx`.
- **Share-preview image**: `scripts/prepare-public.mjs` writes the included JPG from its embedded image data before dev/build. Replace that data to use your own preview. The same script creates `robots.txt` and `sitemap.xml`. If you deploy a fork, update the site URL in that script and the canonical/OG URLs in `index.html`; remove the original Google verification tag.

## Ideas

Birthday surprise website, digital bouquet for a friend, long-distance gift link, friendship day surprise, anniversary flowers, Valentine's note - fork it, personalize it, send it.
