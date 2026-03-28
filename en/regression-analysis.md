---
title: Regression analysis
description: Linear, logistic, ordinal, multinomial, Poisson, and negative binomial regression with regularization and model comparison in DataSuite 2.
---

# Regression analysis

The **Regression analysis** module builds models that predict an outcome from one or more predictors. It supports six regression types, four estimation methods (including regularization), optional diagnostics, and a model comparison mode that evaluates every possible predictor combination.

> **What is regression?** Correlation tells you two variables are related; regression tells you *how* — it estimates a formula that predicts one variable from others. For example, a linear regression might find that each additional year of education predicts $5,000 more in income, after controlling for age and experience. The model quantifies each predictor's unique contribution.

1. Select a [dependent variable](#variable-selection), [predictors](#variable-selection), and optional [mediators, moderators, or covariates](#mediators-moderators-and-covariates)
2. Choose a [regression type](#regression-type) and [estimation method](#estimation-method)
3. Toggle [additional statistics and diagnostics](#additional-statistics)
4. Click **Run regression** — or use [model comparison](#model-comparison) to find the best predictor combination
5. For multi-equation models, use the [Advanced tab](#path-analysis-advanced-mode) to build a path diagram

## Variable selection

Three variable lists appear on the left:

- **Dependent variable(s)** — the outcome you want to predict. Selecting multiple DVs runs a separate regression for each one. The list filters to show only compatible variable types (e.g. numeric for linear, binary for binomial logistic).
- **Predictors** — independent variables to include in the model. At least one predictor or covariate is required.
- **Covariates** (optional) — control variables that are always included. In [model comparison](#model-comparison), covariates stay fixed while predictors are varied.

A variable selected in one list is hidden from the other two, preventing it from appearing on both sides of the equation.

> **Predictors vs. covariates:** both are independent variables in the model, and mathematically they're treated the same way. The distinction matters in model comparison — predictors are the variables you're testing (which combination works best?), while covariates are variables you always want to control for regardless.

### Mediators, moderators, and covariates

Three optional variable buckets appear as collapsed accordions below the predictors list: **Mediators**, **Moderators**, and **Covariates**. All five buckets (DV, predictors, mediators, moderators, covariates) are mutually exclusive — a variable can only appear in one. Mediator and moderator buckets are hidden when a regularized estimation method is selected.

> **What are mediators and moderators?** A *mediator* explains *how* an effect works — it's the mechanism. If exercise reduces depression, sleep quality might mediate that effect (exercise → better sleep → less depression). A *moderator* explains *when* or *for whom* an effect is stronger — it changes the strength or direction. Gender might moderate the exercise–depression link if the effect is stronger for one group.

**Mediation** — selecting mediators automatically runs Baron & Kenny causal steps for every predictor × mediator pair. Results include:

- **Path a** (X → M) — the predictor's effect on the mediator
- **Path b** (M → Y) — the mediator's effect on the outcome, controlling for the predictor
- **Total effect c** — the predictor's overall effect on the outcome
- **Direct effect c'** — the predictor's effect controlling for the mediator
- **Indirect effect a × b** — with bootstrap confidence interval. Significance is assessed by whether the CI excludes zero (no p-value).
- **Proportion mediated** — what share of the total effect goes through the mediator

Bootstrap replications use the count from the global [settings](./settings.md).

> **Reading mediation results:** the key question is whether the indirect effect (a × b) is significantly different from zero. If the bootstrap CI excludes zero, the mediator carries a significant portion of the effect. A large proportion mediated (e.g. 60%) means most of the effect works through the mediator. A significant direct effect (c') alongside a significant indirect effect means partial mediation — the predictor affects the outcome both through the mediator and directly.

**Moderation** — selecting moderators adds interaction terms (predictor × moderator) to the main model and runs simple slopes analysis. Results appear alongside the main coefficients table.

- **Numeric moderators** — slopes at −1 SD, mean, and +1 SD
- **Categorical moderators** — slopes at each level

> **Reading moderation results:** a significant interaction term means the predictor's effect depends on the moderator. Simple slopes tell you what the effect looks like at different moderator values. For example, if the age × gender interaction is significant, simple slopes might show that age has a strong effect for women but a weak one for men.

**Conditional indirect effects** — an opt-in checkbox, visible only when both mediators and moderators are selected. Tests whether the indirect effect (X → M → Y) varies across moderator levels (moderated mediation). Results include:

- Indirect effects at each moderator probe value with bootstrap CIs
- An index of moderated mediation — if its CI excludes zero, the mediation is significantly moderated

All bootstrap work uses a shared resampling loop: data is resampled once per iteration and all mediator/moderator models are fit from the same resample, keeping computation tractable with multiple predictors, mediators, and moderators.

A sample size check blocks the analysis when the number of complete cases is equal to or fewer than the number of main model parameters.

## Model setup

### Regression type

| Type | When to use | Required DV |
|---|---|---|
| **Linear** | Continuous numeric outcome | Numeric |
| **Binomial logistic** | Two-category outcome (yes/no, pass/fail) | Binary |
| **Ordinal logistic** | Ordered categories (e.g. low/medium/high) | Ordinal |
| **Multinomial logistic** | Three or more unordered categories | Categorical (3+ levels) |
| **Poisson** | Count outcomes (0, 1, 2, ...) | Numeric |
| **Negative binomial** | Count outcomes with overdispersion | Numeric |

> **Linear vs. logistic:** linear regression predicts a continuous number (income, temperature, score). Logistic regression predicts the *probability* of belonging to a category (will the patient recover? which product will the customer buy?). Using linear regression on a binary outcome can produce impossible predictions (probabilities below 0 or above 1) — logistic regression avoids this.

> **Poisson vs. negative binomial:** both model count data, but Poisson assumes the mean equals the variance. Real count data often has more variability than that (overdispersion) — number of doctor visits, accident counts, etc. If your Poisson model shows a dispersion parameter well above 1, switch to negative binomial.

> **What is GLM?** You'll see "GLM types" mentioned in the diagnostics options. GLM stands for Generalized Linear Model — a family that includes binomial logistic, Poisson, and negative binomial regression. Linear regression is technically a special case, but in this module it's listed separately because it has additional output options (Beta coefficients, ANOVA table, correlations) that don't apply to other GLM types. Ordinal and multinomial logistic use different fitting procedures and aren't classified as GLM here.

### Estimation method

| Method | Description |
|---|---|
| **Classic (OLS/MLE)** | Standard estimation — OLS for linear, maximum likelihood for others. Full diagnostics available. |
| **Ridge (L2)** | Shrinks coefficients toward zero but keeps all predictors. Helps with multicollinearity. |
| **LASSO (L1)** | Can shrink some coefficients exactly to zero, performing automatic variable selection. |
| **Elastic Net (L1 + L2)** | A blend of Ridge and LASSO. An **alpha** slider controls the mix (0 = pure Ridge, 1 = pure LASSO, default 0.5). |

> **When to use regularization:** if you have many predictors relative to your sample size, or if predictors are highly correlated, classic regression can produce unstable or overfit models. Regularization constrains the coefficients to reduce overfitting. LASSO is especially useful when you suspect many predictors are irrelevant — it automatically drops them. Ridge is better when most predictors contribute but you want to stabilize the estimates. Elastic Net combines both strategies.

### Lambda selection (regularized methods only)

Controls how much regularization is applied:

- **Minimum CV error (lambda.min)** (default) — the lambda that minimizes 10-fold cross-validation error
- **1 SE rule (lambda.1se)** — the largest lambda within one standard error of the minimum, providing more regularization (simpler model)
- **Manual** — enter a custom lambda value

> **lambda.min vs. lambda.1se:** lambda.min gives the best predictive accuracy, but the model may be more complex than necessary. lambda.1se sacrifices a tiny bit of accuracy for a simpler model — often a better choice when interpretability matters.

**Assumptions:**
- **Linear regression** assumes a linear relationship between predictors and outcome, normally distributed residuals, homoscedasticity (constant error variance), no multicollinearity among predictors, and independent observations. Enable [diagnostics](#diagnostics) to check these.
- **Logistic regression** (binomial, ordinal, multinomial) assumes independent observations, no multicollinearity, and a large enough sample for stable maximum likelihood estimation. No normality requirement — but ordinal logistic additionally assumes proportional odds (the effect of each predictor is the same across all threshold cut-points).
- **Poisson regression** assumes the outcome is a count, events are independent, and the mean equals the variance (equidispersion). When the variance exceeds the mean (overdispersion), use negative binomial instead.
- **Regularized methods** relax the multicollinearity assumption — handling correlated predictors is precisely their purpose. However, they still assume the correct functional form (linear for linear, logistic link for logistic, etc.).
- **All types** assume no omitted variable bias — that all important predictors are in the model. A missing confound can make an included predictor appear significant (or non-significant) when it shouldn't be.

## Additional statistics

These checkboxes control optional output sections. Availability depends on regression type and estimation method:

| Option | Available when |
|---|---|
| **Zero-order correlations** | Linear + Classic only |
| **Part and partial correlations** | Linear + Classic only |
| **ANOVA table** | Linear + Classic only |
| **Odds ratios with confidence intervals** | Logistic types (binomial, ordinal, multinomial) + Classic only |

> **What are odds ratios?** In logistic regression, coefficients are in log-odds — not intuitive. An odds ratio converts them: OR = 2.0 means the odds of the outcome double for each unit increase in the predictor. OR = 0.5 means the odds halve. OR = 1.0 means no effect. Always check the confidence interval — if it includes 1.0, the effect isn't significant.

### Diagnostics

| Option | Available when |
|---|---|
| **Collinearity diagnostics** (VIF/Tolerance) | All Classic methods |
| **Residual diagnostics** (normality, autocorrelation, heteroscedasticity) | Linear and GLM types + Classic |
| **Influence statistics** (Cook's D, leverage, outliers) | Linear and GLM types + Classic |
| **Goodness of fit** (Hosmer-Lemeshow, deviance, RESET, etc.) | All Classic methods |

Diagnostics are not available for regularized methods.

## Reading results — classic regression

Each result appears as an output card titled with the regression type and dependent variable name.

### Model information

A summary block showing the dependent variable, predictor and covariate names, and sample size (N).

### Model fit

**Linear regression:**

- **R²** and **adjusted R²** — proportion of variance explained (see below)
- **F-statistic**, **df**, **p-value** — tests whether the model as a whole is significant (i.e. whether the predictors collectively do better than just using the mean)
- **Root MSE** — average prediction error in the outcome's original units. Lower is better.
- **AIC** and **BIC** — information criteria for comparing models (see [model comparison](#model-comparison)). Lower is better, but only meaningful when comparing models on the same data.

**Logistic and other GLM types:**

- **McFadden's R²**, **Nagelkerke's R²**, **Cox & Snell R²** — different approximations of explained variance (see below)
- **Null deviance** — how poorly the model fits with no predictors (intercept only)
- **Residual deviance** — how poorly the model fits with your predictors. The bigger the drop from null to residual, the more your predictors help.
- **Chi-square (likelihood ratio test)**, **df**, **p-value** — tests whether the model as a whole is significant
- **Log-likelihood** — the raw measure of model fit that the pseudo-R² values and information criteria are derived from
- **AIC** and **BIC** — for comparing models (lower is better)

> **R² in regression:** R² tells you what proportion of the outcome's variance is explained by your predictors. R² = 0.45 means the model explains 45% of the variation — the other 55% is due to factors not in the model. Adjusted R² penalizes for adding predictors that don't genuinely improve the model. In social sciences, R² = 0.20 is often considered decent; in physics, you'd expect 0.99.

> **Pseudo-R² for logistic models:** logistic regression doesn't have a true R², so several approximations exist. McFadden's R² above 0.20 is considered a good fit (it doesn't scale like linear R²). Nagelkerke's is rescaled to reach 1.0 theoretically, making it more comparable to linear R². No single pseudo-R² tells the whole story — look at the overall model test (chi-square p-value) and classification accuracy too.

### Coefficients

A table with one row per term:

- **B** — unstandardized estimate (the raw effect in the outcome's units)
- **SE** — standard error of B (how precisely the coefficient is estimated — smaller SE means more certainty)
- **Beta** — standardized estimate (linear regression only, not shown for intercept). Allows comparing predictors measured on different scales.
- **t or z statistic** with significance stars — essentially B divided by SE; larger values mean stronger evidence
- **p-value** — probability of seeing this coefficient if the predictor had no real effect
- **Confidence interval** — the range where the true coefficient likely falls

> **B vs. Beta:** B tells you the effect in real units ("each year of education adds $5,000 in income"). Beta tells you the *relative* importance of predictors ("education has a bigger effect than age"). Use B for practical interpretation, Beta for comparing predictors within the same model.

For **multinomial** models, coefficients are grouped by outcome level, each compared against the reference category. When odds ratios are enabled, relative risk ratios (RRR) and their CIs are added.

For **ordinal** models, a separate thresholds table shows cut-points between adjacent categories.

When categorical predictors are present, a note lists the reference category for each variable.

> **What are reference categories?** When a predictor is categorical (e.g. "Red", "Blue", "Green"), regression can't use the labels directly — it picks one category as the baseline (reference) and measures the others against it. A coefficient of 3.5 for "Blue" with reference "Red" means Blue scores 3.5 higher than Red, on average. The choice of reference doesn't change the model's predictions, but it changes how you read the coefficient table.

### ANOVA table (linear only)

Breaks down variance into regression, residual, and total rows with sum of squares, df, mean square, F-statistic, and p-value.

> **Reading the ANOVA table:** the regression row shows how much variance your predictors explain; the residual row shows what's left unexplained. The F-statistic tests whether the explained portion is large enough to be meaningful. This is the same overall significance test as in the model fit section, just shown in more detail.

### Correlations (linear only)

A table of zero-order, partial, and/or part (semi-partial) correlations for each predictor.

> **Zero-order vs. partial vs. part:** zero-order is the simple correlation between predictor and outcome, ignoring all other predictors. Partial correlation removes the influence of other predictors from *both* the predictor and outcome. Part (semi-partial) removes other predictors' influence from only the predictor. Part correlations squared tell you each predictor's unique contribution to R².

### Collinearity diagnostics

VIF and tolerance for each predictor:

- VIF below 5 — no concern
- VIF 5–10 — moderate collinearity
- VIF above 10 — high collinearity (predictors are too correlated; estimates may be unstable)

> **What is collinearity?** When predictors are highly correlated with each other, the model struggles to separate their individual effects — standard errors inflate and coefficients become unstable. High VIF doesn't mean the model is wrong, but it means individual predictor effects are hard to trust. Consider removing or combining correlated predictors.

### Residual diagnostics

- **Shapiro-Wilk test** — normality of residuals (are prediction errors roughly bell-shaped?)
- **Durbin-Watson test** — autocorrelation (values 1.5–2.5 indicate no concern)
- **Breusch-Pagan test** — heteroscedasticity (whether prediction errors vary in size across the range)

> **What are residuals?** The difference between what the model predicted and what was actually observed. Good regression models produce residuals that are random — no patterns, roughly normal, and similar in size across the range. These three tests check exactly that. If residuals aren't normal, your p-values may be inaccurate. If there's autocorrelation, your observations aren't independent (common with time-series data). If there's heteroscedasticity, the model predicts some ranges more accurately than others.

> **Autocorrelation:** means each observation's residual is related to the previous one — a pattern where errors follow trends rather than being random. This typically happens with data collected over time (monthly sales, daily temperatures). Durbin-Watson values near 2.0 mean no autocorrelation; values toward 0 indicate positive autocorrelation (errors trend together); values toward 4 indicate negative autocorrelation (errors alternate).

### Influence statistics

- **Cook's D** — maximum value and count of observations with D > 1 (highly influential points)
- **Leverage** — maximum hat value, threshold (2p/n), and count of high-leverage points
- **Outliers** — count of standardized residuals exceeding |3|

> **Cook's D vs. leverage vs. outliers:** these capture different kinds of problematic observations. An *outlier* has an unusual outcome (large residual). A *high-leverage* point has unusual predictor values (it's far from the center of the data). *Cook's D* combines both — it measures how much the entire model would change if you removed that observation. A point can have high leverage without being influential (if it falls right on the trend line) or be an outlier without having leverage (if its predictors are typical). The most dangerous points are both — extreme predictors *and* an unusual outcome.

> **Should I remove influential observations?** Not automatically. High Cook's D means a single observation disproportionately affects the model — but it might be a legitimate data point. Investigate *why* it's influential (data entry error? genuine extreme case?) before deciding. Removing it and re-running the model shows how much it matters.

### Goodness of fit

Type-specific tests:

- **Linear** — RESET test (Ramsey's specification error). A significant result suggests non-linear terms may be needed.
- **Binomial** — Hosmer-Lemeshow test; classification table with accuracy, sensitivity, specificity, PPV, NPV, and confusion matrix

> **Classification metrics explained:** *Accuracy* is the overall percentage of correct predictions. *Sensitivity* (true positive rate) is how well the model catches positive cases — "of all patients who actually have the disease, how many did we identify?" *Specificity* (true negative rate) is how well it identifies negatives — "of all healthy patients, how many did we correctly rule out?" *PPV* (positive predictive value) asks "if the model says positive, how often is it right?" *NPV* (negative predictive value) asks the reverse. The confusion matrix shows the raw counts behind all these metrics.
- **Ordinal** — classification accuracy and proportional odds assumption check
- **Multinomial** — classification accuracy, per-class accuracy, likelihood ratio test, adjusted McFadden's R²
- **Poisson / Negative binomial** — deviance and Pearson chi-square tests; dispersion parameter (near 1 is acceptable; below 0.8 = underdispersion; above 1.2 = overdispersion)

## Reading results — regularized regression

The output card title includes both the method (Ridge, LASSO, or Elastic Net) and the regression type.

### Regularization parameters

A table showing alpha, selected lambda, lambda.min, lambda.1se, and cross-validation error with SE.

### Regularized model fit

Deviance ratio (pseudo-R²) or R² for linear, McFadden's R² for logistic, and null deviance where available.

### Regularized coefficients

Regularized coefficients do not have standard errors or p-values — the regularization penalty makes traditional inference invalid.

> **Why no p-values?** P-values and confidence intervals assume coefficients are estimated freely. Regularization deliberately constrains them, which violates the math behind traditional inference. Instead of asking "is this predictor significant?", regularized regression answers "is this predictor useful enough to survive the penalty?" — for LASSO, a non-zero coefficient *is* the answer.

- **Ridge** — shows each term's estimate and a **Shrinkage** column indicating how much of the unpenalized estimate is retained (color-coded: green ≥ 90%, yellow ≥ 50%, red < 50%)
- **LASSO / Elastic Net** — shows each term's estimate and a **Status** column: "Selected" or "Excluded (shrunk to 0)". Excluded terms are dimmed.

Multinomial models group coefficients by outcome level. Ordinal models show thresholds separately.

### Cross-validation summary

Shows the number of lambda values tested, lambda range, best CV error with SE, and degrees of freedom at the selected lambda.

> **What is cross-validation?** The data is split into 10 parts (folds). The model is trained on 9 folds and tested on the remaining one, then rotated so each fold gets a turn as the test set. The average prediction error across all 10 rounds is the CV error — it estimates how well the model will perform on new, unseen data, rather than just fitting the data it was trained on.

## Model comparison

Model comparison performs an all-subsets search: every combination of predictors is fitted as a separate model, while covariates remain fixed. Only available with classic estimation.

> **When to use model comparison:** when you have several candidate predictors and want to know which combination best explains the outcome without overfitting. It's exploratory — use it to generate hypotheses, not to confirm them. With many predictors, the number of models grows exponentially.

### Settings

- **Maximum models to display** — limits the ranking table (default 25; set to 0 for all)
- **Minimum predictors** — fewest predictors per model (default 0, which includes the intercept-only model)
- **Maximum predictors** — most predictors per model (leave empty for no limit)

A maximum of 15 predictors is allowed (2¹⁵ = 32,768 models). If the count exceeds 100, a confirmation dialog appears.

### Output options

- **Model-averaged coefficients** (on by default) — coefficients averaged across all models, weighted by Akaike weights
- **Extended model statistics** — adds BIC, BIC weights, and log-likelihood columns. Can be toggled after results are displayed without re-running.

### Model rankings

A sortable table with one row per candidate model:

- **Rank** (by AIC)
- **Predictors** — variables in the model, with a **Use** button to apply that model's predictor set to the selection list
- **K** — number of parameters
- **R² / Adjusted R²** (linear) or **McFadden R² / Nagelkerke R²** (other types)
- **AIC**, **AICc**, **delta-AIC**
- **Weight** — Akaike weight (probability this is the best model given the data)
- **Cumulative weight**
- **Evidence ratio** — how much more likely the top model is compared to this one
- **Confidence set** — checkmark if the model is within the 95% confidence set (the smallest group of models whose Akaike weights sum to at least 0.95 — these are the models you can't confidently rule out)

> **Reading AIC and Akaike weights:** AIC balances model fit against complexity — lower is better, but the absolute number doesn't matter, only differences. Delta-AIC < 2 means the models are essentially equivalent; > 10 means the worse model has virtually no support. Akaike weights convert these differences into probabilities: a weight of 0.45 means a 45% chance this is the best model among those tested.

### Model-averaged coefficients

When enabled, a table showing:

- **Full average** — coefficient averaged across all models (absent terms counted as zero)
- **SE** — unconditional standard error
- **Confidence interval**
- **Conditional average** — average across only models that include the term
- **Importance** — sum of Akaike weights for models containing the term

> **Full vs. conditional average:** the full average includes models where the predictor was absent (treated as zero), so it's shrunk toward zero — more conservative. The conditional average only includes models where the predictor was present, so it's closer to the actual effect when the variable matters. Importance tells you how often the predictor appears in good models — above 0.80 means it's probably essential.

### Variable importance

A table ranking each predictor by importance (sum of Akaike weights), with the number of models containing it and how many had positive vs. negative coefficients.

### Model comparison with moderators

When moderators are selected, their main effects are fixed in every model (like covariates). Predictor × moderator interaction terms are "dredged" — each predictor's state is not just in/out, but includes any subset of moderator interactions (giving 1 + 2^n_moderators states per predictor). The model rankings table shows an **Interactions** column when any model includes interaction terms. Interaction importance (sum of Akaike weights) is reported separately from main-effect importance.

### Model comparison with mediators

Mediators are not part of the main model formula. For each candidate model that includes at least one predictor, Baron & Kenny path estimates are computed via separate sub-models (path a: M ~ predictors + covariates + moderators; path b/c': Y ~ predictors + M + covariates + moderators). Indirect effects use the Sobel test rather than bootstrap, since bootstrapping per candidate model would be prohibitive. Mediation importance (model-weighted average indirect effect) is reported.

> **Model comparison mediation vs. targeted mediation:** model comparison uses the Sobel test for speed, which can be less accurate for small samples or skewed indirect effects. For confirmatory analysis, run a targeted regression with the best model's predictor set and use bootstrap-based mediation instead.

### Failed models

If some predictor combinations failed to converge, they appear in a collapsible section with the predictor set and error reason. Models where AIC is non-finite (typically when n ≤ k, producing a perfect fit with zero residual variance) are excluded from rankings and reported here as "Non-finite AIC (saturated model)." Each entry shows predictors and interaction terms as a flat list (e.g. "x1 × mod1, x2 × mod1, x3") with the failure reason.

## Path analysis (advanced mode)

The **Advanced** tab in the regression module switches from the standard variable-bucket UI to a visual path builder for specifying multi-equation regression models.

### Formula editor

A code editor using [R formula notation](./r-console.md#r-formula-notation). Each line defines one equation:

```r
Y ~ A + B*C
M ~ A
```

Supports all R formula operators (`+`, `-`, `*`, `:`, `^`, parenthesized groups). Standalone variable names (no `~`) create isolated nodes in the diagram. Autocomplete suggests dataset variables as you type — press **Tab** to accept the highlighted completion. Typing `=` is auto-corrected to `~`.

### Path diagram

An SVG diagram rendered live from the formula text, using a Sugiyama layered layout. Nodes are colored by role:

- **Predictor** — variables that only appear on the right side of equations
- **Mediator** — variables that appear on both sides (predicted in one equation, predictor in another)
- **Outcome** — variables on the left side
- **Isolated** — standalone variables with no connections

Interaction terms render as diamond-shaped product nodes. Edges use directional chevrons.

### Visual editing

All diagram interactions round-trip through the formula text — clicking in the diagram edits the formula, which re-renders the diagram:

- **Click a node label** to swap the variable via a dropdown
- **Hover a node** to reveal delete (×) and add-connection (+) buttons on each side
- **Click an edge** to get a popover with options: insert mediator, add interaction, or remove edge
- **Click a product node's ×** to delete the interaction term (main effects are preserved)

Deleting a node or removing an edge preserves orphaned variables as isolated nodes rather than removing them — you can reconnect or clean them up manually. Variable dropdowns exclude choices that would create cycles or duplicate existing connections.

> **Incomplete formulas:** `Y ~` (empty right-hand side) is valid — the variable renders as an isolated node with a warning underline. Empty equations are cleaned up automatically when the variable gets reconnected elsewhere.

### Running path analysis

Clicking **Run regression** in advanced mode decomposes the path model into per-outcome equation systems, fits each via OLS/GLM, computes indirect effects with bootstrap CIs, and reports effect decomposition (direct, indirect, total). All standard output options ([additional statistics](#additional-statistics), ANOVA, correlations, collinearity, residual diagnostics, influence, goodness of fit) are available. Model comparison is hidden in advanced mode.

## Missing data

Missing values are handled by the global [missing data setting](./settings.md#missing-data). With listwise deletion, any case missing a value on any included variable is excluded. The output shows both total observations and complete cases used.

> **Missing data and regression:** regression requires complete cases across all variables in the model. If you have 20 predictors and missingness is spread across them, listwise deletion can remove a large portion of your data. This is another reason to keep models parsimonious — fewer predictors means fewer opportunities for missing data to shrink your sample.

## Interpretation thresholds

When [interpretation](./settings.md#significance-formatting) is enabled, tables include plain-language labels. Key thresholds used:

| Metric | Thresholds |
|---|---|
| R² | < 0.02 negligible, < 0.13 small, < 0.26 medium, ≥ 0.26 large |
| McFadden's R² | < 0.1 weak, < 0.2 acceptable, < 0.4 good, ≥ 0.4 excellent |
| VIF | < 5 no concern, 5–10 moderate, ≥ 10 high |
| Cook's D | < 0.5 low, 0.5–1 moderate, ≥ 1 high influence |
| Durbin-Watson | 1.5–2.5 no concern, < 1.5 positive autocorrelation, > 2.5 negative |
| Variable importance | ≥ 0.9 very high, 0.7–0.9 high, 0.5–0.7 moderate, 0.3–0.5 low, < 0.3 very low |

## Reporting checklist

Key things to include when writing up regression results:

**Method:**
- Regression type (linear, logistic, etc.) and estimation method
- Predictors and covariates included, with rationale
- For regularization: method (Ridge/LASSO/Elastic Net), lambda selection strategy, alpha value
- How missing data were handled
- Sample size (total and complete cases if different)
- For model comparison: number of candidate models, selection criterion (AIC)

**Results:**
- Model fit (R² and adjusted R² for linear; pseudo-R² and chi-square test for logistic)
- Coefficient table with B, SE, test statistic, p-value, and confidence intervals
- Beta (standardized) coefficients for linear regression
- Odds ratios for logistic regression
- Effect size for the overall model
- Diagnostics: collinearity (VIF), residual normality, influential observations — at minimum note whether assumptions were checked
- For model comparison: top model(s), Akaike weights, variable importance
- For regularization: selected lambda, number of non-zero coefficients (LASSO), cross-validation error

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) — you can inspect, copy, or re-run the exact commands. Regression analysis uses base R (`lm`, `glm`) for classic linear and binomial models, `MASS` for ordinal logistic and negative binomial, `nnet` for multinomial logistic, `car` for collinearity diagnostics, `lmtest` for residual diagnostics, `ResourceSelection` for Hosmer-Lemeshow tests, and `glmnet`, `ordinalNet`, or `mpath` for regularized estimation. Citations for R packages used in your analysis appear automatically at the top of the output section.

## Common pitfalls

**Confusing prediction with explanation.** A model with high R² predicts well, but that doesn't mean the coefficients reveal causal mechanisms. A predictor might correlate with the outcome only because both are caused by something you didn't measure (a confound). Regression estimates associations — causal claims require experimental design or specialized causal inference techniques.

**Too many predictors, too few observations.** A common rule of thumb is at least 10–15 observations per predictor. With 50 participants and 20 predictors, the model will likely overfit — it'll explain noise in your sample that won't replicate. Use [model comparison](#model-comparison) or regularization to find a more parsimonious model.

**Ignoring collinearity.** When predictors are highly correlated, individual coefficients become unreliable — small changes in the data can flip signs or dramatically change magnitudes. The model's overall fit may still be fine, but individual predictor effects can't be trusted. Check VIF and consider removing or combining correlated predictors.

**Treating stepwise selection as confirmatory.** Automated model selection (including model comparison) is exploratory — the "best" model is best *for this particular dataset*. It should be validated on new data or a hold-out sample before being treated as a confirmed finding. Report it as exploratory and note the number of models tested.

**Interpreting non-significant predictors as "no effect."** A non-significant coefficient means the effect couldn't be distinguished from zero *given the sample size and model*. It doesn't prove the predictor is irrelevant — it might matter in a larger sample, or its effect might be masked by collinearity with another predictor. Don't conclude "X has no effect on Y" from a single non-significant regression coefficient.