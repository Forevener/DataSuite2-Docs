---
title: Formula reference for DataSuite 2
description: Variables, operators, math functions, string functions, and advanced expressions available in DataSuite 2 formula transformations.
---

# Formula reference

Formulas in DataSuite 2 are powered by [Math.js](https://mathjs.org/) with additional string and utility functions. This page covers what's available — from simple arithmetic to advanced expressions.

## Quick start

> For step-by-step scoring examples with real questionnaires, see the [questionnaire scoring guide](./questionnaire-scoring-guide.md).

A formula is evaluated once per row — think of it as writing a calculation that runs for each participant (row) in your data, using that participant's values. Reference your selected input variables as `v1`, `v2`, `v3`, etc.:

```
(v1 + v2) / 2
```

Use the range syntax `v1:v7` with aggregate functions:

```
sum(v1:v7)
```

That's enough for most use cases. Read on for the full reference.

## Variables

### Input variables

When you select variables in the input panel, they are numbered in the order you selected them. For example, if you select Age, Score, and Grade — they become `v1`, `v2`, and `v3` respectively. The reference badges next to each variable name in the input panel show the assigned numbers.

| Reference | Meaning |
|---|---|
| `v1`, `v2`, `v3`, ... | value of the 1st, 2nd, 3rd, ... input variable in the current row |
| `c1`, `c2`, `c3`, ... | full column array of the 1st, 2nd, 3rd, ... input variable (all rows) |
| `v1:v7` | expands to all variables from `v1` through `v7` — use inside functions like `sum(v1:v7)` |

Missing values are treated as `0` when accessed via `v1`, `v2`, etc.

### Special variables

| Variable | Meaning |
|---|---|
| `i` | current row number (1-based) |
| `v` | current value of the variable being processed (see below) |
| `c` | full column array of the variable being processed (see below) |

`v` and `c` are available when a rule has multiple input variables and the output is set to [replace original values](./data-transformation.md#output-options). In that case, the formula runs once per variable per row — `v` is the current cell value and `c` is the full column. This is useful for applying the same transformation to many variables at once, e.g. `v * 100` to convert all selected variables to percentages.

## Values and syntax

### Numbers

Numbers are written as-is: `42`, `3.14`, `-7`. Scientific notation is supported: `1.5e3` (= 1500).

### Strings

Strings are enclosed in double quotes: `"hello"`. Use `+` to concatenate: `"ID_" + v1`.

### Booleans

`true` and `false` — returned by comparisons and logical operators, and used in conditionals.

### Arrays

Arrays are written with square brackets:

```
[1, 2, 3]
[v1, v2, v3]
["low", "medium", "high"]
```

Arrays are important because some functions expect them. For example, `min` and `max` can take either separate arguments or an array:

```
min(v1, v2, v3)
min([v1, v2, v3])
```

Both forms produce the same result.

The range syntax `v1:v7` expands into an array automatically, so `sum(v1:v7)` becomes `sum([v1, v2, v3, v4, v5, v6, v7])` internally and works as expected.

### Indexing

Access individual elements of an array using square brackets. **Indices are 1-based** (not 0-based like in most programming languages):

```
c1[1]       // first value in column 1
c1[i]       // current row's value in column 1
```

## Operators

### Arithmetic

| Operator | Meaning | Example |
|---|---|---|
| `+` | addition (or string concatenation) | `v1 + v2` |
| `-` | subtraction | `v1 - 10` |
| `*` | multiplication | `v1 * 100` |
| `/` | division | `v1 / v2` |
| `%` | modulo (remainder) | `v1 % 2` |
| `^` | exponentiation | `v1 ^ 2` |

The `+` operator also concatenates strings: `"ID_" + v1` produces `"ID_42"`.

### Comparison

| Operator | Meaning |
|---|---|
| `==` | equal to |
| `!=` | not equal to |
| `<` | less than |
| `>` | greater than |
| `<=` | less than or equal |
| `>=` | greater than or equal |

These return `true` or `false`. Comparisons work with both numbers and strings.

### Logical

| Operator | Meaning | Example |
|---|---|---|
| `and` | logical AND | `v1 > 0 and v2 > 0` |
| `or` | logical OR | `v1 == 0 or v2 == 0` |
| `not` | logical NOT | `not (v1 == 0)` |

### Conditional (ternary)

```
condition ? valueIfTrue : valueIfFalse
```

Example — assign a label based on a score:

```
v1 >= 70 ? "pass" : "fail"
```

Nest them for multiple conditions:

```
v1 >= 90 ? "A" : (v1 >= 70 ? "B" : "C")
```

## Math functions

These are the most commonly used built-in Math.js functions. For the complete list, see the [Math.js documentation](https://mathjs.org/docs/reference/functions.html).

### Basic

| Function | Description | Example |
|---|---|---|
| `abs(x)` | absolute value | `abs(v1 - v2)` |
| `round(x)` | round to nearest integer | `round(v1)` |
| `round(x, n)` | round to `n` decimal places | `round(v1, 2)` |
| `ceil(x)` | round up | `ceil(v1)` |
| `floor(x)` | round down | `floor(v1)` |
| `sign(x)` | -1, 0, or 1 | `sign(v1)` |
| `sqrt(x)` | square root | `sqrt(v1)` |
| `cbrt(x)` | cube root | `cbrt(v1)` |
| `pow(x, n)` | power (same as `x ^ n`) | `pow(v1, 3)` |
| `exp(x)` | e raised to the power x | `exp(v1)` |
| `log(x)` | natural logarithm | `log(v1)` |
| `log10(x)` | base-10 logarithm | `log10(v1)` |
| `log2(x)` | base-2 logarithm | `log2(v1)` |

### Aggregate

These work with multiple values or arrays (e.g. via the `v1:v7` range syntax):

| Function | Description | Example |
|---|---|---|
| `sum(...)` | sum of values | `sum(v1:v5)` |
| `mean(...)` | arithmetic mean | `mean(v1:v5)` |
| `median(...)` | median | `median(v1:v5)` |
| `min(...)` | minimum value | `min(v1, v2, v3)` |
| `max(...)` | maximum value | `max(v1:v5)` |
| `std(...)` | standard deviation | `std(v1:v5)` |
| `variance(...)` | variance | `variance(v1:v5)` |

### Trigonometric

`sin(x)`, `cos(x)`, `tan(x)`, `asin(x)`, `acos(x)`, `atan(x)` — all in radians.

### Custom aggregate functions

| Function | Description | Example |
|---|---|---|
| `countif(array, value)` | count occurrences of `value` in `array` | `countif(c1, "yes")` |
| `sumR(array, k)` | sum of `(k - x)` for each `x` in `array` | `sumR(c1, 100)` |
| `coalesce(a, b)` | returns `a` if it has a value, otherwise `b` | `coalesce(v1, 0)` |

## String functions

All string functions work on text values. Most take a string as the first argument.

Many string functions also support **dot syntax** — calling the function as a method on the value. Both forms are equivalent:

```
contains(v1, "test")    // function syntax
v1.contains("test")     // dot syntax — same result
```

Use whichever reads more naturally. Dot syntax can be especially convenient for chaining: `v1.trim().toLowerCase()`.

### Case conversion

| Function | Description | Example |
|---|---|---|
| `toLowerCase(s)` | convert to lowercase | `toLowerCase(v1)` |
| `toUpperCase(s)` | convert to uppercase | `toUpperCase(v1)` |
| `capitalize(s)` | uppercase first character | `capitalize(v1)` |

### Inspection

| Function | Description | Returns |
|---|---|---|
| `length(s)` | number of characters | number |
| `isBlank(s)` | true if empty or whitespace only | boolean |
| `isNotBlank(s)` | true if contains non-whitespace | boolean |
| `isString(x)` | true if value is a string | boolean |
| `contains(s, search)` | true if `s` contains `search` | boolean |
| `startsWith(s, prefix)` | true if `s` starts with `prefix` | boolean |
| `endsWith(s, suffix)` | true if `s` ends with `suffix` | boolean |
| `indexOf(s, search)` | position of first match (-1 if not found) | number |
| `lastIndexOf(s, search)` | position of last match (-1 if not found) | number |

### Extraction

| Function | Description | Example |
|---|---|---|
| `substring(s, start)` | from `start` to end | `substring(v1, 3)` |
| `substring(s, start, end)` | from `start` to `end` (exclusive) | `substring(v1, 0, 5)` |
| `slice(s, start)` | like `substring`, but supports negative indices | `slice(v1, -3)` |
| `slice(s, start, end)` | extract a portion with negative support | `slice(v1, 1, -1)` |
| `charAt(s, index)` | character at position | `charAt(v1, 0)` |
| `left(s, n)` | first `n` characters | `left(v1, 3)` |
| `right(s, n)` | last `n` characters | `right(v1, 4)` |

### Modification

| Function | Description | Example |
|---|---|---|
| `trim(s)` | remove whitespace from both ends | `trim(v1)` |
| `trimStart(s)` | remove leading whitespace | `trimStart(v1)` |
| `trimEnd(s)` | remove trailing whitespace | `trimEnd(v1)` |
| `replace(s, search, repl)` | replace first occurrence | `replace(v1, "old", "new")` |
| `replace(s, pattern, repl, flags)` | regex replace | `replace(v1, "\\d+", "N", "g")` |
| `replaceAll(s, search, repl)` | replace all occurrences | `replaceAll(v1, " ", "_")` |
| `reverse(s)` | reverse the string | `reverse(v1)` |
| `repeat(s, n)` | repeat `n` times | `repeat("*", v2)` |
| `padStart(s, len, pad)` | pad from the left | `padStart(v1, 5, "0")` |
| `padEnd(s, len, pad)` | pad from the right | `padEnd(v1, 10, ".")` |

### Splitting and joining

| Function | Description | Example |
|---|---|---|
| `split(s, separator)` | split into an array | `split(v1, ",")` |
| `join(array, separator)` | join array into a string | `join(split(v1, ","), ";")` |

### Pattern matching

| Function | Description | Example |
|---|---|---|
| `test(s, pattern)` | true if regex matches | `test(v1, "^[A-Z]")` |
| `match(s, pattern)` | returns the match (or null) | `match(v1, "\\d+")` |
| `test(s, pattern, flags)` | regex with flags | `test(v1, "hello", "i")` |

### Formatting

```
format(template, arg0, arg1, ...)
```

Replaces `{0}`, `{1}`, etc. with the corresponding arguments:

```
format("Subject {0}, Group {1}", v1, v2)
```

## Multi-variable formulas

Use `@Name = expression` to create multiple output variables in a single rule:

```
@Total = v1 + v2 + v3
@Average = @Total / 3
@ZScore = (@Total - mean(c1 + c2 + c3)) / std(c1 + c2 + c3)
```

Each `@Name` creates a new variable (or overwrites an existing one with the same name). Later declarations can reference earlier ones with the `@` prefix. The [output options](./data-transformation.md#output-options) panel is disabled for multi-variable formulas since output targets are explicit.

## Tips

- **Missing values become `0`** in formulas. If you need different behavior, use `coalesce(v1, someDefault)` to substitute a specific fallback, or a conditional like `v1 == 0 ? NaN : v1` to flag them.
- **`v1` vs `c1`** — `v1` gives you one value (the current row), `c1` gives you the entire column as an array. Use `c1` for column-wide calculations: `v1 - mean(c1)` centers each value around the column mean.
- **Errors in formulas** produce a missing value for that row — the rest of the data is unaffected. Check the data preview to spot any unexpected blanks.
- **String concatenation** uses `+`: `v1 + " " + v2` joins two text values with a space.
- **Parentheses** control evaluation order as expected: `(v1 + v2) * v3`.
- **Constants** `pi`, `e`, `Infinity`, and `NaN` are available.
- **Comments** can be added with `//`: `v1 + v2 // total score`. Anything after `//` on the same line is ignored.