// Everything you'd want to edit lives here. No other file needs touching
// to change the words, the letter, or the pictures.
window.CONFIG = {
  herName: 'NAME',
  yourName: 'YOURNAME',

  // Language it opens in: 'zh' or 'en'. A link ending in ?lang=en opens in English.
  defaultLang: 'en',

  // All the words, once per language. Both blocks have the same keys.
  text: {
    zh: {
      pageTitle: '有一个问题想问你',
      title: ['做我女朋友', '好不好？'], // two lines
      yes: '好呀！',
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

      // Names of the pop-up pictures (shown if a picture is missing). Same numbers as `items`.
      itemLabels: { 2: '流汗猫猫', 3: '害羞猫猫', 4: '薄荷巧克力冰淇淋', 5: 'Hello Kitty', 6: '韩式炸鸡', 7: '哭哭猫猫', 8: '转圈猫猫', 9: '猫猫' },

      envelopeTitle: '我就知道你会答应！',
      envelopeSub: '有一封信，是写给你的',
      envelopeHint: '点一下封蜡，拆开它',
      openLetter: '拆开信封',
      replay: '再看一遍',
      loading: '正在把星星挂上去…',
      mute: '静音',
      unmute: '打开声音',
      volume: '音量',

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
        closing: '你的 {yourName}'
      }
    },

    en: {
      pageTitle: 'I have a question for you',
      title: ['Will you be', 'my girlfriend?'],
      yes: 'Yes!',
      date: 'January 1, 2067',

      subtitle: "{herName}, I've wanted to ask you this for so long.",

      messages: [
        'Every star tonight is waiting for your answer (✿◠‿◠)',
        'Huh? Did your finger slip? Σ(°△°)',
        'Think about it again, pretty please? (｡•́︿•̀｡)',
        'Really? No? (´・ω・`)',
        'The ice cream is melting… (；´д｀)',
        'Hello Kitty is watching you (=^･ω･^=)',
        "Even the fried chicken doesn't taste good anymore… (╥﹏╥)",
        "I'm going to cry, you know (ಥ﹏ಥ)",
        'Pleaseee, I\'m even asking in Chinese now: 求求你了！',
        "Okay, now there's only one option left"
      ],

      noLabels: ['No', 'No', 'Still no', 'Nope', 'N…no', 'N…', 'n', 'Pleeease', 'Pleeease', 'Pleeease'],

      itemLabels: { 2: 'Sweaty kitty', 3: 'Shy kitty', 4: 'Mint choc chip ice cream', 5: 'Hello Kitty', 6: 'Korean fried chicken', 7: 'Crying kitty', 8: 'Twirling kitty', 9: 'Kitty' },

      envelopeTitle: "I knew you'd say yes!",
      envelopeSub: "There's a letter, and it's for you",
      envelopeHint: 'Tap the wax seal to open it',
      openLetter: 'Open the envelope',
      replay: 'Back to Start',
      loading: 'Hanging up the stars…',
      mute: 'Mute',
      unmute: 'Unmute',
      volume: 'Volume',

      letter: {
        greeting: 'Dear {herName},',
        paragraphs: [
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus nulla ac justo aliquet, ut aliquet nibh blandit. Vivamus tincidunt nibh id lacus suscipit, ut volutpat purus laoreet. Aenean suscipit.',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus nulla ac justo aliquet, ut aliquet nibh blandit. Vivamus tincidunt nibh id lacus suscipit, ut volutpat purus laoreet. Aenean suscipit. 2 ......',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus nulla ac justo aliquet, ut aliquet nibh blandit. Vivamus tincidunt nibh id lacus suscipit, ut volutpat purus laoreet. Aenean suscipit. 3 ......',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus nulla ac justo aliquet, ut aliquet nibh blandit. Vivamus tincidunt nibh id lacus suscipit, ut volutpat purus laoreet. Aenean suscipit. 4 ......',
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus nulla ac justo aliquet, ut aliquet nibh blandit. Vivamus tincidunt nibh id lacus suscipit, ut volutpat purus laoreet. Aenean suscipit. 5 ......'
        ],
        closing: 'Yours, {yourName}'
      }
    }
  },

  // What pops up on each "no" number (her favourite things and the cat stickers).
  // Their names are under `itemLabels` above. Until an image file exists, a dashed
  // placeholder with the name shows instead.
  items: {
    2: 'assets/art/stickers/cat_sweating.png',
    3: 'assets/art/stickers/cat_shy.png',
    4: 'assets/art/stickers/ice_cream.png',
    5: 'assets/art/stickers/hello_kitty.webp',
    6: 'assets/art/stickers/fried_chicken.png',
    7: 'assets/art/stickers/sad_cat.png',
    8: 'assets/art/stickers/sad_twirling.png',
    9: 'assets/art/stickers/cat_steal.png'
  },

  // Sticker sitting on the envelope after she says yes.
  envelopeSticker: 'assets/art/stickers/cat_rose.png',

  // Sticker in the letter's corner (null for none)
  letterSticker: 'assets/art/stickers/cat_love.png',

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
