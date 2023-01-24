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
- Stone Wall / Chain Heal
A standard Pigepic set.
```

[A full guide to the TemPaste syntax.](https://github.com/ahejackson/tempaste-parser/blob/main/SYNTAX.md)

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

Anything not parsed as a valid Temtem

```
  {
    "notes": []
  }
```

The standard attributes listed on the syntax page are parsed into corresponding properties of the tem object. Any unrecognised attribute is parsed into an `attrs` dictionary on the tem object.

The parser emphasises reconstructability - by default it will not throw out input data and will instead interpret anything it doesn't recognise as 'notes' accompanying the Temtem sets.

It does strictly enforces the order of header, attribute, technique and notes blocks for each Temtem set.

# Usage

The goal of the parser is to make it easier to use Temtem teams written in text in your own projects. To use it, first install the parser:

```
npm install tempaste-parser
```

Depending on your use case, there are three functions of interest.

```
import { parsePaste, parsePasteTems, parseTem } from 'tempaste-parser'
```

These three functions both take a string.

`parseTem` will parse a single Temtem set. If the string isn't a valid Temtem set, it will return a `notes` object. If the string is empty it will return null.

`parsePaste` will parse a string into an array of however many Temtem sets or notes objects it finds.

`parsePasteTems` is the same as `parsePaste` but will ONLY return valid Temtem sets. For most use cases this is what you will want.

To give you maximum flexibility, the parser has no built in limit on the lenght of the input string it will try and parse and does not do any sanitization of it's output. You should take precautions if you run it on unknown text sources.

## Local Demo

To test the TemPaste parser locally, clone the repository and install the dependencies, then run:

```
npm run dev
```

This will open up a demo page where you can type Temtem sets and see the output.

## Credits

The syntax parsing is adapted from the excellent [PokePastes](https://github.com/felixphew/pokepaste/).

This repository was inspired by the efforts of others, including TemTeam, Pokémon Showdown, Shoddy Battle, Smogon, Pikalytics and many many more.
