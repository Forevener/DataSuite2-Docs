---
title: Time to event analysis
description: Survival analysis in DataSuite 2 – Kaplan–Meier curves, Cox proportional hazards, parametric AFT and Gompertz fits, and competing-risks methods.
---

# Time to event analysis

The **Time to event analysis** module estimates how long it takes for something to happen – death, relapse, mechanical failure, customer churn – and how that timing depends on covariates. Pick a time variable and an event variable, give each level of the event variable a role, choose one of five methods – non-parametric curves, Cox regression, parametric regression, cumulative incidence or competing-risks regression – and the censoring pattern the data follows, and read one card per run: its tables, its plots, and the notes saying what the fit could and could not do. {#time-to-event-analysis #survival-by-event #survival-event #cox-regression-strata-event #cox-regression-event #interval-censored-cox-regression-event #parametric-compare-all-by-event #parametric-compare-all-event #parametric-by-event #parametric-event #cumulative-incidence-by-event #cumulative-incidence-event #competing-risks-strata-event #competing-risks-event}

> **New to survival data?** Its outcome is a wait that may still be going on when the study ends, and every method here counts a subject for exactly as long as they were watched – see [survival analysis](./concepts/survival.md#b-survival-analysis) and [censoring](./concepts/survival.md#b-censoring).

1. Pick a [time variable](#time-variable) and an [event variable](#event-indicator-and-level-roles)
2. Give each observed level of the event variable a [role](#event-indicator-and-level-roles) – censored, event, or one of up to four causes
3. Optionally add an [entry-time variable](#entry-time-left-truncation), a [grouping variable](#grouping-and-strata) and [covariates](#covariates)
4. Choose an [analysis method](#analysis-methods) and a [censoring type](#censoring), then set the [method-specific options](#method-specific-options)
5. Click **Calculate**

## Variable roles

The left column holds the variable pickers – the time and event variables at the top, the optional roles in the accordion below – and the right column the method setup. Every picker lists the variables selected with **Variables**; a picker's placeholder is its state before a choice.

### Time variable

- **Time variable** – the duration from the start of follow-up to the event or to the last observation, as a non-negative number in whatever unit the data uses – days, months, years; the unit only matters for reading the output. Must be numeric, or the run stops with a message. A row whose time is missing, non-numeric or negative is dropped and counted in the card's [excluded-rows note](#dropped-rows-and-missing-data); zero is kept. Under [interval censoring](#censoring) it is the lower end of each subject's bracket.
- **Select time variable** – the placeholder: no method runs until a time variable is chosen.

### Upper bound

Shown only while **Interval-censored** is selected.

- **Upper bound variable** – the upper end of each subject's interval, for data where the event is known only to have happened between two assessments: a numeric variable holding the first assessment at which the event was found, left empty (NA) for subjects who never had it, whose time variable then carries their last event-free assessment. A row with the event whose upper bound is missing or smaller than its time is dropped and counted. Required under interval censoring, and must be numeric.
- **Select upper-bound variable** – the placeholder: an interval-censored run stops with a message until it is filled.

### Event indicator and level roles

- **Event variable** – the categorical variable saying how each subject's follow-up ended. Picking it fills the **Level roles** table below with one row per observed value; a blank or unparseable cell is not a level, and its row is dropped and counted. A variable with more than 20 distinct values is refused for role assignment – almost always a continuous variable picked by mistake – and has to be recoded as a discrete indicator first. At least one of its levels must carry a non-censored role, or the run stops with a message.
- **Select event variable** – the placeholder: the role table reads *Select an event variable to see its levels* until one is chosen.
- **Level roles** – one dropdown per observed level of the event variable, each set to one of five roles. The defaults follow common conventions: a level reading `0`, `false`, `no`, `censored` or `alive` – in any case, spaces trimmed – is pre-assigned **Censored**, and the other levels, in sorted order (numeric when every level is a number, alphabetical otherwise), are pre-assigned **Event**, **Event (cause 2)**, **Event (cause 3)** and **Event (cause 4)** in turn; a fifth non-censored level and beyond default to **Event (cause 4)** as well. Adjust as needed – your picks are remembered per variable, so switching to another event variable and back restores them. Mapping levels in place is what lets one dataset be read as `0`/`1`, as "alive"/"dead" or as a multi-level cause code without recoding it, and two or more non-censored roles unlock the competing-risks methods.
- **Censored** – the event did not occur during the subject's follow-up: the row counts among those at risk up to its time and then leaves without an event – see [censoring](./concepts/survival.md#b-censoring).
- **Event** – the event occurred at the subject's time. Under a single-event method every non-censored role is read as this one event; under a competing-risks method it is the first cause.
- **Event (cause 2)** – a second, competing kind of event, for the competing-risks methods: a subject who had it can no longer have the first – see [competing risks](./concepts/survival.md#b-competing-risks). Under a single-event method it counts as an event like any other.
- **Event (cause 3)** – the third cause, read as **Event (cause 2)** is.
- **Event (cause 4)** – the fourth and last cause: the competing-risks methods accept at most four.

### Entry time (left-truncation)

- **Entry-time variable** – an optional numeric variable for delayed entry: the time at which each subject came under observation, when that is later than time zero – age-as-time-scale analyses, registries that subjects join at varying ages – see [left truncation](./concepts/survival.md#b-left-truncation). A subject is then counted at risk only from their entry time on. The entry time must be strictly earlier than the subject's time, or the row is dropped and counted – such a subject was at risk for no time at all – and a missing entry time drops the row too. The variable is honoured by the survival curves, Cox regression, parametric regression and cause-specific competing-risks regression; the [group comparison test](#non-parametric-options) and [cumulative incidence](#analysis-methods) cannot use it and say so on the card; [interval censoring](#censoring) and Fine-Gray regression refuse the combination before the run.
- **None** – the default: every subject is followed from time zero. {#entry-time-variable-none}

### Grouping and strata

- **Grouping variable** – an optional categorical variable whose role depends on the method. Under **Non-parametric survival curve** it splits the curves, one per level, and unlocks the **Group comparison test**; under **Cox proportional hazards regression** it stratifies the baseline hazard – each level gets its own baseline while the coefficients are shared, so no hazard ratio is estimated for it – see [proportional hazards](./concepts/survival.md#b-proportional-hazards); under **Parametric survival regression** it enters as a factor covariate on the right-hand side, with the first level as reference; under **Cumulative incidence (competing risks)** it defines the groups whose incidence curves are compared; under **Competing-risks regression** it stratifies the cause-specific fits and is ignored by Fine-Gray, whose card says so – add it to the covariates instead. Under [interval censoring](#censoring) the Cox fit cannot stratify either, so the variable enters as a factor covariate and the card says so. A row whose grouping value is missing is dropped and counted.
- **None** – the default: one curve, one baseline, no comparison test. {#grouping-variable-none}

### Covariates

- **Covariates** – the predictors of the regression methods: Cox, parametric and competing-risks regression, of which Cox and competing-risks regression need at least one. A categorical covariate is coded as a factor with its first sorted level as the reference – see [dummy coding](./concepts/regression-basics.md#b-dummy-coding); a numeric one enters as it is. A row with any covariate missing is dropped and counted. The grouping variable cannot also be a covariate under Cox, parametric or cause-specific regression, which already put it in the model, so the run is refused; Fine-Gray, which ignores it, takes it as one. The picker is hidden while **Non-parametric survival curve** or **Cumulative incidence (competing risks)** is selected, since neither fits covariates; the selection is kept and comes back when you switch to a regression method. **Deselect all** clears the list and **Invert selection** flips it.

## Censoring

- **Censoring** – which pattern the time variable follows. Left truncation is not a censoring type: it is the [entry-time variable](#entry-time-left-truncation), and it combines with right-censored data only.
- **Right-censored** – the default: an event's time is known exactly, and a censored subject is known to have been event-free up to their recorded time – see [censoring](./concepts/survival.md#b-censoring). Every method accepts it.
- **Interval-censored** – an event's time is known only to lie between two assessments, so each subject with the event carries a bracket: the time variable as its lower end and the **Upper bound variable**, which this choice reveals, as its upper end – see [interval censoring](./concepts/survival.md#b-interval-censoring). Available with the non-parametric, Cox and parametric methods, each of which reaches the data through a different estimator than its usual one: the survival curve becomes Turnbull's NPMLE, whatever the **Estimator** says; Cox becomes a semiparametric fit with a [shorter card](#interval-censored-cox-regression) and no diagnostics; parametric regression fits the AFT families and refuses **Gompertz (proportional hazards)**. Cumulative incidence and competing-risks regression need right-censored data, so the option is greyed out while either is selected and the dropdown snaps back to **Right-censored** on the switch. An entry-time variable cannot be combined with it, and the run stops with a message.

> **Right or interval?** If you know when each event happened, right-censored; if you only know that it fell between two checks – periodic screening, scheduled inspections – interval-censored, since placing the event at the visit that found it biases the curve down. See [interval censoring](./concepts/survival.md#b-interval-censoring).

## Analysis methods

| Method | What it estimates | Required inputs |
|---|---|---|
| **Non-parametric survival curve** | S(t) (Kaplan-Meier or Fleming-Harrington) and the Nelson-Aalen H(t), with no distribution assumed | Time, event |
| **Cox proportional hazards regression** | Hazard ratios for covariates, leaving the baseline hazard unspecified | Time, event, ≥ 1 covariate |
| **Parametric survival regression** | Survival curves and effects under a chosen distribution (Weibull, exponential, log-normal, log-logistic, Gaussian, Gompertz) | Time, event |
| **Cumulative incidence (competing risks)** | Cause-specific incidence functions when more than one kind of event is possible | Time, event with ≥ 2 non-censored roles |
| **Competing-risks regression** | Cause-specific Cox or Fine-Gray sub-distribution hazards | Time, event with ≥ 2 non-censored roles, ≥ 1 covariate |

- **Analysis method** – which of the five methods the run fits; the right column's option card follows the choice. The two competing-risks methods are disabled until the **Level roles** table holds at least two non-censored roles.
- **Non-parametric survival curve** – survival and cumulative-hazard curves that assume nothing about the hazard's shape, split by the grouping variable when one is set, with medians, restricted mean survival times, survival at requested time points and the log-rank family of tests – see [Kaplan–Meier estimate](./concepts/survival.md#b-kaplan-meier-estimate). Takes no covariates. Its options are the [Non-parametric options](#non-parametric-options) and its card is read under [Non-parametric survival](#non-parametric-survival).
- **Cox proportional hazards regression** – hazard ratios for one or more covariates, with the baseline hazard left unspecified and the grouping variable, if any, as strata – see [proportional hazards](./concepts/survival.md#b-proportional-hazards). Needs at least one covariate. Its options are the [Cox regression options](#cox-regression-options) and its card is read under [Cox regression](#cox-regression) – or, under interval censoring, [Interval-censored Cox regression](#interval-censored-cox-regression).
- **Parametric survival regression** – a fit under a chosen distribution family, with or without covariates, reporting time ratios for the AFT families and hazard ratios for Gompertz, or every family ranked by AIC – see [accelerated failure time](./concepts/survival.md#b-accelerated-failure-time-aft). Its options are the [Parametric regression options](#parametric-regression-options) and its card is read under [Parametric regression](#parametric-regression).
- **Cumulative incidence (competing risks)** – the cumulative incidence function of each cause, by group when a grouping variable is set, with Gray's test across the groups – see [cumulative incidence function](./concepts/survival.md#b-cumulative-incidence-function). Needs at least two non-censored roles and right-censored data; takes no covariates. Its card is read under [Cumulative incidence (competing risks)](#cumulative-incidence-competing-risks).
- **Competing-risks regression** – a regression per cause, either a cause-specific Cox fit or a Fine-Gray sub-distribution fit as the [Approach](#competing-risks-regression-options) says – see [cause-specific hazard](./concepts/survival.md#b-cause-specific-hazard) and [subdistribution hazard](./concepts/survival.md#b-subdistribution-hazard). Needs at least two non-censored roles, at least one covariate and right-censored data. Its card is read under [Competing-risks regression](#competing-risks-regression).

> **Non-parametric, semi-parametric or parametric?** Curves describe without assuming a shape; Cox assumes only that a covariate multiplies the hazard by a constant; a parametric family commits to the hazard's shape and can extrapolate and predict in return. See [hazard](./concepts/survival.md#b-hazard), [proportional hazards](./concepts/survival.md#b-proportional-hazards) and [accelerated failure time](./concepts/survival.md#b-accelerated-failure-time-aft).

## Method-specific options

The right column shows one option card for the chosen method: **Non-parametric options** – headed **Cumulative incidence options**, with only the band toggle, under cumulative incidence – **Cox regression options** – headed **Cause-specific Cox options**, without the diagnostics, under the cause-specific competing-risks approach – **Parametric regression options** or **Competing-risks regression options**.

### Non-parametric options

- **Estimator** – which estimate of the survival curve is drawn and summarised; the cumulative-hazard plot is Nelson-Aalen either way. Under **Interval-censored** the choice is ignored and Turnbull's NPMLE is fitted instead.
- **Kaplan-Meier (product-limit)** – the default: the product, over the event times, of the share at risk that survived each – see [Kaplan–Meier estimate](./concepts/survival.md#b-kaplan-meier-estimate).
- **Fleming-Harrington (exp(−Nelson-Aalen))** – the exponential of minus the Nelson-Aalen cumulative hazard: a little higher than Kaplan-Meier in small risk sets, indistinguishable in large ones – see [cumulative hazard function](./concepts/survival.md#b-cumulative-hazard-function).
- **Group comparison test** – shown once a grouping variable is set: the test of whether the groups' curves differ, and which weighting of the event times it uses – see [log-rank test](./concepts/survival.md#b-log-rank-test). With three or more groups every pair is also tested with the same weight, and the pairwise p-values are corrected by the [p-value adjustment setting](./settings.md#multiple-comparison-adjustment) – whatever it is set to, **None** included, in which case the table is reported raw and a warning says so. An entry-time variable is ignored by the test, with a warning on the card, though the curves honour it; under **Interval-censored** no test runs – the control is hidden, and the card says so.
- **Log-rank (ρ = 0)** – the default: every event time weighted alike. {#log-rank-ρ-0 #log-rank}
- **Peto-Peto (ρ = 1)** – event times weighted by the survival estimate just before them, so early differences count for more – see [weighted log-rank tests](./concepts/survival.md#b-weighted-log-rank-tests). {#peto-peto-ρ-1 #peto-peto}
- **Fleming-Harrington (ρ = 0.5)** – the middle ground between the two. {#fleming-harrington-ρ-05 #group-comparison-fleming-harrington}
- **Skip test** – curves only: no test and no pairwise table.
- **Survival probabilities at** – time points at which S(t), its confidence bounds and the number at risk are reported per group, separated by spaces or commas (`12 24 36 60`); a negative or unreadable entry is ignored, duplicates are merged and the rest sorted. Leave it empty for no time-point table. A time past a group's last observation is reported greyed out, as the last estimate carried forward. Under **Interval-censored** no table is produced and the field is hidden.
- **Confidence interval band** – draws the pointwise confidence band, at the [global confidence level](./settings.md#confidence-level), on the survival curve, the cumulative hazard plot and – as the one toggle under **Cumulative incidence options** – the cumulative incidence curves – see [Kaplan–Meier estimate](./concepts/survival.md#b-kaplan-meier-estimate). On by default. Turnbull's NPMLE supplies no band, so nothing is drawn under interval censoring.
- **Censoring tick marks** – marks each censoring time on the survival and cumulative hazard curves. On by default; nothing is drawn under interval censoring.

> **Which weight?** Choose it from the question before seeing the results – an effect expected early is a Peto-Peto question, a constant one a log-rank question – never from which gives the smallest p. See [weighted log-rank tests](./concepts/survival.md#b-weighted-log-rank-tests).

### Cox regression options

- **Ties handling** – how the partial likelihood treats events that occur at exactly the same time.
- **Efron (default)** – accurate and cheap, the right choice for almost everyone.
- **Breslow** – the simpler approximation; biased when ties are common.
- **Exact partial likelihood** – exact but slow; matches Efron in practice unless ties are extreme.
- **Robust (sandwich) variance** – Huber-White standard errors in place of the model-based ones, for observations that may be clustered or a model that is mildly misspecified – see [robust standard errors](./concepts/regression-basics.md#b-robust-standard-errors). With a [time-varying coefficient](#non-proportional-hazards) the variance is clustered on the subject, whose follow-up the fit has split into several rows. Off by default.
- **Proportional hazards test (Schoenfeld residuals)** – `cox.zph` per term plus a global test, with the scaled Schoenfeld residuals plotted over time under a loess smoother – see [proportional hazards](./concepts/survival.md#b-proportional-hazards). On by default.
- **Log-log plot vs grouping variable** – log(−log S(t)) curves per stratum, from a Kaplan-Meier fit on the grouping variable: parallel lines support proportional hazards at the strata level. Drawn only when a grouping variable is set. Off by default.
- **Functional form check (martingale residuals)** – one residuals-against-covariate panel per continuous covariate, with a loess smoother; a non-flat smoother suggests a non-linear effect. Nothing is drawn when every covariate is categorical. Off by default.
- **Influence diagnostics (dfbetas)** – the standardised change in each coefficient if each subject were removed, as a table of maximum and mean absolute dfbetas per term and a per-subject scatter – see [influential points](./concepts/outliers-missing-data.md#b-influential-points). Off by default.
- **Concordance (C-index)** – the model's discrimination: the share of comparable subject pairs in which the one with the higher predicted risk failed first, reported with its standard error; 0.5 is chance and 1.0 a perfect ranking. On by default.

Every control on this card belongs to the partial-likelihood fit, so none of it applies to [interval-censored](#censoring) data – selecting **Interval-censored** hides the card entirely.

#### Non-proportional hazards

When the proportional-hazards assumption fails for one covariate, you can let that covariate's effect change over time instead of dropping the model.

- **Time-varying coefficient (piecewise by time interval)** – frees one covariate's effect to differ between periods of follow-up: the follow-up is cut at the **Interval boundaries**, the chosen covariate is estimated separately within each period, and every other covariate keeps a single, proportional effect – see [time-varying coefficient](./concepts/survival.md#b-time-varying-coefficient). Reveals the two controls below, and does nothing while no covariate is chosen in the first of them. Off by default.
- **Covariate with a time-varying effect** – which covariate is freed: the list holds the covariates you selected, so pick the term `cox.zph` flagged. One covariate at a time.
- **Interval boundaries** – the time points that split the follow-up into periods, separated by spaces or commas (`12 24`). Leave it empty to split at the tertiles of the observed event times. A boundary that would open or close a period holding no events is dropped, and if no usable boundary survives the card says so instead of reporting a fit.

> **Time-varying coefficient or time-dependent covariate?** Here the covariate's *value* is fixed at baseline and only its *effect* may change, which is what repairs a violated assumption; a covariate whose value changes during follow-up is a different object, one this module does not fit, and faking it from later events causes [immortal time bias](./concepts/survival.md#b-immortal-time-bias). See [time-dependent covariate](./concepts/survival.md#b-time-dependent-covariate).

> **Reading the interval hazard ratios?** An effect that wears off drifts towards 1 across the periods where the single averaged HR hid it, and the **Test of proportionality** table under the interval table is the formal check – see [time-varying coefficient](./concepts/survival.md#b-time-varying-coefficient).

### Parametric regression options

- **Distribution family** – which family the fit commits to. The first five are accelerated-failure-time models and report **time ratios** – a coefficient's exponential, the factor by which the covariate stretches the time to the event; Gompertz is a proportional-hazards model and reports **hazard ratios** – see [accelerated failure time](./concepts/survival.md#b-accelerated-failure-time-aft) and [time ratio](./concepts/survival.md#b-time-ratio).
- **Weibull** – the default: an AFT family with a flexible monotone hazard, rising or falling with its shape parameter, that reduces to the exponential at shape 1.
- **Exponential** – an AFT family with a constant hazard, its scale fixed at 1 – a strong assumption, useful as a baseline.
- **Log-normal** – an AFT family whose hazard rises and then falls, for hump-shaped risk.
- **Log-logistic** – an AFT family shaped like the log-normal, with lighter tails.
- **Gaussian** – linear regression on the time scale itself; rarely the right pick, since it allows negative times.
- **Gompertz (proportional hazards)** – a proportional-hazards family with an exponentially increasing hazard, common in adult-mortality models. Not available for interval-censored data: the run stops with a message. {#gompertz-proportional-hazards #gompertz}
- **Compare all (AIC ranking)** – fits every family, reports the best-AIC fit as the card's model, and adds an AIC ranking table and bar plot – see [AIC](./concepts/regression-basics.md#b-aic). Under interval censoring Gompertz is dropped from the comparison.
- **Overlay fitted curves on Kaplan-Meier** – adds a plot of the fitted parametric survival curve over the Kaplan-Meier reference, split by the grouping variable when one is set. On by default. Under interval censoring the plot is not available and the card says so.

> **AFT or PH?** A proportional-hazards model multiplies the hazard; an accelerated-failure-time model stretches or shrinks the time scale, and its time ratio is read in time units – often the more intuitive of the two. See [time ratio](./concepts/survival.md#b-time-ratio).

### Competing-risks regression options

- **Approach** – which model is fitted per cause.
- **Cause-specific hazards (Cox per cause)** – the default: a separate Cox model per cause, the other causes treated as censored, answering what predicts this cause among those still event-free – see [cause-specific hazard](./concepts/survival.md#b-cause-specific-hazard). Honours an entry-time variable, and the grouping variable as strata.
- **Fine-Gray subdistribution hazards** – a model of each cause's cumulative incidence directly, answering what predicts experiencing this cause first – see [subdistribution hazard](./concepts/survival.md#b-subdistribution-hazard). Ignores the grouping variable, with a note on the card, and refuses an entry-time variable before the run.

With **Cause-specific hazards (Cox per cause)** selected, a **Cause-specific Cox options** card appears with the same **Ties handling** and **Robust (sandwich) variance** controls as [Cox regression](#cox-regression-options) – it is a Cox fit per cause, so it takes the same settings. The Cox diagnostics stay out: they are per-model checks, and this approach fits one model per cause.

> **Cause-specific or Fine-Gray?** The two answer different questions and can differ in sign: cause-specific hazards describe the aetiology of each cause among current survivors, Fine-Gray the prognosis – how a covariate shifts the eventual incidence, competing events and all – so a patient-level decision leans on Fine-Gray and a mechanism question on cause-specific. See [competing risks](./concepts/survival.md#b-competing-risks).

## Sample size and EPV checks

Before fitting any regression the module counts the events against the parameters the fit will spend. Fewer events than parameters stops the run with a message; fewer than ten events per parameter lets it run, with a warning that the estimates may be unstable. A parameter is one per numeric covariate and *(levels − 1)* per factor covariate. A parametric fit adds its distribution parameters – one for the scale, two for Gompertz's scale and shape, none for the exponential – and counts the grouping variable, which enters it as a factor rather than as a stratum, as [interval-censored Cox](#interval-censored-cox-regression) does; **Compare all** counts Gompertz's two. A Cox fit with a [time-varying coefficient](#non-proportional-hazards) counts that covariate once more per additional period. Competing-risks regression is checked on the cause with the fewest events, since each cause is its own model.

> **Why ten events per parameter?** Below one event per parameter the fit is singular, and below ten the coefficients ride on single observations – see [events per parameter](./concepts/survival.md#b-events-per-parameter-survival).

## Reading results

Each run produces one output card titled with the method, the time variable and the event variable – the covariates, the strata and, in **Compare all** parametric mode, the family that won the AIC ranking are named there too. Every confidence interval on a card is at the [global confidence level](./settings.md#confidence-level), which its column header names, so a card left on screen always says which level produced it; where a run cannot produce a section, a note on the card says so.

### Non-parametric survival

The card of **Non-parametric survival curve**: a summary table per stratum, the optional time-point table, the group comparison with its pairwise and RMST follow-ups when a grouping variable is set, then the two plots. Under interval censoring the same card is drawn from Turnbull's NPMLE with the summary, the curve and a median alone – the time-point table, the tests, the band, the ticks and the cumulative hazard are not produced, and a note on the card says so; a stratum whose fit did not converge is named in a warning and has no curve and no median.

**Curve summary.** One row per stratum – the grouping variable's levels, or *All* when none is set – with its counts, its median and, for Kaplan-Meier and Fleming-Harrington fits, its restricted mean; a note under the table names the τ the RMST was restricted to.

- **Stratum** – the level of the grouping variable the row describes, or *All* when none is set – see [stratum](./concepts/comparison-designs.md#b-stratum)
- **Events** – the number of events among the rows the fit used: per stratum or group in a summary table, the events the model was fitted on in a regression card's model summary, per cause on the competing-risks cards, and per period in the [time-varying table](#b-time-varying-coefficient-variable)
- **Curve summary – Censored** – the rows that left the risk set without an event, per stratum or group – see [censoring](./concepts/survival.md#b-censoring) {#curve-summary-censored #group-summary-censored}
- **Median survival ({level}% CI)** – the time at which the stratum's curve first reaches 0.5, with its confidence interval beneath; `–` when the curve never falls to 0.5, since fewer than half the subjects have had the event, and the interval line is blank when either of its bounds is undefined. Under Turnbull the header is **Median survival** and no interval is reported – see [median survival time](./concepts/survival.md#b-median-survival-time) {#median-survival-level-ci #median-survival}
- **RMST** – the restricted mean survival time, the area under the curve up to τ, with its standard error beneath (± SE): the mean event-free time over that window. τ is the largest time every stratum reaches, so no curve is read past its own follow-up – see [RMST](./concepts/survival.md#b-restricted-mean-survival-time-rmst)

**Survival probabilities at time points.** Shown when [Survival probabilities at](#b-survival-probabilities-at) holds a time: one row per requested time per stratum. A row past the stratum's last observation is greyed and a footnote says the estimate is the last one carried forward, not an observed value.

- **Time** – the requested time point, in the time variable's units
- **S(t)** – the estimated survival probability at that time, its confidence interval in the column beside it – see [survival function](./concepts/survival.md#b-survival-function)
- **N at risk** – the subjects still under observation and event-free just before that time – in this table and, under the survival curve, at each axis tick – see [number at risk](./concepts/survival.md#b-number-at-risk)

**Group comparison.** The [group comparison test](#b-group-comparison-test) of the curves, once a grouping variable is set and the test is not **Skip test**: the test's name, its χ², df and p. With an entry-time variable the card warns that the test ignored it, though the curves honour it – see [log-rank test](./concepts/survival.md#b-log-rank-test).

**Pairwise comparisons.** With three or more groups, every pair tested with the same weight: χ², df, the raw p and, under any [p-value adjustment](./settings.md#multiple-comparison-adjustment) but **None**, the adjusted p, with a note naming the method that ran; under **None** the table is raw and a warning says the family was left uncorrected. The [cumulative incidence](#b-pairwise-comparisons-gray) card's table of the same name adds a cause per row and is adjusted within each cause.

- **Group 1** – the first level of the pair the row compares
- **Group 2** – the second level of the pair; a difference is Group 1 minus Group 2

**RMST difference.** With two or more groups, one row per pair: the difference in restricted mean survival time at the same τ as the summary table, with its SE, z and p – see [RMST](./concepts/survival.md#b-restricted-mean-survival-time-rmst). With three or more groups the p-values are adjusted as a family of their own, separately from the pairwise tests.

- **Δ RMST ({level}% CI)** – the difference in restricted mean survival time, Group 1 minus Group 2, with its confidence interval beneath

**Survival curve.** The Kaplan-Meier, Fleming-Harrington or Turnbull step curve, one per stratum, with the pointwise confidence band and the censoring ticks the [Confidence interval band](#b-confidence-interval-band) and [Censoring tick marks](#b-censoring-tick-marks) toggles control, and a **N at risk** strip under the axis reading the risk set at each tick, one row per stratum. Curves whose bands separate clearly suggest a real difference; the formal test is the **Group comparison** table – see [Kaplan–Meier estimate](./concepts/survival.md#b-kaplan-meier-estimate).

**Cumulative hazard.** The Nelson-Aalen H(t) step curve per stratum, whichever estimator drew the survival curve, with a band built from the Nelson-Aalen standard error so it is centred on the curve; not drawn under Turnbull – see [cumulative hazard function](./concepts/survival.md#b-cumulative-hazard-function).

### Cox regression

The card of **Cox proportional hazards regression** on right-censored data: the model summary, the coefficients and their forest plot, the overall tests, then every diagnostic switched on in the [Cox regression options](#cox-regression-options), the [time-varying](#non-proportional-hazards) tables when one was fitted, and the baseline survival curve – see [proportional hazards](./concepts/survival.md#b-proportional-hazards).

**Model summary.** The fit's headline row: **N**, the rows the model was fitted on, and **Events** among them, then what the estimator adds – here the ties method and whether robust standard errors were used; [Turnbull intervals](#b-turnbull-intervals), [Bootstrap samples](#b-bootstrap-samples) and [log L](#b-log-l) on the interval-censored card; the [distribution](#b-distribution), AIC, log L and [scale parameter](#b-scale-parameter) on the parametric card.

- **Ties method** – the [Ties handling](#b-ties-handling) the fit used – **Efron**, **Breslow** or **Exact partial likelihood**
- **Robust SE** – *Yes* when [Robust (sandwich) variance](#b-robust-sandwich-variance) was on, so every SE, interval and p in the coefficient table is a sandwich estimate; *No* otherwise

**Coefficients.** One row per term – a numeric covariate, or one level of a factor covariate against its reference, spelled `{covariate} = {level} (ref: {reference})` – with the columns below; the same shape serves the [interval-censored](#interval-censored-cox-regression), [parametric](#parametric-regression) and [competing-risks](#competing-risks-regression) cards, which rename the ratio column – see [term](./concepts/regression-basics.md#b-term).

- **HR ({level}% CI)** – the hazard ratio, the exponential of the coefficient, with its confidence interval beneath; read the interval first, and whether it excludes 1 is the test – see [hazard ratio](./concepts/survival.md#b-hazard-ratio)
- **log(HR)** – the raw coefficient, on the log-hazard scale
- **SE** – the coefficient's standard error – model-based, or the sandwich estimate when robust variance is on – see [standard error of a coefficient](./concepts/regression-basics.md#b-standard-error-of-a-coefficient)
- **z** – log(HR) ⁄ SE, with [significance stars](./settings.md#significance-formatting) – see [z](./concepts/hypothesis-testing.md#b-z)
- **p** – the row's p-value under the null that the coefficient is zero – see [p](./concepts/hypothesis-testing.md#b-p)

**Overall tests.** Three tests of the joint null that every coefficient is zero, each with its χ², df and p.

- **Likelihood ratio** – twice the gain in log partial likelihood over the model with no covariates – see [likelihood-ratio test](./concepts/regression-basics.md#b-likelihood-ratio-test)
- **Wald** – the coefficients tested jointly against their covariance matrix
- **Score (log-rank)** – the score test, which for a single binary covariate is the log-rank test

**Concordance (C-index).** When enabled: the model's discrimination, as the [option](#b-concordance-c-index) describes – **C**, the share of comparable subject pairs ranked correctly, and its SE. {#concordance-c-index-result #c}

**Hazard ratio forest plot.** Each term's HR and interval on a log axis with a reference line at 1; the same plot on the interval-censored card. A term whose hazard ratio is not estimable – a level with no events, say – is left out and named in a note under the plot.

**Proportional hazards test.** When enabled: `cox.zph` per term and a **GLOBAL** row, each with χ², df and p. A significant term is one whose hazard ratio changes over follow-up – see [proportional hazards](./concepts/survival.md#b-proportional-hazards). When the test cannot be computed for the fit – no coefficient was estimable – a note says so in place of the table and plot.

- **GLOBAL** – the joint test over every term; a clean global test does not clear each term, so read the rows above it too

**Schoenfeld residuals.** The scaled residuals over time, one panel per term, with a loess smoother; a non-flat smoother is the visual counterpart of a significant test.

**Time-varying coefficient: {variable}.** When a [time-varying coefficient](#b-time-varying-coefficient-piecewise-by-time-interval) was fitted: one row per period – per period and non-reference level for a factor covariate, with a **Term** column naming the level – carrying the period's events and its own HR, log(HR), SE, z and p, and a note saying that every other covariate stays proportional. When no usable boundary survived, a warning replaces the section – see [time-varying coefficient](./concepts/survival.md#b-time-varying-coefficient).

- **Time interval** – the period the row's hazard ratio holds in: `≤ {cut}` for the first, `{from} – {to}` between two cuts, `> {cut}` for the open last one

**Test of proportionality.** The likelihood-ratio test of the constant-effect model against the time-varying one – one row, with χ², df and p. A significant result says the effect moves across the periods.

- **Constant vs time-varying effect** – the test's row; its df is the number of extra coefficients the periods spent

**Hazard ratios by time interval.** The period hazard ratios as a forest, on a log axis with the reference line at 1: an effect that wears off drifts towards 1 across the periods.

**Proportional-hazards visual check.** When [Log-log plot vs grouping variable](#b-log-log-plot-vs-grouping-variable) is on and a grouping variable is set: log(−log S(t)) against log(time), one curve per stratum from a Kaplan-Meier fit on the strata. Roughly parallel curves support proportional hazards at the strata level; without a grouping variable a note says the plot needs one.

**Martingale residuals: {variable}.** When [Functional form check (martingale residuals)](#b-functional-form-check-martingale-residuals) is on: one panel per continuous covariate, the covariate on the x-axis and the residual on the y-axis, with a loess smoother. A non-flat smoother suggests the covariate enters non-linearly; nothing is drawn when every covariate is categorical.

**Influence (dfbetas summary).** When [Influence diagnostics (dfbetas)](#b-influence-diagnostics-dfbetas) is on: per term, the largest and the mean absolute standardised change in the coefficient when each subject is dropped – see [DFBETAS](./concepts/outliers-missing-data.md#b-dfbetas).

- **max |dfbetas|** – the largest absolute dfbetas any one subject produces for the term
- **mean |dfbetas|** – the mean absolute dfbetas over the subjects

**Dfbetas residuals per subject.** The per-subject scatter behind the summary, one panel per term against the subject's row index, with the five largest values in each panel highlighted.

**Baseline survival.** The survival curve of a reference subject – `survfit` on the fitted model, one curve per stratum when a grouping variable is set, with a confidence band. The reference is stated under the plot: numeric covariates at their mean and, on this card, factor covariates at their dummy-coded mean – the sample's level mix – so the curve is an average subject's; on the [interval-censored card](#interval-censored-cox-regression) factor covariates sit at their reference level, one curve per group, and there is no band.

> **Reading hazard ratios?** HR = 1 is no effect, 2 doubles the hazard per unit, 0.5 halves it – and the interval is read first – see [hazard ratio](./concepts/survival.md#b-hazard-ratio).

> **Proportional hazards violated?** The fitted HR is then an average over follow-up; stratify on the variable, free its effect as a [time-varying coefficient](#non-proportional-hazards), or switch to a parametric family – see [proportional hazards](./concepts/survival.md#b-proportional-hazards).

### Interval-censored Cox regression

The card of **Cox proportional hazards regression** under **Interval-censored** data, fitted by `icenReg::ic_sp`, a semiparametric proportional-hazards model that reads each subject's event time as a bracket. It reports hazard ratios and a baseline curve and nothing else: a note on the card names the estimator and lists what it cannot produce – the proportional-hazards test, Schoenfeld and martingale residuals, the log-log plot, influence diagnostics, concordance and the overall tests – which is also why the [Cox regression options](#cox-regression-options) card is hidden under this censoring type. A grouping variable is not a stratum here: it enters as a factor covariate, one term per non-reference level, with its own rows in the coefficient table and its own share of the [EPV budget](#sample-size-and-epv-checks), and a second note says so.

Its **Model summary** row carries **N** and **Events** and three columns of its own:

- **Turnbull intervals** – how many distinct intervals the non-parametric baseline resolved the brackets into; it tracks how the brackets overlap, not the sample size – a shared visit grid yields a handful, continuous bounds many more – and it is what the run time scales with
- **Bootstrap samples** – the number of resamples the run used, from the [bootstrap replications setting](./settings.md#bootstrap-replications), seeded by the [bootstrap seed](./settings.md#bootstrap-seed) when one is set. Every standard error, interval and p-value on the card is paid for by refitting the model once per sample, so a run's cost rises with this count and with the Turnbull-interval count; a long run stays cancellable. Should the count reach the fit as 0, the table holds point estimates with dashes for SE, CI and p, and a warning says why
- **log L** – the fit's log-likelihood; on the parametric card the same column is the family's, the quantity its AIC is built from – see [log-likelihood](./concepts/regression-basics.md#b-log-likelihood)

Its **Coefficients** table has the exact-time card's columns, with the standard error renamed:

- **SE (bootstrap)** – the coefficient's standard error across the bootstrap samples; the interval and the p-value beside it are bootstrap quantities too

The **Hazard ratio forest plot** and **Baseline survival** read as on the exact-time card – the baseline at the reference levels of the factor covariates, one curve per group, with no band, since the semiparametric fit supplies none.

> **Hazard ratios without a proportionality check?** They mean what they mean in an exact-time Cox model, but the assumption cannot be tested on this card; when it matters, fit the exact-time Cox on imputed midpoints as a sensitivity check rather than report the interval fit as if it had been – see [proportional hazards](./concepts/survival.md#b-proportional-hazards).

### Parametric regression

The card of **Parametric survival regression**: the model summary, the AIC ranking and its bar plot under **Compare all**, the coefficients and, when the overlay is on, the fitted curve over the Kaplan-Meier reference – see [accelerated failure time](./concepts/survival.md#b-accelerated-failure-time-aft). With a grouping variable a note says it entered as a factor covariate, not as a stratum, since the parametric families share one baseline.

Its **Model summary** row carries **N**, **Events**, **AIC** and **log L** beside two columns of its own:

- **Distribution** – the family the row's fit committed to: the one chosen, or under **Compare all** the best-AIC family in the summary and every family in the ranking
- **Scale parameter** – the fitted scale of an AFT family, the spread of its log-time error, fixed at 1 for the exponential; blank for Gompertz, whose parameters are rows of the coefficient table

**AIC ranking.** Under **Compare all**, every family's AIC, ΔAIC and log L with a convergence flag, sorted best first; a family that failed to fit keeps its row with ✗ and is named under the table with the message R returned. Under interval censoring Gompertz is not in the ranking – see [AIC](./concepts/regression-basics.md#b-aic).

- **ΔAIC** – the family's AIC minus the best family's: 0 for the winner, and differences under two are no difference
- **Fit** – ✓ when the fit converged, ✗ when it failed; the same column on the competing-risks [Fit summary](#b-fit-summary) flags each cause's model

**AIC by distribution.** The ranking as a bar chart: the bars carry ΔAIC from the best fit, the winner in its own colour, and each bar's label prints the absolute AIC – `{aic} (best)` for the winner, `{aic} (Δ {delta})` for the rest.

The **Coefficients** table has the Cox card's shape with an estimate column added and the ratio column renamed:

- **Coefficients – Estimate** – the raw coefficient: on the log-time scale for the AFT families, so a positive value lengthens the time, and on the log-hazard scale for Gompertz
- **Time ratio ({level}% CI)** – for the AFT families, the exponential of the coefficient: the factor by which the covariate stretches the time to the event, with its confidence interval beneath; for Gompertz the column is **HR ({level}% CI)** and reads as on the Cox card – see [time ratio](./concepts/survival.md#b-time-ratio)

Two kinds of row are not covariate effects: **(Intercept)**, the log time scale at zero covariates, and the distribution parameters at the bottom – `Log(scale)` for an AFT family, `log(scale)` and `log(shape)` for Gompertz – whose exponentiated column is the parameter itself, not a ratio.

**Kaplan-Meier vs parametric fit.** When [Overlay fitted curves on Kaplan-Meier](#b-overlay-fitted-curves-on-kaplan-meier) is on: the Kaplan-Meier step curve with its censoring ticks and the smooth parametric curve dashed over it, one pair per level when a grouping variable is set, the legend telling *KM* from *Parametric fit*. The smooth curve is drawn for numeric covariates at their mean and factor covariates at their reference level, and no confidence band is drawn. A parametric curve that misses the steps in the tail is a warning whatever the AIC says.

**Kaplan-Meier reference.** Drawn in the overlay's place when the smooth curve could not be derived for the fit – the Kaplan-Meier curve alone, with its band and ticks, and a note saying so.

Under interval censoring the overlay is not available, and a note on the card says so.

> **Reading time ratios?** A time ratio of 1.4 means events come 1.4× later for that group; below 1, sooner – see [time ratio](./concepts/survival.md#b-time-ratio).

> **Lowest AIC, right family?** AIC ranks fits on the same data and guarantees nothing about the hazard's shape – check the overlay before reporting an effect – see [accelerated failure time](./concepts/survival.md#b-accelerated-failure-time-aft).

### Cumulative incidence (competing risks)

The card of **Cumulative incidence (competing risks)**: the group sizes, the events per group and cause, Gray's test and its pairwise follow-up when a grouping variable is set, and the incidence curves – see [cumulative incidence function](./concepts/survival.md#b-cumulative-incidence-function). An entry-time variable is ignored here, with a warning that every subject was treated as followed from time zero.

**Group summary.** One row per group – or one row, *All*, with no grouping variable – with its N, its events of any cause and its censored rows.

- **Group** – the level of the grouping variable the row describes, or *All* when none is set

**Cumulative incidence summary.** The events per group and cause, one row per combination.

- **Cause** – the cause the row is about, named by the [role](#event-indicator-and-level-roles) its levels were given – **Event**, **Event (cause 2)** and so on

**Gray's K-sample test.** When a grouping variable is set: per cause, Gray's test of whether the cumulative incidence functions differ across the groups, with χ², df and p – the competing-risks counterpart of the log-rank test.

**Pairwise comparisons.** With three or more groups, Gray's test per group pair and cause: χ², df, the raw p and the adjusted p, corrected within each cause – each cause is its own adjustment family, matching the per-cause tests above – with a note naming the method; under **None** the table is raw and a warning says so. {#pairwise-comparisons-gray}

**Cumulative incidence curves.** F(t) per cause and group as step curves, the legend naming each as `{group} / {cause}` – or the cause alone with no grouping variable – with the pointwise confidence band the [Confidence interval band](#b-confidence-interval-band) toggle controls.

> **Cumulative incidence or 1 − KM?** Treating the competing events as censored and reporting 1 − KM overstates every cause's incidence; the CIF is the quantity that adds up – see [cumulative incidence function](./concepts/survival.md#b-cumulative-incidence-function).

### Competing-risks regression

The card of **Competing-risks regression**: a fit summary, then one coefficient table per cause – with its overall tests under the cause-specific approach – and a combined forest plot. Under Fine-Gray a note says the grouping variable was ignored, and points at the covariates.

**Fit summary.** One row per cause: the rows and the events of that cause the fit used, and whether it converged. A cause whose fit failed – a small subgroup, separation, a numerical problem – appears as a warning row with the message R returned, and has no coefficient table.

**Cause-specific hazards: {cause}.** Under **Cause-specific hazards (Cox per cause)**: the Cox coefficient table for that cause, the other causes treated as censored, with the [Cox card's columns](#b-coefficients) – see [cause-specific hazard](./concepts/survival.md#b-cause-specific-hazard).

**Overall tests: {cause}.** The cause-specific fit's likelihood-ratio, Wald and score tests, as on the [Cox card](#b-overall-tests).

**Sub-distribution hazards: {cause}.** Under **Fine-Gray subdistribution hazards**: the Fine-Gray coefficient table for that cause, its ratio and coefficient columns renamed – see [subdistribution hazard](./concepts/survival.md#b-subdistribution-hazard).

- **sHR ({level}% CI)** – the subdistribution hazard ratio, the exponential of the coefficient, with its confidence interval beneath: how the covariate shifts the cause's cumulative incidence, competing events and all
- **log(sHR)** – the raw Fine-Gray coefficient

**HR forest plot.** The cause-specific hazard ratios of every cause in one forest, one row per cause and term, labelled `{cause}: {term}`, on a log axis with the reference line at 1.

**sHR forest plot.** The same forest for the Fine-Gray fits, of sub-distribution hazard ratios.

## Dropped rows and missing data

Each output card ends with a note – *{count} rows excluded due to missing values, invalid entry times, or unassigned event levels* – when any row was dropped, and the count covers every reason below:

- A non-finite or negative time
- A blank event level, or an event level that was not assigned a role
- Under interval censoring: an upper bound that is missing (when the event occurred) or smaller than the lower bound
- A missing grouping or entry-time value
- An entry time that is not strictly earlier than the event or censoring time
- A missing covariate value (for the regression methods)

These exclusions are the module's own, method-local [listwise deletion](./concepts/outliers-missing-data.md#b-listwise-deletion): the module does not read the [global missing-data setting](./settings.md#missing-data), whose pass acts on the loaded data before any module sees it.

## Reporting checklist

**Method:**
- Time variable, event variable, and how each event level was assigned a role
- Censoring scheme (right vs. interval; left truncation if used)
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

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. The module uses `survival` (Kaplan-Meier, Nelson-Aalen, the log-rank family, Cox, the parametric AFT families, time-varying coefficients), `eha` (the Gompertz proportional-hazards fit), `Icens` (Turnbull's NPMLE for interval censoring), `icenReg` (semiparametric proportional hazards for interval-censored data) and `cmprsk` (cumulative incidence, Gray's test and Fine-Gray regression). Citations for the R packages *and* the statistical methods used in your analysis appear automatically at the top of the output card. The reasoning behind the module's estimators, defaults and refusals is in its [method notes](./methods/time-to-event-analysis.md).

## Common pitfalls

**Treating censored as event-free forever.** Censoring means the event had not occurred *as of last contact*, not that it never will: cite a follow-up window with any survival share, and expect no median while more than half the subjects are still at risk – see [censoring](./concepts/survival.md#b-censoring).

**Ignoring competing risks.** Analysing one cause with the others treated as censored over-estimates its incidence as 1 − KM; use cumulative incidence, or Fine-Gray, when competing events are more than a handful – see [competing risks](./concepts/survival.md#b-competing-risks).

**Checking proportional hazards only globally.** A clean global `cox.zph` does not clear every term – one can violate the assumption while the global test stays quiet. Read the per-term rows and the Schoenfeld plots.

**Choosing a parametric distribution by AIC alone.** AIC ranks fits within your data and guarantees none of them describes the true hazard; compare the overlay against the Kaplan-Meier curve before reporting an effect – see [accelerated failure time](./concepts/survival.md#b-accelerated-failure-time-aft).

**Informative censoring.** Every method here assumes a censored subject is at the same risk as those still followed; censoring driven by prognosis biases the curves and the fits, with no built-in fix – document the censoring mechanism – see [informative censoring](./concepts/survival.md#b-informative-censoring).

**Immortal time bias.** Defining a group by something that happens *during* follow-up hands it a guaranteed event-free window. Define groups from baseline information only, or model the exposure as a time-dependent covariate through the [R console](./r-console.md); the [time-varying coefficient](#non-proportional-hazards) option is a different tool, with the covariate's value fixed and only its effect free – see [immortal time bias](./concepts/survival.md#b-immortal-time-bias).
