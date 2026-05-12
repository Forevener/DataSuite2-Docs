---
title: Structural equation modeling
description: SEM model builder in DataSuite 2 — measurement plus structural paths, mediation with bootstrap CIs, mean structure, and a live lavaan-driven diagram.
---

# Structural equation modeling

The **Structural equation modeling** (SEM) module fits a measurement model, a structural model, or both at once. You build the model with two interactive matrices (one for factor loadings, one for regression paths), an optional generalized covariance list, and a mediation helper for indirect effects. A lavaan syntax box stays in sync with the matrices — edit either, the other follows — and a live path diagram updates as you go. After running, you get fit indices, parameter estimates, optional reliability and discriminant validity, modification suggestions, and a path diagram with switchable standardization.

> **CFA vs. SEM:** the [Confirmatory factor analysis](./confirmatory-factor-analysis.md) page covers the measurement-only case — testing whether a factor structure fits. SEM extends that with **structural paths** (`~`) between latent factors and/or observed variables, **mediation** with indirect effects, and **mean structure** for latent mean comparisons. Same module, same widgets — you just add structural equations or `:=` definitions.

1. [Select your variables](./getting-started.md#choosing-variables) — at least 4 numeric for a measurement model, 2+ for path analysis without latents
2. Define your [measurement model](#measurement-model) (factors → indicators) if you have latents
3. Add [structural paths](#structural-model) — pick endogenous variables, tick predictors
4. Optionally specify [covariances](#covariances), [indirect effects](#indirect-effects-and-defined-parameters), or paste lavaan syntax in the [text box](#lavaan-syntax-box)
5. Configure [estimation](#options), then click **Run SEM** for [results](#reading-results)

## Model specification

The SEM editor has three matrices stacked vertically: the **measurement model** (factor → indicators), the **structural model** (endogenous → predictors), and the **covariances** list. A lavaan **syntax box** on the right reflects all of them and is itself editable. A live **diagram preview** below the editor shows whatever currently parses cleanly.

### Measurement model

The measurement matrix works exactly as in CFA — see [Model specification](./confirmatory-factor-analysis.md#model-specification) for cell behavior, factor management, second-order factors, auto-detect from names, and the value/label/start popover. Anything you build there is part of the same model the structural matrix and the syntax box draw from.

If you don't define any factors, the structural matrix can still operate on observed variables alone — that's a **path analysis** model.

### Structural model

The **Structural model** matrix sits below the measurement matrix. Rows are endogenous variables (the left side of a `~` regression); columns are the predictor pool (every observed numeric variable plus every latent factor you've defined).

- **Add an equation** — pick a variable from the dropdown at the bottom of the matrix and click **Add**. The variable can be observed or latent. Adding doesn't remove it from the predictor pool — a variable can be both endogenous in one equation and a predictor in another.
- **Tick a cell** to add that predictor to the equation. Click again to remove (when [constraints](#constraints-and-modifiers) are off) or to open the modifier popover (when on).
- **Self-edges are blocked** — the diagonal cell where row == column is rendered disabled. A variable cannot predict itself.
- **Cycles are flagged in red.** If your paths form a feedback loop (e.g. A → B → A, or A ↔ B through a chain), the participating cells highlight red. Lavaan supports non-recursive models, so cycles are accepted — but the highlight tells you to think about whether identification holds.
- **Remove an equation** with the **×** next to its row label.

> **Path analysis vs. full SEM:** a model with only `~` lines on observed variables is a path analysis (regression with multiple outcomes, possibly mediated). Add latent factors and you have full SEM. The module handles both — there's no separate mode to switch into.

### Covariances

The **Covariances** section accepts any pair of variables you want to covary, regardless of kind:

- **Residual ↔ residual** — observed variables that share method variance
- **Factor ↔ factor** — explicit covariance constraint between latents (lavaan auto-correlates exogenous latents already; you only need a row here when the default isn't what you want)
- **Mixed** — observed ↔ latent, when you have a theoretical reason for it

Pick two variables from the dropdowns and click **Add**. The list shows badges like `x1 ~~ x2`; if the syntax box has a line with a modifier (e.g. `x1 ~~ a*x2` or `x1 ~~ 0.3*x2`), the modifier appears on the right-hand side of the badge. The widget can't edit modifiers — type them in the [syntax box](#lavaan-syntax-box) — but **×** still removes the line.

> **When to add covariances:** add residual-residual pairs only when there's a theoretical reason (shared method, similar wording, adjacent placement). Factor-factor pairs are usually unnecessary because lavaan covaries exogenous latents by default. The [modification indices](#modification-indices) section will suggest candidates.

### Indirect effects and defined parameters

A defined parameter is a lavaan `:=` line — an expression built from other parameter labels that lavaan will compute (and bootstrap if requested) alongside the fit.

The **Indirect effects** form is the GUI shortcut for the most common case: mediation with one mediator.

1. Pick **Predictor (X)**, **Mediator (M)**, and **Outcome (Y)** from the dropdowns (any combination of observed and latent)
2. Optionally rename the parameter (defaults to `indirect`, `indirect2`, … on collision)
3. Click **Add indirect effect**

The form ensures the X→M and M→Y paths exist as labeled structural regressions (assigning `a`, `b`, `c`, … as needed), then emits a `name := a*b` line. Re-running with the same triple is idempotent — it won't duplicate paths or rename existing labels. If a path is already pinned to a fixed coefficient, the form refuses to overwrite it and asks you to clear the constraint first.

For total effects, contrasts, or any custom expression — type `name := expression` directly into the [syntax box](#lavaan-syntax-box). It appears in the **Indirect effects** list with a remove (×) button, alongside any GUI-generated entries.

> **Bootstrap CIs come automatically** — if the [bootstrap option](./confirmatory-factor-analysis.md#bootstrap) is on, lavaan computes confidence intervals on every `:=` parameter using the same resampling pass. This is the right way to test mediation: indirect effects don't have analytic SEs.

### Lavaan syntax box

The **lavaan syntax** accordion (right column) holds the canonical model text. It is *not* a one-way preview — anything you type there flows back into the matrices, just as anything you do in the matrices flows into the text. There's no Apply/Cancel button — the matrices update automatically as you type.

Practical implications:

- **Paste a model from a publication** — drop the lavaan syntax in, the matrices reorganize to match. Useful when literature reports their model in lavaan notation.
- **Type things the matrices don't model** — equality constraints (`a == 2*b`), inequality (`a > 0`), starting values, label names, fixed values, comments. They survive matrix edits because the parsed buffer is the source of truth, not what the matrices know how to render.
- **Mid-typing safety** — if a line doesn't parse yet (e.g. you're in the middle of typing `F1 =~ x1 +`), the matrices freeze on the last good state instead of clearing.

The **Copy** button copies the current text to the clipboard.

> **What if lavaan reports an error?** The error appears below the box and the matrices stay frozen on the last successful parse — they don't go blank. Fix the syntax and the matrices catch up automatically.

### Constraints and modifiers

Click an already-ticked cell in either matrix to open a popover for that cell:

- **Type a number** (`1`, `1.5`, `-0.3`, `1e2`) — fixes the parameter to that value
- **Type a label** (`a`, `loading_anx_1`) — creates an equality constraint; every cell with the same label is forced to share one estimate
- **Leave empty + OK** — reverts to a free parameter
- **× button** — removes the parameter entirely (same as un-ticking the cell)

This is how you'd specify, say, two loadings constrained to be equal (`F1 =~ a*x1 + a*x2 + x3`) without touching the syntax box.

### Diagram preview

Below the editor, the live diagram renders whatever currently parses. Latents are ellipses, observed variables are rectangles, structural arrows go between them, factor → indicator arrows go from each latent ellipse to its indicators stacked alongside it, and covariance arcs curve out to the side. With no estimates yet, the edges show modifier labels (fixed values, label names) where present and stay unlabelled otherwise. After a fit, the same renderer shows the [post-fit diagram](#path-diagram) with estimates.

If your buffer doesn't parse yet, the preview blanks out — same logic as the matrices.

## Options

The right column hosts every fit option. Most overlap with CFA — see the [CFA options](./confirmatory-factor-analysis.md#options) for **Factor scaling**, **Factor correlations**, **Missing data**, **Standardization**, **Bootstrap**, and **Output options**. The SEM-specific bits are below.

### Estimator

| Estimator | When to use |
|---|---|
| **ML** | Default. Continuous, roughly normal data, N > 200. |
| **MLM** | Robust ML with Satorra-Bentler correction — continuous but non-normal. |
| **MLMVS** | Robust ML with Satterthwaite correction. |
| **MLMV** | Robust ML, scale-shifted. |
| **WLSMV** | Robust DWLS, mean+variance adjusted. **The recommended default for ordinal indicators.** |
| **ULSMV** | Robust ULS, mean+variance adjusted — alternative for ordinal data. |
| **DWLS** | Diagonally Weighted Least Squares — ordinal indicators. |
| **ULS** | Unweighted Least Squares — ordinal alternative. |
| **WLS** | Weighted Least Squares — large samples (N > 1000). |
| **GLS** | Generalized Least Squares — robust to non-normality. |

> **Lavaan auto-upgrades the estimator for ordered indicators.** If any selected variable is marked ordinal, lavaan silently switches the requested estimator to WLSMV. The [model summary](#model-summary) shows what was actually used and what you asked for, so the discrepancy is never invisible.

### Mean structure

Off by default. Turn **Estimate intercepts** on when you need:

- **Latent mean comparisons** in multi-group models (the scalar invariance level requires it)
- **Mediation involving means**, or any other model where intercept-level information matters
- **FIML** — but if you've selected FIML, lavaan flips this on automatically; you don't need to check the box

Two sub-options appear when meanstructure is on:

- **Free observed-variable intercepts** (on by default) — observed `~ 1` parameters are estimated. Off means they're fixed (rarely what you want).
- **Free latent-variable intercepts** (off by default) — latent `~ 1` parameters are estimated. On is needed to *get* latent means as output. In a single-group model with no comparison reference, leaving this off is the safer default.

> **In most single-group models, leave mean structure off.** It adds parameters that have no inferential purpose unless you're comparing groups, predicting from means, or computing mean-based defined parameters.

### Invariance testing

Same dropdown as in CFA — pick a categorical variable to run sequential configural / metric / scalar / strict tests. **In v1 this only runs on pure CFA models.** If you select a group variable on a model that has structural equations, the run will fall back to single-group SEM with a notice that the group variable was ignored. For multi-group SEM, fit each group manually and compare via the [model comparison](#model-comparison) feature.

## Check data

Same diagnostics as [CFA's Check data](./confirmatory-factor-analysis.md#check-data). The button checks the indicators referenced in the measurement model when one is defined, otherwise all selected numeric variables. Path-only models (no measurement) check all numerics.

## Validation rules

- Either at least one factor with **2+ indicators**, or at least one structural equation with **1+ predictor**
- Each second-order factor needs **2+ first-order factors**
- Model must be at least just-identified (**df ≥ 0**); df = 0 produces a warning

The **Run SEM** button stays disabled until the model passes validation. The **N : free-parameter ratio** is reported in the summary; below 5 triggers an "underpowered" warning.

## Reading results

Results appear in a **Structural equation modeling** card (or **Confirmatory factor analysis** when no structural equations are present — the module routes through `lavaan::cfa()` to preserve reliability and discriminant-validity output).

### Model summary

- **Factors** and **Structural equations** count
- **Estimator** — shows the actual fit estimator; if lavaan auto-upgraded due to ordinal indicators, the requested estimator appears in parentheses
- **Degrees of freedom**, **Free parameters**, **Sample size**
- **N : parameter ratio** — flagged if below 5 (rule of thumb: aim for 5–10)
- Two action buttons: **Restore this model** (reverts the editor to this run's state) and **Add to comparison** / **Remove from comparison**

> **Sample size under FIML.** With FIML the displayed N is the full sample, since lavaan estimates on every case using the available-data likelihood. With listwise deletion, only complete cases are counted. The summary makes the distinction explicit.

### Model fit

The fit indices table is identical to CFA's. See [Model fit indices](./confirmatory-factor-analysis.md#model-fit-indices) for thresholds and interpretation. With a robust estimator (MLM, WLSMV, …), the table shows scaled chi-square and the `*.robust` / `*.scaled` versions of CFI / TLI / RMSEA, with a "Robust/scaled indices reported" note at the top.

### Path diagram

Latents are blue ellipses, observed variables are grey rectangles, structural paths are arrows between them, measurement paths go from each ellipse to its indicators (stacked alongside), and covariances curve out to the side. Edge thickness is proportional to |estimate|; non-significant paths (p > .05) are dashed at reduced opacity.

A **standardization picker** sits above the diagram — three radio buttons that toggle between unstandardized, latent-only standardized (`std.lv`), and completely standardized (`std.all`). Switching is instant — all three variants are pre-rendered and the picker just swaps which is visible. Each variant has its own **Export as SVG** filename suffix.

### Standardized estimates toolbar

The first parameter-estimate table is preceded by a small toolbar with two checkboxes — **Latent only** and **Completely standardized**. Toggling them shows or hides the corresponding `Std. (latent only)` and `Std. (completely)` columns across every estimate table at once. The unstandardized **Estimate** column is always visible.

> The toolbar makes it easy to compare standardized and unstandardized side by side without rerunning. The default visible column matches your **Standardization** option choice from before the run.

### Structural regressions

When the model has any `~` lines, this table is shown first, before factor loadings — the structural model is usually what you want to read at a glance.

| Column | Meaning |
|---|---|
| **Predictor** | Right-hand side of the regression |
| **Outcome** | Left-hand side (endogenous variable) |
| **Estimate** | Unstandardized coefficient |
| **Std. (latent only)** | Standardized using latent variance only |
| **Std. (completely)** | Standardized using both latent and observed variances |
| **CI** | Confidence interval (bootstrap when enabled) |
| **SE**, **z**, **p-value** | Standard error, z-statistic, p-value |

> **A standardized regression is interpretable as a partial correlation** between predictor and outcome, holding other predictors in the same equation constant.

### Factor loadings

Same shape as in CFA — see [Factor loadings](./confirmatory-factor-analysis.md#parameter-estimates). The SEM card includes the standardized columns and shares the toolbar with all other estimate tables.

### Covariance estimates

A single combined `~~` table covers every off-diagonal covariance — residual-residual, factor-factor, and mixed. Columns are **Variable 1**, **Variable 2**, **Estimate**, the two standardized columns (the `Std. (correlation)` column is the standardized form, equivalent to a correlation), **CI**, **SE**, **p-value**.

> **In CFA results, this single table is split into Factor covariances and Residual covariances** — two separate sections instead of one. The underlying parameters are the same.

### Defined parameters

When the model has `:=` lines (mediation indirect effects, total effects, custom expressions), this table appears below the covariances. Columns: **Name**, **Expression** (the lavaan formula), **Estimate**, **CI**, **SE**, **z**, **p-value**.

> **CIs on `:=` parameters are bootstrap-derived when bootstrap is on**, and asymptotic (delta-method) otherwise. Bootstrap is the recommended way to test indirect effects — the sampling distribution of `a*b` is not normal, so percentile-based intervals respect that.

### Intercepts

Only emitted when [mean structure](#mean-structure) is on. Lists `~ 1` parameters for every variable lavaan estimates an intercept on (observed and, optionally, latent).

### Factor variances and residual variances

Same as in CFA. **Negative variance estimates (Heywood cases) are highlighted in red**, with a warning above the table — they indicate misspecification, weak indicators, or a sample too small to identify the model.

### R² (variance explained)

Per-endogenous-variable R². For indicators, the R² is the proportion explained by their factor loadings; for endogenous latents and observed outcomes in a structural equation, it's the proportion explained by their predictors. With WLSMV on ordered indicators, the R² is computed on the latent (continuous) response variable, not the observed categories.

### Factor reliability

Same metrics and thresholds as CFA — see [Factor reliability](./confirmatory-factor-analysis.md#factor-reliability). Reliability is computed only for first-order factors that load on observed variables.

### Discriminant validity

Same three sub-tables (factor correlations, HTMT, Fornell-Larcker) as in CFA. See [Discriminant validity](./confirmatory-factor-analysis.md#discriminant-validity).

### Modification indices

For SEM models, suggestions split into four buckets (each filtered to MI > 3.84, top 30 per bucket):

- **Suggested covariances** — `~~` pairs, of any kind. Each row has an **Apply** button that adds the line to the covariances list.
- **Suggested regression paths** — `~` predictors that would improve fit. **Apply** adds the path to the structural matrix. A note warns that paths change the structural model.
- **Suggested cross-loadings** — `=~` cross-loadings. **Apply** adds the loading; a note warns the factor structure is changing.
- **Other modification indices** — anything that didn't fit the above buckets, displayed read-only.

> **Modification indices say what would improve fit, not what should change.** Apply only when a change has a theoretical justification — "the items share method variance" is good; "CFI goes up" is not. Each data-driven modification capitalizes on sample-specific noise. If you accept any, report them transparently and ideally cross-validate on a holdout sample.

### Residual correlations

Same matrix as in CFA — pairs with |r| > 0.10 highlighted as localized misfit.

## Mediation walkthrough

A typical single-mediator analysis with bootstrap CIs:

1. Build the measurement model in the top matrix (or skip if X, M, Y are all observed)
2. In the **Indirect effects** form, pick X, M, Y; click **Add indirect effect**
3. Turn on **Bootstrap confidence intervals** in the options
4. Switch **Missing data** to **Listwise deletion** if FIML is selected — bootstrap is incompatible with FIML
5. Click **Run SEM**

In the results:

- The **Structural regressions** table shows the `a` (X→M) and `b` (M→Y) paths with their bootstrap CIs
- The **Defined parameters** table shows `indirect := a*b` with its bootstrap CI — this is your indirect effect
- For a total effect, type `total := a*b + c` in the syntax box (where `c` is the X→Y label, if you've added that path) and rerun

> **Bootstrap × FIML.** Lavaan rejects this combination because bootstrap resamples cases while FIML works across missingness patterns. The **Bootstrap confidence intervals** checkbox auto-disables when FIML is selected — switch to listwise deletion to enable it.

## Model comparison

Multiple fits — CFA-shape, SEM-shape, or mixed — can be queued and compared. Same workflow as in [CFA model comparison](./confirmatory-factor-analysis.md#model-comparison): click **Add to comparison** in each result card, then **Compare models** when 2+ are queued. The table compares fit indices side by side; nested pairs (auto-detected from each model's free-parameter signature) get a chi-square difference test; non-nested pairs are evaluated via AIC/BIC.

## Reporting checklist

**Method:**
- Model — measurement and structural specification (the [lavaan syntax](#lavaan-syntax-box) is a compact way to communicate this)
- Estimator and why; whether lavaan auto-upgraded (e.g. WLSMV for ordinal indicators)
- Factor scaling (marker variable or fixed variance)
- How missing data were handled (listwise or FIML); if mediation, note that bootstrap requires listwise
- Sample size and N : parameter ratio
- Mediation: bootstrap method (BCa, BC, or percentile, as reported in the CI column header) and number of replications
- Modifications applied to the initial model and why

**Results:**
- Fit indices — chi-square (df, p), CFI, TLI, RMSEA (with 90% CI), SRMR; report scaled versions when a robust estimator is used
- Standardized factor loadings (measurement)
- Standardized regression coefficients (structural), with CIs
- Indirect / total effects with their bootstrap CIs
- Factor reliability (CR, AVE) if relevant
- Modification indices applied (if any), with theoretical justification

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) — inspect, copy, or re-run. SEM uses the `lavaan` R package; reliability and discriminant validity metrics use `semTools`. Citations appear at the top of the output card. The lavaan syntax box also lets you export the model specification directly.

## Common pitfalls

**Causal language from cross-sectional data.** A `~` arrow in the syntax does not establish causation — it specifies a directional regression, but interpreting that directionally requires a research design that supports it (longitudinal data, experimental manipulation, an instrumental variable, or a strong theoretical / temporal argument). SEM fits the model you specify; it doesn't validate the direction.

**Indirect effects without coverage.** Mediation tests need bootstrap CIs — the indirect-effect distribution is skewed, and Wald-style asymptotic SEs miscalibrate the test. If the **Defined parameters** table reports a normal-theory CI (no bootstrap), the indirect-effect significance is unreliable.

**Modification index chasing on the structural side.** As tempting as it is to drop in suggested regression paths until CFI crosses 0.95, every data-driven path is a sample-specific decision that may not replicate. Apply only paths the theory supports, report every change, and consider the final model exploratory rather than confirmatory.

**Cycle that breaks identification.** The structural matrix accepts feedback loops (lavaan supports them), but identification requires extra constraints — typically instrumental variables or fixed parameters. Cycle highlighting tells you a loop exists; whether the loop is identified is not auto-checked. Convergence warnings or large standard errors are usually the first sign of trouble.

**Mean structure left on by accident.** Turning meanstructure on adds parameters and changes which fit indices are computed. Unless you have a reason — invariance testing, mean-based defined parameters, FIML — leave it off. The default off-state is correct for almost every single-group SEM.

**Multi-group SEM.** Multi-group invariance testing in this module is CFA-only in v1. If you need a multi-group structural model, fit each group separately and compare via [model comparison](#model-comparison), or paste the multi-group lavaan syntax (`group = "..."`, `group.equal = c(...)`) directly into the syntax box — the module will preview the model for the first group with a notice and run lavaan unmodified.

**SEM as evidence, not proof.** Good fit means the data is consistent with the model — it doesn't prove the model is correct. Multiple alternative structures can produce equivalent fit. Use [model comparison](#model-comparison) to check competing structures and report the comparisons honestly.
