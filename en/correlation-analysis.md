---
title: Correlation analysis
description: Pearson, Spearman, Kendall, polychoric, point-biserial, Cramer's V, and other correlation methods with matrix and long-format output in DataSuite 2.
---

# Correlation analysis

The **Correlation analysis** module measures the strength and direction of relationships between pairs of variables. You can correlate all variables at once or pick specific subsets, choose from 12 correlation methods (or let the app pick automatically), and view results as a matrix, a long-format table, or a network visualization.

> **What is a correlation coefficient?** A number between −1 and +1 that describes how two variables move together. A value of +1 means they increase in perfect lockstep; −1 means one increases exactly as the other decreases; 0 means no linear pattern at all. In practice, you'll rarely see perfect values — something like 0.6 (e.g. height and weight) indicates a solid positive relationship, while 0.1 suggests the variables are barely related.

1. [Select your variables](#setting-up) (or leave both lists empty to correlate [all available variables](./getting-started.md#choosing-variables))
2. Choose a [correlation method](#choosing-a-method)
3. Adjust [display options](#display-options)
4. Click **Calculate correlations**

## Setting up

Two variable lists appear side by side:

- **Left variables** — appear as rows in the output matrix
- **Right variables** — appear as columns in the output matrix

Both lists are optional. Leave them empty to correlate all variables against each other. Select variables in only one list and the other defaults to all appropriate variables. Variables can be selected by clicking or drag-selecting across multiple items.

When you change the correlation method, the lists automatically filter to show only compatible variable types. A warning appears if no appropriate variables exist.

## Choosing a method

| Method | Symbol | Variable types | Measures |
|---|---|---|---|
| **Pearson's r** (default) | r | Continuous + continuous | Linear association |
| **Spearman's rho** | ρ | Continuous or ordinal | Monotonic association (rank-based) |
| **Kendall's tau** | τ | Continuous or ordinal | Ordinal association (concordant/discordant pairs) |
| **Polychoric** | r | Ordinal + ordinal | Association between latent continuous distributions |
| **Polyserial** | r | Continuous + ordinal | Assumes a latent continuous variable underlies the ordinal one |
| **Somers' D** | D | Continuous or ordinal | Asymmetric ordinal association, adjusts for ties |
| **Goodman & Kruskal's gamma** | γ | Continuous or ordinal | Ordinal association, ignores ties |
| **Point-biserial** | r | Continuous + binary | Equivalent to Pearson's r with a dichotomous variable |
| **Biserial** | r | Continuous + binary | Assumes the binary variable is a dichotomized continuous variable |
| **Phi coefficient** | φ | Binary + binary | Based on a 2×2 chi-square test |
| **Cramer's V** | V | Categorical + categorical | Based on chi-square, works with more than two levels |
| **Mixed/Auto** | varies | All | Picks the best method for each pair automatically |

> **Which method to pick?** Start with **Pearson's r** for continuous data — it's the most common and easiest to interpret. If your data is ordinal (e.g. Likert scales) or you're worried about outliers, use **Spearman's rho**. If you have a mix of variable types and don't want to think about it, **Mixed/Auto** handles everything.

> **Pearson vs. Spearman vs. Kendall:** Pearson measures *linear* relationships — it can miss a strong curved pattern. Spearman and Kendall both use ranks, so they capture any monotonic relationship (consistently increasing or decreasing). Kendall is more robust with small samples and has a more intuitive interpretation, but Spearman is more widely used and slightly more powerful with larger samples.

**Assumptions:**
- **Pearson's r** assumes both variables are continuous and roughly normally distributed, with a linear relationship between them. Violations (skewness, outliers, curvilinear patterns) can distort the coefficient.
- **Spearman's rho and Kendall's tau** only assume a monotonic relationship and ordinal-level data. No normality requirement — use these when Pearson's assumptions are violated.
- **Polychoric and polyserial** assume ordinal variables reflect an underlying continuous normal distribution. This is generally reasonable for Likert-type items with 4+ response categories.
- **Point-biserial and biserial** assume the continuous variable is normally distributed within each group defined by the binary variable. Biserial additionally assumes the binary split is artificial (an underlying continuum was dichotomized).
- **Phi and Cramer's V** assume a chi-square framework — expected cell frequencies should ideally be ≥ 5. With very small samples, these may be unreliable.
- **All methods** assume independent observations — each row should represent a separate case, not repeated measurements from the same subject.

### Mixed/Auto selection logic

When you select **Mixed/Auto**, the method for each pair is chosen based on variable types:

| Left variable | Right variable | Method used |
|---|---|---|
| Continuous | Continuous | Pearson's r |
| Ordinal | Ordinal | Polychoric |
| Continuous | Ordinal | Polyserial |
| Binary | Binary | Phi coefficient |
| Continuous | Binary | Point-biserial |
| Ordinal | Binary | Polychoric (binary treated as ordinal) |
| Categorical | Categorical | Cramer's V |
| Binary | Categorical | Cramer's V |
| Continuous/Ordinal | Categorical | Incompatible (no result) |

## Display options

### Table format

- **Matrix** (default) — correlation matrix with variables on both axes
- **Long format** — flat table with one row per variable pair

### P-value display (matrix only)

- **Combined with correlation** (default) — each cell shows the coefficient with significance stars on one line and the p-value below it
- **Separate p-value table** — the matrix shows only coefficients, and separate p-value matrices appear below

### Hide redundant values

Enabled by default. When the matrix is symmetric (same variables on both axes), only the lower triangle is shown. Uncheck to see the full matrix.

### Edge bundling visualization

Check **Include edge bundling visualization** to generate a network graph alongside the table output. See [visualization](#edge-bundling-visualization) below.

## Reading results

### Matrix format

Each cell shows:

- The correlation coefficient with the method's symbol (r, ρ, τ, φ, V, D, γ)
- Significance stars based on your [significance settings](./settings.md#significance-formatting)
- The p-value (formatted according to your [p-value settings](./settings.md#p-value-settings))
- Adjusted p-value, if [adjustment](./settings.md#multiple-comparison-adjustment) is enabled in addition mode
- Diagonal cells show a dash (a variable's correlation with itself is always 1)
- Error cells are highlighted in red

### Long format

Columns include:

- **Variable 1** and **Variable 2**
- **Method** — shown only for Mixed/Auto; displays the symbol used for that pair, with the full method name in a tooltip
- **Coefficient** — the correlation value with significance stars
- **p-value** — and adjusted p-value if enabled in addition mode
- **Interpretation** — if the [interpretation setting](./settings.md#significance-formatting) is turned on

### Interpretation

When enabled, each correlation receives a plain-language description combining three parts:

- Significance — "Significant" or "Insignificant"
- Strength — negligible (< 0.1), very weak (0.1–0.3), weak (0.3–0.5), moderate (0.5–0.7), strong (0.7–0.9), or very strong (≥ 0.9)
- Direction — positive or negative

For example: "Significant moderate positive correlation" or "Insignificant weak negative correlation."

> **Why "insignificant" doesn't mean "no relationship":** a non-significant result means there isn't enough evidence to conclude a relationship exists *in the population* — not that the variables are definitely unrelated. With small samples, even moderate correlations can be non-significant simply because there isn't enough data. With very large samples, even tiny correlations can be significant while being practically meaningless. Always consider the coefficient size alongside the p-value.

## P-value adjustment

Correlation matrices involve many simultaneous tests — a 10-variable matrix produces 45 unique pairs. Without adjustment, some results will appear significant by chance alone.

If no [adjustment method](./settings.md#multiple-comparison-adjustment) is selected, a warning appears recommending you consider one.

## Missing data

Missing values are handled by the global [missing data setting](./settings.md#missing-data):

- **Pairwise** (default) — each pair uses all cases where both variables have values
- **Listwise** — only cases complete across all selected variables are used
- **Imputation** — missing values are replaced with substitutes (mean, median, mode, or a constant) before analysis

> **Pairwise vs. listwise:** pairwise keeps more data but can produce correlation matrices that aren't internally consistent (e.g. variable A correlates with B and B with C, but the A–C correlation seems off because different subsets of cases were used). Listwise avoids this but may discard a lot of data if missingness is spread across many variables.

> **A note on imputation:** replacing missing values can artificially reduce variability, which tends to pull correlations toward zero. Mean and median imputation are the most prone to this. If you have a lot of missing data, consider whether pairwise deletion might be more appropriate for correlation analysis.

## Edge bundling visualization

When the visualization checkbox is enabled, a separate output card titled "Correlation Network" appears with a circular network diagram.

### What the visualization shows

- Variables are arranged in a circle as labeled nodes
- Curved lines (edges) connect pairs with statistically significant correlations
- Edge color indicates direction and strength — blue for positive, red for negative, gray for near-zero. A color legend from −1 to +1 appears above the chart.
- Edge thickness reflects the absolute strength of the correlation
- Strongly correlated variables are positioned closer together on the circle

### Interacting with the visualization

- **Hover** over an edge to highlight it
- **Zoom** with the mouse wheel or the +/−/reset buttons in the top-right corner
- **Resize** by dragging the handle in the bottom-right corner (minimum 400×400 px)

### Exporting

Three export buttons appear below the chart:

- **SVG** — vector format, ideal for publications and editing
- **PNG** — raster with transparent background
- **JPG** — raster with white background

You can also export all plots at once — see [reading results](./getting-started.md#reading-results) for bulk export.

## Reporting checklist

Key things to include when writing up correlation results:

**Method:**
- Correlation method used (Pearson, Spearman, etc.) and why
- How missing data were handled (pairwise or listwise deletion)
- P-value adjustment method, if any
- Sample size

**Results:**
- The correlation coefficient with its symbol (r, ρ, τ, etc.)
- P-value (exact or inequality)
- Sample size per pair (if pairwise deletion was used and N varies)
- Effect size interpretation, if relevant
- For matrix output: whether the full matrix or selected pairs are reported

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) — you can inspect, copy, or re-run the exact commands. Correlation analysis uses base R (`cor.test`) for most methods and the `polycor` package for polychoric and polyserial correlations. Citations for R packages used in your analysis appear automatically at the top of the output section.

## Common pitfalls

**Correlation is not causation.** A strong correlation between ice cream sales and drowning rates doesn't mean ice cream causes drowning — both increase in summer. Correlation measures *association*, not causal direction. Establishing causation requires proper experimental design.

**Pearson's r only captures linear relationships.** Two variables can have a strong curvilinear relationship and still show r ≈ 0. Spearman's rho and Kendall's tau only help if the relationship is *monotonic* (consistently increasing or decreasing, even if non-linearly — e.g. exponential growth). They won't rescue you from a U-shaped or inverted-U pattern, which reverses direction and will produce near-zero coefficients with any of these methods. If you suspect a non-linear pattern, always visualize your data first — check the [distribution plots](./distribution-analysis.md#distribution-plots) or a scatter plot — before choosing a correlation method.

**Large matrices require care, not avoidance.** Running a 30×30 correlation matrix produces 435 tests — without correction, some will appear significant by chance. Always apply a multiple comparison correction when running a full matrix. The more important question is whether your analysis is hypothesis-driven or exploratory: if you're selecting "interesting" pairs after seeing the results, that's exploratory regardless of matrix size, and should be reported as such. If all pairs were theoretically motivated upfront and a correction was applied, a large matrix can support confirmatory claims.

**Outliers can dominate Pearson's r.** A single extreme point can inflate or deflate a Pearson correlation dramatically. If your data has outliers, Spearman's rho (which uses ranks) is much more robust. Always visualize your data before trusting a single number.
