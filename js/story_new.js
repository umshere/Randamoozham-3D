// New properly structured story.js
const storyEvents = [
  {
    title: "The Outsider's Birth",
    description:
      "Bhima, the second Pandava, born with immense strength but feeling like an outsider in his own family.",
    boardSetup: [
      { name: "Bhima", position: "d1" },
      { name: "Yudhishthira", position: "e1" },
      { name: "Arjuna", position: "f1" },
    ],
    specialActions: [],
    focus: "Bhima's sense of alienation begins",
    color: [100, 150, 200],
    intensity: 0.3,
  },
  {
    title: "Childhood Jealousy",
    description:
      "Young Bhima's growing resentment towards Arjuna, the favored archer, and his complex relationship with his brothers.",
    boardSetup: [
      { name: "Bhima", position: "d2" },
      { name: "Arjuna", position: "f3" },
      { name: "Yudhishthira", position: "e1" },
      { name: "Duryodhana", position: "e8" },
    ],
    specialActions: [],
    focus: "Sibling dynamics and early psychological wounds",
    color: [150, 100, 100],
    intensity: 0.5,
  },
  {
    title: "The Poison Incident",
    description:
      "Duryodhana's attempt to poison Bhima, revealing the deep-seated hatred and Bhima's first taste of mortality.",
    boardSetup: [
      { name: "Bhima", position: "e4" },
      { name: "Duryodhana", position: "e5" },
      { name: "Yudhishthira", position: "e1" },
      { name: "Arjuna", position: "f1" },
    ],
    specialActions: [
      { type: "attack", attacker: "Duryodhana", target: "Bhima" },
    ],
    focus: "First major conflict, survival instinct awakened",
    color: [80, 200, 80],
    intensity: 0.7,
  },
  {
    title: "Marriage to Hidimbi",
    description:
      "Bhima's encounter with Hidimbi in the forest, a relationship that brings him acceptance and understanding.",
    boardSetup: [
      { name: "Bhima", position: "c4" },
      { name: "Hidimbi", position: "c5" },
      { name: "Hidimba", position: "c6" },
    ],
    specialActions: [{ type: "capture", attacker: "Bhima", target: "Hidimba" }],
    focus: "First genuine love and acceptance",
    color: [200, 150, 100],
    intensity: 0.4,
  },
  {
    title: "Draupadi's Swayamvara",
    description:
      "The archery contest where Arjuna wins Draupadi, but all five brothers must share her - Bhima's complex emotions.",
    boardSetup: [
      { name: "Bhima", position: "d3" },
      { name: "Arjuna", position: "e4" },
      { name: "Draupadi", position: "e5" },
      { name: "Yudhishthira", position: "d1" },
    ],
    specialActions: [{ type: "alliance", pieces: ["Arjuna", "Draupadi"] }],
    focus: "Shared love, shared burden, continued alienation",
    color: [200, 100, 150],
    intensity: 0.6,
  },
  {
    title: "The Dice Game",
    description:
      "Witnessing Draupadi's humiliation while bound by dharma and family loyalty - Bhima's rage contained.",
    boardSetup: [
      { name: "Bhima", position: "a1" },
      { name: "Draupadi", position: "e4" },
      { name: "Yudhishthira", position: "e1" },
      { name: "Duryodhana", position: "e8" },
      { name: "Dushasana", position: "e5" },
      { name: "Shakuni", position: "d8" },
    ],
    specialActions: [
      { type: "humiliation", target: "Draupadi", attacker: "Dushasana" },
      { type: "immobilize", target: "Bhima" },
    ],
    focus: "Powerlessness despite physical strength",
    color: [200, 50, 50],
    intensity: 0.9,
  },
  {
    title: "Exile and Reflection",
    description:
      "Thirteen years in exile, Bhima's growing understanding of dharma, adharma, and his place in the cosmic order.",
    boardSetup: [
      { name: "Bhima", position: "h8" },
      { name: "Yudhishthira", position: "g8" },
      { name: "Arjuna", position: "f8" },
      { name: "Draupadi", position: "h7" },
    ],
    specialActions: [],
    focus: "Philosophical maturation and growing wisdom",
    color: [100, 200, 100],
    intensity: 0.4,
  },
  {
    title: "The Great War Begins",
    description:
      "Kurukshetra - the cosmic battlefield where Bhima's purpose crystallizes into dharmic violence.",
    boardSetup: [
      { name: "Bhima", position: "e2" },
      { name: "Duryodhana", position: "e7" },
      { name: "Krishna", position: "d1" },
      { name: "Arjuna", position: "f2" },
      { name: "Karna", position: "f7" },
      { name: "Dushasana", position: "d7" },
    ],
    specialActions: [{ type: "war_begins", all_pieces: true }],
    focus: "Dharmic violence and moral complexity",
    color: [255, 100, 0],
    intensity: 1.0,
  },
  {
    title: "Dushasana's End",
    description:
      "Bhima fulfills his terrible vow, drinking Dushasana's blood - the moment of vengeance and its hollow satisfaction.",
    boardSetup: [
      { name: "Bhima", position: "e4" },
      { name: "Dushasana", position: "e5" },
      { name: "Draupadi", position: "a1" },
    ],
    specialActions: [
      { type: "defeat", character: "Dushasana" },
      { type: "vow_fulfilled", character: "Bhima" },
    ],
    focus: "Vengeance and its psychological cost",
    color: [150, 0, 0],
    intensity: 0.8,
  },
  {
    title: "Victory's Burden",
    description:
      "After the war, Bhima contemplates the cost of victory - the survivors in a world of ghosts.",
    boardSetup: [
      { name: "Bhima", position: "e1" },
      { name: "Yudhishthira", position: "d1" },
      { name: "Arjuna", position: "f1" },
    ],
    specialActions: [{ type: "mourn", all_pieces: true }],
    focus: "Pyrrhic victory and existential questioning",
    color: [100, 100, 150],
    intensity: 0.3,
  },
  {
    title: "The Final Journey",
    description:
      "The last pilgrimage, where Bhima learns the ultimate lesson about attachment, duty, and transcendence.",
    boardSetup: [{ name: "Bhima", position: "e4" }],
    specialActions: [{ type: "transcendence", character: "Bhima" }],
    focus: "Wisdom, acceptance, and transcendence",
    color: [200, 200, 255],
    intensity: 0.2,
  },
];
