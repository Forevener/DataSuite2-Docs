---
title: Regression analysis
description: Linear, logistic, ordinal, multinomial, Poisson, negative binomial, zero-inflated and hurdle regression with regularization in DataSuite 2.
---

# Regression analysis

The **Regression analysis** module builds models that predict an outcome from one or more predictors. It supports eight regression types, six estimation methods (a bias-reduced fit for separated data and four regularized ones alongside the classic fit), mediation and moderation analyses, optional diagnostics, and a model comparison mode that evaluates every possible predictor combination. {#regression-analysis}

> **What is regression?** A model that predicts one variable from others and says how much each contributes with the rest held still – see [regression](./concepts/regression-basics.md#b-regression), the page every card of this module is read with.

1. Select a [dependent variable](#variable-selection), [predictors](#variable-selection), and optional [mediators, moderators, or covariates](#mediators-moderators-and-covariates)
2. Choose a [regression type](#regression-type) and [estimation method](#estimation-method)
3. Toggle [additional statistics and diagnostics](#additional-statistics)
4. Click **Run regression** – or use [model comparison](#model-comparison) to find the best predictor combination
5. For multi-equation models, use the [Advanced tab](#path-analysis-advanced-mode) to build a path diagram

The view has two tabs:

- **Simple** – one equation, built from the variable lists: the dependent variable, predictors, mediators, moderators and covariates. It opens by default, and the rest of this page describes it, apart from [path analysis](#path-analysis-advanced-mode).
- **Advanced** – a system of equations you write in a formula editor and see as a live diagram: each line is one equation, the covariates join every one of them, and the indirect effects along the drawn chains are estimated and tested – see [path analysis](#path-analysis-advanced-mode).

## Variable selection

Three variable lists appear on the left:

- **Dependent variable(s)** – the outcome to predict. The list shows only the types the chosen [regression type](#regression-type) accepts (numeric for linear, binary for binomial logistic). Selecting several runs a separate regression for each: every one is attempted on its own, so a failure on one does not cost the rest, and the ones that failed are named after the batch.
- **Predictors** – the independent variables whose effects the model estimates. At least one predictor or covariate is required. In [model comparison](#model-comparison) these are the variables whose combinations are ranked.
- **Covariates** – control variables that are always in the model. In [model comparison](#model-comparison) they stay fixed while the predictors are varied; in a single fit a [covariate](./concepts/regression-basics.md#b-covariate) is a predictor by another name, entered and estimated the same way.

A variable selected in one list is hidden from the others, so nothing appears on both sides of the equation.

### Mediators, moderators, and covariates

Two further lists open as collapsed accordions below the predictors – **Mediators** and **Moderators** – beside the **Covariates** one. All five buckets are mutually exclusive: a variable can appear in only one.

- **Mediators** – the variables an effect is supposed to travel through. Selecting any runs a [mediation analysis](#mediation-analysis) for every predictor × mediator pair. A mediator must be numeric – its model is a linear regression – and a categorical one is rejected before the run. Several mediators are fitted in parallel, each indirect effect controlling for the others; a serial chain is drawn on the [Advanced tab](#path-analysis-advanced-mode).
- **Moderators** – the variables an effect is supposed to depend on. Selecting any adds every predictor × moderator interaction to the main model and runs a [moderation analysis](#moderation-analysis) with simple slopes. A numeric moderator also shows the **Moderator probe points** selector and the **Johnson-Neyman region of significance** checkbox in [Additional statistics](#additional-statistics); mediators and moderators together show **Conditional indirect effects**.

Both lists are hidden – and any picks in them cleared – under a regularized estimation method and under the **multinomial**, **zero-inflated count** and **hurdle count** types; the card says so and points at the plain Poisson or negative binomial family instead. **Ordinal** outcomes keep both: mediation runs as causal mediation with a proportional-odds outcome model, moderation as proportional-odds simple slopes.

> **What are mediators and moderators?** A mediator carries an effect – exercise → better sleep → less depression – and a moderator changes its strength or direction, as when the effect holds for one group and not another. See [mediation](./concepts/regression-basics.md#b-mediation) and [moderation](./concepts/regression-basics.md#b-moderation).

#### Mediation analysis

**Mediation analysis.** One subsection per predictor × mediator pair, headed by the pair. The estimator follows the outcome type – the product of coefficients for a linear outcome, [causal mediation](./concepts/regression-basics.md#b-causal-mediation) for every other family – and notes above the tables state the [sequential ignorability](./concepts/regression-basics.md#b-sequential-ignorability) the effects rest on, that several mediators are modelled in parallel, and, when the [bootstrap replications](./settings.md#bootstrap-replications) setting is below 1,000, that the intervals rest on too few draws to be reported – naming the procedure that ran, since bootstrap resamples, quasi-Bayesian draws and a percentile bootstrap have different floors.

For a **linear outcome** the mediators enter one joint outcome model (`Y ~ predictors + M₁ + … + Mₖ + covariates`), and each pair's table has a row per quantity, with its **Estimate**, **SE** and **p**:

- **Path a (X → M)** – the predictor's effect on the mediator – [path a](./concepts/regression-basics.md#b-path-a)
- **Path b (M → Y)** – the mediator's effect on the outcome, controlling for the predictor and any co-mediators – [path b](./concepts/regression-basics.md#b-path-b)
- **Total effect (c)** – the predictor's overall effect on the outcome, mediator out of the model – [total effect](./concepts/regression-basics.md#b-total-effect); on a causal-mediation table the row reads **Total effect** and carries the interval and *p* of the simulation {#total-effect-c #total-effect}
- **Direct effect (c')** – the predictor's effect with the mediator(s) held constant – [direct effect](./concepts/regression-basics.md#b-direct-effect)
- **Indirect effect (a×b)** – the mediated part, a × b. It has no *p*-value: it is significant when its bias-corrected bootstrap interval excludes zero – [indirect effect](./concepts/regression-basics.md#b-indirect-effect)
- **Bias-corrected bootstrap CI** – the interval of the indirect effect at the configured confidence level, from resamples of the data with every mediator model refitted on each; its **Boot SE** is the spread of those resampled estimates. When the correction cannot be computed the plain percentile interval is used instead, and if some resamples failed to fit a note reports how many of the requested ones the interval rests on {#bias-corrected-bootstrap-ci #boot-se}
- **Proportion mediated** – the indirect effect as a share of the total. Reported only when the total effect is significant at the configured alpha, with a note saying so otherwise; another note flags a ratio outside (0, 1) – opposite signs, or an indirect effect larger than the total – as not a proportion of the total effect – [proportion mediated](./concepts/regression-basics.md#b-proportion-mediated)
- **Total indirect effect** – with several mediators, one extra subsection: per **Predictor**, the sum of its indirect effects through all of them, resampled as one quantity with its own bias-corrected interval; for a linear outcome it equals the total effect minus the direct effect – [total indirect effect](./concepts/regression-basics.md#b-total-indirect-effect)

For a **logistic, ordinal, Poisson or negative binomial outcome** the product of coefficients is not used – path a is a linear effect and path b a log-odds or log-rate one, and their product means nothing – so the effects come from causal mediation (the `mediation` package), simulated on the response scale:

- **Indirect effect (ACME)** – the average causal mediation effect – [ACME](./concepts/regression-basics.md#b-acme)
- **Direct effect (ADE)** – the average direct effect – [ADE](./concepts/regression-basics.md#b-ade); the **Total effect** and **Proportion mediated** rows read as above
- **Quasi-Bayesian CI** – the interval every row carries, with its *p*-value, from the simulation draws
- **Outcome category** – for an ordinal outcome the table is per category: each row is the effect on the probability **Pr(Y = k)** of that category, with a **Percentile bootstrap CI** from a nonparametric bootstrap, because a single averaged number cannot summarize an ordered multi-category response; no proportion mediated is defined for it {#outcome-category #pry #percentile-bootstrap-ci}
- **Indirect effect (ACME, control)** and **Indirect effect (ACME, treated)** – on the ordinal table, the mediated effect with the predictor held at its low and at its high value, since under a non-linear link the two are different quantities {#indirect-effect-acme-control #indirect-effect-acme-treated}
- **Direct effect (ADE, control)** and **Direct effect (ADE, treated)** – the same split for the direct effect {#direct-effect-ade-control #direct-effect-ade-treated}

**Treatment contrast.** Causal mediation reports its effects for a change in the predictor between two values, and a note under the table names them: a numeric predictor from its mean − 1 SD to its mean + 1 SD, a binary numeric one between its two observed values, a categorical one between its first two levels. Every ACME, ADE and total effect on the card is per that step, not per unit – [treatment contrast](./concepts/regression-basics.md#b-treatment-contrast).

A mediator whose model could not be fitted keeps its row, labelled not computed with the reason, rather than disappearing from the table as if there were no effect.

> **Reading mediation results:** the question is whether the indirect effect – a × b or ACME – has an interval that excludes zero; a significant direct effect beside it means partial mediation. See [indirect effect](./concepts/regression-basics.md#b-indirect-effect) and [proportion mediated](./concepts/regression-basics.md#b-proportion-mediated).

#### Moderation analysis

**Moderation analysis.** One subsection per predictor × moderator pair with its simple slopes table, read off the same model the coefficient table reports – all predictors, all moderators and every interaction, the focal moderator held at the probe value and any other numeric moderator at its mean. Every regression type gets one except **multinomial**, where a nominal outcome has one contrast per non-baseline category and no single slope to probe; the card says so and points at the per-outcome coefficient tables.

- **Moderator level** – the row: a numeric moderator's three probe points (**-1 SD**, **Mean** and **+1 SD**, or the **16th percentile**, **50th percentile** and **84th percentile**), each with its value in data units, or a categorical moderator's levels. A probe outside the moderator's observed range is marked with a dagger (†) and a note names the range, so an extrapolated slope is not read as an observed one. {#moderator-level #1-sd #16th-percentile #50th-percentile #84th-percentile}
- **Slope** – the predictor's effect at that moderator value, with its **SE** and **p** – [simple slopes](./concepts/regression-basics.md#b-simple-slopes)

**Moderator probe points.** A selector in [Additional statistics](#additional-statistics), shown whenever a numeric moderator is selected; it sets the three values the simple slopes and the conditional indirect effects are read at.

- **Mean and ±1 SD** – the default and the classic choice
- **16th, 50th and 84th percentiles** – three points that always lie inside the observed data; the choice when the moderator is visibly skewed or bounded, where mean − 1 SD can fall below the smallest value anyone in the sample has

> **Reading moderation results:** a significant interaction term means the predictor's effect depends on the moderator, and the simple slopes say what it is at each probe – see [moderation](./concepts/regression-basics.md#b-moderation) and [simple slopes](./concepts/regression-basics.md#b-simple-slopes).

#### Johnson-Neyman region of significance

**Johnson-Neyman region of significance.** A checkbox in [Additional statistics](#additional-statistics), on by default and shown whenever a numeric moderator is selected; a categorical moderator has no continuum for a boundary to fall on, so the option stays hidden. Where the simple slopes probe three fixed points, it solves for the moderator values at which the predictor's effect crosses the significance boundary – "significant above w = 2.4" rather than "significant at +1 SD" – see [region of significance](./concepts/regression-basics.md#b-johnson-neyman-region-of-significance).

The output sits under each simple slopes table, as a small table and a plot:

- **Observed moderator range** – the span of moderator values in the data, which every boundary is read against
- **Johnson-Neyman boundary** – a moderator value at which the effect crosses significance, one row each; a boundary outside the observed range is not reported, and when the effect is significant everywhere in range, or nowhere, the region row says so instead of listing boundaries
- **Region of significance** – which side of the boundaries the effect holds on: above, below, between or outside them, across the whole observed range, or at no observed value
- **Observed cases in the significant region** – the share of the actual cases, not of the plotted grid, whose moderator value falls where the effect is significant
- **Conditional effect** – the plot under the table: the conditional slope across the moderator's observed range with its confidence band, dashed lines at the boundaries and green shading over the significant region {#conditional-effect #conditional-effect-of-across}

#### Conditional indirect effects

**Conditional indirect effects.** A checkbox in [Additional statistics](#additional-statistics), shown only when both mediators and moderators are selected. It asks whether the indirect effect varies with the moderator – [moderated mediation](./concepts/regression-basics.md#b-conditional-indirect-effects) – and computes it at each probe point, bootstrapped for a linear outcome and simulated for logistic, Poisson and negative binomial ones. For an **ordinal** outcome it is not decomposed per category: the unconditional per-category table is shown with a pointer to the [SEM](./structural-equation-modeling.md) module. On the [Advanced tab](#path-analysis-advanced-mode) the checkbox is hidden, since that tab reports conditional indirect effects per drawn path. {#conditional-indirect-effects #conditional-indirect-effects-moderated-mediation}

The card has one subsection per predictor × mediator × moderator triple, with the probe-point rows and dagger of the simple slopes table:

- **Indirect effect** – the indirect effect at that moderator value, with its **Boot SE** (**SE** under causal mediation) and interval; significant when the interval excludes zero
- **Index of moderated mediation** – the summary row when the conditional indirect effect is linear in the moderator (one moderated path, or a two-level moderator): one number that holds across the moderator's range, and an interval excluding zero means the mediation is significantly moderated. Otherwise the row reads **Change in indirect effect per unit of the moderator** and a note says which quantity it holds – the average change between the outer probes for a response-scale ACME, or the rate of change at the moderator's mean when more than one path is moderated – [index of moderated mediation](./concepts/regression-basics.md#b-index-of-moderated-mediation) {#index-of-moderated-mediation #change-in-indirect-effect-per-unit-of}

#### Sensitivity to unmeasured confounding

- **Sensitivity of the indirect effect to unmeasured confounding** – a checkbox in [Additional statistics](#additional-statistics), shown for **linear** and **binomial** outcomes when mediators are selected. Every ACME rests on there being no unmeasured confounder of the mediator–outcome relation, which the data cannot check; this analysis asks instead how much confounding it would take to explain the effect away, re-estimating the indirect effect across a grid of [ρ](./concepts/regression-basics.md#b-sensitivity-ρ) – see [sensitivity to unmeasured confounding](./concepts/regression-basics.md#b-sensitivity-to-unmeasured-confounding). A binomial outcome reaches it through a probit refit of its outcome equation, and a note says so. {#sensitivity-of-the-indirect-effect-to-unmeasured-confounding #sensitivity-to-unmeasured-confounding}
- **Also for paths through a categorical mediator** – nested under it on the [Advanced tab](#path-analysis-advanced-mode), where the analysis runs path by path on the models that produced each path's reported effect. A path whose mediator is categorical needs its mediator equation refitted as a probit, which costs about a minute per path, so those paths are included only on request and show the breakdown ρ and the variance shares alone. Three shapes are named rather than skipped: a binary mediator under a binary outcome, the same mediator with this option off, and a chain through more than one mediator.

The block sits under each pair's mediation table – one table per predictor × mediator path, plus a plot:

- **ACME at ρ = 0** – the indirect effect with no confounding, which reproduces the estimate reported above it; withheld after a probit refit, whose own effect is stated at a different contrast from the card's
- **ρ at which ACME = 0** – the breakdown point: the correlation between the two equations' errors at which the indirect effect reaches zero, searched on a grid and reported to its precision; when the effect survives the whole search the table says so – [breakdown point](./concepts/regression-basics.md#b-ρ-at-which-acme-0)
- **Share of residual variance** – the breakdown point restated as the product of the shares of unexplained variance an omitted confounder would have to account for in both equations – [share of residual variance](./concepts/regression-basics.md#b-share-of-residual-variance)
- **Share of total variance** – the same, against each variable's total variance; the two shares are the numbers to report, since they are read without knowing what ρ is – [share of total variance](./concepts/regression-basics.md#b-share-of-total-variance)
- **Under treatment** and **Under control** – with a probit outcome the table has a row for each, because the effect under each condition is a different quantity there; a linear outcome makes them one and gets one row {#under-treatment #under-control}

The plot draws the indirect effect across ρ with its interval, a dashed line at the breakdown point and green shading where the interval still excludes zero; it is drawn only where the magnitude is shown. {#indirect-effect-across-ρ}

#### Checks before the run

Before anything is fitted, the selection is checked against what R will be asked to do, and each failure is reported as a validation message rather than a raw R error:

- a variable in two of the five buckets is rejected by name
- a variable with fewer than two distinct values among the complete cases is rejected
- the count families refuse a negative dependent variable and warn, without blocking, when it holds non-integer values
- the run is blocked when the complete cases number no more than the model's parameters, counted per family – a multi-category outcome is charged what it costs – and per dependent variable; regularized methods skip this check, since n ≤ p is what they are for, and have guards of their own: at least 4 complete cases, and at least 3 cases in every outcome category for the classification families
- the binomial, ordinal, multinomial and count families get a non-blocking warning when the [events per parameter](./concepts/regression-basics.md#b-events-per-parameter) fall below about 10, counted over the rows that survive listwise deletion

## Model setup

### Regression type

The family the outcome is modelled in. It decides which variable types the dependent list accepts, which controls appear below it and which cards the run prints; pick it by the shape of the outcome. {#regression-type}

- **Linear** – a continuous numeric outcome, fitted by least squares – see [linear regression](./concepts/regression-basics.md#b-linear-regression) {#linear #linear-regression}
- **Robust linear** – a continuous outcome with heavy tails or contaminated rows, fitted by MM-estimation so that a minority of bad rows cannot drag the coefficients – see [robust linear regression](#robust-linear-regression) below {#robust-linear #robust-linear-regression-mm-estimation}
- **Quantile** – conditional quantiles of a continuous outcome rather than its mean, for an effect that may differ between the bottom and the top of the outcome's distribution – see [quantile regression](#quantile-regression) below {#quantile #quantile-regression}
- **Binomial logistic** – a two-category outcome (yes/no, pass/fail), so the dependent list shows binary variables – see [logistic regression](./concepts/regression-basics.md#b-logistic-regression) {#binomial-logistic #binary-logistic-regression}
- **Ordinal logistic** – ordered categories (low/medium/high), fitted as a proportional-odds model – see [ordinal logistic regression](./concepts/regression-basics.md#b-ordinal-logistic-regression) {#ordinal-logistic #ordinal-logistic-regression}
- **Multinomial logistic** – three or more unordered categories, one equation per category against the [reference outcome](#reference-outcome-multinomial-only). A numeric outcome with three or more distinct values is accepted as well, since multinomial is the usual fallback when [proportional odds](./concepts/regression-basics.md#b-proportional-odds) fail on an outcome coded 1, 2, 3; the module factors it, and the reference outcome selector works on numeric levels as on text ones – see [multinomial logistic regression](./concepts/regression-basics.md#b-multinomial-logistic-regression) {#multinomial-logistic #multinomial-logistic-regression}
- **Poisson** – a non-negative count outcome (0, 1, 2, …) whose variance is about its mean – see [Poisson regression](./concepts/regression-basics.md#b-poisson-regression) {#poisson #poisson-regression}
- **Negative binomial** – a count outcome with [overdispersion](./concepts/regression-basics.md#b-overdispersion) – variance above the mean, the usual case; the Poisson card's dispersion row says when to switch – see [negative binomial regression](./concepts/regression-basics.md#b-negative-binomial-regression) {#negative-binomial #negative-binomial-regression}
- **Zero-inflated count** – a count with far more zeros than a one-equation count model can produce, some of them from cases that never generate a count at all – see [two-part count models](#two-part-count-models) below {#zero-inflated-count #zero-inflated-poisson-regression #zero-inflated-negative-binomial-regression}
- **Hurdle count** – a count where "any at all?" and "how many, once there are any?" are separate processes – see [two-part count models](#two-part-count-models) below {#hurdle-count #hurdle-poisson-regression #hurdle-negative-binomial-regression}

> **Time-to-event outcomes?** Durations with possible censoring – survival, time to failure, time to relapse – belong to the [Time to event analysis](./time-to-event-analysis.md) module; treated as a plain number in a linear or Poisson model, censored times bias the fit.

> **Time-ordered outcomes?** Sales, sensor readings, traffic – anything whose successive observations are autocorrelated – belong to the [Time series analysis](./time-series-analysis.md) module; a regression on autocorrelated data reports over-confident standard errors, and ARIMA and ETS model the dependence directly.

> **Linear or logistic?** A linear model predicts a number, a logistic one the probability of a category, and a linear fit to a yes/no outcome can predict probabilities below 0 or above 1 – see [logistic regression](./concepts/regression-basics.md#b-logistic-regression).

> **Poisson or negative binomial?** Poisson assumes the variance equals the mean, and real counts are usually more variable than that: a dispersion well above 1 on the Poisson card says to switch – see [overdispersion](./concepts/regression-basics.md#b-overdispersion). Extra variability sitting in the zeros rather than across the range is the [two-part families'](#two-part-count-models) case – see [excess zeros](./concepts/regression-basics.md#b-excess-zeros).

### Two-part count models

The **Zero-inflated count** and **Hurdle count** types fit two equations at once – one for the counts and a logistic one for the zeros – and picking either reveals two more controls under **Regression type**:

- **Count distribution** – the distribution on the count equation. This is a second axis, not a second family: either two-part model takes either distribution, and the zero equation is a logit both ways {#count-distribution}
- **Poisson** – a count part whose variance equals its mean {#count-distribution-poisson}
- **Negative binomial** – a count part with a dispersion parameter of its own, for counts still more variable than a Poisson part allows once the zeros are set aside – see [overdispersion](./concepts/regression-basics.md#b-overdispersion) {#count-distribution-negative-binomial}
- **Zero component predictors** – the terms of the zero equation, which models whether a case produces a zero at all while the predictors above model the count itself. They are offered from the count model's own predictors and covariates rather than from the whole dataset; leave the list empty and the zero side is an intercept alone – one constant zero probability across the sample {#zero-component-predictors}

> **Zero-inflated or hurdle?** Their logits point at opposite events – a zero-inflated model's at being an always-zero case, a hurdle model's at clearing zero – so the same coefficient sign means the opposite thing in the two families, and each table carries a note saying which its equation is about. Choose zero-inflated for a genuinely immune subgroup and hurdle when the first unit is a different decision from the rest – see [zero-inflated](./concepts/regression-basics.md#b-zero-inflated-model) and [hurdle](./concepts/regression-basics.md#b-hurdle-model) models.

The response must be non-negative, whole-numbered and contain at least one zero; all three are checked before the run and reported by name rather than as a raw R error.

These families support less than the one-equation count models do. Not available: the ANOVA table, influence statistics, regularized estimation, [model comparison](#model-comparison), mediation and moderation, and [Advanced (path) mode](#path-analysis-advanced-mode). Still available: collinearity diagnostics, the Breusch-Godfrey autocorrelation test, the residual scatter – Pearson residuals against the expected count – and [goodness of fit](#goodness-of-fit), where the observed-versus-expected-zeros comparison lives.

### Robust linear regression

The **Robust linear** type fits the same linear model by MM-estimation (`robustbase::lmrob`) rather than least squares, so a contaminated minority of rows cannot drag the coefficients – see [MM-estimation](./concepts/regression-basics.md#b-mm-estimation). Reach for it when the outcome is heavy-tailed, or when the sample is known to hold bad rows you would rather down-weight than delete by hand.

The coefficient table reads exactly as the linear one does – estimate, SE, *t*, *p* and a confidence interval – and the β column means what it means everywhere else. The fit summary is different, and nothing in it is blank:

- **Robust R²** – the R² an OLS fit would report, taken on the fitted case weights rather than on raw sums of squares, so not comparable with an OLS R² on the same data
- **Adjusted robust R²** – the same ratio, adjusted for the number of predictors
- **Robust residual scale** – the robust estimate of the residual spread, in place of the residual standard error
- **χ² (Wald test)** – a joint test of the slopes on the fit's own covariance matrix, with its df and *p* beneath; the card carries no AIC, BIC or likelihood-ratio test, and a note says so. A GLM under a [robust covariance](#standard-errors) reports the same row in place of its likelihood-ratio χ², on the corrected matrix

Ticking [influence statistics](#influence-statistics) on a robust fit prints a case-weight report in place of Cook's distance – the weights are the estimator's own influence report, see [case weight](./concepts/regression-basics.md#b-case-weight). Residual diagnostics give the scatter and Durbin-Watson but no Q-Q plot and no Shapiro test, and [goodness of fit](#goodness-of-fit) is withdrawn.

The family is withdrawn in [Advanced (path) mode](#path-analysis-advanced-mode) and refused by [model comparison](#model-comparison). Mediation and moderation run: the indirect effect's bootstrap refits through the robust fit, while the mediator equation stays OLS.

> **Robust regression or deleting outliers?** Dropping a row is a binary judgement to defend in the write-up; MM-estimation makes a continuous one and reports it, row by row, in the case weights – see [case weight](./concepts/regression-basics.md#b-case-weight).

### Quantile regression

The **Quantile** type fits conditional *quantiles* of the outcome (`quantreg::rq`) rather than its conditional mean – see [quantile regression](./concepts/regression-basics.md#b-quantile-regression). Reach for it when a predictor may act differently at the top of the outcome's distribution than at the bottom; a single mean-based coefficient reports one number and hides that entirely.

Two controls appear under **Regression type**:

- **Quantiles (τ)** – the grid of quantiles the model is fitted across; the whole grid costs about what a single point does – see [τ](./concepts/regression-basics.md#b-τ)
- **Median only (0.5)** – the median line alone – see [median regression](./concepts/regression-basics.md#b-median-regression)
- **Quartiles (0.25, 0.5, 0.75)** – the default: the three quartile lines, the fewest that can show an effect changing across the distribution
- **Quartiles and tails (0.1, 0.25, 0.5, 0.75, 0.9)** – the quartiles with the 10th and 90th percentiles, for an effect that may change only in the tails
- **Deciles (0.1 to 0.9)** – nine lines, from the 10th to the 90th percentile
- **Reported quantile** – the one τ every block except the coefficient matrix and the process plot is computed at: standardized betas, collinearity, the diagnostics and the comparison blocks cannot be "all τ at once", so each is computed here and says which τ it came from. Its options are rebuilt from whichever grid is picked

The family's own output:

- **Coefficients across quantiles** – the coefficient matrix in the journal layout: rows are the predictors, columns the τ grid with the module's own OLS estimate first, and each cell the coefficient with its standard error beneath, starred as every other table is. A row whose estimates move across τ is the finding this family exists to show
- **OLS** – the matrix's first column: the least-squares estimate of the same coefficient, the mean line every quantile line is read against
- **τ = {tau}** – one column per quantile of the grid: the coefficient at that τ with its standard error beneath, each column a separate fit of the same model at its own quantile
- **Quantile process plot** – that matrix drawn: one panel per predictor, the coefficient against τ with a confidence band, a zero line and the OLS estimate as a horizontal reference. A line that slopes is a predictor whose effect varies across the outcome's distribution {#quantile-process-plot #coefficient-of-across-quantiles}
- **Quantile (τ)** – the first row of the fit summary, the [reported quantile](#b-reported-quantile) the card was computed at, and the horizontal axis of the process plot
- **R¹** – Koenker & Machado's goodness of fit at that τ, beside quantreg's own analysis-of-deviance **F** against an intercept-only fit at the same τ. It measures fit at one quantile, partitions no variance and is comparable neither across τ nor with an OLS R²; the card carries no AIC, BIC or likelihood-ratio test, and a note says so

The family is withdrawn in [Advanced (path) mode](#path-analysis-advanced-mode) and refused by [model comparison](#model-comparison); the ANOVA table, goodness of fit and every regularized estimation method are switched off rather than errored, so a configuration that asks for them still yields a clean quantile run; and mediation and moderation report a note instead of a table.

> **Quantile or robust?** Both resist outliers, but a median-only fit largely duplicates the [robust family](#robust-linear-regression), which is the more efficient estimator of a central line. Quantile regression earns its place when an effect *varies* across the distribution – invisible at a single τ, which is why the default grid is the quartiles rather than the median alone – see [median regression](./concepts/regression-basics.md#b-median-regression).

### Reference outcome (multinomial only)

- **Reference outcome** – the outcome category every other category's coefficients are measured against, shown under **Regression type** when the type is multinomial and estimation is classic; the default is the first category in sort order. Change it and every number in the table changes meaning while the fit and the predictions stay the same, so pick the category your question treats as the comparison point – the control condition, the status quo, the "no diagnosis" group – see [reference outcome](./concepts/regression-basics.md#b-reference-outcome). [Model comparison](#model-comparison) reads its per-outcome model-averaged tables against the same choice; the selector is hidden under regularized estimation, whose fits have no baseline

> **What is a GLM?** A generalized linear model – a linear predictor, a link and an outcome distribution – see [generalized linear model](./concepts/regression-basics.md#b-generalized-linear-model). Where the diagnostics options say "GLM types" they mean binomial logistic, Poisson and negative binomial: linear is listed apart because it has output options of its own (β, the ANOVA table, correlations), and ordinal and multinomial are fitted by other procedures.

### Estimation method

How the coefficients are found: the classic fit, a bias-reduced one for separated logistic data, or one of four regularized fits that shrink the coefficients and, three of them, select among the predictors – see [regularization](./concepts/regression-basics.md#b-regularization). {#estimation-method}

- **Classic (OLS/MLE)** – least squares for the linear family, maximum likelihood for the rest; every diagnostic is available
- **Firth** – penalized likelihood that keeps logistic estimates finite when a predictor separates the outcome. Binomial only, and everything else on the card keeps working – the ANOVA table reports Wald rather than likelihood-ratio tests, and the confidence intervals are Wald intervals on the penalized fit – see [Firth's penalized likelihood](./concepts/regression-basics.md#b-firths-penalized-likelihood) {#firth #firth-bias-reduced-maximum-likelihood}
- **Ridge (L2)** – shrinks every coefficient toward zero and keeps every predictor; the fit for correlated predictors that all contribute – see [ridge](./concepts/regression-basics.md#b-ridge) {#ridge-l2 #ridge}
- **LASSO (L1)** – shrinks some coefficients exactly to zero, so the terms left non-zero are the selected model – see [LASSO](./concepts/regression-basics.md#b-lasso) {#lasso-l1 #lasso}
- **Elastic net (L1 + L2)** – a blend of the two, selecting like the lasso and sharing like ridge, for predictors that come in correlated groups – see [elastic net](./concepts/regression-basics.md#b-elastic-net) {#elastic-net-l1-l2 #elastic-net}
- **Elastic net mixing (α)** – the share of the penalty that is L1: 0 is pure ridge, 1 pure LASSO, 0.5 the default
- **Group lasso** – the lasso's penalty applied to each predictor's dummy columns as one block, so a categorical predictor enters or leaves the model whole; with no categorical predictor it is the LASSO. Offered for the linear, binomial and Poisson families – see [group lasso](./concepts/regression-basics.md#b-group-lasso)

The **Group lasso** option is hidden for ordinal, multinomial and negative binomial regression, and picking one of them switches the method back to LASSO; **Firth** is shown for binomial logistic only. Both come back when you switch to a family that offers them.

> **When to regularize?** Many predictors relative to the sample, or strongly correlated ones, make a classic fit unstable or overfit; a penalty trades a little bias for a lot less variance – LASSO when many predictors are probably irrelevant, ridge when most contribute, the elastic net for correlated groups – see [regularization](./concepts/regression-basics.md#b-regularization) and the [bias–variance trade-off](./concepts/regression-basics.md#b-bias-variance-trade-off).

> **When to reach for Firth?** When a predictor separates the outcome, the maximum-likelihood estimate runs off to infinity and what you get is a huge coefficient, a huger standard error and a *p* near 1 – a failed fit, not a null result; the [coefficients card](#coefficients) warns when it detects separation and names Firth as the remedy. On ordinary data Firth's penalty shrinks the coefficients slightly and is a defensible default for small samples and rare events – see [separation](./concepts/regression-basics.md#b-separation).

### Lambda selection (regularized methods only)

The controls of a regularized fit sit on the **Single regression analysis** card:

- **Lambda selection** – how much regularization is applied. Every method is fitted along a grid of λ values and cross-validated at each, and this rule picks the point the card reports – see [λ](./concepts/regression-basics.md#b-λ)
- **1 SE rule (lambda.1se)** – the default: the most regularized λ whose cross-validated score is within one standard error of the best, for the simplest model the data cannot tell from the best – see the [1-SE rule](./concepts/regression-basics.md#b-1-se-rule)
- **Best CV performance (lambda.min)** – the λ that optimizes the cross-validated score: the lowest error or deviance for the linear, binomial, multinomial and group-lasso fits, the highest log-likelihood for the ordinal and negative binomial ones (see [Cross-validation summary](#cross-validation-summary)) – for prediction accuracy rather than parsimony
- **Manual** – a λ of your own
- **Lambda value** – the λ to fit at, read on the fitted path's own scale, which spans a different order of magnitude for each method; the nearest point on the path is the one fitted, and the **λ (selected)** row reports it rather than the value typed. The cross-validation summary's **Lambda range** row shows the usable interval

> **lambda.min or lambda.1se?** lambda.min gives the best cross-validated accuracy, lambda.1se a simpler model at a cost the cross-validation cannot measure; the 1-SE rule is the default here, as in glmnet, because a penalty is usually reached for to learn *which* predictors matter, and a rule that keeps a term only when it clearly earns its place answers that more stably – see the [1-SE rule](./concepts/regression-basics.md#b-1-se-rule).

**Assumptions:**
- **Linear regression** – a linear relationship, normally distributed residuals, constant error variance, no multicollinearity and independent observations; enable [diagnostics](#diagnostics) to check them – see [checking a regression](./concepts/regression-basics.md#checking-a-regression) {#-}
- **Logistic regression** (binomial, ordinal, multinomial) – independent observations, no multicollinearity and a sample large enough for stable maximum likelihood; no normality requirement, but ordinal logistic additionally assumes [proportional odds](./concepts/regression-basics.md#b-proportional-odds) {#-}
- **Poisson regression** – a count outcome, independent events and a variance equal to the mean; when the variance exceeds the mean, use negative binomial – see [overdispersion](./concepts/regression-basics.md#b-overdispersion) {#-}
- **Regularized methods** – relax the multicollinearity assumption, since correlated predictors are what they are for, but still assume the right functional form (linear for linear, a logistic link for logistic) {#-}
- **All types** – no omitted-variable bias: a missing confound can make an included predictor look significant, or not, when it should not – see [covariate](./concepts/regression-basics.md#b-covariate) {#-}

## Additional statistics

The **Additional statistics** and **Diagnostics** groups on the **Single regression analysis** card are checkboxes and selectors that add optional output to a run. Each is offered only for the families and estimators that can produce it – every entry below says when – and under a regularized estimation method the two groups offer nothing but [Classification (ROC) analysis](#classification-roc-analysis).

- **Zero-order correlations** – for a **Linear** fit under classic estimation: adds a [Correlations](#correlations-linear-only) table with each predictor's plain correlation with the outcome, the other predictors ignored – see [zero-order correlation](./concepts/regression-basics.md#b-zero-order-correlation)
- **Part and partial correlations** – linear and classic as well: adds each predictor's partial and part (semi-partial) correlation to the same table – its relation with the outcome once the other predictors are removed from both, or from the predictor alone – see [partial](./concepts/regression-basics.md#b-partial-correlation) and [part correlation](./concepts/regression-basics.md#b-part-correlation)
- **ANOVA table** – one omnibus test per term, however many contrast rows the term spans in the coefficient table, so a categorical predictor with three or more levels is tested once; offered for every classic single-equation family – linear, robust linear, the three logistic ones, Poisson and negative binomial – and withheld for the two-part count families, the quantile family and every regularized fit. Read under [ANOVA table](#anova-table) – see [ANOVA table](./concepts/regression-basics.md#b-anova-table)
- **ANOVA type** – shown under the ticked ANOVA table: which other terms each row's test conditions on – [Type I (sequential)](#b-type-i-sequential), [Type II](#b-type-ii-each-term-given-those-that-do-not-contain-it), the default, or [Type III](#b-type-iii-each-term-given-all-the-others), each described under [ANOVA table](#anova-table) – see [type of sums of squares](./concepts/regression-basics.md#b-type-of-sums-of-squares). Type I splits the model in the order the predictors were entered, so its table changes when that order does; it is offered only where a sequential table exists – not for the robust, ordinal and multinomial families and not on a [robust covariance](#standard-errors) – and a pick that becomes unavailable falls back to Type II
- **Odds ratios with confidence intervals** – the exponentiated coefficients, with the interval on the same scale, added to the coefficient table; on by default for every family whose coefficients are on a log scale, and hidden for the three continuous-outcome families and under regularized estimation. It is one tick whose label follows the family, because the same exponentiation yields a differently named quantity in each: **Odds ratios with confidence intervals** for binomial and ordinal – see [odds ratio](./concepts/regression-basics.md#b-logistic-odds-ratio); **Relative risk ratios (RRR) with confidence intervals** for multinomial – see [relative risk ratio](./concepts/regression-basics.md#b-relative-risk-ratio); **Rate ratios (IRR) with confidence intervals** for Poisson and negative binomial – see [IRR](./concepts/regression-basics.md#b-irr); and **Rate ratios (IRR) and odds ratios (OR) with confidence intervals** for the two-part count families, whose count equation exponentiates to a rate ratio and whose zero equation to an odds ratio {#odds-ratios-with-confidence-intervals #relative-risk-ratios-rrr-with-confidence-intervals #rate-ratios-irr-with-confidence-intervals #rate-ratios-irr-and-odds-ratios-or-with-confidence-intervals}
- **Johnson-Neyman region of significance** – a checkbox shown whenever a numeric moderator is selected, and on the Advanced tab for every family but multinomial – see [Johnson-Neyman region of significance](#b-johnson-neyman-region-of-significance) {#johnson-neyman-region-of-significance-option}
- **Conditional indirect effects (moderated mediation)** – shown when both mediators and moderators are selected, on the Simple tab only – see [Conditional indirect effects](#b-conditional-indirect-effects) {#conditional-indirect-effects-option}
- **Sensitivity of the indirect effect to unmeasured confounding** – shown for linear and binomial outcomes with mediators selected, and on the Advanced tab for those two families whatever is drawn – see [Sensitivity of the indirect effect to unmeasured confounding](#b-sensitivity-of-the-indirect-effect-to-unmeasured-confounding) {#sensitivity-of-the-indirect-effect-to-unmeasured-confounding-option}
- **Also for paths through a categorical mediator** – nested under it on the Advanced tab for a linear outcome; about a minute per path – see [Also for paths through a categorical mediator](#b-also-for-paths-through-a-categorical-mediator) {#also-for-paths-through-a-categorical-mediator-option}
- **Moderator probe points** – a selector shown together with the Johnson-Neyman checkbox: **Mean and ±1 SD** or the **16th, 50th and 84th percentiles** as the values the simple slopes and the conditional indirect effects are read at – see [Moderator probe points](#b-moderator-probe-points) {#moderator-probe-points-option}

> **Odds ratio, rate ratio or relative risk ratio?** All three are e^b, and what multiplies differs – the odds of the outcome, the expected count, or the probability of one category relative to the reference; a ratio of 1 is no effect in each, so an interval spanning 1 reads as the coefficient's interval spanning 0 – see [odds ratio](./concepts/regression-basics.md#b-logistic-odds-ratio), [IRR](./concepts/regression-basics.md#b-irr) and [relative risk ratio](./concepts/regression-basics.md#b-relative-risk-ratio).

### Standard errors

**Standard errors.** A selector on the **Single regression analysis** card for the classic linear, binomial, Poisson and negative binomial fits – the remedy for what the [residual diagnostics](#residual-diagnostics) flag, since the coefficient table's inference columns would otherwise ignore a violation the diagnostics found. It recomputes **SE**, the test statistic, **p** and the confidence interval from a corrected covariance matrix; the coefficients themselves do not change, and on a GLM the exponentiated interval moves with them, being the same interval on the ratio scale. The selector is withheld for the robust, quantile, ordinal, multinomial and two-part count families, for every regularized fit and for a Firth fit.

- **Model-based** – the default: the textbook standard errors, valid when the residual variance is constant and the observations are independent
- **Heteroscedasticity-consistent (HC3)** – standard errors read off the observed residual pattern rather than an assumed constant variance; the conventional answer when [Breusch-Pagan](#residual-diagnostics) is significant – see [robust standard errors](./concepts/regression-basics.md#b-robust-standard-errors)
- **Heteroscedasticity- and autocorrelation-consistent (Newey-West)** – the same, also allowing for correlation between neighbouring rows, for when the autocorrelation test is flagged as well. It reads the rows in their current order as the time order, and its note names the bandwidth it chose, as a number of lags, and the AR(1) prewhitening applied to the residuals first – see [autocorrelation](./concepts/assumptions.md#b-autocorrelation)

A note under the coefficient table names the basis in use, and the rest of the card follows it: the model's omnibus test becomes a joint Wald test on the corrected covariance – an F on a linear fit, a χ² labelled as a Wald test on a GLM, in place of the likelihood-ratio χ² – and the [ANOVA table](#anova-table) reports Wald tests on it as well, without sums of squares; the pseudo-R² values stay on the likelihoods, and a note says so. Where the corrected matrix cannot be computed the table keeps the model's own standard errors and says so, and where it fails for individual terms only, those rows keep the model-based SE, statistic, p and CI and the note names them.

> **When to reach for HC3?** Heteroscedasticity leaves the coefficients unbiased and their standard errors wrong – usually too small – so HC3 keeps the estimates and corrects the uncertainty around them, at a small cost in power when the variance really is constant – see [heteroscedasticity](./concepts/assumptions.md#b-heteroscedasticity) and [robust standard errors](./concepts/regression-basics.md#b-robust-standard-errors).

> **Newey-West assumes the rows are a time series.** "Nearby" means adjacent in the current row order, which on a survey or a patient registry is an artifact of how the file was assembled, and the same caveat applies to the autocorrelation tests themselves – see [autocorrelation](./concepts/assumptions.md#b-autocorrelation); real time-series work belongs to the [Time series analysis](./time-series-analysis.md) module.

### Standardized coefficients

**Standardized coefficients.** A selector shown for the classic binomial, ordinal, multinomial, Poisson, negative binomial and two-part count fits, because a GLM's β has several published conventions that give different numbers with different meanings: the selector makes you pick one, and a note under the coefficient table names the one that produced the column. A linear, robust or quantile fit reports its β with no selector, since its standardization has one accepted definition – see [β](./concepts/regression-basics.md#b-β).

- **Not reported** – no β column
- **Predictor only (per 1 SD of X)** – the default: the coefficient times the predictor's SD, so β reads as the change in log-odds, or log-rate, per 1 SD of the predictor. Comparable across the predictors of this model, not against a linear model's β; a multinomial fit applies it within each outcome equation, and a two-part fit within each of its two
- **Latent variable (comparable to a linear β)** – additionally divides by the SD of the latent response, $\sqrt{\operatorname{Var}(\eta) + \pi^2/3}$ under the logit, which makes β comparable to a linear model's at the cost of assuming the underlying threshold model. Binomial and ordinal only – proportional-odds ordinal regression is a logit threshold model too – and hidden for the count families, which have no latent response to rescale against

The SDs are those of the fitted model's design columns, so a dummy or interaction column is standardized on the same footing as a plain numeric predictor. A linear fit's β comes from a refit on standardized data in which a categorical contrast stays a 0/1 column, so a numeric predictor's β is `b × SD(x) ÷ SD(y)` and a category's `b ÷ SD(y)` – not on the same footing, and the note under the table says so – see [β](./concepts/regression-basics.md#b-β).

- **Bootstrap the standardized coefficients' intervals** – a tick on the same card: it replaces β's analytic interval with a [bias-corrected bootstrap interval](#b-bias-corrected-bootstrap-ci) from resamples of the cases, each refitting and re-standardizing the model, so the interval need not be symmetric about β; the unstandardized coefficients keep their own interval. Offered for linear, robust, quantile, binomial, Poisson and negative binomial fits, withheld under regularized estimation and whenever the β column is switched off, and in force in [Advanced (path) mode](#path-analysis-advanced-mode) as well. It is slow – one full refit per resample, at the [bootstrap replications](./settings.md#bootstrap-replications) setting and seeded by [**Bootstrap seed**](./settings.md#bootstrap-seed)
- **β CI** – the interval column beside β, on the bootstrap basis only, with notes naming the construction and the number of resamples that fitted, any rows too few resamples reached – they keep their analytic interval – and the case where no row reached enough and the basis stayed analytic {#β-ci}

The coefficient plot of a **Linear** fit carries a switch between the two scales:

- **Coefficient scale** – the switch, which opens on β wherever the standardized refit produced intervals and repaints the same plot in place
- **Standardized (β)** – the plot drawn on the β column: every coefficient in outcome-SD units per predictor SD, comparable across the numeric predictors – see [β](./concepts/regression-basics.md#b-β)
- **Unstandardized (B)** – the same plot on the coefficients as fitted, in the variables' own units – see [B](./concepts/regression-basics.md#b-b)

> **Why is there a choice of convention?** A linear model's outcome has an SD to divide by and a logistic one's does not – the response is 0/1 – so predictor-only standardization leaves the outcome alone and latent-variable standardization borrows the SD the threshold model implies; both are defensible and both appear in the literature, so report the convention alongside the numbers – see [β](./concepts/regression-basics.md#b-β).

### Diagnostics

The **Diagnostics** group of the same card, each tick a results card of its own:

- **Collinearity diagnostics (VIF/Tolerance)** – VIF and tolerance for every term with a verdict, offered for every classic fit – the robust, quantile (at the reported quantile) and two-part count families included – and withheld under regularized estimation. Read under [Collinearity diagnostics](#collinearity-diagnostics) – see [multicollinearity](./concepts/regression-basics.md#b-multicollinearity), [VIF](./concepts/regression-basics.md#b-vif) and [tolerance](./concepts/regression-basics.md#b-tolerance)
- **Residual diagnostics (normality, autocorrelation, heteroscedasticity)** – for the classic linear, robust linear, binomial, Poisson, negative binomial and two-part count fits. The label names the tests that will run for the selected family: all three for a linear fit, and **Residual diagnostics (autocorrelation)** for the others, where the normality and heteroscedasticity tests do not apply. Read under [Residual diagnostics](#residual-diagnostics) – see [checking a regression](./concepts/regression-basics.md#checking-a-regression) {#residual-diagnostics-normality-autocorrelation-heteroscedasticity #residual-diagnostics-autocorrelation}
- **Influence statistics (Cook's D, leverage, outliers)** – the same families minus the two-part ones: which cases pull the fit, as Cook's distance, leverage and an outlier test on the studentized residuals. On a robust fit the label reads **Influence statistics (case weights, rejected observations)** and the card reports the estimator's own case weights instead. Read under [Influence statistics](#influence-statistics) – see [influence](./concepts/outliers-missing-data.md#b-influence) {#influence-statistics-cooks-d-leverage-outliers #influence-statistics-case-weights-rejected-observations}
- **Goodness of fit (RESET test)** – on by default for every classic fit but the robust and quantile ones, and the label names the test the selected family gets: **Goodness of fit (RESET test)** for linear, **Goodness of fit (Hosmer-Lemeshow)** for binomial, **Goodness of fit (proportional odds/Brant test, classification accuracy)** for ordinal, **Goodness of fit (classification accuracy)** for multinomial, **Goodness of fit (deviance, Pearson chi-square)** for Poisson and negative binomial, and **Goodness of fit (observed vs expected zeros, dispersion)** for the two-part families. Read under [Goodness of fit](#goodness-of-fit) {#goodness-of-fit-reset-test #goodness-of-fit-hosmer-lemeshow #goodness-of-fit-proportional-odds-brant-test-classification-accuracy #goodness-of-fit-classification-accuracy #goodness-of-fit-deviance-pearson-chi-square #goodness-of-fit-observed-vs-expected-zeros-dispersion}
- **Hosmer-Lemeshow bins (g)** – under the ticked goodness of fit of a binomial fit: the number of risk groups the Hosmer-Lemeshow test cuts the cases into, 3 to 50, default 10. The same model can pass at one bin count and fail at another, so the count is yours; the table reports the effective count beside the requested one, and when the model produces fewer distinct fitted values than bins the test is undefined and only le Cessie-van Houwelingen is reported – see [calibration tests](#calibration-tests-binomial) and the [Hosmer–Lemeshow test](./concepts/regression-basics.md#b-hosmer-lemeshow-test)
- **Test of directed separation (Shipley's C)** – in [Advanced (path) mode](#path-analysis-advanced-mode) only: the drawn model's own goodness of fit, combining a test of every independence the diagram claims by joining two variables with no edge. Read under [Model fit (test of directed separation)](#model-fit-test-of-directed-separation)

The **Classification (ROC) analysis** tick and the options it reveals are described under [Classification (ROC) analysis](#classification-roc-analysis); it is the one diagnostic offered under regularized estimation as well.

## Reading results – classic regression

**Classic regression.** A classic fit's card is titled with the regression type and the dependent variable's name – "(Firth)" appended when [Firth estimation](#estimation-method) produced it. Its sections come in the order below; the optional ones appear only when their [Additional statistics](#additional-statistics) tick is on. {#classic-regression #regressiontype-depvar #regressiontype-firth-depvar}

A section that was requested but could not be computed states its reason rather than disappearing from the card – the ANOVA table, the Brant test, the influence statistics, a bootstrap interval, a proportion mediated, a conditional effect with no usable probe point each say what stopped them – so a missing block is never mistaken for one that ran and found nothing.

### Model information

The card opens with the roles that entered the fit – **Dependent variable**, **Predictors**, **Moderators**, **Mediators**, **Covariates** – and **N**, the cases the fit used; when listwise deletion dropped rows, the number dropped as incomplete stands beside it – see [listwise deletion](./concepts/outliers-missing-data.md#b-listwise-deletion).

### Model fit

**Model fit.** How well the model reproduces the data as a whole, one row per statistic with a verdict beside it when [interpretation](./settings.md#significance-formatting) is on; read it before the coefficients – see [model fit](./concepts/regression-basics.md#b-model-fit).

A linear fit's rows:

- **R²** – the share of the outcome's variance the model accounts for, with a confidence interval obtained by inverting the model's own F test – a noncentral-F interval at the configured level – and a verdict on Cohen's bands – see [R²](./concepts/effect-sizes.md#b-r²)
- **Adjusted R²** – R² charged for the number of predictors; the verdict reads the gap between the two as [shrinkage](./concepts/regression-basics.md#b-shrinkage) – see [adjusted R²](./concepts/regression-basics.md#b-adjusted-r²)
- **f²** – $R^2/(1 - R^2)$, the effect size Cohen's bands (0.02, 0.15, 0.35) are defined on, so the quantity itself is on the card – see [f²](./concepts/regression-basics.md#b-f²)
- **F-statistic** – the test of the whole model against the intercept-only one; under [HC3 or Newey-West standard errors](#standard-errors) it is a joint Wald test on the same corrected covariance matrix as the coefficients, and a note says so – see [F-statistic](./concepts/regression-basics.md#b-f-statistic)
- **df (regression, residual)** – the F-statistic's two degrees of freedom – see [df](./concepts/regression-basics.md#b-df-regression-residual)
- **p-value (F)** – its p-value, with *Model is significant* as the verdict against the configured alpha – see [p-value (F)](./concepts/regression-basics.md#b-p-value-f)
- **Root MSE** – the residual standard error, the typical prediction error in the outcome's own units – see [residual standard error](./concepts/regression-basics.md#b-residual-standard-error)
- **AIC** and **BIC** – information criteria for comparing models fitted to the same data, lower being better – see [AIC](./concepts/regression-basics.md#b-aic) and [BIC](./concepts/regression-basics.md#b-bic) {#aic #bic}

A logistic, ordinal, multinomial or count fit's rows:

- **McFadden's R²** – 1 minus the ratio of the model's log-likelihood to the intercept-only model's, with a verdict on McFadden's own bands, which top out far below an OLS R²: 0.2 to 0.4 is already an excellent fit – see [McFadden's R²](./concepts/regression-basics.md#b-mcfaddens-r²)
- **Adjusted McFadden's R²** – the same, charged for the parameter count as adjusted R² is for a linear model; reported for every non-linear family whatever the [Goodness of fit](#goodness-of-fit) tick
- **Nagelkerke's R²** – Cox & Snell's R² rescaled to reach 1, so its verdict reads on Cohen's R² bands – see [Nagelkerke's R²](./concepts/regression-basics.md#b-nagelkerkes-r²)
- **Cox & Snell R²** – the likelihood-based R² that cannot reach 1 – see [Cox & Snell R²](./concepts/regression-basics.md#b-cox-snell-r²)
- **Null deviance** – how poorly the intercept-only model fits, with its degrees of freedom – see [null deviance](./concepts/regression-basics.md#b-null-deviance)
- **Residual deviance** – how poorly the fitted model does, with its degrees of freedom; the drop from null to residual is what the predictors bought – see [residual deviance](./concepts/regression-basics.md#b-residual-deviance)
- **χ² (LR test)** – the likelihood-ratio test of the whole model against the intercept-only one, with its **df** beneath; under a [robust covariance](#standard-errors) the row is a joint Wald test on the corrected matrix, reads **χ² (Wald test)** as on the robust card, and a note says so – see [likelihood-ratio test](./concepts/regression-basics.md#b-likelihood-ratio-test)
- **p-value (χ²)** – that test's p-value, with *Model is significant* as the verdict; on the robust card the same row belongs to the Wald χ²
- **Log-likelihood** – the raw measure of fit the pseudo-R² values and the **AIC** and **BIC** rows are derived from – see [log-likelihood](./concepts/regression-basics.md#b-log-likelihood)

A robust fit reports [Robust R², Adjusted robust R², Robust residual scale and χ² (Wald test)](#robust-linear-regression) and a quantile fit [Quantile (τ) and R¹](#quantile-regression), each described under its family. For every iteratively fitted family – binomial, ordinal, multinomial, Poisson and negative binomial – a warning appears under the table when the fitting algorithm did not converge, including when it was the negative binomial's θ estimation that hit the iteration limit: a non-converged fit produces coefficients, standard errors and fit statistics that look ordinary and mean nothing, and the usual causes are sparse outcome categories and near-collinear predictors.

> **R² or pseudo-R²?** A linear model's R² is a share of variance; a logistic or count model has no such share, so its pseudo-R² values are likelihood-based substitutes read on their own bands – see [R²](./concepts/effect-sizes.md#b-r²) and [pseudo-R²](./concepts/regression-basics.md#b-pseudo-r²).

### Coefficients

**Coefficients.** One row per term, the intercept first, with the columns below; the same table serves the ordinal thresholds, each outcome level of a multinomial fit and each equation of a two-part one – see [coefficients](./concepts/regression-basics.md#b-coefficients).

- **Predictor** – the term: a variable, one level of a categorical predictor against its reference category (`{predictor}: {level}`), an interaction, or **(Intercept)** – see [term](./concepts/regression-basics.md#b-term) and [intercept](./concepts/regression-basics.md#b-intercept)
- **B** – the unstandardized estimate, in the outcome's own units for a linear fit and on the link scale – log-odds, log-rate – for a GLM – see [B](./concepts/regression-basics.md#b-b)
- **SE** – the estimate's standard error, on the basis the [Standard errors](#standard-errors) selector chose – see [standard error of a coefficient](./concepts/regression-basics.md#b-standard-error-of-a-coefficient)
- **β** – the standardized estimate, blank for the intercept: always present for a linear, robust or quantile fit, and for the GLM families whenever [Standardized coefficients](#standardized-coefficients) is not *Not reported*, with a note naming the convention; when bootstrapped, a [β CI](#b-β-ci) column follows it – see [β](./concepts/regression-basics.md#b-β)
- **t** or **z** – the test statistic, B ⁄ SE, with significance stars; the header names the one the p-value came from – *t* on the residual df for a linear fit, *z* for the Wald tests of the GLM, ordinal and multinomial fits – see [t](./concepts/hypothesis-testing.md#b-t) and [z](./concepts/hypothesis-testing.md#b-z) {#t #z}
- **p** – the row's p-value under the null that its coefficient is zero: the predictor adds nothing once the others are in. A large p on a term the separation warning names is not evidence of no effect – see [p](./concepts/hypothesis-testing.md#b-p)
- **CI** – the confidence interval on B at the configured level, on the same basis as the SE – see [confidence interval](./concepts/confidence-intervals.md#b-confidence-interval) {#ci}
- **OR** – the exponentiated coefficient with its own interval column, **OR CI**, when [the exponentiated-coefficient tick](#b-odds-ratios-with-confidence-intervals) is on: an odds ratio for binomial and ordinal, **RRR** for multinomial, **IRR** for the count families – see [odds ratio](./concepts/regression-basics.md#b-logistic-odds-ratio), [relative risk ratio](./concepts/regression-basics.md#b-relative-risk-ratio) and [IRR](./concepts/regression-basics.md#b-irr) {#or #rrr #irr #or-ci #rrr-ci #irr-ci}

For binomial and ordinal fits a note above the table states which outcome is modelled – "Modelled outcome: yes, against the reference level no", or the categories in ascending order – with the direction a positive coefficient pushes in; every coefficient, ratio and ROC curve on the card depends on that choice, which a coding rule makes rather than anything you picked, so the card says it outright.

Three things that would otherwise be silent are named under the table:

- **Separation.** When some cases are predicted perfectly – complete or quasi-complete separation in a binomial, ordinal or multinomial fit – a warning above the table names the terms whose estimates have diverged; their coefficients, standard errors, intervals and p-values are not interpretable, and for a binomial fit a second line names [Firth estimation](#estimation-method) as the remedy – see [separation](./concepts/regression-basics.md#b-separation)
- **Aliased terms.** A term that is an exact linear combination of the others cannot be estimated and gets no row; the note names it and says that every other coefficient is conditional on that omission, and the term is left out of the correlations table too – see [multicollinearity](./concepts/regression-basics.md#b-multicollinearity)
- **Uncentered moderators.** With moderators selected, a note says that each predictor's coefficient is its effect where its moderator is 0 – or at the moderator's reference level – rather than an average over the moderator's range, and points at the [simple slopes](#moderation-analysis) for values the data covers; the same caveat sits on the direct and total effect rows of the [Advanced tab's](#path-analysis-advanced-mode) effect decomposition

With categorical predictors a **Reference categories** note lists the level each one is measured against – see [reference category](./concepts/regression-basics.md#b-reference-category).

**Coefficient forest plot.** Drawn beneath the table: one row per term with its estimate and confidence interval, on the family's ratio scale (OR ⁄ RRR ⁄ IRR, on a log axis) when the exponentiated-coefficient tick is on and on the raw scale otherwise, a reference line at the no-effect value – 1 on a ratio scale, 0 on a raw one – and the terms whose interval clears it coloured; significance is read off the drawn interval itself, so the colour never disagrees with the whisker. On a linear fit the [Coefficient scale](#b-coefficient-scale) switch above it opens on β wherever the standardized refit produced intervals, and the fitted equation is printed under the plot.

**Thresholds (intercepts).** An ordinal fit's second table, the cut-points between adjacent categories on the latent scale: **Threshold** names the pair of categories the row separates (`low | medium`), and the estimate, SE, z, p and CI columns read as in the coefficient table. The verdict column places the cut-point below or at-or-above the latent-scale origin and passes no significance judgement – see [thresholds](./concepts/regression-basics.md#b-thresholds). {#thresholds-intercepts #thresholds-intercepts-threshold}

> **A cut-point's p-value is not a finding.** The zero of the latent scale is an identification convention, so "differs from zero" describes the convention, not the variable – see [thresholds](./concepts/regression-basics.md#b-thresholds).

**Coefficients by outcome level.** A multinomial fit's coefficients, one table per outcome level, each headed **Outcome** – the level – *vs.* the [reference outcome](#reference-outcome-multinomial-only) named above them; with the exponentiated-coefficient tick on, the **RRR** and its interval are added – see [multinomial logistic regression](./concepts/regression-basics.md#b-multinomial-logistic-regression). {#coefficients-by-outcome-level #coefficients-by-outcome-level-outcome #outcome}

**Count equation coefficients.** A two-part fit's first table, the count equation, whose exponentiated coefficients are rate ratios (IRR) – see [two-part count models](#two-part-count-models).

**Zero equation coefficients.** Its second table, the zero equation on a logit, whose exponentiated coefficients are odds ratios (OR) and whose sign reads oppositely in the two families; a note above it says which event the equation is about – see [two-part count models](#two-part-count-models).

### ANOVA table

**ANOVA.** The per-term table the [ANOVA table](#b-anova-table) tick adds: one omnibus test per term, however many contrast rows the term spans in the coefficient table, and a **Residual** row on a linear fit – see [ANOVA table](./concepts/regression-basics.md#b-anova-table). {#anova}

The [ANOVA type](#b-anova-type) selector beneath the tick decides which other terms each row's test conditions on:

- **Type I (sequential)** – each term is given only the terms entered *before* it, so the table changes when the input order does and the terms' contributions add up to the model's own
- **Type II (each term given those that do not contain it)** – the default: a main effect is tested with the interactions it appears in set aside
- **Type III (each term given all the others)** – including the interactions it appears in, so a main effect is read where the terms it interacts with are zero; the model is refitted with sum-to-zero contrasts for this table, which makes a factor's main effect the average over its levels rather than a statement about the reference level, while a numeric predictor's zero is its own zero, which may sit outside the observed range

The columns:

- **Term** – the row's term, or **Residual**, the last row of a linear fit's table: the variation no term explained, with its df and mean square, the denominator of every F – see [term](./concepts/regression-basics.md#b-term) and [residual](./concepts/regression-basics.md#b-residual)
- **SS**, **df** and **MS** – a linear fit's sums of squares, their degrees of freedom and the mean squares, SS ⁄ df; on a robust covariance the SS and MS columns are dropped, since no partition is defined on that basis, and the GLM families never have them – see [sum of squares](./concepts/regression-basics.md#b-sum-of-squares) {#ss #anova-df #ms #outcome-model-anova-df}
- **F** or **χ²** – the term's test: an F on the sums of squares for a linear fit, a likelihood-ratio χ² for the GLM, ordinal and multinomial fits, a Wald χ² under [Firth estimation](#estimation-method), and a Wald F or χ² on the corrected matrix under a [robust covariance](#standard-errors); the note under the table names the type and the basis that ran {#anova-f #anova-χ² #outcome-model-anova-f #outcome-model-anova-χ²}
- **p** – the term's p-value, the one test of a categorical predictor as a whole {#anova-p #outcome-model-anova-p}
- **η²p** – partial η², linear fits only: the term's contribution as a share of what the other terms left unexplained, $\text{SS}/(\text{SS} + \text{SS}_{\text{residual}})$, the effect size for a term spanning several degrees of freedom, where a single coefficient's β says nothing – see [partial η²](./concepts/effect-sizes.md#b-partial-η²)

> **Which type?** With no interaction in the model Types II and III agree and the question does not arise; with one, Type II is the more powerful when the interaction is negligible, Type III keeps each main effect readable beside it, and Type I answers a different question – what each term adds in the order entered – see [type of sums of squares](./concepts/regression-basics.md#b-type-of-sums-of-squares).

### Correlations (linear only)

**Correlations.** The table the [Zero-order correlations](#b-zero-order-correlations) and [Part and partial correlations](#b-part-and-partial-correlations) ticks add on a linear fit, one row per term with the intercept and any aliased term left out – see [more than one predictor](./concepts/regression-basics.md#more-than-one-predictor).

- **Zero-order (r)** – the predictor's plain correlation with the outcome, the other predictors ignored – see [zero-order correlation](./concepts/regression-basics.md#b-zero-order-correlation) {#zero-order-r}
- **Partial** – the correlation between outcome and predictor with the other predictors removed from both – see [partial correlation](./concepts/regression-basics.md#b-partial-correlation)
- **Part (sr)** – the semi-partial: the other predictors removed from the predictor alone, so its square is the predictor's unique share of R² – see [part correlation](./concepts/regression-basics.md#b-part-correlation)
- **Interpretation (zero-order)** – the strength verdict on the [correlation bands](./settings.md#statistical-thresholds), read on the zero-order r when that column is present and, as **Interpretation (partial)**, on the partial correlation otherwise; a row with no finite value reads *Not assessable* {#interpretation-zero-order #interpretation-partial}

### Collinearity diagnostics

**Collinearity diagnostics.** VIF and tolerance for every term of the fitted design, each with a verdict against the [VIF thresholds](./settings.md#statistical-thresholds) – moderate from 5 and high from 10 by default – see [multicollinearity](./concepts/regression-basics.md#b-multicollinearity).

- **VIF** – the variance inflation factor, how many times larger the coefficient's variance is than it would be with an uncorrelated predictor; a categorical predictor's levels are one **GVIF** row, scaled so that it reads on the same bands as a plain VIF – see [VIF](./concepts/regression-basics.md#b-vif)
- **Tolerance** – 1 ⁄ VIF, the share of the term's variance the other terms do not explain – see [tolerance](./concepts/regression-basics.md#b-tolerance)

The VIFs are computed on a design rebuilt from mean-centred numeric predictors, so an interaction term sheds the collinearity it would otherwise inherit from sharing its parents; for the non-linear families they are read off the model's own covariance matrix rather than an OLS design, the multinomial and two-part fits excepted. A term the design cannot separate from the others – an empty category, an aliased term – has no VIF, and its row reads *Not assessable* rather than being scored as maximally collinear.

> **High VIF, now what?** The coefficients are unbiased and their standard errors inflated, so the model is not wrong, but the individual effects are hard to tell apart; drop or combine the correlated predictors, centre the parents of an interaction, or read the terms jointly – see [multicollinearity](./concepts/regression-basics.md#b-multicollinearity).

### Residual diagnostics

**Residual diagnostics.** One row per test with its statistic, p-value and verdict – judged at the [assumption test significance level](./settings.md#assumption-test-significance-level) rather than the main one – then the residual plots; which tests run follows the family, as the [tick's label](#b-residual-diagnostics-normality-autocorrelation-heteroscedasticity) says – see [checking a regression](./concepts/regression-basics.md#checking-a-regression).

- **Shapiro-Wilk (normality)** – linear fits: W on the raw residuals; above 5,000 residuals it runs on a random subsample of 5,000 and a note says how many the verdict rests on – see [normality of residuals](./concepts/regression-basics.md#b-normality-of-residuals)
- **Durbin-Watson (autocorrelation)** – linear fits: the two-sided test, so DW above 2 can flag negative autocorrelation as well; when it is significant the statistic gives the direction – below 2 positive, above 2 negative – see [Durbin–Watson test](./concepts/regression-basics.md#b-durbin-watson-test)
- **Breusch-Godfrey (autocorrelation)** – the GLM and two-part families: a first-order LM statistic built on the model's own Pearson residuals and referred to χ² on 1 df – see [autocorrelation](./concepts/assumptions.md#b-autocorrelation)
- **Breusch-Pagan (heteroscedasticity)** – linear fits: whether the squared residuals grow or shrink with the predictors; when it fires, the [Standard errors](#standard-errors) selector is the remedy – see [Breusch–Pagan test](./concepts/regression-basics.md#b-breusch-pagan-test)
- **Statistic** – each row's own statistic – W, DW, LM or BP – starred at the assumption test significance level {#residual-diagnostics-statistic #outcome-model-residual-diagnostics-statistic}
- **p** – the test's p-value, highlighted against the assumption test significance level; a non-significant result is the reassuring one here {#residual-diagnostics-p #outcome-model-residual-diagnostics-p}

A note under the table says that the autocorrelation test compares each residual with the preceding row's, so it is informative only where row order encodes a sequence – time, space, measurement order – and on unordered data reports the incidental order of the file; the [Standard errors](#standard-errors) section says the same of Newey-West.

**Residual Q-Q plot.** The ordered internally studentized residuals against the quantiles of a normal distribution, with a reference line and confidence band; points hugging the line are normal residuals, a systematic bend at the ends skew or heavy tails. Its caption says that the test above reads the raw residuals while the plot draws the studentized ones – see [Q–Q plot](./concepts/distributions.md#b-q-q-plot) and [standardized residual](./concepts/regression-basics.md#b-standardized-residual). {#residual-q-q-plot #standardized-residuals}

**Residuals vs fitted values.** The scatter beside it, on the raw residuals: residuals against fitted values with a LOWESS smoother and a dashed line at zero, the level a well-specified model scatters evenly about. A curve is non-linearity, the thing a significant RESET test reports, shown where it happens; a widening or narrowing wedge is heteroscedasticity, the thing Breusch-Pagan tests, localized. The non-linear families draw the scatter their own fit defines – **Deviance residuals vs linear predictor** for binomial, Poisson and negative binomial, the pair R's GLM diagnostics use, and **Pearson residuals vs expected count** for the two-part families, the one scale both of their equations reach – see [residual plot](./concepts/regression-basics.md#b-residual-plot). {#residuals-vs-fitted-values #deviance-residuals-vs-linear-predictor #pearson-residuals-vs-expected-count #residuals #fitted-values #deviance-residuals #linear-predictor #pearson-residuals #expected-count}

Above 5,000 residuals both plots draw a subsample taken in rank order, with each point at the position its rank holds in the full sample, and say so; above that size a note also says that the Shapiro-Wilk and Breusch-Pagan verdicts reject on deviations far too small to move the coefficients, and that both are to be judged from the plots. When the model reproduces the response almost exactly, what is left is floating-point noise, and the tests, the influence statistics and the plots report that as the reason instead of passing verdicts on rounding error.

> **Look at the plot, not just the test.** A normality test's power grows with the sample, so on a few thousand rows it flags deviations too small to matter; the Q–Q plot shows how the residuals depart and by how much, which is the question – see [Shapiro–Wilk test](./concepts/distributions.md#b-shapiro-wilk-test).

### Influence statistics

**Influence statistics.** Which cases pull the fit: for each measure its extreme value and the case it belongs to, then the number of cases past the measure's conventional threshold – the threshold itself printed in the row, computed from the model's own rank p and the n it was fitted on – with the case numbers listed, up to ten – see [influence](./concepts/outliers-missing-data.md#b-influence).

- **Cook's D (max)** – the largest Cook's distance, how far every fitted value moves when that case is dropped – see [Cook's distance](./concepts/outliers-missing-data.md#b-cooks-distance)
- **Cook's D > 1 (n)** – the cases past the textbook cutoff, and which they are {#cooks-d-gt-1-n}
- **Cook's D > 4/(n−p) (n)** – the cases past the size-aware cutoff, which scales with the sample and the parameter count and still flags in large samples where D > 1 never fires; none past it is genuinely reassuring, many past it but none past 1 is spread leverage with no dominant case {#cooks-d-gt-4-np-n}
- **Leverage (max)** – the largest hat value, how unusual a case is in its predictors – see [leverage](./concepts/outliers-missing-data.md#b-leverage)
- **Leverage > 2p/n (n)** – the cases above the conventional leverage cutoff {#leverage-gt-2p-n-n}
- **|DFFITS| (max)** – the largest change in a case's own fitted value when the case is dropped, in standard-error units, with a verdict on whether it reaches the cutoff – see [DFFITS](./concepts/outliers-missing-data.md#b-dffits)
- **|DFFITS| > 2·√(p/n) (n)** – the cases past that cutoff {#dffits-gt-2p-n-n}
- **COVRATIO (range)** – the smallest and largest COVRATIO, how much a case tightens or loosens the precision of the coefficients, with a verdict on whether the range leaves the band – see [COVRATIO](./concepts/outliers-missing-data.md#b-covratio)
- **COVRATIO outside 1 ± 3p/n (n)** – the cases outside that band {#covratio-outside-1-3p-n-n}
- **Largest |studentized residual|** – the outlier test's statistic: the largest externally studentized residual and its case; on a GLM the row reads **Largest |jackknife deviance residual|** – see [studentized residual](./concepts/outliers-missing-data.md#b-studentized-residual) {#largest-studentized-residual #largest-jackknife-deviance-residual}
- **Bonferroni-adjusted outlier p** – that residual's p-value multiplied by the number of cases, since the largest of n was picked; the verdict, at the [assumption test significance level](./settings.md#assumption-test-significance-level), separates "more extreme than the fitted model explains" from "no observation is more extreme than the sample size explains" – see [Bonferroni](./concepts/hypothesis-testing.md#b-bonferroni)
- **Outlier test** – the row's name when the test could not run – too few residual degrees of freedom, or no finite studentized residual – reading *Not computed*

On a GLM these measures are one-step approximations taken from the fit's IRLS weights, and the outlier test reads approximate jackknife deviance residuals against a normal reference rather than a t; a note under the table says so. The DFFITS and COVRATIO rows appear only for the families that define them.

**Case weights.** The robust family's answer to the same tick: an MM fit has no leave-one-out measures, and its case weights say what each row was allowed to contribute – 1 is full weight, and a row counts as rejected once its weight falls under the fit's own outlier cutoff – each row read against robustbase's own alarm limits – see [case weight](./concepts/regression-basics.md#b-case-weight).

- **Mean case weight** – the average weight, with a warning when it falls under the estimator's limit, since a fit that down-weights the sample as a whole may not describe its bulk
- **Case weight quartiles** – the first quartile, median and third quartile of the weights
- **Smallest case weight** – the most down-weighted row, and which it is
- **Rejected (weight ≈ 0) (n)** – the rows the fit excluded entirely, with a warning once their share passes the estimator's limit, since the fit then describes a minority of the sample {#rejected-weight-0-n}
- **Weight below 0.5 (n)** – the rows counting for less than half a case {#weight-below-n}

> **Which diagnostic says what?** An outlier has an unusual outcome, a high-leverage point unusual predictors, and Cook's D, DFFITS and COVRATIO each measure what the two together do to the fit; the dangerous cases are flagged by several at once – see [influential points](./concepts/outliers-missing-data.md#b-influential-points).

> **Remove an influential case?** Not automatically: investigate why it is influential – a data-entry error, a genuine extreme – and refit without it to see how much it matters – see [outliers in a model](./concepts/outliers-missing-data.md#outliers-in-a-model).

### Goodness of fit

**Goodness of fit.** Whether the model reproduces the data it was fitted to: one key–value table whose rows follow the family – a specification test for a linear fit, two calibration tests for a binomial one, classification accuracy for ordinal and multinomial fits and the Brant test for the ordinal, dispersion tests for the count families, a zero comparison for the two-part ones – with a verdict row under each test when [interpretation](./settings.md#significance-formatting) is on. Every test here holds the model as its null, so the reassuring verdict is the *non*-significant one, judged at the [assumption test significance level](./settings.md#assumption-test-significance-level) – the classification accuracy test alone, whose significance favours the model, reads the main one; a test that could not run says why under the table instead of vanishing. The card is withheld for the robust and quantile families and under regularized estimation, and in [Advanced (path) mode](#path-analysis-advanced-mode) it is titled **Outcome model goodness of fit**. {#goodness-of-fit #outcome-model-goodness-of-fit}

#### Specification test (linear)

- **RESET test** – Ramsey's regression specification error test: the fit repeated with its squared and cubed fitted values added, and the **RESET F-statistic** on its **RESET df** with the **RESET p-value** saying whether they explain anything the linear terms missed – a bend, which the [residuals vs fitted values](#b-residuals-vs-fitted-values) plot shows where it happens; the verdict reads *Model may be misspecified (consider non-linear terms)* when they do – see [RESET test](./concepts/regression-basics.md#b-reset-test) {#reset-test #reset-f-statistic #reset-df #reset-p-value}

#### Calibration tests (binomial)

Two tests of the same question – do the predicted probabilities match the observed rates? – reported side by side with a note saying whether they agree at the assumption test significance level and, when they do not, what each is sensitive to – see [calibration](./concepts/regression-basics.md#b-calibration).

- **Hosmer-Lemeshow test** – the cases sorted by predicted risk and cut into *g* groups, the positives observed in each compared with the number the probabilities add up to: **Hosmer-Lemeshow χ²** on **Hosmer-Lemeshow df** (the groups minus 2) and the **Hosmer-Lemeshow p-value** with its verdict. The **Hosmer-Lemeshow bins (g)** row prints the count the test ran on beside the count [requested](#b-hosmer-lemeshow-bins-g) when R had to reduce it, since the verdict moves with the count – see [Hosmer–Lemeshow test](./concepts/regression-basics.md#b-hosmer-lemeshow-test) {#hosmer-lemeshow-test #hosmer-lemeshow-χ² #hosmer-lemeshow-df #hosmer-lemeshow-p-value #hosmer-lemeshow-interpretation}
- **le Cessie-van Houwelingen test** – the same question asked case by case, with no groups and no knob: **Sum of squared residuals (observed / expected)** gives the squared gaps between outcomes and probabilities against their expected total under the model, **le Cessie-van Houwelingen z** the standardized difference and **le Cessie-van Houwelingen p-value** its two-sided p, with a verdict {#le-cessie-van-houwelingen-test #le-cessie-van-houwelingen-z #sum-of-squared-residuals-observed-expected #le-cessie-van-houwelingen-p-value #le-cessie-van-houwelingen-interpretation}

Either test can be undefined rather than non-significant, and the card names the case: a model whose few predictors are all categorical can produce fewer than three distinct predicted probabilities, too few to form groups at any *g*, and a saturated model – as many parameters as distinct probabilities – leaves le Cessie no residual variation to weigh.

#### Classification accuracy (ordinal and multinomial)

For a categorical outcome the card scores the model as a classifier: each case is assigned the level with the highest predicted probability, and the assignments are compared with the observed levels. All of it is in-sample – the model is scored on the cases it was fitted on – and a note under the block says so; the [cross-validated AUC](#b-cross-validated-auc-out-of-sample) is the out-of-sample figure.

- **Classification accuracy** – the share of cases assigned their observed level – see [classification accuracy](./concepts/regression-basics.md#b-classification-accuracy)
- **No-information rate** – the accuracy of always predicting the most common level, the floor the model has to clear before its own accuracy means anything – see [no-information rate](./concepts/regression-basics.md#b-no-information-rate)
- **Accuracy > no-information rate (p)** – a one-sided exact binomial test of the correct count against that floor; the **Accuracy interpretation** verdict reads *Accuracy beats always predicting the largest category* or *is no better* than doing so {#accuracy-gt-no-information-rate-p #accuracy-interpretation}
- **Confusion matrix** – the cross-table under the rows: columns the observed levels, rows the level the model assigned (**Predicted**), every level present in both even when the model never predicts it, so a level the model has given up on shows as an empty row rather than vanishing – see [confusion matrix](./concepts/regression-basics.md#b-confusion-matrix) {#confusion-matrix #confusion-matrix-predicted}
- **Classification quality by category** – three numbers per observed level (the **Category** column), under the matrix, since a level the model over-assigns and one it understands can share an accuracy figure; the note under the table says which pattern is which {#classification-quality-by-category #classification-quality-by-category-category}
- **Recall (correctly classified)** – of the cases that belong to the level, the share the model recovers – the level's [sensitivity](./concepts/regression-basics.md#b-sensitivity)
- **Precision** – of the cases the model puts in the level, the share that belong there – its [positive predictive value](./concepts/regression-basics.md#b-positive-predictive-value-ppv)
- **F1** – the harmonic mean of the two, as [F1](#b-f1) is of PPV and sensitivity in the ROC tables – see [F1](./concepts/regression-basics.md#b-f1) {#classification-quality-by-category-f1}

> **Why overall accuracy isn't enough:** on an unbalanced outcome a model scores well by predicting the common level every time, which the no-information rate exposes; recall and precision then say which levels it over-assigns, and the matrix what the misclassified cases were called instead – see [confusion matrix](./concepts/regression-basics.md#b-confusion-matrix).

#### Proportional odds assumption (Brant test)

- **Proportional odds assumption (Brant test)** – an ordinal fit's check that each predictor's effect is the same at every cut between adjacent levels: the model refitted as the series of cumulative binary splits it implies, and a Wald χ² on **df** per predictor of whether the split slopes agree, with an **All predictors** omnibus row over the whole set. A row significant at the [assumption test significance level](./settings.md#assumption-test-significance-level) names the term whose single odds ratio is not to be trusted, the omnibus row says whether the model as a whole is affected, and neither invalidates the fit. It needs three outcome levels and one predictor, and reports the reason under the table when a split fails to converge – see [proportional odds](./concepts/regression-basics.md#b-proportional-odds) and the [Brant test](./concepts/regression-basics.md#b-brant-test) {#proportional-odds-assumption-brant-test #proportional-odds-brant-test #all-predictors}

> **What to do about a violation?** One predictor failing out of several is common and often tolerable, and similar per-cutpoint AUCs under [Classification (ROC) analysis](#classification-roc-analysis) say it is doing little damage; when it matters, the [multinomial](./concepts/regression-basics.md#b-multinomial-logistic-regression) model drops the assumption at the cost of many more parameters – see [Brant test](./concepts/regression-basics.md#b-brant-test).

#### Dispersion tests (Poisson and negative binomial)

Two χ² tests of whether the counts scatter around the fitted values as the family says they should, each with its own **df** row, and the ratio the two families are chosen by – see [dispersion](./concepts/regression-basics.md#b-dispersion).

- **Fitted counts below 5** – the share of the fitted counts under 5, with the smallest; both tests below are referred to a distribution that holds as the fitted counts grow, so past a fifth of them the card withholds their verdicts and a note says neither p-value can be read as a statement about fit
- **Deviance** – the residual deviance against its degrees of freedom, **Deviance df**, with the **Deviance p-value** and its verdict – see [deviance](./concepts/regression-basics.md#b-deviance) {#deviance #deviance-df #deviance-p-value #deviance-interpretation}
- **Pearson χ²** – the sum of the squared Pearson residuals on the same **Pearson χ² df**, with the **Pearson χ² p-value** and its verdict – see [Pearson residuals](./concepts/regression-basics.md#b-pearson-residuals) {#pearson-χ² #pearson-χ²-df #pearson-χ²-p-value #pearson-χ²-interpretation}
- **Pearson dispersion (χ²/df)** – the Pearson χ² over its degrees of freedom, near 1 for a model whose spread is right; the **Dispersion interpretation** verdict reads underdispersion below 0.8 and overdispersion above 1.2 – see [dispersion](./concepts/regression-basics.md#b-dispersion) {#pearson-dispersion-χ²-df #dispersion-interpretation}
- **Overdispersion score test** – Poisson fits only: Cameron & Trivedi's regression-based test of the Poisson variance against the negative binomial's, **Overdispersion score test z** with its two-sided **Overdispersion score test p-value**. A significant positive z is the cue to switch to the negative binomial – or to a [two-part family](#two-part-count-models) when the excess sits in the zeros – and a significant negative one says the counts are *less* variable than Poisson assumes, where the p-values are conservative rather than wrong – see [overdispersion](./concepts/regression-basics.md#b-overdispersion) {#overdispersion-score-test #overdispersion-score-test-z #overdispersion-score-test-p-value #overdispersion-score-test-interpretation}
- **Negative binomial θ** – negative binomial fits only: the fitted shape parameter with its **SE of θ**, smaller θ meaning more extra-Poisson variability. It is a different number from the dispersion ratio above it: on a well-fitting negative binomial the ratio sits near 1 *because* θ has absorbed the excess, so θ = 4.1 beside a dispersion of 1.0 is the healthy picture, not a contradiction – see [negative binomial regression](./concepts/regression-basics.md#b-negative-binomial-regression) {#negative-binomial-θ #se-of-θ}

#### Zero comparison (two-part families)

The question the two-part families exist for – does modelling the zeros separately help? – answered against the single-equation counterpart: the same count formula and distribution with the zero equation switched off – see [excess zeros](./concepts/regression-basics.md#b-excess-zeros).

- **Zeros observed** – how many cases had a count of zero
- **Zeros predicted by this model** – the zeros the fitted model expects, its cases' probabilities of a zero summed
- **Zeros predicted without the zero equation** – the zeros the single-equation counterpart expects. On a hurdle model this is the row to read: a hurdle reproduces the observed zero count by construction, so the first two rows agree whatever the fit is like, and a note under the table says so
- **Excess zeros** – the verdict: *The single-equation model under-predicts the zeros* when its expected count falls a tenth or more short of the observed one, *already reproduces the zero count* otherwise – see [excess zeros](./concepts/regression-basics.md#b-excess-zeros)
- **ΔAIC against the single-equation model** and **ΔBIC against the single-equation model** – the counterpart's criterion minus this model's, signed so that a positive number favours this model – see [AIC](./concepts/regression-basics.md#b-aic) and [BIC](./concepts/regression-basics.md#b-bic) {#δaic-against-the-single-equation-model #δbic-against-the-single-equation-model}
- **Model choice** – the verdict on ΔAIC: *The two-part model fits better than the single-equation one* past 2, *The single-equation model is preferred* below −2, *Neither model is clearly preferred* between. No p-value accompanies it, and a note under the table says why: the counterpart is this model on the boundary of its parameter space, where neither a likelihood-ratio test nor the Vuong test has its stated null, so the criteria rank the two without a claim of significance
- **Single-equation comparison** – the block's name under the table when the counterpart could not be fitted, with R's reason

The **Pearson dispersion (χ²/df)** and **Negative binomial θ** rows follow, as for the [count families](#dispersion-tests-poisson-and-negative-binomial), on the two-part fit's own Pearson residuals and count distribution.

### Classification (ROC) analysis

**Classification (ROC) analysis.** Scores a binomial, multinomial or ordinal model as a classifier, under classic and regularized estimation alike: the fit's predicted probabilities are checked for how well they separate the observed outcomes across every possible cutoff at once, then a threshold is chosen by a stated rule and the model's performance at it is tabled. The shape follows the family – one curve for a binomial outcome, K one-vs-rest curves for a multinomial one, K−1 per-cutpoint curves for an ordinal one, an ordinal outcome with two levels included – and it runs in [Advanced (path) mode](#path-analysis-advanced-mode) too – see [classifying with a model](./concepts/regression-basics.md#classifying-with-a-model). {#classification-roc-analysis}

> **Why no fixed 0.5 cutoff?** One half treats a missed positive and a false alarm as equally bad and ignores how common the positives are, so the module looks at every threshold and picks one by rule – see [classification threshold](./concepts/regression-basics.md#b-classification-threshold).

#### Configuration

Under the **Diagnostics** group of [Additional statistics](#diagnostics), shown when the regression type is binomial, multinomial or ordinal:

- **Classification (ROC) analysis** – the tick that adds the [section](#b-classification-roc-analysis) to the card; the options below appear once it is on {#classification-roc-analysis-option}
- **Optimal threshold rule** – how the cutoff is chosen from the curve:
	- **Youden's J (max sens + spec − 1)** – the default: the threshold that maximizes sensitivity + specificity − 1, treating both kinds of error as equally costly – see [Youden's J](./concepts/regression-basics.md#b-youdens-j)
	- **Closest to (0, 1)** – the point on the curve nearest the perfect-classifier corner
	- **Cost-weighted** – Youden's J with the two errors weighted by the ratio below and by the prevalence in use, so a rarer positive class tightens the cutoff; binomial and ordinal outcomes only, since K one-vs-rest curves do not share one cost ratio. On an ordinal model the same ratio is applied at every cutpoint, and a note says so
- **Cost of a missed positive relative to a false alarm** – the cost rule's ratio, 1 or more (3 = a missed positive is three times as costly as a false alarm); the table then carries one row per direction of the asymmetry so the two can be compared, and a single row at exactly 1, where the directions coincide
- **Classification metrics at optimal threshold** – adds the table of sensitivity, specificity, PPV, NPV, accuracy and F1 at the chosen threshold, each with a bootstrap interval, and reveals the prevalence tick
- **Population class prevalences** – one input per outcome level, pre-filled with the sample proportions, so that PPV, NPV and accuracy can be computed at the population's rates rather than the sample's – a case-control sample above all. Entries you have not touched rescale so the set sums to 1, the ones you typed stay; raw class counts are accepted and normalized; a zero share, or one level holding everything, is rejected by name. Each family reads what it needs off the one set – the positive level's share for a binomial model, each class's own for a multinomial one-vs-rest curve, the shares above the cut summed for an ordinal cutpoint – and every table that uses a prevalence says which basis it used – see [prevalence](./concepts/regression-basics.md#b-prevalence)
- **AUC confidence interval** – the interval on every AUC:
	- **DeLong** – the analytic interval, fast; for a binomial curve and each ordinal cutpoint, and hidden for multinomial, whose aggregates need resampling
	- **Bootstrap** – the same interval by resampling cases, with the [bootstrap replications](./settings.md#bootstrap-replications) setting as the count – see [bootstrap](./concepts/confidence-intervals.md#b-bootstrap) {#auc-confidence-interval-bootstrap}
- **ROC curve** – draws the [curve](#b-roc-curve) under the tables {#roc-curve-option}
- **Cross-validated AUC (out-of-sample)** – adds the out-of-sample columns to the summary table: the model is refitted with each fold held out and the held-out predictions scored. On a regularized fit λ is re-selected inside every training fold unless it was set manually, which makes this the slowest option on the card – see [cross-validated AUC](./concepts/regression-basics.md#b-cross-validated-auc)
- **Number of folds (k)** – the folds each repetition deals the cases into, stratified by outcome level, default 10; every level needs at least *k* cases
- **Repetitions** – how many times the folds are dealt afresh, default 10; each repetition scores the model once, and the reported figure is their mean

> **When to set population prevalences?** Sensitivity and specificity do not depend on how common the outcome is; PPV, NPV and accuracy do, so on a sample whose base rate is not the population's – 200 cases and 200 controls for a condition affecting 2% of people – those three are wrong for any real use until the real rates are entered, and the AUC is unaffected either way – see [prevalence](./concepts/regression-basics.md#b-prevalence).

#### Binomial output

A summary row, a provenance note, the threshold table when its tick is on, and the curve:

- **AUC** – the area under the ROC curve: the probability that a random positive case is rated above a random negative one, 0.5 chance and 1 perfect separation, with the interval the [AUC confidence interval](#b-auc-confidence-interval) selector chose in the **{level}% CI** column – see [AUC](./concepts/regression-basics.md#b-auc) {#classification-roc-analysis-auc}
- **Brier** – the Brier score, the mean squared error of the predicted probabilities against the 0/1 outcomes; lower is better, and where the AUC scores the ranking this scores the probabilities themselves – see [Brier score](./concepts/regression-basics.md#b-brier-score)
- **Brier skill** – the Brier score rescaled against always predicting the sample's base rate: 0 matches that baseline, 1 is perfect, below 0 is worse than the base rate; the number to compare across outcomes of different rarity, since a raw Brier falls on its own as positives get rarer, and a note under the table says so – see [Brier skill](./concepts/regression-basics.md#b-brier-skill)
- **N (positive / negative)** – the cases scored, and how many of each class stand behind the curve
- **CV AUC** – with the cross-validation tick: the mean of the per-fold held-out AUCs, averaged over the repetitions – the honest estimate, whose gap to the in-sample AUC is the [overfitting](./concepts/regression-basics.md#b-overfitting) – see [cross-validated AUC](./concepts/regression-basics.md#b-cross-validated-auc)
- **CV confidence interval** – the **CV {level}% CI** column: a genuine confidence interval for the cross-validated AUC, from the influence curve of that estimator and widened by the spread across repetitions – the sampling uncertainty, how far the answer would move on another sample of this size. Every AUC on the card and every plain average of AUCs gets one: the binomial AUC, the multinomial per-class AUCs and their macro-average, the ordinal per-cutpoint AUCs and their mean {#cv-confidence-interval #cv-ci}
- **CV Brier** – the cross-validated Brier score, the mean over the pooled held-out predictions
- **Brier Monte-Carlo precision** – the interval on it, and the **Monte-Carlo precision** of every other cross-validated row that is not an AUC – the micro-average, Hand-Till M, Somers' D and Kendall's tau-c: how much the figure moves between repetitions of the fold deal on this one dataset. It narrows as you raise **Repetitions** and says nothing about sampling the data, so it is not a confidence interval and is kept in its own column {#brier-monte-carlo-precision #monte-carlo-precision}

A note under the table records where the numbers came from: that the in-sample columns are optimistic – they stay so when cross-validation is on, since they are still resubstitution figures – which method built the AUC interval, that the plotted curve and its legend AUC are in-sample as well, and, with cross-validation on, the fold count, the repetitions completed and the cases scored out of sample.

> **In-sample or cross-validated?** Report the CV AUC with its CV confidence interval as the estimate, and read the Monte-Carlo precision only as "how much did the answer depend on how the folds fell?" – see [cross-validated AUC](./concepts/regression-basics.md#b-cross-validated-auc).

The threshold table, with its tick on, holds one row per threshold the rule produced – one under Youden's J and closest-to-corner, two under the cost rule – each cell its estimate with a percentile bootstrap interval in brackets, obtained by re-choosing the threshold inside every stratified resample, so the interval prices the choice of cutoff along with the metric. These stay in-sample even when the AUC above is cross-validated, and the note under the table says so, as it says which rule chose the threshold and which prevalence the rates rest on.

- **Worse to misclassify** – under the cost rule: the error the row's threshold was chosen to avoid, *Missing a positive* or *False alarm*, one row per direction {#worse-to-misclassify #missing-a-positive #false-alarm}
- **Threshold** – the probability above which the model calls a case positive, as the rule chose it
- **Sensitivity** – of the observed positives, the share the model catches at that threshold – see [sensitivity](./concepts/regression-basics.md#b-sensitivity)
- **Specificity** – of the observed negatives, the share it correctly rules out – see [specificity](./concepts/regression-basics.md#b-specificity)
- **Prevalence** – the rate the next three columns were computed at, the sample's or the one you [set](#b-population-class-prevalences), so the basis is on the row and not only in the note – see [prevalence](./concepts/regression-basics.md#b-prevalence)
- **PPV** – the positive predictive value: when the model says positive, how often it is right – see [PPV](./concepts/regression-basics.md#b-positive-predictive-value-ppv)
- **NPV** – the negative predictive value: when it says negative, how often it is right – see [NPV](./concepts/regression-basics.md#b-negative-predictive-value-npv)
- **Accuracy** – the share of cases called correctly at that threshold and prevalence – see [classification accuracy](./concepts/regression-basics.md#b-classification-accuracy)
- **F1** – the harmonic mean of PPV and sensitivity, the figure for an unbalanced outcome, where accuracy is carried by the majority class – see [F1](./concepts/regression-basics.md#b-f1)

**ROC curve.** False-positive rate along the x-axis, true-positive rate up the y-axis, the diagonal the chance line; the more the curve bows toward the top-left corner, the better the discrimination. The threshold the rule chose is a dot on the curve – hover it for the threshold, sensitivity, specificity, PPV, NPV, accuracy and, under the cost rule, the error it avoids – and the legend carries the in-sample AUC – see [ROC curve](./concepts/regression-basics.md#b-roc-curve). {#roc-curve}

#### Multinomial output

A multinomial model gives every case a vector of class probabilities, so the curve is drawn once per class – that class against all the others – and three aggregates summarize the model as a whole. The classification at predict time is the argmax over the class probabilities, which the [confusion matrix](#b-confusion-matrix) on the goodness-of-fit card shows; this section says how separable each class is from the rest, a related but different question, and a note under the table says so.

- **Class / aggregate** – the summary table's row column: one row per outcome class, then the three aggregates. A class that had to be skipped – no positive or no negative cases – is footnoted with the reason and left out of the curve and the aggregates {#class-aggregate}
- **Macro-average** – the unweighted mean of the per-class AUCs, every class counting equally whatever its size, so the rare classes weigh as much as the common ones; when a class dropped out the label reads *Macro-average (X/K classes)*, and with cross-validation on it carries both counts, since a class can survive the full fit and still be lost in a fold {#macro-average #macro-average-classes #macro-average-classes-cv-over #macro-average-cv-over-classes}
- **Micro-average** – every class's predictions and labels pooled into one binary curve, weighted by class size and so dominated by the largest classes
- **Hand-Till M (multiclass AUC)** – the average of the pairwise AUCs over every pair of classes, the multiclass generalization of the AUC and insensitive to class imbalance: the headline number to report, with the macro-average beside it when the rare classes matter {#hand-till-m-multiclass-auc}

The **AUC** and **{level}% CI** columns read as on the [binomial table](#b-classification-roc-analysis-auc), per class with a bootstrap interval, the aggregates' intervals coming from one case-resampling bootstrap shared by the three; **N (positive / negative)** says how many cases stand behind each class's curve – a per-class AUC of 0.95 on 3 positives and on 300 are different claims – and the cross-validated columns follow the [binomial split](#b-cv-confidence-interval): the per-class rows and the macro-average get the CV confidence interval, the micro-average and Hand-Till M the Monte-Carlo precision.

**Multiclass Brier score.** A line under the table: the squared error summed over each case's K class probabilities against its observed class and averaged, with its skill against predicting the observed class rates – lower Brier is better, and skill runs from 1 through 0 (no better than the base rates) to negative; with cross-validation on, the cross-validated Brier and its Monte-Carlo precision follow – see [Brier score](./concepts/regression-basics.md#b-brier-score) and [Brier skill](./concepts/regression-basics.md#b-brier-skill). {#multiclass-brier-score}

- **Class** – the per-class threshold table's leading column, with the same [threshold columns](#b-threshold) as the binomial table per class: the rule applied class by class, and each row's prevalence its own class's – the sample share, or the one you set

**ROC curves (one-vs-rest).** K coloured curves on one chart, one per class, each with its own AUC in the legend and its threshold marker coloured to match. {#roc-curves-one-vs-rest}

#### Ordinal output

An ordinal model gives cumulative probabilities, so the curve is drawn once per cutpoint between adjacent levels – "above level k" against "at or below" – for each of the K−1 cutpoints, which keeps the ordering that a one-vs-rest treatment would discard. The classification at predict time is still the argmax, shown on the [confusion matrix](#b-confusion-matrix); this section says how cleanly the model separates the outcomes at each ordering boundary, and a note under the table says so.

- **Cutpoint / summary** – the summary table's row column: one row per cutpoint, labelled `{outcome} > {level}`, then three summary rows; a cutpoint with every case on one side of it is footnoted with the reason and left out of the curve and the mean. A note under the table says the two groups of rows run on different scales – the cutpoint and mean AUCs from 0.5 to 1, Somers' D and tau-c from −1 to 1 with 0 for no association {#cutpoint-summary}
- **AUC / value** – the per-cutpoint AUC, with a DeLong or bootstrap interval as the [selector](#b-auc-confidence-interval) says, or the summary row's own statistic; **CV AUC / value** the same out of sample, the cutpoint rows and the mean with a CV confidence interval and the concordance rows with Monte-Carlo precision, as on the [binomial table](#b-cv-confidence-interval) {#auc-value #cv-auc-value}
- **Mean cutpoint AUC** – the unweighted mean of the per-cutpoint AUCs, with a bootstrap interval that resamples cases and recomputes all K−1 curves together, so that it reflects the correlation between cutpoints that share rows; this row is bootstrapped even when DeLong is selected, and the note says so
- **Somers' D** – rank concordance between the model's ranking score and the ordered outcome in the D<sub>xy</sub> convention – concordant minus discordant pairs, over the pairs untied on the outcome – so that $D = 2\,\text{AUC} - 1$ and it reads on the AUC rows' scale; its interval comes from the same case resampling as the mean
- **Kendall's tau-c** – the rank correlation adjusted for ties on the ordinal outcome, less sensitive than tau-b to the mismatch between a continuous score and a handful of levels; bootstrap interval as above

The ranking score both concordance rows use is derived from the predicted class probabilities rather than from a package's latent predictor, so the classic and regularized ordinal fits report on the same scale and in the same direction; the **Multiclass Brier score** line reads as on the [multinomial output](#b-multiclass-brier-score), over the full K-class probability matrix.

> **Per-cutpoint divergence.** Under proportional odds the per-cutpoint AUCs look alike; when they diverge – 0.85 above one level, 0.62 above another – the model discriminates unevenly across the ordering, which is the [Brant test's](#b-proportional-odds-assumption-brant-test) finding seen from the other side – see [proportional odds](./concepts/regression-basics.md#b-proportional-odds).

- **Cutpoint** – the per-cutpoint threshold table's leading column, with the same [threshold columns](#b-threshold) per cutpoint; each row's prevalence is the cutpoint's own – its sample rate, or `P(Y > level)` summed from the shares you set – and the cost rule applies here too, at every cutpoint under the same ratio, with both directions per row

**ROC curves (per cutpoint).** K−1 coloured curves on one chart, one per cutpoint, each with its AUC in the legend. {#roc-curves-per-cutpoint}

## Reading results – regularized regression

**Regularized regression.** A penalized fit's card is titled with the method – Ridge, LASSO, Elastic net or Group lasso – and the regression type, and its sections come in the order below; the coefficients carry no standard errors, p-values or intervals, since the penalty makes classic inference invalid, and the two opt-in procedures at the end of this section are what stands in for them – see [regularization](./concepts/regression-basics.md#b-regularization). {#regularized-regression #regularized #regularized-regression-analysis #method-type-depvar}

The model information block adds three rows to the roles and **N**:

- **Model terms** – the design-matrix columns the fit ran on: one per numeric predictor, k − 1 per k-level categorical; the group table's column of the same name gives each predictor's share of them
- **Non-zero coefficients** – how many of those columns kept a non-zero coefficient at the selected λ, the selected model's size; a multinomial fit reports **Non-zero coefficients (average per outcome)**, since each outcome equation selects its own set, and the cross-validation summary's degrees-of-freedom row names the same count as **Non-zero terms (any outcome)**. Omitted for Ridge, which drops nothing {#non-zero-coefficients #non-zero-coefficients-average-per-outcome #non-zero-terms-any-outcome}
- **Predictor groups selected** – group lasso: the predictors the grouped penalty kept, the forced-in covariates not counted since they were never candidates

### Regularization parameters

**Regularization parameters.** The penalty the fit ran under, each row with its value and a note saying what the value means; every λ is printed to four significant figures, so a small one reads `0.0004217` rather than `< 0.001` and can be typed back into the [Lambda value](#b-lambda-value) field – see [λ](./concepts/regression-basics.md#b-λ). {#regularization-parameters}

- **α (mixing parameter)** – the L1 share of an elastic-net penalty, with the split it implies (*30% L1 / 70% L2*); the row reads **α (Ridge)** with *Pure Ridge (L2)*, **α (LASSO)** with *Pure LASSO (L1)* and **α (group lasso)** with *Pure group penalty* for the methods that have no mix to report – see [elastic net](./concepts/regression-basics.md#b-elastic-net) {#α-mixing-parameter #α-ridge #α-lasso #α-group-lasso #pure-ridge-l2 #pure-lasso-l1 #pure-group-penalty #l1-l2}
- **λ (selected)** – the penalty strength the card reports at, with the rule that chose it: *Minimum CV error* or *Maximum CV log-likelihood* for lambda.min, *1 SE rule (more regularization)* for lambda.1se, *User-specified* for a manual λ; it is the **Selected λ** marker on the plots below, and a note says when it sits on an end of the fitted path rather than at an interior optimum – see [Lambda selection](#b-lambda-selection) {#λ-selected #selected-λ #minimum-cv-error #maximum-cv-log-likelihood #1-se-rule-more-regularization #user-specified}
- **λ (requested)** – with a manual λ: the value typed, beside the point of the fitted path that was fitted instead – *snapped to the nearest point on the fitted path*, *to an end of it*, or *outside the fitted path – the nearest end of it was fitted instead* {#λ-requested}
- **λ.min (CV optimal)** – the λ with the best cross-validated score, *minimizes cross-validation error* or *maximizes cross-validation log-likelihood* by family; flagged *at an end of the fitted path, not an interior optimum* when the curve was still improving as the grid ran out – see [λ](./concepts/regression-basics.md#b-λ) {#λmin-cv-optimal #λmin #minimizes-cross-validation-error #maximizes-cross-validation-log-likelihood}
- **λ.1se** – the largest λ whose score is within one standard error of the best – *of the minimum* where the score is an error, *of the maximum* where it is a log-likelihood – see the [1-SE rule](./concepts/regression-basics.md#b-1-se-rule) {#λ1se}
- **CV error (at selected λ)** – the cross-validated score at the selected λ, mean ± SE over the folds, and its note naming the criterion – mean-squared error for a linear fit, binomial, multinomial or Poisson deviance for the glmnet and group-lasso fits, out-of-sample log-likelihood for the ordinal and negative binomial ones, where the row reads **CV log-likelihood (at selected λ)** and higher is better – see [cross-validation](./concepts/regression-basics.md#b-cross-validation) {#cv-error-at-selected-λ #cv-log-likelihood-at-selected-λ #cv-error #cv-log-likelihood #mean-se-from-fold-cv}

### Regularized model fit

The **Model fit** section is one row, since every backend reports the same quantity under the family's name, with a verdict when [interpretation](./settings.md#significance-formatting) is on, and **Null deviance** where the backend exposes it – see [model fit](./concepts/regression-basics.md#b-model-fit).

- **R² (deviance ratio)** – a linear fit's share of variance explained, read on Cohen's bands; a binomial, multinomial or ordinal fit's row is **McFadden's R² (deviance ratio)**, the same quantity read on McFadden's bands, and a count fit's is the bare **Deviance ratio (pseudo-R²)** – see [pseudo-R²](./concepts/regression-basics.md#b-pseudo-r²) and [McFadden's R²](./concepts/regression-basics.md#b-mcfaddens-r²) {#r²-deviance-ratio #mcfaddens-r²-deviance-ratio #deviance-ratio-pseudo-r²}

An ordinal fit's coefficients are reported on `MASS::polr`'s sign convention, as on the classic card, so a positive coefficient raises the odds of a higher category in both, and the card carries the same reading note; its thresholds print in their own **Thresholds (intercepts)** table with the estimate alone.

### Selection stability

**Selection stability.** An opt-in refit of the model on random halves of the sample, reporting how often each term survives, as the **Selection frequency** column of the coefficient table – and of the group table under group lasso, where the penalty decides per predictor; offered for every method that can drop a term, so not for Ridge, nor for an elastic net set to α = 0, and off by default because it adds B (or 2B) fits to the slowest path on the module. It reports progress per resample and honours the Cancel button at a fit boundary – see [selection stability](./concepts/regression-basics.md#b-selection-stability). {#selection-stability}

- **Selection stability (subsampling)** – the tick, on the **Single regression analysis** card beside the lambda controls
- **Subsampling** – which of the two schemes runs:
	- **Half samples** – Meinshausen & Bühlmann's subsampling: B random halves, each refitted at the λ the full fit selected, a term counted when it comes back non-zero – the reproducibility of the selection, for B fits; the draw is stratified by outcome category for the classification families, so a half cannot lose a class
	- **Complementary pairs (error control)** – Shah & Samworth's refinement: B splits into a half and its complement, both refitted, a term counted when it is non-zero anywhere on the λ path down to the selected λ; twice the fits, for a bound on how many of the terms above the threshold can be expected to be noise – see [error control by complementary pairs](./concepts/regression-basics.md#b-error-control-by-complementary-pairs)
- **Resamples (B)** – how many halves or pairs to draw, 10 to 500, default 50
- **Threshold (π)** – complementary pairs only, 0.55 to 0.99, default 0.75: the selection frequency at or above which a term counts as selected by the procedure, the set the bound is about
- **Selection frequency** – the column both schemes add: the share of the refits that fitted in which the row kept a non-zero coefficient, as a whole percent, the rows at or above π coloured under the pairs scheme; the intercept, an ordinal threshold and a forced-in covariate show "–", having never been at risk, and a note says how many resamples or pairs failed to fit and were left out of the share

Under complementary pairs a **Selection stability** block above the tables carries the run's parameters and its bound:

- **Complementary pairs** – how many pairs fitted whole, with the number of refits and the size of each half in the note {#complementary-pairs}
- **Candidate terms** – the terms the penalty could actually drop: a predictor group under group lasso with the forced-in covariate groups excluded, one outcome equation's term under multinomial, a design column otherwise {#candidate-terms #the-terms-the-penalty-could-drop}
- **Selected per half sample (average)** – the expected size of the selected set over the λ region, which is what prices the bound
- **Threshold (π)** – the π you set, and how many terms reach it {#selection-stability-threshold-π #terms-reach-it}
- **Expected false selections** – the assumption-free bound on the number of noise terms among those above π, as ≤ a value
- **Expected false selections (r-concave)** – the sharper bound under a shape assumption on the selection probabilities, the one the procedure is usually read at

Every condition that withdraws the bound is named instead of leaving the rows blank: a threshold at or below the share of the candidates an average half already selects – with the smallest π that would carry a bound – a saturated selection where every candidate is chosen, a package that could not be loaded, and, since it costs only the sharper row, the r-concave bound's own limit at that threshold and set size.

> **Which scheme?** Half samples answer "would this predictor survive on a different half of my data?"; complementary pairs answer that and "how many of the terms above π should I expect to be noise?", so reach for pairs when a selected set is to be reported as a finding – see [error control by complementary pairs](./concepts/regression-basics.md#b-error-control-by-complementary-pairs).

> **Is a selection frequency a significance?** No: it says how reproducible the selection is, not whether an effect is there, and a penalized coefficient still has no standard error, p-value or interval – see [selection stability](./concepts/regression-basics.md#b-selection-stability).

### Group selection (group lasso only)

**Group selection.** The table the grouped penalty makes possible: one row per predictor rather than per design column, with the verdict the penalty reached for the variable as a whole; when no predictor is categorical every group holds one column, and a note says the table is then a re-presentation of the coefficients – see [group lasso](./concepts/regression-basics.md#b-group-lasso). {#group-selection}

- **Predictor** – the variable, with its **Model terms** – how many design columns it occupies – beside it {#group-selection-predictor}
- **Standardized norm** – the L2 norm of the group's SD-scaled coefficients: how large the variable's combined effect is on the scale the penalty works on, and the closest thing to an effect size the method offers for ranking the selected variables, since a raw norm would rank by units of measure
- The **Status** and **Selection frequency** columns read as on the [coefficient table](#b-status), per predictor rather than per column

### Regularized coefficients

**Regularized coefficients.** The **Coefficients** section – one table per outcome level under **Coefficients by outcome level** for a multinomial fit, each headed **Outcome** – with the columns below, excluded terms dimmed; the intercept is exempt from every verdict column and reads "–", since no backend penalizes it – see [coefficients](./concepts/regression-basics.md#b-coefficients). {#regularized-coefficients}

- **Term** – the design column: a variable, one level of a categorical predictor against its reference, or **(Intercept)** – see [term](./concepts/regression-basics.md#b-term) {#coefficients-term #coefficients-by-outcome-level-term}
- **Estimate** – the penalized coefficient on the variable's original scale, "0" for an excluded term – see [B](./concepts/regression-basics.md#b-b) {#coefficients-estimate #coefficients-by-outcome-level-estimate #thresholds-intercepts-estimate}
- **Shrinkage** – Ridge only: the share of the unpenalized estimate the penalty retained, *90% retained* and up in green, 50% and up in yellow, below in red; a coefficient whose sign flipped against the unpenalized fit – which ridge can genuinely do under collinearity – reads *Sign reversed* rather than a percentage. The column is empty, and the note says why, when no unpenalized baseline is identified – as many parameters as complete cases or more, precisely the regime ridge is chosen for – see [ridge](./concepts/regression-basics.md#b-ridge) {#shrinkage #retained #lt-10-retained #sign-reversed}
- **Status** – LASSO, elastic net and group lasso: *Selected* for a non-zero term, *Excluded (shrunk to 0)*, or *Always included* for a covariate, which carries no penalty and stays in the model at every λ – see [LASSO](./concepts/regression-basics.md#b-lasso) {#status #selected #excluded-shrunk-to-0 #always-included}
- With [post-selection inference](#post-selection-inference) on, the **Unpenalized estimate** and **p** columns follow, described there
- **Selection frequency** – the [selection stability](#b-selection-frequency) column, when that option is on {#coefficients-selection-frequency}

Notes under the table say that the predictors were standardized internally before the fit, so the penalty falls equally on every variable whatever its units, and the coefficients are returned on the original scale; that covariates carry no penalty – put a variable in **Predictors** instead if the penalty is to judge it; and, when the model holds a categorical predictor, how its levels were penalized:

- **Ridge, LASSO, Elastic net** – each dummy level penalized on its own, so one level of a variable can be selected while another is excluded
- **Group lasso** – the levels penalized as one block and selected or excluded together {#regularized-coefficients-group-lasso}

### Post-selection inference

**Post-selection inference (multi-sample splitting)** is the opt-in tick beside the lambda controls, off by default: the one route to a p-value a penalized fit has, adding two columns to the coefficient table. It is not offered for Ridge, which selects nothing, nor for multinomial, whose symmetric glmnet fit has no unpenalized counterpart on the same parameterization – see [post-selection inference](./concepts/regression-basics.md#b-post-selection-inference).

- **Sample splits (B)** – how many times the sample is split in half, 20 to 200, default 50
- **Unpenalized estimate** – one unpenalized refit of the terms the reported fit selected, on the whole sample: the size the selected model implies once the penalty stops pulling – the relaxed lasso's zero-shrinkage limit – with no standard error or p-value of its own, since those would be computed on the sample that chose the terms; an excluded term shows "–", and the column declines when the selected terms are too many for the sample
- **p** – a p-value that controls the family-wise error rate over the whole term set: in each split the terms are re-selected on one half, with λ re-tuned there by the rule you picked, and refitted unpenalized on the other, so the half the p-value is read off never saw the selection, and the B split p-values are aggregated into one. A term selected in only a few splits reads close to 1, which is the procedure working; the intercept is never tested {#post-selection-inference-p}

A note under the table records the arithmetic – how many splits ran, the size of each half, and how many could not be fitted and count as evidence-free rather than being dropped, which makes every p-value conservative by that much; a split whose selected model is too large for the other half to fit is redrawn before that happens, and if no split survives the columns decline and say so. Every split is a fresh λ search plus two fits, which is why the option is slow.

> **Read the estimate for size and p for evidence.** The two columns rest on different fits on purpose, and there is no interval: one would have to be inverted from the aggregated p-value and would not bracket the estimate beside it – see [post-selection inference](./concepts/regression-basics.md#b-post-selection-inference).

### Cross-validation summary

**Cross-validation summary.** How the λ grid was searched: the folds are dealt at random – stratified by outcome category for the classification families, so every training set holds every category – and the model refitted with each fold held out and scored on it, the mean score over the folds being the CV metric the [Regularization parameters](#b-regularization-parameters) report – see [cross-validation](./concepts/regression-basics.md#b-cross-validation). {#cross-validation-summary}

- **Lambda values tested** – the number of λ values on the fitted path
- **Lambda range** – the path's span, the interval a manual λ has to fall in to be fitted rather than snapped – worth reading before typing one
- **Best CV error** – the best cross-validated score on the path with its SE, and the λ it was reached at; **Best CV log-likelihood** for the ordinal and negative binomial fits, where higher is better {#best-cv-error #best-cv-log-likelihood #at-λ}
- **Degrees of freedom (at selected λ)** – what the fitter counts at the selected λ, named in the note: the [non-zero coefficients](#b-non-zero-coefficients) for the glmnet fits, *Non-zero terms (any outcome)* for multinomial, and the **Effective number of parameters** for group lasso, where the count genuinely is one; omitted for Ridge, whose count is the raw predictor count at every λ {#degrees-of-freedom-at-selected-λ #effective-number-of-parameters}

Up to 10 folds are dealt, fewer on a small sample down to a floor of 3, and for the classification families never more than the rarest category can fill, so an outcome category with three cases still spreads across three folds instead of blocking the run; the standard error is taken over the folds that actually produced a score, so the 1-SE rule reads an undistorted band when a fold drops out.

### Regularization path

**Regularization path.** Two plots of the fit across the penalty grid, with markers at **λ.min**, **λ.1se** and the **Selected λ** – see [λ](./concepts/regression-basics.md#b-λ). {#regularization-path}

- **Cross-validation curve** – the cross-validated score against log(λ), the shaded band its ±1 standard error, and, for the selecting penalties, the number of non-zero terms along the top; drawn for every family. A flat stretch around the selected λ means the choice is not critical, a steep one that it is – worth knowing before a coefficient set is reported as "the" selected model
- **Coefficient trace** – one line per term across the grid, on each variable's original scale: for the selecting penalties the λ at which a line leaves zero is the point that term entered the model, so a term that leaves early and stays away survives a wide range of penalties and one that appears only at the end of the grid is a marginal selection; on a Ridge card the caption says instead that no term enters or leaves. Not drawn for multinomial, which has one coefficient matrix per outcome level and no single trace

## Model comparison

Model comparison fits every combination of the selected predictors as a separate model – an all-subsets search, with the covariates and the moderators' main effects fixed in every candidate – and ranks the candidates by AICc. Classic estimation only, each candidate fitted by the [estimation method](#estimation-method) the single-model card is set to and the card naming Firth when it is that; the card is withdrawn for the [robust](#robust-linear-regression) and [quantile](#quantile-regression) families, whose fits have no likelihood to rank on, and for the [two-part count families](#two-part-count-models). It opens with the roles that entered the search, **N** with the rows dropped as incomplete, the number of models compared, the size of the confidence set and – with more than one candidate – the selection uncertainty, the entropy of the Akaike weights against its maximum, with the effective number of models it implies; the sections below follow – see [comparing models](./concepts/regression-basics.md#comparing-models). {#model-comparison}

> **When to use model comparison?** When several candidate predictors compete and the question is which combination explains the outcome without overfitting – an exploratory tool that generates hypotheses rather than confirming them – see [AIC](./concepts/regression-basics.md#b-aic) and [overfitting](./concepts/regression-basics.md#b-overfitting).

### Settings

- **Maximum models to display** – how many rows the ranking table and the weights chart show, default 25; 0 or an empty field shows every model. The weights, the averaged coefficients and the confidence set are computed over every model fitted whatever is shown, and a note names both counts when the table is shorter than the search
- **Minimum predictors** – the fewest predictors a candidate may carry, default 0, which keeps the baseline model with no dredged predictors in the search
- **Maximum predictors** – the most, empty for no limit; with the minimum it is the search window, which the confirmation dialog's count and every predictor's [prior inclusion share](./concepts/regression-basics.md#b-prior-inclusion-share) are read from

The window is checked before the run: a negative value, a minimum above the maximum or above the number of selected predictors is refused, and so is a search whose smallest candidate – intercept, covariates, moderator main effects and the minimum number of predictors – already has as many parameters as there are complete cases. The [checks before the run](#checks-before-the-run) apply on the same terms as for a single fit, the events-per-parameter warning included.

Above 100 candidates a dialog asks for confirmation with the number of models the run will actually fit – the window's count, not two to the number of predictors – and past 1,000 and past 100,000 says how long to expect; when moderators are selected it adds that the interactions inflate the count. There is no ceiling on the size of a search: a run of any size can be interrupted from the progress overlay.

### Output options

- **Model-averaged coefficients** – on by default: adds the [model-averaged coefficients](#b-model-averaged-coefficients) table {#model-averaged-coefficients-option}
- **Extended model statistics** – adds the **Log-lik**, **BIC**, **ΔBIC** and **BIC wt** columns to the ranking; the columns are rendered either way, so the tick can be flipped after the run without repeating it

**Compare models.** Runs the search once per selected dependent variable, a card each; a variable whose search fails leaves the other cards standing and is named in the error.

### Model rankings

**Model rankings.** One row per candidate, best first, over a note that every model was ranked on the data that selected it – the leading model's fit statistics are optimistic and the order is unstable when predictors are correlated, so the ranking is exploratory – and, under the table, the **Model ranking** chart – see [Akaike weight](./concepts/regression-basics.md#b-akaike-weight).

- **Rank** – the model's position by AICc, the criterion the deltas and the weights are built on – by AIC when a note says every candidate is over-parameterized for the sample
- **Predictors** – the dredged terms in the model, an interaction absorbing its predictor's main effect (`{predictor} × {moderator}`, not `{predictor}, {predictor} × {moderator}`); the baseline row reads **Intercept only**, or **No additional predictors** when covariates or moderators keep it from being that. The cell is a control: click it to put that predictor set into the selection list and fit it from there, with a warning when the row carries only some of the possible predictor × moderator interactions, since the standard-mode fit adds them all and the model it fits is not the one clicked {#model-rankings-predictors #intercept-only #no-additional-predictors}
- **Interactions** – with moderators, the predictor × moderator terms the candidate carries {#model-rankings-interactions}
- **K** – the parameters the model estimated, the intercept, a linear model's residual variance and an ordinal model's thresholds included – the *k* of the AICc correction
- **R²** or **McFadden R²** – the fit the family allows: R² for a linear model, McFadden's pseudo-R² for the others – see [R²](./concepts/effect-sizes.md#b-r²) and [McFadden's R²](./concepts/regression-basics.md#b-mcfaddens-r²) {#model-rankings-r² #model-rankings-mcfadden-r² #mcfadden-r²}
- **Adj R²** or **Nagelkerke's R²** – adjusted R² for a linear model, Nagelkerke's R² for the others – see [adjusted R²](./concepts/regression-basics.md#b-adjusted-r²) and [Nagelkerke's R²](./concepts/regression-basics.md#b-nagelkerkes-r²) {#model-rankings-adj-r² #adj-r² #model-rankings-nagelkerkes-r²}
- **AUC** – *binomial only*: each candidate's discrimination, its interval in the **AUC {level}% CI** column on the basis the [AUC confidence interval](#b-auc-confidence-interval) selector holds, and a note under the table naming both – see [AUC](./concepts/regression-basics.md#b-auc) {#model-rankings-auc #auc-ci}
- **p (vs best)** – the paired test of each candidate's curve against the top-ranked model's over the same cases – DeLong's under the DeLong interval, the bootstrap test under the bootstrap one – and "–" for the top model itself; the [p-value adjustment](./settings.md#multiple-comparison-adjustment) setting corrects the M − 1 comparisons and puts **Adjusted p (vs best)** beside the raw column or in its place. The reference is the model AICc ranked first, chosen on these same data, so the p-values are post-selection and exploratory; AIC and AUC need not agree, since AUC charges nothing for complexity {#p-vs-best #adjusted-p-vs-best}
- **AIC**, **AICc** and **ΔAICc** – the criterion, its small-sample correction and each candidate's gap to the best; a candidate over-parameterized for the sample (n − k − 1 ≤ 0) shows "∞", sorts last and carries no weight, and when every candidate is, the ranking falls back to AIC, the column reads **ΔAIC** and a note says so – see [AIC](./concepts/regression-basics.md#b-aic) and [AICc](./concepts/regression-basics.md#b-aicc) {#model-rankings-aic #aicc #δaicc #δaic}
- **Weight** – the Akaike weight, the probability that this is the best model of the set – see [Akaike weight](./concepts/regression-basics.md#b-akaike-weight)
- **Cumulative weight** – the weights summed down the ranking – see [confidence set](./concepts/regression-basics.md#b-confidence-set)
- **Ev. ratio** – the best model's weight over this one's, "> 100" past a hundred – see [evidence ratio](./concepts/regression-basics.md#b-evidence-ratio)
- **Conf. set** – a checkmark on every model in the confidence set at the configured [confidence level](./settings.md#confidence-level): the models that cannot be ruled out. The set is counted over every model fitted, so a truncated table carries fewer marks than the count above it, and a note says so – see [confidence set](./concepts/regression-basics.md#b-confidence-set)
- **Log-lik**, **BIC**, **ΔBIC** and **BIC wt** – with [Extended model statistics](#b-extended-model-statistics): the log-likelihood, BIC, each candidate's BIC gap to the lowest and the weight a BIC ranking would give it – see [log-likelihood](./concepts/regression-basics.md#b-log-likelihood) and [BIC](./concepts/regression-basics.md#b-bic) {#log-lik #model-rankings-bic #δbic #bic-wt}
- **Model ranking** – the chart: the displayed models' Akaike weights as bars, each annotated with its ΔAICc, the bars outside the confidence set greyed

**Large searches keep only the competitive candidates in memory.** Every candidate is fitted and counted, but past the first 2,000 only those within 20 information units of the running best – on AICc, AIC or BIC – are retained; the weights, the averaged coefficients and the confidence set are computed over the retained set, the number of models fitted and the per-predictor counts over the whole search, and a note says so when the cap fired. {#retention-cap}

If no candidate could be fitted, the card says so and lists the failures instead of an empty ranking.

### Model-averaged coefficients

**Model-averaged coefficients.** With its tick on, one row per term with the columns below, over a note restating what the two averages are and that both standard errors are unconditional; a multinomial fit gets one table per outcome level under **Model-averaged coefficients (per outcome)**, each headed **Outcome** – the level – *vs.* the reference – see [model averaging](./concepts/regression-basics.md#b-model-averaging). {#model-averaged-coefficients #model-averaged-coefficients-per-outcome}

- **Term** – the coefficient's term, as in the [coefficient table](#b-predictor), an interaction written predictor × moderator {#model-averaged-coefficients-term}
- **Full avg** – the coefficient averaged over every candidate by Akaike weight, counted as zero in the models without the term – see [full average](./concepts/regression-basics.md#b-full-average)
- **SE** and **{level}% CI** – the unconditional standard error and the interval on the full average, which price the uncertainty about which model is right alongside the estimate's own – see [model averaging](./concepts/regression-basics.md#b-model-averaging) {#model-averaged-coefficients-se #model-averaged-coefficients-ci}
- **OR** and **OR {level}% CI** – for binomial and ordinal fits with the [exponentiated-coefficient tick](#b-odds-ratios-with-confidence-intervals) on: the full average and its interval exponentiated for display, the averaging itself done on the link scale; **RRR** for a multinomial fit, **IRR** for the count families – see [odds ratio](./concepts/regression-basics.md#b-logistic-odds-ratio) {#model-averaged-coefficients-or #model-averaged-coefficients-or-ci #model-averaged-coefficients-rrr #model-averaged-coefficients-rrr-ci #model-averaged-coefficients-irr #model-averaged-coefficients-irr-ci}
- **Cond avg**, **Cond SE** and **Cond {level}% CI** – the same three quantities over only the models that contain the term, blank for the intercept – see [conditional average](./concepts/regression-basics.md#b-conditional-average) {#cond-avg #cond-se #cond-ci}
- **Importance** – the term's [importance](#b-importance), the summed weight of the models containing it {#model-averaged-coefficients-importance}

> **Full or conditional average?** The full average says what a predictor is worth allowing that it may not belong in the model, the conditional what it is worth in the models that use it – see [full average](./concepts/regression-basics.md#b-full-average) and [conditional average](./concepts/regression-basics.md#b-conditional-average).

### Variable importance

**Variable importance.** One row per predictor, ranked by the summed Akaike weight of the models containing it, over a note that correlated predictors split that weight between them; the **Variable importance** chart under the table draws each predictor's importance as a bar with a red tick at its prior inclusion share, and only the distance past the tick is evidence – see [variable importance](./concepts/regression-basics.md#b-variable-importance).

- **Variable** – the predictor {#variable-importance-variable}
- **Importance** – the sum of the Akaike weights of the models containing the predictor, 0 to 1 – see [variable importance](./concepts/regression-basics.md#b-variable-importance)
- **N models** – how many fitted candidates contain the term – the predictor here, the interaction in the [interaction importance](#b-interaction-importance) table – counted over the whole search
- **N+** and **N−** – how many of those gave the predictor's own coefficient a positive or a negative sign, a categorical predictor counting on any of its levels; its interaction terms are left to the interaction table {#variable-importance-n}
- **Interpretation** – with [interpretation](./settings.md#significance-formatting) on: the importance read against the predictor's [prior inclusion share](./concepts/regression-basics.md#b-prior-inclusion-share) – the excess over the share, scaled by the room above it – as *Very high* from 0.9 of that room, *High* from 0.7, *Moderate* from 0.5, *Low* from 0.3 and *Very low* below; a predictor the search window puts in every candidate reads *In every model – not distinguishable*, one no fitted candidate contains *In no model – not distinguishable*, and a note says the bands are descriptive rather than a published criterion {#variable-importance-interpretation}

> **Importance and correlated predictors?** Two predictors carrying the same information split the weight between them, so read a low score as "not consistently chosen", not as "not relevant", and check the correlation between the predictors before drawing conclusions – see [variable importance](./concepts/regression-basics.md#b-variable-importance) and [multicollinearity](./concepts/regression-basics.md#b-multicollinearity).

### Model comparison with moderators

With moderators, their main effects are fixed in every candidate like covariates and the predictor × moderator interactions are dredged: each included predictor carries any subset of them – two to the number of moderators states per predictor, which is what inflates the count. The ranking shows the **Interactions** column, and an interaction importance table follows the variable importance one.

**Interaction importance.** One row per predictor × moderator pair, ranked by the summed weight of the candidates carrying that interaction, with the count of models it was in; kept apart from the main effects' importance, since an interaction's coefficient is a different quantity from its predictor's – see [interaction](./concepts/regression-basics.md#b-interaction).

- **Interaction** – the predictor × moderator term, with its **Importance** and **N models** as in the [variable importance](#b-variable-importance) table

### Model comparison with mediators

Mediators stay out of the candidate formulas. For every candidate with at least one predictor the paths are fitted as sub-models – path a, the mediator on the candidate's predictors, covariates and moderators; paths b and c′, the candidate's own term set plus the mediator – and the indirect effect of each predictor × mediator pair is tested by the [Sobel test](./concepts/regression-basics.md#b-sobel-test) rather than bootstrapped, then averaged over the candidates into the table below.

**Mediation paths.** One row per predictor → mediator pair, ranked by the size of the full-average indirect effect, over a note that the estimates are model-averaged and Sobel-tested – see [indirect effect](./concepts/regression-basics.md#b-indirect-effect).

- **Path** – the predictor → mediator pair {#mediation-paths-path}
- **Full avg indirect** and **Cond avg indirect** – the indirect effect averaged over every candidate, zero in those without the predictor, and over only those containing it – the distinction the [model-averaged coefficients](#b-model-averaged-coefficients) draw {#full-avg-indirect #cond-avg-indirect}
- **Σ weights** and **N models** – the summed Akaike weight of the candidates the path was estimated in, the pair's importance, and how many they were {#σ-weights #mediation-paths-n-models}
- **Sobel z** and **Sobel p** – the full average against its unconditional standard error, read as a normal deviate, and its two-sided p-value – see [Sobel test](./concepts/regression-basics.md#b-sobel-test) {#sobel-z #sobel-p}

> **Confirmatory mediation?** The Sobel test is a normal approximation, anti-conservative in small samples and for skewed indirect effects; for a confirmatory analysis run a targeted [mediation analysis](#mediation-analysis) with the best model's predictor set and read its bootstrap interval – see [Sobel test](./concepts/regression-basics.md#b-sobel-test).

### Failed models

**Failed models.** With the count in its title, a collapsed list of the candidates that could not be fitted, each with its term set – the same **Intercept only** and **No additional predictors** labels as the ranking – and its reason: **Fit error** with R's message, **Singularity** naming the aliased terms dropped, or **Non-finite AIC (saturated model)** for a candidate whose AIC could not be computed, typically a perfect fit with n ≤ k. The list shows at most 100 entries with an "… and N more" line; the title always carries the true count. {#failed-models #fit-error #singularity-coefficients-dropped #non-finite-aic-saturated-model}

## Path analysis (advanced mode)

Path analysis fits a system of regressions you draw rather than the one equation the role buckets imply: on the **Advanced** tab a formula editor and a live diagram replace the buckets for the dependent variable, predictors, mediators and moderators, each line is one equation, and the run fits every equation on its own, then estimates and tests the indirect effects along the chains the diagram draws. The [covariates](#variable-selection) bucket stays and joins every equation's right-hand side, and the regression type applies to the outcome equation. One card is produced per outcome the model defines, titled by the regression type and the outcome – see [path analysis](./concepts/latent-variables.md#b-path-analysis) and [mediation](./concepts/regression-basics.md#mediation). {#path-analysis}

### Formula editor

The **Formulas** editor, under the diagram, uses [R formula notation](./r-console.md#r-formula-notation):

```r
Y ~ A + B*C
M ~ A
```

Each line is one equation, `outcome ~ predictors`, written with R's formula operators: `+` adds a term, `-` removes one, `*` crosses two variables – their main effects and their interaction – `:` is the interaction alone, parentheses group terms, `^n` expands a group to every interaction up to n-way, and `- 1` or `+ 0` drops the intercept. `#` starts a comment anywhere on a line, not only at its start, and a variable name standing alone (no `~`) is an isolated node in the diagram. Autocomplete suggests your **selected** variables as you type – press **Tab** to accept the highlighted completion. Typing `=` is auto-corrected to `~`, and only in the text you just typed – it leaves backtick-quoted names alone, and a variable whose name contains `=` is quoted for you. {#formulas}

Editing through the diagram round-trips through this text without disturbing it: comments, blank lines, and the order of terms are preserved.

Variable names containing operator characters, spaces, a leading `#`, or the bare intercept literals `0` and `1` can be written inside backticks – `` `my odd name` `` – and a literal backtick inside such a name is written by doubling it. The editor produces this quoting itself when you edit through the diagram, so round-tripping never loses a name.

Syntax problems are underlined as you type, with a message in the lint layer. Several of them block the run rather than just warning:

- An equation with no predictors on the right, if another equation references its target
- **Two equations sharing the same left-hand side.** Both lines draw their edges in the diagram, but only one can be fitted, so the other's predictors would silently vanish from the analysis. Merge the right-hand sides into a single line
- **A variable predicting itself** (`Y ~ X*Y`). R drops the self main effect but keeps the `X:Y` product, so the outcome would be regressed on a term containing itself
- **A name that isn't one of your selected variables.** Only variables in the current selection can enter the model, so a typo – or a column you deselected – is rejected by name instead of failing later in R
- **A right-hand side that expands to nothing** – `Y ~ 1`, or `Y ~ A - A`. The equation has no terms to estimate, so it is flagged rather than fitted as an intercept-only model you didn't ask for

Very large expansions are refused rather than attempted: `^` degrees and chained `*` operators that would generate more than 256 terms produce a diagnostic instead of freezing the editor.

### Path diagram

An SVG diagram rendered live from the formula text, using a Sugiyama layered layout. Nodes are colored by role:

- **Predictor** – variables that only appear on the right side of equations {#path-diagram-predictor}
- **Mediator** – variables that appear on both sides (predicted in one equation, predictor in another) {#path-diagram-mediator}
- **Outcome** – variables on the left side {#path-diagram-outcome}
- **Isolated** – standalone variables with no connections {#path-diagram-isolated}

Interaction terms render as diamond-shaped product nodes. Edges use directional chevrons.

### Visual editing

All diagram interactions round-trip through the formula text – clicking in the diagram edits the formula, which re-renders the diagram:

- **Click a node label** to swap the variable via a dropdown
- **Hover a node** to reveal delete (×) and add-connection (+) buttons on each side
- **Click an edge** to get a popover with options: **Insert mediator**, **Add interaction**, or **Remove edge**
- **Click a product node's ×** to delete the interaction term (main effects are preserved)

Each of these controls carries a tooltip naming what it does, which also gives screen-reader and voice-control users an accessible name to work with. Every edit the diagram offers can also be made by typing in the formula editor, which remains the fully keyboard-accessible route.

Deleting a node or removing an edge preserves orphaned variables as isolated nodes rather than removing them – you can reconnect or clean them up manually. Variable dropdowns exclude choices that would create cycles or duplicate existing connections. Renaming a node onto a variable that already has its own equation **merges** the two equations rather than leaving a duplicate target behind.

**Incomplete formulas.** `Y ~` (empty right-hand side) is valid while you edit – the variable renders as an isolated node with a warning underline, and the empty equation is cleaned up automatically when the variable gets reconnected elsewhere; it blocks the run until completed or removed.

### Running path analysis

Advanced mode is classic estimation only – there is no penalized path fit – so the **Estimation method** selector is hidden while the tab is active and a regularized pick is reset to the classic method; the [robust](#robust-linear-regression) and [quantile](#quantile-regression) types and the [two-part count families](#two-part-count-models) are refused, each with a message saying why.

**Run regression.** Decomposes the drawn model into one system per outcome and fits each equation on the one set of cases complete on every variable of the system – the outcome equation by OLS or the regression type's GLM, an ordinal outcome by a proportional-odds model, a two-level mediator by binary logistic regression and every other mediator by OLS. For a **linear** outcome the indirect effect along each chain is the product of the edge coefficients, with a bias-corrected bootstrap interval from resamples that refit the whole system, and the card reports the full decomposition – direct, indirect and total – for exogenous variables and mediators alike: in X → M₁ → M₂ → Y, M₁'s indirect effect on Y through M₂ is a row of its own. For a **non-linear** outcome a product of coefficients has no scale, so a single-step path (X → M → Y) is estimated by [causal mediation](./concepts/regression-basics.md#b-causal-mediation) on the response scale – ACME and ADE, per outcome category for an ordinal outcome – and a serial path (X → M₁ → M₂ → Y) is reported as an *approximate* indirect effect, a product across mixed scales, with a note pointing at the [SEM module](./structural-equation-modeling.md) for a rigorous categorical or ordinal path model. A two-edge path through a binary mediator takes the causal-mediation route on a linear outcome too.

Each causal-mediation path is estimated from an outcome model built for that path, which is not always the equation you drew: a second mediator downstream of the path's treatment is dropped from it, together with any interaction it enters; the treatment is added when the drawn model has no direct edge from it to the outcome; and a moderator of an edge into the mediator is added when it is absent from the outcome equation. The card names each departure, and that model's own coefficient table is rendered inside the path's section, so the reported direct effect always has its model visible; it will not match the card's outcome coefficient table, which is arithmetic rather than a discrepancy.

A moderated edge gets the Simple tab's treatment: `Y ~ X*W` produces simple slopes for the conditional effect under **Moderation analysis** and, for a numeric moderator, a [Johnson-Neyman region](#johnson-neyman-region-of-significance) with its plot; the builder assigns no roles, so a two-way interaction is read both ways – X moderated by W and W moderated by X – and both readings are reported. A path through a moderated edge gets its conditional indirect effects at the moderator's probe points, in a section of its own.

Before anything is fitted the model is checked as the simple mode's is, each failure reported by name: syntax errors and cycles; a name not in the selection; an equation with an empty right-hand side; a model with no outcome; an outcome incompatible with the regression type; a mediator that is neither numeric nor two-level; a serial path continuing past a binary mediator, whose logit-scale coefficients have no common metric with a linear edge; a multinomial system carrying indirect paths, since a nominal outcome has no single response scale for one; a system with more than 100 indirect paths, or one too densely connected to enumerate them; and an equation with no more complete cases than parameters, the covariates that join it counted. The events-per-parameter warning fires for the outcome equation as in simple mode, and a long run can be cancelled from the progress overlay.

A covariate the drawn model places downstream of an equation's own target is left out of that equation, and the card names the covariates and equations involved.

**Categorical variables in a path chain** are resolved to their dummy coefficients: a two-level node is one contrast and multiplies along the path, while a node with three or more levels has no single coefficient to multiply, so that path is reported as **Not computed** with the reason rather than silently missing from the total.

#### Path analysis output

The card opens with the **Covariates** the run adjusted for and **N**, the cases complete on every variable of the system, with the rows dropped as incomplete; then the sections below, each of the outcome equation's diagnostics titled to say which model it describes:

- **Path diagram** – the drawn system rendered with each edge labelled by its unstandardized coefficient, edge width and colour showing sign and rough magnitude, and non-significant edges dashed. Interaction terms appear as their own nodes fed by their components, as in the editor's diagram. An edge whose term owns more than one coefficient (a 3+-level categorical) is drawn without a label rather than with an arbitrary one, and covariates are adjusted for but not drawn – a note under the diagram says so
- **Covariates** – listed at the top of the card, since they join every equation's right-hand side without appearing in the drawn model; a note names the equations a covariate was left out of {#path-analysis-covariates}
- **N** – the number of cases complete on every variable in the system, covariates included, with the number of rows dropped; all of the system's equations are fitted on that same set, each estimated on its own rather than jointly – a note under it says so and points at the [SEM module](./structural-equation-modeling.md) for simultaneous estimation
- **Outcome model fit**, **Outcome model coefficients**, **Outcome model ANOVA**, **Outcome model correlations**, **Outcome model collinearity diagnostics**, **Outcome model residual diagnostics**, **Outcome model influence statistics**, **Outcome model case weights** and **Outcome model goodness of fit** – the outcome equation's own [model fit](#b-model-fit), [coefficients](#b-coefficients), [ANOVA](#b-anova), [correlations](#b-correlations), [collinearity](#b-collinearity-diagnostics), [residual](#b-residual-diagnostics), [influence](#b-influence-statistics), [case-weight](#b-case-weights) and [goodness-of-fit](#b-goodness-of-fit) sections, as on a single-model card, titled so that a card stacking several equations says which model each describes; a linear outcome's coefficient table is followed by its regression equation {#outcome-model-fit #outcome-model-coefficients #outcome-model-anova #outcome-model-correlations #outcome-model-collinearity-diagnostics #outcome-model-residual-diagnostics #outcome-model-influence-statistics #outcome-model-case-weights}
- **Equation for {variable}** – one section per mediator equation: its fit statistics, a note naming the modelled level for a binary mediator, and its coefficient table – **Term**, **B**, **SE**, **β** where the outcome is linear, **t** or **z**, **p** and the interval – read as the [coefficient table](#b-coefficients) is; an equation written with `- 1` or `+ 0` carries a note that its R² is computed about the origin, which is usually inflated and not comparable to an ordinary R² {#equation-for #equation-for-variable-term}
- **Effect decomposition** – for a linear outcome, one row per effect with the columns below; rows whose interval excludes zero are highlighted, a path through a moderated edge is footnoted with the moderator's name and a reminder that the unconditional product is taken at moderator = 0 (or its reference level), usually outside an uncentered moderator's observed range, and an interval resting on fewer resamples than requested carries the completion note the Simple tab uses
	- **Path** – the chain, origin → … → outcome; a direct or total row is written origin → outcome
	- **Type** – *Direct effect*, the origin's coefficient in the outcome equation, one for every non-interaction term of it, mediators included; *Indirect effect*, the product along one chain; or *Total effect*, the direct effect plus every indirect path from that origin, assembled resample by resample from the same replicates as its parts and reported only for origins that have an indirect path
	- **Effect** – the estimate, with **β**, the standardized one, beside it wherever the equations involved are linear
	- **Boot SE** and **Bias-corrected bootstrap CI** – the spread of the resampled estimates and the bias-corrected interval, as in [mediation analysis](#b-bias-corrected-bootstrap-ci); an interval resting on ten or fewer draws is withheld with the reason {#effect-decomposition-boot-se #effect-decomposition-bias-corrected-bootstrap-ci}
- **Approximate serial indirect effects** – for a non-linear outcome, the serial paths' products with their **Indirect** estimate, **Boot SE** and bias-corrected interval, over the caveat that a product across mixed scales is an approximation {#approximate-serial-indirect-effects #indirect}
- **Outcome model for this path** – a path estimated by causal mediation gets a section of its own, titled by the chain, with the [ACME, ADE, total effect and proportion mediated](#b-indirect-effect-acme) rows and notes of the Simple tab's mediation table, the [treatment contrast](#b-treatment-contrast) note and, when that path's outcome model departs from the drawn equation, the departures named and the model's coefficient table under this heading; with the [sensitivity](#b-sensitivity-of-the-indirect-effect-to-unmeasured-confounding) tick on, the path's sensitivity curve follows, a product path's under a section of the same title, and a note under **Sensitivity to unmeasured confounding** says the analysis covers single-mediator paths only
- **Higher-order interactions** – when an edge carries a three-way or larger interaction term, it is listed here and excluded from the conditional-effect computation, since those are probed from two-way coefficients only

**Conditional indirect effects per path.** A path through a moderated edge gets a section per path × moderator, titled by both: one row per probe point with the moderator's **Value**, the **Indirect** effect, its **Boot SE** – **SE** under causal mediation – and the bias-corrected or quasi-Bayesian interval, the [index of moderated mediation](#b-index-of-moderated-mediation) row with its **Estimate** beneath, and the probe-range, treatment-contrast and resample notes of the Simple tab; a moderator added to the path's outcome model is named. For an ordinal outcome the section reads a note instead: moderated mediation is not decomposed per outcome category here.

- **Value** – the moderator's value at that probe point in data units – what **-1 SD**, **Mean** and **+1 SD**, or the percentiles, come to on its scale; a probe outside the observed range carries the dagger (†) in the first column, as under [Moderator level](#b-moderator-level)

#### Model fit (test of directed separation)

**Model fit (test of directed separation).** With the [Test of directed separation (Shipley's C)](#b-test-of-directed-separation-shipleys-c) tick on: every pair of variables the drawn model joins by no edge is a conditional independence the model asserts, each claim is tested by a regression, and the claim p-values are combined into one global fit statistic – see [test of directed separation](./concepts/latent-variables.md#b-test-of-directed-separation). A saturated model – every pair joined by an edge – asserts none, and the section says so instead of showing an empty table.

- **Fisher's C** – the summary's first row: $-2 \sum \ln p$ over the claims, χ² on twice their number when every claim holds
- **df** – twice the number of claims for C; for a claim, the parameters the added term costs {#model-fit-test-of-directed-separation-df}
- **p-value** – C's p-value, read at the [assumption test significance level](./settings.md#assumption-test-significance-level) as the model check it is, with an **Interpretation** verdict when interpretation is on: significant means the data contradict at least one independence the model implies, non-significant that there is no evidence against them; a claim's **p** is its own test's, read at the same level {#model-fit-test-of-directed-separation-p-value #model-fit-test-of-directed-separation-p #model-fit-test-of-directed-separation-interpretation}
- **Independence claim** – the pair, written predictor ⊥ response; the later of the two in the model's order is the response whose equation carries the test
- **Given** – the conditioning set: the parents of both variables in the drawn model
- **Test** and **Statistic** – an exact F where the response's equation is linear, a likelihood-ratio χ² (LR χ²) otherwise, so a multi-level predictor is tested as one term rather than one contrast at a time {#model-fit-test-of-directed-separation-test #model-fit-test-of-directed-separation-statistic}

Two notes may qualify the test: pairs of variables the model does not explain are left out, with their number, since the builder draws directed effects only and the model asserts nothing about how its exogenous variables covary; and a claim that could not be tested – its equation would not fit, or the added variable contributed no estimable term – withholds C rather than shrinking its degrees of freedom.

> **What does a significant C mean?** Not that a coefficient is wrong but that an edge you did not draw belongs in the model – the claim carrying most of the statistic names the pair; it is the one thing separating path analysis from a stack of regressions, and the only global fit test on this tab – see [test of directed separation](./concepts/latent-variables.md#b-test-of-directed-separation).

All standard output options ([additional statistics](#additional-statistics), ANOVA, correlations, collinearity, residual diagnostics, influence, goodness of fit) are available, and so is [Classification (ROC) analysis](#classification-roc-analysis) – for ordinal and multinomial outcomes as well as binomial, with the same per-cutpoint or per-class tables, curves, and cross-validation the Simple tab produces. Model comparison is hidden in advanced mode.

## Missing data

Missing values are handled by the global [missing data setting](./settings.md#missing-data), and a regression equation cannot use a row with a gap in it: every fit runs on the cases complete on the variables that entered it – the dependent variable, predictors, covariates, mediators and moderators alike – whatever the setting says. Under the default pairwise deletion that is the only trimming; under listwise deletion the data panel's whole selection is trimmed first, model variables or not; imputed values enter as data. The card's [model information](#model-information) reports **N** with the number of rows dropped as incomplete beside it – see [complete cases](./concepts/outliers-missing-data.md#b-complete-cases).

> **Twenty predictors, scattered gaps?** A row missing any one of them is dropped, so a wide model can lose a large share of the sample to missingness alone – one more reason to keep the model to the predictors the question needs – see [listwise deletion](./concepts/outliers-missing-data.md#b-listwise-deletion).

## Interpretation thresholds

When [interpretation](./settings.md#significance-formatting) is on, a verdict stands beside every row that has bands to read on, and the row's entry says which and links the concept behind them: [R²](#b-r²) and [Nagelkerke's R²](#b-nagelkerkes-r²) read on Cohen's bands, [McFadden's R²](#b-mcfaddens-r²) on McFadden's own, [adjusted R²](#b-adjusted-r²) on its gap from R², [VIF](#b-vif) on the [VIF thresholds](./settings.md#statistical-thresholds) – the one set you can change – [Cook's D](#b-cooks-d-max) on the two cutoffs its table prints, [Durbin-Watson](#b-durbin-watson-autocorrelation) and [Breusch-Godfrey](#b-breusch-godfrey-autocorrelation) on their p-values with the direction read off the statistic, [variable importance](#b-variable-importance-interpretation) on the excess over the prior inclusion share, and ridge [shrinkage](#b-shrinkage) on the share of the unpenalized estimate retained.

## Reporting checklist

Key things to include when writing up regression results:

**Method:**
- Regression type (linear, logistic, etc.) and estimation method – including **Firth** where it was used, and why (separation, rare events, small sample)
- For the two-part count families: which one (zero-inflated or hurdle), the count distribution, and which predictors entered the zero equation
- Predictors and covariates included, with rationale
- Which **ANOVA type** the per-term table reports, whenever the model contains interactions
- For regularization: method (Ridge/LASSO/Elastic net/Group lasso), lambda selection strategy, alpha value, whether folds were stratified, and – if selection stability was used – the scheme (half samples or complementary pairs), the number of subsamples or pairs, and the threshold π
- For post-selection inference: the number of sample splits, and that lambda was re-tuned inside each one
- Which standard errors the inference columns rest on (model-based, HC3, or Newey-West), and – on a robust basis – that the omnibus is a Wald test rather than the likelihood-ratio one
- For the [robust linear](#robust-linear-regression) family: that the fit is MM-estimated, and that the R² and residual scale are the robust versions and are not comparable with their OLS counterparts
- For [quantile regression](#quantile-regression): the τ grid fitted, the reported quantile every other block was computed at, and that R¹ is a one-quantile measure rather than an R²
- If the standardized coefficients' intervals were bootstrapped: that they are bias-corrected percentile intervals over case resamples that refitted and re-standardized the model, and the number of resamples
- How missing data were handled
- Sample size (total and complete cases if different); for logistic and count models, events per parameter
- For multinomial: which outcome category served as the reference, and why
- For GLM standardized coefficients: which standardization convention was used (predictor-only or latent-variable)
- For model comparison: number of candidate models, selection criterion (AICc)
- For mediation: the estimation method (product-of-coefficients with bias-corrected bootstrap CIs for linear outcomes; causal mediation with quasi-Bayesian CIs for logistic, ordinal, Poisson, and negative binomial outcomes), the number of bootstrap/simulation replications, and – for causal mediation – the treatment contrast the effects are reported for
- For moderation: which **probe points** the simple slopes and conditional effects were read at (mean ±1 SD, or the 16th/50th/84th percentiles)
- For ROC metrics: whether PPV/NPV/accuracy used the sample rates or substituted population class prevalences, and what those were

**Results:**
- Model fit (R² with its confidence interval, adjusted R², and f² for linear; pseudo-R² including the adjusted McFadden form, deviances with their df, and chi-square test for logistic)
- Coefficient table with B, SE, test statistic (t or z), p-value, and confidence intervals
- Beta (standardized) coefficients, naming the convention for GLM families
- Odds ratios for logistic regression, rate ratios (IRR) for count models
- The ANOVA table for models containing multi-level categorical predictors – the per-dummy p-values don't answer whether the variable matters – naming the type and reporting partial η² alongside each test
- For binomial logistic: AUC with confidence interval, Brier score and skill, threshold rule used, and metrics at the optimal threshold (sensitivity, specificity, PPV, NPV, F1) with their intervals and the prevalence they rest on; cross-validated AUC if reported, with k, the number of repetitions, and its **CV confidence interval** – not the Monte-Carlo precision, which is a different quantity – or a note that the estimate is in-sample; the calibration verdicts from both Hosmer-Lemeshow (with the bin count used) and le Cessie-van Houwelingen
- For multinomial logistic: per-class AUCs with their N, Hand-Till M (multiclass AUC) with bootstrap CI, multiclass Brier, confusion matrix and per-class accuracy; note that classification at predict time uses argmax across class probabilities
- For ordinal logistic: per-cutpoint AUCs with their N, Somers' D, Kendall's tau-c, multiclass Brier, and the Brant test of proportional odds; cross-reference per-cutpoint divergence with that test
- Effect size for the overall model
- Diagnostics: collinearity (VIF), residual normality (test *and* Q-Q plot), influential observations – at minimum note whether assumptions were checked. Report autocorrelation only if row order is meaningful
- For mediation: indirect effect (a × b for linear, ACME for non-linear outcomes) with its confidence interval, the direct and total effects, and proportion mediated; for ordinal outcomes report the per-category decomposition; note any resamples that failed
- For moderation: the interaction term, simple slopes at the probe values, and – where reported – the Johnson-Neyman boundaries with the share of observed cases in the significant region
- For model comparison: top model(s), Akaike weights, variable importance; AUC and DeLong p-values for binomial outcomes. State the number of models searched and report the ranking as exploratory
- For regularization: selected lambda, number of non-zero coefficients (average per outcome for multinomial), the cross-validation metric (naming its criterion), for group lasso the group-level selection verdicts, and – if used – selection frequencies with the number of subsamples they rest on, the expected-false-selections bound under complementary pairs, and the unpenalized estimates with their post-selection p-values
- For count models: the dispersion diagnosis (Pearson dispersion, and the overdispersion score test for Poisson), and θ with its SE for negative binomial
- For the two-part count families: observed versus expected zeros against the single-equation counterpart, ΔAIC/ΔBIC, and both coefficient tables with a note on which event each equation's logit models
- For mediation sensitivity: the breakdown ρ and both variance shares, and whether the outcome equation was refitted with a probit link to obtain them
- For path analysis: the system N, the effect decomposition, the fact that equations were estimated one at a time, and – for any causal-mediation path – whether its outcome model differed from the drawn equation; where the model omits edges, Fisher's C with its df and p and the number of independence claims tested

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. Regression analysis uses base R (`lm`, `glm`) for the linear and binomial families, `MASS` for ordinal logistic and negative binomial, `nnet` for multinomial logistic, `robustbase` for the [robust linear](#robust-linear-regression) fit and `quantreg` for the [quantile](#quantile-regression) fit, `pscl` for the zero-inflated and hurdle families, `brglm2` for Firth's fit, `glmnet`, `ordinalNet`, `mpath` or `grpreg` for regularized estimation with `stabs` for the complementary-pairs bound, `car` for collinearity diagnostics and the Type II and III ANOVA tables, `lmtest` for residual diagnostics and the linear RESET test, `sandwich` for the HC3 and Newey-West covariance matrices, `ResourceSelection` for the Hosmer-Lemeshow test, `pROC` for the ROC curves, their AUCs and intervals, DeLong's test and Hand-Till M, and `mediation` for causal mediation and its sensitivity analysis; the Brant test, the Johnson-Neyman region, Somers' D and tau-c, the le Cessie-van Houwelingen statistic, the overdispersion score test, the cross-validated AUC's interval and the test of directed separation are computed in the module's own R code, with no further package. Every bootstrap – the mediation, standardized-coefficient, ROC, model-comparison and path-analysis resamples – runs under [**Bootstrap seed**](./settings.md#bootstrap-seed); every fold deal, half sample and sample split, and the Shapiro-Wilk sub-sample, under [**Reproducibility seed**](./settings.md#reproducibility-seed), and when that seed is empty the ROC cross-validation draws one at random and keeps it as `cv_seed` in the R session, where typing `cv_seed` into the console recovers it for an exact re-run; a seeded step hands the session's random stream back when it finishes, so a run here leaves a later unseeded analysis untouched. The reasoning behind the module's decisions – every estimator, interval, threshold, fallback and refusal, from the checks before a fit to the test of directed separation – is argued in the [method notes](./methods/regression-analysis.md).

**Citations cover methods, not only packages.** Every method the card actually puts on screen is credited at the top of the output section – the regression families and their pseudo-R²s, the diagnostic tests and influence statistics, robust covariance matrices, the sums-of-squares types, the regularization penalties, lambda selection and cross-validation, selection stability and its error bound, post-selection inference, causal mediation and its sensitivity analysis, simple slopes and the Johnson-Neyman region, information criteria, Akaike weights and model averaging, the classification metrics and each AUC interval method, the test of directed separation, alongside the papers for the R packages that computed them. Only what ran in *this* analysis is listed.

## Common pitfalls

**Confusing prediction with explanation.** A model with a high R² predicts well, but that does not make its coefficients causal mechanisms: a predictor can correlate with the outcome because both are driven by something you did not measure, and a regression on observational data estimates associations – see [confounder](./concepts/regression-basics.md#b-confounder). A causal claim needs a design – an experiment, or the stated assumptions of [causal mediation](./concepts/regression-basics.md#b-sequential-ignorability) – rather than a coefficient.

**Too many predictors, too few observations.** With 50 participants and 20 predictors the model fits the sample's noise and will not replicate; the card warns below 10 events per parameter on the logistic and count families, and the rule of thumb of 10–15 observations per predictor is the same caution for a linear model – see [overfitting](./concepts/regression-basics.md#b-overfitting) and [events per parameter](./concepts/regression-basics.md#b-events-per-parameter). [Model comparison](#model-comparison) or a [regularized estimation method](#estimation-method) finds the more parsimonious model.

**Ignoring collinearity.** When predictors are highly correlated, individual coefficients become unreliable – small changes in the data can flip signs or change magnitudes dramatically – while the model's overall fit stays fine, so the prediction can be trusted and the individual effects cannot. Check the [VIF](#b-vif) column and consider dropping or combining the correlated predictors – see [multicollinearity](./concepts/regression-basics.md#b-multicollinearity).

**Treating stepwise selection as confirmatory.** Automated selection – [model comparison](#model-comparison) included – is exploratory: the "best" model is best *for this dataset*, and it should be validated on new data or a hold-out sample before being treated as a confirmed finding. Report it as exploratory and name the number of models searched – see [cross-validation](./concepts/regression-basics.md#b-cross-validation) for what validation buys.

**Interpreting non-significant predictors as "no effect."** A non-significant coefficient means the effect could not be distinguished from zero *given this sample and this model* – it might matter in a larger sample, or its effect might be masked by collinearity with another predictor. Read its confidence interval for the range the data allow, and do not conclude "X has no effect on Y" from one non-significant coefficient – see [statistical significance](./concepts/hypothesis-testing.md#b-statistical-significance).

