---
title: Regression analysis
description: Linear, logistic, ordinal, multinomial, Poisson, negative binomial, zero-inflated and hurdle regression with regularization in DataSuite 2.
---

# Regression analysis

The **Regression analysis** module builds models that predict an outcome from one or more predictors. It supports eight regression types, six estimation methods (a bias-reduced fit for separated data and four regularized ones alongside the classic fit), optional diagnostics, and a model comparison mode that evaluates every possible predictor combination.

> **What is regression?** Correlation tells you two variables are related; regression tells you *how* – it estimates a formula that predicts one variable from others. For example, a linear regression might find that each additional year of education predicts $5,000 more in income, after controlling for age and experience. The model quantifies each predictor's unique contribution.

1. Select a [dependent variable](#variable-selection), [predictors](#variable-selection), and optional [mediators, moderators, or covariates](#mediators-moderators-and-covariates)
2. Choose a [regression type](#regression-type) and [estimation method](#estimation-method)
3. Toggle [additional statistics and diagnostics](#additional-statistics)
4. Click **Run regression** – or use [model comparison](#model-comparison) to find the best predictor combination
5. For multi-equation models, use the [Advanced tab](#path-analysis-advanced-mode) to build a path diagram

## Variable selection

Three variable lists appear on the left:

- **Dependent variable(s)** – the outcome you want to predict. Selecting multiple DVs runs a separate regression for each one. The list filters to show only compatible variable types (e.g. numeric for linear, binary for binomial logistic).
- **Predictors** – independent variables to include in the model. At least one predictor or covariate is required.
- **Covariates** (optional) – control variables that are always included. In [model comparison](#model-comparison), covariates stay fixed while predictors are varied.

A variable selected in one list is hidden from the other two, preventing it from appearing on both sides of the equation.

> **Predictors vs. covariates:** both are independent variables in the model, and mathematically they're treated the same way. The distinction matters in model comparison – predictors are the variables you're testing (which combination works best?), while covariates are variables you always want to control for regardless.

### Mediators, moderators, and covariates

Three optional variable buckets appear as collapsed accordions below the predictors list: **Mediators**, **Moderators**, and **Covariates**. All five buckets (DV, predictors, mediators, moderators, covariates) are mutually exclusive – a variable can only appear in one.

The mediator and moderator buckets are hidden – and any picks in them cleared – when a regularized estimation method is selected, or when the regression type is **multinomial**, **zero-inflated count**, or **hurdle count**. Multinomial is excluded on methodological grounds: causal mediation can't model a nominal outcome, and the product-of-coefficients fallback isn't valid for a response with three or more unordered levels. The two [two-part count families](#regression-type) are excluded because they transmit an effect through two equations at once, so there is no single indirect path to decompose and no single simple slope to probe – the card says so and points at the plain Poisson or negative binomial family instead. **Ordinal** outcomes keep both buckets: mediation runs through causal mediation with a proportional-odds outcome model, and moderation through proportional-odds simple slopes.

> **What are mediators and moderators?** A *mediator* explains *how* an effect works – it's the mechanism. If exercise reduces depression, sleep quality might mediate that effect (exercise → better sleep → less depression). A *moderator* explains *when* or *for whom* an effect is stronger – it changes the strength or direction. Gender might moderate the exercise–depression link if the effect is stronger for one group.

**Mediation** – selecting mediators runs a mediation analysis for every predictor × mediator pair. How the indirect effect is estimated depends on the outcome type.

Mediator models are always fitted with linear regression, so **mediators must be numeric**. A categorical mediator is rejected before the analysis starts rather than being silently fitted on its integer level codes.

**Linear outcomes** use the classic product-of-coefficients approach. When several mediators are selected they are fitted together in one joint outcome model (`Y ~ predictors + M₁ + … + Mₖ + covariates`), so each mediator's b-path controls for the others (parallel multiple mediation). Results include:

- **Path a** (X → M) – the predictor's effect on the mediator
- **Path b** (M → Y) – the mediator's effect on the outcome, controlling for the predictor and any co-mediators
- **Total effect c** – the predictor's overall effect on the outcome
- **Direct effect c'** – the predictor's effect controlling for the mediator(s)
- **Indirect effect a × b** – with a **bias-corrected** bootstrap confidence interval. Significance is assessed by whether the CI excludes zero (no p-value).
- **Proportion mediated** – what share of the total effect goes through the mediator. Reported only when the total effect *c* is itself significant at the configured alpha; otherwise the ratio is unstable (tiny denominators produce wildly fluctuating "proportions") and the cell says so rather than being left blank. When the ratio lands outside (0, 1) – indirect and total effects with opposite signs (inconsistent mediation), or an indirect effect larger than the total – the row stays but a note says the number is not a proportion of the total effect.
- **Total indirect effect** – with several mediators, one extra row per predictor: the sum of that predictor's indirect effects through all of them, resampled as a single quantity so it gets its own bias-corrected interval rather than an interval assembled from the parts. For a linear outcome it equals the total effect minus the direct effect.

Two notes accompany the table. The first states the **assumptions the effects rest on**: they are causal only under sequential ignorability – no unmeasured confounding of the predictor–mediator, predictor–outcome, or mediator–outcome relations once the model's covariates are held fixed – and the mediator–outcome part is untestable from the data and does not follow from randomizing the predictor. For the product of coefficients it adds that the predictor's effect on the outcome is assumed not to vary with the mediator, since no predictor × mediator interaction is fitted. The second says that several mediators are modelled **in parallel**: each indirect effect controls for the others, no mediator → mediator path is estimated, and a serial chain has to be drawn on the [Advanced tab](#path-analysis-advanced-mode).

**Logistic, ordinal, Poisson, and negative binomial outcomes** can't use the product of coefficients – the a-path (a linear effect) and the b-path (on a log-odds or log scale) live on different scales, so multiplying them does not give a meaningful effect. These outcomes route through formal **causal mediation** (the `mediation` package), which simulates the indirect effect on the response scale. Results report:

- **Indirect effect (ACME)** – the average causal mediation effect (the response-scale indirect effect)
- **Direct effect (ADE)** – the average direct effect
- **Total effect** and **proportion mediated**
- Quasi-Bayesian confidence intervals and p-values

For **ordinal** outcomes the decomposition is reported **per outcome category** – the effect on the probability of each category, split into control and treatment conditions – because a single averaged number can't summarize an ordered multi-category response.

Causal mediation states the **contrast** it estimated the effects for, because on a non-linear outcome the answer depends on where the change in the predictor is taken. A numeric predictor is contrasted from its mean − 1 SD to its mean + 1 SD, a binary numeric one between its two observed values, and a categorical one between its first two levels; a note on the card names the two values used.

> **Why not simply "per one unit"?** On a logistic or count model the effect on the response scale is not constant – a one-unit change near the middle of the data moves the predicted probability far more than the same change out in the flat tail. A default 0 → 1 contrast puts both counterfactuals outside the data for any variable that isn't centred (age in years, income, test scores), where the curve is flat and every effect collapses toward zero. Pinning the contrast to the range the data actually covers is what makes the reported ACME readable – and it means the number is "per 2 SD of X", not per unit.

Bootstrap (linear) and simulation (causal-mediation) replications both use the count from the global [settings](./settings.md). When that count is below 1,000, a note under the mediation tables says so: a bias-corrected interval on a product of coefficients is unstable below roughly that many replicates, so the bounds shouldn't be reported without raising **Bootstrap replications** first. The note names the procedure that actually ran – bootstrap resamples, quasi-Bayesian Monte-Carlo draws, or a percentile bootstrap – since the three have different stability floors, and it appears on the [Advanced tab](#path-analysis-advanced-mode) too.

> **Why bias-corrected intervals?** An indirect effect is a *product* of two coefficients, and products of estimates have skewed sampling distributions. A plain percentile interval is anti-conservative for them – it sits off-centre and rejects the null too readily. The bias correction shifts the percentile cut-points by how far the bootstrap distribution's median falls from the estimate computed on the real sample, restoring the interval's coverage. When the correction can't be computed (every resample falls on one side of the observed value), the plain percentile interval is used instead.

Two disclosures accompany these tables. If some resamples failed to fit, a note reports how many of the requested replications the interval actually rests on – a CI resting on 15 draws should not read like one resting on 2,000. And if a mediator's model could not be fitted at all, its row is still shown, labelled **Not computed** with the reason, rather than being dropped from the table (which would read as "no effect").

> **Reading mediation results:** the key question is whether the indirect effect (a × b for linear outcomes, ACME for non-linear ones) is significantly different from zero. If its confidence interval excludes zero, the mediator carries a significant portion of the effect. A large proportion mediated (e.g. 60%) means most of the effect works through the mediator. A significant direct effect (c' / ADE) alongside a significant indirect effect means partial mediation – the predictor affects the outcome both through the mediator and directly.

**Moderation** – selecting moderators adds interaction terms (predictor × moderator) to the main model and runs simple slopes analysis. Results appear alongside the main coefficients table.

- **Numeric moderators** – slopes at three probe points, chosen with the **Moderator probe points** selector (see below)
- **Categorical moderators** – slopes at each level

**Moderator probe points** is a selector in [Additional statistics](#additional-statistics), shown whenever a numeric moderator is selected. It governs both the simple slopes and the conditional indirect effects:

- **Mean and ±1 SD** (default) – the classic choice
- **16th, 50th and 84th percentiles** – three points that always lie inside the observed data

> **Why the percentiles are an option:** mean − 1 SD is a perfectly good probe point on a symmetric moderator, but on a skewed one it can fall below the smallest value anyone in your sample actually has. The slope reported there is then an extrapolation of the fitted line rather than a description of a real subgroup. Percentile probes can't do that – the 16th percentile is by construction a value the data reaches. Use them whenever the moderator is visibly skewed or bounded.

A probe point that lands outside the moderator's observed range is **marked with a dagger (†)** in the simple slopes and conditional indirect effects tables, on both tabs, with a note naming the observed range – so an extrapolated slope can't be read as an observed one.

Each simple slope is read off the same model the coefficient table reports: all predictors, all moderators, and every predictor × moderator interaction, with the focal moderator held at the probe value and any other numeric moderator held at its mean. So a slope is adjusted for the co-predictors, not estimated from a one-predictor side model.

Simple slopes are available for every regression type except **multinomial**. A nominal outcome has one contrast per non-baseline category, so there is no single simple slope to probe; the module says so explicitly and points at the per-outcome coefficient tables instead.

> **Reading moderation results:** a significant interaction term means the predictor's effect depends on the moderator. Simple slopes tell you what the effect looks like at different moderator values. For example, if the age × gender interaction is significant, simple slopes might show that age has a strong effect for women but a weak one for men.

#### Johnson-Neyman region of significance

**Johnson-Neyman region of significance** is an opt-in checkbox in [Additional statistics](#additional-statistics), shown whenever at least one **numeric** moderator is selected – a categorical moderator has no continuum along which a boundary could fall, so the option stays hidden rather than offering an answer it can't produce. Where simple slopes probe the conditional effect at three fixed points, Johnson-Neyman solves for the moderator values at which that effect *crosses* the significance boundary – so instead of "significant at +1 SD", you get "significant above w = 2.4".

> **Why the region matters:** three probe points can be misleading. A predictor may be significant at +1 SD and non-significant at the mean, but the probes don't tell you where in between the effect actually stops being distinguishable from zero – and the answer can land far from any probe. The region of significance gives that boundary directly, so you can say which part of your sample the effect actually holds for.

The output has two parts:

- A table with the **Observed moderator range**, each **Johnson-Neyman boundary**, the **Region of significance**, and **Observed cases in the significant region** – the share of your actual data (not of the plotted grid) that falls where the effect is significant. The region row names the side the boundaries enclose ("significant above the boundary", "significant between the boundaries", and so on), since the boundary values alone don't say which side is which
- A **Conditional effect** plot: the conditional slope across the moderator's observed range with its confidence band, dashed lines at the boundaries, and green shading over the significant region

Boundaries that fall outside the observed moderator range are reported as absent rather than as findings – a crossing out there is an extrapolation of the fitted line, not something the data speaks to. When the effect is significant everywhere in range, or nowhere in it, the table says that instead of listing boundaries.

**Conditional indirect effects** – an opt-in checkbox, visible only when both mediators and moderators are selected. Tests whether the indirect effect (X → M → Y) varies across moderator levels (moderated mediation). Results include:

- Indirect effects at each moderator probe value, with confidence intervals – bootstrap for linear outcomes, quasi-Bayesian for logistic, Poisson, and negative binomial outcomes
- A summary row whose label follows what it actually contains. It reads **Index of moderated mediation** when the conditional indirect effect is linear in the moderator – one moderated edge, or a two-level moderator – so a single number holds across the moderator's range and a CI excluding zero means the mediation is significantly moderated. Otherwise it reads **Change in indirect effect per unit of {moderator}**, with a note saying the quantity itself varies along the moderator: the average change between the outer probes for a response-scale ACME, or the rate of change at the moderator's mean when more than one path is moderated and the effect is quadratic

For linear outcomes, all bootstrap work uses a shared resampling loop: data is resampled once per iteration and all mediator/moderator models are fit from the same resample, keeping computation tractable with multiple predictors, mediators, and moderators. For **ordinal** outcomes, moderated mediation is *not* decomposed per category here – the unconditional per-category table is shown instead, with a pointer to the [Structural equation modeling](./structural-equation-modeling.md) module for rigorous ordered-outcome path models. The checkbox is hidden on the [Advanced tab](#path-analysis-advanced-mode), which reports conditional indirect effects per drawn path instead.

#### Sensitivity to unmeasured confounding

**Sensitivity of the indirect effect to unmeasured confounding** is an opt-in checkbox in [Additional statistics](#additional-statistics), shown for **linear** and **binomial** outcomes when mediators are selected. Every ACME on the card rests on there being no unmeasured confounder of the mediator–outcome relation – an assumption the data cannot check. The sensitivity analysis asks the next best question: *how much* confounding would it take to explain the effect away?

The output is one table per predictor × mediator path, plus a plot:

- **ACME at ρ = 0** – the indirect effect with no confounding, which reproduces the estimate reported above it, so the curve passes through the card's own number rather than beside it
- **ρ at which ACME = 0** – the breakdown point: the correlation between the two equations' errors at which the indirect effect reaches zero. A large |ρ| means the finding is robust; a small one means a modest confounder would suffice
- **Share of residual variance** and **Share of total variance** – the same breakdown point restated as the product of the variance an omitted confounder would have to explain in *both* equations, once as a share of what each equation leaves unexplained and once as a share of each variable's total variance. These are usually the numbers to report, since they are interpretable without knowing what ρ is
- A **conditional-effect plot** with ρ on the x-axis: the indirect effect across ρ, a dashed line at the crossing, and green shading over the range of ρ where the interval still excludes zero

> **Reading ρ:** it is the correlation between the error terms of the mediator equation and the outcome equation – exactly the dependence that sequential ignorability assumes away. ρ = 0 is the assumption holding; ρ = 0.3 means an unmeasured cause of both the mediator and the outcome that leaves their residuals 30% correlated. Published mediation analyses commonly break down somewhere between 0.1 and 0.4, so a breakdown at 0.5 is genuinely reassuring and one at 0.1 is a warning. ρ is searched on a grid, so the breakdown point is reported to that grid's precision, and when the effect survives the whole search the table says so rather than reporting a boundary.

A binomial outcome reaches the analysis through a **probit refit** of its own outcome equation, which is the link the method is defined for. The breakdown ρ and the two variance shares carry over from that refit unchanged – neither depends on the scale of either equation – but the refit's own effect is stated at a different contrast from the one the card reports, so its magnitude and curve are withheld and a note says why. With a probit link the effect under treatment and under control genuinely differ, so those paths get two arms; a linear outcome makes them the same quantity and gets one.

On the [Advanced tab](#path-analysis-advanced-mode) the same analysis runs path by path, each fitted on the models that produced *its* reported effect. A path whose mediator is categorical needs a probit mediator equation where the path was fitted with a logistic one, and that refit costs about a minute per path – so it sits behind a nested checkbox, **Also for paths through a categorical mediator**, and only the breakdown ρ and the variance shares are shown there. Three further shapes are named rather than silently skipped: a binary mediator under a binary outcome (no probit-on-both-sides method exists), the same mediator with the slow option off, and chains running through more than one mediator.

Before anything is fitted, the selection is checked against what R will actually be asked to do. Each variable may hold only one role – a name appearing in two of the five buckets is rejected by name rather than silently collapsing in the formula. Any variable with fewer than two distinct values among the complete cases is rejected too, since a constant column produces either a raw R error or blank coefficients. The count families additionally refuse a negative dependent variable, and warn (without blocking) when it holds non-integer values, where the likelihood is only a quasi-likelihood.

A sample size check blocks the analysis when the number of complete cases is equal to or fewer than the number of model parameters. The parameter count follows the family rather than assuming one equation: `nnet::multinom` estimates (J−1)(p+1) coefficients for a J-level outcome and `MASS::polr` estimates p + (J−1), so a multi-category outcome is charged what it really costs. Each dependent variable in a batch is checked against its own complete-case count. That parameter-count check does not apply to regularized methods – handling more predictors than observations (n ≤ p) is precisely what Ridge, LASSO, and Elastic Net are for – but regularized runs have feasibility guards of their own, since their penalty is chosen by cross-validation: at least 4 complete cases, and for the classification families at least 3 observations in every outcome category. Both are reported as ordinary validation messages rather than as raw R errors.

For **binomial, ordinal, multinomial, Poisson, and negative binomial** models a second, non-blocking check reports the number of **events per model parameter** (EPV) when it falls below about 10. Both the event count and the parameter count are taken over the rows that survive listwise deletion, and the parameter count is family-aware in the same way as the blocking check. The estimate is still computed – the warning simply flags that it may be badly unstable.

When several dependent variables are selected, a failure on one no longer costs you the rest: each is attempted on its own, and the ones that failed are named after the batch finishes.

> **Events per variable:** in a logistic or count model the binding constraint isn't the number of rows, it's the number of *events*. A dataset with 200 rows, 8 positive cases and 4 predictors passes any row-count rule comfortably, yet has just 2 events per parameter – enough to produce large, unstable coefficients with confidence intervals that mean very little. The classic guideline (Peduzzi et al.) is at least 10 events per parameter.

## Model setup

### Regression type

| Type | When to use | Required DV |
|---|---|---|
| **Linear** | Continuous numeric outcome | Numeric |
| **Binomial logistic** | Two-category outcome (yes/no, pass/fail) | Binary |
| **Ordinal logistic** | Ordered categories (e.g. low/medium/high) | Ordinal |
| **Multinomial logistic** | Three or more unordered categories | Categorical or numeric, 3+ distinct values |
| **Poisson** | Count outcomes (0, 1, 2, ...) | Numeric, non-negative |
| **Negative binomial** | Count outcomes with overdispersion | Numeric, non-negative |
| **Zero-inflated count** | Counts with far more zeros than a one-equation count model can produce | Numeric, whole numbers, non-negative, at least one zero |
| **Hurdle count** | Counts where "any at all?" and "how many, once there are any?" are separate processes | Numeric, whole numbers, non-negative, at least one zero |

A numeric outcome is accepted for multinomial because multinomial logistic is the standard fallback when the proportional-odds assumption fails – and that assumption is tested on outcomes coded 1, 2, 3 as often as on labelled ones. The module factors the outcome itself, so the [reference outcome](#reference-outcome-multinomial-only) selector works on numeric levels exactly as it does on text ones.

> **For time-to-event outcomes** (durations with possible censoring – survival, time-to-failure, time-to-relapse), use the [Time to event analysis](./time-to-event-analysis.md) module instead. Treating censored time-to-event data as a numeric outcome in linear or Poisson regression biases the results.

> **For time-ordered numeric outcomes** (sales, sensor readings, traffic – anything where successive observations are autocorrelated), use the [Time series analysis](./time-series-analysis.md) module instead. Linear regression on autocorrelated data produces biased standard errors and over-confident coefficients; ARIMA, ETS, and the forecasting horse-race in the time series module are designed to handle the dependence directly.

> **Linear vs. logistic:** linear regression predicts a continuous number (income, temperature, score). Logistic regression predicts the *probability* of belonging to a category (will the patient recover? which product will the customer buy?). Using linear regression on a binary outcome can produce impossible predictions (probabilities below 0 or above 1) – logistic regression avoids this.

> **Poisson vs. negative binomial:** both model count data, but Poisson assumes the mean equals the variance. Real count data often has more variability than that (overdispersion) – number of doctor visits, accident counts, etc. If your Poisson model shows a dispersion parameter well above 1, switch to negative binomial. If the extra variability is concentrated in the zeros rather than spread across the range, the [two-part families](#two-part-count-models) are the better answer.

### Two-part count models

**Zero-inflated count** and **Hurdle count** fit two equations at once: one for the counts and a logistic one for the zeros. Picking either reveals two extra controls under **Regression type**:

- **Count distribution** – **Poisson** or **Negative binomial (overdispersed)**. This is a second axis, not a second family: either two-part model can put either distribution on the counts, and the zero equation is a logit both ways
- **Zero component predictors** – which terms enter the zero equation, offered from the count model's own predictors and covariates rather than from the whole dataset. Leave the list empty and the zero side is an intercept, i.e. one constant zero probability across the sample

> **Zero-inflated vs. hurdle – they point their logit at opposite events.** A *zero-inflated* model says some cases are "always-zero" – a structural class that never generates a count at all – and the rest follow the count distribution, which can also produce a zero of its own. So its logistic equation models being an always-zero case, and zeros come from two sources. A *hurdle* model says every case has to clear zero first, and once it does, the counts follow a truncated distribution with no zeros left in it. So its logistic equation models *clearing* zero. The same coefficient sign therefore means the opposite thing in the two families, which is why each table carries a note saying what its equation is about. Choose zero-inflated when you believe in a genuinely immune subgroup (non-smokers in a cigarettes-per-day question); choose hurdle when the first unit is a different decision from the rest (visiting a doctor at all, versus how often).

The response must be **non-negative**, **whole-numbered**, and must **actually contain a zero** – a two-part model splits the response at zero, so a response that never takes the value 0 has nothing to split. All three are checked before the run and reported by name rather than as a raw R error.

These two families are narrower than the one-equation count models in what else they support. **Not available:** the ANOVA table (the tests are not well defined on a fit whose coefficients span two equations and whose model matrix spans one), influence statistics, regularized estimation, [model comparison](#model-comparison), mediation and moderation, and [Advanced (path) mode](#path-analysis-advanced-mode). **Still available:** collinearity diagnostics, the Breusch-Godfrey autocorrelation test, the residual scatter (on a third residual scale – Pearson residuals against the expected count, since a two-part fit has neither a deviance residual nor a single linear predictor), and [goodness of fit](#goodness-of-fit), which is where the observed-versus-expected-zeros comparison lives.

### Reference outcome (multinomial only)

A **Reference outcome** selector appears under **Regression type** when the type is multinomial and estimation is classic. It picks which outcome category serves as the baseline that every other category's coefficients are measured against. The default is the first category in sort order.

> **Why it matters:** a multinomial model doesn't estimate one coefficient per predictor – it estimates one *per non-baseline outcome category*, each answering "how does this predictor shift the odds of this category versus the baseline?" Change the baseline and every number in the table changes meaning. Pick the category your research question treats as the comparison point: the control condition, the status quo, the "no diagnosis" group. The model's fit and predictions are identical either way.

The same choice is used by [model comparison](#model-comparison) so that its per-outcome model-averaged tables read against the baseline you picked. The selector is hidden for regularized estimation – those fits treat every outcome symmetrically and have no baseline.

> **What is GLM?** You'll see "GLM types" mentioned in the diagnostics options. GLM stands for Generalized Linear Model – a family that includes binomial logistic, Poisson, and negative binomial regression. Linear regression is technically a special case, but in this module it's listed separately because it has additional output options (Beta coefficients, ANOVA table, correlations) that don't apply to other GLM types. Ordinal and multinomial logistic use different fitting procedures and aren't classified as GLM here.

### Estimation method

| Method | Description |
|---|---|
| **Classic (OLS/MLE)** | Standard estimation – OLS for linear, maximum likelihood for others. Full diagnostics available. |
| **Firth (bias-reduced MLE)** | Penalized likelihood that keeps logistic estimates finite when a predictor separates the outcome. *Binomial only.* Everything else on the card keeps working – it returns an ordinary logistic fit |
| **Ridge (L2)** | Shrinks coefficients toward zero but keeps all predictors. Helps with multicollinearity. |
| **LASSO (L1)** | Can shrink some coefficients exactly to zero, performing automatic variable selection. |
| **Elastic net (L1 + L2)** | A blend of Ridge and LASSO. An **alpha** slider controls the mix (0 = pure Ridge, 1 = pure LASSO, default 0.5). |
| **Group lasso** (categorical levels as a unit) | Like LASSO, but selects or excludes each predictor's dummy columns *together*, so a categorical variable enters or leaves the model as a whole. Available for linear, binomial, and Poisson only. |

> **When to use regularization:** if you have many predictors relative to your sample size, or if predictors are highly correlated, classic regression can produce unstable or overfit models. Regularization constrains the coefficients to reduce overfitting. LASSO is especially useful when you suspect many predictors are irrelevant – it automatically drops them. Ridge is better when most predictors contribute but you want to stabilize the estimates. Elastic Net combines both strategies.

> **Why group lasso?** Plain LASSO penalizes every column of the design matrix independently, and a categorical predictor occupies several of them (one dummy per non-reference level). So LASSO can keep "Blue" while dropping "Green" from the same variable – a real and rather awkward result, since "is colour in the model?" no longer has an answer. Group lasso applies the penalty to each predictor's columns as a block, so the selection verdict is per *variable*. Choose it when your categorical predictors are conceptual units you want kept or dropped whole. With no categorical predictors in the model every group holds a single column, and the fit is equivalent to LASSO.

The **Group lasso** option is hidden for ordinal, multinomial, and negative binomial regression – those three are fitted by packages with no grouped-penalty counterpart – and selecting one of them switches the method back to plain LASSO. **Firth** is shown for binomial logistic only. Both are restored if you switch away and back to a family that offers them.

> **When to reach for Firth:** logistic regression breaks down when some combination of predictors perfectly predicts the outcome (complete or quasi-complete separation) – the maximum-likelihood estimate for the offending coefficient runs off to infinity, and what you get instead is a huge coefficient with an even huger standard error and a p-value near 1. That p-value is not evidence of no effect; it is evidence that the fit failed. Firth's penalty on the likelihood removes the first-order bias and keeps the estimate finite, so a separated model still gives usable numbers. It is not only a rescue: on ordinary data it shrinks coefficients slightly toward zero and is a defensible default for small samples or rare events. The card [warns you](#coefficients) when separation is detected, and names Firth as the remedy.

A Firth fit takes the classic path everywhere else on the card – ANOVA, diagnostics, influence, goodness of fit, ROC, mediation, moderation, the β column, and the model-comparison card all keep working. The one place it shows is the **ANOVA table**, which reports Wald chi-square tests rather than likelihood-ratio ones under Firth: the likelihood-ratio route would refit through a fitter that does not accept the penalty, and the Wald form has the same basis as the coefficients printed beside it. Confidence intervals are Wald intervals on the penalized fit, matching the basis the rest of the GLM output uses.

### Lambda selection (regularized methods only)

Controls how much regularization is applied:

- **1 SE rule (lambda.1se)** (default) – the most regularized lambda whose CV metric is still within one standard error of the best value, giving a simpler model
- **Best CV performance (lambda.min)** – the lambda that optimizes the cross-validation metric. For linear, binomial, multinomial, and group-lasso models this *minimizes* cross-validation error/deviance; for **ordinal** and **negative binomial** models it *maximizes* the cross-validated log-likelihood (see [Cross-validation summary](#cross-validation-summary)). The label is criterion-neutral because the criterion itself differs by type
- **Manual** – enter a custom lambda value. Every method is fitted on a lambda grid, so the value snaps to the nearest grid point and the **λ (selected)** row reports the lambda actually fitted rather than the one requested

> **lambda.min vs. lambda.1se:** lambda.min gives the best predictive accuracy, but the model may be more complex than necessary. lambda.1se sacrifices a tiny bit of accuracy for a simpler model. It is the default here – and glmnet's own convention – because most people reach for a penalty to find out *which* predictors matter, and a rule that keeps a term only when it clearly earns its place answers that question more stably. Switch to lambda.min when prediction accuracy, not parsimony, is what you're optimizing.

**Assumptions:**
- **Linear regression** assumes a linear relationship between predictors and outcome, normally distributed residuals, homoscedasticity (constant error variance), no multicollinearity among predictors, and independent observations. Enable [diagnostics](#diagnostics) to check these.
- **Logistic regression** (binomial, ordinal, multinomial) assumes independent observations, no multicollinearity, and a large enough sample for stable maximum likelihood estimation. No normality requirement – but ordinal logistic additionally assumes proportional odds (the effect of each predictor is the same across all threshold cut-points).
- **Poisson regression** assumes the outcome is a count, events are independent, and the mean equals the variance (equidispersion). When the variance exceeds the mean (overdispersion), use negative binomial instead.
- **Regularized methods** relax the multicollinearity assumption – handling correlated predictors is precisely their purpose. However, they still assume the correct functional form (linear for linear, logistic link for logistic, etc.).
- **All types** assume no omitted variable bias – that all important predictors are in the model. A missing confound can make an included predictor appear significant (or non-significant) when it shouldn't be.

## Additional statistics

These checkboxes control optional output sections. Availability depends on regression type and estimation method:

| Option | Available when |
|---|---|
| **Zero-order correlations** | Linear + Classic only |
| **Part and partial correlations** | Linear + Classic only |
| **ANOVA table** | All Classic methods except the two-part count families |
| **ANOVA type** (I / II / III) | Whenever the ANOVA table is on |
| **Odds ratios with confidence intervals** | Binomial and ordinal + Classic |
| **Relative risk ratios (RRR) with confidence intervals** | Multinomial + Classic |
| **Rate ratios (IRR) with confidence intervals** | Poisson, negative binomial, and the two-part count families + Classic |
| **Standardized coefficients** | Binomial, ordinal, multinomial, Poisson, negative binomial + Classic |
| **Standard errors** (model-based / HC3 / Newey-West) | Linear + Classic |
| **Johnson-Neyman region of significance** | Whenever a numeric moderator is selected |
| **Conditional indirect effects** (moderated mediation) | Whenever both mediators and moderators are selected, on the Simple tab |
| **Sensitivity of the indirect effect to unmeasured confounding** | Linear and binomial outcomes, whenever mediators are selected |
| **Moderator probe points** (mean ±1 SD / percentiles) | Whenever a numeric moderator is selected |

The exponentiated-coefficient checkbox relabels itself to match the family: **Odds ratios** for binomial and ordinal, **Relative risk ratios (RRR)** for multinomial, **Rate ratios (IRR)** for the count types. It is one option, not three – the arithmetic is the same exponentiation, but the quantity it produces has a different name and a different meaning in each family, so the label follows the model.

> **What are odds ratios?** In logistic regression, coefficients are in log-odds – not intuitive. An odds ratio converts them: OR = 2.0 means the odds of the outcome double for each unit increase in the predictor. OR = 0.5 means the odds halve. OR = 1.0 means no effect. Always check the confidence interval – if it includes 1.0, the effect isn't significant.

> **What are rate ratios (IRR)?** The same idea for count models. Poisson and negative binomial coefficients are log-rates, and exponentiating them gives an incidence rate ratio: IRR = 1.4 means the expected count is 40% higher per unit increase in the predictor, IRR = 1.0 means no effect. As with odds ratios, a confidence interval spanning 1.0 means the effect isn't significant.

> **What are relative risk ratios (RRR)?** The multinomial version. Each non-baseline outcome category has its own coefficient vector, and exponentiating one gives the ratio of the *risk* of that category to the risk of the baseline category: RRR = 2.0 means a one-unit increase in the predictor doubles the chance of landing in this category rather than the baseline one. It is not an odds ratio – the comparison is against one specific reference category, not against everything else – which is why the column is labelled separately.

### Standard errors (linear only)

**Linear + Classic** models get a **Standard errors** selector, because the residual diagnostics can flag a violation that the inference columns would otherwise ignore:

- **Model-based (OLS)** (default) – the textbook standard errors, valid when residual variance is constant and observations are independent
- **Heteroscedasticity-consistent (HC3)** – the conventional answer when [Breusch-Pagan](#residual-diagnostics) is significant
- **Heteroscedasticity- and autocorrelation-consistent (Newey-West)** – for when autocorrelation is flagged as well

Only the **SE**, **t**, **p**, and **confidence interval** columns change; the coefficients themselves are identical under all three, because the choice affects how precision is estimated, not what is estimated. A note under the coefficients table names the basis in use, and if the corrected covariance matrix can't be computed the table falls back to OLS and says so. Where a robust SE fails for individual terms only, those rows keep the model-based SE, t, p, and CI, and the note names them.

**The rest of the card follows the same matrix.** The model's F test becomes a joint Wald test of all predictors on the corrected covariance, and the [ANOVA table](#anova-table) reports Wald F tests on it as well – sums of squares are not defined on that basis, so the table drops the SS columns and reports the tests alone. Before, the coefficients rested on a corrected matrix while the F and the ANOVA quietly rested on the OLS one.

The Newey-West note names the two choices the correction makes for you: the **bandwidth** (chosen automatically, reported as a number of lags) and the **AR(1) prewhitening** applied to the residuals first.

> **When to reach for HC3:** heteroscedasticity doesn't bias your coefficients – it biases their standard errors, usually downward, which makes p-values too small and intervals too narrow. HC3 recomputes those from the observed residual pattern instead of assuming a constant variance, so the effect estimates you report stay put while the uncertainty around them becomes honest. It costs a little power when the assumption actually holds, which is why it isn't the default.

> **Newey-West assumes your rows are a time series.** It corrects for correlation between *nearby rows*, and "nearby" means adjacent in the current row order. On genuinely time-ordered data that is exactly right; on a survey or a patient registry the row order is an artifact of how the file was assembled, and the correction is meaningless. The same caveat applies to the autocorrelation tests themselves – see [Residual diagnostics](#residual-diagnostics). For real time-series work, use the [Time series analysis](./time-series-analysis.md) module.

### Standardized coefficients

Linear regression reports a Beta column with no configuration – its standardization has one accepted definition. GLM families don't: there are several published conventions, and they give different numbers with different meanings. So the module makes you pick one, and labels which one produced the column:

- **Not reported** – no β column
- **Predictor only (per 1 SD of X)** (default) – the coefficient times the predictor's SD. The outcome keeps its own scale, so β reads as "the change in log-odds (or log-rate) per 1 SD of the predictor". Comparable *across predictors within this model*, but not against a linear model's β
- **Latent variable (comparable to a linear β)** – additionally divides by the SD of the latent response, `√(Var(η) + π²/3)` under the logit. This makes β comparable to a linear model's β, at the cost of assuming the underlying threshold model. Binomial and **ordinal** only – proportional-odds ordinal regression is a logit threshold model too, which is exactly what this convention is defined for, while the count families have no latent response to rescale against and the option is hidden for them

**Multinomial** models get the predictor-only convention as well, applied within each outcome equation, so a nominal outcome is no longer the one family with no standardized column at all.

The SDs come from the fitted model's design matrix rather than the raw data, so dummy and interaction columns are standardized on the same footing as plain numeric predictors. A note under the table states which convention was used.

Linear regression's own β has a convention worth knowing, and a note under its coefficient table now names it: the column comes from a **refit on standardized data**, where the outcome and the numeric predictors are scaled but a categorical contrast is left as a 0/1 column. So a numeric predictor's β is `b × SD(x) ÷ SD(y)` while a category's is `b ÷ SD(y)` – the two are not on the same footing and should not be ranked against each other.

> **Why is there a choice at all?** Standardizing a linear model is unambiguous: divide by the SD of both sides. A logistic model has no observed outcome SD to divide by – the response is 0/1. Predictor-only standardization sidesteps this by leaving the outcome alone; latent-variable standardization invents the missing SD from the threshold model that logistic regression implies. Both are defensible and both appear in the literature, so the honest thing is to name the one you used. Report the convention alongside the numbers.

### Diagnostics

| Option | Available when |
|---|---|
| **Collinearity diagnostics** (VIF/Tolerance) | All Classic methods |
| **Residual diagnostics** | Linear and GLM types (binomial, Poisson, negative binomial, zero-inflated, hurdle) + Classic |
| **Influence statistics** (Cook's D, leverage, outliers) | Linear and GLM types + Classic, except the two-part count families |
| **Goodness of fit** | All Classic methods |
| **Classification (ROC) analysis** | Binomial, multinomial, ordinal – Classic *and* regularized |
| **Test of directed separation (Shipley's C)** | [Advanced (path) mode](#path-analysis-advanced-mode) only |

Two of these labels rewrite themselves to name the tests that will actually run for the selected regression type, rather than listing everything the module can do:

- **Residual diagnostics** reads "(normality, autocorrelation, heteroscedasticity)" for linear models and "(autocorrelation)" for GLM families, where the other two tests don't apply
- **Goodness of fit** reads "(RESET test)" for linear, "(Hosmer-Lemeshow)" for binomial, "(proportional odds/Brant test, classification accuracy)" for ordinal, "(classification accuracy)" for multinomial, "(deviance, Pearson chi-square)" for the count families, and "(observed vs expected zeros, dispersion)" for the two-part ones

For **binomial** models, ticking **Goodness of fit** also reveals a **Hosmer-Lemeshow bins (g)** input (3–50, default 10) – see [Goodness of fit](#goodness-of-fit) for why the bin count is worth having a say in.

Apart from ROC analysis, diagnostics are not available for regularized methods.

## Reading results – classic regression

Each result appears as an output card titled with the regression type and dependent variable name – with "(Firth)" appended when [Firth estimation](#estimation-method) produced it.

A section that was requested but could not be computed **states its reason** rather than disappearing from the card. The ANOVA table, the Brant test, the influence statistics, a bootstrap interval, a proportion mediated, a conditional effect with no usable probe point – each says what stopped it, so a missing block can't be mistaken for a block that ran and found nothing.

### Model information

A summary block showing the dependent variable, predictor and covariate names, and sample size (N).

### Model fit

**Linear regression:**

- **R²** and **adjusted R²** – proportion of variance explained (see below). R² carries a confidence interval, obtained by inverting the model's own F test (a noncentral-F interval at the configured level)
- **f²** – `R² / (1 − R²)`, the effect size R²'s conventional bands are actually defined on. Cohen's benchmarks (0.02 small, 0.15 medium, 0.35 large) are f² benchmarks, so having the quantity itself on the card saves converting
- **F-statistic**, **df**, **p-value** – tests whether the model as a whole is significant (i.e. whether the predictors collectively do better than just using the mean). Under [HC3 or Newey-West standard errors](#standard-errors-linear-only) this is a joint Wald test on the same corrected covariance matrix as the coefficients, and a note says so
- **Root MSE** – average prediction error in the outcome's original units. Lower is better.
- **AIC** and **BIC** – information criteria for comparing models (see [model comparison](#model-comparison)). Lower is better, but only meaningful when comparing models on the same data.

**Logistic and other GLM types:**

- **McFadden's R²**, **adjusted McFadden's R²**, **Nagelkerke's R²**, **Cox & Snell R²** – different approximations of explained variance (see below). The adjusted form penalizes for the parameter count, the way adjusted R² does for linear models; it appears for every non-linear family and does not depend on the **Goodness of fit** checkbox
- **Null deviance** and its **df** – how poorly the model fits with no predictors (intercept only)
- **Residual deviance** and its **df** – how poorly the model fits with your predictors. The bigger the drop from null to residual, the more your predictors help. Each deviance is shown with its degrees of freedom, since a deviance can't be read as a fit statistic without them
- **Chi-square (likelihood ratio test)**, **df**, **p-value** – tests whether the model as a whole is significant
- **Log-likelihood** – the raw measure of model fit that the pseudo-R² values and information criteria are derived from
- **AIC** and **BIC** – for comparing models (lower is better)

> **R² in regression:** R² tells you what proportion of the outcome's variance is explained by your predictors. R² = 0.45 means the model explains 45% of the variation – the other 55% is due to factors not in the model. Adjusted R² penalizes for adding predictors that don't genuinely improve the model. In social sciences, R² = 0.20 is often considered decent; in physics, you'd expect 0.99.

> **Pseudo-R² for logistic models:** logistic regression doesn't have a true R², so several approximations exist. McFadden's R² above 0.20 already indicates an excellent fit – it doesn't scale like linear R², and its author's own guidance puts 0.2–0.4 at the top of the range, so don't wait for anything like 0.7. Nagelkerke's is rescaled to reach 1.0 theoretically, making it more comparable to linear R². No single pseudo-R² tells the whole story – look at the overall model test (chi-square p-value) and classification accuracy too.

For every iteratively fitted family – **binomial**, **ordinal**, **multinomial**, **Poisson**, and **negative binomial** – a warning appears under the fit table when the fitting algorithm did not converge, including when it was the negative binomial's θ estimation that hit the iteration limit. A non-converged fit produces coefficients, standard errors, and fit statistics that look ordinary but mean nothing. The usual causes are sparse outcome categories and near-collinear predictors; merging categories, rescaling a predictor, or dropping one generally fixes it.

Two-part count models report their **θ** here as well, on its own scale, when the count distribution is negative binomial – once, in the fit block, rather than being mistaken for a rate ratio in the coefficient table.

### Coefficients

A table with one row per term:

- **B** – unstandardized estimate (the raw effect in the outcome's units)
- **SE** – standard error of B (how precisely the coefficient is estimated – smaller SE means more certainty)
- **Beta** – standardized estimate, not shown for the intercept. Always present for linear regression; for binomial, ordinal, Poisson, and negative binomial it appears when [standardized coefficients](#standardized-coefficients) are turned on, with a note naming the convention used. Allows comparing predictors measured on different scales.
- **t** or **z** statistic with significance stars – essentially B divided by SE; larger values mean stronger evidence. The column header names the statistic the p-value actually came from: **t** for linear regression, **z** for the Wald tests used by the GLM, ordinal, and multinomial fits
- **p-value** – probability of seeing this coefficient if the predictor had no real effect
- **Confidence interval** – the range where the true coefficient likely falls
- **OR** / **IRR** and its confidence interval – when the exponentiated-coefficient option is enabled. Available for binomial and ordinal (odds ratios) and for Poisson and negative binomial (rate ratios)

> **B vs. Beta:** B tells you the effect in real units ("each year of education adds $5,000 in income"). Beta tells you the *relative* importance of predictors ("education has a bigger effect than age"). Use B for practical interpretation, Beta for comparing predictors within the same model.

For **binomial** and **ordinal** models a note above the table states which outcome is being modelled – "Modelled outcome: yes, against the reference level no" for binomial, and the categories in ascending order for ordinal, with the direction a positive coefficient pushes in. The direction of every coefficient, odds ratio, and ROC curve on the card depends on that choice, and it is set by a coding rule rather than by anything you picked, so the card says it outright.

A **coefficient forest plot** is drawn beneath the table: one row per term with its estimate and confidence interval, on the family's ratio scale (OR / RRR / IRR, on a log axis) when the exponentiated-coefficient option is on and on the raw coefficient scale otherwise. The reference line marks the no-effect value – 1 on a ratio scale, 0 on a raw one – and the terms whose interval clears it are coloured. Significance is read straight off the drawn interval, so the colour can never disagree with the whisker.

For **linear** models the plot carries a **Coefficient scale** selector – **Standardized (β)** or **Unstandardized (B)** – and opens on β wherever the standardized refit produced intervals. Switching repaints the same plot in place.

> **Why β is the default here:** a forest plot shares one axis across every term, and B is measured in whatever units each predictor happens to use. Put a predictor measured in thousands beside one measured in units and the first sets the axis while every other interval collapses to a point – the plot stops showing anything. β puts all the terms on a comparable scale, which is what makes the picture readable. The β intervals come from a refit on standardized data rather than from rescaling the raw ones, because with interactions in the model the two are not the same thing. Switch back to B when you want the effects in their real units; the table above the plot is always on the B scale.

For **multinomial** models, coefficients are grouped by outcome level, each compared against the [reference outcome](#reference-outcome-multinomial-only). When the exponentiated-coefficient option is enabled, relative risk ratios (RRR) and their CIs are added.

For **ordinal** models, a separate thresholds table shows cut-points between adjacent categories, with the same estimate, SE, z, p-value, and CI columns. Each row is labelled with the pair of categories it separates (`low | medium`), not with the internal coefficient name, so you can tell at a glance which boundary a cut-point describes. The interpretation column describes where each cut-point sits on the latent scale – below the origin, or at/above it.

> **Don't read a cut-point's p-value as a finding.** For a proportional-odds model the zero point of the latent scale is fixed by an identification convention, not by anything in your data. So "this threshold differs significantly from zero" is a statement about that convention, not about the variable – which is why the module describes the cut-point's position instead of issuing a significance verdict. The estimate, SE, CI, and p-value are all still shown; it's the plain-language verdict that would have been misleading.

**Two-part count models** produce two coefficient tables under their own headings – **Count equation coefficients** and **Zero equation coefficients** – since a single table would mix two equations with different meanings. The count side exponentiates to a rate ratio (IRR), the zero side to an odds ratio (OR), and each carries a note saying what its equation is about (see [Two-part count models](#two-part-count-models) for why the sign means opposite things in the two families).

Three things that would otherwise be silent are now named under the table:

- **Separation.** When some cases are predicted perfectly – complete or quasi-complete separation, in a binomial, ordinal, or multinomial model – a warning above the table names the terms whose estimates have diverged. Their coefficients, standard errors, confidence intervals, and p-values are not interpretable, and in particular a large p-value there does *not* mean the predictor is unrelated to the outcome. For binomial models a second line names [Firth estimation](#estimation-method) as the remedy
- **Aliased terms.** A term that is an exact linear combination of the others can't be estimated, and gets no row at all. The note names it and points out that every other coefficient is conditional on that omission. Dropped terms are left out of the correlations table too
- **Uncentered moderators.** When moderators are selected, a note says that each predictor's coefficient is its effect where its moderator is 0 (or at the moderator's reference level) rather than an average over the moderator's range, and points at the simple slopes for values the data actually covers. The same caveat sits on the direct and total effect rows of the [Advanced tab's](#path-analysis-advanced-mode) effect decomposition

When categorical predictors are present, a note lists the reference category for each variable.

> **What are reference categories?** When a predictor is categorical (e.g. "Red", "Blue", "Green"), regression can't use the labels directly – it picks one category as the baseline (reference) and measures the others against it. A coefficient of 3.5 for "Blue" with reference "Red" means Blue scores 3.5 higher than Red, on average. The choice of reference doesn't change the model's predictions, but it changes how you read the coefficient table.

### ANOVA table

A per-term ANOVA, available for every classic regression type except the [two-part count families](#two-part-count-models). An **ANOVA type** selector appears beneath the checkbox:

- **Type I (sequential)** – each term is given only the terms entered *before* it, so the table changes when the input order does and the terms' contributions add up to the model's own
- **Type II (each term given those that do not contain it)** (default) – a main effect is tested ignoring the interactions it appears in
- **Type III (each term given all the others)** – including the interactions it appears in, so a main effect is read where the terms it interacts with are zero. The model is **refitted with sum-to-zero contrasts** for this table, which is what makes a factor's main effect the average over its levels rather than a statement about whichever level happens to be the reference. For a numeric predictor, "zero" is its own zero, which may sit outside the observed range

Type I is offered only where a sequential table exists: not for the ordinal and multinomial families, and not on a [robust covariance](#standard-errors-linear-only), where a sequential split has nothing to partition. Choosing one of those coerces the selection to Type II.

The table's shape depends on the family and on what the coefficients rest on:

- **Linear** – sum of squares, df, mean square, F-statistic, p-value, and **partial η²**, plus a residual row. Partial η² is a term's contribution as a share of what the other terms left unexplained, `SS / (SS + SS_residual)` – the effect size for terms spanning more than one degree of freedom, where a single coefficient's β says nothing
- **Linear with HC3 or Newey-West errors** – Wald F tests on that same corrected covariance matrix. Sums of squares are not defined on that basis, so the table reports the tests alone
- **Binomial, ordinal, multinomial, Poisson, negative binomial** – a likelihood-ratio chi-square, df, and p-value per term, with no residual row
- **Binomial under [Firth estimation](#estimation-method)** – Wald chi-square tests read off the same bias-reduced fit as the coefficients

A note under the table describes the type that actually ran, in those terms, rather than describing Type II unconditionally.

> **Why you want this for categorical predictors:** a four-level categorical predictor occupies three rows in the coefficient table, each testing one level against the reference. None of them answers "does this variable matter at all?" – and you can't get there by eyeballing three p-values. The ANOVA row does exactly that: one omnibus test per predictor, however many dummy columns it spans.

> **Which type should I pick?** With no interactions in the model, all three agree, and the question doesn't arise. With interactions it does, and the literature genuinely splits. **Type II** is the default here and R's `car` package's: it has more power when there is no interaction, but its main-effect tests *ignore* the interaction, which is only interpretable if you're willing to assume the interaction away. **Type III** is what SPSS defaults to and what much of the applied literature reports: it tests each main effect in the presence of the interaction, at the centre of the other terms. **Type I** answers a different question altogether – "what does each term add, in the order I entered them?" – and is the right choice only when that order encodes something real, such as a hierarchical entry plan. The overall model test is the same in every scheme; only the per-term decomposition differs.

### Correlations (linear only)

A table of zero-order, partial, and/or part (semi-partial) correlations for each predictor. A partial or part correlation that doesn't exist – the other predictors explain the focal one completely, so there is no residual variation to correlate – reads **Cannot be estimated** rather than showing a blank or a spurious number. Terms the design dropped as aliased don't appear here either.

> **Zero-order vs. partial vs. part:** zero-order is the simple correlation between predictor and outcome, ignoring all other predictors. Partial correlation removes the influence of other predictors from *both* the predictor and outcome. Part (semi-partial) removes other predictors' influence from only the predictor. Part correlations squared tell you each predictor's unique contribution to R².

### Collinearity diagnostics

VIF and tolerance for each predictor:

- VIF below 5 – no concern
- VIF 5–10 – moderate collinearity
- VIF above 10 – high collinearity (predictors are too correlated; estimates may be unstable)

VIFs are computed on a design **rebuilt from mean-centered numeric predictors**, so interaction terms shed the "non-essential" collinearity they otherwise inherit from sharing their parent variables. Grouped categorical predictors are reported as a single **GVIF** row – the published `GVIF^(1/(2·Df))` adjustment is squared so it is directly comparable to a plain VIF on a numeric predictor.

For non-linear families the VIF is read off the **model's own covariance matrix** rather than off an OLS design matrix, so it describes the collinearity the fit actually faced – the two differ once the model's weights do. Multinomial models, whose coefficients span several equations, are the exception and use the design matrix.

A term with no variance in the fitted design – an empty category, a term fully explained by the others – has no VIF to report, and its row reads **Not assessable** rather than being scored as maximally collinear.

> **What is collinearity?** When predictors are highly correlated with each other, the model struggles to separate their individual effects – standard errors inflate and coefficients become unstable. High VIF doesn't mean the model is wrong, but it means individual predictor effects are hard to trust. Consider removing or combining correlated predictors.

> **Why centering for VIF?** A raw `X*W` interaction column is mechanically correlated with its parents `X` and `W` – that's arithmetic, not a modelling problem. Centering the predictors before forming the interaction removes that artificial correlation, leaving only the *real* collinearity that warrants attention. It matters more than it sounds: an ordinary `y ~ x1*x2` can report a VIF near 160 uncentered and near 1 once the parents are centred. The fitted model's coefficients are unaffected; only the diagnostic uses the centered design.

### Residual diagnostics

- **Shapiro-Wilk test** – normality of residuals (are prediction errors roughly bell-shaped?), accompanied by a **residual Q-Q plot**. The test caps at 5,000 observations, so on a larger model it runs on a random subsample and a note says how many residuals the verdict rests on
- **Durbin-Watson test** (linear) or **Breusch-Godfrey test** (logistic, Poisson, negative binomial) – autocorrelation. Both are judged by their p-value against the configured significance level. When Durbin-Watson is significant, the statistic itself supplies the *direction*: below 2 reads as positive autocorrelation, above 2 as negative. For the GLM families the Breusch-Godfrey statistic is computed on the model's **Pearson residuals**, so it diagnoses the model that was actually fitted rather than a linear approximation of it.
- **Breusch-Pagan test** – heteroscedasticity (whether prediction errors vary in size across the range). If it fires, the [Standard errors](#standard-errors-linear-only) selector is the remedy – it lets the SE, t, p, and CI columns stop assuming what the test just rejected

> **What are residuals?** The difference between what the model predicted and what was actually observed. Good regression models produce residuals that are random – no patterns, roughly normal, and similar in size across the range. These three tests check exactly that. If residuals aren't normal, your p-values may be inaccurate. If there's autocorrelation, your observations aren't independent (common with time-series data). If there's heteroscedasticity, the model predicts some ranges more accurately than others.

**The residual Q-Q plot** plots the ordered **standardized (internally studentized) residuals** against the quantiles you'd expect from a normal distribution, with a reference line and confidence band. Points hugging the line mean normal residuals; systematic curvature at the ends means skew or heavy tails. The y-axis is labelled accordingly, and a caption names the split from the test beside it: Shapiro-Wilk reads the **raw** residuals, the form in which that test is conventionally reported.

> **Why the plot and the test read different residuals.** Raw least-squares residuals don't have equal variances – each one's variance depends on that row's leverage – and they're mildly correlated with each other. The confidence band drawn around the Q-Q line assumes an independent, identically distributed sample, which the studentized residuals approximate far better; this is why R's own `plot.lm` draws its Q-Q panel from `rstandard()`. Shapiro-Wilk stays on the raw residuals because that is what "Shapiro-Wilk on the residuals" means everywhere it's reported. The two now look at slightly different quantities on purpose, and the caption says so rather than leaving you to discover it.

**The residuals-vs-fitted plot** sits beside it, on the raw residuals as `plot.lm`'s own first panel is: residuals on the y-axis, fitted values on the x-axis, a LOWESS smoother through them (named in a caption), and a dashed line at zero – the level a well-specified model scatters evenly about. A flat, featureless band is what you want. A curve says the relationship isn't linear – which is what a significant RESET test is telling you, made actionable, since the plot shows *where* the curvature is. A widening or narrowing wedge is heteroscedasticity, the same thing Breusch-Pagan tests, localized to the part of the range where it happens.

The non-linear families get the scatter their own fit defines:

- **Binomial, Poisson, negative binomial** – **deviance residuals against the linear predictor**, the pair R's GLM diagnostics use, since fitted probabilities or rates aren't the scale the model is additive on
- **Zero-inflated and hurdle** – **Pearson residuals against the expected count**. A two-part fit has neither a deviance residual nor a single linear predictor, so this is the one scale both of its equations reach

Above 5,000 residuals both plots draw a subsample taken in rank order – the same picture at lower resolution, with each point at the position its rank holds in the full sample, so the extremes stay at the extremes – and say so, rather than trying to render one point per row.

When the model reproduces the response almost exactly, what is left is floating-point noise rather than error. The residual tests, the influence statistics, and the plots then report that as the reason instead of issuing verdicts on rounding error.

> **Look at the plot, not just the test.** Shapiro-Wilk is a hypothesis test, and like any hypothesis test its power grows with sample size – on a few thousand rows it will flag deviations far too small to affect anything, and you'll get "residuals may not be normal" on a model that is perfectly fine. The Q-Q plot shows you *how* the residuals depart from normal and by how much, which is the question you actually care about. Trust a clearly bowed Q-Q plot over a borderline p-value in either direction.

Above N = 5,000 the card makes that point for you: a note says that both rejection-based verdicts here – Shapiro-Wilk for normality and Breusch-Pagan for constant variance – reject on deviations far too small to move the coefficients or their intervals, that ordinary least squares is at its most robust in exactly this range, and that both should be judged from the plots rather than from the p-values.

> **Autocorrelation:** means each observation's residual is related to the previous one – a pattern where errors follow trends rather than being random. This typically happens with data collected over time (monthly sales, daily temperatures). *Positive* autocorrelation means errors trend together; *negative* means they alternate.

> **Autocorrelation tests assume meaningful row order.** Both Durbin-Watson and Breusch-Godfrey compare each residual with the *preceding row's* residual. That is a genuine diagnostic only when row order encodes a sequence – time, space, measurement order. On ordinary cross-sectional data (a survey, a patient registry, anything where the rows could be shuffled without loss) the test is reporting the incidental order of your file, and "autocorrelation detected" means nothing about your model. A note on the autocorrelation row says so; heed it before acting on the result. For genuinely time-ordered data, use the [Time series analysis](./time-series-analysis.md) module instead.

### Influence statistics

Six complementary diagnostics, with their conventional thresholds:

- **Cook's D** – maximum value, plus two flag counts, each with a verdict read against the same threshold printed in the table:
	- `Cook's D > 1` – the textbook "highly influential" cutoff
	- `Cook's D > 4/(n − p)` – a size-aware threshold that scales with sample size and parameter count, useful in larger samples where `D > 1` almost never fires
- **Leverage** – maximum hat value and count above `2p/n`
- **|DFFITS|** – maximum absolute value, count above `2·√(p/n)`, and a verdict saying whether the maximum reaches that threshold. DFFITS measures how much each observation's own fitted value would change if that observation were removed
- **COVRATIO** – the observed range, the surrounding band `1 ± 3p/n`, the count outside the band, and a verdict on whether the range reaches outside it. COVRATIO captures how much each observation distorts the precision (covariance matrix) of the coefficient estimates
- **Standardized residuals** – count of `|residual| > 3` (large residuals on the studentized scale)
- **Outlier test** – the largest `|studentized residual|` (or the largest `|jackknife deviance residual|` for a GLM), its **Bonferroni-adjusted p**, and a verdict. This is the formal version of the `> 3` count: the largest residual in a sample of n is expected to be large, so its p-value is corrected for having looked at all n of them, and the verdict distinguishes "more extreme than the fitted model explains" from "no observation is more extreme than the sample size explains"

Every row names the observations it is about: each maximum says which case it was reached on, and each threshold count lists the cases that crossed it (up to ten, then an ellipsis). You can go straight to the rows in question instead of re-deriving them.

On a GLM these measures are **one-step approximations** taken from the fit's IRLS weights, and the outlier test compares approximate jackknife deviance residuals against a normal reference rather than a *t*. A note under the table says so – they remain the right diagnostics, but they are not the exact leave-one-out quantities the linear versions are.

Thresholds are computed from the model's own rank and from the number of observations it was actually fitted on, so a model with aliased terms or dropped rows is judged against its real `p` and `n`.

> **Cook's D vs. leverage vs. DFFITS vs. COVRATIO vs. outliers:** these capture different kinds of problematic observations. An *outlier* has an unusual outcome (large residual). A *high-leverage* point has unusual predictor values (it's far from the center of the data). *Cook's D* combines both – it measures how much the entire model's fitted values would change if you removed that observation. *DFFITS* is similar in spirit but focuses on each observation's own predicted value. *COVRATIO* asks a different question: does this point inflate or deflate the precision of your coefficient estimates? The most dangerous points are flagged by several diagnostics at once – extreme predictors *and* an unusual outcome *and* a noticeable effect on coefficient precision.

> **Two Cook's D thresholds, why?** The classic `D > 1` rule is intuitive and works for small samples, but in larger samples virtually nothing crosses it – every observation looks "safe" even when several are pulling the model around. The size-aware `4/(n − p)` threshold scales with `n` and `p` so it stays informative as the sample grows. Reading both together: zero flags from the size-aware rule is genuinely reassuring; many flags there but none from the `> 1` rule means the dataset has *some* leverage but no single observation is dominant; flags from `> 1` always warrant attention.

> **Should I remove influential observations?** Not automatically. A flagged observation disproportionately affects the model – but it might be a legitimate data point. Investigate *why* it's influential (data entry error? genuine extreme case?) before deciding. Removing it and re-running the model shows how much it matters.

### Goodness of fit

Type-specific tests:

- **Linear** – RESET test (Ramsey's specification error). A significant result suggests non-linear terms may be needed.
- **Binomial** – two calibration tests, Hosmer-Lemeshow and le Cessie-van Houwelingen (see below). Discrimination metrics (AUC, sensitivity, specificity, etc.) live in the dedicated [Classification (ROC) analysis](#classification-roc-analysis) section.
- **Ordinal** – classification accuracy, the no-information rate, a confusion matrix, per-category classification quality, and the **Brant test** of the proportional odds assumption. Per-cutpoint discrimination metrics (AUC, Somers' D, Kendall's tau-c) live in [Classification (ROC) analysis](#classification-roc-analysis).
- **Multinomial** – classification accuracy, the no-information rate, a confusion matrix, per-class classification quality. The likelihood ratio test lives in [Model fit](#model-fit), which is where the omnibus model test belongs, and so does adjusted McFadden's R². Per-class and aggregate discrimination metrics (AUC, Hand-Till M, Brier) live in [Classification (ROC) analysis](#classification-roc-analysis).
- **Poisson / Negative binomial** – deviance and Pearson chi-square tests, each with its **df** row so the statistic can be read against its reference distribution; **Pearson dispersion (χ²/df)** (near 1 is acceptable; below 0.8 = underdispersion; above 1.2 = overdispersion); for Poisson the **Cameron & Trivedi overdispersion score test**; for negative binomial the fitted **θ** and its standard error. When overdispersion is diagnosed, the interpretation now offers zero-inflation beside the negative binomial as a remedy, since excess zeros are a common cause it can't fix
- **Zero-inflated / Hurdle** – the observed-versus-expected-zeros comparison against the **single-equation counterpart** (the same count formula and distribution with the zero equation switched off), plus ΔAIC, ΔBIC, Pearson dispersion, and θ. See below

Both chi-square tests for the count families are referred to a distribution that holds as the **fitted counts** grow, not as the sample does. When a noticeable share of the fitted counts falls below 5, the card reports that share and the minimum fitted count in place of a verdict, since neither p-value can be read as a statement about fit in that regime.

**The two-part goodness-of-fit block** answers the question the family exists for – does modelling the zeros separately actually help?

- **Zeros observed**, **Zeros predicted by this model**, **Zeros predicted without the zero equation**, and the **excess zeros** the single-equation model leaves unexplained
- **ΔAIC** and **ΔBIC** against that single-equation model, with a **Model choice** verdict
- **Pearson dispersion** and **θ**

> **Why there's no p-value here, and no Vuong test.** The obvious comparison – two-part model versus plain count model – has no valid test, and the card says so rather than supplying one. The plain model *is* this model with the zero equation switched off, which puts it on the boundary of the parameter space rather than outside it: a likelihood-ratio test doesn't have its stated null there, and the Vuong test is for genuinely non-nested models, which these aren't. The information criteria rank the two without making a claim they can't support. Read ΔAIC/ΔBIC as evidence, not as significance.

> **On a hurdle model, read the third row.** A hurdle model reproduces the observed zero count *by construction* – its zero equation is fitted on the zero/non-zero split itself – so "zeros observed" and "zeros predicted by this model" agree no matter how good or bad the fit is. The row that carries information is the third one: how far the single-equation model is from the same target. A note on the card makes the same point.

Each test also gets a plain-language interpretation row when [interpretation](./settings.md#significance-formatting) is on – worth having for the calibration tests in particular, where a *non*-significant result is the good one.

> **θ vs. the dispersion ratio.** These are two different numbers and it's easy to read one as the other. **θ** is the negative binomial's own shape parameter – the thing that makes it a different family from Poisson, with smaller θ meaning more extra-Poisson variability. The **Pearson dispersion** is a residual-based diagnostic, and on a well-fitting negative binomial model it should sit near 1 *because* θ has absorbed the excess. Seeing θ = 4.1 beside a dispersion of 1.0 is the healthy picture, not a contradiction.

> **The overdispersion score test** (Cameron & Trivedi, 1990) asks the Poisson-vs-negative-binomial question directly, with a p-value, instead of leaving you to eyeball whether a dispersion ratio of 1.3 is "well above 1". A significant positive result is the conventional cue to switch to negative binomial; a significant negative one means the counts are *less* variable than Poisson assumes, where the p-values are conservative rather than wrong. It needs only the Poisson fit, so it appears for Poisson models only.

#### Calibration tests (binomial)

Both tests ask the same question – do the predicted probabilities match the observed rates? – and they get at it differently, so they are reported side by side with a note saying whether they agree.

- **Hosmer-Lemeshow** sorts cases by predicted risk, cuts them into `g` bins, and compares observed against expected counts in each. The bin count is yours to set (**Hosmer-Lemeshow bins (g)**, 3–50, default 10), because the verdict genuinely depends on it: the same model can pass at g = 10 and fail at g = 8. The table reports the effective bin count alongside the requested one, since R quietly reduces it when the model produces few distinct fitted values.
- **le Cessie-van Houwelingen** works case by case with no binning at all, so it has no equivalent knob and no equivalent arbitrariness. It reports a z statistic, the observed and expected sums of squared residuals, and a p-value.

> **Why two tests?** Hosmer-Lemeshow is the one reviewers ask for by name, and its weakness is well known – group the same cases differently and the verdict can flip. The binning-free alternative doesn't have that failure mode but is less familiar. Reporting both costs nothing and the agreement note tells you which situation you're in: when they agree that's stronger evidence than either alone, and when they disagree the module says what each is sensitive to so you can decide which question you care about.

Both can be **undefined** rather than merely non-significant, and the module says which case it hit instead of surfacing a raw R error:

- A model whose predictors are few and all categorical may produce fewer than three distinct predicted probabilities, which is too few to form bins at any `g`
- A **saturated** model – as many estimated parameters as distinct predicted probabilities – reproduces its own covariate patterns exactly, leaving no residual variation for le Cessie to weigh

#### Confusion matrix and classification quality

For ordinal and multinomial models the classification accuracy figure is backed by a **confusion matrix** – columns are the observed categories, rows the category the model assigned (the one with the highest predicted probability). Every level of the outcome gets a row and a column, including any the model never predicts, so a category the model has quietly given up on is visible rather than missing.

Beside the accuracy figure sits the **no-information rate** – the accuracy you'd get by always predicting the most common category. It is the number your model has to beat before "78% correct" means anything, and the card tests whether it does: an **Accuracy > no-information rate (p)** row carries a one-sided exact binomial test, with a verdict reading either "accuracy beats always predicting the largest category" or "accuracy is no better" than doing so.

A **Classification quality by category** table reports three numbers per observed category:

- **Recall (correctly classified)** – of the cases that truly belong to this category, the share the model recovers
- **Precision** – of the cases the model puts in this category, the share that belong there
- **F1** – the harmonic mean of the two

All of these are **in-sample**: the model is scored on the same cases it was fitted on, so they are optimistically biased in exactly the way the ROC section's caveat describes. A note on the block says so.

> **Why overall accuracy isn't enough:** with an imbalanced outcome, a model can score high on overall accuracy by predicting the common category every time – which is precisely what the no-information rate exposes. The per-category breakdown goes further: recall and precision can point in opposite directions, and a category with 95% recall and 30% precision is one the model over-assigns rather than one it understands. The confusion matrix then shows *what* the misclassified cases were called instead, which usually points at which categories the model can't tell apart.

#### Proportional odds assumption (Brant test)

Ordinal logistic regression assumes **proportional odds**: each predictor's effect is the same at every cut-point between adjacent categories. The Brant test checks it – one row per predictor plus an omnibus row over all of them.

A significant result for a predictor means its effect differs across the cumulative splits, so proportional odds does not hold for that predictor. That doesn't invalidate the whole model – it tells you which term is misbehaving, and the omnibus row tells you whether the model as a whole is affected.

> **What to do about a violation:** the assumption failing for one predictor out of six is common and often tolerable, especially with a large sample where the test is sensitive to small departures. Cross-reference with the per-cutpoint AUCs in [Classification (ROC) analysis](#classification-roc-analysis) – if those look similar across cutpoints, the violation is probably not doing much damage. If it matters, the options are a multinomial model (which drops the assumption entirely, at the cost of many more parameters and losing the outcome's ordering) or collapsing adjacent categories.

### Classification (ROC) analysis

Available for **binomial**, **multinomial**, and **ordinal** logistic regression, under both classic and regularized estimation. Each model variant produces *predicted probabilities* for each observation; ROC analysis evaluates how well those probabilities discriminate between the actual outcomes, across all possible cutoffs at once. The output structure adapts per mode (one curve for binomial, K one-vs-rest curves for multinomial, K−1 per-cutpoint curves for ordinal), but the core question is the same: *how well does this model separate cases that differ in outcome?*

> **Why no fixed 0.5 cutoff?** A 0.5 cutoff is only sensible when the two outcomes are equally common and equally costly to miss – which is rarely true in real data. If 5% of patients have the disease, almost every patient looks "low probability" and a 0.5 rule would call them all healthy. The optimal threshold depends on prevalence and on which mistake you'd rather avoid; ROC analysis chooses it from the data.

#### Configuration

Available in the **Diagnostics** group when the regression type is binomial, multinomial, or ordinal:

- **Classification (ROC) analysis** – master toggle for the section
- **Optimal threshold rule** – how to pick the cutoff:
	- **Youden's J** – maximizes `sensitivity + specificity − 1` (the default; treats both error types as equally costly)
	- **Closest to (0, 1)** – picks the point on the ROC curve closest to the perfect-classifier corner
	- **Cost-weighted** – accepts a **Cost of a missed positive relative to a false alarm** (e.g. 3 = a missed positive is 3× as costly as a false alarm) and reports both directions of the asymmetry so you can compare. The ratio is read as at least 1, since the two reported directions are what covers the other side; at exactly 1 the two coincide and one row is shown. Available for **binomial** and **ordinal** outcomes – on an ordinal model the rule is applied at every cutpoint, with a note that the same cost ratio is assumed at each. Not offered for multinomial, where per-class costs don't reduce to one ratio
- **Classification metrics at optimal threshold** – toggles the metrics table on/off
- **Population class prevalences** – optional, shown when the metrics table is on, for **all three** families. Ticking it reveals one input per outcome level, pre-filled with the observed sample proportions, so leaving them alone reproduces the sample basis exactly. Entries you have not touched rescale so the set sums to 1; the values you typed stay where you put them. Raw class counts are accepted and normalized. A zero share, or one class holding everything, is rejected by name
- **AUC confidence interval** – **DeLong** (analytic, fast) or **bootstrap** (no distributional assumptions). DeLong is hidden for multinomial because the multiclass aggregate AUC (Hand-Till M) requires bootstrap resampling; for ordinal each cutpoint is binary, so DeLong stays available.
- **ROC curve** – toggles the curve plot
- **Cross-validated AUC (out-of-sample)** – adds CV columns to the summary; reveals a **Number of folds (k)** input (default 10, stratified by outcome class) and a **Repetitions** input (default 10). Each repetition deals the folds afresh and the metric is computed once per repetition. Available for regularized fits too: they re-select lambda inside every training fold, which makes this the slowest option on the card

ROC analysis is also available for an **ordinal outcome with two levels** (one cutpoint), and it runs in [Advanced (path) mode](#path-analysis-advanced-mode) for ordinal and multinomial outcomes as well as binomial ones.

> **When to set population prevalences:** sensitivity and specificity don't depend on how common the outcome is, but PPV, NPV, and accuracy do – they answer "given this prediction, how often is it right?", and that depends on the base rate. If your sample's base rates aren't the population's, those three numbers are wrong for any real use. Case-control data is the classic example: sampling 200 cases and 200 controls gives a 50% sample prevalence for a disease that affects 2% of people, and the PPV computed from it will be wildly optimistic. Enter the real prevalences and the module derives PPV, NPV, and accuracy at those rates instead. The AUC is unaffected either way.

**One vector, three derivations.** You set prevalences per outcome *level*, and each family reads what it needs off that one set: a binomial model takes the positive class's share, a multinomial one-vs-rest curve takes its own class's share, and an ordinal cutpoint takes `P(Y > k)` – the sum of the shares above it. So an ordinal or multinomial model no longer has to leave the correction on the table just because it has no single scalar prevalence.

Every table that uses a prevalence says which one it used – a per-family note naming the population or the sample basis – and the threshold tables carry a **Prevalence** column giving the rate each row's PPV, NPV, and accuracy actually rest on. The cost-weighted rule moves with it too: the optimal threshold depends on prevalence as well as on the cost ratio, so a rarer positive class tightens the cutoff.

#### Binomial output

**Summary row** – AUC, AUC confidence interval, Brier score, **Brier skill**, and **N (positive / negative)**. When CV is enabled, further cells appear: CV AUC with a **CV confidence interval**, CV Brier with its **Monte-Carlo precision**, and a footer note recording the k value, the number of completed repetitions, and the number of cases that actually received an out-of-sample prediction.

> **Brier skill** rescales the Brier score against the only baseline that costs nothing to beat – always predicting the base rate. 0 means the model matches that baseline, 1 is perfect, and a negative value means the model's probabilities are worse than the base rate. It is the number to report when you want a calibration figure that stays comparable across datasets with different outcome rates, since a raw Brier score falls automatically as the outcome gets rarer.

A note under every ROC table records where its numbers came from, in up to four sentences: that the non-CV columns are in-sample and therefore optimistic (this stays even when CV is on, because those columns are still resubstitution figures); which method produced the AUC interval (DeLong or bootstrap over cases); that the plotted curve and its legend AUC are in-sample as well; and, when CV is on, the fold count, the number of completed repetitions, and which of the two CV columns each row's uncertainty is reported in.

> **AUC, plain English:** the area under the ROC curve. 0.5 = the model is no better than coin flips; 1.0 = perfect separation. Read it as: pick a random positive case and a random negative case – AUC is the probability the model assigns the positive case a higher probability than the negative one. Conventional reading: 0.7–0.8 is acceptable, 0.8–0.9 is good, ≥ 0.9 is excellent.

> **Brier score:** mean squared error of the predicted probability against the true 0/1 outcome. Lower is better; a perfectly calibrated model has Brier = 0. AUC measures *discrimination* (can the model rank cases correctly?); Brier measures *calibration* (are the probabilities themselves trustworthy?). A model can rank well but be miscalibrated, and vice versa – both matter.

> **In-sample vs cross-validated AUC:** in-sample AUC uses the same data the model was fit on, so it tends to be optimistic – especially with many predictors. CV AUC refits the model on `k − 1` folds and computes the AUC on the held-out fold, rotating until every fold has had a turn; the repetition's estimate is the **mean of those per-fold held-out AUCs**. The whole procedure is repeated with a fresh fold deal each time, and the reported point estimate is the mean across repetitions. Treat CV AUC as the honest estimate; the gap between in-sample and CV AUC tells you how much the model is overfitting.

**Two different intervals sit in the CV block, and the table keeps them in separate columns.**

- **CV confidence interval** – a genuine confidence interval for the cross-validated AUC, built from the influence curve of that estimator (LeDell, Petersen & van der Laan, 2015) and widened by the spread across repetitions. It describes sampling uncertainty: how much the answer would move if you had drawn a different sample of this size. It covers every AUC on the card and every simple average of AUCs – the binomial AUC, the multinomial per-class AUCs and their macro-average, the ordinal per-cutpoint AUCs and their mean
- **Monte-Carlo precision** – what the other rows get: micro-average, Hand-Till M, Somers' D, Kendall's tau-c, and the Brier score. It bounds the estimate's own repetition noise, narrows as you raise **Repetitions**, and is **not** a confidence interval

> **Why the split, and why it matters.** Before, every CV row carried the across-repetition spread, and it was easy to read that as a confidence interval. It isn't one: it is the variation between repetitions of the fold deal on *one fixed dataset*, which shrinks toward zero as you add repetitions and tells you nothing about sampling the data. On a 300-case binomial fit the two are not close – an across-repetition interval of [0.819, 0.828] against an influence-curve interval of [0.776, 0.871] for the same estimate. The rows that keep Monte-Carlo precision keep it for a stated reason: the micro-average and Hand-Till M are functionals the influence curve isn't defined for, and Somers' D, tau-c, and Brier aren't AUCs. Report the CV confidence interval as your interval; read Monte-Carlo precision as "how much does the answer depend on how the folds happened to fall?"

> **Cross-validating a regularized fit** costs more than it looks. Lambda was chosen by cross-validation in the first place, so re-using the full-data lambda inside each fold would leak the held-out rows into the tuning and hand back an optimistic number again. The module instead re-runs the lambda search inside every training fold – honest, and the reason this option carries a warning about being the slowest thing on the card. A manually specified lambda skips the inner search, since it is your constant rather than something learned from the data.

**Classification metrics at the optimal threshold** – when enabled, a small table with:

- **Threshold** – the cutoff value chosen by the selected rule
- **Sensitivity** (true positive rate) – of actual positives, how many the model catches
- **Specificity** (true negative rate) – of actual negatives, how many the model correctly rules out
- **PPV** (positive predictive value) – when the model predicts positive, how often it's right
- **NPV** (negative predictive value) – when the model predicts negative, how often it's right
- **Accuracy** – overall fraction correct
- **F1** – the harmonic mean of PPV and sensitivity, `2 · PPV · sens / (PPV + sens)`
- **Prevalence** – the rate PPV, NPV, and accuracy were computed at, so the basis is visible on the row rather than only in a note

Each of the six metrics carries a **percentile confidence interval**, obtained by re-picking the threshold inside every stratified resample rather than holding the observed one fixed – so the interval prices the threshold choice along with the metric. These remain in-sample figures even when cross-validated AUC is switched on, and the note says so: the operating point and its metrics are still read off the data the model was fitted on.

> **Why F1 alongside accuracy:** accuracy counts every correct call equally, so on imbalanced data it's dominated by the majority class – a model that never predicts the rare outcome can still score 95%. F1 only rewards getting the *positive* class right, balancing "how many of my positive predictions were correct" (PPV) against "how many of the real positives did I find" (sensitivity). When the two diverge, F1 sits between them and punishes a model that wins one by sacrificing the other. Report it whenever the classes are unbalanced.

PPV, NPV, accuracy, and F1 all depend on the prevalence in use – see [Configuration](#configuration) above.

For the cost-weighted rule, two rows appear (one for each direction of the asymmetric cost), with a **Worse to misclassify** column flagging which error type the threshold was chosen to minimize.

**ROC curve** – false-positive rate on the x-axis, true-positive rate on the y-axis. The diagonal is the chance line; curves bowing toward the top-left corner indicate better discrimination. The optimal threshold(s) are marked as small dots on the curve – hover for the exact threshold value, sensitivity, specificity, PPV, and NPV.

#### Multinomial output

A multinomial model produces a *vector* of class probabilities for each observation (one per outcome class). ROC analysis treats each class in turn as the "positive" outcome ("class k vs all others") to get a per-class discrimination measure, then reports several aggregate statistics that summarize the model as a whole.

**Summary table** – one row per outcome class plus three aggregate rows. Columns: AUC, bootstrap CI, **N (positive / negative)**, and (when CV is enabled) CV AUC with either a **CV confidence interval** or a **Monte-Carlo precision**, depending on the row – see [the split above](#binomial-output). The per-class rows and the macro-average get the confidence interval; the micro-average and Hand-Till M get Monte-Carlo precision.

- **Per-class rows** – AUC of the one-vs-rest classifier for each outcome class. Useful for spotting which classes the model discriminates well and which it confuses. The N column matters here: a per-class AUC of 0.95 means something very different resting on 3 positives than on 300. A class that had to be skipped – no positive or no negative cases – is named in a footnote with the reason, and is left out of the curve and the aggregates.
- **Macro-average** – unweighted mean of the per-class AUCs, with its own bootstrap interval drawn from the same resamples as the micro and Hand-Till ones. Treats every class equally regardless of prevalence – handy when rare classes matter as much as common ones. If a class is empty or all-positive in the sample, its AUC is undefined and the row label reads `Macro-average (used X/K classes)` so you can see how many entered the average. When cross-validation is on, the label carries both counts – how many classes entered the in-sample average and how many entered the cross-validated one – since a class can survive the full fit and still be lost in a fold.
- **Micro-average** – pools all per-class predictions and labels into one big binary ROC. Weighted by class prevalence, so dominated by the largest classes.
- **Hand-Till M (multiclass AUC)** – the principled multiclass generalization of AUC, computed as the average pairwise AUC. Insensitive to class imbalance. Treat this as the "headline" multiclass AUC for reporting.

> **Macro vs micro vs Hand-Till – which to report?** For balanced classes they tend to agree. For imbalanced data they can diverge: micro reflects bulk performance (good for production deployment), macro asks "how well do you do on the hardest class?", and Hand-Till M is the closest analogue to the binomial AUC concept. Reporting Hand-Till M is the safest single number; including macro alongside it adds the imbalance perspective for free.

**Multiclass Brier score** – `mean(rowSums((P − one_hot_Y)²))`, reported with its **skill** against the base-rate predictor. Calibration measure across all classes. Lower Brier is better; a perfectly calibrated model has Brier = 0, and skill runs from 1 (perfect) through 0 (no better than the base rates) to negative (worse). Same calibration-vs-discrimination contrast as in the binomial case. When cross-validation is on, the cross-validated Brier and its Monte-Carlo precision are reported alongside.

> **Argmax vs ROC – important caveat.** Per-class AUC measures *discrimination quality* – how well-ranked are class-k members against the rest? Actual classification at predict time uses **argmax** across class probabilities (the class with the highest probability wins), not per-class thresholding. So the [Goodness of fit](#goodness-of-fit) confusion matrix shows real classifier behavior; this section shows how separable each class is from the others, which is a related but distinct question.

**Per-class threshold metrics** – when enabled, one row per class with the optimal threshold and the same sens/spec/PPV/NPV/accuracy/F1 columns as the binomial table, plus a leading **Class** column and a **Prevalence** column. The threshold rule applies per class. These use each class's own sample rate unless you set [population class prevalences](#configuration), in which case each row takes its own class's share.

**ROC curve plot** – K colored curves overlaid on a single chart, one per class. Each curve gets its own AUC in the legend; threshold markers are colored to match.

#### Ordinal output

An ordinal model gives cumulative probabilities `P(Y ≤ k | x)` for each cutpoint between adjacent ordered categories. ROC analysis evaluates the model at each of the K−1 cutpoints in turn, treating "Y > level_k vs Y ≤ level_k" as a binary problem. This respects the ordering – unlike multinomial OvR, which would discard it.

**Summary table** – one row per cutpoint (labeled `{outcome} > {level}`) plus three rank-concordance summary rows. Columns: AUC / value, CI, **N (positive / negative)**, and (when CV is enabled) CV AUC with either a **CV confidence interval** or a **Monte-Carlo precision** – see [the split above](#binomial-output). The per-cutpoint rows and the mean cutpoint AUC get the confidence interval; Somers' D, Kendall's tau-c, and the Brier get Monte-Carlo precision, since they are not AUCs. A note under the table reminds you that the two groups of rows run on different scales: the cutpoint and mean AUCs from 0.5 (chance) to 1, Somers' D and tau-c from −1 to 1 with 0 for no association.

- **Per-cutpoint rows** – binary AUC at each cumulative threshold. Each is a proper binary ROC, so DeLong CIs apply per cutpoint. As with multinomial, the N column tells you how much data stands behind each cutpoint, and a cutpoint that had to be skipped – every case on one side of it – is footnoted with the reason.
- **Mean cutpoint AUC** – unweighted mean of the per-cutpoint AUCs, with a row-bootstrap CI that resamples observations and recomputes the K−1 cutpoint AUCs together each replicate, so the CI properly reflects the correlation between cutpoints (they share rows). This row is always bootstrap even when DeLong is selected for the per-cutpoint rows, and the note under the table says so.
- **Somers' D** – rank-based concordance between the model's ranking score and the ordered outcome, in the D<sub>xy</sub> convention: concordant minus discordant pairs, divided by the pairs that are *not tied on the outcome*. Range [−1, 1]; this is the form satisfying `D = 2·AUC − 1`, so it reads on the same scale as the cutpoint AUCs above it. Its interval comes from the same row-resampling as the mean cutpoint AUC.
- **Kendall's tau-c** – rank correlation that accounts for ties on the ordinal outcome. Range [−1, 1]; less sensitive to scale differences between predicted score and category count than tau-b. Bootstrap interval, as above.

The ranking score both concordance measures use is derived from the model's predicted category probabilities rather than from a package-specific latent predictor, so the classic and regularized ordinal fits report on the same scale and in the same direction.

> **Why both Somers' D and tau-c?** They answer slightly different questions about the same predictor-outcome ordering. Somers' D treats the predicted score as a continuous classifier of the ordinal outcome – closest in spirit to AUC. Kendall's tau-c is symmetric and adjusted for the discrete nature of the outcome categories. For most ordinal regression reports, either is acceptable; reporting both adds robustness with little extra space.

**Multiclass Brier score** – same formula as multinomial: `mean(rowSums((P − one_hot_Y)²))`. Calibration across the full K-class probability matrix.

> **Argmax vs cumulative cutpoints – important caveat.** Per-cutpoint AUC measures discrimination at each ordering threshold. Actual classification at predict time uses argmax across class probabilities, not per-cutpoint thresholding – so the [Goodness of fit](#goodness-of-fit) confusion matrix shows real classifier behavior; this section shows how cleanly the model separates outcomes at each ordering boundary.

> **Diagnostic value of per-cutpoint divergence.** When the proportional-odds assumption holds, the per-cutpoint AUCs and threshold metrics tend to look similar. When it's violated, they diverge – that divergence is itself useful diagnostic information. If the AUC at "Y > Disagree" is 0.85 but at "Y > Agree" is 0.62, the model isn't discriminating equally well across cutpoints, which can signal misspecification. Cross-reference with the proportional-odds test in [Goodness of fit](#goodness-of-fit).

**Per-cutpoint threshold metrics** – when enabled, one row per cutpoint with the optimal threshold and sens/spec/PPV/NPV/accuracy/F1 columns, plus a leading **Cutpoint** column and a **Prevalence** column. These use each cutpoint's own sample rate unless you set [population class prevalences](#configuration), in which case each row takes `P(Y > level)` summed from the shares above it. The [cost-weighted rule](#configuration) is available here too, applied at every cutpoint under the same cost ratio, with both directions of the asymmetry shown per row.

**ROC curve plot** – K−1 colored curves overlaid on a single chart, one per cutpoint. Each curve gets its own AUC in the legend.

## Reading results – regularized regression

The output card title includes both the method (Ridge, LASSO, Elastic Net, or Group lasso) and the regression type.

### Regularization parameters

A table showing alpha, selected lambda, lambda.min, lambda.1se, and the cross-validation metric with SE – CV error for linear, binomial, multinomial, and group-lasso models; CV log-likelihood (higher is better) for ordinal and negative binomial models. For group lasso the alpha row reads **α (group lasso) – pure group penalty**, since the method has no Ridge/LASSO mixing parameter to report. Lambda values are shown to four significant figures rather than at the global precision setting, so a small lambda reads as `0.0004217` instead of `< 0.001` and can be typed back into the Manual field.

The λ.1se row's note follows the family's criterion: "largest λ within 1 SE of the minimum" where the metric is an error, "of the maximum" where it is a log-likelihood. The cross-validation metric row names the criterion it is on – mean-squared error, or binomial / multinomial / Poisson deviance, or out-of-sample log-likelihood – rather than leaving "CV error" to stand for all of them.

With **Manual** lambda selection the table adds a **λ (requested)** row beside the fitted one, flagged when the two differ: "snapped to the nearest point on the fitted path", "snapped to an end of the fitted path", or "outside the fitted path – the nearest end of it was fitted instead". The selected λ also picks up an "at an end of the fitted path, not an interior optimum" note when it lands on a boundary, which is worth knowing before reading it as a chosen value.

### Regularized model fit

Deviance ratio (pseudo-R²) or R² for linear, McFadden's R² for logistic, and null deviance where available. All five regression types report a fit statistic, as a single row – the deviance ratio and McFadden's R² are the same quantity for these fits, so only one of them is shown, labelled for the family.

For **ordinal** models the coefficients are reported on `MASS::polr`'s sign convention, the same one the classic ordinal card uses, so a positive coefficient raises the odds of a higher category in both. The card carries the same reading note as the classic one.

### Group selection (group lasso only)

The table that grouped penalization makes possible: one row per *predictor*, not per model term.

- **Predictor** – the variable name
- **Model terms** – how many design-matrix columns it occupies (1 for a numeric predictor, k − 1 for a k-level categorical)
- **Standardized norm** – the L2 norm of the group's SD-scaled coefficients, i.e. how large the variable's combined effect is on the scale the penalty actually works on. Scaling matters: without it a predictor measured in milliseconds would outrank one measured in seconds purely through its units
- **Status** – "Selected", "Excluded (shrunk to 0)", or "Always included" for a covariate the penalty never had a chance to drop
- **Selection frequency** – when [selection stability](#selection-stability) is on

A **Predictor groups selected** count appears in the model information block alongside the term-level count.

> **Reading the group table:** with group lasso the selection question has a clean answer per variable, which the term-level coefficient table below can only show implicitly. Use the standardized norm to rank the selected variables by how much they contribute – it's the closest thing to an effect size the method offers, since regularized coefficients have no standard errors. When the model has no categorical predictors every group holds one column, and a note says so: the table is then just a re-presentation of the coefficients.

### Regularized coefficients

Regularized coefficients do not have standard errors or p-values – the regularization penalty makes traditional inference invalid.

> **Why no p-values?** P-values and confidence intervals assume coefficients are estimated freely. Regularization deliberately constrains them, which violates the math behind traditional inference. Instead of asking "is this predictor significant?", regularized regression answers "is this predictor useful enough to survive the penalty?" – for LASSO, a non-zero coefficient *is* the answer.

- **Ridge** – shows each term's estimate and a **Shrinkage** column indicating how much of the unpenalized estimate is retained (color-coded: green ≥ 90%, yellow ≥ 50%, red < 50%). A coefficient whose sign flipped relative to the unpenalized fit – which ridge can genuinely produce under collinearity – is labelled **Sign reversed** rather than being folded into a percentage
- **LASSO / Elastic Net / Group lasso** – shows each term's estimate and a **Status** column: "Selected", "Excluded (shrunk to 0)", or "Always included" for a covariate. Excluded terms are dimmed.

The intercept is exempt from both columns and renders as "–": no backend penalizes it, so it was never at risk of being shrunk out and a percentage or a verdict would be misleading.

**Covariates carry no penalty.** They are forced into the model at every lambda across all four backends, so a control variable you declared as always-included really is – it cannot be selected away, and a note under the table says so. Put a variable in **Predictors** instead if you want the penalty to judge it.

A second note records that all four backends **standardize predictors internally** before fitting, so the penalty falls equally on every variable regardless of its units, and that the coefficients shown are returned on the original scale and read like unpenalized ones.

The shrinkage baseline is an explicit unpenalized fit of the same model. When there are as many parameters as complete cases or more no such fit is identified, so the Shrinkage column is left empty and the note says why rather than comparing against a meaningless number – which is precisely the regime ridge gets chosen for.

Multinomial models group coefficients by outcome level, and report **Non-zero coefficients (average per outcome)** – LASSO genuinely selects a different predictor set for each outcome equation, so a single count would be a fiction. Ordinal models show thresholds separately.

A note under the table explains how categorical predictors were penalized, since this is where the methods differ most visibly:

- **Ridge, LASSO, Elastic Net** – each dummy level is penalized independently, so one level of a variable can be selected while another is excluded
- **Group lasso** – levels are penalized as a group and selected or excluded together

The note only appears when the model actually contains a categorical predictor.

### Post-selection inference

**Post-selection inference (multi-sample splitting)** is an opt-in checkbox beside the lambda controls, off by default. It is the one route to a p-value a penalized fit has, and it adds two columns to the coefficient table:

- **Unpenalized estimate** – one unpenalized refit of the terms the reported fit selected, on the whole sample. This is the relaxed lasso's zero-shrinkage limit: the magnitude the selected model implies once the penalty stops pulling it toward zero
- **p** – a p-value that controls the family-wise error rate over the whole term set

**Sample splits (B)** (default 50, range 20–200) sets how many splits the procedure draws.

> **How it works, and why it needs splitting.** The obvious thing – refit the selected terms and read their p-values – is invalid, because those terms were chosen using the same rows the p-value is computed on. Multi-sample splitting breaks that: each split re-selects the terms on one half of the sample and refits them unpenalized on the *other* half, so the half the p-value is read off never saw the selection. Within a split, the p-values are Bonferroni-corrected by the selected model's size; across the B splits they are aggregated by a quantile rule (Meinshausen, Meier & Bühlmann, 2009). A term selected in only a few splits therefore reads close to 1, which is the procedure working as designed rather than a bug.

Lambda is **re-tuned inside every selection half**, by whichever rule you picked, on that half's own cross-validation – reading it off the full sample would carry the inference half into the selection and void the split. That is why the option is slow: every split is a fresh lambda search plus two fits.

A note under the table records the arithmetic: how many splits ran, the size of each half, and – when some splits could not be fitted – how many contributed no evidence rather than being dropped, which makes every p-value conservative by that much. A split whose selected model is too large for the other half to fit is redrawn up to 20 times before that happens. If no split survives at all, the columns decline and say so.

The option is **not offered for Ridge** (which selects nothing) or for **multinomial** models: glmnet fits every outcome equation symmetrically with no baseline category, while the only unpenalized nominal fitter available is baseline-category, so the refit's coefficient would not be about the coefficient printed beside it.

> **The p-value is valid; the estimate is a magnitude.** The unpenalized estimate column has no standard errors or p-values of its own, deliberately – they would be computed on the sample that chose the terms, which is exactly the error the split exists to avoid. Read the estimate for size and the **p** column for evidence. There is no confidence interval: an interval would have to be inverted from the aggregated p-value over a grid of null values, and it would not bracket the refit estimate sitting next to it.

### Selection stability

**Selection stability (subsampling)** is an opt-in checkbox beside the lambda controls, off by default, shown for every penalized method that can actually drop a term (so: not Ridge, and not an Elastic Net typed down to α = 0). It adds a **Selection frequency** column to the coefficient table – and to the group table for group lasso, where the penalty decides per variable.

- **Subsampling** – **Half samples** (default) or **Complementary pairs (error control)**
- **Resamples (B)** – how many subsamples or pairs to draw (default 50, range 10–500)
- **Threshold (π)** – shown for complementary pairs only (default 0.75, range 0.55–0.99): the selection frequency at or above which a term counts as selected by the procedure

**Half samples** is Meinshausen & Bühlmann's (2010) subsampling: the model is refitted on B random halves of the sample **at the lambda the full fit selected**, and the column reports the share of those refits in which the term came back with a non-zero coefficient. For the classification families the draw is stratified by outcome category, so a half-sample can't lose a class and abort the refit.

**Complementary pairs** is Shah & Samworth's (2013) refinement, and it buys something the raw frequency cannot give: a bound on how many of the selected terms can be expected to be noise. Each of the B draws splits the data into two complementary halves and refits **both**, so the run costs 2B fits rather than B. A term counts as selected in a half if it has a non-zero coefficient anywhere on the λ path down to the selected λ – not only at that one λ – because that is the selection procedure the bound is stated for. A pair is kept only whole: if either half fails to fit, the pair is dropped and the shortfall is counted.

That scheme adds a block above the coefficient table:

- **Complementary pairs** – the number of refits and the size of each half
- **Candidate terms** – how many terms the penalty could actually drop
- **Selected per half sample (average)** – the expected size of the selected set, which is what prices the bound
- **Threshold (π)** – the value you set, with how many terms reach it
- **Expected false selections** – the assumption-free bound (Shah & Samworth's Theorem 1)
- **Expected false selections (r-concave)** – the sharper bound available under a shape assumption on the selection probabilities

Every condition that would withdraw a bound is named rather than left blank: a threshold at or below the share an average subsample already selects (with the minimum π that would work), a saturated selection where every candidate is chosen, a package that could not be loaded, and – separately, since it costs only the sharper row – the r-concave bound's own limit at that threshold and set size.

**The candidate unit follows the penalty**: a group under group lasso (with forced-in covariate groups excluded), one outcome equation's term under multinomial, and a design column otherwise.

Rows the penalty could never drop – the intercept, an ordinal threshold, a forced-in covariate – show "–" rather than a misleading 100%. If some resamples or pairs failed to fit, a note says how many were left out of the share.

> **Which scheme should I use?** Half samples answer "would this predictor still have survived on a different half of my data?" and cost B fits. Complementary pairs answer that *and* "how many of the terms above the threshold should I expect to be noise?", for twice the fits. The error bound is what turns selection stability from a description into a procedure with a stated guarantee, so reach for pairs when you intend to report a selected set as a finding; the raw frequency is enough when you only want to know how reproducible the selection is.

> **What the column does and doesn't tell you.** A penalized coefficient has no standard error, no p-value, and no confidence interval, and selection frequency is not a substitute for any of them. It answers a narrower question: if I had drawn a different half of this sample, would this predictor still have survived? A term at 100% is one the data selects robustly; a term at 55% is one that survives on the strength of the particular rows you happen to have. That is genuinely useful next to a coefficient table with no inference at all – it is just not significance, and reporting it as though it were would be a mistake.

> **Why a fixed lambda?** Under **Half samples**, refitting the whole cross-validated lambda search on every subsample would cost B times a full search and would blend two different sources of variation – which predictors survive, and where the tuning lands. Holding lambda at the selected value isolates the first, which is the question the column is asked to answer. **Complementary pairs** don't fix a single λ but they don't re-tune either: they read the selection over the λ *region* down to the selected value, which is the form the error bound is proved for.

Selection stability adds B (or 2B) partial model fits to a path that already dominates the module's runtime, which is why it is off by default. It reports progress per resample or pair and honours the Cancel button, which takes effect at a fit boundary.

### Regularization path

Two plots showing how the fit changes across the penalty grid:

- **Cross-validation curve** – the cross-validated score against `log(λ)`, with a shaded ±1 standard error band and markers at λ.min, λ.1se, and the selected λ. Drawn for every family.
- **Coefficient trace** – one line per model term across the grid, on each variable's original scale. For the selecting penalties, the λ at which a line leaves zero is the point that term entered the model; on a **Ridge** card the note says instead that the penalty shrinks every term without ever setting one to zero, so no term enters or leaves. Drawn for every family except multinomial, which has a separate coefficient matrix per outcome level and so no single trace to show.

> **What to look for:** a *flat* stretch of the CV curve around the selected λ means the choice isn't critical – a range of penalties fits about as well, and small differences between lambda.min and lambda.1se don't matter much. A *steep* one means the opposite, and is worth knowing before you report a coefficient set as "the" selected model. On the trace, a term whose line leaves zero early and stays well away from it survives across a wide range of penalties; one that appears only at the very end of the grid is a marginal selection.

### Cross-validation summary

Shows the number of lambda values tested, the lambda range, the best cross-validation metric with SE (lowest CV error, or highest CV log-likelihood for ordinal and negative binomial), and the number of **non-zero coefficients** at the selected lambda – which is what the underlying fitters report, and what the label now says. **Effective number of parameters** is kept for group lasso, where it genuinely is one. Multinomial models report **Non-zero terms (any outcome)**, since a term can be selected in one outcome equation and dropped in another. The row is omitted for **Ridge**, where the count is just the raw predictor count at every lambda.

The **Lambda range** row is the interval a Manual lambda has to fall in to be fitted rather than snapped – worth reading before typing one.

> **What is cross-validation?** The data is split into up to 10 parts (folds – fewer when the sample is small, with a floor of 3 or 4 depending on the method). The model is trained on all but one fold and tested on the held-out fold, then rotated so each fold gets a turn as the test set. Averaging across folds gives the CV metric – prediction error for most models, log-likelihood for ordinal and negative binomial – which estimates how well the model will perform on new, unseen data rather than just fitting the data it was trained on.

For the classification families (binomial, ordinal, multinomial) the folds are **stratified** by outcome category, so every training set contains every category in roughly the sample's proportions. Without stratification a rare category can land entirely in one fold, leaving a training set that has never seen it – which fails outright rather than degrading gracefully. The fold count falls as far as **3** when the rarest category is small, so an outcome category with three observations still spreads across three folds instead of blocking the run.

The cross-validation standard error is divided by the number of folds that actually produced an estimate, so the 1 SE rule reads an undistorted band when a fold drops out.

## Model comparison

Model comparison performs an all-subsets search: every combination of predictors is fitted as a separate model, while covariates remain fixed. Only available with classic estimation, and not for the [two-part count families](#two-part-count-models) – an all-subsets search there would have to enumerate the count and zero equations together. The card reports how many rows were dropped as incomplete, as the path analysis card does.

> **When to use model comparison:** when you have several candidate predictors and want to know which combination best explains the outcome without overfitting. It's exploratory – use it to generate hypotheses, not to confirm them. With many predictors, the number of models grows exponentially.

### Settings

- **Maximum models to display** – limits the ranking table (default 25; set to 0 for all)
- **Minimum predictors** – fewest predictors per model (default 0, which includes the baseline model with no dredged predictors)
- **Maximum predictors** – most predictors per model (leave empty for no limit)

All three are validated before the run: negative values are rejected, and so is a minimum above the maximum or above the number of selected predictors – any of which would otherwise define an empty search window and produce a comparison over zero models. The run is also refused when the *smallest* candidate – intercept, covariates, moderator main effects, plus the minimum number of predictors – already has more parameters than there are complete cases, since no candidate in the window could be fitted. Guarding on the smallest rather than the largest is deliberate: the full model may legitimately be over-parameterized while smaller ones are informative, and those report their own per-model failures.

For binomial, ordinal, multinomial, and count outcomes the [events-per-parameter warning](#mediators-moderators-and-covariates) fires here as well, on the same terms as a single regression.

A maximum of 15 predictors is allowed (2¹⁵ = 32,768 models). A confirmation dialog appears at three tiers:

- More than **100** models – a plain "this will compare *N* models" prompt
- More than **1,000** models – adds "expect a noticeable wait"
- More than **100,000** models – adds "likely many minutes to hours"

The count in the dialog is the number of models the run will actually fit – it respects the minimum/maximum predictor window, so restricting a 20-predictor search to at most 2 predictors warns about 211 models, not about a million. When moderators are selected, the dialog also notes that interactions inflate the count (`2^nModerators` interaction states per included predictor). There is no hard ceiling beyond the 15-predictor cap – you can always interrupt mid-run from the progress overlay.

### Output options

- **Model-averaged coefficients** (on by default) – coefficients averaged across all models, weighted by Akaike weights
- **Extended model statistics** – adds BIC, BIC weights, and log-likelihood columns. Can be toggled after results are displayed without re-running.

### Model rankings

A sortable table with one row per candidate model:

- **Rank** (by AICc – the small-sample-corrected AIC; ranking, deltas, and Akaike weights all derive from it)
- **Predictors** – variables in the model. The cell doubles as a control: click it to apply that model's predictor set to the selection list, so you can move from a ranking straight into fitting that model. When the row carries only *some* of the possible predictor × moderator interactions, a warning replaces the usual confirmation: the standard-mode fit adds every interaction, so the model you refit isn't the one you clicked. The baseline row has no predictors to apply, so its cell stays a plain label reading **Intercept only** when there are no covariates or moderators, and **No additional predictors** when there are – in that case the model still contains those fixed terms, so "intercept only" would be wrong
- **K** – number of parameters
- **R² / Adjusted R²** (linear) or **McFadden R² / Nagelkerke R²** (other types)
- **AUC**, **AUC CI**, **p (vs best)** – *binomial only.* AUC measures each model's discrimination, with the interval built by the [AUC confidence interval](#configuration) method you picked for the ROC section; the p-value tests, via DeLong's paired test, whether each model's AUC differs significantly from the top-ranked model's. The top model itself shows "–" for the p-value. The raw p-values are corrected for multiplicity across the M−1 vs-best comparisons using the global [p-value adjustment method](./settings.md#multiple-comparison-adjustment); depending on the **Adjusted p-values display** setting, an **Adjusted p (vs best)** column appears alongside the raw column or replaces it. AIC and AUC don't always agree – AIC penalizes complexity, AUC doesn't, so a slightly worse-AIC model can have a comparable AUC. Use both lenses.
- **AIC**, **AICc**, **ΔAICc** – the raw AIC, the small-sample-corrected AICc, and each model's AICc gap to the best model. An over-parameterized model (where n − k − 1 ≤ 0) gets an infinite AICc, shown as "∞", and sorts last with zero weight. If *every* candidate is over-parameterized, AICc is undefined throughout and the ranking, deltas, and weights fall back to the uncorrected AIC – a note on the card says so
- **Weight** – Akaike weight (probability this is the best model given the data)
- **Cumulative weight**
- **Evidence ratio** – how much more likely the top model is compared to this one
- **Confidence set** – checkmark if the model is within the 95% confidence set (the smallest group of models whose Akaike weights sum to at least 0.95 – these are the models you can't confidently rule out)

> **Reading AICc and Akaike weights:** AICc balances model fit against complexity, adding a small-sample correction on top of AIC – lower is better, but the absolute number doesn't matter, only differences. ΔAICc < 2 means the models are essentially equivalent; > 10 means the worse model has virtually no support. Akaike weights convert these differences into probabilities: a weight of 0.45 means a 45% chance this is the best model among those tested.

A note under the rankings warns that every model here was ranked on the same data that selected it, so the leading model's fit statistics are optimistic and the ordering is unstable when predictors are correlated. Treat the ranking as exploratory. A second note appears whenever the table shows fewer models than were compared, naming both numbers, and the model-weights chart is drawn over exactly the rows the table shows.

**Large searches keep only the competitive candidates in memory.** Every candidate is fitted and counted, but past the first 2,000 only those within **Δ ≤ 20** of the running best – on AICc, AIC, *or* BIC, so a model competitive on any of the three is kept – are retained. The weights, the model-averaged coefficients, and the confidence set are computed over the retained set; the number of models fitted and the per-predictor inclusion counts are exact over the whole search. When the cap fires, a note says so.

> **Why 20, and why it's safe.** A model 20 information units behind the best carries less than e⁻¹⁰ of its Akaike weight – Burnham & Anderson already treat Δ > 10 as "essentially no support". Retaining everything is what makes a large dredge run the browser out of memory before it finishes, so the cap is what lets a big search complete at all. Below 2,000 candidates nothing is discarded, so a small comparison is unaffected.

If no candidate could be fitted at all, the card explains that and lists the errors rather than showing an empty ranking.

### Model-averaged coefficients

When enabled, a table showing:

- **Full average** – coefficient averaged across all models (absent terms counted as zero)
- **SE** and **confidence interval** – the unconditional standard error, computed in the Buckland et al. (1997) form: each model's own SE and its distance from the averaged estimate are combined *per model*, then weighted and summed, so model-selection uncertainty enters the interval alongside within-model uncertainty
- **Conditional average**, **Cond SE**, and **Cond CI** – the same three quantities computed over only the models that include the term
- **Importance** – sum of Akaike weights for models containing the term
- **OR** / **IRR** columns – for binomial and count outcomes, when the exponentiated-coefficient option is enabled. Averaging happens on the link scale, as it must; exponentiation is applied to the averaged estimate and its CI purely for display. The multinomial per-outcome tables label these **RRR**, matching their single-model counterparts

> **Full vs. conditional average:** the full average includes models where the predictor was absent (treated as zero), so it's shrunk toward zero – more conservative. The conditional average only includes models where the predictor was present, so it's closer to the actual effect when the variable matters. Importance tells you how often the predictor appears in good models – above 0.80 means it's probably essential.

A note under the table makes the same distinction on the card and adds what the standard errors are: both are **unconditional**, adding the variance *between* models to the variance within one (Buckland et al., 1997), so they price model-selection uncertainty rather than only estimation uncertainty. The note also says that the importance interpretation's labels are descriptive bands rather than a published criterion.

**Multinomial models** produce one model-averaged sub-table per outcome level vs. the reference category, since each outcome level has its own coefficient vector. Each sub-table has the same Full / SE / CI / Conditional / Importance columns as the single-equation case.

### Variable importance

A table ranking each predictor by importance (sum of Akaike weights), with the number of models containing it and how many had positive vs. negative coefficients. The sign counts cover the predictor's own coefficients only – its interaction terms are counted separately under interaction importance rather than mixed into the main effect's tally.

The interpretation column reads importance against the predictor's **prior inclusion share** – the fraction of candidates that contain it at all – rather than against zero. A predictor the search window puts in every model scores exactly 1.0 whatever it does, so it is labelled "in every model – not distinguishable" instead of "very high importance".

Two charts accompany the tables:

- **Model ranking** – Akaike weights for the top models as a bar chart, each bar annotated with its ΔAICc. Bars outside the 95% confidence set are greyed
- **Variable importance** – summed Akaike weight per predictor, with a red tick on each bar marking that predictor's prior inclusion share. Only the distance past its own tick is evidence

> **Importance and correlated predictors:** the measure sums the weights of every model containing a predictor, which means two predictors carrying the same information split that weight between them. Each then scores about half of what either would score alone, and a genuinely relevant variable can land near the bottom of the table simply because a close substitute was also in the candidate set. Read low importance as "not consistently chosen", not as "not relevant" – and check the correlation between your predictors before drawing conclusions from the ranking. A note in the output makes the same point.

### Model comparison with moderators

When moderators are selected, their main effects are fixed in every model (like covariates). Predictor × moderator interaction terms are "dredged" – each predictor's state is not just in/out, but includes any subset of moderator interactions (giving 1 + 2^n_moderators states per predictor). The model rankings table shows an **Interactions** column when any model includes interaction terms. Interaction importance (sum of Akaike weights) is reported separately from main-effect importance.

### Model comparison with mediators

Mediators are not part of the main model formula. For each candidate model that includes at least one predictor, Baron & Kenny path estimates are computed via separate sub-models (path a: M ~ predictors + covariates + moderators; path b/c': the candidate's own full term set + M). Indirect effects use the Sobel test rather than bootstrap, since bootstrapping per candidate model would be prohibitive.

The mediation table reports, per predictor × mediator pair, the **full average** and **conditional average** indirect effect – averaged over all candidates and over only those containing the term, the same distinction the [model-averaged coefficients](#model-averaged-coefficients) table draws – together with a single **Sobel z** and **Sobel p** computed from the full average against its unconditional standard error.

> **Model comparison mediation vs. targeted mediation:** model comparison uses the Sobel test for speed, which can be less accurate for small samples or skewed indirect effects. For confirmatory analysis, run a targeted regression with the best model's predictor set and use bootstrap-based mediation instead.

### Failed models

If some predictor combinations failed to converge, they appear in a collapsible section with the predictor set and error reason. Models where AIC is non-finite (typically when n ≤ k, producing a perfect fit with zero residual variance) are excluded from rankings and reported here as "Non-finite AIC (saturated model)." Each entry shows predictors and interaction terms as a flat list (e.g. "x1 × mod1, x2 × mod1, x3") with the failure reason, using the same **Intercept only** / **No additional predictors** labelling as the rankings table. The list itself is capped at 100 entries with a "… and *N* more" line; the accordion title always carries the true count.

## Path analysis (advanced mode)

The **Advanced** tab in the regression module switches from the standard variable-bucket UI to a visual path builder for specifying multi-equation regression models.

### Formula editor

A code editor using [R formula notation](./r-console.md#r-formula-notation). Each line defines one equation:

```r
Y ~ A + B*C
M ~ A
```

Supports all R formula operators (`+`, `-`, `*`, `:`, `^`, parenthesized groups) and intercept controls – `- 1` or `+ 0` drops the intercept, matching R's formula semantics. Standalone variable names (no `~`) create isolated nodes in the diagram. `#` starts a comment anywhere on a line, not only at its start. Autocomplete suggests your **selected** variables as you type – press **Tab** to accept the highlighted completion. Typing `=` is auto-corrected to `~`, and only in the text you just typed – it leaves backtick-quoted names alone, and a variable whose name contains `=` is quoted for you. The editor's hint describes the whole operator set, including `^`, parenthesized groups, and `- 1`.

Editing through the diagram round-trips through this text without disturbing it: comments, blank lines, and the order of terms are preserved.

Variable names containing operator characters, spaces, a leading `#`, or the bare intercept literals `0` and `1` can be written inside backticks – `` `my odd name` `` – and a literal backtick inside such a name is written by doubling it. The editor produces this quoting itself when you edit through the diagram, so round-tripping never loses a name.

Syntax problems are underlined as you type, with a message in the lint layer. Several of them block the run rather than just warning:

- An equation with no predictors on the right, if another equation references its target
- **Two equations sharing the same left-hand side.** Both lines draw their edges in the diagram, but only one can be fitted, so the other's predictors would silently vanish from the analysis. Merge the right-hand sides into a single line
- **A variable predicting itself** (`Y ~ X*Y`). R drops the self main effect but keeps the `X:Y` product, so the outcome would be regressed on a term containing itself
- **A name that isn't one of your selected variables.** Only variables in the current selection can enter the model, so a typo – or a column you deselected – is rejected by name instead of failing later in R
- **A right-hand side that expands to nothing** – `Y ~ 1`, or `Y ~ A - A`. The equation has no terms to estimate, so it is flagged rather than fitted as an intercept-only model you didn't ask for

Very large expansions are refused rather than attempted: `^` degrees and chained `*` operators that would generate more than 256 terms produce a diagnostic instead of freezing the editor.

> **Why a cap?** `(a + b + … + t)^20` is a perfectly legal formula that expands to about a million terms. Nothing good happens after that – the editor is parsing on every keystroke, so the tab locks up before you can undo. The limit is well above any model anyone fits deliberately.

### Path diagram

An SVG diagram rendered live from the formula text, using a Sugiyama layered layout. Nodes are colored by role:

- **Predictor** – variables that only appear on the right side of equations
- **Mediator** – variables that appear on both sides (predicted in one equation, predictor in another)
- **Outcome** – variables on the left side
- **Isolated** – standalone variables with no connections

Interaction terms render as diamond-shaped product nodes. Edges use directional chevrons.

### Visual editing

All diagram interactions round-trip through the formula text – clicking in the diagram edits the formula, which re-renders the diagram:

- **Click a node label** to swap the variable via a dropdown
- **Hover a node** to reveal delete (×) and add-connection (+) buttons on each side
- **Click an edge** to get a popover with options: insert mediator, add interaction, or remove edge
- **Click a product node's ×** to delete the interaction term (main effects are preserved)

Each of these controls carries a tooltip naming what it does, which also gives screen-reader and voice-control users an accessible name to work with. Every edit the diagram offers can also be made by typing in the formula editor, which remains the fully keyboard-accessible route.

Deleting a node or removing an edge preserves orphaned variables as isolated nodes rather than removing them – you can reconnect or clean them up manually. Variable dropdowns exclude choices that would create cycles or duplicate existing connections. Renaming a node onto a variable that already has its own equation **merges** the two equations rather than leaving a duplicate target behind.

> **Incomplete formulas:** `Y ~` (empty right-hand side) is valid – the variable renders as an isolated node with a warning underline. Empty equations are cleaned up automatically when the variable gets reconnected elsewhere.

### Running path analysis

Advanced mode is **classic estimation only** – there is no penalized path fit – so the **Estimation method** selector is hidden while the tab is active and a regularized pick is reset to Classic rather than silently producing a classic fit under a regularized label.

Clicking **Run regression** in advanced mode decomposes the path model into per-outcome equation systems and fits each via OLS or the appropriate GLM (ordinal outcomes use a proportional-odds model). For **linear** outcomes it computes indirect effects with bias-corrected bootstrap CIs and reports the full effect decomposition (direct, indirect, total). Rows whose confidence interval excludes zero are highlighted, the same way the causal-mediation table above them is. Mediators get their own decomposition too, not just the exogenous variables: in a chain X → M₁ → M₂ → Y, M₁'s indirect effect on Y through M₂ is a row of its own. For **non-linear** outcomes the indirect effect can't be read off a product of coefficients, so:

- **Single-step paths** (X → M → Y) route through causal mediation, reporting a response-scale ACME and ADE (decomposed per outcome category for ordinal outcomes).
- **Serial paths** (X → M₁ → M₂ → Y) are reported as an *approximate* indirect effect – a product of edge coefficients, which mixes scales – with a caveat pointing to the [Structural equation modeling](./structural-equation-modeling.md) module for a rigorous categorical or ordinal path model.

Each causal-mediation path is estimated from an outcome model built **for that path**, which is not always the equation you drew:

- **Another mediator downstream of this path's treatment is dropped**, together with any interaction it enters. Adjusting for it would mean conditioning on a variable that the treatment itself affects, which breaks the assumptions the ACME rests on. The card names what was dropped and why
- **The treatment is added** when the drawn model has no direct edge to the outcome – causal mediation needs it in the outcome model, so it is put there and the card says so
- **A moderator is added** when it moderates an edge into the mediator but doesn't appear in the outcome equation, since the conditional effect can only be held at its levels from inside that model

Whenever the path's model differs from the drawn one, that model's own coefficient table is rendered inside the path's section, so the reported direct effect always has its model visible on the same card. It will not match the card's global outcome coefficient table – different regressions produce different coefficients – and that is arithmetic rather than a discrepancy.

> **Why post-treatment adjustment matters:** the direct and indirect effects in a mediation analysis rest on being able to compare like with like – the same units, with and without the mediator's push. If the outcome equation also holds fixed a *second* variable that the treatment influences, part of the treatment's effect is being blocked before it is measured, and the split between "direct" and "indirect" stops meaning what its name says. Trimming the equation for each path is what keeps each ACME interpretable; the cost is that the several paths on one card are read against several models, which is why each shows its own.

Moderated edges get the same treatment as the Simple tab's moderators: drawing `Y ~ X*W` produces simple slopes for the conditional effect and, for a numeric moderator, a [Johnson-Neyman region](#johnson-neyman-region-of-significance) with its plot. Because the builder assigns no roles, a two-way interaction is read both ways – `X` moderated by `W` and `W` moderated by `X` – and both readings are reported.

Before anything is fitted, the model is checked the same way the simple mode's is: every declared outcome must be compatible with the selected regression type, every mediator equation target must be **numeric or have two levels**, and each equation needs enough complete cases for its parameter count – counted including the covariates that join its right-hand side. Cyclic models and unresolved syntax errors are rejected outright; a **multinomial** system carrying indirect paths is refused – a nominal outcome has no single response scale for an indirect effect – and so are the [two-part count families](#two-part-count-models), whose second, zero-component equation a drawn diagram has no way to express. The events-per-parameter warning fires for the outcome equation, as it does in simple mode.

**Binary mediators** are fitted with binary logistic regression rather than being rejected, and a two-edge path through one is estimated by causal mediation on the response scale. A **serial** path continuing past such a mediator still can't be decomposed – its coefficients are on the logit scale and have no common metric with a linear edge – and the run says so by name instead of producing an effect on no scale at all.

A covariate the drawn model places **downstream of an equation's own target** is left out of that equation, since adjusting for it there would condition on a mediator or a collider of that equation. The card names the covariates and the equations involved.

Long runs can be cancelled from the progress overlay, in advanced mode as in the others.

**Categorical variables in a path chain** are resolved to their actual dummy coefficients rather than being dropped. Where a categorical node has more than two levels its effect can't reduce to a single coefficient to multiply along the path, so that path is labelled **Not computed** with the reason – visible, rather than silently missing from the total.

#### Path analysis output

Alongside the per-equation fit and coefficient tables:

- **Path diagram** – the drawn system rendered with each edge labelled by its estimated coefficient, edge width and colour showing sign and rough magnitude, and non-significant edges dashed. Interaction terms appear as their own nodes fed by their components, as in the editor's diagram. An edge whose term owns more than one coefficient (a 3+-level categorical) is drawn without a label rather than with an arbitrary one, and covariates are adjusted for but not drawn – a note under the diagram says so
- **N** – the number of cases complete on every variable in the system, **covariates included**, shown at the top of the card with the number of rows dropped. All of the system's equations are fitted on that same set
- **Covariates** – listed beside N, since they join every equation's right-hand side without appearing in the drawn model
- **Effect decomposition** – direct, indirect, and total effects per path, with **standardized estimates** beside the raw ones wherever the equations involved are linear. Total effects carry a standard error and bootstrap confidence interval, assembled from the same replicates as their parts, and a total-effect row appears only for variables that actually have indirect paths. A path that can't be computed – a categorical term with no single coefficient to multiply along the path – is shown as **Not computed** with the reason, rather than as an empty row that reads like a zero. The mediator equations' own coefficient tables carry standardized estimates on the same terms
- **Higher-order interactions** – when an edge carries a three-way or larger interaction term, it is listed here and excluded from the conditional-effect computation, since those are probed from two-way coefficients only

Per-equation sections are titled by what they describe: **Equation for {variable}** for each mediator equation, and **Outcome model fit** / **Outcome model coefficients** / **Outcome model residual diagnostics** and so on for the outcome equation and its diagnostics, which cover that one equation rather than the system.

A path running through a **moderated edge** is footnoted with the moderator's name and a reminder that the unconditional product is taken at moderator = 0 (or the moderator's reference level), which for an uncentered moderator is usually outside the observed range – the conditional indirect effects are where to read the values the data covers. And when a bootstrap interval rests on fewer replicates than were requested, the same completion note the simple mode uses appears here too.

Three notes may appear:

> **Equation-by-equation estimation.** Each equation is fitted on its own rather than as a joint system. Because cycles are rejected, the model is always recursive, and single-equation estimates are valid for it – but the [SEM module](./structural-equation-modeling.md) is the tool for simultaneous estimation.

> **Suppressed intercepts.** An equation written with `- 1` or `+ 0` gets an R² computed about the origin rather than about the mean, which is usually inflated and not comparable to an ordinary R². The note is attached to that equation's fit statistics.

> **Model size.** A system generating more than 100 indirect paths is rejected with an explicit message. Path counts grow combinatorially with how densely connected the model is, and beyond that point the decomposition table stops being readable well before the computation stops being feasible.

#### Model fit (test of directed separation)

A drawn model that leaves an edge out is making a claim, and **Test of directed separation (Shipley's C)** – an opt-in checkbox in [Diagnostics](#diagnostics), advanced mode only – is what tests it. Every pair of variables the model joins by no edge is a conditional independence the model asserts; the test checks each one and combines them into a single global fit statistic.

The output is two tables:

- A summary with **Fisher's C**, its df, its p-value, and a verdict. A **significant** result means the data contradict at least one of the independencies the model implies – the model does not fit. A non-significant one means no evidence against them
- An **independence claims** table: the pair, what it is conditioned on (**Given**), the **Test** that ran, and the p-value

Each claim is tested by adding one variable to a model of the other on the conditioning set – an exact **F** where that equation is linear, a likelihood-ratio **χ²** otherwise – so a multi-level predictor is tested as one term rather than one contrast at a time, and the same code path covers linear, logistic, ordinal, and nominal responses. Fisher's C combines the claim p-values as `−2 Σ ln(p)`, which is χ² on twice their number when every claim holds.

> **What a significant C is telling you.** Not that a coefficient is wrong – that an edge you *didn't* draw should probably be there. The claims table is where to look: the claim carrying most of the statistic names the pair the model can't keep apart. This is the one thing separating "path analysis" from "a stack of regressions", since single-equation output can never contradict the model as a whole. It is also the only global fit test this tab offers; for a full latent-variable fit, use the [SEM module](./structural-equation-modeling.md).

Three situations are named rather than being papered over:

- **A saturated model** – every pair joined by an edge – implies no independence at all, so there is nothing to test. The card says it is saturated instead of showing an empty table, and cites nobody, since no test ran
- **Pairs of variables the model doesn't explain** are left out, and a note says how many. The builder draws directed effects only, so a model has no way to state that two exogenous variables covary, and a claim it cannot retract isn't one it makes. C remains a valid test of the claims that do appear
- **A claim that couldn't be tested** – its equation wouldn't fit, or the added variable contributed no estimable term – **withholds C** rather than shrinking its degrees of freedom, since the statistic is defined over the whole basis set

All standard output options ([additional statistics](#additional-statistics), ANOVA, correlations, collinearity, residual diagnostics, influence, goodness of fit) are available, and so is [Classification (ROC) analysis](#classification-roc-analysis) – for ordinal and multinomial outcomes as well as binomial, with the same per-cutpoint or per-class tables, curves, and cross-validation the Simple tab produces. Model comparison is hidden in advanced mode.

## Missing data

Missing values are handled by the global [missing data setting](./settings.md#missing-data). With listwise deletion, any case missing a value on any included variable is excluded. The output shows both total observations and complete cases used.

> **Missing data and regression:** regression requires complete cases across all variables in the model. If you have 20 predictors and missingness is spread across them, listwise deletion can remove a large portion of your data. This is another reason to keep models parsimonious – fewer predictors means fewer opportunities for missing data to shrink your sample.

## Interpretation thresholds

When [interpretation](./settings.md#significance-formatting) is enabled, tables include plain-language labels. Key thresholds used:

| Metric | Thresholds |
|---|---|
| R² | < 0.02 negligible, < 0.13 small, < 0.26 medium, ≥ 0.26 large |
| McFadden's R² | < 0.1 weak, < 0.2 acceptable, ≥ 0.2 excellent |
| Nagelkerke's R² | same scale as R²: < 0.02 negligible, < 0.13 small, < 0.26 medium, ≥ 0.26 large |
| VIF | < 5 no concern, 5–10 moderate, ≥ 10 high |
| Cook's D | < 0.5 low, 0.5–1 moderate, ≥ 1 high influence |
| Durbin-Watson (linear) | judged by its p-value against the significance level; when significant, DW < 2 reads as positive autocorrelation and DW > 2 as negative. GLM families use Breusch-Godfrey the same way |
| Variable importance | ≥ 0.9 very high, 0.7–0.9 high, 0.5–0.7 moderate, 0.3–0.5 low, < 0.3 very low |
| Shrinkage (regularized) | ≥ 90% minimal, ≥ 50% acceptable, < 50% notable; a negative value is reported as "sign reversed" |

## Reporting checklist

Key things to include when writing up regression results:

**Method:**
- Regression type (linear, logistic, etc.) and estimation method – including **Firth** where it was used, and why (separation, rare events, small sample)
- For the two-part count families: which one (zero-inflated or hurdle), the count distribution, and which predictors entered the zero equation
- Predictors and covariates included, with rationale
- Which **ANOVA type** the per-term table reports, whenever the model contains interactions
- For regularization: method (Ridge/LASSO/Elastic net/Group lasso), lambda selection strategy, alpha value, whether folds were stratified, and – if selection stability was used – the scheme (half samples or complementary pairs), the number of subsamples or pairs, and the threshold π
- For post-selection inference: the number of sample splits, and that lambda was re-tuned inside each one
- For linear models: which standard errors the inference columns rest on (model-based, HC3, or Newey-West)
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

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. Regression analysis uses base R (`lm`, `glm`) for classic linear and binomial models, `MASS` for ordinal logistic and negative binomial, `nnet` for multinomial logistic, `car` for collinearity diagnostics and Type II ANOVA (`car::Anova`, which supplies the likelihood-ratio form for non-Gaussian fits), `lmtest` for residual diagnostics and the linear RESET test, `sandwich` for the HC3 and Newey-West covariance matrices, `ResourceSelection` for Hosmer-Lemeshow tests, `pROC` for ROC / AUC analysis (per-curve AUC + CI, DeLong's test for binomial AUC comparisons, and `multiclass.roc` for Hand-Till M), `mediation` for causal mediation of non-linear (logistic, ordinal, Poisson, negative binomial) outcomes and for the sensitivity analysis (`medsens`), `brglm2` for Firth's bias-reduced logistic fit, `pscl` for the zero-inflated and hurdle families, `stabs` for the complementary-pairs error bound, and `glmnet`, `ordinalNet`, `mpath`, or `grpreg` for regularized estimation. The Brant test of proportional odds and the Johnson-Neyman region are computed from base R and `MASS` – no extra packages. Somers' D and Kendall's tau-c for ordinal models are derived from `cor(method = "kendall")` plus tied-pair counts, the le Cessie-van Houwelingen statistic is computed inline as a weighted residual regression, the test of directed separation is a per-claim model comparison over the drawn DAG, the cross-validated AUC's influence-curve interval is computed from one rank sweep per fold, and the Cameron & Trivedi overdispersion score test needs only the Poisson fit – also no extra packages required.

**Citations cover methods, not only packages.** Every method the card actually puts on screen is credited at the top of the output section – the regression families and their pseudo-R²s, the diagnostic tests and influence statistics, robust covariance matrices, the sums-of-squares types, the regularization penalties, lambda selection and cross-validation, selection stability and its error bound, post-selection inference, causal mediation and its sensitivity analysis, simple slopes and the Johnson-Neyman region, information criteria, Akaike weights and model averaging, the classification metrics and each AUC interval method, the test of directed separation, alongside the papers for the R packages that computed them. Only what ran in *this* analysis is listed.

ROC bootstrap CIs are seeded by [**Bootstrap seed**](./settings.md#bootstrap-seed); cross-validated AUC fold assignment and the Shapiro-Wilk sub-sample for large residual sets are seeded by [**Reproducibility seed**](./settings.md#reproducibility-seed). When **Reproducibility seed** is empty, the CV base seed is drawn at random and assigned to `cv_seed` in the R session – inspect it in the [R console](./r-console.md) to recover and re-run with the exact same folds. Every seeded block restores the session's random-number stream when it finishes, so running a regression doesn't change what a later unseeded analysis in another module produces.

## Common pitfalls

**Confusing prediction with explanation.** A model with high R² predicts well, but that doesn't mean the coefficients reveal causal mechanisms. A predictor might correlate with the outcome only because both are caused by something you didn't measure (a confound). Regression estimates associations – causal claims require experimental design or specialized causal inference techniques.

**Too many predictors, too few observations.** A common rule of thumb is at least 10–15 observations per predictor. With 50 participants and 20 predictors, the model will likely overfit – it'll explain noise in your sample that won't replicate. Use [model comparison](#model-comparison) or regularization to find a more parsimonious model.

**Ignoring collinearity.** When predictors are highly correlated, individual coefficients become unreliable – small changes in the data can flip signs or dramatically change magnitudes. The model's overall fit may still be fine, but individual predictor effects can't be trusted. Check VIF and consider removing or combining correlated predictors.

**Treating stepwise selection as confirmatory.** Automated model selection (including model comparison) is exploratory – the "best" model is best *for this particular dataset*. It should be validated on new data or a hold-out sample before being treated as a confirmed finding. Report it as exploratory and note the number of models tested.

**Interpreting non-significant predictors as "no effect."** A non-significant coefficient means the effect couldn't be distinguished from zero *given the sample size and model*. It doesn't prove the predictor is irrelevant – it might matter in a larger sample, or its effect might be masked by collinearity with another predictor. Don't conclude "X has no effect on Y" from a single non-significant regression coefficient.
