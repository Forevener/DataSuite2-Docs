---
title: Data transformation
description: Recode, bin, dummy-code, standardize and transform variables, fill missing values, compute formulas, reshape data and manage reusable rules in DataSuite 2.
---

# Data transformation

The **Data transformation** view modifies your data through rules: a rule is defined once, applied at once and re-applied in order whenever the data or an earlier rule changes, and it can be edited or removed at any time. The imported data is never touched – every rule writes into a working copy, and deleting the rule restores what it changed. {#data-transformation}

For a walkthrough of scoring a questionnaire – recoding, reversing items, computing scale scores – see the [questionnaire scoring guide](./questionnaire-scoring-guide.md).

## How to use

1. Load a file and [select the variables](./getting-started.md#choosing-variables) you will work with
2. Open **Data transformation** from the menu and click a rule-type button under the **Transformation rules** list – **+ Value recode**, **+ Binning**, **+ Standardize** … – to open the [rule editor](#the-rule-editor) beside it
3. Select the input variables, configure the [rule](#rule-types) and choose where the [results go](#output-options), checking the result in the **Preview** panel, then click **Save rule** – the rule is applied immediately
4. Read the rule back in the [Transformation rules](#managing-rules) list, where its card names what it reads and writes, describes what the last run derived and flags a run that failed, and keep rules for reuse in the [rule library](#rule-library)
5. To reshape the table – a wide file into a long one, or back – use the [table converter](#table-converter): **Wide → long** and **Long → wide** in the **Table converters** card above the rules

## The rule editor

A rule-type button opens the editor beside the **Transformation rules** list, in four panels: **Input variables**, where you click or drag to select the variables the rule reads, with **Output options** beside it, and below them **Edit transformation rule**, with the rule's name and settings, and the **Preview**. Every rule needs at least one input variable (a formula that declares its outputs may read none); **Cancel** discards the editor, **Save rule** saves the rule and applies it at once. A rule that cannot be saved – a field left empty, a range the editor refuses, a formula that does not compile – says why in the preview as you type, and again on **Save rule**. Drag the line between the settings and the preview to share the width between them; the split is remembered, and a double-click on the line returns it to the default. {#input-variables}

- **Rule name** – the name the rule is listed under, and the name the [rule library](#rule-library) matches on. Left blank, the rule is named after its method or type and its first three inputs – *Z-score: height, weight* – the name the field shows greyed while you build the rule.

The **Preview** runs the rule as the form stands, without saving it, and shows the selected inputs beside the outputs (`→ name`) over the first 10 rows, ∅ marking a missing cell. Under the table it counts the output cells that came out missing where the input held a value, or gives the error when the rule fails. A rule type with a readout of its own keeps it in the settings – the cut points, the collapsed levels, the composition, the regex matches, the missing-values counts.

### Controls several rules share

- **Method** – what the rule computes, chosen from the select; a method that needs more shows its inputs beneath it, and a one-line definition of the chosen method appears under the select. Binning, collapse levels, standardize and sequence start from one.
- **Within groups of** – the rule is fitted or run within each group of this variable – the cut points, the mean and SD, the ranks, the cut-offs, λ, the fill, the sequence – so a case reads against its own group: a z-score within each class, a tertile split within each site, a subject's own previous row rather than the row above it in the file. A case whose group is missing comes out missing under binning, standardize and sequence, and so does every case of a group with no numeric cell under binning and standardize; under a missing values fill such a case is left as it is. The rule description names the group variable with its group count and lists a derived value per group. Offered by binning (not for typed cut points, which are the same everywhere), standardize, sequence and the fills that derive a value.
- **Order by** – the rows are read in ascending order of this variable – numeric when every value is a number, else alphabetical – instead of the file order; the dataset itself is not reordered. A case whose order value is missing comes out missing under a sequence rule, and is left as it is, carrying nothing, under a fill. Offered by the sequence rule and by the three fills that walk the rows.
- **None** – no grouping, or the file order: the rule works down the whole column as it stands. {#within-groups-of-none #order-by-none}

Both selects list every variable of the dataset, and a variable a rule reads this way is protected like an input while the rule exists.

## Rule types

### Value recode

Maps specific values to new ones, one row of the mapping table per value. When you select input variables, their distinct values – pooled over the selection, in the order the levels sort – are pre-filled in the **Original value** column, and a mapping you already typed is kept when the selection changes; **Add row** adds a value the data does not hold. Only a row with both a value and a target is saved; values not in the mapping go where the **All other values** row sends them, and missing cells stay missing. {#value-recode}

- **Original value** – the value to replace, matched as text against the cell as it reads, so a typed `1` matches a numeric 1 and a text "1" alike.
- **New value** – what the value becomes; a target that reads as a number is written as one, so a recoded column stays numeric. Click **∅** beside it to make the value missing instead.
- **All other values** – the table's last row: what happens to a valid cell that no row matches. The range recode has the same row. A missing cell stays missing whatever it says.
- **Keep as is** – the cell stays unchanged. The default.
- **Missing (∅)** – the cell becomes missing, so only the mapped values survive.
- **Value** – the cell takes the constant typed beside the select; a number is written as a number. Required once chosen.
- **Fill empty codes** – numbers the values in one click, for turning a categorical variable into numeric codes: pick an order and click **Fill**. Only empty **New value** cells are written, so a code you typed stays, and each row's number is its position in the chosen order whether or not the other rows were typed.
- **1…k in level order** – 1 for the first value in sort order, 2 for the next, and so on.
- **1…k by frequency** – 1 for the most frequent value, 2 for the next most frequent.
- **0…k−1 in level order** – level order, counting from 0.

### Range recode

Maps numeric ranges to output values, one row per range. Both bounds are inclusive; a blank bound is open, so a row with only a **Max** takes everything up to it and a row with only a **Min** everything from it, and a row needs at least one bound and an output. The editor refuses a range whose minimum is above its maximum and two ranges that overlap, sharing a bound included, so every value has at most one row. Values outside every range, non-numeric cells among them, go where the [All other values](#b-all-other-values) row sends them; missing cells stay missing. When the selected variables hold values between two ranges, a line under the table counts them. **Add row** adds a range. {#range-recode}

- **Min** – the lower bound, inclusive; blank for no lower bound.
- **Max** – the upper bound, inclusive; blank for no upper bound.
- **Output** – the value every cell in the range takes; a number is written as a number. Click **∅** beside it to make the range missing; to blank the values outside every range, set **All other values** to **Missing (∅)**.

### Binning

Cuts a numeric variable into ordered bins – a median split, tertiles, age bands – with a **Method** for the cut points and a **Bin labels** choice for what the bins are called. Bins are half-open: a value equal to a cut point falls in the bin above it, and the outer bins are unbounded, so every number lands somewhere. Missing cells stay missing and a non-numeric cell comes out blank, so a column with no numeric cell comes out blank throughout. {#binning}

- **Quantiles (equal counts)** – cut points at the quantiles j/k of the observed values, so the bins hold equal counts: a **Number of bins** of 2 is a median split, 3 tertiles, 4 quartiles. Heavy ties can put a cut at the minimum; such a cut is dropped rather than leaving an empty bin, so the rule may make fewer bins than asked, and the preview says so.
- **Equal width** – cut points at equal steps between the observed minimum and maximum, so the bins are equally wide whatever they hold.
- **Typed cut points** – a comma-separated list of **Cut points**, the same on every dataset.
- **Number of bins** – k, a whole number of at least 2, for the two derived methods.
- **Cut points** – the typed list, comma-separated, in any order; each cut point starts a bin, so k cut points make k + 1 bins, with values below the first and above the last in the outer bins.
- **Bin labels** – what the bins are called in the output column.
- **1, 2, 3, …** – the bin's number, lowest bin first; the column stays numeric.
- **Interval text** – the bin's interval as text – `< 30`, `[30, 65)`, `≥ 65` – with the cut points at six significant digits, so they copy into a range recode exactly.
- **Typed list** – your own labels, typed under **Labels**.
- **Labels** – comma-separated, one per bin, lowest bin first; the count must match the number of bins.

Derived cut points are re-computed from the data on each run – the **Cut points from the data** preview shows them for the current selection, per group when a group is chosen, and the rule description records what the last run used. To freeze them, copy them into a [range recode](#range-recode). The **Within groups of** select derives the cut points within each group of a second variable, so a tertile split divides a case's own group rather than the whole sample – see [the shared controls](#controls-several-rules-share); typed cut points are the same everywhere, so the select hides for them.

### Dummy coding

Turns one categorical variable into a set of numeric indicator columns, one per level, named `<variable>_<level>` – the recoding a regression does on its own (see [dummy coding](./concepts/regression-basics.md#b-dummy-coding)). The [regression modules](./regression-analysis.md) code a categorical predictor themselves; the rule is for when you need the columns – a formula, an export, a correlation with the indicator. It takes exactly one input variable, always creates its columns, and lists them under **Detected output variables** as the settings change. A missing input is missing in every column. Levels are re-read from the data on each run, so the output set follows the data: a recode upstream that merges two levels removes a column. {#dummy-coding}

- **Coding** – the numbers the indicator columns hold.
- **Dummy (0/1)** – one 0/1 column per level but the reference, 1 on the rows at that level.
- **Effect (−1/0/1)** – one column per level but the reference: 1 on the rows at that level, −1 on the reference, 0 elsewhere, so a regression's coefficients read as deviations from the grand mean rather than from the reference.
- **Reference level** – the level with no column of its own, which the others are measured against (see [reference category](./concepts/regression-basics.md#b-reference-category)).
- **First level** – the first level in sort order, the regression modules' choice.
- **Most frequent level** – the level with the most cases.
- **{level} (n = {count})** – one of the variable's own levels, listed with its count; a picked level the data no longer holds falls back to the first, and the rule description says so.
- **One column per level, the reference included** – k columns instead of k − 1; with an intercept they are collinear, so a regression drops one – for an export or a formula. Dummy coding only.

### Collapse levels

Folds the rare levels of a categorical variable into one – the long tail of a free-text field, the single-digit cells a contingency table cannot use. Every valid cell at a rare level takes the **Label for the collapsed level**; every other cell – missing included – is kept as it is, so a numeric-coded factor keeps its numbers. Pick a **Method** and type its threshold in the field beneath, which is named after the method. {#collapse-levels}

- **Minimum count** – a level with fewer cases than the minimum is collapsed; 5 is the usual floor for a contingency table's expected counts. The field takes the count, a whole number of at least 1.
- **Minimum share of cases** – a level holding less than this share of the valid cells is collapsed, so the floor scales with n. The field takes the percentage. {#minimum-share-of-cases #minimum-share}
- **Keep the top k levels** – the k most frequent levels stay and every other is collapsed; a tie at the boundary keeps the level earlier in sort order. The field takes k. {#keep-the-top-k-levels #levels-to-keep}
- **Label for the collapsed level** – the value the rare levels become, "Other" by default; required.

The **Levels collapsed now** preview lists what would collapse for the current selection, each level with its count, and how many levels stay; the set is re-derived on each run, and the rule description records the levels the last run collapsed. To freeze it, copy the levels into a [value recode](#value-recode).

### Log-ratio

For compositional data – parts that sum to a constant, such as proportions, time budgets, nutrient shares or microbiome abundances. Raw parts cannot go into a correlation, a regression or a clustering: the closure forces at least one negative correlation between parts whatever the process behind them, and a part can only grow at the others' expense, so a log-ratio transform is the standard remedy. Select the parts as the input variables – at least two, read in column order – pick a **Transform**, and the rule creates one column per coordinate, listed under **Detected output variables**. Each row is closed to proportions first, so counts and percentages transform alike; a row with a missing, non-numeric or negative part, or a zero total, is missing in every column, and the rule description counts the rows it left missing. {#log-ratio}

- **Transform** – which log-ratio coordinates the rule writes.
- **Centred log-ratio (CLR)** – $\ln(x/g(x))$, each part against the row's geometric mean, one column per part named `clr_<part>`: one interpretable column per part, a part's position relative to the row's centre, for plots or descriptives. The columns of a row sum to 0, so their covariance matrix is singular – a model that needs a full-rank set takes ILR. {#centred-log-ratio-clr #clr}
- **Additive log-ratio (ALR)** – $\ln(x/x_D)$ against a chosen **Denominator part**, one column per other part named `alr_<part>`: easy to read when there is a natural reference part, such as a control condition or the base of a mix, but the coordinates depend on the denominator and distances between rows are not preserved. {#additive-log-ratio-alr #alr}
- **Isometric log-ratio (ILR)** – k − 1 orthonormal balances in the pivot sequence: each part in column order against the geometric mean of the parts after it, named `ilr_<part>` after the pivot part. Distances are preserved, so this is the set for anything that computes distances or fits a model on the coordinates – regression, clustering, PCA. {#isometric-log-ratio-ilr #ilr}
- **Denominator part** – the part every other is divided by; it gets no column of its own, and a saved denominator no longer among the parts falls back to the last part. ALR only.
- **Zero parts** – what happens to a row in which a part is 0, which has no logarithm.
- **Multiplicative replacement by δ** – a zero part becomes the small share δ and the other parts shrink so the row still sums to 1; a row whose zeros at δ would take the whole row is missing.
- **Set the row to missing** – the row is missing in every column.
- **δ** – the replacement share, as a share of the row total, between 0 and 1. Leave it blank and it is derived on each run as 0.65 times the smallest non-zero share in the data, shown in the rule description; with a known detection limit, type 0.65 times that limit instead.

The **Composition** preview counts the parts, the rows with a zero part and the rows with a missing or negative part, and shows the δ a blank field would derive. Report the transform, the part order or the denominator, and the zero policy with its δ.

### Formula

A mathematical expression evaluated row by row. Selected input variables are referenced as `v1`, `v2`, `v3` … in selection order – a reference badge appears beside each variable in the input panel – and the range `v1:v7` expands to every variable in the span, useful with the aggregate functions. Editing the rule keeps every input in its slot: a newly selected variable takes the next number, and deselecting one moves the later ones up. {#formula}

```
(v1 + v2) / 2
sum(v1:v7) / 7
```

Three special variables are available: `i`, the current row number (1-based); `v`, the current value of the variable being processed, when replacing in place; and `c`, the full column array of the current variable.

A formula with `@` declarations creates several new variables in one rule, one per line; a later line can reference an earlier one, and the **Detected output variables** panel says whether each output is new or replaces an existing variable:

```
@Total = v1 + v2 + v3
@Average = @Total / 3
@Centered = @Total - (mean(c1) + mean(c2) + mean(c3))
```

A formula that does not compile, or whose `@` reference names no declaration above it, cannot be saved; the message names the declaration and the error. Nor can a formula with no `@` that reads neither `v` nor `c` but would write several outputs, since every output would be the same column: name the one result with `@diff = …`, or write `v` or `c` for one result per input.

A blank cell is missing, never `0`: arithmetic on it leaves the row blank, while `sum`, `mean` and the other aggregates skip it – the [formula reference](./formula-reference.md#missing-values) has the rules and the guards, and the full list of operators and functions. The editor highlights syntax, matches brackets, underlines a syntax error as you type and offers **autocomplete** – start typing a variable name or a function and a suggestion list appears (<kbd>Ctrl</kbd>+<kbd>Space</kbd> opens it, <kbd>Tab</kbd> accepts). Under the editor, the **Available functions** line – Math, Aggregates, Text, Dates, Conditions, Multi-variable – links each family to its section of the formula reference, opened in a new tab.

### Regex replace

Applies a regular-expression search-and-replace to the text of each cell separately; a missing cell stays missing, and a number is replaced as its text. The [regex reference](./regex-reference.md) has the pattern syntax. {#regex-replace}

- **Search pattern (RegEx)** – the pattern to find; an invalid pattern is reported under the field, and the rule cannot be saved until it parses.
- **Replacement text** – what each match becomes; `$1`, `$2` … stand for the pattern's captured groups.
- **Global** – replace every match in the cell, not only the first. On by default.
- **Case sensitive** – match upper and lower case as typed; off, `a` matches `A`. On by default.
- **Multiline mode** – `^` and `$` match at the line breaks inside a cell rather than only at its ends.

The **Preview** takes the first valid cell of the first selected variable, whether or not it matches, and shows its matches highlighted with the capture groups in distinct colours, then the result of the replacement.

### Standardize

A column-wise transform: the parameters – mean, SD, range, cut-offs, λ – are computed once from the column's valid numeric cells, then every cell is mapped. Pick a **Method** from six groups; a method that needs more shows its inputs under the select. Missing cells stay missing and a cell that is not a number becomes missing, so a column with no numeric cell comes out missing throughout. A rule re-run on other data – another file, a later import into the same project – recomputes everything from that data, and the rule description shows what the last run derived. The **Within groups of** select fits the method within each group of a second variable – a z-score within each class, a percentile rank within each age band – see [the shared controls](#controls-several-rules-share). {#standardize}

**Standardize**

- **Z-score** – $(x - \text{mean})/\text{SD}$, so the column has mean 0 and SD 1 – see [z-score](./concepts/distributions.md#b-z-score). A constant column becomes 0.
- **Standard score** – $(x - \text{mean})/\text{SD} \cdot s + m$, the z-score placed on a **Target scale** with mean m and SD s: T-scores at 50 and 10, the IQ metric at 100 and 15. A constant column becomes m.
- **Target scale** – the **Mean** and **SD** the standard scores take; blank is the T-score scale, 50 and 10, and the SD must be positive.
- **Robust z** – $(x - \text{median})/(1.4826 \cdot \text{MAD})$: the same idea with the median and the median absolute deviation, which one outlier cannot inflate. A zero MAD gives 0.
- **Center on the mean** – subtracts the mean, keeping the original units.
- **Center on the median** – subtracts the median, keeping the original units.

**Rescale**

- **Min-max (0–1)** – $(x - \min)/(\max - \min)$ over the observed range. A constant column becomes 0.5.
- **POMP (0–100)** – percent of maximum possible, $100 \cdot (x - \min)/(\max - \min)$ over the **Scale range**, so a 1–5 scale and a 0–10 scale read on one 0–100 metric.
- **Reverse scoring** – $(\min + \max) - x$ over the scale range, so a 1–5 item reads 5–1: the usual treatment of a negatively worded item before a scale is summed – see [reverse scoring](./concepts/reliability.md#b-reverse-scoring); the [questionnaire scoring guide](./questionnaire-scoring-guide.md) walks through it. When the items may go to an [IRT analysis](./irt-analysis.md#negatively-keyed-items), keep the originals – **Create new variable(s)**, not **Replace original values** – since that module reverses the items itself and its careless-responding screen reads the answers as given.
- **Scale range** – the lowest and highest value the scale allows, **Min** and **Max**, for POMP and reverse scoring. Type the scale's own limits: an end left blank is read off the data on each run, and the rule description shows the observed range it fell back on.

**Ranks**

A rank or normal-score column keeps the ordering and discards the spacing, so a badly skewed variable can go into a method that wants roughly normal input; the price is that differences between scores no longer mean what the original units meant – see [rank](./concepts/parametric-nonparametric.md#b-rank).

- **Average ranks** – 1 to n in ascending order, tied values sharing their average rank.
- **Percentile ranks** – $100 \cdot (\text{rank} - 0.5)/n$: the percentage of cases below the value, counting half of those tied with it.
- **Normal scores (Blom)** – $\Phi^{-1}((\text{rank} - 3/8)/(n + 1/4))$, the expected normal quantile at each rank, so the column is normal in shape whatever it was.
- **Normal scores (van der Waerden)** – $\Phi^{-1}(\text{rank}/(n + 1))$, the normal quantile at each rank's plotting position.
- **Descending** – rank 1 is the largest value: the ranks are reflected, $n + 1 - \text{rank}$, before the score, so the largest value takes the first rank, the lowest percentile and the lowest normal score.

**Outliers**

- **Winsorize** – values beyond the cut-off are pulled in to it, so the tails are capped and n is unchanged.
- **Trim** – values beyond the cut-off become missing.
- **Flag** – 1 for a value beyond the cut-off, 0 for the rest: the outlier indicator as a column, the values themselves untouched.
- **Cut-off** – where the tails begin, as one of three rules with a number beside it; blank takes the rule's default, and the rule description shows the cut-offs the last run derived – see [outlier](./concepts/outliers-missing-data.md#b-outlier).
- **Percentile, each tail** – a percentile in each tail, below 50; default 5, so the 5th and 95th percentiles.
- **SDs from the mean** – a number of SDs either side of the mean, default 3 – the [z-score rule](./concepts/outliers-missing-data.md#b-z-score-rule), whose cut-off widens with the very outliers it is meant to catch.
- **MADs from the median** – a number of scaled MADs either side of the median, default 3 – the rule of the [modified z-score](./concepts/outliers-missing-data.md#b-modified-z-score), the one an outlier cannot move.

**Transform**

Check the shape first in [distribution analysis](./distribution-analysis.md); the [distributions](./concepts/distributions.md#when-the-variable-is-not-normal) page shows what each transform does to a skewed variable. A column with cells outside the function's domain is shifted first, and the shift is shown in the rule description.

- **Natural log** – ln x, the usual fix for right skew and the interpretable choice when effects are multiplicative – income, reaction times, counts. A column with a zero or negative cell is shifted by 1 − min first, so the smallest cell becomes 1.
- **Log base 10** – log₁₀ x, the same shape in powers of ten; shifted by 1 − min when a cell is zero or negative.
- **log(1 + x)** – ln(1 + x), the log for counts with zeros; a column with a cell at or below −1 is shifted by −min first.
- **Square root** – √x, a milder fix than the log; a column with a negative cell is shifted by −min first, so the smallest cell becomes 0.
- **Reciprocal (1/x)** – 1/x, the strongest of the fixes, which reverses the order of the values; shifted by 1 − min when a cell is zero or negative.
- **Box-Cox** – $(x^\lambda - 1)/\lambda$, ln x at λ = 0, for positive data: the family that lets the data pick the exponent, and the better default when you have no reason to prefer a particular one. Leave **λ** blank and it is estimated by maximum likelihood on each run; a column with a zero or negative cell is shifted by 1 − min first.
- **Yeo-Johnson** – the Box-Cox family extended to zero and negative values, with the same λ handling and no shift.
- **λ** – the exponent, typed to apply it as is – 1 leaves the shape unchanged, 0.5 is a square root, 0 a log, −1 a reciprocal – or left blank to estimate it from the data on each run, shown in the rule description. An estimated λ is data-dependent, so a replication will estimate a different one: report the λ you applied.

**Proportions**

- **Logit** – $\ln(p/(1 - p))$ for a proportion p in [0, 1], stretching the ends of the scale so a bounded outcome can go into a linear model. A cell outside [0, 1] is missing, and so is the logit of exactly 0 or 1 – no shift is applied; divide a count by its total first.
- **Arcsine square root** – $\arcsin\sqrt{p}$, the variance-stabilizing transform for binomial proportions. A cell outside [0, 1] is missing.

### Sequence

Reads a variable down its rows – the value a row earlier, the change since it, a running total. Time series and panel data need this before a formula can compare a row with its neighbours, since a formula sees one row at a time. Pick a **Method**; lag and lead shift the cell as it is, so a text column shifts as text, and the four arithmetic methods treat a non-numeric cell as missing. {#sequence}

- **Lag** – x₋ₖ, the value k rows earlier, as it is; the first k rows come out missing.
- **Lead** – x₊ₖ, the value k rows later, as it is; the last k rows come out missing.
- **Difference over k rows** – x − x₋ₖ; missing where either cell is.
- **Percent change from the previous row** – $(x - x_{-1})/x_{-1}$, as a fraction – multiply by 100 for percent; missing where either cell is, or the previous one is 0.
- **Cumulative sum** – the row and every row before it, skipping missing cells the way `sum(v1:v7)` does; missing until the first valid cell.
- **Running mean over w rows** – the mean of the w rows ending at the row, skipping missing cells, so the first w − 1 rows average what precedes them; missing where no cell in reach is valid.
- **k** – how many rows back or ahead, a whole number of at least 1; blank is 1, the previous or the next row. For lag, lead and difference.
- **w** – how many rows the mean covers, the row itself included, a whole number of at least 1; blank is 3.

The **Within groups of** and **Order by** selects make the rule read a panel correctly – a subject's own previous row rather than the row above it in the file, the rows in the order of a time variable rather than the file order – see [the shared controls](#controls-several-rules-share). A case whose group or order value is missing comes out missing. The rule description shows the method, k or w, the group variable with its group count, and the order variable.

### Missing values

Two modes under **Action**, each applied per selected variable with the usual [output options](#output-options); the **Preview** shows per variable – and per group – what the rule would do now. {#missing-values}

- **Action** – what the rule does to the column: declare codes, or fill the blanks.
- **Declare missing codes** – cells holding one of the **Missing codes** become missing, so a sentinel stops reading as a value; nothing else in the column changes, and a column that held a text sentinel turns numeric once it is gone. The preview counts the cells the codes match per variable – see [missing codes](./concepts/outliers-missing-data.md#b-missing-codes).
- **Missing codes** – comma-separated, `-999, 99, N/A`; each is matched as text against the cell as it reads, the way a value recode matches its original value.
- **Fill missing cells** – every missing cell takes a value, chosen under **Fill with**. That is single imputation: the filled column's SD shrinks, its correlations with other variables attenuate and n reads as if nothing were missing – see [imputation](./concepts/outliers-missing-data.md#b-imputation). For the analyses themselves the [missing data setting](./settings.md#missing-data) handles incomplete cases without touching the data; fill here when a later step needs a complete column – a scale sum, an export, a lagged series.
- **Fill with** – where the value comes from. A column, or a group, with nothing to compute from is left alone, and the rule description records what the last run filled.
- **Mean of the valid cells** – the mean of the column's numeric cells, re-derived on each run.
- **Median of the valid cells** – the median of the column's numeric cells, re-derived on each run.
- **Mode** – the most frequent value, of any kind, the first in sort order when tied; written as the original cell, so a numeric column stays numeric.
- **A constant** – the value typed under **Constant**, into every missing cell.
- **Constant** – the fill value as typed; a number is written as a number. Required for a constant fill.
- **Last observation carried forward (LOCF)** – the nearest earlier valid value, down the whole column unless a group is set; cells before the first valid one stay missing.
- **Next observation carried backward (NOCB)** – the nearest later valid value, down the whole column unless a group is set; cells after the last valid one stay missing.
- **Linear interpolation** – the value on the line between the nearest numeric cells either side; a non-numeric cell counts as a gap, and cells before the first or after the last numeric one stay missing. The x is the row position, or the **Order by** variable's value when it is numeric, so a three-week gap spans three weeks.

The **Within groups of** select computes the fill within each group of a second variable – a group mean rather than the sample mean, a subject's own earlier value rather than the previous row's – and the three fills that walk the rows also take **Order by**, exactly as the [sequence rule](#sequence) does – see [the shared controls](#controls-several-rules-share). A case whose group or order value is missing is left as it is. The preview shows per variable and group how many cells are missing and the value they would take, or how many an ordered fill reaches.

## Output options

Every rule but three offers three output modes; a multi-variable formula, a dummy coding and a log-ratio always create their columns and list them under **Detected output variables** instead.

- **Replace original values** – the input variables are modified in place. The default.
- **Replace another variable** – the results go into different existing variables, chosen under **Variable to replace**; the input and output counts must match (a formula may write one output), and an output cannot be one of the inputs. The inputs pair with the outputs in list order, and editing the rule keeps each pair it already has.
- **Create new variable(s)** – the results go into new columns, named under **New variable name**.
- **New variable name** – the new column's name; with several inputs each gets its own column, the name as a prefix – `z_height`, `z_weight` for a name of `z`. Required, except for a formula, whose output is called `transformed` when the field is blank.
- **Detected output variables** – the columns a formula's `@` declarations, a dummy coding or a log-ratio will write, each flagged **Will create new** or **Will replace existing**.

## Managing rules

Saved rules appear in the **Transformation rules** list, each card with a drag handle (⠿), a coloured badge for its type, its name and an **Edit rule** (✏️) and a **Delete rule** (🗑️) button. Below them the card names what the rule reads and writes – *height, weight → z_height, z_weight*, or *height, weight (in place)* for a rule that replaces its inputs, each side cut after three names – then describes its settings, including, for a rule that derives values from the data (cut points, λ, a fill value, the levels collapsed, a shift, an observed range), the values the last run used. A last line reports a run that did not go cleanly: *Last run failed* with the error, or how many output cells came out missing where everything the output reads held a value.

Rules are applied in the order they appear, each reading the data as the rules above it left it, so a recode that merges two levels changes what a dummy coding below it produces. Drag a card by its handle to move it; the rules then re-run from the imported data in the new order. A rule can only read a column that a rule above it creates, so the editor refuses to save a rule that reads its own output or a column created by a rule below it, and a drag that would put a rule above the rule creating its input is undone with the same message. Editing a rule re-opens the editor with its current settings; on save, what its previous version wrote is first undone – a recode moved from one variable to another leaves the first at its imported values – and the rule then re-runs with every rule that depends on it. Deleting a rule – after a confirmation that names the rules it affects – removes the variables it created, restores any column it replaced in place from the imported data, and re-runs the rules that read those variables. A variable a rule creates keeps its place in the variable list, its selection and its type whenever the rules re-run – after an edit, a change of the [missing data setting](./settings.md#missing-data) or a project load – and is removed only once no rule writes it.

Each rule runs on its own, so a rule that fails – an invalid pattern, a formula from an older project that no longer compiles – does not stop the rules below it. The columns it creates are left empty, and a column it rewrites in place keeps the values it had before the rule. Its card shows the error, a message names it when a re-run breaks a rule that ran cleanly before, and **Save rule** warns when the rule it saved fails. A rule that names a variable the dataset does not hold – pulled from the [rule library](#rule-library) onto other data, or loaded from an older project whose order puts a reader above its creator – does not run at all: its card is dimmed and reads *Not run: this dataset has no* and the variables, until you edit the rule and replace them. The editor marks each missing variable where it stood – among the inputs, the variables to replace, the group or order select – and saves nothing until every one is replaced.

While a rule exists, the variables it reads or writes – its group and order variables included – are protected in the **Organize** tab of the [Variables](./getting-started.md#choosing-variables) dialog: they can be reordered there, but not renamed or deleted. Remove the rule first.

After every run the columns the rules rewrote are re-typed from the resulting data, without a prompt, and the other columns keep their types. A type DataSuite inferred is inferred again: a rule that writes non-numeric values into a numeric column – whitespace-only strings included, which count as valid text – makes that column categorical in the same pass, and a column that loses its text sentinel becomes numeric. A type you chose in the [Variables](./getting-started.md#choosing-variables) dialog is kept while the data fits it – continuous and ordinal need every non-missing value to be a number, categorical fits anything – and when a rule makes it stop fitting, the variable falls back to the inferred type and a notice names it with both types.

## Rule library

The rule library stores transformation rules persistently in your browser, independent of any loaded data file, so a rule set can be reused across projects and sessions. Library rules live in your browser's own database: to move them to another computer or browser, [export and import](#import-and-export) them.

Click **Rule library** in the transform view to open a two-pane modal – **File rules**, the rules in the current project, on the left, and **Library**, the rules in persistent storage, on the right. Each pane is a table, and a rule already present on the other side – matched by content, not by name – is marked with a check.

- **Name** – the rule's name, the name a conflict is detected on.
- **Type** – the rule type, as a badge.
- **Description** – the rule's settings, as the rules list describes them, on one line; hover over a cut one for the full text.

### Moving rules

- **Push to library** – select rules in the file pane and push them to persistent storage.
- **Pull to file** – select library rules and add them to the current project, applied immediately.
- **Delete** – remove the selected library rules.

The library holds the variables a rule reads and writes by name, so a pull matches them to the loaded dataset's variables of the same name, wherever they sit in the file. A rule naming a variable the dataset lacks is pulled all the same but does not run until you edit it (see [managing rules](#managing-rules)), and the message after the pull counts these rules apart. An entry stored by an older version of DataSuite, which recorded variables by their position in the file, cannot be matched and is skipped: push it again from a dataset that holds its variables.

A rule whose content already exists on the other side is skipped. If a rule with the same name but different content exists there, a **Name conflict** bar offers **Overwrite**, **Keep both (rename)** – a numbered suffix – **Skip** or **Cancel all**.

A pushed rule remembers the rules above it that it depends on: those that create a column it reads, and those whose columns it rewrites. Pushing a rule without the rules that create its inputs offers to push them too; pulling puts the selected rules in the order those dependencies need, and when a rule reads columns from entries you did not select and the file does not have, a bar offers to pull those as well – **Include them**, **Leave them out** or **Cancel all**.

### Import and export

- **Import** – load rules from a JSON file previously exported from DataSuite, or the rules of a saved project file; when the file holds rules the library already has, a dialog asks whether to replace them or skip the duplicates.
- **Export** – download the selected library rules as a shareable JSON file.

## Table converter

The table converter reshapes data between wide and long format – see [wide and long](./concepts/guide-data.md#wide-and-long). It works on the variables selected in the Variables dialog, and applying it replaces the current dataset – the original data is not preserved, so save a project file first if you want to keep it.

- **Wide → long** – opens the [wide-to-long converter](#wide-to-long), for repeated measurements or groups held in separate columns. The comparison and the reproducibility view open the same converter with their **Convert to long format** button.
- **Long → wide** – opens the [long-to-wide converter](#long-to-wide), for data held as one row per subject and condition that you need as one column per condition.

### Wide to long

Repeated measurements stored as separate columns, one row per subject, become one row per subject and condition, which is what a repeated-measures or a mixed design needs. The variables you do not stack are carried over unchanged, repeated on each of a subject's rows. {#table-converter #wide-to-long}

- **Stacking pattern** – how the source columns are ordered. DataSuite reads the variable names and pre-selects the pattern, the number of conditions and the condition labels it detects there, when the names agree.
- **Grouped by condition** – every variable's column for the first condition, then every variable's column for the second, and so on.
- **Grouped by variable** – each variable's conditions are adjacent.
- **Number of conditions** – how many repeated measurements each variable has, 2 to 20. The count of stacked variables must divide by it: the modal warns when it does not, and the columns left over are ignored.
- **Condition column name** – the name of the new column holding the condition labels, "Condition" by default.
- **Condition labels** – a name for each condition ("Before", "After"), pre-filled from the variable names when they can be read, else T1, T2 ….
- **Subject identifier** – what links a subject's rows together in the result.
- **Generate automatically** – row numbers, one subject per row of the wide data, in a column named **Subject ID**. If a subject occupies several rows, each becomes a separate subject in the result and no later check can tell – the warning under the select says so; choose the subject's column instead.
- **None (independent groups)** – no identifier column: the stacked columns hold independent groups – one group's scores in one column, another's in the next – so the result lists each condition's cases in turn, all of the first condition, then all of the second. A row whose measurements are all missing is dropped, since it is padding from a column shorter than its neighbours; with an identifier such a row stays.
- **Use column: {variable}** – an existing column holds the identifier; it keeps its name in the result and is not stacked.
- **Variables to stack** – click or drag to select the variables to reshape, in the pattern's order; the count beneath says how many measurements per condition that makes, or warns that the variables do not divide evenly. Each measurement column of the result is named by what its source columns' names share, so `score_t1` and `score_t2` stack into `score`.
- **Preview** – the result as the settings stand, every row when there are 20 or fewer, else the first and last ten: one column each for the subject identifier, the condition, every stacked measurement and every variable carried over; the variables being stacked together are listed under the table. The long-to-wide converter's has a [status of its own](#b-long-to-wide-preview).

### Long to wide

Data held as one row per subject and condition becomes one row per subject, each measurement spread into one column per condition. Give the columns their roles in the three lists on the left – a column picked in one list leaves the other two – and the preview fills once there is an identifier (or none, by position), a key and a value. {#table-converter-long-wide #long-to-wide}

- **Identifier columns** – the columns that name one row of the wide table: a subject ID, or several columns that do it together, such as a subject and a session. A row whose identifier or key is missing is skipped, and the status under the preview counts it.
- **None – match rows by position** – no identifier: the first row of each key combination is placed beside the first row of the others, the second beside the second, and so on, and a combination with fewer rows is padded with missing cells. The rows placed side by side have nothing to do with each other, as the warning under the checkbox says – use it for independent groups only, the reverse of the wide-to-long converter's [None (independent groups)](#b-none-independent-groups).
- **Key columns** – the columns whose levels become the new column names – a condition, a time point. Each value column gets one column per key combination that occurs, named `{value}_{key}` (`score_T1`, `score_T2`), the levels in the app's sort order. Several keys nest in the order you pick them, the first outermost, so picking occasion then item gives `score_1_a`, `score_1_b` ….
- **Value columns** – the measurements to spread, each into one column per key combination; a subject with no row for a combination gets a missing cell.
- **Column order** – the order of the spread columns when there are several value columns.
- **Grouped by value** – each value column's conditions are adjacent: `score_T1, score_T2, rt_T1, rt_T2`.
- **Grouped by key** – every value column for the first condition, then every one for the second: `score_T1, rt_T1, score_T2, rt_T2`.
- **Preview** – the wide result as the settings stand, as the wide-to-long preview shows it, with its column and row counts in the badges. The status beneath lists the rows skipped for a missing identifier or key, the other selected columns carried over (those holding one value per identifier, such as a subject's age or group), and the columns that will be dropped because they vary within an identifier – with no identifier, every other column is dropped. When an identifier and key combination holds more than one row, the converter refuses: the status gives the number of repeated cells, the first five, and the advice to add a column to the identifier, and **Apply transformation** stays disabled. {#long-to-wide-preview}
- **Move to values** – beside a column that will be dropped: adds it to the value columns, so it is spread like the measurements instead.

### Applying a conversion

The footer of both converters says what applying carries along besides replacing the dataset. When the project has transformation rules, they will be cleared, and their output columns are kept as plain data. Under [listwise deletion](./settings.md#missing-data) the rows with a missing value are already removed, and under imputation the missing cells are already filled – the converters read the data as the missing-data setting left it, so the converted data keeps both.

- **Apply transformation** – replaces the dataset with the converted one.

## Reporting checklist

**Method:**
- Every rule, in order, with what it did: the mapping or the ranges of a recode, the method and cut points of a binning, the coding and reference level of a dummy set, the threshold of a collapse, the transform and zero policy of a log-ratio, the formula, the pattern of a regex replace, the method of a standardize rule with its scale range, cut-off or λ, the method and k or w of a sequence, the codes declared or the fill used
- The values a rule derived from the data – cut points, λ, δ, a fill value, the levels collapsed, an observed range, a shift – as the rule description records them, since a re-run on other data derives others
- Which variables were transformed in place and which were created, and any grouping or ordering variable
- For a fill: how many cells per variable, and that the fill is single imputation

**Results:**
- Results on a transformed variable are in transformed units – a difference in square-root minutes, a log-ratio coordinate – and say so; back-transform for the reader where the scale allows
- An n that changed – rows a trim set to missing, rows a log-ratio could not transform, rows outside every group

## Reproducibility

Every rule runs in the browser, without R, and a rule is its own record: the rules list describes each rule's settings together with the values its last run derived, and the [rule library](#rule-library)'s export carries a rule set as a JSON file a reader can pull into the same data. A derived value – an estimated λ, a quantile cut point, a fill value – is re-derived on every run, so a rule applied to other data gives other values, and a paper reports the values used rather than the rule alone. The [method notes](./methods/data-transformation.md) hold the reasoning behind the conventions – the quantile type, the MAD scaling, the λ search, the δ rule – with the numbers that validate them.

## Common pitfalls

**Reversing against whoever answered.** A reverse-scoring or POMP rule with a blank scale range reads the range off the data, and that is wrong whenever nobody used an end of the scale: a 1–5 item nobody answered 5 to reverses as 4 − x instead of 6 − x. Type the scale's own limits; the rule description shows an observed range whenever it had to fall back on one.

**Binning a measurement you could keep.** A median split or tertiles throw away the spacing between values, and a case just either side of a cut point lands in different bins for no reason the data supports. Bin for a table or a plot; for a test or a model, keep the variable as it is and let the model use it.

**Filling, then testing.** A filled column reads as complete, and its SD, its correlations and its n all say so – a test on it is a test on data that is partly invented. Fill when a later step needs a complete column, report the fill, and let the [missing data setting](./settings.md#missing-data) handle incomplete cases in the analyses themselves.

**Standardizing within the groups you then compare.** A z-score within groups gives every group a mean of 0, so a comparison of the groups afterwards finds nothing. Standardize within groups to compare positions – who is high for their site – and across the whole sample to compare the groups.

**A rule that changes a type.** Interval labels, a collapsed level's text label and a regex replacement write text, so a numeric column that receives them becomes categorical, and a numeric analysis no longer offers it. Write to a new variable when the original is still wanted as a number.

**Order matters.** Rules run top to bottom, each on the data as the rules above it left it: a dummy coding above the recode that merges two levels codes the levels the recode was meant to remove, and a fill above the rule that declares the missing codes fills nothing. Put the rule that cleans a column before the rules that read it.
