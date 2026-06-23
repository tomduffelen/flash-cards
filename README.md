# Flash Report Card

A static web app that overlays text onto a project flash report card background image and exports it as a PNG. No build step, no dependencies — just open `index.html`.

## Usage

1. Open `index.html` in a browser (or visit the GitHub Pages URL).
2. Fill in the fields on the left — the canvas preview updates live.
3. Click **Export PNG** to download `flash-report-card.png` at full 1920 × 1080 resolution.
4. Click **Clear All** to reset all fields.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under *Branch*, select `main` (or `master`) and `/ (root)`, then click **Save**.
4. After ~60 seconds, your app will be live at `https://<your-username>.github.io/<repo-name>/`.

That's it — there is no build step and no server required.

## Swapping the background image

Replace `assets/background.png` with your own image and commit the change.

Requirements:
- The app expects the file at exactly `assets/background.png`.
- The default canvas size is **1920 × 1080 px**. If your image has different dimensions, update the `width` and `height` attributes on `<canvas>` in `index.html` to match, then re-tune the `x`/`y` coordinates in `CONFIG` inside `script.js`.

## Adjusting text placement

Open `script.js`. At the top is the `CONFIG` object — one entry per field:

```js
const CONFIG = {
  projectName: {
    x: 80,          // left edge of text block (canvas pixels)
    y: 95,          // top edge of text block (canvas pixels)
    maxWidth: 860,  // text wraps beyond this width
    fontSize: 52,
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    textColour: '#1a1a2e',
    lineHeight: 1.3, // multiplier of fontSize
  },
  // … other fields
};
```

Change `x`, `y`, `maxWidth`, `fontSize`, or `textColour` and save — the browser will reflect your changes on reload.

## Project structure

```
flash-report-card/
├── index.html          # App shell and form
├── styles.css          # Layout and styling
├── script.js           # Canvas rendering logic + CONFIG
├── assets/
│   └── background.png  # 1920 × 1080 report card template
└── README.md
```
