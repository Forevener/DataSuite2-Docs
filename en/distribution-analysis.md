---
title: Distribution analysis
description: Frequency tables, seven normality tests and the distribution plots – histogram, box plot, Q-Q plot, violin, ECDF, bar and pie charts – in DataSuite 2.
---

# Distribution analysis

The **Distribution analysis** module shows the shape of each selected variable three ways, from three panels that each produce their own card: [frequency tables](#frequency-tables) count how often every value occurs, [normality tests](#normality-tests) test whether a numeric variable follows a normal distribution, and [distribution plots](#distribution-plots) draw the shape – a histogram, box plot, Q-Q plot, violin, ECDF, bar chart or pie chart per variable, or several variables on one plot.

## How to use

1. [Select your variables](./getting-started.md#choosing-variables) – any type for a frequency table or a pie chart, categorical for a bar chart, numeric for the normality tests and the other plots
2. Open **Distribution analysis** from the menu
3. Set the options of the panel you want – [frequency tables](#frequency-table-options), [normality tests](#test-configuration) or [plots](#plot-configuration)
4. Click that panel's button – **Calculate frequency tables**, **Run normality tests** or **Create distribution plots** – and read the card it adds

## Frequency tables

A frequency table lists every distinct value of a variable with the number of rows holding it, as a count and as a share; a numeric variable with many distinct values can be grouped into ranges first. One table per selected variable, headed by the variable's name, in one **Frequency tables** card per run. {#frequency-tables}

### Frequency table options

The six display options add or drop columns; every table of the run gets the same set.

- **Show count** – on by default: the number of rows holding the value, headed **Count**. {#show-count #count}
- **Show percentage** – on by default: the value's share of *all* rows, missing ones included, headed **Percentage**; a variable with no missing values drops this column whenever the valid percentage is shown, since the two would be identical. {#show-percentage #percentage}
- **Show valid percentage** – the value's share of the non-missing rows, headed **Valid percentage**; the share to report when the missing rows are to be ignored. {#show-valid-percentage #valid-percentage}
- **Show total row** – a **Total** row at the bottom with the number of rows, missing included, and 100%; its valid percentage reads 100% only when nothing is missing, and its cumulative cells stay blank, since a total is not a step of the running count. {#show-total-row #total}
- **Show cumulative valid count** – a running count down the table over the non-missing rows, headed **Cumulative valid count**; hidden, with a note under the table, while a count sort is active. {#show-cumulative-valid-count #cumulative-valid-count}
- **Show cumulative valid percentage** – the running count as a share of the non-missing rows, headed **Cumulative valid %**, reaching 100% at the last value whatever the number of missing rows; hidden under a count sort like the count. {#show-cumulative-valid-percentage #cumulative-valid}

> **Percentage or valid percentage?** With 10 of 100 rows missing, a value found 30 times is 30% of the rows and 33.3% of the valid ones – the first tells how much of the data the value covers, the second how the answers are distributed – see [missing](./concepts/outliers-missing-data.md#b-missing).

- **Sort by** – the order of the rows; the **(missing)** and **Total** rows stay at the bottom whatever is chosen.
	- **Value (ascending)** – the default: numbers from smallest to largest, categories alphabetically with numbers inside them read as numbers, so *item2* precedes *item10*.
	- **Value (descending)** – the same order reversed.
	- **Count (highest first)** – the most frequent value first, ties in value order; a table compressed into ranges keeps value order instead, with a note saying so, since ranges out of order would no longer read as an axis.
	- **Count (lowest first)** – the rarest value first, ties in value order; the same fallback on a compressed table.
- **Compress numerical values into ranges** – off by default: a numeric variable is tallied value by value, and when that gives more rows than **Maximum categories** allows a note under the table says how many distinct values it holds and points here. Ticked, a numeric variable with more distinct values than the maximum is cut into **Number of bins** ranges by the **Binning mode**, and the table lists one row per range, empty ranges included; a categorical variable is never compressed.
- **Maximum categories** – 5 to 100, 20 by default: a numeric variable with at most this many distinct values is listed value by value even under compression – a Likert item or a count stays readable as it is – and only a variable with more is binned.
- **Number of bins** – 4 to 20, 10 by default: how many ranges to cut; a bin no value falls into is kept, so the ranges stay contiguous. Under equal-count binning heavy ties can leave fewer bins than asked for, and a note under the table then gives both numbers.
- **Binning mode** – how the range boundaries are placed.
	- **Equal-width** – the default: boundaries evenly spaced between the smallest and the largest value, so every range covers the same width – the histogram's cut, and the easier one to read ("how many fall between 10 and 20?").
	- **Equal-count (quantile)** – boundaries at sample quantiles, so every range holds about the same number of rows; better for a skewed variable, where equal widths leave one range holding nearly everything and several holding nothing. Only about the same – a value is never split across two ranges, so ties make some ranges fuller than others.

### Reading a frequency table

Each table has one row per value or range and the columns the options above name; a variable with no valid value shows a note in place of a table. Missing rows are counted in a shaded **(missing)** row at the bottom, and a total row follows it when asked for.

- **Value** – the value, category or range of the row. A range reads `170..178`: the inclusive span of the values it holds, the next range starting at the next value (`179..187`) so no edge is repeated. When the data is finer than the [precision setting](./settings.md#precision-settings) can show – three-decimal values at two-decimal precision – a range reads `170.00..<180.00` instead, `..<` meaning "up to, but not including", and the last range closes on the largest value.
- **(missing)** – the row counting the empty cells, and in a numeric variable the cells no number could be read from; it carries a count and a percentage of all rows, and blanks in the valid and cumulative columns, which are computed without it.

Four notes can follow a table: that count-based sorting does not apply to a compressed table, that the cumulative columns are hidden under a count sort, that tied values collapsed the requested bins into fewer, and that an uncompressed numeric variable holds more distinct values than **Maximum categories** – each names the option that changes it. To see the same counts as a figure, run the variable through [distribution plots](#distribution-plots) with **Bar chart** or **Pie chart** ticked.

## Normality tests

A normality test asks whether a numeric variable's values could have come from a normal distribution – the null the test holds, so a small *p* is evidence *against* normality and a large one is no evidence for it – see [normality test](./concepts/distributions.md#b-normality-test). Seven tests are offered, any number of them at once, and the results land in one **Normality tests** table with a row per variable. {#normality-tests}

### Test configuration

- **Include sample size (N)** – on by default: a column headed **N** with the number of non-missing values each row's tests ran on – see [sample size](./concepts/distributions.md#b-sample-size).

### Available tests

Every test has a smallest sample it runs on, and two have a largest; a variable outside a test's range gets a message in that test's cell and the other tests still run.

| Test | Statistic | n | Best for |
|---|---|---|---|
| **Shapiro-Wilk** (default) | W | 3 to 5,000 | General use – the highest power in most situations |
| **Shapiro-Francia** | W′ | 5 to 5,000 | The same idea tied to the Q-Q line, often preferred above n = 50 |
| **Anderson-Darling** | A² | 8 and up | Departures in the tails; a good second opinion |
| **Kolmogorov-Smirnov (Lilliefors correction)** | D | 5 and up | The classic test corrected for estimated mean and SD |
| **D'Agostino-Pearson** | K² | 8 to 46,340 | Skewness and kurtosis jointly; runs where Shapiro-Wilk cannot |
| **Jarque-Bera** | JB | 4 and up | Skewness and kurtosis jointly, with no upper limit |
| **Cramér-von Mises** | W² | 8 and up | An alternative to Anderson-Darling, less weight on the tails |

- **Shapiro-Wilk test** – on by default: the statistic **W** measures how closely the sorted values follow what a normal sample of the same size would give, on a scale from 0 to 1 with 1 a perfect match – see [Shapiro–Wilk test](./concepts/distributions.md#b-shapiro-wilk-test). Runs on 3 to 5,000 values; above that, the test cannot run at all.
- **Shapiro-Francia test** – a simpler relative of Shapiro-Wilk: **W′** is the squared correlation between the sample and the theoretical normal quantiles – the tightness of the [Q-Q plot](#q-q-plot)'s points around their line – so a high W′ is a straight Q-Q plot. Runs on 5 to 5,000 values; often preferred over Shapiro-Wilk from about 50 upward.
- **Anderson-Darling test** – **A²** weights the gap between the sample's cumulative distribution and the normal one most heavily in the tails, so it catches heavy or light tails that a middle-weighted test misses. Runs on 8 values and up.
- **Kolmogorov-Smirnov test (Lilliefors correction)** – **D** is the largest vertical gap between the sample's cumulative distribution and a normal curve with the sample's own mean and SD; the Lilliefors correction gives it the right *p* for parameters estimated from the sample, which the classic Kolmogorov-Smirnov test does not. Runs on 5 values and up.
- **D'Agostino-Pearson test** – **K²** combines a skewness test and a kurtosis test into one χ² statistic on 2 degrees of freedom, so it asks only whether the shape numbers a normal distribution fixes at zero are zero. Runs on 8 to 46,340 values; treat a result below about 20 as exploratory.
- **Jarque-Bera test** – **JB** tests skewness and kurtosis jointly like D'Agostino-Pearson, with a simpler statistic and no upper size limit – common in economics, and the test left once a sample outgrows every other. Runs on 4 values and up; treat a result below about 20 as exploratory.
- **Cramér-von Mises test** – **W²** integrates the squared gap between the sample's cumulative distribution and the normal one across the whole range, with even weight – the Anderson-Darling idea without the emphasis on the tails. Runs on 8 values and up.

> **Which test?** Shapiro-Wilk by default; add Anderson-Darling for a second opinion on the tails, switch to Shapiro-Francia from about 50 values, and to D'Agostino-Pearson or Jarque-Bera once the sample passes 5,000 – see [Shapiro–Wilk test](./concepts/distributions.md#b-shapiro-wilk-test).

> **Large sample?** Past a few thousand values every normality test flags departures no analysis would feel; a [Q-Q plot](#q-q-plot) then says whether the departure matters – see [normality test](./concepts/distributions.md#b-normality-test).

### Reading the normality table

One table, one row per numeric variable; a categorical variable in the selection is left out and named in a note under the table. Each selected test contributes two columns under a spanning header that names it – its statistic, headed by the symbol from the table above, and its **p** – so seven tests read as seven labelled pairs rather than seven identical *p* columns. A *p* at or below the [assumption test significance level](./settings.md#assumption-test-significance-level), not the main one, is evidence against normality; the formatting follows the [p-value settings](./settings.md#p-value-settings).

- **Variable** – the variable's display name.
- **Interpretation** – shown when the [interpretation column](./settings.md#significance-formatting) is on. With one test, **Evidence against normality** or **No evidence against normality** by its *p*; with several, a tally such as *4/7 tests: mixed evidence* – green **no evidence against normality** when no test rejects, red **evidence against normality** when every computed test rejects, amber **mixed evidence** for anything between – with tests that could not run counted apart (*3/5 tests (2 not computed)*). Not a vote: the tests share one null on one sample, so a majority means nothing a single test does not.

A cell that holds no statistic says why: **Insufficient data** with the sample's *n* and the test's minimum, **Sample too large** with its maximum, **Zero variance** when every value is identical – no test needs to run on a constant – or the R error's own text. A variable's other tests are unaffected.

## Distribution plots

The plots draw a variable's shape directly – often more telling than any test statistic. One **Distribution plots** card per run holds every selected plot of every selected variable, stacked under the variable's name, or one plot per type with every variable on it when overlay is on; every plot carries its sample size in the top-right corner. {#distribution-plots}

### Plot configuration

Each plot type draws the variable types it can serve: the histogram, box plot, Q-Q plot, violin and ECDF need a numeric scale, the bar chart takes categorical variables, and the pie chart takes either. A mixed selection is not an error – every plot type is drawn for the variables it serves, and a note above the plots names the ones it passed over and why. A variable with no valid value is skipped; if nothing at all can be drawn a warning is shown and no card is produced.

- **Overlay variables on one plot** – with two or more variables selected, one box plot, violin, ECDF or Q-Q plot per type with every numeric variable on it as its own colour-coded group – to compare variables side by side rather than card by card. The histogram, bar chart and pie chart have no overlay form, since each shows one variable's whole distribution, and are skipped with a note; ticking only those with overlay on produces no card and a warning. With a single variable the plots are drawn the normal way. Variables with no valid numerical data are named in a note above the plots; a violin or a Q-Q overlay additionally drops a variable with fewer than 2 valid values or no spread, named in a note under that plot, while a box plot keeps it as a flat box and an ECDF as a single step.
- **Histogram** – on by default: the values cut into bins and a bar per bin as tall as its count – see [histogram](./concepts/distributions.md#b-histogram); its options are under [Histogram](#histogram).
- **Box plot** – on by default: the five-number summary as a box and whiskers, with the outliers as points – see [box plot](./concepts/distributions.md#b-box-plot); its options are under [Box plot](#box-plot).
- **Q-Q plot** – on by default: the sample's quantiles against those of a reference distribution, with a reference line and a confidence band – see [Q–Q plot](./concepts/distributions.md#b-q-q-plot); its options are under [Q-Q plot](#q-q-plot).
- **Violin plot** – the distribution's smoothed outline with a miniature box plot inside – see [violin plot](./concepts/distributions.md#b-violin-plot); its option is under [Violin plot](#violin-plot).
- **ECDF plot** – the share of values at or below each point, as a staircase from 0% to 100% – see [ECDF](./concepts/distributions.md#b-ecdf); its options are under [ECDF plot](#ecdf-plot).
- **Bar chart** – categorical variables only: one bar per category, tallest first – the [frequency table](#frequency-tables) as a figure; see [Bar chart](#bar-chart).
- **Pie chart** – each value's, category's or bin's share of the whole as a wedge: one slice per category, and a numeric variable cut the histogram's way, by the [Bin calculation method](#b-bin-calculation-method); see [Pie chart](#pie-chart).

### Histogram

Bars over equal-width bins, with the variable on the x-axis and the count on the y-axis; hovering a bar shows its count and range. Integer data with at most 50 distinct values – a Likert item, a count – is drawn with one bar per value instead of arbitrary bins while **Bin calculation method** is on **Auto**: to scale, with a zero-height gap at every integer no value takes, when the values span at most 50 and at least half the integers in the span occur; evenly spaced and labelled with the values otherwise – a range of 0 to 5 plus one far-off value – where the x-axis is no longer to scale and the curves below are left out with a note. Picking a rule by name applies it to the integer data instead, and a note under the chart points back to **Auto**.

- **Show density curve** – on by default: a smooth estimate of the distribution's shape drawn over the bars in red – a Gaussian kernel density with a bandwidth set from the sample's spread and size – see [histogram](./concepts/distributions.md#b-histogram). Adds a right-hand **Density** axis calibrated to the count axis, so the curve and the bars are read on one scale.
- **Show normal curve** – a normal distribution with the sample's mean and SD, drawn as a green dashed line on the same scale, so the eye can compare the data's shape with the bell – see [normal distribution](./concepts/distributions.md#b-normal-distribution).
- **Show rug** – a short tick at every observation along the bottom of the chart – inside the bars on a histogram, colour-matched per variable on an overlaid ECDF – revealing the individual values behind the bars or the steps.
- **Show skewness and kurtosis** – annotates the top-left corner with the sample's skewness and excess kurtosis (*skew*, *ex.kurt*), the bias-corrected estimators [descriptive statistics](./descriptive-statistics.md#shape) report, both near 0 for a normal shape – see [skewness](./concepts/distributions.md#b-skewness) and [kurtosis](./concepts/distributions.md#b-kurtosis). Left out below 4 values, or when every value is identical.
- **Bin calculation method** – the rule that sets how many bins a continuous variable is cut into; the [pie chart](#pie-chart) of a numeric variable uses the same rule.
	- **Auto** – the default: Freedman-Diaconis from 30 values upward and Sturges below, and one bar per value on few-valued integer data.
	- **Sturges** – log₂(n) + 1 bins, rounded up: few bins, a smooth picture, and the rule that stands in whenever another rule's bin width comes out zero.
	- **Scott** – a bin width of $3.5\,\text{SD} / n^{1/3}$: more bins than Sturges on a large sample, tuned to a normal shape.
	- **Freedman-Diaconis** – a bin width of $2\,\text{IQR} / n^{1/3}$: like Scott but built on the IQR, so an outlier does not widen every bin.

> **Reading a histogram?** One peak or more, symmetric or leaning, and are there values far from the rest – and where both curves are shown, how far the data's shape sits from the bell – see [histogram](./concepts/distributions.md#b-histogram).

### Box plot

A box from the first to the third quartile with a line at the median, whiskers to the furthest values within 1.5 IQR of the box, and a point for every value beyond them; the quartiles are the linear-interpolation ones (type 7) every table in DataSuite 2 reports, so the box matches [descriptive statistics](./descriptive-statistics.md#quantiles). Hovering a box shows its sample size, median, quartiles, whisker ends, minimum and maximum where they differ from the whiskers, IQR, mean and the outlier values – at most 8, then *+N more*. A variable with a single value or no spread is drawn as a flat box rather than dropped.

- **Show outliers** – on by default: the values beyond the whiskers as hollow diamonds on the centre line – see [Tukey's fences](./concepts/outliers-missing-data.md#b-tukeys-fences).
- **Show mean** – on by default: the mean as a hollow circle, so a gap between it and the median line shows the skew at a glance – see [when the mean and the median disagree](./concepts/distributions.md#when-the-mean-and-the-median-disagree).
- **Show notch** – narrows the box around the median to the median's confidence interval at the [confidence level](./settings.md#confidence-level) in Settings – the interpolated interval from the order statistics, asymmetric when the data is skewed. Two notches that do not overlap suggest the medians differ. The notch is left out, with a note, for a group too small to reach the level, and clamped to the box edges, with a note, when the interval is wider than the box. The same interval as a number is **CI for median** in [descriptive statistics](./descriptive-statistics.md#b-ci-for-median) with its **Median CI method** on **Interpolated (Hettmansperger-Sheather)**.
- **Show data points** – every observation as a jittered point beside the centre line, the outliers among them; with **Show outliers** on the outliers keep their diamond, so heavy tails stay readable and the outliers stay recognisable.

> **Reading a box plot?** The box is the middle half of the data, the line its median, the whiskers the ordinary range and the points the cases beyond it; an off-centre median or one long whisker is skew – see [box plot](./concepts/distributions.md#b-box-plot).

### Q-Q plot

The sample's sorted values against the quantiles a reference distribution would put at the same ranks, with a reference line: points along the line say the sample follows the reference, and the way they leave it says how it does not. The line is fitted through the first and third quartiles of both axes – R's `qqline` – except for the exponential reference, where it runs through the origin with the sample mean as its slope. Needs at least 3 valid values with some spread; below that a notice stands in for the plot. Hovering a point shows its theoretical and sample quantile.

- **Reference distribution** – the distribution the sample is compared with; the plot is a general comparison tool, not only a normality check.
	- **Normal** – the default: the reference for the normality assumption every parametric test makes – see [Q–Q plot](./concepts/distributions.md#b-q-q-plot).
	- **Student's t** – for a sample suspected of heavier tails than normal, at the **Degrees of freedom** below.
	- **Exponential** – for waiting times and other right-skewed, positive-only quantities. Its support starts at 0, so negative values are dropped one by one with a note under the plot saying how many, and zero is kept.
	- **Uniform** – for a sample that should be evenly spread over its range, such as p-values under a true null.
	- **Lognormal** – for multiplicative quantities such as incomes or particle sizes: the values are log-transformed and plotted against a normal reference, the y-axis reading *Sample quantiles (log scale)*, and zero or negative values are dropped with a note saying how many.
- **Degrees of freedom** – for the Student's t reference: empty uses max(2, n − 1), a typed value from 2 upward is used as given and a smaller one is raised to 2.
- **Show confidence band** – on by default: a shaded envelope around the reference line, at the [confidence level](./settings.md#confidence-level) in Settings, of how far the ordered values of a sample that truly follows the reference would scatter; points outside it are notable departures. Available for every reference, and drawn only across the range where the sample has values.
- **Detrended** – subtracts the reference line from every point, so the line becomes horizontal at zero and the y-axis reads the residual of each point from the reference; small wobbles that hide against a diagonal stand out, at the cost of the overall shape – use the plain view for shape and this one for detail. The band follows the line.

In overlay mode each variable is first standardized by its own reference line, so variables on different scales share the axes and the reference is the line *y = x* for every family; the band is drawn per variable around it, and detrending still applies.

> **Reading a Q-Q plot?** An S-shaped curve is a tail heavier or lighter than the reference, a bow at one end is skew, and a few stray points at the extremes are outliers – see [Q–Q plot](./concepts/distributions.md#b-q-q-plot).

### Violin plot

The distribution's outline as a mirrored density curve, wide where values are dense and narrow where they are sparse, drawn from the smallest to the largest value; every violin is scaled to the same width at its widest point, so shapes compare between variables but areas say nothing about sample size, which the corner annotation gives. Hovering a violin shows its sample size, quartiles, median, whisker ends and IQR. A variable with fewer than 2 values or no spread is left out with a note.

- **Show inner box plot** – on by default: a miniature box plot inside the violin – a white dot at the median, a dark bar from the first to the third quartile, and a line out to the whiskers.

> **Violin or box plot?** A box hides a second peak; a violin shows it – see [violin plot](./concepts/distributions.md#b-violin-plot).

### ECDF plot

The empirical cumulative distribution function: for every value on the x-axis, the share of the sample at or below it, climbing as a staircase from 0% to 100%. Hovering anywhere shows a crosshair reading the ECDF at the cursor's value – for every variable at once in overlay mode.

- **Show median reference line** – on by default: a dashed horizontal line at 50% and, in each variable's colour, a dashed drop-line from where its staircase crosses it down to the axis – the median.
- **Show rug** – a short tick at every observation along the bottom, colour-matched per variable in overlay mode – the same option as the histogram's [Show rug](#b-show-rug). {#ecdf-show-rug}
- **Confidence band** – the shaded band around the staircase, at the [confidence level](./settings.md#confidence-level) in Settings; the legend names the band drawn.
	- **Wilson (pointwise)** – the default: at each value, the Wilson interval for the share at or below it as a proportion, narrowing toward 0% and 100% – "the true share at *this* value is inside the band" – see [Wilson band](./concepts/confidence-intervals.md#b-wilson-band).
	- **DKW (simultaneous)** – the Dvoretzky–Kiefer–Wolfowitz band, of constant thickness, that holds the *whole* true curve at the stated level – wider, and the one to use for a claim about the distribution as a whole – see [DKW band](./concepts/confidence-intervals.md#b-dkw-band).
	- **None** – no band.

> **Reading an ECDF?** Steep stretches are where the values crowd, flat stretches are gaps, the 50% crossing is the median, and a wide band is a small sample – see [ECDF](./concepts/distributions.md#b-ecdf).

### Bar chart

One bar per category, tallest first with ties in alphabetical order, with the category names tilted once they crowd each other; hovering a bar shows its count and category. Past 25 categories the rare tail is folded into one **Other** bar, and a note under the chart says how many categories it stands for. Categorical variables only – a bar chart of a few integer values would be the histogram's one-bar-per-value layout bar for bar, so a numeric variable takes a histogram or a pie chart instead.

### Pie chart

Each slice's share of the whole, with its percentage inside every wedge wide enough to hold one and a legend naming every slice with its count; hovering a slice shows its label, count and share. A categorical variable gets one slice per category, largest first, folded into an **Other** slice past 10 with a note saying how many it covers; a numeric variable is cut the histogram's way, in value order – one slice per value on integer data with at most 50 distinct values under **Auto**, otherwise one slice per bin by the **Bin calculation method** – so a pie and a histogram of the same variable agree slice for bar, with the empty bins left out.

> **Pie or bar?** A pie answers "what share of the whole?" for a handful of categories; comparing categories with each other is easier on a bar chart, where lengths are compared instead of angles, and past a few categories the bar chart or the frequency table reads better than any pie.

### Resizing and exporting

Every plot has a drag handle in the bottom-right corner for resizing, plus its own SVG / PNG / JPG export buttons that appear beside it on hover. To save every plot on the page at once instead, use bulk export from the results area – see [resizing and exporting charts](./getting-started.md#resizing-and-exporting-charts).

## Reporting checklist

**Method:**
- Which normality tests were used and why (Shapiro-Wilk for general use, Anderson-Darling for the tails, Jarque-Bera for a sample above 5,000)
- The sample size each test ran on, and the significance level it was read against
- How missing data were handled, and whether a frequency table's shares are of all rows or of the valid ones

**Results:**
- The statistic and *p* of each normality test, and the verdict where several disagree
- A description of the shape – symmetric, skewed, bimodal, with outliers – supported by a plot
- Whether the normality assumption holds for the planned analysis, and what was done where it does not

## Reproducibility

The normality tests run in R and print their code to the [R console](./r-console.md), where it can be inspected, copied and re-run: base R's `shapiro.test`, the `nortest` package for Anderson-Darling, Lilliefors, Cramér-von Mises and Shapiro-Francia, and `moments` for Jarque-Bera and D'Agostino-Pearson – each loaded only when one of its tests is selected. The citation box above the card lists the software and the methods of what ran: every normality test its own source, every plot what it draws – the binning rule the histogram used, the kernel density behind a density curve or a violin, Tukey's fences and the median-interval notch of a box plot, the Q-Q plot, whichever ECDF band was picked, and the bar or pie chart. Frequency tables and the plots are computed in the browser and produce no R code. The [method notes](./methods/distribution-analysis.md) hold the reasoning behind these choices.

## Common pitfalls

**Relying on a single normality test.** No test is best in every situation: Shapiro-Wilk has high power for general departures, Anderson-Darling is more sensitive to the tails, and Shapiro-Francia ties directly to the Q-Q line. When the decision matters, run two or three and read a Q-Q plot – the pattern often says more than any *p*; with several tests selected the **Interpretation** column reports where they agree.

**Reading "no evidence against normality" as "the data is normal".** Failing to reject the null is not accepting it: the sample may be normal, or too small to show the departure. The output's wording is cautious for this reason.

**Over-reading a normality test on a large sample.** With thousands of values every test rejects for departures too small to matter. A Q-Q plot that hugs its line with a wobble at the tails is usually fine for a parametric method – the *p* alone does not say whether the departure matters.

**Choosing histogram bins carelessly.** **Auto** works in most cases, but too few bins hide structure – two peaks become one – and too many make noisy spikes. When the shape looks suspicious, try another rule, or a violin plot for confirmation.

**Ignoring the shape before choosing an analysis.** A *t*-test or a Pearson correlation run without a look at the distribution is a common shortcut; the seconds a Q-Q plot or a Shapiro-Wilk test takes can save a misleading result – or confirm that a parametric method is appropriate.
