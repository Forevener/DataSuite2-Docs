---
title: Meta-analysis
description: Meta-analysis in DataSuite 2 – effect-size conversion, fixed- and random-effects pooling, forest and funnel plots, moderators, small-study effects.
---

# Meta-analysis

The **Meta-analysis** module pools the results of several studies into one estimate. It reads a study table in whatever form your extraction left it – precomputed effects, group means and SDs, 2×2 event counts, correlations, or a mixed sheet where every row reports something different – converts each row to an effect size with its sampling variance, and fits fixed- and random-effects models with heterogeneity statistics, a forest plot, subgroup and meta-regression models, small-study-effects tests and influence diagnostics. {#meta-analysis}

> **What is a meta-analysis?** A precision-weighted average of several studies' estimates, with an interval of its own and a measure of how far the studies disagree – see [meta-analysis](./concepts/meta-analysis.md#b-meta-analysis).

1. Load a study table – one row per study (or per result), or start one from an [extraction sheet template](#extraction-sheet-templates) – and let the module [detect its shape](#the-study-table)
2. Check the [column roles](#roles-and-optional-columns) and the [Study rows](#the-study-rows-panel) panel, which says what every row converts to
3. Pick the [effect measure](#effect-measures) and the [model options](#options)
4. Optionally add [moderators](#moderators) and choose how to handle [studies that contribute several rows](#dependence)
5. Click **Calculate**

## The study table

Meta-analysis differs from every other module here: it reads columns by *role*, not by selection. On load, the **Study data** card matches column names against the roles of each known table shape – `n1`, `n_treat`, `mean_control`, `sd2`, `events_1`, `ci_lower`, `yi`, `r`, `t`, `p` and dozens of spellings like them – and takes the first shape, in the order listed below, whose every role lands on a distinct column; a shape that matches by name but lands a role on a column of text is reported as that, with the columns named, rather than passed over. The detection line names the shape, the number of usable rows and the measures it can produce: **Detected** means the app read the table, **Detected, roles adjusted** that you changed a role, **Set manually** that you picked the shape yourself. **Re-detect from column names** throws your manual choices away. When a fixed shape wins on a sheet the mixed shape would read more rows of, the line says how many.

- **Study table shape** – the shape the sheet is read as, detected from the column names and changeable here. Each shape names the columns it reads – its *roles*, one dropdown each under the select – and the measures it can produce. The precomputed shapes sort above the arm-level ones, so a table already carrying an effect and its variance is never recomputed from arms that sit beside them; the mixed shape sorts last and is the only one that resolves partially, so it wins only where no fixed shape reads the table

The eleven shapes, in the order they are tried:

- **Precomputed effects with sampling variances** – an effect estimate and its sampling variance per row, read on the analysis scale – the log of a ratio, Fisher's z of a correlation, the log odds of a proportion. Nothing is computed: the measure you pick labels the output – see [precomputed shapes](#precomputed-shapes)
- **Precomputed effects with standard errors** – an effect estimate and its standard error, read on the analysis scale the same way; labelled only
- **Precomputed effects with confidence limits** – an effect estimate with its lower and upper limits, read on the analysis scale unless you mark them as on the natural scale; labelled only, and the one shape that asks at which level the limits were computed – both under [precomputed shapes](#precomputed-shapes)
- **Arm-level means and SDs** – mean, SD and n of two groups: SMD, MD, ROM
- **Within-subject means and SDs (pre/post or crossover)** – mean and SD at two occasions and one n: SMCC, SMCR, MC, ROMC
- **Arm-level event counts and group sizes** – events and n of two groups: OR, RR, RD, PETO
- **2×2 event and non-event counts** – events and non-events of two groups: OR, RR, RD, PETO
- **Correlations with sample sizes** – a correlation and its n: ZCOR
- **Single-arm event counts** – events out of n, one group: PR, PLO
- **Single-arm means with sample sizes** – mean, SD and n of one group: MN
- **Mixed reporting, row by row** – whatever each paper printed, converted row by row, for every measure the conversions produce; assign whichever of its columns your sheet has, and the Study rows panel says what each row resolved to – see [the mixed shape](#b-mixed-reporting-row-by-row) {#mixed-reporting-row-by-row-option}

### Roles and optional columns

Under the shape select, one dropdown per role shows which column fills it, **None** where no column does. A role several columns fit takes the column spelled as the role's own name where there is one, otherwise the first in selection order, and the detection line lists the others as *also fits*; a column you pick by hand takes it from the role that matched it by name, and two hand-picked roles on one column block the run until each has its own. The roles, by the shapes that ask for them:

**Precomputed shapes**

- **Effect estimate** – the study's effect as the paper or a previous analysis reported it, on the analysis scale unless the limits shape is told otherwise; on the mixed shape, a reported effect of any kind, with its standard error, limits or p beside it
- **Sampling variance** – the variance of the effect estimate, the square of its standard error
- **Lower confidence limit** – the lower end of the effect's published interval, computed at the level set under **Published interval**; on the mixed shape, an arm's mean carries a pair of its own
- **Upper confidence limit** – the upper end of the same interval; the two must be in order, with the estimate between them

**Two-group shapes**

- **Mean, group 1** – the outcome mean of the treatment or exposed arm
- **SD, group 1** – its standard deviation – not its standard error, which entered here is read as an SD without complaint
- **Sample size, group 1** – its n
- **Mean, group 2** – the control arm's mean
- **SD, group 2** – the control arm's standard deviation
- **Sample size, group 2** – the control arm's n
- **Events, group 1** – the number of participants with the event in the treatment arm, out of its sample size or beside its non-events
- **Events, group 2** – the same count for the control arm
- **Non-events, group 1** – the treatment arm's participants without the event, on the 2×2 shape, where n is events plus non-events
- **Non-events, group 2** – the same count for the control arm

**Within-subject shape**

- **Mean, follow-up (or condition B)** – the mean at the second occasion, or under the second condition of a crossover; the change is follow-up minus baseline
- **SD, follow-up (or condition B)** – its standard deviation
- **Mean, baseline (or condition A)** – the mean at the first occasion, or under the first condition
- **SD, baseline (or condition A)** – its standard deviation, the one a change standardised by the baseline SD divides by

**Single-arm shapes**

- **Events** – the number of participants with the event, out of the group's sample size; on the mixed shape, one arm's events beside its sample size

**Mixed shape – what an arm may report instead of a mean and SD**

- **Minimum** – the arm's smallest value, read with the median and maximum as a range, or with the quartiles as well as a five-number summary
- **First quartile** – the arm's lower quartile, read with the median and third quartile, or with the minimum and maximum as well
- **Third quartile** – the arm's upper quartile
- **Maximum** – the arm's largest value
- **Baseline mean** – the arm's mean before treatment, for a row measured at both occasions – a pre-post-control design – read beside the follow-up mean under the arm's **Mean**
- **Baseline SD** – the arm's standard deviation before treatment; the two arms' baseline SDs pool into the SD the change is standardised by

**Optional columns**, offered on every shape:

- **Study label (optional)** – the study's name, matched from `study`, `trial`, `author`, `label`, `id` and similar. Unassigned, the forest and the study table number the rows instead. A label that *repeats* is what unlocks the [Dependence](#dependence) card
- **Direction (optional)** – the review's sign convention, one cell per row: a negative number, `reverse` or `flip` negates that row's effect after conversion, so a study scored the other way round is corrected in the table rather than by editing its numbers; a blank or anything else keeps the study's own sign. Not offered for a raw proportion or a raw mean, which have no direction
- **Average cluster size (optional)** – for a study that randomised clusters (classrooms, clinics) but analysed individuals: the average number of individuals per cluster. A filled cell inflates that row's variance by the design effect 1 + (M − 1) × ICC; a cell below 1 is not read. Leave it blank where the study already adjusted for clustering
- **Intracluster correlation (optional)** – the study's own ICC, read only on a row with a cluster size; a blank takes the [assumed default](#assumed-values)
- **Pre–post correlation (optional)** – on the within-subject shape and the mixed shape's pre-post rows: the correlation between the two measurements on the same people, where the paper printed it; a blank takes the [assumed default](#assumed-values)
- **None** – no column fills the role. A fixed shape's own roles must all be filled before the run; an optional role may stay empty, and on the mixed shape a role no row fills is simply not read

### The Study rows panel

Once the roles read the sheet, **Study rows** lists every row with what it became. The line above the table counts the rows by state, and a sheet with nothing to look at shows that line alone.

- **Only rows needing attention** – on by default: hides every row that resolved cleanly and keeps the ones to look at – a row the conversion refused, a row the model dropped, a row read short of a fuller conversion because part of a baseline is blank, and a row whose estimate is not centred in its confidence limits. Untick it to see every row with its conversion
- **Study** – the study's label, or *Row n* by its case number where no label column is assigned; the same column heads the Studies table and the diagnostics on the card
- **Conversion** – on the mixed shape: the conversion the row took, a picker (*Read as*) where several fit, with the others listed under *Also fits*, so you can override the registry's ranking for that row – the choice is remembered by case number and survives re-detection; under the arm conversions, one line per group saying what each arm was read from, or what it still lacks; and under any reading, the checks the row's own values failed
- **Missing or invalid** – on a fixed shape: the roles whose cell is blank (*Blank*) or holds text (*Did not parse*), and the checks the row's values failed – a correlation outside −1 to 1, a p of zero, more events than the group holds, confidence limits out of order, an estimate outside its limits, a zero SD, a group with no participants, a five-number summary refused as skewed or whose n is below 5, and the rest the panel names in full
- **Status** – **Resolved** (the row converts), **Resolved by you** (you picked its conversion by hand), **Unresolvable** (a cell is missing, did not parse or fails a check, and the row is left out), or **Dropped by the model** after a run (the row converted but could not be weighted – a sampling variance of zero, a double-zero table under a ratio – and the card's lead note counts it)

### Extraction sheet templates

No sheet yet? Each table below is a header row the module reads unaided – every name lands on its role on load – with an example row under it showing what a filled cell looks like. Copy the header row off this page and paste it into row 1 of a spreadsheet, or copy the whole table and start from the example; save as CSV and load it. Keep the columns you fill and delete the rest, or leave them – an empty column claims nothing. Group 1 is the treatment or exposed arm and group 2 the control, and the numbered spellings are one choice among several: `m_treat`, `sd_control`, `n_ctrl` read the same way. Any sheet can also carry the [optional columns](#roles-and-optional-columns) `cluster_size` and `icc`, and as many free-text columns as the review needs – `instrument`, `timepoint`, `outcome` – which the module leaves alone until you pick one as a [moderator](#moderators).

**Precomputed effects with sampling variances**

| study | effect | variance | direction | notes |
|---|---|---|---|---|
| Smith 2019 | 0.42 | 0.031 | | |

**Precomputed effects with standard errors**

| study | effect | se | direction | notes |
|---|---|---|---|---|
| Smith 2019 | 0.42 | 0.176 | | |

**Precomputed effects with confidence limits**

| study | effect | ci_lower | ci_upper | direction | notes |
|---|---|---|---|---|---|
| Smith 2019 | 0.42 | 0.07 | 0.77 | | |

The three precomputed sheets are read on the analysis scale – a log ratio, a Fisher's z, a logit. On the limits sheet, heading the effect column `or`, `rr` or `hr` instead of `effect` reads the three values as the ratio the paper printed and sets the measure to match, as [precomputed shapes](#precomputed-shapes) describes.

**Arm-level means and SDs**

| study | m1 | sd1 | n1 | m2 | sd2 | n2 | direction | notes |
|---|---|---|---|---|---|---|---|---|
| Smith 2019 | 12.4 | 3.1 | 40 | 10.2 | 3.4 | 38 | | |

**Within-subject means and SDs (pre/post or crossover)**

| study | m_pre | sd_pre | m_post | sd_post | n | prepost_r | direction | notes |
|---|---|---|---|---|---|---|---|---|
| Smith 2019 | 10.2 | 3.4 | 12.4 | 3.1 | 40 | 0.6 | | |

**Arm-level event counts and group sizes**

| study | events1 | n1 | events2 | n2 | direction | notes |
|---|---|---|---|---|---|---|
| Smith 2019 | 12 | 40 | 21 | 38 | | |

**2×2 event and non-event counts**

| study | events1 | non_events1 | events2 | non_events2 | direction | notes |
|---|---|---|---|---|---|---|
| Smith 2019 | 12 | 28 | 21 | 17 | | |

**Correlations with sample sizes**

| study | r | n | direction | notes |
|---|---|---|---|---|
| Smith 2019 | 0.31 | 120 | | |

**Single-arm event counts**

| study | events | n | notes |
|---|---|---|---|
| Smith 2019 | 12 | 40 | |

**Single-arm means with sample sizes**

| study | mean | sd | n | notes |
|---|---|---|---|---|
| Smith 2019 | 12.4 | 3.1 | 40 | |

The mixed sheets are wider, since every way a paper might report gets a column, and a row fills only what its paper printed – the example rows show one study per kind of reporting. The columns each measure reads are named under the table; the rest go unfilled. A mixed sheet that has the `effect`, `ci_lower` and `ci_upper` columns at all detects as the precomputed-limits shape first, and the detection line then says how many rows **Mixed reporting, row by row** would read instead – pick it from the shape select.

**Mixed reporting – means (SMD, MD, ROM)**

| study | effect | se | ci_lower | ci_upper | p | m1 | sd1 | se1 | ci_lower1 | ci_upper1 | min1 | q1_1 | median1 | q3_1 | max1 | n1 | m1_pre | sd1_pre | m2 | sd2 | se2 | ci_lower2 | ci_upper2 | min2 | q1_2 | median2 | q3_2 | max2 | n2 | m2_pre | sd2_pre | prepost_r | d | g | t | r | direction | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Smith 2019 | | | | | | 12.4 | 3.1 | | | | | | | | | 40 | | | 10.2 | 3.4 | | | | | | | | | 38 | | | | | | | | | |
| Jones 2020 | | | | | | | | | | | | | | | | 35 | | | | | | | | | | | | | 33 | | | | | | 2.31 | | | |
| Lee 2021 | 0.42 | | 0.07 | 0.77 | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |
| Park 2018 | | | | | | | | | | | | 9 | 11 | 14 | | 25 | | | | | | | | | 7 | 9 | 12 | | 24 | | | | | | | | reverse | scored the other way |
| Kim 2022 | | | | | | 12.4 | 3.1 | | | | | | | | | 30 | 9.8 | 3.0 | 10.1 | 3.3 | | | | | | | | | 31 | 9.9 | 3.2 | 0.6 | | | | | | |

Under SMD every column reads. Under MD the two-group test columns `d`, `g`, `t` and the point-biserial `r` are not read; under ROM neither those nor the baseline columns and `prepost_r`. A `p` reads with the two group sizes under SMD and beside a reported `effect` under any measure. The `effect` and its `se`, limits or `p` are on the measure's own scale – a standardised or raw difference, or under ROM the ratio of means as the paper printed it.

**Mixed reporting – ratios and risk differences (OR, RR, RD, PETO)**

| study | effect | se | ci_lower | ci_upper | p | events1 | n1 | events2 | n2 | direction | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Smith 2019 | | | | | | 12 | 40 | 21 | 38 | | |
| Jones 2020 | 0.55 | | 0.31 | 0.98 | | | | | | | |
| Lee 2021 | 0.62 | 0.21 | | | | | | | | | |

Under OR, RR and PETO the reported `effect` and its limits are the ratio as the paper printed it, carried to the log scale on the way in; the `se` beside a ratio is the one a regression reports, on the log scale already. Under RD they are the difference itself.

**Mixed reporting – correlations (ZCOR)**

| study | effect | se | ci_lower | ci_upper | p | r | n | direction | notes |
|---|---|---|---|---|---|---|---|---|---|
| Smith 2019 | | | | | | 0.31 | 120 | | |
| Jones 2020 | 0.28 | | 0.12 | 0.43 | | | | | |

An `r` with its `n`, and an `effect` with its limits, are the correlation as the paper printed it; an `effect` beside an `se` or a `p` is read as Fisher's z.

## Effect measures

- **Effect measure** – the measure every row is converted to and pooled on. A fixed shape offers the measures it can compute, the mixed shape the eight its conversions produce, and a precomputed shape every measure, since it computes nothing: there the pick labels the output and sets the back-transformation, and the values are pooled as they stand unless marked below as on the natural scale. Every transformed measure is pooled on its analysis scale – the log of a ratio, Fisher's z of a correlation, the logit of a proportion – and the card prints the natural-scale value beside it

| Measure | Analysis scale | Natural scale | Shapes |
|---|---|---|---|
| **Standardised mean difference (Hedges' g)** | d units | – | Arm-level means, mixed |
| **Raw mean difference** | Outcome units | – | Arm-level means, mixed |
| **Log ratio of means** | log | **Ratio of means** | Arm-level means, mixed |
| **Log odds ratio** / **Log risk ratio** / **Log odds ratio (Peto)** | log | **Odds ratio** / **Risk ratio** / **Odds ratio (Peto)** | 2×2 shapes, mixed |
| **Risk difference** | Probability | – | 2×2 shapes, mixed |
| **Fisher's z-transformed correlation** | z | **Correlation** | Correlations, mixed |
| **Raw proportion** / **Log odds (logit-transformed proportion)** | p / logit | – / **Proportion** | Single-arm counts |
| **Raw mean** | Outcome units | – | Single-arm means |
| **Standardised mean change (by the SD of the change scores)** / **(by the baseline SD)** / **Raw mean change** / **Log ratio of means, within subjects** | d / d / units / log | – / – / – / **Ratio of means, within subjects** | Within-subject |
| **Log hazard ratio** / **Log incidence rate ratio** | log | **Hazard ratio** / **Incidence rate ratio** | Precomputed only (labels) |

The measures, in the order the select lists them:

- **Unspecified** – the precomputed shapes' opening choice: no scale is named, the effects are pooled as they stand and nothing is back-transformed. Pick the measure your effects are on before you report them
- **Standardised mean difference (Hedges' g)** – the difference between the two group means in pooled-SD units, with the small-sample correction applied to every row the module converts itself – see [Hedges' g](./concepts/effect-sizes.md#b-hedges-g). On the mixed shape a reported d is corrected on entry and a reported g is not, so put each in the column that names it
- **Raw mean difference** – the difference of the two group means in the outcome's own units, for studies that all measured the outcome on one scale
- **Log ratio of means** – the log of group 1's mean over group 2's, printed back as a **Ratio of means**; the outcome needs a true zero, and a mean that is not positive is refused
- **Log odds ratio** – the log of the odds of the event in group 1 over group 2, from a 2×2 table or a reported ratio, printed back as an **Odds ratio** – see [odds ratio](./concepts/effect-sizes.md#b-odds-ratio). A table with a zero cell has 0.5 added to every cell first
- **Log risk ratio** – the log of the event risk in group 1 over group 2, printed back as a **Risk ratio**; the same zero-cell correction
- **Log hazard ratio** – a label for precomputed effects: no shape computes a hazard ratio, but a sheet of reported log hazard ratios is named and printed back as a **Hazard ratio**
- **Log incidence rate ratio** – the same for reported rate ratios, printed back as an **Incidence rate ratio**
- **Risk difference** – the difference of the two event risks, on the probability scale; the one 2×2 measure that keeps a double-zero table by default
- **Log odds ratio (Peto)** – Peto's one-step estimate of the log odds ratio, computed on the uncorrected cells and printed back as an **Odds ratio (Peto)**: for rare events, an odds ratio near 1 and groups of similar size. A table with no events, or only events, in both arms is always left out
- **Fisher's z-transformed correlation** – a correlation pooled on Fisher's z scale, where its interval is symmetric, and printed back as a correlation; a correlation of exactly ±1 has no finite z and is refused
- **Raw proportion** – a single group's event rate, pooled on its own scale, where the variance shrinks to nothing at 0 and 1; a count of zero or of the whole group has 0.5 added to the events and the non-events. A magnitude rather than a contrast, so the direction column is not offered and the forest draws no null line
- **Log odds (logit-transformed proportion)** – a single group's proportion pooled as its log odds and printed back as a **Proportion**, the safer choice for proportions near 0 or 1; the same zero-count correction, no direction column, no null line
- **Raw mean** – a single group's mean in the outcome's units; like the two proportions a magnitude rather than a contrast, with no direction column and no null line on the forest
- **Standardised mean change (by the SD of the change scores)** – the within-subject change divided by the SD of the change scores, which no row reports: it is rebuilt from the two occasion SDs and the [pre–post correlation](#assumed-values), so that correlation sets the effect's scale as well as its variance
- **Standardised mean change (by the baseline SD)** – the change divided by the baseline SD alone; the follow-up SD is never read, and the correlation sets only the variance
- **Raw mean change** – the difference of the two occasion means in the outcome's units; the two occasion SDs and the correlation set its variance
- **Log ratio of means, within subjects** – the log of the follow-up mean over the baseline mean, printed back as a **Ratio of means, within subjects**; the outcome needs a true zero

### Precomputed shapes

A table carrying effects with their variances, standard errors or limits computes nothing: the measure you pick *labels* the output and sets the back-transformation, and the values are pooled as they stand. Under a transformed measure the card assumes they are already on the analysis scale. A column headed `or`, `rr`, `hr` or `irr` picks the matching ratio for you once – and, on the limits shape, ticks the box below; a pick made after that stands until the sheet changes or you re-detect.

- **The values are on the natural scale** – offered on the precomputed shapes under a transformed measure, and enabled on the limits shape alone: ticked, the effect and its limits are read as the ratio, correlation or proportion itself – as papers print them – and carried to the analysis scale before the variance is derived from them. On the variance and standard-error shapes the box is shown disabled, since a variance or a standard error on the natural scale has no route to the analysis scale
- **Level the confidence limits were computed at** – under **Published interval**, 95%, 90% or 99%, shown wherever the sheet carries confidence limits: the limits shape, and the mixed shape once a reported effect's limits or an arm's limits are assigned. This is the level *your file's* intervals carry, not the level results are reported at – the variance is the square of the half-width divided by that level's quantile, so getting it wrong scales every standard error

### The mixed shape

**Mixed reporting, row by row.** The sheet an extraction actually produces: one study gives means and SDs, the next a t statistic, a third an odds ratio with its interval. Its roles are offered in groups – a reported effect with its standard error or confidence limits, **Group 1** and **Group 2** summaries (mean, SD, SE, confidence limits, five-number summary, quartiles, range, events, n, plus baseline mean and SD), a **Two-group test** (Cohen's d, Hedges' g, t, p) and a **Correlation** with its n. Assign whichever your sheet has. Each row is then resolved against a registry of *recipes*, in the order below; a row several recipes fit is read by the first unless you pick another under **Conversion** in the [Study rows](#the-study-rows-panel) panel, and the card's **What the analysis took on trust** block counts both kinds.

The recipes, each naming what a row must carry and the measures it serves:

- **Two arms, each at baseline and follow-up** – each arm's baseline mean and SD beside its follow-up mean and n: a pre-post-control design, standardised by the pooled baseline SD (Morris's d<sub>ppc2</sub>) under SMD, where the follow-up SDs are never read and may stay blank, or the difference in mean change under MD, where they are read. The [pre–post correlation](#assumed-values), the row's own or the assumed value, sets each arm's change variance. A row that fills only part of a baseline falls back to the two arm summaries, is counted on the card and is held for attention in the Study rows panel
- **Two arms, each from its own summary** – each arm's mean and SD, reported or derived through one of the arm conversions below, with its n; SMD, MD or ROM
- **Two arms, each as an event count with its size** – each arm's events beside its n, a 2×2 table under any of OR, RR, RD or PETO, read with the measure's default for a double-zero table – the mixed shape has no widget for the choice
- **t statistic with both group sizes** – a t from an independent two-sample test on the pooled SD; SMD. A paired or a Welch t reconstructs a different effect, and an F from a two-group comparison enters as t = √F
- **p value with both group sizes** – an exact two-sided p from the same test; SMD. The p's sign supplies the direction – a negative p is a negative effect, exactly as a negative t is – so record a study that ran the other way on the p or in the direction column, never both
- **Standardized mean difference with both group sizes** – a reported Cohen's d; SMD. The small-sample correction is applied here, so a study already reporting Hedges' g is corrected twice
- **Hedges' g with both group sizes** – a reported g, pooled without a second correction; a Cohen's d entered here goes uncorrected
- **Point-biserial correlation with both group sizes** – a correlation between a two-level group variable and the outcome, converted to SMD; a Pearson correlation between two continuous variables is a correlation row instead
- **Correlation with its sample size** – a Pearson correlation and its n; ZCOR
- **Reported effect with its standard error** – for any measure: the variance is the standard error's square. Under SMD the estimate is pooled as reported, with no small-sample correction
- **Reported ratio with its standard error** – under OR, RR, PETO or ROM: the ratio is carried to the log scale and the standard error kept as reported, since a regression reports a ratio's standard error on that scale already
- **Reported effect with its confidence limits** – for any measure: the interval read as a symmetric Wald interval at the level set under **Published interval**
- **Reported ratio with its confidence limits** – under the ratio measures: the estimate and its limits carried to the log scale, where the interval is taken to be symmetric
- **Reported correlation with its confidence limits** – under ZCOR: the estimate and its limits carried to Fisher's z the same way
- **Reported effect with its p value** – for any measure: the standard error read off a two-sided Wald z test of the estimate against zero. The estimate carries the direction, and a negative p is refused
- **Reported ratio with its p value** – under the ratio measures: the ratio carried to the log scale before the standard error is read off the p

Under the two-arm summary recipe each arm resolves through the first of these its cells fill, the reported pair first; where several fit, the row's group line carries a picker:

- **Mean and SD** – the reported pair, read as it stands
- **Mean with its standard error** – the SD recovered as SE × √n
- **Mean with its confidence limits** – the SD recovered from the interval, read as a t interval on n − 1 degrees of freedom at the level set under **Published interval**
- **Five-number summary** – minimum, quartiles, median and maximum, converted by metafor's `conv.fivenum`; an arm whose summary fails its skewness test is refused, and one with n below 5 or its numbers out of order takes no five-number conversion
- **Median with quartiles** – the median with its two quartiles, converted the same way
- **Median with range** – the median with the minimum and maximum, converted the same way

## Options

The right column holds the run's settings and the **Calculate** button. Before any of them, the **Study data** notices at the top of the left column: the module needs the [global missing-data method](./settings.md#missing-data) set to pairwise, and warns while imputation or listwise deletion is rewriting the study table under the roles.

### Double-zero tables

- **Studies with no events, or only events, in both arms** – shown on the two 2×2 shapes, under the effect measure: what to do with a table whose two arms both have no events, or both have only events. The select resets to the measure's own default whenever the measure changes and the note under it says the measure's case; under **Log odds ratio (Peto)** it is pinned to leaving them out, since Peto's estimate takes nothing from such a study. The mixed shape offers no choice – its 2×2 rows take the measure's default
- **Leave them out** – the default under the log odds ratio, the log risk ratio and Peto: such a table says nothing about a ratio. The card's lead note counts the studies left out
- **Keep them, with 0.5 added to every cell** – the default under the risk difference, where two risks of zero still say something about their difference. Under a ratio it pools a ratio of exactly 1 with a large variance

### Dependence

Shown only when a study label repeats among the usable rows – a study that reported two outcomes, three time points, or several subgroups – with a line counting the studies and rows concerned. Three answers:

- **Every row is a study — the pooled interval is too narrow** – the default: every row is pooled as its own study, and the card warns about the repeated labels. It is there so you can see what the naive analysis said, not so you can report it
- **One composite per study — nothing else changes** – rows sharing a label are combined first into one inverse-variance weighted composite each, under the [assumed within-study correlation](#assumed-values); every other block then runs as usual on the composites. A moderator that varies within a study is withheld in this mode and named under the list. With a handful of duplicated studies and one main outcome, the simplest honest answer
- **Model the hierarchy — some blocks switch off** – the correlated-hierarchical-effects (CHE) model: a random effect per study and per row within it, the sampling errors of one study's rows correlated at the assumed value, every estimate tested with a cluster-robust standard error, and the variance components estimated by REML whatever the estimator select says. The current recommendation where many studies contribute many rows, at the cost of the blocks that have no form for dependent effects – see [under the hierarchy](#under-the-hierarchy)

> **Rows from one study?** They are not independent evidence, and pooling them as such narrows the interval – see [dependent effect sizes](./concepts/meta-analysis.md#b-dependent-effect-sizes).

### Assumed values

One input per number the analysis has to assume because papers do not report it, shown as the assignment and the dependence mode bring each into play. Under each input a tally says how many usable rows the assumption reaches and how many of those carried their own value instead; a typed value outside the number's range falls back to the default, and so does a row's own cell outside it, counted apart in the tally. Every assumption in play is then swept over a grid under **What the analysis took on trust** on the card, so you can see how far the pooled estimate moves with it.

- **Intracluster correlation (ICC)** – default 0.05, between 0 and 1; read on a row with a cluster size whose own ICC cell is blank. With the average cluster size M it sets the design effect 1 + (M − 1) × ICC a clustered row's variance is inflated by
- **Pre–post correlation** – default 0.5, from −1 up to but not including 1: the correlation between the two measurements on the same people, which sets the variance of every change score – and, under the standardised mean change by the change-score SD, its scale. Offered on the within-subject shape, and on the mixed shape wherever a pre-post-control row could fire
- **Within-study correlation** – default 0.8, from 0 up to but not including 1: between the sampling errors of two effects from one study – how far a study's rows count as one piece of evidence. Offered under the composite and hierarchy modes; no study reports it, so every row reached runs on the default

### Model

- **Heterogeneity variance estimator (τ²)** – how the between-study variance is estimated for the random-effects fit; the heterogeneity heading on the card names the one that ran. Under the hierarchy the select is disabled: the variance components are estimated by REML whatever is chosen
- **Restricted maximum likelihood** – REML, the default and the general recommendation; the only estimator under which the moderator model's likelihood-ratio comparison runs
- **DerSimonian-Laird** – the moment estimator most published analyses used; pick it to reproduce one
- **Paule-Mandel** – the estimator that solves the Q equation for τ²
- **Sidik-Jonkman** – a non-iterative estimator that tends to overestimate a small τ², giving wider intervals
- **Knapp-Hartung adjustment** – on by default: tests the random-effects estimate and the moderator coefficients on a t distribution with an adjusted standard error, which keeps the error rate honest with few studies. The fixed-effect estimate stays on z, where the adjustment does not apply. Under the hierarchy the box is disabled – the cluster-robust t stands in for it

> **Fixed or random effects?** The card reports both, and they answer different questions; report the random-effects estimate unless you have reason to believe the effect is truly one – see the [fixed-effect](./concepts/meta-analysis.md#b-fixed-effect-model) and [random-effects](./concepts/meta-analysis.md#b-random-effects-model) models.

### Forest plot, small-study effects, influence diagnostics

- **Draw the forest plot** – on by default; the **Studies** table carries the same estimates, intervals and weights either way, with the standard errors beside them
- **Funnel plot with Egger's and Begg's tests** – on by default: the [small-study effects](#small-study-effects) block, with three optional adjustments nested under it that exist only while it is on. They are sensitivity checks on the pooled estimate – report them beside it, never in its place. Under the hierarchy Egger's regression runs with a cluster-robust t and Begg's test is off
- **Trim-and-fill sensitivity analysis** – off by default: estimates how many studies are missing from the thinner side of the funnel, fills them in and refits, reporting the adjusted estimate. Off under the hierarchy, where it has no form for dependent effects
- **Selection model sensitivity analysis** – off by default: a step selection model that lets a study's chance of publication drop past a one-sided p of .025, and reports the estimate adjusted for it with a test of whether selection is there at all. Off under the hierarchy
- **PET-PEESE sensitivity analysis** – off by default: the effect predicted at a standard error of zero, by a regression on the standard error (PET) or, when PET finds an effect, on the variance (PEESE). Runs under the hierarchy too, with a cluster-robust t
- **Leave-one-out, influence measures and a Baujat plot** – on by default: the [influence diagnostics](#influence-diagnostics) block. It refits the model twice per study, so it is the slowest block with many studies. Under the hierarchy each study is left out with all of its rows at once, and the row-level influence measures and the Baujat plot are off

## Moderators

The **Moderators** card appears once the sheet is read and lists every selected variable no role claimed; **Deselect all** and **Invert selection** work the list. Picking a categorical column makes the run a subgroup analysis, a continuous one a meta-regression, several of either a joint model; leave the list empty to pool without one. Under the composite mode a variable that takes two values within one study is withheld and named under the list. Once anything is picked, a budget line counts the studies against the coefficients the model will cost – a categorical moderator with L levels costs L − 1, and under the composite or hierarchy modes the studies are counted after folding – and turns to a warning when the ratio falls under ten studies per coefficient; under the screen with several moderators it names the tightest single model. {#moderators}

Per picked moderator a strip offers the choice its type takes:

- **Reference level** – for a categorical moderator: the level the others' coefficients are contrasts against, opening on the largest. Its levels are listed under it with their study counts, largest first, and a level with fewer than three studies is flagged as too thin to read a subgroup estimate off. Absent under the screen, which prints no coefficients; the counts stay
- **Centre on the mean ({mean})** – for a continuous moderator, on by default: the moderator is centred on its mean across the modelled studies, so the intercept is the effect at an average value rather than at zero. A continuous moderator has no strip under the screen

Under **Fit mode** and **Model options**:

- **One model, all moderators** – the default: every picked moderator in one model, with a coefficient per term and one omnibus test
- **Screen each moderator on its own** – one model per moderator, each fitted on the studies that carry it, and one row of output each – the omnibus test, τ² and R² – with no coefficients, so the reference level and the centring do not reach it. A moderator constant on its studies, or carried by fewer than three, keeps its row marked as not fitted
- **Permutation test** – off by default: re-fits the model under reshuffles of the moderator values, taking the count from the [permutation replications setting](./settings.md#permutation-replications), and reports a permutation p beside each coefficient's and the omnibus test's – per row under the screen. Slow, and the way to an honest p with few studies; disabled under the hierarchy, where the cluster-robust t stands in
- **Estimate τ² separately within each subgroup** – shown for a single categorical moderator under the joint fit: fits each level on its own τ² and tests the levels against each other with a between-subgroups Q. A level with fewer than three studies keeps its estimate but reports its τ² as not estimable and stays out of the Q

> **Few studies?** A moderator model on a dozen studies has little power and a badly inflated false-positive rate when several moderators are tried and the one that worked is reported – pre-specify them, watch the budget line, prefer the permutation test, and read the screen as a screen; see [meta-regression](./concepts/meta-analysis.md#b-meta-regression).

## Reading results

The card is titled with the measure. A lead note at the top says what happened to the rows: how many were left out and why – a missing or non-numeric value (on the mixed shape, a row no conversion could read), a value the conversion refuses, a sampling variance of zero, a double-zero table, a five-number summary refused as skewed – how many 2×2 tables were continuity-corrected and how many of those were double-zero tables kept in the pool, how many rows were read short of a baseline or with an estimate off the centre of its limits, the level the published limits were read at, how many rows the direction column reversed, and how the dependence mode combined or modelled the rows. If a study label repeats and the hierarchy is not modelled, a warning lists the studies and points at **Dependence**; under the hierarchy a warning names an estimate whose robust t rests on fewer than 4 degrees of freedom.

### What the analysis took on trust

**What the analysis took on trust.** Present whenever a conversion assumed anything or a number was assumed, above the pooled estimate. One entry per recipe that fired on the mixed shape – or one over every row of a fixed shape whose conversion assumes anything – spells out that conversion's assumptions in full, with the arm conversions that fired under it; an entry counts the rows that fit more than one conversion and says how many were read by the registry's ranking and how many by your pick in the [Study rows](#the-study-rows-panel) panel; then one entry per [assumed value](#assumed-values) in play: how many rows carried their own value, how many took the default, how many carried a value outside the range and took the default, and a sweep table that refits the model at each grid value, the default's row highlighted. It is the material for the assumptions paragraph of your Method section.

- **Assumed value** – the value the model was refitted at: the input's grid and the default it ran on, the highlighted row being the analysis above. A point whose refit failed prints R's message in the estimate's place

The other columns – the estimate, its interval and **τ²** (**σ² (between studies)** under the hierarchy) – are the pooled result at that value, from the same model the card reports; a row that carried its own value keeps it at every point, so the sweep moves what was assumed and never what was known.

### Pooled estimate

**Pooled estimate ({k} studies).** The two models, tabled together with a row each; the heading counts the studies pooled – under the hierarchy it reads **Pooled estimate ({k} rows from {studies} studies)**, the rows and the studies they belong to. Read the two rows as answers to different questions, never as one estimate computed two ways – see the [fixed-effect](./concepts/meta-analysis.md#b-fixed-effect-model) and [random-effects](./concepts/meta-analysis.md#b-random-effects-model) models. {#pooled-estimate-k-studies #pooled-estimate-k-rows-from-studies-studies}

- **Model** – which fit the row reports: **Random effects** and **Fixed effect**, or **Hierarchical effects** and **Common effect** under the hierarchy
- **Random effects** – the model that lets the true effect differ from study to study and estimates the mean of those effects: the row to report unless you have reason to believe the effect is truly one – see [random-effects model](./concepts/meta-analysis.md#b-random-effects-model). Under Knapp-Hartung it is read against **t** on the **df** shown, with its standard error adjusted to match; with the adjustment off, against **z**
- **Fixed effect** – the model that assumes one true effect behind every study: the precision-weighted average, always tested on **z**, since the Knapp-Hartung adjustment does not apply to it – see [fixed-effect model](./concepts/meta-analysis.md#b-fixed-effect-model). When the two rows disagree, the studies are heterogeneous and the random-effects row is the summary to report
- **Hierarchical effects** – under the hierarchy, in the random-effects row's place: the correlated-hierarchical-effects model – a random effect per study and per row within it – with its estimate tested on a cluster-robust t and Satterthwaite **df**
- **Common effect** – under the hierarchy, in the fixed-effect row's place: the common-effect working model on the same rows, tested with the same cluster-robust t
- **Robust SE** – under the hierarchy: the cluster-robust standard error every estimate is tested with, in the SE column's place
- **Model SE** – under the hierarchy: the model-based standard error beside the robust one; a robust SE far from it says the clustering matters
- **{scale} [{level}% CI]** – for a measure with a natural scale: the same estimate and interval back-transformed – the ratio, correlation or proportion itself, as a paper quotes them – in the pooled and the Studies tables alike

The estimate and its **SE** are on the analysis scale, the interval at the [global level](./settings.md#confidence-level); **t** and **df** are filled on the random-effects row under Knapp-Hartung and **z** on the fixed-effect row, **z** alone on both with the adjustment off, and **t** and **df** on both under the hierarchy; **p** follows whichever statistic the row carries. A note under the table says so when Knapp-Hartung is on.

### Heterogeneity

**Heterogeneity (τ² by {estimator}).** How far the studies disagree beyond sampling error, under the τ² estimator the heading names – the one that ran; under the hierarchy the heading reads **Heterogeneity (σ² by {estimator})** and the table carries the two-level statistics below. What the statistics mean is the concept page's – see [heterogeneity](./concepts/meta-analysis.md#b-heterogeneity). {#heterogeneity-τ²-by-estimator #heterogeneity-σ²-by-estimator}

- **Heterogeneity test** – Cochran's Q with its df and p: a small p says the studies disagree more than sampling error explains; with few studies the test has little power, so read the statistics below as well – see [Cochran's Q](./concepts/meta-analysis.md#b-cochrans-q)
- **I² (inconsistency)** – the share of the total variation that is between-study rather than sampling error, with its interval; a proportion, not a size – see [I²](./concepts/meta-analysis.md#b-i²). The same statistic heads the **I²** column of the leave-one-out and separate-τ² tables {#i²-inconsistency #i²}
- **H²** – the ratio of total to sampling variation, with its interval; 1 means none beyond chance – see [H²](./concepts/meta-analysis.md#b-h²)
- **τ² (between-study variance)** – the variance of the true effects on the effect's own scale, with its interval; the same quantity heads the **τ²** column of the leave-one-out, separate-τ² and sweep tables – see [between-study variance](./concepts/meta-analysis.md#b-between-study-variance-τ²) {#τ²-between-study-variance #τ²}
- **τ (between-study SD)** – the square root of τ²: the spread of the true effects in the effect's own units, readable against the estimate itself
- **Prediction interval** – where the true effect of a new study drawn from the same population would fall, with its natural-scale version beside it; wider than the confidence interval whenever τ² is above zero, and the honest answer to what a new study may find – see [prediction interval](./concepts/meta-analysis.md#b-prediction-interval-for-a-new-study)
- **I² (between studies)** – under the hierarchy: the share of the total variation that is between studies
- **I² (within studies)** – under the hierarchy: the share that is between one study's rows; the two shares and the sampling share sum to 100%
- **σ² (between-study variance)** – under the hierarchy: the variance of the true effects between studies, in τ²'s place; the same quantity heads the **σ² (between studies)** column of the diagnostics, separate-fit and sweep tables {#σ²-between-study-variance #σ²-between-studies}
- **σ² (within-study variance)** – under the hierarchy: the variance of the true effects between one study's rows {#σ²-within-study-variance #σ²-within-studies}

> **I² versus τ²:** I² says how much of what you see is real disagreement, τ (or the prediction interval) how big it is – report the second whenever heterogeneity matters to the conclusion; see [I²](./concepts/meta-analysis.md#b-i²).

### Moderator models

**Moderator: {name}.** The moderator model's section, directly under the heterogeneity it accounts for, titled with the moderator's name – **Moderators ({count})** for a joint model of several. Its first table says what the model explained; then the subgroup table a single categorical moderator earns, or the coefficient table every other model gets; and a note names each moderator's reference level, each centring and its mean, any term metafor dropped as redundant, any moderator left out as constant, and the studies that carry no value for the moderators. A model metafor could not fit keeps the section with metafor's message, and the rest of the card stands without it. {#moderator-name #moderators-count}

- **Omnibus test of moderators** – Q<sub>M</sub> on the moderators' df (an F with a denominator df under Knapp-Hartung and under the hierarchy) testing whether the moderators together explain anything
- **R² (heterogeneity explained)** – the share of τ² the moderators account for; **R² (between-study heterogeneity explained)** under the hierarchy, and the **R²** column of the screen {#r²-heterogeneity-explained #r²-between-study-heterogeneity-explained #r²}
- **Residual heterogeneity** – Q<sub>E</sub> and p for the disagreement left after the moderators
- **τ² (residual)** – the between-study variance left after the moderators, against the plain model's with no moderator in it; **σ² between studies (residual)** under the hierarchy {#τ²-residual #σ²-between-studies-residual}
- **Likelihood-ratio test against that model** – the moderator model against the plain one, both refitted by maximum likelihood for the test; present when τ² was estimated by REML on the independent rows
- **Omnibus test, by permutation** – the omnibus test's p from the [permutation test](#b-permutation-test), when it ran
- **Subgroups** – for a single categorical moderator: one row per level, largest first, with the level's own pooled estimate and, beside it, the level's contrast against the reference level from the same model; the reference level's contrast cells are dashes, and so are those of a level metafor dropped as redundant
- **Subgroup** – the level's value
- **Subgroups – Studies** – the number of studies in the level, the candidate's model or the separate fit; under the hierarchy the studies the rows belong to {#subgroups-studies #subgroups-with-a-τ²-of-their-own-studies #subgroups-with-variance-components-of-their-own-studies #moderator-screen-count-candidates-studies}
- **Rows** – under the hierarchy: how many of the sheet's rows the level, the candidate's model or the study contributes
- **Subgroup means** – the level's own estimate, standard error and interval off the fitted model: the intercept plus the level's contrast
- **Contrasts against {reference}** – the level's coefficient against the reference level the header names, with its standard error, interval, t or z (and df under the hierarchy), p and the permutation p where the test ran
- **p (permutation)** – the coefficient's or the omnibus test's p from the [permutation test](#b-permutation-test), when it ran; the intercept has none, since reshuffling the moderator leaves it untouched
- **Subgroups with a τ² of their own** – when separate τ² was requested: each level fitted on its own, with its estimate, interval, **τ²** and **I²** – **σ² (between studies)** and **I² (between studies)** under the hierarchy, where the table is titled **Subgroups with variance components of their own** – and the between-subgroups Q in the note. A level with fewer than three studies keeps its estimate but shows dashes for its τ² and I² and stays out of the Q; a level whose fit failed stays out too, and the note names both {#subgroups-with-a-τ²-of-their-own #subgroups-with-variance-components-of-their-own}
- **Coefficients** – for every other model: one row per term – **Intercept**, each continuous moderator, each non-reference level of a categorical one – with the estimate, standard error, interval, t or z, df under the hierarchy, p and the permutation p where it ran
- **Intercept** – the pooled effect at the reference level of every categorical moderator and at the mean of every centred continuous one – at zero for one not centred
- **Bubble plot** – for a single continuous moderator: one bubble per study, area proportional to its weight in the fit, the fitted line with its confidence band and, outside it, the band where a new study at that moderator value would be expected to fall

**Moderator screen ({count} candidates).** In screen mode: one row per candidate moderator, each from a model of its own on the studies that carry it, and a note that says how many models were fitted – nothing in the table is adjusted for that – and names the candidates that could not be fitted alone or took one value, and the studies each model never saw. {#moderator-screen-count-candidates}

- **Moderator** – the candidate's name
- **Omnibus df** – the coefficients the candidate's model spends: 1 for a continuous moderator, L − 1 for a categorical one with L levels
- **Omnibus test** – the candidate's omnibus statistic – Q<sub>M</sub>, or an F carrying its own df – with **p** beside it and **p (permutation)** where the test ran; **R²** is the share of τ² the candidate explains on its own studies

### Forest plot and Studies

**Forest plot.** One row per study – its label, a square at its effect sized by its weight, its interval, and to the right its n where the sheet carries one and its weight under the random-effects (or hierarchical) model – with that model's pooled estimate as a diamond underneath and a dashed whisker through the diamond for the prediction interval; the fixed-effect estimate is in the table above. A multiplicative measure is drawn on a log axis labelled in natural units with the null line at 1; a proportion or a raw mean draws no null line. How to read it is the concept page's – see [forest plot](./concepts/meta-analysis.md#b-forest-plot).

**Studies.** The numbers the forest draws, one row per pooled row, whether or not the plot is drawn.

- **Row** – the row's case number, where no study label column is assigned; **Study** heads the column otherwise, and the same column heads the diagnostics
- **Effect** – the row's effect size on the analysis scale, as converted or as reported
- **Weight (random)** – the row's share of the random-effects pooled estimate, in percent; **Weight (hierarchical)** under the hierarchy {#weight-random #weight-hierarchical}
- **Weight (fixed)** – the row's share of the fixed-effect estimate, where the large studies dominate; **Weight (common)** under the hierarchy {#weight-fixed #weight-common}

Beside them **N** where the sheet carries sizes, **SE**, the interval and, for a measure with a natural scale, the back-transformed column of the pooled table.

### Small-study effects

**Small-study effects.** Runs from three studies, with a low-power caution below ten; asked for on fewer, the block says so and stops. A table with one row per test that ran, above the funnel plot – a test that failed keeps its row with metafor's message – and a note naming the model each test was fitted on and what is off. What asymmetry means, and does not mean, is the concept page's – see [small-study effects](./concepts/meta-analysis.md#b-small-study-effects).

- **Egger's regression** – the effects regressed on their standard errors under the random-effects model, with the slope's t (or z, with Knapp-Hartung off) and p: a slope different from zero is asymmetry
- **Egger's regression (sample-size SE)** – added when the measure is Hedges' g and every row carries both group sizes: the same regression on the standard error a zero effect would have, a function of the sizes alone; the row to read, since g's own standard error depends on g and the standard form flags asymmetry too often
- **Peters' regression** – added when every row came off a 2×2 table: the effects regressed on the inverse of the total sample size, weighted by the events and non-events; the row to read for a binary measure, whose standard error depends on the estimate the same way
- **Begg's rank correlation** – Kendall's τ between the effects and their variances, with its p
- **Regression limit estimate** – the effect Egger's line predicts at a standard error of zero, with its interval
- **PET-PEESE estimate** – when requested: the limit estimate (PET), or the estimate of the same regression on the variance (PEESE) where PET's intercept rejects zero, with the one-sided test that decided which
- **Trim-and-fill: studies imputed** – when requested: how many studies the algorithm judged missing, with that count's standard error and the side of the funnel they are missing from
- **Trim-and-fill: adjusted estimate** – the pooled estimate with the imputed studies filled in, with its interval; **Trim-and-fill** alone heads the row when the algorithm did not run {#trim-and-fill-adjusted-estimate #trim-and-fill}
- **Selection model: studies by p** – when requested: how many studies fall at or below a one-sided p of .025 and how many above, and which side the one-sided p ran on – that of the pooled estimate
- **Selection model: adjusted estimate** – the pooled estimate under the selection model, with its interval; where every study falls on one side of the step the row says the model did not hold, and **Selection model** alone heads the row when the fit did not run {#selection-model-adjusted-estimate #selection-model}
- **Selection model: δ** – the relative probability that a non-significant result was published, with its standard error and a likelihood-ratio test against δ = 1

The funnel plot draws each study's effect against its standard error, the dashed funnel where studies would fall under sampling error alone at the global level and, for a measure with a null at zero, the grey wedges of the significance contours (.01, .05, .10) around it. Trim-and-fill's imputed studies are drawn hollow, mirrored about the adjusted estimate's dashed line – see [funnel plot](./concepts/meta-analysis.md#b-funnel-plot). {#funnel-plot}

> **Asymmetry is not proof of publication bias.** Small studies reporting larger effects has several causes, the tests have almost no power below ten studies, and each adjustment rests on a model of how studies went missing – report them as sensitivity analyses beside the main estimate; see [small-study effects](./concepts/meta-analysis.md#b-small-study-effects) and [publication bias](./concepts/meta-analysis.md#b-publication-bias).

### Influence diagnostics

**Influence diagnostics.** Runs from three studies – asked for on fewer, the block says so and stops. One row per study in two column groups, the studies metafor flags as influential highlighted; then the Baujat plot and a note with the leave-one-out range – the smallest and largest pooled estimate any single omission produces, against the estimate with every study – and the cutoffs the flags used. A battery that failed leaves the other's columns standing, and the note names it – see [leave-one-out analysis](./concepts/meta-analysis.md#b-leave-one-out-analysis).

- **Pooled without each study** – the estimate, interval, **I²** and **τ²** of the model refitted without that study
- **Influence measures** – six per study, each a regression diagnostic read with the study as the case and the pooled estimate as the fit; a study is flagged when its DFFITS, Cook's distance, leverage or DFBETAS passes metafor's cutoff, and the note prints the cutoffs
- **Studentised residual** – how far the study's effect sits from the estimate pooled without it, in standard-error units – see [studentized residual](./concepts/outliers-missing-data.md#b-studentized-residual)
- **DFFITS** – how far the study's own fitted value moves when the study is dropped, in standard-error units – see [DFFITS](./concepts/outliers-missing-data.md#b-dffits)
- **Cook's distance** – how far the pooled estimate moves when the study is dropped, scaled by its variance – see [Cook's distance](./concepts/outliers-missing-data.md#b-cooks-distance)
- **DFBETAS** – how many standard errors the pooled estimate moves when the study is dropped – see [DFBETAS](./concepts/outliers-missing-data.md#b-dfbetas)
- **Covariance ratio** – the variance of the pooled estimate without the study over its variance with it; below 1, the study was making the estimate more precise
- **Leverage** – the study's share of the weight in the pooled estimate, on a 0–1 scale; a study carrying much of the weight moves the estimate wherever it sits – see [leverage](./concepts/outliers-missing-data.md#b-leverage)
- **Baujat plot** – each study's contribution to heterogeneity (x) against its influence on the pooled estimate (y); the studies in the top-right corner drive both, and the flagged ones are drawn red

Under the hierarchy the table has one row per study with its **Rows**, the estimate, interval, **σ² (between studies)** and **σ² (within studies)** of the model refitted without it, and its **Cook's distance**; the other measures and the Baujat plot are off.

### Under the hierarchy

Modelling the hierarchy changes the card wherever a block has no form for dependent effects. The pooled estimate carries a **Robust SE** and a Satterthwaite **df**, and a warning appears when that df falls below 4, where the robust standard error is too uncertain for its p and interval to be relied on. The moderator model reports a robust F and per-coefficient Satterthwaite df; the permutation test, the likelihood-ratio comparison and the Knapp-Hartung adjustment are off. Egger's regression and PET-PEESE are fitted on the hierarchy with a cluster-robust t; Begg's test, trim-and-fill and the selection model are off. Influence diagnostics leave each *study* out with all of its rows at once and report a Cook's distance per study; the row-level influence measures and the Baujat plot are off. Every one of these absences is named in a note on the card.

## Reporting checklist

**Method:**
- The study table's shape, the roles assigned, and the effect measure with the scale it was pooled on
- For a mixed sheet: which recipes fired and on how many rows, taken from **What the analysis took on trust**, and the assumptions that block spells out
- Every assumed value (ICC, pre–post correlation, within-study correlation) with its default and the range of the sensitivity sweep
- How rows sharing a study were handled (independent, one composite per study, or the CHE model), and the within-study correlation assumed
- The τ² estimator, whether Knapp-Hartung was on, and the confidence level
- Moderators, their type, reference levels and centring; whether they were pre-specified; joint model or screen; whether a permutation test ran and with how many reshuffles
- The double-zero rule and the continuity correction, where 2×2 tables were pooled
- Rows excluded and why, from the card's lead note

**Results:**
- The random-effects estimate with its interval and p (naming t and df under Knapp-Hartung), and the natural-scale version for a ratio, correlation or proportion; the fixed-effect estimate if the two disagree
- Q with df and p, I², τ² (or τ), and the prediction interval
- For moderators: the omnibus test, R², residual heterogeneity, and the subgroup means or coefficients with their intervals
- Egger's (or Peters'/sample-size) test and Begg's test with the k they ran on, the funnel plot, and any adjusted estimate as a sensitivity analysis beside the main one – never in its place
- The leave-one-out range and any study flagged as influential, with what happens to the conclusion without it

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. The module uses `metafor` (`escalc`, `conv.wald` and `conv.fivenum` for the conversions, `aggregate` for the composites, `rma` for the pooled and moderator models, `permutest` for the permutation test, `regtest`, `ranktest`, `trimfill`, `selmodel`, `leave1out` and `influence` for the diagnostics, `vcalc`, `rma.mv` and `robust` for the hierarchy) and `clubSandwich` for the cluster-robust inference under the hierarchy. The permutation test takes its count from the [permutation replications setting](./settings.md#permutation-replications) and is seeded from the [bootstrap seed setting](./settings.md#bootstrap-seed), so setting the seed makes its p-values reproducible run to run. Confidence levels follow the [global confidence setting](./settings.md#confidence-level) and are named in the column headers. Citations for the R packages *and* the statistical methods your run actually used – the τ² estimator, each conversion that fired, the asymmetry tests, the hierarchical model's inference – appear automatically at the top of the output card. The reasoning behind the module's rules – how the sheet is read, which rows are refused, why each test, adjustment and diagnostic runs as it does – is in the [method notes](./methods/meta-analysis.md).

## Common pitfalls

**Pooling rows that are not independent.** A study reporting three outcomes is one study, not three. Pooled as rows, it is counted three times and the interval shrinks accordingly. Give the module a study label, read the warning, and choose under **Dependence**.

**Reading the fixed-effect and random-effects rows as one estimate computed two ways.** They answer different questions. When they differ, the studies are heterogeneous and the random-effects estimate – with τ² and the prediction interval – is the honest summary. Do not pick whichever is significant.

**Treating I² as the size of heterogeneity.** It is a proportion. A large I² with a tiny τ means the studies are precise enough to distinguish trivial differences; a moderate I² with a τ as large as the effect means the true effects range from harm to benefit. Report τ or the prediction interval.

**Entering a Hedges' g as a d, or an SE as an SD.** Both are silent: the conversion runs and the number is wrong. The mixed shape has a column for each, the arm conversions name what they read, and **What the analysis took on trust** prints the assumption – check it against each paper.

**Meta-regression on a handful of studies.** Ten or so studies per coefficient is the guidance the budget line follows. Below it, a significant moderator found among several candidates is more likely an artefact of the search than a finding. Pre-specify, use the permutation test, and report the screen as a screen.

**Taking an adjusted estimate as the answer.** Trim-and-fill, PET-PEESE and the selection model each assume a mechanism by which studies went missing, and each can be badly wrong when heterogeneity is large. They belong in a sensitivity paragraph beside the main estimate, not in the abstract in its place.

**Leaving the missing-data method on imputation.** A study table has blanks by design – the cells a paper did not report. Imputation fills them with numbers no study produced. Set the [missing-data method](./settings.md#missing-data) to pairwise before pooling; the card's notice reminds you until you do.
