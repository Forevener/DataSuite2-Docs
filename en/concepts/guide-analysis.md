---
title: Choosing an analysis
description: From a research question to the right DataSuite 2 module and test – the three questions that decide it, walked through on the café data, card by card.
---

# Choosing an analysis

[The café data](./guide-data.md) gave you a story, a file and four questions. This page takes each question to a module, a test and a results card, and on the way teaches the three things that choose an analysis for any data – so that when your own question arrives wearing different nouns, you can route it yourself. It assumes the file is loaded and the three fixes on the codebook page are done; every number below is one the app prints on that file. [Writing it up](./guide-report.md) is the page after this one.

## Three questions that choose the analysis

Statistics offers a few hundred tests and the app carries most of them, but the choice among them is made by three questions about *your* question and *your* data, asked in this order. Answer them and the module, the design and the test follow; the [decision table](#the-decision-table) at the end of this section is the three answers laid out as a grid.

### What kind of answer do you want?

Every research question is, once the nouns are stripped off, one of a short list of shapes:

- **A difference** – does the dependent variable differ between groups of cases? Branch against branch, ward against ward, the old web page against the new. → [Comparison analysis](../comparison-analysis.md).
- **A change** – did the same cases move between occasions or conditions? Before against after, each patient on each drug, each student in each term. → comparison analysis in its [dependent-samples](#b-dependent-samples-repeated-measures) design.
- **A relationship** – do two measures rise and fall together, and how strongly? Satisfaction and spend, dose and response, hours studied and marks. → [Correlation analysis](../correlation-analysis.md).
- **A prediction** – how much does each of several things account for an outcome, holding the others fixed, and what would the outcome be for a new case? → [Regression analysis](../regression-analysis.md).
- **A structure** – do many items measure one thing, or a few things, and how well? → [Reliability](../reliability-analysis.md), then [factor analysis](../factor-analysis.md) or [confirmatory factor analysis](../structural-equation-modeling.md#confirmatory-factor-analysis).
- **A description** – what does one variable look like on its own: its middle, its spread, its shape? → [Descriptive statistics](../descriptive-statistics.md) and [distribution analysis](../distribution-analysis.md), and usually before any of the above.

Time courses, times to an event, segments and the pooling of studies are shapes of their own, at the [foot of the page](#questions-the-café-does-not-ask). The café's four questions are the first five shapes.

### What type is each variable?

The app types every column on import – continuous or categorical – and lets you change a type in the [Variables dialog](../getting-started.md#choosing-variables). The type decides which tests are offered at all, so check it before anything else; the codebook's first fix, `branch` typed continuous because its values were 1 and 2, was exactly this.

- **Continuous** – a number whose arithmetic means something: a spend, a wait, an age, a 0–10 score. The tests of means, the correlations and the regressions live here.
- **Categorical** – a label: a branch, a yes or a no, a diagnosis. It can be counted and cross-tabulated, not averaged, so its tests are on counts and proportions. A categorical variable with two levels is *binary*, and a binary outcome has tests of its own – the [chi-square](#b-chi-square-test-of-independence) family and [logistic regression](./regression-basics.md#b-logistic-regression).
- **Ordinal** – ordered categories: a 1–5 agreement item, a dose level, a grade. The order is known, the size of the steps is not. The app treats an ordinal variable as numeric for most purposes and offers the rank-based tests that use the order alone – the [parametric vs. non-parametric](./parametric-nonparametric.md#b-ordinal-data) page says when that matters – and the trend tests (Jonckheere-Terpstra, Page's, Cochran-Armitage) require the type.

The café's six survey items are ordinal by nature and continuous by type, which is how the app imports a 1–5 column. The section treats them as numeric throughout – a common and defensible choice for items that will be summed into a scale, and one the report states.

### How are the cases related?

The last question is about the rows, not the columns: are the cases you compare different people, or the same people measured more than once? It decides the *design*, and the design decides the arithmetic – [comparison designs](./comparison-designs.md) is the vocabulary of what the tests print once there is more than one factor. A paired design uses each case as its own control and gains power from it – the codebook's spend columns show why: the correlation of .69 between a member's before and after spend is exactly the part of the noise a paired test removes.

- **Independent samples** – every case is in one group and one only; the groups are different people. Riverside against Station.
- **Dependent samples (repeated measures)** – the same cases measured under two or more conditions, one row per case per condition. Before against after.
- **Mixed model (between + within subjects)** – both at once: different groups, each measured repeatedly. Before against after, separately for each branch, and whether the change differed between them.
- **One sample (vs. reference value)** – no groups; one variable against a fixed number. Is the mean wait above the five minutes the café promises?

The roles the app asks for in its left panel follow from the design:

- **Grouping variable** – the categorical variable whose levels are the groups in an independent design: `branch`. Two or more grouping variables make a [factorial](#b-factorial-anova) design, where the question becomes whether each factor matters and whether they interact.
- **Condition variable** – the variable that says which occasion or condition a row belongs to in a dependent design: the `Condition` column holding Before or After once the file is [long](./guide-data.md#wide-and-long).
- **Subject ID** – the variable that says which rows belong to the same case in a dependent design, so that the app can pair them: the member number the table converter generates.
- The [**dependent variable**](./regression-basics.md#b-dependent-variable) is the outcome in every design – the thing measured, whose values are compared, correlated or predicted. A [**predictor**](./regression-basics.md#b-predictor) is what it is predicted from, and a [**covariate**](./regression-basics.md#b-covariate) a predictor you hold fixed rather than study.

The roles wear other nouns everywhere. A nurse: ward → grouping variable, days to recovery → dependent variable, patient → subject ID. A teacher: class → grouping, test score → dependent, term → condition. A product team: page version → grouping, time on page → dependent, visitor → subject ID. Learn the roles and the panel reads the same on any file.

### The decision table

| Answer wanted | Dependent variable | Design | Test |
|---|---|---|---|
| A difference between two groups | continuous | independent | [Welch's t-test](#b-welchs-t-test-unequal-variances); [Mann-Whitney U](#b-mann-whitney-u-test) when the shape is doubtful |
| A difference among three or more groups | continuous | independent | [One-way ANOVA](#b-one-way-anova); [Kruskal-Wallis](#b-kruskal-wallis-test) |
| A difference by two factors at once | continuous | independent | [Factorial ANOVA](#b-factorial-anova) |
| A difference in a rate | categorical | independent | [Chi-square test of independence](#b-chi-square-test-of-independence); [Fisher's exact](#b-fishers-exact-test) when counts are small |
| A change between two occasions | continuous | dependent | [Paired samples t-test](#b-paired-samples-t-test); [Wilcoxon signed-rank](#b-wilcoxon-signed-rank-test) |
| A change across three or more occasions | continuous | dependent | [Repeated measures ANOVA](#b-repeated-measures-anova); [Friedman](#b-friedman-test) |
| A change in a yes/no | categorical | dependent | [McNemar's test](#b-mcnemars-test) |
| A difference in change between groups | continuous | mixed | [Mixed ANOVA](#b-mixed-anova) |
| One variable against a number | continuous | one sample | [One-sample t-test](#b-one-sample-t-test) |
| One rate against a number | categorical | one sample | [One-sample proportion test](#b-one-sample-proportion-test) |
| A relationship between two measures | continuous | – | [Pearson's r](#b-pearsons-r); [Spearman's ρ](#b-spearmans-ρ) when skewed or ordinal |
| A prediction from several measures | continuous | – | [Multiple regression](./regression-basics.md#b-multiple-regression) |
| A prediction of a yes/no | categorical | – | [Logistic regression](./regression-basics.md#b-logistic-regression) |
| Whether items form a scale | several items | – | [Reliability](../reliability-analysis.md), then [factor analysis](../factor-analysis.md) |

The second test in a cell is the [non-parametric](./parametric-nonparametric.md) partner of the first: the one to use when the first's assumptions look doubtful. You do not have to judge that unaided – the comparison module checks before you run, and the first walk below shows it doing so.

## Do the two branches differ?

A difference between two groups of different people on a continuous outcome: the answer is a difference, the dependent variable is continuous, the design is independent samples. Open [comparison analysis](../comparison-analysis.md), keep **Independent samples** selected, put `branch` under **Grouping variables**, and select `spend_before` as the only other variable – whatever is given no role is a dependent variable. Then, before choosing a test, press **Check assumptions**.

The assumption card comes back with three rows. Normality passes – Shapiro-Wilk on `spend_before` within each branch gives W = 0.990, p = 0.655 for Riverside and W = 0.985, p = 0.343 for Station, and a Q-Q plot beside them that hugs its line. Outliers pass. Homogeneity of variance *fails*: Levene's test F(1, 198) = 9.10, p = 0.003, because Station's spending is more spread out (SD 4.05 against 2.97). Below the rows the module says what to do about it – the **Independent samples t-test**, which assumes equal spreads, is listed under *Not recommended* with the reason, and **Welch's t-test (unequal variances)** heads the recommended list. That is the whole decision, made by the app from the same rules the [assumptions](./assumptions.md#b-unequal-variances) page explains; you choose Welch's from the **Statistical test** list and press **Run comparison analysis**.

The card is one row per dependent variable, read left to right:

| Column | Reads | Says |
|---|---|---|
| Riverside Mean, SD, 95% CI | 7.91, 2.97, [7.33, 8.50] | what each group looks like on its own |
| Station Mean, SD, 95% CI | 9.52, 4.05, [8.71, 10.33] | |
| Difference (Riverside − Station) | −1.61 | the answer in the outcome's own units – a minus sign because Station is higher and the app subtracts in the order it lists the groups |
| 95% CI of the difference | [−2.60, −0.62] | the range of differences the data are compatible with; it excludes zero |
| t, df, p | −3.202, 179.5, 0.002 | the [test](./hypothesis-testing.md#b-test-statistic) and its verdict: a gap this size would arise about twice in a thousand samples if the branches really spent the same |
| d, d CI | −0.454, [−0.737, −0.170] | the difference in standard-deviation units – [Cohen's d](./effect-sizes.md#b-cohens-d), a small-to-medium effect |
| Interpretation | Significant difference, small effect, Riverside < Station | each number read against its threshold, in words |

Three of those cells are the finding: the difference, its interval and its effect size. The p-value says the difference is unlikely to be noise; the interval and d say how big it is, which p [cannot](./hypothesis-testing.md#the-p-value). Read all three before deciding what the result means – and the [sign convention](./effect-sizes.md#the-difference-itself) before quoting the minus.

**The same question, other data.** When the outcome is a yes or a no rather than a number – do the branches differ in whether members would recommend the café? – the dependent variable is categorical and the test is the [chi-square test of independence](#b-chi-square-test-of-independence) on the 2 × 2 table of branch by answer. 72.3% of Riverside members say yes against 62.6% at Station; χ²(1) = 1.71, p = 0.192, [Cramér's V](./effect-sizes.md#b-cramérs-v) = 0.103 [0, 0.242]: a small gap the data cannot distinguish from none. When the outcome is a number whose shape is far from normal – waiting time, with its long right tail – the assumption check sends you to the [Mann-Whitney U test](#b-mann-whitney-u-test): the branches' median waits are 4.8 and 5.0 minutes, U = 3889, p = 0.289. And when there are three or more groups rather than two, the test is [one-way ANOVA](#b-one-way-anova) or its partners, and the pairwise follow-ups under [post-hoc tests](../comparison-analysis.md#post-hoc-tests) say which groups differ from which; the café has no three-level variable, but the [power page](./power-sample-size.md#b-cohens-f) cuts `age` into three bands to show one – F(2, 192) = 8.42.

*A nurse: ward → grouping variable, days to recovery → dependent variable, and the same card. A teacher: class → grouping, test score → dependent. An HR analyst: department → grouping, engagement score → dependent, and Kruskal-Wallis when the departments are five.*

## Did spending change?

A change in the same people between two occasions: the answer is a change, the dependent variable is continuous, the design is dependent samples. The comparison module wants this data *long* – one row per member per occasion – and the file is wide, so the [table converter](./guide-data.md#wide-and-long) comes first: 400 rows, a `spend` column and a `visits` column, a `Condition` column holding Before or After, and a generated subject number. In comparison analysis choose **Dependent samples (repeated measures)**, put `Condition` under **Condition variables (within-subjects)**, the subject number under **Subject ID**, and select `spend` and `visits`; the test is the [paired samples t-test](#b-paired-samples-t-test). Run **Check assumptions** here too. In a paired design it tests the paired *differences*, not the two columns, and on `spend` it reports a mild departure from normality – W = 0.984, p = 0.027, heavier tails than a normal curve (excess kurtosis 1.16) but no skew – and one member whose change is extreme (a [studentized residual](./outliers-missing-data.md#b-studentized-residual) of −4.46). It keeps the paired t-test recommended all the same, and says why in the row: with 199 pairs the [central limit theorem](./distributions.md#b-central-limit-theorem) makes the test robust to that shape, and the symmetry check passes. Look at the flagged member before trusting the mean, as the card asks, and run the rank-based test below beside it as a check.

The card has the same shape as before, with the two conditions where the two branches were. `spend` rose from 8.66 to 9.75 across the 199 members with both values – a note under the table says one member was excluded for missing a value in one condition, which is the catering order you blanked. The **Difference (After − Before)** is 1.09 with a 95% CI of [0.69, 1.49]; t = 5.371, df = 198, p < 0.001; [dz](./effect-sizes.md#b-dz) = 0.381. Two things are new. The app lists the conditions in alphabetical order, so the difference reads After minus Before and a positive sign means a rise – check the header before reading the sign. And each condition carries a second interval, the *within-subject* CI, which is the one to compare the two conditions by – it strips out the differences between members that a paired design does not care about; the [summary statistics](../comparison-analysis.md#summary-statistics) section of the manual has the details.

The second row is the finding on the boundary that the [hypothesis testing](./hypothesis-testing.md#a-result-on-the-boundary) page dwells on: `visits` rose by 0.64 per member, 95% CI just below zero to 1.28, t = 1.964, df = 199, p = 0.051, dz = 0.139 – "No significant difference, negligible effect". The honest reading is neither "visits did not change" nor "visits rose": the data leave both open, and the report says so with the numbers.

When the paired differences are skewed or hold an outlier, the [Wilcoxon signed-rank test](#b-wilcoxon-signed-rank-test) ranks them instead of averaging them – W = 13,850, p < 0.001 on the same spend data, the same verdict – and the [paired sign test](#b-paired-sign-test) counts only how many members went up (125) against down (72). The [parametric vs. non-parametric](./parametric-nonparametric.md#what-a-rank-test-actually-tests) page says what each one actually tests.

*A clinician: patient → subject ID, visit → condition variable, blood pressure → dependent variable. A trainer: athlete → subject ID, pre- and post-season → condition, sprint time → dependent. A teacher: student → subject ID, term → condition, mark → dependent, and repeated measures ANOVA when the terms are three.*

## What goes with overall satisfaction?

A relationship between measures, then a prediction from several of them. Open [correlation analysis](../correlation-analysis.md), select `overall`, `taste`, `wait` and `spend_after`, keep **Pearson's r** as the method and press **Calculate correlations**. The card is a matrix with one cell per pair, each holding [r](./effect-sizes.md#b-r), its p and its N: `overall` with `taste` r = 0.546, p < 0.001, N = 193; with `wait` r = −0.298, p < 0.001, N = 178; with `spend_after` r = 0.236, p < 0.001, N = 192. Two things to read besides the coefficients. The N changes from cell to cell, because under [pairwise deletion](./outliers-missing-data.md#b-pairwise-deletion) each pair uses the members complete on *its* two variables, and the seven blank `overall` cells plus the fifteen blank `wait` cells cost this pair 22 members. And a matrix of six coefficients is six tests, which the [many tests](./hypothesis-testing.md#many-tests-at-once) rule applies to – the module warns when no adjustment is set.

A correlation says that taste and waiting each go with satisfaction; a regression says how much each contributes with the other held fixed, and gives a formula. Open [regression analysis](../regression-analysis.md), keep **Linear** as the type, put `overall` under **Dependent variable(s)** and `taste` and `wait` under **Predictors**, and press **Run regression**. The card opens with the [model fit](./regression-basics.md#b-model-fit): N = 178 members complete on all three variables, [R²](./effect-sizes.md#b-r²) = 0.322 [0.209, 0.415] – the two predictors account for a third of the variation in satisfaction – F(2, 175) = 41.5, p < 0.001. Then the [coefficients](./regression-basics.md#b-coefficients), one row per predictor: `taste` B = 0.807, SE 0.104, β = 0.494, t = 7.75, p < 0.001, 95% CI [0.602, 1.013]; `wait` B = −0.129, SE 0.042, β = −0.195, t = −3.07, p = 0.003, [−0.212, −0.046]. B is the effect in the outcome's units – each point of taste is worth 0.81 points of satisfaction, each minute waited costs 0.13 – and β puts the two on one scale, where taste matters two and a half times as much. Under the table the app writes the equation out: overall = 5.158 + 0.807 · taste − 0.129 · wait.

When the outcome is a yes or a no, the same module fits a [logistic regression](./regression-basics.md#b-logistic-regression) – **Binomial logistic** as the type – and reports [odds ratios](./regression-basics.md#b-logistic-odds-ratio) instead of B: each point of overall satisfaction multiplies the odds of a recommendation by 2.34 [1.79, 3.04].

*A clinician: dose → predictor, blood pressure → dependent variable, age → covariate. An economist: advertising spend → predictor, sales → dependent. A school: attendance → predictor, pass or fail → a binary dependent variable, and the odds ratio.*

## Do the six questions measure two things, or one?

A structure: whether the six items form the two scales the survey was written to. This is two modules in sequence, and both meet `slow` as the members answered it – it is [reverse-keyed](./guide-data.md#codebook), so a low score is good service – with the answers left as given in the data: reliability analysis is told which items to reverse, and factor analysis shows the item loading the other way.

[Reliability analysis](../reliability-analysis.md) asks whether the items of one scale agree with each other well enough to be added up. Select the three food items, press **Calculate reliability**, and [Cronbach's α](../reliability-analysis.md#reliability-metrics) is 0.71 [0.63, 0.77], with [McDonald's ω](../reliability-analysis.md#reliability-metrics) at 0.72 beside it. For the three service items, with `slow` ticked under [**Reverse-scored items (optional)**](../reliability-analysis.md#reverse-scored-items), α = 0.67 [0.58, 0.74] and ω = 0.67. Food just clears the 0.70 usually asked of a scale and Service falls a little short – three items is few, and reliability grows with the count – while the corrected item-total correlations, 0.49 to 0.59 and 0.46 to 0.52, say no item is pulling its scale down. Both scales can be scored – `Food` as the mean of its three items, `Service` as the mean of its three with `slow` flipped – and the [multiple scales](../reliability-analysis.md#multiple-scales-subscales) mode does the two in one run.

[Factor analysis](../factor-analysis.md) asks the data, rather than the survey's author, how many things the six items measure. Its three steps are the module's three panels. [Step 1](../factor-analysis.md#step-1-method-settings) sets the method – an extraction method and a rotation. [Step 2](../factor-analysis.md#step-2-determine-number-of-factors), **Analyze & determine factors**, first checks that the items are worth factoring – [KMO](./latent-variables.md#b-kmo) = 0.73, above the 0.6 floor, and [Bartlett's test](./latent-variables.md#b-bartletts-test-of-sphericity) χ²(15) = 229.1, p < 0.001 – and then runs the rules for how many: the eigenvalues are 2.44, 1.31, 0.66 and lower, and [parallel analysis](./latent-variables.md#b-parallel-analysis) keeps the two that beat what random data would give. [Step 3](../factor-analysis.md#step-3-run-full-analysis) extracts two factors with an oblique rotation, and the [loadings](./latent-variables.md#b-factor-loading) are the survey's design: `taste`, `fresh` and `value` at 0.76, 0.59 and 0.64 on the first factor and near zero on the second, `friendly`, `quick` and `slow` at 0.58, 0.72 and −0.61 on the second and near zero on the first – `slow` negative, as a reverse-keyed item should be – the two factors correlated 0.39. [Confirmatory factor analysis](../structural-equation-modeling.md#confirmatory-factor-analysis) then tests that structure as a hypothesis: the two-factor model fits – χ²(8) = 6.41, p = 0.60, CFI 1.00, RMSEA 0.000, SRMR 0.034 – and a one-factor rival does not. The [latent variables](./latent-variables.md) page is the whole story; the answer to the owner's question is two things, measured a little roughly.

*A psychologist: questionnaire items → the variables, anxiety and depression → the factors. A teacher: exam questions → the items, and IRT for how hard each one is. A market researcher: brand attributes → the items, and the factors are what the brand means.*

## Reading any results card

Every module's cards share an anatomy, and once it is familiar a new module's output reads itself.

The **title** names the test and the grouping or condition variable, so the first check is that it says what you meant to run. A **descriptive block** – means, SDs, intervals, counts per group – comes before any test and is worth reading on its own: if the groups differ by 0.02 on a 0–10 scale, no p-value will make that interesting. The **test row** holds a [statistic](./hypothesis-testing.md#b-test-statistic) with its letter, its [df](./hypothesis-testing.md#b-df) and its [p](./hypothesis-testing.md#b-p); before reading the p, know [which null](./hypothesis-testing.md#which-null) the test holds, because the assumption tests and the fit tests run the other way from the comparisons. Beside it, an [effect size](./effect-sizes.md) with its [confidence interval](./confidence-intervals.md) is the size of the finding. The [**Interpretation**](./hypothesis-testing.md#b-interpretation) column reads each number against its threshold in words – a convenience, never a summary of the study. **Notes** under a table record what the app did that you did not ask for by name: cases excluded and why, a correction applied, a replicate count, a test that switched to an exact form. Read them; a reviewer will. The **assumption card** is its own card, run from its own button in comparison analysis and folded into the output elsewhere; its rows are the [assumptions](./assumptions.md) page, and its recommendations are the app's routing through the [decision table](#the-decision-table) above. **Plots** come last and are where a number becomes a shape – a box plot that shows the outlier the SD was hiding, a Q-Q plot that shows the tail the normality test rejected.

The app's help is the docs themselves: hover any label or column header, or tap the **(?)** beside it, and the block that explains it opens in place. What the popover shows for a term is what this section says about it.

## The tests, by name

The tests the decision table reaches for, under the names the app's menus use. Each entry says what the test compares, when to choose it and what its card reports; the module's manual has the options and the full table of its output.

- **One-sample t-test** – one continuous variable's mean against a fixed reference value μ₀. Is the mean wait above five minutes. Reports t, df, p, the mean with its confidence interval and [Cohen's d](./effect-sizes.md#b-cohens-d) as $(\text{mean} - \mu_0)/\text{SD}$; the [one-sample Wilcoxon](../comparison-analysis.md#one-sample-numeric) and sign tests are its rank-based partners. [Manual](../comparison-analysis.md#one-sample-numeric).
- **Independent samples t-test** – two groups' means, assuming the two groups have the same spread (Student's t). The first test everyone learns, and the one the assumption check demotes on the café branches because their spreads differ. When it does run, it pools the two groups' variances and reports t on $n_1 + n_2 - 2$ df. [Manual](../comparison-analysis.md#independent-samples-numeric).
- **Welch's t-test (unequal variances)** – two groups' means without assuming equal spreads; the safer default, and what the café's branch comparison used: t(179.5) = −3.20, p = 0.002, d = −0.45. The fractional df is [Welch's correction](./assumptions.md#b-welchs-correction), and it costs almost nothing when the spreads turn out equal. [Manual](../comparison-analysis.md#independent-samples-numeric).
- **Mann-Whitney U test** – two groups compared on [ranks](./parametric-nonparametric.md#b-rank) rather than means: does one group tend to have higher values? For a skewed outcome, an ordinal one, or one with outliers. Reports U, p and the [rank-biserial](./effect-sizes.md#b-cliffs-δ) effect size; its location-shift reading assumes the two groups share a shape, and the [Brunner-Munzel test](../comparison-analysis.md#independent-samples-numeric) drops that assumption. `wait` by branch: U = 3889, p = 0.289. [Manual](../comparison-analysis.md#independent-samples-numeric).
- **One-way ANOVA** – three or more groups' means at once, on the [F](./hypothesis-testing.md#b-f) ratio of between-group to within-group spread. A significant F says at least one group differs; the [post-hoc tests](../comparison-analysis.md#post-hoc-tests) say which. Its effect size is [η²](./effect-sizes.md#b-η²). With unequal spreads the [Welch's one-way ANOVA](#b-welchs-one-way-anova) row takes over. [Manual](../comparison-analysis.md#independent-samples-numeric).
- **Welch's one-way ANOVA** – one-way ANOVA without the equal-spreads assumption, as Welch's t-test is to the t-test; the assumption check steers to it when Levene's fails on three or more groups, with Games-Howell as its post-hoc. [Manual](../comparison-analysis.md#independent-samples-numeric).
- **Kruskal-Wallis test** – the rank-based partner of one-way ANOVA: three or more groups on ranks, with Dunn's test as the post-hoc. [Manual](../comparison-analysis.md#independent-samples-numeric).
- **Factorial ANOVA** – two or more grouping variables together: a [main effect](./comparison-designs.md#b-main-effect) for each and an [interaction](./comparison-designs.md#b-interaction-effect) for whether one factor's effect depends on the other. Branch and age band on spend, say – does the branch gap differ between the young and the old. [Manual](../comparison-analysis.md#factorial-anova).
- **ANCOVA (Analysis of Covariance)** – a group comparison with a continuous [covariate](./regression-basics.md#b-covariate) held fixed: the branch difference in `spend_after` adjusted for `spend_before`, which the [assumptions](./assumptions.md#b-covariate-independence) page shows shrinking from 1.63 to 0.56. [Manual](../comparison-analysis.md#ancova).
- **Paired samples t-test** – two conditions on the same cases, tested on the mean of the paired differences: spend after minus before, 1.09 [0.69, 1.49], t(198) = 5.37. Needs long data with a subject ID; its effect size is [dz](./effect-sizes.md#b-dz). [Manual](../comparison-analysis.md#dependent-samples-numeric).
- **Wilcoxon signed-rank test** – the paired test on ranked differences, for differences that are skewed or carry outliers; W = 13,850 on the spend change. Assumes the differences are symmetric around their centre. [Manual](../comparison-analysis.md#dependent-samples-numeric).
- **Paired sign test** – counts how many pairs went up and how many down and nothing else; the fallback when even symmetry is in doubt, at a cost in power. 125 up against 72 down on spend. [Manual](../comparison-analysis.md#dependent-samples-numeric).
- **Repeated measures ANOVA** – three or more conditions on the same cases; the within-subjects analogue of one-way ANOVA, with [sphericity](./assumptions.md#b-sphericity) as its own assumption and the Greenhouse-Geisser and Huynh-Feldt corrections when it fails. [Manual](../comparison-analysis.md#dependent-samples-numeric).
- **Friedman test** – the rank-based partner of repeated measures ANOVA, with Nemenyi or Conover post-hocs. [Manual](../comparison-analysis.md#dependent-samples-numeric).
- **Mixed ANOVA** – a grouping variable and a condition variable together: did the branches change differently between before and after? The interaction term is the answer to that question; the main effects are the branch gap and the overall change. [Manual](../comparison-analysis.md#mixed-anova).
- **Chi-square test of independence** – whether two categorical variables are associated, from the table of their counts against the counts expected if they were not. Recommend by branch: χ²(1) = 1.71, p = 0.192, V = 0.103. Its card adds the contingency table with expected counts and standardized residuals under each cell, so you can see which cells carry the association. [Manual](../comparison-analysis.md#independent-samples-categorical).
- **Fisher's exact test** – the same question with an exact p, for a table whose expected counts are small – below five in a cell is the usual rule – where the chi-square approximation is unreliable. [Manual](../comparison-analysis.md#independent-samples-categorical).
- **Two-sample proportion** – the [planner](../analysis-planner.md)'s name for the comparison of a rate between two groups, which in the app is the chi-square test of independence or Fisher's exact test on the 2 × 2 table; the effect size is [Cohen's h](./effect-sizes.md#b-cohens-h).
- **McNemar's test** – a yes/no outcome on the same cases at two occasions, tested on the pairs that changed: would-recommend before and after, had the survey been run twice. [Manual](../comparison-analysis.md#dependent-samples-categorical).
- **Chi-square goodness-of-fit test** – one categorical variable's counts against a distribution you specify: are the members split evenly across the branches, does a die come up fair. [Manual](../comparison-analysis.md#one-sample-categorical).
- **One-sample proportion test** – one rate against a fixed value π₀, with an exact p and an interval for the rate: is the recommendation rate above 60%? The café's 135 of 200 is 0.68, 95% CI [0.61, 0.74], p = 0.030 – yes, by a small margin, [Cohen's h](./effect-sizes.md#b-cohens-h) = 0.16. Pick the category that counts as a success, or the test answers for the other one. [Manual](../comparison-analysis.md#one-sample-categorical).
- **Pearson's r** – the strength of a straight-line relationship between two continuous variables, from −1 to 1; the default in [correlation analysis](../correlation-analysis.md#choosing-a-method), and [r](./effect-sizes.md#b-r) on the effect-sizes page. Sensitive to outliers and to curves it cannot follow.
- **Spearman's ρ** – the same on ranks: [Spearman's rho](./parametric-nonparametric.md#b-spearmans-rho), for skewed or ordinal variables and any relationship that is consistently rising or falling, straight or not.

## Questions the café does not ask

Four shapes of question have no example in the café file, and each has a module of its own:

- **A time course** – one series of values in order, and whether it trends, cycles or broke at some point. The café's daily takings would be one; [time series analysis](../time-series-analysis.md) works its own example.
- **A time until an event** – how long members stay before they lapse, patients before relapse, machines before failure, when some have not had the event yet. [Time-to-event analysis](../time-to-event-analysis.md), with the [survival analysis](./survival.md) page behind it.
- **Segments** – whether the members fall into natural groups nobody labelled in advance, from their pattern of answers and spending. [Cluster analysis](../cluster-analysis.md).
- **Several studies at once** – pooling the effect sizes of published studies into one estimate. [Meta-analysis](../meta-analysis.md).

And two that come before the data: how many members the café should have surveyed to find a gap the size it cared about is the [analysis planner](../analysis-planner.md), with the [power and sample size](./power-sample-size.md) page behind it; and what to do about the answers that are missing is the [outliers and missing data](./outliers-missing-data.md) page.

The result of every walk above still has to be written down – which numbers, in what order, with what caveats. That is [the next page](./guide-report.md).
