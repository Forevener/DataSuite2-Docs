---
title: Analysis planner
description: Power analysis, effect size conversion, alpha correction, scale length, attenuation, precision planning and group allocation in DataSuite 2.
---

# Analysis planner

The **Analysis planner** is a study-planning toolkit that needs no dataset: seven collapsible sections, each a calculator with its own button. [Power analysis](#power-analysis) solves for the sample size, power or detectable effect of a planned test; the [effect size converter](#effect-size-converter) moves one effect size onto every other supported measure; the [alpha correction planner](#alpha-correction-planner) prints the per-test thresholds of five multiple-comparison procedures; [scale length planning](#scale-length-planning-spearman-brown) projects reliability against the number of items; [correlation attenuation](#correlation-attenuation) says what unreliable measures do to a correlation; [precision planning](#precision-planning-ci-width) sizes a sample for a confidence interval of a given width; and the [group allocation optimizer](#group-allocation-optimizer) prices an unequal split. Open the section you need – the others stay collapsed.

> **Why plan ahead?** A study sized before the data exist can be powered for the effect that matters and corrected for the tests it will run; one sized afterwards can only be rationalised – see [power and sample size](./concepts/power-sample-size.md).

1. Open the section for the question you have – [how many cases](#power-analysis), [which measure](#effect-size-converter), [which threshold](#alpha-correction-planner), [how many items](#scale-length-planning-spearman-brown), [how much a correlation shrinks](#correlation-attenuation), [how precise an estimate](#precision-planning-ci-width) or [what an unequal split costs](#group-allocation-optimizer)
2. Fill in its fields – each opens at a conventional default, which is a starting point, not a plan
3. Click the section's button – **Calculate**, **Convert**, **Calculate thresholds**, **Calculate required items**, **Calculate sample size** or **Calculate power**
4. Read the result box and the table under it; after a power analysis, open the [power curve](#b-show-power-curve) and the [heatmap](#b-show-sensitivity-heatmap) as well

## Power analysis

Solves the power equation for whichever of its three unknowns you ask for – the sample size a planned test needs, the power a given sample has, or the smallest effect it can detect – with the significance level fixed, and prints a sensitivity table under every answer. {#power-analysis}

> **What is statistical power?** The probability that the test finds an effect of the size you assume, if it is there; 0.80 is the convention – see [power](./concepts/power-sample-size.md#b-power) and [power analysis](./concepts/power-sample-size.md#b-power-analysis).

### Power analysis configuration

- **Test type** – the test the study will run, in six families. The effect size measure, the extra fields and what the sample size counts all follow the choice, and the [quick reference](#b-quick-reference-effect-size-conventions) card shows the benchmarks for each measure.

The tests, in the menu's order:

- **One-sample t-test** – one mean against a fixed value; the effect is Cohen's d, the sample size the number of cases, and [Tails](#b-tails) is phrased as μ against μ₀ – see [one-sample t-test](./concepts/guide-analysis.md#b-one-sample-t-test).
- **Independent samples t-test** – two groups' means, the default; the effect is Cohen's d, the sample size per group with the total in brackets – see [independent samples t-test](./concepts/guide-analysis.md#b-independent-samples-t-test).
- **Paired samples t-test** – two measurements of the same cases; the effect is Cohen's d on the paired differences, the sample size the number of pairs – see [paired samples t-test](./concepts/guide-analysis.md#b-paired-samples-t-test).
- **One-way ANOVA** – three or more groups' means; the effect is Cohen's f, the sample size per group with the total in brackets, plus the [number of groups](#b-number-of-groups) – see [one-way ANOVA](./concepts/guide-analysis.md#b-one-way-anova).
- **Factorial ANOVA** – one effect of a design with several factors; the effect is Cohen's f², and there is no sample size field: the design is planned on its [numerator](#b-numerator-df-effect) and [denominator](#b-denominator-df-error) degrees of freedom, and solving for sample size returns the error df – see [factorial ANOVA](./concepts/guide-analysis.md#b-factorial-anova).
- **Pearson correlation** – one correlation against zero; the effect is r, which may be negative, the sample size the number of cases, and Tails is phrased as ρ against 0 – see [Pearson's r](./concepts/guide-analysis.md#b-pearsons-r).
- **Multiple regression** – a set of predictors together; the effect is Cohen's f², the sample size the total, plus the [number of predictors](#b-number-of-predictors) – see [multiple regression](./concepts/regression-basics.md#b-multiple-regression).
- **Chi-square goodness of fit** – one categorical variable's counts against a specified distribution; the effect is Cohen's w, the sample size the total, plus the [degrees of freedom](#b-degrees-of-freedom), categories − 1 – see [chi-square goodness-of-fit test](./concepts/guide-analysis.md#b-chi-square-goodness-of-fit-test).
- **Chi-square test of independence** – the association of two categorical variables; the effect is Cohen's w, the sample size the total, the degrees of freedom (rows − 1) × (columns − 1) – see [chi-square test of independence](./concepts/guide-analysis.md#b-chi-square-test-of-independence).
- **One-sample proportion** – one rate against a fixed value; the effect is Cohen's h, the sample size the number of cases, and Tails is phrased as p against p₀ – see [one-sample proportion test](./concepts/guide-analysis.md#b-one-sample-proportion-test).
- **Two-sample proportion** – two groups' rates; the effect is Cohen's h, the sample size per group with the total in brackets – see [two-sample proportion](./concepts/guide-analysis.md#b-two-sample-proportion).

The rest of the panel:

- **Solve for** – which of the three unknowns to calculate; the other two are entered. The field being solved is hidden and its label carries a **Solving** badge.
- **Sample size** – the number of cases – per group, in pairs or in all, as the [field's label](#b-sample-size-per-group) says for the chosen test. Solve for it to learn how many the planned test needs at the target power (the default); enter it to learn the power or the detectable effect of a study whose size is fixed. As a table column it is the count each row was computed at – see [required sample size](./concepts/power-sample-size.md#b-required-sample-size).
- **Power** – the probability that the test finds the assumed effect. Solve for it when the sample is fixed; enter the target, 0.80 by default, otherwise. As a table column it is the power at that row's sample size – see [achieved power](./concepts/power-sample-size.md#b-achieved-power).
- **Effect size** – the smallest effect the design detects at the target power. Solve for it to learn what a fixed sample can find; enter the expected effect otherwise – see [minimum detectable effect](./concepts/power-sample-size.md#b-minimum-detectable-effect).
- **Effect size ({symbol})** – the expected effect on the measure the test uses, named in the label: d for the t-tests, f for one-way ANOVA, f² for factorial ANOVA and regression, r for the correlation, w for the chi-square tests and h for the proportion tests. Each opens at Cohen's "medium" – 0.5, 0.25, 0.15, 0.30, 0.30 and 0.50 – and the value is reset when a change of test changes the measure. An effect of exactly zero is refused, since no sample detects it. Take the value from prior research or a pilot, not from the default – see [expected effect size](./concepts/power-sample-size.md#b-expected-effect-size).
- **Significance level (α)** – the level the planned test will run at, default 0.05; enter the per-test level if the study will adjust for [multiple comparisons](#alpha-correction-planner) – see [significance level](./concepts/power-sample-size.md#b-significance-level-α).
- **Power (1 − β)** – the target power, default 0.80; β is the chance of missing the effect – see [power (1 − β)](./concepts/power-sample-size.md#b-power-1-β).
- **Sample size (per group)** – the field for the sample the study has or will have, labelled as the two-group tests and one-way ANOVA count it: cases in each group, the total being that many times the groups. The label follows the test, and the sensitivity table and both charts step through the same count; factorial ANOVA replaces the field with the [denominator df](#b-denominator-df-error) – see [sample size (per group)](./concepts/power-sample-size.md#b-sample-size-per-group).
- **Number of pairs** – the same field for the paired t-test: pairs of measurements, one per case – see [number of pairs](./concepts/power-sample-size.md#b-number-of-pairs).
- **Total sample size** – the same field for regression and the chi-square tests: cases in the whole sample, with no groups to count by; the one-sample tests and the correlation label it plainly *Sample size* – see [total sample size](./concepts/power-sample-size.md#b-total-sample-size).
- **Tails** – whether the test is two-tailed or predicts a direction; shown for the t-tests, the correlation and the proportion tests. The options are worded for the test: Group 1 and Group 2 for the two-group tests, μ and μ₀ for the one-sample t-test, ρ for the correlation, p and p₀ for the one-sample proportion – see [one-tailed](./concepts/hypothesis-testing.md#b-one-tailed).
- **Two-tailed** – the default, *Two-tailed (Group 1 ≠ Group 2)* and its counterparts: an effect in either direction counts, at the price of a larger sample – see [two-tailed](./concepts/hypothesis-testing.md#b-two-tailed). {#two-tailed #two-tailed-group-1-ne-group-2 #two-tailed-μ-ne-μ₀ #two-tailed-ρ-ne-0 #two-tailed-p-ne-p₀}
- **One-tailed (greater)** – *One-tailed (Group 1 > Group 2)* and its counterparts: only an effect in the named direction counts – a larger first mean, μ above μ₀, a positive ρ, p above p₀ – so the sample is smaller and an effect the other way is missed – see [one-tailed](./concepts/hypothesis-testing.md#b-one-tailed). {#one-tailed-greater #one-tailed-group-1-gt-group-2 #one-tailed-μ-gt-μ₀ #one-tailed-ρ-gt-0 #one-tailed-p-gt-p₀}
- **One-tailed (less)** – *One-tailed (Group 1 < Group 2)* and its counterparts: the same, in the opposite direction. {#one-tailed-less #one-tailed-group-1-lt-group-2 #one-tailed-μ-lt-μ₀ #one-tailed-ρ-lt-0 #one-tailed-p-lt-p₀}
- **Number of groups** – for one-way ANOVA, how many group means are compared, default 3; the total in the result is this many times the per-group n.
- **Numerator df (effect)** – for factorial ANOVA, the degrees of freedom of the effect being planned for – a factor's levels minus one, or the product of those for an interaction – default 2.
- **Denominator df (error)** – for factorial ANOVA, the error degrees of freedom of the design, default 100. It stands in for the sample size: it is what solving for sample size returns, and what the sensitivity table and the charts step through, since the design's cell structure is not entered here.
- **Number of predictors** – for multiple regression, how many predictors the model has, default 3; the total sample size is the error df plus the predictors plus one.
- **Degrees of freedom** – for the chi-square tests, default 3: categories − 1 for goodness of fit, (rows − 1) × (columns − 1) for independence, as the hint under the field says.

Click **Calculate** to run.

### Power analysis results

- **Result** – the answer in a highlighted box. Solving for sample size it reads *Required sample size: 64 (Total: 128)* – the per-group count rounded up and, for the two-group tests and one-way ANOVA, the total in brackets – or *Required denominator (error) df* for factorial ANOVA. Solving for power it reads *Achieved power*, and for effect *Minimum detectable effect*.
- **Parameters used** – every input the calculation took, with the solved quantity in its unrounded form.
- **Sensitivity analysis** – the power the test actually has at 50%, 75%, 100%, 125% and 150% of the reference sample size – the calculated one when solving for sample size, the entered one otherwise – each recomputed rather than interpolated. Read it as the cost of being wrong: if power falls to 0.5 at three quarters of your sample, the plan is fragile – see [how sure the answer is](./concepts/power-sample-size.md#how-sure-the-answer-is).
- **Show power curve** – draws power against the sample size for the entered effect and α, from about a fifth of the reference to where the curve reaches 0.99. A green dashed crosshair marks the calculated result, and hovering the curve reads the power at any sample size. The x-axis is labelled with the count the test uses – per group, pairs, the total, or the error df for factorial ANOVA. If no point could be computed for the parameters, the chart area says so – see [power curve](./concepts/power-sample-size.md#b-power-curve).
- **Show sensitivity heatmap** – a grid of power over seven sample sizes, from 0.4 to 3 times the reference, and six effect sizes, from 0.4 to 2 times the entered one, each cell coloured on a sequential blue scale with its power printed inside; a cell that cannot be computed is grey with a dash. It shows what an optimistic effect size costs as well as a short sample.

Both charts can be resized and carry SVG / PNG / JPG export buttons (see [resizing and exporting charts](./getting-started.md#resizing-and-exporting-charts)).

- **Quick reference: effect size conventions** – the card shown before the first calculation: Cohen's small, medium and large benchmarks for the five measures the tests use – see [Cohen's conventions](./concepts/power-sample-size.md#b-cohens-conventions).

| Measure | Small | Medium | Large |
|---|---|---|---|
| Cohen's d | 0.20 | 0.50 | 0.80 |
| Pearson r | 0.10 | 0.30 | 0.50 |
| Cohen's f | 0.10 | 0.25 | 0.40 |
| Cohen's f² | 0.02 | 0.15 | 0.35 |
| Cohen's w | 0.10 | 0.30 | 0.50 |

- **Measure** – the effect size measure a row is about: in the quick reference, the one whose benchmarks the row gives; in the [converter's table](#b-converted-effect-sizes), the one the value was converted to.
- **Small** – the benchmark Cohen attached to a small effect on each measure's scale; below it the [converter](#effect-size-converter) reads an effect as negligible.
- **Medium** – Cohen's benchmark for a medium effect, and the value every effect size field opens at.
- **Large** – Cohen's benchmark for a large effect; the converter reads anything at or above it as large.

## Effect size converter

Converts one effect size into every other supported measure – for when a paper reports an odds ratio and the power analysis wants Cohen's d. Every conversion passes through Cohen's d as a common pivot, so two measures that are not d are related through an intermediate step, and the row for the measure you entered carries exactly the value you typed. {#effect-size-converter}

### Converter configuration

- **Input effect size type** – the measure the value is on, from fifteen. Each has a valid range, and a value outside it is refused with a message naming the range rather than filling the table with blanks; a change of measure moves the field's own bounds to match.
- **Cohen's d** – a standardised mean difference, the default and the pivot itself; any value – see [Cohen's d](./concepts/effect-sizes.md#b-cohens-d).
- **Hedges' g** – d with the small-sample correction; needs the [total sample size](#b-total-sample-size-both-groups), at least 6 – see [Hedges' g](./concepts/effect-sizes.md#b-hedges-g).
- **Correlation r** – strictly between −1 and 1 – see [r](./concepts/effect-sizes.md#b-r).
- **R-squared (R²)** – variance explained, at least 0 and below 1 – see [r²](./concepts/effect-sizes.md#b-r²).
- **Eta-squared (η²)** – the variance a factor explains, at least 0 and below 1 – see [η²](./concepts/effect-sizes.md#b-η²).
- **Partial η²** – the same range, and converted as η² is, since a single d describes one factor – see [partial η²](./concepts/effect-sizes.md#b-partial-η²).
- **Omega-squared (ω²)** – the same range, converted as η² is; accepted as an input, with no row of its own in the output – see [ω²](./concepts/effect-sizes.md#b-ω²).
- **Cohen's f** – 0 or greater – see [Cohen's f](./concepts/power-sample-size.md#b-cohens-f).
- **Cohen's f²** – 0 or greater – see [Cohen's f²](./concepts/power-sample-size.md#b-cohens-f²).
- **Cohen's w** – at least 0 and below 1 – see [Cohen's w](./concepts/effect-sizes.md#b-cohens-w).
- **Cohen's h** – between 0 and π, taken as being on the d scale – see [Cohen's h](./concepts/effect-sizes.md#b-cohens-h).
- **Cramér's V** – at least 0 and below 1, and needs the [table dimensions](#b-table-dimensions-for-cramérs-v); a wider table lowers the ceiling further, and a V at or above it is refused with the bound named – see [Cramér's V](./concepts/effect-sizes.md#b-cramérs-v).
- **Odds ratio** – greater than 0; 0.5 and 2 are the same size of effect – see [odds ratio](./concepts/effect-sizes.md#b-odds-ratio).
- **CLES** – the common language effect size, the probability that a random case from one group scores above one from the other; strictly between 0 and 1 – see [common language ES](./concepts/effect-sizes.md#b-common-language-es).
- **NNT** – the number needed to treat, greater than 0; needs the [control event rate](#b-control-event-rate-for-nnt), and an NNT that rate cannot produce is reported as invalid rather than converted.
- **Value** – the number to convert, on the scale of the measure chosen above; default 0.50. In the results table the column of that name holds the same effect on each row's scale – η² and partial η² carry the same number there, since a single d describes one factor.
- **Total sample size (both groups)** – the N behind a Hedges' g, both groups together, default 30; it sets the correction between d and g, so it is required, and at least 6, when converting *from* g, and optional otherwise.
- **Table dimensions (for Cramér's V)** – the rows and columns of the contingency table, both at least 2; required when converting from Cramér's V, and without them the V row of the output reads *requires table dimensions*.
- **Proportions (for Cohen's h)** – the two proportions p₁ and p₂, each between 0 and 1; the h row of the output is computed from them, since a d alone gives no h, and reads *requires proportions* when they are blank.
- **Control event rate (for NNT)** – the event rate in the untreated group, default 0.50, which is also used when the field is left blank; the NNT row reads *requires base rate* when the rate is outside (0, 1).

Click **Convert** to run.

### Converter results

- **Converted effect sizes** – a table of fourteen rows: the measure you entered with exactly the value typed, and every other measure derived from it. A row whose extra input you left blank shows a dash and names what it needs; if the value admits no Cohen's d at all, every row reads *requires valid input* rather than a zero that would read as "no effect".
- **Interpretation** – negligible, small, medium or large, from the same magnitude registry as the app's results cards, so a number reads the same here as on the card that reported it, and a value at Cohen's benchmark is on the rung the benchmark names. The odds ratio is read symmetrically around 1, CLES by its distance from 0.5, Cramér's V against the w benchmarks scaled to the table, and NNT on its own ladder, where a smaller number is a stronger effect.

## Alpha correction planner

Prints the adjusted per-test thresholds for a family of comparisons, so the correction is chosen before the tests are run rather than after the p-values are seen. {#alpha-correction-planner}

> **Why correct for multiple comparisons?** Twenty tests at 0.05 produce one false positive by chance alone; a correction lowers each test's bar so the family keeps its error rate – see [multiple comparison adjustment](./concepts/hypothesis-testing.md#b-multiple-comparison-adjustment), and the [p-value adjustment setting](./settings.md#multiple-comparison-adjustment) for applying one to results.

### Alpha correction configuration

- **Number of comparisons** – how many tests the family holds, at least 2; default 10.
- **Family-wise alpha level** – the error rate the family as a whole is to keep, default 0.05 – see [family-wise error rate](./concepts/hypothesis-testing.md#b-family-wise-error-rate).

Click **Calculate thresholds** to run.

### Alpha correction results

- **Adjusted significance thresholds** – one row per method and three threshold columns, for the p-values at three ranks: the smallest, p₍₁₎, the middle one and the largest, p₍ₘ₎, with m the number of comparisons. Hommel's procedure has no row – it rejects by closed testing rather than against a per-rank threshold, so there is no column to show for it – and the note under the table says so.
- **Method** – the correction procedure of the row. Bonferroni and Šidák hold the family-wise error rate with one constant threshold, Holm and Hochberg with a threshold that steps by rank, and the two Benjamini methods hold the false discovery rate instead – see [family-wise error rate](./concepts/hypothesis-testing.md#b-family-wise-error-rate) and [false discovery rate](./concepts/hypothesis-testing.md#b-false-discovery-rate).
- **Threshold at rank i** – the level the i-th smallest p-value must fall under to be significant, printed at three ranks. A constant method has the same number in every column; a sequential one compares each p-value with its own rank's threshold – the strictest for the smallest p, the most lenient for the largest – so read a sequential row as three points on one ladder, not as three alternatives. {#threshold-at-rank-i}
- **Bonferroni** – α ⁄ m at every rank; simple and conservative – see [Bonferroni](./concepts/hypothesis-testing.md#b-bonferroni).
- **Šidák** – $1 - (1 - \alpha)^{1/m}$ at every rank, slightly less conservative than Bonferroni.
- **Holm / Hochberg** – $\alpha / (m - i + 1)$ at rank i: one row, because the two procedures use the same thresholds and differ only in direction – Holm steps down from the smallest p-value and stops at the first that fails, Hochberg steps up from the largest and stops at the first that passes – see [Holm](./concepts/hypothesis-testing.md#b-holm) and [Hochberg](./concepts/hypothesis-testing.md#b-hochberg).
- **Benjamini-Hochberg (FDR)** – $(i/m)\,\alpha$ at rank i: controls the false discovery rate rather than the family-wise error, more permissive and suited to exploratory work – see [Benjamini-Hochberg](./concepts/hypothesis-testing.md#b-benjamini-hochberg-fdr).
- **Benjamini-Yekutieli (BY)** – the Benjamini-Hochberg threshold divided by the harmonic sum 1 + 1⁄2 + … + 1⁄m, so the guarantee holds under any dependence between the tests, at a cost in power – see [Benjamini-Yekutieli](./concepts/hypothesis-testing.md#b-benjamini-yekutieli-fdr).

## Scale length planning (Spearman-Brown)

Projects a scale's reliability against its number of items with the Spearman-Brown formula, and says how many items a target reliability takes – see [Spearman–Brown formula](./concepts/reliability.md#b-spearman-brown-formula). {#scale-length-planning-spearman-brown}

### Scale length configuration

- **Current reliability** – the scale's reliability as it stands – Cronbach's α or McDonald's ω from a [reliability analysis](./reliability-analysis.md) – strictly between 0 and 1; default 0.70.
- **Current number of items** – how many items produced it, at least 1; default 10.
- **Target reliability** – the reliability wanted, strictly between 0 and 1; default 0.80.

Click **Calculate required items** to run.

### Scale length results

- **Scale length results** – the required number of items, rounded up, and a sentence saying how many to add or remove; when the current scale already reaches the target, it says so instead of reporting a change of zero items. The projection assumes the added items are as good as the present ones.
- **Reliability by number of items** – the projected reliability at half the current length, the current length, one and a half times it, twice it and the required count, sorted, with the required row highlighted and ticked. Returns diminish: each added item cancels less of the error than the one before – see [Spearman–Brown formula](./concepts/reliability.md#b-spearman-brown-formula).
- **Items** – the number of items a projected row assumes; the ticked row is the required count.
- **Projected reliability** – the reliability a scale of that many items would reach, if the new items were as good as the old.

## Correlation attenuation

Shows what measurement error does to a correlation – how a true correlation shrinks in data measured with error, or, run backwards, what an observed correlation implies about the true one – see [attenuation](./concepts/reliability.md#b-attenuation). {#correlation-attenuation}

### Attenuation configuration

- **Direction** – which way to run the correction.
- **Attenuate: true correlation → observed** – the default: enter the correlation you expect between the constructs and see the one your measures will show.
- **Disattenuate: observed correlation → true** – enter the correlation you observed and see the one the constructs would show if measured without error.
- **True/expected correlation** – when attenuating, the correlation you expect between the constructs, between −1 and 1; default 0.50.
- **Observed correlation** – the same field when disattenuating: the correlation the data showed, between −1 and 1.
- **Reliability of measure X (α or ω)** – the reliability coefficient of the first measure – Cronbach's α or McDonald's ω from a [reliability analysis](./reliability-analysis.md) – in (0, 1]; default 0.80.
- **Reliability of measure Y (α or ω)** – the same for the second measure; default 0.80.

Click **Calculate** to run.

### Attenuation results

- **Attenuation results** – the corrected correlation, the attenuation factor and a sentence reading them together.
- **Attenuation factor** – the square root of the product of the two reliabilities: the share of a true correlation that survives measurement. Two measures with a reliability of 0.80 keep 0.80 of it.
- **Expected observed correlation** – the true correlation times the factor: what the data will show.
- **Estimated true correlation** – the observed correlation divided by the factor. An estimate outside [−1, 1] is flagged in red rather than clipped: it means the reliabilities entered are too low to have produced the correlation observed, so at least one of them is understated.

> **Why this matters for planning:** the data will carry the attenuated correlation, so the power analysis should use that one, not the true one – see [what moves power](./concepts/power-sample-size.md#what-moves-power).

## Precision planning (CI width)

Solves for the sample that makes a confidence interval as narrow as you need, rather than for the power to detect an effect: "estimate the mean within ± 2 points" rather than "detect a difference". {#precision-planning-ci-width}

> **Power vs. precision?** Power analysis asks whether an effect can be detected, precision planning how accurately a value can be estimated; a descriptive study – a prevalence, a mean score, a correlation's strength – is planned for precision – see [precision planning](./concepts/power-sample-size.md#b-precision-planning).

### Precision configuration

- **Estimate type** – the quantity being estimated; the field for its expected value follows the choice.
- **Mean** – the default; needs the [expected standard deviation](#b-expected-standard-deviation).
- **Proportion** – a share or rate; needs the [expected proportion](#b-expected-proportion).
- **Correlation** – a Pearson correlation; needs the [expected correlation](#b-expected-correlation).
- **Confidence level** – 90%, 95% (the default) or 99%; a higher level widens the interval, so the same margin takes a larger sample – see [confidence level](./concepts/confidence-intervals.md#b-confidence-level). {#confidence-level #confidence-level-90 #confidence-level-95 #confidence-level-99}
- **Expected standard deviation** – for a mean: the spread of the variable, from a pilot or the literature; default 1.0 – see [expected standard deviation](./concepts/power-sample-size.md#b-expected-standard-deviation).
- **Expected proportion** – for a proportion: the share expected, strictly between 0 and 1; default 0.50, the conservative entry – the interval is widest there, so the sample it gives is enough for any proportion – see [expected proportion](./concepts/power-sample-size.md#b-expected-proportion).
- **Expected correlation** – for a correlation: the coefficient expected, strictly between −1 and 1; default 0.30. A stronger correlation is pinned down by fewer cases – see [expected correlation](./concepts/power-sample-size.md#b-expected-correlation).
- **Desired margin of error (±)** – the half-width the interval may have, in the units of the estimate – the ± after the estimate in a report; default 0.50 – see [margin of error](./concepts/power-sample-size.md#b-margin-of-error).

Click **Calculate sample size** to run.

### Precision results

- **Precision planning results** – the required sample size, rounded up, with a sentence naming the confidence level and margin it gives. For a correlation the sample is found by a bounded search, and a margin too narrow to reach within its ceiling is reported as unreachable – the result says so, and the affected rows of the table read *Not reachable* – rather than the ceiling being returned as if it were the answer.
- **Sample size by margin of error** – the sample required at six margins: half, three quarters, one, one and a quarter, one and a half and twice the margin entered, with the entered row highlighted and ticked. Halving the margin roughly quadruples the sample, and the table makes the trade visible – see [what sets the width](./concepts/confidence-intervals.md#what-sets-the-width).
- **Margin (±)** – the half-width each row was computed for; the *Sample size* column beside it is the count that reaches it.

## Group allocation optimizer

Prices an unequal split of a two-group comparison: the power of the sizes you have, against the equal split of the same total and the standard ratios. {#group-allocation-optimizer}

### Allocation configuration

- **Group sizes** – n₁ and n₂, the two groups' sizes, each at least 2; both default to 50. In the table below the two columns of those names are each row's split. {#group-sizes #n₁ #n₂}
- **Effect size (Cohen's d)** – the expected standardised difference between the groups, greater than 0; default 0.50 – see [Cohen's d](./concepts/effect-sizes.md#b-cohens-d).
- **Significance level (α)** – as in [power analysis](#b-significance-level-α); default 0.05. {#allocation-significance-level}

Click **Calculate power** to run.

### Allocation results

- **Allocation results** – the power of the entered allocation, the total with its n₁ and n₂, and one line: *Equal allocation maximizes power* when the groups are equal, otherwise the power lost against the equal split of the same total, in percentage points – see [power loss vs equal allocation](./concepts/power-sample-size.md#b-power-loss-vs-equal-allocation).
- **Total N** – the two sizes added; every row of the table splits this same total.
- **Power by allocation ratio** – the standard ratios 1:1, 1:2, 2:1, 1:3, 3:1, 2:3 and 3:2 applied to the total, plus the entered allocation as its own row when it is none of them, sorted by power. The entered row is highlighted blue and ticked, the equal split green; a ratio that would leave an arm below two cases has no power to report – those rows read *Not available* and trail the table – see [allocation ratio](./concepts/power-sample-size.md#b-allocation-ratio) and [equal allocation](./concepts/power-sample-size.md#b-equal-allocation).
- **Ratio** – the split of the row as n₁ : n₂, in its simplest terms.

> **When unequal allocation makes sense:** equal groups maximise power, but a rare condition or an intact classroom fixes the split – the table says what it costs, which is usually less than expected – see [allocation ratio](./concepts/power-sample-size.md#b-allocation-ratio).

## Reporting checklist

Power analysis and study planning parameters belong in the **Method** section of your paper, ideally under a "Sample size determination" or "Power analysis" subheading.

**For power analysis, report:**
- The statistical test you planned for (e.g. independent samples t-test)
- Target power (e.g. 0.80)
- Significance level (e.g. 0.05, one-tailed or two-tailed)
- Expected effect size and its source (prior research, meta-analysis, pilot study – not "Cohen's medium" without justification)
- The resulting required sample size
- Whether you accounted for attrition (e.g. "we aimed for N = 80 to account for 20% expected dropout")

**For alpha correction, report:**
- The correction method chosen and why (e.g. "Benjamini-Hochberg to control false discovery rate at 5%")
- The number of comparisons in the family

**For precision planning, report:**
- The target margin of error and confidence level
- Expected variability (SD, proportion, or correlation) and its source

## Reproducibility

Power analysis and the group allocation optimizer run in R with the `pwr` package, and precision planning in R with its base quantile functions; all three print their code to the [R console](./r-console.md), where you can inspect, copy or re-run the exact commands. The effect size converter, the alpha correction planner, correlation attenuation and scale length planning are arithmetic and run in the browser, so they print nothing there. Every tool lists the methods it used in the citation box at the top of the output section – the power conventions behind the defaults, each conversion the table reached (Hedges' g, the odds-ratio and CLES relations, partial η², and Cramér's V and NNT only when you supplied the inputs they need), all seven multiple-comparison procedures the threshold table and its note name, Fisher's *z* transformation on the correlation branch of precision planning, the correction for attenuation, and the Spearman-Brown prophecy formula – so the list doubles as a record of what your numbers rest on. The routines behind each tool – the pivot, the rounding, the search ceilings, the refusals – are on the [method notes](./methods/analysis-planner.md) page.

## Common pitfalls

**"We used Cohen's medium effect size" is not a justification.** The defaults are conventions, and a study powered for d = 0.50 in a field whose effects run at 0.20 misses most of them. Take the effect from prior literature or a meta-analysis, use the [converter](#effect-size-converter) to put it on the test's measure, and when nothing exists, say so and report the sensitivity table – see [Cohen's conventions](./concepts/power-sample-size.md#b-cohens-conventions) and [smallest effect size of interest](./concepts/power-sample-size.md#b-smallest-effect-size-of-interest).

**Computing power after the fact.** Entering the effect a finished study observed and solving for power adds nothing the p-value did not already say; a null result is described by its confidence interval and by the effect the design was powered to detect – see [observed power](./concepts/power-sample-size.md#b-observed-power).

**Planning with the true correlation.** If the measures are unreliable, the data will carry the attenuated correlation, and the power analysis should use that one – the [attenuation](#correlation-attenuation) section gives it – see [attenuation](./concepts/reliability.md#b-attenuation).

**Stopping at the required sample.** It is the number the analysis needs, not the number to recruit: drop-outs and unusable records come off it, so divide by one minus the expected loss and report both figures – see [attrition](./concepts/power-sample-size.md#b-attrition).
