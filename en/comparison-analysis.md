---
title: Comparison analysis
description: Compare groups and conditions using t-tests, ANOVA, Mann-Whitney, chi-square, mixed models, and more in DataSuite 2.
---

# Comparison analysis

The **Comparison analysis** module tests whether groups or conditions differ on one or more variables. It supports independent samples (separate groups), dependent samples (repeated measures on the same subjects), mixed designs that combine both, and a one-sample mode that compares a single variable against a fixed reference value.

> **What does "comparing groups" mean statistically?** You're asking whether the differences you see in your sample (e.g. the treatment group scored 5 points higher) are large enough to be unlikely due to chance alone. A significant result means the difference is probably real in the population, not just a quirk of your particular sample.

1. Choose an [analysis type](#analysis-types) (independent, dependent, or mixed)
2. [Assign variable roles](#variable-roles) (grouping, conditions, subject ID)
3. Pick a [statistical test](#choosing-a-test)
4. Configure [options](#configuration) (effect sizes, post-hoc, summary stats)
5. Optionally [check assumptions](#checking-assumptions), then click **Run comparison analysis**

## Analysis types

Choose a design that matches how your data was collected:

| Design | Use when | Example |
|---|---|---|
| **Independent samples** | Groups are separate, unrelated people | Treatment vs. control, men vs. women |
| **Dependent samples** | Same people measured under different conditions | Pre-test vs. post-test, three time points |
| **Mixed model** | Both between-group and within-subject factors | Treatment vs. control, each measured at pre and post |
| **One sample** | A single variable compared to a fixed reference value (μ₀) | Test scores vs. a 70-point pass mark, measurement bias vs. a calibration target |

> **Why does the design matter?** Independent and dependent designs use fundamentally different math. Dependent samples tests are more powerful because they account for individual differences — if person A always scores higher than person B, the test factors that out and focuses on whether the *conditions* caused a change. Using an independent test on paired data throws away this advantage; using a dependent test on truly independent groups produces nonsense.

> **Long format required:** comparison analysis expects one observation per row. If your data has conditions in separate columns (wide format), use the **Convert wide to long format** button that appears in the interface — it opens the [column stacker](./data-transformation.md) tool.

## Setting up

### Variable roles

Variables are assigned roles in the left panel:

- **Grouping variables** — define between-subjects groups (independent and mixed designs). Click to select which variables split your data into groups.
- **Condition variables** — define within-subjects conditions (dependent and mixed designs)
- **Subject ID** — identifies individual subjects so their measurements can be matched across conditions. Required for dependent and mixed designs, optional for independent. If a "Subject ID" column exists (e.g. from the column stacker), it is auto-selected.
- **Covariates** — continuous control variables, visible when the selected test supports them (ANCOVA, MANCOVA, mixed ANOVA, repeated measures ANOVA). When covariates are added to a repeated measures ANOVA the analysis is fitted on the multivariate-model machinery that admits them, but presented in the usual univariate form (single F per effect, partial η², covariate effects from the same fit).

> **What is a covariate?** A variable you want to "control for" — meaning you suspect it influences the outcome but it's not what you're studying. For example, if you're comparing test scores across teaching methods, students' prior GPA might affect the results. Adding GPA as a covariate statistically removes its influence, so the remaining group difference is more likely due to the teaching method itself.

Any variables not assigned to these roles are automatically treated as **dependent variables** — the outcomes you're comparing across groups.

> **One-sample mode** has no grouping, condition, or subject roles — every selected numeric variable is a dependent variable tested against the reference value. A **Reference value (μ₀)** field appears: enter one value that applies to all selected variables, or tick **Set per variable** to give each variable its own μ₀ (the per-variable list is pre-filled with the shared value).

### Groups preview

For independent samples, a live preview shows:

- Number of groups and their sample sizes
- Warnings for very small groups (fewer than 3 observations)
- Number of possible pairwise comparisons
- Warnings if a numeric variable with many unique values is used as a grouping variable (it might be continuous rather than categorical)

### Multiple grouping variables

When you select two or more grouping variables in independent mode, two strategies are available:

- **Batch** — runs a separate analysis for each grouping variable. P-values are adjusted globally across all tests.
- **Factorial** — crosses all grouping variables into combined subgroups (e.g. Gender × Treatment) and analyzes them as a single factor. Limited to 10,000 combinations.

> **Batch vs. factorial:** use batch when your grouping variables are independent questions ("does gender matter? does treatment matter?"). Use factorial when you care about interactions ("does the treatment effect differ by gender?").

## Choosing a test

The test dropdown automatically shows only tests appropriate for your design and variable types.

### Independent samples — numeric

| Test | When to use |
|---|---|
| **Independent samples t-test** | Two groups, equal variances assumed |
| **Welch's t-test** | Two groups, unequal variances (safer default) |
| **Mann-Whitney U test** | Two groups, non-parametric alternative |
| **Brunner-Munzel test** | Two groups, non-parametric — like Mann-Whitney but valid when the groups have different spreads/shapes |
| **One-way ANOVA** | Three or more groups, parametric, equal variances assumed |
| **Welch's one-way ANOVA** | Three or more groups, parametric, unequal variances (the k-group analogue of Welch's t-test) |
| **Kruskal-Wallis test** | Three or more groups, non-parametric |
| **Kolmogorov-Smirnov test** | Two groups — do the whole distributions differ (anywhere, not just location)? Auto-expands to pairwise for three or more. |
| **Anderson-Darling k-sample test** | Omnibus version of the above; tests distribution equality across two or more groups at once, more sensitive in the tails |
| **Mutual information test** | Non-parametric omnibus; detects any distributional difference (location, scale, shape). Two or more groups. |
| **Jensen-Shannon divergence test** | Non-parametric distance between group distributions. Two groups; auto-expands to a pairwise matrix for three or more. |
| **Factorial ANOVA** | Two or more grouping variables analyzed together |
| **ANCOVA** | Groups with continuous covariates to control for |
| **MANOVA** | Multiple dependent variables simultaneously |
| **MANCOVA** | Multiple dependent variables with covariates |

> **Information-theoretic tests.** Mutual information and Jensen-Shannon divergence measure how much knowing the group label tells you about the outcome — in **bits** (log₂). Unlike t-tests and rank tests, they react to *any* change in the distribution, not just a shift in the mean or median. P-values are computed by shuffling group labels (permutation), so they respond to the **Bootstrap replications** setting: more replications = tighter p-values, longer runtime. These tests have no matching effect size column — the statistic itself is a bounded magnitude. Not offered for paired or mixed designs, where "did Y shift within subject?" has no clean information-theoretic answer.

> **Why MANOVA instead of separate ANOVAs?** Running a separate ANOVA for each dependent variable inflates false positives (more tests = more chances for a fluke). MANOVA tests all DVs together in one shot, keeping the false positive rate under control. It can also detect group differences that only show up in the *combination* of variables — for example, groups might not differ on anxiety or depression alone, but the joint pattern of both could be significantly different.

> **Welch's ANOVA when variances differ.** Just as Welch's t-test is the safer choice for two groups, Welch's one-way ANOVA is the robust omnibus for three or more: it doesn't assume equal group variances. When [Levene's test](#checking-assumptions) flags unequal variances in a multi-group design, one-way ANOVA is demoted and Welch's ANOVA stays recommended as the parametric alternative. Its post-hoc is the **Games-Howell** test (see [post-hoc tests](#post-hoc-tests)). Effect sizes (η², ω², ε²) aren't offered — they assume the equal variances Welch drops.

> **Brunner-Munzel vs. Mann-Whitney.** Mann-Whitney's familiar "the groups differ in location" reading quietly assumes the two distributions have the *same shape* — only shifted. When the spreads or shapes differ, that interpretation breaks down. The Brunner-Munzel test makes no such assumption: it estimates p̂ = P(a random value from group 1 is smaller than one from group 2) and tests whether it equals ½, staying valid under unequal variances. So when [Levene's test](#checking-assumptions) flags unequal variances in a two-group design, Mann-Whitney keeps a caveat steering you here. Its effect sizes are the **common-language ES** (p̂ itself) and **Cliff's δ**.

> **Distribution-equality tests (KS and Anderson-Darling).** Most tests above ask about a *single* feature — the mean, the median, the location. The **Kolmogorov-Smirnov** test instead asks the broad question: *do the two distributions differ at all?* Its statistic **D** is the largest gap between the two groups' cumulative distribution curves, so it picks up differences in spread, skew, or shape that a location test would miss. **Anderson-Darling** is the omnibus k-sample counterpart — it tests all groups in one shot and weights the tails more heavily, making it the more sensitive choice when differences live in the extremes. Use KS for a focused two-group comparison (it auto-expands to a pairwise table for three or more), and Anderson-Darling when you want a single all-groups verdict. Neither has a separate effect-size column — D (and the standardized AD statistic) is its own magnitude.

### Independent samples — variance

These tests ask a different question from every test above: not *"do the groups differ in location?"* but *"do the groups differ in spread?"* The hypothesis is on the variance itself.

| Test | When to use |
|---|---|
| **F-test for equality of variances** | Two groups — is one more variable than the other? Parametric (assumes normality). Auto-expands to pairwise for three or more. |
| **Bartlett's test** | Three or more groups, parametric — sensitive to non-normality. |
| **Fligner-Killeen test** | Three or more groups, rank-based — robust to non-normality; the safe default when the data isn't normal. |

> **When is spread the question?** Usually you compare means. But sometimes *consistency* is what matters: two teaching methods might reach the same average score while one produces far more variable outcomes, or a process change might leave the mean on target while tightening (or loosening) tolerances. These tests target that directly. The **F-test** handles two groups and reports the **variance ratio** s₁²/s₂² as its effect size (1 = equal spread) with a confidence interval; **Bartlett's** and **Fligner-Killeen** are the omnibus k-group versions. All three are two-sided.

> **Normality matters here — pick accordingly.** Bartlett's test and the F-test assume each group is normal, and unlike the t-test and ANOVA they stay sensitive to that assumption even at large samples (there's no central-limit rescue). The **Fligner-Killeen** test works on ranks and is robust to non-normality, so it's the dependable choice when normality is in doubt. When [assumption checks](#checking-assumptions) flag non-normality, the F-test and Bartlett's are demoted and Fligner-Killeen stays recommended — the dispersion-family analogue of the location tests' parametric-to-non-parametric fallback.

> **These are not Levene's test.** Levene's test (median-centered Brown-Forsythe) runs automatically as an *assumption check* for the location tests — the gatekeeper that decides whether the equal-variance t-test or ANOVA is safe (see [checking assumptions](#checking-assumptions)). The tests here make unequal variance the *hypothesis you're testing*, reported with a p-value and (for the F-test) an effect size — not a pre-flight check on some other test.

### Dependent samples — numeric

| Test | When to use |
|---|---|
| **Paired samples t-test** | Two conditions, parametric |
| **Wilcoxon signed-rank test** | Two conditions, non-parametric |
| **Repeated measures ANOVA** | Three or more conditions, parametric |
| **Friedman test** | Three or more conditions, non-parametric |
| **Repeated measures MANOVA** | Multiple DVs across conditions |

### One sample — numeric

Each test compares one variable's location to the reference value μ₀:

| Test | When to use |
|---|---|
| **One-sample t-test** | Mean vs. μ₀, roughly normal data. Effect size: Cohen's d / Hedges' g, (mean − μ₀) / SD |
| **One-sample Wilcoxon signed-rank test** | Pseudo-median vs. μ₀, non-parametric. Effect size: rank-biserial r / Wilcoxon r |
| **Sign test** | Median vs. μ₀, most robust — counts only how many observations fall above μ₀ (ties at μ₀ are dropped; the number dropped is reported below the table). The test statistic is shown as the count above μ₀ out of the effective n (ties excluded). Effect size: proportion above μ₀ |

> **Which one-sample test?** The t-test has the most power when the data is roughly normal. The Wilcoxon signed-rank test is the non-parametric fallback and uses the ranked magnitudes of the deviations from μ₀. The sign test is the most robust — it ignores magnitude entirely and only asks whether values land above or below μ₀ — which makes it valid for ordinal data or heavy outliers but lower in power. The confidence interval reported for the t-test and Wilcoxon is for the estimated location itself (the mean or pseudo-median), not a between-condition difference. The reference value μ₀ each variable was tested against is shown as a column in the results table — handy when **Set per variable** gives each variable its own μ₀. [Assumption checks](#checking-assumptions) test the variable's normality and steer you to the t-test (normal) or the rank-based tests (not normal).

> **Equivalence / non-inferiority directions are not available in one-sample mode yet** — only standard two-tailed and one-tailed directions.

### Independent samples — categorical

| Test | When to use |
|---|---|
| **Chi-square test of independence** | Association between categorical variables |
| **Fisher's exact test** | 2×2 tables, especially with small samples |

### Dependent samples — categorical

| Test | When to use |
|---|---|
| **McNemar's test** | Two conditions, binary outcomes |
| **Stuart-Maxwell test** | Two conditions, 3+ category outcomes |
| **Cochran's Q test** | Three or more conditions, binary outcomes |

> **Continuity correction.** The chi-square test of independence, McNemar's test, and the Mann-Whitney U test all support a [continuity correction](#continuity-correction), **on by default** to match R and SPSS. See the configuration section for what it does and when to turn it off.

> **Duplicate (subject, condition) rows in paired data.** Paired and repeated-measures tests assume one observation per subject per condition. If your data has duplicates, the reshape step silently keeps the first row per pair and the test runs on a subset — but the module surfaces a warning toast listing how many subjects were affected, so you can fix the data and re-run.

### Mixed model

| Test | When to use |
|---|---|
| **Mixed ANOVA** | Between + within factors, single DV, parametric |
| **ART-ANOVA (Aligned Rank Transform)** | Between + within factors, single DV, non-parametric |
| **Mixed MANOVA** | Between + within factors, multiple DVs |

> **Any number of factors.** All three mixed tests take *any* number of grouping (between-subjects) variables and *any* number of condition (within-subjects) variables — they're not limited to one of each. Every main effect and every interaction across the full crossing is reported. Mixed ANOVA and ART-ANOVA also accept multiple dependent variables (analyzed one at a time); Mixed MANOVA models the dependent variables jointly.

> **When ART-ANOVA?** ART-ANOVA is the non-parametric fallback for a mixed design — reach for it when residuals are non-normal and Mixed ANOVA's assumptions don't hold. It aligns and ranks the data so that ordinary factorial inference can be run on the ranks, which (unlike a plain rank transform) keeps main effects and interactions separable. It is **strictly factorial**: it reports F tests and partial η² for every effect but does **not** support covariates or post-hoc comparisons (see [ART-ANOVA results](#art-anova)).

> **Parametric vs. non-parametric:** parametric tests (t-test, ANOVA) assume your data is roughly normally distributed and have more statistical power — they're better at detecting real differences. Non-parametric tests (Mann-Whitney, Kruskal-Wallis) make fewer assumptions and are safer when your data is skewed or has outliers, but they need larger samples to detect the same effects. Use [assumption checks](#checking-assumptions) to help decide.

> **Two-sample tests with more than two groups:** if you select a two-sample test (e.g. t-test) but have more than two groups, the module automatically runs all pairwise comparisons. Each pair is tested directly — no separate omnibus test is required first — and the resulting p-values enter the run-wide [p-value adjustment](#p-value-adjustment).

> **Which error term each pair uses.** Whether the pairs share a single spread estimate follows the variance assumption your chosen test already makes:
> - **Independent (Student's) t-test** — pools the within-group spread across *all* groups (the ANOVA error term, with N − k degrees of freedom), so each pair borrows strength from the full sample. This is the standard pooled-SD pairwise family — equivalent to R's `pairwise.t.test(pool.sd = TRUE)`, a Fisher's LSD contrast — and is more powerful than testing each pair in isolation. It's valid precisely because the Student t-test already assumes equal variances across groups.
> - **Welch's t-test** — keeps a separate-variance error term for each pair (the **Games-Howell** approach), the correct choice when group variances differ.
> - **Mann-Whitney U, paired t-test, Wilcoxon signed-rank** — each pair is tested on its own data, matching R's `pairwise.wilcox.test` / `pairwise.t.test(paired = TRUE)`.

## Configuration

### Test direction

For two-sample tests (t-tests, Mann-Whitney, Wilcoxon) and one-sample tests, the **Test direction** dropdown offers two groups of options. Hidden for multi-group tests. The Equivalence group is hidden in one-sample mode.

**Standard:**

- **Two-tailed** (default) — tests whether the groups differ in either direction
- **One-tailed: Group 1 > Group 2** — tests a specific directional hypothesis
- **One-tailed: Group 1 < Group 2**

> **When to use one-tailed tests:** only when you have a strong prior reason to expect a specific direction *before* looking at the data. One-tailed tests are more powerful for detecting the predicted direction but completely miss effects in the opposite direction. When in doubt, use two-tailed.

**Equivalence:**

- **Equivalence (TOST)** — tests whether the difference falls *within* ±Δ (i.e. the groups are practically equivalent)
- **Non-inferiority** — tests whether Group 1 is not worse than Group 2 by more than Δ
- **Superiority** — tests whether Group 1 exceeds Group 2 by at least Δ
- **Minimal effect (MET)** — tests whether the difference is at least Δ (confirms a meaningful effect exists)

When you select any equivalence option, an **Equivalence bound (Δ)** input appears. You specify the bound as either:

- **Raw** — in the same units as your dependent variable
- **Standardized (Cohen's d)** — automatically converted to raw units using the standardizer that matches the chosen test: pooled SD for the classical independent t-test, the average-variance denominator √[(s₁² + s₂²) / 2] for Welch's t-test (Welch's d), and the standard deviation of differences for paired tests.

> **What is equivalence testing?** A standard test asks "are these groups different?" A non-significant result does *not* mean they're the same — you simply failed to detect a difference. Equivalence testing flips the question: "are these groups similar *enough*?" It uses Two One-Sided Tests (TOST) to demonstrate that the difference falls within a pre-specified bound Δ. A significant TOST result is positive evidence of equivalence, not just absence of evidence.

> **Choosing Δ:** the equivalence bound should reflect the smallest difference that would be practically meaningful in your domain. For example, if a 3-point difference on a 100-point scale is negligible in your field, set Δ = 3 (raw) or estimate the standardized equivalent. A bound that's too wide makes equivalence easy to establish but unimpressive; a bound that's too narrow requires very large samples.

> **Non-inferiority and superiority** are one-sided variants of equivalence testing commonly used in clinical trials. Non-inferiority asks "is the new treatment not meaningfully *worse* than the standard?" — useful when a cheaper or safer alternative is acceptable if it isn't worse by more than Δ. Superiority asks "is the new treatment meaningfully *better* by at least Δ?" — a stronger claim than ordinary significance.

> **Minimal effect testing (MET)** is the opposite of equivalence testing. Where TOST tries to show the difference is *small enough*, MET tries to show the difference is *big enough* — that it exceeds a meaningful threshold Δ. This is useful when you want to confirm not just that an effect exists (p < .05) but that it's large enough to matter practically.

### Post-hoc tests

Available for multi-group tests (ANOVA, Welch's ANOVA, Kruskal-Wallis, repeated measures ANOVA, Friedman, factorial ANOVA, mixed ANOVA, ANCOVA). Check **Include post-hoc tests** and select a method:

- **Tukey HSD** — for ANOVA-family tests
- **Pairwise t-tests (pooled error, p-adjusted)** — for ANOVA-family tests
- **Games-Howell** — for Welch's ANOVA: pairwise separate-variance t-tests with a studentized-range reference, so it stays valid under unequal variances and controls the family-wise error internally (no separate adjustment, like Tukey)
- **Dunn's test** — for Kruskal-Wallis
- **Conover's test** — for Friedman: t-distributed pairwise comparisons, more powerful than Nemenyi, with your configured p-adjustment applied
- **Nemenyi test** — for Friedman: studentized-range reference, controlling the family-wise error internally (no separate adjustment)

For tests that use [emmeans](#reproducibility) (factorial ANOVA, mixed ANOVA, ANCOVA), the **Tukey HSD** option selects Tukey's adjustment for single-factor pairs and the **Pairwise t-tests** option selects whichever method is configured under [multiple comparison adjustment](./settings.md#multiple-comparison-adjustment) (Bonferroni / Holm / Hommel / Hochberg / FDR / none). For interaction cell-pairs, where Tukey isn't well-defined, the configured adjustment method is used directly.

> **Why post-hoc tests?** An overall ANOVA tells you *something* differs among the groups, but not *which* groups differ from which. Post-hoc tests make all pairwise comparisons while adjusting for the fact that you're running many tests at once.

### Pairwise comparison format

When pairwise comparisons are produced (from post-hoc tests or automatic expansion):

- **Matrix format** — symmetric matrix with groups on both axes; each cell shows statistic, p-value, and optionally effect size and CI
- **Long format** — flat table with one row per comparison pair

### Continuity correction

The **Apply continuity correction** checkbox appears once you select the **chi-square test of independence**, **McNemar's test**, the **Mann-Whitney U test**, or the **Stuart-Maxwell test**. It is **checked by default**, so p-values match R's and SPSS's defaults out of the box.

- For **chi-square**, this is the **Yates correction** — R applies it only to 2×2 tables — which shifts the p-value upward (more conservative).
- For **McNemar**, the correction applies only when the discordant count b + c ≥ 25. Below that, McNemar **automatically switches to the exact binomial test** on the discordant pairs (where no correction is needed), so the checkbox has no effect there. This mirrors how Mann-Whitney auto-selects its exact test.
- For **Mann-Whitney**, it's the ±0.5 correction on the normal approximation, which only takes effect when the exact test isn't used (large samples or tied values).
- For **Stuart-Maxwell**, the setting only affects the **2×2 case** (where the test reduces to McNemar, including the same auto-exact behavior); it has no effect on larger k×k tables.

> **When to turn it off.** The Yates correction is widely regarded as over-conservative for 2×2 tables once any cell count — or, for McNemar, the discordant count b + c — is at least 25; unchecking the box reproduces the uncorrected statistic. You don't need to do anything special for small samples: McNemar uses the exact binomial test automatically when b + c < 25, and for sparse independent 2×2 cross-tabs you can switch to [Fisher's exact test](#independent-samples--categorical).

### Effect sizes

Check **Include effect sizes** and select a measure from the dropdown. Available measures update based on the selected test (e.g. Cohen's d, Hedges' g, Glass' Δ, or Welch's d for t-tests; η², ω², ε², or partial η² for ANOVA; partial η² for ART-ANOVA; rank-biserial or Wilcoxon r for Mann-Whitney / Wilcoxon; common-language ES or Cliff's δ for Brunner-Munzel; ε² or η²_H for Kruskal-Wallis; Kendall's W for Friedman; Cramér's V for chi-square; φ or odds ratio for McNemar; odds ratio for Fisher's exact; Cohen's g for Stuart-Maxwell; Cohen's w (Q) or Cochran's average φ² for Cochran's Q; variance ratio for the F-test of equality of variances).

Additional options:

- **Confidence intervals** for the effect size — for the rank and categorical measures (Wilcoxon r, the matched-pairs rank-biserial, Kruskal-Wallis ε²/η²_H, Friedman's W, Cohen's g, Cochran's φ̄²) these are bootstrap intervals, so enabling this option adds runtime that scales with the [**Bootstrap replications**](./settings.md) setting. They are skipped entirely when this option is off.
- **Standard errors** for the effect size

> **What is an effect size?** A p-value tells you whether an effect exists; an effect size tells you how *big* it is. A tiny difference can be statistically significant with a large enough sample, while a meaningful difference can be non-significant with too few participants. Common benchmarks: Cohen's d of 0.2 = small, 0.5 = medium, 0.8 = large — but what counts as "meaningful" depends on your field.

> **How CIs are computed.** The interval method matches the effect-size family. The d-family splits by standardizer: **Cohen's d** and **Hedges' g** (pooled SD) use **exact non-central t inversion** (Steiger & Fouladi 1997; Cumming 2012), giving an asymmetric, data-bounded interval — d and g estimate the same population effect, so they share the interval and only the point estimate shifts with the bias correction. In pooled-SD pairwise comparisons (the Student pairwise family) the standardizer is the across-all-groups √MSE with N − k degrees of freedom — the same error term the pooled pairwise t-test uses — so d, its interval, and the test statistic share one standardizer and df. **Glass' Δ** and **Welch's d** keep analytic Wald CIs on the t-distribution, because their non-pooled standardizers (one group's SD; the average-variance denominator) don't admit a clean non-central t. Pearson r and point-biserial use the Fisher-z back-transform. Rank-based correlation effects use distribution-appropriate methods rather than Fisher-z (which is calibrated for the bivariate normal): independent **rank-biserial r** and **Cliff's δ** (the same statistic) use Cliff's (1996) distribution-specific variance with Cliff's asymmetric interval, which stays within (−1, 1) by construction rather than being truncated at the bounds; the **paired** matched-pairs rank-biserial and the **one-sample** signed-rank rank-biserial r both use a bootstrap percentile CI like Wilcoxon r — staying within [−1, 1] by construction and capturing the tie structure directly, rather than a Wald interval whose analytic variance misfires on this discrete lattice statistic; **Wilcoxon r** likewise uses a bootstrap percentile CI (using the [**Bootstrap replications**](./settings.md) setting) — the r = Z/√n construction has no clean closed-form variance, and the bootstrap captures the test's tie and continuity corrections directly. Bootstrap-derived intervals are marked with a superscript "b" in the results table so they aren't mistaken for analytic CIs. **Common-language ES** uses Hanley-McNeil concordance variance (Q1, Q2 components) with a delta-method SE on the logit scale, accounting for the dependence among the n1·n2 pairwise comparisons that the naive binomial form ignores. Parametric variance-family effects (η², ω², partial η², ε² for t-tests and the ANOVA family — one-way, factorial, repeated-measures, mixed, and ANCOVA) use **non-central F inversion** (Steiger 2004), so the interval is asymmetric and bounded in [0, 1] — matching standard references like `MBESS::ci.pvaf`. For repeated-measures designs the reported η² is the classical whole-model proportion (denominator spanning the subject stratum) and is given as a **point estimate only** — classical RM η² has no principled confidence interval, because the subject stratum its denominator spans isn't bounded by the within-effect non-central F. The interval lives instead on partial η²ₚ and ω²ₚ (the bias-corrected partial omega-squared, Olejnik & Algina 2003), which stay partial and carry the non-central F bound. χ²-derived effects — Cramér's V, φ, and Cohen's w (Q) — use **non-central χ² inversion** (Smithson 2003), again giving asymmetric intervals; V and φ are capped at 1, w is unbounded. Odds ratios use the exact CI from `fisher.test` for Fisher's exact, and a Wald-on-log CI for McNemar (see Haldane-Anscombe note below). **Cohen's g** (Stuart-Maxwell) and **Cochran's average φ²** (Cochran's Q) use **bootstrap percentile CIs** — resampling matched pairs and subjects respectively, recomputing the statistic each replication — because the sampling distributions of these marginal-homogeneity / per-df statistics have no closed-form inversion suitable for the small-table cases these tests target. The **variance ratio** (F-test of equality of variances) reports the ratio s₁²/s₂² with R's `var.test` interval — exact, derived from the F distribution — and carries no small/medium/large label, since there's no canonical benchmark for a variance ratio (1 means equal spread).
>
> **Standard errors** are reported for every effect that has a meaningful closed-form SE — the d-family, Cliff's δ, and common-language ES — even where the displayed interval uses a more accurate asymmetric method (non-central t for Cohen's d and Hedges' g; Cliff's interval for the dominance measures; the logit delta-method for common-language ES). They are omitted for the variance-family (η², ω², ε², partial η²) and χ²-family effects and for any bootstrap CI, where no symmetric SE exists on the effect's scale to begin with.
>
> **Glass' Δ reports both Δ₁ and Δ₂.** Glass' Δ standardizes the mean difference using *one* group's SD rather than a pooled estimate — this is the right choice when group variances differ (the case Cohen's d's pooling assumption breaks). Conventionally the control group's SD is used as the standardizer, but the module has no UI control-group selector. So both versions are reported: **Δ₁** divides by the SD of group 1, **Δ₂** by the SD of group 2. Under equal variances they coincide; the larger the SD ratio, the more they diverge — and they diverge in opposite directions, so reporting both keeps the reader honest about which standardizer is being read. When **Interpretation** is enabled, both Δ₁ and Δ₂ get their own small/medium/large label — Cohen's d benchmarks apply to each, since both are standardized effects on the same scale.
>
> **Welch's t-test omits the pooled-SD effect sizes.** Because Welch drops the equal-variance assumption, its effect-size menu offers only the variance-appropriate measures — **Welch's d** (the average-variance standardizer), **Glass' Δ**, and **point-biserial r** — not the pooled-SD Cohen's d or Hedges' g. Pooling the SDs for the effect size would contradict the very assumption that sent you to Welch in the first place.
>
> **Cochran's average φ² (φ̄²)** = Q / (N · (k − 1)), where N is the number of subjects and k the number of conditions. It is the **per-df form of Cohen's w²** for the Q statistic, bounded in [0, 1] and read as the fraction of maximum possible heterogeneity across conditions: 0 means proportions are identical across conditions, 1 is the theoretical maximum (every subject responding identically within a condition but differently across conditions). No canonical Cohen-style threshold table exists for φ̄² — the module borrows the variance-family cutoffs (0.01 = small, 0.06 = medium, 0.14 = large), which are calibrated for η²/ω² and are a reasonable analogy because φ̄² is also a bounded variance-explained-like ratio. Treat the interpretation column as a heuristic; the **Cohen's w (Q)** alternative effect size sits on Cohen's original 0.10 / 0.30 / 0.50 scale if you prefer to anchor in his published thresholds. If you report φ̄², always include Q, N, and k alongside it — the same φ̄² value carries different meaning at k = 3 vs k = 8.
>
> **McNemar odds ratio with empty discordant cells.** When either off-diagonal cell of the paired 2×2 (b or c) is zero, the raw OR is undefined. The Haldane-Anscombe continuity correction (+0.5 to b and c) is applied **only in that edge case**, so the OR and its Wald-on-log CI remain finite. The corrected estimate is marked with a `‡` superscript in the effect-size column.
>
> **Rank-based variance effects** — Kruskal-Wallis ε² and η²_H, Friedman's W — use **bootstrap percentile CIs**. These statistics have no analytic non-central sampling distribution to invert, and analytic Wald approximations on bounded rank statistics give poor coverage, so the interval is resampled instead: Kruskal-Wallis resamples observations within each group (group sizes held fixed), Friedman resamples subjects (blocks), recomputing the statistic on each replication. Like the other bootstrap intervals they honor the [**Bootstrap replications**](./settings.md) setting, are seeded by [**Bootstrap seed**](./settings.md#bootstrap-seed) for reproducibility, and are marked with a superscript "b".

### Classification (ROC) analysis

For two-group **independent** numeric tests (independent t-test, Welch's t-test, Mann-Whitney U, Jensen-Shannon divergence), check **Include classification (ROC) analysis** to compute the area under the ROC curve and related classification metrics alongside the inferential test. The option appears once you've selected an eligible test.

> **What ROC analysis adds.** A t-test or Mann-Whitney asks *"do the groups differ?"* — ROC asks the dual question: *"how well does this score discriminate between the groups?"* The two are mathematically linked (the AUC equals the Mann-Whitney U statistic normalized to [0, 1]), but ROC adds a practical layer: an optimal cutoff above which you'd classify someone as belonging to the higher-scoring group, plus sensitivity, specificity, and predictive values at that cutoff.

For three or more groups, ROC is computed for each pairwise contrast, matching how the inferential test handles multi-group data.

**Optimal threshold rule** — how the cutoff is chosen:

- **Youden's J** (default) — maximizes sensitivity + specificity − 1; equal weight on both error types.
- **Closest to (0, 1)** — the point on the curve nearest the top-left corner (perfect classifier).
- **Cost-weighted** — asymmetric costs. Set the **Cost asymmetry ratio** k > 1 if one error is k times worse than the other. Both directions (whichever group is worse to misclassify) are reported as separate rows so you can pick the relevant one.

> **Pick the rule before looking at the data.** Same logic as the equivalence bound: choosing the rule that produces the threshold you wanted to see undermines the analysis.

**AUC confidence interval:**

- **DeLong** (default) — closed-form, fast, recommended for n ≥ 30 per group.
- **Bootstrap** — resampling-based; more robust at small samples. Uses the global bootstrap replication count from [settings](./settings.md); slower.

**Compare AUCs (pairwise DeLong's test)** — appears when 2+ AUCs are produced (multiple dependent variables, or pairwise group expansion across 3+ groups). Tests whether AUCs differ significantly using DeLong's correlated-AUC test, which accounts for the fact that AUCs computed on the same subjects are not independent. P-values are adjusted across the family using the global [adjustment method](./settings.md#multiple-comparison-adjustment).

> **Listwise filtering across DVs.** Paired DeLong assumes every ROC curve is fitted on the same set of subjects. To preserve that assumption — and to keep N consistent across the reported AUCs — rows missing on *any* selected dependent variable (or on the grouping factor) are dropped from *all* ROC fits whenever ROC analysis runs with multiple DVs. The per-AUC **N** reflects this listwise-complete subset; it can be smaller than the per-DV N you'd get analyzing each variable in isolation, but it is identical across every reported AUC.

**Classification metrics at optimal threshold** — toggles the per-threshold columns (sensitivity, specificity, PPV, NPV, accuracy). Turn off if you only want the AUC summary.

> **Why not for paired or repeated-measures tests?** The AUC's statistical machinery assumes independent observations. In a Pre/Post design the standard CI is wrong, and the question "can this score discriminate Pre from Post within the same subject?" rarely matches what users actually want. If you need discrimination on paired data, compute difference scores against an external label (e.g. responder vs. non-responder) and run an independent ROC.

### Summary statistics

Toggle which descriptive statistics appear alongside the test results:

- **Means** (on by default) and **Medians**
- **Modes** (with frequency percentage)
- **Standard deviations** (on by default) and **Standard errors**
- **Confidence intervals** (on by default, level from [settings](./settings.md#significance-level))
- **Percentiles** (Q1, Q3, IQR)
- **Min and max**
- **Mean ranks** (relevant for rank-based tests)
- **Sample sizes**
- **Frequency tables** (for categorical tests)

### Include visualization

Check **Include visualization** to reveal a plot type selector with per-plot options. Several plot types are available, some conditionally — see [visualization](#visualization) below. Only available for numeric dependent variables. The ROC curve is enabled separately as part of [classification analysis](#classification-roc-analysis).

## Checking assumptions

Click **Check assumptions** to run a battery of tests appropriate for your design. Results appear in an "Assumption test results" output card with three sections:

### Summary table

A quick overview with each assumption, its pass/fail status, and a note. Assumptions tested depend on the design and may include:

| Assumption | Test used | When checked |
|---|---|---|
| Normality | Shapiro-Wilk | Per cell, per variable — on the within-pair differences for two-condition dependent designs, on each variable's own values in one-sample mode, or on the within-subjects model residuals (per-condition marginals without a subject ID) for repeated-measures designs with 3+ conditions |
| Symmetry | D'Agostino skewness test | One-sample and two-condition dependent designs — the assumption behind the signed-rank test |
| Multivariate normality | Mardia's test | 2+ DVs between groups; also the within-subject response vectors for repeated-measures MANOVA |
| Homogeneity of variance | Levene's test (Brown-Forsythe, median-centered) | Independent designs. For mixed designs the between-group variances are tested separately at each within-condition level (one row per variable × condition), since that — not the within-collapsed pooled variance — is what mixed ANOVA assumes |
| Sphericity | Mauchly's test | Repeated measures, 3+ conditions |
| Homogeneity of covariance matrices | Box's M test (fixed α = 0.001) | 2+ DVs. For independent groups, tested across the grouping factor; for mixed designs (Mixed MANOVA, with a subject ID) the within-subject responses are reshaped to wide form and Box's M is tested across the between-subjects cells — each between × within cell needs ≥ 5 complete subjects |
| Multicollinearity | Correlation check (absolute r > 0.90) | 2+ dependent variables |
| Covariate: regression slopes | Interaction test | Covariates present |
| Covariate: linearity | Within-group quadratic-term F-test | Covariates present |
| Covariate: independence | Group comparison | Covariates present |
| Expected frequencies | Cochran's rule (no cell with E < 1; ≤ 20% of cells with E < 5) | Categorical DVs |

> **Why symmetry, not just normality?** The Wilcoxon signed-rank test (paired and one-sample) doesn't need normal data, but it does assume the distribution of the differences — or of the values around μ₀ in one-sample mode — is **symmetric**, since it ranks the magnitudes of positive and negative deviations on a common scale. A symmetric but heavy-tailed sample fails the normality check yet is still valid for the signed-rank test, so this separate skewness test tells the two cases apart. When it flags asymmetry, the one-sample recommendation steers you to the **Sign test** (which assumes nothing about shape); for paired designs, where there is no sign-test option, it appears as a caution to read the signed-rank result carefully. It needs n ≥ 8 to run.

> **Factorial designs and the unit of analysis.** With more than one between-subjects grouping factor, the per-cell crossing of all factors is the right unit for normality, Levene, Box's M, and Mardia — not a single factor. The assumption checks build a synthetic combined factor (joining the values of all grouping variables) before running these tests. Expected-frequency checks for categorical DVs are kept on the first grouping variable, since a chi-square cross-tab is bivariate by design.

> **What to do when assumptions are violated:** don't panic — many tests are robust to mild violations, especially with larger samples. The assumption check provides specific test recommendations based on the results, telling you which tests are safe to use and which to avoid.

### Test recommendations

Based on the assumption results, the system lists:

- **Recommended tests** — those whose assumptions are met. A recommended test may carry a **caveat** in muted text when an assumption is technically flagged but non-disqualifying: if normality fails yet every group has n ≥ 30, the test stays recommended with a note that it is robust by the central limit theorem; if multivariate normality could not be checked for some or all groups (too few complete cases, or a singular covariance matrix, for a MANOVA-family test), the test is recommended with a note that the assumption is unverified; and if normality could not be assessed at all — every group too small to test, or so large the test was skipped — the test carries a note that is cautionary for small samples (no central-limit cover, so weigh an exact or non-parametric alternative) and reassuring for large ones. In most cases the test is still safe to use — the caveat just tells you what to keep an eye on.
- **Not recommended tests** — with specific reasons. These cover both violated assumptions (e.g. "Normality assumption violated", "Homogeneity of variance violated") and design fit: a test that needs exactly two groups is flagged "Requires a two-group comparison", an omnibus test (ANOVA, Kruskal-Wallis, Friedman) whose comparison factor has only one level is flagged "Requires a factor with two or more levels", a factorial test is flagged "Requires two or more grouping factors", and when you haven't specified the full model yet (e.g. no grouping selected) the affected tests read "Not assessed — specify the full model to evaluate" rather than being recommended blindly. For repeated-measures and mixed ANOVA the exact normality assumption is on the model residuals: with a subject ID the residuals are tested directly, and without one the per-condition marginals are tested as a practical proxy. When residuals are tested directly, the central-limit caveat (n ≥ 30) is judged on the number of subjects — the independent units — rather than the residual count, and the table reports that subject count. The recommendation — and the normality table itself — names whichever was used.

### Detailed results

Individual tables for each assumption test showing per-variable, per-group results with test statistics, p-values, and color-coded status (green = pass, red = fail, yellow = warning). A covariate assumption (regression slopes, linearity, independence) reads **Not assessed** in the summary when its model could not be fit for any variable, rather than defaulting to a pass.

## Reading results

Click **Run comparison analysis** to perform the test. The system validates your setup first — if something is missing (no dependent variables, no grouping variable assigned, etc.), an alert explains what's needed.

Results vary by test type. Here's what to expect for each:

> **Diagnostics.** Some tests attach a **Diagnostics** note below their results, surfacing decisions the module made on your behalf — covariates that were ignored (ART-ANOVA), subjects dropped for incomplete cells (mixed designs), and similar adjustments. It's there so nothing happens silently; read it to confirm the analysis ran on the data you expected.

### Standard tests (t-test, ANOVA, Kruskal-Wallis, etc.)

An "Overall test results" table with one row per dependent variable:

- Per-group summary statistics (depending on your [selections](#summary-statistics))
- Confidence interval of the difference (two-group tests, if CI is enabled)
- Test statistic with significance stars
- Degrees of freedom

> **Confidence interval of the difference:** this range tells you where the true population difference likely falls. For example, "CI [2.1, 8.7]" means the real difference is probably between 2.1 and 8.7. If the interval doesn't cross zero, the difference is statistically significant. Wider intervals mean more uncertainty — usually from smaller samples. This interval is always **two-sided**, even when you run a one-tailed test: it describes the magnitude and precision of the effect, while the one-tailed p-value drives the directional decision.

> **Degrees of freedom (df):** a number that reflects how much independent information went into the calculation — roughly, sample size minus the number of things being estimated. You don't need to interpret df directly; it's reported because it's needed to look up critical values and verify the test was run correctly. A t-test with 58 df means about 60 total observations were used.
- p-value (formatted per your [p-value settings](./settings.md#p-value-settings))
- Sphericity-corrected p-values (repeated measures ANOVA with 3+ conditions) — **ε (GG)** / **p (GG)** and **ε (HF)** / **p (HF)** columns, with a separate **Mauchly's test of sphericity** table below the results. The uncorrected p assumes sphericity; the corrected columns apply the epsilon to the degrees of freedom. See [Sphericity and the two corrections](#mixed-anova) for how to choose between GG and HF.
- Adjusted p-value (if [adjustment](./settings.md#multiple-comparison-adjustment) is active in addition mode)
- Equivalence p-values (when an [equivalence test direction](#test-direction) is selected) — see below
- Effect size with CI and SE (if enabled — CI and SE are shown only where the chosen measure supports them; see [effect sizes](#effect-sizes))
- Interpretation (if enabled in [settings](./settings.md#significance-formatting))

If any variables fail, an error summary groups failures by error message.

#### Equivalence test results

When an equivalence direction is selected, a note above the table shows the test type and the Δ bound (converted to raw units if you specified it as a standardized value). For parametric tests (t-tests) the standardizer is Cohen's d (pooled SD, or Welch's √[(s₁² + s₂²) / 2] when variances are unequal). For non-parametric tests (Wilcoxon signed-rank, Mann-Whitney U), Δ is interpreted on a **robust** scale — the median absolute deviation (MAD, rescaled to a normal-SD equivalent via /0.6745) of the differences for paired, or a pooled MAD for independent — so the standardizer matches the test's rank-based location parameter rather than mixing a parametric scale with a non-parametric test. In equivalence mode the omnibus test runs two-sided, so its standard p-value column is labeled **p (two-sided)** to set it apart from the equivalence decision. Additional columns appear after it:

- **p (lower)** and **p (upper)** — the two one-sided p-values (for TOST and MET, which test both bounds)
- **p (equiv)** or **p (MET)** — the combined equivalence p-value

For TOST, the combined p-value is the *maximum* of the two one-sided tests (both bounds must be satisfied). For MET, it's the *minimum* (either bound being exceeded is sufficient). Non-inferiority and superiority show only one p-value since they test a single bound.

> **The two-sided p is not the equivalence result.** **p (two-sided)** answers the ordinary question "do the groups differ?" — it has nothing to do with whether they're equivalent. Read the equivalence decision from **p (equiv)** / **p (MET)** (and the interpretation column), not from **p (two-sided)**. A difference can be both statistically significant *and* practically equivalent.

The interpretation column reflects equivalence outcomes:

- TOST significant → "Equivalent (within Δ = X)"
- Non-inferiority significant → "Non-inferior (Δ = X)"
- Superiority significant → "Superior (Δ = X)"
- MET significant → "Meaningful effect (|d| > Δ = X)"

Here Δ = X is the bound *you entered* (standardized or raw), so it reads back as the value you set; the bounds note above the table is where the raw-unit conversion is shown.

Pairwise comparison tables (both matrix and long format) also include equivalence p-values when applicable.

### Categorical tests (chi-square, Fisher's exact, etc.)

A contingency table showing:

- Observed frequencies with column percentages
- Expected frequencies (from the chi-square test)
- Row and column totals

> **Fisher's exact has no test statistic.** Fisher computes the p-value directly from the hypergeometric distribution, so the Statistic column is blank for Fisher; the odds ratio (with its exact CI from `fisher.test`) is reported as the effect size instead.

> **McNemar switches to an exact test for small samples.** When the discordant count (b + c) is below 25, McNemar's test automatically uses the exact binomial test on the discordant pairs instead of the asymptotic χ². Like Fisher, the exact test has no χ² statistic, so the Statistic column is blank and a note records that the exact test was used (with the b + c count). The same applies to Stuart-Maxwell's 2×2 reduction. If b + c = 0 (perfect agreement), the test is undefined and the statistic and p-value are reported as **NA** with a note.

> **Stuart-Maxwell and singular paired tables.** Stuart-Maxwell's χ² is undefined when the matrix of marginal differences is fully singular — typically caused by empty or perfectly redundant categories. In that case the statistic and p-value are reported as **NA** and a note flags the affected variable, rather than silently producing χ² = 0, p = 1. When the matrix is only **partially** singular (some categorical structure was redundant but not all), the χ² is computed against a reduced-rank pseudo-inverse with the degrees of freedom adjusted to the effective rank, and a note flags the result as approximate. For 2×2 tables the test delegates to McNemar (with which it is equivalent), honoring the [continuity correction](#continuity-correction) setting so it matches the dedicated McNemar test, and the method line reflects that.

> **Cochran's Q with non-{0, 1} binary data.** If a Cochran's Q DV uses two values that aren't 0 and 1 (e.g. "yes"/"no"), the higher value is coded as the "success". A note in the output records which value was treated as the success, so the frequency table can be read correctly.

### Pairwise comparisons

Produced by automatic pairwise expansion (two-sample test with 3+ groups) or post-hoc tests.

**Matrix format** — lower-triangle matrix where each cell shows the test statistic (with df), difference CI, p-value, and effect size on separate lines. Cells are colored by significance.

**Long format** — flat table with columns for comparison pair, group statistics, difference CI, test statistic, df, p-value, adjusted p-value, effect size, and interpretation.

A legend explains the notation used.

> **Degrees of freedom in Student's expansion.** Because the independent t-test pairs share the pooled error term (see [Choosing a test](#choosing-a-test)), the reported df is N − k (total sample size minus the number of groups), not the two-group n₁ + n₂ − 2 — this is expected and reflects the extra precision from pooling. Welch's expansion keeps each pair's own (fractional) df.

### Classification (ROC) results

When ROC is enabled, results include a "Classification (ROC) analysis" sub-section. The main table has one row per (dependent variable × pair × threshold):

- **Variable** — the dependent variable being thresholded.
- **Comparison** — the group pair (only shown when pairwise expansion is in effect for 3+ groups).
- **Predicted group** — the group whose membership is signalled by *higher* scores. Orientation is auto-detected so the AUC is always ≥ 0.5.
- **AUC** — area under the ROC curve. 0.5 = chance, 1.0 = perfect discrimination.
- **{level}% CI** — confidence interval for the AUC (DeLong or bootstrap, per your selection).
- **N** — total observations as `total (predicted/other)`.
- **Worse to misclassify** — only present with cost-weighted thresholds; identifies which of the two reported thresholds corresponds to the asymmetric-cost direction.
- **Threshold** — the cutoff. Scores ≥ threshold are classified as the predicted group.
- **Sensitivity / Specificity** — sensitivity and specificity for the predicted group at the threshold.
- **PPV / NPV** — positive and negative predictive values.
- **Accuracy** — overall correct-classification rate.

> **AUC interpretation.** Common rules of thumb: 0.5–0.6 = poor, 0.6–0.7 = fair, 0.7–0.8 = good, 0.8–0.9 = excellent, 0.9+ = outstanding. These are guidelines, not laws — practical value depends entirely on the cost of errors in your domain. A 0.65 AUC may be transformative for a problem that previously had no marker; a 0.85 AUC may be insufficient for a high-stakes diagnostic decision.

> **Sensitivity vs. specificity** — sensitivity is the fraction of predicted-group cases correctly classified (true positive rate); specificity is the fraction of other-group cases correctly classified (true negative rate). They trade off as the threshold moves: lower threshold → higher sensitivity, lower specificity, and vice versa. The Youden / closest / cost-weighted rules pick a single point along this trade-off.

> **PPV and NPV depend on prevalence.** Unlike sensitivity and specificity, predictive values change with the proportion of the predicted group in your sample. If your sample's group-size ratio doesn't reflect the real-world prevalence, treat PPV and NPV as illustrative — they won't generalize directly.

#### AUC comparison (DeLong's test)

When **Compare AUCs** is enabled and 2+ AUCs are produced, an additional table tests them pairwise:

- **Variable 1** and **Variable 2** — the two AUCs being compared.
- **Δ AUC** — AUC(Variable 1) − AUC(Variable 2).
- **Z** — DeLong's test statistic for the difference between paired AUCs on the same subjects.
- **p-value** (and adjusted p-value, if [p-value adjustment](./settings.md#multiple-comparison-adjustment) is set to addition mode).

For pairwise group expansion across 3+ groups, the table is split into one section per group pair, with cross-DV comparisons within each pair.

### Factorial ANOVA

Factorial ANOVA is designed for **two or more** grouping factors so that interactions can be tested. With a single factor it collapses to a one-way ANOVA with only one effect row — in that case, pick the **One-way ANOVA** test directly for a cleaner output and assumption-check fit.

One table per dependent variable showing each effect (main effects and interactions):

- Effect name, F statistic with significance stars, df (effect and error), p-value
- Effect size (if enabled): partial η² (default), η², ω², or ε² — selectable in **Effect size** dropdown
- Interpretation distinguishing main effects from interactions

When post-hoc is enabled, a section follows the effects table with one block per effect term:

- **Main effect** — pairwise comparisons of that factor's levels, marginalized over the other factors
- **Interaction** — all cell-pair contrasts across the involved factors. For two-way interactions, two **simple-effects** tables follow, showing pairwise comparisons of one factor at each level of the other (and vice versa)

Each block notes the adjustment method used. When the omnibus effect was not significant, a warning above its post-hoc table flags it.

> **Reading factorial post-hoc:** start with the omnibus effects table to decide which terms matter, then drill into the relevant block. A significant interaction is best interpreted via the simple-effects tables — they tell you exactly where the interaction lives (e.g. "Treatment matters for women but not for men"). When the interaction is non-significant, the main-effect comparisons are the primary read.

### ANCOVA

For each dependent variable, up to three sections:

1. **Effects table** — rows for covariates and factors, each with F statistic, df, p-value, and partial eta-squared. Labels indicate covariate vs. factor.
2. **Adjusted means** — raw mean, SD, adjusted mean (bold), SE, and CI per group
3. **Post-hoc comparisons** — pairwise contrasts on adjusted means with difference, SE, df, t-ratio, and p-value

> **What are adjusted means?** When you control for covariates, the group means are recalculated as if all groups had the same covariate values. These "adjusted" or "estimated marginal" means remove the covariate's influence, giving a cleaner comparison of the groups.

### Mixed ANOVA

For each dependent variable:

1. **Effects table** — each effect labeled "(between)", "(within)", or "(covariate)". With 3+ conditions, additional columns show both Greenhouse-Geisser (GG) and Huynh-Feldt (HF) epsilon values and their corrected p-values.
2. **Mauchly's test of sphericity** — when applicable (3+ conditions), with W statistic, p-value, and interpretation
3. **Post-hoc comparisons** — organized into sections:
   - Between-subjects comparisons (group)
   - Within-subjects comparisons (condition)
   - Simple effects: group comparisons within each condition
   - Simple effects: condition comparisons within each group

   Contextual hints appear based on significance, e.g. "Main effect of group was not significant — interpret comparisons with caution" or "Interaction was significant — consider simple effects analysis."
4. **Adjusted group means** — when covariates are included

> **Sphericity and the two corrections:** sphericity means the variances of differences between all condition pairs are equal — a technical assumption of repeated measures ANOVA. When Mauchly's test says it's violated, the degrees of freedom are adjusted downward to make the test more conservative. Two corrections are reported: **Greenhouse-Geisser (GG)** is the more conservative one; **Huynh-Feldt (HF)** is less conservative and tends to be more accurate when the true sphericity is not severely violated. The common rule of thumb (Girden 1992): use GG when the GG epsilon is ≤ 0.75, HF otherwise. Report whichever correction you chose along with its epsilon value.

### ART-ANOVA

The non-parametric counterpart to Mixed ANOVA. Results appear in their own "ART-ANOVA results" card and share the Mixed ANOVA table layout, one table per dependent variable:

- Each effect labeled **(between)**, **(within)**, or **(between × within)** — main effects and interactions across the full factor crossing
- **F statistic** with significance stars
- **df** — the effect degrees of freedom and the denominator (error) df. The denominator df is estimated by the Kenward-Roger method on the underlying mixed model, so it need not be a whole number
- **p-value** (formatted per your [p-value settings](./settings.md#p-value-settings))
- **Partial η²** with confidence interval — the only effect size ART-ANOVA reports, computed from F and the degrees of freedom (non-central F inversion, the same machinery as the parametric ANOVA family)

There is **no Mauchly's test and no sphericity correction** — ranks sidestep the sphericity assumption — and **no post-hoc table**, since aligned-rank contrasts need a separate alignment per term that the module doesn't yet expose.

> **Why no covariates?** ART works by *aligning* the response — stripping out every effect except the one being ranked — and that alignment is only defined for categorical factors. Continuous predictors have no levels to align against, so if you assign covariates to an ART-ANOVA they are silently dropped and a note appears in the **Diagnostics** section telling you which ones were ignored. To control for a continuous covariate, use Mixed ANOVA instead.

> **Singular degrees of freedom.** If the denominator df can't be estimated — the random-effect covariance matrix is singular — the effect reports an error: *"ART-ANOVA could not estimate denominator degrees of freedom (singular covariance matrix)."* This usually means too few subjects per between-cell, or a between/within factor that is collinear with another. Add subjects or drop the redundant factor.

### MANOVA / MANCOVA

A single output card covering all dependent variables:

1. **Method info** — lists the dependent variables, grouping/condition variable, and covariates (if any)
2. **Multivariate tests** — Pillai's Trace, Wilks' Lambda, Hotelling-Lawley Trace, and Roy's Largest Root, each with approximate F, df, and p-value. All four stats test the same hypothesis with different statistics; when [p-value adjustment](#p-value-adjustment) is active, all four rows display the same adjusted p (one hypothesis = one adjustment).
3. **Univariate follow-up tests** — per-DV ANOVAs (or ANCOVAs when covariates are present, repeated-measures ANOVAs for RM-MANOVA, mixed ANOVAs for Mixed-MANOVA). The header reflects the actual follow-up type. These p-values are **not** included in the global adjustment pool — they're gated by the multivariate omnibus, per standard practice. They *are* adjusted **internally**, as their own family: within each multivariate effect, the K per-DV p-values are corrected together (K = number of dependent variables) using your configured [adjustment method](./settings.md#multiple-comparison-adjustment), and a note above the table records the K and the method.
4. **Descriptive statistics** — per-DV, per-group summaries

MANCOVA adds covariate multivariate tests (one Pillai test per covariate, each Type III SS so order doesn't matter) and adjusted means per DV per group.

For mixed designs, multivariate and univariate tables are organized by effect (between, within, interaction).

> **Mixed MANOVA needs enough subjects.** Because it models the dependent variables jointly within each between-subjects cell, Mixed MANOVA needs **more subjects than dependent variables in every between-cell crossing** — otherwise the error degrees of freedom run out and the analysis stops with a message telling you the subject count, the number of between-cells, and the DV count. Reduce the number of DVs or factors, or add subjects.

> **Rank-deficient response matrix.** If the within-subject response matrix can't be inverted (its rank is below the number of columns), the analysis reports that it is rank-deficient. The usual causes are multicollinearity among the dependent variables, systematic missing-data patterns, or too few subjects. Drop a redundant DV or check your missingness before re-running.

> **Subjects dropped for incomplete cells.** Mixed designs need every subject present in every within-subject cell. Subjects missing one or more cells are removed listwise before the analysis, and a note reports how many of the total were dropped — so a shrinking N is visible rather than silent.

> **Which multivariate test to report?** Pillai's Trace is the most robust — it handles violations of assumptions better than the others. Wilks' Lambda is the most commonly reported in published research. When all four agree, it doesn't matter much; when they disagree, trust Pillai's.

### Batch analysis

When batch mode is used, separate output cards appear for each grouping variable, titled "Batch analysis 1/N: [variable name]". P-values pool across every iteration — see [P-value adjustment](#p-value-adjustment) for what enters the pool.

### Pseudo-factorial analysis

When the factorial strategy is used with multiple grouping variables, results appear under "Pseudo-factorial analysis: [Var1 × Var2]".

## P-value adjustment

Multiple tests on the same data increase the chance of false positives. P-values are automatically adjusted according to your [global adjustment setting](./settings.md#multiple-comparison-adjustment).

**What's in the pool.** Every omnibus p-value across the entire run goes into one adjustment pool — one independent hypothesis per row:

- Standard tests (t-tests, Welch, Mann-Whitney, χ², one-way ANOVA, …) — one p per dependent variable.
- Pairwise expansions (two-sample test with 3+ groups) — every pair contributes.
- Factorial / mixed / repeated ANOVA and ANCOVA — every effect row (main effects, interactions, covariates).
- MANOVA / MANCOVA / RM and Mixed variants — the grouping (or per-factor) omnibus plus each covariate test. The four multivariate statistics (Pillai/Wilks/HL/Roy) share one adjusted value since they test the same hypothesis.
- Batch mode — pooled across every batch iteration.

**What's not in the pool:**

- Univariate follow-up tests of MANOVA — raw, gated by the multivariate omnibus per standard practice.
- Post-hoc tables (Tukey HSD, Dunn's, pairwise t-tests, …) — adjusted internally using the same method you selected, but as their own well-defined family. Pooling them with omnibus tests would double-count.
- ROC AUC comparisons (DeLong) — adjusted internally within the AUC-comparison family.

If no adjustment method is selected, a warning appears recommending you consider one.

> **How many tests am I running?** More than you might think. Five dependent variables with one grouping variable = five tests. Add a factorial ANOVA with two factors and an interaction = three effect rows per DV. Add pairwise expansion across four groups = six pairs per DV. It adds up quickly — adjustment keeps false positives under control across the whole study. See [multiple comparison adjustment](./settings.md#multiple-comparison-adjustment) for method guidance.

## Missing data

Missing values are handled by the global [missing data setting](./settings.md#missing-data):

- **Pairwise** — each test uses all available cases for the variables involved
- **Listwise** — only cases complete across all selected variables are used
- **Imputation** — missing values are replaced before analysis (mean, median, mode, or constant)

For comparison analysis, listwise deletion within each test is the most common approach in published research, as it ensures each group comparison uses the same set of cases.

## Visualization

When enabled, a separate "Distribution comparison" output card shows the selected plot types for each numeric dependent variable, displaying the distribution across groups or conditions. For factorial designs, the x-axis label shows the combined variable names. Groups and conditions appear in the same order as the result tables — numerically when every level is a number (so dose 1, 2, 5, 10 reads in order, not 1, 10, 2, 5), alphabetically otherwise. In one-sample mode the box, violin, ECDF, and mean/error plots draw a reference line at μ₀; the value axis always expands to include it, so the line stays visible even when μ₀ falls outside the observed data. All plots can be resized and exported as SVG, PNG, or JPG.

### Box plot

Grouped box plots — one per dependent variable. Options: show outliers, show mean, show notch (median CI), show data points. Checked by default.

Box plots follow the same format as in [distribution analysis](./distribution-analysis.md#box-plot).

### Violin plot

Grouped kernel density plots with an inner box plot. Option: show inner box plot.

> **Box plot vs. violin:** box plots are better for comparing medians and spotting outliers. Violin plots show the full distribution shape — useful when distributions are bimodal or skewed, since box plots hide that.

### ECDF plot

Grouped empirical cumulative distribution functions — each group's curve shows the proportion of observations at or below each value. Options: show median reference line, show confidence band (a pointwise Wilson score interval at the [confidence level](./settings.md), on by default).

> **When ECDF is useful:** ECDF plots let you compare distributions at every value, not just at summary statistics. Two groups can have the same mean and SD but look quite different in their ECDF curves. They're also useful for spotting floor/ceiling effects or clusters of values.

### Mean and error bar plot

Group means with confidence interval whiskers. A caption below the plot states the confidence level the whiskers represent, so the error bars aren't mistaken for SD or SE. Hover over a point to see the mean, standard error, CI, and sample size.

### Paired lines plot

A spaghetti plot connecting each subject's values across conditions, with a bold mean line overlay. Aligns by subject ID when available, falls back to row correspondence. Option: show mean line.

Only available for dependent or mixed samples designs.

> **Reading paired lines:** individual lines show the pattern for each participant — if most lines slope in the same direction, the effect is consistent. Crossing lines suggest the effect varies across individuals. The bold mean line shows the average trend.

### Interaction plot

Group means connected by lines across levels of one factor, with separate traces for each level of a second factor. Includes a legend. Hover over a mean to see the cell label, mean, standard error, CI, and sample size. Option: show error bars — when on, a caption states the confidence level they represent. When a within-subjects factor is involved (dependent or mixed designs), the error bars are **within-subject (Cousineau–Morey) confidence intervals** (Morey, 2008), which remove between-subject variance so they reflect the uncertainty relevant to *within* comparisons; purely between-subjects (factorial) designs use ordinary between-cell CIs. Subjects missing a cell are dropped from the within-subject estimates and noted below the plot.

Only available when two or more factor variables are selected (factorial independent, or mixed between × within designs).

> **Reading interaction plots:** parallel lines mean no interaction — both factors operate independently. Crossing or converging lines suggest an interaction, meaning the effect of one factor depends on the level of the other. The statistical test tells you whether the visual pattern is significant.

### Forest plot

Horizontal layout showing effect size point estimates (diamonds sized by precision — the most precise estimate, with the narrowest CI, gets the largest diamond and the rest scale down from it) with confidence intervals for each dependent variable. Includes a dashed reference line at the effect's no-effect value — zero for difference and correlation measures, 0.5 for the common-language effect size, 1 for the variance ratio — and numeric annotations.

Only available when **Include effect sizes** is checked and results contain valid effect size CIs.

### ROC curve

A plot of true positive rate (sensitivity) against false positive rate (1 − specificity), with one curve per group pair when pairwise expansion is in effect. The diagonal is the chance line; curves further toward the top-left corner indicate better discrimination. The AUC and the predicted group are shown in the legend. Dots along each curve mark the reported thresholds; hover to see threshold value, sensitivity, specificity, PPV, NPV, and (when cost-weighted) which error is costlier.

Available when **Include classification (ROC) analysis** is enabled and the selected test is eligible. See [classification analysis](#classification-roc-analysis) for the underlying analysis.

> **Reading the ROC curve.** Each point on the curve corresponds to a possible threshold. Moving along the curve trades sensitivity for specificity. The threshold the analysis reports (Youden's, closest, or cost-weighted) is one chosen point — but the whole curve is the actual summary of discriminative ability across all possible cutoffs.

## Reporting checklist

Key things to include when writing up comparison results:

**Method:**
- Analysis design (independent, dependent, or mixed)
- Statistical test used and why (e.g. "Welch's t-test was used due to unequal variances")
- Whether assumptions were checked and which were met or violated
- How missing data were handled
- P-value adjustment method, if any
- For post-hoc tests: which method and correction
- For chi-square, McNemar, Mann-Whitney, or Stuart-Maxwell: whether the continuity correction was applied (and, for McNemar / Stuart-Maxwell with few discordant pairs, that the exact binomial test was used)
- For ART-ANOVA: that the Aligned Rank Transform was used as the non-parametric mixed-design analysis, and that denominator df came from the Kenward-Roger approximation (hence the non-integer error df)
- For variance (dispersion) tests: which test and why (e.g. "Fligner-Killeen was used because the groups were non-normal"), and that the hypothesis is about spread, not location
- Directionality (one-tailed or two-tailed)
- For equivalence testing: the type (TOST, non-inferiority, superiority, or MET), the equivalence bound Δ, and whether Δ was specified in raw or standardized units
- For ROC analysis: the threshold rule (Youden / closest / cost-weighted, with the cost asymmetry ratio if applicable), the AUC CI method (DeLong or bootstrap), and that DeLong's test was used for any AUC comparisons

**Results:**
- Descriptive statistics per group (means, SDs, sample sizes at minimum)
- Test statistic with degrees of freedom (e.g. t(58) = 2.34, F(2, 87) = 5.12)
- Exact p-value (or p < .001 for very small values)
- Effect size with confidence interval (e.g. Cohen's d = 0.65, 95% CI [0.12, 1.18])
- For the F-test of variances: the variance ratio with its CI (e.g. F(29, 29) = 1.84, variance ratio 1.84, 95% CI [0.88, 3.86])
- For equivalence testing: the TOST p-value and the two one-sided p-values, plus the raw Δ bound used
- For multi-group tests: omnibus result first, then post-hoc comparisons
- For factorial/mixed designs: main effects, interactions, and simple effects where relevant
- For ROC analysis: AUC with CI per variable (and per pair, if applicable), plus sensitivity and specificity at the reported threshold; for AUC comparisons, Δ AUC, Z, and p-value(s)

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) — you can inspect, copy, or re-run the exact commands. Comparison analysis uses base R for t-tests, chi-square, Welch's one-way ANOVA (`oneway.test`), the two-sample Kolmogorov-Smirnov test (`ks.test`), the variance tests (`var.test`, `bartlett.test`, `fligner.test`), and the Games-Howell, Conover, and Nemenyi post-hocs (computed directly from `ptukey`/`pt`, no package), `car` for ANOVA-family tests, `emmeans` for post-hoc comparisons and estimated marginal means, `dunn.test` for Dunn's test, `brunnermunzel` for the Brunner-Munzel test, `kSamples` for the Anderson-Darling k-sample test, `ARTool` for ART-ANOVA (with `lme4` / `pbkrtest` behind it for the mixed-model fit and Kenward-Roger degrees of freedom), `effectsize` for effect size calculations, and `pROC` for ROC / AUC analysis and DeLong's test. Citations for R packages used in your analysis appear automatically at the top of the output section. The Ross MI permutation test, ROC bootstrap CIs, and the effect-size bootstrap CIs (Wilcoxon r, the matched-pairs rank-biserial — paired and one-sample, Kruskal-Wallis ε²/η²_H, Friedman's W, Cohen's g, and Cochran's average φ²) are seeded by [**Bootstrap seed**](./settings.md#bootstrap-seed) — set it to make permutation p-values and bootstrap CIs reproducible across runs.

## Common pitfalls

**Checking assumptions after seeing the results.** Run assumption checks *before* the main analysis, not after. If you run a t-test, get a non-significant result, then switch to Mann-Whitney hoping for significance, you're inflating your false positive rate. The assumption check should determine the test, not the other way around.

**Ignoring effect sizes.** A significant p-value with a tiny effect size (d = 0.05) means the groups are "statistically different" but the difference is practically meaningless. Conversely, a non-significant result with a moderate effect size (d = 0.50) might just mean you needed more participants. Always report and interpret effect sizes alongside p-values.

**Multiple grouping variables as separate batch analyses when you need interactions.** If you're interested in whether the effect of treatment differs by gender, running two separate batch analyses (one for treatment, one for gender) won't answer that question — you need factorial ANOVA or a mixed model to test the interaction.

**Using dependent-samples tests on independent data (or vice versa).** A common mistake: comparing pre-test and post-test scores with an independent t-test instead of a paired t-test. Independent tests treat the two sets of scores as coming from different people, wasting the statistical power that comes from knowing each person's change.

**Claiming equivalence from a non-significant result.** A standard test that fails to reach significance (p > .05) does *not* mean the groups are equal — it means you couldn't prove they're different. To make a positive claim of equivalence, you need an equivalence test (TOST). This distinction matters especially in clinical research, where "no difference detected" and "proven equivalent" have very different regulatory implications.

**Setting the equivalence bound after seeing the data.** The bound Δ should be chosen *before* analysis, based on domain knowledge about what constitutes a practically meaningful difference. Choosing Δ after seeing the results — picking a bound just wide enough to achieve significance — invalidates the test. Pre-register your bound when possible.

**Reading too much into a high AUC on a small sample.** AUCs have wide confidence intervals at small sample sizes, and DeLong's CI relies on asymptotic theory. With fewer than ~30 observations per group, prefer the bootstrap CI and treat the point estimate as provisional. An AUC of 0.85 with a 95% CI of [0.55, 1.0] is not a strong signal — it's a wide range that happens to include "excellent".

**Treating PPV and NPV as universal.** Predictive values depend on the prevalence of the predicted group in your sample. If your sample is balanced 50/50 but real-world prevalence is 5%, the PPV reported here will be far higher than what you'd see in deployment. Sensitivity and specificity are prevalence-independent — those generalize. PPV and NPV in this output describe your sample, not the population.

**Choosing the cost direction after seeing the cost-weighted thresholds.** The cost-weighted rule reports two thresholds, one for each direction of asymmetric cost. Picking which row "feels right" after seeing the numbers — rather than committing to which error type is worse beforehand — is the same kind of post-hoc tuning as flipping a one-tailed test direction after the fact.
