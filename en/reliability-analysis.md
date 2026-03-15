---
title: Reliability analysis
description: Cronbach's alpha, McDonald's omega, split-half reliability, item analysis, and other internal consistency metrics in DataSuite 2.
---

# Reliability analysis

The **Reliability analysis** module evaluates the internal consistency of a set of scale items — how well they measure the same underlying construct. Select your items, optionally mark reverse-scored ones, choose which metrics to compute, and click **Calculate reliability**.

> **What is internal consistency?** If you have a questionnaire with 10 items all meant to measure "anxiety," internal consistency tells you whether they actually hang together. High consistency (e.g. alpha = 0.85) means people who score high on one item tend to score high on the others. Low consistency means some items might be measuring something else — or might be scored in the wrong direction.

1. [Select your scale items](./getting-started.md#choosing-variables) (at least two numeric variables)
2. Mark any [reverse-scored items](#reverse-scored-items)
3. Choose which [reliability metrics](#reliability-metrics) to compute
4. Toggle [output options](#output-options)
5. Click **Calculate reliability**

## Requirements

- At least two numeric variables must be selected. Categorical variables are automatically excluded (and listed in the output).
- At least one reliability metric must be checked.

## Reverse-scored items

A panel on the left lists all selected numeric variables. Click or drag-select items that should be reverse-scored before analysis. Reverse scoring flips each value using the formula: `new = (max + min) - old`, where min and max come from the item's observed range.

Two buttons below the list:

- **Deselect all** — clears all reverse-scoring selections
- **Invert selection** — toggles each item's status

> **When to reverse-score:** many questionnaires mix positively and negatively worded items to reduce response bias. For example, a self-esteem scale might have "I feel good about myself" (positive) and "I feel useless" (negative). Without reverse-scoring the negative items, they'd drag the total in the wrong direction and artificially lower reliability. Check the original questionnaire's scoring instructions. See the [questionnaire scoring guide](./questionnaire-scoring-guide.md) for step-by-step examples.

## Reliability metrics

Enable or disable each metric independently:

| Metric | Default | What it measures |
|---|---|---|
| **Cronbach's alpha** | On | Average inter-item covariance relative to total variance. The most widely reported metric. |
| **McDonald's omega (total)** | On | Based on a factor model — accounts for items contributing unequally to the scale. Often more accurate than alpha. |
| **Composite reliability (CR)** | Off | Similar to omega but from a CFA framework. Common in structural equation modeling. |
| **Split-half reliability** | Off | Splits items into two halves and correlates them, corrected with Spearman-Brown. Sensitive to how items are split. |
| **Guttman's lambda** | Off | Reports both Lambda 4 (greatest split-half) and Lambda 6 (item multiple correlation). |
| **Average variance extracted (AVE)** | On | Average variance in items explained by the latent factor. Used to assess convergent validity. |
| **Coefficient H** | Off | Maximal reliability based on factor loadings. Always ≥ omega. |
| **Revelle's beta** | Off | Worst split-half reliability — a lower bound on the general factor saturation. |
| **Greatest lower bound (GLB)** | Off | The theoretical minimum reliability. May fail to converge on some datasets. |

> **Alpha vs. omega:** Cronbach's alpha assumes all items contribute equally to the scale (tau-equivalence). In practice, that's rarely true — some items are better indicators than others. McDonald's omega uses a factor model to account for this, making it a more accurate estimate. Report both if your audience expects alpha, but trust omega when they disagree.

> **What is AVE?** AVE answers a different question than the other metrics: "on average, does the latent factor explain more than half the variance in each item?" An AVE above 0.50 means the factor accounts for more variance than measurement error — a threshold for convergent validity.
>
> **Don't panic over low AVE.** The 0.50 threshold is strict, and values of 0.30–0.45 are common even for well-established, widely published scales. This happens because psychological constructs are inherently broad — a 10-item depression scale covers sleep, appetite, mood, and concentration, so no single factor will explain most of the variance in every item. If your alpha and omega are solid (0.70+), a low AVE usually just means your scale captures a broad construct rather than a narrow one. AVE matters most when you need to demonstrate that two scales measure *different* things (discriminant validity) — in that context, the 0.50 rule carries more weight.

**Assumptions:**
- **All metrics** assume the items are meant to measure a single underlying construct (unidimensionality). If the scale is multidimensional (e.g. two subscales mixed together), overall reliability may be misleading — compute it per subscale instead.
- **Cronbach's alpha** additionally assumes tau-equivalence — that all items contribute equally. When items have unequal factor loadings (which is typical), alpha underestimates or overestimates true reliability. Omega does not have this limitation.
- **Items should have similar response scales.** Mixing items with different ranges (e.g. a 1–5 Likert item with a 0–100 slider) violates the equal-weight assumption and can distort all metrics. Standardize items first or analyze them separately.
- **Sufficient sample size.** Reliability estimates stabilize with more data — small samples (N < 50) can produce unstable coefficients. Confidence intervals widen substantially with small N, so always enable and report them.
- **No unscored items.** All items must be scored in the same direction. Negatively worded items need [reverse scoring](#reverse-scored-items) before analysis — otherwise they artificially deflate reliability.

## Output options

Five output sections can be toggled:

| Option | Default | What it shows |
|---|---|---|
| **Item statistics** | On | Mean and SD for each item |
| **Scale statistics** | On | Number of items, cases, scale mean, SD, and variance |
| **Item-total correlations** | On | Corrected item-total and item-rest correlations |
| **Reliability if item deleted** | Off | Every selected metric recalculated after dropping each item |
| **Inter-item correlation matrix** | Off | Full pairwise correlation matrix among items |

### Advanced options

- **Confidence intervals** (on by default) — adds a CI column to the metrics table. The confidence level comes from your [global settings](./settings.md#significance-level).

## Reading results

Results appear in a "Reliability analysis" output card with the following sections:

### Scale information

A summary block at the top listing:

- Scale items used in the analysis
- Which items were reverse-scored (if any)
- Which variables were excluded for being non-numeric (if any)

### Reliability metrics

A table with one row per selected metric:

- **Metric** — the coefficient name
- **Value** — the computed reliability coefficient
- **CI** — confidence interval (if enabled)
- **Interpretation** — a qualitative label (if [interpretation](./settings.md#significance-formatting) is enabled)

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

> **Above 0.95 — too good?** Extremely high reliability can mean your items are near-duplicates of each other. If alpha is 0.97, you might have redundant items that could be trimmed without losing information. Check the inter-item correlation matrix — if most correlations are above 0.90, consider shortening the scale.

### Scale statistics

A key-value table showing the number of items, number of cases, scale mean, scale SD, and scale variance.

> **Scale mean and SD:** these describe the total score (sum of all items, after reverse scoring). The scale mean divided by the number of items gives you the average item response, which can be useful for comparing scales with different numbers of items.

### Item analysis

A combined table with one row per item. Which columns appear depends on your output options:

- **Mean** and **SD** — basic item descriptives
- **Corrected item-total r** — correlation between the item and the sum of all *other* items
- **Item-rest r** — correlation between the item and the rest of the scale (slightly different correction)
- **[Metric] if deleted** — the metric value if this item were removed (one column per selected metric)
- **Interpretation** — per-item diagnostics when enabled:
  - Negative item-total correlation — suggests checking reverse scoring
  - Very weak discrimination — corrected item-total r below 0.20
  - Poor discrimination — corrected item-total r between 0.20 and 0.30
  - Good discrimination — corrected item-total r at or above 0.50
  - Possible floor or ceiling effect — mean near the item minimum or maximum
  - Low variance / flat responses — very small SD relative to the item range
  - Deletion would improve a metric — names the metric and shows the improvement
  - "Good item" — no issues detected

> **What is item-total correlation?** It tells you how well each item "agrees" with the rest of the scale. A high value (0.50+) means the item measures the same thing as the other items. A low value (below 0.30) means the item is out of step — it might be poorly worded, misunderstood by respondents, or measuring something different. A negative value almost always means the item needs reverse scoring.

> **"If deleted" — should I delete items?** Not automatically. The "if deleted" column shows what would happen to reliability if you dropped each item. If removing an item would substantially improve a metric (e.g. alpha jumps from 0.72 to 0.81), it's worth investigating — but only remove items for good reasons (poor wording, low discrimination, theoretical misfit), not just to chase a higher number.

### Inter-item correlation matrix

A symmetric matrix showing pairwise correlations among all items. Useful for spotting clusters of highly related items or pairs that don't belong together.

> **What to look for:** most correlations should fall between 0.20 and 0.80. Below 0.20 suggests the items aren't measuring the same thing. Above 0.80 suggests redundancy. A block of high correlations among a subset of items might indicate a sub-factor — consider whether [factor analysis](./factor-analysis.md) could reveal a cleaner structure.

## Missing data

Missing values are handled by the global [missing data setting](./settings.md#missing-data). With listwise deletion, any case missing a value on any item is excluded entirely. With imputation, missing values are replaced before analysis.

> **Missing data and reliability:** listwise deletion can dramatically shrink your sample if missingness is spread across many items. However, pairwise deletion isn't available for reliability analysis because the metrics require a complete item-by-person matrix. If you're losing too many cases, consider whether imputation (mean or median) is appropriate for your situation.

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
- For multi-dimensional scales: reliability per subscale, not just overall

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) — you can inspect, copy, or re-run the exact commands. Reliability analysis uses the `psych` R package. Citations for R packages used in your analysis appear automatically at the top of the output section.

## Common pitfalls

**Reporting only alpha.** Cronbach's alpha remains the most requested metric, but it assumes all items contribute equally (tau-equivalence) — which is rarely true. If alpha and omega disagree, alpha is usually the less accurate estimate. Report both; increasingly, journals expect omega.

**Treating alpha as a measure of unidimensionality.** A scale can have high alpha and still be multidimensional — alpha reflects average inter-item correlation, not factor structure. A 20-item scale with two distinct sub-factors can easily produce alpha = 0.85. If you need to demonstrate unidimensionality, use [factor analysis](./factor-analysis.md).

**Reverse-scoring mistakes.** Forgetting to reverse-score negatively worded items is the most common cause of unexpectedly low reliability. The telltale sign: one or more items with negative item-total correlations. Check the original questionnaire's scoring instructions before running the analysis.

**Deleting items to maximize alpha.** Removing every item that would "improve alpha if deleted" can produce a shorter scale that works well in your sample but poorly elsewhere. Only remove items with clear substantive problems (low discrimination, ambiguous wording, theoretical misfit) — not just because the number goes up by 0.01.

**Ignoring sample-specific results.** Reliability is a property of *scores in your sample*, not the test itself. A scale with published alpha of 0.90 might produce 0.65 in your sample if your population is more homogeneous or the items don't work the same way in your context. Always compute and report reliability for your own data.