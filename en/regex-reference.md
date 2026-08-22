---
title: Regex reference
description: Pattern syntax, replacement tokens, and practical examples for the regex replace transformation in DataSuite 2.
---

# Regex reference

The **regex replace** rule in [data transformation](./data-transformation.md) lets you search for patterns in text data and replace them. If you've never used regular expressions before, don't worry – this page covers the essentials and the most common use cases. For a deeper dive, [regexone.com](https://regexone.com/) is a good interactive tutorial.

## The regex editor

When you create a regex replace rule, the editor shows:

- **Search pattern** – the regular expression to match
- **Replacement text** – what to substitute in place of each match
- **Options** – global (replace all matches), case sensitive, multiline mode
- **Live preview** – shows the first matching value from your data with matches highlighted and capture groups in distinct colors

The preview updates as you type, so you can experiment safely before saving the rule.

## Pattern basics

| Pattern | Matches | Example match |
|---|---|---|
| `abc` | literal text "abc" | "`abc`def" |
| `.` | any single character | "`a`bc" |
| `\d` | any digit (0–9) | "age `4`2" |
| `\D` | any non-digit | "42`!`" |
| `\w` | any word character (letter, digit, underscore) | "`h`ello" |
| `\W` | any non-word character | "hello `!`" |
| `\s` | any whitespace (space, tab, newline) | "hello` `world" |
| `\S` | any non-whitespace | "`h`ello" |

### Quantifiers

| Quantifier | Meaning | Example |
|---|---|---|
| `*` | zero or more | `\d*` matches "", "5", "42", "123" |
| `+` | one or more | `\d+` matches "5", "42", "123" but not "" |
| `?` | zero or one (optional) | `colou?r` matches "color" and "colour" |
| `{3}` | exactly 3 | `\d{3}` matches "123" but not "12" |
| `{2,4}` | between 2 and 4 | `\d{2,4}` matches "12", "123", "1234" |

### Anchors

| Anchor | Meaning |
|---|---|
| `^` | start of string (or line, with multiline mode) |
| `$` | end of string (or line, with multiline mode) |

### Character classes

Square brackets define a set of characters to match:

| Class | Matches |
|---|---|
| `[abc]` | "a", "b", or "c" |
| `[a-z]` | any lowercase letter |
| `[A-Za-z]` | any letter |
| `[0-9]` | any digit (same as `\d`) |
| `[^abc]` | any character except "a", "b", or "c" |

### Groups and alternatives

| Syntax | Meaning |
|---|---|
| `(abc)` | capture group – matches "abc" and remembers it for replacement |
| `(?:abc)` | non-capturing group – groups without remembering |
| `a\|b` | alternation – matches "a" or "b" |

## Replacement text

The replacement string can reference captured groups:

| Token | Inserts |
|---|---|
| `$1` | first capture group |
| `$2` | second capture group |
| `$&` | the entire match |

## Options

- **Global** – replace all matches in each cell, not just the first. Usually you want this on.
- **Case sensitive** – when off, `hello` also matches "Hello", "HELLO", etc.
- **Multiline mode** – makes `^` and `$` match the start/end of each line within a cell, not just the start/end of the entire cell value.

## Practical examples

### Remove extra whitespace

Collapse multiple spaces into one and trim the result.

| | |
|---|---|
| **Pattern** | `\s+` |
| **Replacement** | ` ` (single space) |
| **Options** | global |
| **Before** | `"  John   Smith  "` |
| **After** | `" John Smith "` |

> **Tip:** to also trim leading and trailing spaces, add a second regex rule with the pattern `^\s+|\s+$` and an empty replacement (global mode). Or use a [formula](./formula-reference.md) with `trim(v1)`.

### Extract numbers from text

Pull the first number out of a mixed-text cell.

| | |
|---|---|
| **Pattern** | `(\d+)` |
| **Replacement** | `$1` |
| **Options** | not global (first match only) |
| **Before** | `"Age: 42 years"` |
| **After** | `"42"` |

For decimal numbers, use `(\d+\.?\d*)` instead.

### Standardize date formats

Convert "DD/MM/YYYY" to "YYYY-MM-DD".

| | |
|---|---|
| **Pattern** | `(\d{2})/(\d{2})/(\d{4})` |
| **Replacement** | `$3-$2-$1` |
| **Options** | global |
| **Before** | `"15/03/2024"` |
| **After** | `"2024-03-15"` |

The three capture groups `(\d{2})`, `(\d{2})`, `(\d{4})` grab day, month, and year. The replacement `$3-$2-$1` rearranges them.

### Remove everything after a delimiter

Keep only the part before a dash, comma, or other separator.

| | |
|---|---|
| **Pattern** | `\s*-.*$` |
| **Replacement** | (empty) |
| **Options** | global |
| **Before** | `"A1 - some notes"` |
| **After** | `"A1"` |

### Clean up Likert scale labels

Strip the numeric prefix from Google Forms–style labels like "1 - Strongly disagree".

| | |
|---|---|
| **Pattern** | `^\d+\s*[-–]\s*` |
| **Replacement** | (empty) |
| **Options** | global |
| **Before** | `"1 - Strongly disagree"` |
| **After** | `"Strongly disagree"` |

### Replace multiple spellings at once

Standardize different spellings of the same response.

| | |
|---|---|
| **Pattern** | `^(yes\|yep\|yeah\|y)$` |
| **Replacement** | `Yes` |
| **Options** | global, case insensitive |
| **Before** | `"yep"`, `"YEAH"`, `"Y"` |
| **After** | `"Yes"`, `"Yes"`, `"Yes"` |

The `^` and `$` anchors ensure the entire cell matches, not just a substring.

### Extract a coded segment

Pull a specific part from a structured code like "DEPT-EMP-001".

| | |
|---|---|
| **Pattern** | `^(\w+)-(\w+)-(\d+)$` |
| **Replacement** | `$2` |
| **Options** | global |
| **Before** | `"DEPT-EMP-001"` |
| **After** | `"EMP"` |

Change `$2` to `$1` or `$3` to extract a different segment.

## When to use regex vs. other rules

- **Exact value mapping** (e.g. "Male" → "M") – use [value recode](./data-transformation.md#value-recode) instead. It's simpler and less error-prone.
- **Numeric transformations** – use a [formula](./data-transformation.md#formula). Regex operates on text, not numbers.
- **Simple find-and-replace** with no pattern logic – regex works, but value recode with a single mapping row is more readable.

Regex shines when the text has structure you need to match flexibly – varying formats, optional parts, or segments to rearrange.
