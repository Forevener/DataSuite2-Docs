---
title: Settings
description: Configure output formatting, p-value display, table styles, missing data handling, and other options in DataSuite 2.
---

# Settings

Click the **Settings** button (wrench icon) in the top bar to open the settings panel. The panel has a sidebar for quick navigation between sections. Changes take effect immediately — existing results on the page update in place. All settings are saved in your browser and restored automatically on your next visit.

Use the **Export** and **Import** buttons to save your settings to a JSON file or load them from one. This is useful for sharing configurations with colleagues or transferring settings between machines. The **Reset to defaults** button restores all settings to their original values.

Changed settings are highlighted with a subtle background tint, and sections with changes show a dot indicator in the sidebar.

## Display
### Language

Choose the interface language: English, Russian, or Chinese. On first visit, DataSuite detects your browser's language and picks the closest match.

### Precision mode

Controls how numbers are rounded throughout all output:

- **Decimal places** — fixed digits after the decimal point (default)
- **Significant figures (fractional only)** — counts significant digits in the fractional part only; the integer part is always preserved. This rescues small values (e.g. 0.00312 stays at 3 digits) without rounding large numbers unexpectedly.
- **Significant figures** — counts significant digits from the first non-zero digit regardless of magnitude. Standard in natural sciences.

### Precision settings

Three separate precision controls let you set different levels of detail for different types of output:

- **Descriptives & percentages** (default: 2) — means, medians, standard deviations, skewness, kurtosis, proportions, variance explained
- **Statistics & coefficients** (default: 3) — test statistics (t, F, W, χ²), effect sizes (Cohen's d, r, η²), regression coefficients, factor loadings, fit indices, confidence intervals
- **P-values** (default: 3) — all p-value output when exact format is selected

### Other display options

- **Exponential notation** — when enabled, very large or very small numbers are shown in scientific notation (e.g. 1.23e-5).
- **Auto-scroll** — when enabled, the page scrolls to the results after each analysis.

## Statistics
### Confidence level

Sets the confidence level used across all analyses that produce confidence intervals: 90%, 95% (default), 99%, or 99.9%.

### Bootstrap replications

Number of resampling iterations for bootstrap-based calculations. Range: 10–10,000. Default: 100. Higher values give more stable estimates but take longer to compute.

### Bootstrap seed

Seeds the pseudo-random generator used by every bootstrap, permutation, or resampling-based inference step — including BCa CIs in descriptive statistics, ROC bootstrap CIs in regression and comparison, lavaan bootstrap SEs in SEM and CFA, Krippendorff's α and other reliability bootstrap CIs, bicluster stability bootstrap, and the Ross MI permutation test in comparison analysis. **Empty** (default) means "use fresh randomness each run" — results vary slightly between runs even on identical data. Any integer (including 0) makes a run fully reproducible: the same seed on the same data produces identical resamples across the entire analysis. Useful when reporting results in a paper or comparing two configurations on the exact same resamples.

### Reproducibility seed

Seeds the pseudo-random generator used by non-bootstrap procedures that still depend on randomness — clustering and biclustering (initial centroids, FABIA initialization), factor-analysis parallel analysis (null-distribution Monte Carlo), cross-validation fold assignment in regression ROC, and the Shapiro-Wilk sub-sample for large residual sets. **Empty** means "use fresh randomness each run"; default is **42**. Any integer (including 0) makes these steps fully reproducible across runs. Kept separate from **Bootstrap seed** so you can vary bootstrap resamples while holding the rest of the analysis fixed (or vice versa).

### Assumption test significance level

The alpha threshold for assumption tests (normality, homogeneity of variance, sphericity, etc.). Default: 0.05. This is separate from the main significance level because assumption tests serve the opposite purpose — a higher alpha (e.g. 0.10) is *more* conservative, catching more violations.

### Statistical thresholds

Configurable cutoff values used for interpretation throughout the application. Each threshold set has labeled tiers:

**VIF collinearity thresholds** — used in regression analysis to flag multicollinearity:
- Moderate (default: 5), Severe (default: 10)

**Model fit cutoffs** — used in factor analysis and CFA to interpret fit indices:
- RMSEA: Excellent (0.05), Acceptable (0.08), Poor (0.10)
- CFI: Excellent (0.95), Acceptable (0.90)
- TLI: Excellent (0.95), Acceptable (0.90)
- SRMR: Excellent (0.05), Acceptable (0.08), Poor (0.10)

> Common alternatives: Hu & Bentler (1999) suggest stricter cutoffs (RMSEA < 0.06, CFI/TLI > 0.95, SRMR < 0.08). Some fields use more lenient thresholds (RMSEA < 0.08 as acceptable, CFI > 0.90). Adjust these to match your discipline's conventions.

**Correlation strength bands** — used to label correlation coefficients:
- Very strong (0.9), Strong (0.7), Moderate (0.5), Weak (0.3), Very weak (0.1)

> These follow Cohen's (1988) conventions widely used in psychology. Medical research and natural sciences often use different benchmarks. Evans (1996) suggests: 0.20–0.39 (weak), 0.40–0.59 (moderate), 0.60–0.79 (strong), 0.80+ (very strong).

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

- **Bold significant p-values** — significant p-values appear in bold
- **Color significant p-values** — significant p-values use a custom text color (configurable via hex input and color picker)
- **Highlight significant p-values** — significant cells get a highlighted background (enabled by default; color is configurable)
- **Significance stars** — test statistics receive asterisks (\*, \*\*, \*\*\*) based on significance level
- **Interpretation column** — adds a plain-language interpretation column to result tables

## Appearance
### Table style

Five border styles for result tables:

| Style | Description |
|---|---|
| Full borders | All cells bordered (default) |
| APA style | Top/bottom heavy borders, header separator, no cell borders |
| Borderless | No borders except a light header separator |
| Horizontal lines | Horizontal rules between all rows |
| Minimal | Top, bottom, and header borders only |

### Font

- **Font family** — choose between the system default, Arial, Times New Roman, Courier New, Georgia, or Verdana.
- **Font size** — system default or a fixed size (10–18 px).

These apply to the output section only — the rest of the interface keeps its default appearance.

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

## Plotting
### Heatmap colors

Three color settings control the color gradient used in correlation heatmaps and similar visualizations:

- **High color** (default: red #b2182b) — positive extreme
- **Mid color** (default: light gray #f7f7f7) — neutral center
- **Low color** (default: blue #2166ac) — negative extreme

### Maximum point spacing

Controls the maximum pixel distance between data points in line-based plots (default: 40 px). Lower values produce denser, smoother curves; higher values give sparser output.
