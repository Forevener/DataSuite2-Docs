---
title: Descriptive statistics
description: Compute means, medians, standard deviations, confidence intervals, and other summary statistics for numeric and categorical variables in DataSuite 2.
---

# Descriptive statistics

The **Descriptive statistics** module computes summary statistics for your selected variables. Pick the statistics you need, click the button, and get a results table – one row per variable.

## How to use

1. [Select your variables](./getting-started.md#choosing-variables)
2. Open **Descriptive statistics** from the menu
3. Check the statistics you want (or apply a [preset](#presets))
4. Click **Generate descriptive statistics**

Results appear in up to two tables: one for numeric variables, one for categorical variables.

## Presets

Two presets configure the checkboxes for common use cases:

- **Parametric** – sample size, mean, standard deviation, minimum, maximum
- **Nonparametric** – sample size, median, minimum, maximum, quartiles (25%, 75%)

Applying a preset clears all other checkboxes first. **Sample size (N)** is part of both presets – it is a count, not a distributional choice, so no preset leaves you with a table that has no *N*. The **Use sample statistics (n-1 denominator)** and **Report as excess kurtosis** toggles are presentation settings rather than statistic choices, and are left untouched by presets.

## Available statistics

### Central tendency

Measures of where the "center" of your data lies.

- **Mean** – the arithmetic average. Most useful when data is roughly symmetric without extreme outliers.

- **Sum** – the total of all values. Useful for additive quantities such as counts, revenue, or totals; less meaningful for rates, ratios, or indices.

- **Median** – the middle value when data is sorted. More robust than the mean when data is skewed or contains outliers.

> **Mean vs. median:** when these two are close, your data is roughly symmetric. When they diverge, something is pulling the mean away – usually outliers or skew. For example, if the mean salary is \$75,000 but the median is \$55,000, a few very high salaries are inflating the average. In such cases, the median better represents the "typical" value.

- **Mode** – the most frequently occurring value. Can be meaningful for any variable type, but especially for categorical data. A variable can have multiple modes if several values share the highest frequency. If every value is unique (no value repeats), the cell shows **No mode** – i.e. no value repeats, rather than "every value is a mode".

- **Trimmed mean** – the mean after removing a percentage of extreme values from both ends. The **Trim percentage** box (0–50%, default 10%) controls how much is cut; it appears whenever the trimmed mean, [its standard error](#standard-errors) or [its confidence interval](#confidence-intervals) is selected, and one value drives all three. A 10% trim removes the lowest 10% and the highest 10% of values before averaging. This gives a compromise between the mean (sensitive to outliers) and the median (ignores all but the middle value). At the maximum 50% trim everything outside the centre is removed, so the result equals the median (matching R's `mean(x, trim = 0.5)`).

- **Geometric mean** – the nth root of the product of values. Appropriate for data that is multiplicative in nature, such as growth rates or ratios. Reported as **N/A** when any value is zero or negative.

- **Harmonic mean** – the reciprocal of the mean of reciprocals. Useful for averaging rates (e.g. speed, efficiency). Reported as **N/A** when any value is zero or negative.

- **Hodges-Lehmann pseudomedian** – the median of all pairwise averages *(xᵢ + xⱼ)/2*. A robust location estimator that combines two desirable properties: it ignores outliers almost as well as the median, while being nearly as efficient as the mean when the data really is symmetric. Reported alongside its [confidence interval](#confidence-intervals), which inverts the Wilcoxon signed-rank distribution. The estimator and CI are computed via R's `stats::wilcox.test(x, conf.int = TRUE)` – see [Reproducibility](#reproducibility).

> **When to prefer HL:** when your data is roughly symmetric but you don't trust it to be normal, or when you want a robust location estimate that's more informative than a plain median. For very skewed data, the median is still more interpretable.

### Dispersion

Measures of how spread out your data is.

- **Minimum** and **Maximum** – the smallest and largest values. Always worth checking – an unexpected minimum (like -999) or maximum (like 999) often signals a data entry error or a missing value code that wasn't handled.

- **Range** – the difference between maximum and minimum. Easy to understand, but highly sensitive to outliers – a single extreme value changes the range dramatically.

- **Variance** – the average squared deviation from the mean. Expressed in squared units of the original variable, so if you're measuring height in centimeters, variance is in cm². This makes it hard to interpret directly – standard deviation is usually more practical.

- **Standard deviation (SD)** – the square root of variance. Expressed in the same units as the original variable, making it the most commonly reported measure of spread.

> **Rule of thumb:** in a roughly normal distribution, about 68% of values fall within ±1 SD of the mean, and about 95% within ±2 SD.

- **Winsorized standard deviation** – the SD computed after replacing the extreme values at each tail with the cutoff value at the boundary (rather than discarding them, as with the trimmed mean). The winsorization percentage (0–50%, default 10%) is set independently of the trimmed-mean percentage. Less sensitive to outliers than the plain SD; the natural companion to the trimmed mean. The sample-vs-population toggle ([see below](#sample-vs-population-statistics)) controls which denominator is used; the column header reflects the choice as `Winsorized SD (%, s)` or `Winsorized SD (%, σ)`. Reported as **N/A** when the chosen percentage would leave no central data (e.g. 50% on an even-*n* sample of 4 or 6 observations).

> **Trimming vs. winsorizing:** trimming removes the outermost values; winsorizing keeps the sample size and instead pulls the extremes inward. Winsorized SD is what robust inference methods (e.g. Yuen's t-test) use to pair with a trimmed mean.

- **Interquartile range (IQR)** – the difference between the 75th and 25th percentiles. Captures the spread of the middle 50% of the data – essentially the range of "typical" values, ignoring the extremes on both ends. Unlike SD, it is not affected by outliers – a single extreme value won't change the IQR.

> **Practical use:** if IQR is much smaller than the range, it means your data has a compact core with a few far-flung values. This is a quick way to gauge whether outliers are inflating your spread statistics.

- **Mean absolute deviation** – the average absolute distance from the mean. Like IQR, it is less sensitive to outliers than SD, because it doesn't square the deviations (squaring amplifies the impact of extreme values). A good companion to the mean when you want a spread measure with the same units but less sensitivity to extremes.

- **Median absolute deviation** – the median of *|x − median(x)|*. The robust counterpart to mean AD: by replacing both the centring point (mean → median) and the aggregation (mean → median), it stays stable even when a substantial fraction of the data is contaminated. Multiplied by 1.4826 it estimates the SD of a normal distribution; the **Modified Z outliers** rule uses this internally.

> **SD vs. mean AD vs. median AD:** for clean normal data they tell a similar story. Heavy-tailed data inflates SD the most; the mean AD stays stable longer; the median AD is the most resistant of the three. If your SD is noticeably larger than your mean AD, that's a sign a few extreme values are driving the spread.

- **Coefficient of variation (CV)** – the standard deviation divided by the mean, expressed as a percentage. Useful for comparing variability between variables measured on different scales – for example, comparing the variability of reaction times (measured in milliseconds) with the variability of accuracy scores (measured in percent). The sample-vs-population toggle ([see below](#sample-vs-population-statistics)) controls which SD is used in the numerator; the column header reflects the choice as `CV (%, s)` or `CV (%, σ)`. Only defined for non-negative, ratio-scale data; reported as **N/A** when the data contains any negative value or the mean is zero.

### Shape

How the distribution of values looks beyond center and spread.

- **Skewness** – measures asymmetry. A value near 0 indicates a symmetric distribution. Positive skewness means a longer right tail; negative means a longer left tail.

> **Example:** income data is typically positively skewed – most people earn moderate amounts, with a long tail of high earners pulling the distribution to the right.

- **Kurtosis** – measures how heavy the tails are relative to a normal distribution. By default, reported as **excess kurtosis** (raw kurtosis minus 3), so a normal distribution has a value of 0. Positive values indicate heavier tails; negative values indicate lighter tails.

> **Heavy vs. light tails:** a distribution with heavy tails (positive kurtosis) produces more extreme values than you'd expect from a normal distribution – more outliers, more "surprising" data points. A distribution with light tails (negative kurtosis) is the opposite – values cluster closer together with fewer extremes. For example, exam scores that bunch in the middle with few very high or very low scores would have negative kurtosis.

> **Formulas:** skewness and kurtosis always use the bias-corrected sample estimators *G₁* and *G₂* – the same formulas Excel, SPSS, SAS, and R's `e1071::skewness(type = 2)` report by default. The sample-vs-population toggle does **not** affect them. Skewness needs at least 3 observations; kurtosis needs at least 4 (and SE/CI for kurtosis needs 5). Both are undefined (reported as **N/A**) when the standard deviation is zero – i.e. all values are identical.

### Counts

- **Sample size (N)** – the number of non-missing observations.

- **Distinct values** – how many unique values the variable has. Helpful for spotting coding errors or verifying categorical variables. For example, a "Dominant hand" variable with 5 distinct values when you expected 2 might indicate inconsistent coding ("Left", "left", "L", "RIGHT", "Right").

- **Missing value count** – how many observations have no value, shown as both a count and a percentage of the total.

- **Zero count** – how many observations equal zero, shown as both a count and a percentage.

- **Mild outliers (1.5·IQR)** – count (and percent) of values falling outside *[Q1 − 1.5·IQR, Q3 + 1.5·IQR]*. These are the values that appear as individual points beyond the whiskers in a standard box plot. Inlier range is **N/A** when the IQR is zero (at least half the data sits at a single value), since the rule loses its meaning.

- **Extreme outliers (3·IQR)** – count (and percent) of values falling outside the wider band *[Q1 − 3·IQR, Q3 + 3·IQR]*. Always a subset of the mild outliers – these are the truly far-from-typical values. Same IQR=0 caveat as above.

- **Modified Z outliers (|M| > 3.5)** – count (and percent) of values whose modified Z-score *M = 0.6745·(x − median)/MAD* exceeds 3.5 in absolute value (Iglewicz & Hoaglin 1993). Here MAD is the **median absolute deviation**, not the mean form. Unlike a classical Z-score, this rule uses the median and median AD, so the centre and scale used to flag outliers are themselves resistant to outliers – a single extreme value can no longer "mask" others. When the median AD is zero (more than half the data is identical to the median), the rule loses its meaning – same as the IQR=0 case above.

Each outlier rule that is enabled also produces an **Inlier range** column showing the cutoff pair *[lower, upper]*. Feed that pair into a [case filter](./getting-started.md#filtering-cases): a **Between** *lower* and *upper* condition keeps the inliers, while **Outside** keeps the outliers. In the degenerate cases noted above (IQR=0, MAD=0), both the count and the inlier-range cells report **N/A**; hovering the cell shows an explanation of why the rule could not be applied.

> **Picking a rule:** for general use, the **mild outliers (1.5·IQR)** rule matches what a box plot shows and works on any distribution shape. The **extreme** rule isolates the most unambiguous outliers. The **modified Z** rule is the right choice when you want a Z-style threshold without the masking problem of the classical mean/SD version – it agrees with the IQR rules on heavy-tailed data but uses a sharper, distance-based cutoff.

### Quantiles

- **Quartiles (25%, 75%)** – the values below which 25% and 75% of the data falls. Together with the median (50th percentile), these define the "box" in a box plot. The 25th percentile (Q1) means "25% of participants scored below this value."

- **Custom percentiles** – enter comma-separated values (e.g. "10, 90" or "5, 25, 50, 75, 95") to compute any percentiles you need.

### Standard errors

The standard error estimates how much a statistic would vary if you repeated the study with a different sample from the same population. A smaller SE means the statistic is more precisely estimated.

> **Standard deviation vs. standard error:** SD describes the spread of individual values in your data. SE describes the precision of a computed statistic (like the mean). SD stays roughly the same as you collect more data; SE shrinks, because larger samples give more precise estimates.

- **SE of mean** – standard error of the arithmetic mean
- **SE of median** – bootstrap standard error of the median: the empirical SD of the median across resamples with replacement, using the resample count from your global [**Bootstrap replications**](./settings.md#bootstrap-replications) setting. No distributional assumption.
- **SE of trimmed mean** – Tukey–McLaughlin standard error: the winsorized spread at the *same* trim percentage, divided across the *h* observations the trim left in place. It is the SE that belongs to a trimmed mean – the plain SE of the mean is not valid for it, because trimming changes both the estimator and its sampling variance. Uses the **Trim percentage** box shared with the trimmed mean itself; reported as **N/A** when the trim leaves fewer than two observations (e.g. 50% on *n* = 4).
- **SE of proportion** – for binary variables only (exactly two distinct non-missing values), whether categorical or numeric (e.g. 0/1 dummies)
- **SE of skewness** – standard error of the sample skewness
- **SE of kurtosis** – standard error of the sample kurtosis

> **Method for skewness/kurtosis SE and CI:** a **SE/CI method** dropdown appears in the **Shape** section when any of the four corresponding stats are enabled. Choose **Analytical (normal-theory)** for closed-form SEs derived under the assumption of a normal underlying distribution, or **Bootstrap** for a distribution-free alternative that resamples the data – the CI uses the bias-corrected and accelerated (BCa) method (Efron 1987), which adjusts the percentile bounds for bias and skewness in the sampling distribution. Bootstrap uses the resample count from your global [**Bootstrap replications**](./settings.md#bootstrap-replications) setting; entering an integer in [**Bootstrap seed**](./settings.md#bootstrap-seed) (instead of leaving it empty) makes the resamples reproducible across runs. The method that was used appears in the column header itself – `SE (skewness, normal)` vs `SE (skewness, bootstrap)`, and likewise for the CI columns – so the source is unambiguous when the table is exported or shared. The header reads "bootstrap" rather than "BCa" because the fallback to the percentile interval (described below) leaves the column still labelled honestly.

> **When a bootstrap cell is flagged:** the SE and the CI are flagged independently, because they rest on different machinery and fail at different points. Hovering a flagged cell explains which case you hit; the point estimate in the **Skewness** / **Kurtosis** column stays valid either way.
>
> - The **SE** is just the standard deviation of the replicates, and settles by roughly 50 usable ones. It is flagged only when fewer than that survive – which needs a small or degenerate sample, since replicates that return an undefined value are dropped.
> - The **CI** reads its endpoints off replicate percentiles, and those need on the order of 1000 replicates to be stable. At the shipped default of 100 the 2.5th and 97.5th percentiles are individual replicates, so **the CI is flagged at the default setting** – the tooltip says so and points at [**Bootstrap replications**](./settings.md#bootstrap-replications). It is also flagged when the bias/acceleration corrections could not be estimated and the interval fell back to the plain percentile bootstrap. That fallback is automatic above *n* = 20 000 as well: the acceleration step costs *n* leave-one-out passes, so past that size the module takes the percentile interval immediately rather than stalling the run.

> **Where to find the "excess kurtosis" toggle:** the **Report as excess kurtosis** checkbox lives in the **Shape** section and appears whenever kurtosis itself or its SE/CI is selected – so you can request the CI alone and still control the excess-vs-raw form.

### Confidence intervals

A confidence interval gives a range of plausible values for a population parameter. The width depends on the [confidence level](./settings.md#confidence-level) set in your settings (default: 95%).

- **CI for mean** – Student's *t* critical value (df = *n* − 1)
- **CI for trimmed mean** – the Tukey–McLaughlin / Yuen interval: trimmed mean ± *t* · [SE of the trimmed mean](#standard-errors), at df = *h* − 1 where *h* is the number of untrimmed observations. The header repeats both the confidence level and the trim, as `Trimmed mean CI lower (95%, 10%)`, so the interval can't be read apart from the estimate it brackets. At 0% trim it collapses exactly onto the CI for the mean.
- **CI for median** – distribution-free, built from the sample order statistics. Selecting it reveals a **Median CI method** dropdown with two constructions:
	- **Exact (order statistics)** – inverts the Binomial(*n*, 0.5) sign test. Exact and deliberately conservative: actual coverage is at least the nominal level, usually a little above it. Reported as **N/A** when no pair of order statistics reaches the requested coverage at the available discrete levels (e.g. *n* = 5 at 95%).
	- **Interpolated (Hettmansperger-Sheather)** – interpolates between adjacent order statistics, which attains the nominal level much more closely instead of overshooting it. This is the variant the median notch in [box plots](./distribution-analysis.md#box-plot) draws, so choose it when you want the table and the plot to report the same interval.

	Hovering the column header tells you which of the two produced the numbers in it.
- **CI for proportion** – Wilson score interval. Better behaved than the textbook Wald interval, especially near 0 or 1. Binary variables only (exactly two distinct non-missing values).
- **CI for standard deviation** – **Bonett's (2006) kurtosis-adjusted interval**, not the classical chi-square pivot. Available only when **Use sample statistics (n-1)** is checked – both constructions are defined on the sample SD, so the checkbox is disabled and cleared when you switch to population statistics.
- **CI for variance** – the bounds of the SD interval, squared. Same construction and same sample-statistics requirement as **CI for standard deviation**.
- **CI for skewness** and **CI for kurtosis** – see method note above. The HL pseudomedian CI is reported together with the estimate itself in the Central tendency section.

> **Interpreting a 95% CI:** if you repeated the study many times, about 95% of the computed intervals would contain the true population value.

> **Why the SD interval won't match SPSS or Excel:** the textbook interval for a standard deviation inverts *(n−1)s²/σ² ~ χ²(n−1)*, which assumes the data is normal. That assumption is not a technicality here – the coverage of a chi-square interval is driven by the fourth moment of the data, so under even mild excess kurtosis a nominal 95% interval can deliver noticeably less, and unlike the *t* interval for the mean it does **not** get better as *n* grows. Bonett's interval replaces the normal-theory constant with the sample's own kurtosis, and holds its level far better on real data. The trade is comparability: a reader recomputing your interval in another package will get the chi-square one and a different pair of numbers. Hovering either CI column header shows this note in the app; state the construction when you report the interval. The columns are labelled `Std dev CI lower (95%, Bonett)` and so on for the same reason.

### Diversity

Information-theoretic and ecological measures of how spread-out values are across distinct levels. Computed for both categorical and numerical variables – in the numerical case, each distinct value is treated as its own level.

- **Shannon entropy (H)** – *H = −Σ pᵢ · ln(pᵢ)*, in nats. An absolute measure of diversity: H = 0 when everything is the same value, and H = ln *k* when *k* levels are perfectly evenly used. Scales with the number of levels, so it isn't directly comparable across variables with different *k*.

- **Pielou's evenness (J)** – *J = H / ln(k)*, where *k* is the number of distinct levels. Normalizes Shannon entropy to [0, 1] so it *is* comparable across variables: 1 = perfectly even, 0 = one level dominates everything. Undefined when there is only a single level.

- **Gini-Simpson (1 − D)** – probability that two random observations fall into *different* levels. Bounded in [0, 1]; higher values mean more diversity. The standard "diversity index" in ecology.

> **H vs. J:** they answer different questions. H tells you *how much diversity is here* in absolute terms (so 2 levels at 50/50 give H ≈ 0.69, but 100 levels near-uniform give H ≈ 4.6). J tells you, *given the levels present, how evenly they're used* – both of those examples give J ≈ 1. Report both when both are interesting; report only J when you want a cross-variable comparison.

> **For continuous numerical variables:** if most values are unique, H ≈ ln *n* and J ≈ 1 – mathematically correct but not very informative. The diversity measures are most useful for categorical variables or discrete numericals (Likert items, counts). The app flags the degenerate case for you: once more than 90% of a numeric variable's values are distinct, hovering its diversity cells shows a note saying the numbers only restate that.

### Sample vs. population statistics

The **Use sample statistics (n-1 denominator)** checkbox (on by default) controls exactly four statistics: variance, standard deviation, Winsorized SD, and coefficient of variation – n-1 when checked, n when unchecked. Skewness and kurtosis always use their bias-corrected sample forms (*G₁*, *G₂*) regardless of the toggle, and so does every standard error and confidence interval, because their sampling theory requires it. Unchecking the box therefore also disables and clears **CI for standard deviation** and **CI for variance**, which are only defined on the sample form.

- **Sample statistics (n-1)** – use this when your data is a sample from a larger population, which is almost always the case in research. The result labels show *s²* and *s*.
- **Population statistics (n)** – use this only when your data represents the entire population of interest. The result labels show *σ²* and *σ*.

> When in doubt, keep sample statistics (n-1) selected. Using n instead of n-1 on sample data underestimates the true variability.

## Categorical variables

Categorical variables get their own results table with a more limited set of statistics:

- Sample size, missing count, distinct values
- Mode (and its frequency)
- Diversity measures (Shannon H, Pielou's J, Gini-Simpson)
- Proportion, SE of proportion, and CI for proportion – only for binary variables (exactly two non-missing categories). Each can be selected independently; the **Category** column identifies which of the two levels the proportion refers to (the more frequent one).

Binary **numeric** variables (exactly two distinct values, e.g. 0/1 dummies) get the same proportion columns in the numeric table, using the same most-frequent-value rule for the reference category.

## Reporting checklist

Key things to include when writing up descriptive statistics:

**Method:**
- Which statistics were reported and why (e.g. median and IQR for skewed data instead of mean and SD)
- Whether sample (n-1) or population (n) statistics were used
- How missing data were handled
- The construction behind any confidence interval that has more than one: which **Median CI method** was used, and – for the SD and variance intervals – that they are Bonett's kurtosis-adjusted intervals rather than the chi-square ones

**Results:**
- Central tendency (mean or median, depending on distribution shape; HL pseudomedian for symmetric-but-non-normal data)
- Dispersion (SD, Winsorized SD, IQR, or range as appropriate)
- Sample size per variable, especially if it varies due to missing data
- Skewness and kurtosis if distribution shape is relevant to subsequent analyses (state which SE/CI method was used – analytical or bootstrap)
- Outlier counts when extreme values affect interpretation – note the rule used (1.5·IQR, 3·IQR, or modified Z with |M| > 3.5) and consider quoting the inlier range so readers know exactly which values were flagged
- Any variable dropped from the table because every case was missing under the active filter – the module names those variables in a note above the results

## Reproducibility

Most descriptive statistics are computed in the browser without R. The one exception is the **Hodges-Lehmann pseudomedian** and its confidence interval, which are computed via R's base `stats::wilcox.test(x, conf.int = TRUE, conf.level = ...)` – this matches the CI rule (exact signed-rank inversion for small *n*, normal approximation for large *n*) that R uses across its own ecosystem. The call passes an off-data `mu` (the sample minimum minus 1): `wilcox.test` silently discards values equal to `mu`, so the offset keeps zero values in the estimate. Replicating with a bare `wilcox.test(x, conf.int = TRUE)` will therefore differ whenever the data contains zeros – by design, since dropping them biases the pseudomedian. The call appears in the [R console](./r-console.md).

Every run lists the methods it actually used in the citation box under the results – the Hodges-Lehmann estimator, Tukey's fences, the modified Z rule, the winsorized SD, Shannon, Pielou and Gini-Simpson, the *G₁*/*G₂* estimators and their standard errors, the BCa and percentile bootstraps, the Tukey-McLaughlin trimmed-mean interval, the median interval (and the Hettmansperger-Sheather variant when you pick it), Bonett's SD interval, and the Wilson score interval. Only the ones behind the statistics you selected appear, so the list doubles as a record of what the numbers rest on. The `stats` package citation is added on top of that whenever the HL pseudomedian is selected, since that one call goes through R.

The bootstrap paths (BCa CIs for skewness/kurtosis and SE of the median) use `Math.random` when [**Bootstrap seed**](./settings.md#bootstrap-seed) is empty, so successive runs on the same data produce slightly different intervals. Enter any integer in that setting to get reproducible results. Each variable then draws from its own stream, derived from the seed and keyed on the variable's position in the selection – so a variable's interval no longer depends on which *other* variables or statistics were requested alongside it, and adding one to the end of the selection leaves every earlier variable's numbers bit-identical. Reordering the selection does move them, because the stream follows the position.

## Common pitfalls

**Reporting mean and SD for skewed data.** If a variable is heavily skewed, the mean is pulled toward the tail and the SD is inflated by extreme values. Report median and IQR instead – they describe the "typical" value and spread without being distorted by outliers.

**Ignoring missing data patterns.** A variable with 40% missing values tells a different story than one with 2% missing. Always check missing counts before interpreting the other statistics – high missingness can bias every summary measure.

**Using the coefficient of variation across variables with different scales of meaning.** CV is useful for comparing relative variability, but it is only meaningful for ratio-scale variables with a true zero. Comparing CVs of temperature in Celsius vs. reaction time in milliseconds is misleading because 0°C is not a true zero. The module guards against the most obvious misuse by reporting CV as **N/A** when any value is negative, but a non-negative scale alone doesn't make CV meaningful – interval scales (years, dates) still aren't ratio-scale.

**Treating distinct value count as a quality check and stopping there.** Spotting 5 distinct values in a binary variable is a good start, but the frequency table ([Distribution analysis](./distribution-analysis.md#frequency-tables)) shows you *which* values are unexpected – much more actionable than the count alone.

**Treating the mode as informative for continuous numeric variables.** Mode looks at exact-equality counts. For continuous measurements (heights, reaction times, sensor readings) two values almost never coincide, so the result is either "no mode" or a near-arbitrary tie – neither is useful. Use the median or HL pseudomedian as your "typical value" instead, and report the mode only for categorical or discrete numerical variables (Likert items, counts, ordinal codes).

**Treating SE or CI of proportion as off when they don't appear.** These stats are computed only for binary variables – exactly two distinct non-missing values, categorical or numeric. With one level the proportion is trivially 1; with three or more, a single proportion no longer summarises the variable – use the [frequency table](./distribution-analysis.md#frequency-tables) for the full per-category breakdown instead.

**Reading "No mode" as zero observations.** A **No mode** cell doesn't mean the variable is empty – it means every observed value is unique, so no value is more frequent than any other. For continuous numeric data this is the typical state; the mode is usually only informative for discrete or categorical variables.

## Notes

- Geometric mean and harmonic mean show **N/A** if any value is zero or negative
- Coefficient of variation is omitted when the mean is zero or any value is negative – hovering an empty CV cell shows the explanation
- Proportion, SE of proportion, and CI for proportion are blank for non-binary variables – hovering an empty cell shows why
- Skewness and kurtosis are reported as **N/A** when all values are identical (zero variance)
- Mode is reported as **No mode** when every value is unique (no value repeats)
- The CI for the median is computed from the sample order statistics under whichever **Median CI method** is selected; the exact variant reports **N/A** for small samples where no rank pair achieves the requested coverage (e.g. *n* = 5 at 95%) – hovering an empty cell shows the explanation
- The CI for proportion uses the Wilson score interval, which is naturally bounded in [0, 1] without artificial clamping
- A variable with no valid data left under the active [case filter](./getting-started.md#filtering-cases) is left out of the table rather than filling a row with blanks; a warning above the results names every variable dropped this way
- If none of the selected statistics apply to the selected variables (e.g. only proportion stats with non-binary variables), no results card is produced – a notification explains why
- Each run produces a new results card – you can generate multiple tables with different statistics selected and compare them side by side
