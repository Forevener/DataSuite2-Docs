---
title: Analysis planner
description: Power analysis, effect size conversion, alpha correction, reliability planning, precision planning, and group allocation optimization in DataSuite 2.
---

# Analysis planner

The **Analysis planner** is a study-planning toolkit with six tools: power analysis, effect size conversion, alpha correction, reliability and attenuation planning, precision planning, and group allocation optimization. Each tool is a collapsible section — open the one you need.

> **Why plan ahead?** Running a study without planning sample size, effect size expectations, and multiple-comparison strategy is like building a house without a blueprint. Power analysis tells you how many participants you need. Alpha correction tells you how to handle multiple tests. Reliability planning tells you how many items your scale needs. Doing this *before* data collection avoids the two most common problems in research: underpowered studies that miss real effects, and post-hoc rationalization of unexpected results.

## Power analysis

Determines sample size, statistical power, or minimum detectable effect size for a planned study.

> **What is statistical power?** Power is the probability that your study will detect a real effect if one exists. A power of 0.80 means an 80% chance of getting a significant result when there truly is an effect — and a 20% chance of missing it. The convention is to aim for 0.80, though 0.90 is better for expensive studies or important decisions. Power depends on three things: effect size (bigger effects are easier to detect), sample size (more data helps), and significance level (stricter alpha requires more evidence).

### Choosing a test

Select the statistical test you plan to use:

| Category | Tests |
|---|---|
| **t-tests** | One-sample, Independent samples (default), Paired samples |
| **ANOVA** | One-way, Factorial |
| **Correlation** | Pearson correlation |
| **Regression** | Multiple regression |
| **Chi-square** | Goodness of fit, Test of independence |
| **Proportions** | One-sample, Two-sample |

The effect size metric, parameter fields, and sample size label update automatically based on your selection.

### Solve for

Choose which parameter to calculate — the other two become inputs:

- **Sample size** (default) — "how many participants do I need?"
- **Power** — "what's my chance of detecting the effect with this sample?"
- **Effect size** — "what's the smallest effect I can detect with this sample?"

### Parameters

All tests share these core inputs:

- **Effect size** — the expected magnitude of the effect. The metric changes with the test type (Cohen's d for t-tests, Cohen's f for one-way ANOVA, r for correlation, f² for regression and factorial ANOVA, Cohen's w for chi-square, Cohen's h for proportions). Default values follow Cohen's "medium" conventions.
- **Significance level (alpha)** — default 0.05
- **Power (1 − β)** — default 0.80
- **Sample size** — label adjusts per test ("per group", "number of pairs", "total sample size", etc.)

Additional fields for specific tests:

- **Tails** (one-sample t-test) — two-tailed, one-tailed greater, or one-tailed less
- **Number of groups** (one-way ANOVA) — default 3
- **Numerator / denominator df** (factorial ANOVA) — for specifying the effect and error degrees of freedom
- **Number of predictors** (regression) — default 3
- **Degrees of freedom** (chi-square) — help text shows the formula: categories − 1 for goodness of fit, (rows − 1) × (cols − 1) for independence

> **What effect size should I use?** Don't default to "medium" just because it's the default. Look at prior research in your field — meta-analyses are the best source. If no prior data exists, run a small pilot study. Cohen's conventions (small/medium/large) are rough guides, not prescriptions. In some fields, d = 0.20 is a meaningful effect; in others, it's noise.

### Results

After clicking **Calculate**:

1. **Main result** — a highlighted box with the answer (e.g. "Required sample size: 64 per group (128 total)")
2. **Parameters used** — a summary table listing all inputs
3. **Sensitivity analysis** — a table showing how the result changes. When solving for sample size, it shows power at 50%, 75%, 100%, 125%, and 150% of the calculated N. When solving for power, it varies the effect size. When solving for effect size, it varies the sample size.

> **Always check the sensitivity analysis.** Your effect size estimate is just that — an estimate. The sensitivity table shows what happens if you're wrong. If power drops to 0.50 at 75% of your calculated N, your study is fragile — consider aiming for a larger sample.

### Power curve

Click **Show power curve** to generate an interactive chart plotting power (y-axis) against sample size (x-axis). A green crosshair marks the calculated result. Hover over the curve to see power at any sample size.

### Quick reference

Before any calculation, a reference card shows Cohen's conventions:

| Measure | Small | Medium | Large |
|---|---|---|---|
| Cohen's d | 0.20 | 0.50 | 0.80 |
| Pearson r | 0.10 | 0.30 | 0.50 |
| Cohen's f | 0.10 | 0.25 | 0.40 |
| Cohen's f² | 0.02 | 0.15 | 0.35 |
| Cohen's w | 0.10 | 0.30 | 0.50 |

## Effect size converter

Converts a single effect size value into all other supported metrics. Useful when a paper reports one metric (e.g. odds ratio) and you need another (e.g. Cohen's d) for power analysis or comparison.

### Input

Select the input type from 15 options: Cohen's d, Hedges' g, Correlation r, R², Eta-squared, Partial eta-squared, Omega-squared, Cohen's f, Cohen's f², Cohen's w, Cohen's h, Cramer's V, Odds Ratio, CLES (Common Language Effect Size), NNT (Number Needed to Treat).

Additional fields appear when needed:

- **Sample size** — improves accuracy for Hedges' g (required when converting *from* g)
- **Table dimensions** — required for Cramer's V
- **Proportions (p1, p2)** — required for Cohen's h
- **Degrees of freedom** — required for partial eta-squared
- **Control event rate** — required for NNT

> **How the converter works:** all input types are first converted to Cohen's d as a common pivot, then from d to every other metric. This means conversions between two non-d metrics go through an intermediate step, which can introduce small rounding artifacts.

### Output

After clicking **Convert**, a table shows every metric with its value and a verbal interpretation (negligible, small, medium, or large) based on Cohen's conventions. Metrics that require additional inputs not provided show a dash.

## Alpha correction planner

Shows adjusted significance thresholds for multiple comparisons, so you can plan your alpha correction *before* running the study.

> **Why correct for multiple comparisons?** If you test 20 hypotheses at alpha = 0.05, you expect one false positive by chance alone — even if none of the effects are real. Alpha correction adjusts the threshold to control this inflation. The question is *how* to correct. This tool shows you what each method does to your per-test threshold, so you can make an informed choice. See also the [p-value adjustment setting](./settings.md#multiple-comparison-adjustment) for applying corrections to actual results.

### Input

- **Number of comparisons** — default 10
- **Family-wise alpha level** — default 0.05

### Output

After clicking **Calculate thresholds**, a table shows the adjusted p-value threshold at three ranks: the most significant p-value (p₍₁₎), the middle-ranked, and the least significant (p₍ₘ₎).

| Method | How it works |
|---|---|
| **Bonferroni** | Constant threshold: α / m. Simple but conservative. |
| **Šidák** | Slightly less conservative than Bonferroni: 1 − (1 − α)^(1/m). |
| **Holm / Hochberg / Hommel** | Step-wise methods that use different thresholds for each ranked p-value. All three share the same threshold values but differ in procedure. Hommel ≥ Hochberg ≥ Holm in statistical power. |
| **Benjamini-Hochberg (FDR)** | Controls the false discovery *rate* rather than the family-wise error rate — more permissive, better for exploratory work. |
| **Benjamini-Yekutieli (BY)** | Conservative FDR control that makes no assumptions about test dependence. |

> **Reading the table:** sequential methods (Holm, Hochberg, BH) compare each p-value to a *different* threshold depending on its rank. The table shows what those thresholds look like at three positions. The most significant p-value has the strictest threshold; the least significant has the most lenient.

## Reliability & attenuation planner

Two sub-tools for planning around measurement reliability.

### Correlation attenuation

Shows how measurement unreliability weakens observed correlations.

**Inputs:**

- **True/expected correlation** — the correlation you expect between the constructs (default 0.50)
- **Reliability of measure X** — Cronbach's alpha or omega (default 0.80)
- **Reliability of measure Y** — (default 0.80)

**Output:** the expected observed (attenuated) correlation, the attenuation factor, and a plain-language explanation.

> **Why this matters for planning:** if your measures have reliability of 0.70 each, a true correlation of r = 0.50 will appear as roughly r = 0.35 in your data. That means you need a *larger* sample to detect it — your power analysis should use the attenuated correlation, not the true one. This tool helps you see the gap.

### Scale length planning (Spearman-Brown)

Estimates how adding or removing items changes a scale's [reliability](./reliability-analysis.md).

**Inputs:**

- **Current reliability** — default 0.70
- **Current number of items** — default 10
- **Target reliability** — default 0.80

**Output:** the required number of items, whether items need to be added or removed (and how many), and a table showing projected reliability at several scale lengths (half, current, 1.5×, 2×, and the target). The target row is highlighted.

> **Diminishing returns:** doubling the items on a 10-item scale with alpha = 0.70 gets you to about 0.82 — nice improvement. But going from 20 to 40 items only gets you from 0.82 to 0.90. Each additional item contributes less. At some point, a longer questionnaire causes respondent fatigue, which *hurts* data quality. Find the sweet spot.

## Precision planning (CI width)

Determines sample size based on how *precise* an estimate needs to be, rather than hypothesis-testing power. Use this when your goal is "estimate the mean within ±2 points" rather than "detect a significant difference."

> **Power vs. precision:** power analysis asks "can I detect an effect?" Precision planning asks "can I estimate a value accurately?" They answer different questions and can give different sample sizes. If your study is descriptive (prevalence, mean scores, correlation strength), precision planning is the more relevant tool.

### Input

- **Estimate type** — Mean (default), Proportion, or Correlation
  - Mean: enter expected SD (default 1.0, from pilot data or literature)
  - Proportion: enter expected proportion (default 0.50 — the most conservative choice, giving maximum variance)
  - Correlation: enter expected correlation (default 0.30)
- **Confidence level** — 90%, 95% (default), or 99%
- **Desired margin of error** — half-width of the confidence interval (default 0.50)

### Output

After clicking **Calculate sample size**:

- The required sample size
- A statement of the resulting CI properties
- A table showing required N at six margin values (0.5×, 0.75×, 1×, 1.25×, 1.5×, and 2× the entered margin). The entered value is highlighted.

> **Why the table matters:** halving the margin of error roughly quadruples the required sample size. The table makes this trade-off visible — you might decide that ±0.75 is precise enough when ±0.50 would need four times as many participants.

## Group allocation optimizer

Explores how unequal group sizes affect power for a two-group comparison.

### Input

- **Group sizes (n1, n2)** — both default to 50
- **Effect size (Cohen's d)** — default 0.50
- **Significance level (alpha)** — default 0.05

### Output

After clicking **Calculate power**:

- Achieved power for the entered allocation
- Total N and the n1/n2 breakdown
- If groups are equal: a note confirming equal allocation maximizes power
- If groups are unequal: the power loss compared to equal allocation, shown as a percentage

A **Power by allocation ratio** table compares standard ratios (1:1, 1:2, 2:1, 1:3, 3:1, 2:3, 3:2) all derived from the same total N. The equal-allocation row is highlighted in green; the current allocation in blue. Rows are sorted by power.

> **When unequal allocation makes sense:** equal groups always maximize statistical power, but practical constraints often make that impossible. In clinical trials, recruiting patients with a rare condition is harder than recruiting healthy controls. In educational research, intact classrooms have fixed sizes. This tool shows exactly how much power you lose — often less than you'd think. A 2:1 ratio with N = 90 (60 vs. 30) typically loses only 1–3% power compared to 45 vs. 45.

## Reporting checklist

Power analysis and study planning parameters belong in the **Method** section of your paper, ideally under a "Sample size determination" or "Power analysis" subheading.

**For power analysis, report:**
- The statistical test you planned for (e.g. independent samples t-test)
- Target power (e.g. 0.80)
- Significance level (e.g. 0.05, one-tailed or two-tailed)
- Expected effect size and its source (prior research, meta-analysis, pilot study — not "Cohen's medium" without justification)
- The resulting required sample size
- Whether you accounted for attrition (e.g. "we aimed for N = 80 to account for 20% expected dropout")

**For alpha correction, report:**
- The correction method chosen and why (e.g. "Benjamini-Hochberg to control false discovery rate at 5%")
- The number of comparisons in the family

**For precision planning, report:**
- The target margin of error and confidence level
- Expected variability (SD, proportion, or correlation) and its source

> **"We used Cohen's medium effect size"** is not a justification. Reviewers increasingly expect a substantive rationale — what effect size is meaningful in your context? Use prior literature, meta-analyses, or the [effect size converter](#effect-size-converter) to translate between metrics. If no prior data exists, be transparent about that and report a sensitivity analysis showing power across a range of plausible effect sizes.

## Reproducibility

Power calculations use the `pwr` R package. The R code is printed to the [R console](./r-console.md) for each calculation. Please make sure to include the citation in your paper's references:
>Champely S (2023). *pwr: Basic Functions for Power Analysis.* R package version 1.3-0, https://doi.org/10.32614/CRAN.package.pwr.
