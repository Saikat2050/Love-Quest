export const NAMES = {
  her: "Rishika",
  nickname: "Reshu",
} as const;

export const GAME = {
  title: "The Love Quest",
  tagline: "Seven gates. One city. A road made only for you.",
  storageKey: "love-quest-progress",
  introKey: "love-quest-seen-intro",
} as const;

export const OPENING = {
  kicker: "Welcome to",
  lead: "A little journey through our memories, my favourite moments, and the dreams we share...",
  forYou: "Just for you",
  begin: "Begin Our Story",
  foot: "Six little chapters, one big love story.",
  image: "/images/opening.jpg",
  imageAlt: "The two of you, watching the city at dusk",
} as const;

export const BOOT = {
  kicker: "A moment, my love",
  title: "Preparing our story",
  lead: "Gathering every photograph, letter, and the song that stays with us…",
  progress: "Loading our memories",
  stages: [
    {
      id: 1,
      title: "Opening our story",
      line: "Opening a little world of us...",
    },
    {
      id: 2,
      title: "Bringing memories to life",
      line: "Collecting all the little pieces...",
    },
    {
      id: 3,
      title: "Filling this story with love",
      line: "Filling this story with love...",
    },
    {
      id: 4,
      title: "Entering our little universe",
      line: "A little world made just for you. ❤️",
    },
  ],
  memories: ["/images/chapter-2-us.jpg", "/images/chapter-3/you.jpg", "/images/opening.jpg"],
} as const;

export const GUIDE = {
  kicker: "A traveler's scroll",
  title: "How this road works",
  lead: "Seven gates, opened one after another. Nothing here is a test of you — only a way to remember us. Come back to this scroll whenever you like.",
  notesTitle: "Hidden messages",
  notes:
    "Collect all 7 hidden messages along the road. Long-press a faint ✦, a lantern, or a little hint. The count in the corner keeps them — they stay found.",
  music: "The song stays with you. Mute or soften it from the corner whenever you want.",
  close: "Roll the scroll up",
  open: "How this road works",
  openHint: "Unroll the scroll",
  chapters: [
    {
      id: 1,
      title: "The Beginning",
      how: "A letter, just for you. Read it in your own time, then begin the adventure.",
    },
    {
      id: 2,
      title: "The First Clue",
      how: "A sixteen-piece picture. Drag or tap pieces onto the board until we are whole again.",
    },
    {
      id: 3,
      title: "Memory Lane",
      how: "A little quiz about us. Five questions from a wandering set. Wrong answers stay gentle — try again.",
    },
    {
      id: 4,
      title: "Why You're Special",
      how: "Three keys, one after another. Each one unlocks a reason I love you.",
    },
    {
      id: 5,
      title: "The Heart Puzzle",
      how: "Collect the floating hearts. Each one clears a little more of a memory kept for you.",
    },
    {
      id: 6,
      title: "Our Future",
      how: "Five daydreams, no scores. Pick what you hope for, and we'll write a little dream book.",
    },
    {
      id: 7,
      title: "The Final Unlock",
      how: "No puzzle this time. Open the letter, then the last page of our story.",
    },
  ],
} as const;

export const REVEAL_HEART_PHOTO = "/images/chapter-2-us.jpg";

export type RoundId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type RoundContent = {
  id: RoundId;
  title: string;
  subtitle: string;
  placeholder: string;
  body: string;
  images: string[];
  video: string | null;
  audio: string | null;
  youAreCalled: string;
};

export const ROUNDS: RoundContent[] = [
  {
    id: 1,
    title: "The Beginning",
    subtitle: "A little something for you",
    placeholder: "ROUND_1_WELCOME",
    body: "",
    images: ["/images/chapter-1-sky.jpg"],
    video: null,
    audio: "/audio/infinity.wav",
    youAreCalled: "My Love",
  },
  {
    id: 2,
    title: "The First Clue",
    subtitle: "A picture waiting to be whole",
    placeholder: "ROUND_2_MESSAGE",
    body: "",
    images: ["/images/chapter-2-us.jpg"],
    video: null,
    audio: null,
    youAreCalled: "your lover",
  },
  {
    id: 3,
    title: "Memory Lane",
    subtitle: "A little quiz about our story",
    placeholder: "ROUND_3_QUIZ",
    body: "",
    images: [
      "/images/chapter-3/date.jpg",
      "/images/chapter-3/trip.jpg",
      "/images/chapter-3/food.jpg",
      "/images/chapter-3/maggie.jpg",
      "/images/chapter-3/time.jpg",
      "/images/chapter-3/marriage.jpg",
      "/images/chapter-3/you.jpg",
    ],
    video: null,
    audio: null,
    youAreCalled: "your lover",
  },
  {
    id: 4,
    title: "Why You're Special",
    subtitle: "Three little things I want you to know",
    placeholder: "ROUND_4_REASONS",
    body: "",
    images: [
      "/images/chapter-4/reason-1.jpg",
      "/images/chapter-4/reason-2.jpg",
      "/images/chapter-4/reason-3.jpg",
    ],
    video: null,
    audio: null,
    youAreCalled: "your lover",
  },
  {
    id: 5,
    title: "The Heart Puzzle",
    subtitle: "A little memory, hidden just for you",
    placeholder: "ROUND_5_HEART",
    body: "",
    images: [REVEAL_HEART_PHOTO],
    video: null,
    audio: null,
    youAreCalled: "your lover",
  },
  {
    id: 6,
    title: "Our Future",
    subtitle: "Let's dream, plan, and build more beautiful moments together",
    placeholder: "ROUND_6_FUTURE",
    body: "",
    images: [],
    video: null,
    audio: null,
    youAreCalled: "your lover",
  },
  {
    id: 7,
    title: "The Final Unlock",
    subtitle: "A letter from my heart",
    placeholder: "ROUND_7_LETTER",
    body: "",
    images: ["/images/chapter-7-finale.jpg"],
    video: null,
    audio: "/audio/letter.wav",
    youAreCalled: "your favourite person",
  },
];

export type HiddenNote = {
  id: string;
  title: string;
  body: string;
};

export const CHAPTER_ONE = {
  kicker: "A little something for you",
  greeting: "Hey, My Love",
  image: "/images/chapter-1-sky.jpg",
  hiddenNoteId: "note-1",
  paragraphs: [
    "My love,",
    "I know lately we haven't been able to meet as often as we'd like. With me being away at home and work sometimes taking over my day, there may even be times when I can't talk to you as much as I wish I could.",
    "And honestly, I wish things were different. I wish I could see you whenever I missed you, hug you when I needed you, and tell you about my day while looking into your eyes instead of through a screen.",
    "But even on the days when I'm busy, tired, or far away, please never think that you've become any less important to me. Sometimes I may not be able to give you all my time, but that doesn't mean you've lost your place in my heart.",
    "I can't promise that every day will be perfect or that I'll always be available when you miss me. But I want you to know that you are someone I never want to take for granted. You are not just a part of my free time; you are a part of the life I'm working so hard to build.",
    "So, until we can meet, laugh together, hold each other, and make more beautiful memories, I made this little world just for you. Every round has a little piece of my heart, and every message is something I want you to remember, especially on the days when I'm not around as much as I'd like to be.",
  ],
  closing:
    "Distance may take away our moments together, but it will never make you any less special to me.",
  cta: "Now, shall we begin our little adventure, my favourite person?",
  signoff: "Made with all my love, just for you.",
} as const;

export const CHAPTER_TWO = {
  levelLabel: "Level 2",
  title: "The First Clue",
  heading: "Piece by Piece",
  tagline: "Put the pieces together to reveal something special.",
  hint: "It's a memory we both love...",
  image: "/images/chapter-2-us.jpg",
  imageAlt: "The two of you, close enough to share one sky",
  hiddenNoteIds: ["note-2", "note-3"] as const,
  cols: 4,
  rows: 4,
  messageTitle: "You found us",
  message: [
    "The first clue was never hidden in the mist.",
    "It was this — you and me in the same frame, your smile making the whole picture make sense.",
    "Every piece of this little world points back to that.",
  ],
} as const;

export type QuizOptionKey = "a" | "b" | "c" | "d";

export type MemoryQuestion = {
  id: string;
  question: string;
  options: { key: QuizOptionKey; label: string }[];
  answer: QuizOptionKey;
  photo: string;
  caption: string;
};

export const CHAPTER_THREE = {
  levelLabel: "Level 3",
  title: "Memory Lane",
  tagline: "A little quiz about our story.",
  welcome: "Let's see how well you remember our little moments.",
  wrong: "Not quite, my love. Try once more.",
  rightTitle: "Yay! That's right.",
  albumTitle: "Our little scrapbook",
  albumNote: "Five memories, kept for you. Come back any time — the questions will wander, the love will not.",
  hiddenNoteId: "note-4",
  playCount: 5,
  questions: [
    {
      id: "date",
      question: "Which was our first proper date together?",
      options: [
        { key: "a", label: "Bagalore (Kaavu)" },
        { key: "b", label: "Waynad" },
        { key: "c", label: "Landran (Street Food)" },
        { key: "d", label: "Shillong" },
      ],
      answer: "c",
      photo: "/images/chapter-3/date.jpg",
      caption: "On that day we had golgappa on the streats of landran and it diwali time and the city is slowing healing from covid so no rush. I hope you remembered.",
    },
    {
      id: "trip",
      question: "Which is our most memorable trip so far?",
      options: [
        { key: "a", label: "Waynad" },
        { key: "b", label: "Gurgaon" },
        { key: "c", label: "Shillong" },
        { key: "d", label: "Kannur" },
      ],
      answer: "a",
      photo: "/images/chapter-3/trip.jpg",
      caption: "Best new year celebration we had together I guess.",
    },
    {
      id: "food",
      question: "Which food (your cooking) I like most?",
      options: [
        { key: "a", label: "Rajma" },
        { key: "b", label: "Baigan Bharta" },
        { key: "c", label: "Fried Rice" },
        { key: "d", label: "Kale Channe" },
      ],
      answer: "b",
      photo: "/images/chapter-3/food.jpg",
      caption: "I love the spicy Baigan bhata you make but alas i do have pics, but this also fine.",
    },
    {
      id: "maggie",
      question: "Which Maggie I like most?",
      options: [
        { key: "a", label: "Dry" },
        { key: "b", label: "Soupy" },
        { key: "c", label: "Fried" },
        { key: "d", label: "Way way" },
      ],
      answer: "b",
      photo: "/images/chapter-3/maggie.jpg",
      caption: "As totally opposite of yous, I love soupy maggie.",
    },
    {
      id: "time",
      question: "What do I love the most about spending time with you?",
      options: [
        { key: "a", label: "Cooking together" },
        { key: "b", label: "Eating together" },
        { key: "c", label: "Understanding" },
        { key: "d", label: "All of the above" },
      ],
      answer: "d",
      photo: "/images/chapter-3/time.jpg",
      caption: "I love to do some other staff also with you lovely Body, but I know you already knew that.",
    },
    {
      id: "marriage",
      question: "After marriage, what I want from you?",
      options: [
        { key: "a", label: "Always by my side" },
        { key: "b", label: "Respect each other" },
        { key: "c", label: "Complete each other" },
        { key: "d", label: "All of the above" },
      ],
      answer: "d",
      photo: "/images/chapter-3/marriage.jpg",
      caption: "I am waiting when I can loudly announce that you are Mine and only mine.",
    },
    {
      id: "you",
      question: "Which body part of yours I love the most?",
      options: [
        { key: "a", label: "Face" },
        { key: "b", label: "Lips" },
        { key: "c", label: "Long Hair" },
        { key: "d", label: "All of the above" },
      ],
      answer: "d",
      photo: "/images/chapter-3/you.jpg",
      caption: "I guess apart from there parts I love some other body part of yours also which comes in pairs (like your heart).",
    },
  ] satisfies MemoryQuestion[],
} as const;

export type SpecialReason = {
  id: string;
  key: "heart" | "star" | "moon";
  title: string;
  headline: string;
  message: string;
  photo: string | null;
};

export const CHAPTER_FOUR = {
  levelLabel: "Level 4",
  title: "Why You're Special",
  subtitle: "Three little things I want you to know, my love.",
  welcome:
    "There are a thousand little things I love about you. Today, I want to tell you three of them. Ready to unlock a little piece of my heart?",
  start: "Unlock the First One",
  keysLead: "Choose a key to unlock the next reason.",
  moreKeys: "Pick another key.",
  lastKey: "One last key — for the most special reason.",
  unlocking: "Unlocking...",
  unlockingLine: "A little thing I adore about you...",
  nextReason: "Next Reason",
  seeAll: "See All Three Reasons",
  albumTitle: "All the little reasons",
  finale:
    "Even on the days when I can't be right beside you, I hope you never forget all the little reasons why you mean so much to me. I made this just to remind you.",
  continue: "Continue Our Story",
  hiddenNoteId: "note-5",
  unlockMs: 1700,
  reasons: [
    {
      id: "smile",
      key: "heart",
      title: "Your Smile",
      headline: "You make ordinary moments feel special.",
      message:
        "There is something about your smile that makes even my hardest days feel a little lighter. Sometimes, just seeing you happy is enough to make my whole day better. I wish I could see that smile more often.",
      photo: "/images/chapter-4/reason-1.jpg",
    },
    {
      id: "understand",
      key: "star",
      title: "The Way You Understand Me",
      headline: "With you, I can be completely myself.",
      message:
        "I love that I don't always have to find the perfect words with you. Being understood, accepted, and cared for in the little things means more to me than I can explain. That's a rare and beautiful feeling.",
      photo: "/images/chapter-4/reason-2.jpg",
    },
    {
      id: "person",
      key: "moon",
      title: "The Person You Are",
      headline: "My life is brighter because you're in it.",
      message:
        "It's not just the beautiful moments or the memories we make. It's who you are, the little things you do, and the person I get to know more every day. I feel lucky that, among all the people in this world, I get to love you.",
      photo: "/images/chapter-4/reason-3.jpg",
    },
  ] satisfies SpecialReason[],
} as const;

export const CHAPTER_FIVE = {
  levelLabel: "Level 5",
  title: "Reveal My Heart",
  subtitle: "A little memory, hidden just for you.",
  welcome:
    "Some of my happiest moments have you in them. I've kept a little piece of each of those moments here. Collect the hearts, my love, and let's bring one of our memories back to life.",
  start: "Let's Find It, My Love",
  progressLabel: "hearts collected",
  photo: REVEAL_HEART_PHOTO,
  heartCount: 10,
  finaleDelayMs: 1100,
  letterKicker: "A memory from my heart",
  letterTitle: "If I could keep one thing forever…",
  letter: [
    "My love,",
    "Sometimes I wish I could pause time whenever we're together. No work, no distance, no worrying about when we'll meet next. Just you and me, enjoying the little moments that somehow become my favourite memories.",
    "I know we won't always be able to meet whenever we want, and some days we might not even get enough time to talk. But I'm looking forward to all the moments we haven't lived yet, all the places we'll visit, all the silly things we'll laugh about, and all the memories we'll make together.",
    "Until then, I hope this little heart reminds you that what we have means so much to me. And when life gets busy, I still want us to keep finding our way back to each other.",
    "This is one memory. I want a lifetime more with you.",
  ],
  keep: "Keep This Memory",
  hiddenNoteId: "note-6",
  milestones: [
    { at: 1, text: "A little piece of us..." },
    { at: 3, text: "Some moments become memories I'll always treasure." },
    { at: 5, text: "Distance can't take away the beautiful moments we've shared." },
    { at: 7, text: "More beautiful moments are waiting for us." },
    { at: 9, text: "Almost there, my love. One more little piece." },
  ],
} as const;

export type FutureOption = {
  key: QuizOptionKey;
  label: string;
  photo: string;
  reveal: string;
};

export type FutureQuestion = {
  id: string;
  title: string;
  question: string;
  options: FutureOption[];
};

export const CHAPTER_SIX = {
  levelLabel: "Level 6",
  title: "Our Future",
  subtitle: "Let's dream, plan, and build more beautiful moments together...",
  welcome:
    "We've made some beautiful memories already. But my favourite part is knowing that there are so many more waiting for us. Let's imagine them together.",
  start: "Start Our Future",
  next: "Next Question",
  seeBook: "See Our Dream Book",
  revealTitle: "Our Little Daydream",
  albumTitle: "Our Future Together",
  albumLead: "Different places, same answers... but the biggest answer is always you.",
  finale: [
    "Different dreams, different adventures, so many possibilities…",
    "I don't know exactly what the future has planned for us. But I know there are so many little things I'd love to experience with you: places to explore, food to try, conversations that last too long, silly moments that become favourite memories, and ordinary days that feel special simply because we're together.",
    "Whatever our future looks like, I hope we keep choosing each other, making time for each other, and finding reasons to smile together.",
    "This is our little dream book. And I hope we get to turn many of these dreams into memories, one day at a time.",
  ],
  continue: "Continue Our Story",
  hiddenNoteId: "note-7",
  questions: [
    {
      id: "adventure",
      title: "Our Next Adventure",
      question: "If we could escape together for a few days, where would you take me?",
      options: [
        {
          key: "a",
          label: "A beach in Kerala",
          photo: "/images/chapter-6/q1-a.jpg",
          reveal:
            "Just imagine us walking beside the sea, talking about everything and nothing, watching the sunset, and forgetting about the rest of the world for a little while. Honestly, being there with you would be the best part.",
        },
        {
          key: "b",
          label: "A cosy mountain town",
          photo: "/images/chapter-6/q1-b.jpg",
          reveal:
            "A quiet town in the hills, cool air, and nowhere we have to rush. I can already see us sharing a blanket, sipping something warm, and letting the mountains keep our secret for a few days.",
        },
        {
          key: "c",
          label: "A romantic European getaway",
          photo: "/images/chapter-6/q1-c.jpg",
          reveal:
            "New streets, old lights, and your hand in mine. I would get lost with you on purpose — just to find a little café, a long walk, and another reason to smile at you.",
        },
        {
          key: "d",
          label: "A road trip exploring India",
          photo: "/images/chapter-6/q1-d.jpg",
          reveal:
            "Windows down, playlists on, and a map we only half follow. The destination would be beautiful, but the best part would be every small stop we make together.",
        },
      ],
    },
    {
      id: "date",
      title: "Our Perfect Date",
      question: "What should we do more often, just the two of us?",
      options: [
        {
          key: "a",
          label: "Discover cute cafés and try new food",
          photo: "/images/chapter-6/q2-a.jpg",
          reveal:
            "A new table, a shared plate, and that look you give me when something tastes unexpectedly good. I want more ordinary dates that still feel like little adventures.",
        },
        {
          key: "b",
          label: "Watch movies and share popcorn",
          photo: "/images/chapter-6/q2-b.jpg",
          reveal:
            "Lights down, popcorn between us, and me watching you more than the screen. I love the idea of more nights that are simple, warm, and only ours.",
        },
        {
          key: "c",
          label: "Take spontaneous weekend trips",
          photo: "/images/chapter-6/q2-c.jpg",
          reveal:
            "A sudden plan, a packed bag, and the two of us laughing at how last-minute we are. I want more weekends that start with 'should we?' and end with a story.",
        },
        {
          key: "d",
          label: "Stay home, cuddle, and talk for hours",
          photo: "/images/chapter-6/q2-d.jpg",
          reveal:
            "No plans, no noise, just us and time that doesn't have to go anywhere. Those quiet hours with you are some of the places I feel most at home.",
        },
      ],
    },
    {
      id: "home",
      title: "Our Little Home",
      question: "Imagine a place that's just ours. What does it look like?",
      options: [
        {
          key: "a",
          label: "A cosy apartment in a lively city",
          photo: "/images/chapter-6/q3-a.jpg",
          reveal:
            "City lights outside, our little world inside. I love imagining a place where we come home to each other after the day, even if the streets never quite go quiet.",
        },
        {
          key: "b",
          label: "A peaceful house with a garden",
          photo: "/images/chapter-6/q3-b.jpg",
          reveal:
            "Morning light, a little garden, and time that feels slower. I can see us making tea, talking on the steps, and letting an ordinary house feel like ours.",
        },
        {
          key: "c",
          label: "A wooden cabin in the mountains",
          photo: "/images/chapter-6/q3-c.jpg",
          reveal:
            "Wood, warmth, and a view that makes the rest of the world feel far away. I would be happy anywhere with you, but a quiet cabin does sound like a beautiful kind of peace.",
        },
        {
          key: "d",
          label: "A beautiful home close to the sea",
          photo: "/images/chapter-6/q3-d.jpg",
          reveal:
            "Salt air, open windows, and the sound of water nearby. I love the thought of a place where we can step outside and remember how wide the world is — together.",
        },
      ],
    },
    {
      id: "milestone",
      title: "Our Next Big Adventure",
      question: "What's one new thing you'd love us to experience together?",
      options: [
        {
          key: "a",
          label: "Travel somewhere neither of us has been",
          photo: "/images/chapter-6/q4-a.jpg",
          reveal:
            "A first time that belongs to both of us. I love the idea of discovering a new place with you, so every street we walk becomes part of our story from the start.",
        },
        {
          key: "b",
          label: "Adopt a pet and raise it together",
          photo: "/images/chapter-6/q4-b.jpg",
          reveal:
            "A little life to look after, and even more reasons to come home smiling. I can already see you talking to it, and me falling for both of you all over again.",
        },
        {
          key: "c",
          label: "Build a little collection of favourite places",
          photo: "/images/chapter-6/q4-c.jpg",
          reveal:
            "Cafés, corners, viewpoints, and secret stops that become 'ours'. I want a map of small places that only make sense because we found them together.",
        },
        {
          key: "d",
          label: "Keep making small, beautiful memories",
          photo: "/images/chapter-6/q4-d.jpg",
          reveal:
            "Not every dream has to be huge. I want the tiny ones too — the jokes, the walks, the ordinary evenings that somehow become the ones I hold onto.",
        },
      ],
    },
    {
      id: "forever",
      title: "A Little Glimpse of Forever",
      question: "When you imagine us five years from now, what makes you smile most?",
      options: [
        {
          key: "a",
          label: "Living closer and sharing everyday moments",
          photo: "/images/chapter-6/q5-a.jpg",
          reveal:
            "Not waiting so long between the little things. I smile thinking of more ordinary days with you in them — breakfasts, errands, tired evenings, and all the in-between.",
        },
        {
          key: "b",
          label: "Exploring the world together",
          photo: "/images/chapter-6/q5-b.jpg",
          reveal:
            "New cities, old trains, and your face every time we see something beautiful. Five years from now, I hope we still get excited about going somewhere just because we can.",
        },
        {
          key: "c",
          label: "Building a life and a home together",
          photo: "/images/chapter-6/q5-c.jpg",
          reveal:
            "A life that slowly starts to look like us. I don't need it to be perfect — I just love the thought of making a place, a rhythm, and a future that has room for both of us.",
        },
        {
          key: "d",
          label: "Being happy together, wherever life takes us",
          photo: "/images/chapter-6/q5-d.jpg",
          reveal:
            "Wherever the years go, I hope we are still choosing each other. That is the picture that makes me smile most: you, me, and a happiness we keep finding our way back to.",
        },
      ],
    },
  ] satisfies FutureQuestion[],
} as const;

export const CHAPTER_SEVEN = {
  levelLabel: "Final Chapter",
  title: "The Final Unlock",
  kicker: "A letter from my heart",
  greeting: "To My Favourite Person,",
  welcome:
    "You've reached the last little chapter of our story. There's nothing left to solve, my love. Just one thing I want you to know.",
  open: "Open Your Letter",
  voice: "There's something I want you to hear",
  voicePause: "Pause my voice",
  voiceSrc: "/audio/letter.wav",
  close: "The End... or maybe just the beginning",
  finaleTitle: "The End",
  finaleSub: "...or maybe just the beginning.",
  finale:
    "This might be the end of the game, but it's nowhere near the end of our story.",
  finaleNote:
    "No matter how many chapters we create, my favourite story will always be the one where I get to know you, love you, and make memories with you.",
  replay: "Play Our Story Again",
  replayNote: "Relive all the moments we've created together",
  reread: "Read My Letter Again",
  rereadNote: "Because some words are always worth coming back to",
  signoff: "Always yours,",
  from: "Your favourite person",
  photo: "/images/ending.jpg",
  photoAlt: "The two of you, at the end of the road and the start of the rest",
  memories: [
    "/images/chapter-2-us.jpg",
    "/images/chapter-3/trip.jpg",
    "/images/chapter-3/you.jpg",
    "/images/chapter-4/reason-1.jpg",
  ],
  paragraphs: [
    "If you're reading this, you've made it through every little chapter I created for you. You solved the puzzles, unlocked our memories, discovered the things I love about you, and imagined some of the beautiful things we could do together.",
    "But there's something I wanted to tell you that no game, puzzle, or photograph could ever fully explain.",
    "I know life gets busy. Sometimes work takes over my day, sometimes I have to be away, and sometimes even when I want to talk to you, I may not get as much time as I'd like. I know those moments aren't always easy, and I wish I could make the distance feel smaller.",
    "But please never measure how much you mean to me by how quickly I reply or how often we manage to meet. You matter to me on the busy days, on the quiet days, and on the days when we barely get time for ourselves.",
    "I made this little game because I wanted to give you something that belongs only to us. Something you can open when you miss me, when you need a smile, or when you simply want to remember how much happiness you've brought into my life.",
    "I want more trips with you, more silly conversations, more photographs, more unexpected plans, more little arguments that end in laughter, and more ordinary days where doing nothing together somehow feels like everything.",
    "I can't promise that every day will be perfect, or that I'll always have all the time in the world. But I want to keep making time for you, keep learning how to love you better, and keep creating a story that both of us are happy to be part of.",
    "Thank you for being you. Thank you for the memories we've already made and for the beautiful possibilities that are still waiting for us.",
    "If I had to start this whole story again, I'd still want it to be with you.",
  ],
  openMs: 1400,
} as const;

export const HIDDEN_NOTES: HiddenNote[] = [
  {
    id: "note-1",
    title: "Hidden Message 1",
    body: "If you can find me then you must know how much I am missing you and eager to meet you.",
  },
  {
    id: "note-2",
    title: "Hidden Message 2",
    body: "You are the person that make my life fill of joy. I am really happy when around you.",
  },
  {
    id: "note-3",
    title: "Hidden Message 3",
    body: "I can see the love even when you fight me, but I still enjoy fighting you and loving you.",
  },
  {
    id: "note-4",
    title: "Hidden Message 4",
    body: "I will always hold your hand in darkness when ever you like afraid or lonely.",
  },
  {
    id: "note-5",
    title: "Hidden Message 5",
    body: "You are more braver than you think you are. My cute little fighting machine, I love you.",
  },
  {
    id: "note-6",
    title: "Hidden Message 6",
    body: "Always remember, You complete me, without you I strength become half. So never leave my side.",
  },
  {
    id: "note-7",
    title: "Hidden Message 7",
    body: "I can't wait to finally announce the World the you are reserved only for mine.",
  },
];

export const ENDING = {
  photo: CHAPTER_SEVEN.photo,
  scroll: CHAPTER_SEVEN.paragraphs.join("\n\n"),
  placeholder: "ENDING_SCROLL",
  voice: CHAPTER_SEVEN.voiceSrc,
};

export const AUDIO = {
  music: "/audio/infinity.wav",
} as const;

export function isRoundId(value: number): value is RoundId {
  return Number.isInteger(value) && value >= 1 && value <= 7;
}

export function getRound(id: RoundId): RoundContent {
  const round = ROUNDS.find((item) => item.id === id);
  if (!round) {
    throw new Error(`Unknown round: ${id}`);
  }
  return round;
}

export function getHiddenNote(id: string): HiddenNote | undefined {
  return HIDDEN_NOTES.find((note) => note.id === id);
}
