# TemPaste Formatting Guide

Adapted from the [PokePaste formatting howto](https://pokepast.es/syntax.html)

A paste can contain any number of Tems (typically 8), separated by one or more blank lines. A Tem is represented by a block of text like this one:

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

Each Tem is represented by four blocks of data:

1. The header line
2. The attributes
3. The techniques
4. Notes

Only the header line is requred.

Let's break this down line-by-line.

---

## The Header

The first line is both the most important, and the most complex. For starters, it includes the Tem's name:

```
Pigepic
```

This is a perfectly valid first line - it would be a Pigepic holding no gear, with no nickname, and no specified gender. We can add the gear using an @ sign:

```
Pigepic @ Fat Burner
```

So far, this is pretty generic. What if we want to give it a nickname like one well known example?

```
Gros Porc (Pigepic) @ Fat Burner
```

The nickname goes first, followed by the actual name in brackets. Pretty straightforward.

Finally, let's suppose we want our flying pig to be female:

```
Gros Porc (Pigepic) (F) @ Fat Burner
```

You can mix and match any combination of these - a nickname and no gear is fine, as is a gender with no nickname or gear.

---

## The Attributes Block

After the header line, we have a block of lines that tell us the Tem's other attributes.

```
Attribute: Value
```

There are 5 standard attributes: the trait, TVs, SVs, level, and if the Tem is a Luma.

The attribute lines can be written in any order.

TVs and SVs both take the same format:

```
TVs: X HP / X STA / X SPD / X ATK / X DEF / X SPATK / X SPDEF
SVs: X HP / X STA / X SPD / X ATK / X DEF / X SPATK / X SPDEF
```

You don't need to specify every field:

- unspecified TVs are assumed to be 0
- unspecified SVs are assumed to be 50

So a Nidrasil that is minimising its SPATK to do less damage with Spores might have TV and SV lines like:

```
TVs: 500 HP / 64 STA / 432 SPDEF
SVs: 1 SPATK
```

Many sets don't have an SVs line at all, because perfect SVs are OK most of the time.

The rest of the standard attribute lines are pretty straightforward:

```
Luma: Yes or No
Trait: XXXXX
Level: 1 - 100
```

Again, all of these lines are optional:

- Luma is assumed to be No
- Some tems only have one Trait so there is no need to specify
- Level is generally assumed to be 100

You can include other arbitrary attribute lines, but tools might ignore them.

---

## The Techniques Block

After the attributes block, up to 4 techniques are specified. They look like this:

```
- Divine Inspiration
```

The space between the hyphen and the move is optional.

Sometimes there is more than one option for a technique slot. The convention is to write all the options like this:

```
- Wind Burst / Chain Heal
```

Tools may only accept the first technique.

---

## The Notes Block

Finally, you can include some notes giving more information about the Tem. Any text immediately following the final technique will count as notes about the set.

```
Pigepic
- Divine Inspiration
This Pigepic set only has one technique.
```

It is important that there are no blank lines - that marks the start of another Tem.

```
Pigepic
- Divine Inspiration

These would not count as valid notes.
```
