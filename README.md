# TemPaste Parser

A simple Typescript syntax parser for plaintext formatted Temtem sets.

The goal of the parser is to make it easier for anyone to use Temtem teams written in text in their own projects.

## Usage

To use it, first install the parser:

```
npm install tempaste-parser
```

There are three functions you may wish to import:

```
import { parsePaste, parsePasteTems, parseTem } from 'tempaste-parser'
```

These three functions all take a string as input.

- `parseTem` will parse a single Temtem set. If the input string isn't a valid Temtem set, it will instead return a `notes` object. If the string is empty or null then it will return null.
- `parsePaste` will parse a string into an array of however many Temtem sets or notes objects it finds.
- `parsePasteTems` is the same as `parsePaste` but will ONLY return valid Temtem sets.

For most use cases the one you will probably want to use is `parsePasteTems`.

To give you maximum flexibility, the parser has no built in limit on the length of the input string it will try and parse, and it does not do any sanitization of it's output. You should take precautions if you're parsing text from unknown sources.

## The TemPaste Syntax

The TemPaste syntax is a simple, human readable plaintext format for writing a Temtem set. It is a direct equivalent of the [PokePaste syntax](https://github.com/felixphew/pokepaste/blob/v3/syntax.go) for Pokémon.

An example Temtem set looks like:

```
Pigepic @ Fat Burner
Trait: Fainted Curse
Level: 100
TVs: 499 HP / 497 SPD / 3 DEF
- Bamboozle
- Divine Inspiration
- Wind Burst
- Stone Wall / Chain Heal
A standard Pigepic set.
```

A paste is a collection of sets, each separated by one or more newlines. Additional notes describing the team can also be included, again separated by one or more newlines from each Tem set.

[Read a full guide to the TemPaste syntax.](https://github.com/ahejackson/tempaste-parser/blob/main/SYNTAX.md)

## Output

The parsed output of the set above is:

```
  {
    "name": "Pigepic",
    "gear": "Fat Burner",
    "trait": "Fainted Curse",
    "level": 100,
    "tvs": {
      "hp": 499,
      "spe": 497,
      "def": 3
    },
    "techniques": [
      {
        "main": "Bamboozle"
      },
      {
        "main": "Divine Inspiration"
      },
      {
        "main": "Wind Burst"
      },
      {
        "main": "Stone Wall",
        "alternatives": [
          "Chain Heal",
        ]
      }
    ],
    "notes": [
      "A standard Pigepic set."
    ]
  }
```

The only required property for the output object is `name`. Every other property may or may not exist.

```
Pigepic

Momo
```

Would be parsed as two valid Temtem.

The parser is a syntax parser - it checks that input follows the rules for what a Temtem set should look like. It does not validate the input - it does not check that the Temtem can have the traits specified, learn the techniques they are given (or even that the Temtem, traits and techniques exist).

The parser strictly enforces the order of header, attribute, technique and notes blocks for each Temtem set.

By default, the parser does not throw out any input data. Anything it doesn't recognise as a valid Temtem set will be interpreted as notes. If an entire section of input (separated by newlines) is not parsed as a valid Temtem set it will be returned as a `notes` object:

```
  {
    "notes": []
  }
```

When parsing a Temtem, the standard attributes listed on the syntax page ('nickname', 'gear', 'trait', 'luma', 'level', 'tvs' and 'svs') are parsed into corresponding properties of the Temtem object. The parser does not fill in default values for attributes that are not specified. Any unrecognised attribute is placed in an `attrs` dictionary on the Temtem object.

Each technique line is parsed into its own object. The technique object will always have a `main` property with the name of the technique (eg. "Divine Inspiration"). If alternative options for the technique were specified (eg. 'Divine Inspiration / Chain Heal'), then the alternatives will be parsed into an `alternatives` array on the technique object.

## Running the demo

To test the TemPaste parser locally, clone the repository and install the dependencies, then run:

```
npm run dev
```

This will open up a demo page where you can type Temtem sets and see the output.

## Credits

The syntax parsing is adapted from the excellent [PokePastes](https://github.com/felixphew/pokepaste/).

This repository was inspired by the efforts of others, including TemTeam, Pokémon Showdown, Shoddy Battle, Smogon, Pikalytics and many many more.
