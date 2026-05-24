# Print Ready Tools + PixelFit

Complete local project package for `print.ymirtool.com`, including PixelFit image size, DPI, safe-zone, product image, app store asset, marketplace image, email header, passport/ID, overlay and batch export planning tools.

## Run locally

```bash
npm install
npm run check:all
```

## PixelFit scope

PixelFit is mounted at `/image-size/` and includes P0, P1 and P2 items from the development plan. It does not create a separate site.

## Privacy and boundaries

Image previews are browser-local only. The project does not upload images, save files to cloud storage, create user accounts, or generate AI images.

## Deployment

`vercel.json` uses `node scripts/skip-old-vercel-builds.mjs` as `ignoreCommand` so stale commits can be skipped by Vercel.
