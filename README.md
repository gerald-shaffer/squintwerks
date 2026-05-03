# X-WEB ENGINE — RockCam

**Robert Creek Rock Museum** — AR Camera App powered by 8th Wall (open-source)

## Overview

This is the X-WEB AR engine for the Robert Creek Rock Museum. Point your phone at numbered rocks to unlock video experiences overlaid on the physical world.

## Architecture

```
├── client/              → React PWA (branded camera app)
├── engine/              → 8th Wall open-source engine reference
│   └── 8thwall-source/
│       ├── engine-package/     → Core AR engine source
│       ├── image-target-cli/   → CLI tool for generating target data
│       └── aframe-example/     → A-Frame image tracking reference
├── firebase.json        → Firebase Hosting config (deploys to xweb-pub-2)
└── server/              → Express server (for local dev)
```

## Live URLs

- **Firebase**: https://xweb-pub-2.web.app
- **Manus**: https://rockcam-jwwvt5q6.manus.space

## How It Works

1. User opens the app on their phone
2. Taps "OPEN CAMERA" 
3. Points camera at Rock #5 (numbered rock at the museum)
4. 8th Wall engine detects the target image
5. Video plays overlaid on the rock

## Tech Stack

- **AR Engine**: 8th Wall (open-source, CDN-loaded)
- **Frontend**: React 19 + Tailwind CSS 4
- **Hosting**: Firebase Hosting
- **PWA**: Installable to home screen (no app store needed)

## Adding New Rocks

1. Take a photo of the new rock target
2. Run `npx @8thwall/image-target-cli` to generate target data
3. Add the target JSON + luminance image to the assets
4. Add the corresponding video
5. Update the CameraView component with the new target

## Deployment

```bash
pnpm install
pnpm run build
npx firebase deploy --only hosting --project just-gerald-magazine
```

## X-WEB Platform

Published on X-WEB — available off the browser and in the real world.
Powered by Shaffer Media Group.
