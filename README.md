# Will you be my girlfriend?

A one-page confession site: a starry night meadow, a question, a "no" button that runs away, and a letter that opens when she says yes. A switch in the top-right corner flips it between English and Chinese. It's plain HTML/CSS/JS with no build step, so it works on any static host.

## How it plays

1. She sees **Will you be my girlfriend?** with **Yes!** and **No**.
2. Each time she goes for No (hovering on a laptop, tapping on a phone), it jumps further away, its text gets weaker, the line under the question changes, and Yes grows.
3. On attempts #4, #5 and #6, her favourite thing from that line pops up somewhere random, tilting side to side.
4. On the 9th attempt, No flies off the screen for good.
5. Yes → an envelope → tap the wax seal → the letter rises out.

## Editing

All the words and pictures are in **`js/config.js`**:

- `herName`, `yourName`
- `defaultLang`: the language it opens in. Set it to `'en'` to open in English, or send a link ending in `?lang=en`.
- `text.en`: every word on the English site (`text.zh` holds the same keys for Chinese):
  - `title`, `subtitle`, `yes`, `date`
  - `messages`: the changing line under the question, one per "no" attempt
  - `noLabels`: what the No button says each time
  - `itemLabels`: the name of each pop-up picture
  - `letter`: greeting, paragraphs (one string per paragraph), closing
  - the envelope, loading and button wording
- `items`: which picture shows on which attempt
- `envelopeSticker`, `letterSticker`
- `music`: the background song and its starting volume
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

`cat_rose.png` sits on the envelope (`envelopeSticker`) and `cat_love.png` goes in the letter's corner (`letterSticker`). Keep each file's extension matching its real format (a PNG saved as `.webp` won't show on some iPhones). Until a file exists, a dashed placeholder with its label shows instead.

**Backgrounds:** full-screen paintings live in `assets/art/background/` (originals) and `assets/art/background/web/` (compressed copies the site loads). They're set under `background` in `js/config.js`: `landscape` is for laptops and phones held sideways, `portrait` for phones held upright. The shooting stars and fireflies are drawn on top by the code. To change a painting, re-export it to the `web/` folder (a JPEG around 80% quality keeps it light).

## Music

No song comes with this repo (music is usually copyrighted), so add your own:

1. Put an MP3 in `assets/song/web/`, e.g. `assets/song/web/our_song.mp3`.
2. Point `music.src` in `js/config.js` at it:

   ```js
   music: {
     src: 'assets/song/web/our_song.mp3',
     volume: 0.5 // 0 to 1, where the volume slider starts
   },
   ```

The song loops and fades in softly on her first tap (browsers block sound until the visitor interacts with the page). A small mute button and volume slider sit in the top-left corner, and the song pauses when she switches away from the tab. It keeps playing on iPhones with the silent switch on (Safari 17+). Keep the file small, around 128 kbps, so it loads quickly on a phone.

To turn music off, set `src: null` and the corner control disappears.

## Running it locally

```sh
npx serve .
```

Then open the address it prints. You can also open `index.html` directly in a browser.
