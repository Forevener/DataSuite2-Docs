---
title: EFA and PCA
description: Exploratory factor analysis & PCA — extraction methods, rotation, scree plots, Schmid-Leiman transformation, and factor scores in DataSuite 2.
---

# Exploratory factor analysis & principal component analysis

The **Factor analysis** module discovers latent structure in a set of variables. It supports both Principal Component Analysis (PCA) and nine Exploratory Factor Analysis (EFA) extraction methods, with orthogonal and oblique rotations. A three-step workflow walks you through choosing settings, determining the right number of factors, and running the full extraction with loadings, diagnostics, and optional factor scores. Once the structure is clear — a single dimension or several — you can take the items to [IRT analysis](./irt-analysis.md) for item-level modelling, including multidimensional IRT.

> **PCA vs. EFA — which do I need?** Both reduce many variables down to a smaller set of dimensions, but they answer different questions. PCA creates *components* — weighted combinations of your original variables that capture maximum variance. It's a data-reduction technique: "I have 20 survey items and want to summarize them with fewer scores." EFA extracts *factors* — hypothetical latent variables that explain why your items are correlated. It's a theory-building technique: "I think there are a few underlying traits driving the responses — what are they?" In practice, PCA and EFA often give similar results, but if you're developing a psychological scale or testing theoretical structure, EFA is the better choice.

1. [Select your variables](./getting-started.md#choosing-variables) (at least 3 numeric)
2. Pick a [correlation type, extraction method, and rotation](#step-1-method--settings)
3. Set the [factor range](#configuration) and toggle [parallel analysis / scree plot](#configuration) options
4. Click **Analyze & determine factors** to check [data suitability and compare solutions](#step-2-determine-number-of-factors)
5. Set the number of factors, toggle [output options](#output-options)
6. Click **Run full analysis** for [loadings, diagnostics, and scores](#step-3-run-full-analysis)

## Requirements

At least 3 numeric variables must be selected. Categorical variables are automatically excluded.

## Step 1: Method & settings

Three settings control how the analysis is run.

### Correlation type

| Type | When to use |
|---|---|
| **Pearson** | Continuous, roughly normally distributed variables (default) |
| **Spearman** | Continuous variables with non-linear relationships or outliers |
| **Mixed (polychoric/polyserial)** | Ordinal variables (e.g. Likert scales), or a mix of ordinal and continuous |

> **Why polychoric?** Standard Pearson correlations between ordinal items (1–5 Likert scales) underestimate the true relationships because they treat the discrete responses as continuous. Polychoric correlations estimate what the correlation *would be* if the underlying trait were measured continuously. For questionnaire data, Mixed is usually the most appropriate choice.

### Extraction method

| Method | Description |
|---|---|
| **Principal Components (PCA)** | Not factor analysis — extracts components that maximize total variance. No model fit statistics. |
| **Maximum Likelihood (ML)** | Assumes multivariate normality. Produces a chi-square test and fit indices for model evaluation. |
| **Principal Axis Factoring (PA)** | Iteratively estimates communalities. No distributional assumptions. A solid default for EFA. |
| **Minimum Residual (MINRES)** | Minimizes off-diagonal residual correlations. Robust and widely recommended. |
| **Unweighted Least Squares (ULS)** | Similar to MINRES. Minimizes the sum of squared residuals. |
| **Weighted Least Squares (WLS)** | Weights residuals by the inverse of their variance. |
| **Generalized Least Squares (GLS)** | Similar to ML but more robust to non-normality. |
| **Minimum Chi-Square (MINCHI)** | Minimizes sample-size-weighted chi-square. |
| **Minimum Rank (MINRANK)** | Minimizes the rank of the residual correlation matrix. |
| **Alpha Factoring** | Maximizes the generalizability (alpha reliability) of the factors. |

When PCA is selected, oblique rotations, bifactor rotation, the extraction method comparison, and the Schmid-Leiman transformation are all disabled.

> **Which extraction method?** For most situations, MINRES or PA are safe defaults — they make no distributional assumptions and handle typical data well. Use ML when your data are approximately normal and you want formal fit tests (chi-square, RMSEA, CFI). If ML fails to converge (common with non-positive definite matrices), switch to MINRES or PA.

### Rotation method

Rotation makes the factor solution easier to interpret by redistributing variance across factors.

**Orthogonal** — factors remain uncorrelated:

- **Varimax** (default) — maximizes the spread of high loadings within each factor. The most common choice.
- **Quartimax** — maximizes the spread of high loadings within each variable. Tends to produce one dominant general factor.
- **Equamax** — a compromise between Varimax and Quartimax.
- **Varimin**, **Geomin T**, **Bentler's Invariant T** — less common alternatives.
- **Bifactor** — extracts a general factor plus specific group factors. If you expect 3 content dimensions, set the number of factors to 4 (one general + three specific). See [Schmid-Leiman transformation](#schmid-leiman-transformation) for a related approach.

**Oblique** — factors are allowed to correlate:

- **Oblimin** — the most common oblique rotation.
- **Promax** — a fast approximation of oblique rotation, starting from a Varimax solution.
- **Quartimin**, **Simplimax**, **Cluster**, **Geomin Q**, **Bentler's Invariant Q**, **Biquartimin** — less common alternatives.

**None (unrotated)** — raw extraction results with no rotation applied.

> **Orthogonal vs. oblique:** if you expect your factors to be correlated (which is almost always true in psychology — anxiety and depression correlate, extraversion and sociability correlate), use an oblique rotation. It produces more realistic results and doesn't force an artificial independence. If factors turn out to be uncorrelated, oblique rotation will show near-zero factor correlations and the result will look like Varimax anyway. When in doubt, start with Oblimin.

## Step 2: Determine number of factors

Before running the full analysis, this step helps you decide how many factors or components to extract. It analyses data suitability and compares solutions across a range.

### Configuration

- **Factor/component range to test** — minimum (default: 1) and maximum (default: 6). The maximum must be less than the number of selected variables.
- **Run parallel analysis** (on by default) — compares your eigenvalues against randomly generated data
- **Show scree plot** (on by default)
- **Show per-variable MSA** (off by default) — sampling adequacy for each individual variable

Click **Analyze & determine factors** to run.

### Data suitability tests

A summary table with three checks:

- **Kaiser-Meyer-Olkin (KMO)** — overall sampling adequacy, ranging from 0 to 1. Higher is better.

| KMO | Interpretation |
|---|---|
| ≥ 0.90 | Marvelous |
| ≥ 0.80 | Meritorious |
| ≥ 0.70 | Middling |
| ≥ 0.60 | Mediocre |
| ≥ 0.50 | Miserable |
| < 0.50 | Unacceptable |

- **Bartlett's test of sphericity** — tests whether the correlation matrix differs from an identity matrix. A significant result (p < 0.05) means your variables are sufficiently correlated for factor analysis.
- **Correlation matrix determinant** — very small values (< 0.00001) suggest multicollinearity, which can cause estimation problems.

> **What do these tests tell me?** KMO measures whether the partial correlations among variables are small — if they are, the variables share common factors and factor analysis makes sense. Bartlett's test checks the bare minimum: are the variables correlated at all? If KMO is below 0.50, factor analysis is probably not appropriate for your data. If Bartlett's test is not significant, your variables may be too independent to yield meaningful factors.

If the "Use interpretation" [setting](./settings.md#significance-formatting) is enabled, KMO values include the labels shown above.

### Per-variable MSA (optional)

A table sorted by MSA value (lowest first), showing each variable's individual sampling adequacy. Variables with MSA below 0.50 are highlighted in red, below 0.60 in yellow. Consider removing variables with MSA below 0.50 — they don't share enough variance with the other variables to contribute to a clean factor solution.

### Scree plot

An interactive chart showing eigenvalues across components. Look for the "elbow" — the point where eigenvalues drop off sharply.

The plot displays:

- **Actual eigenvalues** — blue line with hoverable data points
- **Kaiser criterion** — dashed red line at eigenvalue = 1
- **Simulated data** — orange dashed line (from parallel analysis, if enabled)
- **Resampled data** — green dashed line (from parallel analysis, if enabled)

Below the chart, a recommendations box summarizes three methods:

- **Kaiser criterion** — count of factors with eigenvalue > 1 (tends to over-extract)
- **Elbow method** — detected automatically using the acceleration method
- **Parallel analysis** — factors with eigenvalues exceeding the 95th percentile of random data (generally the most reliable method)

> **Which recommendation should I follow?** The three methods often disagree. Parallel analysis is considered the most accurate and is the recommended starting point. The Kaiser criterion (eigenvalue > 1) is simple but tends to suggest too many factors. The elbow method is subjective but useful as a sanity check. When methods disagree, try the different numbers and see which solution produces the most interpretable factors.

The scree plot can be exported as SVG.

### Model comparison table

A table with one row per tested factor count:

- **N** — number of factors/components
- **Eigenvalue** — for that factor number (for EFA, eigenvalues come from the reduced correlation matrix with squared multiple correlations on the diagonal)
- **Variance %** — proportion of total variance explained by that factor
- **Cumulative %** — running total. For PCA this approaches 100% as factors are added; for EFA it plateaus at the common-variance ceiling (sum of communalities ÷ number of variables) and will not reach 100%

For EFA methods, additional fit indices appear:

| Index | Good value | What it measures |
|---|---|---|
| **RMSEA** | ≤ 0.08 | How well the model approximates the population covariance matrix (lower is better) |
| **CFI** | ≥ 0.90 | Improvement over a null model where all variables are uncorrelated |
| **TLI** | ≥ 0.90 | Same as CFI but penalizes model complexity |
| **BIC** | Lowest | Bayesian information criterion — balances fit against complexity |
| **SABIC** | Lowest | Sample-size adjusted BIC |
| **SRMR** | ≤ 0.08 | Average discrepancy between observed and predicted correlations |

For both PCA and EFA:

- **Mean h²** — average communality (how much variance the factors explain across variables; bold if ≥ 0.70)
- **Complexity** — Hoffman's complexity (1.0 = each variable loads on exactly one factor; bold if ≤ 1.2)
- **Hyperplane** — variables with no loading above 0.3 on any factor (bold if 0 — every variable loads somewhere)
- **VSS1 / VSS2** — Very Simple Structure criterion at complexity 1 and 2 (bold for the best value)
- **Interpretation** — overall fit assessment (if [interpretation](./settings.md#significance-formatting) is enabled)

Values that meet "good fit" thresholds are shown in bold. Rows where the eigenvalue exceeds 1 are highlighted in blue.

> **Reading fit indices:** no single index tells the whole story. A common approach is to look for convergence — if RMSEA, CFI, and TLI all point to the same number of factors, that's a strong signal. BIC is useful for comparing models directly (lower wins). Mean communality below 0.40 suggests your factors aren't explaining enough variance in the individual variables.

## Step 3: Run full analysis

Once you've decided on the number of factors, enter it and click **Run full analysis**.

### Analysis configuration

- **Number of factors/components** — default 3; must be at least 1 and less than the number of variables
- **Compare extraction methods** button (EFA only) — [compare multiple methods](#extraction-method-comparison) side by side
- **Kaiser normalization** (off by default) — normalizes loadings before rotation. Automatically disabled for Promax and Equamax rotations (which handle normalization internally).

### Output options

| Option | Default | Notes |
|---|---|---|
| **Loadings matrix** | On | The core output — which variables load on which factors |
| **Communalities** | On | How much of each variable's variance the factors explain |
| **Variance explained** | On | How much total variance each factor accounts for |
| **Factor correlations** | Off | Only available with oblique rotations |
| **Schmid-Leiman transformation** | Hidden | Only available with oblique EFA rotations (except Biquartimin) |
| **Schmid-Leiman factor scores** | Hidden | Only available when Schmid-Leiman is enabled |
| **Anti-image correlations** | Off | Useful for diagnosing individual variable adequacy |
| **Anti-image covariances** | Off | |
| **Factor/component scores** | Off | Computes per-case scores for use in further analyses |
| **Path diagram** | Off | Visual representation of the factor structure |

When factor scores or Schmid-Leiman scores are enabled, a **Scoring method** dropdown appears:

| Method | Description |
|---|---|
| **Regression** | Maximizes correlation with the factor (default) |
| **Bartlett** | Produces unbiased estimates |
| **Anderson-Rubin** | Produces orthogonal (uncorrelated) scores |

**Loadings display threshold** — loadings below this absolute value are hidden in the table (default: 0.3). Keeping this at 0.3 or higher reduces clutter and makes the factor structure easier to read.

### Diagnostics and warnings

The analysis checks for several potential issues before and after extraction:

| Issue | Severity | Meaning |
|---|---|---|
| Non-positive definite matrix | Error (ML only) | The correlation matrix has negative eigenvalues. Use MINRES or PA instead. |
| Perfect correlations | Error | Variable pairs with r = 1.0. Remove one from each pair. |
| Ultra-Heywood case | Error | Communality exceeds 1.0 — a serious estimation problem. Try fewer factors or a different extraction method. |
| Heywood case | Warning | Communality near 1.0 — the model may be overfitting a variable. |
| High SMC | Warning | Squared multiple correlation > 0.99 — potential Heywood case. |
| Very high correlations | Warning | Variable pairs with \|r\| > 0.9 — possible multicollinearity. |
| Negative eigenvalues | Warning (EFA) | Too many factors may have been extracted. |
| Small sample size | Info | Fewer than 50 observations. Factor analysis typically needs 100+. |
| Low observations-to-variables ratio | Info | Ratio below 5:1 — results may be unstable. |

> **Heywood cases:** when a variable's communality reaches or exceeds 1.0, the model is claiming to explain more than 100% of that variable's variance — which is impossible. This usually means you're extracting too many factors, or one variable is nearly a perfect linear combination of others. Try reducing the number of factors, or check whether you have near-duplicate variables.

### Model fit indices (EFA only)

A summary table showing:

- **Chi-square test** (df, p-value) — tests whether the model fits perfectly. Almost always significant with large samples — see note below.
- **RMSEA** with 90% CI — how much error remains per degree of freedom. Think of it as "how wrong is the model, on average, for each relationship it tries to explain?" Excellent ≤ 0.05, good ≤ 0.08, mediocre ≤ 0.10, poor > 0.10.
- **CFI** — how much better your model fits compared to a baseline model where all variables are uncorrelated. Ranges from 0 to 1. Excellent ≥ 0.95, acceptable ≥ 0.90.
- **TLI** — similar to CFI but penalizes model complexity, so adding useless factors won't inflate it. Same thresholds as CFI.
- **SRMR** and corrected SRMR — average discrepancy between the correlations your model predicts and the correlations actually observed. Same thresholds as RMSEA.
- **BIC** and sample-size adjusted BIC — balance fit against complexity. Lower is better, but only meaningful when comparing different models on the same data.
- **Fit** (proportion of variance) and **Off-diagonal fit**
- **Objective function** value

Interpretations appear when the [interpretation setting](./settings.md#significance-formatting) is enabled.

> **Chi-square is almost always significant.** With large samples (N > 200), even tiny deviations from perfect fit produce significant chi-square values. Don't reject a model just because chi-square is significant — look at RMSEA, CFI, and TLI instead.

### Variance explained

A table with one row per factor/component:

- **SS Loadings** — sum of squared loadings (the factor's "strength")
- **Proportion of variance** — percentage of total variance this factor explains
- **Cumulative variance** — running total

> **How much variance is enough?** In PCA, a common (rough) guideline is 60–70% cumulative variance. In EFA, the focus is on interpretability rather than a variance threshold — a 3-factor solution explaining 45% of variance is fine if the factors make theoretical sense. Don't add factors just to push the number higher.

### Loadings matrix

The loadings table is the core output — it shows how strongly each variable relates to each factor. Interactive controls above the table let you adjust:

- **Cutoff threshold** — loadings below this value are hidden (default: 0.3)
- **Highlight threshold** — loadings at or above this value are shown in bold (default: 0.6)
- **Sort by** — "Original order" or "Highest loading" (groups variables by their primary factor)

Click **Update table** after changing controls.

Each row is one variable, each column is one factor/component. If communalities are enabled, a final column shows each variable's communality (values below 0.40 are flagged in yellow).

For bifactor rotations, the first column is labeled "g" (general factor) and subsequent columns are numbered from 1.

> **Reading the loadings:** a loading is the correlation between a variable and a factor. Values above 0.40 are usually considered meaningful, above 0.60 strong. A variable that loads strongly on one factor and weakly on others has a clear identity — it "belongs" to that factor. A variable that loads moderately on two or more factors (cross-loading) is ambiguous and may need to be removed or reconsidered.

> **What is communality?** Communality (h²) is the proportion of a variable's variance explained by all the extracted factors combined. High communality (> 0.60) means the factors capture that variable well. Low communality (< 0.40) means the variable is mostly unique — the factors don't account for it. Consider removing low-communality variables and re-running the analysis.

A legend below the table explains the formatting.

### Path diagram

A visual representation of the factor structure:

- **Factors/Components** — blue ellipses on the left (PC1, PC2... for PCA; F1, F2... for EFA; "g" in orange for bifactor)
- **Variables** — grey rectangles on the right (long names are truncated; hover for full name)
- **Arrows** — from factors to variables, representing loadings:
  - Green for positive loadings, red for negative
  - Thickness proportional to loading strength
  - Straight lines for primary loadings, curved for cross-loadings
  - Only loadings above the threshold are shown
- **Factor correlations** (oblique rotations) — curved double-headed arrows connecting factors on the left side

The diagram can be exported as SVG.

### Factor/component correlations (oblique rotations only)

A symmetric matrix showing correlations between all factors. The diagonal displays 1.00 in muted text.

> **High factor correlations:** if two factors correlate above 0.70, they may not be distinct enough to justify separate factors. Consider extracting one fewer factor, or using a [Schmid-Leiman transformation](#schmid-leiman-transformation) to separate the general and specific variance.

### Anti-image matrices

- **Anti-image correlation matrix** — off-diagonal elements should be small (close to zero). The diagonal contains per-variable MSA values, color-coded: green (≥ 0.80), default (0.60–0.79), yellow (0.50–0.59), red (< 0.50).
- **Anti-image covariance matrix** — same layout without the MSA color coding.

> **What are anti-image matrices?** The anti-image of a correlation is the part of the variance that *can't* be predicted from the other variables. Small anti-image correlations (off-diagonal) mean the variables share a lot of common variance — good for factor analysis. Large values suggest a variable is too unique to fit the common factor model.

### Factor/component scores

A preview of the first 10 cases with computed scores for each factor/component. A note shows the total number of scored cases and the scoring method used.

Click **Insert scores into dataset** to add the scores as new variables:

- PCA: PC1, PC2, ... (with method suffix for Bartlett or Anderson-Rubin)
- EFA: F1, F2, ... (same convention)

If variables with those names already exist, you'll be prompted to confirm overwriting. Cases with missing data receive NA values.

> **What are factor scores?** Each case (row) in your data gets a score on each factor, representing where that person or observation falls on the latent dimension. For example, in a personality questionnaire, a high F1 score might mean high extraversion. Inserting scores into the dataset lets you use them in further analyses — as predictors in [regression](./regression-analysis.md), for [clustering](./cluster-analysis.md), or for group comparisons.

## Schmid-Leiman transformation

Available for EFA with oblique rotations (except Biquartimin). The Schmid-Leiman transformation takes an existing oblique solution and re-expresses it as a hierarchy: a general factor that influences all variables plus orthogonal group factors that capture what's left over. Unlike bifactor rotation (which estimates the general and group factors simultaneously during extraction), SLT is a post-hoc decomposition — you run a standard oblique EFA first, and SLT reinterprets the correlated factors as a hierarchy.

> **When to use Schmid-Leiman:** when you find correlated factors in EFA and want to know whether there's a single overarching dimension driving them all. For example, if your anxiety, depression, and stress factors all correlate 0.50+, the Schmid-Leiman transformation can reveal a general "psychological distress" factor underlying all three, with each original factor capturing specific variance beyond the general trend.

### Omega reliability coefficients

| Metric | What it tells you |
|---|---|
| **Omega Hierarchical (ωH)** | Reliability attributable to the general factor. ≥ 0.80 = strong, ≥ 0.50 = moderate, < 0.50 = weak. |
| **Omega Total (ωT)** | Total reliability from all factors combined. Same thresholds as standard [reliability metrics](./reliability-analysis.md#reliability-metrics). |
| **Explained Common Variance (ECV)** | Proportion of common variance from the general factor. ≥ 0.70 = essentially unidimensional, ≥ 0.50 = moderate multidimensionality, < 0.50 = substantial multidimensionality. |
| **Omega Subscale** | Reliability of each group factor beyond the general factor (one value per group factor, if available). |

> **ECV and unidimensionality:** if the ECV is above 0.70, the scale is dominated by a single general factor — the subscales add little beyond the overall score. This matters for scoring: with high ECV, a total score is sufficient; with low ECV, subscale scores carry distinct information worth reporting separately.

### Variance decomposition

A table breaking down variance into the general factor and each group factor, with proportions. A highlighted total row at the bottom.

### Hierarchical factor loadings

An interactive table with the same cutoff, highlight, and sort controls as the standard loadings matrix (default highlight threshold: 0.40). Additional columns:

- **g** — general factor loading
- **F1, F2, ...** — group factor loadings
- **h²** — communality (variance explained by all factors)
- **u²** — uniqueness (variance *not* explained)
- **p²** — proportion of common variance from the general factor
- **com** — complexity (1 = loads on exactly one factor)

> **Empty group factor column?** SLT redistributes variance from the oblique factors into a general factor, which can leave some group factors with very small loadings — all below the display cutoff. This means the general factor absorbed most of that group's variance, and the group factor isn't carrying meaningful specific information. You can lower the cutoff threshold to see the residual loadings, but an empty column is usually a sign you should try extracting fewer factors — the dimension that disappeared likely wasn't distinct enough to stand on its own.

### Hierarchical path diagram

Similar to the standard path diagram but with three levels:

- **General factor "g"** — orange ellipse on the far left
- **Group factors** — blue ellipses in the middle
- **Variables** — rectangles on the right
- Dashed lines connect the general factor to variables, solid curved lines connect group factors to variables

### Schmid-Leiman factor scores

Same format as standard factor scores, but includes a "g" column plus group factor columns. Click **Insert SLT scores into dataset** to create variables named SLT_g, SLT_F1, SLT_F2, etc.

## Extraction method comparison

Accessed via the **Compare extraction methods** button in [Step 3](#step-3-run-full-analysis) (EFA only). A dialog lets you compare multiple methods side by side to see how much the choice of extraction matters.

### Method selection

Quick selection buttons:

- **Major 3 (ML, PA, MINRES)** — the three most widely used methods
- **Select all** / **Deselect all**

Plus individual checkboxes for all nine EFA methods. At least 2 must be selected. Click **Run comparison**.

### Fit metrics comparison

A table with one row per method and the same fit indices as the model comparison table (RMSEA, CFI, TLI, BIC, SABIC, SRMR, mean h², complexity, hyperplane). The best value for each metric is shown in bold. Methods that failed to converge appear in red.

### Tucker's congruence coefficients

Measures how similar the factor solutions are across methods. A summary shows the mean, minimum, and maximum congruence:

| Congruence | Interpretation |
|---|---|
| ≥ 0.95 | Excellent — solutions are essentially equivalent |
| 0.85–0.94 | Good — solutions are fairly similar |
| < 0.85 | Poor — solutions differ substantially |

A detailed table below shows congruence for each method pair, broken down by factor. Values are color-coded: green (≥ 0.95), yellow (0.85–0.94), red (< 0.85).

> **What does congruence tell you?** If different extraction methods produce nearly identical factor structures (congruence ≥ 0.95), your results are robust — the factors aren't an artifact of the chosen method. If congruence is poor, the factor structure is unstable and you should investigate why (too few observations, poorly defined factors, wrong number of factors).

## Setting interactions

Several settings affect each other:

- Choosing **PCA** disables oblique rotations, bifactor rotation, extraction comparison, Schmid-Leiman transformation, and factor correlations
- Choosing **Promax** or **Equamax** disables Kaiser normalization (handled internally by these rotations)
- Choosing an **oblique rotation** reveals the factor correlations output option
- Choosing an **oblique EFA rotation** (except Biquartimin) reveals the Schmid-Leiman option
- Enabling **Schmid-Leiman** reveals the Schmid-Leiman factor scores sub-option
- Enabling any **factor scores** option reveals the scoring method dropdown

## Missing data

Missing values are handled by the global [missing data setting](./settings.md#missing-data). Factor analysis requires a complete correlation matrix, so listwise deletion can reduce your sample size if missingness is spread across many variables.

> **Sample size for factor analysis:** rules of thumb vary widely — from 50 (absolute minimum) to 10 observations per variable to 300+ for stable results. More important than any ratio is the strength of the correlations: strong, clear factors emerge even from smaller samples, while weak factors need large samples to separate from noise. The KMO test in [Step 2](#data-suitability-tests) is a better guide than any fixed rule.

## Interpretation thresholds

When [interpretation](./settings.md#significance-formatting) is enabled, result tables include plain-language labels. Key thresholds:

| Metric | Thresholds |
|---|---|
| KMO | < 0.50 unacceptable, < 0.60 miserable, < 0.70 mediocre, < 0.80 middling, < 0.90 meritorious, ≥ 0.90 marvelous |
| RMSEA | ≤ 0.05 excellent, ≤ 0.08 good, ≤ 0.10 mediocre, > 0.10 poor |
| CFI / TLI | ≥ 0.95 excellent, ≥ 0.90 acceptable, < 0.90 poor |
| Communality | ≥ 0.70 high, ≥ 0.40 adequate, < 0.40 low |
| Loading | ≥ 0.60 strong, ≥ 0.40 moderate, < 0.40 weak |
| Omega Hierarchical | ≥ 0.80 strong, ≥ 0.50 moderate, < 0.50 weak general factor |
| ECV | ≥ 0.70 essentially unidimensional, ≥ 0.50 moderate, < 0.50 substantial multidimensionality |
| Tucker's congruence | ≥ 0.95 excellent, ≥ 0.85 good, < 0.85 poor |

## Reporting checklist

Key things to include when writing up factor analysis results:

**Method:**
- Extraction method (e.g. MINRES, ML, PCA) and why it was chosen
- Rotation method (e.g. Oblimin, Varimax) and why
- Correlation type (Pearson, polychoric, etc.)
- How the number of factors was determined (parallel analysis, scree plot, fit indices, theoretical reasoning)
- Loadings display threshold used
- Sample size and N-to-variable ratio
- How missing data were handled

**Results:**
- KMO and Bartlett's test (data suitability)
- Fit indices (RMSEA, CFI, TLI — for EFA)
- Total variance explained
- The full loadings matrix (or at least loadings above threshold), with communalities
- Factor correlations (for oblique rotations)
- Any items removed and why

**For Schmid-Leiman:** omega hierarchical, omega total, ECV, and the hierarchical loadings matrix.

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) — you can inspect, copy, or re-run the exact commands. Factor analysis uses the `psych` R package; citations for R packages used in your analysis appear automatically at the top of the output section. Parallel analysis (when enabled) draws Monte Carlo null distributions seeded by [**Reproducibility seed**](./settings.md#reproducibility-seed) — leave it empty for fresh null distributions each run, or set an integer for stable comparisons.

## Common pitfalls

Factor analysis is one of the most powerful tools in the behavioral sciences — and one of the most misused. A few things to keep in mind before interpreting your results:

**EFA discovers, it doesn't confirm.** EFA finds *a* structure that fits your data, but the same data can produce different structures depending on extraction method, rotation, and number of factors. Treating an EFA solution as evidence that the structure is "real" is circular reasoning. If you want to test whether a hypothesized structure holds, use [confirmatory factor analysis](./confirmatory-factor-analysis.md) — ideally on a separate sample.

**Factor labels are your interpretation, not the data's.** Naming a factor "Emotional Intelligence" because it has loadings from empathy, self-awareness, and mood regulation items is a creative act, not a statistical finding. The math only says these variables share variance — the meaning is your claim. Readers should be able to see the loadings and judge whether your label is reasonable.

**Don't use EFA as a "better correlation."** EFA models latent structure — it assumes your variables are caused by underlying factors. If you just want to know which variables are related, use a [correlation matrix](./correlation-analysis.md). Running EFA on variables with no theoretical reason to share a common cause (GDP, temperature, and shoe size) will happily produce factors, but they'll be meaningless.

**PCA components are not latent factors.** PCA is a data-reduction tool — it creates weighted composites that maximize explained variance. It doesn't model underlying causes. Interpreting a principal component as if it's a latent trait ("the first component *is* general intelligence") is a stronger claim than PCA supports. Use EFA when you want to make claims about latent constructs.

**Don't chase clean loadings.** It's tempting to keep removing cross-loading or low-communality variables until every item loads neatly on exactly one factor. But this can produce a scale that only "works" on your sample — you're fitting the noise. Remove items for substantive reasons (poor wording, theoretical misfit, floor/ceiling effects), not just because the loadings look prettier.

**Don't EFA and CFA the same data.** A common pattern in published research: run EFA, find 3 factors, then run CFA on the same dataset to "confirm" the structure. This is circular — of course CFA will fit well, you just extracted the structure from the same data. Split your sample (EFA on one half, CFA on the other) or use an independent replication sample.

**More factors isn't better.** Adding factors will always improve variance explained, just as adding predictors always improves R² in regression. The question is whether each factor captures a *meaningful* dimension. A 7-factor solution that explains 75% of variance is worse than a 3-factor solution that explains 50% if those extra factors are uninterpretable or contain 1–2 items each. Factors with fewer than 3 items are generally unstable.

**Sample-specific solutions.** Factor structures can vary across samples, cultures, and contexts. A 5-factor personality model extracted from American college students may not replicate in a clinical population or a different culture. Always report your sample characteristics and consider [extraction method comparison](#extraction-method-comparison) to check whether the structure is robust even within your own data.