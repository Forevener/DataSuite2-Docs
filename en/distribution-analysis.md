---
title: Distribution analysis
description: Frequency tables, normality tests, histograms, box plots, Q-Q plots, violin plots, and ECDF plots in DataSuite 2.
---

# Distribution analysis

The **Distribution analysis** module helps you understand the shape and spread of your data. It has three sections: [frequency tables](#frequency-tables), [normality tests](#normality-tests), and [distribution plots](#distribution-plots).

## Frequency tables

Frequency tables count how often each value (or range of values) appears in a variable.

1. [Select your variables](./getting-started.md#choosing-variables)
2. Configure display options and sorting
3. Click **Calculate frequency tables**

One table is produced per variable.

### Display options

- **Count** — raw count for each value (on by default)
- **Percentage** — percentage of all rows, including missing values (on by default)
- **Valid percentage** — percentage calculated from non-missing values only
- **Total row** — adds a summary row at the bottom
- **Cumulative valid count** — running total of counts over valid (non-missing) observations
- **Cumulative valid percentage** — running total of *valid* percentages (reaches 100% at the last row)

> **Percentage vs. valid percentage:** if 10 out of 100 rows are missing and a value appears 30 times, its percentage is 30% (of 100), but its valid percentage is 33.3% (of 90). Valid percentage is more useful when you want to ignore the missing data. When you enable both columns and the variable has no missing values, the two are identical, so the plain *Percentage* column is dropped to avoid a redundant duplicate.

> **Why "cumulative valid"?** Cumulative count and cumulative percentage both run over non-missing observations, so the cumulative percentage column always ends at 100% regardless of how many missings there are. This matches SPSS behavior and keeps the cumulative columns interpretable when the (over-all-rows) *Percentage* column doesn't reach 100%.

> **Total row with missing values:** the cumulative columns accumulate over valid observations, so the Total row leaves *Valid percentage*, *Cumulative valid count*, and *Cumulative valid percentage* blank whenever any missings are present — they don't have a sensible subtotal at that row. The *Count* and *Percentage* columns still show the full N and 100%.

### Sorting

- Value (ascending) — default
- Value (descending)
- Count (highest first)
- Count (lowest first)

> **Cumulative columns follow the sort:** the cumulative columns only make sense in value order, so they're hidden whenever a count-based sort is active (a note explains why) — sort by value to bring them back.

> **Sort options when compressing into ranges:** count-based sorts are disabled when **Compress numerical values into ranges** is on. Sorting a compressed-range table by count would scramble the contiguous range axis and make the cumulative columns meaningless, so the table is always sorted by range (ascending by default; switch to descending via **Value (descending)**).

### Compressing numeric values into ranges

Numeric variables with many distinct values can produce unwieldy tables. Check **Compress numerical values into ranges** to group values into bins:

- **Maximum categories** (default 20) — if the number of unique values is below this threshold, values are shown individually; otherwise they are grouped
- **Number of bins** (default 10) — how many bins to create. Empty bins are kept in the output so the range axis stays contiguous. When **Equal-count** binning is selected on heavily-tied data, a few very frequent values can fill whole bins on their own, so the table shows fewer bins than requested and a small note appears below it ("requested *X* bins, but tied values collapsed boundaries — showing *Y* bins").
- **Binning mode** — *Equal-width* (default) places bin boundaries evenly across the value range; *Equal-count (quantile)* uses sample quantiles as boundaries so each bin holds roughly the same number of observations. Counts are only approximately equal — identical values can't be split across bins, so heavy ties leave some bins fuller than others

> **Equal-width vs. equal-count:** equal-width bins are easier to interpret ("how many observations fall between 10 and 20?") and match the histogram view. Equal-count bins are more useful for heavily skewed data — they give every bin meaningful weight instead of letting one or two bins dominate.

> **When to use compression:** a variable like "Age" with integer values 18–65 works fine without compression (48 rows). A variable like "Reaction time" with hundreds of decimal values needs binning to be readable.

Range labels in the resulting table use your global [number-precision settings](./settings.md#precision-settings).

### Missing values

Missing values appear in a separate highlighted row labeled "(Missing)" at the bottom of the table, so they're visible but don't mix with the actual data.

## Normality tests

Normality tests check whether a variable's values follow a normal (bell-shaped) distribution. This matters because many statistical tests (t-tests, ANOVA, Pearson correlation) assume normally distributed data.

> **What the test tells you:** the null hypothesis is "this data is normally distributed." A significant p-value (typically p < 0.05) is evidence *against* normality. A non-significant result is *not* evidence that the data is normal — it just means there isn't enough evidence to reject the assumption. DataSuite 2 phrases the interpretation as "evidence against normality" / "no evidence against normality" rather than "normal" / "not normal" for this reason.

1. Select one or more numeric variables
2. Check which tests to run
3. Click **Run normality tests**

### Available tests

| Test | Statistic | Minimum n | Best for |
|---|---|---|---|
| **Shapiro-Wilk** (default) | W | 3 (max 5000) | General purpose, widely recommended. Highest power in most situations. |
| **Shapiro-Francia** | W' | 5 (max 5000) | A simpler variant of Shapiro-Wilk that's the squared correlation between sample and theoretical quantiles — essentially the slope of the Q-Q line. Often preferred over Shapiro-Wilk for n > 50. |
| **Anderson-Darling** | A² | 8 | Sensitive to deviations in the tails. Good complement to Shapiro-Wilk. |
| **Kolmogorov-Smirnov (Lilliefors correction)** | D | 5 | A corrected version of the classic Kolmogorov-Smirnov test for cases where the mean and standard deviation are estimated from the sample (which is almost always the case). The plain KS test is omitted because it gives inflated p-values under estimated parameters. |
| **D'Agostino-Pearson** | K² | 8 | Tests skewness and kurtosis jointly. Reliable from about n ≥ 20 — see the recommendation note below. |
| **Jarque-Bera** | JB | 4 | Similar to D'Agostino-Pearson — tests skewness and kurtosis. Common in economics. Reliable from about n ≥ 20 — see the recommendation note below. |
| **Cramer-von Mises** | W² | 8 | An alternative to Anderson-Darling with slightly different sensitivity. |

> **Which test to pick?** Shapiro-Wilk is the best default — it has the highest statistical power in most situations. Shapiro-Francia is a strong alternative once n ≥ 50 and has the appealing property of being directly tied to the Q-Q plot (high W' = points close to the line). If you want a second opinion, add Anderson-Darling. If your sample is very large (n > 5000), consider D'Agostino-Pearson or Jarque-Bera, as Shapiro-Wilk can't even run at that size.

> **Overly sensitive?** With very large samples, normality tests will flag even trivial departures from normality that have no practical impact on your analysis. In such cases, [distribution plots](#distribution-plots) (especially Q-Q plots) give a better sense of whether the deviation actually matters.

> **D'Agostino-Pearson and Jarque-Bera at small n:** both tests rely on asymptotic χ²(2) distributions for skewness and kurtosis. They are only enforced down to the technical minimum (8 and 4 respectively), but their p-values become unreliable below roughly n = 20. Treat results in the 4–19 range as exploratory and prefer Shapiro-Wilk or Anderson-Darling at small n.

### Results

A single table with one row per variable. For each selected test, two columns appear: the test statistic and the p-value. Significance formatting follows your [settings](./settings.md#p-value-settings).

When the [interpretation column is enabled](./settings.md#significance-formatting), an extra **Interpretation** column appears:

- **Single test selected** — shows "Evidence against normality" or "No evidence against normality" based on the p-value vs. the significance level.
- **Multiple tests selected** — shows an agreement summary like "4/6 tests: evidence against normality" with a tri-state colored verdict: green when all valid tests fail to reject, red when all of them reject, and amber for any mix in between. Tests that failed to run (e.g. due to sample size) are reported separately and excluded from the count.

> **Why no majority vote?** The normality tests are all examining the same null hypothesis on the same data, so their outcomes are heavily correlated — "majority of 7 tests rejected" isn't statistically combinable in the way a true meta-analysis would be. The tri-state verdict surfaces disagreement honestly rather than papering over it with a vote.

If a variable doesn't meet a test's minimum sample size, that test's cell shows an "Insufficient data" message with the actual n and the required minimum. The test still runs for variables that do meet the minimum. Constant variables (every valid value identical) are flagged up front with a "Zero variance" message for every selected test — every supported test needs spread, so there is nothing to compute.

## Distribution plots

Visual inspection is often more informative than any single test statistic. Distribution plots let you see the shape of your data directly.

1. Select one or more numeric variables
2. Check which plot types to generate
3. Adjust per-plot options
4. Click **Create distribution plots**

By default, one output card per variable with all selected plot types stacked vertically. Every plot is annotated with the sample size (top-right corner; for multi-group plots in overlay mode, per-group counts are listed).

### Overlay variables on one plot

Check **Overlay variables on one plot** to compare multiple variables side-by-side instead of producing separate cards. In overlay mode:

- **Box plot, Violin plot, ECDF plot** — variables become groups within a single plot, color-coded by variable.
- **Q-Q plot** — supported when the reference distribution is *Normal* or *Lognormal*. Each variable is standardized (mean 0, sd 1; with a log transform first for Lognormal) so different scales sit on common axes, and the reference becomes the line *y = x*. The detrended toggle still works. Other reference distributions don't have an obvious standardization for overlay and are skipped — turn overlay off to render them per-variable.
- **Histogram** — always skipped in overlay mode (overlaying histograms doesn't read well visually); generate per-variable by turning overlay off.

Overlay mode requires at least two variables. With only one variable selected, plots are rendered the normal way regardless of the checkbox.

If you select **only** plot types that overlay mode skips (e.g. just Histogram, or only Q-Q with a non-normal reference), no result card is produced and a warning is shown — turn overlay off or pick a compatible plot type to proceed.

Variables with no valid numerical data are excluded from the overlay and listed in an info note above the plots. Box plots, violin plots, and the Q-Q overlay additionally drop variables with fewer than 2 valid observations (no spread to summarize) and zero-variance variables (a constant carries no distributional information). Each case appears in its own per-plot note below the chart ("Excluded (n < 2): …" and "Excluded zero-variance: …").

### Histogram

Shows the distribution as bars, where each bar represents a range of values (a "bin") and its height shows how many observations fall in that range.

Options:

- **Density curve** (on by default) — overlays a smooth curve (red) estimating the underlying distribution shape using a Gaussian-kernel density estimate with a robust Silverman bandwidth (the rule's `0.9·σ·n^(-1/5)` form applies directly to a Gaussian kernel). For dense integer data the bandwidth is given a small floor (≈¾ of the integer step) so the curve doesn't collapse into a spike at each integer
- **Normal curve** — overlays a theoretical normal distribution (green dashed) for comparison
- **Show rug** — adds short tick marks at each observation along the bottom of the chart, revealing the exact data points behind the bars
- **Show skewness and kurtosis** — annotates the plot with the bias-corrected sample skewness (G1, labelled *skew*) and excess kurtosis (G2, labelled *ex.kurt*) — the Fisher-Pearson estimators used by SPSS, SAS, and Excel's `SKEW`/`KURT`. A normal distribution has both ≈ 0. Requires n ≥ 4 (both estimators well-defined); the annotation is omitted otherwise.
- **Bin calculation method** — Auto (recommended), Sturges, Scott, or Freedman-Diaconis

> **Reading a histogram:** look for the overall shape. Is it roughly bell-shaped (normal)? Skewed to one side? Has multiple peaks (bimodal)? When the density curve and normal curve are both visible, comparing them shows how your actual data departs from normality. The right-side density axis matches the left-side count axis via the relationship *count = density × n × binWidth* — so the two scales are not arbitrary, they're calibrated to each other.

Hover over any bar to see the count and value. When the data is integer-valued with at most 50 distinct values, the histogram switches to a discrete layout — one bar per value rather than arbitrary bins. There are two variants, chosen automatically:

- **To-scale (dense integers)** — when the values span a small enough range and the gaps don't dominate, each integer gets a unit-width bar across the whole range, and integers with no observations show as zero-height gaps. The x-axis stays to scale, so the density and normal-curve overlays still work.
- **Evenly-spaced (sparse or gappy integers)** — when the values are spread too far apart (e.g. mostly 0–5 plus a far-away outlier) or most slots would be empty, each present value gets an equal-width bar spaced evenly and labelled with its value. The x-axis is no longer to scale, so the density and normal-curve overlays are hidden (with a note below the chart).

### Box plot

A compact summary of a variable's distribution showing five key values and any outliers.

Options:

- **Show outliers** (on by default) — displayed as diamond shapes
- **Show mean** (on by default) — shown as a hollow circle
- **Median notch** — adds a notch around the median spanning its confidence interval, computed distribution-free from the order statistics (Hettmansperger–Sheather interpolation) at your global [confidence level](./settings.md#confidence-level). The notch is asymmetric when the data are skewed, and is omitted for groups too small to support the interval at that level. If the notches of two box plots don't overlap, their medians are likely significantly different.
- **Data points** — displays individual observations alongside the box, giving you the full picture rather than just the summary

> **Reading a box plot:** the box spans the interquartile range (Q1 to Q3) — the middle 50% of your data. The thick line inside the box is the median. Whiskers extend to the most extreme non-outlier values (within 1.5 × IQR from the box edges). Points beyond the whiskers are outliers. If the median line isn't centered in the box, the data is skewed. Quartiles use the linear-interpolation method (type 7), matching the quartiles reported elsewhere in DataSuite 2.

Hover over a box to see a tooltip with all five-number summary values, the IQR, the mean (if enabled), and a list of outlier values (capped at 8 with a "+N more" suffix when there are too many to display).

### Q-Q plot

Plots your data's quantiles against theoretical quantiles of a chosen reference distribution. If the data follows the reference distribution, points fall along the diagonal reference line. For location-scale references (Normal, Lognormal-after-log, Student's t, Uniform) the line is fit through Q1 and Q3 of both axes (matching R's `qqline`) — robust under departures from the reference and the basis on which the confidence band is built. For the Exponential reference, which is scale-only with no location, the line goes through the origin with slope equal to the sample mean (the moment / MLE estimate of the scale). Requires at least 3 valid observations and some variation in the sample; below that, a "requires …" notice is shown in place of the plot.

Options:

- **Reference distribution** — *Normal* (default), *Student's t*, *Exponential*, *Uniform*, or *Lognormal*. The Q-Q plot is a general distribution-comparison tool, not just a normality check — switching the reference lets you test other distributional assumptions.
- **Degrees of freedom** (Student's t only) — controls the t-reference shape. Leave blank to use *max(2, n − 1)*; type a number ≥ 2 to override. The floor of 2 keeps the Student-t inverse-CDF and density well defined for very small samples; values below 2 are clamped to 2.
- **Confidence band** — shades a region around the reference line. Points inside the band are consistent with the reference; points outside are notable departures. The band uses the reference-line slope/intercept plus the pointwise standard error of the order statistics — SE ≈ |slope| / f(F⁻¹(p)) · √(p(1−p)/n) — and is drawn only across the range where observations exist (so it doesn't flare in the empty tails where the reference density goes to zero). Available for every reference distribution: closed-form densities are used for Normal, Lognormal (in log-sample space), Student's t, Exponential, and Uniform.
- **Detrended (residuals vs reference)** — subtracts the reference line from each point's y-coordinate, so the reference becomes a horizontal line at zero. Small deviations become much easier to see than in the standard "diagonal" view.

> **Reading a Q-Q plot:** points that hug the line indicate the reference distribution fits. Systematic deviations tell you how the data differs: an S-shaped curve suggests heavy or light tails, points curving away at one end indicate skewness, and a few stray points at the extremes are outliers. This is often more useful than a normality test for understanding *how* your data departs from normality, not just *whether* it does.

> **Why detrended?** On a regular Q-Q plot, points near the middle of the distribution are visually packed against the line and small wobbles are hard to spot. Detrending flattens the line to y = 0, so the y-axis becomes "how far each point is from the reference" — small departures stand out clearly. Both views are useful: standard for overall shape, detrended for fine detail.

> **Which reference distribution?** Use Normal for typical assumption checks. Switch to Student's t when you suspect heavy tails — leave the *Degrees of freedom* field empty to default to *max(2, n − 1)*, or enter a specific df to match the model you're checking against. Exponential is for waiting times and other right-skewed positive-only data — its support is [0, ∞), so the plot refuses to render when the sample contains negative values (a categorical mismatch with the reference). Lognormal is for multiplicative processes (incomes, particle sizes); the sample is log-transformed internally and plotted against a standard-normal reference, so the y-axis reads "Sample quantiles (log scale)" and the CI band is available. Non-positive observations are dropped automatically with an "Excluded N non-positive value(s)" annotation below the plot. Uniform tests whether your data is evenly spread.

### Violin plot

Combines a density estimate (the violin shape) with a miniature box plot inside. The wider the violin at a given value, the more observations are concentrated there.

Options:

- **Show inner box plot** (on by default) — displays the median (white dot), IQR (black rectangle), and whiskers inside the violin

> **When to prefer a violin over a box plot:** box plots can hide bimodal distributions — two distinct clusters will look like a single box with high spread. A violin plot reveals the two peaks clearly.

### ECDF plot

The empirical cumulative distribution function shows, for each value, what proportion of the data falls at or below it. It rises from 0% to 100% as a step function.

Options:

- **Show median reference line** (on by default) — a horizontal dashed line at 50%, plus a colored vertical drop-line at each group's median
- **Show rug** — short tick marks at each observation along the bottom, color-matched per group in overlay mode
- **Confidence band** — controls the shaded band around the step function:
	- *Wilson (pointwise)* — default. At each x, treats F̂(x) as a binomial proportion and draws the Wilson score interval. Narrows near 0 and 1, matching the intuition that the ECDF is more certain at the extremes.
	- *DKW (simultaneous)* — Dvoretzky–Kiefer–Wolfowitz bound. Constant vertical thickness, covers the *whole* curve at the chosen confidence level (not just each point individually). Wider than Wilson, but the only option with simultaneous coverage.
	- *None* — hides the band.

Hover anywhere on the plot to see a crosshair that reads out the ECDF value at the cursor position — for each group when in overlay mode.

> **Wilson vs. DKW:** these answer subtly different questions. Wilson gives a per-point interval — "I'm 95% confident the true F(x) at *this specific x* is inside the band." DKW gives a curve-wide interval — "I'm 95% confident the *entire* true ECDF lives inside the band." Wilson is what most users intuit, which is why it's the default; reach for DKW when you need to make claims about the whole distribution at once (e.g. comparing against a hypothesized CDF anywhere along the curve).

> **Reading an ECDF:** steep sections indicate value ranges where many observations are concentrated. Flat sections indicate gaps. The point where the curve crosses the 50% line is the median. Confidence bands narrow as sample size increases — a wide band means more uncertainty about the true distribution. ECDFs are especially useful for comparing distributions or spotting gaps and clusters that histograms might obscure depending on bin width.

### Resizing and exporting

Every plot has a drag handle in the bottom-right corner for resizing. To save plots, use bulk export from the results area — see [reading results](./getting-started.md#reading-results) for the available formats (SVG, PNG, JPG).

## Reporting checklist

Key things to include when writing up distribution analysis results:

**Method:**
- Which normality tests were used and why (e.g. Shapiro-Wilk for general use, Anderson-Darling for tail sensitivity)
- Sample size
- How missing data were handled

**Results:**
- Test statistic and p-value for each normality test
- A brief description of the distribution shape (symmetric, skewed, bimodal, etc.), ideally supported by a plot
- Whether the normality assumption holds for the planned downstream analysis (t-test, ANOVA, etc.)

## Reproducibility

Normality tests print the underlying R code to the [R console](./r-console.md) — you can inspect, copy, or re-run the exact commands. The module uses base R (`shapiro.test`) plus the `nortest` package (Anderson-Darling, Lilliefors, Cramér-von Mises, Shapiro-Francia), `moments` (Jarque-Bera and D'Agostino-Pearson), depending on which tests you select. Citations for R packages used appear automatically at the top of the output section. Frequency tables and distribution plots are computed in JavaScript and do not produce R code.

## Common pitfalls

**Relying on a single normality test.** No single test is best in all situations. Shapiro-Wilk has high power for general departures, Anderson-Darling is more sensitive to tail behavior, and Shapiro-Francia ties directly to the Q-Q line. When the decision matters, run two or three tests and inspect a Q-Q plot — the visual pattern often tells you more than any p-value. When multiple tests are selected, DataSuite 2 shows an agreement summary in the **Interpretation** column to help.

**Interpreting "no evidence against normality" as "the data is normal".** Failing to reject the null hypothesis is not the same as accepting it. A non-significant test could mean the data really is normal, or it could mean your sample is too small to detect the departure. The wording in the output is deliberately cautious for this reason.

**Over-interpreting normality test results with large samples.** With thousands of observations, normality tests will reject the null for tiny, practically irrelevant departures. A Q-Q plot that hugs the reference line with minor wobble at the tails is usually fine for parametric methods — the test p-value alone doesn't tell you whether the deviation matters.

**Choosing histogram bins carelessly.** The default "Auto" method works well in most cases, but forcing too few bins hides structure (a bimodal distribution looks unimodal) while too many bins create noisy spikes. If the shape looks suspicious, try a different bin method or check a violin plot for confirmation.

**Ignoring distribution shape before choosing an analysis.** Running a t-test or Pearson correlation without checking normality is a common shortcut. The few seconds it takes to generate a Q-Q plot or run Shapiro-Wilk can save you from reporting misleading results — or reassure you that parametric methods are appropriate.