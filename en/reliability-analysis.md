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
- **Average variance extracted (AVE)** – on by default. The mean squared loading: how much of each item's variance the factor explains on average, read on convergent-validity bands rather than reliability ones – see [AVE](./concepts/latent-variables.md#b-average-variance-extracted). {#average-variance-extracted-ave #ave}
- **Coefficient H** – the reliability an optimally weighted composite of the items would have; never below omega – see [coefficient H](./concepts/reliability.md#b-coefficient-h). {#coefficient-h #h}
- **Revelle's beta (β)** – the worst split-half over all splits, a lower bound on how much a single general factor explains – see [Revelle's beta](./concepts/reliability.md#b-revelles-beta). {#revelles-beta-β #β}
- **Greatest lower bound (GLB)** – the largest reliability the observed covariance matrix admits; the fit may fail to converge on some data – see [greatest lower bound](./concepts/reliability.md#b-greatest-lower-bound). {#greatest-lower-bound-glb #glb}

**Assumptions:**
- **Unidimensionality** – every coefficient assumes the items measure a single construct; a scale that mixes two subscales gets a misleading overall value, so compute per subscale with [multiple-scales mode](#multiple-scales-subscales) – see [unidimensionality](./concepts/latent-variables.md#b-unidimensionality).
- **Tau-equivalence** – alpha alone additionally assumes every item carries the construct equally; when loadings differ, alpha understates reliability and omega does not – see [tau-equivalence](./concepts/reliability.md#b-tau-equivalence).
- **One response scale** – mixing items with different ranges (a 1–5 item with a 0–100 slider) distorts every coefficient; standardize the items first or analyze them separately.
- **Sufficient sample size** – coefficients stabilize with more data and are unstable below about 50 cases; intervals widen sharply with small N, so keep them enabled and report them.
- **Consistent scoring direction** – negatively worded items must be [reverse-scored](#reverse-scored-items) first, or they deflate every coefficient.

## Output options

Five output sections can be toggled:

- **Item statistics** – on by default. Mean, SD and N for each item in the [item analysis](#item-analysis), with floor, ceiling and low-variance flags in its **Interpretation** column.
- **Scale statistics** – on by default. The [scale statistics](#scale-statistics) table: number of items and cases, the scale mean, SD and variance, the standard error of measurement, and the mean and range of the inter-item correlations. {#scale-statistics-option}
- **Item-total correlations** – on by default. Three columns per item: the raw item-total correlation, the corrected (item-rest) correlation the flags read, and the disattenuated one – see [corrected item-total correlation](./concepts/reliability.md#b-corrected-item-total-correlation).
- **Reliability if item deleted** – every selected coefficient recomputed without each item, one column per coefficient; needs at least three items – see [alpha if item deleted](./concepts/reliability.md#b-alpha-if-item-deleted).
- **Inter-item correlation matrix** – prints the [full pairwise correlation matrix](#inter-item-correlation-matrix) among the items – see [inter-item correlation](./concepts/reliability.md#b-inter-item-correlation). {#inter-item-correlation-matrix-option}

### Advanced options

- **Confidence intervals for reliability estimates** – on by default. Adds a CI column to the metrics table at the [confidence level](./settings.md#confidence-level). Alpha's interval is exact (Feldt's F interval); every other coefficient is bootstrapped over the [bootstrap replications](./settings.md#bootstrap-replications), so the run time grows with the replication count, and noticeably so with ω or GLB selected. Set the [bootstrap seed](./settings.md#bootstrap-seed) to make those intervals reproducible.

## Reading results

Results appear in a **Reliability analysis** output card with the following sections.

### Summary table (multiple scales)

In [multiple-scales mode](#multiple-scales-subscales) the card opens with a comparison table, and each scale's full output (the sections below) then follows under its own **Scale: {name}** heading.

- **Summary** – one row per scale, one column per selected coefficient, with confidence intervals inline when enabled: the side-by-side comparison you would otherwise assemble by hand.
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

A summary block at the top listing:

- Scale items used in the analysis
- Which items were reverse-scored (if any)
- Which variables were excluded for being non-numeric, or for having no variance (if any)

### Reliability metrics table

**Reliability metrics.** The card's first table: one row per selected coefficient, with its value, confidence interval and interpretation.

- **Metric** – the coefficient name
- **Value** – the computed coefficient; **Failed to converge** where its estimator did not produce one
- **CI** – confidence interval (if enabled)
- **Interpretation** – a qualitative label against the bands below (if [interpretation](./settings.md#significance-formatting) is enabled)

Some options add rows beyond their own name:

- **Standardized Cronbach's alpha** – alpha computed on the correlation matrix, as if every item had an SD of 1; reported with alpha – see [standardized alpha](./concepts/reliability.md#b-standardized-alpha). {#standardized-cronbachs-alpha #α-std}
- **McDonald's ω (total)** – the omega the **McDonald's omega (ω)** option reports: the share of total-score variance the factor model attributes to the items' common factors. {#mcdonalds-ω-total #ω}
- **McDonald's ω (hierarchical)** – the share attributable to a single general factor, reported from six items up, where the fit is bifactor – see [omega hierarchical](./concepts/reliability.md#b-omega-hierarchical). {#mcdonalds-ω-hierarchical #ωh}
- **Mean split-half** – the split-half coefficient averaged over random splits, which the **Split-half reliability** option reports – see [split-half reliability](./concepts/reliability.md#b-split-half-reliability). {#mean-split-half #split-half}
- **Guttman's lambda 2 (λ2)** – a lower bound never below alpha – see [Guttman's λ2](./concepts/reliability.md#b-guttmans-λ2). {#guttmans-lambda-2-λ2 #λ2}
- **Guttman's lambda 4 (λ4)** – the greatest split-half over all splits – see [Guttman's λ4](./concepts/reliability.md#b-guttmans-λ4). {#guttmans-lambda-4-λ4 #λ4}
- **Guttman's lambda 6 (λ6)** – from each item's squared multiple correlation with the others – see [Guttman's λ6](./concepts/reliability.md#b-guttmans-λ6). {#guttmans-lambda-6-λ6 #λ6}

Interpretation thresholds:

| Value | Label |
|---|---|
| Below 0.50 | Unacceptable |
| 0.50–0.60 | Poor |
| 0.60–0.70 | Questionable |
| 0.70–0.80 | Acceptable |
| 0.80–0.90 | Good |
| 0.90–0.95 | Excellent |
| Above 0.95 | Excellent (possible redundancy) |

AVE uses a different scale:

| Value | Label |
|---|---|
| Below 0.50 | Poor convergent validity |
| 0.50–0.70 | Acceptable convergent validity |
| 0.70 and above | Good convergent validity |

**Coefficients shown without a verdict.** λ4, GLB, Revelle's β and ω hierarchical get an em dash in the **Interpretation** column instead of a label, and a note under the table says so: they bound reliability or measure general-factor saturation, and the bands above were derived for α and ω.

**When an estimator fails.** The coefficients come from four separate fits (alpha, factor analysis, split-half, omega). If one fails on your data, the coefficients that depend on it keep their rows with **Failed to converge** in place of a value, and a note under the table names the failed estimator and what it cost.

> **Above 0.95 – too good?** Very high reliability usually means near-duplicate items; check the inter-item correlation matrix for correlations above 0.90 – see [inter-item correlation](./concepts/reliability.md#b-inter-item-correlation).

### Scale statistics

**Scale statistics.** A key–value table describing the total score – the sum of all items after reverse scoring.

- **Number of items** – the items the scale was scored on
- **Number of cases** – the rows that reached the analysis
- **Cases with complete data** – shown under [pairwise deletion](#missing-data) when some cases have missing items; the scale mean, SD, variance and SEM are computed over those cases only
- **Scale mean** – the mean total score; divided by the number of items it is the average item response, which compares scales of different lengths
- **Scale SD** – the standard deviation of the total score
- **Scale variance** – the variance of the total score
- **Standard error of measurement** – $\text{SD} \times \sqrt{1 - \alpha}$, shown when Cronbach's alpha is selected: the precision of one respondent's total – see [standard error of measurement](./concepts/reliability.md#b-standard-error-of-measurement)
- **Mean inter-item correlation** – the average off-diagonal correlation among the items
- **Inter-item correlation range** – the smallest and largest off-diagonal correlation

### Item analysis

**Item analysis.** A combined table with one row per item; which columns appear depends on your output options.

- **Item** – the item's name. When [detection](#b-detect) still reads an item as keyed against the rest of the scale after the reverse-scored list is applied, a note under the metrics table names it and its name becomes a **Mark this item for reverse scoring** action: selecting it ticks the item in the reverse-scored list on the left, and re-running the analysis applies it.
- **Mean** – the item's mean response
- **SD** – the item's standard deviation
- **N** – the number of cases with a value for the item
- **Item-total r** – correlation between the item and the total score, the item itself included
- **Corrected item-total r (item-rest)** – correlation between the item and the sum of all *other* items: the classical corrected coefficient, and the one the discrimination flags are applied to – see [corrected item-total correlation](./concepts/reliability.md#b-corrected-item-total-correlation)
- **Item-total r corrected for overlap and reliability** – the item-rest correlation additionally disattenuated for the scale's unreliability; systematically higher, an estimate of the item's correlation with the construct rather than a discrimination index; withheld, with a note under the table, when the items' common variance is not positive – usually a mis-keyed item – since the correction is then undefined – see [disattenuated item-total correlation](./concepts/reliability.md#b-disattenuated-item-total-correlation)
- **{symbol} if deleted** – the coefficient recomputed without this item, one column per selected coefficient (α if deleted, ω if deleted, …) – see [alpha if item deleted](./concepts/reliability.md#b-alpha-if-item-deleted)
- **Item analysis – Interpretation** – per-item flags when [interpretation](./settings.md#significance-formatting) is enabled: *Negative correlation – check reverse scoring*; *Very weak discrimination* (item-rest r below 0.20), *Poor discrimination* (below 0.30) or *Good discrimination* (0.50 and above); *Possible floor effect* or *Possible ceiling effect* (more than 15% of answers at the item's minimum or maximum); *Low variance* (SD under a tenth of the item's range); *Deletion would improve* a named coefficient, with the gain, whenever the gain shows at the displayed precision; or *Good item* when nothing was flagged.

> **Should I delete items?** Not automatically – remove an item for a substantive reason (poor wording, low discrimination, theoretical misfit), not because a coefficient would rise; see [alpha if item deleted](./concepts/reliability.md#b-alpha-if-item-deleted) and the [pitfall](#common-pitfalls) below.

### Inter-item correlation matrix

**Inter-item correlation matrix.** A symmetric matrix of the pairwise correlations among all items, for spotting clusters of highly related items or pairs that don't belong together. The correlations are product-moment (Pearson) whatever the items' declared type, and when every item is typed ordinal a note under the matrix says so; every coefficient on the card is estimated from this same matrix, so what it describes is the reliability of the summed item scores.

> **What to look for:** most correlations should fall between 0.20 and 0.80 – below suggests the items aren't measuring the same thing, above suggests redundancy – see [inter-item correlation](./concepts/reliability.md#b-inter-item-correlation). A block of high correlations among a subset of items may be a sub-factor, which [factor analysis](./factor-analysis.md) can reveal.

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
