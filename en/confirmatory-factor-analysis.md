---
title: Confirmatory factor analysis
description: CFA model specification, fit indices, modification indices, measurement invariance testing, discriminant validity, and model comparison in DataSuite 2.
---

# Confirmatory factor analysis

The **Confirmatory factor analysis** (CFA) module tests whether a hypothesized factor structure fits your observed data. You define which variables load on which factors using an interactive matrix, set estimation options, and run the model to get fit indices, parameter estimates, reliability metrics, modification suggestions, and an optional path diagram. The module also supports second-order factors, measurement invariance testing across groups, and side-by-side model comparison.

> **CFA is the measurement-only entry into the SEM module.** If your model has structural paths between factors (`~`), mediation, or mean structure, see [Structural equation modeling](./structural-equation-modeling.md) – same editor, additional widgets for the structural part. Pure CFA models (only `=~` measurement equations) are run through `lavaan::cfa()` so reliability and discriminant validity tables stay available.

> **EFA vs. CFA:** [Exploratory factor analysis](./factor-analysis.md) discovers structure – you let the data tell you how many factors there are and which variables load where. CFA *tests* structure – you specify the model upfront and ask "does this fit?" Use EFA when you don't have a theory yet. Use CFA when you have a specific structure to confirm – from prior EFA results, published literature, or theoretical reasoning. Critically, EFA and CFA should be run on **different samples**. Running both on the same data is circular – see [common pitfalls](./factor-analysis.md#common-pitfalls).

1. [Select your variables](./getting-started.md#choosing-variables) (at least 4 numeric for a testable model)
2. Define your [factor structure](#model-specification) in the matrix – assign indicators to factors
3. Optionally add [second-order factors](#second-order-factors) or [residual covariances](#residual-covariances)
4. Configure [estimation options](#options) (estimator, scaling, standardization)
5. Click **Check data** for [pre-flight diagnostics](#check-data), then **Run CFA** for [full results](#single-group-results)

## Model specification

The main panel is an interactive **factor-indicator matrix**. Rows are your numeric variables, columns are factors.

### Defining loadings

- **Click an empty cell** to assign a free loading (shown as a checkmark)
- **Click an assigned cell** to open a popover that takes the modifier in lavaan's own notation:
  - A **number** fixes the loading to that value (`1`, `0.5`)
  - A **label** creates an equality constraint – all loadings with the same label are forced to be equal (`a`)
  - `NA*` frees a loading the marker-variable scaling would otherwise fix (`NA*a` combines the two)
  - `start(.7)` supplies a starting value, and can be combined with a label (`start(.7)*a`)
  - Leave the field empty and press OK to revert to a plain free loading
  - Press the **x** button to remove the loading entirely
- **Keyboard:** Enter to confirm, Escape to dismiss the popover

> **The modifier is a set, not a single value.** A label, a start value and a fixed value coexist on one loading, so editing the label doesn't discard the start value you typed earlier. What you type is the same text lavaan would accept in the [syntax box](#lavaan-syntax), and it round-trips through both.

If the model references a variable that isn't in your current selection, the matrix keeps a muted **orphan row** for it rather than dropping it silently. You can clear the reference from that row, but not add to it – reselect the variable to edit it normally. The model still runs: a numeric column the dataset holds is resolved whether or not it is selected, and the fit is sent the selected columns plus the ones the model names. Only a name the dataset doesn't have at all is underlined and blocks the run.

### Managing factors

- Factor names are editable in the column headers (defaults: F1, F2, ...)
- **+** next to a factor name adds a new factor after it
- **x** removes a factor (the last remaining factor is cleared instead of deleted)

A rename has to survive two checks before it lands: the name must not already belong to another factor (first- or second-order), and it must be something lavaan can parse. A name that fails either is refused with a toast and the field snaps back to what it was. The same checks apply to second-order factor names, and generated defaults skip names a second-order factor already holds.

### Auto-detect from names

The **Auto-detect from names** button groups variables by the prefix before the first underscore, case-insensitively – `anx_1`, `anx_2`, `ANX_3` all land on one factor named `ANX`. Only groups with 2+ variables become factors. This replaces the current model.

> **Naming convention tip:** if your variables follow a `prefix_number` pattern (common in questionnaires), auto-detect can set up the entire model in one click. If your naming is inconsistent, define loadings manually.

### Clear

The **Clear** button in the matrix header resets *that card* – the factor-indicator matrix goes back to a single empty factor and second-order factors are removed. Everything else survives: covariances, `:=` lines, structural equations and whatever else is in the [syntax box](#lavaan-syntax) stay where they are.

To wipe the whole specification, use **Clear model** in the options column beside **Run CFA**. It empties the measurement matrix, the structural matrix, the covariance list and the syntax box in one action. Queued [comparison models](#model-comparison) are left alone either way – they refer to finished runs whose cards are still on the page, not to the draft you are clearing.

### Second-order factors

When two or more first-order factors are defined, a **Second-order factors** section appears below the main matrix. It works identically to the first-order matrix – rows are first-order factors instead of observed variables, columns are second-order factors (defaults: G1, G2, ...). Cells are operable from the keyboard as well as the mouse: Tab moves between them, Enter or Space toggles the one that has focus, and each cell announces which loading it stands for to a screen reader.

A loading whose *target* is itself a higher-order factor – a third-order line like `G2 =~ G1 + F3` typed into the [syntax box](#lavaan-syntax) – is kept as written. The matrix doesn't have a row for it, but editing an unrelated cell no longer deletes it.

> **When to use second-order factors:** when your first-order factors are strongly correlated and you believe a higher-level construct explains those correlations. For example, a questionnaire measuring Anxiety, Depression, and Stress might have a second-order "General Distress" factor. If you used the [Schmid-Leiman transformation](./factor-analysis.md#schmid-leiman-transformation) in EFA and found a strong general factor, a second-order CFA model is the natural next step.

### Residual covariances

Below the model matrix, the **Covariances** section lets you add a covariance between any pair of variables – observed ↔ observed (residual ↔ residual), factor ↔ factor, or mixed (see [SEM covariances](./structural-equation-modeling.md#covariances) for the full picture). For pure CFA, residual ↔ residual is the typical case. Select two variables from the dropdowns and click **Add**; existing pairs appear as badges with a remove button.

> **When to add residual covariances:** when two indicators share variance beyond what the factor explains – typically because they share method variance (e.g. similar wording, same response format, adjacent placement in a questionnaire). Don't add them just to improve fit – each one should be theoretically justifiable. The [modification indices](#modification-indices) section will suggest candidates.

## Options

### Factor scaling

Two methods for identifying the model:

- **Marker variable** (default) – the first indicator's loading is fixed to 1.0, giving the factor the same scale as that indicator
- **Fixed variance** – factor variance is fixed to 1.0, and all loadings are freely estimated

> **Which scaling method?** Both produce equivalent models with the same fit. Marker variable is the convention in most published research. Fixed variance is convenient when you want all loadings to be directly comparable (they're already standardized with respect to the factor).

### Factor correlations

- **Allow factors to correlate** (on by default) – oblique model. Uncheck for an orthogonal model where all factor covariances are fixed to zero.

### Estimator

| Estimator | When to use |
|---|---|
| **ML** | Default. Assumes multivariate normality. Good for continuous, roughly normal data with N > 200. |
| **MLR** | Robust ML with Huber-White standard errors. The only robust ML variant that accepts **FIML**, so it is the one to reach for when data are both non-normal and incomplete. |
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
- **ML** assumes multivariate normality. Check Mardia's tests in [Check data](#check-data). Use a robust estimator (MLR, or MLM / MLMVS under listwise deletion) if violated.
- **WLSMV / DWLS** assume ordinal indicators with underlying continuous distributions. Appropriate for Likert-type data.
- **All estimators** assume the model is correctly specified – CFA only tests *your* model, not whether it's the best possible model.
- Indicators should be **continuous or ordinal** with at least 4–5 response categories for ML. Binary or coarse ordinal items need WLSMV.
- **Local independence** – after accounting for the factors, indicators should not be correlated. Residual covariances relax this for specific pairs.

> **Ordinal data?** If your indicators are Likert-scale items (e.g. 1–5 or 1–7), use WLSMV (the robust, mean+variance-adjusted variant of DWLS). Standard ML treats ordinal responses as continuous, which can bias estimates and inflate chi-square. WLSMV models the underlying thresholds correctly and produces robust standard errors. What actually marks an indicator as ordinal is its **variable type in the data view**, not the estimator you pick: as soon as a variable used in the model is typed Ordinal, the module substitutes WLSMV for any estimator that can't handle ordered data, and the [model summary](#single-group-results) says so ("WLSMV (requested ML; substituted for ordinal indicators)"). The reverse also holds – picking WLSMV without typing the columns Ordinal fits continuous data. The [Check data](#check-data) diagnostics point out columns that look ordinal but aren't typed that way.

### Missing data

- **Listwise deletion** (default) – excludes any case with missing values on any indicator
- **FIML** (Full Information Maximum Likelihood) – uses all available data without deleting cases. Generally preferred over listwise when data are missing at random.

> **FIML vs. listwise:** FIML retains all cases and produces less biased estimates when data are missing at random. The only cost is a bit more computation. Unless you have a specific reason to use listwise deletion, FIML is the better choice for most situations.

> **FIML is an ML-family option.** It is available under ML, MLR and MLF. Selecting FIML disables MLM, MLMVS and MLMV in the estimator dropdown (lavaan rejects the combination outright) and switches you to **MLR** if one of them was already picked. With an ordinal model – where WLSMV is in force – FIML degrades to **pairwise** deletion, which is what the categorical estimators accept; with the remaining estimators it degrades to listwise. A degraded run says so: the summary's **Missing data** line names what lavaan actually applied, with *(requested FIML; unavailable with WLSMV)* beside it, so a card never reports an FIML sample size for a fit that wasn't FIML.

### Standardization

Sets which standardized column is visible by default in the result tables and which variant the path diagram opens on:

- **Unstandardized** – raw metric estimates only; both standardized columns hidden
- **Completely standardized** (default) – standardized using both latent and observed variable variances. Loadings are interpretable as correlations between indicator and factor.
- **Standardized (latent only)** – standardized using latent variable variance only

After the run, you can toggle either standardized column on or off without rerunning – see [Standardized estimates toolbar](#standardized-estimates-toolbar).

### Bootstrap

When enabled, resamples the fit to produce bootstrap confidence intervals. The number of replications comes from the global [bootstrap setting](./settings.md#bootstrap-replications).

Which interval type you get depends on that count: **BCa** (bias-corrected accelerated) requires more replications than there are analysed cases, so with fewer the run falls back to a **bias-corrected percentile** interval. The CI column header names the variant actually used, and the card renders a notice when the replication count is below 1000 (or below the sample size, which is why BCa was unavailable). The shipped default of 100 replications is below both bars – raise it before reporting bootstrap bounds.

### Output options

| Option | Default | What it shows |
|---|---|---|
| **Model fit indices** | On | Chi-square, RMSEA, CFI, TLI, SRMR, and more |
| **Parameter estimates** | On | Loadings, covariances, variances, R² |
| **Modification indices** | On | Suggested model improvements |
| **Factor reliability (α, ω, AVE)** | On | Per-factor internal consistency, composite reliability and convergent validity |
| **Residual correlation matrix** | Off | Localized areas of misfit |
| **Discriminant validity** | Off | HTMT, Fornell-Larcker criterion |
| **Path diagram** | On | Visual model diagram |

### lavaan syntax

An expandable section in the right column shows the **lavaan syntax** generated from your model. It is *not* a one-way preview – anything you type there flows back into the matrix, just as anything you do in the matrix flows into the text. There's no Apply/Cancel button – the matrix updates automatically as you type. The parser handles `=~` for loadings, `~` for regressions, `~~` for covariances and variances, `~ 1` intercepts, `:=` defined parameters, `==` equality constraints, fixed values like `1*x1`, labels, `NA*` and `start()` modifiers, `#` / `!` comments, and continuation lines ending with `+`. A **Copy** button copies the current text to the clipboard.

What you type survives a matrix edit, including the parts the matrix has no cell for:

- **Comments stay.** Both leading and trailing (`F1 =~ x1 + x2 # first factor`), and both markers (`#`, `!`). A name mentioned only inside a comment is ignored – it is neither underlined as unknown nor counted as an ordinal indicator when the estimator is chosen.
- **Inequality constraints with a constant bound** (`p > 0.2`, `q < 0.9`) round-trip and reach the fit, alongside the label-against-label form (`b > c`).
- **A parameter label that collides with a column name** stays a parameter. If your dataset has a column called `a` and your model has `F2 ~ a*F1` plus `ind := a*2`, the loading side is translated to the internal column alias while `a` on the parameter side is left alone.
- **Variance-scaling markers** (`F1 ~~ 1*F1`) are kept as you wrote them rather than regenerated, so toggling an unrelated option doesn't hand every other latent a marker it never had. Switching the **Factor scaling** radio does rewrite them, for every latent, which is the point of that control.

Column names that aren't legal lavaan identifiers – anything with a space, a hyphen, a leading digit, or a name R reserves – are shown under an automatic **alias**: `Age (years)` becomes `Age__years_`. The alias is what appears in the syntax box, in the autocomplete list and in the diagram; the original header stays visible everywhere else in the app. Pasting the original header still resolves, so a model copied from a saved file keeps working. Renaming a column in the data view rewrites the buffer to the new name rather than leaving a stale one behind – it used to block the run with "Not found in the dataset" until you fixed the text by hand. The rewrite is skipped while you are mid-edit (a pending parse, a standing syntax error, or a fit in progress), so it never discards what you were typing.

The editor also highlights lavaan syntax, underlines names that aren't in the dataset, and autocompletes variable and factor names plus the five operators. If a keystroke leaves the buffer unparseable, the matrices below freeze on the last model that parsed and a notice says so – they don't blank out or silently drift from the text.

> **Importing models from publications:** if a paper reports its CFA model in lavaan notation, paste it into the box and the matrix reorganizes to match. Often faster than building the model cell by cell.

## Check data

The **Check data** button runs pre-flight diagnostics without fitting a model, in a **Data diagnostics** card. If a model is defined, it checks exactly the variables the model names – indicators plus any observed variable appearing in a structural equation; otherwise it checks all selected numeric variables. The scope line at the top says which of the two happened and how many variables it covers. Only numerical columns are checked either way: a model naming a categorical column runs the battery on the rest and names what it left out in a toast, rather than failing part-way through.

The report covers:

- **Sample size** – total N, complete cases, complete cases per variable, minimum N for the weight matrix. When the run is model-based it also reports **Free parameters** and **Complete cases per free parameter**, and grades adequacy against that ratio instead of the per-variable one – the 5–10 cases per free parameter guideline, which is what the literature actually states.
- **Missing data** – total missing percentage, plus a per-variable table (count and percent, worst first) listing only the affected variables
- **Sampling adequacy** – whether the correlation matrix is factorable at all (see below)
- **Multivariate normality** – Mardia's skewness (a χ² with its own df) and kurtosis (a Z statistic), each with its own p-value
- **Mahalanobis outlier detection** – multivariate outliers at p < .001, with a **Distance estimator** row naming what produced the distances (see below) and expandable case details
- **Non-normal variables** – |skewness| > 2 or |excess kurtosis| > 7. Both are the same G1 / G2 estimators the rest of the app uses, so a skewness here matches the one [descriptive statistics](./descriptive-statistics.md) reports for the same column.
- **Low variance variables** – near-zero-variance columns, flagged by Kuhn's (2008) rule: a constant column, or one whose most-frequent value outnumbers the second-most-frequent by 19:1 *and* has fewer than 10% distinct values. The table shows both numbers, so you can see why a column was flagged.
- **Ordinal variables** – auto-detected integer variables with 2–10 unique values, with a recommendation to set their variable type to Ordinal (which pulls the fit to WLSMV on its own). The recommendation names only the columns that still need retyping – ones you have already marked Ordinal are listed in the table but left out of the advice.
- **Recommendations** – actionable suggestions (use FIML, switch to a robust estimator, retype ordinal columns, etc.)

### Sampling adequacy

The same factorability battery [exploratory factor analysis](./factor-analysis.md) runs, applied to the indicators before you fit them:

| Row | What it says |
|---|---|
| **Kaiser-Meyer-Olkin (KMO) measure** | How much of the correlation between indicators is common rather than pairwise. Below 0.6 the indicators may share too little common variance to support latent factors at all. |
| **Bartlett's test of sphericity** | Whether the correlation matrix differs from an identity matrix. A non-significant result means the correlations are too weak for a latent-variable model. |
| **Correlation matrix determinant** | Approaches 0 as the matrix approaches singularity. |
| **Smallest eigenvalue (correlation matrix)** | Positive means the matrix is positive-definite; zero or negative means it is not, and the model cannot be fitted as specified. |
| **Correlation matrix rank** | Printed as *rank / variables*. Anything short of full rank means some column is an exact combination of others. |

Below the table, two supplementary tables appear when they have rows. A **Reproduced by** table names each variable that a combination of the others reproduces exactly – the dependency no pairwise correlation can show, and the usual cause is a total or composite score analysed beside its own items. A pairs table lists perfectly correlated pairs (r ≥ 0.9999) and pairs above |r| > 0.9, which are the two bars the corresponding recommendations use.

> **KMO and Bartlett are withheld when the matrix is singular.** Both are read off the inverse of the correlation matrix, so on a singular matrix one falls back to a placeholder and the other is guaranteed significant for the very reason the model can't be fitted. Rather than print numbers that mean nothing, the card marks them *Unreliable (singular matrix)* and points you at the rank and the **Reproduced by** table instead.

### Diagnostics that can't be computed

A check that cannot run says so rather than disappearing. The section still renders, with a **Not assessed** row naming the reason – too few complete cases for the number of variables, a singular covariance matrix, no more complete cases than variables, a column with no variance, or an error. Previously the section was simply absent, which read like a clean result.

Columns with very little data are covered too. A column with at least one valid value gets whatever its length supports – mean, min and max always; SD and variance from two values; skewness from three; excess kurtosis from four – and is still graded by the near-zero-variance rule. Columns with fewer than three valid values are collected into their own recommendation, since they carry no usable variance or shape and will break the fit.

> **Robust distances by default.** Multivariate outliers are found with the **minimum covariance determinant** (MCD) estimator, so extreme cases cannot inflate the very covariance matrix used to detect them – the masking problem that makes the classical distance miss clustered outliers. MCD needs more complete cases than twice the number of variables and can refuse on heavily tied columns; when it can't run, the card falls back to the classical mean and covariance and states which of the three reasons applied. The threshold row changes with it: MCD distances are graded against a **chi-square threshold**, classical ones against a **scaled beta threshold**, which is the exact null for a distance computed from the same cases it is measuring. Cases are listed largest distance first, capped at 50 with the total in the heading.

> **Ordinal indicators and normality.** Mardia's tests and the univariate skewness / kurtosis bars treat every column as continuous. When the checked set includes ordinal indicators, a note under each section says so: their departure from normality is structural rather than a property of your data, and the remedy is the categorical estimator (WLSMV), not a robust continuous one. The **Non-normal variables** note names which of the flagged columns are the ordinal ones.

> **The status banner counts single variables too.** The card opens green only when nothing was flagged. A missing-data warning fires when the grid as a whole is more than 5% missing **or** any single variable is more than 20% missing – the second bar is the one that catches a single badly-missing indicator in an otherwise complete dataset.

> **Run diagnostics before fitting.** Five minutes of checking data can save you from convergence errors and uninterpretable results. Pay special attention to sampling adequacy – a non-positive-definite or rank-deficient correlation matrix will prevent estimation. High correlations between indicators that load on different factors may indicate cross-loadings or a misspecified model.

## Validation rules

- Each factor must have at least **2 indicators**. A factor column you added but never assigned anything to emits no `=~` line, so it is skipped rather than failing the check.
- Each second-order factor must have at least **2 first-order factors**
- Every name in the model must exist **in the dataset** – not necessarily in the current selection. Unknown names are underlined in the syntax box and disable **Run CFA** with a toast naming them.
- The model must be at least just-identified (**df ≥ 0**). A just-identified model (df = 0) produces a warning – fit indices are not meaningful with zero degrees of freedom.
- Free indicator intercepts together with free latent means are not jointly identified – ticking both blocks the run

A factor with exactly 2 indicators and no free link to any other latent (no regression, no second-order loading, no free covariance) raises an **advisory** warning – it runs, but such a factor is frequently unidentified in isolation.

## Single-group results

Results appear in a **Confirmatory factor analysis** output card. A model summary at the top lists factors, second-order factors (when the model has any), number of indicators, estimator, missing-data handling, degrees of freedom, sample size, free parameters, and N-to-parameter ratio. If the estimator was substituted (e.g. ML → WLSMV because an indicator is typed ordinal), the summary shows the actual estimator with the requested one in parentheses, so the substitution is never invisible; the **Missing data** line does the same for a FIML request that had to degrade. The sample size is the one lavaan itself used: under FIML that is the full N, and the summary says so alongside the complete-case count; under pairwise or listwise deletion it is the complete cases out of the total rows.

> **A fit that didn't converge still shows what it has.** Loadings, R² and the sample size are reported under the non-convergence warning, since those are what you need in order to see *why* it didn't converge. The blocks that are meaningless without a converged solution – modification indices, the residual correlation matrix, the fit indices – are skipped rather than erroring out and taking the rest of the card with them.

> **Free parameters and df come from the fitted model.** Both are read off lavaan's own parameter table rather than estimated from the widgets, so the N-to-parameter ratio and the underpowered-model warning are computed against the number lavaan actually estimated – including the parameters mean structure adds and the ones equality constraints remove.

Two action buttons below the summary:

- **Restore this model** – reverts the specification panel to the state used for this run
- **Add to comparison** / **Remove from comparison** – toggles the model in the [comparison set](#model-comparison)

### Model fit indices

A table of standard fit indices with traffic-light interpretation (when [interpretation](./settings.md#significance-formatting) is enabled):

| Index | Good | Acceptable | What it measures |
|---|---|---|---|
| **CFI** | ≥ 0.95 | ≥ 0.90 | How much better your model fits compared to a baseline where all variables are uncorrelated. 1.0 = perfect improvement. |
| **TLI** | ≥ 0.95 | ≥ 0.90 | Same idea as CFI but penalizes model complexity – adding unnecessary factors won't inflate it. |
| **RMSEA** | ≤ 0.05 | ≤ 0.08 | Error per degree of freedom – "how wrong is the model, on average, for each relationship it tries to explain?" |
| **SRMR** | ≤ 0.05 | ≤ 0.08 | Average discrepancy between observed correlations and the correlations the model predicts. |
| **GFI** | ≥ 0.95 | ≥ 0.90 | Proportion of variance in the observed covariance matrix explained by the model. Analogous to R². |
| **AGFI** | ≥ 0.90 | ≥ 0.85 | GFI adjusted for model complexity (degrees of freedom). |

Additional indices: NFI, RFI, IFI, PNFI, PGFI, AIC, BIC, sample-adjusted BIC.

The **Interpretation** column reads four bands – *Excellent fit*, *Good fit*, *Mediocre fit*, *Poor fit* – the same wording and the same band boundaries [exploratory factor analysis](./factor-analysis.md) uses, so an index means the same thing in both cards. CFI, TLI, RMSEA and SRMR are graded against your configured [model fit cutoffs](./settings.md#statistical-thresholds), all three tiers of them, so raising or lowering a bound moves the verdicts here.

> **Only CFI reads the CFI setting.** GFI, AGFI, NFI, RFI and IFI are graded against a fixed 0.95 / 0.90 / 0.85 scale of their own. They were never calibrated on the simulations the CFI cutoffs come from, so tying them to that setting would have made a deliberate change to one index quietly move five others.

Chi-square includes df and p-value – it tests whether the model fits perfectly, which is almost always rejected with large samples (N > 200). Don't discard a model on chi-square alone. Its **Value** cell is a test statistic like any other in the app: it carries [significance stars](./settings.md#significance-formatting) and its exact p in the hover, following the same display settings as a p-value anywhere else. RMSEA includes a 90% confidence interval and p-close (the probability that RMSEA ≤ 0.05). When a robust estimator is used, scaled/robust versions are reported with a note at the top.

> **A saturated model is not graded.** With df ≤ 0 the model reproduces the observed covariance matrix by construction, so every index is at its best possible value whether or not the model is any good. The table drops the Interpretation column entirely and prints a note saying there is no fit left to assess – the numbers lavaan computed are still shown.

> **RMSEA is withheld in small-df models.** In models with fewer than 50 degrees of freedom, RMSEA and the close-fit test are biased upward and unstable, the more so at modest N (Kenny, Kaneko & McCoach, 2015). When df < 50 and N is not above 200, the interpretation column leaves both blank and a caveat explains why – the numbers are still shown, just not graded.

> **Fit indices in context:** no single index is definitive. Look for convergence – if CFI, TLI, RMSEA, and SRMR all indicate acceptable fit, you can be reasonably confident. If they disagree, investigate why. Chi-square is almost always significant with N > 200, so don't reject a model on chi-square alone. AIC and BIC are not useful in isolation – they're for [comparing models](#model-comparison).

### Path diagram

An SVG visualization of the fitted model:

- **Latent factors** – blue ellipses, widened to fit long factor names
- **Observed variables** – grey rectangles
- **Loadings** – arrows from factors to variables, color-coded on a signed ramp (blue positive, red negative) with the arrowhead taking its edge's color, thickness proportional to strength. Non-significant loadings are dashed at reduced opacity, using your [significance level](./settings.md#significance-level).
- **Factor correlations** – double-headed curved arrows on the left, dashed the same way when non-significant
- **Second-order factors** – ellipses to the left of first-order factors; their loadings are drawn signed, sized and labelled like any other loading
- **Error terms** – small orange circles to the right of each variable, labelled with the residual variance
- **Residual covariances** – dashed double-headed arrows to the right of variables
- **Factor-indicator covariances** – dashed double-headed arcs from the factor ellipse to the indicator box, bowed above the straight line between them so a factor's covariance with one of its own indicators doesn't lie on top of the loading. These have their own [table](#parameter-estimates); now they are in the picture as well.

The model's constraints are drawn too, each with its own legend key and only when the model carries it:

- **Fixed parameter** – a dotted stroke on any loading pinned to a value (`1*x1`), first- or second-order. The dash wins over the non-significant one, so a fixed path never reads as a weak estimate.
- **Scaling reference** – a small mark inside the ellipse of a latent whose variance is fixed to 1, so you can see which identification convention the model used without reading the syntax.
- **Orthogonal (0)** – a faint dashed double-headed arc labelled `0` for a pair constrained to zero (`X ~~ 0*M`), routed between the factors or through the residual gutter depending on which kind of pair it is. Without this the constraint drew as an ordinary free covariance that happened to be estimated at 0.00.

Loading values are displayed on the paths, at the same precision as the [R² and estimate tables](#parameter-estimates) below. A legend at the bottom explains the visual encoding, and only lists keys for things the diagram actually drew.

> **Significance follows the standardization on screen.** Switching the picker switches which p-value the dashes and stars read – a standardized loading is tested against the standardized p, not the unstandardized one. The two can disagree, and when they do the diagram now agrees with the table beside it.

> **An estimate lavaan could not standardize is drawn as no estimate at all.** It takes a neutral grey line of fixed width and loses its numeric label, instead of borrowing the raw coefficient and being coloured as though it were standardized. Hover it and the tooltip quotes the unstandardized value and says which one it is.

A **standardization picker** sits above the diagram – three radio buttons that toggle between unstandardized, latent-only standardized (`std.lv`), and completely standardized (`std.all`). Switching is instant – all three variants are pre-rendered and the picker just swaps which is visible. Each variant is resizable and exports (SVG / PNG / JPG, via the buttons beside the diagram) under its own filename suffix.

### Standardized estimates toolbar

The first parameter-estimate table is preceded by a small toolbar with two checkboxes – **Latent only** and **Completely standardized**. Toggling one shows or hides that standardization's whole column group – the estimate *and its own* CI, SE, z and p – across every estimate table at once. The unstandardized **Estimate** column and its inference columns are always visible.

> The toolbar makes it easy to compare standardized and unstandardized side by side without rerunning. The default visible group matches your [Standardization](#standardization) option choice from before the run.

> **A standardized estimate carries its own test.** Standardizing rescales the coefficient, and the SE, CI, z and p rescale with it – they are not the unstandardized ones repeated. That is why each standardization owns a full column group rather than a lone estimate column: reading a standardized loading beside an unstandardized z would mix two different tests.

### Parameter estimates

When enabled, several tables of estimated model parameters appear. Each table shares a common set of columns:

- **Estimate** – the unstandardized value in the original metric
- **CI** – confidence interval around the estimate (or bootstrap CI if [bootstrap](#bootstrap) is enabled)
- **SE** – standard error, measuring how precisely the parameter is estimated. Smaller SE = more certainty.
- **z** – the estimate divided by its SE. Larger absolute values mean stronger evidence that the parameter differs from zero.
- **p-value** – probability of seeing this estimate if the true value were zero
- **Std. (latent only)** and its CI / SE / z / p – standardized using latent variance only
- **Std. (completely)** and its CI / SE / z / p – standardized using both latent and observed variances. For loadings, this is interpretable as a correlation between the indicator and the factor.

The tables are:

- **Factor loadings** – how strongly each indicator relates to its factor. A standardized loading of 0.70 means the factor explains about half (0.70² = 0.49) of the indicator's variance. Loadings below 0.40 suggest weak indicators.
- **Factor covariances/correlations** – the relationship between each pair of factors. The standardized column gives the correlation directly. High correlations (> 0.85) may indicate the factors aren't distinct – see [discriminant validity](#discriminant-validity).
- **Residual covariances** – shared variance between indicator pairs beyond what the factors explain (only shown if you [specified residual covariances](#residual-covariances)). Like every other estimate family, this one carries both standardized column groups – the completely standardized value is the residual *correlation*, which is usually the number you want here.
- **Factor-indicator covariances** – `~~` pairs with a latent on one side and an observed variable on the other. They are neither residual nor factor covariances, so they get their own table (and they suppress ω and AVE for the factors involved – see [factor reliability](#factor-reliability)).
- **Thresholds** – for ordinal indicators, the estimated cut points on each item's underlying continuous variable (k − 1 rows per k-category item).
- **Factor variances** – the amount of variability in each latent factor. Negative estimates (Heywood cases) are highlighted in red.
- **Latent residual variances** – appears in a second-order model. A first-order factor that a higher-order factor loads on has a *disturbance*, not a variance: the variability left after its higher-order predictor. Reporting it as a factor variance overstates how much of that factor is unexplained, so the two live in separate tables.
- **Residual variances** – the leftover variance in each indicator not explained by the factor. Large residual variance relative to the total means the factor isn't capturing that item well.
- **R² (variance explained)** – each row's R² value, summarizing the loading information as a single proportion. A **Type** column tells indicator rows from latent ones, so an item's communality is not read as a structural R².

> **What does R² mean here?** In CFA, an indicator's R² is the proportion of its variance explained by the factor(s) it loads on. R² = 0.60 means the factor accounts for 60% of that item's variability. Low R² (below 0.30) suggests the item is a weak indicator – it carries more noise than signal.

> **With ordinal indicators, R² is on a different scale.** Under WLSMV the model is fitted to the *underlying continuous responses* behind the observed categories, so the proportion explained is a proportion of that latent variance, not of the observed item's. The section heading and the diagram legend both say so – **R² (variance explained in the underlying continuous responses)** – whenever the fit had ordered indicators, so the number is never read as if it were the ordinary one.

> **Heywood cases in CFA:** a negative factor or residual variance is impossible in reality and signals a problem – typically a misspecified model, too few indicators per factor, or a sample that's too small. Don't ignore this – the model needs revision.

### Factor reliability

A table with per-factor reliability metrics:

| Metric | Threshold | What it measures |
|---|---|---|
| **Cronbach's α** | ≥ 0.70 | Traditional internal consistency (assumes equal loadings) |
| **McDonald's ω (composite reliability)** | ≥ 0.70 | Model-based reliability from the standardized loadings – accounts for unequal loadings. Composite reliability is the same coefficient under a different name, so it is reported once rather than as two columns. |
| **AVE** (average variance extracted) | ≥ 0.50 | Convergent validity – do indicators share more variance with their factor than with error? |
| **ω hierarchical** | ≥ 0.50 | Only for **second-order factors**: the share of its indicators' total variance the higher-order factor carries on its own. Banded on Reise, Bonifay & Haviland (2013) – ≥ 0.75 strong, ≥ 0.50 moderate. |

A second-order factor has no indicators of its own, so α, ω and AVE read N/A on its row and ω hierarchical answers the question instead. The column (and the note explaining it) appear only when the model has a higher-order factor.

If the model covaries a latent variable with one of a factor's own indicators (a [factor-indicator covariance](#parameter-estimates)), that factor's ω and AVE are not identified from the standardized loadings alone – they read N/A, with a note naming the factors. α is unaffected.

See the [reliability analysis](./reliability-analysis.md) page for more on alpha vs. omega and the AVE threshold; the interpretation bands are the same ones that module uses.

### Discriminant validity

Three sub-tables to assess whether your factors measure distinct constructs:

- **Factor correlations** – a lower-triangle matrix of inter-factor correlations. Correlations ≥ 0.85 are highlighted in red – factors that correlated may be indistinguishable.
- **HTMT2 (heterotrait-monotrait ratio)** – a lower-triangle matrix. HTMT compares the correlation *between* indicators of different factors to the correlation *within* each factor. If cross-factor correlations are nearly as strong as within-factor correlations, the factors aren't distinct. The module reports **HTMT2**, the geometric-mean estimator (Roemer, Schuberth & Henseler, 2021), which is consistent for indicators that don't contribute equally – the classic arithmetic-mean HTMT overstates the ratio when loadings are uneven. The good / borderline / problematic bands come from the [HTMT thresholds setting](./settings.md#statistical-thresholds) (0.85 and 0.90 by default), and the legend under the table quotes the values in force.
- **Fornell-Larcker criterion** – diagonal shows √AVE (how much variance a factor extracts from its own indicators), off-diagonal shows factor correlations. The idea: a factor should explain more variance in its own indicators than it shares with another factor. A violation occurs when a correlation exceeds √AVE for either factor – meaning the factors share more with each other than with their own items.

Each of the three carries a one-line legend naming the cutoff it colours cells on – the ≥ 0.85 correlation bar, the HTMT bands in force, and the √AVE comparison – so the highlighting is never a rule you have to guess at. The legend is printed whether or not [interpretation](./settings.md#significance-formatting) is on; that setting gates the colouring, not the explanation of it.

All three respect the model's data: HTMT2 is computed with the same missing-data handling and the same polychoric correlations for ordinal indicators that the fit used, and second-order factors are excluded (their correlations with their own children are structural, not evidence about discriminant validity).

> **What is discriminant validity?** It answers: "are these really *different* factors, or are they measuring the same thing?" If two factors correlate at 0.92, they might just be one factor split artificially. HTMT is generally considered more reliable than Fornell-Larcker – if HTMT2 is below the borderline threshold, you're in good shape.

### Modification indices

Modification indices estimate how much chi-square would drop if you freed a single currently-fixed parameter. Higher MI = bigger potential improvement. An MI of 3.84 corresponds to a significant improvement at the 0.05 level for a single test, so only suggestions above that threshold are shown; rows reaching **MI > 10** – Kline's practical-significance rule – are set in bold. The note under each section states both conventions and how many fixed parameters were tested, which is the multiplicity a single-test threshold ignores.

Each row shows the MI value, the **EPC** (expected parameter change – how large the freed parameter would be), the **Std. EPC** (the same change in standardized units, comparable across parameters on different scales), and an **Apply** button. Sections are capped at 20 rows; when a bucket is truncated, a line says how many of how many are shown.

Results are organized in four categories:

- **Suggested residual covariances** – indicator pairs where adding a covariance would improve fit
- **Suggested factor covariances** – latent pairs, which appear when you've turned factor correlations off or fixed a pair to zero
- **Suggested cross-loadings** – indicators that could load on additional factors. A note warns that cross-loadings change the theoretical structure.
- **Other modification indices** – remaining parameter suggestions.

> **Use modification indices with caution.** They tell you *what* would improve fit, not *whether* you should do it. Every modification should be theoretically justifiable – "these two items share method variance because they're similarly worded" is a good reason; "it makes CFI go up" is not. Data-driven modifications capitalize on sample-specific noise and may not replicate. If you make modifications, report them transparently and ideally cross-validate on a new sample.

### Residual correlation matrix

A lower-triangle matrix of residual **correlations** between indicators – the difference between each observed correlation and the one the model reproduces. Each cell shows that correlation and, below it, its **standardized residual z**: the discrepancy divided by its own standard error. Cells with |z| ≥ 1.96 are highlighted in red – the model reproduces that pair's covariance worse than sampling error explains.

> **Why z rather than a flat |r| bar.** A residual of 0.10 is a lot in a sample of 1000 and nothing in a sample of 60, so a fixed cutoff flags noise in small samples and misses real misfit in large ones. The standardized residual scales the discrepancy by its own precision, which is what makes a cutoff mean the same thing at any N. Some estimators return no standardized residuals; when that happens the table falls back to the conventional |r| > 0.10 rule and the legend says so, along with the caveat that it does not adjust for sample size.

> **Reading residuals:** large residual correlations between two indicators suggest the model is missing something about their relationship. If both load on the same factor, the factor may not fully capture their shared variance (consider a residual covariance). If they load on different factors, a cross-loading might be warranted. Patterns of large residuals in a block can signal a missing factor.

## Measurement invariance testing

When a categorical variable is selected in the **Invariance testing** dropdown, **Run CFA** performs a sequential invariance test across the groups defined by that variable (e.g. gender, age groups, countries).

> **What is measurement invariance?** Before comparing groups on a latent variable (e.g. "do men and women differ in anxiety?"), you need to show that the measurement tool works the same way in both groups. If the factor structure, loadings, or intercepts differ, group comparisons on the latent variable are meaningless – you'd be comparing apples to oranges.

The levels, tested in order:

| Level | What's constrained | What it tests |
|---|---|---|
| **Configural** | Nothing – same structure in all groups | Do the groups have the same factor pattern? |
| **Threshold** | Item thresholds equal across groups (**ordinal indicators only**) | Do the response categories sit at the same points on the underlying scale? |
| **Metric (weak)** | Factor loadings equal across groups | Do the items relate to the factors the same way? |
| **Scalar (strong)** | Loadings + intercepts equal | Can we compare latent means across groups? |
| **Strict** | Loadings + intercepts + residual variances | Is the measurement error the same across groups? |

Each level is tested only if the previous level succeeded. If the configural model fails, nothing further is attempted. A level that runs to its iteration cap without converging counts as a failure too: it is excluded from the cascade with a message saying so, rather than being compared, score-tested and read for latent means as though it had settled.

> **The cascade sets its own mean structure.** Invariance testing needs free indicator intercepts and fixed latent means, which is not what the single-group [mean structure](./structural-equation-modeling.md#mean-structure) options give you. Those options are ignored while a group variable is selected – otherwise a model you had set up for a single-group latent-mean run would come back un-identified at every level, with every Δdf below it shifted.

> **Bootstrapping doesn't touch the cascade.** With [bootstrap](#bootstrap) on, the cascade itself is still fitted with analytic standard errors – at ordinary replication counts a bootstrapped multi-group fit produces a rank-deficient covariance matrix, and every level came back warning that the model was not identified. The one table that reports a standard error, [latent mean differences](#latent-mean-differences), refits its own level with bootstrap SEs, so the setting still does what you asked where it matters.

> **Ordinal indicators take a different cascade.** With ordered indicators the levels are generated by `semTools::measEq.syntax()` under the Wu & Estabrook (2016) identification, which is what makes them properly nested – a hand-built intercept cascade produces a "scalar" model with *fewer* degrees of freedom than the metric model it is supposed to nest inside, and the chi-square difference test then fails outright. Two consequences follow from letting semTools own the syntax: the **Threshold** level is inserted (skipped for binary items, whose single threshold is already equated for identification), and the **Scalar** level is skipped when nothing has a free intercept. The card renders whatever levels came back rather than a fixed list of four, and each level is labelled by what it actually adds to the level below it.

> **All-binary indicators collapse two levels into one.** A binary item has one threshold, which identification already ties to the loading, so semTools equates thresholds and loadings in a single step. That level is named **Thresholds and loadings**, its interpretation sentence says both are equivalent across groups, and its score test nominates parameters of both kinds – so a binary item whose *threshold* differs is reachable from an **Apply** button, not hidden behind a level labelled as loadings-only. A binary item has no free intercept and no free residual variance either, so the **Scalar** and **Strict** levels are both skipped and the latent means come from the metric level, where they are identified. Because `measEq.syntax` regenerates every parameter, any `:=` or `==` lines in your model can't survive into the generated syntax – they are named in a card notice instead of being dropped silently.

> **Second-order models.** Measurement invariance is defined over the indicator-to-factor loadings, so higher-order loadings are left free across groups (the marker loading stays fixed, or the higher-order factor would have no scale in the non-referent group). The card names the loadings it freed.

### Invariance comparison table

A table with one row per invariance level. The left side shows absolute fit for each model; the right side shows how much fit *changed* from the previous level – which is what actually matters for invariance decisions:

- **Chi-square, df** – overall model misfit and degrees of freedom at each level. Under a robust estimator the header reads **χ² (scaled)** and Δχ² is the Satorra–Bentler scaled difference test, not the arithmetic difference of the scaled values above it – a footnote says so.
- **CFI, RMSEA, SRMR** – fit indices for the model at that level (same meaning as in [single-group results](#model-fit-indices))
- **AIC, BIC, SSA-BIC** – information criteria, when the estimator produces a likelihood (blank under WLSMV)
- **Δ chi-square, Δ df, p-value** – did adding the constraints significantly worsen the fit? A significant p-value means the constraints don't hold equally across groups.
- **ΔCFI, ΔRMSEA, ΔSRMR** – practical measures of fit change. These are less sensitive to sample size than the chi-square test and are generally more trustworthy.
- **Verdict** – the overall decision:

  - **Pass** – the constrained model does not fit meaningfully worse
  - **Fail** – ΔCFI shows degradation *and* it is corroborated by ΔRMSEA or ΔSRMR
  - **Mixed** – the criteria disagree
  - **Not evaluable** – a level above this one failed or could not be fitted, so nothing below it can be interpreted
  - **Did not converge / Did not fit** – the model at that level could not be estimated; lavaan's own message is shown

The baseline (configural) row has nothing to compare against, so its Δ columns read N/A rather than borrowing a value.

> **The criteria are directional and sample-size dependent.** A level is flagged only when the constrained model fits *worse* – a constrained model that happens to fit better is not evidence against invariance. The cutoffs follow Chen (2007), which specifies one band for total samples above 300 and a stricter band at or below that; the note under the table states the values actually in force and the N they were selected on. Chen also asks for the stricter band when group sizes are **markedly unequal**, so it is applied whenever the largest group is more than twice the smallest, however large the total. ΔCFI is the primary criterion, corroborated by ΔRMSEA or ΔSRMR – requiring corroboration rather than flagging on any one of the three keeps ΔSRMR, which is noisy at the intercept and residual levels, from vetoing a genuinely invariant model on its own.

> **Chi-square vs. practical criteria:** the chi-square difference test is a likelihood-ratio test, and it is sensitive to sample size – with large N, even trivial differences become significant. Practical criteria are more stable. When they disagree (Mixed verdict), the practical criteria are generally preferred, especially with N > 300 per group. Cheung & Rensvold (2002) is cited beside the ΔCFI cutoff it proposed, not beside the χ² test.

The card also reports **per-group χ² contributions** for the configural model and each group's sample size, so you can see whether one group is carrying the misfit. Under listwise deletion those sizes are the cases complete on the model's indicators – the ones lavaan will actually analyse – rather than every non-empty row, so the free-parameter and n < 50 warnings are held against the n the fit will use. If the configural model shows poor fit (CFI < 0.90 or RMSEA > 0.10), a warning advises improving the model before interpreting invariance results.

### Partial invariance

When a level fails, a **parameter comparison table** shows each parameter's per-group estimates alongside a **score test** – the χ² and p-value for releasing that one equality constraint. Rows are sorted and coloured on that statistic. An **Apply** button next to each parameter frees that constraint.

After freeing one or more parameters, click **Re-run with freed parameters** to re-test the full sequence with those parameters excluded from the equality constraints. Freed parameters accumulate across levels. The re-run refits **the model the parameters were nominated on** – its syntax, its options and its group variable – not whatever the editor happens to hold by then, so editing the buffer while you read the results can't quietly change what you are re-testing.

> **Why the score test rather than the raw difference?** A per-group estimate difference is scale-bound – 0.1 is large for a standardized loading and trivial for an intercept on a 1–7 item – and it is also biased by whatever *else* differs between the groups. The score test asks directly how much the fit would improve if this one constraint were released, which is comparable across loadings, intercepts, thresholds and residual variances alike. (On the ordinal cascade the scalar and strict levels return no score rows, so those two tables fall back to the per-group estimates with the χ² column empty. Those estimates are read from the *less constrained* side of each comparison, which is where they are free to differ – read off the constrained level itself they would be the identification constants, 0 in every intercept cell and 1 in every residual-variance cell.)

> **Partial invariance is exploratory.** If full metric invariance fails because one item has different loadings across groups, you can free that item's loading and re-test. If the remaining items are invariant, you have *partial* metric invariance – still useful for group comparisons, though with the caveat that one item functions differently. But the parameters are nominated by a test run on *this* sample, so any solution built from them needs cross-validation on independent data. The module refuses an Apply that would leave a factor with fewer than two invariant indicators at that level – below that, the factor's scale stops being comparable across groups at all. The exception is the **Strict** level, which equates residual variances only: a residual variance carries no scale information, so freeing any number of them leaves the factor's metric intact and every strict-level candidate stays applicable.

### Latent mean differences

When a level that permits mean comparison is reached, a **Latent mean differences** table shows per-factor latent means for each group. The reference group – the one whose means are fixed to 0 – is the group variable's **first level**, in the order the variable itself defines, and it is named in the note. It is not whichever group happens to appear first in the file, so re-sorting your rows can't flip the sign of every difference in the table. Each group gets an **Est.**, **SE**, **z**, **p-value**, **Latent SD** and **Std.** column, grouped under a header spanning that group's block.

An **Effect-size denominator** picker above the table chooses what the **Std.** column divides by:

- **Pooled SD** (default) – the latent SD pooled across groups (Hancock, 2001), so every group's effect size is on one metric
- **Reference SD** – the reference group's latent SD
- **Own SD** – each group's own latent SD, which is lavaan's `std.all`. Once latent variances are freed this is no longer a common metric, which is exactly why it isn't the default.

If any level from the first comparison up to the one the means came from did not pass, a caveat names the first that didn't and warns that mean comparisons should be interpreted with caution.

> **Interpreting latent means:** a latent mean difference of 0.35 for Group B means that group scores 0.35 units higher than Group A on the latent factor. The raw scale depends on your factor scaling method – the **Std.** column is the version to report, and the picker decides which convention it follows.

## Model comparison

Multiple models can be compared side by side. Use the **Add to comparison** button in each result card to queue models, then click **Compare models** (badge shows the count) once you have 2 or more. Each queued model is re-fitted from the exact lavaan text that was run, so the comparison reproduces what the individual cards showed. Models are numbered by their position in the comparison, so a card always reads Model 1 … Model *k* however many times you have added and removed along the way.

**Compare models** is closed while a fit is running, alongside **Run CFA** and **Check data** – a comparison re-fits every queued model, and letting it start mid-run would pull the workspace out from under the fit in progress.

### Comparison results

- **Models compared** – a legend heading the card: per model, its lavaan text, the estimator and missing-data handling **lavaan actually used**, and a *Requested:* line whenever either was substituted. A model that failed carries lavaan's own error message under **Did not fit**, and one that hit its iteration cap reads **Did not converge**.
- **Fit indices comparison** – models as columns, indices as rows. **n** is the first row, since it is the quantity the card's own comparability verdict turns on; then chi-square, df, p, CFI, TLI, RMSEA, SRMR, AIC, BIC, SSA-BIC. Under a robust estimator the row is labelled **χ² (scaled)**. Best values are highlighted in green – but only when the models are actually on a common scale (see below), and never on the n row.
- **Chi-square difference tests** – one row per pair the card looked at. A nested pair shows delta chi-square, delta df, p-value, and ΔCFI / ΔRMSEA signed constrained − free; a significant result means the more constrained model fits significantly worse. A pair that got no test still gets a row, with the reason in the **Note** column – not on a common scale, could not be parsed, or neither model nested in the other – rather than vanishing from the table.

> **Under a robust estimator, Δχ² is not a subtraction.** It is the estimator's own scaled difference test (Satorra–Bentler), which is why it does not equal the difference of the two scaled χ² values printed above it. A note under the table says so.

> **The ΔCFI / ΔRMSEA highlighting states its rule.** A pair is flagged only when the constrained model is worse on *both*: ΔCFI at or below the cutoff, corroborated by ΔRMSEA at or above it. The band is Chen's (2007), selected on the fits' own sample size, and the note under the table quotes the values and the n it used – the same criterion the [invariance card](#invariance-comparison-table) applies.

> **When models aren't comparable, the card says so instead of guessing.** Two models are paired only when they were fitted on the same observed columns, the same estimator, the same missing-data handling, the same mean-structure settings and the same ordinal set. A model that drops an indicator is fitted on a different set of variables, so its AIC is not smaller because it fits better – it is smaller because there is less to explain. The green "best" highlight is withheld entirely when the table mixes such models, with a note explaining why, and refused pairs get their reason in the Note column rather than a chi-square difference that means nothing.

If no nested pairs are detected, the note depends on whether the models are on a common scale at all. If they are, it advises comparing via information criteria. If they are not, it names what differs – observed variables, estimator, missing-data treatment, mean structure, ordinal indicators, number of cases – and says AIC and BIC cannot rank them either, because those are the two entries in the table *least* comparable across different case sets.

> **Nested vs. non-nested models:** two models are nested when one is a constrained version of the other (e.g. an orthogonal model is nested within an oblique model – it adds the constraint that correlations = 0). Nesting is decided from the fitted parameter tables. Model A nests inside B when every free parameter of A is free in B, A keeps every restriction B imposes, and A has strictly more degrees of freedom – so an `==` equality constraint counts as a constraint even though it doesn't remove a parameter from the model text, and two models that pin *different* parameters to different fixed values are correctly refused rather than paired on their free-parameter names alone. The chi-square difference test only applies to nested pairs. For non-nested models (different factor structures entirely), compare AIC and BIC – lower values indicate better balance of fit and parsimony.

Loading a different dataset invalidates the queue: **Restore this model**, **Add to comparison** and **Compare models** all refuse with a message rather than silently fitting old syntax against new columns.

## Missing data handling

Missing values are handled by the [missing data option](#missing-data) in the CFA options panel. Unlike other modules that use the global setting, CFA offers FIML as an alternative to listwise deletion.

> **CFA and sample size:** CFA generally needs larger samples than EFA. A common guideline is 10–20 observations per free parameter, with an absolute minimum around 200. For invariance testing, you need adequate sample size *per group* – fewer than 50 per group is likely to produce unstable results.

## Reporting checklist

Key things to include when writing up CFA results:

**Method:**
- Model specification – which indicators load on which factors (the [lavaan syntax](#lavaan-syntax) is a compact way to communicate this)
- Estimator used (ML, DWLS, etc.) and why
- Factor scaling method (marker variable or fixed variance)
- How missing data were handled (listwise or FIML)
- Sample size and N-to-parameter ratio
- Any modifications made to the initial model and why (residual covariances, freed cross-loadings)

**Results:**
- Fit indices – at minimum chi-square (df, p), CFI, TLI, RMSEA (with 90% CI), SRMR
- Standardized factor loadings, with their own SEs or CIs (not the unstandardized ones)
- Factor correlations
- Factor reliability (α, ω, AVE) if reporting convergent/discriminant validity; ω hierarchical for a second-order factor
- Discriminant validity evidence (HTMT2 or Fornell-Larcker) if relevant, naming the thresholds you applied
- Modification indices applied (if any), with justification

**For measurement invariance:**
- Group variable, group sizes
- Fit indices at each invariance level actually run (configural, threshold for ordinal data, metric, scalar, strict)
- ΔCFI, ΔRMSEA and ΔSRMR for each comparison, and the cutoffs you judged them against
- Which parameters were freed for partial invariance (if any), and that they were selected post hoc
- Latent mean differences with the effect-size denominator you chose (if the level supporting them was established)

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. CFA uses the `lavaan` R package; reliability metrics use `semTools`, which also generates the ordinal invariance cascade; robust outlier distances use `MASS`. The citation box at the top of the output card covers both halves of that: the **software** actually loaded (including Rosseel's lavaan paper alongside the package release), and the **methods** the card reports – the estimator that ran and the robust correction layered on it, FIML, the bootstrap interval type lavaan returned, every fit index printed, each reliability and discriminant-validity coefficient, modification indices and the EPC, the invariance criteria, the diagnostics battery, and the path-diagram convention. Each is gated on the run having produced it, so the list describes that analysis rather than everything the module can do. The lavaan syntax preview also lets you export the model specification directly. Both randomized steps are seeded: bootstrap resamples (including across the invariance cascade) by [**Bootstrap seed**](./settings.md#bootstrap-seed), and the MCD subsampling behind [outlier detection](#check-data) by the [**Reproducibility seed**](./settings.md#reproducibility-seed) – set them to make those numbers stable across runs.

## Common pitfalls

CFA's popularity has surged in recent years – partly because reviewers increasingly expect it, and partly because software has made it accessible. But accessibility brings its own risks. A few things worth keeping in mind:

**Modification index chasing.** It's tempting to keep adding residual covariances and cross-loadings until CFI crosses the 0.95 threshold. The problem is that each data-driven modification capitalizes on sample-specific patterns that may not replicate. If you make modifications, limit them to theoretically justifiable changes, report every one, and acknowledge that the final model is exploratory rather than confirmatory.

**"Confirming" an EFA from the same data.** Running [EFA](./factor-analysis.md), finding 3 factors, and then running CFA on the same dataset to "confirm" the structure is circular – the model was extracted from that data, so good fit is expected. Split your sample (EFA on one half, CFA on the other) or use independent data. See also [EFA common pitfalls](./factor-analysis.md#common-pitfalls).

**Testing only one model.** CFA is most informative when comparing competing structures – does a 3-factor model fit better than a 2-factor? Is the second-order model better than the correlated-factors model? A single model that meets fit thresholds is consistent with the data, but there may be other models that fit equally well. Use [model comparison](#model-comparison) to evaluate alternatives.

**Reporting poor fit as acceptable.** Fit indices below standard thresholds (e.g. CFI < 0.90, RMSEA > 0.10) indicate meaningful misfit. If the model doesn't fit well, the options are to revise it (transparently), acknowledge the limitations, or reconsider the theoretical structure – not to relabel the thresholds.

**DWLS / WLSMV fit index inflation.** The DWLS family (including the recommended WLSMV variant for ordinal data) tends to produce higher CFI and lower RMSEA compared to ML on the same data. This is a known property of these estimators, not evidence of better fit. Some researchers have proposed stricter thresholds (e.g. CFI ≥ 0.99, RMSEA ≤ 0.03), though there's no universal consensus yet. Be cautious applying standard ML-derived cutoffs to DWLS or WLSMV results.

**CFA as evidence, not proof.** Good model fit means the data is consistent with your theory – it doesn't mean the theory is correct. Multiple different models can produce equivalent fit. CFA provides supporting evidence for a structure, not definitive validation. If your theory specifies *directional* relationships between factors (rather than just measurement structure), see [Structural equation modeling](./structural-equation-modeling.md) – CFA only tests the measurement part.

**Invariance testing as a checkbox.** Running the full cascade to the strict level is thorough, but the value lies in understanding *which* parameters differ across groups and *why* – not just whether each level passes or fails. When invariance fails, use [partial invariance](#partial-invariance) to investigate the substantive differences – and remember that a partial solution nominated from your own sample is a hypothesis, not a result.
