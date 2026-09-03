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

> **Why does the design matter?** Independent and dependent designs use fundamentally different math. Dependent samples tests are more powerful because they account for individual differences – if person A always scores higher than person B, the test factors that out and focuses on whether the *conditions* caused a change. Using an independent test on paired data throws away this advantage; using a dependent test on truly independent groups produces nonsense.

> **Long format required:** comparison analysis expects one observation per row. If your data has conditions in separate columns (wide format), use the **Convert wide to long format** button that appears in the interface – it opens the [column stacker](./data-transformation.md) tool.

## Setting up

### Variable roles

Variables are assigned roles in the left panel:

- **Grouping variables** – define between-subjects groups (independent and mixed designs). Click to select which variables split your data into groups.
- **Condition variables** – define within-subjects conditions (dependent and mixed designs)
- **Subject ID** – identifies individual subjects so their measurements can be matched across conditions. Required for dependent and mixed designs, optional for independent. If a "Subject ID" column exists (e.g. from the column stacker), it is auto-selected.
- **Covariates** – continuous control variables (only **numeric variables** are offered in the list), visible when the selected test supports them (ANCOVA, MANCOVA, factorial ANOVA, mixed ANOVA, mixed MANOVA, repeated measures ANOVA, repeated measures factorial ANOVA, repeated measures MANOVA). When covariates are added to a repeated measures ANOVA the analysis is fitted on the multivariate-model machinery that admits them, but presented in the usual univariate form, matching the covariate-free output: a single F per effect, your selected effect size with its confidence interval, the Greenhouse-Geisser and Huynh-Feldt sphericity corrections, and covariate effects – all from the same fit. With [post-hoc tests](#post-hoc-tests) enabled, the pairwise condition contrasts are covariate-adjusted estimated marginal means (emmeans).
- **Stratifying variable** – a single categorical variable the [**Cochran-Mantel-Haenszel test**](#independent-samples--categorical) pools its association across. Visible only when that test is selected. The chosen variable is removed from the dependent-variable pool, like covariates and the subject ID.

> **What is a covariate?** A variable you want to "control for" – meaning you suspect it influences the outcome but it's not what you're studying. For example, if you're comparing test scores across teaching methods, students' prior GPA might affect the results. Adding GPA as a covariate statistically removes its influence, so the remaining group difference is more likely due to the teaching method itself.

> **What is a stratifying variable?** A grouping you want to hold constant while testing an association – like a study center, age band, or sex. The Cochran-Mantel-Haenszel test builds a separate contingency table within each level (each *stratum*) and pools the evidence, so a real association isn't washed out – or faked – by differences between strata (the classic Simpson's-paradox trap).

Any variables not assigned to these roles are automatically treated as **dependent variables** – the outcomes you're comparing across groups. If the test you picked accepts only numeric (or only categorical) dependent variables, the ones whose type doesn't match are dropped before the run and a warning toast names them, so a partial exclusion never passes unnoticed.

> **One-sample mode** has no grouping, condition, or subject roles – every selected variable is a dependent variable tested on its own. For the numeric tests a **Reference value (μ₀)** field appears: enter one value that applies to all selected variables, or tick **Set per variable** to give each variable its own μ₀ (the per-variable list is pre-filled with the shared value). For the **Chi-square goodness-of-fit test** the μ₀ field is replaced by an [expected-distribution editor](#expected-distribution), and for the **one-sample proportion test** by a [hypothesised-proportion panel](#hypothesised-proportion); either way the selected *categorical* variables become the dependent variables. The three sub-panels are mutually exclusive – only the one the chosen test needs is shown.

### Groups preview

For independent samples, a live preview shows:

- Number of groups and their sample sizes
- Warnings for very small groups (fewer than 3 observations)
- Number of possible pairwise comparisons
- Warnings if a numeric variable with many unique values is used as a grouping variable (it might be continuous rather than categorical)

When a native factorial test is selected with two or more grouping variables, the preview shows the crossed cells of the full factor crossing – the units the test actually compares – rather than one summary per variable.

For dependent (within-subject) designs, the preview appears once both a condition variable and a [subject ID](#variable-roles) are selected. It shows, per condition variable, the number of conditions × the number of **complete subjects** (those with exactly one row in every condition), plus an excluded-subjects line that splits the reason: incomplete data vs. duplicate (subject, condition) rows.

### Multiple grouping or condition variables

When you select two or more **grouping** variables (independent mode) or two or more **condition** variables (dependent mode) and the chosen test takes a single factor, two strategies are available:

- **Analyze each variable separately** – runs a separate analysis for each variable: one per grouping variable in independent mode, one per condition variable in dependent mode. P-values are adjusted globally across all tests.
- **Combine variables into a single factor** – crosses all the selected factors into combined cells (e.g. Gender × Treatment, or Time × Dose) and analyzes them as one combined factor. Limited to 10,000 combinations; if no cells can be formed, a message tells you so rather than running on an empty design.

> **Separate, combined, or native?** Choose **Analyze each variable separately** when your factors are independent questions ("does gender matter? does dose matter?"), each analyzed on its own. Choose **Combine variables into a single factor** to cross them into combined cells and compare those jointly – but note this is a single-factor omnibus over the cells, *not* a true factorial decomposition: it carries no separate main-effect or interaction terms. For those – a proper F per effect – pick a native factorial test instead: factorial ANOVA (between-subjects) or repeated measures factorial ANOVA / ART-ANOVA (within-subjects), which models every factor at once and hides this strategy choice. The ordered-alternative trend tests (Jonckheere-Terpstra, Page's, Cochran-Armitage) offer only **Analyze each variable separately** – crossing their factors into one combined label would destroy the ordinal order their trend statistic reads, so the combine option is hidden for them.

## Choosing a test

The test dropdown lists every test for your selected [comparison type](#analysis-types) – independent, dependent, mixed, or one-sample. That top-level choice is the **only** thing that hides a test. Every other precondition (an ordinal factor for the trend tests, two or more grouping variables for factorial ANOVA, multiple dependent variables for the MANOVA family) leaves the test selectable: if a precondition isn't met, the analysis stops when you press **Calculate** with a message telling you exactly what to fix, rather than the test silently disappearing from the menu. This keeps every test discoverable.

> **Ordered-alternative (trend) tests.** Three tests ask a sharper question than their general counterparts – not "do the groups differ?" but "do the values rise (or fall) **monotonically** across ordered levels?": **Jonckheere-Terpstra** (independent), **Page's trend test** (dependent), and the **Cochran-Armitage trend test** (independent, binary outcome). They require the factor under test to be an **ordinal** variable, because the trend follows that variable's ascending numeric values – there's no in-app reordering step, so recode the factor to an ordinal (numeric) type in [Data transformation](./data-transformation.md) first if needed, and set its measurement type to ordinal. The tests stay selectable whatever the factor's type, but **Calculate** refuses to run them on a nominal factor – rather than ranking an arbitrary level order and returning a confident-looking wrong answer – and tells you to recode. The factor needs at least three levels, and a dedicated **[Trend direction](#trend-direction)** control picks the hypothesis. When you genuinely expect a consistent trend, these are more powerful than the unordered omnibus (Kruskal-Wallis, Friedman, chi-square), which spend power detecting any difference at all.

### When a test refuses to run

Most preconditions are checked when you press **Calculate**, before anything is fitted, and the run stops with a message naming what to change. A refusal is not a failure of the data – it is the module declining to return a number it can't stand behind. The ones you're most likely to meet:

- **The within-subject factors aren't fully crossed.** **Mixed ANOVA**, **repeated measures factorial ANOVA** and **Mixed MANOVA** need every combination of the within-subject levels to be present. If one is missing, the intra-subject model matrix is rank-deficient and the factorial decomposition doesn't exist, so the design is refused before any fit rather than reported from a model that silently dropped terms. Drop a factor or a level, or supply the missing condition.
- **Not enough subjects for the multivariate fit.** **Repeated measures MANOVA**, **Mixed MANOVA** and repeated measures ANCOVA stop when the residual degrees of freedom fall below the within-contrast dimension – the message gives both numbers and the three ways out (fewer conditions, fewer dependent variables or covariates, more subjects).
- **A group too small for its own covariance matrix.** **Johansen's heteroscedastic MANOVA** inverts each group's covariance matrix separately, so every group needs more complete observations than there are dependent variables, and the dependent variables must stay linearly independent *within* each group. When either fails the message names the offending groups and points to MANOVA, which pools a single matrix instead.
- **A permutation run that wouldn't finish.** The **energy test** can't be interrupted once started, so it refuses samples beyond the work it can complete quickly – past roughly 1300 rows at two dependent variables. The message names MANOVA, Johansen's, and the [**Permutation replications**](./settings.md#permutation-replications) setting as the three ways forward.
- **An empty cell in a Type III factorial.** A Type III model can't be fit at all when a between-subjects cell is empty; see [sums of squares](#sums-of-squares) for the Type II route out.

### Independent samples – numeric

| Test | When to use |
|---|---|
| **Independent samples t-test** | Two groups, equal variances assumed |
| **Welch's t-test** | Two groups, unequal variances (safer default) |
| **Mann-Whitney U test** | Two groups, non-parametric alternative |
| **Brunner-Munzel test** | Two groups, non-parametric – like Mann-Whitney but valid when the groups have different spreads/shapes |
| **One-way ANOVA** | Three or more groups, parametric, equal variances assumed |
| **Welch's one-way ANOVA** | Three or more groups, parametric, unequal variances (the k-group analogue of Welch's t-test) |
| **Brown-Forsythe one-way ANOVA (F\*)** | Three or more groups, parametric, unequal variances – an alternative to Welch's ANOVA with a different weighting; handy as a sensitivity check alongside it |
| **Yuen's trimmed-means t-test** | Two groups, robust – compares trimmed means; stays valid under *both* non-normality and unequal variances. Auto-expands to pairwise for three or more. |
| **Trimmed-means one-way ANOVA (t1way)** | Three or more groups, robust omnibus – the trimmed-means analogue of Welch's ANOVA |
| **Kruskal-Wallis test** | Three or more groups, non-parametric |
| **Jonckheere-Terpstra test** | Three or more **ordered** groups, non-parametric – tests for a monotonic trend across the ordered levels (more focused, and more powerful, than Kruskal-Wallis when you expect a consistent up-or-down trend). Needs an ordinal grouping factor. |
| **Kolmogorov-Smirnov test** | Two groups – do the whole distributions differ (anywhere, not just location)? Auto-expands to pairwise for three or more. |
| **Anderson-Darling k-sample test** | Omnibus version of the above; tests distribution equality across two or more groups at once, more sensitive in the tails |
| **Mutual information test** | Non-parametric omnibus; detects any distributional difference (location, scale, shape). Two or more groups. |
| **Jensen-Shannon divergence test** | Non-parametric distance between group distributions. An omnibus over two or more groups, with an optional pairwise breakdown as its [post-hoc](#post-hoc-tests). |
| **Factorial ANOVA** | Two or more grouping variables analyzed together |
| **ANCOVA** | Groups with continuous covariates to control for |
| **MANOVA** | Multiple dependent variables simultaneously |
| **MANCOVA** | Multiple dependent variables with covariates |
| **Johansen's heteroscedastic MANOVA** | Multiple dependent variables when the groups' covariance matrices differ – the multivariate analogue of Welch's ANOVA |
| **Energy test of equal distributions** | Multiple dependent variables – do the groups share one joint distribution at all (location, spread and shape together)? Distribution-free. |

> **Information-theoretic tests.** Mutual information and Jensen-Shannon divergence measure how much knowing the group label tells you about the outcome – in **bits** (log₂). Unlike t-tests and rank tests, they react to *any* change in the distribution, not just a shift in the mean or median. P-values are computed by shuffling group labels (permutation), so they respond to the [**Permutation replications**](./settings.md#permutation-replications) setting: more replications = finer p-value resolution, longer runtime – a note under the results records the replicate count used. Each has a matching effect size that rescales the statistic against its own ceiling: **Theil's U** for mutual information (*I* divided by the group entropy, so 0.26 bits out of the 1.99 available reads as U = 0.13) and the **normalized Jensen-Shannon divergence** for JSD (the divergence over its log₂ *k* bound). A legend under each statistic states that bound in raw units – *I* cannot exceed H(group), and JSD cannot exceed log₂ *k* for *k* groups. Both are **omnibus** tests over all *k* groups at once: the generalized Jensen-Shannon divergence (Lin 1991) compares every group's distribution against their mixture and is bounded by log₂ *k*, so it is a genuine k-group quantity rather than a pair in disguise. When you want the breakdown, enable its [**Pairwise Jensen-Shannon divergence tests**](#post-hoc-tests) post-hoc, which re-runs the same estimator on each group pair. Not offered for paired or mixed designs, where "did Y shift within subject?" has no clean information-theoretic answer.

> **Why MANOVA instead of separate ANOVAs?** Running a separate ANOVA for each dependent variable inflates false positives (more tests = more chances for a fluke). MANOVA tests all DVs together in one shot, keeping the false positive rate under control. It can also detect group differences that only show up in the *combination* of variables – for example, groups might not differ on anxiety or depression alone, but the joint pattern of both could be significantly different.

> **When the groups' covariance matrices differ.** MANOVA pools one covariance matrix across all groups; when [Box's M](#checking-assumptions) says the groups don't share one, that pooling is what breaks. **Johansen's heteroscedastic MANOVA** weights each group by its own covariance matrix instead – the multivariate analogue of Welch's ANOVA, and the test the Box's M demotion steers to. On unbalanced designs with a 3× SD imbalance it holds its nominal error rate (about .05) where Pillai's trace runs at .41 when the small group is over-dispersed and .002 when the large one is. It still assumes **multivariate normality**, so it is demoted on that failure exactly as the pooled family is. Three consequences follow from estimating a separate covariance matrix per group, and each can refuse the run: every group needs more complete observations than there are dependent variables (each group's matrix is inverted on its own), the dependent variables must stay linearly independent *within* every group, and and there is no pooled error term a contrast of the multivariate omnibus could use – so the omnibus itself carries **no effect size**. Its univariate follow-ups are **Welch's ANOVAs**, not pooled ANOVAs: a pooled follow-up would re-import the assumption the omnibus was chosen to avoid. Each of those follow-ups does carry the **explanatory measure ξ**, and with [post-hoc tests](#post-hoc-tests) enabled it gets pairwise comparisons of its own – **Games-Howell** or **Dunnett's T3 (vs. control)**, both separate-variance methods that need no pooled term.

> **Are these groups different at all?** The **energy test of equal distributions** is a permutation test of the null that every group is drawn from one and the same joint distribution. It assumes no particular distribution, which makes it the fallback the multivariate-normality demotion steers to: on lognormal margins it holds its nominal error rate (.054 / .040 / .032 at 10 / 20 / 40 per group) where Pillai's trace collapses to .020. Read it as *"do these groups differ in any way?"* and **not** as a MANOVA substitute – its null covers spread and shape as well as location, so a pure difference in dispersion rejects at close to 1.00 and a significant result is not on its own evidence that the means differ. That is also why a significant Box's M demotes it: a rejection could no longer be read as a difference in means. Two behaviours are worth knowing before you run it. The dependent variables are **standardized first**, because the statistic is built from distances and would otherwise be dominated by whichever variable has the largest scale – it is the only test in this family that is not scale-invariant. And because a permutation run cannot be interrupted once started, the replicate count **trades down** against a fixed work budget before the run is refused (the card discloses the count actually used, with a floor of 199); past roughly 1300 rows at two dependent variables it [refuses outright](#when-a-test-refuses-to-run) and points you to MANOVA, Johansen's, or the [**Permutation replications**](./settings.md#permutation-replications) setting. Like Johansen's it carries **no post-hoc block**; its follow-ups are per-variable **energy tests**, reported as E-statistics with no F and no df columns. Its effect size is **R²ₑ** – the share of the total dispersion that lies between the groups, read off the DISCO partition of the very distances the statistic is built from. Unlike E itself, which grows with the sample size and the scale of the distances, R²ₑ is bounded and comparable across datasets.

> **Welch's ANOVA when variances differ.** Just as Welch's t-test is the safer choice for two groups, Welch's one-way ANOVA is the robust omnibus for three or more: it doesn't assume equal group variances. When [Levene's test](#checking-assumptions) flags unequal variances in a multi-group design, one-way ANOVA is demoted and Welch's ANOVA stays recommended as the parametric alternative. Its post-hoc is the **Games-Howell** test (see [post-hoc tests](#post-hoc-tests)). The variance-family effect sizes (η², ω², ε²) aren't offered – they partition a total sum of squares that only exists under the equal variances Welch drops. What it offers instead is the **explanatory measure ξ** (see [effect sizes](#effect-sizes)), which is defined without that assumption.

> **Brown-Forsythe F\* – the other heteroscedastic omnibus.** The **Brown-Forsythe one-way ANOVA** answers the same question as Welch's ANOVA but weights the group variances differently (by 1 − nᵢ/N rather than by precision), which can behave better when group distributions are skewed. The two usually agree; reporting F\* alongside Welch's F makes a good sensitivity check, and Games-Howell serves as the post-hoc for both. Its effect size is the **explanatory measure ξ**, and η²/ω²/ε² are omitted, for the same reason as Welch's. Don't confuse it with the *assumption check* of the same name: the "Brown-Forsythe" you'll see under [checking assumptions](#checking-assumptions) is the median-centered Levene's test of equal variances, while this F\* test compares the group **means**.

> **Robust trimmed-means tests (Yuen and t1way).** Welch's tests fix unequal variances but still assume each group is roughly normal; the rank tests handle non-normality but their "location" reading assumes the groups share a shape. When **both** problems hit at once – heavy tails *and* unequal spread – neither is ideal. The trimmed-means family compares the groups after **trimming** a fixed fraction off each tail (20% per tail by default; see [trim level](#trim-level)), which throws out the outliers that wreck a mean while a Welch-style adjustment soaks up the unequal variances. **Yuen's test** is the two-group version (it auto-expands to a pairwise table for three or more); **t1way** is the k-group omnibus, the robust counterpart of Welch's ANOVA, with **lincon** as its post-hoc (see [post-hoc tests](#post-hoc-tests)). Their effect size is the **explanatory measure ξ** (see [effect sizes](#effect-sizes)). Because trimming spends a little power when the data really is clean, [assumption checks](#checking-assumptions) keep these recommended with a "robust fallback" note when assumptions hold, and promote them – note dropped – precisely in that non-normal *and* heteroscedastic corner where they shine.

> **Brunner-Munzel vs. Mann-Whitney.** Mann-Whitney's familiar "the groups differ in location" reading quietly assumes the two distributions have the *same shape* – only shifted. When the spreads or shapes differ, that interpretation breaks down. The Brunner-Munzel test makes no such assumption: it estimates p̂ = P(a random value from group 1 is smaller than one from group 2) and tests whether it equals ½, staying valid under unequal variances. So when [Levene's test](#checking-assumptions) flags unequal variances in a two-group design, Mann-Whitney keeps a caveat steering you here. Its effect sizes are the **common-language ES** (p̂ itself) and **Cliff's δ**. At small samples the p-value comes from the **exact permutation** distribution (Neubert & Brunner 2007) – every group-label split enumerated – rather than from the Satterthwaite approximation, which is least dependable in exactly that range; once enumerating all the splits stops being feasible the test reverts to the asymptotic form, which is accurate by then. A note under the results says when the permutation branch ran, and on that branch the statistic and df columns stay blank, since the exact p isn't derived from them.

> **Distribution-equality tests (KS and Anderson-Darling).** Most tests above ask about a *single* feature – the mean, the median, the location. The **Kolmogorov-Smirnov** test instead asks the broad question: *do the two distributions differ at all?* Its statistic **D** is the largest gap between the two groups' cumulative distribution curves, so it picks up differences in spread, skew, or shape that a location test would miss. The card breaks that gap apart in a **[Where the distributions separate](#where-the-distributions-separate)** table – D⁺, D⁻, and the value of the variable at which each is reached – and marks the winning gap on the [ECDF plot](#ecdf-plot). **Anderson-Darling** is the omnibus k-sample counterpart – it tests all groups in one shot and weights the tails more heavily, making it the more sensitive choice when differences live in the extremes. Use KS for a focused two-group comparison (it auto-expands to a pairwise table for three or more), and Anderson-Darling when you want a single all-groups verdict. Neither has a separate effect-size column – D (and the standardized AD statistic) is its own magnitude. When ties are present – where the asymptotic k-sample AD p-value isn't valid – **or when any group holds fewer than 5 observations**, which the `kSamples` package itself flags as making the asymptotic p unreliable, Anderson-Darling recomputes its p-value by seeded simulation (the [**Permutation replications**](./settings.md#permutation-replications) setting) and a note under the results records the replicate count; the AD statistic itself is unchanged. And if the pooled sample is too small to rank at all – two observations, or every group a singleton – the variable reports an error instead of the statistic-free p = 1 that would otherwise read as a confident "no difference". KS has a disclosure of its own: once n₁·n₂ reaches 10,000 it drops the exact null distribution for the asymptotic approximation (R's own threshold), and a note under the results says so rather than letting the switch pass silently. Both of these read one variable at a time; when you want the same "do they differ at all?" question asked of several dependent variables **jointly**, the multivariate counterpart is the **energy test of equal distributions** described above.

### Independent samples – variance

These tests ask a different question from every test above: not *"do the groups differ in location?"* but *"do the groups differ in spread?"* The hypothesis is on the variance itself.

| Test | When to use |
|---|---|
| **F-test for equality of variances** | Two groups – is one more variable than the other? Parametric (assumes normality). Auto-expands to pairwise for three or more. |
| **Bartlett's test** | Three or more groups, parametric – sensitive to non-normality. |
| **Fligner-Killeen test** | Three or more groups, rank-based – robust to non-normality; the safe default when the data isn't normal. |

> **When is spread the question?** Usually you compare means. But sometimes *consistency* is what matters: two teaching methods might reach the same average score while one produces far more variable outcomes, or a process change might leave the mean on target while tightening (or loosening) tolerances. These tests target that directly. The **F-test** handles two groups and reports the **variance ratio** s₁²/s₂² as its effect size (1 = equal spread) with a confidence interval; **Bartlett's** and **Fligner-Killeen** are the omnibus k-group versions. The F-test can be run one- or two-sided (see [test direction](#test-direction)) – a one-tailed F-test asks whether one group's **variance** is the larger, so its **Group 1 > Group 2** option is read on the variances, not the means; the two omnibus tests are two-sided only.

> **Normality matters here – pick accordingly.** Bartlett's test and the F-test assume each group is normal, and unlike the t-test and ANOVA they stay sensitive to that assumption even at large samples (there's no central-limit rescue). The **Fligner-Killeen** test works on ranks and is robust to non-normality, so it's the dependable choice when normality is in doubt. When [assumption checks](#checking-assumptions) flag non-normality, the F-test and Bartlett's are demoted and Fligner-Killeen stays recommended – the dispersion-family analogue of the location tests' parametric-to-non-parametric fallback.

> **These are not Levene's test.** Levene's test (median-centered Brown-Forsythe) runs automatically as an *assumption check* for the location tests – the gatekeeper that decides whether the equal-variance t-test or ANOVA is safe (see [checking assumptions](#checking-assumptions)). The tests here make unequal variance the *hypothesis you're testing*, reported with a p-value and (for the F-test) an effect size – not a pre-flight check on some other test.

### Dependent samples – numeric

| Test | When to use |
|---|---|
| **Paired samples t-test** | Two conditions, parametric. Auto-expands to pairwise for three or more. |
| **Wilcoxon signed-rank test** | Two conditions, non-parametric. Auto-expands to pairwise for three or more. |
| **Paired sign test** | Two conditions, most robust – counts only the *direction* of each pair's change, so it assumes nothing about the shape of the differences. Auto-expands to pairwise for three or more. |
| **Repeated measures ANOVA** | Three or more conditions, parametric |
| **Friedman test** | Three or more conditions, non-parametric |
| **Page's trend test** | Three or more **ordered** conditions, non-parametric – tests for a monotonic trend across conditions (the within-subjects analogue of Jonckheere-Terpstra). Needs an ordinal condition factor; directional only. |
| **Repeated measures MANOVA** | Multiple DVs across conditions |

> **The paired sign test is the signed-rank test's fallback.** Wilcoxon's signed-rank test ranks the *magnitudes* of the differences, which is what buys it power – and what makes it assume those differences are distributed symmetrically around their centre. The sign test throws the magnitudes away and counts only how many pairs moved up versus down, so no shape assumption survives. That is why the [symmetry check](#checking-assumptions) steers here when it fails. It reports the count of positive differences out of the effective n (pairs with a zero difference are dropped as ties, and the number dropped is noted below the table), the **median of the differences** with a distribution-free confidence interval read off their order statistics, and **r₊ = 2p̂ − 1** as its effect size – 0 when the pairs split evenly, ±1 when every pair moves the same way. Because the interval's endpoints can only be whole observations, its achieved coverage steps to the nearest attainable level rather than landing exactly on the one you set, and a note reports the level actually reached.

### One sample – numeric

Each test compares one variable's location to the reference value μ₀:

| Test | When to use |
|---|---|
| **One-sample t-test** | Mean vs. μ₀, roughly normal data. Effect size: Cohen's d / Hedges' g, (mean − μ₀) / SD |
| **One-sample Wilcoxon signed-rank test** | Pseudo-median vs. μ₀, non-parametric. Effect size: rank-biserial r / Wilcoxon r |
| **Sign test** | Median vs. μ₀, most robust – counts only how many observations fall above μ₀ (ties at μ₀ are dropped; the number dropped is reported below the table). The test statistic is shown as the count above μ₀ out of the effective n (ties excluded), with a distribution-free confidence interval for the median beside it. Effect size: proportion above μ₀ |

> **Which one-sample test?** The t-test has the most power when the data is roughly normal. The Wilcoxon signed-rank test is the non-parametric fallback and uses the ranked magnitudes of the deviations from μ₀. The sign test is the most robust – it ignores magnitude entirely and only asks whether values land above or below μ₀ – which makes it valid for ordinal data or heavy outliers but lower in power. All three report a confidence interval for the estimated location itself – the mean, the pseudo-median, or the median – not a between-condition difference. The sign test's is the conventional distribution-free median interval, read off the sample's order statistics through the binomial distribution: because only whole observations can serve as endpoints, its achieved coverage steps to the nearest attainable level rather than landing exactly on the one you set, and at very small n no pair of order statistics reaches that level at all, so the interval is reported as [−∞, ∞]. The reference value μ₀ each variable was tested against is shown as a column in the results table – handy when **Set per variable** gives each variable its own μ₀. [Assumption checks](#checking-assumptions) test the variable's normality and steer you to the t-test (normal) or the rank-based tests (not normal).

> **Equivalence directions in one-sample mode.** The one-sample t-test and Wilcoxon signed-rank test offer the full [equivalence family](#test-direction) (TOST, non-inferiority, superiority, minimal effect) against μ₀ – the standardized bound uses the variable's own SD (t-test) or MAD (Wilcoxon). The sign test keeps only the standard two-tailed and one-tailed directions.

### One sample – categorical

| Test | When to use |
|---|---|
| **Chi-square goodness-of-fit test** | One categorical variable's observed distribution vs. an expected distribution you specify. Effect size: Cohen's w |
| **One-sample proportion test** | One category's share vs. a hypothesised proportion π₀ – an exact binomial test. Effect size: Cohen's h |

> **Testing one rate against a number.** The **one-sample proportion test** answers "is this rate different from π₀?" – is the response rate really 40%, is the defect share above the 2% the contract allows, does option C get its predicted third of the votes. You pick the **[category counted as a success](#hypothesised-proportion)** for each variable and enter π₀; every other category of that variable counts as a failure. With a binary variable that is the classic two-outcome case; with a variable that has more categories, the test asks about the **marginal share** of the level you named, which is why the card prints that level in its own **Category** column. The p-value is exact (`binom.test`, no χ² approximation), and the interval beside p̂ is the **Clopper-Pearson** interval the exact test inverts – so the interval excludes π₀ exactly when the test rejects. Its effect size is **Cohen's h** = 2·asin(√p̂) − 2·asin(√π₀), on Cohen's own 0.2 / 0.5 / 0.8 scale, with bounds carried through the same arcsine map so they too agree with the p-value.

> **Goodness-of-fit or proportion test?** Use the **goodness-of-fit test** when the hypothesis is about the *whole* distribution over three or more categories (a fair die, a 9:3:3:1 ratio, a 40/35/25 split). Use the **one-sample proportion test** when it is about a *single* rate, and you want an exact p-value and a confidence interval on p̂ itself – goodness-of-fit gives neither. On a binary variable the two overlap; the proportion test is the sharper tool there.

> **What the goodness-of-fit test does.** It compares how often each category *actually* occurred with how often you *expected* it to, then asks whether the gap is bigger than sampling noise. Classic uses: is a die fair (every face equally likely)? Do customer visits match a 40/35/25 split across three branches? Does an observed genotype count match the 9:3:3:1 a genetic model predicts? You enter one **relative weight** per category in the [expected-distribution editor](#expected-distribution); weights are normalised to probabilities automatically, so they can be proportions (0.4, 0.35, 0.25), raw counts, or whole-number ratios (9, 3, 3, 1) – whichever reads most naturally.

> **The only one-sample test for categorical data.** The t-test, Wilcoxon, and sign test above all need a numeric variable and a μ₀; the goodness-of-fit test instead takes a categorical variable and an expected distribution. Selecting it swaps the **Reference value (μ₀)** input for the expected-distribution editor and restricts the dependent variables to categorical ones. For an association *between two* categorical variables, use the [chi-square test of independence](#independent-samples--categorical) instead – goodness-of-fit is about a single variable's shape against a fixed expectation.

### Independent samples – categorical

| Test | When to use |
|---|---|
| **Chi-square test of independence** | Association between categorical variables |
| **Fisher's exact test** | Small or sparse tables, where the chi-square approximation is unreliable – exact for 2×2 and 2×k at any sample size |
| **Cochran-Armitage trend test** | A **binary** outcome across three or more **ordered** groups – does the event proportion trend up or down with the ordered factor? Needs an ordinal grouping factor. |
| **Cochran-Mantel-Haenszel test** | Association between a categorical outcome and a grouping factor while **controlling for a third (stratifying) variable**. Needs a [**stratifying variable**](#variable-roles). Effect size (2×2×K only): common odds ratio. |

> **Cochran-Armitage vs. chi-square.** A chi-square test on a 2×k table asks whether the event rate differs across the columns *in any way*; with ordered columns (e.g. dose 1/2/3/4) that wastes power, because it ignores the ordering. The Cochran-Armitage test instead looks for a **linear trend** in the event proportion along the ordered factor, using the factor's actual numeric values as the trend scores (so unequal spacing like 1/5/10 is honored). The modelled "event" is the higher of the two outcome categories – a note below the table records which value that is. Like the other χ²-derived categorical tests, it also checks expected-cell adequacy (Cochran's rule) and notes the minimum expected count when the table is too thin for the approximation.

> **When to reach for Cochran-Mantel-Haenszel.** Use it when a simple two-way association might be confounded by a third grouping. Each stratum (level of the stratifying variable) gets its own contingency table; the test asks whether the outcome↔group association holds **consistently across strata** once you pool them. The general form handles any number of outcome and group categories (I×J×K) and reports a χ² with df = (I−1)(J−1). The special **2×2×K** case (binary outcome, two groups) additionally reports a **common odds ratio** – a single pooled OR summarising the association – plus a **Breslow-Day** check (see [reading results](#categorical-tests-chi-square-fishers-exact-etc)) that the per-stratum odds ratios are similar enough for that pooled OR to be meaningful.

### Dependent samples – categorical

| Test | When to use |
|---|---|
| **McNemar's test** | Two conditions, binary outcomes. Auto-expands to pairwise for three or more conditions. |
| **Stuart-Maxwell test** | Two conditions, 3+ category outcomes. Auto-expands to pairwise for three or more conditions. |
| **Cochran's Q test** | Three or more conditions, binary outcomes |

> **Continuity correction.** The chi-square test of independence, McNemar's test, the Mann-Whitney U test, and the Wilcoxon signed-rank tests (paired and one-sample) all support a [continuity correction](#continuity-correction), **on by default** to match R and SPSS. See the configuration section for what it does and when to turn it off.

> **Duplicate (subject, condition) rows in paired data.** Paired and repeated-measures tests assume one observation per subject per condition. If your data has duplicates, the reshape step **averages** each cell over its rows – marginalizing whatever factor the design left out – rather than picking one row and discarding the rest. How many subjects were affected is reported in a warning toast *and* in the notes under the results table, so you can check whether averaging was the right thing to do and re-run on a corrected file if not.

### Mixed model

| Test | When to use |
|---|---|
| **Mixed ANOVA** | Between + within factors, single DV, parametric |
| **ART-ANOVA (Aligned Rank Transform)** | Between + within factors, single DV, non-parametric |
| **Mixed MANOVA** | Between + within factors, multiple DVs |

> **Any number of factors.** All three mixed tests take *any* number of grouping (between-subjects) variables and *any* number of condition (within-subjects) variables – they're not limited to one of each. Every main effect and every interaction across the full crossing is reported. Mixed ANOVA and ART-ANOVA also accept multiple dependent variables (analyzed one at a time); Mixed MANOVA models the dependent variables jointly.

> **When ART-ANOVA?** ART-ANOVA is the non-parametric fallback for a mixed design – reach for it when residuals are non-normal and Mixed ANOVA's assumptions don't hold. It aligns and ranks the data so that ordinary factorial inference can be run on the ranks, which (unlike a plain rank transform) keeps main effects and interactions separable. It is **strictly factorial**: it reports F tests and partial η² for every effect and supports per-effect post-hoc contrasts and descriptive statistics, but does **not** support covariates (see [ART-ANOVA results](#art-anova)).

> **Parametric vs. non-parametric:** parametric tests (t-test, ANOVA) assume your data is roughly normally distributed and have more statistical power – they're better at detecting real differences. Non-parametric tests (Mann-Whitney, Kruskal-Wallis) make fewer assumptions and are safer when your data is skewed or has outliers, but they need larger samples to detect the same effects. Use [assumption checks](#checking-assumptions) to help decide.

> **Two-sample tests with more than two groups (or conditions):** if you select a two-sample test (e.g. t-test) but have more than two groups – or a paired two-condition test (paired t-test, Wilcoxon signed-rank, McNemar, Stuart-Maxwell) whose condition variable has more than two levels – the module automatically runs all pairwise comparisons. Each pair is tested directly – no separate omnibus test is required first – and the resulting p-values enter the run-wide [p-value adjustment](#p-value-adjustment).

> **Which error term each pair uses.** Whether the pairs share a single spread estimate follows the variance assumption your chosen test already makes:
> - **Independent (Student's) t-test** – pools the within-group spread across *all* groups (the ANOVA error term, with N − k degrees of freedom), so each pair borrows strength from the full sample. This is the standard pooled-SD pairwise family – equivalent to R's `pairwise.t.test(pool.sd = TRUE)`, a Fisher's LSD contrast – and is more powerful than testing each pair in isolation. It's valid precisely because the Student t-test already assumes equal variances across groups.
> - **Welch's t-test** – keeps a separate-variance error term for each pair (the **Games-Howell** approach), the correct choice when group variances differ.
> - **Mann-Whitney U, paired t-test, Wilcoxon signed-rank** – each pair is tested on its own data, matching R's `pairwise.wilcox.test` / `pairwise.t.test(paired = TRUE)`.

## Configuration

### Test direction

For two-sample tests (t-tests, Mann-Whitney, Wilcoxon), one-sample tests, the **F-test for equality of variances**, and Fisher's exact test on 2×2 data, the **Test direction** dropdown offers two groups of options. Hidden for multi-group tests. The Equivalence group is available for the two-sample and one-sample t-tests and rank tests, but hidden for the sign test, the F-test, and for Fisher's exact.

**Standard:**

- **Two-tailed** (default) – tests whether the groups differ in either direction
- **One-tailed: Group 1 > Group 2** – tests a specific directional hypothesis
- **One-tailed: Group 1 < Group 2**

The option labels adapt to the design: independent tests read **Group 1 ≠/>/< Group 2**, paired tests **Condition 1 ≠/>/< Condition 2**, and one-sample tests **Variable ≠/>/< μ₀**.

> **One-tailed Fisher's exact.** A directional Fisher's exact test exists only for 2×2 tables – the r×c (Freeman-Halton) generalization has no one-tailed form – so the direction control appears only when the grouping variable and every selected dependent variable have exactly two realized categories, and **Calculate** re-checks the realized table, stopping with a message if it isn't 2×2. The direction is about the **odds**: a note under the results spells out the tested alternative – whether the odds of the first outcome category are greater (or less) in group 1 than in group 2.

> **When to use one-tailed tests:** only when you have a strong prior reason to expect a specific direction *before* looking at the data. One-tailed tests are more powerful for detecting the predicted direction but completely miss effects in the opposite direction. When in doubt, use two-tailed.

**Equivalence:**

- **Equivalence (TOST)** – tests whether the difference falls *within* ±Δ (i.e. the groups are practically equivalent)
- **Non-inferiority** – tests whether Group 1 is not worse than Group 2 by more than Δ
- **Superiority** – tests whether Group 1 exceeds Group 2 by at least Δ
- **Minimal effect (MET)** – tests whether the difference is at least Δ (confirms a meaningful effect exists)

When you select any equivalence option, an **Equivalence bound (Δ)** input appears. You specify the bound as either:

- **Raw** – in the same units as your dependent variable
- **Standardized** – automatically converted to raw units using the standardizer that matches the chosen test, and the radio label names which one that is: **Standardized (Cohen's d)** for the classical independent t-test (pooled SD) and for the one-sample t-test (the variable's own SD), **Standardized (Welch's d)** for Welch's t-test (the average-variance denominator √[(s₁² + s₂²) / 2]), **Standardized (Cohen's dz)** for paired tests (the standard deviation of the differences), and **Standardized (robust spread)** for the rank tests, which standardize by the MAD rather than by an SD.

Non-inferiority and superiority are one-sided, so they also need to know which tail carries the benefit. A **Preferred direction** dropdown appears for those two options only – TOST and minimal effect are symmetric in Δ, so it stays hidden for them – offering **Higher values are better** (the default) and **Lower values are better**. It flips the inequality that gets tested: with higher-is-better, non-inferiority asks whether Group 1 − Group 2 > −Δ; with lower-is-better it asks whether Group 1 − Group 2 < Δ, which is the right reading when the outcome is an error rate, a symptom score, or a completion time. The bounds note under the results names the hypothesis that was actually tested – **Non-inferiority (higher is better)**, **Superiority (lower is better)**, and so on – so the choice stays visible in the output rather than only in the form.

> **What is equivalence testing?** A standard test asks "are these groups different?" A non-significant result does *not* mean they're the same – you simply failed to detect a difference. Equivalence testing flips the question: "are these groups similar *enough*?" It uses Two One-Sided Tests (TOST) to demonstrate that the difference falls within a pre-specified bound Δ. A significant TOST result is positive evidence of equivalence, not just absence of evidence.

> **Choosing Δ:** the equivalence bound should reflect the smallest difference that would be practically meaningful in your domain. For example, if a 3-point difference on a 100-point scale is negligible in your field, set Δ = 3 (raw) or estimate the standardized equivalent. A bound that's too wide makes equivalence easy to establish but unimpressive; a bound that's too narrow requires very large samples.

> **Non-inferiority and superiority** are one-sided variants of equivalence testing commonly used in clinical trials. Non-inferiority asks "is the new treatment not meaningfully *worse* than the standard?" – useful when a cheaper or safer alternative is acceptable if it isn't worse by more than Δ. Superiority asks "is the new treatment meaningfully *better* by at least Δ?" – a stronger claim than ordinary significance.

> **Minimal effect testing (MET)** is the opposite of equivalence testing. Where TOST tries to show the difference is *small enough*, MET tries to show the difference is *big enough* – that it exceeds a meaningful threshold Δ. This is useful when you want to confirm not just that an effect exists (p < .05) but that it's large enough to matter practically.

### Trend direction

For the ordered-alternative tests (Jonckheere-Terpstra, Page's trend test, Cochran-Armitage), a dedicated **Trend direction** dropdown replaces the standard test-direction control:

- **Increasing trend** – values rise as the ordinal factor increases
- **Decreasing trend** – values fall as the ordinal factor increases
- **Any monotonic trend (two-sided)** – a trend in either direction

> **Page's trend test is directional only.** Because it tests a *specified* ordering, Page's L has no natural two-sided form, so the dropdown offers just increasing and decreasing for it. The increasing/decreasing choice is about the *direction* of the trend, not a one- vs. two-tailed mean comparison – pick it from your hypothesis before running, the same discipline as any one-tailed test.

### Expected distribution

Shown only for the **Chi-square goodness-of-fit test**. One block appears per selected categorical variable, seeded with that variable's observed categories at equal weight. For each category you enter a **relative weight**; the running **Σ** total and each row's **≙ %** hint update live to show the normalised probability the weights imply.

- **Add category** – append a category the sample never contained, with an editable name and weight. It enters the test at an observed count of 0, so the model can be penalised for a level that *should* have appeared but didn't.
- **Remove category** (✕) – drops an added category. Observed categories can't be removed (deleting one would silently discard real data).
- **Reset to uniform** – sets every weight back to 1 (equal probabilities) – the "is it uniform?" null.

> **Weights, not probabilities.** You never have to make the numbers sum to 1 – enter whatever is easiest and the editor normalises for you. For a fair-die hypothesis, leave every weight at 1. For a 2:1 expectation, enter 2 and 1. For published proportions, type them straight in (0.6, 0.3, 0.1). The **≙ %** hint always shows where each weight lands after normalisation.

> **Each weight must be a positive number, and you need at least two categories.** A weight of 0 (or blank/negative) is rejected, because a category genuinely expected to never occur makes the χ² undefined – drop the category instead. The expected set is authoritative: if it lists a category the data lacks, that category is tested at observed 0 rather than being dropped.

### Hypothesised proportion

Shown only for the **one-sample proportion test**, in place of the **Reference value (μ₀)** field:

- **Hypothesised proportion (π₀)** – the proportion every selected variable is tested against. A single value between 0 and 1, shared by all of them; **Calculate** stops with a message if it is blank or out of range.
- **Category counted as a success** – one dropdown per selected variable, listing that variable's own categories. Every other category of that variable counts as a failure. Each variable needs one chosen before the run.

> **Naming the success is not a formality.** "Is the rate 0.4?" is only a question once you say *the rate of what*. On a binary variable either choice gives the mirror-image answer (p̂ and 1 − p̂ against π₀ and 1 − π₀). On a variable with more categories the choice decides which marginal share is being tested, so the card repeats it in a **Category** column beside the result – a table of proportions with no category names would be unreadable.

### Post-hoc tests

Available for the multi-group and multi-condition tests (ANOVA, Welch's and Brown-Forsythe ANOVA, the trimmed-means ANOVA, Kruskal-Wallis, the Anderson-Darling k-sample test, Bartlett's test, Fligner-Killeen, the mutual information test, the Jensen-Shannon divergence test, repeated measures ANOVA, Friedman, factorial ANOVA, repeated measures factorial ANOVA, mixed ANOVA, ANCOVA, ART-ANOVA, repeated measures factorial ART, the chi-square test of independence, Fisher's exact test, Cochran's Q, MANOVA, MANCOVA, repeated measures MANOVA, mixed MANOVA, and Johansen's heteroscedastic MANOVA). The one multivariate test **without** a post-hoc block is the **energy test of equal distributions** – it leaves no error term a contrast could be built on, and emits its univariate follow-ups automatically instead. **Johansen's** compares on those per-variable follow-ups rather than on the multivariate omnibus, and offers only the separate-variance methods its heteroscedastic premise allows: **Games-Howell** and **Dunnett's T3**. Check **Include post-hoc tests** and select a method:

- **Pairwise contrasts with exact multivariate-t adjustment** – the **default** wherever a method dropdown appears (one-way ANOVA, factorial ANOVA, ANCOVA, repeated measures ANOVA, repeated measures factorial ANOVA, mixed ANOVA, MANOVA, MANCOVA, repeated measures MANOVA, mixed MANOVA). It contrasts exactly the pairs Tukey does, but calibrates them against the **exact multivariate t** over the contrasts' own correlation matrix instead of the studentized range. On a balanced between-subjects design the two agree to rounding; the studentized range is only conservative once the design is unbalanced, and that is where this option buys power – at group sizes 60/25/60/60 its p-values are uniformly smaller, by up to 7%. The correction *is* the method, so no separate p-adjustment is applied, and the card's **Method** line records it as "multivariate t (exact)"
- **Tukey HSD** – for the ANOVA-family tests: the classical studentized-range comparison of all pairs, controlling the family-wise error internally. Pick it when you want parity with output from another package
- **Pairwise t-tests using pooled ANOVA error** – for ANOVA-family tests: all pairwise mean differences share the omnibus √MSE error term, each with its difference, CI, and t, and your configured [p-adjustment](./settings.md#multiple-comparison-adjustment) applied across the pairs. When an adjustment is active the intervals widen to the Bonferroni simultaneous critical value – no interval is dual to a step-down or FDR procedure, so emmeans substitutes the Bonferroni one. Under **Holm, Hommel, Hochberg, Benjamini-Hochberg and Benjamini-Yekutieli** that means a row **can** be significant while its interval still includes zero; a caveat under the table says so whenever one of those five is active. Both halves stay individually valid – the p controls the error rate across the tests, the interval is a valid simultaneous set – they simply aren't two views of one procedure. The caveat is suppressed for a single-contrast family, where every adjustment collapses to the raw p
- **Dunnett's test (vs. control)** – for the ANOVA and MANOVA families (one-way ANOVA, factorial ANOVA, ANCOVA, repeated measures ANOVA, repeated measures factorial ANOVA, mixed ANOVA, repeated measures MANOVA, mixed MANOVA), within-subject factors included: compares every level against a single **control** level rather than every pair, using the multivariate-t distribution so the family-wise error is controlled internally over just the *k* − 1 control comparisons (no separate adjustment, like Tukey). Reports the difference, CI, t, and p for each contrast against the control
- **Games-Howell** – for Welch's and Brown-Forsythe ANOVA: pairwise separate-variance t-tests with a studentized-range reference, so it stays valid under unequal variances and controls the family-wise error internally (no separate adjustment, like Tukey)
- **Dunnett's T3 (vs. control)** – for Welch's and Brown-Forsythe ANOVA: the many-to-one counterpart of Games-Howell, for when one group is a genuine baseline. Each treatment-vs-control contrast keeps its own separate-variance t and Welch-Satterthwaite df, referred to the studentized maximum modulus over just the *k* − 1 contrasts, so the family-wise error is controlled internally (no separate adjustment). Reports the difference, CI, t, and p per contrast
- **Pairwise trimmed-means comparisons (lincon)** – for the trimmed-means ANOVA (t1way): pairwise trimmed-mean differences at the same [trim level](#trim-level) as the omnibus. The confidence intervals control the family-wise error internally; the p-values get your configured [p-adjustment](./settings.md#multiple-comparison-adjustment)
- **Dunn's test** – for Kruskal-Wallis: all pairwise rank comparisons, with your configured p-adjustment applied
- **Dunn's test (vs. control)** – for Kruskal-Wallis: the rank-based many-to-one counterpart of Dunnett – Dunn's z restricted to the comparisons against a chosen **control** group, with your configured [p-adjustment](./settings.md#multiple-comparison-adjustment) applied over just those *k* − 1 contrasts
- **Conover's test** – for Friedman: t-distributed pairwise comparisons, more powerful than Nemenyi, with your configured p-adjustment applied
- **Nemenyi test** – for Friedman: studentized-range reference, controlling the family-wise error internally (no separate adjustment)
- **Pairwise McNemar tests** – for Cochran's Q: every pair of conditions compared with McNemar's test (the exact binomial form when discordant pairs are few, otherwise the asymptotic χ²), with your configured [p-adjustment](./settings.md#multiple-comparison-adjustment) applied across the pairs. Only p-values are reported – McNemar's per-pair statistic carries no direction for a matrix cell – but each pair's **2×2 table** of agreements and discordances is shown beneath the grid, so the counts that drove each p-value are visible rather than hidden behind the omnibus table (the same disclosure the chi-square / Fisher pairwise path gives). It is the sole method offered for Cochran's Q, so the dropdown shows just this one option
- **Pairwise Jensen-Shannon divergence tests** – for the Jensen-Shannon divergence test: the same balanced-JSD estimator and permutation p-value as the omnibus, restricted to each group pair, with your configured [p-adjustment](./settings.md#multiple-comparison-adjustment) applied across the pairs. It is the sole method offered for that test. Because a divergence is symmetric and carries no direction, the matrix cells are *not* sign-flipped across the diagonal and no difference column appears – the legend drops the "row − column" clause accordingly. Each pair re-draws its own permutation replicates, so runtime scales with the number of pairs and the [**Permutation replications**](./settings.md#permutation-replications) setting

> **Control group** – when you select a many-to-one method (Dunnett's test, Dunnett's T3, or Dunn's test vs. control), a **Control group** block appears with **one labelled dropdown per factor the run will fit** – every grouping variable in [batch mode](#batch-analysis), every factor of a factorial or mixed design, and the within-subject factors too. Each lists that factor's own levels and defaults to its first. Pick the reference level the other levels are compared against; choosing a control is what makes these tests possible – the comparison is always *each treatment vs. the one control*, never treatment-vs-treatment. Two things can still displace your choice at run time, and both are stated above the post-hoc table so a substituted baseline can't be mistaken for the one you picked: the level isn't a level of the variable being fitted ("The selected control group is not a level of this variable; X was used instead."), or it is a level but has no usable data left after missing-value filtering ("The selected control group has no usable data for this variable; X was used instead.").

> **Many-to-one vs. all pairwise.** Reach for a vs.-control method when one group is a genuine baseline – a placebo, a standard treatment, "no intervention" – and the only comparisons you care about are *treatment vs. control*. Because it makes only *k* − 1 comparisons instead of all *k*(*k* − 1)/2, it spends less of your error budget on contrasts you don't need, leaving **more power** to detect the ones you do. If instead you want to know which of *every* pair of groups differ, use the all-pairwise methods (Tukey, Games-Howell, Dunn's test).

For tests that use [emmeans](#reproducibility) (one-way ANOVA, factorial ANOVA, ANCOVA, repeated measures ANOVA, repeated measures factorial ANOVA, mixed ANOVA, MANOVA, MANCOVA, repeated measures MANOVA, and mixed MANOVA), the methods contrast the same pairs and differ only in how the family is corrected: the **exact multivariate-t** option carries its own simultaneous calibration, the **Tukey HSD** option selects Tukey's adjustment for single-factor pairs, and the **Pairwise t-tests** option selects whichever method is configured under [multiple comparison adjustment](./settings.md#multiple-comparison-adjustment) (Bonferroni / Holm / Hommel / Hochberg / FDR / none). For interaction cell-pairs, where Tukey isn't well-defined, the configured adjustment method is used directly.

> **ART-ANOVA's method dropdown only chooses the correction.** Because aligned-rank contrasts re-align the ranks separately for each term, the mean-based machinery above doesn't apply: checking **Include post-hoc tests** runs ARTool's `art.con` contrasts either way, for both **ART-ANOVA** and **repeated measures factorial ART**. What the dropdown picks is how each effect's family of pairs is corrected – **Tukey HSD** (the default) or **Pairwise t-tests**, which hands the family to your configured [p-adjustment](./settings.md#multiple-comparison-adjustment) instead. Interaction contrasts take the configured adjustment whichever you pick, since Tukey isn't defined for the difference-of-differences form they use. See [ART-ANOVA results](#art-anova) for the contrast types it produces.

> **MANOVA and MANCOVA.** Checking **Include post-hoc tests** compares the grouping factor's levels on each dependent variable's univariate follow-up, and a method dropdown of its own offers **pairwise contrasts with the exact multivariate-t adjustment** (the default), **Tukey HSD**, or **pairwise t-tests** handing the family to your configured [p-adjustment](./settings.md#multiple-comparison-adjustment). Under MANCOVA the contrasts are covariate-adjusted, like the adjusted means above them.

> **Repeated measures MANOVA and mixed MANOVA.** Checking **Include post-hoc tests** runs pairwise **condition contrasts** (estimated marginal means, emmeans) for each dependent variable. Both offer a method dropdown of their own – **exact multivariate-t** (the default), **Pairwise t-tests** with your configured [p-adjustment](./settings.md#multiple-comparison-adjustment), or **Dunnett's test (vs. control)** – because their within-bearing contrasts carry their own per-contrast error terms, which is what makes a test-chosen correction meaningful for them. Tukey isn't among the options here. The checkbox appears once the within-subject factor has three or more conditions (with only two there's a single contrast, so it's omitted). **Mixed MANOVA** follows the same pattern except that its contrasts are organized **per effect** across the between × within crossing rather than over conditions alone, and its **Adjusted means (estimated marginal means)** table appears whether or not the checkbox is on. See [MANOVA / MANCOVA results](#manova--mancova).

> **Why post-hoc tests?** An overall ANOVA tells you *something* differs among the groups, but not *which* groups differ from which. Post-hoc tests make all pairwise comparisons while adjusting for the fact that you're running many tests at once.

### Pairwise comparison format

When pairwise comparisons are produced (from post-hoc tests or automatic expansion):

- **Matrix format** – symmetric matrix with groups on both axes; each cell shows statistic, p-value, and optionally effect size and CI
- **Long format** – flat table with one row per comparison pair

The many-to-one post-hoc methods (**Dunnett's test**, **Dunnett's T3**, **Dunn's test vs. control**) always render in the long format regardless of this setting – their *k* − 1 control contrasts would leave a *k*×*k* matrix almost empty.

### Continuity correction

The **Apply continuity correction** checkbox appears once you select the **chi-square test of independence**, **McNemar's test**, the **Mann-Whitney U test**, the **Wilcoxon signed-rank test**, the **one-sample Wilcoxon signed-rank test**, the **Stuart-Maxwell test**, or the **Cochran-Mantel-Haenszel test**. It is **checked by default**, so p-values match R's and SPSS's defaults out of the box. For the table-based tests the correction only exists on a **2×2** table, so the checkbox additionally shows only while the current selection can form one – every relevant axis (the grouping variable and the dependent variables for independent tests, the dependent variables for paired tests) has exactly two realized categories, the same live check as the [one-tailed Fisher control](#test-direction). The rank tests' ±0.5 correction – Mann-Whitney, and the paired and one-sample Wilcoxon signed-rank – isn't table-bound, so those checkboxes always show.

- For **chi-square**, this is the **Yates correction** – R applies it only to 2×2 tables – which shifts the p-value upward (more conservative).
- For **Cochran-Mantel-Haenszel**, the correction applies only to the **2×2×K** case (and matches R's `mantelhaen.test` default); it has no effect on larger I×J×K tables.
- For **McNemar**, the correction applies only when the discordant count b + c ≥ 25. Below that, McNemar **automatically switches to the exact binomial test** on the discordant pairs (where no correction is needed), so the checkbox has no effect there. This mirrors how Mann-Whitney auto-selects its exact test.
- For **Mann-Whitney**, it's the ±0.5 correction on the normal approximation, which only takes effect when the exact test isn't used (large samples or tied values).
- For the **Wilcoxon signed-rank** and **one-sample Wilcoxon signed-rank** tests, it's the same ±0.5 correction on the normal approximation, taking effect only when the exact test isn't used (tied values, zero differences, or large samples).
- For **Stuart-Maxwell**, the setting only affects the **2×2 case** (where the test reduces to McNemar, including the same auto-exact behavior); it has no effect on larger k×k tables.

If a run still ends up on a non-2×2 table despite that live gate (missing-data filtering can drop a category between selection and fit), a note under that variable's results says the correction had no effect, so the checked box isn't mistaken for a corrected p-value.

> **When to turn it off.** The Yates correction is widely regarded as over-conservative for 2×2 tables once any cell count – or, for McNemar, the discordant count b + c – is at least 25; unchecking the box reproduces the uncorrected statistic. You don't need to do anything special for small samples: McNemar uses the exact binomial test automatically when b + c < 25, and for sparse independent 2×2 cross-tabs you can switch to [Fisher's exact test](#independent-samples--categorical).

### Trim level

The **Trim level (per tail)** field appears only for the robust trimmed-means tests – **Yuen's test** and **t1way**. Enter a percentage from 0 to 49: it sets how much of each tail is trimmed before the means are compared. At the default **20%**, the smallest 20% and largest 20% of each group's values are set aside and the mean of the middle 60% is used.

- **20% (default)** – Wilcox's recommended setting; a good all-round choice that resists outliers while keeping most of the data.
- **Lower (5–15%)** – trims less, so closer to the ordinary mean. Use when the data is only mildly heavy-tailed and you want to keep more of it.
- **Higher (up to ~25%)** – more aggressive; approaches a median-like comparison. Use only with very heavy tails or strong outliers. Trimming must stay below 50% per tail.

> **What trimming buys you.** A single extreme value can drag an ordinary mean far off – and inflate its variance, which is what makes the t-test fragile under heavy tails. Trimming discards a fixed fraction of each tail *before* computing the mean, so a handful of outliers can't dominate, while (unlike the median) enough of the data is kept to retain good power. Higher trim = more robust but lower power on clean data; the 20% default is the usual compromise. The same trim level is applied to every group, to every pairwise Yuen comparison, and to the lincon post-hoc in a run.

### Effect sizes

Check **Include effect sizes** and select a measure from the dropdown. Available measures update based on the selected test:

| test | measures offered |
|---|---|
| Independent t-test | Cohen's d, Hedges' g, Glass' Δ, point-biserial r, η², ω² |
| Welch's t-test | Welch's d, Welch's g, Glass' Δ, point-biserial r |
| Paired t-test | Cohen's dz, Hedges' gz, Cohen's d_av, Hedges' g_av |
| One-sample t-test | Cohen's d, Hedges' g |
| Mann-Whitney U | rank-biserial r, Cliff's δ, common-language ES |
| Brunner-Munzel | common-language ES, Cliff's δ |
| Wilcoxon signed-rank | matched-pairs rank-biserial r, Wilcoxon r |
| One-sample Wilcoxon signed-rank | rank-biserial r, Wilcoxon r |
| Sign test, paired sign test | sign-test r (2p₊ − 1) |
| One-sample proportion test | Cohen's h |
| One-way ANOVA, MANOVA | η², ω², ε² |
| Welch's ANOVA, Brown-Forsythe ANOVA, trimmed-means ANOVA | explanatory measure ξ |
| Yuen's test | explanatory measure ξ, Algina-Keselman-Penfield robust d |
| Johansen's heteroscedastic MANOVA | explanatory measure ξ (on the univariate follow-ups) |
| Energy test of equal distributions | R²ₑ |
| Kruskal-Wallis | ε², η²_H |
| Friedman | Kendall's W |
| Repeated measures ANOVA | partial η², generalized η² (η²G), partial ω² |
| Factorial ANOVA, repeated measures factorial ANOVA, mixed ANOVA, ANCOVA, MANCOVA, repeated measures MANOVA, mixed MANOVA | partial η², η², ω², ε² |
| ART-ANOVA, repeated measures factorial ART | partial η² |
| Jonckheere-Terpstra | Kendall's τ-b |
| Page's trend test | mean within-block ρ (ρ̄) |
| Mutual information | Theil's U |
| Jensen-Shannon divergence | normalized Jensen-Shannon divergence |
| Chi-square test of independence, Fisher's exact test | Cramér's V, odds ratio |
| Goodness-of-fit test, Cochran-Armitage trend test | Cohen's w |
| McNemar | φ (marginal), Cohen's g, odds ratio |
| Stuart-Maxwell | Cohen's g (one per category pair) |
| Cochran's Q | Cohen's w (Q), Cochran's average φ² |
| Cochran-Mantel-Haenszel | common odds ratio (2×2×K only) |
| F-test of equality of variances | variance ratio |

The tests whose statistic is already a bounded magnitude in its own right offer no separate measure, so **Include effect sizes** has nothing to add for them: **Kolmogorov-Smirnov** and **Anderson-Darling**, and **Bartlett's test** and **Fligner-Killeen**. [**Johansen's heteroscedastic MANOVA**](#independent-samples--numeric) estimates no pooled error term, so its multivariate omnibus carries no measure either – the ξ you pick lands on its univariate follow-ups instead. The [**energy test**](#independent-samples--numeric) reports **R²ₑ** on the omnibus itself.

For the multivariate tests the chosen measure is applied to those tests' **univariate follow-up tables**, with the η²-family choices also reported for the multivariate omnibus itself; see [MANOVA / MANCOVA](#manova--mancova). One substitution is made for you: assigning covariates to a **repeated measures ANOVA** reroutes it to a covariate-adjusted repeated measures MANOVA, for which partial ω² has no counterpart – partial η² is computed and labelled instead, and a warning toast reports the swap rather than letting the column quietly change measure.

Additional options:

- **Confidence intervals** for the effect size – for the rank and categorical measures (Wilcoxon r, the matched-pairs rank-biserial, Kruskal-Wallis ε²/η²_H, Friedman's W, Kendall's τ-b, Page's ρ̄, Cohen's g, Cochran's φ̄²) and the robust explanatory measure ξ these are bootstrap intervals, so enabling this option adds runtime that scales with the [**Bootstrap replications**](./settings.md) setting. They are skipped entirely when this option is off.
- **Standard errors** for the effect size

> **What is an effect size?** A p-value tells you whether an effect exists; an effect size tells you how *big* it is. A tiny difference can be statistically significant with a large enough sample, while a meaningful difference can be non-significant with too few participants. Common benchmarks: Cohen's d of 0.2 = small, 0.5 = medium, 0.8 = large – but what counts as "meaningful" depends on your field.

> **How CIs are computed.** The interval method matches the effect-size family. The d-family splits by standardizer: **Cohen's d** and **Hedges' g** (pooled SD) use **exact non-central t inversion** (Steiger & Fouladi 1997; Cumming 2012), giving an asymmetric, data-bounded interval – d and g estimate the same population effect, so they share the interval and only the point estimate shifts with the bias correction. In pooled-SD pairwise comparisons (the Student pairwise family) the standardizer is the across-all-groups √MSE with N − k degrees of freedom – the same error term the pooled pairwise t-test uses – so d, its interval, and the test statistic share one standardizer and df. The paired **Cohen's dz** and **Hedges' gz** invert the same non-central t (on t = dz·√n with n − 1 degrees of freedom), so they likewise share one interval and agree with the paired t-test's own decision about zero. **Glass' Δ**, **Welch's d**, **Welch's g** and **Cohen's d_av** keep analytic Wald CIs on the t-distribution, because their non-pooled standardizers (one group's SD; the average-variance denominator; the average of the two condition SDs) don't admit a clean non-central t – Welch's d and g sit on the Welch-Satterthwaite degrees of freedom, and Welch's g's whole interval scales by the bias-correction factor rather than staying put the way Hedges' g's does. Pearson r and point-biserial use the Fisher-z back-transform. Rank-based correlation effects use distribution-appropriate methods rather than Fisher-z (which is calibrated for the bivariate normal): independent **rank-biserial r** and **Cliff's δ** (the same statistic) use Cliff's consistent variance (the distribution-specific estimator computed from the per-row and per-column dominance spreads, Cliff 1993) with Cliff's asymmetric interval (1996), which stays within (−1, 1) by construction rather than being truncated at the bounds; the **paired** matched-pairs rank-biserial and the **one-sample** signed-rank rank-biserial r both use a bootstrap percentile CI like Wilcoxon r – staying within [−1, 1] by construction and capturing the tie structure directly, rather than a Wald interval whose analytic variance misfires on this discrete lattice statistic; **Wilcoxon r** likewise uses a bootstrap percentile CI (using the [**Bootstrap replications**](./settings.md) setting) – the r = Z/√n construction has no clean closed-form variance, and the bootstrap captures the test's tie and continuity corrections directly. Bootstrap-derived intervals are marked with a superscript "b" in the results table so they aren't mistaken for analytic CIs. **Common-language ES** uses Hanley-McNeil concordance variance (Q1, Q2 components) with a delta-method SE on the logit scale, accounting for the dependence among the n1·n2 pairwise comparisons that the naive binomial form ignores. Parametric variance-family effects (η², ω², partial η², ε² for t-tests and the ANOVA family – one-way, factorial, repeated-measures, mixed, and ANCOVA) use **non-central F inversion** (Steiger 2004), so the interval is asymmetric and bounded in [0, 1] – matching standard references like `MBESS::ci.pvaf`. For repeated-measures designs the reported η² is the classical whole-model proportion (denominator spanning the subject stratum) and is given as a **point estimate only** – classical RM η² has no principled confidence interval, because the subject stratum its denominator spans isn't bounded by the within-effect non-central F. The interval lives instead on partial η²ₚ and ω²ₚ (the bias-corrected partial omega-squared, Olejnik & Algina 2003), which stay partial and carry the non-central F bound. χ²-derived effects – Cramér's V, φ, and Cohen's w (Q) – use **non-central χ² inversion** (Smithson 2003), again giving asymmetric intervals; V and φ are capped at 1, w is unbounded. Odds ratios use the exact CI from `fisher.test` for Fisher's exact, and a Wald-on-log CI for McNemar (see Haldane-Anscombe note below). **Cohen's g** (Stuart-Maxwell) and **Cochran's average φ²** (Cochran's Q) use **bootstrap percentile CIs** – resampling matched pairs and subjects respectively, recomputing the statistic each replication – because the sampling distributions of these marginal-homogeneity / per-df statistics have no closed-form inversion suitable for the small-table cases these tests target. The **variance ratio** (F-test of equality of variances) reports the ratio s₁²/s₂² with R's `var.test` interval – exact, derived from the F distribution – and carries no small/medium/large label, since there's no canonical benchmark for a variance ratio (1 means equal spread).
>
> **Standard errors** are reported for every effect that has a meaningful closed-form SE – the d-family, Cliff's δ, and common-language ES – even where the displayed interval uses a more accurate asymmetric method (non-central t for Cohen's d and Hedges' g; Cliff's interval for the dominance measures; the logit delta-method for common-language ES). They are omitted for the variance-family (η², ω², ε², partial η²) and χ²-family effects and for any bootstrap CI, where no symmetric SE exists on the effect's scale to begin with.
>
> **What the "b" marker tells you about a bootstrap interval.** Hover it and the tooltip names the number of resamples the interval was actually taken over – the ones that came back with a usable value, not the [**Bootstrap replications**](./settings.md) count you asked for, which is the number that governs its resolution. Two variants say more. On an **unbalanced** design the explanatory measure ξ's interval is marked **conservative**: each resample re-estimates from a single balanced subsample while the estimate itself is a median over such subsamples, so the interval is wider than the estimator's own sampling distribution – it errs toward covering, never against. And when **every resample returns the same value**, the estimate is pinned at a boundary of its range (a Cohen's g on a category pair where one transition direction never occurs, for instance), where a percentile bootstrap has no coverage at all: the interval is then reported as **–** with a marker saying why, rather than as a spuriously exact `[0.50, 0.50]`. Such an estimate is also left off the [forest plot](#forest-plot), where a zero-width interval would draw as a dot and read as precision.
>
> **Glass' Δ reports both Δ₁ and Δ₂.** Glass' Δ standardizes the mean difference using *one* group's SD rather than a pooled estimate – this is the right choice when group variances differ (the case Cohen's d's pooling assumption breaks). Conventionally the control group's SD is used as the standardizer, but the module has no UI control-group selector. So both versions are reported: **Δ₁** divides by the SD of group 1, **Δ₂** by the SD of group 2. Under equal variances they coincide; the larger the SD ratio, the more they diverge – and they diverge in opposite directions, so reporting both keeps the reader honest about which standardizer is being read. When **Interpretation** is enabled, both Δ₁ and Δ₂ get their own small/medium/large label – Cohen's d benchmarks apply to each, since both are standardized effects on the same scale.
>
> **Welch's t-test omits the pooled-SD effect sizes.** Because Welch drops the equal-variance assumption, its effect-size menu offers only the variance-appropriate measures – **Welch's d** (the average-variance standardizer), **Welch's g** (the same estimator with Hedges' small-sample bias correction applied at the Welch-Satterthwaite degrees of freedom, which is the standard recommendation for this design), **Glass' Δ**, and **point-biserial r** – not the pooled-SD Cohen's d or Hedges' g. Pooling the SDs for the effect size would contradict the very assumption that sent you to Welch in the first place.
>
> **Cochran's average φ² (φ̄²)** = Q / (N · (k − 1)), where k is the number of conditions and N is the number of **informative** subjects – those whose response actually varied across conditions. A subject who answered the same way every time contributes nothing to Q's numerator *or* its denominator, so counting them would cap φ̄² at the informative share of the sample and quietly falsify its own reading. **Cohen's w (Q)** keeps the full subject count instead, because w is conventionally √(χ²/n) on the sample the χ² ran on, and Q genuinely is computed from all of them. The two therefore divide by different numbers, so each carries a superscript **ⁿ** naming its own denominator – hover it to see which subjects it stands on. It is the **per-df form of Cohen's w²** for the Q statistic, bounded in [0, 1] and read as the fraction of maximum possible heterogeneity across conditions: 0 means proportions are identical across conditions, 1 is the theoretical maximum (every subject responding identically within a condition but differently across conditions). No canonical Cohen-style threshold table exists for φ̄² – the module borrows the variance-family cutoffs (0.01 = small, 0.06 = medium, 0.14 = large), which are calibrated for η²/ω² and are a reasonable analogy because φ̄² is also a bounded variance-explained-like ratio. Treat the interpretation column as a heuristic; the **Cohen's w (Q)** alternative effect size sits on Cohen's original 0.10 / 0.30 / 0.50 scale if you prefer to anchor in his published thresholds. If you report φ̄², always include Q, N, and k alongside it – the same φ̄² value carries different meaning at k = 3 vs k = 8.
>
> **McNemar odds ratio with empty discordant cells.** When either off-diagonal cell of the paired 2×2 (b or c) is zero, the raw OR is undefined. The Haldane-Anscombe continuity correction (+0.5 to b and c) is applied **only in that edge case**, so the OR and its Wald-on-log CI remain finite. The corrected estimate is marked with a `‡` superscript in the effect-size column.
>
> **McNemar's three effect sizes.** McNemar's test offers **φ (marginal)**, **Cohen's g**, and the **odds ratio**. The label **φ, marginal** is deliberate: this φ is √(χ²_McNemar / N), a *marginal-change* magnitude – how far the row and column marginals have shifted, which is what McNemar tests – **not** the 2×2 cell-association φ the bare symbol usually denotes. Its tooltip spells this out so it isn't mistaken for an association coefficient sitting beside Cohen's g. For the same reason it carries **no small/medium/large label**: the usual correlation benchmarks (0.1/0.3/0.5) belong to the association φ, and no canonical scale exists for this marginal-change variant – gauge the magnitude against Cohen's g (which keeps its marginal benchmarks, 0.05/0.15/0.25) and your domain.
>
> **Cohen's g for paired tables.** Cohen's g measures marginal asymmetry as a deviation from no change. For a **2×2** table (McNemar) it is |b − c| / (2·(b + c)) – half the gap between the discordant counts, scaled by the number of discordant pairs (b + c), *not* by N – bounded in [0, 0.5], with benchmarks g = 0.05 (small), 0.15 (medium), 0.25 (large) (Cohen 1988). For a **k×k** table (Stuart-Maxwell) a single averaged g judged against those 2×2-calibrated thresholds would be misleading, so the module instead reports **one g per discordant category pair** – gᵢⱼ = |nᵢⱼ − nⱼᵢ| / (2·(nᵢⱼ + nⱼᵢ)) – in a dedicated *Cohen's g by category pair* table, each pair on its own footing.
>
> **Explanatory measure of effect size ξ** (Yuen, t1way, Welch's ANOVA, Brown-Forsythe ANOVA) is the robust family's answer to "how big is the difference?" – roughly the trimmed-means analogue of √η², the share of variation explained by the groups, on a 0–1 scale. Benchmarks (Mair & Wilcox 2020): **0.10 = small, 0.30 = medium, 0.50 = large**. It is the one variation-explained measure that doesn't assume equal variances, which is why the heteroscedastic omnibuses offer it in place of η²/ω²/ε². On **Yuen** and **t1way** it is computed at the [trim level](#trim-level) the test itself contrasted at; on **Welch's** and **Brown-Forsythe ANOVA**, which compare untrimmed means, it is computed at zero trim – so the symbol always describes the same means the test compared. When effect-size [confidence intervals](#effect-sizes) are enabled, all four report a **bootstrap percentile CI** honoring the [**Bootstrap replications**](./settings.md) setting and your confidence level, marked with the superscript "b" like the other resampled intervals. Yuen additionally reports a confidence interval for the **difference of trimmed means** itself (shown in the standard difference-CI column), which is on the original data scale and often the more directly interpretable number.
>
> **Rank-based variance effects** – Kruskal-Wallis ε² and η²_H, Friedman's W – use **bootstrap percentile CIs**. These statistics have no analytic non-central sampling distribution to invert, and analytic Wald approximations on bounded rank statistics give poor coverage, so the interval is resampled instead: Kruskal-Wallis resamples observations within each group (group sizes held fixed), Friedman resamples subjects (blocks), recomputing the statistic on each replication. Like the other bootstrap intervals they honor the [**Bootstrap replications**](./settings.md) setting, are seeded by [**Bootstrap seed**](./settings.md#bootstrap-seed) for reproducibility, and are marked with a superscript "b".
>
> **The trend tests' companion measures.** J and L are on scales of their own, so each ordered-alternative test reports the measure conventionally paired with it. **Kendall's τ-b** (Jonckheere-Terpstra) restates the same monotone association on a −1 to +1 correlation scale, tie-corrected – J is a monotone function of it, so the two always agree in direction, and because τ-b is computed from the data it is available on the permutation branch too. **Mean within-block ρ (ρ̄)** (Page's trend test) is the average, over blocks, of the Spearman correlation between that subject's observed ranks and the order the hypothesis predicts – tie-corrected, spanning −1 to +1, and comparable across designs with different numbers of conditions. (A Z/√N form would be capped at √((k−1)/k) – 0.816 at three conditions – so "large" would mean something different at every k.) A block whose ranks are all tied contributes 0, the same nothing it contributes to L. Both measures use **bootstrap percentile CIs** when effect-size intervals are enabled – τ-b resampling within group so the design's group sizes stay fixed, ρ̄ resampling whole blocks (subjects) – marked with a superscript "b" like the other resampled intervals.

### Sums of squares

For the factorial designs that fit through `car::Anova` – **factorial ANOVA**, **mixed ANOVA**, **ANCOVA**, and **repeated measures factorial ANOVA** – a **Sums of squares** dropdown controls how each effect's variance is partitioned when the design is unbalanced:

- **Type III** (default) – tests every effect after adjusting for all the others, interactions included. It's order-invariant and the default in SPSS and most packages, which makes it the reproducible choice; it relies on the sum-to-zero (`contr.sum`) contrast coding the module sets up for you.
- **Type II** – tests each main effect after adjusting for the other main effects but *not* the interactions. It has more power when no interaction is present and doesn't depend on the contrast coding.

The choice only matters for **unbalanced** data (unequal cell sizes) or designs with interactions – with balanced data the two agree. The effects table notes which was used ("Type III sums of squares"). ART-ANOVA ignores the setting, since aligned-rank inference doesn't partition sums of squares this way. In a **repeated measures factorial ANOVA** with no covariates the between-subjects side of the model is intercept-only, where the two types reduce to the same test – so the note reads "Type III" whichever you picked, rather than claiming a partition that wasn't the one computed. Add a covariate and the two diverge for real, and the control takes effect.

> **Type II or Type III?** When the interaction is negligible, Type II is generally the more powerful and less finicky choice. When a meaningful interaction is present, Type III keeps each main effect interpretable in its presence, and it's what you want for parity with SPSS output. If in doubt, leave it on Type III.
>
> **An empty cell forces Type II.** If any cell of the between-subjects crossing has no observations, a Type III model can't be fit at all – its coefficients are aliased – and **Calculate** stops with a message naming the empty cell. Type II *can* be fit there, because it tests each main effect by model comparison rather than against the full crossing, so switching the dropdown to Type II lets the analysis run: the main effects are tested normally, the interaction row comes back blank because that term isn't estimable, and a warning says so. Dropping or collapsing a factor, or splitting the design into [batch analyses](#batch-analysis), remain the other ways out.

### Within-subjects approach

For the three families with a within-subjects factor that are fitted parametrically – **repeated measures ANOVA**, **repeated measures factorial ANOVA** and **mixed ANOVA** – a **Within-subjects approach** dropdown sits beside the sums-of-squares control:

- **Univariate (ε-corrected)** (default) – the classical repeated-measures F, with the Greenhouse-Geisser and Huynh-Feldt corrections applied to its degrees of freedom.
- **Multivariate (Pillai)** – the within-subject contrasts are tested jointly by **Pillai's trace**, which assumes no sphericity at all.

This is a **route**, not an extra table: the selection drives the omnibus statistic, the significance verdict, the effect size, the post-hoc gate and the [multiplicity pool](#p-value-adjustment) together, so everything on the card belongs to one analysis. Under the multivariate route the sphericity machinery goes with it – the ε (GG) / ε (HF) columns, the corrected p-values, Mauchly's table and its policy note all answer a question that route doesn't ask – and so do the sums of squares, since a mean square would not reproduce the F beside it. A note under the table says which columns belong to which route.

**Between-subjects terms stay univariate either way.** They are tested on subject means and have no multivariate form; the table says so rather than leaving a blank row.

> **Which route?** The univariate route always exists and is the safer one at small n, which is why it is the default. The multivariate route needs **more subjects than contrasts** – enough residual degrees of freedom to estimate the contrasts' covariance matrix – and buys, in exchange, a test that doesn't lean on sphericity even approximately. It is the standard read when ε̂ is small. Where a particular term can't support it, that term keeps its univariate F and is **named** in the diagnostics, uncorrected for sphericity – so a design that goes multivariate for two effects and not for a third says exactly that. On a **single-df** within effect (two conditions) the two routes are numerically identical, sphericity being vacuous there.

> **Not the same thing as Mixed MANOVA.** "Multivariate" here means the multivariate treatment of *one* dependent variable's within-subject contrasts. [**Mixed MANOVA**](#manova--mancova) is a different test that models *several dependent variables* jointly. The two can be combined – they answer different questions.

### Heterogeneous slopes (regions of significance)

Every test that crosses a [covariate](#variable-roles) with a factor assumes the covariate's slope is the same at every level – the [homogeneity-of-regression-slopes](#checking-assumptions) assumption. When it fails, a single adjusted difference no longer describes the groups, because how far apart they are depends on where you stand on the covariate. Those tests therefore add a **heterogeneous-slopes follow-up** to the card: per pair of levels, the difference between their slopes with its significance test, the **Johnson-Neyman boundaries** of the covariate values at which the pair differs significantly, and the share of your observations that actually fall in that region. See [reading results](#heterogeneous-slopes-results).

A region is drawn for each pair whose slopes genuinely differ. One checkbox governs the rest:

- **Show every region of significance** – draws the plot for every contrast, not only the ones whose slope-homogeneity check failed. It appears alongside the covariate role, so it is available on all seven covariate-bearing tests.

### Discriminant analysis

Check **Include descriptive discriminant analysis** to name the combination of dependent variables the groups separate on. The option appears for **MANOVA** and **MANCOVA** only – they are the two tests whose omnibus has a canonical decomposition to describe. It answers the question the multivariate test asks and the per-variable follow-ups can't, and it is added *beside* those follow-ups rather than in place of them; see [discriminant analysis results](#descriptive-discriminant-analysis) for the four tables it produces. Ticking it also unlocks the **[Discriminant function plot](#discriminant-function-plot)** checkbox under [visualization](#include-visualization), which draws what the tables describe.

### Classification (ROC) analysis

For the **independent** two-group tests that ask a location or ordering question – the **independent t-test**, **Welch's t-test**, the **Mann-Whitney U test**, the **Brunner-Munzel test**, and **Yuen's trimmed-means t-test** – check **Include classification (ROC) analysis** to compute the area under the ROC curve and related classification metrics alongside the inferential test. The option appears once you've selected an eligible test.

> **What ROC analysis adds.** A t-test or Mann-Whitney asks *"do the groups differ?"* – ROC asks the dual question: *"how well does this score discriminate between the groups?"* The two are mathematically linked (the AUC equals the Mann-Whitney U statistic normalized to [0, 1]), but ROC adds a practical layer: an optimal cutoff above which you'd classify someone as belonging to the higher-scoring group, plus sensitivity, specificity, and predictive values at that cutoff. That framing is also why the option is confined to location/ordering tests: a pure **dispersion** test (the F-test of equality of variances) or a **whole-distribution** test (Kolmogorov-Smirnov, Jensen-Shannon divergence) can report a large and entirely correct difference next to an AUC of ≈ 0.5 – groups with the same centre but different spreads are genuinely hard to tell apart with a single threshold – which reads as a contradiction inside one card rather than as a result.

For three or more groups, ROC is computed for each pairwise contrast, matching how the inferential test handles multi-group data.

**Optimal threshold rule** – how the cutoff is chosen:

- **Youden's J** (default) – maximizes sensitivity + specificity − 1; equal weight on both error types.
- **Closest to (0, 1)** – the point on the curve nearest the top-left corner (perfect classifier).
- **Cost-weighted** – asymmetric costs. Set the **Cost asymmetry ratio** k > 1 if one error is k times worse than the other. Both directions (whichever group is worse to misclassify) are reported as separate rows so you can pick the relevant one. The field accepts values strictly **greater than 1**: to make the *other* error the costlier one, enter the reciprocal (1 or below is rejected with a message – a ratio of exactly 1 asserts an asymmetry that doesn't exist, so the two rows would come out identical while carrying contradictory "costlier error" labels and duplicating what **Youden's J** already reports, and a sub-1 ratio would only mislabel which row was optimized).

An optional **Population prevalence** field appears whenever **Classification metrics at optimal threshold** is enabled – it corrects the prevalence-dependent metrics for a known base rate, so it's tied to those metrics rather than to any one threshold rule. Leave it empty to base them on the sample's own group proportions; enter a value strictly between 0 and 1 to use a known real-world prevalence instead – the right move when your sample's class balance is a sampling artifact (e.g. case-control data that oversamples the rare group). The override recomputes **PPV**, **NPV**, and **accuracy** at that prevalence; sensitivity, specificity, and the AUC are unaffected. Under the cost-weighted rule it *additionally* moves where the optimal threshold lands.

As soon as you enter a value, a **Prevalence refers to group** block appears beneath it with **one labelled dropdown per factor the run will fit**, each listing that factor's own levels. A prevalence is a statement about *one* of the two groups, so an unattached number would mean P(A) = p in one comparison and P(B) = p in the next; naming the level is what removes the ambiguity. Each dropdown defaults to the factor's **last** level – the one an unflipped ROC fit already treats as the cases – so the default reproduces the behaviour you'd expect without touching it. In [batch mode](#batch-analysis) every iterated grouping variable gets its own dropdown, so a level that exists in one variable but not the next can't carry the override to a place it doesn't belong. If a prevalence is entered and no group is named for it, **Calculate** stops and asks you to choose one.

> **Pick the rule before looking at the data.** Same logic as the equivalence bound: choosing the rule that produces the threshold you wanted to see undermines the analysis.

**AUC confidence interval:**

- **DeLong** (default) – closed-form, fast, recommended for n ≥ 30 per group.
- **Bootstrap** – resampling-based; more robust at small samples. Uses the global bootstrap replication count from [settings](./settings.md); slower.

**Compare AUCs (pairwise DeLong's test)** – appears when 2+ AUCs are produced (multiple dependent variables, or pairwise group expansion across 3+ groups). Tests whether AUCs differ significantly using DeLong's correlated-AUC test, which accounts for the fact that AUCs computed on the same subjects are not independent. P-values are adjusted across the family using the global [adjustment method](./settings.md#multiple-comparison-adjustment).

> **Listwise filtering across DVs.** Paired DeLong assumes every ROC curve is fitted on the same set of subjects. To preserve that assumption – and to keep N consistent across the reported AUCs – rows missing on *any* selected dependent variable (or on the grouping factor) are dropped from *all* ROC fits whenever ROC analysis runs with multiple DVs. The per-AUC **N** reflects this listwise-complete subset; it can be smaller than the per-DV N you'd get analyzing each variable in isolation, but it is identical across every reported AUC.

**Classification metrics at optimal threshold** – toggles the per-threshold columns (sensitivity, specificity, PPV, NPV, accuracy), and the matching optimal-threshold hover markers on the [ROC curve plot](#roc-curve). Turn off if you only want the AUC summary.

> **Why not for paired or repeated-measures tests?** The AUC's statistical machinery assumes independent observations. In a Pre/Post design the standard CI is wrong, and the question "can this score discriminate Pre from Post within the same subject?" rarely matches what users actually want. If you need discrimination on paired data, compute difference scores against an external label (e.g. responder vs. non-responder) and run an independent ROC.

### Summary statistics

Toggle which descriptive statistics appear alongside the test results:

- **Means** (on by default) and **Medians**
- **Modes** (with frequency percentage)
- **Standard deviations** (on by default) and **Standard errors**
- **Confidence intervals** (on by default, level from [settings](./settings.md#significance-level)) – in a design with a within-subjects factor **and** a subject ID this adds a *second* interval column per group, the **within-subject CI**
- **Percentiles** (Q1, Q3, IQR)
- **Min and max**
- **Mean ranks** (relevant for rank-based tests)
- **Sample sizes**
- **Frequency tables** (for categorical tests)

These toggles govern the **tables and the CSV export**, not what the analysis computes. The **Interpretation** column's direction phrase ("Group A > Group B") needs a summary statistic to name a winner, and it gets one whether or not you display it: the mean for the ordinary location tests, the median or mean rank for the rank-based ones, the standard deviation for the dispersion tests (Bartlett, Fligner-Killeen). So unchecking **Means** or **Standard deviations** trims the table without quietly dropping the direction out of the verdict.

> **Two intervals in a repeated-measures table.** Where a within-subjects factor and a subject ID are both present, each condition gets an ordinary **CI** and a **within-subject CI** side by side, and they answer different questions. The within-subject column is the **Cousineau-Morey interval** (Morey 2008) – the same one the [error bars](#mean-and-error-bar-plot) draw – which removes between-subject variance, so it is the one to read when comparing the repeated levels *with each other*. Precisely because it strips that variance out, it is **not** an interval for its own condition's population mean and doesn't cover it at the nominal rate; the ordinary CI beside it is the one that does. A note under the table says so, so two intervals over the same numbers can't be read as one being a corrected version of the other. The same pair appears in the descriptive blocks of the [factorial](#factorial-anova), [mixed](#mixed-anova) and [multivariate](#manova--mancova) tables, on the blocks a within factor indexes.

### Include visualization

Check **Include visualization** to reveal a plot type selector with per-plot options. Several plot types are available, some conditionally – see [visualization](#visualization) below. For the categorical tests the distribution and forest plot options are hidden, since a contingency test has no distribution to draw; in their place comes the **[Category proportion plot](#category-proportion-plot)** (on by default), joined for the goodness-of-fit test by the [observed-vs-expected chart](#observed-vs-expected-plot). The ROC curve is enabled separately as part of [classification analysis](#classification-roc-analysis).

#### Error bar type

Whenever the [mean and error bar plot](#mean-and-error-bar-plot) or an [interaction plot](#interaction-plot) with error bars is on, an **Error bars show** dropdown appears – shared by both, so the two plots can't disagree:

- **Confidence interval of the mean** (default) – the precision of the mean, at your [confidence level](./settings.md#significance-level)
- **Standard error of the mean** – ±1 SE, roughly two-thirds of the CI's half-width
- **Standard deviation** – ±1 SD
- **Difference-adjusted within-subject confidence interval** – shown only where the design has a within-subjects factor; the within-subject interval rescaled so that two bars overlap exactly when the difference between them is *not* significant

> **SD bars answer a different question.** The confidence interval and the standard error both describe how precisely the *mean* is pinned down, and shrink as the sample grows. The standard deviation describes the spread of the *observations* and doesn't shrink at all. So non-overlapping SD bars say nothing about whether two means differ – a caption under the control says so. Pick SD when you want to show how variable the data is, and CI or SE when you want to show what the comparison rests on.

In a **purely within-subjects** design the standard-error option drops out – a between-subject SE is not a meaningful bar there – leaving the two within-subject intervals and the SD of the observations. In a mixed design every option stays available, but a cell drawn with a within-subject interval overrides an SE or CI request, those having no within-subject analogue on that cell.

> **Two within-subject intervals, and which reading each supports.** Both remove between-subject variance, which is what makes them the right bars for comparing repeated levels; they differ in the rule you're allowed to read off overlap. The **Cousineau-Morey interval** (Morey, 2008) – the default, and the one the tables print – is the standard construction, but two of its bars *just touching* does **not** correspond to p ≈ .05, so overlap is not a test. The **difference-adjusted** interval (Baguley, 2012) is that same interval scaled by √2⁄2 – narrower – precisely so that the rule holds: two bars that do not overlap mark a significant difference, and two that do, don't. Morey's stays the default because it is what the surrounding literature and other packages draw, and switching silently would rewrite every figure this module has already produced. The caption under each plot names which one is drawn.

## Checking assumptions

Click **Check assumptions** to run a battery of tests appropriate for your design. Results appear in an "Assumption test results" output card with three sections:

### Summary table

A quick overview with each assumption, its pass/fail status, and a note. Assumptions tested depend on the design and may include:

| Assumption | Test used | When checked |
|---|---|---|
| Normality | Shapiro-Wilk | Per cell, per variable – on the within-pair differences for two-condition dependent designs, on each variable's own values in one-sample mode, or on the within-subjects model residuals (per-condition marginals without a subject ID) for repeated-measures designs with 3+ conditions. With **covariates** selected (ANCOVA / MANCOVA) it moves to the residuals of the covariate-adjusted model – the assumption those tests actually rest on – and a note in the table says so |
| Symmetry | Skewness sign-flip permutation test | One-sample and two-condition dependent designs – the assumption behind the signed-rank test |
| Outliers | Studentized residuals, Bonferroni-adjusted | Designs fitted on means – a diagnostic for the tests that follow them |
| Multivariate normality | Mardia's test | 2+ DVs between groups; also the within-subject response vectors for repeated-measures MANOVA. With covariates it runs on the covariate-adjusted residual matrix, matching the univariate row above |
| Homogeneity of variance | Levene's test (Brown-Forsythe, median-centered) | Independent designs. For mixed designs the between-group variances are tested separately at each within-condition level (one row per variable × condition), since that – not the within-collapsed pooled variance – is what mixed ANOVA assumes |
| Sphericity | Mauchly's test | Repeated measures, 3+ conditions |
| Homogeneity of covariance matrices | Box's M test (fixed α = 0.001) | 2+ DVs. For independent groups, tested across the grouping factor; for mixed designs (Mixed MANOVA, with a subject ID) the within-subject responses are reshaped to wide form and Box's M is tested across the between-subjects cells – each between × within cell needs ≥ 5 complete subjects |
| Multicollinearity | Correlation check (absolute r > 0.90) | 2+ dependent variables |
| Covariate: regression slopes | Interaction test | Covariates present. Mixed designs test both sides – covariate × group (between) and covariate × condition (within) – and a dedicated column in the detailed table says which side each row checks |
| Covariate: linearity | Within-group quadratic-term F-test | Covariates present |
| Covariate: independence | Group comparison | Covariates present. In a mixed design this and the two rows above (between-subjects side) are fitted on one row per subject, so the repeat count doesn't inflate the residual df |
| Expected frequencies | Cochran's rule (no cell with E < 1; ≤ 20% of cells with E < 5) | Independent categorical DVs; also one-sample goodness-of-fit, where the expected counts come from your hypothesised distribution |
| Discordant pairs | At least 25 discordant (off-diagonal) pairs, else the exact test is preferred | Paired categorical, two conditions (McNemar / Stuart-Maxwell) |
| Informative subjects | N ≥ 4 informative subjects with N·k > 24 (Tate & Brown 1970) | Paired categorical, three or more conditions (Cochran's Q) |

> **Why symmetry, not just normality?** The Wilcoxon signed-rank test (paired and one-sample) doesn't need normal data, but it does assume the distribution of the differences – or of the values around μ₀ in one-sample mode – is **symmetric**, since it ranks the magnitudes of positive and negative deviations on a common scale. A symmetric but heavy-tailed sample fails the normality check yet is still valid for the signed-rank test, so this separate skewness test tells the two cases apart. When it flags asymmetry, the recommendation steers you to the sign test that fits your design – the **Sign test** in one-sample mode, the **[Paired sign test](#dependent-samples--numeric)** for a two-condition dependent design – neither of which assumes anything about shape. The check is a **permutation test**: the sample's skewness g₁ is compared against the distribution produced by randomly flipping the signs of the deviations from the median (2000 permutations), which is exactly the null "the differences are symmetric" without borrowing a normal-theory approximation for it. It needs n ≥ 6 to run.

> **Extreme observations are flagged, not judged.** The **Outliers** row divides each residual by the model's own error spread and multiplies its p-value by the number of observations, so a flag marks an observation more extreme than a normal sample *of this size* produces – not one past a fixed cutoff like ±3 SD, which flags a fixed share of any clean sample. It has no pass/fail verdict of its own: a flagged case is one to look at (a mis-entry, a value from a different population, a genuine tail observation), never one to delete on sight. Where anything is flagged, the tests that rest on means pick up a caveat saying so, since a mean and its standard error follow an extreme value while a rank-based or trimmed-mean alternative doesn't. The **F-test of equality of variances** and **Bartlett's test** get a sharper one: a *variance* follows an outlier far more steeply than a mean does, and the caveat steers to the rank-based **Fligner-Killeen** test.

> **Factorial designs and the unit of analysis.** With more than one between-subjects grouping factor, the per-cell crossing of all factors is the right unit for normality, Levene, Box's M, and Mardia – not a single factor. The assumption checks build a synthetic combined factor (joining the values of all grouping variables) before running these tests. Expected-frequency checks for categorical DVs are kept on the first grouping variable, since a chi-square cross-tab is bivariate by design. In mixed designs normality is checked per between×within cell; when that crossing has too many cells to test each one, the check falls back to testing each individual factor's levels on their own – so the per-factor "between-subjects" / "within-subjects" labels in the normality table stay accurate. On that fallback the between-subjects rows are built from **subject means** (each subject averaged across its within-conditions), so a subject counts once instead of once per condition and the reported n is a subject count – a note in the table says so. Checks that summarize a subject the same way, such as the subject-means homogeneity check for mixed designs, average only over subjects complete across every within-cell, matching the sample the model itself fits.

> **Small-sample checks for categorical designs.** Categorical comparisons lean on large-sample χ² approximations, so the assumption check flags when your data is too thin for them. A **one-sample goodness-of-fit** test gets the same treatment as a contingency table: the expected count in each category is derived from your [hypothesised distribution](#expected-distribution) (uniform if you left it unset) and Cochran's ≥ 5 rule is applied – and when the rule is violated the test doesn't just warn: it switches its p-value to Monte-Carlo simulation automatically (see [goodness-of-fit output](#categorical-tests-chi-square-fishers-exact-etc)). The uniform fallback covers only the case where you haven't touched the [expected-distribution editor](#expected-distribution) at all; once you have entered weights, a zero or negative one makes the row read **Expected distribution incomplete** rather than passing on a hypothesis you never specified – the same weights **Calculate** refuses to run. **Paired categorical** designs are checked on the pieces each test actually uses – two-condition tests (**McNemar**, **Stuart-Maxwell**) need enough **discordant** pairs (subjects who changed between the two conditions), with fewer than 25 steering you to the exact test; **Cochran's Q** (three or more conditions) needs enough **informative** subjects (those whose response varies across conditions), satisfying N ≥ 4 and N·k > 24 (Tate & Brown, 1970). When a check can't apply – a Cochran's Q variable that isn't binary, or a category with no variation – the row says so instead of passing silently.

> **Two verdicts to read alongside your sample size.** **Mauchly's test of sphericity** has little power at small n – a genuine violation can go undetected – and over-rejects at large n, where a trivial departure reads as significant. Its verdict therefore carries a note saying so; and because the Greenhouse-Geisser and Huynh-Feldt corrected p-values are shown either way (and are safe to use whenever sphericity is in doubt), a borderline Mauchly result never has to be the deciding factor. **Box's M** is pinned to a fixed α = 0.001 for the same oversensitivity reason, and what it costs you now depends on **balance**: with roughly equal cell sizes (largest ≤ 1.5× smallest) a significant Box's M leaves the MANOVA family *recommended with a caveat*, since MANOVA – Pillai's trace especially – absorbs covariance heterogeneity in a balanced design; only when the cells are meaningfully unbalanced is the family demoted to **not recommended**.

> **Wide designs and chance failures.** A mixed or factorial design tests every between × within cell, so a wide one can run fifty normality tests, or fifty by-condition Levene tests, in a single check. At α = .05 that family throws two or three failures even when every cell is perfectly normal – so "any failure demotes" would quietly become "always demotes". For the two **per-cell** families – normality and homogeneity of variance by condition – the design therefore counts as violating the assumption only once the failures **outrun what chance produces** across that many tests (the largest failure count a family of that size still reaches 95% of the time under the null). Below that bound nothing is demoted: the affected tests stay recommended with a caveat pointing you at the per-cell results. The per-cell rows themselves are always shown raw, and both summary rows disclose the bound in the same breath as the count – *"…no more failures than chance produces across this many tests, so this is not treated as a violation"* – so a visible failure count can never read as contradicting the recommendation beside it. Narrow families keep a bound of **zero**: with two or three groups a single failure still demotes, which is the right conservatism there.

> **What to do when assumptions are violated:** don't panic – many tests are robust to mild violations, especially with larger samples. The assumption check provides specific test recommendations based on the results, telling you which tests are safe to use and which to avoid.

### Test recommendations

Based on the assumption results, the system lists:

- **Recommended tests** – those whose assumptions are met. A recommended test may carry a **caveat** in muted text when an assumption is technically flagged but non-disqualifying: if normality fails yet every group clears the [**Small-sample advisory floor (N)**](./settings.md#assumption-advisory-thresholds), the test stays recommended with a note that it is robust by the central limit theorem – the note names that threshold, so raising or lowering the setting moves the line the caveat is judged against rather than leaving a hard-coded 30 behind; if sphericity is violated for a repeated-measures or mixed ANOVA, the test stays recommended with a caveat pointing at the sphericity-corrected p-value (GG or HF) that now drives the verdict in its results table (the correction is automatic, so a violation doesn't disqualify the test); if multivariate normality could not be checked for some or all groups (too few complete cases, or a singular covariance matrix, for a MANOVA-family test), the test is recommended with a note that the assumption is unverified; and if normality could not be assessed at all – every group too small to test, or so large the test was skipped – the test carries a note that is cautionary for small samples (no central-limit cover, so weigh an exact or non-parametric alternative) and reassuring for large ones. Two more caveats follow the same pattern: when Mauchly's test itself fails to compute for a variable, the repeated-measures and mixed ANOVA recommendations note that sphericity could not be verified; and **ART-ANOVA** and **repeated measures factorial ART** carry a **standing** caveat – present whatever the variance check says, because no check on the panel covers the whole of what they assume – that they assume equal variances across the design cells, the within-subjects levels included, and that the alignment applies no correction, so their F-tests are anti-conservative wherever those variances differ. The [spread of the cell standard deviations](#detailed-results) reported below is what lets you judge how far off they are. When the by-condition Levene check does flag unequal variances, **mixed ANOVA** splits the same way Box's M does: with roughly equal cell sizes (largest ≤ 1.5× smallest) it stays recommended with a caveat, since a balanced mixed ANOVA's F-tests tolerate unequal group variances; with unequal cells it is demoted, because an unbalanced one does not absorb them. A wide per-cell family adds one more caveat of its own – see the chance-bound note above. And when homogeneity of variance or multicollinearity could not be assessed at all – every cell too thin to test – the tests that lean on the assumption stay recommended with a note that it is unverified, rather than a silent pass. In most cases the test is still safe to use – the caveat just tells you what to keep an eye on.
- **Not recommended tests** – with specific reasons. These cover both violated assumptions (e.g. "Normality assumption violated", "Homogeneity of variance violated") and design fit. One reason names the follow-up it triggers rather than just the failure: when **covariate: regression slopes** fails, the covariate-bearing tests are demoted with *"Homogeneity of regression slopes violated – one adjusted difference cannot hold across the covariate, so the card reports each pair's region of significance instead"*, pointing you at the [heterogeneous-slopes results](#heterogeneous-slopes-results) the card runs anyway. On design fit: a test that needs exactly two groups is flagged "Requires a two-group comparison", an omnibus test (ANOVA, Kruskal-Wallis, Friedman) whose comparison factor has only one level is flagged "Requires a factor with two or more levels", a factorial test is flagged "Requires two or more grouping factors", the ordered-alternative tests (Jonckheere-Terpstra, Page's trend test, Cochran-Armitage) are flagged when the comparison factor isn't ordinal or has fewer than three levels – the same requirement **Calculate** enforces (see [choosing a test](#choosing-a-test)) – and when you haven't specified the full model yet (e.g. no grouping selected) the affected tests read "Not assessed – specify the full model to evaluate" rather than being recommended blindly. For repeated-measures and mixed ANOVA the exact normality assumption is on the model residuals: with a subject ID the residuals are tested directly, and without one the per-condition marginals are tested as a practical proxy. When residuals are tested directly, the central-limit caveat is judged on the number of subjects – the independent units – rather than the residual count, and the table reports that subject count. The recommendation – and the normality table itself – names whichever was used.

### Detailed results

Individual tables for each assumption test showing per-variable, per-group results with test statistics, p-values, and color-coded status (green = pass, red = fail, yellow = warning). A covariate assumption (regression slopes, linearity, independence) reads **Not assessed** in the summary when its model could not be fit for any variable, rather than defaulting to a pass; the homogeneity-of-variance and multicollinearity summaries do the same – they fall to **Not assessed** when nothing could be assessed, instead of the reassuring "Equal variances assumed" / "No multicollinearity detected".

The normality tables are followed by a **residual Q-Q plot for each dependent variable**, drawn on the same residuals the rows above were tested on, so the visual check is right there instead of requiring a second analysis. A note beside them reads the sample-size-robust part of the table out loud: **W** is the straightness of that Q-Q plot expressed as a number, **skewness** measures asymmetry and **excess kurtosis** tail weight (both 0 for a normal distribution) – while the p-value beside them rejects trivial departures at large n and misses real ones at small n. For the full test battery (D'Agostino-Pearson K², Jarque-Bera, Anderson-Darling), run the same variables through [Normality analysis](./distribution-analysis.md#normality-tests). Two disclosures come with the plots: each pools the rows above, so departures in opposite directions can cancel out in the pooled picture – read it beside the per-row numbers, not instead of them – and where a variable has more than 5000 residuals the plot shows a 5000-point subsample taken **in rank order**, which is the same curve at lower resolution rather than a random sample.

When an ART test is among the recommendations, a **Spread of the cell standard deviations** section is added: one row per dependent variable with the number of cells, the smallest and largest cell SD, and their ratio. It is a **diagnostic, not a pass/fail check**, which is why it has no row in the summary table and no verdict – deliberately no threshold is offered, because how much a given ratio matters depends on the cell sizes and on whether the spread runs across the between-subjects groups or the within-subjects levels. It is computed on exactly the sample the ART fit uses, so it matches the same numbers reported beside the [ART-ANOVA results](#art-anova) to full precision. A cell with zero variance keeps its place in the smallest/largest columns but leaves the ratio blank.

## Reading results

Click **Run comparison analysis** to perform the test. The system validates your setup first – if something is missing (no dependent variables, no grouping variable assigned, etc.), an alert explains what's needed.

Results vary by test type. Here's what to expect for each:

> **Diagnostics.** Some tests attach a **Diagnostics** note below their results, surfacing decisions the module made on your behalf – covariates that were ignored (ART-ANOVA), subjects dropped for incomplete cells (mixed designs), a covariate whose relation to the outcome shifts across conditions (a significant covariate × within-subject interaction, which makes covariate-adjusted within-subject effects hard to interpret), an odds ratio left uncomputed because the realized table wasn't 2×2 (Fisher's exact) or 2×2×K (Cochran-Mantel-Haenszel), and similar adjustments. It's there so nothing happens silently; read it to confirm the analysis ran on the data you expected.

### Standard tests (t-test, ANOVA, Kruskal-Wallis, etc.)

An "Overall test results" table with one row per dependent variable:

- Per-group summary statistics (depending on your [selections](#summary-statistics)). In a multi-variable run a group can be empty for one dependent variable while carrying data for another – its row is then kept but left blank, so the gap is visible rather than dropped from the table or filled with placeholder numbers
- The **difference** itself (two-group tests), each test reporting the estimate its own machinery produces: the mean difference for the t-tests, the difference of trimmed means for Yuen's, and the **Hodges-Lehmann shift** – the median of all between-group pairwise differences – for Mann-Whitney. The column header names the two levels in the order they were subtracted, so a sign is never ambiguous. The one-sample tests report their location estimate the same way: the mean, the pseudo-median, the median
- Confidence interval of the difference (two-group tests, if CI is enabled)
- Test statistic with significance stars
- Degrees of freedom

> **Confidence interval of the difference:** this range tells you where the true population difference likely falls. For example, "CI [2.1, 8.7]" means the real difference is probably between 2.1 and 8.7. If the interval doesn't cross zero, the difference is statistically significant. Wider intervals mean more uncertainty – usually from smaller samples. This interval is always **two-sided**, even when you run a one-tailed test: it describes the magnitude and precision of the effect, while the one-tailed p-value drives the directional decision.

> **Degrees of freedom (df):** a number that reflects how much independent information went into the calculation – roughly, sample size minus the number of things being estimated. You don't need to interpret df directly; it's reported because it's needed to look up critical values and verify the test was run correctly. A t-test with 58 df means about 60 total observations were used.

- p-value (formatted per your [p-value settings](./settings.md#p-value-settings))
- Sphericity-corrected p-values (repeated measures ANOVA with 3+ conditions) – **ε (GG)** / **df (GG)** / **p (GG)** and **ε (HF)** / **df (HF)** / **p (HF)** columns, with a separate **Mauchly's test of sphericity** table below the results. The uncorrected p assumes sphericity; the corrected columns apply the epsilon to the degrees of freedom, and the **df (GG)** / **df (HF)** columns show the resulting (effect, error) pair so a corrected F can be reported APA-style, e.g. F(1.32, 11.88) = 8.7. The **Interpretation** verdict is driven by the corrected p – GG or HF by the Girden rule – for **every** within-subjects effect, whatever Mauchly's test says, and is tagged **GG-corrected** / **HF-corrected** so the driving p is never ambiguous. See [Sphericity and the two corrections](#mixed-anova). All of this belongs to the univariate route: pick [**Multivariate (Pillai)**](#within-subjects-approach) instead and these columns give way to a **V** column with that trace's approximate F, and the Mauchly table goes with them.
- Adjusted p-value (if [adjustment](./settings.md#multiple-comparison-adjustment) is active in addition mode)
- Equivalence p-values (when an [equivalence test direction](#test-direction) is selected) – see below
- Effect size with CI and SE (if enabled – CI and SE are shown only where the chosen measure supports them; see [effect sizes](#effect-sizes))
- Interpretation (if enabled in [settings](./settings.md#significance-formatting))

> **Trend tests report a single statistic, no df.** Jonckheere-Terpstra (**J**) and Page's trend test (**L**) report their own statistic with the p-value and leave the df column blank – these are their natural scales. Cochran-Armitage reports a **signed Z** (positive for an increasing trend, negative for decreasing); its square is the usual 1-df trend χ². For all three, the p-value reflects the [trend direction](#trend-direction) you chose, and the interpretation column states it in kind – "Significant increasing/decreasing/monotonic trend" rather than the generic difference wording. When ties or a small sample force Jonckheere-Terpstra onto a seeded permutation p-value, a note under the results records the replicate count used (the [**Permutation replications**](./settings.md#permutation-replications) setting). Page's L uses the **exact** null distribution – Page's per-block table convolved across blocks – when no block contains tied ranks and there are fewer than 16 conditions, falling back to the tie-corrected normal approximation otherwise; the two differ materially in exactly the small-k regime the test is built for, so the exact branch is taken whenever it applies. Each trend test also carries its conventional effect size when [effect sizes](#effect-sizes) are enabled – Kendall's τ-b for Jonckheere-Terpstra, Page's ρ̄ for Page's trend test. The per-group/condition summary stats are still shown, ordered by the factor's ascending levels so the trend reads top-to-bottom.

> **What a dependent-samples card discloses about its subjects.** Paired and repeated-measures runs print two disclosures in the notes under the results table, on top of the warning toasts they also raise – so a shrunken or quietly averaged sample stays visible after the toast is gone. **Excluded subjects** are counted per dependent variable ("*{variable}*: {n} subject(s) were excluded for missing a value in at least one condition"), because listwise-by-subject deletion is decided variable by variable. **Averaged duplicate rows** are counted once for the whole run ("{n} subject(s) had more than one row per (subject, condition) cell; each cell was averaged over its rows, marginalizing the factors the design left out"), because the reshape happens before the per-variable loop.

If any variables fail, an error summary groups failures by error message.

#### Where the distributions separate

The **Kolmogorov-Smirnov** card carries a second table breaking its statistic apart – one row per dependent variable under the omnibus, and one per group pair inside a collapsible panel on the pairwise expansion:

- **D⁺** – the largest amount by which the first group's cumulative curve runs *above* the second's, and **Value at D⁺**, the value of the variable where that maximum is reached
- **D⁻** and **Value at D⁻** – the same in the other direction
- **Larger gap** – which of the two carries D = max(D⁺, D⁻), the statistic tested above

The winning gap is also drawn on the [ECDF plot](#ecdf-plot) as a vertical drop between the two curves at that value.

> **What the decomposition buys you.** "The distributions differ" is a weak sentence on its own. D⁺ and D⁻ say *which way* the difference runs, and the values beside them say *where along the scale* the two groups come apart – a separation that lives in the lower tail is a different finding from one at the median, and D alone cannot tell them apart.

> **And a note on one-tailed readings.** The test itself stays two-sided, but a note under it records that this is **conservative** for a directional reading: in the tail P(D > d) ≈ 2·P(D⁺ > d), so a result significant two-sided also supports the one-sided claim in the direction of the larger gap. What the module does not offer is a one-sided KS *p-value* – R's own one-sided form inverts the meaning of the shared **Group 1 > Group 2** control, and three p-values on one card invite reading the smallest as the answer. For a directional decision on the same data, the **Mann-Whitney U** and **Brunner-Munzel** tests both take the direction control properly.

#### Equivalence test results

When an equivalence direction is selected, a note above the table shows the test type and the Δ bound. If you entered Δ in **standardized** units, the note states the entered value and direction once – they're analysis-wide – and then lists the **raw** bound **per variable**, since each dependent variable's raw Δ is its standardized Δ times that variable's own SD and so differs across variables; a single raw bound is shown when you entered Δ in raw units (it applies to every variable). For parametric tests (t-tests) the standardizer is Cohen's d (pooled SD, or Welch's √[(s₁² + s₂²) / 2] when variances are unequal, or the variable's own SD in one-sample mode). For non-parametric tests (Wilcoxon signed-rank, Mann-Whitney U), Δ is interpreted on a **robust** scale – the median absolute deviation (MAD, rescaled to a normal-SD equivalent via /0.6745) of the differences for paired, the variable's own MAD for one-sample, or a pooled MAD for independent – so the standardizer matches the test's rank-based location parameter rather than mixing a parametric scale with a non-parametric test. In equivalence mode the omnibus test runs two-sided, so its standard p-value column is labeled **p (two-sided)** to set it apart from the equivalence decision. Additional columns appear after it:

- **p (lower)** and **p (upper)** – the two one-sided p-values (for TOST and MET, which test both bounds)
- **p (equiv)** or **p (MET)** – the combined equivalence p-value

For TOST, the combined p-value is the *maximum* of the two one-sided tests (both bounds must be satisfied). For MET, it's the *minimum* (either bound being exceeded is sufficient). Non-inferiority and superiority show only one p-value since they test a single bound.

> **The two-sided p is not the equivalence result.** **p (two-sided)** answers the ordinary question "do the groups differ?" – it has nothing to do with whether they're equivalent. Read the equivalence decision from **p (equiv)** / **p (MET)** (and the interpretation column), not from **p (two-sided)**. A difference can be both statistically significant *and* practically equivalent.

> **The difference CI is reported at the equivalence level.** In equivalence mode the confidence interval of the difference is built at **1 − 2α** (e.g. 90% when α = 0.05), not the level set in [settings](./settings.md) – and its column header states that level. This is the standard TOST convention: at 1 − 2α, "the whole interval falls inside ±Δ" is exactly equivalent to "TOST rejects at α", so the interval visually confirms the reported decision. (Outside equivalence mode the difference CI uses your configured confidence level.)

The interpretation column reflects equivalence outcomes:

- TOST significant → "Equivalent (within Δ = X)"
- Non-inferiority significant → "Non-inferior (Δ = X)"
- Superiority significant → "Superior (Δ = X)"
- MET significant → "Meaningful effect (|d| > Δ = X)"

Here Δ = X is the bound *you entered* (standardized or raw), so it reads back as the value you set; the bounds note above the table is where the raw-unit conversion is shown.

Pairwise comparison tables (both matrix and long format) also include equivalence p-values when applicable.

> **Equivalence decisions are multiplicity-adjusted too.** When you test several dependent variables (or pairwise conditions) at once, it's the equivalence decision p – **p (equiv)** / **p (MET)**, not the two-sided p – that enters the run-wide [p-value adjustment](#p-value-adjustment), like any other result. In addition mode a **p (equiv, adj)** / **p (MET, adj)** column carries the adjusted value; in replacement mode the decision-p column shows it directly. The equivalence verdict in the interpretation column follows the adjusted p.

### Categorical tests (chi-square, Fisher's exact, etc.)

A contingency table showing:

- Observed frequencies with column percentages
- Expected frequencies (**Exp:**) and standardized residuals (**Std. res:**) beneath each observed count (chi-square test; a note under the table explains the two prefixes)
- Row and column totals

> **Standardized residuals show where the association lives.** Each cell's residual says how far it sits above (+) or below (−) its expectation, on a scale where the value behaves like a standard normal deviate. A residual printed **in bold** clears the critical |z| **Bonferroni-adjusted over the number of cells** – the note under the table gives both the critical value and the cell count – so what is marked is a cell extreme enough to survive the fact that you are scanning the whole table, not merely one past a rule-of-thumb ±2. The test reports the overall verdict; the residuals show which cells carry it. The same rule and the same critical value mark the bars of the [category proportion plot](#category-proportion-plot), so the chart and the table can never disagree about which cells stand out.

> **Fisher's exact has no test statistic.** Fisher computes the p-value directly from the hypergeometric distribution, so the Statistic column is blank for Fisher; the effect-size column carries **Cramér's V** or the **odds ratio** instead (on a 2×2 table the odds ratio comes with its exact CI from `fisher.test`). With a [one-tailed direction](#test-direction) selected (2×2 only), the p-value is one-sided and a note under the table spells out the tested odds direction.
>
> **When Fisher's exact stops being exact.** Enumerating an r×c table can't be interrupted once it starts, so the module bounds it. A **2×2** or **2×k** table is enumerated exactly at any sample size, as long as the table stays under about 30 cells. A table with three or more rows **and** three or more columns switches to a seeded **Monte-Carlo p-value** (10,000 replicates) once the total count passes 1,000 – as does any table above the cell bound, or one whose enumeration would exhaust R's workspace. A note under the results says the p-value was simulated, and a second note appears when that p sits at its resolution floor of 1/10,001, where the honest reading is "at most this" rather than a point estimate. Tables larger than 2×2 are two-sided only – the Freeman-Halton generalization has no directional form.

> **McNemar switches to an exact test for small samples.** When the discordant count (b + c) is below 25, McNemar's test automatically uses the exact binomial test on the discordant pairs instead of the asymptotic χ². Like Fisher, the exact test has no χ² statistic, so the Statistic column is blank and a note records that the exact test was used (with the b + c count). The same applies to Stuart-Maxwell's 2×2 reduction. If b + c = 0 (perfect agreement), the test is undefined and the statistic and p-value are reported as **NA** with a note.

> **Stuart-Maxwell and singular paired tables.** Stuart-Maxwell's χ² is undefined when the matrix of marginal differences is fully singular – typically caused by empty or perfectly redundant categories. In that case the statistic and p-value are reported as **NA** and a note flags the affected variable, rather than silently producing χ² = 0, p = 1. When the matrix is only **partially** singular (some categorical structure was redundant but not all), the χ² is computed against a reduced-rank pseudo-inverse with the degrees of freedom adjusted to the effective rank, and a note flags the result as approximate. For 2×2 tables the test delegates to McNemar (with which it is equivalent), honoring the [continuity correction](#continuity-correction) setting so it matches the dedicated McNemar test, and the method line reflects that.

> **Which value is the "success".** When a binary outcome uses two values that aren't 0 and 1 (e.g. "yes"/"no"), the higher value is coded as the "success" – for both **Cochran's Q** and the **Cochran-Armitage trend test**. A note in the output records which value was treated as the success, so the frequency table (and, for Cochran-Armitage, the sign of the trend) can be read correctly.

> **Goodness-of-fit output.** The goodness-of-fit test shows an **Observed vs expected** table over one variable's categories rather than a cross-tab – only one variable is involved. Each row gives the observed **Count** with its percentage and, beneath it, the **Exp:** expected count under your distribution. The results table carries the χ² statistic, its degrees of freedom (number of categories − 1), the p-value, and Cohen's w if [effect sizes](#effect-sizes) are enabled. If any expected count falls below 5 – where the asymptotic χ² approximation gets unreliable – the p-value is recomputed by seeded Monte-Carlo simulation (10,000 replicates), and a note reports the minimum expected count and the replicate count. The χ² statistic and df stay the asymptotic ones; only the p-value is simulated. Collapsing sparse categories or gathering more data remains the better structural fix. With [visualization](#observed-vs-expected-plot) enabled, an observed-vs-expected chart accompanies the table.

> **Cochran-Mantel-Haenszel output.** The results table carries the Mantel-Haenszel χ², its df = (I−1)(J−1), and the p-value; for the **2×2×K** case the **common odds ratio** (with CI) is shown when [effect sizes](#effect-sizes) are enabled. Below the table you get the **pooled (marginal) contingency table** followed by **one table per stratum** – the per-stratum slices the test actually pools over, so you can see whether the association points the same way in each. For 2×2×K a **Breslow-Day** line appears in the notes: it tests whether the per-stratum odds ratios are homogeneous. If it is **non-significant**, the single common odds ratio summarises all strata fairly; if it is **significant**, the odds ratios differ across strata and the note warns that the common odds ratio may be misleading – report the per-stratum tables instead. Further notes appear when the strata are thin. If the pooled table is **too sparse for the χ² approximation**, the test switches to the **exact conditional** form instead – which reports a p-value but no χ² statistic, so that column comes back blank and a note says why. If some strata contain a **zero cell**, a note flags that the common odds ratio and Breslow-Day test may be unstable, with the count of affected strata; and if Breslow-Day cannot be computed on the table at all, a note says the homogeneity of the odds ratios could not be assessed, rather than leaving its absence unexplained. Whenever an odds ratio is reported, a note spells out what it divides by what – which category and which group sit in the numerator – so the direction is never read off the label alone.

### Pairwise comparisons

Produced by automatic pairwise expansion (two-sample test with 3+ groups) or post-hoc tests.

**Matrix format** – lower-triangle matrix where each cell shows the test statistic (with df), difference CI, p-value, and effect size on separate lines. Cells are colored by significance.

**Long format** – flat table with columns for comparison pair, group statistics, difference CI, test statistic, df, p-value, adjusted p-value, effect size, and interpretation.

A legend explains the notation used. Above the tables, a **Pairwise analysis summary** reports how many variables were analyzed and how many comparisons that came to in total, and – when an [adjustment](#p-value-adjustment) is active – names the method and the family it was applied over: *within each variable's own family* for an omnibus test's opt-in pairwise breakdown, or *pooled with every other test in this analysis* for an automatic pairwise expansion. The post-hoc tables carry their own "Method: … with … adjustment" line, so this note is what keeps the flat pairwise tables from leaving their correction implicit.

> **Categorical pairwise contingency tables.** When the pairwise comparisons come from a categorical test (chi-square, Fisher's exact) and [**Frequency tables**](#summary-statistics) are enabled, a collapsible *Pairwise contingency tables* section appears below the comparison table – one panel per dependent variable, holding the observed-count sub-table each individual pair was tested on, so you can read the pairwise result against the counts that produced it.

> **Degrees of freedom in Student's expansion.** Because the independent t-test pairs share the pooled error term (see [Choosing a test](#choosing-a-test)), the reported df is N − k (total sample size minus the number of groups), not the two-group n₁ + n₂ − 2 – this is expected and reflects the extra precision from pooling. A note under the table says so in the output, gives the pooled df, and names **Welch's t-test** as the way to get a per-pair separate-variance error instead – the pooling is a consequence of the test you chose, so the test selector is the control over it. Welch's expansion keeps each pair's own (fractional) df.

> **Which comparisons a confidence interval covers.** Two kinds of interval appear on pairwise surfaces and they are headed differently, because they claim different things. A post-hoc table whose critical value was widened over the family – Tukey, Games-Howell, Dunnett's T3, lincon, the exact multivariate-t routes, and pairwise t-tests once an adjustment is running – heads its column **{level}% simultaneous CI**: the stated confidence covers *every* contrast in that family at once, which is why such an interval is wider than the pairwise one and why it pairs correctly with the adjusted p beside it. The automatic pairwise expansion heads its column with the plain **{level}% CI**, a per-comparison interval, and keeps the note saying it is not adjusted for multiplicity. Both are valid; before, both said the same thing.

> **Which error term a contrast was computed against.** Post-hoc blocks on designs with a within-subjects factor carry a note naming this, because it decides how the table relates to the F above it. The **repeated-measures and mixed families** (repeated measures ANOVA, repeated measures factorial ANOVA, mixed ANOVA, and the two multivariate ones) give **each comparison its own error term** – the error term of the cells that comparison actually involves, rather than the split-plot pooled MSE the omnibus is computed from. That keeps every contrast valid when sphericity doesn't hold; the price is fewer degrees of freedom per contrast, and the fact that a comparison need no longer agree with the omnibus verdict. The **ART families** do the opposite and pool, with the consequences described under [ART-ANOVA](#art-anova). Factorial ANOVA sets neither note: it pools too, but with no within factor there is no sphericity for the pooling to assume.

> **Conover's post-hoc reports one reference df.** Conover's test – the non-parametric post-hoc after a significant Kruskal-Wallis or Friedman test – shares a single (n − 1)(k − 1) degrees-of-freedom value across every pair, so it's stated once in a note above the table rather than repeated per row.

### Classification (ROC) results

When ROC is enabled, results include a "Classification (ROC) analysis" sub-section. The main table has one row per (dependent variable × pair × threshold):

- **Variable** – the dependent variable being thresholded.
- **Comparison** – the group pair (only shown when pairwise expansion is in effect for 3+ groups).
- **Predicted group** – the group whose membership is signalled by *higher* scores. Orientation is auto-detected so the AUC is always ≥ 0.5 – except when **Compare AUCs** is on with two or more variables: there a single shared orientation is kept across all variables (the paired DeLong test needs every curve on the same case/control split), so a variable that discriminates in the opposite direction legitimately shows **AUC < 0.5**, and a legend note under the table explains it.
- **Other group** – the paired group, the one signalled by *lower* scores (the `other` count in the **N** column below). Named so the table states explicitly what "other" refers to.
- **AUC** – area under the ROC curve. 0.5 = chance, 1.0 = perfect discrimination.
- **{level}% CI** – confidence interval for the AUC (DeLong or bootstrap, per your selection).
- **Brier** – mean squared error of the Platt-calibrated probabilities against actual group membership, on the probability scale: 0 is perfect and **lower is better**. Where the AUC only asks whether the scores *rank* the groups correctly, the Brier score asks whether the probabilities they imply are *right*. The calibration is fitted in-sample, so read it as how well the score fits this data, not as forecast skill on new data.
- **Brier skill** – the same score rescaled against the base-rate predictor, which keeps it comparable across dependent variables with different group balance: **1 is perfect, 0 is no better than always predicting the base rate**, and a negative value is worse than that.
- **N** – total observations as `total (predicted/other)`.
- **Worse to misclassify** – only present with cost-weighted thresholds; identifies which of the two reported thresholds corresponds to the asymmetric-cost direction.
- **Threshold** – the cutoff. Scores ≥ threshold are classified as the predicted group.
- **Sensitivity / Specificity** – sensitivity and specificity for the predicted group at the threshold.
- **PPV / NPV** – positive and negative predictive values.
- **Accuracy** – overall correct-classification rate.

With the cost-weighted rule, a note under the table records the cost ratio and which prevalence drove the threshold – the sample's own, your [population-prevalence override](#classification-roc-analysis), or, when a pairwise expansion mixes the two, "population prevalence 0.3 where it applies and the sample prevalence elsewhere". A second note does the same for **PPV / NPV / Accuracy** under any threshold rule, naming the group the override was tied to. Two of its variants say the override reached nothing here: the level you named isn't one of the groups in this comparison, or no group was named for it at all. Both fall back to the sample prevalence and say so, so an entered prevalence is never silently assumed to have applied. Variables whose ROC computation fails are grouped into an error summary rather than appearing as table rows.

> **AUC interpretation.** Common rules of thumb: 0.5–0.6 = poor, 0.6–0.7 = fair, 0.7–0.8 = good, 0.8–0.9 = excellent, 0.9+ = outstanding. These are guidelines, not laws – practical value depends entirely on the cost of errors in your domain. A 0.65 AUC may be transformative for a problem that previously had no marker; a 0.85 AUC may be insufficient for a high-stakes diagnostic decision.

> **Sensitivity vs. specificity** – sensitivity is the fraction of predicted-group cases correctly classified (true positive rate); specificity is the fraction of other-group cases correctly classified (true negative rate). They trade off as the threshold moves: lower threshold → higher sensitivity, lower specificity, and vice versa. The Youden / closest / cost-weighted rules pick a single point along this trade-off.

> **PPV and NPV depend on prevalence.** Unlike sensitivity and specificity, predictive values change with the proportion of the predicted group in your sample. If your sample's group-size ratio doesn't reflect the real-world prevalence, treat the sample-based PPV and NPV as illustrative – they won't generalize directly. To correct for that, set the [population-prevalence override](#classification-roc-analysis): it recomputes **PPV**, **NPV**, and **accuracy** at the prevalence you supply (sensitivity and specificity, which don't depend on prevalence, are unchanged), under any threshold rule. Under the cost-weighted rule the override *also* moves the threshold itself.

#### AUC comparison (DeLong's test)

When **Compare AUCs** is enabled and 2+ AUCs are produced, an additional table tests them pairwise:

- **Variable 1** and **Variable 2** – the two AUCs being compared.
- **Δ AUC** – AUC(Variable 1) − AUC(Variable 2).
- **Z** – DeLong's test statistic for the difference between paired AUCs on the same subjects.
- **p-value** (and adjusted p-value, if [p-value adjustment](./settings.md#multiple-comparison-adjustment) is set to addition mode).

For pairwise group expansion across 3+ groups, the table is split into one section per group pair, with cross-DV comparisons within each pair.

### Factorial ANOVA

Factorial ANOVA is designed for **two or more** grouping factors so that interactions can be tested. With a single factor it collapses to a one-way ANOVA with only one effect row – in that case, pick the **One-way ANOVA** test directly for a cleaner output and assumption-check fit.

It also accepts [covariates](#variable-roles), which makes it a **factorial ANCOVA** – a 2×2 design with a pretest covariate needs no separate test. The covariate rows join the design effects in the same source table, the adjusted means below become covariate-adjusted, and everything else in this section reads the same way.

One **source table** per dependent variable, with a row per effect (main effects and interactions) and two closing rows that complete the variance partition:

- **Source** – the effect name. With covariates present each row is tagged **(covariate)** or **(factor)** so the two kinds of predictor are told apart at a glance; interaction rows carry no tag, since "A × B" already reads as a design term
- **SS** and **MS** – the sum of squares the chosen [type](#sums-of-squares) credited to that source, and its mean square
- **df** – the effect and error degrees of freedom
- **F** statistic with significance stars, and the **p-value**
- Effect size (if enabled): partial η² (default), η², ω², or ε² – selectable in the **Effect size** dropdown
- Interpretation distinguishing main effects from interactions
- An **Error** row (df, SS, MS) and a **Total (corrected)** row (df and SS) close the table, so every number above can be checked against the partition it came from. Both leave the F, p and effect-size cells blank, and the corrected total deliberately shows no mean square – SS/df there is the sample variance, not a source-table term

> **What the non-partial effect sizes divide by.** η², ω² and ε² are each the effect's share of the **corrected total** sum of squares – the row at the foot of the table, which is exactly what makes them checkable by hand. Type III credits every term with its unique contribution alone, so on an unbalanced design those shares do **not** add up to the model's R², and packages that divide by the effect's own SS plus the error SS instead will report slightly different numbers. Partial η² is unaffected, being partial by definition. A note under the table says the same, naming whichever measure you chose.

When post-hoc is enabled, a section follows the effects table with one block per effect term – main effects and two-way interactions only; three-way and higher interactions are omitted from the post-hoc, since their contrast tables grow unreadably large, though their omnibus F still appears in the effects table above:

- **Main effect** – pairwise comparisons of that factor's levels, marginalized over the other factors
- **Interaction** – all cell-pair contrasts across the involved factors. For two-way interactions, two **simple-effects** tables follow, showing pairwise comparisons of one factor at each level of the other (and vice versa)

Each comparison reports the difference with its confidence interval, the t-ratio with df, and the adjusted p-value. Each block notes the adjustment method used. When the omnibus effect was not significant, a warning above its post-hoc table flags it.

An **Adjusted means (estimated marginal means)** section also appears – **always**, whether or not post-hoc tests are enabled, since the marginal means are what the effects table's nulls are about – giving the EMM per factor level and per cell over the full crossing, each with SE and CI. With no covariates these are the *equal-weighted* marginal means, which is the quantity a Type III effect actually tests; on an **unbalanced** design they diverge from the sample-size-weighted raw means in the descriptives, so seeing both keeps the verdict and the reported means about the same thing. With covariates present they are covariate-adjusted, and a line beneath names each covariate and the value it is held at (its mean over the rows the model was fitted on).

With covariates present, a **[Heterogeneous slopes (regions of significance)](#heterogeneous-slopes-results)** section follows the adjusted means, contrasting the between-cell crossing pair by pair.

A **Descriptive statistics** section follows – marginal summaries for the grouping factors and a per-cell table over their full crossing, each carrying whichever summaries you enabled under [summary statistics](#summary-statistics). The per-cell counts make any cell imbalance visible at a glance.

> **Reading factorial post-hoc:** start with the omnibus effects table to decide which terms matter, then drill into the relevant block. A significant interaction is best interpreted via the simple-effects tables – they tell you exactly where the interaction lives (e.g. "Treatment matters for women but not for men"). When the interaction is non-significant, the main-effect comparisons are the primary read.

### ANCOVA

For each dependent variable, up to five sections:

1. **Effects table** – rows for covariates and factors, each with F statistic, df, p-value, and partial eta-squared. Labels indicate covariate vs. factor.
2. **Adjusted means** – raw mean, SD, adjusted mean (bold), SE, and CI per group, with a note naming each covariate and the value it is held at (its mean over the complete-case rows the model was actually fitted on)
3. **Post-hoc comparisons** – pairwise contrasts on adjusted means with the difference and its confidence interval, SE, df, t-ratio, and p-value
4. **[Heterogeneous slopes (regions of significance)](#heterogeneous-slopes-results)** – the per-pair slope differences and Johnson-Neyman regions, since a covariate is always present here
5. **Descriptive statistics by group** – the unadjusted per-group summaries, carrying whichever statistics you enabled under [summary statistics](#summary-statistics). They sit below the adjusted means on purpose: seeing the raw means beside the adjusted ones is what shows how much the covariate moved each group

> **What are adjusted means?** When you control for covariates, the group means are recalculated as if all groups had the same covariate values. These "adjusted" or "estimated marginal" means remove the covariate's influence, giving a cleaner comparison of the groups. The value each covariate is held at – its mean – is printed beneath the table, the same line SPSS and SAS report, so an adjusted mean is never mistaken for a covariate-free one.

### Mixed ANOVA

For each dependent variable:

1. **Effects table** – each effect labeled "(between)", "(within)", or "(covariate)". With 3+ conditions, additional columns show both Greenhouse-Geisser (GG) and Huynh-Feldt (HF) epsilon values, the corrected degrees of freedom each implies, and their corrected p-values. A line above the table reports **N = {n} complete subjects** – the subjects with complete data across every within-subject cell, which is the sample the omnibus F was actually computed on, so any listwise drop stays visible. Mixed ANOVA, [ART-ANOVA](#art-anova) and repeated measures factorial ANOVA all report it.
2. **Mauchly's test of sphericity** – when applicable (3+ conditions), with W statistic, p-value, and interpretation
3. **Post-hoc comparisons** – organized into sections (each comparison reports the difference with its confidence interval):
   - Between-subjects comparisons (group)
   - Within-subjects comparisons (condition)
   - Simple effects: group comparisons within each condition
   - Simple effects: condition comparisons within each group

   Contextual hints appear based on significance, e.g. "Main effect of group was not significant – interpret comparisons with caution" or "Interaction was significant – consider simple effects analysis."
4. **Adjusted means (estimated marginal means)** – shown when post-hoc tests are enabled or covariates are included; the equal-weighted marginal means with no covariate, covariate-adjusted when a covariate is present – in which case a note beneath names each covariate and the mean it is held at
5. **[Heterogeneous slopes (regions of significance)](#heterogeneous-slopes-results)** – with a covariate present, the per-pair slope differences and Johnson-Neyman regions. A mixed design contrasts on both sides, so its rows carry the **Contrasts** and **At** columns
6. **Descriptive statistics** – one table per between-subjects factor, one per within-subjects factor, and one for the full between × within cell crossing, each carrying whichever summaries you enabled under [summary statistics](#summary-statistics) (means, SDs, sample sizes, …). The per-cell counts make any between-cell imbalance visible at a glance.

> **Sphericity and the two corrections:** sphericity means the variances of differences between all condition pairs are equal – a technical assumption of repeated measures ANOVA. Where it is violated, the degrees of freedom are adjusted downward to make the test more conservative. Two corrections are reported: **Greenhouse-Geisser (GG)** is the more conservative one; **Huynh-Feldt (HF)** is less conservative and tends to be more accurate when the true sphericity is not severely violated. The choice between them follows the Girden (1992) rule: use GG when the GG epsilon is below 0.75, HF when it is 0.75 or higher.
>
> **The correction is applied to every within-subjects effect, whatever Mauchly's test says.** The significance verdict, and the [multiplicity-adjusted p](#p-value-adjustment) that feeds it, are driven by the sphericity-corrected p-value rather than the uncorrected one, and the **Interpretation** column is always tagged **GG-corrected** or **HF-corrected** so the p behind the decision is never ambiguous. Mauchly's test is reported alongside as information, not as a gate: it is under-powered at small samples and over-sensitive at large ones, so making the correction conditional on it would mean trusting exactly the verdict least worth trusting. Nothing is lost by correcting unconditionally – where sphericity genuinely holds, ε̂ sits near 1 and the correction barely moves the p-value. A note under every Mauchly table says so, so an "assumption met" row can't be read as "no correction was applied". This covers the parametric within-subjects families only – repeated measures ANOVA and the within-subject terms of mixed ANOVA and repeated measures factorial ANOVA; ART-ANOVA has no sphericity notion and between-subjects terms are unaffected, so neither is ever tagged. Report whichever correction was applied along with its epsilon value.

### ART-ANOVA

The non-parametric counterpart to Mixed ANOVA. Results appear in their own "ART-ANOVA results" card and share the Mixed ANOVA table layout, one table per dependent variable – including the **N = {n} complete subjects** line above it, since the aligned-rank fit needs every subject present in every within-subject cell just as the parametric one does:

- Each effect labeled **(between)**, **(within)**, or **(between × within)** – main effects and interactions across the full factor crossing
- **F statistic** with significance stars
- **df** – the effect degrees of freedom and the denominator (error) df. The denominator df is estimated by the Kenward-Roger method on the underlying mixed model, so it need not be a whole number
- **p-value** (formatted per your [p-value settings](./settings.md#p-value-settings))
- **Partial η²** with confidence interval – the only effect size ART-ANOVA reports, computed from F and the degrees of freedom (non-central F inversion, the same machinery as the parametric ANOVA family)

When [post-hoc tests](#post-hoc-tests) are enabled, a section follows with one block per effect, computed by ARTool's `art.con` (which re-aligns the ranks for each term separately – plain mean-based contrasts on the aligned model would be wrong):

- **Main effects** – pairwise contrasts of that factor's levels on its own aligned-and-ranked response, with the difference and its confidence interval, SE, df, t-ratio, and p-value
- **Interactions** – *difference-of-differences* contrasts, labelled like **(a₁ − a₂) × (b₁ − b₂)**: how the gap between two levels of one factor shifts across two levels of the other
- Each block notes the p-adjustment applied (your configured method, within that effect's family), and a hint flags a term whose omnibus effect wasn't significant

> **Every ART contrast shares one error term.** `art.con` hands each pair the same standard error and the same degrees of freedom, so the whole set rests on **sphericity of the aligned ranks** – a note under each block says so. The effect isn't so much to inflate the error rate as to **redistribute** it: where the true cell variances differ, one pair can run conservative while another runs liberal. Measured under a null with equal cell variances but AR(1)-correlated conditions, one pair came out at .0033 against another's .1067. Read the pairs as a set against the spread of the cell standard deviations below, not one at a time.

Unlike parametric Mixed ANOVA, ART-ANOVA reports **no simple-effects tables**: under aligned-rank inference the "simple effect" of one factor at a fixed level of another isn't a valid contrast – the alignment strips out exactly the structure such a comparison would read – so only the omnibus-aligned main and interaction contrasts are exposed. Three-way and higher interactions are omitted from the post-hoc, since their contrast tables don't render cleanly.

A **Descriptive statistics** section follows, with one table per between-subjects factor, one per within-subjects factor, and one for the full between × within cell crossing – each carrying whichever summaries you enabled under [summary statistics](#summary-statistics).

There is **no Mauchly's test and no sphericity correction** – ranks sidestep the sphericity assumption.

> **ART assumes one residual variance across every cell, and corrects no departure.** ARTool fits `y ~ A*B + (1|subject)`, whose random intercept *is* the whole of the within-subject covariance – so the model assumes a single residual variance across every between × within cell, and ships no correction for a departure. Where the cell variances do differ, **every F in the table is anti-conservative, the between-subjects effects included** – a whole-model misspecification reaches every stratum. Measured under a true null at a cell-SD ratio of 3, the omnibus ran at .275 against a spherical control's .0475. That is why both ART tests carry a standing caveat in the [assumption panel](#test-recommendations) whatever the variance checks say, and why the source table closes with the **spread of the cell standard deviations**: the smallest and largest cell SD across the design and their ratio, computed on exactly the rows the fit used. No threshold comes with it, deliberately – how much a given ratio matters depends on the cell sizes and on whether the spread runs across the between-subjects groups or the within-subjects levels. And it is not an epsilon: non-sphericity alone leaves the omnibus calibrated, it is unequal cell variances that don't.

> **Why no covariates?** ART works by *aligning* the response – stripping out every effect except the one being ranked – and that alignment is only defined for categorical factors. Continuous predictors have no levels to align against, so if you assign covariates to an ART-ANOVA they are silently dropped and a note appears in the **Diagnostics** section telling you which ones were ignored. To control for a continuous covariate, use Mixed ANOVA instead.

> **Singular degrees of freedom.** If the denominator df can't be estimated – the random-effect covariance matrix is singular – the effect reports an error: *"ART-ANOVA could not estimate denominator degrees of freedom (singular covariance matrix)."* This usually means too few subjects per between-cell, or a between/within factor that is collinear with another. Add subjects or drop the redundant factor.

### MANOVA / MANCOVA

A single output card covering all dependent variables:

1. **Method info** – lists the dependent variables, grouping/condition variable, and covariates (if any)
2. **Multivariate tests** – Pillai's Trace, Wilks' Lambda, Hotelling-Lawley Trace, and Roy's Largest Root, each with approximate F, df, and p-value. All four stats test the same hypothesis with different statistics; when [p-value adjustment](#p-value-adjustment) is active, all four rows display the same adjusted p (one hypothesis = one adjustment). When [effect sizes](#effect-sizes) are enabled with an η²-family measure, the Pillai row also carries a **multivariate partial η²** with its confidence interval, computed from Pillai's approximate F – the magnitude companion to the multivariate significance test.
3. **Univariate follow-up tests** – one per dependent variable, of whichever kind matches the omnibus that produced them: ANOVAs, or ANCOVAs when covariates are present, repeated-measures ANOVAs for RM-MANOVA, mixed ANOVAs for Mixed-MANOVA, **Welch's ANOVAs for [Johansen's heteroscedastic MANOVA](#independent-samples--numeric)** (a pooled follow-up would re-import the equal-covariance assumption its omnibus was chosen to drop), and **per-variable energy tests for the [energy test](#independent-samples--numeric)**, which report an E-statistic with no F and no df columns since the statistic has neither. The header reflects the actual follow-up type. These p-values are **not** included in the global adjustment pool – they're gated by the multivariate omnibus, per standard practice. They *are* adjusted **internally**, as their own family: within each multivariate effect, the K per-DV p-values are corrected together (K = number of dependent variables) using your configured [adjustment method](./settings.md#multiple-comparison-adjustment), and a note above the table records the K and the method. When [effect sizes](#effect-sizes) are enabled, each univariate follow-up row also carries the measure you picked in the **Effect size** dropdown, with its confidence interval.
4. **Descriptive discriminant analysis** – opt-in; see below
5. **[Heterogeneous slopes (regions of significance)](#heterogeneous-slopes-results)** – MANCOVA and the covariate-bearing multivariate variants only. Because one card holds every dependent variable and a multivariate region of significance is not a standard construct, each region is univariate and tagged with its dependent variable; a note above the tables says so
6. **Descriptive statistics** – per-DV, per-group summaries

#### Descriptive discriminant analysis

Check **Include descriptive discriminant analysis** in the configuration panel – it appears for **MANOVA and MANCOVA** only, the two tests whose omnibus has a canonical decomposition to describe – and the card gains a section naming the *combination* of dependent variables the groups separate on. That is the question the multivariate test actually asks and the one the per-variable follow-ups cannot answer, so it sits beside them rather than replacing them: in exchange it produces no test for any single variable. It comes as four tables.

- **Discriminant functions** – one row per function, with its eigenvalue, canonical r, % of variance, Wilks' Λ, χ², df and p. The tests are **sequential**: each row tests that function *together with every function after it*, so the first row restates the omnibus and a later row asks whether any separation is left once the earlier functions are accounted for.
- **Standardized canonical coefficients** – the weight each dependent variable carries in each function once the others are held constant, in pooled within-group standard deviations. **This is the table to read** for what a function is built from. A variable can weigh heavily here while its own univariate test above is non-significant – that is precisely the separation the multivariate test found and the per-variable tests can't see.
- **Structure coefficients** – pooled within-group correlations between each dependent variable and each function (SPSS's Structure Matrix, *not* the total-sample version `candisc` reports). They describe one variable at a time, so they tend to rank the variables the same way the univariate tests do – which is why they are shown second: leading with them would reproduce the very blindness discriminant analysis exists to fix.
- **Group centroids** – each group's mean score on each function, in pooled within-group standard deviations, so a gap of 1 is one within-group SD of separation. Under MANCOVA they are covariate-adjusted, and are the same adjusted means shown above read along the functions.

MANCOVA adds covariate multivariate tests (one Pillai test per covariate, each Type III SS so order doesn't matter) and adjusted means per DV per group – again with the held covariate values noted beneath. For the multivariate variants the note reads *"held at their means over each dependent variable's complete cases"* when the DVs disagree, since each DV's fitted rows can differ.

With [post-hoc tests](#post-hoc-tests) enabled, **repeated measures MANOVA** adds a **pairwise condition contrasts** table for each dependent variable (labelled *Post-hoc for: {variable}*) beneath its univariate follow-up – every pair of conditions compared on estimated marginal means (emmeans), with your configured [p-adjustment](./settings.md#multiple-comparison-adjustment) applied within each DV. When covariates are present the contrasts are covariate-adjusted; without them they compare the raw condition means.

**Mixed MANOVA** offers the same drill-down, organized by effect. Checking **Include post-hoc comparisons** adds one *Post-hoc for: {variable}* block per dependent variable beneath its univariate follow-up, with contrasts for every main effect and two-way interaction across the between × within crossing – level pairs for a main effect, cell pairs plus two simple-effects tables for an interaction (three-way and higher terms are omitted, as in mixed ANOVA). Terms carrying a within-subject factor are contrasted on that DV's own split-plot fit, so they match the univariate F above them, and each effect's "omnibus wasn't significant" hint reads *that DV's* univariate follow-up p rather than the multivariate omnibus – the multivariate test gates the whole DV set, not one DV's contrasts. Its method dropdown offers the same three options as [repeated measures MANOVA](#post-hoc-tests) – the exact multivariate-t (the default), pairwise t-tests handing the family to your configured [p-adjustment](./settings.md#multiple-comparison-adjustment), or Dunnett's test – applied within each effect. Independently of the checkbox, Mixed MANOVA always shows an **Adjusted means (estimated marginal means)** section per dependent variable – the equal-weighted marginal means per effect, covariate-adjusted when covariates are present.

For mixed designs, multivariate and univariate tables are organized by effect (between, within, interaction).

> **Mixed MANOVA needs enough subjects.** Because it models the dependent variables jointly within each between-subjects cell, Mixed MANOVA needs **more subjects than dependent variables in every between-cell crossing** – otherwise the error degrees of freedom run out and the analysis stops with a message telling you the subject count, the number of between-cells, and the DV count. Reduce the number of DVs or factors, or add subjects.

> **Rank-deficient response matrix.** If the response matrix can't be inverted – its rank is below the number of columns – the analysis stops and reports that it is rank-deficient, naming the rank it found and the number of dependent variables. The check runs on the **independent** MANOVA and MANCOVA as well as on the within-subject response matrix, so it catches all of: two dependent variables that are affine transformations of each other, a pair that is collinear only *within* the groups while looking independent overall, a dependent variable that reproduces one of the covariates, systematic missing-data patterns, and too few subjects. Drop the redundant variable, or check your missingness, before re-running.

> **Subjects dropped for incomplete cells.** Mixed designs need every subject present in every within-subject cell. Subjects missing one or more cells are removed listwise before the analysis, and a note reports how many of the total were dropped – so a shrinking N is visible rather than silent.

> **Rows dropped for missing values (independent MANOVA / MANCOVA).** The independent-groups variants fit on complete rows only: a row missing any dependent-variable value – or, for MANCOVA, any covariate value – is removed listwise, and a note above the results reports how many of the total rows were dropped, so a reduced N stays visible rather than silent.

> **Which multivariate test to report?** Pillai's Trace is the most robust – it handles violations of assumptions better than the others. Wilks' Lambda is the most commonly reported in published research. When all four agree, it doesn't matter much; when they disagree, trust Pillai's. One caveat is specific to **Roy's largest root**: its F value is an upper-bound approximation – exact only when s = 1, i.e. when the effect spans a single dimension – so its p-value is a lower bound. That makes Roy's row look more significant than the others by construction (a tooltip on the row notes this); it's one more reason to read Pillai's row when they disagree.

### Heterogeneous slopes results

Every card fitted with a [covariate](#variable-roles) closes with this follow-up – ANCOVA, factorial ANCOVA, mixed ANOVA, repeated measures ANOVA (and its factorial variant), MANCOVA, repeated measures MANOVA, and Mixed MANOVA. The model above holds **one slope per covariate for every level**, so each adjusted difference is read at that shared slope. Where a pair's slopes genuinely differ, the difference between those levels is a *function* of the covariate rather than a single number – and this section is where that function gets reported. A note under the heading says the same; see [configuration](#heterogeneous-slopes-regions-of-significance) for when the follow-up appears.

One table per covariate, headed **Slopes on {covariate}**, with one row per contrast:

- **Variable** – the dependent variable, shown only where one card holds several (the multivariate families)
- **Contrasts** and **At** – the two mixed families only (mixed ANOVA, Mixed MANOVA): whether the contrasted pair is a **between-subjects** or a **within-subjects** one, and the cell of the *other* crossing it was fitted in. A mixed design has two sides to contrast, so a row that didn't name its side would be ambiguous
- **Contrast** – the pair of levels being compared
- **Slope difference**, **SE**, **t** and **p-value** – the covariate × factor term the fitted model deliberately leaves out, tested for this pair. It's the pair-level version of the omnibus [homogeneity-of-regression-slopes](#checking-assumptions) check, which can only say that *some* pair's slopes differ, never which
- **Region boundaries** – the **Johnson-Neyman** covariate values at which the pair crosses into (or out of) significance. Only boundaries falling **inside the observed range** of the covariate are listed: outside it a crossing is extrapolation from the fitted line rather than something your data speaks to, so a pair can show two boundaries, one, or none
- **Cases in significant region** – the share of your observations that actually land where the pair differs. A region covering 3% of the sample is a very different finding from one covering 80%, and the slope test alone can't tell them apart

Beneath the table a **Region of significance** plot is drawn for each contrast whose own slopes differ (judged at the [assumption test significance level](./settings.md#assumption-test-significance-level)) – or for every contrast when [**Show every region of significance**](#heterogeneous-slopes-regions-of-significance) is checked. It plots the contrast's difference against the covariate with its confidence band: the **green shading** marks the covariate values at which the two levels differ significantly, and the **dashed lines** mark the Johnson-Neyman boundaries.

> **Each region belongs to one dependent variable.** On the multivariate families a single card covers several dependent variables, but a multivariate region of significance is not a standard construct – so each region below is univariate, tagged with the dependent variable it belongs to, and a note above the tables says so. Reporting the univariate regions is more useful than omitting the follow-up because the omnibus has none.

> **This is what replaces the adjusted difference, not a supplement to it.** When the slope-homogeneity check fails, the [assumption panel](#test-recommendations) demotes the test with exactly that reason – *one adjusted difference cannot hold across the covariate, so the card reports each pair's region of significance instead*. The adjusted means above still describe the groups, but only at the value each covariate is held at; the region is what describes them everywhere else.

### Batch analysis

When batch mode is used, separate output cards appear for each variable analyzed – each grouping variable (independent mode) or each condition variable (dependent mode) – titled "Batch analysis 1/N: [variable name]". P-values pool across every iteration – see [P-value adjustment](#p-value-adjustment) for what enters the pool.

### Pseudo-factorial analysis

When the factorial strategy is used with multiple grouping variables, results appear under "Pseudo-factorial analysis: [Var1 × Var2]".

## P-value adjustment

Multiple tests on the same data increase the chance of false positives. P-values are automatically adjusted according to your [global adjustment setting](./settings.md#multiple-comparison-adjustment).

**What's in the pool.** Every omnibus p-value across the entire run goes into one adjustment pool – one independent hypothesis per row:

- Standard tests (t-tests, Welch, Mann-Whitney, χ², one-way ANOVA, …) – one p per dependent variable.
- Pairwise expansions (two-sample test with 3+ groups) – every pair contributes.
- Factorial / mixed / repeated ANOVA and ANCOVA – every effect row (main effects and interactions).
- MANOVA / MANCOVA / RM and Mixed variants – the grouping (or per-factor) omnibus. The four multivariate statistics (Pillai/Wilks/HL/Roy) share one adjusted value since they test the same hypothesis.
- Batch mode – pooled across every batch iteration.

**What's not in the pool:**

- Univariate follow-up tests of MANOVA – gated by the multivariate omnibus per standard practice, so they stay out of the global pool. They are **not** left raw, though: within each multivariate effect, the K per-DV p-values are adjusted together as their own family (see [reading results](#manova--mancova)).
- Post-hoc tables (Tukey HSD, Dunn's, pairwise t-tests, …) – adjusted internally using the same method you selected, but as their own well-defined family. Pooling them with omnibus tests would double-count. The opt-in pairwise breakdown of a 3+-level **chi-square** or **Fisher's exact** test is treated the same way: the omnibus row stays in the global pool while its pairwise rows are adjusted as their own family, per dependent variable – so switching the breakdown on doesn't tighten the correction applied to every other test in the run.
- Covariate effects (ANCOVA, MANCOVA, and the covariate terms of mixed and repeated designs) – a covariate is a nuisance control you're adjusting *for*, not a comparison you're making, so it doesn't claim a share of the error budget. Pooling it would inflate the correction applied to the effect you actually care about, purely because you controlled for something. Its own p-value is still reported in the effects table.
- ROC AUC comparisons (DeLong) – adjusted internally within the AUC-comparison family.

If no adjustment method is selected, a warning appears – but only when the run is actually about to produce a family of comparisons that nothing else corrects. [Batch](#batch-analysis) and [pseudo-factorial](#pseudo-factorial-analysis) runs always qualify. A single run qualifies only when post-hoc tests are enabled, the test isn't a two-sample one, and – if you picked a method that carries its own multiplicity control (the exact multivariate-t, Tukey HSD, Games-Howell, Nemenyi, Dunnett) – the design has **two or more factors**, so that interaction and simple-effects contrasts fall outside what the method already covers. A two-group t-test with no adjustment is therefore silent, and so is a one-way ANOVA whose only post-hoc family is already Tukey-corrected. The gate is deliberate: a warning that fired on output already adjusted would just teach you to dismiss it.

> **Significance follows the adjusted p.** Whenever an adjustment is applied, the interpretation column reads significance off the **adjusted** p-value – regardless of whether your [display setting](./settings.md#multiple-comparison-adjustment) shows the adjusted p in its own column (addition mode) or in place of the raw one (replacement mode). A row's "Significant" verdict therefore always agrees with its adjusted p, never the raw p.
>
> **And so do the significance marks.** The stars printed on a **test statistic** report the same decision, so they are read off the adjusted p too – in both display modes, and app-wide rather than only here. In addition mode, where the raw p stays in its own column, a statistic's stars can therefore disagree with that column and agree with the adjusted one: that is the mark doing its job, not an inconsistency.

> **How many tests am I running?** More than you might think. Five dependent variables with one grouping variable = five tests. Add a factorial ANOVA with two factors and an interaction = three effect rows per DV. Add pairwise expansion across four groups = six pairs per DV. It adds up quickly – adjustment keeps false positives under control across the whole study. See [multiple comparison adjustment](./settings.md#multiple-comparison-adjustment) for method guidance.

## Missing data

Missing values are handled by the global [missing data setting](./settings.md#missing-data):

- **Pairwise** – each test uses all available cases for the variables involved
- **Listwise** – only cases complete across all selected variables are used
- **Imputation** – missing values are replaced before analysis (mean, median, mode, or constant)

For comparison analysis, listwise deletion within each test is the most common approach in published research, as it ensures each group comparison uses the same set of cases.

> **Paired and repeated-measures tests need complete subjects.** Every within-subject test requires each subject to be present in every condition it compares – a subject with a hole contributes no difference score, and an unbalanced within-subject design has no valid F. Subjects missing any condition for the dependent variable being tested are therefore dropped before fitting, so the within-subject strata stay balanced. This applies across the whole within-subject family: the paired t-test and Wilcoxon signed-rank test, repeated-measures ANOVA and Friedman, Page's trend test, and the paired categorical tests (McNemar, Stuart-Maxwell, Cochran's Q). How many were dropped is reported in a warning toast, so a materially smaller subject set stays visible even with the **Sample sizes** summary column switched off, and the per-condition descriptives are computed on the same complete-subject sample the test used – so the table's n and the statistic never describe different data. If no subject is complete across all conditions, the variable reports that instead of running.

## Visualization

When enabled, a separate "Distribution comparison" output card shows the selected plot types for each numeric dependent variable, displaying the distribution across groups or conditions. For factorial designs – a native factorial test with several factors, or the combined-factor strategy – each plot splits on the full cell crossing of the factors, and the x-axis label names the crossed variables (e.g. Gender × Treatment). **Mixed designs cross both sides**: the box, violin, ECDF and mean/error plots split on the full **between × within** cell crossing, since splitting on the between factor alone would pool away the very within factor the design exists for. Where that crossing has too many cells to draw, the split falls back to a single factor. Groups and conditions appear in the same order as the result tables – numerically when every level is a number (so dose 1, 2, 5, 10 reads in order, not 1, 10, 2, 5), alphabetically otherwise. In one-sample mode the box, violin, ECDF, and mean/error plots draw a reference line at μ₀; the value axis always expands to include it, so the line stays visible even when μ₀ falls outside the observed data. A group with no valid values for a given variable is dropped from that variable's box, violin, and ECDF plots and named in an **Excluded (no data)** note beneath the plot, so a missing box or curve doesn't go unexplained. All plots can be resized and exported as SVG, PNG, or JPG.

### Box plot

Grouped box plots – one per dependent variable. Options: show outliers, show mean, show notch (median CI), show data points. Checked by default.

Box plots follow the same format as in [distribution analysis](./distribution-analysis.md#box-plot).

### Violin plot

Grouped kernel density plots with an inner box plot. Option: show inner box plot.

> **Box plot vs. violin:** box plots are better for comparing medians and spotting outliers. Violin plots show the full distribution shape – useful when distributions are bimodal or skewed, since box plots hide that.

### ECDF plot

Grouped empirical cumulative distribution functions – each group's curve shows the proportion of observations at or below each value. Options: show median reference line, and a **Confidence band** selector – **Wilson (pointwise)** (the default), **DKW (simultaneous)**, or **None** – drawn at the [confidence level](./settings.md).

> **When ECDF is useful:** ECDF plots let you compare distributions at every value, not just at summary statistics. Two groups can have the same mean and SD but look quite different in their ECDF curves. They're also useful for spotting floor/ceiling effects or clusters of values.

> **Pointwise or simultaneous band?** **Wilson** covers each individual F(x) at the confidence level, so it narrows to nothing at the 0% and 100% ends where the proportion is pinned – read it one value at a time. **DKW** (Dvoretzky-Kiefer-Wolfowitz, with the Massart constant) keeps a constant thickness and covers the **whole curve at once**, which is the honest choice when you're scanning several groups' curves along their full length rather than checking one value: a band you read at many points is no longer a pointwise one.

### Mean and error bar plot

Group means with whiskers whose span is set by the **[Error bars show](#error-bar-type)** selector – confidence interval of the mean (the default), standard error, or standard deviation. A caption below the plot states which is drawn and, for a CI, at what level, so the bars can't be mistaken for one another. Hover over a point to see the mean, standard error, CI, and sample size. In a purely within-subjects design with a subject ID – where this is the only error-barred summary plot available – the whiskers are **within-subject (Cousineau–Morey) confidence intervals** (Morey, 2008) rather than ordinary between-subject ones, matching the [interaction plot](#interaction-plot); that path pins the bar type, subjects missing a condition are dropped from the estimate and counted below the plot, and the caption says which is drawn.

### Paired lines plot

A spaghetti plot connecting each subject's values across conditions, with a bold mean line overlay. It aligns by **subject ID**, which it requires – there is no way to say which value belongs to which subject without one, so with no subject ID assigned the plot simply isn't drawn. With two or more condition factors (repeated-measures factorial designs), each x-position is one cell of their full crossing, so every subject's line spans all factor combinations. Option: show mean line. The number of subjects actually drawn is captioned below the plot, and any dropped along the way – missing a value in some condition, or carrying duplicate condition rows – are reported with their count in a toast.

Only available for dependent or mixed samples designs.

> **Reading paired lines:** individual lines show the pattern for each participant – if most lines slope in the same direction, the effect is consistent. Crossing lines suggest the effect varies across individuals. The bold mean line shows the average trend.

### Interaction plot

Group means connected by lines across levels of one factor, with separate traces for each level of a second factor. Includes a legend. Hover over a mean to see the cell label, mean, standard error, CI, and sample size. With **covariates** in the model – a factorial ANCOVA – the traces are drawn on the **covariate-adjusted** cell means instead of the raw ones, so the picture matches the fit whose omnibus the card reports, and the title says which it is: *Interaction plot (adjusted means)*. That swap only happens when the adjusted-means crossing is exactly the pair being plotted; a higher-order crossing is not its two-way marginal, so a plot drawn from one keeps the raw means. Option: show error bars – when on, a caption states what they represent, and the shared **[Error bars show](#error-bar-type)** selector decides which quantity that is. When a within-subjects factor is involved (dependent or mixed designs), the error bars are **within-subject (Cousineau–Morey) confidence intervals** (Morey, 2008), which remove between-subject variance so they reflect the uncertainty relevant to *within* comparisons – and those cells override the selector, since the Morey interval has no SD or SE analogue. Purely between-subjects (factorial) designs use ordinary between-cell bars of whichever type you chose. Subjects missing a cell are dropped from the within-subject estimates and noted below the plot. When the design carries more within-subject factors than the two being plotted, each subject's repeats within a plotted cell are first averaged – the plot marginalizes over the unplotted factors. A trace that has no data for an interior x-level is drawn as separate segments rather than one continuous line, so an empty cell reads as a gap instead of joining two non-adjacent levels into a false neighbourhood.

Only available when two or more factor variables are selected (factorial independent, or mixed between × within designs).

> **Reading interaction plots:** parallel lines mean no interaction – both factors operate independently. Crossing or converging lines suggest an interaction, meaning the effect of one factor depends on the level of the other. The statistical test tells you whether the visual pattern is significant.

### Forest plot

Horizontal layout showing effect size point estimates (diamonds sized by precision – the most precise estimate, with the narrowest CI, gets the largest diamond and the rest scale down from it) with confidence intervals for each dependent variable. Includes a dashed reference line at the effect's no-effect value – zero for difference and correlation measures, 0.5 for the common-language effect size, 1 for the variance ratio – and numeric annotations. For ratio-scaled metrics (no-effect value 1, e.g. the variance ratio) the axis is **log-scaled**, so a halving and a doubling sit equal distances from 1 – the natural geometry for a ratio – and the confidence intervals are log-spaced rather than forced symmetric. If an estimate or interval bound is non-positive (which an estimated ratio CI can occasionally produce), the plot falls back to a linear axis so it never fails silently.

Only available when **Include effect sizes** is checked and results contain valid effect size CIs.

For the single-factor tests, when the chosen [post-hoc method](#post-hoc-tests) reports raw differences with confidence intervals (Tukey, Games-Howell, lincon, Dunnett's test, Dunnett's T3), a forest plot of the post-hoc **differences** is also drawn – one plot per dependent variable, on that variable's raw scale with the reference line at zero (unstandardized differences aren't pooled across variables, which would mix units). This variant doesn't need **Include effect sizes** – only post-hoc comparisons that carry CIs; rank-based methods without differences (Dunn's, Nemenyi) don't produce one.

For the parametric factorial families – **factorial ANOVA**, **mixed ANOVA**, and **repeated measures factorial ANOVA** – the post-hoc contrasts are forested **by effect**: one panel per effect term, plotting each main effect's pairwise level differences and each interaction's simple-effect contrasts on the raw difference scale with the reference line at zero. A **Combine effects into one forest chart** checkbox appears inside the forest-plot options when the forest plot and [post-hoc tests](#post-hoc-tests) are both enabled for one of these families: left unchecked – the default – it draws one panel per effect; checked, it stacks every effect into a single chart with bold effect-labeled sections sharing one x-axis. **ART-ANOVA and its repeated-measures factorial variant are excluded** – aligned-rank differences have no meaningful raw scale to forest – so neither the by-effect panels nor the combine checkbox appear for them.

### Discriminant function plot

Draws what the [descriptive discriminant analysis](#descriptive-discriminant-analysis) tables describe: one point per case at its scores on the canonical discriminant functions, with the **group centroids** as large ringed markers on top. One plot per card rather than per dependent variable – a function is a combination of *every* dependent variable, which is exactly what the per-variable plots cannot show. Available once **Include descriptive discriminant analysis** is checked (MANOVA and MANCOVA only), and on by default from there.

- **Two or more functions** – a scatter of function 1 against function 2, with a legend naming the groups. Both axis labels carry that function's **share of the between-group variance** (e.g. "Function 1 (78.4% of variance)"), so how much of the separation the drawn axes actually hold is on the chart rather than back in the table.
- **One function** – with two groups there is only one function to compute, so the y axis carries the **groups** instead: each group's cases are spread down their own band and the axis is labelled with the grouping variable. It still reads as a per-group distribution rather than collapsing into a line of dots.
- **Dashed lines** cross at zero on each function – the scores are centred on the grand mean, so the origin is the whole sample's centroid, and a group's distance from it is that group's separation.
- **Equal pixel scales.** Each function is scaled to within-group variance 1, so a unit means the same thing on either axis; the plot widens the tighter axis to match rather than stretching one function's separation to fill a card-shaped frame. A gap of 1 on either axis is one within-group standard deviation.
- Hovering a **centroid** gives the group name, its score on each function, and its n. The case points carry no tooltip – individually they aren't the finding.
- Above **5000 cases** the cloud is thinned evenly *within each group* (so every group keeps its share of the sample) and a note below the plot reports how many of the total are drawn.

> **Reading the discriminant plot.** Look at how far apart the centroids sit along each axis, not at how dense the clouds are. Separation along function 1 is the dominant way the groups differ; separation along function 2 is what's left once that is accounted for. Overlapping clouds with well-separated centroids still mean a real multivariate difference – the test is about the centroids. Which *variables* build each axis is in the [standardized canonical coefficients](#descriptive-discriminant-analysis) table; the plot shows the separation, not its ingredients.

### ROC curve

A plot of true positive rate (sensitivity) against false positive rate (1 − specificity), with one curve per group pair when pairwise expansion is in effect. The diagonal is the chance line; curves further toward the top-left corner indicate better discrimination. The AUC and the predicted group are shown in the legend. When **Classification metrics at optimal threshold** is enabled, dots along each curve mark the reported thresholds; hover to see threshold value, sensitivity, specificity, PPV, NPV, and (when cost-weighted) which error is costlier.

Available when **Include classification (ROC) analysis** is enabled and the selected test is eligible. See [classification analysis](#classification-roc-analysis) for the underlying analysis.

> **Reading the ROC curve.** Each point on the curve corresponds to a possible threshold. Moving along the curve trades sensitivity for specificity. The threshold the analysis reports (Youden's, closest, or cost-weighted) is one chosen point – but the whole curve is the actual summary of discriminative ability across all possible cutoffs.

### Category proportion plot

The categorical family's replacement for the distribution plots – a contingency test has no distribution to draw, so this appears **in place of** the box/violin/ECDF block rather than alongside it, and is on by default. One stacked-proportion chart per dependent variable, showing how that variable's categories divide within each level of the grouping factor, so a shift in composition is visible directly rather than inferred from the χ². For the **Cochran-Mantel-Haenszel test** an extra chart is drawn **per stratum**, titled with the stratum's value – the per-stratum slices the test pools over, which is where you can see whether the association points the same way in each. In [batch](#batch-analysis) and [pseudo-factorial](#pseudo-factorial-analysis) runs the card is labelled with the grouping variable it belongs to.

**Where the association lives: the ▲ / ▼ marks.** Bars that stand out carry a small triangle, and what the triangle measures follows the shape of the test:

- **Chi-square test of independence** – the bar's own **standardized residual**: ▲ marks more observations than expected under independence, ▼ fewer. The critical |z| is Bonferroni-adjusted over the table's **cells** – the same rule and the same value that print a residual in bold in the [contingency table](#categorical-tests-chi-square-fishers-exact-etc), so the chart and the table can never disagree about which cells stand out.
- **The paired two-condition shapes** (McNemar, Stuart-Maxwell) – here both bars of a category are *margins of one paired table*, not cells, so the quantity belongs to the category rather than to either bar. It is drawn as a **connector across the pair** with the glyph at its midpoint: ▲ marks a share that rose from the first condition to the second, ▼ one that fell, against a critical |z| adjusted over the **categories**.
- **Cochran's Q** – each bar's departure from its category's average across the conditions: ▲ more observations than average, ▼ fewer, against a critical |z| adjusted over the **conditions**.

A note under each chart names which rule applies, the critical value, and the family it was adjusted over. Hovering a bar shows its z whether or not it cleared the threshold – the mark is a reading aid, not the only place the number appears. Tests that compute no such quantity (Fisher's exact, Cochran-Armitage, the Cochran-Mantel-Haenszel panels) simply draw unmarked bars.

**Above 25 categories** the grouped bars would be sub-pixel wide, so the chart switches to one **100%-stacked bar per group**. The tail is not folded into an "Other" slice: the chart's job is to show the distribution the contingency test actually analysed, and a folded tail is a distribution it never saw.

### Observed vs expected plot

Shown only for the [chi-square goodness-of-fit test](#one-sample--categorical), in its own "Observed vs expected" card – one chart per variable. Each category's **observed count** is drawn as a bar, and its **expected count** under your distribution as a horizontal marker overhanging the bar, so the marker stays visible even when the two nearly coincide. Categories you added in the [expected-distribution editor](#expected-distribution) that never occurred in the data appear with a marker but no bar – exactly the gap the test is weighing. Hover over a category to see the observed count (O), the expected count (E), and that category's contribution to the χ² statistic, (O − E)²/E – the categories with the largest contributions are the ones driving a significant result.

> **Reading the chart:** the test is significant when the bars stray too far from their markers, taken together. Scan for the biggest bar-to-marker gaps (or hover for the χ² contributions) to see *which* categories carry the misfit – the table reports the overall verdict, the chart shows where it comes from.

## Reporting checklist

Key things to include when writing up comparison results:

**Method:**
- Analysis design (independent, dependent, or mixed)
- Statistical test used and why (e.g. "Welch's t-test was used due to unequal variances")
- Whether assumptions were checked and which were met or violated
- How missing data were handled
- P-value adjustment method, if any
- For post-hoc tests: which method and correction
- For chi-square, McNemar, Mann-Whitney, the Wilcoxon signed-rank tests, or Stuart-Maxwell: whether the continuity correction was applied (and, for McNemar / Stuart-Maxwell with few discordant pairs, that the exact binomial test was used)
- For the goodness-of-fit test: the expected distribution and where it came from (uniform, a theoretical model, published proportions), the number of categories, and whether any expected count fell below 5
- For the sign tests (the **[paired sign test](#dependent-samples--numeric)** and the one-sample **[sign test](#one-sample--numeric)**): that only the *direction* of each change was used, so no assumption was made about the shape of the differences, why you chose it over the signed-rank test (usually a failed [symmetry check](#checking-assumptions)), and how many zero differences were dropped as ties
- For the **[one-sample proportion test](#one-sample--categorical)**: the hypothesised proportion π₀, which category was counted as the success (and that every other category counted as a failure), and that the p-value is the exact binomial one rather than a χ² approximation
- For the parametric within-subjects families (repeated measures ANOVA, repeated measures factorial ANOVA, mixed ANOVA): which **[within-subjects approach](#within-subjects-approach)** was used – univariate (ε-corrected) or multivariate (Pillai) – and, on the univariate route, which epsilon correction the verdict was read from; on the multivariate route, any term that had to fall back to a univariate F
- For a covariate design whose homogeneity-of-regression-slopes check failed: that the **[heterogeneous-slopes follow-up](#heterogeneous-slopes-results)** is reported in place of a single adjusted difference, and which covariate the regions are read over
- For ART-ANOVA: that the Aligned Rank Transform was used as the non-parametric mixed-design analysis, and that denominator df came from the Kenward-Roger approximation (hence the non-integer error df)
- For variance (dispersion) tests: which test and why (e.g. "Fligner-Killeen was used because the groups were non-normal"), and that the hypothesis is about spread, not location
- For the robust trimmed-means tests (Yuen, t1way): the **trim level** used (e.g. 20% per tail), and that trimmed means were compared because the data were non-normal and/or heteroscedastic
- For the Brunner-Munzel test: whether the p-value came from the exact permutation branch or the asymptotic (Satterthwaite) approximation – the note under the results records which
- For the Anderson-Darling k-sample test: whether the p-value was asymptotic or simulated, and why (ties, or a group with fewer than 5 observations), with the replicate count
- For trend tests (Jonckheere-Terpstra, Page's, Cochran-Armitage): that an ordered (ordinal) factor was used and how it was ordered, the trend direction tested, the effect size reported (Kendall's τ-b or Page's ρ̄), whether Page's p came from the exact or the asymptotic distribution, and – for Cochran-Armitage – which outcome category was the modelled event and that the factor's values served as trend scores
- For the Cochran-Mantel-Haenszel test: the stratifying variable and number of strata, whether the continuity correction was applied (2×2×K), and – for 2×2×K – the Breslow-Day homogeneity result that justifies (or cautions against) reporting a single common odds ratio
- Directionality (one-tailed or two-tailed)
- For equivalence testing: the type (TOST, non-inferiority, superiority, or MET), the equivalence bound Δ, and whether Δ was specified in raw or standardized units
- For ROC analysis: the threshold rule (Youden / closest / cost-weighted, with the cost asymmetry ratio and any population-prevalence override if applicable), the AUC CI method (DeLong or bootstrap), and that DeLong's test was used for any AUC comparisons

**Results:**
- Descriptive statistics per group (means, SDs, sample sizes at minimum)
- Test statistic with degrees of freedom (e.g. t(58) = 2.34, F(2, 87) = 5.12)
- Exact p-value (or p < .001 for very small values)
- Effect size with confidence interval (e.g. Cohen's d = 0.65, 95% CI [0.12, 1.18])
- For the F-test of variances: the variance ratio with its CI (e.g. F(29, 29) = 1.84, variance ratio 1.84, 95% CI [0.88, 3.86])
- For the robust trimmed-means tests: the test statistic with df, the explanatory measure ξ (with its CI for t1way), and – for Yuen – the trimmed-mean difference with its CI
- For the one-sample tests: the reference value μ₀ and the location estimate with its confidence interval – the mean (t-test), the pseudo-median (Wilcoxon), or the median (sign test)
- For the paired sign test: the number of positive differences out of the effective n, the median of the differences with its distribution-free confidence interval **and the coverage that interval actually attained**, and the effect size r₊ = 2p̂ − 1
- For the one-sample proportion test: the observed proportion p̂ with its Clopper-Pearson interval, the exact p-value against π₀, and Cohen's h with its interval
- For the heterogeneous-slopes follow-up: per contrast, the slope difference with its SE, t and p, the Johnson-Neyman region boundaries (noting that only boundaries inside the observed covariate range are reported), and the share of cases falling inside the significant region
- For the Cochran-Mantel-Haenszel test: the MH χ² with df and p-value, and – for 2×2×K – the common odds ratio with its CI and the Breslow-Day χ², df, and p (e.g. CMH χ²(1) = 11.43, p = .001; common OR = 3.00, 95% CI [1.62, 5.55]; Breslow-Day χ²(2) = 0.00, p = 1.00)
- For equivalence testing: the TOST p-value and the two one-sided p-values, plus the raw Δ bound used
- For multi-group tests: omnibus result first, then post-hoc comparisons
- For factorial/mixed designs: main effects, interactions, and simple effects where relevant
- For ROC analysis: AUC with CI per variable (and per pair, if applicable), plus sensitivity and specificity at the reported threshold; for AUC comparisons, Δ AUC, Z, and p-value(s)

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. Comparison analysis uses base R for t-tests, chi-square (`chisq.test`, also for the goodness-of-fit test), Welch's one-way ANOVA (`oneway.test`), the two-sample Kolmogorov-Smirnov test (`ks.test`), the variance tests (`var.test`, `bartlett.test`, `fligner.test`), the Cochran-Armitage trend test (`prop.trend.test`, re-signed for direction), the Cochran-Mantel-Haenszel test (`mantelhaen.test`, with `DescTools::BreslowDayTest` (Tarone-corrected) for the 2×2×K homogeneity-of-odds-ratios check), Page's trend test (the L statistic and its normal approximation are computed directly, no package, with `DescTools::PageTest` supplying the exact convolved null distribution on the untied, k < 16 branch), the Games-Howell, Conover, and Nemenyi post-hocs (computed directly from `ptukey`/`pt`, no package), the Dunnett's-T3 post-hoc (a separate-variance t with Welch-Satterthwaite df referred to a studentized-maximum-modulus critical value obtained by direct quadrature, no package), and the Dunn's-test-vs-control post-hoc (a rank-sum z computed directly, no package), `car` for ANOVA-family tests, `emmeans` for post-hoc comparisons and estimated marginal means, `dunn.test` for Dunn's test, `mvtnorm` for the exact multivariate-t critical values and adjusted p-values – Dunnett's test and the [exact multivariate-t post-hoc](#post-hoc-tests) both reach it, the latter through `emmeans` (which is why enabling post-hoc on a one-way ANOVA now pulls `emmeans` and its dependencies where base R's `TukeyHSD` once sufficed), `brunnermunzel` for the Brunner-Munzel test, `kSamples` for the Anderson-Darling k-sample test, `clinfun` for the Jonckheere-Terpstra test, `onewaytests` for the Brown-Forsythe one-way ANOVA (`bf.test`), `WRS2` for the robust trimmed-means tests (`yuen` and `t1way`, plus the `lincon` post-hoc), `ARTool` for ART-ANOVA (with `lme4` / `pbkrtest` behind it for the mixed-model fit and Kenward-Roger degrees of freedom, and `art.con` for its post-hoc contrasts), `effectsize` for effect size calculations, and `pROC` for ROC / AUC analysis and DeLong's test. Citations for the R packages *and* the statistical methods used in your analysis appear automatically at the top of the output section – so a run cites the tests, post-hocs, effect sizes and corrections it actually named, not just the packages that computed them. The Ross MI permutation test (which the Jensen-Shannon omnibus and its pairwise post-hoc share), ROC bootstrap CIs, and the effect-size bootstrap CIs (Wilcoxon r, the matched-pairs rank-biserial – paired and one-sample, Kruskal-Wallis ε²/η²_H, Friedman's W, Kendall's τ-b, Page's ρ̄, Cohen's g, and Cochran's average φ²) are seeded by [**Bootstrap seed**](./settings.md#bootstrap-seed) – set it to make permutation p-values and bootstrap CIs reproducible across runs.

## Common pitfalls

**Checking assumptions after seeing the results.** Run assumption checks *before* the main analysis, not after. If you run a t-test, get a non-significant result, then switch to Mann-Whitney hoping for significance, you're inflating your false positive rate. The assumption check should determine the test, not the other way around.

**Ignoring effect sizes.** A significant p-value with a tiny effect size (d = 0.05) means the groups are "statistically different" but the difference is practically meaningless. Conversely, a non-significant result with a moderate effect size (d = 0.50) might just mean you needed more participants. Always report and interpret effect sizes alongside p-values.

**Multiple grouping variables as separate batch analyses when you need interactions.** If you're interested in whether the effect of treatment differs by gender, running two separate batch analyses (one for treatment, one for gender) won't answer that question – you need factorial ANOVA or a mixed model to test the interaction.

**Using dependent-samples tests on independent data (or vice versa).** A common mistake: comparing pre-test and post-test scores with an independent t-test instead of a paired t-test. Independent tests treat the two sets of scores as coming from different people, wasting the statistical power that comes from knowing each person's change.

**Fixing the expected distribution to match the data.** The goodness-of-fit test only means something when the expected distribution comes from *outside* the sample – a theoretical model, a fairness assumption, or proportions published elsewhere. Reading the observed split off the data and then entering it (or something close) as the expectation guarantees a non-significant result that proves nothing. Decide the expected weights from your hypothesis before you look at the counts. And watch the expected-count warning: with several categories below 5, the χ² p-value is approximate – collapse rare categories or collect more data rather than reporting it at face value.

**Reporting one Cochran-Mantel-Haenszel odds ratio when the strata disagree.** The common odds ratio summarises all strata with a single number, which is only honest when the per-stratum odds ratios point the same way and are similar in size. If the Breslow-Day test is significant – or the per-stratum tables visibly disagree (the association reverses or vanishes in some strata) – the pooled OR hides that heterogeneity. Report the per-stratum results and consider whether the stratifying variable is actually an effect modifier rather than a confounder. And don't stratify by a variable that lies on the causal path between the group and the outcome – controlling for a mediator distorts the very association you're measuring.

**Running a trend test on a factor that isn't really ordered.** The ordered-alternative tests (Jonckheere-Terpstra, Page's, Cochran-Armitage) assume the factor's levels have a genuine order carried by their numeric values – dose, grade, time. If you mark an arbitrary numeric code (e.g. group IDs 1/2/3) as ordinal just to unlock the test, you're testing a trend that has no meaning, and the module can't catch it – it can't tell a real order from an accidental one. Mark a factor ordinal only when its ascending values truly define the trend you care about.

**Claiming equivalence from a non-significant result.** A standard test that fails to reach significance (p > .05) does *not* mean the groups are equal – it means you couldn't prove they're different. To make a positive claim of equivalence, you need an equivalence test (TOST). This distinction matters especially in clinical research, where "no difference detected" and "proven equivalent" have very different regulatory implications.

**Setting the equivalence bound after seeing the data.** The bound Δ should be chosen *before* analysis, based on domain knowledge about what constitutes a practically meaningful difference. Choosing Δ after seeing the results – picking a bound just wide enough to achieve significance – invalidates the test. Pre-register your bound when possible.

**Reading too much into a high AUC on a small sample.** AUCs have wide confidence intervals at small sample sizes, and DeLong's CI relies on asymptotic theory. With fewer than ~30 observations per group, prefer the bootstrap CI and treat the point estimate as provisional. An AUC of 0.85 with a 95% CI of [0.55, 1.0] is not a strong signal – it's a wide range that happens to include "excellent".

**Treating PPV and NPV as universal.** Predictive values depend on the prevalence of the predicted group in your sample. If your sample is balanced 50/50 but real-world prevalence is 5%, the PPV reported here will be far higher than what you'd see in deployment. Sensitivity and specificity are prevalence-independent – those generalize. PPV and NPV in this output describe your sample, not the population.

**Choosing the cost direction after seeing the cost-weighted thresholds.** The cost-weighted rule reports two thresholds, one for each direction of asymmetric cost. Picking which row "feels right" after seeing the numbers – rather than committing to which error type is worse beforehand – is the same kind of post-hoc tuning as flipping a one-tailed test direction after the fact.
