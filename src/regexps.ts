/*
 * This is mostly the same regular expression used for parsing pokepastes. It is simplified as no Temtem have spaces in their names, but a temtem's name is allowed to start with '0'
 * Gears are allowed to have the character '+' in them
 *
 * Capture groups:
 * 1: Nickname if present
 * 2: Temtem species if nicknamed
 * 3: Temtem species if no nickname
 * 4: Gender if provided
 * 5: Gear if provided
 */
export const RE_HEAD =
  /^(?:(.*) \(([0A-Z][a-z0-9]+(?:[-][A-Z][a-z]+)?)(?:\))|([0A-Z][a-z0-9]+(?:[-][A-Z][a-z]+)?))(?: \(([MF])\))?(?: @ ([A-Z][a-z0-9:'+]*(?:[- ][A-Z][a-z0-9:'+]*)*))? *$/;

/*
 * The regular expression for techniques is modifed to account for non-ascii characters in move names
 * It needs to be used with the unicode flag on
 * It has been tested on all English names
 *
 * Capture groups:
 * 1: All techniques listed
 * 2: The first technique listed
 *
 * In the most common scenario where just one technique is given, groups one and two will be the same
 */
export const RE_TECH =
  /^- (([\p{Lu}\d][\p{L}']*(?:[- ][\p{L}]+)*)(?: \/ [\p{Lu}\d][\p{L}']*(?:[- ][\p{L}]+)*)*) *$/u;

/*
 * Capture groups 1-7 are the matched stats:
 * 1: HP
 * 2: STA
 * 3: SPD
 * 4: ATK
 * 5: DEF
 * 6: SPATK
 * 7: SPDEF
 */
export const RE_STAT =
  /^(\d+ HP)?(?: \/ )?(\d+ STA)?(?: \/ )?(\d+ SPD)?(?: \/ )?(\d+ ATK)?(?: \/ )?(\d+ DEF)?(?: \/ )?(\d+ SPATK)?(?: \/ )?(\d+ SPDEF)?(?: *)$/;
