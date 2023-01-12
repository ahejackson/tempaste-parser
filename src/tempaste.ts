import { RE_HEAD, RE_TECH, RE_STAT } from "./regexps";
import type { ParsedTem, ParsedTemStats } from "./types";

// Parse a string into an array of Temtem sets
export function parsePaste(paste: string): ParsedTem[] {
  // Split the paste into different tems
  // Sperated by a double newline, allowing for windows/linux line terminators
  let tems = paste.split(/(?:\r?\n){2,}/);

  // Parse all tems, ignoring any null tems
  return tems.map((tem) => parseTem(tem)).filter(isNotNullParsedTem);
}

// Typescript typegate
function isNotNullParsedTem(tem: ParsedTem | null): tem is ParsedTem {
  return tem !== null;
}

// Simple string sanitising
function sanitize(unsafe: string): string {
  if (unsafe == null) return "";

  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Parse a string into a Temtem set
export function parseTem(set: string): ParsedTem | null {
  if (set.length === 0) return null;

  const lines = set.split(/\r?\n/);

  // 1. Parse the header
  const tem = parseTemHeader(lines[0]);

  // if the header was invalid, return these lines as a set of notes
  if (tem === null) {
    return {
      notes: lines.map((line) => sanitize(line)),
    };
  }

  const techniques: string[] = [];
  const notes: string[] = [];

  let m: RegExpMatchArray | null;

  // 2. Loop through the other lines to parse the body
  for (let i = 1; i < lines.length; i++) {
    // 3. Check if the line matches a technique
    if ((m = lines[i].match(RE_TECH)) !== null) {
      techniques.push(sanitize(m[2]));
      continue;
    }

    // 4. Check if the line matches another attribute
    let attribute = lines[i].split(": ");

    if (attribute.length === 2) {
      if (attribute[0] === "Trait") {
        tem.trait = sanitize(attribute[1].trim());
      } else if (attribute[0] === "Luma") {
        tem.luma = attribute[1].trim() === "Yes";
      } else if (attribute[0] === "Level") {
        tem.level = parseInt(attribute[1]);
      } else if (attribute[0] === "TVs") {
        let tvs = parseTemStats(attribute[1].trim());
        if (tvs != null) {
          tem.tvs = tvs;
        }
      } else if (attribute[0] === "SVs") {
        let svs = parseTemStats(attribute[1].trim());
        if (svs != null) {
          tem.svs = svs;
        }
      } else {
        notes.push(sanitize(lines[i]));
      }
      continue;
    }

    // 5. Otherwise it's not a recognised type of line
    if (lines[i].length > 0) {
      notes.push(sanitize(lines[i]));
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

  // 2. If there are no matches then do something...
  if (m === null) {
    return null;
  }

  const tem: ParsedTem = {};

  // 3. Check if this is a tem with a nickname
  if (m[1] !== undefined) {
    tem.name = sanitize(m[2]);
    tem.nickname = sanitize(m[1]);
  } else {
    tem.name = sanitize(m[3]);
  }

  // 4. Check if the tem's gender is specified
  if (m[4] === "M") {
    tem.gender = "Male";
  } else if (m[4] === "F") {
    tem.gender = "Female";
  }

  // 5. Check if the tem has gear equipped
  if (m[5] !== undefined) {
    tem.gear = sanitize(m[5]);
  }

  return tem;
}

export function parseTemStats(statstr: string): ParsedTemStats | null {
  let m = statstr.match(RE_STAT);

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
