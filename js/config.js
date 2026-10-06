// Everything you'd want to edit lives here. No other file needs touching
// to change the words, the letter, or the pictures.
window.CONFIG = {
  herName: 'NAME',
  yourName: 'YOURNAME',
  date: '2067 年 1 月 1 日',

  // Shown under the big question.
  subtitle: '{herName}，这句话我想了好久才敢问。',

  // The line under the question that changes. Index = how many times she has tried "no".
  messages: [
    '今晚的星星都在等一个答案 (✿◠‿◠)',
    '诶？是不是手滑了～ Σ(°△°)',
    '再想想嘛，好不好 (｡•́︿•̀｡)',
    '真的不要吗？ (´・ω・`)',
    '冰淇淋都要化了… (；´д｀)',
    'Hello Kitty 在看着你哦 (=^･ω･^=)',
    '炸鸡都不香了… (╥﹏╥)',
    '我要哭给你看了 (ಥ﹏ಥ)',
    "Pleaseee I'm using English to communicate with you now!",
    '好吧，现在只剩一个选项了'
  ],

  // What the "no" button says. Same index as messages.
  noLabels: ['不要', '不要', '还是不要', '就是不要', '不…要', '不…', '不', '求求', '求求', '求求'],

  // What pops up on each "no" number (her favourite things and the cat stickers).
  // Until an image file exists, a dashed placeholder with the label shows instead.
  items: {
    2: { src: 'assets/art/stickers/cat_sweating.png', label: '流汗猫猫' },
    3: { src: 'assets/art/stickers/cat_shy.png', label: '害羞猫猫' },
    4: { src: 'assets/art/stickers/ice_cream.png', label: '薄荷巧克力冰淇淋' },
    5: { src: 'assets/art/stickers/hello_kitty.webp', label: 'Hello Kitty' },
    6: { src: 'assets/art/stickers/fried_chicken.png', label: '韩式炸鸡' },
    7: { src: 'assets/art/stickers/sad_cat.png', label: '哭哭猫猫' },
    8: { src: 'assets/art/stickers/sad_twirling.png', label: '转圈猫猫' },
    9: { src: 'assets/art/stickers/cat_steal.png', label: '猫猫' }
  },

  // Sticker sitting on the envelope after she says yes.
  envelopeSticker: 'assets/art/stickers/cat_rose.png',

  // The letter. Each string in `paragraphs` is one paragraph.
  letter: {
    greeting: '亲爱的{herName}：',
    paragraphs: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus nulla ac justo aliquet, ut aliquet nibh blandit. Vivamus tincidunt nibh id lacus suscipit, ut volutpat purus laoreet. Aenean suscipit.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus nulla ac justo aliquet, ut aliquet nibh blandit. Vivamus tincidunt nibh id lacus suscipit, ut volutpat purus laoreet. Aenean suscipit. 2 ......',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus nulla ac justo aliquet, ut aliquet nibh blandit. Vivamus tincidunt nibh id lacus suscipit, ut volutpat purus laoreet. Aenean suscipit. 3 ......',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus nulla ac justo aliquet, ut aliquet nibh blandit. Vivamus tincidunt nibh id lacus suscipit, ut volutpat purus laoreet. Aenean suscipit. 4 ......',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus nulla ac justo aliquet, ut aliquet nibh blandit. Vivamus tincidunt nibh id lacus suscipit, ut volutpat purus laoreet. Aenean suscipit. 5 ......'
    ],
    closing: '你的 {yourName}',
    // Sticker in the letter's corner (null for none)
    sticker: 'assets/art/stickers/cat_love.png'
  },

  // Background music. Starts softly on her first tap (browsers don't allow sound
  // before that). volume: 0–1. Set src to null for no music.
  music: {
    src: 'assets/song/web/glass_gareth.mp3',
    volume: 0.5
  },

  // Full-screen paintings (sky, moon and all). Shooting stars and fireflies still
  // fly over them. Set both to null to go back to the drawn hills and house.
  background: {
    landscape: 'assets/art/background/web/laptop.jpg', // laptops, phones held sideways
    portrait: 'assets/art/background/web/phone.jpg',   // phones held upright
    // Part of each painting the runaway button and pop-ups stay off (the moon's face),
    // as fractions of the image: [left, top, right, bottom].
    keepClear: {
      landscape: [0.63, 0.14, 0.81, 0.44],
      portrait: [0.58, 0.08, 0.88, 0.25]
    }
  }
};
