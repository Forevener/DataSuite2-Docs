---
title: Settings
description: Configure output formatting, p-value display, table styles, missing data handling, and other options in DataSuite 2.
---

# Settings

Click the **Settings** button (wrench icon) in the top bar to open the settings panel. Changes take effect immediately — existing results on the page update in place. All settings are saved in your browser and restored automatically on your next visit.

## Language

Choose the interface language: English, Russian, or Chinese. On first visit, DataSuite detects your browser's language and picks the closest match.

## Output formatting

- **Decimal places** (0–10) — controls how many digits appear in result tables. Default: 4.
- **Exponential notation** — when enabled, very large or very small numbers are shown in scientific notation (e.g. 1.23e-5).
- **Auto-scroll** — when enabled, the page scrolls to the results after each analysis.

## Font

- **Font family** — choose between the system default, Arial, Times New Roman, Courier New, Georgia, or Verdana.
- **Font size** — system default or a fixed size (10–18 px).

These apply to the output section only — the rest of the interface keeps its default appearance.

## Table style

Five border styles for result tables:

| Style | Description |
|---|---|
| Full borders | All cells bordered (default) |
| APA style | Top/bottom heavy borders, header separator, no cell borders |
| Borderless | No borders except a light header separator |
| Horizontal lines | Horizontal rules between all rows |
| Minimal | Top, bottom, and header borders only |

## Confidence level

Sets the confidence level used across all analyses that produce confidence intervals: 90%, 95% (default), 99%, or 99.9%.

## Bootstrap replications

Number of resampling iterations for bootstrap-based calculations. Range: 10–10,000. Default: 100. Higher values give more stable estimates but take longer to compute.

## P-value settings

### Display format

- **Exact** — shows the computed p-value (e.g. 0.0312)
- **Category** — shows a threshold label (e.g. "p < 0.05")
- **Hidden** — p-values are not displayed

### Multiple comparison adjustment

When running many tests simultaneously, p-values can be adjusted to control false positives. Choose an adjustment method:

- None (default)
- Bonferroni
- Holm
- Hommel
- Hochberg
- Benjamini-Hochberg (FDR)
- Benjamini-Yekutieli (FDR)

You can display both the original and adjusted values side by side, or replace the original with the adjusted value.

> **Which adjustment to use?** Bonferroni is the most conservative — it minimizes false positives but can hide real effects. Holm is strictly more powerful than Bonferroni with the same guarantees, so it's generally preferred. Benjamini-Hochberg (FDR) is a popular middle ground that controls the *rate* of false discoveries rather than eliminating them entirely — better for exploratory work. When in doubt, Holm or Benjamini-Hochberg are good defaults.

### Significance level

The alpha threshold for significance (default: 0.05). This controls when results are flagged as significant.

### Significance formatting

Several options can be combined:

- **Bold** — significant p-values appear in bold
- **Colored text** — significant p-values use a custom text color (configurable via hex input)
- **Colored background** — significant cells get a highlighted background (enabled by default; color is configurable)
- **Significance stars** — test statistics receive asterisks (\*, \*\*, \*\*\*) based on significance level
- **Interpretation column** — adds a plain-language interpretation column to result tables

## Missing data

### Method

- **Pairwise deletion** (default) — excludes cases only when they have missing values in the specific variables being analyzed. Maximizes available data for each calculation.
- **Listwise deletion** — excludes any case that has a missing value in any selected variable. Ensures all analyses use the same subset of complete cases.
- **Imputation** — replaces missing values with computed substitutes before analysis.

### Imputation options

When imputation is selected, choose the replacement strategy:

- **Mean** — numeric variables only; replaces missing values with the variable's mean
- **Median** — numeric variables only; replaces with the median
- **Mode** — replaces with the most frequent value (works for both numeric and categorical variables)
- **Constant** — replaces with a fixed value you specify

Missing data handling is applied globally — it affects all analyses equally. You can also filter cases manually using the [case filter](./getting-started.md#filtering-cases).
