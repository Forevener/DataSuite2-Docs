---
title: Structural equation modeling
description: SEM model builder in DataSuite 2 – measurement plus structural paths, mediation with bootstrap CIs, mean structure, and a live lavaan-driven diagram.
---

# Structural equation modeling

The **Structural equation modeling** (SEM) module fits a measurement model, a structural model, or both at once. You build the model with two interactive matrices (one for factor loadings, one for regression paths), an optional generalized covariance list, and a mediation helper for indirect effects. A lavaan syntax box stays in sync with the matrices – edit either, the other follows – and a live path diagram updates as you go. After running, you get fit indices, parameter estimates, optional reliability and discriminant validity, modification suggestions, and a path diagram with switchable standardization.

> **CFA vs. SEM:** the [Confirmatory factor analysis](./confirmatory-factor-analysis.md) page covers the measurement-only case – testing whether a factor structure fits. SEM extends that with **structural paths** (`~`) between latent factors and/or observed variables, **mediation** with indirect effects, and **mean structure** for latent mean comparisons. Same module, same widgets – you just add structural equations or `:=` definitions.

1. [Select your variables](./getting-started.md#choosing-variables) – at least 4 numeric for a measurement model, 2+ for path analysis without latents
2. Define your [measurement model](#measurement-model) (factors → indicators) if you have latents
3. Add [structural paths](#structural-model) – pick endogenous variables, tick predictors
4. Optionally specify [covariances](#covariances), [indirect effects](#indirect-effects-and-defined-parameters), or paste lavaan syntax in the [text box](#lavaan-syntax-box)
5. Configure [estimation](#options), then click **Run SEM** for [results](#reading-results)

## Model specification

The SEM editor has three matrices stacked vertically: the **measurement model** (factor → indicators), the **structural model** (endogenous → predictors), and the **covariances** list. A lavaan **syntax box** on the right reflects all of them and is itself editable. A live **diagram preview** below the editor shows whatever currently parses cleanly.

### Measurement model

The measurement matrix works exactly as in CFA – see [Model specification](./confirmatory-factor-analysis.md#model-specification) for cell behavior, factor management, second-order factors, auto-detect from names, and the value/label/start popover. Anything you build there is part of the same model the structural matrix and the syntax box draw from.

If you don't define any factors, the structural matrix can still operate on observed variables alone – that's a **path analysis** model.

### Structural model

The **Structural model** matrix sits below the measurement matrix. Rows are endogenous variables (the left side of a `~` regression); columns are the predictor pool (every observed numeric variable plus every latent factor you've defined).

- **Add an equation** – pick a variable from the dropdown at the bottom of the matrix and click **Add**. The variable can be observed or latent. Adding doesn't remove it from the predictor pool – a variable can be both endogenous in one equation and a predictor in another.
- **Tick a cell** to add that predictor to the equation. Click again to remove (when [constraints](#constraints-and-modifiers) are off) or to open the modifier popover (when on).
- **Self-edges are blocked** – the diagonal cell where row == column is rendered disabled. A variable cannot predict itself.
- **Cycles are flagged in red.** If your paths form a feedback loop (e.g. A → B → A, or A ↔ B through a chain), the participating cells highlight red. Lavaan supports non-recursive models, so cycles are accepted – but the highlight tells you to think about whether identification holds.
- **Remove an equation** with the **×** next to its row label.
- **References outside the variable pool stay visible.** If an equation names a variable that isn't in your current selection, the matrix grows a muted orphan column (or marks an orphan target row) for it rather than dropping the reference. You can clear it from there; reselect the variable to edit it normally.

> **Path analysis vs. full SEM:** a model with only `~` lines on observed variables is a path analysis (regression with multiple outcomes, possibly mediated). Add latent factors and you have full SEM. The module handles both – there's no separate mode to switch into.

### Covariances

The **Covariances** section accepts any pair of variables you want to covary, regardless of kind:

- **Residual ↔ residual** – observed variables that share method variance
- **Factor ↔ factor** – explicit covariance constraint between latents (lavaan auto-correlates exogenous latents already; you only need a row here when the default isn't what you want)
- **Mixed** – observed ↔ latent, when you have a theoretical reason for it

Pick two variables from the dropdowns and click **Add**. The list shows badges like `x1 ~~ x2`; if the syntax box has a line with a modifier (e.g. `x1 ~~ a*x2` or `x1 ~~ 0.3*x2`), the modifier appears on the right-hand side of the badge. The widget can't edit modifiers – type them in the [syntax box](#lavaan-syntax-box) – but **×** still removes the line.

> **When to add covariances:** add residual-residual pairs only when there's a theoretical reason (shared method, similar wording, adjacent placement). Factor-factor pairs are usually unnecessary because lavaan covaries exogenous latents by default. The [modification indices](#modification-indices) section will suggest candidates.

### Indirect effects and defined parameters

A defined parameter is a lavaan `:=` line – an expression built from other parameter labels that lavaan will compute (and bootstrap if requested) alongside the fit.

The **Indirect effects** form is the GUI shortcut for the most common case: mediation with one mediator.

1. Pick **Predictor (X)**, **Mediator (M)**, and **Outcome (Y)** from the dropdowns (any combination of observed and latent)
2. Optionally rename the parameter (defaults to `indirect`, `indirect2`, … on collision)
3. Click **Add indirect effect**

The form ensures the X→M, M→Y **and** X→Y paths exist as labeled structural regressions (assigning `a`, `b`, `c`, … from labels not already used anywhere in the model), then emits three lines: the indirect effect `name := a*b`, the **direct** effect `direct := c`, and the **total** effect `total := c + a*b`. Reporting all three is what a mediation write-up needs, and computing them together means they share the same bootstrap pass. Re-running with the same triple is idempotent – it won't duplicate paths, rename existing labels, or stack a second definition of the same expression. If the direct X→Y path is pinned to a fixed coefficient, the form emits the indirect line alone and says so in the toast.

For contrasts or any other custom expression – type `name := expression` directly into the [syntax box](#lavaan-syntax-box). It appears in the **Indirect effects** list with a remove (×) button, alongside any GUI-generated entries.

> **Bootstrap CIs come automatically** – if the [bootstrap option](./confirmatory-factor-analysis.md#bootstrap) is on, lavaan computes confidence intervals on every `:=` parameter using the same resampling pass. This is the right way to test mediation: indirect effects don't have analytic SEs.

### Lavaan syntax box

The **lavaan syntax** accordion (right column) holds the canonical model text. It is *not* a one-way preview – anything you type there flows back into the matrices, just as anything you do in the matrices flows into the text. There's no Apply/Cancel button – the matrices update automatically as you type.

Practical implications:

- **Paste a model from a publication** – drop the lavaan syntax in, the matrices reorganize to match. Useful when literature reports their model in lavaan notation.
- **Type things the matrices don't model** – equality constraints (`a == 2*b`), inequality (`a > 0`), formative measurement (`<~`), intercepts (`x1 ~ 1`), starting values, label names, fixed values, comments. They survive matrix edits because the parsed buffer is the source of truth, not what the matrices know how to render.
- **Mid-typing safety** – if a line doesn't parse yet (e.g. you're in the middle of typing `F1 =~ x1 +`), the matrices freeze on the last good state instead of clearing.
- **The buffer is what gets fitted.** Everything the widgets can't show – `:=` definitions, `==` constraints, variance and covariance modifiers – reaches lavaan exactly as written. A `x1 ~~ 0.2*m1` line you type is fitted as a fixed covariance, not quietly re-freed.

The **Copy** button copies the current text to the clipboard. Editing is assisted: syntax highlighting, underlines on names the dataset doesn't have, and completion for variable names, factor names and the five operators (`=~`, `~`, `~~`, `:=`, `==`) with a plain-language reading of each.

Column names that aren't legal lavaan identifiers – a space, a hyphen, a leading digit, an R reserved word – appear under an automatic alias (`Age (years)` → `Age__years_`) everywhere the buffer speaks: the syntax box, the completions, the diagram. The original header still resolves if you type it, so saved models and pasted configurations keep working.

> **What if lavaan reports an error?** The error appears below the box, with the offending token underlined at the position lavaan reported. The matrices stay frozen on the last successful parse – they don't go blank – and a notice above them says the widgets are paused until the syntax parses again. Fix it and they catch up automatically.

### Constraints and modifiers

Click an already-ticked cell in either matrix to open a popover for that cell. It takes the modifier in lavaan's own notation, so what you type is what appears in the syntax box:

- **A number** (`1`, `1.5`, `-0.3`, `1e2`) – fixes the parameter to that value
- **A label** (`a`, `loading_anx_1`) – creates an equality constraint; every cell with the same label is forced to share one estimate
- **`NA*`** – frees a parameter the scaling convention would otherwise fix
- **`start(.7)`** – supplies a starting value, and combines with a label (`start(.7)*a`)
- **Leave empty + OK** – reverts to a plain free parameter
- **× button** – removes the parameter entirely (same as un-ticking the cell)

The modifier is a set rather than one value, so a label and a start value coexist and editing one doesn't discard the other. This is how you'd specify, say, two loadings constrained to be equal (`F1 =~ a*x1 + a*x2 + x3`) without touching the syntax box.

### Diagram preview

Below the editor, the live diagram renders whatever currently parses. Latents are ellipses, observed variables are rectangles, structural arrows go between them, factor → indicator arrows go from each latent ellipse to its indicators stacked alongside it, and covariance arcs curve out to the side. With no estimates yet, the edges show modifier labels (fixed values, label names) where present and stay unlabelled otherwise. After a fit, the same renderer shows the [post-fit diagram](#path-diagram) with estimates.

If your buffer doesn't parse yet, the preview blanks out – same logic as the matrices.

## Options

The right column hosts every fit option. Most overlap with CFA – see the [CFA options](./confirmatory-factor-analysis.md#options) for **Factor scaling**, **Factor correlations**, **Missing data**, **Standardization**, **Bootstrap**, and **Output options**. The SEM-specific bits are below.

### Estimator

| Estimator | When to use |
|---|---|
| **ML** | Default. Continuous, roughly normal data, N > 200. |
| **MLR** | Robust ML with Huber-White standard errors – the only robust ML variant that accepts FIML. |
| **MLM** | Robust ML with Satorra-Bentler correction – continuous but non-normal. |
| **MLMVS** | Robust ML with Satterthwaite correction. |
| **MLMV** | Robust ML, scale-shifted. |
| **WLSMV** | Robust DWLS, mean+variance adjusted. **The recommended default for ordinal indicators.** |
| **ULSMV** | Robust ULS, mean+variance adjusted – alternative for ordinal data. |
| **DWLS** | Diagonally Weighted Least Squares – ordinal indicators. |
| **ULS** | Unweighted Least Squares – ordinal alternative. |
| **WLS** | Weighted Least Squares – large samples (N > 1000). |
| **GLS** | Generalized Least Squares – robust to non-normality. |

> **Ordinal indicators substitute the estimator.** If a variable the *model names* is typed Ordinal in the data view, the module switches any estimator that can't take ordered data to WLSMV. The [model summary](#model-summary) shows what was actually used and what you asked for, so the discrepancy is never invisible. It works from the model text, not the whole selection – a typed-ordinal column your model doesn't reference doesn't pull the fit to WLSMV, and picking WLSMV without typing the columns Ordinal fits continuous data.

> **FIML follows the resolved estimator.** Selecting FIML disables MLM, MLMVS and MLMV (lavaan rejects those combinations) and switches you to MLR if one was already selected. Under an ordinal model, where WLSMV is in force, FIML becomes **pairwise** deletion; under the remaining estimators, listwise.

### Mean structure

Off by default. Turn **Estimate intercepts** on when you need:

- **Latent mean comparisons** in multi-group models (the scalar invariance level requires it)
- **Mediation involving means**, or any other model where intercept-level information matters
- **FIML** – but if you've selected FIML, lavaan flips this on automatically; you don't need to check the box

Two sub-options appear when meanstructure is on:

- **Free observed-variable intercepts** (on by default) – observed `~ 1` parameters are estimated. Off means they're fixed (rarely what you want).
- **Free latent-variable intercepts** (off by default) – latent `~ 1` parameters are estimated. On is needed to *get* latent means as output. In a single-group model with no comparison reference, leaving this off is the safer default.

> **In most single-group models, leave mean structure off.** It adds parameters that have no inferential purpose unless you're comparing groups, predicting from means, or computing mean-based defined parameters.

### Invariance testing

Same dropdown as in CFA – pick a categorical variable to run the sequential invariance cascade. **Measurement models only.** As soon as the buffer contains a structural equation (`~`), the dropdown is disabled with a note explaining why, rather than accepting a selection it would later ignore. Clear the structural equations and it re-enables. For multi-group structural models, fit each group manually and compare via the [model comparison](#model-comparison) feature.

## Check data

Same diagnostics as [CFA's Check data](./confirmatory-factor-analysis.md#check-data), in a **Data diagnostics** card. It checks exactly the variables the model names – indicators plus the observed variables in the structural equations – so a path-only model with no latents is covered too. With no model defined it falls back to all selected numeric variables, and the scope line says which happened.

## Validation rules

- Either at least one factor with **2+ indicators**, or at least one structural equation with **1+ predictor**
- Each second-order factor needs **2+ first-order factors**
- Every name in the model must exist in the dataset; unknown names are underlined in the syntax box and named in a toast
- The buffer must parse – a syntax error blocks the run rather than fitting the last model that parsed
- Model must be at least just-identified (**df ≥ 0**); df = 0 produces a warning
- Free observed-variable intercepts together with free latent-variable intercepts (means) are not jointly identified in a single-group model

The **Run SEM** button stays disabled until the model passes validation. The **N : free-parameter ratio** is reported in the summary; below 5 triggers an "underpowered" warning. A factor with two indicators and no free link to another latent raises an advisory warning – the fit still runs.

## Reading results

Results appear in a **Structural equation modeling** card (or **Confirmatory factor analysis** when no structural equations are present – the module routes through `lavaan::cfa()` to preserve reliability and discriminant-validity output).

### Model summary

- **Factors**, **Second-order factors** (when the model has any) and **Structural equations** count
- **Estimator** – shows the actual fit estimator; if it was substituted because of ordinal indicators, the requested estimator appears in parentheses
- **Degrees of freedom**, **Free parameters**, **Sample size**
- **N : parameter ratio** – flagged if below 5 (rule of thumb: aim for 5–10)
- Two action buttons: **Restore this model** (reverts the editor to this run's state, buffer text included) and **Add to comparison** / **Remove from comparison**. Restore is offered for failed fits too – a model that didn't converge is exactly the one you want back in the editor.

> **The counts are lavaan's own.** Free parameters and degrees of freedom are read off the fitted parameter table, not estimated from the widgets, so mean-structure parameters and `==` constraints are already accounted for and the N : parameter ratio is computed against the number lavaan actually estimated.

> **Sample size.** The N shown is the one lavaan used. Under FIML that is the full sample, since lavaan estimates on every case using the available-data likelihood, and the summary names the complete-case count beside it. With listwise deletion it is the complete cases, out of the total rows.

### Model fit

The fit indices table is identical to CFA's. See [Model fit indices](./confirmatory-factor-analysis.md#model-fit-indices) for thresholds and interpretation. With a robust estimator (MLM, WLSMV, …), the table shows scaled chi-square and the `*.robust` / `*.scaled` versions of CFI / TLI / RMSEA, with a "Robust/scaled indices reported" note at the top.

### Path diagram

Latents are blue ellipses, observed variables are grey rectangles, structural paths are arrows between them, measurement paths go from each ellipse to its indicators, and covariances curve out to the side. Edges are colored on the same signed blue/red ramp the CFA diagram uses, with the arrowhead taking its edge's color; thickness is proportional to |estimate|. Non-significant paths are dashed at reduced opacity, using your [significance level](./settings.md#significance-level) rather than a fixed 0.05.

Details worth knowing:

- **Every edge is labelled with its estimate**, including indicator loadings and covariance arcs, on a white backing so the number stays readable over a line. With [significance stars](./settings.md#significance-formatting) enabled the label carries them.
- **Indicators sit on the side that keeps the structural arrows clear** – a latent with no incoming paths puts its indicators on the left, one with no outgoing paths on the right, and one with both below.
- **Feedback loops are drawn.** A non-recursive model's back-edges are lifted into their own lanes above the node band, so both directions of a cycle are visible instead of one being dropped.
- **Fixed parameters** are drawn with a dotted stroke and a legend key. In an unstandardized view the label shows the fixed value; in a standardized view it shows the standardized estimate, which is the more informative number.
- **R²** is labelled on each endogenous node, on whichever side is free.
- The legend lists only the keys the diagram actually used.

A **standardization picker** sits above the diagram – three radio buttons that toggle between unstandardized, latent-only standardized (`std.lv`), and completely standardized (`std.all`). Switching is instant – all three variants are pre-rendered and the picker just swaps which is visible. Each variant is resizable and exports (SVG / PNG / JPG, via the buttons beside the diagram) under its own filename suffix.

### Standardized estimates toolbar

The first parameter-estimate table is preceded by a small toolbar with two checkboxes – **Latent only** and **Completely standardized**. Toggling one shows or hides that standardization's whole column group – the estimate *and its own* CI, SE, z and p – across every estimate table at once. The unstandardized **Estimate** column and its inference columns are always visible.

> The toolbar makes it easy to compare standardized and unstandardized side by side without rerunning. The default visible group matches your **Standardization** option choice from before the run.

> **Each standardization carries its own test.** Standardizing rescales the coefficient, and its SE, CI, z and p rescale with it – a standardized path's z is not the unstandardized one. That is why the toggles reveal a full column group rather than a lone estimate column.

### Structural regressions

When the model has any `~` lines, this table is shown first, before factor loadings – the structural model is usually what you want to read at a glance.

| Column | Meaning |
|---|---|
| **Predictor** | Right-hand side of the regression |
| **Outcome** | Left-hand side (endogenous variable) |
| **Estimate** | Unstandardized coefficient |
| **CI** | Confidence interval (bootstrap when enabled) |
| **SE**, **z**, **p-value** | Standard error, z-statistic, p-value |
| **Std. (latent only)** + its CI / SE / z / p | Standardized using latent variance only |
| **Std. (completely)** + its CI / SE / z / p | Standardized using both latent and observed variances |

> **A standardized regression is interpretable as a partial correlation** between predictor and outcome, holding other predictors in the same equation constant.

### Factor loadings

Same shape as in CFA – see [Factor loadings](./confirmatory-factor-analysis.md#parameter-estimates). The SEM card includes the standardized columns and shares the toolbar with all other estimate tables.

### Covariance estimates

A single combined `~~` table covers every off-diagonal covariance – residual-residual, factor-factor, and mixed. Columns are **Variable 1**, **Variable 2**, **Estimate**, the standardized column groups (the `Std. (correlation)` column is the standardized form, equivalent to a correlation), **CI**, **SE**, **p-value**.

> **In CFA results, this single table is split into Factor covariances, Residual covariances and Factor-indicator covariances** – separate sections instead of one. The underlying parameters are the same.

### Defined parameters

When the model has `:=` lines (mediation indirect effects, direct and total effects, custom expressions), this table appears below the covariances. Columns: **Name**, **Expression** (the lavaan formula), **Estimate**, **CI**, **SE**, **z**, **p-value**, plus the standardized column groups.

> **CIs on `:=` parameters are bootstrap-derived when bootstrap is on**, and asymptotic (delta-method / Sobel) otherwise – with a note under the table saying so. Bootstrap is the recommended way to test indirect effects: the delta method assumes a symmetric sampling distribution, which a product of coefficients does not have.

### Intercepts

Only emitted when [mean structure](#mean-structure) is on. Lists `~ 1` parameters for every variable lavaan estimates an intercept on (observed and, optionally, latent).

### Thresholds

For ordinal indicators, the estimated cut points on each item's underlying continuous variable – k − 1 rows per k-category item. These are the parameters WLSMV estimates in place of treating the responses as continuous.

### Factor variances, latent residual variances and residual variances

The `~~` diagonal splits three ways rather than two:

- **Factor variances** – exogenous latents, whose diagonal is the variance of the factor itself
- **Latent residual variances** – latents that some `~` equation predicts. Their diagonal is a *disturbance* – the variance left after their predictors – not the factor's variance, and mislabelling it inflates what looks like unexplained latent variability.
- **Residual variances** – observed indicators

**Negative variance estimates (Heywood cases) are highlighted in red**, with a warning above the table – they indicate misspecification, weak indicators, or a sample too small to identify the model.

### R² (variance explained)

Per-endogenous-variable R². For indicators, the R² is the proportion explained by their factor loadings; for endogenous latents and observed outcomes in a structural equation, it's the proportion explained by their predictors. With WLSMV on ordered indicators, the R² is computed on the latent (continuous) response variable, not the observed categories.

### Factor reliability

Same metrics and thresholds as CFA – see [Factor reliability](./confirmatory-factor-analysis.md#factor-reliability). α, ω and AVE describe a factor's own observed indicators; a second-order factor gets an **ω hierarchical** value instead, since it has none.

> **Reliability is computed against the first-order factors.** In a model where one latent predicts another, or a second-order factor sits above them, ω for a given factor is derived from that factor's own indicators – not from whatever predicts it upstream.

### Discriminant validity

Same three sub-tables (factor correlations, HTMT2, Fornell-Larcker) as in CFA. See [Discriminant validity](./confirmatory-factor-analysis.md#discriminant-validity).

### Modification indices

For SEM models, suggestions split into four buckets (each filtered to MI > 3.84, up to 20 rows per bucket, with a line stating the total when a bucket is truncated). Rows reaching MI > 10 are bold, and each carries **EPC** and **Std. EPC** columns:

- **Suggested covariances** – `~~` pairs, of any kind. Each row has an **Apply** button that adds the line to the covariances list.
- **Suggested regression paths** – `~` predictors that would improve fit. **Apply** adds the path to the structural matrix. A note warns that paths change the structural model.
- **Suggested cross-loadings** – `=~` cross-loadings. **Apply** adds the loading; a note warns the factor structure is changing.
- **Other modification indices** – anything that didn't fit the above buckets, displayed read-only.

The note under each section names both conventions (3.84 for a single test, 10 for practical significance) and how many fixed parameters were tested – the multiplicity a single-test threshold ignores.

> **Modification indices say what would improve fit, not what should change.** Apply only when a change has a theoretical justification – "the items share method variance" is good; "CFI goes up" is not. Each data-driven modification capitalizes on sample-specific noise. If you accept any, report them transparently and ideally cross-validate on a holdout sample.

### Residual correlations

Same matrix as in CFA – pairs with |r| > 0.10 highlighted as localized misfit.

## Mediation walkthrough

A typical single-mediator analysis with bootstrap CIs:

1. Build the measurement model in the top matrix (or skip if X, M, Y are all observed)
2. In the **Indirect effects** form, pick X, M, Y; click **Add indirect effect**
3. Turn on **Bootstrap confidence intervals** in the options
4. Raise [**Bootstrap replications**](./settings.md#bootstrap-replications) – the default of 100 is far below what a mediation interval needs (2000–5000 is the usual advice), and BCa requires more replications than you have cases
5. Click **Run SEM**

In the results:

- The **Structural regressions** table shows the `a` (X→M), `b` (M→Y) and `c` (X→Y) paths with their bootstrap CIs
- The **Defined parameters** table shows `indirect := a*b`, `direct := c` and `total := c + a*b`, each with its bootstrap CI – all three emitted by the form, so there is nothing left to type
- For a contrast between two indirect paths, add the expression by hand in the syntax box and rerun

> **Bootstrap works with FIML.** Both can be on at once – lavaan resamples cases and evaluates the available-data likelihood on each resample. Bootstrapping is slow either way, so keep the replication count in mind before combining them with a large model.

## Model comparison

Multiple fits – CFA-shape, SEM-shape, or mixed – can be queued and compared. Same workflow as in [CFA model comparison](./confirmatory-factor-analysis.md#model-comparison): click **Add to comparison** in each result card, then **Compare models** when 2+ are queued. Each model is re-fitted from the exact text that was run, so the comparison reproduces its own card. The table compares fit indices side by side; nested pairs (detected from the fitted parameter tables, so an `==` constraint counts) get a chi-square difference test with ΔCFI and ΔRMSEA; non-nested pairs are evaluated via AIC/BIC/SSA-BIC.

Pairs whose fits aren't on a common scale – different observed columns, estimator, missing-data handling, mean structure or ordinal set – are refused with the reason stated in the **Note** column, and the "best value" highlighting is withheld from the whole table when it mixes such models. A **Models compared** legend at the top of the card lists each model's syntax, estimator and missing-data setting.

## Reporting checklist

**Method:**
- Model – measurement and structural specification (the [lavaan syntax](#lavaan-syntax-box) is a compact way to communicate this)
- Estimator and why; whether it was substituted (e.g. WLSMV for ordinal indicators)
- Factor scaling (marker variable or fixed variance)
- How missing data were handled (listwise, FIML, or the pairwise deletion an ordinal model falls back to)
- Sample size and N : parameter ratio
- Mediation: bootstrap method (BCa, BC, or percentile, as reported in the CI column header) and number of replications
- Modifications applied to the initial model and why

**Results:**
- Fit indices – chi-square (df, p), CFI, TLI, RMSEA (with 90% CI), SRMR; report scaled versions when a robust estimator is used
- Standardized factor loadings (measurement), with their own SEs or CIs
- Standardized regression coefficients (structural), with CIs
- Indirect, direct and total effects with their bootstrap CIs
- Factor reliability (α, ω, AVE) if relevant
- Modification indices applied (if any), with theoretical justification

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – inspect, copy, or re-run. SEM uses the `lavaan` R package; reliability and discriminant validity metrics use `semTools`; robust outlier distances in [Check data](#check-data) use `MASS`. Citations appear at the top of the output card, listing only the packages a given run actually loaded. The lavaan syntax box also lets you export the model specification directly. When bootstrap SEs are enabled, lavaan's resamples are seeded by [**Bootstrap seed**](./settings.md#bootstrap-seed) – set it to make bootstrap SEs and indirect-effect CIs reproducible across runs; the MCD subsampling in the diagnostics is seeded by [**Reproducibility seed**](./settings.md#reproducibility-seed).

## Common pitfalls

**Causal language from cross-sectional data.** A `~` arrow in the syntax does not establish causation – it specifies a directional regression, but interpreting that directionally requires a research design that supports it (longitudinal data, experimental manipulation, an instrumental variable, or a strong theoretical / temporal argument). SEM fits the model you specify; it doesn't validate the direction.

**Indirect effects without coverage.** Mediation tests need bootstrap CIs – the indirect-effect distribution is skewed, and Wald-style asymptotic SEs miscalibrate the test. If the **Defined parameters** table reports a delta-method CI (no bootstrap), a note under it says so, and the indirect-effect significance is unreliable. Turning bootstrap on at the default 100 replications is not enough either: the card will tell you the count is below the usual recommendation and why BCa was unavailable.

**Modification index chasing on the structural side.** As tempting as it is to drop in suggested regression paths until CFI crosses 0.95, every data-driven path is a sample-specific decision that may not replicate. Apply only paths the theory supports, report every change, and consider the final model exploratory rather than confirmatory.

**Cycle that breaks identification.** The structural matrix accepts feedback loops (lavaan supports them), but identification requires extra constraints – typically instrumental variables or fixed parameters. Cycle highlighting tells you a loop exists; whether the loop is identified is not auto-checked. Convergence warnings or large standard errors are usually the first sign of trouble.

**Mean structure left on by accident.** Turning meanstructure on adds parameters and changes which fit indices are computed. Unless you have a reason – invariance testing, mean-based defined parameters, FIML – leave it off. The default off-state is correct for almost every single-group SEM.

**Multi-group SEM.** The invariance cascade covers measurement models only, and the group dropdown disables itself as soon as the buffer has a structural equation. Multi-group syntax (`c(a1, a2)*x1`, `group:` blocks) is not accepted in the syntax box either – the editor parses the model as single-group, so a per-group modifier reads as a malformed one. If you need a multi-group structural model, fit each group separately (filter the dataset, run, add to comparison) and compare via [model comparison](#model-comparison).

**SEM as evidence, not proof.** Good fit means the data is consistent with the model – it doesn't prove the model is correct. Multiple alternative structures can produce equivalent fit. Use [model comparison](#model-comparison) to check competing structures and report the comparisons honestly.
