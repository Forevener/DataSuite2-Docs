---
title: Reproducibility & agreement
description: Inter-rater and test-retest agreement in DataSuite 2 – ICC, kappa, Krippendorff's alpha, SEM and SDC, Bland-Altman limits and signal detection theory.
---

# Reproducibility & agreement

Reproducibility & agreement assesses whether measurements can be reproduced across raters, time points or methods: ICC, kappa and Krippendorff's α for agreement, SEM and SDC for the precision of a score, Bland-Altman limits for comparing two methods, and signal detection indices for a rater's sensitivity and bias. It works with long-format data: each row is one observation of one subject under one condition. In the app it is the **Reproducibility & agreement** module, next to [Reliability analysis](./reliability-analysis.md) for a scale's internal consistency and [Item response theory](./irt-analysis.md) for item-level models. {#reproducibility-analysis}

> **Internal consistency vs. reproducibility:** [internal consistency](./reliability-analysis.md) looks at one measurement occasion and asks whether a scale's items hang together; reproducibility compares across raters or time points and asks whether measuring again gives the same answer – see [agreement](./concepts/agreement.md#b-agreement). A scale can have excellent internal consistency and poor inter-rater agreement at once.

1. Put the data in long format – one row per subject per condition; the [column stacker](./data-transformation.md) converts a wide file
2. Pick the [Condition variable and Subject ID](#data-layout); every other selected variable is a score
3. Choose the [metrics](#reproducibility-metrics) and, for ICC or SEM & SDC, the [model and form](#icc-options)
4. Click **Calculate reproducibility**

## Requirements

- A subject ID and a condition variable, in two different columns, with at least two conditions and at least one further selected variable as a score.
- At least one metric must be checked.
- Each subject may appear only once per condition. Bland-Altman is the one exception, once [repeated measurements](#repeated-measurements) says what the repeats are.

## Data layout

Three dropdowns configure how DataSuite reads your data:

- **Condition variable** – the column identifying each rater, time point or measurement occasion – the levels the scores are compared across. It needs at least two levels, or the run stops before anything is computed; two make a test-retest or two-rater design, three or more an inter-rater one, and several metrics run only at one or the other. {#condition-variable-rater-time-point #condition-variable}
- **Subject ID** – the column identifying each subject. If your data was converted from wide to long format using the [column stacker](./data-transformation.md), this is auto-selected.
- **None** – no column chosen yet, in either role dropdown; the run refuses to start until both roles are set, and they must be two different columns.
- **Occasion** – optional, and read by Bland-Altman alone. It names the column that pairs a subject's repeated measurements, when both conditions were measured together on each occasion and the subject's true value could move between them; see [repeated measurements](#repeated-measurements). The column leaves the score variables when you name it, and must differ from the other two roles. {#occasion-optional}
- **None** – the default: no occasion column, so every subject–condition pair is one measurement and a repeated pair stops the run unless [Repeated measurements](#repeated-measurements) says what the repeats are. {#occasion-optional-none}

All remaining selected variables are treated as score variables and analysed in bulk.

With a subject and a condition picked, a preview above the metrics says what the module found in the data: how many conditions and how many complete subjects, and – when they occur – how many subjects are incomplete, with no row under some condition, and how many rows repeat a subject–condition pair. It is worth a glance before running anything, since a layout surprise shows up there rather than as an error afterwards.

Each subject may appear only once per condition. If any subject–condition pair repeats, the analysis stops and tells you how many rows are involved – aggregate the duplicates or restack the data first, because every metric here assumes one score per cell. Bland-Altman is the single exception, once you have declared what the repeats are (see [repeated measurements](#repeated-measurements)): it then runs on its own, and a message names the other selected metrics as refused.

## Reproducibility metrics

Enable any combination of metrics. Each score variable gets whichever metrics apply to its data type:

| Metric | Continuous | Ordinal | Categorical | Notes |
|---|---|---|---|---|
| **ICC** | Yes | | | Model and form selectable |
| **Cohen's / Light's / Fleiss' κ** | | Yes | Yes | Cohen (2 raters); Light (3+ raters, ordinal); Fleiss (3+ raters, nominal) |
| **Krippendorff's α** | Yes | Yes | Yes | Bootstrap CI – may be slow |
| **Kendall's W** | Yes | Yes | | 3+ conditions only |
| **Pearson r** | Yes | | | 2 conditions only |
| **Spearman ρ** | Yes | Yes | | 2 conditions only |
| **SEM & SDC** | Yes | | | ANOVA-based; matches the ICC model |
| **Bland-Altman agreement** | Yes | | | Bias, limits of agreement and proportional-bias slope, with a plot; every pair of conditions |
| **Signal detection theory** | Yes | Yes | Yes | Any score variable with exactly two distinct values, 2 conditions only – its own sub-section, see [below](#signal-detection-theory) |

- **Intraclass correlation (ICC)** – the share of the variance in a continuous score that is true differences between subjects rather than rater or occasion differences and noise; see [intraclass correlation](./concepts/agreement.md#b-intraclass-correlation). Which variances count is the [model and form](#icc-options) chosen below, and the column is headed by that choice – ICC(2,1) for two-way random, single measures. Reported with an analytic confidence interval and a p-value, and graded on the Koo & Li bands. {#intraclass-correlation-icc #icc}
- **Cohen's / Light's / Fleiss' kappa (κ)** – chance-corrected agreement on ordinal and categorical scores; see [Cohen's kappa](./concepts/agreement.md#b-cohens-kappa). The variant follows the data and heads the column: with two conditions [Cohen's κ](#b-cohens-κ), [weighted](#b-weighted-cohens-κ) when the score is ordinal; with three or more, [Light's κ](#b-lights-κ) for ordinal scores and [Fleiss' κ](#b-fleiss-κ) for categorical ones. Intervals are bootstrapped.
- **Krippendorff's alpha** – chance-corrected agreement for any number of raters, any level of measurement and missing ratings, so it runs on every score type; see [Krippendorff's alpha](./concepts/agreement.md#b-krippendorffs-alpha-α). Its distance function follows the score's type – nominal for categorical, ordinal for ordinal, interval for continuous – and its column is [Krippendorff's α](#b-krippendorffs-α). Its interval is a bootstrap, which is the slow part of a run with many variables or subjects.
- **Kendall's W** – agreement among three or more conditions about the order of the subjects, from 0 to 1, on continuous and ordinal scores; see [Kendall's coefficient of concordance](./concepts/agreement.md#b-kendalls-coefficient-of-concordance). Reported only from three conditions – with two it would restate Spearman ρ on another scale, so a note under the tables says why the column is absent. Graded on Schmidt's bands, with a bootstrap interval and a p-value.
- **Pearson correlation (test-retest)** – the product-moment correlation between the two conditions' scores, for continuous scores at exactly two conditions; a measure of consistency, not agreement – see [correlation is not agreement](./concepts/agreement.md#b-correlation-is-not-agreement). With three or more conditions the column is empty and a note under the tables says why. Its column is [Pearson r](#b-pearson-r).
- **Spearman correlation (test-retest)** – the same on ranks, for continuous and ordinal scores at exactly two conditions. Its column is [Spearman ρ](#b-spearman-ρ).
- **SEM & SDC** – the standard error of measurement and the smallest detectable change of a continuous score, from the analysis of variance matching the ICC model chosen below, so selecting it shows the [ICC options](#icc-options) too; see [within-subject standard deviation](./concepts/agreement.md#b-within-subject-standard-deviation) and [smallest detectable change](./concepts/agreement.md#b-smallest-detectable-change). Two columns, [SEM](#b-sem) and [SDC](#b-sdc-level), with bootstrap intervals and no p-value.
- **Bland-Altman agreement** – how far apart two conditions' measurements are for an individual subject, where the coefficients above ask how strongly they relate: the mean difference, the limits most individual differences fall within and the slope of the disagreement on the magnitude, with a plot – see [Bland–Altman plot](./concepts/agreement.md#b-bland-altman-plot). Runs on continuous scores for every pair of conditions and reports in [its own sub-section](#bland-altman-agreement) of the card; its options appear under the checkbox.
- **Signal detection theory** – reads the two conditions of a binary score as a true state and an observer's response and reports sensitivity (d′, A′) and response bias (c, β, B″) from the 2 × 2 table they cross into – see [signal detection](./concepts/agreement.md#b-signal-detection). Needs exactly two conditions and a score variable with exactly two distinct values, whatever its declared type; reports in [its own sub-section](#signal-detection-theory), and its two controls appear under the checkbox.

Results are grouped by variable type, so you don't need to run the analysis separately for continuous and categorical variables.

## ICC options

When **Intraclass correlation (ICC)** or **SEM & SDC** is selected, two radio groups appear; SEM's analysis of variance is taken from the same selection.

**Model:**
- **One-way random (absolute agreement)** – each subject is rated by a different random set of raters, so a rater's systematic tendency cannot be told from noise and counts as error; the smallest of the three – see [one-way random effects model](./concepts/agreement.md#b-one-way-random-effects-model). ICC(1,·) in the column header.
- **Two-way random (absolute agreement)** – the same raters rate all subjects and are a random sample from a larger population, so a rater who is consistently high lowers the coefficient; the default – see [two-way random effects model](./concepts/agreement.md#b-two-way-random-effects-model). ICC(2,·).
- **Two-way mixed (consistency)** – the same raters rate all subjects and are the only ones of interest, so a constant offset between raters costs nothing – see [two-way mixed effects model](./concepts/agreement.md#b-two-way-mixed-effects-model). ICC(3,·).

> **Absolute agreement vs. consistency?** Not a separate control – it follows from the model: the two random-effects models ask whether raters give the *same score*, the mixed model only whether they *rank* subjects the same way; see [absolute agreement](./concepts/agreement.md#b-absolute-agreement) and [consistency](./concepts/agreement.md#b-consistency).

**Form:**
- **Single measures** – the reliability of one rater's score; the default, and the right form whenever the scores used in practice come from one rater or one occasion. ICC(·,1).
- **Average measures** – the reliability of the mean across all raters, always the higher of the two; choose it only when every score used in practice will be the mean of the same number of raters – see [single and average measures](./concepts/agreement.md#b-single-and-average-measures). ICC(·,k).

> **Which ICC to choose?** In most research scenarios two-way random, single measures – ICC(2,1) – is the one: the same raters score all subjects, the raters represent a larger population, and the question is how reliable one rater is; see [intraclass correlation](./concepts/agreement.md#b-intraclass-correlation).

## Reading reproducibility results

The card opens with the layout it ran on – the subject, condition and occasion columns, the number of conditions and the score variables – and groups the results by variable type under separate headings:

- **Continuous variables** – ICC, Pearson r, Spearman ρ, SEM, SDC, Kendall's W, Krippendorff's α
- **Ordinal variables** – Spearman ρ, Kendall's W, κ, Krippendorff's α
- **Categorical variables** – κ, Krippendorff's α

Each table has one row per score variable and a column per applicable metric, with the N it ran on, a confidence interval when [**Confidence intervals**](#b-confidence-intervals) is on, a p-value where the metric has one and an interpretation. Metrics with a null distribution – ICC, Cohen's and Fleiss' κ, Kendall's W, Pearson r and Spearman ρ – carry a p-value column and significance stars beside the coefficient; Light's κ, SEM, SDC and Krippendorff's α have no closed-form p-value and show the coefficient and its interval alone. A group whose variables get none of the selected metrics is left out, and a note says so when that leaves the card empty.

- **Confidence intervals** – the **Output options** checkbox, on by default: adds a *{level}% CI* column beside every coefficient, at the [confidence level](./settings.md#confidence-level) setting. ICC, Pearson r and Spearman ρ take their analytic intervals and compute instantly; Cohen's / Light's / Fleiss' κ, Kendall's W, SEM and SDC, Krippendorff's α and the signal-detection indices take percentile-bootstrap intervals resampling subjects, [bootstrap replications](./settings.md#bootstrap-replications) times under the [bootstrap seed](./settings.md#bootstrap-seed) – noticeable time with many variables or large samples, and an interval is left blank when fewer than half the replicates produced a value. Bland-Altman's intervals are analytic and follow the same checkbox.
- **Variable** – the score variable the row describes.
- **N** – the subjects the metric in that column ran on. A table shares one N column while every metric agrees in every row and prints one per metric as soon as one differs, since each metric drops missing ratings its own way; see [missing data](#missing-data). {#continuous-variables-n #ordinal-variables-n #categorical-variables-n}
- **Pearson r** – the correlation between the two conditions' scores, with the analytic interval and p-value of `cor.test()`; graded on correlation-strength bands, since it measures consistency rather than agreement – see [Pearson's r](./concepts/effect-sizes.md#b-r).
- **Spearman ρ** – the rank correlation between the two conditions' scores, with a Fisher-z interval and the p-value of `cor.test()`; correlation-strength bands – see [Spearman's ρ](./concepts/parametric-nonparametric.md#b-spearmans-rho).
- **SEM** – the standard error of measurement: how far a single score typically lands from the subject's true score, in the score's own units, from the analysis of variance matching the chosen [ICC model](#icc-options); bootstrap interval, no p-value – see [within-subject standard deviation](./concepts/agreement.md#b-within-subject-standard-deviation).
- **SDC ({level}%)** – the smallest detectable change, $\text{SEM} \cdot z \cdot \sqrt{2}$ with $z$ at the configured [confidence level](./settings.md#confidence-level), whose percentage the header carries: a change in one subject's score smaller than this is within measurement error. Its interval is the SEM's, scaled the same way – see [smallest detectable change](./concepts/agreement.md#b-smallest-detectable-change).
- **Krippendorff's α** – the coefficient on the distance function the row's score type selects; bootstrap interval, no p-value, graded on Krippendorff's own bands.
- **Cohen's κ** – two conditions, categorical score: chance-corrected agreement with the analytic p-value of `irr::kappa2()` and a bootstrap interval; see [Cohen's kappa](./concepts/agreement.md#b-cohens-kappa).
- **Weighted Cohen's κ** – two conditions, ordinal score: Cohen's κ with quadratic weights, so a disagreement by one category costs less than one by four; p-value and interval as above – see [weighted kappa](./concepts/agreement.md#b-weighted-kappa).
- **Light's κ** – three or more conditions, ordinal score: the mean of the quadratic-weighted Cohen's κ over every pair of conditions; bootstrap interval and no p-value – see [Light's kappa](./concepts/agreement.md#b-lights-kappa).
- **Fleiss' κ** – three or more conditions, categorical score, with the analytic p-value of `irr::kappam.fleiss()` and a bootstrap interval; see [Fleiss' kappa](./concepts/agreement.md#b-fleiss-kappa).
- **Interpretation** – a verdict on one coefficient per row – the first present of ICC, κ, Kendall's W, Krippendorff's α, Pearson r and Spearman ρ – naming the coefficient it graded and read on the scale that coefficient's own literature set, per the table below. Shown while the [interpretation column](./settings.md#significance-formatting) setting is on.

| Scale | Graded coefficients | Bands |
|---|---|---|
| Koo & Li (2016) | ICC | below 0.50 poor · 0.50–0.75 moderate · 0.75–0.90 good · above 0.90 excellent |
| Schmidt (1997) | Kendall's W | below 0.30 very weak · 0.30–0.50 weak · 0.50–0.70 moderate · 0.70–0.90 strong · 0.90 and above unusually strong |
| Landis & Koch (1977) | every κ | below 0 poor · 0–0.20 slight · 0.20–0.40 fair · 0.40–0.60 moderate · 0.60–0.80 substantial · above 0.80 almost perfect |
| Krippendorff (2004) | Krippendorff's α | below 0.667 unacceptable · 0.667–0.800 tentative · 0.800 and above acceptable |
| Correlation strength | Pearson r, Spearman ρ | below 0.10 negligible · 0.10–0.30 weak · 0.30–0.50 moderate · 0.50–0.70 strong · 0.70 and above very strong |

## Bland-Altman agreement

When **Bland-Altman agreement** is selected, it gets its own sub-section of the results card after the grouped tables – the plots per continuous variable first, then one table covering them all. It runs on continuous variables, for every pair of conditions: one comparison per variable at two conditions, k(k−1)/2 beyond that, each naming the pair it compares and the direction the difference was taken in. Past two conditions a variable's plots collapse into one expandable group, drawn the first time you open it.

**Bland-Altman plot.** It puts each subject's mean of the two measurements on the x-axis and the difference between them on the y-axis, one point per pair, and draws the bias as a solid line, the two limits of agreement dashed and the proportional-bias fit dotted, each labelled with its value; the bias and the limits carry their confidence intervals as translucent bands. Hovering a point names the subject behind it – which is how you find the case worth going back to the raw data for. {#bland-altman-plot}

The table reports one row per comparison:

- **Comparison** – which pair of conditions the row covers, and in which direction: *first − second*, the conditions taken in the order their labels first appear in your data. Shown only past two conditions, where there is more than one pair to tell apart; at two, the note under the table names the pair instead, so a positive bias reads as "the first condition scores higher".
- **N** – the subjects contributing a complete pair of measurements. {#bland-altman-agreement-n}
- **Pairs** – with an occasion variable, the number of subject–occasion pairs the row ran on, in place of N, since one subject then contributes several.
- **Subjects** – with an occasion variable, how many subjects those pairs came from.
- **Bias** – the mean difference, with its confidence interval; a bias away from zero says one condition reads systematically higher than the other – see [systematic difference](./concepts/agreement.md#b-systematic-difference). On the log scale the column is headed **Bias (ratio)** and holds a geometric mean ratio: 1.04 says the first condition reads 4% higher. There is no test of the bias against zero. {#bias #bias-ratio}
- **Lower limit** – the lower limit of agreement, $\text{bias} - z \cdot \text{SD}$ of the differences, with its own confidence interval; **Lower limit (ratio)** on the log scale – see [limits of agreement](./concepts/agreement.md#b-limits-of-agreement). {#lower-limit #lower-limit-ratio}
- **Upper limit** – the upper limit of agreement, $\text{bias} + z \cdot \text{SD}$, with its own confidence interval; **Upper limit (ratio)** on the log scale. Between the two limits lies the configured confidence level's share of individual differences – or, as ratios, the multiples of each other most individual pairs fall within. {#upper-limit #upper-limit-ratio}
- **Slope** – the proportional-bias trend with its interval: each difference regressed on its pair mean, on the log scale the log difference on the log pair mean. An interval excluding zero says the disagreement changes with magnitude, and a warning under the table says so in words – see [proportional bias](./concepts/agreement.md#b-proportional-bias).

> **The limits and the intervals beside them are different things.** The limits describe individual subjects; the interval beside each limit describes how precisely the sample pinned that limit down. A wide interval wants more subjects; a wide gap between the limits says the two conditions disagree, however many you collect – see [limits of agreement](./concepts/agreement.md#b-limits-of-agreement).

Under the **two-way mixed (consistency)** ICC model the SDC and the half-width of the limits are the same number; under either absolute-agreement model the SDC comes out larger, because it folds the systematic between-condition difference in where Bland-Altman reports it separately as the bias.

## Analysing on the log scale

- **Analyse on the log scale** – runs the whole Bland-Altman estimator on the natural logarithms of the measurements, for measurements whose disagreement grows in proportion to their size – the funnel in the plot, the slope's interval clear of zero. The bias becomes a geometric mean ratio and the limits ratio bounds, each interval exponentiated with its estimate, and the columns are headed *(ratio)* so the two readings can't be confused; the slope stays a regression coefficient, now of the log difference on the log mean. The plot stays in log units, its axes say so, and a note under the table states the split. Needs positive values: a measurement that is not positive has no logarithm and drops out the way a missing one does, and the number of pairs lost is reported under the table.

## Repeated measurements

Every metric in this module assumes one score per subject per condition, and by default a repeated subject–condition pair stops the run. Bland-Altman is the exception: it can analyse the repeats, but only once you say what they are, because two quite different designs produce the same duplicated rows.

Name an [occasion](#b-occasion-optional) column when both conditions were measured together on each occasion, so that replicate *j* of one condition pairs with replicate *j* of the other while the subject's true value is free to move between occasions. Each subject then contributes one difference per occasion, the table counts [Pairs](#b-pairs) and [Subjects](#b-subjects), and the intervals – not the bias or the limits – widen for the differences of one subject not being independent. A subject–occasion cell holding more than one measurement of the same condition is averaged before pairing, and a warning under the table counts those cells.

- **Repeated measurements** – the two radio buttons under the Bland-Altman options, for repeats with no such pairing: each subject's repeats are summarised to their mean, and the choice is what the limits should describe. They apply only when a subject has more than one row per condition and no occasion variable is named – an occasion supersedes them, and without repeats the ordinary estimator runs whichever is selected.
- **Limits for a single measurement** – the limits are widened by the within-subject variance, so they describe the difference between one measurement under each condition. Assumes a subject's true value stayed constant across the repeats, and that within-subject variability does not change with the magnitude of the measurement.
- **Limits for the average of repeated measurements** – the limits describe the difference between the means of a subject's repeats, and are not widened. Assumes a subject's true value stayed constant across the repeats.

Whichever route you take, a note under the table states the design and its assumption, so the card still explains itself once it has left your screen. With duplicated rows and neither declaration, Bland-Altman is refused along with the other metrics, and the message names both controls.

## Signal detection theory

When **Signal detection theory** is selected, it gets its own sub-section of the results card beside Bland-Altman – a response census in one table, the five indices in another. It reads the module's two conditions as a *true state* and an *observer's response*, crosses them into the 2 × 2 table those two produce, and answers a question the agreement coefficients cannot separate: whether poor agreement is a rater who cannot tell the cases apart or one who can but says "yes" too often – see [signal detection](./concepts/agreement.md#b-signal-detection). Two controls appear under the checkbox:

- **Condition holding the true state** – which of the two condition levels is the truth; the other is read as the observer's response, and the two cross into the hit / false-alarm table. Lists the condition's levels in the order they first appear in the data, the first selected by default. Swapping them transposes the table and changes every rate, so this one is yours to set.
- **Extreme rates** – what happens to a hit or false-alarm rate of exactly 0 or 1, which sends *z* to infinity and leaves d′, c and β undefined; the three choices are [below](#extreme-rates-and-what-they-break).

The census table is the raw material, one row per variable, and the two rates at its end are what every index is computed from – read it first:

- **Signal level** – the value of the score variable the run treated as "present": the higher of its two values (the later in sorting order, for text), chosen for you and named here. Relabelling both roles leaves d′ and A′ untouched and only flips the sign of the bias indices, which is why this is not a control while the true state is. When the later level means absent (a *no* that sorts after its *yes*, as «нет» does after «да»), recode the variable to 0/1 first.
- **Hits** – cases where the true state was the signal and the response said so.
- **Misses** – cases where the true state was the signal and the response said it was not.
- **False alarms** – cases where the true state was not the signal and the response said it was.
- **Correct rejections** – cases where the true state was not the signal and the response agreed.
- **Hit rate** – hits over all cases whose true state was the signal, as observed – whatever correction the parametric indices used; see [hit rate and false-alarm rate](./concepts/agreement.md#b-hit-rate-and-false-alarm-rate).
- **False-alarm rate** – false alarms over all cases whose true state was not the signal, as observed.

The index table reports five statistics per variable, with percentile-bootstrap confidence intervals over subjects when [**Confidence intervals**](#b-confidence-intervals) is on:

- **d′** – sensitivity: the distance between the noise and signal distributions in SD units, the z-score of the hit rate minus that of the false-alarm rate. 0 is chance performance; larger is better discrimination – see [d-prime](./concepts/agreement.md#b-d-prime).
- **A′** – sensitivity on a distribution-free 0–1 scale, 0.5 at chance and below it when false alarms outrun hits, defined where d′ is not, and computed from the observed rates whatever the correction.
- **c** – response bias: the criterion's distance from the neutral point, in the same SD units as d′. Above zero is a conservative observer who says "yes" too rarely, below zero a liberal one – see [response bias](./concepts/agreement.md#b-response-bias).
- **β** – the same statement on a ratio scale, where 1 is unbiased.
- **B″** – Donaldson's distribution-free bias index, on a −1 to 1 scale where 0 is unbiased, computed from the observed rates; left empty when both rates are 0 or 1 – every response correct, every one wrong, or every one the same – since both halves of its ratio are then zero.

> **Sensitivity and bias are separate things.** d′ and A′ say how well the two states can be told apart at all; c, β and B″ say only where the observer put the cut-off, and a single agreement coefficient reports one middling number for the pair. Report a sensitivity index alongside a bias index, or neither is interpretable – see [response bias](./concepts/agreement.md#b-response-bias).

It needs exactly two conditions and a score variable with exactly two distinct non-missing values. The gate is the values rather than the declared type, so a 0/1 column the importer typed as continuous works fine. Where nothing qualifies, the card says which of the two requirements failed rather than leaving the section quietly missing. Notes under the tables name the roles the two conditions took and the correction applied, and fire where they apply: when a variable's true state never varied, so there is no false-alarm rate to compare a hit rate against and every index is left empty; when a rate reached 0 or 1 with no correction, pointing at the control that would fill the empty cells; and when B″ is undefined.

### Extreme rates and what they break

A hit or false-alarm rate of exactly 0 or 1 sends *z* to infinity, and d′, c and β are all built on *z*. **Extreme rates** decides what happens then:

- **Log-linear (add 0.5 to every count)** – the default: adds 0.5 to every count and 1 to every total, whether or not a rate is extreme – a slight shrinkage everywhere, and no special case to reason about.
- **Replace only rates of 0 and 1** – moves an extreme rate to $1/(2N)$ or $1 - 1/(2N)$, with N the cases on that side of the truth, and leaves every other rate as observed.
- **None** – no correction, so an extreme rate leaves d′, c and β empty. {#extreme-rates-none}

The correction reaches **d′, c and β only**. A′ and B″ are distribution-free and defined at the extremes, so they are always computed from the observed rates – and the census table always reports the rates as they actually were, whatever the parametric indices used. A note under the table names the correction and what it touched.

## Assumptions

- **Subjects are independent.** Each subject should be a different person (or unit). Repeated measurements from the same subject under different conditions are fine – that's what the condition variable captures.
- **Same set of conditions for all subjects.** Every subject should ideally have a score under every condition (rater, time point). Missing combinations are handled but can reduce precision.
- **ICC assumes continuous, normally distributed data.** For ordinal or categorical data, use kappa or Krippendorff's alpha instead.
- **Bland-Altman assumes the differences behave the same way at every magnitude.** The limits are a mean plus or minus a multiple of one SD, so a single pair of limits only describes the data if the scatter keeps a constant width across the plot; a funnel that widens as values grow makes them too wide at the low end and too narrow at the high end. The **Slope** column reports the trend with an interval so you don't have to spot it by eye, and [**Analyse on the log scale**](#analysing-on-the-log-scale) is the remedy when the funnel is multiplicative – see [proportional bias](./concepts/agreement.md#b-proportional-bias).
- **Bland-Altman assumes one measurement per subject per condition, unless you say otherwise.** Repeated measurements are analysable, but only once you declare what they are – see [repeated measurements](#repeated-measurements). The two declarations rest on different assumptions, and the card states the one it used.
- **Kappa assumes categorical data.** For ordinal data, weighted kappa (quadratic weights, used automatically – Cohen's weighted κ with 2 raters, Light's κ with 3+) accounts for the distance between categories. For continuous data, use ICC.

## Missing data

Missing values are first handled by the global [missing data setting](./settings.md#missing-data): listwise deletion removes every row with a missing value in any selected variable before the module sees the data – a blank in one score variable takes that subject–condition row out for every score variable – imputation fills them in, and pairwise deletion, the default, leaves them to the metrics. A row missing its subject, condition or occasion is dropped before anything runs, and the layout preview counts the subjects with no row under some condition. What remains is handled per metric: kappa, Kendall's W, Pearson r and Spearman ρ use the subjects rated under every condition, Krippendorff's α those rated under at least two, ICC and SEM & SDC every rating present, and Bland-Altman and signal detection the complete pairs of the two conditions they compare – so each metric reports the N it ran on, in one shared **N** column while every metric of a table agrees and a column per metric as soon as one differs.

> **Which subjects did a coefficient use?** Under pairwise deletion the coefficients in one row can rest on different subjects – kappa on those rated under every condition, Krippendorff's α on everyone with two ratings – so read the N beside each; [listwise deletion](./concepts/outliers-missing-data.md#b-listwise-deletion) is the setting when the paper needs one sample behind every coefficient.

## Reporting checklist

Key things to include when writing up an agreement or reproducibility study:

**Method:**
- The [data layout](#data-layout): which column held the conditions – raters, time points or methods – and which the subjects, and how many of each
- Which [metrics](#reproducibility-metrics) were computed and why – ICC for continuous scores, kappa or Krippendorff's α for ordinal and categorical ones, Bland-Altman where the question is whether two methods can be used interchangeably, the correlations as consistency measures only
- The [ICC model and form](#icc-options), spelled as the column heads it – "ICC(2,1), two-way random, single measures" – and that the SEM was taken from the same model
- Which kappa variant ran – [Cohen's, weighted, Light's or Fleiss'](#b-cohens-lights-fleiss-kappa-κ) – and, for the weighted forms, that the weights were quadratic
- For Bland-Altman: which condition was subtracted from which, whether the analysis ran on the [log scale](#analysing-on-the-log-scale), and on repeated measurements whether an [occasion](#b-occasion-optional) variable paired the replicates or they were summarised to a mean – and, for the latter, whether the limits describe [a single measurement or the average](#repeated-measurements)
- For [signal detection](#signal-detection-theory): which condition was read as the true state and which value as the signal, and the [extreme-rate correction](#extreme-rates-and-what-they-break) used
- How missing data were handled – the [global setting](./settings.md#missing-data), and that each coefficient's N is the subjects it ran on ([missing data](#missing-data))
- The confidence level and, for the bootstrap intervals, the number of replications and the [seed](./settings.md#bootstrap-seed) they ran under

**Results:**
- Every coefficient with its confidence interval and N, its p where the metric has one, and the [interpretation](#b-interpretation) read on the coefficient's own scale, naming that scale
- SEM and SDC when reporting measurement precision, in the score's units, with the confidence level the SDC was built at
- For Bland-Altman: the bias and both limits of agreement with their confidence intervals – as ratios when the analysis ran on the log scale – the proportional-bias slope with its interval, and the number of pairs
- For signal detection: the hit and false-alarm rates the indices came from, and a sensitivity index paired with a bias index rather than either on its own

## R reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. The module uses `psych` for the ICC, with `lme4` behind it fitting the variance components, `irr` for kappa, Kendall's W and Krippendorff's α, and `tidyr` for the pivot from long to wide; the correlations, the SEM's analysis of variance and the proportional-bias regression are base R (`cor.test`, `aov`, `lm` with `confint`), and Krippendorff's bootstrap routine, the Bland-Altman bias, limits and intervals, the variance components and cluster-robust standard errors of the repeated designs and the [signal-detection](#signal-detection-theory) indices with their corrections are computed in the module's own R code, with no further package. Every bootstrap interval – κ, Kendall's W, SEM and SDC, Krippendorff's α and the signal-detection indices – runs under [**Bootstrap seed**](./settings.md#bootstrap-seed), an empty one giving fresh draws each run; the ICC, correlation and Bland-Altman intervals are analytic and need no seed. Citations for the R packages *and* the statistical methods your run actually used – the kappa variant, each coefficient that ran, the repeated-measures design and the corrections – appear automatically at the top of the output section. The reasoning behind each estimator, interval, band and refusal is on the [method notes](./methods/reproducibility-analysis.md) page.

## Common pitfalls

**Reading a high correlation as agreement.** A Pearson r of 0.98 between two raters says they rank subjects almost identically – it says nothing about whether they give the same *score*: a rater who is consistently five points high produces a near-perfect correlation and a five-point bias. If the question is whether two measurements can be used interchangeably, it is a [Bland-Altman](#bland-altman-agreement) question, not a correlation one – see [correlation is not agreement](./concepts/agreement.md#b-correlation-is-not-agreement).

**Reporting the average-measures ICC for scores one rater will give.** ICC(·,k) is always the higher of the two forms, and it describes the mean of all the raters – a score nobody will have in practice unless every future measurement is such a mean. When the scores that will be used come from one rater or one occasion, [single measures](#icc-options) is the coefficient to report, and the model and form belong in the paper beside the number – see [single and average measures](./concepts/agreement.md#b-single-and-average-measures).

**Reading kappa without the base rates.** A modest κ beside a high percentage of agreement is not a contradiction: when one category dominates, two raters would agree on most cases by guessing alone, and kappa measures only what is left above that floor. Report the category frequencies with the coefficient, and expect a skewed table to hold κ down however careful the raters – see [chance agreement](./concepts/agreement.md#b-chance-agreement).

**Taking the stars for the verdict.** The p-value beside an ICC, a κ or Kendall's W tests the null of no agreement at all, which any working instrument clears – a significant ICC of 0.40 is still poor. The [interpretation](#b-interpretation) band and the lower bound of the confidence interval are what say whether the agreement is good enough – see [statistical significance](./concepts/hypothesis-testing.md#b-statistical-significance).
