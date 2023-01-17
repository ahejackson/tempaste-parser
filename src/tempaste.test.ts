import {
  parsePaste,
  parseTem,
  parseTemHeader,
  parseTemStats,
} from "./tempaste";
import { describe, expect, it } from "vitest";

describe("parsePaste", () => {
  it("Handles both windows and unix newlines", () => {
    expect(parsePaste("A\n\nB\n\nC").length).toEqual(
      parsePaste("A\r\n\r\nB\r\n\r\nC").length
    );
  });
});

const testFullExample = `Gros Porc (Pigepic) (F) @ Fat Burner
Trait: Fainted Curse
Luma: Yes
Level: 100
SVs: 50 HP / 50 STA / 50 SPD / 50 ATK / 50 DEF / 50 SPATK / 50 SPDEF
TVs: 499 HP / 497 SPD / 3 DEF
- Bamboozle
- Divine Inspiration
- Wind Burst
- Stone Wall
A full example Pigepic set.
With two lines of notes.`;

const testTechniqueLimit = `Pigepic
- Tecnique A
- Tecnique B
- Tecnique C
- Tecnique D
- Tecnique E`;

const testArbitraryAttr = `Pigepic
Arbitrary: Value`;

const testUnicodeTechNames = `Pigepic
- Quetza-leño`;

const testNotesBlock = `Pigepic
This set is all notes
And more notes`;

const testTecniquesBlockStart = `Pigepic
- Move A
Invalid: Attribute`;

describe("parseTem", () => {
  it("Parses an empty string as null", () => {
    expect(parseTem("")).toBeNull();
  });

  it("Accepts no more than 4 moves", () => {
    expect(parseTem(testTechniqueLimit)?.techniques?.length).toEqual(4);
  });

  it("Parses unknown attributes into the attrs array", () => {
    expect(parseTem(testArbitraryAttr)?.attrs).toMatchInlineSnapshot(`
      {
        "Arbitrary": "Value"
      }
    `);
  });

  it("Allows unicode characters in move names", () => {
    expect(parseTem(testUnicodeTechNames)?.techniques).toEqual(["Quetza-leño"]);
  });

  it("Recognises notes blocks", () => {
    expect(parseTem(testNotesBlock)?.notes).toMatchInlineSnapshot(`
      [
        "This set is all notes",
        "And more notes",
      ]
    `);
  });

  it("Doesn't recognise attributes after the techniques block has begun", () => {
    expect(parseTem(testTecniquesBlockStart)).toMatchInlineSnapshot(`
      {
        "name": "Pigepic",
        "notes": [
          "Invalid: Attribute",
        ],
        "techniques": [
          "Move A",
        ],
      }
    `);
  });

  it("Parses a full example", () => {
    expect(parseTem(testFullExample)).toMatchInlineSnapshot(`
      {
        "gear": "Fat Burner",
        "gender": "Female",
        "level": 100,
        "luma": true,
        "name": "Pigepic",
        "nickname": "Gros Porc",
        "notes": [
          "A full example Pigepic set.",
          "With two lines of notes.",
        ],
        "svs": {
          "atk": 50,
          "def": 50,
          "hp": 50,
          "spatk": 50,
          "spdef": 50,
          "spe": 50,
          "sta": 50,
        },
        "techniques": [
          "Bamboozle",
          "Divine Inspiration",
          "Wind Burst",
          "Stone Wall",
        ],
        "trait": "Fainted Curse",
        "tvs": {
          "def": 3,
          "hp": 499,
          "spe": 497,
        },
      }
    `);
  });
});

describe("parseTemHeader", () => {
  it("Parses just Tem name", () => {
    expect(parseTemHeader("Pigepic")).toMatchInlineSnapshot(`
      {
        "name": "Pigepic",
      }
    `);
  });

  it("Parses Tem name and gender", () => {
    expect(parseTemHeader("Pigepic (F)")).toMatchInlineSnapshot(`
      {
        "gender": "Female",
        "name": "Pigepic",
      }
    `);
  });

  it("Parses Tem name and gear", () => {
    expect(parseTemHeader("Pigepic @ Fat Burner")).toMatchInlineSnapshot(`
      {
        "gear": "Fat Burner",
        "name": "Pigepic",
      }
    `);
  });

  it("Parses Tem name, gender and gear", () => {
    expect(parseTemHeader("Pigepic (M) @ Fat Burner")).toMatchInlineSnapshot(`
      {
        "gear": "Fat Burner",
        "gender": "Male",
        "name": "Pigepic",
      }
    `);
  });

  it("Parses Tem name and nickname", () => {
    expect(parseTemHeader("Gros Porc (Pigepic)")).toMatchInlineSnapshot(`
      {
        "name": "Pigepic",
        "nickname": "Gros Porc",
      }
    `);
  });

  it("Parses Tem name, nickname and gender", () => {
    expect(parseTemHeader("Gros Porc (Pigepic) (F)")).toMatchInlineSnapshot(`
      {
        "gender": "Female",
        "name": "Pigepic",
        "nickname": "Gros Porc",
      }
    `);
  });

  it("Parses Tem name, nickname and gear", () => {
    expect(parseTemHeader("Gros Porc (Pigepic) @ Fat Burner"))
      .toMatchInlineSnapshot(`
      {
        "gear": "Fat Burner",
        "name": "Pigepic",
        "nickname": "Gros Porc",
      }
    `);
  });

  it("Parses Tem name, nickname, gender and gear", () => {
    expect(parseTemHeader("Gros Porc (Pigepic) (F) @ Fat Burner"))
      .toMatchInlineSnapshot(`
      {
        "gear": "Fat Burner",
        "gender": "Female",
        "name": "Pigepic",
        "nickname": "Gros Porc",
      }
    `);
  });

  it("Allows '0' to start Tem names", () => {
    expect(parseTemHeader("0b1")?.name).toEqual("0b1");
  });
});

describe("parseTemStats", () => {
  it("Parses all stats", () => {
    expect(
      parseTemStats("1 HP / 2 STA / 3 SPD / 4 ATK / 5 DEF / 6 SPATK / 7 SPDEF")
    ).toMatchInlineSnapshot(`
      {
        "atk": 4,
        "def": 5,
        "hp": 1,
        "spatk": 6,
        "spdef": 7,
        "spe": 3,
        "sta": 2,
      }
    `);
  });

  it("Returns null when there is no match", () => {
    expect(parseTemStats("Invalid")).toBeNull();
  });
});
