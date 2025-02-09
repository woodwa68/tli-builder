import { Revenue } from './definitions';

const REGEXES = [
  /(?:Converts\s(\d{1,3})%\sof\s([\w\s]+)\sDamage\sto\s([\w\s]+)\sDamage)/g,
  /([+-]?\d+(\.\d+)?%?)\s*([^\n]+)/g,
  /(^[A-Za-z\s]*)(\s*\+(\d+))/g,
]


import gom from "@/public/God_of_Might/God_of_Might.json";
import gow from "@/public/God_of_War/God_of_War.json";
import tb from "@/public/The_Brave/The_Brave.json";
import mm from "public/Marksman/Marksman.json";
import mag from "public/Magister/Magister.json";
import sd from "public/Shadowdancer/Shadowdancer.json";
import sm from "public/Shadowmaster/Shadowmaster.json";
import mach from "public/Machinist/Machinist.json";
import goh from "public/Goddess_of_Hunting/Goddess_of_Hunting.json";
import god from "public/Goddess_of_Deception/Goddess_of_Deception.json";
import onsl from "public/Onslaughter/Onslaughter.json";
import br from "public/Bladerunner/Bladerunner.json";
import arcan from "public/Arcanist/Arcanist.json";
import ronin from "public/Ronin/Ronin.json";
import psy from "public/Psychic/Psychic.json";
import steel from "public/Steel_Vanguard/Steel_Vanguard.json";
import gok from "public/Goddess_of_Knowledge/Goddess_of_Knowledge.json";
import goma from "public/God_of_Machines/God_of_Machines.json";
import warl from "public/Warlord/Warlord.json";
import druid from "public/Druid/Druid.json";
import ele from "public/Elementalist/Elementalist.json";
import rang from "public/Ranger/Ranger.json";
import warlock from "public/Warlock/Warlock.json";
import alch from "public/Alchemist/Alchemist.json";

import skillData from 'public/SkillData.json'
const skillNames = Object.keys(skillData);

export const isMobile = window.matchMedia("(max-width: 768px)").matches;

export { skillData, skillNames }
type SkillTreeData = typeof gom; // Assume all trees follow the same structure as `gom`
const trees: Record<string, SkillTreeData> = {
  God_of_Might: gom,
  God_of_War: gow,
  The_Brave: tb,
  Marksman: mm,
  Magister: mag,
  Shadowdancer: sd,
  Shadowmaster: sm,
  Machinist: mach,
  Goddess_of_Hunting: goh,
  Goddess_of_Deception: god,
  Onslaughter: onsl,
  Bladerunner: br,
  Arcanist: arcan,
  Ronin: ronin,
  Psychic: psy,
  Steel_Vanguard: steel,
  God_of_Machines: goma,
  Goddess_of_Knowledge: gok,
  Warlord: warl,
  Druid: druid,
  Elementalist: ele,
  Ranger: rang,
  Warlock: warlock,
  Alchemist: alch,
};

const God_Affiliation: Record<string, string[]> = {}
Object.keys(trees).forEach((t) => {
  let parent = 'God_of_Might'
  if (t === parent ||
    t === 'The_Brave' ||
    t === 'Onslaughter' ||
    t === 'Warlord'
  ) {
    God_Affiliation[parent] ? null : God_Affiliation[parent] = [];
    God_Affiliation[parent] = [...God_Affiliation[parent], t]
  }

  parent = 'Goddess_of_Hunting'
  if (t === parent ||
    t === 'Marksman' ||
    t === 'Bladerunner' ||
    t === 'Druid'
  ) {
    God_Affiliation[parent] ? null : God_Affiliation[parent] = [];
    God_Affiliation[parent] = [...God_Affiliation[parent], t]
  }

  parent = 'Goddess_of_Knowledge'
  if (t === parent ||
    t === 'Magister' ||
    t === 'Arcanist' ||
    t === 'Elementalist'
  ) {
    God_Affiliation[parent] ? null : God_Affiliation[parent] = [];
    God_Affiliation[parent] = [...God_Affiliation[parent], t]
  }

  parent = 'God_of_War'
  if (t === parent ||
    t === 'Shadowdancer' ||
    t === 'Ronin' ||
    t === 'Ranger'
  ) {
    God_Affiliation[parent] ? null : God_Affiliation[parent] = [];
    God_Affiliation[parent] = [...God_Affiliation[parent], t]
  }

  parent = 'Goddess_of_Deception'
  if (t === parent ||
    t === 'Shadowmaster' ||
    t === 'Psychic' ||
    t === 'Warlock'
  ) {
    God_Affiliation[parent] ? null : God_Affiliation[parent] = [];
    God_Affiliation[parent] = [...God_Affiliation[parent], t]
  }

  parent = 'God_of_Machines'
  if (t === parent ||
    t === 'Machinist' ||
    t === 'Steel_Vanguard' ||
    t === 'Alchemist'
  ) {
    God_Affiliation[parent] ? null : God_Affiliation[parent] = [];
    God_Affiliation[parent] = [...God_Affiliation[parent], t]
  }


})
export { God_Affiliation };

const God_Affixes: Record<string, Record<string, any>> = {}
const Affix_Data: Record<string, any> = {}
Object.keys(God_Affiliation).forEach((god) => {
  God_Affixes[god] = {}
  God_Affiliation[god].forEach((subgod) =>
    trees[subgod].forEach((node) => {
      node.tooltip.split('\n').map((segment) => {
        const data = parseData(segment)

        God_Affixes[god] = { ...God_Affixes[god], [node.tooltip]: data }
        Affix_Data[node.tooltip] = data
      })
    })
  )
})

export { God_Affixes, Affix_Data };



export function parseData(entry) {
  // Remove HTML tags
  let cleanEntry = entry.replace(/<\/?[^>]+(>|$)/g, '').trim();
  cleanEntry = cleanEntry.split("Talent").pop(-1)
  // Match all attribute-value pairs, including negatives
  let matches = null
  let regexIndex = null;

  for (let j = 0; j < REGEXES.length; j++) {
    matches = cleanEntry.match(REGEXES[j])
    if (matches) { regexIndex = j; break; }
  }

  /* let weirdFlag = false;
  if (!matches) {
    weirdFlag = true;
    matches = cleanEntry.match(/(^[A-Za-z\s]*)(\s*\+(\d+))/g)
  } */
  // Transform matches into an array of objects
  return matches
    ? matches.map((match) => {
      let value: string, attribute: string;
      // Extract the value and attribute from the match
      const arr = match.match(REGEXES[regexIndex].source);
      value = arr[regexIndex === 2 ? 3 : 1]
      attribute = arr[regexIndex === 2 ? 1 : 3]

      if (!value) debugger;

      // Remove the percentage sign if present and parse the number
      const parsedValue = parseFloat(value.replace('%', ''));

      // Clean up the attribute name (remove leading/trailing spaces and + or -)
      const cleanAttribute = attribute
        .replace(/^[+-]/, '') // Remove leading + or -
        .trim();

      return { [cleanAttribute]: parsedValue };
    })
    : [];
}
export const DPS_RESERVED_CATEGORIES =
{
  'attack/cast speed': /(^attack and cast speed)|(attack speed)/,
  'additional damage': /(additional)/,
  'converts': /(converts.*)/,
  'critical strike damage': /(critical strike damage)/,
  'critical strike rating': /(critical strike rating)/,
  'fervor effect': /(fervor effect)/,
  'skill levels': /level/,
  'multistrike': /multistrike/,
  'double damage': /double/,
  'block': /block/,
  'numbed': /(numbed)|(Numbed)/,
  'per': /per/,
  'shadow quantity': /(shadow quantity)/,


  ///elemental/,
  // /trigger|triggered/,
  'blessings': /blessing/,
  'increased damage': /damage/,
}

export function determineBucket(item, dps) {
  const categories = [...Object.keys(DPS_RESERVED_CATEGORIES) as Array<keyof typeof DPS_RESERVED_CATEGORIES>, dps.skill['Stat']];
  for (let i = 0; i < categories.length; i++) {
    const regex = DPS_RESERVED_CATEGORIES[categories[i]] ? DPS_RESERVED_CATEGORIES[categories[i]] : new RegExp(dps.skill['Stat'].toLowerCase());
    const match = regex.exec(item.toLowerCase()); // Use exec to get match details
    if (match) {
      for (let j = 0; j < match.length; j++) {
        if (match[j]) {
          return determineIfApplicable(item, match[j], dps, categories[i])

          //return { word: item, matchedGroup: match[j], regexIndex: i }
        }
      }
    }
  }
  return null

}

export const determineIfApplicable = (item: string, bucketStringMatch, dps, category) => {
  const copyTags = [...dps.skill['Tags'], dps.skill["Stat"], bucketStringMatch]
  for (let i = 0; i < copyTags.length; i++) {
    const regex = new RegExp(copyTags[i].toLowerCase());
    const match = regex.exec(item.toLowerCase()); // Use exec to get match details
    if (match) {
      for (let j = 0; j < match.length; j++) {
        if (match[j]) {

          if (item.toLowerCase() === bucketStringMatch || match[j] !== bucketStringMatch)
            return { word: item, matchedGroup: match[j], regexIndex: i, category: item.includes('additional') ? item : category }
        }
      }
    }
  }
  return null
}

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
