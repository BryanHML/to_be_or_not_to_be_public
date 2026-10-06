# 做我女朋友好不好？

A one-page confession site: a starry night meadow, a question, a "no" button that runs away, and a letter that opens when she says yes. It's plain HTML/CSS/JS with no build step, so it works on any static host.

## How it plays

1. She sees **做我女朋友好不好？** with **好呀！** and **不要**.
2. Each time she goes for 不要 (hovering on a laptop, tapping on a phone), it jumps further away, its text gets weaker, the line under the question changes, and 好呀 grows.
3. On attempts #4, #5 and #6, her favourite thing from that line pops up somewhere random, tilting side to side.
4. On the 9th attempt, 不要 flies off the screen for good.
5. 好呀 → an envelope → tap the wax seal → the letter rises out.

## Editing

All the words and pictures are in **`js/config.js`**:

- `herName`, `yourName`, `date`
- `messages`: the changing line under the question, one per "no" attempt
- `noLabels`: what the 不要 button says each time
- `items`: which picture shows on which attempt
- `letter`: greeting, paragraphs (one string per paragraph), closing, optional sticker
- `background`: the painted backgrounds (and the moon area pop-ups stay off)

## Pictures

Stickers live in `assets/art/stickers/` and are set per "no" number under `items` in `js/config.js`:

| No # | Picture |
| --- | --- |
| 2 | `cat_sweating.png` |
| 3 | `cat_shy.png` |
| 4 | `ice_cream.png` |
| 5 | `hello_kitty.webp` |
| 6 | `fried_chicken.png` |
| 7 | `sad_cat.png` |
| 8 | `sad_twirling.png` |
| 9 | `cat_steal.png` |

`cat_rose.png` sits on the envelope (`envelopeSticker`) and `cat_love.png` goes in the letter's corner (`letter.sticker`). Keep each file's extension matching its real format (a PNG saved as `.webp` won't show on some iPhones). Until a file exists, a dashed placeholder with its label shows instead.

**Backgrounds:** full-screen paintings live in `assets/art/background/` (originals) and `assets/art/background/web/` (compressed copies the site loads). They're set under `background` in `js/config.js`: `landscape` is for laptops and phones held sideways, `portrait` for phones held upright. The shooting stars and fireflies are drawn on top by the code. To change a painting, re-export it to the `web/` folder (a JPEG around 80% quality keeps it light).

## Running it locally

```sh
npx serve .
```

Then open the address it prints. You can also open `index.html` directly in a browser.
