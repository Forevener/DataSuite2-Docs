---
title: Reliability analysis
description: Scale reliability in DataSuite 2 – Cronbach's α, McDonald's ω, Guttman's lower bounds, item analysis, reverse scoring and several subscales in one run.
---

# Reliability analysis

Reliability analysis evaluates how well the items of a scale measure the same construct – its internal consistency: Cronbach's α and McDonald's ω, the lower bounds and factor-based coefficients, an item analysis that flags the items dragging the scale down, reverse scoring by tick, and several subscales in one run. Two neighbouring modules answer the other reliability questions: **[Reproducibility & agreement](./reproducibility-analysis.md)** measures agreement across raters, time points or methods, and **[Item response theory](./irt-analysis.md)** models each item's difficulty and discrimination on its own. {#reliability-analysis}

> **What is internal consistency?** Whether a set of items agree with one another closely enough to be added into one score – see [internal consistency](./concepts/reliability.md#b-internal-consistency) and the [scale reliability](./concepts/reliability.md) page behind it.

1. [Select your scale items](./getting-started.md#choosing-variables) (at least two numeric variables)
2. Mark any [reverse-scored items](#reverse-scored-items)
3. Choose which [reliability metrics](#reliability-metrics) to compute
4. Toggle [output options](#output-options)
5. Click **Calculate reliability**

> **Several subscales in one file?** Don't run the analysis once per scale by hand – see [Multiple scales (subscales)](#multiple-scales-subscales).

## Requirements

- At least two numeric variables must be selected. Categorical variables are automatically excluded (and listed in the output).
- At least one reliability metric must be checked.

## Multiple scales (subscales)

Most questionnaires bundle several subscales into one dataset – a personality inventory might carry separate **ANX**, **EXT**, and **OPE** scales in one file. Rather than selecting each subscale's items and running the analysis once per scale, define them all at once and get one reliability run per scale plus a side-by-side comparison.

- **Analyze as multiple scales (subscales)** – reliability is computed separately for each scale you define, with a [summary table](#summary-table-multiple-scales) comparing them first. Internal consistency assumes the items measure one construct, so one analysis over a mix of subscales gives a misleading overall coefficient – see [unidimensionality](./concepts/latent-variables.md#b-unidimensionality).

Checking **Analyze as multiple scales (subscales)** reveals a **Scales** matrix: rows are your selected items, columns are scales. Click a cell to assign an item to a scale; click it again to remove it. {#scales}

- **Auto-detect from names** – groups items by the prefix before the first underscore (`ANX_1`, `ANX_2` → scale **ANX**; `anxiety1` and `anxiety2` won't group). With `scale_item` naming this fills in every scale in one click; it runs automatically the first time you enable the mode. If your items aren't named that way, assign them by clicking cells – the result is identical.
- **Add / remove scales** – use the **+** and **×** controls in each column header; rename a scale by editing its header text.
- **Clear** – resets the matrix to a single empty scale.

Each scale needs at least two assigned items to run. Unassigned items are ignored; an item may belong to more than one scale if you need it to.

The reverse-scored items list on the left stays a single control, but is **grouped by scale** so it's easy to scan. Because reverse-scoring is a property of the item, an item you flag is reversed in every scale it belongs to.

## Reverse-scored items

A panel on the left lists all selected numeric variables. Click or drag-select items that should be reverse-scored before analysis. The reversal applies to the analysis only and leaves your data untouched: each value becomes `lowest + highest − old`, mirrored around the [response scale range](#b-lowest) below. {#reverse-scored-items}

Three buttons below the list:

- **Deselect all** – clears all reverse-scoring selections
- **Invert selection** – toggles each item's status
- **Detect** – fills the list from the data as it is, without running the analysis: the items keyed against the majority of their scale, each scale detected on its own items when there are several. An item too weakly related to the rest to place is left unselected and named under the buttons as unclassifiable, as is an item two scales key differently; when as many items point one way as the other, the line under the buttons names the item whose direction the selection keeps. Detection proposes and the list decides – it can miss a reversed item when agreeing with everything is as strong a habit in the sample as the trait, so check it against the questionnaire's scoring key. The rule is the [IRT module's](./irt-analysis.md#negatively-keyed-items) – the same routine serves both.

Below them, **Response scale range** sets the endpoints the reversal mirrors around:

- **Lowest** – the lowest value the response scale allows (1 on a 1–5 item). Leave it empty to use the lowest response observed across all selected items – across each scale's own items when there are several – which the empty field shows greyed for a single scale.
- **Highest** – the highest value the response scale allows. Leave it empty to use the highest response observed across all selected items – across each scale's own items when there are several – which the empty field shows greyed for a single scale.

> **Why declare the range?** If nobody in your sample used an endpoint, the observed range is narrower than the questionnaire's and a reversed item is shifted against the others – see [response scale](./concepts/reliability.md#b-response-scale).

> **When to reverse-score:** any item worded so that agreeing with it means *less* of the construct – see [reverse-keyed item](./concepts/reliability.md#b-reverse-keyed-item), and the [questionnaire scoring guide](./questionnaire-scoring-guide.md) for step-by-step examples.

## Reliability metrics

Enable or disable each coefficient independently. Each selected coefficient is a row of the [metrics table](#reliability-metrics-table), a column of the [summary](#summary-table-multiple-scales) in multiple-scales mode, and an "if deleted" column in the [item analysis](#item-analysis).

- **Cronbach's alpha (α)** – on by default. The most widely reported coefficient, computed from the item and total variances; the table also reports [standardized alpha](#b-standardized-cronbachs-alpha). It assumes every item carries the construct equally – see [Cronbach's alpha](./concepts/reliability.md#b-cronbachs-alpha). {#cronbachs-alpha-α #α}
- **McDonald's omega (ω)** – on by default. Estimated from a factor model, so items may contribute unequally; the coefficient to trust when it and alpha disagree. From six items the fit is a bifactor model and [ω hierarchical](#b-mcdonalds-ω-hierarchical) is reported as well – see [McDonald's omega](./concepts/reliability.md#b-mcdonalds-omega).
- **Composite reliability (CR)** – omega under its CFA name, from a one-factor fit; the same number as ω on a unidimensional scale – see [composite reliability](./concepts/latent-variables.md#b-composite-reliability-cr). {#composite-reliability-cr #cr}
- **Split-half reliability** – the Rulon–Flanagan split-half coefficient averaged over many random splits of the items, reported as [Mean split-half](#b-mean-split-half); with an even number of items it equals standardized alpha – see [split-half reliability](./concepts/reliability.md#b-split-half-reliability).
- **Guttman's lambda (λ2, λ4, λ6)** – three lower bounds on reliability: λ2, never below alpha; λ4, the greatest split-half; λ6, from each item's squared multiple correlation with the others – see [Guttman's lambdas](./concepts/reliability.md#b-guttmans-lambdas).
- **Average variance extracted (AVE)** – on by default. The mean squared loading: how much of each item's variance the factor explains on average, read on one convergent-validity cut rather than the reliability bands – see [AVE](./concepts/latent-variables.md#b-average-variance-extracted). {#average-variance-extracted-ave #ave}
- **Coefficient H** – the reliability an optimally weighted composite of the items would have; never below omega – see [coefficient H](./concepts/reliability.md#b-coefficient-h). {#coefficient-h #h}
- **Revelle's beta (β)** – the worst split-half over all splits, a lower bound on how much a single general factor explains – see [Revelle's beta](./concepts/reliability.md#b-revelles-beta). {#revelles-beta-β #β}
- **Greatest lower bound (GLB)** – the largest reliability the observed covariance matrix admits; its fit may fail on some data – see [greatest lower bound](./concepts/reliability.md#b-greatest-lower-bound). {#greatest-lower-bound-glb #glb}

**Assumptions:**
- **Unidimensionality** – every coefficient assumes the items measure a single construct; a scale that mixes two subscales gets a misleading overall value, so compute per subscale with [multiple-scales mode](#multiple-scales-subscales) – see [unidimensionality](./concepts/latent-variables.md#b-unidimensionality).
- **Tau-equivalence** – alpha alone additionally assumes every item carries the construct equally; when loadings differ, alpha understates reliability and omega does not – see [tau-equivalence](./concepts/reliability.md#b-tau-equivalence).
- **One response scale** – mixing items with different ranges (a 1–5 item with a 0–100 slider) distorts every coefficient; standardize the items first or analyze them separately.
- **Sufficient sample size** – coefficients stabilize with more data and are unstable below about 50 cases; intervals widen sharply with small N, so keep them enabled and report them.
- **Consistent scoring direction** – negatively worded items must be [reverse-scored](#reverse-scored-items) first, or they deflate every coefficient.

## Output options

Five output sections can be toggled:

- **Item statistics** – on by default. Mean, SD and N for each item in the [item analysis](#item-analysis).
- **Scale statistics** – on by default. The [scale statistics](#scale-statistics) table: number of items and cases, the scale mean, SD and variance, the standard error of measurement, the shares of respondents at the lowest and highest possible score, and the mean and range of the inter-item correlations. {#scale-statistics-option}
- **Item-total correlations** – on by default. Three columns per item: the raw item-total correlation, the corrected (item-rest) correlation the flags read, and the disattenuated one – see [corrected item-total correlation](./concepts/reliability.md#b-corrected-item-total-correlation).
- **Reliability if item deleted** – every selected coefficient recomputed without each item, one column per coefficient; needs at least three items – see [alpha if item deleted](./concepts/reliability.md#b-alpha-if-item-deleted).
- **Inter-item correlation matrix** – prints the [full pairwise correlation matrix](#inter-item-correlation-matrix) among the items – see [inter-item correlation](./concepts/reliability.md#b-inter-item-correlation). {#inter-item-correlation-matrix-option}

### Advanced options

- **Confidence intervals for reliability estimates** – on by default. Adds a CI column to the metrics table at the [confidence level](./settings.md#confidence-level). Alpha's interval is exact (Feldt's F interval); every other coefficient is bootstrapped over the [bootstrap replications](./settings.md#bootstrap-replications), so the run time grows with the replication count, and noticeably so with ω or GLB selected. Set the [bootstrap seed](./settings.md#bootstrap-seed) to make those intervals reproducible.

## Reading results

Results appear in a **Reliability analysis** output card with the following sections.

### Summary table (multiple scales)

In [multiple-scales mode](#multiple-scales-subscales) the card opens with a comparison table, the one place the coefficients print, and each scale's output then follows under its own **Scale: {name}** heading – the sections below, all but the [metrics table](#reliability-metrics-table), whose rows are the summary's columns.

- **Summary** – one row per scale, one column per selected coefficient, with confidence intervals inline when enabled and, with [interpretation](./settings.md#b-show-interpretation-column-when-applicable) on, each graded coefficient's verdict under its value, read on that coefficient's own bands as in the [metrics table](#reliability-metrics-table), with the same band legend under the table, one line for each rule a scale's coefficient was graded on: the side-by-side comparison you would otherwise assemble by hand. The notes the metrics table carries print once under the summary – a line giving the confidence level of the intervals beside the coefficients, then the notes on how the intervals were built and read, on the coefficients shown without a verdict and on the split-half – and a note that holds for one scale alone (the congeneric ω, items keyed against the rest, failed estimators, the N) is led by that scale's name. A coefficient whose estimator failed reads **Estimation failed** in its cell.
- **Scale** – the scale's name from the **Scales** matrix; the same name heads that scale's block of tables below.
- **Items** – how many items the scale was scored on, after any exclusions.

The coefficient columns are headed by symbol:

- α – [Cronbach's alpha](#b-cronbachs-alpha-α)
- α (std) – [standardized alpha](#b-standardized-cronbachs-alpha)
- ω – [McDonald's ω (total)](#b-mcdonalds-ω-total)
- ω_h – [McDonald's ω (hierarchical)](#b-mcdonalds-ω-hierarchical), present when a bifactor solution was fitted
- CR – [composite reliability](#b-composite-reliability-cr)
- Split-half – [mean split-half](#b-mean-split-half)
- λ2 – [Guttman's lambda 2](#b-guttmans-lambda-2-λ2)
- λ4 – [Guttman's lambda 4](#b-guttmans-lambda-4-λ4)
- λ6 – [Guttman's lambda 6](#b-guttmans-lambda-6-λ6)
- AVE – [average variance extracted](#b-average-variance-extracted-ave)
- H – [coefficient H](#b-coefficient-h)
- β – [Revelle's beta](#b-revelles-beta-β)
- GLB – [greatest lower bound](#b-greatest-lower-bound-glb)

### Scale information

A summary block at the top – one per scale in multiple-scales mode – listing:

- The scale's items, when no table below names them – with neither the item analysis nor the inter-item matrix shown
- Which items were reverse-scored (if any)
- The **Response range** the items were scored within, and whether each bound was declared or observed across the items – shown whenever items were reverse-scored or the floor and ceiling shares print, since both read it
- Which variables were excluded for being non-numeric, or for having no variance (if any)

### Reliability metrics table

**Reliability metrics.** The card's first table: one row per selected coefficient, with its value, confidence interval and interpretation. In multiple-scales mode the [summary](#summary-table-multiple-scales) takes its place. With **Item statistics** and **Scale statistics** both off, no other table shows the sample size, so a [note under the table](./reading-results.md#b-n-under-a-table) states it.

- **Metric** – the coefficient name
- **Value** – the computed coefficient; **Estimation failed** where its estimator did not produce one
- **CI** – confidence interval (if enabled)
- **Interpretation** – the coefficient's band on the scales below (if [interpretation](./settings.md#b-show-interpretation-column-when-applicable) is enabled). A legend under the table gives one line per rule a coefficient was graded on – its source, then its bands from the top, as in "> 0.8 Well-defined construct, ≥ 0.7 Adequately defined construct, < 0.7 Poorly defined construct". With the CI on, the verdict names the bands at both ends of the interval – *Acceptable to Good*, or *Good across the CI* when both ends agree – see [band across the CI](./reading-results.md#b-verdict-band-across-the-ci); a note under the table says this is Koo and Li's reading of an ICC, which the app extends to the reliability coefficients, and a second names the confidence level when it is not 95%. A coefficient with no interval – ω hierarchical – keeps its point's band

Some options add rows beyond their own name:

- **Standardized Cronbach's alpha** – alpha computed on the correlation matrix, as if every item had an SD of 1; reported with alpha – see [standardized alpha](./concepts/reliability.md#b-standardized-alpha). {#standardized-cronbachs-alpha #α-std}
- **McDonald's ω (total)** – the omega the **McDonald's omega (ω)** option reports: the share of total-score variance the factor model attributes to the items' common factors. {#mcdonalds-ω-total #ω}
- **McDonald's ω (hierarchical)** – the share attributable to a single general factor, reported from six items up, where the fit is bifactor – see [omega hierarchical](./concepts/reliability.md#b-omega-hierarchical). {#mcdonalds-ω-hierarchical #ωh}
- **Mean split-half** – the split-half coefficient averaged over random splits, which the **Split-half reliability** option reports – see [split-half reliability](./concepts/reliability.md#b-split-half-reliability). {#mean-split-half #split-half}
- **Guttman's lambda 2 (λ2)** – a lower bound never below alpha – see [Guttman's λ2](./concepts/reliability.md#b-guttmans-λ2). {#guttmans-lambda-2-λ2 #λ2}
- **Guttman's lambda 4 (λ4)** – the greatest split-half over all splits – see [Guttman's λ4](./concepts/reliability.md#b-guttmans-λ4). {#guttmans-lambda-4-λ4 #λ4}
- **Guttman's lambda 6 (λ6)** – from each item's squared multiple correlation with the others – see [Guttman's λ6](./concepts/reliability.md#b-guttmans-λ6). {#guttmans-lambda-6-λ6 #λ6}

Interpretation thresholds for α, standardized α, ω, CR, the mean split-half, λ2 and λ6 – George and Mallery's ladder, cited in the citations box whenever a verdict is shown; a value printed across a boundary from its verdict carries a [boundary marker](./reading-results.md#boundary-marker):

| Value | Label |
|---|---|
| 0.50 or below | Unacceptable |
| Above 0.50, to 0.60 | Poor |
| Above 0.60, to 0.70 | Questionable |
| Above 0.70, to 0.80 | Acceptable |
| Above 0.80, below 0.90 | Good |
| 0.90 to 0.95 | Excellent |
| Above 0.95 | Excellent (possible redundancy) |

Three coefficients read scales of their own, each cited whenever it is graded; ω hierarchical's legend line adds that its source offers the cuts as a tentative, subjective guideline:

| Coefficient | Source | Bands |
|---|---|---|
| ω hierarchical | Reise, Bonifay & Haviland (2013) | 0.50 or below *Weak general factor* · above 0.50, below 0.75 *Moderate general factor* · 0.75 and above *Strong general factor* |
| Coefficient H | Hancock & Mueller (2001); Rodriguez, Reise & Haviland (2016) | below 0.70 *Poorly defined construct* · 0.70 to 0.80 *Adequately defined construct* · above 0.80 *Well-defined construct* |
| AVE | Fornell & Larcker (1981) | below 0.50 *Below .50* · 0.50 and above *Adequate convergent validity* |

**Coefficients shown without a verdict.** λ4, GLB and Revelle's β get an em dash in the **Interpretation** column instead of a label, and a note under the table says so: they bound reliability or measure general-factor saturation, and the bands above were derived for α and ω.

**When an estimator fails.** The coefficients come from separate fits (alpha, factor analysis, split-half, omega, and the greatest lower bound's own). If one fails on your data, the coefficients that depend on it keep their rows with **Estimation failed** in place of a value, and a note under the table names each failed estimator, what it cost and the reason R gave. A fit that fails only when an item is deleted leaves that item's "if deleted" cell blank and the coefficient's row as it was.

> **Above 0.95 – too good?** Very high reliability usually means near-duplicate items; check the inter-item correlation matrix for correlations above 0.90 – see [inter-item correlation](./concepts/reliability.md#b-inter-item-correlation).

### Scale statistics

**Scale statistics.** A key–value table describing the total score – the sum of all items after reverse scoring.

- **Number of items** – the items the scale was scored on
- **Number of cases** – the rows that reached the analysis
- **Cases with complete data** – shown under [pairwise deletion](#missing-data) when some cases have missing items; the scale mean, SD, variance, SEM and the floor and ceiling shares are computed over those cases only
- **Scale mean** – the mean total score; divided by the number of items it is the average item response, which compares scales of different lengths
- **Scale SD** – the standard deviation of the total score
- **Scale variance** – the variance of the total score
- **Standard error of measurement** – $\text{SD} \times \sqrt{1 - \alpha}$, shown when Cronbach's alpha is selected: the precision of one respondent's total – see [standard error of measurement](./concepts/reliability.md#b-standard-error-of-measurement)
- **At the lowest possible score (%)** – the percentage of respondents whose total is the lowest the scale allows, the number of items times the [lowest](#b-lowest) response; with [interpretation](./settings.md#b-show-interpretation-column-when-applicable) on, more than 15% reads *Floor effect* and 15% or less *No floor effect* – see [floor effect](./concepts/reliability.md#b-ceiling-effect). A legend under the table gives the floor and ceiling bands with their sources
- **At the highest possible score (%)** – the same at the top, the number of items times the [highest](#b-highest) response; more than 15% reads *Ceiling effect*, 15% or less *No ceiling effect* – see [ceiling effect](./concepts/reliability.md#b-ceiling-effect). When a response bound was left empty, the possible score on that side is taken from the most extreme response observed, and the **Response range** line in the [scale information](#scale-information) names that side as observed
- **Mean inter-item correlation** – the average off-diagonal correlation among the items; with [interpretation](./settings.md#b-show-interpretation-column-when-applicable) on, graded against Clark and Watson's recommended range, cited whenever it is shown: *Below the recommended range* under 0.15, *Within the recommended range* from 0.15 to 0.50, *Above the recommended range* beyond 0.50. A legend under the table adds where in the range a scale belongs – near 0.15–0.20 for a broad construct, 0.40–0.50 for a narrow one – see [inter-item correlation](./concepts/reliability.md#b-inter-item-correlation)
- **Inter-item correlation range** – the smallest and largest off-diagonal correlation

### Item analysis

**Item analysis.** A combined table with one row per item; which columns appear depends on your output options.

- **Item** – the item's name. When [detection](#b-detect) still reads an item as keyed against the rest of the scale after the reverse-scored list is applied, a note under the metrics table – under the summary, with several scales – names it and its name becomes a **Mark this item for reverse scoring** action: selecting it ticks the item in the reverse-scored list on the left, and re-running the analysis applies it.
- **Mean** – the item's mean response
- **SD** – the item's standard deviation
- **N** – the number of cases with a value for the item
- **Item-total r** – correlation between the item and the total score, the item itself included
- **Corrected item-total r (item-rest)** – correlation between the item and the sum of all *other* items: the classical corrected coefficient, and the one the discrimination flags are graded on, unrounded: with interpretation on, a value that prints across a flag's cut-off carries a [boundary marker](./reading-results.md#boundary-marker), as the [metrics table's](#reliability-metrics-table) values do – see [corrected item-total correlation](./concepts/reliability.md#b-corrected-item-total-correlation)
- **Item-total r corrected for overlap and reliability** – the item-rest correlation additionally disattenuated for the scale's unreliability; systematically higher, an estimate of the item's correlation with the construct rather than a discrimination index; withheld, with a note under the table, when the items' common variance is not positive – usually a mis-keyed item – since the correction is then undefined – see [disattenuated item-total correlation](./concepts/reliability.md#b-disattenuated-item-total-correlation)
- **{symbol} if deleted** – the coefficient recomputed without this item, one column per selected coefficient (α if deleted, ω if deleted, …) – see [alpha if item deleted](./concepts/reliability.md#b-alpha-if-item-deleted)
- **Item analysis – Interpretation** – per-item flags when [interpretation](./settings.md#b-show-interpretation-column-when-applicable) is enabled: *Negative correlation – check reverse scoring*; *Poor discrimination* (item-rest r below 0.20), *Marginal discrimination* (0.20 to 0.30) or *Adequate discrimination* (0.30 and above), the bands cited in the citations box and given, with their sources, in a legend under the table; for each selected coefficient that would rise with the item deleted, the fact stated neutrally – *{symbol} if deleted: {value}, above the scale's {symbol}* – whenever the rise prints above zero; or *No issues flagged* when there is nothing to report.

> **Should I delete items?** Not automatically – remove an item for a substantive reason (poor wording, low discrimination, theoretical misfit), not because a coefficient would rise; see [alpha if item deleted](./concepts/reliability.md#b-alpha-if-item-deleted) and the [pitfall](#common-pitfalls) below.

### Inter-item correlation matrix

**Inter-item correlation matrix.** A symmetric matrix of the pairwise correlations among all items, for spotting clusters of highly related items or pairs that don't belong together. The correlations are product-moment (Pearson) whatever the items' declared type, and when every item is typed ordinal a note under the matrix says so; every coefficient on the card is estimated from this same matrix, so what it describes is the reliability of the summed item scores. With [interpretation](./settings.md#b-show-interpretation-column-when-applicable) on, every correlation outside the recommended 0.15 to 0.50 range is marked, and a note under the matrix says that Clark and Watson apply the range to each correlation, not only to the mean.

> **What to look for:** correlations outside the marked range – one near zero or negative suggests an item measuring something else – see [inter-item correlation](./concepts/reliability.md#b-inter-item-correlation). A block of high correlations among a subset of items may be a sub-factor, which [factor analysis](./factor-analysis.md) can reveal.

## Missing data

Missing values are handled by the global [missing data setting](./settings.md#missing-data). With listwise deletion, any case missing a value on any item is excluded before the analysis. With pairwise deletion, the coefficients are estimated from pairwise-complete correlations, item statistics use each item's own cases, and the scale-level statistics are computed on the complete cases alone, whose count the card reports as **Cases with complete data**. With imputation, missing values are replaced before analysis.

> **Missing data and reliability:** listwise deletion can shrink the sample sharply when missingness is spread across many items – compare **Number of cases** with your file's row count – see [listwise deletion](./concepts/outliers-missing-data.md#b-listwise-deletion) and [pairwise deletion](./concepts/outliers-missing-data.md#b-pairwise-deletion).

## Reporting checklist

Key things to include when writing up reliability results:

**Method:**
- Which reliability metrics were computed and why (e.g. "Cronbach's alpha and McDonald's omega were calculated")
- Number of items in the scale
- Whether any items were reverse-scored (and which ones)
- How missing data were handled
- Sample size

**Results:**
- Reliability coefficient values with confidence intervals
- Item-total correlations (or at least note any problematic items)
- Whether any items were removed and why
- For multi-dimensional scales: reliability per subscale, not just overall ([multiple-scales mode](#multiple-scales-subscales) reports every subscale at once)

## R reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. Internal consistency uses the `psych` R package. Citations for R packages used in your analysis appear automatically at the top of the output section. Bootstrap CIs (for ω, composite reliability, split-half, Guttman's λ, AVE, coefficient H, Revelle's β and GLB) are seeded by [**Bootstrap seed**](./settings.md#bootstrap-seed) – set it to make CIs reproducible across runs. The estimators, intervals and thresholds behind the module are argued in the [method notes](./methods/reliability-analysis.md).

## Common pitfalls

**Reporting only alpha.** Cronbach's alpha remains the most requested metric, but it assumes all items contribute equally (tau-equivalence) – which is rarely true. If alpha and omega disagree, alpha is usually the less accurate estimate. Report both; increasingly, journals expect omega.

**Treating alpha as a measure of unidimensionality.** A scale can have high alpha and still be multidimensional – alpha reflects average inter-item correlation, not factor structure. A 20-item scale with two distinct sub-factors can easily produce alpha = 0.85. If you need to demonstrate unidimensionality, use [factor analysis](./factor-analysis.md).

**Reverse-scoring mistakes.** Forgetting to reverse-score negatively worded items is the most common cause of unexpectedly low reliability. The telltale sign: one or more items with negative item-total correlations. Check the original questionnaire's scoring instructions before running the analysis; [**Detect**](#b-detect) proposes the list from the data, and the note under the metrics table names any item still keyed against the rest.

**Deleting items to maximize alpha.** Removing every item that would "improve alpha if deleted" can produce a shorter scale that works well in your sample but poorly elsewhere. Only remove items with clear substantive problems (low discrimination, ambiguous wording, theoretical misfit) – not just because the number goes up by 0.01.

**Ignoring sample-specific results.** Reliability is a property of *scores in your sample*, not the test itself. A scale with published alpha of 0.90 might produce 0.65 in your sample if your population is more homogeneous or the items don't work the same way in your context. Always compute and report reliability for your own data.
