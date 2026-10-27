# Birthday Surprise Card 🎉

A single-page, animated birthday card built with plain HTML, CSS and JavaScript. No frameworks, no build step.

## Features

- Soft animated gradient background with a glassmorphism card
- Floating hearts rising behind the card
- Sparkle trail that follows the cursor or finger
- "Open Your Surprise" button that triggers:
  - Confetti burst (squares, circles, strips, hearts)
  - Typewriter birthday message
  - Background music (auto-stops after 60 seconds) with a mute toggle
- Accessible: keyboard focus styles, ARIA labels, and `prefers-reduced-motion` support
- Responsive down to small phone screens

## Project structure

```
.
├── index.html        # Main card (your existing birthday card file)
├── style.css         # Complementary styles (animations, hearts, sparkles)
├── script.js         # Complementary behavior (confetti, typewriter, audio)
├── your-song.mp3     # Birthday song (add your own)
└── README.md
```

## Setup

1. Rename your HTML file to `index.html` (or keep the name and adjust the paths below).
2. In `<head>`, after the inline `<style>` block, add:
   ```html
   <link rel="stylesheet" href="style.css">
   ```
3. Before `</body>`, after (or in place of) the inline `<script>`, add:
   ```html
   <script src="script.js"></script>
   ```
4. Put an audio file named `your-song.mp3` in the same folder.
5. Open `index.html` in a browser.

`script.js` redefines `startCelebration()`, so the existing `onclick` on the button keeps working.

## Customization

Edit the `CONFIG` object at the top of `script.js`:

| Option | Purpose |
| --- | --- |
| `message` | Text typed out after clicking the button |
| `confettiCount` | Number of confetti pieces |
| `confettiColors` | Confetti palette |
| `songDurationMs` | How long the music plays |
| `heartEmojis` / `sparkleEmojis` | Emojis used in the effects |

Colors for the CSS effects live in the `:root` variables at the top of `style.css`.

## Notes

- Browsers block autoplay until the user interacts. The song starts on the button click, so this is fine.
- If the audio file is missing, the celebration still runs and a warning is logged to the console.
- Users who prefer reduced motion get a static version without hearts, sparkles or confetti.

## Browser support

Current versions of Chrome, Edge, Firefox and Safari. The `translate` property and `inset` shorthand require 2022+ browser versions.

## License

Personal project. Use and adapt freely.
