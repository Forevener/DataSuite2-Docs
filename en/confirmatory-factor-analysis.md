---
title: Confirmatory factor analysis
description: CFA model specification, fit indices, modification indices, measurement invariance testing, discriminant validity, and model comparison in DataSuite 2.
---

# Confirmatory factor analysis

The **Confirmatory factor analysis** (CFA) module tests whether a hypothesized factor structure fits your observed data. You define which variables load on which factors using an interactive matrix, set estimation options, and run the model to get fit indices, parameter estimates, reliability metrics, modification suggestions, and an optional path diagram. The module also supports second-order factors, measurement invariance testing across groups, and side-by-side model comparison.

> **CFA is the measurement-only entry into the SEM module.** If your model has structural paths between factors (`~`), mediation, or mean structure, see [Structural equation modeling](./structural-equation-modeling.md) — same editor, additional widgets for the structural part. Pure CFA models (only `=~` measurement equations) are run through `lavaan::cfa()` so reliability and discriminant validity tables stay available.

> **EFA vs. CFA:** [Exploratory factor analysis](./factor-analysis.md) discovers structure — you let the data tell you how many factors there are and which variables load where. CFA *tests* structure — you specify the model upfront and ask "does this fit?" Use EFA when you don't have a theory yet. Use CFA when you have a specific structure to confirm — from prior EFA results, published literature, or theoretical reasoning. Critically, EFA and CFA should be run on **different samples**. Running both on the same data is circular — see [common pitfalls](./factor-analysis.md#common-pitfalls).

1. [Select your variables](./getting-started.md#choosing-variables) (at least 4 numeric for a testable model)
2. Define your [factor structure](#model-specification) in the matrix — assign indicators to factors
3. Optionally add [second-order factors](#second-order-factors) or [residual covariances](#residual-covariances)
4. Configure [estimation options](#options) (estimator, scaling, standardization)
5. Click **Check data** for [pre-flight diagnostics](#check-data), then **Run CFA** for [full results](#single-group-results)

## Model specification

The main panel is an interactive **factor-indicator matrix**. Rows are your numeric variables, columns are factors.

### Defining loadings

- **Click an empty cell** to assign a free loading (shown as a checkmark)
- **Click an assigned cell** to open a popover where you can:
  - Enter a **number** to fix the loading to that value (e.g. `1` fixes it to 1.0)
  - Enter a **letter or label** to create an equality constraint — all loadings with the same label are forced to be equal
  - Leave the field empty and press OK to revert to a free loading
  - Press the **x** button to remove the loading entirely
- **Keyboard:** Enter to confirm, Escape to dismiss the popover

### Managing factors

- Factor names are editable in the column headers (defaults: F1, F2, ...)
- **+** next to a factor name adds a new factor after it
- **x** removes a factor (the last remaining factor is cleared instead of deleted)

### Auto-detect from names

The **Auto-detect from names** button groups variables by the prefix before the first underscore — `anx_1`, `anx_2`, `anx_3` become factor `ANX`. Only groups with 2+ variables become factors. This replaces the current model.

> **Naming convention tip:** if your variables follow a `prefix_number` pattern (common in questionnaires), auto-detect can set up the entire model in one click. If your naming is inconsistent, define loadings manually.

### Clear

The **Clear** button resets the model to a single empty factor and removes all second-order factors, residual covariances, and comparison models.

### Second-order factors

When two or more first-order factors are defined, a **Second-order factors** section appears below the main matrix. It works identically to the first-order matrix — rows are first-order factors instead of observed variables, columns are second-order factors (defaults: G1, G2, ...).

> **When to use second-order factors:** when your first-order factors are strongly correlated and you believe a higher-level construct explains those correlations. For example, a questionnaire measuring Anxiety, Depression, and Stress might have a second-order "General Distress" factor. If you used the [Schmid-Leiman transformation](./factor-analysis.md#schmid-leiman-transformation) in EFA and found a strong general factor, a second-order CFA model is the natural next step.

### Residual covariances

Below the model matrix, the **Covariances** section lets you add a covariance between any pair of variables — observed ↔ observed (residual ↔ residual), factor ↔ factor, or mixed (see [SEM covariances](./structural-equation-modeling.md#covariances) for the full picture). For pure CFA, residual ↔ residual is the typical case. Select two variables from the dropdowns and click **Add**; existing pairs appear as badges with a remove button.

> **When to add residual covariances:** when two indicators share variance beyond what the factor explains — typically because they share method variance (e.g. similar wording, same response format, adjacent placement in a questionnaire). Don't add them just to improve fit — each one should be theoretically justifiable. The [modification indices](#modification-indices) section will suggest candidates.

## Options

### Factor scaling

Two methods for identifying the model:

- **Marker variable** (default) — the first indicator's loading is fixed to 1.0, giving the factor the same scale as that indicator
- **Fixed variance** — factor variance is fixed to 1.0, and all loadings are freely estimated

> **Which scaling method?** Both produce equivalent models with the same fit. Marker variable is the convention in most published research. Fixed variance is convenient when you want all loadings to be directly comparable (they're already standardized with respect to the factor).

### Factor correlations

- **Allow factors to correlate** (on by default) — oblique model. Uncheck for an orthogonal model where all factor covariances are fixed to zero.

### Estimator

| Estimator | When to use |
|---|---|
| **ML** | Default. Assumes multivariate normality. Good for continuous, roughly normal data with N > 200. |
| **MLM** | Robust ML with Satorra-Bentler correction. Use when data are continuous but non-normal. |
| **MLMVS** | Robust ML with Satterthwaite correction. Similar to MLM, alternative scaling. |
| **MLMV** | Robust ML, scale-shifted. Another robust variant. |
| **WLSMV** | Robust DWLS, mean+variance adjusted. **Recommended default for ordinal indicators** (Likert scales). |
| **ULSMV** | Robust ULS, mean+variance adjusted. Alternative for ordinal data. |
| **DWLS** | Diagonally Weighted Least Squares. Ordinal indicators, non-robust variant. |
| **ULS** | Unweighted Least Squares. Alternative for ordinal data, less common. |
| **WLS** | Weighted Least Squares. Requires large samples (N > 1000). |
| **GLS** | Generalized Least Squares. Robust to non-normality but less common in CFA. |

**Assumptions:**
- **ML** assumes multivariate normality. Check Mardia's tests in [Check data](#check-data). Use a robust estimator (MLM, MLMVS) if violated.
- **WLSMV / DWLS** assume ordinal indicators with underlying continuous distributions. Appropriate for Likert-type data.
- **All estimators** assume the model is correctly specified — CFA only tests *your* model, not whether it's the best possible model.
- Indicators should be **continuous or ordinal** with at least 4–5 response categories for ML. Binary or coarse ordinal items need WLSMV.
- **Local independence** — after accounting for the factors, indicators should not be correlated. Residual covariances relax this for specific pairs.

> **Ordinal data?** If your indicators are Likert-scale items (e.g. 1–5 or 1–7), use WLSMV (the robust, mean+variance-adjusted variant of DWLS). Standard ML treats ordinal responses as continuous, which can bias estimates and inflate chi-square. WLSMV models the underlying thresholds correctly and produces robust standard errors. Lavaan automatically promotes ML / DWLS to WLSMV when any indicator is marked ordinal — the [model summary](#single-group-results) shows what was actually used and what you requested if they differ. The [Check data](#check-data) diagnostics will recommend a thresholded estimator when ordinal variables are detected.

### Missing data

- **Listwise deletion** (default) — excludes any case with missing values on any indicator
- **FIML** (Full Information Maximum Likelihood) — uses all available data without deleting cases. Generally preferred over listwise when data are missing at random.

> **FIML vs. listwise:** FIML retains all cases and produces less biased estimates when data are missing at random. The only cost is a bit more computation. Unless you have a specific reason to use listwise deletion, FIML is the better choice for most situations.

### Standardization

Sets which standardized column is visible by default in the result tables and which variant the path diagram opens on:

- **Unstandardized** — raw metric estimates only; both standardized columns hidden
- **Completely standardized** (default) — standardized using both latent and observed variable variances. Loadings are interpretable as correlations between indicator and factor.
- **Standardized (latent only)** — standardized using latent variable variance only

After the run, you can toggle either standardized column on or off without rerunning — see [Standardized estimates toolbar](#standardized-estimates-toolbar).

### Bootstrap

When enabled, produces bias-corrected accelerated (BCa) confidence intervals. The number of replications comes from the global [bootstrap setting](./settings.md#bootstrap-replications).

### Output options

| Option | Default | What it shows |
|---|---|---|
| **Model fit indices** | On | Chi-square, RMSEA, CFI, TLI, SRMR, and more |
| **Parameter estimates** | On | Loadings, covariances, variances, R² |
| **Modification indices** | On | Suggested model improvements |
| **Factor reliability (CR, AVE)** | On | Per-factor composite reliability and convergent validity |
| **Residual correlation matrix** | Off | Localized areas of misfit |
| **Discriminant validity** | Off | HTMT, Fornell-Larcker criterion |
| **Path diagram** | On | Visual model diagram |

### lavaan syntax

An expandable section in the right column shows the **lavaan syntax** generated from your model. It is *not* a one-way preview — anything you type there flows back into the matrix, just as anything you do in the matrix flows into the text. There's no Apply/Cancel button — the matrix updates automatically as you type. The parser handles `=~` for loadings, `~~` for covariances, fixed values like `1*x1`, equality labels, backtick-quoted names, and continuation lines ending with `+`. A **Copy** button copies the current text to the clipboard.

> **Importing models from publications:** if a paper reports its CFA model in lavaan notation, paste it into the box and the matrix reorganizes to match. Often faster than building the model cell by cell.

## Check data

The **Check data** button runs pre-flight diagnostics without fitting a model. If a model is defined, it checks only the model's indicators; otherwise it checks all selected numeric variables.

The report covers:

- **Sample size** — total N, complete cases, cases per variable, minimum N for the weight matrix
- **Missing data** — total missing percentage
- **Covariance matrix** — positive definiteness, minimum eigenvalue, condition number
- **Multivariate normality** — Mardia's skewness and kurtosis tests
- **Mahalanobis outlier detection** — multivariate outliers at p < .001 (expandable case details)
- **High correlations** — pairs with |r| > 0.85
- **Non-normal variables** — |skewness| > 2 or |kurtosis| > 7
- **Low variance variables** — very low coefficient of variation
- **Ordinal variables** — auto-detected integer variables with 2–10 unique values, with a recommendation to use DWLS
- **Recommendations** — actionable suggestions (use FIML, switch to robust estimator, etc.)

> **Run diagnostics before fitting.** Five minutes of checking data can save you from convergence errors and uninterpretable results. Pay special attention to the covariance matrix check — a non-positive-definite matrix will prevent estimation. High correlations between indicators that load on different factors may indicate cross-loadings or a misspecified model.

## Validation rules

- Each factor must have at least **2 indicators**
- Each second-order factor must have at least **2 first-order factors**
- The model must be at least just-identified (**df ≥ 0**). A just-identified model (df = 0) produces a warning — fit indices are not meaningful with zero degrees of freedom.

## Single-group results

Results appear in a **Confirmatory factor analysis** output card. A model summary at the top lists factors, number of indicators, estimator, degrees of freedom, sample size, free parameters, and N-to-parameter ratio. If lavaan auto-upgraded the estimator (e.g. ML → WLSMV because an indicator is ordinal), the summary shows the actual estimator with the requested one in parentheses, so the substitution is never invisible. Under FIML, the displayed sample size is the full N (lavaan estimates on every case), not just complete cases.

Two action buttons below the summary:

- **Restore this model** — reverts the specification panel to the state used for this run
- **Add to comparison** / **Remove from comparison** — toggles the model in the [comparison set](#model-comparison)

### Model fit indices

A table of standard fit indices with traffic-light interpretation (when [interpretation](./settings.md#significance-formatting) is enabled):

| Index | Good | Acceptable | What it measures |
|---|---|---|---|
| **CFI** | ≥ 0.95 | ≥ 0.90 | How much better your model fits compared to a baseline where all variables are uncorrelated. 1.0 = perfect improvement. |
| **TLI** | ≥ 0.95 | ≥ 0.90 | Same idea as CFI but penalizes model complexity — adding unnecessary factors won't inflate it. |
| **RMSEA** | ≤ 0.05 | ≤ 0.08 | Error per degree of freedom — "how wrong is the model, on average, for each relationship it tries to explain?" |
| **SRMR** | ≤ 0.05 | ≤ 0.08 | Average discrepancy between observed correlations and the correlations the model predicts. |
| **GFI** | ≥ 0.95 | ≥ 0.90 | Proportion of variance in the observed covariance matrix explained by the model. Analogous to R². |
| **AGFI** | ≥ 0.90 | ≥ 0.85 | GFI adjusted for model complexity (degrees of freedom). |

Additional indices: NFI, RFI, IFI, PNFI, PGFI, AIC, BIC, sample-adjusted BIC.

Chi-square includes df and p-value — it tests whether the model fits perfectly, which is almost always rejected with large samples (N > 200). Don't discard a model on chi-square alone. RMSEA includes a 90% confidence interval and p-close (the probability that RMSEA ≤ 0.05). When a robust estimator is used, scaled/robust versions are reported with a note at the top.

> **Fit indices in context:** no single index is definitive. Look for convergence — if CFI, TLI, RMSEA, and SRMR all indicate acceptable fit, you can be reasonably confident. If they disagree, investigate why. Chi-square is almost always significant with N > 200, so don't reject a model on chi-square alone. AIC and BIC are not useful in isolation — they're for [comparing models](#model-comparison).

### Path diagram

An SVG visualization of the fitted model:

- **Latent factors** — blue ellipses
- **Observed variables** — grey rectangles
- **Loadings** — arrows from factors to variables, color-coded (green positive, red negative), thickness proportional to strength. Non-significant loadings (p > .05) are dashed at reduced opacity.
- **Factor correlations** — double-headed curved arrows on the left
- **Second-order factors** — purple ellipses to the left of first-order factors, with orange arrows
- **Error terms** — small orange circles to the right of each variable
- **Residual covariances** — dashed double-headed arrows to the right of variables

Loading values are displayed on the paths. A legend at the bottom explains the visual encoding.

A **standardization picker** sits above the diagram — three radio buttons that toggle between unstandardized, latent-only standardized (`std.lv`), and completely standardized (`std.all`). Switching is instant — all three variants are pre-rendered and the picker just swaps which is visible. Each variant has its own **Export as SVG** filename suffix.

### Standardized estimates toolbar

The first parameter-estimate table is preceded by a small toolbar with two checkboxes — **Latent only** and **Completely standardized**. Toggling them shows or hides the corresponding `Std. (latent only)` and `Std. (completely)` columns across every estimate table at once. The unstandardized **Estimate** column is always visible.

> The toolbar makes it easy to compare standardized and unstandardized side by side without rerunning. The default visible column matches your [Standardization](#standardization) option choice from before the run.

### Parameter estimates

When enabled, several tables of estimated model parameters appear. Each table shares a common set of columns:

- **Estimate** — the unstandardized value in the original metric
- **Std. (latent only)** — standardized using latent variance only
- **Std. (completely)** — standardized using both latent and observed variances. For loadings, this is interpretable as a correlation between the indicator and the factor.
- **CI** — confidence interval around the estimate (or bootstrap CI if [bootstrap](#bootstrap) is enabled)
- **SE** — standard error, measuring how precisely the parameter is estimated. Smaller SE = more certainty.
- **z** — the estimate divided by its SE. Larger absolute values mean stronger evidence that the parameter differs from zero.
- **p-value** — probability of seeing this estimate if the true value were zero

The tables are:

- **Factor loadings** — how strongly each indicator relates to its factor. A standardized loading of 0.70 means the factor explains about half (0.70² = 0.49) of the indicator's variance. Loadings below 0.40 suggest weak indicators.
- **Factor covariances/correlations** — the relationship between each pair of factors. The standardized column gives the correlation directly. High correlations (> 0.85) may indicate the factors aren't distinct — see [discriminant validity](#discriminant-validity).
- **Residual covariances** — shared variance between indicator pairs beyond what the factors explain (only shown if you [specified residual covariances](#residual-covariances)).
- **Factor variances** — the amount of variability in each latent factor. Negative estimates (Heywood cases) are highlighted in red.
- **Residual variances** — the leftover variance in each indicator not explained by the factor. Large residual variance relative to the total means the factor isn't capturing that item well.
- **R² (variance explained)** — each indicator's R² value, summarizing the loading information as a single proportion.

> **What does R² mean here?** In CFA, an indicator's R² is the proportion of its variance explained by the factor(s) it loads on. R² = 0.60 means the factor accounts for 60% of that item's variability. Low R² (below 0.30) suggests the item is a weak indicator — it carries more noise than signal.

> **Heywood cases in CFA:** a negative factor or residual variance is impossible in reality and signals a problem — typically a misspecified model, too few indicators per factor, or a sample that's too small. Don't ignore this — the model needs revision.

### Factor reliability

A table with per-factor reliability metrics:

| Metric | Threshold | What it measures |
|---|---|---|
| **Cronbach's alpha** | ≥ 0.70 | Traditional internal consistency (assumes equal loadings) |
| **McDonald's omega** | ≥ 0.70 | Model-based reliability (accounts for unequal loadings) |
| **Composite reliability (CR)** | ≥ 0.70 | CFA-derived reliability based on standardized loadings |
| **Average variance extracted (AVE)** | ≥ 0.50 | Convergent validity — do indicators share more variance with their factor than with error? |

See the [reliability analysis](./reliability-analysis.md) page for more on alpha vs. omega and the AVE threshold.

### Discriminant validity

Three sub-tables to assess whether your factors measure distinct constructs:

- **Factor correlations** — a matrix of inter-factor correlations. Correlations ≥ 0.85 are highlighted in red — factors that correlated may be indistinguishable.
- **HTMT (Heterotrait-Monotrait Ratio)** — a lower-triangle matrix. HTMT compares the average correlation *between* indicators of different factors to the average correlation *within* each factor. If cross-factor correlations are nearly as strong as within-factor correlations, the factors aren't distinct. Below 0.85 = good, 0.85–0.90 = borderline, above 0.90 = problematic.
- **Fornell-Larcker criterion** — diagonal shows √AVE (how much variance a factor extracts from its own indicators), off-diagonal shows factor correlations. The idea: a factor should explain more variance in its own indicators than it shares with another factor. A violation occurs when a correlation exceeds √AVE for either factor — meaning the factors share more with each other than with their own items.

> **What is discriminant validity?** It answers: "are these really *different* factors, or are they measuring the same thing?" If two factors correlate at 0.92, they might just be one factor split artificially. HTMT is generally considered more reliable than Fornell-Larcker — if HTMT < 0.85, you're in good shape.

### Modification indices

Modification indices estimate how much chi-square would drop if you freed a single currently-fixed parameter. Higher MI = bigger potential improvement. An MI of 3.84 corresponds to a significant improvement at the 0.05 level, so only suggestions above that threshold are shown.

Results are organized in three categories:

- **Suggested residual covariances** — variable pairs where adding a covariance would improve fit. Each row shows the MI value, expected parameter change (how large the covariance would be), and an **Apply** button.
- **Suggested cross-loadings** — indicators that could load on additional factors. Each row has an **Apply** button. A note warns that cross-loadings change the theoretical structure.
- **Other modification indices** — remaining parameter suggestions.

> **Use modification indices with caution.** They tell you *what* would improve fit, not *whether* you should do it. Every modification should be theoretically justifiable — "these two items share method variance because they're similarly worded" is a good reason; "it makes CFI go up" is not. Data-driven modifications capitalize on sample-specific noise and may not replicate. If you make modifications, report them transparently and ideally cross-validate on a new sample.

### Residual correlation matrix

A matrix of standardized residual correlations between indicators. Values with |r| > 0.10 are highlighted in red — these are localized areas where the model doesn't fit well.

> **Reading residuals:** large residual correlations between two indicators suggest the model is missing something about their relationship. If both load on the same factor, the factor may not fully capture their shared variance (consider a residual covariance). If they load on different factors, a cross-loading might be warranted. Patterns of large residuals in a block can signal a missing factor.

## Measurement invariance testing

When a categorical variable is selected in the **Invariance testing** dropdown, **Run CFA** performs a sequential invariance test across the groups defined by that variable (e.g. gender, age groups, countries).

> **What is measurement invariance?** Before comparing groups on a latent variable (e.g. "do men and women differ in anxiety?"), you need to show that the measurement tool works the same way in both groups. If the factor structure, loadings, or intercepts differ, group comparisons on the latent variable are meaningless — you'd be comparing apples to oranges.

The four levels, tested in order:

| Level | What's constrained | What it tests |
|---|---|---|
| **Configural** | Nothing — same structure in all groups | Do the groups have the same factor pattern? |
| **Metric (weak)** | Factor loadings equal across groups | Do the items relate to the factors the same way? |
| **Scalar (strong)** | Loadings + intercepts equal | Can we compare latent means across groups? |
| **Strict** | Loadings + intercepts + residual variances | Is the measurement error the same across groups? |

Each level is tested only if the previous level succeeded. If the configural model fails, nothing further is attempted.

### Invariance comparison table

A table with one row per invariance level. The left side shows absolute fit for each model; the right side shows how much fit *changed* from the previous level — which is what actually matters for invariance decisions:

- **Chi-square, df** — overall model misfit and degrees of freedom at each level
- **CFI, RMSEA, SRMR** — fit indices for the model at that level (same meaning as in [single-group results](#model-fit-indices))
- **Δ chi-square, Δ df, p-value** — did adding the constraints significantly worsen the fit? A significant p-value means the constraints don't hold equally across groups.
- **ΔCFI, ΔRMSEA** — practical measures of fit change. These are less sensitive to sample size than the chi-square test and are generally more trustworthy.
- **Verdict** — the overall decision:

  - **Pass** — Δ chi-square is non-significant AND practical criteria are met (|ΔCFI| ≤ 0.01, |ΔRMSEA| ≤ 0.015)
  - **Fail** — both indicators show degradation
  - **Mixed** — the criteria disagree

> **Chi-square vs. practical criteria:** the chi-square difference test is sensitive to sample size — with large N, even trivial differences become significant. Practical criteria (ΔCFI ≤ 0.01, ΔRMSEA ≤ 0.015) are more stable. When they disagree (Mixed verdict), the practical criteria are generally preferred, especially with N > 300 per group.

If the configural model shows poor fit (CFI < 0.90 or RMSEA > 0.10), a warning advises improving the model before interpreting invariance results.

### Partial invariance

When a level fails, a **parameter comparison table** shows each parameter's per-group estimates and mean delta, sorted by largest difference. An **Apply** button next to each parameter frees that constraint.

After freeing one or more parameters, click **Re-run with freed parameters** to re-test the full sequence with those parameters excluded from the equality constraints. Freed parameters accumulate across levels.

> **Partial invariance:** if full metric invariance fails because one item has different loadings across groups, you can free that item's loading and re-test. If the remaining items are invariant, you have *partial* metric invariance — still useful for group comparisons, though with the caveat that one item functions differently. The same logic applies to scalar and strict levels.

### Latent mean differences

When scalar invariance is tested, a **Latent mean differences** table shows per-factor latent means for each group. The first group serves as the reference (means fixed to 0). Columns include the estimate, SE, z-statistic, and p-value.

If scalar invariance was not established, a caveat warns that latent mean comparisons should be interpreted with caution.

> **Interpreting latent means:** a latent mean difference of 0.35 for Group B means that group scores 0.35 units higher than Group A on the latent factor. The scale depends on your factor scaling method. To get a standardized effect size, divide by the factor's standard deviation (the square root of its variance from the parameter estimates).

## Model comparison

Multiple models can be compared side by side. Use the **Add to comparison** button in each result card to queue models, then click **Compare models** (badge shows the count) once you have 2 or more.

### Comparison results

- **Fit indices comparison** — models as columns, indices as rows (chi-square, df, p, CFI, TLI, RMSEA, SRMR, AIC, BIC). Best values are highlighted in green.
- **Chi-square difference tests** — for nested model pairs (detected automatically), shows delta chi-square, delta df, and p-value. A significant result means the more constrained model fits significantly worse.

If no nested pairs are detected, a note advises comparing via information criteria instead.

> **Nested vs. non-nested models:** two models are nested when one is a constrained version of the other (e.g. an orthogonal model is nested within an oblique model — it adds the constraint that correlations = 0). The chi-square difference test only applies to nested pairs. For non-nested models (different factor structures entirely), compare AIC and BIC — lower values indicate better balance of fit and parsimony.

## Missing data handling

Missing values are handled by the [missing data option](#missing-data) in the CFA options panel. Unlike other modules that use the global setting, CFA offers FIML as an alternative to listwise deletion.

> **CFA and sample size:** CFA generally needs larger samples than EFA. A common guideline is 10–20 observations per free parameter, with an absolute minimum around 200. For invariance testing, you need adequate sample size *per group* — fewer than 50 per group is likely to produce unstable results.

## Reporting checklist

Key things to include when writing up CFA results:

**Method:**
- Model specification — which indicators load on which factors (the [lavaan syntax](#lavaan-syntax) is a compact way to communicate this)
- Estimator used (ML, DWLS, etc.) and why
- Factor scaling method (marker variable or fixed variance)
- How missing data were handled (listwise or FIML)
- Sample size and N-to-parameter ratio
- Any modifications made to the initial model and why (residual covariances, freed cross-loadings)

**Results:**
- Fit indices — at minimum chi-square (df, p), CFI, TLI, RMSEA (with 90% CI), SRMR
- Standardized factor loadings
- Factor correlations
- Factor reliability (CR, AVE) if reporting convergent/discriminant validity
- Discriminant validity evidence (HTMT or Fornell-Larcker) if relevant
- Modification indices applied (if any), with justification

**For measurement invariance:**
- Group variable, group sizes
- Fit indices at each invariance level (configural, metric, scalar, strict)
- Delta CFI and delta RMSEA for each comparison
- Which parameters were freed for partial invariance (if any)
- Latent mean differences (if scalar invariance was established)

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) — you can inspect, copy, or re-run the exact commands. CFA uses the `lavaan` R package; reliability metrics use `semTools`. Citations for R packages used in your analysis appear automatically at the top of the output section. The lavaan syntax preview also lets you export the model specification directly.

## Common pitfalls

CFA's popularity has surged in recent years — partly because reviewers increasingly expect it, and partly because software has made it accessible. But accessibility brings its own risks. A few things worth keeping in mind:

**Modification index chasing.** It's tempting to keep adding residual covariances and cross-loadings until CFI crosses the 0.95 threshold. The problem is that each data-driven modification capitalizes on sample-specific patterns that may not replicate. If you make modifications, limit them to theoretically justifiable changes, report every one, and acknowledge that the final model is exploratory rather than confirmatory.

**"Confirming" an EFA from the same data.** Running [EFA](./factor-analysis.md), finding 3 factors, and then running CFA on the same dataset to "confirm" the structure is circular — the model was extracted from that data, so good fit is expected. Split your sample (EFA on one half, CFA on the other) or use independent data. See also [EFA common pitfalls](./factor-analysis.md#common-pitfalls).

**Testing only one model.** CFA is most informative when comparing competing structures — does a 3-factor model fit better than a 2-factor? Is the second-order model better than the correlated-factors model? A single model that meets fit thresholds is consistent with the data, but there may be other models that fit equally well. Use [model comparison](#model-comparison) to evaluate alternatives.

**Reporting poor fit as acceptable.** Fit indices below standard thresholds (e.g. CFI < 0.90, RMSEA > 0.10) indicate meaningful misfit. If the model doesn't fit well, the options are to revise it (transparently), acknowledge the limitations, or reconsider the theoretical structure — not to relabel the thresholds.

**DWLS / WLSMV fit index inflation.** The DWLS family (including the recommended WLSMV variant for ordinal data) tends to produce higher CFI and lower RMSEA compared to ML on the same data. This is a known property of these estimators, not evidence of better fit. Some researchers have proposed stricter thresholds (e.g. CFI ≥ 0.99, RMSEA ≤ 0.03), though there's no universal consensus yet. Be cautious applying standard ML-derived cutoffs to DWLS or WLSMV results.

**CFA as evidence, not proof.** Good model fit means the data is consistent with your theory — it doesn't mean the theory is correct. Multiple different models can produce equivalent fit. CFA provides supporting evidence for a structure, not definitive validation. If your theory specifies *directional* relationships between factors (rather than just measurement structure), see [Structural equation modeling](./structural-equation-modeling.md) — CFA only tests the measurement part.

**Invariance testing as a checkbox.** Running the full configural → metric → scalar → strict sequence is thorough, but the value lies in understanding *which* parameters differ across groups and *why* — not just whether each level passes or fails. When invariance fails, use [partial invariance](#partial-invariance) to investigate the substantive differences.