import { RE_HEAD, RE_TECH, RE_STAT } from "./regexps";
import type {
  ParsedTem,
  ParsedNotes,
  ParsedTemStats,
  ParsedTemTechnique,
} from "./types";

const MAX_TECHNIQUES = 4;

const STATE = {
  HEADER: "HEADER",
  ATTRIBUTES: "ATTRIBUTES",
  TECHNIQUES: "TECHNIQUES",
  NOTES: "NOTES",
} as const;

type State = typeof STATE[keyof typeof STATE];

// Parse a string into an array of Temtem sets or notes
export function parsePaste(paste: string): (ParsedTem | ParsedNotes)[] {
  // Split the paste into different tems
  // Sperated by a double newline, allowing for windows/linux line terminators
  let items = paste.split(/(?:\r?\n){2,}/);

  // Parse all tems, ignoring any null tems
  return items.map((item) => parseTem(item)).filter(isNotNull);
}

// Parse a string into Temtem sets only
export function parsePasteTems(paste: string): ParsedTem[] {
  return parsePaste(paste).filter(isParsedTem);
}

// Type gates
function isParsedTem(item: ParsedTem | ParsedNotes): item is ParsedTem {
  return (item as ParsedTem).name !== undefined;
}

function isNotNull(
  tem: ParsedTem | ParsedNotes | null
): tem is ParsedTem | ParsedNotes {
  return tem !== null;
}

// Parse a string into a Temtem set or notes
export function parseTem(set: string): ParsedTem | ParsedNotes | null {
  if (set.length === 0) return null;

  const lines = set.split(/\r?\n/);

  // 1. Parse the header
  let state: State = STATE.HEADER;

  const tem = parseTemHeader(lines[0]);

  // if the header was invalid, return these lines as a set of notes
  if (tem === null) {
    return {
      notes: lines,
    };
  }

  const techniques: ParsedTemTechnique[] = [];
  const notes: string[] = [];

  // 2. Loop the the remaining lines to parse the other blocks
  state = STATE.ATTRIBUTES;

  for (let i = 1; i < lines.length; i++) {
    if (state == STATE.ATTRIBUTES) {
      if (!parseTemAttributes(lines[i], tem)) {
        // if its not an attribute switch to the TECHNIQUES state
        state = STATE.TECHNIQUES;
      }
    }

    if (state == STATE.TECHNIQUES) {
      if (!parseTemTechnique(lines[i], techniques)) {
        // if its not a technique switch to the NOTES state
        state = STATE.NOTES;
      }
    }

    if (state == STATE.NOTES) {
      if (lines[i].length > 0) {
        notes.push(lines[i]);
      }
    }
  }

  // 6. Add the techniques (if there are any)
  if (techniques.length > 0) {
    tem.techniques = techniques;
  }

  // 7. Add the notes (if there are any)
  if (notes.length > 0) {
    tem.notes = notes;
  }

  return tem;
}

// Parse the header line
export function parseTemHeader(headerString: string): ParsedTem | null {
  // 1. Test the first line against the header Regex
  const m = headerString.match(RE_HEAD);

  // 2. If there are no matches then this is not a valid Temtem header
  if (m === null) {
    return null;
  }

  const tem: ParsedTem = {
    name: "",
  };

  // 3. Check if this is a tem with a nickname
  if (m[1] !== undefined) {
    tem.name = m[2];
    tem.nickname = m[1];
  } else {
    tem.name = m[3];
  }

  // 4. Check if the tem's gender is specified
  if (m[4] === "M") {
    tem.gender = "Male";
  } else if (m[4] === "F") {
    tem.gender = "Female";
  }

  // 5. Check if the tem has gear equipped
  if (m[5] !== undefined) {
    tem.gear = m[5];
  }

  return tem;
}

export function parseTemStats(str: string): ParsedTemStats | null {
  let m = str.match(RE_STAT);

  if (m === null) return null;

  const stats: ParsedTemStats = {};

  if (m[1] !== undefined) {
    stats.hp = parseInt(m[1]);
  }
  if (m[2] !== undefined) {
    stats.sta = parseInt(m[2]);
  }
  if (m[3] !== undefined) {
    stats.spe = parseInt(m[3]);
  }
  if (m[4] !== undefined) {
    stats.atk = parseInt(m[4]);
  }
  if (m[5] !== undefined) {
    stats.def = parseInt(m[5]);
  }
  if (m[6] !== undefined) {
    stats.spatk = parseInt(m[6]);
  }
  if (m[7] !== undefined) {
    stats.spdef = parseInt(m[7]);
  }

  return stats;
}

export function parseTemAttributes(line: string, tem: ParsedTem): boolean {
  let attribute = line.split(": ");

  if (attribute.length !== 2) return false;

  const key = attribute[0].trim();
  const value = attribute[1].trim();

  switch (key) {
    case "Trait":
      tem.trait = value;
      break;
    case "Luma":
      tem.luma = value === "Yes";
      break;
    case "Level":
      tem.level = parseInt(value);
      break;
    case "TVs":
      let tvs = parseTemStats(value);
      if (tvs != null) {
        tem.tvs = tvs;
      }
      break;
    case "SVs":
      let svs = parseTemStats(attribute[1].trim());
      if (svs != null) {
        tem.svs = svs;
      }
      break;
    default:
      // Add to the attributes map
      if (!tem.attrs) {
        tem.attrs = {};
      }
      tem.attrs[key] = value;
  }
  return true;
}

export function parseTemTechnique(
  line: string,
  techniques: ParsedTemTechnique[]
): boolean {
  if (techniques.length >= MAX_TECHNIQUES) return false;

  const m = line.match(RE_TECH);

  if (m === null) return false;

  const techNames = m[1].split(" / ").map((tstring) => tstring.trim());

  const parsedTech: ParsedTemTechnique = {
    main: techNames[0],
  };

  if (techNames.length > 1) {
    techNames.shift();
    parsedTech.alternatives = techNames;
  }

  techniques.push(parsedTech);
  return true;
}
