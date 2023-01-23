# TemPaste Parser

A simple Typescript parser for plaintext formatted Temtem sets.

The parser is a syntax parser, it does not validate the Temtem - it does not check that the Temtem can have the traits specified, learn the techniques they are given (or even that the Temtem, traits and techniques actually exist). This is to allow for maximum flexibility.

## The TemPaste Syntax

The TemPaste syntax is a simple, human readable plaintext format for writing a Temtem set. It is a direct equavlent of the [PokePaste syntax](https://github.com/felixphew/pokepaste/blob/v3/syntax.go) for Pokémon.

An example Temtem set looks like:

```
Pigepic @ Fat Burner
Trait: Fainted Curse
Level: 100
TVs: 499 HP / 497 SPD / 3 DEF
- Bamboozle
- Divine Inspiration
- Wind Burst
- Stone Wall
A standard Pigepic set.
```

[A full guide to the TemPaste syntax.](https://github.com/ahejackson/tempaste-parser/blob/main/SYNTAX.md)

## Output

The output of the set above would be:

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
        "main": "Stone Wall"
      }
    ],
    "notes": [
      "A standard Pigepic set."
    ]
  }
```

The parser emphasises reconstructability.

But it might change the order.

Enforces the order of header, attribute, technique and notes blocks.

# Usage

The goal of the parser is to make it easier to use Temtem teams written in text in your own projects. To use it, first install the parser:

```
npm install tempaste-parser
```

Then in your code import:

```
import { parsePaste, parseTem } from 'tempaste-parser'
```

These two functions both take a string.

`parsePaste` will parse a string into an arry of however many Temtem sets it finds. `parseTem` will parse a single Temtem set.

## Local Demo

To test the TemPaste parser locally, clone the repository and install the dependencies, then run:

```
npm run dev
```

This will open up a demo page where you can type Temtem sets and see the output.

## Credits

The syntax parsing is adapted from the excellent [PokePastes](https://github.com/felixphew/pokepaste/).

This repository was inspired by the efforts of others, including TemTeam, Pokémon Showdown, Shoddy Battle, Smogon, Pikalytics and many many more.
