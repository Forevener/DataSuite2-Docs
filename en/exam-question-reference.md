---
title: Exam question reference
description: Answer types, truth expressions, domains, scope, and the full primitive catalog for writing graded exam questions in DataSuite 2.
---

# Exam question reference

An exam adds an `exam` block to a generator spec. The block holds a list of questions; each one says what the student enters, and how the correct answer is computed from **their** dataset. Because every student's data is drawn from their own name, the answer key is computed per student rather than written down – you author the question, not the answer.

Questions are compiled when you export the link, so a misspelled variable or an unknown method is reported in the editor rather than reaching a student.

> This page is about the questions. For the dataset itself – factors, variables, groups, distributions, designs – see the [exam spec reference](./exam-spec-reference.md). For what a student sees, see [taking an exam](./taking-an-exam.md).

## Quick start

```json5
exam: {
	gate: "warn", threshold: 1,
	questions: [
		{
			id: "q1",
			text: "Which scales differ between men and women? (Mann-Whitney, α = 0.05)",
			answer: { type: "set", over: "vars('PF','GH','MH')" },
			truth: { over: "vars('PF','GH','MH')", where: "compare2(sex, $v, 'mannWhitneyU').p < 0.05" },
		},
	],
}
```

That is the whole shape: an `answer` describing the widget, and a `truth` describing the computation. Press **Compute answer key** in the exam generator to run every truth against a sample dataset before you export.

## The exam block

| Field | Meaning |
|---|---|
| `gate` | What a failing score does to the Word export – `"export"` blocks it, `"warn"` asks for confirmation, `"none"` ignores it |
| `threshold` | Fraction of graded questions that must pass, default `1` (all of them) |
| `questions` | The ordered list – order is what the student sees, and what `@qN` references resolve against |

Picks and prose questions are excluded from the score, so `threshold: 1` means every *graded* question.

## A question

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | How later questions reference this one (`@q1`). Must be unique |
| `text` | yes | Shown to the student verbatim, and **not translated** – write it in the language you teach in |
| `answer` | yes | The widget and how it is matched |
| `truth` | unless `pick` / `prose` | The expression computing the correct answer |
| `scope` | no | Restricts the truth to a subset of rows |

The question text is where the method lives. Nothing in the DSL asks *which test is appropriate* – you pin the test, the tails, the post-hoc method and the α in the wording, and the student's job is to run it correctly.

## Answer types

| `type` | Widget | Matched by |
|---|---|---|
| `scalar` | text field | The value as the app **displays** it, under the student's own precision settings |
| `value` | dropdown | Exact equality |
| `set` | checkbox list | Exact set equality – marked as a whole |
| `table` | grid, one row per member | Per cell; the question passes when every cell passes |
| `pick` | dropdown or checkbox list | Not graded – an input later questions read |
| `prose` | a reminder line | Not graded – you read it in the document |

### `scalar`

```json5
answer: { type: "scalar" }                    // matched on the displayed value
answer: { type: "scalar", tol: 0 }            // exact – for counts
answer: { type: "scalar", kind: "pvalue" }    // p-value formatting and floor rule
```

- `tol` – accept anything within ± this of the truth. `tol: 0` means exact. Omit it and the truth is formatted through the app's own formatter and compared as text, which is what makes "type what your screen shows" the rule.
- `kind` – which precision category to format with: `descriptive` (default), `statistic`, or `pvalue`. A `pvalue` cell also accepts anything at or below the display floor, because `< 0.001` is all the screen shows there.

### `value`

```json5
answer: { type: "value", from: "levels(sex)" }
answer: { type: "value", from: ["yes", "no"] }
```

`from` is a [domain](#domains). A plain array is a list of literal answers.

### `set`

```json5
answer: { type: "set", over: "numericVars" },
truth:  { over: "numericVars", where: "compare2(sex, $v, 'mannWhitneyU').p < 0.05" }
```

The truth is `{ over, where }`, with `$v` bound to each member in turn; members the `where` holds for are the answer. A set is marked as a whole – there are no per-item marks, so a failed set sends the student back to their own output table rather than handing them the answer one tick at a time.

The domain is also the batch: all of its members go to the analysis module in a single run, which is both what the question text asks for ("select all these variables and run once") and what makes p-value adjustment come out right.

### `table`

```json5
answer: {
	type: "table",
	rows: "vars('O','C','E','A','N')",
	cols: {
		r: { type: "scalar", kind: "statistic" },
		p: { type: "scalar", kind: "pvalue" },
		significant: { type: "value", from: ["yes", "no"] },
	},
},
truth: {
	r: "cor(age, $row, 'pearson').r",
	p: "cor(age, $row, 'pearson').p",
	significant: "if(cor(age, $row, 'pearson').p < 0.05, 'yes', 'no')",
}
```

One row per member of `rows`, one typed cell per column – cells are `scalar` or `value`. The truth is one expression per column, with `$row` bound to the member. Every column key needs an expression.

### `pick`

```json5
answer: { type: "pick", from: "@q2" }                      // one of the student's earlier answers
answer: { type: "pick", from: "items('A')", n: "any" }     // any number of them
answer: { type: "pick", from: "numericVars", n: 3 }        // exactly three
```

A pick has **no truth** and is never marked. It exists so the questions after it run on the student's own choice – *pick one of the scales you just listed*, then *which sex scores higher on it?* Use `distinct: true` to forbid repeats when several picks share a domain.

### `prose`

```json5
answer: { type: "prose" }
```

No widget, no truth – a line reminding the student to write this up. It appears on the exported answer sheet marked as not graded.

## Truth expressions

A truth is a small expression, written as a string:

- numbers, `'quoted strings'`, and bare column names (`age`, `PF`, `sex`)
- `$v` (the current set member) and `$row` (the current table row)
- `@qN` – the student's answer to an earlier question
- primitive calls with positional arguments – `compare2(sex, PF, 'mannWhitneyU')`
- field access – `.p`, `.r`, `.alpha`; and member indexing – `.itemTotal[$v]`, `[$v]`
- comparisons `== != < <= > >=`, `and` / `or` / `not`, and `if(condition, a, b)`

There are no variables, no loops and no functions you can define – the [primitive catalog](#primitive-catalog) is the whole language.

A truth may evaluate to a **list of acceptable answers**, and any member passes. That is how ties are handled: `mode` returns every tied value, and the group-extremum helpers return every tied level, so you never need a tie rule of your own.

## Domains

A domain is what a `set` ranges over, what a `value` or `pick` offers, and what a `table`'s rows are. It is an expression, exactly like a truth:

| Domain | Gives |
|---|---|
| `vars('PF','GH','MH')` | those columns, named one by one |
| `items('SF')` | every column of a bulk block from the spec |
| `numericVars` | every numeric column |
| `allVars` | every column |
| `outcomes` | the outcome columns of a `design` spec |
| `levels(sex)` | the levels of a group or within factor |
| `pairs(levels(site))` | the unordered pairs of a level list – for post-hoc questions |
| `@q2` | the student's answer to an earlier `set` or `pick` |
| `['yes', 'no']` | literal values |

> **The one trap worth memorising:** a JSON5 **array** is a list of literal values, never a list of columns. `rows: ['PF','GH']` gives you two rows labelled with the strings `PF` and `GH`; `rows: "vars('PF','GH')"` gives you the two columns. When you want columns, write an expression.

## References and scope

`@qN` points at an earlier question and never a later one – the compiler rejects a forward or missing reference. Inside a truth it resolves to a value: a column for a variable pick, a level for a level pick, a set for a set answer.

```json5
{ id: "q3", text: "Which sex scores higher on it?",
  answer: { type: "value", from: "levels(sex)" },
  truth: "argmax_level(sex, @q2, 'median')" }
```

A question whose *domain* names an earlier answer shows a pending line until that question is answered. A question that merely *reads* an earlier answer in its truth renders and answers normally – only its check reports pending.

`scope` restricts the rows the truth runs on, mirroring the **Cases** dialog one-to-one so the question text can name the exact filter the student should set:

```json5
scope: { country: ['France', 'Spain'] }   // categorical: these levels
scope: { country: '@q4' }                 // the levels the student picked
scope: { age: [30, null] }                // numeric range, null for an open end
scope: { age: { min: 30, max: 60 } }      // the same, spelled out
```

## Primitive catalog

Everything here runs on a frozen copy of the student's dataset. The **Where** column says whether it is computed in the browser or handed to the analysis module that owns it – R primitives cost a round trip, so a question built from them takes a second or two to check.

### Counting

| Primitive | Where | Returns |
|---|---|---|
| `nrows()` | browser | Row count in scope |
| `count(predicate)` | browser | Rows matching, e.g. `count(sex == 'female')` |
| `percent(predicate)` | browser | Percentage of **all** rows |
| `validPercent(predicate)` | browser | Percentage of rows with no missing value in the predicate |
| `prop(predicate)` | browser | `validPercent` as a fraction |
| `freq(variable)` | browser | Frequency table |
| `mode(variable)` | browser | Most frequent value – every tied value |
| `modefreq(variable)` | browser | How often the mode occurs |

### Descriptives

`mean`, `sd`, `var`, `se`, `median`, `iqr`, `min`, `max`, `skew`, `kurtosis` – each takes one variable and runs in the browser, from the same object the descriptive card prints. `kurtosis` is excess kurtosis, as on the card.

### Direction helpers

| Primitive | Where | Returns |
|---|---|---|
| `argmax_level(group, variable, stat)` | browser | The level with the highest `'mean'` or `'median'` – every tied level |
| `argmin_level(group, variable, stat)` | browser | The lowest, same rule |
| `sign(value)` | browser | `'+'` or `'−'` |
| `direction(outcome, condition, from, to, stat)` | browser | `'up'` or `'down'` between two conditions |
| `contains(list, value)` | browser | Membership, for testing a primitive that answers with a list |

The `stat` argument is mandatory on both group extrema – mean and median can name different levels, and an answer key cannot afford a silent default.

### Normality, comparison, correlation

| Primitive | Where | Returns |
|---|---|---|
| `normaltest(variable, test)` | R | `.p`, `.stat` |
| `compare2(group, variable, test)` | R | `.p`, `.stat`, `.effect` |
| `compareK(group, variable, test)` | R | `.p`, `.stat` |
| `posthoc(group, variable, test, method)` | R | A pair table – index it with a pair from `pairs(levels(g))` |
| `within2(outcome, condition, subject, test)` | R | `.p`, `.stat` |
| `withinK(outcome, condition, subject, test)` | R | `.p`, `.stat`, plus `.pGG` / `.pHF` for a repeated-measures ANOVA |
| `posthocWithin(outcome, condition, subject, test, method)` | R | A pair table |
| `cor(x, y, method)` | R | `.r`, `.p` |

The within trio needs a condition and a subject id, which only a `design` spec produces.

### Factor analysis and reliability

| Primitive | Where | Returns |
|---|---|---|
| `efa(items, k, extraction, rotation)` | R | `.loadings`, `.grouping` |
| `sameFactor(items, k, extraction, rotation, anchor)` | R | The items grouped with `anchor` |
| `loading(items, k, extraction, rotation, item)` | R | The absolute size of that item's largest loading |
| `suggestK(items, extraction, reference)` | R | Retained factor count from parallel analysis |
| `reliability(items, reversed?)` | R | `.alpha`, `.itemTotal[item]`, `.alphaIfDeleted[item]` |

`reversed` is a list of items to reverse-score first, so a student-found reverse set composes with a student-picked scale: `reliability(@kept, @rev).alpha`.

> **Never ask for a factor number.** Factor 1 on your screen is factor 2 on someone else's – the ordering is arbitrary. Anchor the factor by an item instead (*which items load on the same factor as item 3?*) and ask loadings as absolute values. `sameFactor` and `loading` exist for exactly this.

### Method ids

Test, method, extraction and rotation names are the app's own ids, so a question names precisely what the student selects. The editor's autocomplete offers the valid set **in each argument position**, read from the same directories the analysis uses – so `compare2` offers only two-sample tests, `compareK` only omnibus tests, and `posthoc` only the methods its omnibus declares. Common ones: `mannWhitneyU`, `welchTTest`, `independentTTest`, `kruskalWallis`, `oneWayANOVA`, `wilcoxonSignedRank`, `pairedTTest`, `friedmanTest`, `repeatedMeasuresANOVA`, `tukey`, `dunn`, `pearson`, `spearman`, `shapiroWilk`.

## Checking your questions

**Compute answer key** in the exam generator generates a sample dataset and runs every truth against it, printing one row per answer line. Use it on every question before exporting a link – it is the only thing that catches a question that compiles but computes nothing.

A pick has no truth, so the key assumes the first option – or, for `n: "any"`, the whole domain. Each graded question's key is then used as that student's answer, so the questions built on it resolve instead of reporting pending.

Press **Reroll** on the preview and recompute to see how much the answers move from student to student. A set whose answer is the entire domain every time means your effect is too large for the question to be interesting.

## Tips

**Name the column you want.** A variable with missing data prints two percentages, and a reliability card prints three item-total columns. The truth picks one; the question text has to say which, or the student is choosing between two answers that are both defensible. Prefer `validPercent`, and say "corrected item-total correlation" when you mean `.itemTotal`.

**`.p` is the adjusted p wherever the run produced one.** Under [multiple comparison adjustment](./settings.md#multiple-comparison-adjustment) the card prints both columns, and the truth reads the adjusted one – the same number the student is looking at when they read the family they just ran.

**`.p` on a repeated-measures ANOVA is the uncorrected column.** The card prints p, p (GG) and p (HF) side by side, so say which one you want and read it with `.p`, `.pGG` or `.pHF`.

**Keep `.effect` out of graded truths.** Some effect sizes come off a bootstrap, and with no [bootstrap seed](./settings.md#bootstrap-seed) set they differ between two runs of the same analysis. `.p` and `.stat` are closed-form and safe.

**Set effects comfortably far from thresholds.** A population effect that lands the average student near p = 0.05 makes the question a coin flip. If you want a question whose answer genuinely varies between students, that is a *choice* – make it deliberately, on a small effect, rather than by accident on a large one.

**One link per block of assignments.** A link carries one dataset, so questions that need a different structure – repeated measures, a different grouping variable – belong in their own link with their own spec.

## When to use which

**`set` or `table`?** A set asks *which* – the student ticks the members that qualify. A table asks *what* – one or more values per member. A set is one mark; a table is marked per cell, so it gives more feedback. If a question has a natural "and report r and p for each", it is a table.

**A p-value scalar, or a yes/no `value`?** If the student works with p-values displayed as categories rather than exact numbers, a p scalar is unanswerable. A `value` question over `['yes','no']` asking whether the result is significant at α works under every display setting, and is usually what you actually want to assess.

**Pin the choice, or let the student pick?** Pin it unless the choice is itself the skill. A `pick` is worth its cost when later questions build on it – it makes each student's chain their own, and it lets you grade a student on the scale *they* constructed rather than one you chose for them.
