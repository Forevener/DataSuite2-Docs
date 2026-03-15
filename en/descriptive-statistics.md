---
title: Descriptive statistics
description: Compute means, medians, standard deviations, confidence intervals, and other summary statistics for numeric and categorical variables in DataSuite 2.
---

# Descriptive statistics

The **Descriptive statistics** module computes summary statistics for your selected variables. Pick the statistics you need, click the button, and get a results table — one row per variable.

## How to use

1. [Select your variables](./getting-started.md#choosing-variables)
2. Open **Descriptive statistics** from the menu
3. Check the statistics you want (or apply a [preset](#presets))
4. Click **Generate descriptive statistics**

Results appear in up to two tables: one for numeric variables, one for categorical variables.

## Presets

Two presets configure the checkboxes for common use cases:

- **Parametric** — mean, standard deviation, minimum, maximum, sample statistics (n-1)
- **Nonparametric** — median, minimum, maximum, quartiles (25%, 75%), sample statistics (n-1)

Applying a preset clears all other checkboxes first.

## Available statistics

### Central tendency

Measures of where the "center" of your data lies.

- **Mean** — the arithmetic average. Most useful when data is roughly symmetric without extreme outliers.

- **Median** — the middle value when data is sorted. More robust than the mean when data is skewed or contains outliers.

> **Mean vs. median:** when these two are close, your data is roughly symmetric. When they diverge, something is pulling the mean away — usually outliers or skew. For example, if the mean salary is \$75,000 but the median is \$55,000, a few very high salaries are inflating the average. In such cases, the median better represents the "typical" value.

- **Mode** — the most frequently occurring value. Can be meaningful for any variable type, but especially for categorical data. A variable can have multiple modes if several values share the highest frequency.

- **Trimmed mean** — the mean after removing a percentage of extreme values from both ends. The trim percentage (5–25%, default 10%) controls how much is cut. A 10% trim removes the lowest 10% and the highest 10% of values before averaging. This gives a compromise between the mean (sensitive to outliers) and the median (ignores all but the middle value).

- **Geometric mean** — the nth root of the product of values. Appropriate for data that is multiplicative in nature, such as growth rates or ratios. Only computed when all values are positive.

- **Harmonic mean** — the reciprocal of the mean of reciprocals. Useful for averaging rates (e.g. speed, efficiency). Only computed when all values are positive.

### Dispersion

Measures of how spread out your data is.

- **Minimum** and **Maximum** — the smallest and largest values. Always worth checking — an unexpected minimum (like -999) or maximum (like 999) often signals a data entry error or a missing value code that wasn't handled.

- **Range** — the difference between maximum and minimum. Easy to understand, but highly sensitive to outliers — a single extreme value changes the range dramatically.

- **Variance** — the average squared deviation from the mean. Expressed in squared units of the original variable, so if you're measuring height in centimeters, variance is in cm². This makes it hard to interpret directly — standard deviation is usually more practical.

- **Standard deviation (SD)** — the square root of variance. Expressed in the same units as the original variable, making it the most commonly reported measure of spread.

> **Rule of thumb:** in a roughly normal distribution, about 68% of values fall within ±1 SD of the mean, and about 95% within ±2 SD.

- **Interquartile range (IQR)** — the difference between the 75th and 25th percentiles. Captures the spread of the middle 50% of the data — essentially the range of "typical" values, ignoring the extremes on both ends. Unlike SD, it is not affected by outliers — a single extreme value won't change the IQR.

> **Practical use:** if IQR is much smaller than the range, it means your data has a compact core with a few far-flung values. This is a quick way to gauge whether outliers are inflating your spread statistics.

- **Mean absolute deviation (MAD)** — the average absolute distance from the mean. Like IQR, it is less sensitive to outliers than SD, because it doesn't square the deviations (squaring amplifies the impact of extreme values). MAD is a good companion to the median when your data is skewed.

> **SD vs. MAD:** for normally distributed data they tell a similar story. But if your data has outliers or heavy tails, SD can be inflated while MAD stays stable. If your SD is noticeably larger than your MAD, that's a sign that a few extreme values are driving the spread.

- **Coefficient of variation (CV)** — the standard deviation divided by the mean, expressed as a percentage. Useful for comparing variability between variables measured on different scales — for example, comparing the variability of reaction times (measured in milliseconds) with the variability of accuracy scores (measured in percent). Not computed when the mean is zero.

### Shape

How the distribution of values looks beyond center and spread.

- **Skewness** — measures asymmetry. A value near 0 indicates a symmetric distribution. Positive skewness means a longer right tail; negative means a longer left tail.

> **Example:** income data is typically positively skewed — most people earn moderate amounts, with a long tail of high earners pulling the distribution to the right.

- **Kurtosis** — measures how heavy the tails are relative to a normal distribution. By default, reported as **excess kurtosis** (raw kurtosis minus 3), so a normal distribution has a value of 0. Positive values indicate heavier tails; negative values indicate lighter tails.

> **Heavy vs. light tails:** a distribution with heavy tails (positive kurtosis) produces more extreme values than you'd expect from a normal distribution — more outliers, more "surprising" data points. A distribution with light tails (negative kurtosis) is the opposite — values cluster closer together with fewer extremes. For example, exam scores that bunch in the middle with few very high or very low scores would have negative kurtosis.

### Counts

- **Sample size (N)** — the number of non-missing observations.

- **Distinct values** — how many unique values the variable has. Helpful for spotting coding errors or verifying categorical variables. For example, a "Dominant hand" variable with 5 distinct values when you expected 2 might indicate inconsistent coding ("Left", "left", "L", "RIGHT", "Right").

- **Missing value count** — how many observations have no value, shown as both a count and a percentage of the total.

- **Zero count** — how many observations equal zero, shown as both a count and a percentage.

### Quantiles

- **Quartiles (25%, 75%)** — the values below which 25% and 75% of the data falls. Together with the median (50th percentile), these define the "box" in a box plot. The 25th percentile (Q1) means "25% of participants scored below this value."

- **Custom percentiles** — enter comma-separated values (e.g. "10, 90" or "5, 25, 50, 75, 95") to compute any percentiles you need.

### Standard errors

The standard error estimates how much a statistic would vary if you repeated the study with a different sample from the same population. A smaller SE means the statistic is more precisely estimated.

> **Standard deviation vs. standard error:** SD describes the spread of individual values in your data. SE describes the precision of a computed statistic (like the mean). SD stays roughly the same as you collect more data; SE shrinks, because larger samples give more precise estimates.

- **SE of mean** — standard error of the arithmetic mean
- **SE of median** — standard error of the median
- **SE of proportion** — for binary categorical variables only (exactly two categories)

### Confidence intervals

A confidence interval gives a range of plausible values for a population parameter. The width depends on the [confidence level](./settings.md#confidence-level) set in your settings (default: 95%).

- **CI for mean**
- **CI for median**
- **CI for proportion** — binary categorical variables only
- **CI for standard deviation**
- **CI for variance**

> **Interpreting a 95% CI:** if you repeated the study many times, about 95% of the computed intervals would contain the true population value.

### Sample vs. population statistics

The **Use sample statistics (n-1 denominator)** checkbox (on by default) controls whether variance and standard deviation divide by n-1 (sample) or n (population).

- **Sample statistics (n-1)** — use this when your data is a sample from a larger population, which is almost always the case in research. The result labels show *s²* and *s*.
- **Population statistics (n)** — use this only when your data represents the entire population of interest. The result labels show *σ²* and *σ*.

> When in doubt, keep sample statistics (n-1) selected. Using n instead of n-1 on sample data underestimates the true variability.

## Categorical variables

Categorical variables get their own results table with a more limited set of statistics:

- Sample size, missing count, distinct values
- Mode (and its frequency)
- Proportion and SE of proportion — only for binary variables (exactly two non-missing categories)
- CI for proportion — same condition

## Reporting checklist

Key things to include when writing up descriptive statistics:

**Method:**
- Which statistics were reported and why (e.g. median and IQR for skewed data instead of mean and SD)
- Whether sample (n-1) or population (n) statistics were used
- How missing data were handled

**Results:**
- Central tendency (mean or median, depending on distribution shape)
- Dispersion (SD, IQR, or range as appropriate)
- Sample size per variable, especially if it varies due to missing data
- Skewness and kurtosis if distribution shape is relevant to subsequent analyses

## Common pitfalls

**Reporting mean and SD for skewed data.** If a variable is heavily skewed, the mean is pulled toward the tail and the SD is inflated by extreme values. Report median and IQR instead — they describe the "typical" value and spread without being distorted by outliers.

**Ignoring missing data patterns.** A variable with 40% missing values tells a different story than one with 2% missing. Always check missing counts before interpreting the other statistics — high missingness can bias every summary measure.

**Using the coefficient of variation across variables with different scales of meaning.** CV is useful for comparing relative variability, but it is only meaningful for ratio-scale variables with a true zero. Comparing CVs of temperature in Celsius vs. reaction time in milliseconds is misleading because 0°C is not a true zero.

**Treating distinct value count as a quality check and stopping there.** Spotting 5 distinct values in a binary variable is a good start, but the frequency table ([Distribution analysis](./distribution-analysis.md#frequency-tables)) shows you *which* values are unexpected — much more actionable than the count alone.

## Notes

- Geometric mean and harmonic mean are silently omitted if any value is zero or negative
- Coefficient of variation is omitted when the mean is zero
- Missing values are counted before data cleaning, so the count reflects the original dataset
- Each run produces a new results card — you can generate multiple tables with different statistics selected and compare them side by side
