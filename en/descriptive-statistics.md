---
title: Descriptive statistics
description: Compute means, medians, standard deviations, confidence intervals, and other summary statistics for numeric and categorical variables in DataSuite 2.
---

# Descriptive statistics

The **Descriptive statistics** module summarises each selected variable in one row of a table: the measures of location, spread, shape, counts, quantiles and diversity you tick, with standard errors and confidence intervals where they exist, for numeric and categorical variables alike. {#descriptive-statistics}

## How to use

1. [Select your variables](./getting-started.md#choosing-variables)
2. Open **Descriptive statistics** from the menu
3. Tick the statistics you want under [Configuration](#configuration), or apply a [preset](#presets)
4. Click **Generate descriptive statistics** and read the [results](#reading-results)

## Presets

- **Apply preset** – two presets set the checkboxes for the common cases; applying one clears every other statistic first.
	- **Parametric** – sample size, mean, standard deviation, minimum, maximum
	- **Nonparametric** – sample size, median, minimum, maximum, quartiles (25%, 75%)

Both presets keep **Sample size**. The **Use sample statistics (n-1 denominator)** and **Report as excess kurtosis** toggles are presentation settings rather than statistics, and a preset leaves them as they are.

## Configuration

Every statistic is a checkbox, grouped as the panel groups them, and a box that needs a setting reveals it beneath. A statistic a variable cannot have – a geometric mean where a value is zero, a proportion where there are three levels – prints **N/A** in its cell, and hovering the cell says why.

### Central tendency

- **Mean** – the arithmetic average: the right summary of a roughly symmetric variable, and the quantity most tests compare – see [mean](./concepts/distributions.md#b-mean).
- **Sum** – the total of the values; meaningful for additive quantities such as counts or revenue, not for rates, ratios or indices.
- **Median** – the middle value of the sorted data, unmoved by outliers or skew – see [median](./concepts/distributions.md#b-median).

> **Mean vs. median?** When the two diverge, a tail or an outlier is pulling the mean – see [when the mean and the median disagree](./concepts/distributions.md#when-the-mean-and-the-median-disagree).

- **Mode** – the most frequent value; several values sharing the highest count are all listed, and a variable in which no value repeats reads **No mode** – see [mode](./concepts/distributions.md#b-mode). Adds a [Mode frequency](#b-mode-frequency) column.
- **Trimmed mean** – the mean of what remains after the **Trim percentage** is cut from each end of the sorted values, a compromise between the mean and the median; at a 50% trim it is the median – see [trimmed mean](./concepts/parametric-nonparametric.md#b-trimmed-mean). The column header carries the percentage. {#trimmed-mean #trimmed-mean-pct}
- **Trim percentage** – the share cut from each end, 0–50%, 10% by default; one value serves the trimmed mean, its standard error and its confidence interval, and the box shows whenever any of the three is ticked. A cleared or unreadable box counts as 10%.
- **Geometric mean** – the *n*th root of the product of the values, for multiplicative quantities such as growth rates or ratios; **N/A** when any value is zero or negative.
- **Harmonic mean** – the reciprocal of the mean of the reciprocals, for averaging rates such as speeds; **N/A** when any value is zero or negative.
- **Hodges-Lehmann pseudomedian** – the median of all pairwise averages $(x_i + x_j)/2$: nearly as resistant to outliers as the median and nearly as efficient as the mean when the data is symmetric, reported together with its confidence interval from the signed-rank distribution – see [Hodges–Lehmann estimate](./concepts/parametric-nonparametric.md#b-hodges-lehmann-estimate). The one statistic here computed in R. {#hodges-lehmann-pseudomedian #hl-pseudomedian}

> **Median or pseudomedian?** The pseudomedian suits data that is roughly symmetric but not trusted to be normal; for a strongly skewed variable the median is still the more interpretable – see [Hodges–Lehmann estimate](./concepts/parametric-nonparametric.md#b-hodges-lehmann-estimate).

### Dispersion

- **Minimum** – the smallest value, headed **Min**; a −999 here is a missing-value code that was never declared – see [min](./concepts/distributions.md#b-min). {#minimum #min}
- **Maximum** – the largest value, headed **Max**; a 999 here is the same kind of code – see [max](./concepts/distributions.md#b-max). {#maximum #max}
- **Range** – maximum minus minimum, set entirely by the two extremes – see [range](./concepts/distributions.md#b-range).
- **Variance** – the average squared deviation from the mean, in squared units; *s²* under sample statistics and *σ²* under population statistics, and the header says which – see [variance](./concepts/distributions.md#b-variance). {#variance #variance-s² #variance-σ²}
- **Standard deviation** – the square root of the variance, in the variable's own units, headed **Std dev (s)** or **Std dev (σ)** by the [sample toggle](#b-use-sample-statistics-n-1-denominator) – see [standard deviation](./concepts/distributions.md#b-standard-deviation). {#standard-deviation #std-dev-s #std-dev-σ}

> **Rule of thumb?** In a roughly normal distribution about 68% of the values fall within one SD of the mean and about 95% within two – see [normal distribution](./concepts/distributions.md#b-normal-distribution).

- **Winsorized standard deviation** – the SD after the extreme **Winsorization percentage** of values at each tail is replaced by the boundary value rather than dropped; the spread that belongs with a trimmed mean – see [winsorizing](./concepts/parametric-nonparametric.md#b-winsorizing). The header carries the percentage and the denominator, as `Winsorized SD (10%, s)`; **N/A** when the percentage leaves no central data (50% on an even *n*). {#winsorized-standard-deviation #winsorized-sd-pct-s #winsorized-sd-pct-σ}
- **Winsorization percentage** – the share replaced at each end, 0–50%, 10% by default, set independently of the trim percentage; a cleared or unreadable box counts as 10%.
- **Interquartile range** – Q3 minus Q1, the width of the middle half of the data, headed **IQR**; unmoved by outliers, so the spread to report beside a median – see [IQR](./concepts/distributions.md#b-iqr). {#interquartile-range #iqr}
- **Mean absolute deviation** – the average absolute distance from the mean, headed **Mean AD**; less sensitive to extremes than the SD because nothing is squared, in the same units as the mean. {#mean-absolute-deviation #mean-ad}
- **Median absolute deviation** – the median of |*x* − median|, unscaled, headed **Median AD**; multiplied by 1.4826 it estimates the SD of a normal variable, and the **Modified Z outliers** rule is built on it – see [median absolute deviation](./concepts/parametric-nonparametric.md#b-median-absolute-deviation). {#median-absolute-deviation #median-ad}
- **Coefficient of variation** – the SD as a percentage of the mean, for comparing spread across variables measured on different scales, headed **CV (%, s)** or **CV (%, σ)** by the sample toggle; defined only for non-negative ratio-scale data, so **N/A** when any value is negative or the mean is zero. {#coefficient-of-variation #cv-s #cv-σ}

### Shape

- **Skewness** – asymmetry: 0 is symmetric, a positive value a longer right tail, a negative one a longer left tail – see [skewness](./concepts/distributions.md#b-skewness). Always the bias-corrected sample estimator *G₁*, whatever the sample toggle; **N/A** below three observations or when every value is identical.
- **Kurtosis** – the weight of the tails relative to a normal distribution, reported as excess kurtosis (normal = 0) unless **Report as excess kurtosis** is unticked, and headed **Excess kurtosis** or **Kurtosis** accordingly – see [kurtosis](./concepts/distributions.md#b-kurtosis). Always the bias-corrected *G₂*; **N/A** below four observations or when every value is identical. {#kurtosis #excess-kurtosis}
- **Report as excess kurtosis** – on by default: raw kurtosis minus 3, so a normal distribution scores 0. Shown whenever kurtosis, its standard error or its confidence interval is ticked, so the form can be set for an interval requested on its own.
- **SE/CI method** – how the standard errors and confidence intervals of skewness and kurtosis are built; shown when any of the four is ticked, and named in their column headers as `normal` or `bootstrap`.
	- **Analytical (normal-theory)** – closed-form standard errors derived under a normal distribution, and intervals of estimate ± *z* × SE; honest only near normality.
	- **Bootstrap (BCa)** – resamples the data over the [bootstrap replications](./settings.md#bootstrap-replications) setting and takes the bias-corrected and accelerated interval, with the standard error the SD of the replicates – see [BCa](./concepts/confidence-intervals.md#b-bca). A cell built on too few usable replicates is flagged, and hovering it says which of the two floors was missed; the point estimate stays valid either way. At the shipped 100 replications the interval is always flagged – raise the setting to 1,000 for a quotable interval.

### Summary counts

- **Sample size** – the number of non-missing observations, headed **N** – see [sample size](./concepts/distributions.md#b-sample-size). {#sample-size #n}
- **Count of distinct values** – how many different values occur, missing excluded, headed **Distinct**; five distinct values in a variable meant to be binary point at inconsistent coding, which a [frequency table](./distribution-analysis.md#frequency-tables) then shows. {#count-of-distinct-values #distinct}
- **Missing value count** – how many cells are empty, as a count and a percentage of all rows, headed **Missing**. {#missing-value-count #missing}
- **Zero count** – how many values equal zero, as a count and a percentage of the non-missing values, headed **Zeroes**. {#zero-count #zeroes}
- **Mild outliers (1.5·IQR)** – the count and percentage of values outside $[Q_1 - 1.5\,\text{IQR},\ Q_3 + 1.5\,\text{IQR}]$, the points a box plot draws beyond its whiskers – see [Tukey's fences](./concepts/outliers-missing-data.md#b-tukeys-fences). Adds an [Inlier range](#b-inlier-range-15iqr) column. **N/A** when the IQR is 0.
- **Extreme outliers (3·IQR)** – the same rule with the fences at 3 IQR, always a subset of the mild outliers. Adds its own inlier-range column; **N/A** when the IQR is 0.
- **Modified Z outliers (|M| > 3.5)** – the count and percentage of values whose modified Z-score $M = 0.6745 \cdot (x - \text{median})/\text{MAD}$ exceeds 3.5 in absolute value; built on the median and the median AD, so one extreme value cannot mask another – see [modified z-score](./concepts/outliers-missing-data.md#b-modified-z-score). Adds its own inlier-range column; **N/A** when the median AD is 0.

> **Which rule?** The 1.5·IQR fences match a box plot and suit any shape; 3·IQR isolates the unambiguous cases; the modified Z rule gives a Z-style threshold without the masking of the classical one – see [finding one variable's outliers](./concepts/outliers-missing-data.md#finding-one-variables-outliers).

### Quantiles

- **Quartiles (25%, 75%)** – Q1 and Q3, the values below which a quarter and three quarters of the data fall, headed **Q1 (25%)** and **Q3 (75%)** and computed by linear interpolation (R's type 7) – see [Q1](./concepts/distributions.md#b-q1) and [Q3](./concepts/distributions.md#b-q3). {#quartiles-25-75 #q1-25 #q3-75}
- **Custom percentiles** – any percentiles you name under **Values (comma separated)**, one column each, headed *P* and the number – see [percentile](./concepts/distributions.md#b-percentile). A box with no valid entry adds no columns and raises a warning.
- **Values (comma separated)** – the percentiles to compute, 0–100, as `10, 90`; unreadable entries and duplicates are dropped and the rest sorted.

### Diversity

Three measures of how evenly the values are spread across the distinct levels, computed for categorical and numeric variables alike – a numeric variable's distinct values are its levels. Once 90% or more of a numeric variable's values are distinct the measures only restate that, and hovering the cells says so.

- **Shannon entropy (H)** – $H = -\sum_i p_i \ln p_i$, in nats, headed **Shannon H (nats)**: 0 when every case has the same value and ln *k* when the *k* levels are equally used, so it grows with the number of levels – see [entropy](./concepts/association.md#b-entropy). {#shannon-entropy-h #shannon-h-nats}
- **Pielou's evenness (J)** – $J = H / \ln k$, the entropy scaled to 0–1 by the number of levels, headed **Pielou's J**: 1 is perfectly even, 0 one level holding everything, and comparable across variables where H is not – see [Pielou's evenness](./concepts/distributions.md#b-pielous-evenness). **N/A** with a single level. {#pielous-evenness-j #pielous-j}
- **Gini-Simpson (1−D)** – the probability that two random observations fall in different levels, from 0 to 1 – see [Gini-Simpson index](./concepts/distributions.md#b-gini-simpson-index). {#gini-simpson-1d}

### Standard errors

A standard error says how much a statistic would vary from sample to sample – the precision of the statistic, where the SD is the spread of the values – see [standard error](./concepts/confidence-intervals.md#b-standard-error).

- **Standard error of mean** – the SD divided by √*n*, headed **SE (mean)**. {#standard-error-of-mean #se-mean}
- **Standard error of median** – a bootstrap: the SD of the median over resamples with replacement, as many as the [bootstrap replications](./settings.md#bootstrap-replications) setting says, headed **SE (median)** – see [bootstrap](./concepts/confidence-intervals.md#b-bootstrap). {#standard-error-of-median #se-median}
- **Standard error of trimmed mean** – the Tukey–McLaughlin standard error: the winsorized spread at the same trim, over the observations the trim left in place, headed **SE (trimmed mean, {pct}%)**; the plain SE of the mean is not valid for a trimmed mean. Shares the **Trim percentage** box; **N/A** when the trim leaves fewer than two observations. {#standard-error-of-trimmed-mean #se-trimmed-mean-pct}
- **Standard error of proportion** – $\sqrt{p(1 - p)/n}$ for the [proportion](#b-proportion) of a binary variable, headed **SE (proportion)**. {#standard-error-of-proportion #se-proportion}
- **Standard error of skewness** – by the [SE/CI method](#b-se-ci-method), headed **SE (skewness, {method})**. {#standard-error-of-skewness #se-skewness-method}
- **Standard error of kurtosis** – by the [SE/CI method](#b-se-ci-method), headed **SE (kurtosis, {method})**. {#standard-error-of-kurtosis #se-kurtosis-method}

### Confidence intervals

Every interval is at the [confidence level](./settings.md#confidence-level) set in Settings, which the column headers repeat, and prints as a lower and an upper column – see [confidence interval](./concepts/confidence-intervals.md#b-confidence-interval).

- **CI for mean** – Student's *t* interval at *n* − 1 degrees of freedom, headed **Mean CI lower ({level}%)** and **Mean CI upper ({level}%)**. {#ci-for-mean #mean-ci-lower-level #mean-ci-upper-level}
- **CI for trimmed mean** – the Tukey–McLaughlin (Yuen) interval: trimmed mean ± *t* × its [standard error](#b-standard-error-of-trimmed-mean) at *h* − 1 degrees of freedom, *h* the untrimmed count; at a 0% trim it equals the CI for the mean. Headed **Trimmed mean CI lower ({level}%, {pct}%)** and **Trimmed mean CI upper ({level}%, {pct}%)**, the trim repeated so the interval reads with the estimate it brackets. {#ci-for-trimmed-mean #trimmed-mean-ci-lower-level-pct #trimmed-mean-ci-upper-level-pct}
- **CI for median** – distribution-free, built from the order statistics by the **Median CI method** it reveals, headed **Median CI lower ({level}%)** and **Median CI upper ({level}%)**; hovering a header names the construction – see [interval for a median](./concepts/confidence-intervals.md#b-interval-for-a-median). {#ci-for-median #median-ci-lower-level #median-ci-upper-level}
- **Median CI method** – which of two constructions produces the bounds.
	- **Exact (order statistics)** – inverts the Binomial(*n*, 0.5) sign test; conservative, its coverage at least the nominal level. **N/A** when no pair of order statistics reaches the level (*n* = 5 at 95%), with the reason on hover.
	- **Interpolated (Hettmansperger-Sheather)** – interpolates between adjacent order statistics to land closer to the nominal level; the interval the median notch in [box plots](./distribution-analysis.md#box-plot) draws, so pick it when the table and the plot should agree.
- **CI for proportion** – the Wilson score interval, well behaved near 0 and 1 where the textbook interval is not, headed **Proportion CI lower ({level}%)** and **Proportion CI upper ({level}%)**; binary variables only – see [interval for a proportion](./concepts/confidence-intervals.md#b-interval-for-a-proportion). {#ci-for-proportion #proportion-ci-lower-level #proportion-ci-upper-level}
- **CI for standard deviation** – Bonett's kurtosis-adjusted interval, not the chi-square pivot, headed **Std dev CI lower ({level}%, Bonett)** and **Std dev CI upper ({level}%, Bonett)**; hovering a header says why another package's number differs – see [interval for a standard deviation](./concepts/confidence-intervals.md#b-interval-for-a-standard-deviation). Needs sample statistics – the box is disabled and cleared under population statistics – and at least five observations. {#ci-for-standard-deviation #std-dev-ci-lower-level-bonett #std-dev-ci-upper-level-bonett}
- **CI for variance** – the bounds of the SD interval, squared, headed **Variance CI lower ({level}%, Bonett)** and **Variance CI upper ({level}%, Bonett)**; the same construction and the same sample-statistics requirement. {#ci-for-variance #variance-ci-lower-level-bonett #variance-ci-upper-level-bonett}
- **CI for skewness** – by the [SE/CI method](#b-se-ci-method): skewness ± *z* × SE, or the BCa bootstrap interval, headed **Skew CI lower ({level}%, {method})** and **Skew CI upper ({level}%, {method})**. {#ci-for-skewness #skew-ci-lower-level-method #skew-ci-upper-level-method}
- **CI for kurtosis** – by the [SE/CI method](#b-se-ci-method), in the form **Report as excess kurtosis** sets, headed **Kurt CI lower ({level}%, {method})** and **Kurt CI upper ({level}%, {method})**. {#ci-for-kurtosis #kurt-ci-lower-level-method #kurt-ci-upper-level-method}

> **Reading a 95% CI?** Over many repetitions of the study, about 95% of the intervals computed this way would contain the population value – see [95% CI](./concepts/confidence-intervals.md#b-95-ci).

### Sample vs. population statistics

- **Use sample statistics (n-1 denominator)** – on by default. Governs four statistics – variance, standard deviation, winsorized standard deviation and the coefficient of variation – with *n* − 1 as the denominator when ticked and *n* when not; their headers read *s* or *σ* accordingly. Skewness, kurtosis and every standard error and confidence interval keep the sample form regardless, and unticking the box also disables and clears **CI for standard deviation** and **CI for variance**, which exist only for the sample form. Keep it ticked unless your data is the whole population of interest: *n* on a sample understates the variability.

## Reading results

Results appear in a **Descriptive statistics** card with up to two tables, one row per variable. A variable with no valid value left under the active [case filter](./getting-started.md#filtering-cases) is left out of the table and named in a warning above it; when no ticked statistic applies to any selected variable, no card appears and a notification says so. Each run adds a new card, so tables with different selections can sit side by side.

**Numerical variables.** One row per numeric variable and one column per ticked statistic, the columns in the order of the groups above. Every header carries the setting its numbers depend on – the trim, the confidence level, the SE/CI method, the *s* or *σ* denominator – so an exported table reads without the panel.

**Categorical variables.** One row per categorical variable, with the statistics that apply to categories: the sample size, missing count and distinct values, the mode and its frequency, the three diversity measures and, for a binary variable, the proportion with its standard error and interval.

The columns are the statistics' own entries above; the ones no checkbox names:

- **Variable** – the variable's display name.
- **Mode frequency** – how many observations share the modal value; **N/A** when there is no mode.
- **HL CI lower ({level}%)** – the lower bound of the pseudomedian's interval, with **HL CI upper ({level}%)** its upper bound; computed with the estimate whether or not any CI box is ticked. {#hl-ci-lower-level #hl-ci-upper-level}
- **Inlier range (1.5·IQR)** – the cut-off pair *[lower, upper]* of the rule beside it, one column per enabled rule – **Inlier range (3·IQR)** and **Inlier range (modified Z)** likewise; feed the pair to a [case filter](./getting-started.md#filtering-cases), where **Between** keeps the inliers and **Outside** the outliers – see [inlier range](./concepts/outliers-missing-data.md#b-inlier-range). **N/A**, with the reason on hover, when the rule's spread is zero. {#inlier-range-15iqr #inlier-range-3iqr #inlier-range-modified-z}
- **Category** – the level whose share the proportion columns describe: the more frequent of a binary variable's two levels, the first met on a tie. For a variable with one level, or three or more, the proportion cells read **N/A**, and hovering one says why.
- **Proportion** – that level's share of the non-missing observations. A binary numeric variable (0/1 dummies and the like) gets the same columns in the numeric table.

## Reporting checklist

**Method:**
- Which statistics were reported and why (median and IQR for skewed data instead of mean and SD)
- Whether sample (*n* − 1) or population (*n*) statistics were used
- How missing data were handled
- The construction behind any interval that has more than one: the **Median CI method** used, and that the SD and variance intervals are Bonett's rather than the chi-square ones

**Results:**
- Central tendency – mean or median by the shape of the distribution, the HL pseudomedian for symmetric but non-normal data
- Dispersion – SD, winsorized SD, IQR or range as appropriate
- Sample size per variable, especially where missing data makes it vary
- Skewness and kurtosis where the shape matters to later analyses, with the SE/CI method – analytical or bootstrap
- Outlier counts where extreme values affect the interpretation – the rule used (1.5·IQR, 3·IQR, or modified Z with |M| > 3.5) and the inlier range, so readers know which values were flagged
- Any variable dropped from the table because every case was missing under the active filter

## Reproducibility

Most statistics are computed in the browser without R. The Hodges-Lehmann pseudomedian and its interval go through R's `stats::wilcox.test(x, conf.int = TRUE)`, shown in the [R console](./r-console.md), with an offset `mu` that keeps zero values in the estimate – a bare call can differ on data with zeros. Every run's citation box lists the methods behind the ticked statistics and nothing else, with the `stats` package added when the pseudomedian ran. With [Bootstrap seed](./settings.md#bootstrap-seed) empty the bootstrap paths draw fresh resamples on every run, so the median's SE and the bootstrap intervals move in their last digits; an integer there makes them reproducible, each variable drawing its own stream keyed on its position in the selection. The [method notes](./methods/descriptive-statistics.md) hold the reasoning behind these choices.

## Common pitfalls

**Reporting mean and SD for skewed data.** If a variable is heavily skewed, the mean is pulled toward the tail and the SD is inflated by extreme values. Report the median and IQR instead – they describe the typical value and spread without being distorted by outliers.

**Ignoring missing data patterns.** A variable with 40% missing values tells a different story than one with 2% missing. Check the missing counts before interpreting the other statistics – high missingness can bias every summary.

**Comparing coefficients of variation across scales with different meanings.** CV is only meaningful for ratio-scale variables with a true zero. Comparing the CV of a temperature in Celsius with that of a reaction time is misleading because 0 °C is not a true zero. The module refuses the most obvious misuse by reporting **N/A** when any value is negative, but a non-negative scale alone doesn't make CV meaningful – interval scales such as years or dates still aren't ratio scales.

**Treating the distinct-value count as a quality check and stopping there.** Five distinct values in a binary variable is a good start, but the frequency table in [Distribution analysis](./distribution-analysis.md#frequency-tables) shows *which* values are unexpected – far more actionable than the count alone.

**Reading the mode of a continuous variable.** The mode counts exact matches. For continuous measurements two values almost never coincide, so the result is either **No mode** or a near-arbitrary tie – neither is useful. Use the median or the HL pseudomedian as the typical value, and report the mode for categorical or discrete numeric variables (Likert items, counts, ordinal codes).

**Reading N/A in the proportion columns as a failure.** The proportion, its standard error and its interval exist only for a binary variable – exactly two distinct non-missing values, categorical or numeric. With one level the proportion is trivially 1; with three or more, a single proportion no longer summarises the variable – use the [frequency table](./distribution-analysis.md#frequency-tables) for the full per-category breakdown.

**Reading "No mode" as zero observations.** A **No mode** cell doesn't mean the variable is empty – it means every observed value is unique, so no value is more frequent than any other. For continuous numeric data this is the usual state.
