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
- **Cumulative count** — running total of counts
- **Cumulative percentage** — running total of percentages

> **Percentage vs. valid percentage:** if 10 out of 100 rows are missing and a value appears 30 times, its percentage is 30% (of 100), but its valid percentage is 33.3% (of 90). Valid percentage is more useful when you want to ignore the missing data.

### Sorting

- Count (highest first) — default
- Count (lowest first)
- Value (A–Z)
- Value (Z–A)

### Compressing numeric values into ranges

Numeric variables with many distinct values can produce unwieldy tables. Check **Compress numerical values into ranges** to group values into bins:

- **Maximum categories** (default 20) — if the number of unique values is below this threshold, values are shown individually; otherwise they are grouped
- **Number of bins** (default 10) — how many equal-width bins to create

> **When to use compression:** a variable like "Age" with integer values 18–65 works fine without compression (48 rows). A variable like "Reaction time" with hundreds of decimal values needs binning to be readable.

### Missing values

Missing values appear in a separate highlighted row labeled "(Missing)" at the bottom of the table, so they're visible but don't mix with the actual data.

## Normality tests

Normality tests check whether a variable's values follow a normal (bell-shaped) distribution. This matters because many statistical tests (t-tests, ANOVA, Pearson correlation) assume normally distributed data.

> **What the test tells you:** the null hypothesis is "this data is normally distributed." A significant p-value (typically p < 0.05) means the data deviates significantly from normality. A non-significant result doesn't prove normality — it just means there isn't enough evidence to reject it.

1. Select one or more numeric variables
2. Check which tests to run
3. Click **Run normality tests**

### Available tests

| Test | Statistic | Best for |
|---|---|---|
| **Shapiro-Wilk** (default) | W | General purpose, widely recommended. Works well for small to moderate samples (n < 5000). |
| **Anderson-Darling** | A² | Sensitive to deviations in the tails. Good complement to Shapiro-Wilk. |
| **Lilliefors** | D* | A corrected version of Kolmogorov-Smirnov when population parameters are unknown (which is almost always). |
| **Kolmogorov-Smirnov** | D | Classic test, but less powerful than the alternatives. Mainly included for legacy compatibility. |
| **D'Agostino-Pearson** | K² | Tests skewness and kurtosis jointly. Requires n ≥ 20. |
| **Jarque-Bera** | JB | Similar to D'Agostino-Pearson — tests skewness and kurtosis. Common in economics. |
| **Cramer-von Mises** | W² | An alternative to Anderson-Darling with slightly different sensitivity. |

> **Which test to pick?** Shapiro-Wilk is the best default — it has the highest statistical power in most situations. If you want a second opinion, add Anderson-Darling. If your sample is very large (n > 5000), consider D'Agostino-Pearson or Jarque-Bera, as Shapiro-Wilk can become overly sensitive with large samples.

> **Overly sensitive?** With very large samples, normality tests will flag even trivial departures from normality that have no practical impact on your analysis. In such cases, [distribution plots](#distribution-plots) (especially Q-Q plots) give a better sense of whether the deviation actually matters.

### Results

A single table with one row per variable. For each selected test, two columns appear: the test statistic and the p-value. Significance formatting follows your [settings](./settings.md#p-value-settings).

If a variable has fewer than 5 valid observations, the results show "Insufficient data (n < 5)."

## Distribution plots

Visual inspection is often more informative than any single test statistic. Distribution plots let you see the shape of your data directly.

1. Select one or more numeric variables
2. Check which plot types to generate
3. Adjust per-plot options
4. Click **Create distribution plots**

One output card per variable, with all selected plot types stacked vertically.

### Histogram

Shows the distribution as bars, where each bar represents a range of values (a "bin") and its height shows how many observations fall in that range.

Options:

- **Density curve** (on by default) — overlays a smooth curve (red) estimating the underlying distribution shape
- **Normal curve** — overlays a theoretical normal distribution (green dashed) for comparison
- **Bin calculation method** — Auto (recommended), Sturges, Scott, or Freedman-Diaconis

> **Reading a histogram:** look for the overall shape. Is it roughly bell-shaped (normal)? Skewed to one side? Has multiple peaks (bimodal)? When the density curve and normal curve are both visible, comparing them shows how your actual data departs from normality.

Hover over any bar to see the count and value range. For discrete integer data with few unique values, bins automatically align to individual integers.

### Box plot

A compact summary of a variable's distribution showing five key values and any outliers.

Options:

- **Show outliers** (on by default) — displayed as diamond shapes
- **Show mean** (on by default) — shown as a hollow circle
- **Median notch** — adds a notch around the median. If the notches of two box plots don't overlap, their medians are likely significantly different.
- **Data points** — displays individual observations alongside the box, giving you the full picture rather than just the summary

> **Reading a box plot:** the box spans the interquartile range (Q1 to Q3) — the middle 50% of your data. The thick line inside the box is the median. Whiskers extend to the most extreme non-outlier values (within 1.5 × IQR from the box edges). Points beyond the whiskers are outliers. If the median line isn't centered in the box, the data is skewed.

### Q-Q plot

Plots your data's quantiles against theoretical normal quantiles. If the data is normally distributed, points fall along the diagonal reference line.

Options:

- **Confidence band** — shades a region around the reference line. Points inside the band are consistent with normality; points outside are notable departures.

> **Reading a Q-Q plot:** points that hug the dashed line indicate normality. Systematic deviations tell you how the data differs: an S-shaped curve suggests heavy or light tails, points curving away at one end indicate skewness, and a few stray points at the extremes are outliers. This is often more useful than a normality test for understanding *how* your data departs from normality, not just *whether* it does.

### Violin plot

Combines a density estimate (the violin shape) with a miniature box plot inside. The wider the violin at a given value, the more observations are concentrated there.

Options:

- **Show inner box plot** (on by default) — displays the median (white dot), IQR (black rectangle), and whiskers inside the violin

> **When to prefer a violin over a box plot:** box plots can hide bimodal distributions — two distinct clusters will look like a single box with high spread. A violin plot reveals the two peaks clearly.

### ECDF plot

The empirical cumulative distribution function shows, for each value, what proportion of the data falls at or below it. It rises from 0% to 100% as a step function.

Options:

- **Show median reference line** (on by default) — a horizontal dashed line at 50%

A shaded confidence band (Dvoretzky–Kiefer–Wolfowitz inequality) is always shown around the step function, indicating the region where the true population distribution likely falls.

> **Reading an ECDF:** steep sections indicate value ranges where many observations are concentrated. Flat sections indicate gaps. The point where the curve crosses the 50% line is the median. The confidence band narrows as sample size increases — a wide band means more uncertainty about the true distribution. ECDFs are especially useful for comparing distributions or spotting gaps and clusters that histograms might obscure depending on bin width.

### Resizing and exporting

Every plot has a drag handle in the bottom-right corner for resizing. Below each plot, three export buttons are available:

- **SVG** — vector format, ideal for publications and editing
- **PNG** — raster with transparent background
- **JPG** — raster with white background

You can also export all plots at once — see [reading results](./getting-started.md#reading-results) for bulk export.

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

Normality tests print the underlying R code to the [R console](./r-console.md) — you can inspect, copy, or re-run the exact commands. The module uses base R (`shapiro.test`, `ks.test`) plus the `nortest` package (Anderson-Darling, Lilliefors, Cramér-von Mises), `moments` (Jarque-Bera), and `Rita` (D'Agostino-Pearson), depending on which tests you select. Citations for R packages used appear automatically at the top of the output section. Frequency tables and distribution plots are computed in JavaScript and do not produce R code.

## Common pitfalls

**Relying on a single normality test.** No single test is best in all situations. Shapiro-Wilk has high power for general departures, but Anderson-Darling is more sensitive to tail behavior. When the decision matters, run two tests and inspect a Q-Q plot — the visual pattern often tells you more than the p-value.

**Over-interpreting normality test results with large samples.** With thousands of observations, normality tests will reject the null for tiny, practically irrelevant departures. A Q-Q plot that hugs the reference line with minor wobble at the tails is usually fine for parametric methods — the test p-value alone doesn't tell you whether the deviation matters.

**Choosing histogram bins carelessly.** The default "Auto" method works well in most cases, but forcing too few bins hides structure (a bimodal distribution looks unimodal) while too many bins create noisy spikes. If the shape looks suspicious, try a different bin method or check a violin plot for confirmation.

**Ignoring distribution shape before choosing an analysis.** Running a t-test or Pearson correlation without checking normality is a common shortcut. The few seconds it takes to generate a Q-Q plot or run Shapiro-Wilk can save you from reporting misleading results — or reassure you that parametric methods are appropriate.