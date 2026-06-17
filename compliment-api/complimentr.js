/**
Generate random compliment
vanilla js version of complimentr
credit to:- https://github.com/grantcodes/complimenter
*/

const finalTemplates = [
  function () {
    return "you are " + getDescriptor();
  },
  function () {
    return "you have " + getAbstractProperty();
  },
];

const templates = [
  function () {
    return "9 out of 10 doctors say " + getFinalTemplate();
  },
  function () {
    return "i can tell " + getFinalTemplate();
  },
  function () {
    return "i can't believe " + getFinalTemplate();
  },
  function () {
    return "i must say: " + getFinalTemplate();
  },
  function () {
    return "i reckon " + getFinalTemplate();
  },
  function () {
    return "i think " + getFinalTemplate();
  },
  function () {
    return "i've always thought " + getFinalTemplate();
  },
  function () {
    return "i've heard " + getFinalTemplate();
  },
  function () {
    return "it's true, " + getFinalTemplate();
  },
  function () {
    return "people say " + getFinalTemplate();
  },
  function () {
    return "they say " + getFinalTemplate();
  },
].concat(finalTemplates);

const abstractProperties = [
  function () {
    return [
      makeSingularForm(getDescriptor()),
      getTangibleSingularProperty(),
    ].join(" ");
  },
  function () {
    return [getDescriptor(), getTangibleMultipleProperty()].join(" ");
  },
];

const tangibleSingularProperties = [
  "ass",
  "belly button",
  "booty",
  "bottom lip",
  "brain",
  "bum",
  "butt",
  "chin",
  "demeanour",
  "face",
  "fashion sense",
  "forehead",
  "heart",
  "index finger",
  "keister",
  "laugh",
  "left foot",
  "left hand",
  "little toe",
  "mind",
  "mouth",
  "neck",
  "outlook on life",
  "posterior",
  "radiance",
  "right foot",
  "right hand",
  "smile",
  "soul",
  "thumb",
  "tongue",
  "tush",
  "tushie",
  "vibe",
  "voice",
  "way of thinking",
  "work ethic",
];

const tangibleMultipleProperties = [
  "ankles",
  "buttocks",
  "calves",
  "clothes",
  "ears",
  "elbows",
  "eyebrows",
  "eyelashes",
  "eyes",
  "facial hair",
  "feet",
  "fingernails",
  "fingers",
  "forearms",
  "hair",
  "hands",
  "hips",
  "ideas",
  "knees",
  "legs",
  "muscles",
  "skills",
  "skin",
  "strengths",
  "teeth",
  "thighs",
  "thighs",
  "thoughts",
  "toenails",
  "toes",
  "wrists",
];

const adjectives = [
  "adorable",
  "alluring",
  "amazeballs",
  "amazing",
  "angelic",
  "astonishing",
  "astounding",
  "attractive",
  "awe-inspiring",
  "awesome",
  "beautiful",
  "beguiling",
  "bewildering",
  "bewitching",
  "breathtaking",
  "charming",
  "comely",
  "crazy",
  "cute",
  "dazzling",
  "delightful",
  "divine",
  "dreamy",
  "exquisite",
  "extraordinary",
  "fantastic",
  "glamorous",
  "gorgeous",
  "great",
  "handsome",
  "heavenly",
  "hot",
  "impressive",
  "incredible",
  "insane",
  "irresistible",
  "lovely",
  "magnificent",
  "majestic",
  "marvellous",
  "marvelous",
  "mind-blowing",
  "mind-boggling",
  "nice",
  "perfect",
  "phenomenal",
  "pleasing",
  "preposterous",
  "pretty",
  "radiant",
  "ravishing",
  "remarkable",
  "sensational",
  "smashing",
  "spectacular",
  "splendid",
  "stunning",
  "stupefying",
  "stupendous",
  "sublime",
  "superb",
  "supercalifragilisticexpialidocious",
  "sweet",
  "tasty",
  "terrific",
  "tremendous",
  "unbelievable",
  "useful",
  "wonderful",
  "wowzers",
];

const adverbs = [
  "absolutely",
  "awfully",
  "bloody",
  "completely",
  "decidedly",
  "deeply",
  "devilishly",
  "distinctly",
  "entirely",
  "especially",
  "ever so",
  "exceedingly",
  "exceptionally",
  "extraordinarily",
  "extremely",
  "fairly",
  "frightfully",
  "highly",
  "hugely",
  "immensely",
  "incredibly",
  "inordinately",
  "insanely",
  "intensely",
  "mightily",
  "oh-so",
  "outstandingly",
  "particularly",
  "perfectly",
  "positively",
  "practically",
  "pretty",
  "purely",
  "quite",
  "radiantly",
  "rather",
  "really",
  "remarkably",
  "seriously",
  "simply",
  "so",
  "somewhat",
  "sort of",
  "supremely",
  "terribly",
  "thoroughly",
  "totally",
  "totes",
  "tremendously",
  "truly",
  "unusually",
  "utterly",
  "very",
  "virtually",
];

const makeSingularForm = (text) => {
  if (text.match(/^[aeiou]/i)) {
    return "an " + text;
  } else {
    return "a " + text;
  }
};

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getFinalTemplate = () => randomItem(finalTemplates)();

const getAbstractProperty = () => randomItem(abstractProperties)();

const getTangibleSingularProperty = () =>
  randomItem(tangibleSingularProperties);

const getTangibleMultipleProperty = () =>
  randomItem(tangibleMultipleProperties);

const getAdjective = () => randomItem(adjectives);

const getAdverb = () => randomItem(adverbs);

const getDescriptor = () => [getAdverb(), getAdjective()].join(" ");

function makeCompliment() {
  return randomItem(templates)();
}

module.exports = makeCompliment;
