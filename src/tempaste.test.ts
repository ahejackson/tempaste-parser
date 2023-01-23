import {
  parsePaste,
  parsePasteTems,
  parseTem,
  parseTemAttributes,
  parseTemHeader,
  parseTemStats,
  parseTemTechnique,
} from "./tempaste";
import { describe, expect, it } from "vitest";
import { ParsedTem, ParsedTemTechnique } from "./types";

describe("parsePaste", () => {
  it("Handles both windows and unix newlines", () => {
    expect(parsePaste("A\n\nB\n\nC").length).toEqual(
      parsePaste("A\r\n\r\nB\r\n\r\nC").length
    );
  });
});

describe("parsePasteTems", () => {
  it("Filters only ParsedTem sets", () => {
    expect(parsePasteTems(`1. Note\n\nPigepic @ Fat Burner`).length).toEqual(1);
  });
});

const testFullExample = `Gros Porc (Pigepic) (F) @ Fat Burner
Trait: Fainted Curse
Luma: Yes
Level: 100
SVs: 41 HP / 42 STA / 43 SPD / 44 ATK / 45 DEF / 46 SPATK / 47 SPDEF
TVs: 499 HP / 497 SPD / 3 DEF
- Bamboozle
- Divine Inspiration
- Wind Burst / Chain Heal
- Stone Wall 
A full example Pigepic set.
With two lines of notes.`;

const testTechniquesBlock = `Pigepic
- Technique One
Invalid: Attribute`;

const testNotesBlock = `Pigepic
This set is all notes
- Invalid Technique`;

describe("parseTem", () => {
  it("Parses an empty string as null", () => {
    expect(parseTem("")).toBeNull();
  });

  it("Doesn't parse attributes after the techniques block has begun", () => {
    expect(parseTem(testTechniquesBlock)).toMatchInlineSnapshot(`
      {
        "name": "Pigepic",
        "notes": [
          "Invalid: Attribute",
        ],
        "techniques": [
          {
            "main": "Technique One",
          },
        ],
      }
    `);
  });

  it("Doesn't parse techniques after the notes block has begun", () => {
    expect(parseTem(testNotesBlock)).toMatchInlineSnapshot(`
      {
        "name": "Pigepic",
        "notes": [
          "This set is all notes",
          "- Invalid Technique",
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
          "atk": 44,
          "def": 45,
          "hp": 41,
          "spatk": 46,
          "spdef": 47,
          "spe": 43,
          "sta": 42,
        },
        "techniques": [
          {
            "main": "Bamboozle",
          },
          {
            "main": "Divine Inspiration",
          },
          {
            "alternatives": [
              "Chain Heal",
            ],
            "main": "Wind Burst",
          },
          {
            "main": "Stone Wall",
          },
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

describe("parseTemAttributes", () => {
  it("Returns false if there is no attribute", () => {
    expect(parseTemAttributes("Not an attribute", { name: "" })).toEqual(false);
  });

  it("Parses unknown attributes into the attrs array", () => {
    const tem: ParsedTem = { name: "" };
    parseTemAttributes("Arbitrary: Value", tem);
    expect(tem.attrs!).toMatchInlineSnapshot(`
      {
        "Arbitrary": "Value",
      }
    `);
  });
});

describe("parseTemTechnique", () => {
  it("Returns false if a line isn't a technique", () => {
    expect(parseTemTechnique("Not a move", [])).toEqual(false);
  });

  it("Recognises unicode characters in techniques", () => {
    const techs: ParsedTemTechnique[] = [];
    parseTemTechnique("- Quetza-leño", techs);
    expect(techs[0]!.main).toEqual("Quetza-leño");
  });

  it("Parses alternative technique options", () => {
    const techs: ParsedTemTechnique[] = [];
    parseTemTechnique("- Tech One / Tech Two / Tech Three", techs);
    expect(techs[0]!.alternatives!).toMatchInlineSnapshot(`
      [
        "Tech Two",
        "Tech Three",
      ]
    `);

    it("Parses no more than 4 techniques", () => {
      const techs: ParsedTemTechnique[] = [
        { main: "Technique One" },
        { main: "Technique Two" },
        { main: "Technique Three" },
        { main: "Technique Four" },
      ];

      parseTemTechnique("- Technique Five", techs);
      expect(techs).toEqual([
        { main: "Technique One" },
        { main: "Technique Two" },
        { main: "Technique Three" },
        { main: "Technique Four" },
      ]);
    });
  });
});
