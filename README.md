# PuffPals

A cozy typing game with two ways to play: illustrated story strolls and Typefall, a little word survival game.

## Play locally

Open `index.html`, or serve this directory:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. No build step or dependencies are needed.

Stories support keyboard and touch input. Type the displayed passage, use Backspace to correct, Enter for paragraph breaks, and Escape to pause. Punctuation, live stats, focus mode, and sound are optional. Progress, postcards, and Puff's outfits are saved in your browser.

Typefall works best with a physical keyboard. Type the falling words and use keys 1–5 to cast collected spells.

## Check the game

```sh
node --test tests/*.test.cjs
```

For browser checks and screenshots, use Node 22+ and Chrome:

```sh
node tests/browser-smoke.cjs
```

The browser check uses local Chrome on macOS. Set `CHROME_PATH` to your Chrome executable on other systems. It starts a temporary local server and browser profile, checks real keyboard and touch input, and prints the screenshot directory.
