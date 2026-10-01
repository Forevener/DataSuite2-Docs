---
title: Settings
description: Configure output formatting, p-value display, table styles, missing data handling, and other options in DataSuite 2.
---

# Settings

Click the **Settings** button (wrench icon) in the top bar to open the settings panel. The panel has a sidebar for quick navigation between sections. Changes take effect as soon as you press **Save changes** – existing results on the page update in place. All settings are saved in your browser and restored automatically on your next visit. If your browser can't store them – private browsing, or a full storage quota – DataSuite tells you, and the settings still apply for the rest of the session.

Use the **Export** and **Import** buttons to save your settings to a JSON file or load them from one. This is useful for sharing configurations with colleagues or transferring settings between machines. The **Reset to defaults** button restores all settings to their original values. Both fill the panel without committing anything – press **Save changes** to apply them, or **Cancel** to discard.

Changed settings are highlighted with a subtle background tint, and sections with changes show a dot indicator in the sidebar. A value the panel can't accept – an empty box, a number outside its range, or threshold tiers listed out of order – is tinted red instead, its sidebar dot turns red, and **Save changes** stays disabled until you fix it. Counts, precisions, and seeds take whole numbers only.

An imported file is repaired rather than refused: a number outside its range is moved to the nearest allowed value, and a message lists what was adjusted. Anything that can't be repaired – a malformed color, threshold tiers that don't fit their order – is skipped and listed separately, leaving that setting as it was.

## Display
### Language

- **Language** – the interface language: English, Russian, or Chinese. On first visit, DataSuite detects your browser's language and picks the closest match.

### Precision mode

- **Precision mode** – how numbers are rounded throughout all output, one of the three modes below.
- **Decimal places** – fixed digits after the decimal point (default).
- **Significant figures (fractional only)** – counts significant digits in the fractional part only; the integer part is always preserved. This rescues small values (e.g. 0.00312 stays at 3 digits) without rounding large numbers unexpectedly.
- **Significant figures** – counts significant digits from the first non-zero digit regardless of magnitude. Standard in natural sciences.

### Precision settings

Three separate precision controls let you set different levels of detail for different types of output, each a whole number from 1 to 10:

- **Precision: descriptives & percentages** – default 2; means, medians, standard deviations, skewness, kurtosis, proportions, variance explained.
- **Precision: statistics & coefficients** – default 3; test statistics (t, F, W, χ²), effect sizes (Cohen's d, r, η²), regression coefficients, factor loadings, fit indices, confidence intervals.
- **Precision: p-values** – default 3; all p-value output when the exact display format is selected.

A value too small to show at the chosen precision is displayed as a threshold rather than a row of zeros: `< 0.001` when it is positive, `> -0.001` when it is negative, so a small negative statistic keeps its direction. Under **Significant figures (fractional only)** the extra precision renders such values in full, and **Use exponential notation for large numbers** shows them in scientific form instead.

### Other display options

- **Use exponential notation for large numbers** – off by default; when on, a number above 10 million is shown in scientific notation under **Decimal places**, and a value too small for the chosen precision is shown the same way (e.g. 1.23e-5) instead of as a threshold.
- **Scroll to results after analysis** – on by default; the page scrolls to the results after each analysis.

## Statistics
### Confidence level

- **Confidence level** – the level of every confidence interval the analyses produce: 90%, 95% (default), 99%, or 99.9%. What the level means is on the [confidence intervals](./concepts/confidence-intervals.md#b-confidence-level) page.

### Bootstrap replications

- **Bootstrap replications** – the number of resampling iterations for bootstrap-based calculations. Range: 10–10,000. Default: 100. Higher values give more stable estimates but take longer to compute.

### Permutation replications

- **Permutation replications** – the number of label reshuffles for permutation-computed p-values – the count behind the information-theoretic tests (mutual information, Jensen-Shannon divergence), the Jonckheere-Terpstra test, the Anderson-Darling test's simulated p and the energy test in [comparison analysis](./comparison-analysis.md), where the energy test trades the count down to what its sample can finish and names the count it ran on the card, and behind the moderator permutation test in [meta-analysis](./meta-analysis.md#moderators). The permutation tests of [correlation analysis](./correlation-analysis.md#p-value-method-it-methods-only) size their own count – from the significance level, with **Bootstrap replications** as the floor – and do not read this setting. Range: 99–10,000. Default: 999. A permutation p-value's resolution is $1/(\text{replications} + 1)$ – 999 gives steps of 0.001, adequate near common significance levels – which is why this setting is kept separate from **Bootstrap replications**: p-value precision can stay high without slowing every bootstrap confidence interval down.

### Bootstrap seed

- **Bootstrap seed** – seeds the pseudo-random generator behind the resampling steps of an inference – every bootstrap, and the permutation p-values of the modules that let it govern them: the shape statistics' BCa intervals and the median's bootstrap SE in [descriptive statistics](./descriptive-statistics.md#reproducibility); every resampling step in [correlation analysis](./correlation-analysis.md#reproducibility) – the bootstrap intervals, the permutation and Monte-Carlo p-values, the comparison card's bootstrap and the scatterplots' bootstrap bands; the effect-size bootstrap intervals and the ROC block's bootstrap in [comparison analysis](./comparison-analysis.md#reproducibility); the mediation, standardized-coefficient, ROC, model-comparison and path-analysis resamples in [regression analysis](./regression-analysis.md#reproducibility); lavaan's bootstrap SEs in [SEM and CFA](./structural-equation-modeling.md#reproducibility); the loadings' and omega coefficients' bootstrap intervals in [factor analysis](./factor-analysis.md#reproducibility); the reliability coefficients' bootstrap CIs in [reliability analysis](./reliability-analysis.md#r-reproducibility) and the agreement coefficients' – Krippendorff's α, the κ coefficients, Kendall's W, the standard error of measurement and the signal-detection indices – in [reproducibility & agreement](./reproducibility-analysis.md#r-reproducibility); the Q3\* bootstrap in [IRT analysis](./irt-analysis.md#local-dependence); the cluster and bicluster stability and consensus bootstraps in [cluster analysis](./cluster-analysis.md#reproducibility); the interval-censored Cox bootstrap in [time to event analysis](./time-to-event-analysis.md#interval-censored-cox-regression); and the moderator permutation test in [meta-analysis](./meta-analysis.md#moderators). Comparison analysis keeps its permutation and simulated p-values – Fisher's, the goodness-of-fit test's, Anderson-Darling's, Jonckheere-Terpstra's, the information-theoretic and energy tests' – under fixed seeds of their own, so they repeat whatever this setting says; its [Reproducibility](./comparison-analysis.md#reproducibility) section lists them. **Empty** (default) means "use fresh randomness each run" – results vary slightly between runs even on identical data. Any integer (including 0) makes a run fully reproducible: the same seed on the same data produces identical resamples across the entire analysis. Useful when reporting results in a paper or comparing two configurations on the exact same resamples. {#bootstrap-seed-empty-random #bootstrap-seed}

### Reproducibility seed

- **Reproducibility seed** – seeds the pseudo-random generator behind the draws that are part of an estimator rather than of an inference – an algorithm's starts, a subsample, a fold deal: the k-means starts, the gap statistic's reference draws and the Hopkins statistic in [cluster analysis](./cluster-analysis.md#reproducibility), and the biclustering algorithms' initialization; parallel analysis, the rotations' random starts, the VSS and MAP sweep and the Schmid-Leiman re-fit in [factor analysis](./factor-analysis.md#reproducibility); every fold deal, half sample and sample split in [regression analysis](./regression-analysis.md#reproducibility) – the ROC cross-validation, regularized estimation's tuning and its stability selection – and its Shapiro-Wilk sub-sample above the large-n cutoff, as in [time series analysis](./time-series-analysis.md#reproducibility); the MCD subsampling behind multivariate outlier detection in [SEM and CFA](./structural-equation-modeling.md#reproducibility) and [IRT analysis](./irt-analysis.md#r-reproducibility), and IRT's resampled individual reliability; the community search's annealing in [correlation analysis](./correlation-analysis.md#reproducibility); and the balanced subsample behind the explanatory measure ξ in [comparison analysis](./comparison-analysis.md#reproducibility). **Empty** means "use fresh randomness each run"; default is **42**. Any integer (including 0) makes these steps fully reproducible across runs; an empty seed under regression's ROC cross-validation is drawn at random and kept as `cv_seed` in the R session, so that run can still be repeated. Kept separate from **Bootstrap seed** so you can vary bootstrap resamples while holding the rest of the analysis fixed (or vice versa). {#reproducibility-seed-empty-random #reproducibility-seed}

### Assumption test significance level

- **Assumption test significance level** – the alpha threshold for assumption tests (normality, homogeneity of variance, sphericity, etc.). Range: 0.001–1. Default: 0.05. This is separate from the main significance level because assumption tests serve the opposite purpose – a higher alpha (e.g. 0.10) is *more* conservative, catching more violations; see [which null](./concepts/hypothesis-testing.md#which-null). The p-values and statistics in those tables are highlighted and starred against this level too, not the main one, so a cell's formatting agrees with the verdict beside it – [significance formatting](#significance-formatting) says which tables read which level.

### Assumption advisory thresholds

Three judgment cutoffs used by the [correlation assumption checks](./correlation-analysis.md#checking-assumptions) for advisories that aren't formal hypothesis tests. The last of them is shared with the [comparison assumption checks](./comparison-analysis.md#test-recommendations), which read it as the sample size below which a normality failure can no longer be waved off by the central limit theorem:

- **Heavy-ties advisory threshold (rank-variance tie correction)** – the value of the tie correction $\sum(t^3 - t)/(n^3 - n)$ above which a variable trips the *Acceptable ties* verdict (rank methods' p-values become unreliable). This is the tie term that actually enters the rank statistics' variances, not the share of tied observations – which sits near 1 for every ordinal variable and near 0 for every continuous one, and so separates nothing. With `k` roughly equal levels it is ≈ `1/k²`, so the default flags three or fewer effective levels and any strongly piled-up binary or ordinal variable, while a balanced 5-point Likert scale (≈ 0.04) passes. Default: 0.10.
- **Range-restriction advisory threshold (dominant value share)** – the share of observations held by a single value above which a variable trips the *Adequate spread* verdict (a dominant value attenuates correlations through that variable). Default: 0.5.
- **Small-sample advisory floor (N)** – the per-pair complete-case count below which a *small sample* advisory is added to the suitable-methods synthesis. Default: 30.

### Statistical thresholds

Configurable cutoff values used for interpretation throughout the application. Each threshold set has labeled tiers, and the tiers must stay in order – rising where a higher value is worse (VIF, RMSEA, SRMR, HTMT), falling where a higher value is better (CFI, TLI, and every strength band):

- **VIF collinearity thresholds** – used in regression analysis to flag multicollinearity: Moderate (default: 5), Severe (default: 10).
- **RMSEA fit cutoffs** – grade RMSEA in factor analysis, CFA and SEM: Excellent (0.05), Acceptable (0.08), Poor (0.10).
- **CFI fit cutoffs** – grade CFI in factor analysis, CFA and SEM: Excellent (0.95), Acceptable (0.90), Poor (0.85).
- **TLI fit cutoffs** – grade TLI in factor analysis, CFA and SEM: Excellent (0.95), Acceptable (0.90), Poor (0.85).
- **SRMR fit cutoffs** – grade SRMR in factor analysis, CFA and SEM: Excellent (0.05), Acceptable (0.08), Poor (0.10).

> Common alternatives: Hu & Bentler (1999) suggest stricter cutoffs (RMSEA < 0.06, CFI/TLI > 0.95, SRMR < 0.08). Some fields use more lenient thresholds (RMSEA < 0.08 as acceptable, CFI > 0.90). Adjust these to match your discipline's conventions.

- **HTMT discriminant validity cutoffs** – grade the heterotrait-monotrait ratio in [SEM and CFA](./structural-equation-modeling.md#discriminant-validity): Borderline (default: 0.85), Poor (default: 0.90). Values below the borderline threshold indicate good discriminant validity; the card's own legend quotes whichever values are in force.

> The 0.85 HTMT cutoff is the conservative convention; 0.90 is sometimes used for conceptually similar constructs.

- **Correlation strength bands** – label signed correlation coefficients (Pearson, Spearman, Kendall, and the other −1…+1 measures): Very strong (0.9), Strong (0.7), Moderate (0.5), Weak (0.3), Very weak (0.1).

> These follow Cohen's (1988) conventions widely used in psychology. Medical research and natural sciences often use different benchmarks. Evans (1996) suggests: 0.20–0.39 (weak), 0.40–0.59 (moderate), 0.60–0.79 (strong), 0.80+ (very strong).

The unsigned (0–1) and special measures carry their own band sets, since they sit on different scales:

- **Normalized mutual information bands** – for the information-theoretic family (NMI, AMI, coherence, Theil's U): Very strong (0.7), Strong (0.5), Moderate (0.3), Weak (0.15), Very weak (0.05)
- **Correlation ratio (ε²) bands** – Very strong (0.25), Strong (0.14), Moderate (0.06), Weak (0.01), Very weak (0.005), extending Cohen's (1988) η² benchmarks (.01 small, .06 medium, .14 large); they read the bias-corrected ε² the module reports, which is the population quantity those benchmarks were written for
- **Cramér's V bands** – Very strong (0.5), Strong (0.3), Moderate (0.15), Weak (0.1), Very weak (0.05), from Cohen's (1988) df = 1 benchmarks, the 2×2 table's; the same effect gives a lower V in a larger table, so there these bands under-call it
- **Hoeffding's D bands** – Very strong (0.3), Strong (0.15), Moderate (0.08), Weak (0.03), Very weak (0.01); D uses the Hmisc ~−0.5…1 scale, well below the mutual-information range, so its cutoffs are empirical
- **Chatterjee's ξ bands** – Very strong (0.6), Strong (0.3), Moderate (0.15), Weak (0.05), Very weak (0.02); ξ saturates only near a deterministic relationship and sits well below the mutual-information scale for noisy data, so its cutoffs map the standard correlation bands through the measured ξ(ρ) curve

## P-value settings
### Display format

- **p-value display format** – how p-values are printed in every results table, one of the three formats below.
- **Exact value** – shows the computed p-value (e.g. 0.031), at the **Precision: p-values** setting (default). {#exact-value-eg-0031}
- **Category** – shows a threshold label (e.g. p ≤ 0.05). {#category-eg-p-le-005}
- **Hide p-values** – p-values are not displayed.

### Multiple comparison adjustment

When running [many tests at once](./concepts/hypothesis-testing.md#many-tests-at-once), p-values can be adjusted to control false positives.

- **P-value adjustment method** – the correction applied to p-values, within each table's own family of tests – never across tables or analyses. One of the methods below; the default is none.
- **None** – p-values are reported as computed (default).
- **Bonferroni** – multiplies each p-value by the number of tests; see [Bonferroni](./concepts/hypothesis-testing.md#b-bonferroni).
- **Holm** – Bonferroni's guarantee, stepped down from the smallest p, and never less powerful; see [Holm](./concepts/hypothesis-testing.md#b-holm).
- **Hommel** – a refinement of Hochberg under the same condition, a little more powerful again; see [Hommel](./concepts/hypothesis-testing.md#b-hommel).
- **Hochberg** – Holm run from the largest p downward, slightly more powerful, valid when the tests are independent or positively related; see [Hochberg](./concepts/hypothesis-testing.md#b-hochberg).
- **FDR (Benjamini-Hochberg)** – controls the false discovery rate rather than the chance of any false positive; see [Benjamini-Hochberg](./concepts/hypothesis-testing.md#b-benjamini-hochberg-fdr).
- **FDR (Benjamini-Yekutieli)** – the false discovery rate under any pattern of dependence between the tests, paid for with a larger correction; see [Benjamini-Yekutieli](./concepts/hypothesis-testing.md#b-benjamini-yekutieli-fdr).
- **Adjusted p-values display** – where the adjusted p-value goes, one of the two options below.
- **Show both original and adjusted** – the adjusted p-value appears beside the original (default).
- **Replace with adjusted values** – the adjusted p-value takes the original's place.

> **Which adjustment to use?** Holm by default, Benjamini-Hochberg for exploratory work with many tests, Bonferroni where a reviewer expects it – the reasoning, with a worked example, is under [which adjustment to use](./concepts/hypothesis-testing.md#which-adjustment-to-use).

### Significance level

- **Significance level** – the alpha threshold for significance. Range: 0.001–0.499. Default: 0.05. This controls when results are flagged as significant; what the threshold means, and what "significant" does not mean, is on the [hypothesis testing](./concepts/hypothesis-testing.md#significance) page. It is independent of the confidence level – a test at α = 0.01 beside a 95% interval can disagree on the same effect, so change both to keep them matched.

### Significance formatting

Several options can be combined:

- **Bold significant p-values** – significant p-values appear in bold.
- **Color significant p-values** – significant p-values use the **Text color** below.
- **Text color** – the color of significant p-values when **Color significant p-values** is on; a hex value or the color picker. Default: red (#ff0000).
- **Highlight significant p-values** – significant cells get a highlighted background (enabled by default).
- **Background color** – the highlight's color; a hex value or the color picker. Default: light green (#e6ffe6).
- **Show interpretation column** – adds a plain-language interpretation column to result tables that have one (enabled by default). {#show-interpretation-column-when-applicable}
- **Add significance stars to test statistics** – test statistics receive asterisks (\*, \*\*, \*\*\*) based on significance level (e.g. W\*). {#add-significance-stars-to-test-statistics-eg-w}

Which level "significant" means depends on the table. A results table reads the [significance level](#significance-level). A table whose verdict is an assumption check reads the [assumption test significance level](#assumption-test-significance-level) instead – the [comparison module's assumption checks](./comparison-analysis.md#checking-assumptions) and its Mauchly's sphericity tables, the [normality tests](./distribution-analysis.md#normality-tests) card, the sampling-adequacy and multivariate-normality checks of [factor analysis](./factor-analysis.md) and [SEM and CFA](./structural-equation-modeling.md#data-diagnostics), the normality tables of the [correlation assumption checks](./correlation-analysis.md#checking-assumptions), and the model checks of [regression analysis](./regression-analysis.md#residual-diagnostics) – the residual diagnostics, the outlier test, the Brant test, the goodness-of-fit tests and the test of directed separation, every test whose null is that the model or the data are fine, with only the classification accuracy test left at the significance level; the χ² test of exact fit and the RMSEA close-fit test in the [model fit](./structural-equation-modeling.md#model-fit) table of SEM and CFA, in their model comparison's p row, and the Δχ² of the [invariance comparison](./structural-equation-modeling.md#invariance-comparison-table); and in [time series analysis](./time-series-analysis.md) the Ljung-Box tests on the raw series and on residuals, the residual Shapiro-Wilk row and the KPSS row of the stationarity table, whose ADF and PP rows hold the opposite null – a unit root – and keep the significance level – so the bold, color, highlight and stars on a p-value follow the verdict beside it, whichever way the two levels are set. In the sphericity table the Greenhouse-Geisser and Huynh-Feldt corrected p-values are the omnibus test's own and keep the significance level. The rule behind the list – the null decides the level – is stated once, under [which level a table reads](./concepts/hypothesis-testing.md#b-which-level-a-table-reads).

## Appearance
### Table style

- **Table style** – the border style of every result table, one of the five below.
- **Full borders** – all cells bordered (default). {#full-borders-all-cells}
- **APA style** – top and bottom heavy borders and a header separator, no cell borders. {#apa-style-top-bottom-header}
- **Borderless** – no borders except a light header separator. {#borderless-header-separator-only}
- **Horizontal lines only** – horizontal rules between all rows.
- **Minimal** – top, bottom, and header borders only. {#minimal-top-bottom-header}

### Font

- **Font family** – the output's font: the system default, Arial, Times New Roman, Courier New, Georgia, or Verdana.
- **Font size** – the output's font size: the system default or a fixed size, 10 to 18 px.
- **System default** – the output keeps the interface's own font family or size (default for both).

These apply to the output section only – the rest of the interface keeps its default appearance.

### Indicator colors

- **Indicator color: good** – the color of a favourable verdict – a passed check, a good fit – in status marks and graded cells across the results. Default: green (#198754).
- **Indicator color: bad** – the color of an unfavourable verdict. Default: red (#dc3545).
- **Indicator color: uncertain** – the color of a borderline or cautionary verdict. Default: amber (#ffc107).

## Missing data
### Method

- **Global missing data method** – how missing values are handled before every analysis, one of the three methods below.
- **Pairwise deletion** – the default; excludes cases only when they have missing values in the specific variables being analyzed. Maximizes available data for each calculation. {#pairwise-deletion-use-available-data-for-each-pass}
- **Listwise deletion** – excludes any case that has a missing value in any selected variable. Ensures all analyses use the same subset of complete cases. {#listwise-deletion-remove-rows-with-any-missing-values}
- **Imputation** – replaces missing values with computed substitutes before analysis, by the **Imputation method** below. {#imputation-replace-with-calculated-values}

> **Listwise deletion can empty your data.** One sparse variable in the selection – a skip-logic branch, an optional measure – removes every case that left it blank. When the pass removes all cases, or leaves half of them or fewer, the **Data preview** card shows a warning naming the selected variables with the most missing values. Deselect those variables in the [Variables dialog](./getting-started.md#choosing-variables), or switch back to pairwise deletion.

### Imputation options

- **Imputation method** – the replacement strategy when imputation is selected, one of the four below. Every blank in a column takes the one value the method computes, and categorical variables always take the mode – see [what imputation costs](#b-what-imputation-costs).
- **Mean** – numeric variables only; replaces missing values with the variable's mean (default).
- **Median** – numeric variables only; replaces with the median.
- **Mode** – replaces with the most frequent value (works for both numeric and categorical variables).
- **Constant value** – replaces with the fixed value set under **Constant value** below. {#imputation-method-constant-value}
- **Constant value** – the value the constant method substitutes. Default: 0. {#constant-value}

> **What imputation costs.** Every method here is single-value substitution: each blank in a column takes the same value, so the column's SD shrinks, its correlations and loadings attenuate toward zero, and n stays at full size – tests run on inflated degrees of freedom. The **Imputation method** setting repeats this under the control. Prefer pairwise or listwise deletion unless an analysis needs a complete matrix ([reliability](./reliability-analysis.md#missing-data), [cluster analysis](./cluster-analysis.md#missing-data)), and report imputed data as such.

Missing data handling is applied globally – it affects all analyses equally. You can also filter cases manually using the [case filter](./getting-started.md#filtering-cases).

## Plotting
### Heatmap colors

Three color settings control the color gradient of the bicluster heatmap in [cluster analysis](./cluster-analysis.md):

- **Heatmap high color** – the positive extreme. Default: red (#b2182b).
- **Heatmap mid color** – the neutral center. Default: light gray (#f7f7f7).
- **Heatmap low color** – the negative extreme. Default: blue (#2166ac).

### Maximum point spacing

- **Maximum point spacing (px)** – caps the starting width of cluster analysis's plots – the k-selection plots, the dendrogram and the others drawn over a handful of points – at this many pixels per plotted point, so a plot of few points is drawn narrower rather than stretched across the card. Range: 10–200. Default: 40. Drag the plot's resize handle to widen it afterwards.
