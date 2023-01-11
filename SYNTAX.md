# TemPaste Formatting Guide

Adapted from the [PokePaste formatting howto](https://pokepast.es/syntax.html)

A paste can contain any number of tems (typically 8), separated by one or more blank lines. A tem is represented by a block of text like this one:

```
Pigepic @ Fat Burner
Trait: Fainted Curse
Level: 100
TVs: 499 HP / 497 SPD / 3 DEF
- Bamboozle
- Divine Inspiration
- Wind Burst
- Stone Wall
```

Let's break this down line-by-line.

---

The first line is both the most important, and the most complex. For starters, it includes the tem's name:

```
Pigepic
```

This is a perfectly valid first line - it would be a Pigepic with no item, no nickname, and unspecified gender. We can add the gear using an @ sign:

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

Next, we can specify stats - Trait, TVs, SVs and if it is a luma.

TVs and SVs both take the same format:

```
TVs: X HP / X STA / X SPD / X ATK / X DEF / X SPATK / X SPDEF
SVs: X HP / X STA / X SPD / X ATK / X DEF / X SPATK / X SPDEF
```

You don't need to specify every field - unspecified TVs are assumed to be 0, and unspecified SVs are assumed to be 50. Many sets don't have an SVs line at all, because perfect SVs are OK most of the time.

The rest of the stats lines are pretty straightforward:

```
Luma: Yes / No
Trait: XXXXXXXX
Level: 1-100
```

Again, all of these lines are optional:

Luma is assumed to be No
Some tems only have one Trait so no need to specify
Level is often irrelevant and generally assumed to be 100

---

Finally, up to 4 moveslots are specified. They look like this:

```
- Divine Inspiration
```

The space between the hyphen and the move is optional.

Sometimes there is more than one option for a moveslot. Some tools will only accept the first movewill only highlight the first move, but the convention is to write it like this:

```
- Wind Burst / Chain Heal
```
