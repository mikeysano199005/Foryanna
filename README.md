# Yanna

A tiny interactive digital love letter. One message: **I love you, Yanna.**

## Add her photo

Place the photo at:

```
assets/yanna.jpg
```

Until it's added, an elegant placeholder (a soft glowing monogram) is
shown instead — the site is fully functional either way. Once the file
exists at that exact path, it appears automatically with a cinematic
reveal, glow, and subtle parallax. A portrait-ish image (roughly 4:5)
crops best; the frame uses `object-fit: cover` so slight mismatches
are fine.

## Run locally

No build step — plain HTML/CSS/JS. From the project root:

```
python3 -m http.server 8000
```

then open `http://localhost:8000`. (Opening `index.html` directly also
mostly works, but a local server avoids browser file:// restrictions.)

## What's inside

- `index.html` — structure for each stage of the experience
- `css/style.css` — all visual design, mobile-first, with a
  `prefers-reduced-motion` fallback
- `js/script.js` — state machine + interactions: intro reveal, photo
  parallax, tap effects (hearts/sparks/phrases), the "I LOVE YOU"
  cinematic zoom, a hidden long-press secret on the photo, and the
  final quiet screen
- `assets/yanna.jpg` — her photo goes here (see above)
- `assets/audio/` — optional background track (see its README)

## Customize later

- **Tap threshold** for the cinematic moment: `CINEMATIC_THRESHOLD` in
  `js/script.js`
- **Phrases** that float up on tap: the `phrasePool` array in
  `js/script.js`
- **Secret long-press duration**: `LONG_PRESS_MS` in `js/script.js`
- **Colors / glow**: CSS custom properties at the top of
  `css/style.css`
- **Fonts**: currently Cormorant Garamond (serif, emotional lines) +
  DM Sans (small UI text), loaded from Google Fonts in `index.html`
- **Music**: drop `assets/audio/theme.mp3` in; the toggle button
  appears automatically once it's playable
