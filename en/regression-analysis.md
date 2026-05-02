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

> **For time-to-event outcomes** (durations with possible censoring — survival, time-to-failure, time-to-relapse), use the [Time to event analysis](./time-to-event-analysis.md) module instead. Treating censored time-to-event data as a numeric outcome in linear or Poisson regression biases the results.

> **For time-ordered numeric outcomes** (sales, sensor readings, traffic — anything where successive observations are autocorrelated), use the [Time series analysis](./time-series-analysis.md) module instead. Linear regression on autocorrelated data produces biased standard errors and over-confident coefficients; ARIMA, ETS, and the forecasting horse-race in the time series module are designed to handle the dependence directly.

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
- **Binomial** — Hosmer-Lemeshow test (calibration check across deciles of fitted probability). Discrimination metrics (AUC, sensitivity, specificity, etc.) live in the dedicated [Classification (ROC) analysis](#classification-roc-analysis) section.
- **Ordinal** — classification accuracy and proportional odds assumption check. Per-cutpoint discrimination metrics (AUC, Somers' D, Kendall's tau-c) live in [Classification (ROC) analysis](#classification-roc-analysis).
- **Multinomial** — classification accuracy, per-class accuracy, likelihood ratio test, adjusted McFadden's R². Per-class and aggregate discrimination metrics (AUC, Hand-Till M, Brier) live in [Classification (ROC) analysis](#classification-roc-analysis).
- **Poisson / Negative binomial** — deviance and Pearson chi-square tests; dispersion parameter (near 1 is acceptable; below 0.8 = underdispersion; above 1.2 = overdispersion)

### Classification (ROC) analysis

Available for **binomial**, **multinomial**, and **ordinal** logistic regression. Each model variant produces *predicted probabilities* for each observation; ROC analysis evaluates how well those probabilities discriminate between the actual outcomes, across all possible cutoffs at once. The output structure adapts per mode (one curve for binomial, K one-vs-rest curves for multinomial, K−1 per-cutpoint curves for ordinal), but the core question is the same: *how well does this model separate cases that differ in outcome?*

> **Why no fixed 0.5 cutoff?** A 0.5 cutoff is only sensible when the two outcomes are equally common and equally costly to miss — which is rarely true in real data. If 5% of patients have the disease, almost every patient looks "low probability" and a 0.5 rule would call them all healthy. The optimal threshold depends on prevalence and on which mistake you'd rather avoid; ROC analysis chooses it from the data.

#### Configuration

Available in the **Diagnostics** group when the regression type is binomial, multinomial, or ordinal:

- **Classification (ROC) analysis** — master toggle for the section
- **Optimal threshold rule** — how to pick the cutoff:
	- **Youden's J** — maximizes `sensitivity + specificity − 1` (the default; treats both error types as equally costly)
	- **Closest to (0, 1)** — picks the point on the ROC curve closest to the perfect-classifier corner
	- **Cost-weighted** — accepts a cost-asymmetry ratio (e.g. 3 = false negatives are 3× as costly as false positives) and reports both directions of the asymmetry so you can compare. *Binomial only* — cost asymmetry doesn't generalize cleanly to per-class or per-cutpoint thresholds.
- **Classification metrics at optimal threshold** — toggles the metrics table on/off
- **AUC confidence interval** — **DeLong** (analytic, fast) or **bootstrap** (no distributional assumptions). DeLong is hidden for multinomial because the multiclass aggregate AUC (Hand-Till M) requires bootstrap resampling; for ordinal each cutpoint is binary, so DeLong stays available.
- **ROC curve** — toggles the curve plot
- **Cross-validated AUC (out-of-sample)** — adds CV columns to the summary; reveals a **Number of folds (k)** input (default 10, stratified by outcome class) and a **Repetitions** input (default 10). Each repetition runs a full stratified k-fold with a different random seed; the CV CI is computed across repetitions and so reflects sampling of the modelling procedure rather than just sampling of a single fixed prediction set.

#### Binomial output

**Summary row** — AUC, AUC confidence interval, and Brier score. When CV is enabled, three more cells appear: CV AUC, CV CI, CV Brier, with a footer note recording the k value and the number of completed repetitions.

> **AUC, plain English:** the area under the ROC curve. 0.5 = the model is no better than coin flips; 1.0 = perfect separation. Read it as: pick a random positive case and a random negative case — AUC is the probability the model assigns the positive case a higher probability than the negative one. Conventional reading: 0.7–0.8 is acceptable, 0.8–0.9 is good, ≥ 0.9 is excellent.

> **Brier score:** mean squared error of the predicted probability against the true 0/1 outcome. Lower is better; a perfectly calibrated model has Brier = 0. AUC measures *discrimination* (can the model rank cases correctly?); Brier measures *calibration* (are the probabilities themselves trustworthy?). A model can rank well but be miscalibrated, and vice versa — both matter.

> **In-sample vs cross-validated AUC:** in-sample AUC uses the same data the model was fit on, so it tends to be optimistic — especially with many predictors. CV AUC refits the model on `k − 1` folds and predicts the held-out fold, repeating until every observation has an out-of-fold prediction; the AUC is then computed once on the pooled predictions. The whole procedure is repeated with several different random seeds, and the reported point estimate and confidence interval are the mean and t-based CI across repetitions — so the CI captures uncertainty in the modelling procedure itself, not just in a fixed prediction set. Treat CV AUC as the honest estimate; the gap between in-sample and CV AUC tells you how much the model is overfitting.

**Classification metrics at the optimal threshold** — when enabled, a small table with:

- **Threshold** — the cutoff value chosen by the selected rule
- **Sensitivity** (true positive rate) — of actual positives, how many the model catches
- **Specificity** (true negative rate) — of actual negatives, how many the model correctly rules out
- **PPV** (positive predictive value) — when the model predicts positive, how often it's right
- **NPV** (negative predictive value) — when the model predicts negative, how often it's right
- **Accuracy** — overall fraction correct

For the cost-weighted rule, two rows appear (one for each direction of the asymmetric cost), with a **Worse to misclassify** column flagging which error type the threshold was chosen to minimize.

**ROC curve** — false-positive rate on the x-axis, true-positive rate on the y-axis. The diagonal is the chance line; curves bowing toward the top-left corner indicate better discrimination. The optimal threshold(s) are marked as small dots on the curve — hover for the exact threshold value, sensitivity, specificity, PPV, and NPV.

#### Multinomial output

A multinomial model produces a *vector* of class probabilities for each observation (one per outcome class). ROC analysis treats each class in turn as the "positive" outcome ("class k vs all others") to get a per-class discrimination measure, then reports several aggregate statistics that summarize the model as a whole.

**Summary table** — one row per outcome class plus three aggregate rows. Columns: AUC, bootstrap CI, and (when CV is enabled) CV AUC + CV CI.

- **Per-class rows** — AUC of the one-vs-rest classifier for each outcome class. Useful for spotting which classes the model discriminates well and which it confuses.
- **Macro-average** — unweighted mean of the per-class AUCs. Treats every class equally regardless of prevalence — handy when rare classes matter as much as common ones. If a class is empty or all-positive in the sample, its AUC is undefined and the row label reads `Macro-average (used X/K classes)` so you can see how many entered the average.
- **Micro-average** — pools all per-class predictions and labels into one big binary ROC. Weighted by class prevalence, so dominated by the largest classes.
- **Hand-Till M (multiclass AUC)** — the principled multiclass generalization of AUC, computed as the average pairwise AUC. Insensitive to class imbalance. Treat this as the "headline" multiclass AUC for reporting.

> **Macro vs micro vs Hand-Till — which to report?** For balanced classes they tend to agree. For imbalanced data they can diverge: micro reflects bulk performance (good for production deployment), macro asks "how well do you do on the hardest class?", and Hand-Till M is the closest analogue to the binomial AUC concept. Reporting Hand-Till M is the safest single number; including macro alongside it adds the imbalance perspective for free.

**Multiclass Brier score** — `mean(rowSums((P − one_hot_Y)²))`. Calibration measure across all classes. Lower is better; a perfectly calibrated model has Brier = 0. Same calibration-vs-discrimination contrast as in the binomial case.

> **Argmax vs ROC — important caveat.** Per-class AUC measures *discrimination quality* — how well-ranked are class-k members against the rest? Actual classification at predict time uses **argmax** across class probabilities (the class with the highest probability wins), not per-class thresholding. So the [Goodness of fit](#goodness-of-fit) confusion matrix shows real classifier behavior; this section shows how separable each class is from the others, which is a related but distinct question.

**Per-class threshold metrics** — when enabled, one row per class with the optimal threshold and the same sens/spec/PPV/NPV/accuracy columns as the binomial table, plus a leading **Class** column. The threshold rule applies per class.

**ROC curve plot** — K colored curves overlaid on a single chart, one per class. Each curve gets its own AUC in the legend; threshold markers are colored to match.

#### Ordinal output

An ordinal model gives cumulative probabilities `P(Y ≤ k | x)` for each cutpoint between adjacent ordered categories. ROC analysis evaluates the model at each of the K−1 cutpoints in turn, treating "Y > level_k vs Y ≤ level_k" as a binary problem. This respects the ordering — unlike multinomial OvR, which would discard it.

**Summary table** — one row per cutpoint (labeled `{outcome} > {level}`) plus three rank-concordance summary rows. Columns: AUC / value, CI, and (when CV is enabled) CV AUC + CV CI.

- **Per-cutpoint rows** — binary AUC at each cumulative threshold. Each is a proper binary ROC, so DeLong CIs apply per cutpoint.
- **Mean cutpoint AUC** — unweighted mean of the per-cutpoint AUCs, with a row-bootstrap CI that resamples observations and recomputes the K−1 cutpoint AUCs together each replicate, so the CI properly reflects the correlation between cutpoints (they share rows).
- **Somers' D** — rank-based concordance between the model's latent linear predictor and the ordered outcome. Range [−1, 1]; magnitude analogous to AUC (Somers' D ≈ 2·AUC − 1 for binary outcomes).
- **Kendall's tau-c** — rank correlation that accounts for ties on the ordinal outcome. Range [−1, 1]; less sensitive to scale differences between predicted score and category count than tau-b.

> **Why both Somers' D and tau-c?** They answer slightly different questions about the same predictor-outcome ordering. Somers' D treats the predicted score as a continuous classifier of the ordinal outcome — closest in spirit to AUC. Kendall's tau-c is symmetric and adjusted for the discrete nature of the outcome categories. For most ordinal regression reports, either is acceptable; reporting both adds robustness with little extra space.

**Multiclass Brier score** — same formula as multinomial: `mean(rowSums((P − one_hot_Y)²))`. Calibration across the full K-class probability matrix.

> **Argmax vs cumulative cutpoints — important caveat.** Per-cutpoint AUC measures discrimination at each ordering threshold. Actual classification at predict time uses argmax across class probabilities, not per-cutpoint thresholding — so the [Goodness of fit](#goodness-of-fit) confusion matrix shows real classifier behavior; this section shows how cleanly the model separates outcomes at each ordering boundary.

> **Diagnostic value of per-cutpoint divergence.** When the proportional-odds assumption holds, the per-cutpoint AUCs and threshold metrics tend to look similar. When it's violated, they diverge — that divergence is itself useful diagnostic information. If the AUC at "Y > Disagree" is 0.85 but at "Y > Agree" is 0.62, the model isn't discriminating equally well across cutpoints, which can signal misspecification. Cross-reference with the proportional-odds test in [Goodness of fit](#goodness-of-fit).

**Per-cutpoint threshold metrics** — when enabled, one row per cutpoint with the optimal threshold and sens/spec/PPV/NPV/accuracy columns, plus a leading **Cutpoint** column.

**ROC curve plot** — K−1 colored curves overlaid on a single chart, one per cutpoint. Each curve gets its own AUC in the legend.

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
- **AUC**, **AUC CI**, **p (vs best)** — *binomial only.* AUC measures each model's discrimination; the p-value tests, via DeLong's paired test, whether each model's AUC differs significantly from the top-ranked model's. The top model itself shows "—" for the p-value. The raw p-values are corrected for multiplicity across the M−1 vs-best comparisons using the global [p-value adjustment method](./settings.md#multiple-comparison-adjustment); depending on the **Adjusted p-values display** setting, an **Adjusted p (vs best)** column appears alongside the raw column or replaces it. AIC and AUC don't always agree — AIC penalizes complexity, AUC doesn't, so a slightly worse-AIC model can have a comparable AUC. Use both lenses.
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
- For binomial logistic: AUC with confidence interval, threshold rule used, and metrics at the optimal threshold (sensitivity, specificity, PPV, NPV); cross-validated AUC if reported, with k
- For multinomial logistic: per-class AUCs, Hand-Till M (multiclass AUC) with bootstrap CI, multiclass Brier; note that classification at predict time uses argmax across class probabilities
- For ordinal logistic: per-cutpoint AUCs, Somers' D, Kendall's tau-c, multiclass Brier; cross-reference per-cutpoint divergence with the proportional-odds assumption check
- Effect size for the overall model
- Diagnostics: collinearity (VIF), residual normality, influential observations — at minimum note whether assumptions were checked
- For model comparison: top model(s), Akaike weights, variable importance; AUC and DeLong p-values for binomial outcomes
- For regularization: selected lambda, number of non-zero coefficients (LASSO), cross-validation error

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) — you can inspect, copy, or re-run the exact commands. Regression analysis uses base R (`lm`, `glm`) for classic linear and binomial models, `MASS` for ordinal logistic and negative binomial, `nnet` for multinomial logistic, `car` for collinearity diagnostics, `lmtest` for residual diagnostics, `ResourceSelection` for Hosmer-Lemeshow tests, `pROC` for ROC / AUC analysis (per-curve AUC + CI, DeLong's test for binomial AUC comparisons, and `multiclass.roc` for Hand-Till M), and `glmnet`, `ordinalNet`, or `mpath` for regularized estimation. Somers' D and Kendall's tau-c for ordinal models are derived from `cor(method = "kendall")` plus tied-pair counts — no extra packages required. Citations for R packages used in your analysis appear automatically at the top of the output section.

## Common pitfalls

**Confusing prediction with explanation.** A model with high R² predicts well, but that doesn't mean the coefficients reveal causal mechanisms. A predictor might correlate with the outcome only because both are caused by something you didn't measure (a confound). Regression estimates associations — causal claims require experimental design or specialized causal inference techniques.

**Too many predictors, too few observations.** A common rule of thumb is at least 10–15 observations per predictor. With 50 participants and 20 predictors, the model will likely overfit — it'll explain noise in your sample that won't replicate. Use [model comparison](#model-comparison) or regularization to find a more parsimonious model.

**Ignoring collinearity.** When predictors are highly correlated, individual coefficients become unreliable — small changes in the data can flip signs or dramatically change magnitudes. The model's overall fit may still be fine, but individual predictor effects can't be trusted. Check VIF and consider removing or combining correlated predictors.

**Treating stepwise selection as confirmatory.** Automated model selection (including model comparison) is exploratory — the "best" model is best *for this particular dataset*. It should be validated on new data or a hold-out sample before being treated as a confirmed finding. Report it as exploratory and note the number of models tested.

**Interpreting non-significant predictors as "no effect."** A non-significant coefficient means the effect couldn't be distinguished from zero *given the sample size and model*. It doesn't prove the predictor is irrelevant — it might matter in a larger sample, or its effect might be masked by collinearity with another predictor. Don't conclude "X has no effect on Y" from a single non-significant regression coefficient.