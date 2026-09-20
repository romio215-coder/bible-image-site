export const topics = [
  {
    slug: "love",
    name: "사랑",
    refs: ["john/3/16", "1-corinthians/13/4", "1-john/4/8"],
  },
  { slug: "faith", name: "믿음", refs: ["hebrews/11/1", "romans/10/17"] },
  { slug: "hope", name: "소망", refs: ["romans/15/13", "jeremiah/29/11"] },
  {
    slug: "comfort",
    name: "위로",
    refs: ["isaiah/41/10", "2-corinthians/1/4"],
  },
  { slug: "worry", name: "걱정", refs: ["matthew/6/34", "1-peter/5/7"] },
  { slug: "anxiety", name: "불안", refs: ["philippians/4/6", "psalms/94/19"] },
  { slug: "fear", name: "두려움", refs: ["isaiah/41/10", "psalms/56/3"] },
  {
    slug: "prayer",
    name: "기도",
    refs: ["matthew/7/7", "1-thessalonians/5/17"],
  },
  {
    slug: "gratitude",
    name: "감사",
    refs: ["1-thessalonians/5/18", "psalms/100/4"],
  },
  { slug: "family", name: "가족", refs: ["joshua/24/15", "psalms/133/1"] },
  { slug: "marriage", name: "부부", refs: ["ephesians/5/25", "genesis/2/24"] },
  { slug: "children", name: "자녀", refs: ["proverbs/22/6", "psalms/127/3"] },
  { slug: "health", name: "건강", refs: ["3-john/1/2", "proverbs/17/22"] },
  { slug: "suffering", name: "고난", refs: ["romans/5/3", "psalms/34/18"] },
  {
    slug: "forgiveness",
    name: "용서",
    refs: ["ephesians/4/32", "colossians/3/13"],
  },
  { slug: "patience", name: "인내", refs: ["james/1/4", "galatians/6/9"] },
  { slug: "wisdom", name: "지혜", refs: ["james/1/5", "proverbs/3/5"] },
  { slug: "success", name: "성공", refs: ["proverbs/16/3", "joshua/1/8"] },
  { slug: "money", name: "돈", refs: ["1-timothy/6/10", "hebrews/13/5"] },
  { slug: "work", name: "직장", refs: ["colossians/3/23", "proverbs/16/3"] },
  { slug: "trials", name: "시험", refs: ["james/1/12", "1-corinthians/10/13"] },
  { slug: "death", name: "죽음", refs: ["john/11/25", "revelation/21/4"] },
  { slug: "restoration", name: "회복", refs: ["isaiah/40/31", "psalms/23/3"] },
  { slug: "peace", name: "평안", refs: ["john/14/27", "philippians/4/7"] },
];
export const dailyRefs = [...new Set(topics.flatMap((t) => t.refs))];
export function koreaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function dailyReference(date = koreaDate()) {
  const day = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86400000);
  return dailyRefs[
    ((day % dailyRefs.length) + dailyRefs.length) % dailyRefs.length
  ];
}
