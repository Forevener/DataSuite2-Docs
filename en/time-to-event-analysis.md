---
title: Time to event analysis
description: Survival analysis in DataSuite 2 – Kaplan-Meier curves, Cox proportional hazards, parametric AFT and Gompertz fits, and competing-risks methods.
---

# Time to event analysis

The **Time to event analysis** module estimates how long it takes for something to happen – death, relapse, mechanical failure, customer churn – and how that timing depends on covariates. It supports five methods, three censoring patterns (right, interval, left-truncation), and competing-risks workflows when more than one kind of event is possible.

> **What is survival analysis?** Ordinary regression treats outcomes as values you observe in full. Survival data is different: many subjects haven't had the event yet when the study ends, so you only know they survived *at least* that long. That partial information is called censoring, and survival analysis is the family of methods built to handle it. The output is usually a survival curve – the probability of still being event-free at each time point – or a hazard model that shows how covariates speed up or slow down the event.

1. Pick a [time variable](#variable-roles) and an [event indicator](#event-indicator-and-level-roles)
2. Assign each observed level of the event indicator a [role](#event-indicator-and-level-roles) (censored, event, or competing causes)
3. Optionally add an [entry time](#entry-time-left-truncation), a [grouping variable](#grouping-and-strata), and [covariates](#covariates)
4. Choose an [analysis method](#analysis-methods) and a [censoring type](#censoring), then toggle [method-specific options](#method-specific-options)
5. Click **Calculate**

## Variable roles

The left column has the variable pickers; the right column has the method setup.

### Time variable

A non-negative numeric variable measuring duration from the start of follow-up to either the event or the end of observation. Days, months, and years all work – the unit only matters for interpreting the output. Negative values and missing values are dropped automatically.

### Event indicator and level roles

A categorical variable marking what happened to each subject. After picking it, a per-level table appears under **Level roles**: each observed value gets a dropdown where you assign one of these roles:

- **Censored** – the event did not occur (e.g. "alive", "0", "no")
- **Event** – the event occurred (single-event mode)
- **Event (cause 2)**, **Event (cause 3)**, **Event (cause 4)** – distinct causes for competing-risks analysis

Defaults follow common conventions: the values `0`, `false`, `no`, `censored`, and `alive` are pre-assigned to **Censored**; everything else to **Event**. Adjust as needed.

> **Why per-level roles?** Survival data uses different conventions in different fields – sometimes 0/1, sometimes "alive"/"dead", sometimes a multi-level cause-of-death code. Rather than asking you to recode the variable upfront, the module lets you map levels to roles in place. Two or more non-censored roles unlock the competing-risks methods automatically.

Blank and unparseable cells are not levels – they never get a role row, and the rows carrying them are counted among the [excluded rows](#dropped-rows-and-missing-data). If the event variable has more than 20 distinct values, role assignment is blocked – that's almost always a sign of picking a continuous variable by mistake. Recode it as a categorical event indicator first.

### Entry time (left-truncation)

Optional numeric variable for **delayed entry**: subjects join the risk set after time zero rather than from the start. Useful for age-as-time-scale analyses or when subjects enter a registry at varying ages.

> **What is left-truncation?** Imagine studying mortality after retirement using a registry. A retiree who joined at 70 wasn't *at risk* in the registry between 65 and 70 – that earlier window is left-truncated. Ignoring entry times biases survival estimates upward because you underweight people who entered the cohort late.

Left-truncation is not available with interval censoring or Fine-Gray regression – both refuse the combination outright. Two methods accept the variable but cannot honour it, and say so on the card: **cumulative incidence** ignores it entirely, and the **log-rank family tests** ignore it when computing the test (the curves themselves still account for it).

### Grouping and strata

Optional categorical variable. Its role depends on the method:

- In **non-parametric** analysis it splits the curves and unlocks the group-comparison test
- In **Cox regression** it stratifies the baseline hazard – each stratum gets its own baseline, while the coefficient effects are shared across strata. Under [interval censoring](#censoring) it enters as an ordinary factor covariate instead, because that estimator fits a single baseline
- In **parametric regression** it adds the variable as a fixed effect (a factor on the right-hand side)
- In **competing-risks regression** (cause-specific only) it stratifies the baseline; Fine-Gray ignores it (add it to covariates instead)

### Covariates

Multi-select list of predictors for regression methods (Cox, parametric, competing-risks regression). Categorical covariates are encoded as factors with the first sorted level as the reference; numeric covariates enter as-is. Non-parametric analysis and cumulative incidence pass no covariates to the fit, so the picker is hidden while either is selected – your selection is kept and comes back when you switch to a regression method.

## Censoring

| Type | When to use |
|---|---|
| **Right-censored** | The event time is known exactly when it occurs; otherwise we know the subject was event-free up to a known last-seen time. Default. |
| **Interval-censored** | The event time is only known to lie between two assessments (e.g. annual screening). Requires an upper-bound variable. |

**Left-truncation** is handled separately via the [entry time](#entry-time-left-truncation), not via the censoring dropdown. The two can combine on right-censored data.

When **Interval-censored** is selected an **Upper bound** picker appears. Pick a numeric variable holding the upper end of each interval, and use NA for right-censored rows (the time variable then carries the last-seen time).

> **Right vs. interval censoring:** in right-censored data we know exactly when the event happened, or that it hadn't happened by some known last-seen time. In interval-censored data we only know the event happened *between* two checks – typical of periodic screening. Treating an interval-censored event as if it occurred at the upper endpoint biases survival estimates downward.

Interval censoring is supported by the non-parametric, Cox, and parametric methods. Cumulative incidence and competing-risks regression require right-censored data, and the **Interval-censored** option is greyed out while either is selected – if you had it selected, the dropdown snaps back to **Right-censored** on the switch rather than failing after you press **Calculate**.

Each supported method reaches interval-censored data through a different estimator, not through its usual one: non-parametric analysis switches to Turnbull's NPMLE, parametric regression drops the Gompertz family, and Cox switches to a semiparametric fit with a [smaller output card](#interval-censored-cox-regression) and no diagnostics.

## Analysis methods

| Method | What it estimates | Required inputs |
|---|---|---|
| **Non-parametric survival curve** | S(t) (Kaplan-Meier) or H(t) (Nelson-Aalen) without distribution assumptions | Time, event |
| **Cox proportional hazards regression** | Hazard ratios for covariates, leaving the baseline hazard unspecified | Time, event, ≥ 1 covariate |
| **Parametric survival regression** | Survival curves and effects under a chosen distribution (Weibull, exponential, log-normal, log-logistic, Gaussian, Gompertz) | Time, event |
| **Cumulative incidence (competing risks)** | Cause-specific incidence functions when more than one event type is possible | Time, event with ≥ 2 non-censored roles |
| **Competing-risks regression** | Cause-specific Cox or Fine-Gray sub-distribution hazards | Time, event with ≥ 2 non-censored roles, ≥ 1 covariate |

The competing-risks methods are disabled in the dropdown until you assign at least two non-censored roles in the level-role table.

> **Non-parametric, semi-parametric, parametric:** non-parametric methods (Kaplan-Meier, Nelson-Aalen) make no assumption about the shape of the hazard – they're descriptive. Cox is *semi-parametric*: it leaves the baseline hazard unspecified but assumes covariate effects are multiplicative and constant over time. Parametric methods commit to a specific distribution (Weibull, log-normal, etc.) – riskier if the choice is wrong, but they let you extrapolate beyond the observed follow-up and produce smooth predictions.

## Method-specific options

The right column shows different cards depending on the chosen method.

### Non-parametric options

- **Estimator** – **Kaplan-Meier (product-limit)** or **Fleming-Harrington (exp(−Nelson-Aalen))**. This picks the *survival* estimator only: the cumulative-hazard plot is Nelson-Aalen either way. When **Interval-censored** is selected the setting is ignored and Turnbull's NPMLE is used automatically.
- **Group comparison test** – only enabled when a grouping variable is set:
  - **Log-rank (ρ = 0)** – the standard, weights events equally over time
  - **Peto-Peto (ρ = 1)** – weights early events more
  - **Fleming-Harrington (ρ = 0.5)** – intermediate weighting
  - **Skip test** – produce curves only
  - With three or more groups, pairwise comparisons run with the same weight and are corrected using the [p-value adjustment setting](./settings.md#multiple-comparison-adjustment) – whatever it is set to, **None** included, in which case the table is reported raw and a warning says so
- **Survival probabilities at** – space-separated time points (e.g. `12 24 36 60`; commas work too). Reported as S(t) with confidence bounds and risk-set size. Leave empty to use the quartiles of observed time.
- **Display** – toggles for the **Confidence interval band** and **Censoring tick marks** on the curve.

> **Choosing a log-rank weight:** the standard log-rank assumes the hazard ratio between groups is roughly constant over time. If you suspect the difference is biggest early on (e.g. a treatment that helps in the first months), Peto-Peto can be more powerful. Fleming-Harrington at ρ = 0.5 is a middle ground. Don't pick the weight after seeing which one gave the smallest p-value – that's p-hacking. Choose it from the substantive question.

### Cox regression options

- **Ties handling** – how the partial likelihood treats events that occur at exactly the same time:
  - **Efron** (default) – accurate and computationally cheap; the right choice for almost everyone
  - **Breslow** – simpler approximation; biased when ties are common
  - **Exact partial likelihood** – exact but slow; matches Efron in practice unless tie counts are extreme
- **Robust (sandwich) variance** – uses Huber-White SEs. Use this when observations may be clustered or the model is mildly misspecified.
- **Diagnostics** (each toggle adds an output section):
  - **Proportional hazards test (Schoenfeld residuals)** – `cox.zph` per term plus a global test, with residual scatter overlaid by a loess smoother
  - **Log-log plot vs grouping variable** – log(−log S(t)) curves; parallel lines support the proportional-hazards assumption
  - **Functional form check (martingale residuals)** – one residuals-vs-covariate panel per continuous covariate, with a loess smoother – non-flat smoothers suggest a non-linear effect
  - **Influence diagnostics (dfbetas)** – per-subject change in each coefficient if that subject were removed; reported as max and mean absolute dfbetas plus a per-subject scatter
  - **Concordance (C-index)** – a discrimination metric (0.5 = chance, 1.0 = perfect ranking)

Every control above belongs to the partial-likelihood fit, so none of it applies to [interval-censored](#censoring) data – selecting **Interval-censored** hides this card entirely.

#### Non-proportional hazards

When the proportional-hazards assumption fails for one covariate, you can let that covariate's effect change over time instead of dropping the model.

- **Time-varying coefficient (piecewise by time interval)** – reveals two more controls:
  - **Covariate with a time-varying effect** – lists the covariates you selected, so pick the term `cox.zph` flagged. Only one covariate at a time.
  - **Interval boundaries** – space-separated time points (e.g. `12 24`) splitting follow-up into periods. Leave empty to split at the tertiles of the observed event times.

The follow-up is cut at those boundaries, and the chosen covariate is estimated separately within each period; every other covariate keeps a single, proportional effect. A boundary that would open or close a period holding no events is dropped, and if nothing usable survives the card says so instead of reporting a fit.

> **Time-varying coefficient vs. time-dependent covariate:** these sound alike and are not the same. Here the covariate's *value* is fixed at baseline and only its *effect* is allowed to change – that is what fixes a PH violation. A time-dependent covariate is one whose value changes during follow-up (a treatment started mid-study, a lab value re-measured); the module does not fit those, and faking one by defining groups from later events causes [immortal time bias](#common-pitfalls).

> **Reading the interval hazard ratios:** an effect that wears off shows up as HRs drifting toward 1 across the periods – e.g. 0.28, 0.52, 1.03 for a treatment that helps early and stops mattering later. The single averaged HR from the proportional fit (0.50, say) hides exactly that. The **Test of proportionality** table is the formal check: it compares the constant-effect fit against the piecewise one, so a small p means the effect genuinely moves.

### Parametric regression options

- **Distribution family**:

  | Family | Type | Notes |
  |---|---|---|
  | **Weibull** | AFT | Flexible monotone hazard; reduces to exponential when shape = 1 |
  | **Exponential** | AFT | Constant hazard – strong assumption, useful as a baseline |
  | **Log-normal** | AFT | Hazard rises then falls; useful for "hump-shaped" risk |
  | **Log-logistic** | AFT | Similar shape to log-normal, lighter tails |
  | **Gaussian** | AFT | Linear regression in the time scale; rarely the right pick |
  | **Gompertz (proportional hazards)** | PH | Exponentially increasing hazard – common in adult-mortality models |
  | **Compare all (AIC ranking)** | – | Fits every family, reports the best-AIC fit, and shows an AIC ranking table and bar plot |

  AFT models report **time ratios** (a coefficient × time), Gompertz reports **hazard ratios**.
- **Overlay fitted curves on Kaplan-Meier** – adds a comparison plot of the parametric survival curve against the non-parametric KM reference, split by the grouping variable when one is set.

> **AFT vs. PH:** in a proportional-hazards model (Cox, Gompertz) a covariate multiplies the hazard. In an accelerated-failure-time model (Weibull, log-normal, log-logistic, Gaussian) it stretches or shrinks the time scale – a time ratio of 1.5 means the covariate makes events happen 1.5× later, on average. AFT effects are sometimes more intuitive to clinicians because they're expressed in time units.

> **Gompertz with interval censoring:** Gompertz is fit via `eha::phreg`, which doesn't accept interval-censored input. The option is unavailable when interval censoring is selected, and **Compare all** drops Gompertz from the comparison automatically.

### Competing-risks regression options

- **Approach**:
  - **Cause-specific hazards (Cox per cause)** – fits a separate Cox model per cause, treating the other causes as censored. Answers "what predicts this cause among those still event-free?"
  - **Fine-Gray subdistribution hazards** – models the cumulative incidence directly via `cmprsk::crr`. Answers "what predicts experiencing this cause first?"

With **Cause-specific hazards** selected, a **Cause-specific Cox options** card appears with the same **Ties handling** and **Robust (sandwich) variance** controls as [Cox regression](#cox-regression-options) – it is a Cox fit per cause, so it takes the same settings. The Cox diagnostics block stays out: those are per-model checks, and this approach fits one model per cause.

> **Cause-specific vs. Fine-Gray:** the two answer different questions and can give different signs. Cause-specific hazards describe the *etiology* of each cause among current survivors. Fine-Gray sub-distribution hazards describe the *prognosis* – how a covariate shifts the eventual cumulative incidence, accounting for the fact that competing events block the cause of interest. For decision-making at the patient level, Fine-Gray is often more useful; for biological mechanism, cause-specific.

## Sample size and EPV checks

Before fitting any regression, the module checks the events-per-variable (EPV) ratio:

- **Events < parameters** – fit blocked with an error; reduce covariates or get more data
- **Events < 10 × parameters** – non-blocking warning; the rule of thumb is ≥ 10 events per parameter for stable estimates

Effective parameter count is the sum of covariate degrees of freedom: one per numeric covariate, *(levels − 1)* per factor. Parametric fits add one for the scale parameter – two for Gompertz, which has scale and shape, and none for the exponential family, whose scale is fixed at 1 – and count the grouping variable too, since it enters as an ordinary factor there rather than as a stratum. [Interval-censored Cox](#interval-censored-cox-regression) counts it for the same reason. A Cox fit with a [time-varying coefficient](#non-proportional-hazards) spends one extra parameter per additional time interval, and the check counts those before fitting. For competing-risks regression the check uses the smallest-event cause as the worst case, since each cause is its own model.

> **Why ten events per variable?** With fewer events than parameters the partial likelihood is singular – there are infinitely many coefficient combinations that fit the data equally well, and you'll see implausible standard errors. Even with a feasible fit, sub-10 EPV makes coefficients sensitive to single observations and gives unreliable hazard-ratio confidence intervals.

## Reading results

Each run produces an output card titled with the method, the time variable, and the event variable. In **Compare all** parametric mode the title also names the family that won the AIC ranking.

### Non-parametric survival

- **Curve summary** – N, events, censored, median survival with its confidence interval (the header names the level), and (for Kaplan-Meier / Fleming-Harrington) restricted mean survival time (RMST) with its standard error. Median is reported as `–` when more than half the subjects are still at risk at the longest follow-up. A note under the table names the τ the RMST was restricted to.
- **Survival probabilities at time points** (when **Survival probabilities at** is filled in) – S(t), confidence bounds, and number at risk for each requested time per stratum. A requested time past a stratum's last observation is greyed out with a footnote: the value there is the last estimate carried forward, not an observed one.
- **Group comparison** – log-rank-family chi-square, df, and p-value (omitted when the test is set to **Skip test** or no grouping is selected).
- **Pairwise comparisons** (three or more groups) – chi-square, df, raw p, and adjusted p per pair. Adjustment follows the [global p-value setting](./settings.md#multiple-comparison-adjustment) exactly, and a note names the method that ran.
- **RMST difference** (two or more groups) – Δ RMST per group pair with its confidence interval, SE, z, and p, all at the same τ as the summary table. Adjusted separately from the log-rank family, since the two answer different questions.
- **Survival curve plot** – Kaplan-Meier, Fleming-Harrington, or Turnbull NPMLE curves with optional CI band and censoring ticks, plus a **N at risk** strip under the axis reading the risk set at each tick, one row per stratum.
- **Cumulative hazard plot** – Nelson-Aalen H(t) over time, with a band built from the Nelson-Aalen standard error so it is centred on the plotted curve. Skipped for Turnbull (the Icens fit doesn't expose a usable hazard).

With interval censoring, any stratum whose Turnbull NPMLE failed to converge is named in a warning – those strata have no curve and no median.

> **What is RMST?** Restricted mean survival time is the area under the survival curve up to a chosen cut-off τ – interpreted as the average event-free time over that window. Unlike the median, it's defined even when fewer than half the subjects have had the event, and it has a clean clinical meaning ("treatment adds 4.2 months of event-free survival over 5 years"). Here τ is the largest horizon **every** stratum actually reaches, so no arm is extrapolated past its own follow-up and the strata stay comparable; the card names the τ that was used.

> **Confidence bands on survival curves:** the band shows pointwise confidence intervals on S(t). Curves whose bands separate clearly suggest a real group difference, but the formal test is the log-rank in the **Group comparison** table.

### Cox regression

- **Model summary** – N, events, ties method, robust-SE flag.
- **Coefficients** – one row per term (factor levels expanded). Columns:
  - **HR** – hazard ratio with confidence interval
  - **log(HR)** – the raw coefficient
  - **SE** – standard error
  - **z** with significance stars
  - **p** value
- **Overall tests** – likelihood ratio, Wald, and score (log-rank) χ², df, p. They test the joint null that all coefficients are zero.
- **Concordance (C-index)** (when enabled) – value and SE.
- **Hazard ratio forest plot** – log-scale forest with reference line at HR = 1. A term whose hazard ratio isn't estimable is left out of the plot and named in a note under it, rather than disappearing silently.
- **Proportional hazards test** (when enabled) – per-term and global χ² from `cox.zph`. A significant result means the term's effect changes over time.
- **Schoenfeld residuals** – scatter of scaled residuals over time, one panel per term, with a loess smoother. A non-flat smoother is the visual analogue of a significant `cox.zph`.
- **Time-varying coefficient: {covariate}** (when enabled) – one row per time interval, carrying the interval's events, HR with confidence interval, log(HR), SE, z and p; a categorical covariate gets one row per interval × non-reference level. Followed by **Test of proportionality** – the likelihood-ratio test of the constant-effect model against the time-varying one – and a **Hazard ratios by time interval** forest. Only the chosen covariate is freed; every other term stays proportional.
- **Log-log plot** (when enabled and a grouping variable is set) – log(−log S(t)) by stratum. Roughly parallel curves support PH at the strata level.
- **Martingale residuals** (when enabled) – one panel per continuous covariate, with the covariate on the x-axis and the residual on the y-axis. A non-flat loess smoother suggests the covariate enters non-linearly.
- **Influence (dfbetas summary)** + **Dfbetas residuals per subject** (when enabled) – max and mean absolute dfbetas per term, plus a per-subject scatter for spotting individual outliers.
- **Baseline survival** – `survfit.coxph` reference curve(s); numeric covariates are evaluated at their sample mean and factor covariates at their reference level (not at zero), so the curve is the survival of an "average" subject.

> **Reading hazard ratios:** HR = 1 means the predictor has no effect on the hazard. HR = 2 means the hazard is doubled per one-unit increase. HR = 0.5 means it's halved. The CI is the part you check first – if it crosses 1, the effect isn't significant. For a binary 0/1 covariate the HR is the ratio of hazards between the two groups, controlling for the other terms.

> **What does a violated PH assumption mean?** A significant `cox.zph` says the hazard ratio for that term isn't constant over time – the covariate's effect grows or shrinks as follow-up accumulates. The fitted HR is then a kind of weighted average across the follow-up window. Common fixes: stratify on the offending variable, fit a [time-varying coefficient](#non-proportional-hazards) for the term the test flagged, or switch to a parametric model where the time-shape can be inspected directly.

### Interval-censored Cox regression

Choosing **Cox proportional hazards regression** together with **Interval-censored** data fits a different estimator – `icenReg::ic_sp`, a semiparametric proportional-hazards model that reads each subject's event time as a bracket rather than a point. It still reports hazard ratios, but it has no partial likelihood behind it, so the card is a much shorter one than the exact-time Cox card above.

- **Model summary** – N, events, **Turnbull intervals**, **Bootstrap samples**, and log L.
  - **Turnbull intervals** – how many distinct intervals the non-parametric baseline resolved the data into. It is driven by how the brackets overlap, not by the sample size: a shared annual visit grid yields a handful, continuous bounds many more. It is also what the runtime scales with, which is why the card reports it.
  - **Bootstrap samples** – the number of resamples the run actually used, taken from the [bootstrap replications setting](./settings.md#bootstrap-replications).
- **Coefficients** – one row per term (factor levels expanded), with **HR** and its confidence interval, **log(HR)**, **SE (bootstrap)**, **z**, and **p**. Every standard error, bound and p-value in this table is a bootstrap quantity.
- **Hazard ratio forest plot** – the same log-scale forest as the exact-time card, with the reference line at HR = 1.
- **Baseline survival** – the fitted step curve with numeric covariates at their sample mean and factor covariates at their reference level, one curve per level when a grouping variable is set. No confidence band is drawn: the semiparametric fit does not supply one.

A note on the card names the estimator and lists what it cannot produce. The proportional-hazards test, Schoenfeld and martingale residuals, the log-log plot, influence diagnostics, concordance, and the overall LR / Wald / score tests are all absent – each is a partial-likelihood quantity, and this fit has none. That is also why the [Cox regression options](#cox-regression-options) card disappears when you switch the censoring type.

A grouping variable is **not** a stratum on this path. The estimator fits a single baseline, so the variable is added as an ordinary factor covariate – one term per non-reference level, its own rows in the coefficient table, and its own share of the [EPV budget](#sample-size-and-epv-checks). A second note on the card says so, so a group effect is never read as a stratified fit.

> **The bootstrap is the whole bill.** The point estimates are quick; every standard error, confidence interval and p-value is paid for by re-fitting the model once per bootstrap sample. Cost rises with the replication setting and with the Turnbull-interval count, so panel data on a coarse visit grid is far cheaper than continuous brackets. A long run stays cancellable throughout, and both numbers appear on the finished card so you can judge the next run. The setting's floor is 10, so lowering it is how you trade interval precision for speed; should the count ever reach the fit as 0, the table shows point estimates with dashes in the SE, CI and p columns, and a warning on the card explains why.

> **Interpreting the hazard ratios:** they mean what they mean in an exact-time Cox model – HR = 2 doubles the hazard per one-unit increase – but you cannot check the proportional-hazards assumption they rest on within this card. If PH matters to your conclusion and your data admits it, fit the exact-time Cox on imputed midpoints as a sensitivity check and compare, rather than reporting the interval fit as if the assumption had been tested.

### Parametric regression

- **Model summary** – distribution, N, events, AIC, log-likelihood, scale parameter (where applicable).
- **AIC ranking** (Compare all mode) – every family's AIC, ΔAIC, log-likelihood, and convergence flag, sorted best-first. Followed by an **AIC by distribution** bar plot whose bars are ΔAIC from the best fit, with the absolute AIC in the bar label. Any family that failed to fit stays in the ranking with a ✗ and is listed underneath with the message R returned, so a missing family is never silent.
- **Coefficients** – same shape as Cox, but the exponentiated column is **Time ratio** for AFT families and **HR** for Gompertz. Distribution parameters (`Log(scale)`, `log(shape)`) appear as separate rows at the bottom – these are not covariate effects.
- **Kaplan-Meier vs parametric fit** (when **Overlay fitted curves on Kaplan-Meier** is on) – KM reference (with CI band) and the smooth parametric curve. Curves split by the grouping variable when one is set. The smooth curve uses numeric covariates at their mean and factor covariates at the reference level.

> **Reading time ratios:** in an AFT model, time ratio = exp(coefficient). A time ratio of 1.4 for a binary covariate means events occur 1.4× later (40% later) for that group on average. Smaller time ratios mean earlier events.

> **AIC ranking caveat:** AIC compares fits on the same data, so the ranking is meaningful, but lower AIC isn't a guarantee that the winning family is "right". Always sanity-check the overlay plot – a parametric curve that systematically misses the KM in the tail is a red flag even if the AIC is lowest.

### Cumulative incidence (competing risks)

- **Group summary** – N, total events, and censored count, one row per group.
- **Cumulative incidence summary** – events per group × cause.
- **Gray's K-sample test** (when a grouping variable is set) – χ², df, p per cause. Tests whether the cumulative incidence functions differ across groups for that cause.
- **Pairwise comparisons** (three or more groups) – χ², df, raw p, and adjusted p for each group pair × cause. **Each cause is its own adjustment family**: p-values are corrected within a cause, matching the per-cause omnibus tests above, and never across causes. A note under the table names the method that ran.
- **Cumulative incidence curves** – F(t) per cause × group. Confidence bounds use a complementary log-log transform on F.

An entry-time variable cannot be used here – cumulative incidence has no left-truncation path, so the card warns that the variable was ignored and every subject treated as followed from time zero.

> **Cumulative incidence vs. 1 − KM:** treating non-cause-of-interest events as censored and reporting 1 − KM systematically over-estimates the cause-specific incidence – it pretends competing events would eventually convert into the cause of interest if you waited long enough. The CIF (Aalen-Johansen / `cmprsk::cuminc`) divides the hazard so that all causes' incidences sum to 1 minus event-free survival.

### Competing-risks regression

- **Fit summary** – N, events, and convergence flag per cause.
- **Cause-specific hazards: {cause}** or **Sub-distribution hazards: {cause}** – coefficient table per cause. Sub-distribution columns use **sHR** (sub-distribution hazard ratio) and **log(sHR)** instead of HR / log(HR).
- **Overall tests: {cause}** (cause-specific only) – LR / Wald / score per fit, same shape as Cox.
- **HR forest plot** (cause-specific) or **sHR forest plot** (Fine-Gray) – combined forest with one row per (cause, term).

If a cause's fit fails to converge (small subgroup, separation, or numerical issues) it appears as a warning row instead of a coefficient table.

## Dropped rows and missing data

Each output card ends with a "rows excluded" note when any data was dropped, and the count covers every reason below:

- A non-finite or negative time
- A blank event level, or an event level that wasn't assigned a role
- For interval censoring: an upper bound that's missing (when the event occurred) or smaller than the lower bound
- A missing grouping or entry-time value
- An entry time that isn't strictly earlier than the event or censoring time – such a subject is at risk for no time at all and carries no information
- A missing covariate value (for regression methods)

This is method-local listwise deletion – the [global missing-data setting](./settings.md#missing-data) does not apply here, since survival analysis needs exact follow-up times to be meaningful.

## Reporting checklist

**Method:**
- Time variable, event indicator, and how each event level was assigned a role
- Censoring scheme (right vs. interval; left-truncation if used)
- Method (Kaplan-Meier, Cox, parametric Weibull, etc.) and any assumptions checked
- For Cox: ties handling, robust SE if used, diagnostics performed, and – when a time-varying coefficient was fitted – which covariate carried it and where the interval boundaries fell
- For interval-censored Cox: the estimator (`icenReg::ic_sp`), the bootstrap replication count behind the standard errors, and a statement that the proportional-hazards assumption could not be tested
- For parametric: family chosen and (when comparing) selection criterion
- For competing risks: cause-specific or Fine-Gray, definition of each cause
- Covariates and how factor reference levels were chosen
- N before and after exclusions; events per cause where applicable

**Results:**
- Median survival (or RMST, naming the τ it was restricted to) per group with confidence intervals
- Survival probabilities at the clinically relevant time points
- For comparison tests: test (log-rank / Peto-Peto / Fleming-Harrington / Gray), χ², df, p; pairwise adjusted p and the adjustment method where applicable – or a statement that the family was left uncorrected
- For an RMST comparison: Δ RMST per pair with its confidence interval, and the τ both arms were restricted to
- For Cox: HRs with CIs, overall test χ²/p, and an explicit statement on the proportional-hazards assumption – with the per-interval HRs and the proportionality likelihood-ratio test when a time-varying coefficient was fitted
- For interval-censored Cox: HRs with their bootstrap CIs, the number of Turnbull intervals the fit resolved, and the replication count – there is no omnibus test to report
- For parametric: time ratios (or HRs for Gompertz) with CIs, AIC, and the comparison table where relevant
- For competing-risks regression: per-cause coefficient table with the appropriate hazard label (HR or sHR)

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. The module uses `survival` (Kaplan-Meier, Nelson-Aalen, log-rank, Cox, parametric AFT, time-varying coefficients), `eha` (Gompertz proportional-hazards fit), `Icens` (Turnbull NPMLE for interval censoring), `icenReg` (semiparametric proportional hazards for interval-censored data), and `cmprsk` (cumulative incidence and Fine-Gray subdistribution regression). The interval-censored Cox bootstrap is seeded from the [bootstrap seed setting](./settings.md#bootstrap-seed), so setting it makes those standard errors reproducible run to run. Confidence levels follow the [global confidence setting](./settings.md#confidence-level) and are named in the column headers, so a card left on screen always says which level produced it. The pairwise comparisons – log-rank, RMST difference, and Gray – honour the [p-value adjustment setting](./settings.md#multiple-comparison-adjustment) as chosen, **None** included: the table is then reported uncorrected and a warning says so. Citations for the R packages *and* the statistical methods used in your analysis appear automatically at the top of the output card.

## Common pitfalls

**Treating censored as event-free forever.** Censoring means the event hadn't occurred *as of last contact*, not that it never will. Reports like "75% survived" should always cite a follow-up window – KM medians are undefined when more than half the subjects are still at risk.

**Ignoring competing risks.** If subjects can experience more than one kind of event and you analyse one cause as if the other simply censored those subjects, 1 − KM over-estimates the cause-of-interest incidence. Use cumulative incidence (or Fine-Gray) when competing events are non-trivial.

**Checking proportional hazards only globally.** A non-significant global `cox.zph` doesn't mean every term is fine – a single term can violate PH while the global test stays clean. Always look at the per-term test and the Schoenfeld residual plots.

**Choosing a parametric distribution by AIC alone.** AIC ranks fits within your data but doesn't guarantee any of them describes the true hazard well. Compare the parametric overlay against the KM curve before reporting an AFT effect.

**Informative censoring.** Survival methods assume that subjects who are censored are no different in risk from those still at risk. If censoring is driven by worsening prognosis (sick patients drop out), the KM and Cox results are biased – and there's no built-in fix. Document the censoring mechanism in your write-up.

**Immortal time bias.** Defining group membership using something that happens *during* follow-up (e.g. "patients who eventually got drug X") gives those subjects a guaranteed event-free window before they could possibly be classified, biasing the comparison. Define groups using only baseline information, or use a time-dependent covariate – one whose *value* changes during follow-up, which this module does not support (pre-process the data via the [R console](./r-console.md) for now). The Cox [time-varying coefficient](#non-proportional-hazards) option is a different tool: there the covariate value is fixed and only its *effect* is allowed to change.
