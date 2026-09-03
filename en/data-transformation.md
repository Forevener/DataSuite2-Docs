---
title: Data transformation
description: Recode values, compute formulas, apply regex replacements, standardize variables, reshape data, and manage reusable transformation rules in DataSuite 2.
---

# Data transformation

The **Data transformation** view lets you modify your data through a rule-based system. Rules are defined once, applied in order, and can be edited or removed at any time. The original data is always preserved – transformations produce a new working copy.

For a practical walkthrough of scoring questionnaires (recoding, reversing items, computing scales), see the [questionnaire scoring guide](./questionnaire-scoring-guide.md).

## The rule editor

Click one of the five buttons at the top to create a rule. A three-panel editor opens:

- **Left panel** – select input variables (click or drag to multi-select)
- **Center panel** – configure the transformation
- **Right panel** – choose where the [results go](#output-options)

Give each rule a name (required) and optionally a description, then click **Save rule**. The transformation is applied immediately.

## Rule types

### Value recode

Maps specific values to new ones. When you select input variables, DataSuite scans the data and pre-fills the **Original value** column with all unique values it finds. Fill in the **New value** for each entry. You can add extra rows manually. Values not listed in the mapping stay unchanged.

### Range recode

Maps numeric ranges to output values. Each row defines a **Min**, **Max**, and **Output**. Both boundaries are inclusive – a value that falls within the range gets the specified output. Values outside all defined ranges stay unchanged.

### Formula

A mathematical expression evaluated row by row. Selected input variables are referenced as `v1`, `v2`, `v3`, etc. – reference badges appear next to each variable in the input panel.

```
(v1 + v2) / 2
```

The range syntax `v1:v7` expands to all variables in that span, useful with aggregate functions:

```
sum(v1:v7) / 7
```

Three special variables are available:

- `i` – the current row number (1-based)
- `v` – the current value of the variable being processed (when replacing in place)
- `c` – the full column array of the current variable

**Multi-variable formulas** let you create several new variables in a single rule using `@` declarations:

```
@Total = v1 + v2 + v3
@Average = @Total / 3
@Centered = @Average - mean(c)
```

Each line creates (or overwrites) a variable. Later lines can reference earlier ones. The editor shows whether each output will be new or will replace an existing variable.

The formula editor provides syntax highlighting, bracket matching, and **autocomplete** – start typing a variable name or function and a suggestion list appears (press <kbd>Ctrl</kbd>+<kbd>Space</kbd> to open it manually). Syntax errors are underlined as you type.

For the full list of operators and functions, see the [formula reference](./formula-reference.md).

### Regex replace

Applies a regular expression search-and-replace to text data in each cell separately. You provide a **search pattern** and a **replacement string** (supporting `$1`, `$2`, etc. for captured groups).

Options:

- **Global** – replace all matches, not just the first
- **Case sensitive**
- **Multiline mode**

A live preview shows the first matching value with matches highlighted and capture groups in distinct colors.

For pattern syntax details, see the [regex reference](./regex-reference.md).

### Standardize

Converts numeric values to a standardized scale:

- **Z-score** – transforms to mean = 0, standard deviation = 1
- **Min-max scaling** – transforms to a 0–1 range

Missing values remain missing. If all values are identical, z-score returns 0 and min-max returns 0.5.

## Output options

Every rule (except multi-variable formulas) offers three output modes:

- **Replace original values** – modifies the input variables in place
- **Replace another variable** – writes results into a different existing variable (input and output counts must match)
- **Create new variables** – specify a name for the new variable; when multiple inputs are selected, each gets its own output with the base name as prefix

## Managing rules

Saved rules appear in the **Transformation rules** list, showing:

- a colored badge for the rule type
- the rule name and description
- how many variables the rule applies to
- **Edit** and **Delete** buttons

Rules are applied in the order they appear. Editing a rule re-opens the editor with its current settings. Deleting a rule removes it and any variables it created (after confirmation).

While a rule exists, the variables it reads or writes are protected in the **Organize** tab of the [Variables](./getting-started.md#choosing-variables) dialog – they can be reordered there, but not renamed or deleted. Remove the rule first.

> **Variable types after a run:** every transformation run recomputes all variable types from the resulting data, without a prompt. A rule that writes non-numeric values (including whitespace-only strings, which always count as valid non-numeric data points) into a numeric column downgrades that column to categorical in the same pass.

## Rule library

The rule library stores transformation rules persistently in your browser, independent of any loaded data file. This lets you reuse rules across different projects and sessions.

> **Note:** library rules are stored locally in your browser's database. If you plan to switch to a different computer or browser, use the [import and export](#import-and-export) feature to transfer them.

Click **Rule library** in the transform view to open a two-pane modal:

- **Left pane (file rules)** – rules in the current project
- **Right pane (library)** – rules saved in your browser's persistent storage

Each rule shows a checkmark if it already exists on the other side (matched by content, not name).

### Moving rules

- **Push to library** – select rules in the file pane and push them to persistent storage
- **Pull to file** – select library rules and add them to the current project (applied immediately)

If a rule with the same name but different content already exists, a conflict dialog lets you overwrite, keep both (with a numbered suffix), skip, or cancel.

### Import and export

- **Import** – load rules from a JSON file previously exported from DataSuite
- **Export** – download selected library rules as a shareable JSON file

## Table converter

The table converter reshapes data from wide format to long (stacked) format – typically needed when repeated measurements are stored as separate columns and need to be combined for analysis (e.g. for repeated-measures tests).

### Configuration

- **Stacking pattern** – whether source columns are grouped by condition (all variables for condition 1, then condition 2, ...) or grouped by variable (each variable's conditions are adjacent)
- **Number of conditions** – how many repeated measurements each variable has (2–20)
- **Condition labels** – a name for each condition (e.g. "Before", "After"). DataSuite attempts to auto-detect these from variable names.
- **Subject identifier** – generate row numbers automatically, or use an existing column
- **Condition column name** – the name of the new column that holds the condition labels (default: "Condition")
- **Variables to stack** – click or drag to select which variables to reshape. A warning appears if the count doesn't divide evenly by the number of conditions.

A live preview on the right side updates as you adjust the settings, showing the first and last rows of the result.

> **Note:** applying the table converter replaces the current dataset. The original data is not preserved – save a project file first if you want to keep it.