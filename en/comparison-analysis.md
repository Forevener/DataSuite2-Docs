---
title: Comparison analysis
description: Compare groups and conditions using t-tests, ANOVA, Mann-Whitney, chi-square, mixed models, and more in DataSuite 2.
---

# Comparison analysis

The **Comparison analysis** module tests whether groups or conditions differ on one or more variables. It supports independent samples (separate groups), dependent samples (repeated measures on the same subjects), and mixed designs that combine both.

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

> **Why does the design matter?** Independent and dependent designs use fundamentally different math. Dependent samples tests are more powerful because they account for individual differences — if person A always scores higher than person B, the test factors that out and focuses on whether the *conditions* caused a change. Using an independent test on paired data throws away this advantage; using a dependent test on truly independent groups produces nonsense.

> **Long format required:** comparison analysis expects one observation per row. If your data has conditions in separate columns (wide format), use the **Convert wide to long format** button that appears in the interface — it opens the [column stacker](./data-transformation.md) tool.

## Setting up

### Variable roles

Variables are assigned roles in the left panel:

- **Grouping variables** — define between-subjects groups (independent and mixed designs). Click to select which variables split your data into groups.
- **Condition variables** — define within-subjects conditions (dependent and mixed designs)
- **Subject ID** — identifies individual subjects so their measurements can be matched across conditions. Required for dependent and mixed designs, optional for independent. If a "Subject ID" column exists (e.g. from the column stacker), it is auto-selected.
- **Covariates** — continuous control variables, visible when the selected test supports them (ANCOVA, MANCOVA, mixed ANOVA)

> **What is a covariate?** A variable you want to "control for" — meaning you suspect it influences the outcome but it's not what you're studying. For example, if you're comparing test scores across teaching methods, students' prior GPA might affect the results. Adding GPA as a covariate statistically removes its influence, so the remaining group difference is more likely due to the teaching method itself.

Any variables not assigned to these roles are automatically treated as **dependent variables** — the outcomes you're comparing across groups.

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
| **One-way ANOVA** | Three or more groups, parametric |
| **Kruskal-Wallis test** | Three or more groups, non-parametric |
| **Mutual information test** | Non-parametric omnibus; detects any distributional difference (location, scale, shape). Two or more groups. |
| **Jensen-Shannon divergence test** | Non-parametric distance between group distributions. Two groups; auto-expands to a pairwise matrix for three or more. |
| **Factorial ANOVA** | Two or more grouping variables analyzed together |
| **ANCOVA** | Groups with continuous covariates to control for |
| **MANOVA** | Multiple dependent variables simultaneously |
| **MANCOVA** | Multiple dependent variables with covariates |

> **Information-theoretic tests.** Mutual information and Jensen-Shannon divergence measure how much knowing the group label tells you about the outcome — in **bits** (log₂). Unlike t-tests and rank tests, they react to *any* change in the distribution, not just a shift in the mean or median. P-values are computed by shuffling group labels (permutation), so they respond to the **Bootstrap replications** setting: more replications = tighter p-values, longer runtime. These tests have no matching effect size column — the statistic itself is a bounded magnitude. Not offered for paired or mixed designs, where "did Y shift within subject?" has no clean information-theoretic answer.

> **Why MANOVA instead of separate ANOVAs?** Running a separate ANOVA for each dependent variable inflates false positives (more tests = more chances for a fluke). MANOVA tests all DVs together in one shot, keeping the false positive rate under control. It can also detect group differences that only show up in the *combination* of variables — for example, groups might not differ on anxiety or depression alone, but the joint pattern of both could be significantly different.

### Dependent samples — numeric

| Test | When to use |
|---|---|
| **Paired samples t-test** | Two conditions, parametric |
| **Wilcoxon signed-rank test** | Two conditions, non-parametric |
| **Repeated measures ANOVA** | Three or more conditions, parametric |
| **Friedman test** | Three or more conditions, non-parametric |
| **Repeated measures MANOVA** | Multiple DVs across conditions |

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

### Mixed model

| Test | When to use |
|---|---|
| **Mixed ANOVA** | Between + within factors, single DV |
| **Mixed MANOVA** | Between + within factors, multiple DVs |

> **Parametric vs. non-parametric:** parametric tests (t-test, ANOVA) assume your data is roughly normally distributed and have more statistical power — they're better at detecting real differences. Non-parametric tests (Mann-Whitney, Kruskal-Wallis) make fewer assumptions and are safer when your data is skewed or has outliers, but they need larger samples to detect the same effects. Use [assumption checks](#checking-assumptions) to help decide.

> **Two-sample tests with more than two groups:** if you select a two-sample test (e.g. t-test) but have more than two groups, the module automatically runs all pairwise comparisons.

## Configuration

### Test direction

For two-sample tests (t-tests, Mann-Whitney, Wilcoxon), the **Test direction** dropdown offers two groups of options. Hidden for multi-group tests.

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
- **Standardized (Cohen's d)** — automatically converted to raw units using the pooled standard deviation (independent tests) or the standard deviation of differences (paired tests)

> **What is equivalence testing?** A standard test asks "are these groups different?" A non-significant result does *not* mean they're the same — you simply failed to detect a difference. Equivalence testing flips the question: "are these groups similar *enough*?" It uses Two One-Sided Tests (TOST) to demonstrate that the difference falls within a pre-specified bound Δ. A significant TOST result is positive evidence of equivalence, not just absence of evidence.

> **Choosing Δ:** the equivalence bound should reflect the smallest difference that would be practically meaningful in your domain. For example, if a 3-point difference on a 100-point scale is negligible in your field, set Δ = 3 (raw) or estimate the standardized equivalent. A bound that's too wide makes equivalence easy to establish but unimpressive; a bound that's too narrow requires very large samples.

> **Non-inferiority and superiority** are one-sided variants of equivalence testing commonly used in clinical trials. Non-inferiority asks "is the new treatment not meaningfully *worse* than the standard?" — useful when a cheaper or safer alternative is acceptable if it isn't worse by more than Δ. Superiority asks "is the new treatment meaningfully *better* by at least Δ?" — a stronger claim than ordinary significance.

> **Minimal effect testing (MET)** is the opposite of equivalence testing. Where TOST tries to show the difference is *small enough*, MET tries to show the difference is *big enough* — that it exceeds a meaningful threshold Δ. This is useful when you want to confirm not just that an effect exists (p < .05) but that it's large enough to matter practically.

### Post-hoc tests

Available for multi-group tests (ANOVA, Kruskal-Wallis, repeated measures ANOVA, Friedman, mixed ANOVA, ANCOVA). Check **Include post-hoc tests** and select a method:

- **Tukey HSD** — for ANOVA-family tests
- **Pairwise t-tests (pooled error, p-adjusted)** — for ANOVA-family tests
- **Dunn's test** — for Kruskal-Wallis

> **Why post-hoc tests?** An overall ANOVA tells you *something* differs among the groups, but not *which* groups differ from which. Post-hoc tests make all pairwise comparisons while adjusting for the fact that you're running many tests at once.

### Pairwise comparison format

When pairwise comparisons are produced (from post-hoc tests or automatic expansion):

- **Matrix format** — symmetric matrix with groups on both axes; each cell shows statistic, p-value, and optionally effect size and CI
- **Long format** — flat table with one row per comparison pair

### Effect sizes

Check **Include effect sizes** and select a measure from the dropdown. Available measures update based on the selected test (e.g. Cohen's d for t-tests; η², ω², ε², or partial η² for ANOVA; rank-biserial for Mann-Whitney; Cramer's V for chi-square; φ or odds ratio for McNemar).

Additional options:

- **Confidence intervals** for the effect size
- **Standard errors** for the effect size

> **What is an effect size?** A p-value tells you whether an effect exists; an effect size tells you how *big* it is. A tiny difference can be statistically significant with a large enough sample, while a meaningful difference can be non-significant with too few participants. Common benchmarks: Cohen's d of 0.2 = small, 0.5 = medium, 0.8 = large — but what counts as "meaningful" depends on your field.

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
| Normality | Shapiro-Wilk | Per group, per variable |
| Multivariate normality | Mardia's test | 2+ dependent variables |
| Homogeneity of variance | Levene's test | Independent designs |
| Sphericity | Mauchly's test | Repeated measures, 3+ conditions |
| Homogeneity of covariance matrices | Box's M test | 2+ DVs with independent groups |
| Multicollinearity | Correlation check (absolute r > 0.90) | 2+ dependent variables |
| Covariate: regression slopes | Interaction test | Covariates present |
| Covariate: linearity | Correlation | Covariates present |
| Covariate: independence | Group comparison | Covariates present |
| Expected frequencies | Cell count check (< 5) | Categorical DVs |

> **What to do when assumptions are violated:** don't panic — many tests are robust to mild violations, especially with larger samples. The assumption check provides specific test recommendations based on the results, telling you which tests are safe to use and which to avoid.

### Test recommendations

Based on the assumption results, the system lists:

- **Recommended tests** — those whose assumptions are met
- **Not recommended tests** — with specific reasons (e.g. "Normality assumption violated", "Homogeneity of variance violated")

### Detailed results

Individual tables for each assumption test showing per-variable, per-group results with test statistics, p-values, and color-coded status (green = pass, red = fail, yellow = warning).

## Reading results

Click **Run comparison analysis** to perform the test. The system validates your setup first — if something is missing (no dependent variables, no grouping variable assigned, etc.), an alert explains what's needed.

Results vary by test type. Here's what to expect for each:

### Standard tests (t-test, ANOVA, Kruskal-Wallis, etc.)

An "Overall test results" table with one row per dependent variable:

- Per-group summary statistics (depending on your [selections](#summary-statistics))
- Confidence interval of the difference (two-group tests, if CI is enabled)
- Test statistic with significance stars
- Degrees of freedom

> **Confidence interval of the difference:** this range tells you where the true population difference likely falls. For example, "CI [2.1, 8.7]" means the real difference is probably between 2.1 and 8.7. If the interval doesn't cross zero, the difference is statistically significant. Wider intervals mean more uncertainty — usually from smaller samples.

> **Degrees of freedom (df):** a number that reflects how much independent information went into the calculation — roughly, sample size minus the number of things being estimated. You don't need to interpret df directly; it's reported because it's needed to look up critical values and verify the test was run correctly. A t-test with 58 df means about 60 total observations were used.
- p-value (formatted per your [p-value settings](./settings.md#p-value-settings))
- Adjusted p-value (if [adjustment](./settings.md#multiple-comparison-adjustment) is active in addition mode)
- Equivalence p-values (when an [equivalence test direction](#test-direction) is selected) — see below
- Effect size with CI and SE (if enabled)
- Interpretation (if enabled in [settings](./settings.md#significance-formatting))

If any variables fail, an error summary groups failures by error message.

#### Equivalence test results

When an equivalence direction is selected, a note above the table shows the test type and the Δ bound (converted to raw units if you specified it as Cohen's d). Additional columns appear after the standard p-value:

- **p (lower)** and **p (upper)** — the two one-sided p-values (for TOST and MET, which test both bounds)
- **p (equiv)** or **p (MET)** — the combined equivalence p-value

For TOST, the combined p-value is the *maximum* of the two one-sided tests (both bounds must be satisfied). For MET, it's the *minimum* (either bound being exceeded is sufficient). Non-inferiority and superiority show only one p-value since they test a single bound.

The interpretation column reflects equivalence outcomes:

- TOST significant → "Equivalent (within Δ = X)"
- Non-inferiority significant → "Non-inferior (Δ = X)"
- Superiority significant → "Superior (Δ = X)"
- MET significant → "Meaningful effect (|d| > Δ = X)"

Pairwise comparison tables (both matrix and long format) also include equivalence p-values when applicable.

### Categorical tests (chi-square, Fisher's exact, etc.)

A contingency table showing:

- Observed frequencies with column percentages
- Expected frequencies (from the chi-square test)
- Row and column totals

### Pairwise comparisons

Produced by automatic pairwise expansion (two-sample test with 3+ groups) or post-hoc tests.

**Matrix format** — lower-triangle matrix where each cell shows the test statistic (with df), difference CI, p-value, and effect size on separate lines. Cells are colored by significance.

**Long format** — flat table with columns for comparison pair, group statistics, difference CI, test statistic, df, p-value, adjusted p-value, effect size, and interpretation.

A legend explains the notation used.

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

One table per dependent variable showing each effect (main effects and interactions):

- Effect name, F statistic with significance stars, df (effect and error), p-value
- Effect size (if enabled): partial η² (default), η², ω², or ε² — selectable in **Effect size** dropdown
- Interpretation distinguishing main effects from interactions

### ANCOVA

For each dependent variable, up to three sections:

1. **Effects table** — rows for covariates and factors, each with F statistic, df, p-value, and partial eta-squared. Labels indicate covariate vs. factor.
2. **Adjusted means** — raw mean, SD, adjusted mean (bold), SE, and CI per group
3. **Post-hoc comparisons** — pairwise contrasts on adjusted means with difference, SE, df, t-ratio, and p-value

> **What are adjusted means?** When you control for covariates, the group means are recalculated as if all groups had the same covariate values. These "adjusted" or "estimated marginal" means remove the covariate's influence, giving a cleaner comparison of the groups.

### Mixed ANOVA

For each dependent variable:

1. **Effects table** — each effect labeled "(between)", "(within)", or "(covariate)". With 3+ conditions, additional columns show Greenhouse-Geisser epsilon and corrected p-value.
2. **Mauchly's test of sphericity** — when applicable (3+ conditions), with W statistic, p-value, and interpretation
3. **Post-hoc comparisons** — organized into sections:
   - Between-subjects comparisons (group)
   - Within-subjects comparisons (condition)
   - Simple effects: group comparisons within each condition
   - Simple effects: condition comparisons within each group

   Contextual hints appear based on significance, e.g. "Main effect of group was not significant — interpret comparisons with caution" or "Interaction was significant — consider simple effects analysis."
4. **Adjusted group means** — when covariates are included

> **Sphericity and Greenhouse-Geisser:** sphericity means the variances of differences between all condition pairs are equal — a technical assumption of repeated measures ANOVA. When Mauchly's test says it's violated, the Greenhouse-Geisser correction adjusts the degrees of freedom downward, making the test more conservative. The corrected p-value is the one to report.

### MANOVA / MANCOVA

A single output card covering all dependent variables:

1. **Method info** — lists the dependent variables, grouping/condition variable, and covariates (if any)
2. **Multivariate tests** — Pillai's Trace, Wilks' Lambda, Hotelling-Lawley Trace, and Roy's Largest Root, each with approximate F, df, and p-value
3. **Univariate follow-up tests** — individual ANOVAs for each DV
4. **Descriptive statistics** — per-DV, per-group summaries

MANCOVA adds covariate multivariate tests and adjusted means per DV per group.

For mixed designs, multivariate and univariate tables are organized by effect (between, within, interaction).

> **Which multivariate test to report?** Pillai's Trace is the most robust — it handles violations of assumptions better than the others. Wilks' Lambda is the most commonly reported in published research. When all four agree, it doesn't matter much; when they disagree, trust Pillai's.

### Batch analysis

When batch mode is used, separate output cards appear for each grouping variable, titled "Batch analysis 1/N: [variable name]". P-values are adjusted globally across all analyses.

### Pseudo-factorial analysis

When the factorial strategy is used with multiple grouping variables, results appear under "Pseudo-factorial analysis: [Var1 × Var2]".

## P-value adjustment

Multiple tests on the same data increase the chance of false positives. P-values are automatically adjusted according to your [global adjustment setting](./settings.md#multiple-comparison-adjustment). In batch mode, adjustment is applied globally across all batch analyses.

If no adjustment method is selected, a warning appears recommending you consider one.

> **How many tests am I running?** More than you might think. Five dependent variables with one grouping variable = five tests. Add post-hoc comparisons across four groups, and each variable produces six more pairwise tests. It adds up quickly — adjustment helps keep false positives under control. See [multiple comparison adjustment](./settings.md#multiple-comparison-adjustment) for guidance on choosing a method.

## Missing data

Missing values are handled by the global [missing data setting](./settings.md#missing-data):

- **Pairwise** — each test uses all available cases for the variables involved
- **Listwise** — only cases complete across all selected variables are used
- **Imputation** — missing values are replaced before analysis (mean, median, mode, or constant)

For comparison analysis, listwise deletion within each test is the most common approach in published research, as it ensures each group comparison uses the same set of cases.

## Visualization

When enabled, a separate "Distribution comparison" output card shows the selected plot types for each numeric dependent variable, displaying the distribution across groups or conditions. For factorial designs, the x-axis label shows the combined variable names. All plots can be resized and exported as SVG, PNG, or JPG.

### Box plot

Grouped box plots — one per dependent variable. Options: show outliers, show mean, show notch (median CI), show data points. Checked by default.

Box plots follow the same format as in [distribution analysis](./distribution-analysis.md#box-plot).

### Violin plot

Grouped kernel density plots with an inner box plot. Option: show inner box plot.

> **Box plot vs. violin:** box plots are better for comparing medians and spotting outliers. Violin plots show the full distribution shape — useful when distributions are bimodal or skewed, since box plots hide that.

### ECDF plot

Grouped empirical cumulative distribution functions — each group's curve shows the proportion of observations at or below each value. Option: show median reference line.

> **When ECDF is useful:** ECDF plots let you compare distributions at every value, not just at summary statistics. Two groups can have the same mean and SD but look quite different in their ECDF curves. They're also useful for spotting floor/ceiling effects or clusters of values.

### Mean and error bar plot

Group means with confidence interval whiskers. Hover over a point to see the mean, standard error, CI, and sample size.

### Paired lines plot

A spaghetti plot connecting each subject's values across conditions, with a bold mean line overlay. Aligns by subject ID when available, falls back to row correspondence. Option: show mean line.

Only available for dependent or mixed samples designs.

> **Reading paired lines:** individual lines show the pattern for each participant — if most lines slope in the same direction, the effect is consistent. Crossing lines suggest the effect varies across individuals. The bold mean line shows the average trend.

### Interaction plot

Group means connected by lines across levels of one factor, with separate traces for each level of a second factor. Includes a legend. Option: show error bars.

Only available when two or more factor variables are selected (factorial independent, or mixed between × within designs).

> **Reading interaction plots:** parallel lines mean no interaction — both factors operate independently. Crossing or converging lines suggest an interaction, meaning the effect of one factor depends on the level of the other. The statistical test tells you whether the visual pattern is significant.

### Forest plot

Horizontal layout showing effect size point estimates (diamonds) with confidence intervals for each dependent variable. Includes a dashed reference line at zero and numeric annotations.

Only available when **Include effect sizes** is checked and results contain valid effect size CIs.

### ROC curve

A plot of true positive rate (sensitivity) against false positive rate (1 − specificity), with one curve per group pair when pairwise expansion is in effect. The diagonal is the chance line; curves further toward the top-left corner indicate better discrimination. The AUC and the predicted group are shown in the legend.

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
- Directionality (one-tailed or two-tailed)
- For equivalence testing: the type (TOST, non-inferiority, superiority, or MET), the equivalence bound Δ, and whether Δ was specified in raw or standardized units
- For ROC analysis: the threshold rule (Youden / closest / cost-weighted, with the cost asymmetry ratio if applicable), the AUC CI method (DeLong or bootstrap), and that DeLong's test was used for any AUC comparisons

**Results:**
- Descriptive statistics per group (means, SDs, sample sizes at minimum)
- Test statistic with degrees of freedom (e.g. t(58) = 2.34, F(2, 87) = 5.12)
- Exact p-value (or p < .001 for very small values)
- Effect size with confidence interval (e.g. Cohen's d = 0.65, 95% CI [0.12, 1.18])
- For equivalence testing: the TOST p-value and the two one-sided p-values, plus the raw Δ bound used
- For multi-group tests: omnibus result first, then post-hoc comparisons
- For factorial/mixed designs: main effects, interactions, and simple effects where relevant
- For ROC analysis: AUC with CI per variable (and per pair, if applicable), plus sensitivity and specificity at the reported threshold; for AUC comparisons, Δ AUC, Z, and p-value(s)

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) — you can inspect, copy, or re-run the exact commands. Comparison analysis uses base R for t-tests and chi-square, `car` for ANOVA-family tests, `emmeans` for post-hoc comparisons and estimated marginal means, `dunn.test` for Dunn's test, `effectsize` for effect size calculations, and `pROC` for ROC / AUC analysis and DeLong's test. Citations for R packages used in your analysis appear automatically at the top of the output section. The Ross MI permutation test and ROC bootstrap CIs are seeded by [**Bootstrap seed**](./settings.md#bootstrap-seed) — set it to make permutation p-values and bootstrap CIs reproducible across runs.

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
