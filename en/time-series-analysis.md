---
title: Time series analysis
description: Time series analysis in DataSuite 2 – exploration, decomposition, stationarity tests, smoothing, ARIMA / SARIMA, forecasting, and change-point detection.
---

# Time series analysis

The **Time series analysis** module turns a column of numbers ordered by time into something you can reason about: cycles you can name, trends you can quantify, models you can forecast from, and break-points you can date. It bundles five workflows – exploration, smoothing, ARIMA / SARIMA, forecasting, and spectral / change-point analysis – behind one set of variable pickers and a shared transform stack. {#time-series-analysis}

> **What makes a time series different?** Its observations are not independent – each value carries information about the ones before and after it, which is what every method here models and what ordinary tests silently assume away; see [autocorrelation](./concepts/assumptions.md#b-autocorrelation) and [a time series](./concepts/time-series.md#b-a-time-series).

1. Pick a [time variable](#b-time-variable) and one or more [series](#b-series)
2. Optionally add a [grouping variable](#b-grouping-variable) or override the [auto-detected frequency](#b-frequency-override)
3. Click **Check data** for the [pre-flight report](#pre-flight-check-data) – recommended before fitting anything
4. Choose an [analysis method](#analysis-methods), and toggle the [transform stack](#transform-stack) and the method's own options
5. Click **Calculate**

## Variable roles

The left column holds the variable pickers – the time variable, the series list and two optional accordions – and the right column the method setup, the transform stack and the method-specific options. The entries below follow the left column's order.

- **Time variable** – the column that orders the observations; required. Its scale is decided once from the column as a whole: a column with at least one value that only parses as a date – `2024-03-15`, `2024-03-15 14:30:00`, anything JavaScript's `Date.parse` reads – is a date column, otherwise it is a numeric index (`1, 2, 3, …` or any monotone numeric column). Every row is then read on that scale alone, so a bare `1997` inside an otherwise ISO-dated column is a parse failure, not a year, and a row whose value cannot be read is dropped and counted under [Dropped rows](#b-dropped-rows-unparseable-time); fewer than three parseable rows stop the run with a toast. The rows are sorted by time before any analysis runs, so the file need not be pre-sorted, and date-only values are anchored at local midnight, so plot axes and result tables name the same calendar day in every time zone. The line under the picker shows the [auto-detected frequency](#frequency-auto-detection) as soon as a column is chosen – or, when the column parses as neither numeric nor date, says so in place of a frequency.
	- **Select time variable** – the placeholder shown until a column is chosen; nothing runs before one is.
- **Series** – one or more numeric variables, chosen from the list; **Deselect all** and **Invert selection** edit the selection. Each series is analysed on its own and its results stacked in the card, and the plots are faceted by series unless the exploration card's stacking option overlays them. A non-numeric selection is refused at **Calculate** with a toast – recode it first in [data transformation](./data-transformation.md).
- **Grouping variable** – an optional categorical variable. When it is set, every method runs once per group – its own plots, tests, fit, forecast or break-point search – and the card wraps each group's output in a **Group: {name}** section. A row whose group value is blank is dropped along with the rows whose time cannot be read, and the counter widens to [Dropped rows (unparseable time or missing group)](#b-dropped-rows-unparseable-time-or-missing-group) so the two causes stay in one number. The time-axis diagnostics – spacing, gaps, duplicates – are measured inside each group, never across the pooled timeline, and one seasonal period is resolved for the whole run: when the groups' own spacings imply different periods, every result card opens with a warning naming the periods found and the one used, and splitting the analysis by cadence is the remedy when the groups are not comparable.
	- **None** – the default: every series is one column, analysed over all its rows. {#grouping-variable-none}
	- **Group: {name}** – the heading over one group's results, `{name}` the group's value in the grouping variable; every table, plot and note under it was computed on that group's rows alone.
- **Frequency override** – a seasonal period typed by hand, a whole number of observations per cycle (a decimal is rounded, anything below 1 is read as blank). Leave it blank to use the [auto-detected frequency](#frequency-auto-detection). What the number means – twelve for monthly data with a yearly cycle, seven for daily data with a weekly one – is the [seasonal period](./concepts/time-series.md#b-seasonal-period); every method that models a season reads it, and SARIMA's seasonal row, Holt-Winters, the seasonal naïve forecast and STL + ETS all switch off when it is 1. The pre-flight's [Detected seasonal period](#b-detected-seasonal-period) row offers a second opinion read off the series itself, with an **Apply** button that fills this field. {#frequency-override #seasonal-period}

### Frequency auto-detection

When the time variable is a date or datetime, the median spacing between consecutive observations chooses a default seasonal period. A spacing shorter than about seventeen hours is read as sub-daily and the cycle is the day itself, the period being the number of observations that fit in one; anything longer snaps to the nearest calendar cadence, judged on the ratio of the spacing to the cadence rather than on their difference, so 28- to 31-day months all read as monthly:

| Median spacing | Suggested frequency | Cycle |
|---|---|---|
| Sub-daily | observations per day (24 hourly, 3 for 8-hourly, …) | per day |
| Daily | 7 | per week |
| Weekly | 52 | per year |
| Monthly | 12 | per year |
| Quarterly | 4 | per year |
| Yearly | 1 | none assumed |
| Indeterminate | 1 | none assumed |

When the time variable is numeric, the default is 1 – no seasonality assumed – since a row index carries no cadence; set the override when your index has a natural cycle (`12` for a synthetic monthly index). With a grouping variable, the spacing is measured inside each group and the per-group medians are pooled, never read off the interleaved timeline. The active frequency is shown live under the time picker – the suggestion, or the override with the suggestion in brackets – and drives the panel as well: at 1 the seasonal `(P, D, Q)` row of the ARIMA card is disabled and zeroed, and the Holt-Winters option is available only for periods from 2 to 24.

## Pre-flight (Check data)

Click **Check data** before fitting anything: it runs the data-fitness diagnostic on the selected series and prints one **Time series data fitness** card – per group when a grouping variable is set, otherwise dataset-wide. It catches what breaks a fit – irregular spacing, heavy missingness, a seasonal period the data does not have, a series too short for one – before you spend time on the fit. It opens with a scope line naming the observations, series, frequency and groups the run saw and, when rows were dropped or the axis holds duplicate or gapped timestamps, with a warning that every row is nevertheless modelled as one equally spaced period. {#time-series-data-fitness}

**Time axis.** A key–value table of the axis the run stands on – dataset-wide the six rows below; with a grouping variable only the frequency and the dropped-row count, the rest moving to the per-group table.

- **Metric** – the row's name, in every key–value table of the module
- **Value** – the row's value; amber marks one worth a look – an irregular axis, a non-positive series, outliers found
- **Observations** – rows surviving the time parse and, per group, the group filter
- **Frequency used** – the seasonal period this run resolved, the override or the auto-detected one
- **Regular spacing** – *Yes* when the axis has neither duplicate timestamps nor gaps, *No* otherwise
- **Gap count** – spacings wider than 1.5 × the median spacing of the same group
- **Duplicate timestamps** – spacings of exactly zero, two rows at one time
- **Dropped rows (unparseable time)** – rows excluded before anything else because their time value could not be read on the column's scale
- **Dropped rows (unparseable time or missing group)** – the same counter when a grouping variable is set, now including the rows whose group value is blank

**Time axis (per group).** Shown instead of the dataset-wide rows when a grouping variable is set: one row per group with its **Observations**, **Regular spacing**, **Gap count** and **Duplicate timestamps**, each judged inside the group.

- **Group** – the group's value in the grouping variable

**Series: {name}.** One key–value table per series – per group and series when grouping is on – followed by a recommendation line.

- **Missing values** – the share and count of blank or non-numeric cells, `share% (missing/total)`
- **Suggested d (ndiffs)** – the number of regular differences `forecast::ndiffs` recommends to reach stationarity, 0 to 2 – see [differencing](./concepts/time-series.md#b-differencing); `–` below eight non-missing values
- **Suggested D (nsdiffs)** – the number of seasonal differences `forecast::nsdiffs` recommends, 0 or 1 – see [seasonal differencing](./concepts/time-series.md#b-seasonal-differencing); `–` when the frequency is 1 or the series holds fewer than two full cycles
- **Box-Cox λ (auto)** – the Guerrero estimate of the variance-stabilising power the [Box-Cox transformation](./concepts/time-series.md#b-box-cox-transformation) would use. When no λ can be estimated the cell says why: *Not computed – needs ≥ 10 non-missing values*, *Not applicable – series has non-positive values*, *Not estimated – needs more than two seasonal periods* or *Estimation failed*.
- **Detected seasonal period** – the period `forecast::findfrequency` reads off this series' own spectrum, independent of the configured frequency, 1 when it finds no cycle. When it differs from the active frequency and exceeds 1, a prompt under the table asks whether to model the series at it, and its **Apply** button writes the value into the [frequency override](#b-frequency-override).
- **Outliers detected** – how many points `forecast::tsoutliers` flags at the configured frequency – see [outlier in a time series](./concepts/time-series.md#b-outlier-in-a-time-series) for what counts as one
- **Outlier positions** – the timestamps of those points, the first twelve followed by *… and n more*, with the time of day when the cadence is sub-daily

A recommendation line follows each table: *Strong seasonal pattern – try SARIMA or Holt-Winters.* when a seasonal difference is suggested, *Non-stationary – try ARIMA with d ≥ 1.* when only a regular one is, *Stationary – try exponential smoothing or stationary ARMA.* when neither is, and *Not enough usable observations – no stationarity test could run.* when the series was too short to test. A series with fewer than 30 non-missing observations adds *Series is short (< 30 observations) – favour naive baselines and watch for overfitting.* – SARIMA and Holt-Winters on a short series are the classic over-parameterised trap. When any series has outliers, one prompt at the bottom of the card names the run-wide total, and its **Apply** button switches [Replace outliers](#b-replace-outliers) on for the next run – one prompt per card, since the transform stack is one switch for the whole analysis.

## Transform stack

Two optional pre-modelling transforms shared by smoothing, ARIMA, forecasting and spectral analysis – exploration, being descriptive, does not use them. They run in the order listed, outlier replacement first, on each series separately and inside each group, and the forecasting card's holdout and cross-validation refit them on every training slice. There is no differencing step here – ARIMA's `d` order lives on its own card.

- **Replace outliers** – `forecast::tsclean` flags the points that stand out from a robust trend-and-season fit and replaces them by interpolation, filling any missing values along the way; both counts appear in the card's transform-stack line, and the smoothing and ARIMA plots mark every replaced point with an **Outlier replaced** symbol on the observed-vs-fitted overlay, so you can see which observations the model saw differently from the raw line beneath. Useful when isolated spikes dominate a fit you do not want to drop rows from; when the replacement fails the series is left untouched and the line says so.
- **Box-Cox override** – fits the model on a power-transformed series and reports the curve, the forecasts and the accuracy measures back on the original scale; the information criteria, parameters and residual diagnostics stay on the transformed scale, and the card says so. Helps when the swings grow with the level – see [Box-Cox transformation](./concepts/time-series.md#b-box-cox-transformation). A series with fewer than 10 non-missing values or with a zero or negative value is not transformed, nor one whose λ cannot be estimated: the transform-stack line carries the reason rather than leaving the skip silent, and a series that goes through zero needs a shift in [data transformation](./data-transformation.md) first.
- **λ value** – the power to use, one value for every series and group of the run; blank picks λ by Guerrero's method for each series separately. `0` is the log, `0.5` the square root, `1` no transform – a typed λ gives you reproducible control.

**Transform stack summary.** Every fitted card ends with a *Transform stack:* line listing what actually applied – outliers replaced, missing values imputed (by the outlier cleaner, or by the interpolation the exponential-smoothing fits need), the λ used – and, on a warning line under it, what was requested and skipped, with the reason – including, on the forecast card, how many of the holdout and cross-validation training windows were too short for the automatic λ and were fitted untransformed. Nothing is printed when nothing applied and nothing was skipped. {#transform-stack-summary}

## Analysis methods

- **Analysis method** – the select that picks one of the five workflows below; the options card under it changes with the choice, and every method but exploration reads the [transform stack](#transform-stack) as well as the variable roles.
	- **Exploration** – plots, ACF / PACF, decomposition and stationarity tests: the descriptive pass, run first on a series you do not know – see [Exploration](#exploration) {#exploration #time-series-exploration}
	- **Smoothing** – a moving-average or exponential-smoothing curve over the observed values, with residual diagnostics for the model-based methods – see [Smoothing](#smoothing) {#smoothing #time-series-smoothing}
	- **ARIMA / SARIMA modelling** – one ARIMA or seasonal ARIMA fit per series, automatic or by hand, with its coefficients, information criteria, accuracy and residual checks – see [ARIMA and SARIMA modelling](#arima-and-sarima-modelling) {#arima-sarima-modelling #arima}
	- **Forecasting** – a horse-race of seven forecasters ranked by rolling-origin cross-validation or a holdout, with the point forecast and intervals of whichever you activate – see [Forecasting](#forecasting) {#forecasting}
	- **Spectral / change-points** – a tested periodogram and a Bai-Perron break search with dated confidence intervals – see [Spectral / change-points](#spectral-change-points) {#spectral-change-points #spectral}

| Method | What it produces | Required inputs |
|---|---|---|
| **Exploration** | Series plot, seasonal plot, ACF / PACF, decomposition, stationarity tests, detected seasonal periods | Time, ≥ 1 series |
| **Smoothing** | Moving-average or exponential-smoothing curve overlaid on the observed values, plus residual diagnostics | Time, ≥ 1 series |
| **ARIMA / SARIMA modelling** | Coefficient table, information criteria and accuracy, residual diagnostics | Time, ≥ 1 series |
| **Forecasting** | Horse-race across seven forecasters with rolling-origin cross-validation and holdout evaluation | Time, ≥ 1 series |
| **Spectral / change-points** | Tested periodogram peaks; Bai-Perron breakpoints with dated confidence intervals | Time, ≥ 1 series |

Pick **Exploration** first if you don't know your series – the ACF, the decomposition and the stationarity verdict together tell you which of the modelling methods to reach for next.

### Exploration

The descriptive view of one or more series: no model is fitted, the transform stack is not read, and every plot and test runs per group and series on the raw values. The card opens with a scope line naming the observations, series, frequency and groups it saw and, when the time axis was not a clean regular grid, with the warning that every row is nevertheless modelled as one equally spaced period.

- **Decomposition** – the select that picks how each series is split into trend, seasonal and remainder components; whichever runs draws four stacked panels – observed, trend, seasonal, remainder – on one time axis under a heading naming the method, with the remainder's anomaly points marked. Every decomposition needs a frequency above 1 and at least two full cycles of non-missing values; otherwise the card says which gate stopped it – see [decomposition](./concepts/time-series.md#b-decomposition).
	- **STL** – the default: a robust STL with a periodic seasonal window, so the seasonal shape is fixed across cycles and an outlying month does not bend the trend; the recommended choice for most series
	- **Classical additive** – `observed = trend + seasonal + remainder`, the trend a centred moving average and the season the average deviation at each position; assumes a seasonal swing of constant size
	- **Classical multiplicative** – `observed = trend × seasonal × remainder`, for a swing that grows with the level; needs a strictly positive series, and is skipped with a note otherwise
	- **Skip decomposition** – no panels, no strengths and no anomaly points; the ACF, the stationarity tests and the seasonal-period search still run
- **Stack on one axis** – overlays every selected series on one set of axes instead of drawing one facet per series; the facets share a time axis, the overlay shares a value axis too, so it suits series on one scale. Off by default.
- **Stationarity tests** – the group of three checkboxes below; any combination runs, and the results table holds one row per test with the null it held and the verdict it reached at its own level – see [stationarity](./concepts/time-series.md#b-stationarity) for what the tests are asking.
	- **Augmented Dickey-Fuller (ADF)** – on by default; the null is a unit root, tested against a stationary alternative with drift and trend, so rejecting says the series looks stationary
	- **KPSS** – on by default; the null is stationarity, level or trend, so rejecting says the series looks non-stationary – the opposite reading from ADF, which is why the pair is decisive where either alone is not
	- **KPSS null hypothesis** – the select under KPSS: which kind of stationarity its null asserts. Match it to ADF's drift-and-trend model – **Trend-stationary** – to read the two tests as a pair about the same alternative.
		- **Level-stationary** – the default: stationary around a constant mean
		- **Trend-stationary** – stationary around a deterministic straight-line trend, so a trending series with stable fluctuations does not reject
	- **Phillips-Perron** – off by default; the same unit-root null as ADF, with a non-parametric correction for serial correlation in place of ADF's lagged differences, and printed as *PP (Zτ)* in the table since the module runs the t-ratio form that sits on ADF's scale {#phillips-perron-pp #phillips-perron}

The card prints, per group and then per series:

- **Series plot** – the observed values over time, one facet per series unless [Stack on one axis](#b-stack-on-one-axis) is on; when a decomposition ran, the remainder's anomaly points are marked on the line. A point whose value was interpolated to let the decomposition run is never marked, since its remainder is an artefact of the fill.
- **Seasonal plot** – drawn whenever the frequency is above 1 and the series holds at least one full cycle: the series is cut into cycles of one seasonal period, the cycles are overlaid on one period axis and coloured from the earliest to the latest, and the per-position mean is drawn over them as the **Seasonal mean**. The legend names each cycle by the date it opens on – or *Cycle n* on a numeric index – and keeps only the first and last above twelve cycles. It is the fastest way to see whether the seasonal shape is stable, drifting or growing with the level – see [seasonal pattern](./concepts/time-series.md#b-seasonal-pattern).
- **ACF / PACF** – two panels: the sample autocorrelation and partial autocorrelation at every lag from 1 out to two seasonal periods or more, each bar reaching outside the dashed ±1.96/√n band highlighted. The autocorrelation is a [lagged correlation](./concepts/time-series.md#b-autocorrelation-at-a-lag), and the pair is read as [ACF and PACF](./concepts/time-series.md#b-autocorrelation-function-acf) explains – a slow decay says non-stationary, a spike at the seasonal lag says seasonal, and the cut-off pattern suggests ARIMA orders. Needs four non-missing values; a series with missing values is interpolated first and the card says so.
- **Decomposition strengths** – one line under the tests when a decomposition ran: the trend strength and the seasonal strength on a 0–1 scale, higher meaning a stronger component – see [trend strength and seasonal strength](./concepts/time-series.md#b-trend-strength-and-seasonal-strength). On a multiplicative decomposition the components are logged before the strengths are taken, so the numbers stay comparable with an additive run.
- **Anomaly summary** – one line counting the decomposition-residual anomaly points flagged on the series plot: points whose remainder lies more than three [MAD](./concepts/parametric-nonparametric.md#b-median-absolute-deviation) from the remainder's median. Printed only when there is at least one.
- **Stationarity tests** – one table per series, a row per selected test with its **Test**, **Null hypothesis**, **Lag**, **Statistic**, **p** and **Conclusion**; a note under it says which level each row was judged at, and the [joint reading](#b-joint-reading) closes the section. A stationarity row's p is read off a published critical-value table, so a statistic beyond the table's range prints as a bound – `< 0.01` or `> 0.10` – rather than an exact number, and KPSS's table only spans 0.01 to 0.10, so a bound there is routine. Needs eight non-missing values; when the table is empty the card says why – no test selected, fewer than eight values, or a failed estimation. {#stationarity-tests-name}
	- **Lag** – the number of lags the test used: ADF's lag order of the differenced terms, chosen from the series length, and the truncation lag of KPSS's and PP's long-run variance
	- **Conclusion** – *Stationary at α = …* or *Non-stationary at α = …*, the rejection read against the row's own null, or *Inconclusive* when no p-value could be computed. The α is never a fixed 0.05: ADF and PP read your [global significance level](./settings.md#significance-level), KPSS the [assumption test significance level](./settings.md#assumption-test-significance-level), since its null is stationarity – see [which level a table reads](./concepts/hypothesis-testing.md#b-which-level-a-table-reads).
- **Joint reading** – one line combining the unit-root verdict with KPSS, since only the pair is decisive: the unit-root test rejecting and KPSS not is a stationary series – around a deterministic trend when the KPSS null was trend-stationarity, so detrend rather than difference; KPSS rejecting and the unit-root test not is a unit root, so difference before modelling; both rejecting points at a deterministic trend, a structural break or changing variance; neither rejecting means the sample cannot separate the two. When ADF and PP disagree with each other, the line says no single verdict can be paired.
- **Raw Ljung-Box** – one line per series asking whether *any* serial dependence exists in the raw values, with Q, its lag and p. A significant result – at the [assumption test significance level](./settings.md#assumption-test-significance-level), since the null is no autocorrelation – means the series is worth modelling; a non-significant one says it is essentially [white noise](./concepts/time-series.md#b-white-noise). Needs eight non-missing values.
- **Detected seasonal periods** – one table per series listing every cycle the periodogram holds at your [global significance level](./settings.md#significance-level), found by a stepwise Fisher's g-test that is independent of the configured frequency, strongest first; a footnote says how many peaks were tested. When no period reaches significance the section is one line saying so, and a series shorter than eight values, or one whose periodogram could not be computed, gets a note instead. Use it to spot a second cycle the single frequency cannot represent – see [periodogram](./concepts/time-series.md#b-periodogram).
	- **Period (obs)** – the cycle length in observations, with the spectral resolution as `P ± d`, or `P (≥ L)` for the longest-period bin, whose lower bound L is finite and upper bound unbounded
	- **Cycles per obs** – the corresponding spectral frequency, `1 / period`
	- **Fisher's g** – the share of the periodogram concentrated at this peak, taken at the step the peak was tested – after every stronger peak found before it was flattened – which is what makes it a test statistic
	- **Share of variance** – the same peak's share of the untouched periodogram, as a percentage; it agrees with Fisher's g on the first row and falls below it on the rest
	- **p** – the peak's p-value, already family-wise adjusted across the whole periodogram, so the [global p-value adjustment](./settings.md#multiple-comparison-adjustment) is not applied on top of it {#detected-seasonal-periods-name-p}
	- **Note** – *Harmonic of {period} (×n)* for a row whose period divides a stronger row's period by an integer of two or more, within the spectral resolution, or `–` for a fundamental cycle; harmonic rows are muted. Use the fundamentals to choose a frequency override and the harmonics as confirmation that the fundamental is the right call – see [harmonic](./concepts/time-series.md#b-harmonic).

When the ACF / PACF, the stationarity tests and the seasonal-period search ran on an interpolated series – because the series had missing values – a note under the series heading says how many values were filled; those results lean toward smoothness and stationarity, so report the count alongside them. When the interpolation fails, the tests and the raw Ljung-Box are skipped and the note says so.

> **ADF vs KPSS – why run both?** They hold opposite nulls, so agreement is a strong verdict and disagreement says the answer depends on whether trend or unit root is the right description – see [unit-root test](./concepts/time-series.md#b-unit-root-test) and [KPSS test](./concepts/time-series.md#b-kpss-test).

> **Spectral concentration is not seasonal strength.** Fisher's g measures how peaked the periodogram is at one frequency, independently of the configured frequency; the seasonal strength on the decomposition line measures how much of the variation the configured season explains – a narrow spectral peak can sit beside a modest seasonal strength when the amplitude varies, and the reverse – see [trend strength and seasonal strength](./concepts/time-series.md#b-trend-strength-and-seasonal-strength).

### Smoothing

Fits a denoised curve to each series, overlays it on the observed values and, for the model-based methods, checks the residuals it leaves behind. The transform stack runs first, and a series with missing values is interpolated before an exponential-smoothing fit – the fill is counted on the transform-stack line – while a moving average leaves the gaps as gaps. The card opens with the same scope line and warnings as exploration's.

- **Method** – the select that picks the smoother; the controls under it change with the choice – see [moving average](./concepts/time-series.md#b-moving-average) and [exponential smoothing](./concepts/time-series.md#b-exponential-smoothing) for what each one assumes.
	- **Moving average** – the default: a symmetric centred mean over a window of *k* observations, a filter rather than a model, so no likelihood, no information criteria and no residual diagnostics exist for it and the card says so instead of leaving cells blank. Needs at least as many non-missing values as the window.
	- **Simple exponential smoothing (SES)** – level only, past values weighted geometrically: the one-step-ahead expectation for a series with no trend and no seasonality. Needs four non-missing values.
	- **Holt** – level and trend, no seasonality; for a trending series without a seasonal pattern. Needs five non-missing values.
	- **Holt-Winters** – level, trend and seasonality; for a series with both. Available only when the seasonal period is between 2 and 24 – outside that band the option is disabled with a note and the picker falls back to SES – and needs two full cycles of non-missing values.
- **Moving-average window** – the window size *k* for the moving average, at least 2; seeded from the active seasonal period – 12 on monthly data – and left alone once you type one. An even window is applied as the `2×m` weighted form, which keeps a seasonal average centred on an observation; the curve's legend and the section heading name the form used, `MA(12), centred 2×12`.
- **Seasonality** – shown for Holt-Winters: the form of the seasonal component.
	- **Additive** – the default: a seasonal swing of constant size
	- **Multiplicative** – a swing that grows with the level; needs a strictly positive series, and cannot be combined with a Box-Cox transformation, since the transform already does that job – the option is disabled while [Box-Cox override](#b-box-cox-override) is on, and either case is stated on the card rather than silently ignored
- **Damped trend** – shown for Holt and Holt-Winters: flattens the extrapolated trend instead of continuing it as a straight line; almost always the safer choice for anything but a short horizon. Off by default.
- **Diagnostics** – the three residual checks below, shown for the exponential-smoothing methods and shared with the [ARIMA card](#arima-and-sarima-modelling); each adds its output under the fit, after a residuals-over-time plot that any of them brings.
	- **Ljung-Box test on residuals** – on by default: one row asking whether the residuals still carry serial dependence – a significant p, at the [assumption test significance level](./settings.md#assumption-test-significance-level) since the null is white-noise residuals, means the model is missing structure. The lag is two seasonal periods on seasonal data and 10 otherwise, capped at a fifth of the residuals, and the degrees of freedom are reduced by the number of parameters the fit estimated; when the series is too short to test more lags than that, the test is skipped with a note.
	- **ACF of residuals** – on by default: the residual correlogram, with the band at your [confidence level](./settings.md#confidence-level); bars inside the band are white-noise residuals
	- **Residual normality (Q-Q + Shapiro)** – off by default: a Q-Q plot of the residuals and a Shapiro-Wilk row, judged at the [assumption test significance level](./settings.md#assumption-test-significance-level) as every normality test in the app is. Useful for the validity of prediction intervals, not for the point forecast. Above 5,000 residuals the test runs on a random draw of 5,000 and the card says so.

Each series gets one section:

**Smoothed: {name} ({method}).** The observed line with the smoothed curve overlaid, the curve's legend naming the method – *SES*, *Holt (damped)*, *Holt-Winters (additive)* – and an **Outlier replaced** marker on every point the transform stack changed; then the fit summary, the parameter table and the diagnostics. When the series is too short for the method, falls outside Holt-Winters' seasonal band, breaks the multiplicative rules or fails numerically, the section holds a notice saying which instead. {#smoothed-name-method}

- **Window** – for a moving average, the window used, as typed or as seeded
- **Smoothed points** – for a moving average, the number of observations the curve covers – the window loses half its width at each end of the series
- **Specification** – for the exponential-smoothing methods, the fitted state-space form, `ETS(error, trend, season)`, the trend carrying a `d` when damped: `ETS(A,N,N)` is SES, `ETS(A,Ad,N)` damped Holt, `ETS(M,A,M)` multiplicative Holt-Winters – see [exponential smoothing](./concepts/time-series.md#b-exponential-smoothing) {#smoothed-name-method-specification}
- **σ (residual scale)** – the residual standard deviation of the fit, on the Box-Cox scale when the transform applied
- **RMSE (training set)** – the in-sample root mean squared error of the fitted values – see [RMSE](./concepts/time-series.md#b-rmse); on the original scale even under Box-Cox, since the fitted values are back-transformed before scoring
- **MAE (training set)** – the in-sample mean absolute error – see [MAE](./concepts/time-series.md#b-mae)
- **MAPE (training set), %** – the in-sample mean absolute percentage error – see [MAPE](./concepts/time-series.md#b-mape)
- **Role** – in the parameter table, whether a row is a **Smoothing parameter** – α for the level, β for the trend, γ for the season, φ for the damping – or an **Initial state** – the level `l`, the trend `b` and the seasonal indices `s0` … from which the smoothing starts
- **Smoothing parameter** – a weight between 0 and 1: near 1 the component follows the latest observation, near 0 it barely moves. An α of 1 on SES is the naïve forecast.
- **Initial state** – the level, trend or seasonal index the fit estimated for the start of the series
- **Parameter** – the name R reports the estimate under
- **Residual autocorrelation test** – the Ljung-Box row's label, naming the lag and the degrees of freedom the test used; its **χ²** and **p** are judged at the assumption level
- **Normality test** – the Shapiro-Wilk row's label, with **W** and **p**; a line under it names the draw when the residuals were sampled

Every section ends with the [transform stack summary](#b-transform-stack-summary) and, when Box-Cox applied to an exponential-smoothing fit, a note that the information criteria, parameters and diagnostics are on the transformed scale while the curve and the accuracy row are back-transformed. A moving average under Box-Cox has no residual variance to correct the back-transform with, so its curve is on the median scale and a note under the plot says so.

> **When to pick which?** Moving average for visual smoothing of any series; SES when it has neither trend nor season; Holt when it trends; Holt-Winters when it has both – and on a short or noisy series fall back to SES or Holt and let the [forecasting horse-race](#forecasting) handle the season – see [exponential smoothing](./concepts/time-series.md#b-exponential-smoothing).

### ARIMA and SARIMA modelling

Fits an ARIMA(p, d, q) – or a seasonal ARIMA(p, d, q)(P, D, Q)[m] when the frequency is above 1 – to each series, after the transform stack, and reports the coefficients, the information criteria, the in-sample accuracy and the residual diagnostics – see [ARIMA model](./concepts/time-series.md#b-arima-model). Ten non-missing values are the minimum. Above a seasonal period of 24 the card opens with a warning: the automatic search tends to keep only a seasonal difference there, and a manual seasonal term often fails to converge, so an STL-based method is the usual alternative.

- **Specification** – the select between the automatic order search and orders you type.
	- **Auto** – the default: `forecast::auto.arima` searches the order grid, adding a constant or a drift term where it helps, and the model it settles on is named in the section heading
	- **Manual** – you set `(p, d, q)`, plus `(P, D, Q)` when the active frequency is above 1, and the card fits your model beside a grid of its [neighbouring orders](#b-neighbouring-orders-information-criteria); a blank or out-of-range order stops the run with a toast naming the order and its range
- **Selection criterion** – for the automatic search: **AICc** (the default), **AIC** or **BIC** – the criterion the candidate orders are ranked by; BIC penalises complexity harder and tends to return smaller models. The one that decided the fit is labelled in the summary table – see [AIC](./concepts/regression-basics.md#b-aic), [AICc](./concepts/regression-basics.md#b-aicc) and [BIC](./concepts/regression-basics.md#b-bic).
- **Exhaustive search** – off by default: scores every order in the space exactly instead of the greedy stepwise walk with an approximated criterion. It regularly finds a better model, and it is considerably slower on a long or high-frequency series.
- **p (AR order)** – manual mode: the number of autoregressive terms, 0 to 10
- **d (differencing)** – manual mode: how many times the series is differenced inside the fit, 0 to 3 – the pre-flight's [Suggested d](#b-suggested-d-ndiffs) is the starting point; see [differencing](./concepts/time-series.md#b-differencing)
- **q (MA order)** – manual mode: the number of moving-average terms, 0 to 10
- **Seasonal orders** – the seasonal row, disabled and zeroed with a note when the active frequency is 1, since a seasonal term has no meaning without a period
	- **P (seasonal AR)** – seasonal autoregressive terms, 0 to 5
	- **D (seasonal differencing)** – seasonal differences, 0 to 2 – the pre-flight's [Suggested D](#b-suggested-d-nsdiffs); see [seasonal differencing](./concepts/time-series.md#b-seasonal-differencing)
	- **Q (seasonal MA)** – seasonal moving-average terms, 0 to 5
- **Include constant / drift** – manual mode, on by default: fits a mean on an undifferenced series and a drift term on a differenced one, as the automatic search does; off, the model runs through the origin of the differenced scale, which is rarely wanted without a reason

The **Diagnostics** group is the smoothing card's, with the same defaults: [Ljung-Box test on residuals](#b-ljung-box-test-on-residuals), [ACF of residuals](#b-acf-of-residuals) and [Residual normality (Q-Q + Shapiro)](#b-residual-normality-q-q-shapiro), each preceded by the residuals-over-time plot, where a variance that grows with the level or a break in the residual mean shows most plainly. The Ljung-Box degrees of freedom are reduced by the number of coefficients the fit estimated, the constant or drift included.

Each series gets one section:

**ARIMA: {name} – {order}.** The heading names the fitted model – `ARIMA(0,1,1)(0,1,1)[12]`, the bracketed `[m]` the seasonal period – and its constant when one was fitted, *with drift* or *with non-zero mean*, so the term is visible before the coefficient rows; under it the summary table, the coefficient table, the neighbouring-orders grid in manual mode, the observed-vs-fitted plot with its **Outlier replaced** markers, and the diagnostics. When the series is too short or the fit fails, the section holds a notice, with R's own error message when there is one. {#arima-name-order #arima-name}

- **Specification** – the fitted order, as the heading spells it – see [reading a SARIMA specification](./concepts/time-series.md#b-seasonal-arima-sarima) {#arima-name-order-specification}
- **{ic} (selection criterion)** – in automatic mode, the row of the criterion that decided the fit, labelled so it reads as a decision beside the other two, which are reported for comparison; lower is better for all three, and only between models fitted to the same data on the same scale
- **σ² (residual variance)** – the innovation variance of the fit, on the Box-Cox scale when the transform applied; the [log-likelihood](./concepts/regression-basics.md#b-log-likelihood) beside it is what the information criteria are built from
- **MASE (training set)** – the in-sample mean absolute scaled error, the error relative to a seasonal naïve forecast on the same series – see [MASE](./concepts/time-series.md#b-mase); with the [RMSE](#b-rmse-training-set), [MAE](#b-mae-training-set) and [MAPE](#b-mape-training-set) rows, the only original-scale numbers on the card under a Box-Cox transform, since the fitted values are back-transformed before scoring
- **Term** – in the coefficient table, the coefficient's name: `ar1`, `ma1`, `sar1`, `sma1`, `drift`, `intercept`; each row carries its estimate, standard error, confidence interval at your [global confidence level](./settings.md#confidence-level), *z* and p-value
- **Neighbouring orders (information criteria)** – manual mode only: one row per order in a grid around the chosen one – each of *p*, *q*, *P* and *Q* varied one step either way, *d* and *D* held fixed since criteria across different differencing are not comparable – sorted by AICc with the fitted model in bold and a caption saying so. A large gap to the best row is the signal to switch to **Auto**.
- **Order** – a candidate's `ARIMA(p,d,q)(P,D,Q)[m]`, its **AIC**, **AICc** and **BIC** beside it

Every section ends with the [transform stack summary](#b-transform-stack-summary) and, when Box-Cox applied, the note that the information criteria and diagnostics are on the transformed scale while the curve and the accuracy rows are back-transformed.

> **Significant Ljung-Box on residuals is a bad fit.** Residuals that retain serial dependence say the model is missing structure – usually a seasonal term or a higher AR order; refit with **Auto** and [Exhaustive search](#b-exhaustive-search), or extend the manual specification – see [white noise](./concepts/time-series.md#b-white-noise).

### Forecasting

Runs a horse-race across seven forecasters on each series, ranks them by validation error, plots them together with the leader highlighted and lets you swap the active method with a click. The transform stack runs first and is refitted on every training slice the validations use – see [forecast accuracy](./concepts/time-series.md#b-forecast-accuracy) for how the race is scored.

- **Horizon** – the number of future periods to forecast, 12 by default and at least 1; it is also the length of every validation window
- **Evaluate on holdout** – on by default: splits off the last observations as a validation set, refits each method on the rest and scores it there. The holdout is the horizon, or a fifth of the non-missing observations when that is smaller; it needs at least 30 non-missing observations and a training slice of at least 10, and when the series is too short the card says so rather than dropping the block in silence – see [holdout evaluation](./concepts/time-series.md#b-holdout-evaluation).
- **Rolling-origin cross-validation** – on by default: refits every method at several origins and pools the errors across them. Origins sit a full horizon apart, so the evaluation windows are disjoint and no observation is scored twice – see [rolling-origin cross-validation](./concepts/time-series.md#b-rolling-origin-cross-validation).
- **Number of origins** – for the cross-validation, 5 by default, 2 to 20. Each origin costs a horizon of length: one needs the horizon plus 10 observations, two twice the horizon plus 10, and so on; when the series cannot support the number asked for, the achievable count is used and the card reports it as *{a} of {n} origins*.
- **Flag in-sample anomalies** – on by default: marks on the plot, for the active method, every observation whose in-sample residual lies more than three [MAD](./concepts/parametric-nonparametric.md#b-median-absolute-deviation) from the residuals' median, as **Residual outlier (active model)**. A point the transform stack replaced is judged against its raw value, so it stays eligible.

The methods raced, each a row of the ranking table:

| Method | Notes |
|---|---|
| **Naive** | Last observed value carried forward; the do-nothing baseline |
| **Drift** | Naive plus the straight line through the first and last observation |
| **Seasonal naïve** | Last value from the same season; needs frequency > 1 |
| **ETS** | Automatic exponential smoothing, picking the error / trend / season form by AICc |
| **Auto-ARIMA** | `auto.arima` over the same grid as the ARIMA card's automatic search |
| **Theta** | Decomposition into theta lines plus SES; competitive on the M3 and M4 competitions |
| **STL + ETS** | STL decomposition followed by ETS on the seasonally adjusted series; needs frequency > 1 and two full cycles |

- **Naive** – the last observed value carried forward; the baseline every other method has to beat – see [naïve forecasts](./concepts/time-series.md#b-naive-forecasts)
- **Drift** – the naive forecast plus the average change per period, the straight line through the first and last observation
- **Seasonal naïve** – the value from the same position one cycle earlier; needs a frequency above 1 and at least one full cycle, and reads **Not applicable** otherwise
- **ETS** – automatic exponential smoothing: `forecast::ets` picks the error, trend and seasonal form by AICc – see [exponential smoothing](./concepts/time-series.md#b-exponential-smoothing); fits an interpolated copy of a series with missing values
- **Auto-ARIMA** – `auto.arima` with the ARIMA card's default search – stepwise, AICc – see [ARIMA model](./concepts/time-series.md#b-arima-model)
- **Theta** – the theta method: a decomposition into theta lines forecast by SES and a drift; fits an interpolated copy of a series with missing values
- **STL + ETS** – an STL decomposition, ETS on the seasonally adjusted series and the seasonal component added back; needs a frequency above 1 and two full cycles

Each series gets one section:

**Forecast: {name}.** The observed values with every fitted method drawn in its own colour, the active method thickened, banded with its 95% prediction interval and carrying the residual-outlier markers, and a dashed line at the last observation; under it the validation line, the ranking table and the forecast values of the active method. Future timestamps step in calendar months on a monthly, quarterly or yearly cadence, clamped to each target month's length, so a forecast anchored on 31 January lands on 28 February; every other cadence extends by its constant spacing. When no method could be fitted, the section is one warning line. {#forecast-name}

- **Validation summary** – one line under the plot: the cross-validation's origins × horizon – or the reason it was skipped, naming the length the gate requires – and the holdout's size, or its reason; with neither, the methods are listed in their original order
- **Rank (CV RMSE)** – the ranking table's first column, its header naming the metric that decided the order: the cross-validation's RMSE when at least one origin scored, else the holdout's – **Rank (holdout RMSE)** – and a bare **Rank** with `–` in every row when no validation ran. Only rows the deciding metric scored are numbered; a method it never scored sorts after them, and one that could not be fitted sorts last. {#rank-cv-rmse #rank-holdout-rmse #rank}
- **Method** – the forecaster's name, with a **Use** button that makes it the active method – redrawing the plot's band and markers and rebuilding the forecast values – and **✓ Active** on the row that already is. A method the series never qualified for reads **Not applicable**, with the reason as a tooltip; one whose fit broke reads **Failed**. {#forecast-name-method}
- **Cross-validation** – the column group of the four accuracy metrics pooled across the origins that every fitted method reached; shown only when the cross-validation scored at least one origin
- **Holdout** – the same four metrics on the holdout window; shown only when the holdout ran. The two groups score different data, so they are never lined up as one column – see [holdout evaluation](./concepts/time-series.md#b-holdout-evaluation).
- **RMSE** – root mean squared error, on the series' own scale; the metric the ranking uses – see [RMSE](./concepts/time-series.md#b-rmse)
- **MAE** – mean absolute error, on the series' own scale – see [MAE](./concepts/time-series.md#b-mae)
- **MASE** – mean absolute scaled error, the error relative to a seasonal naïve forecast on the training slice: below 1 beats naïve, and it is comparable across series and groups – see [MASE](./concepts/time-series.md#b-mase)
- **MAPE** – mean absolute percentage error, undefined – a `–` – when any scored actual is zero or negative – see [MAPE](./concepts/time-series.md#b-mape)

**Forecast values: {method}.** The active method's forecast for each future period, rebuilt whenever you press **Use**: the point forecast and the bounds of its two prediction intervals – see [prediction interval](./concepts/regression-basics.md#b-prediction-interval). {#forecast-values-method}

- **Period** – the future timestamp, with the time of day when the cadence is sub-daily, or the next index values on a numeric axis
- **Forecast** – the point forecast, the mean of the forecast distribution; on the original scale, bias-corrected, when Box-Cox applied
- **80% interval** – its **Lower** and **Upper** bounds, the range the value is expected to fall in four times out of five
- **95% interval** – the wider pair, the band the plot draws

Every section ends with the [transform stack summary](#b-transform-stack-summary).

> **Naive isn't a strawman.** Beating naive – or seasonal naïve when the frequency is above 1 – on a stable series is harder than it sounds; a favourite that does not outperform the baseline by a useful margin is not earning its complexity – see [naïve forecasts](./concepts/time-series.md#b-naive-forecasts).

### Spectral / change-points

Frequency-domain and structural-break tools. Enable at least one of the two checkboxes – both off blocks the run with a toast. The transform stack runs first, missing values are interpolated and the fill is counted on the transform-stack line, and each series closes with a line stating how many observations were actually observed out of the total, at what frequency: the length gates below count real values, not the values the interpolation filled in.

- **Periodogram** – on by default: a tapered, detrended periodogram of each series on the true Fourier grid, plotted as the raw comb on a log scale with a modified-Daniell smoothed spectrum drawn over it – the smooth is there to read shape, and the bandwidth used is stated under the plot – and a table of the strongest peaks, each tested against a white-noise spectrum. Needs eight observed values and a non-constant series; skipped with the reason otherwise – see [periodogram](./concepts/time-series.md#b-periodogram).
- **Bai-Perron change-points** – off by default: `strucchange::breakpoints` places up to as many breaks as the minimum segment allows and picks their number by BIC, then draws the series with a dashed line at each break, a horizontal segment-mean line in every segment and a shaded 95% confidence band for each break date, and lists the breaks in a table. Needs twenty observed values and the `strucchange` package – when it cannot be loaded the periodogram still runs and the breakpoint section carries the warning – see [structural break](./concepts/time-series.md#b-structural-break).
- **Break model** – the select under the checkbox: what is allowed to change at a break.
	- **Mean shift (level only)** – the default: a constant within each segment, so a trending series reads as a staircase of level steps; use it when you expect a flat-between-jumps series
	- **Level + trend** – a straight line within each segment, so a break is a change of level or slope
- **Minimum segment size (%)** – 15 by default, 5 to 45: the share of the series every segment must span, which also caps how many breaks can be placed; the card reports the resulting length in observations, so a clamped value is visible.

The periodogram section prints, per series, the plot and a table of up to five peaks – local maxima ranked by power, a peak whose period exceeds half the record dropped, since one or two observed cycles are not evidence of a period, though the plot keeps the whole spectrum:

- **Period (observations)** – the cycle length, `1 / frequency`
- **Frequency (cycles/obs)** – the raw spectral frequency, cycles per observation whatever the configured frequency
- **Spectral power** – the raw periodogram ordinate at that frequency
- **Fisher's g** – the peak's share of the whole periodogram, tested against a white-noise spectrum; read against the exploration card's [Detected seasonal periods](#b-detected-seasonal-periods), the first rows agree and later rows differ, since that card flattens each stronger peak before testing the next {#periodogram-name-fishers-g}
- **p** – the peak's p-value under the white-noise null, family-wise across the periodogram; the columns are omitted, and the caption says so, when the test could not run {#periodogram-name-p}

**Breakpoints: {name}.** The plot, then either the table below or a line saying no breakpoint was detected and what was stable – the mean, or the level and slope – and a note naming the break model and the minimum segment in observations. {#breakpoints-name}

- **Observation** – the index of the last observation before the break, 1-based
- **Time** – the time value at that observation, with the time of day when the cadence is sub-daily {#breakpoints-name-time}
- **95% CI from** – the earliest time the break date is compatible with, clamped to the record; the shaded band on the plot
- **95% CI to** – the latest; the columns are omitted when no interval could be computed
- **Mean before** – the mean of the segment ending at the break, on the original scale even when Box-Cox applied
- **Mean after** – the mean of the segment that follows

> **Periodogram vs ACF.** Both reveal cyclical structure at different resolutions: the ACF at integer lags, the periodogram at every frequency up to half a cycle per observation – a clean peak at frequency 1/12 on monthly data is the spectral signature of the yearly cycle that also spikes the ACF at lags 12, 24, 36 – see [periodogram](./concepts/time-series.md#b-periodogram).

> **Change-points are shifts in the fitted relationship.** The mean level under the mean-shift model, the level or slope under level + trend – never a change in seasonality or variance; for those, run the search on the residual after removing trend and season – see [structural break](./concepts/time-series.md#b-structural-break).

## Imputation, missing data, and dropped rows

Every method here needs one regularly spaced numeric vector per series, so the module keeps rows rather than dropping them and fills a gap only where a card says so. Before anything runs, a row whose time value cannot be read on the column's scale is dropped, and so is a row whose group value is blank when a grouping variable is set; the count is the pre-flight's [Dropped rows (unparseable time)](#b-dropped-rows-unparseable-time) row – [Dropped rows (unparseable time or missing group)](#b-dropped-rows-unparseable-time-or-missing-group) with grouping – and every result card opens with a warning naming it when it is above zero. A blank or non-numeric cell in a series stays in place as a missing value: the row is kept, since removing it would move every later observation one period earlier, and the pre-flight's [Missing values](#b-missing-values) row counts the blanks per series.

What each card then does with the gaps: the pre-flight interpolates a copy of the series for its difference counts and its period search; exploration does the same for the ACF / PACF, the stationarity tests, the raw Ljung-Box, the decomposition and the seasonal-period search, says under the series heading how many values it filled, and draws the series plot with the gaps; smoothing interpolates before an exponential-smoothing fit and counts the fill on the [transform stack summary](#b-transform-stack-summary), while a moving average leaves a hole in its curve around the gap; ARIMA fits through the gaps; on the forecasting card Naive, Drift, Seasonal naïve and Auto-ARIMA fit through them, STL + ETS fills them inside its own decomposition, and ETS and Theta fit an interpolated copy – marked * in the ranking, with the fill counted on the transform stack summary – while their accuracy is still scored on the observed values alone; spectral / change-points interpolate, count the fill on the transform-stack line, and apply their length gates to the observed values alone. With [Replace outliers](#b-replace-outliers) on, every fitted card's series is filled along with its outliers before any method sees it, and the summary counts the two apart – see [imputation](./concepts/outliers-missing-data.md#b-imputation) for what a filled value costs.

The [global missing-data setting](./settings.md#missing-data) acts on the dataset before the module reads it, so it is not switched off here. Under the default pairwise deletion the blanks reach the cards as the missing values above; under listwise deletion a row blank on any variable selected in the Variables dialog is gone before the time axis is read, and the pre-flight shows the loss as gaps rather than as missing values, since a thinned series is no longer regularly spaced; under imputation the blanks arrive filled with the column's mean, median, mode or a constant, and no card can tell a filled value from an observed one – see [listwise deletion](./concepts/outliers-missing-data.md#b-listwise-deletion). The fills the cards make themselves follow the series' own trend and season, which a column-wide constant cannot, so pairwise deletion is the setting to run this module under.

## Reporting checklist

**Method:**
- Time variable, series, and grouping variable if any
- Frequency used, and whether it was auto-detected or overridden; note when groups disagreed on cadence
- Pre-flight summary: regularity, gaps / duplicates, missingness, and any outliers replaced
- Transforms applied (Box-Cox λ if used), and any that were requested but skipped
- Analysis method – **Exploration**, **Smoothing**, **ARIMA / SARIMA modelling**, **Forecasting** or **Spectral / change-points** – and its options:
	- Decomposition type, stationarity tests run, and the KPSS null used
	- Smoothing method, window or seasonality type, and whether the trend was damped
	- ARIMA: auto vs manual; the selection criterion and whether the search was exhaustive; if manual, the chosen `(p, d, q)(P, D, Q)[m]` and whether a constant was included
	- Forecasting: methods raced, holdout size, CV origins achieved, horizon
	- Spectral: periodogram and / or breakpoints, with the break model and minimum segment size
- Number of rows analysed, with the dropped-row count, and how missing values were handled – the fills each card reported, and the global missing-data setting the run was made under

**Results:**
- Stationarity verdict per test (statistic, p-value or bound, conclusion) and the joint reading
- Decomposition trend / seasonal strengths where reported
- Detected seasonal periods (period ± resolution, Fisher's g, p, and the number of peaks tested) – flagging the configured frequency, the strongest fundamental, and any harmonic structure
- For ARIMA: full specification including any constant, AIC / AICc / BIC, training-set accuracy, residual Ljung-Box result, and an explicit note on residual whiteness
- For smoothing: the fitted specification and parameters, and the residual diagnostics
- For forecasting: the winning method, the metric that decided the ranking, and its CV / holdout figures; report at least one baseline (naive or seasonal naïve) for context
- For periodogram: the dominant period(s), their power, and their Fisher's g p-values
- For breakpoints: the break dates with their confidence intervals, and the segment means

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. The module uses `forecast` for the difference counts and the period search, the ACF / PACF, the exponential-smoothing and ARIMA fits, the seven forecasters, the outlier scan and replacement, the Box-Cox transform and its λ, the accuracy measures and the interpolation of missing values; `tseries` for the ADF, KPSS and Phillips-Perron tests; base R's `stats` for the STL and classical decompositions, the periodogram, the Ljung-Box and Shapiro-Wilk tests; and `strucchange` for the Bai-Perron breakpoints and their confidence intervals, loaded only when the break search is on. The unit-root verdicts and the seasonal-period significance read your [global significance level](./settings.md#significance-level); KPSS, the Ljung-Box tests and the residual Shapiro-Wilk row, whose null is that the series or the residuals are fine, read the [assumption test significance level](./settings.md#assumption-test-significance-level); p-value formatting follows the [global p-value setting](./settings.md#display-format); the [confidence level](./settings.md#confidence-level) sets the ARIMA coefficient intervals and the band of the residual ACF, while the forecast prediction intervals are fixed at 80% and 95%. The one seeded step is the residual normality check: above 5,000 residuals the Shapiro-Wilk row is judged on a draw of 5,000 taken under [**Reproducibility seed**](./settings.md#reproducibility-seed), and the card names the draw – leave the seed empty for a fresh draw each run, or set an integer for a stable one; every other number the module prints is deterministic. Citations for the packages and methods that ran appear at the top of the output card and follow the run – a stationarity test you did not select, a diagnostic you switched off or a decomposition that did not run is not cited. The reasoning behind the module's thresholds, fallbacks and refusals is on its [method notes](./methods/time-series-analysis.md).

## Common pitfalls

**Misspecifying the frequency.** Frequency is observations per cycle, not a sampling rate – twelve for monthly data with a yearly cycle, seven for daily data with a weekly one. At 1 the seasonal naïve forecast, Holt-Winters, STL + ETS and the seasonal `(P, D, Q)` row of SARIMA all switch off, and above 24 Holt-Winters is unavailable and the ARIMA card warns. The auto-detected suggestion under the time picker covers the common cases, and the pre-flight's [Detected seasonal period](#b-detected-seasonal-period) row offers a second opinion read off the series itself – override only when you have a non-standard cycle.

**SARIMA / Holt-Winters on a short series.** With *n* < 30, the seasonal parameters absorb noise rather than signal. The pre-flight calls this out, but it's worth saying twice: prefer naive baselines, ETS without seasonality, or simple exponential smoothing on short series, and only escalate to seasonal models when you have at least two full cycles of data plus a buffer.

**Reading ADF or KPSS as if one test settled it.** Both have low power on near-unit-root series, and a non-rejection isn't proof of stationarity – it's failure to reject. Read the [Joint reading](#b-joint-reading) line rather than a single row, keep the KPSS null matched to the ADF model, and cross-check against the [suggested d](#b-suggested-d-ndiffs), the visual decay of the ACF, and substantive knowledge of the series.

**Forecasting without a baseline.** A model that doesn't beat Naive – or Seasonal naïve when the frequency is above 1 – isn't earning its complexity. The horse-race always races Naive, and Seasonal naïve whenever the frequency allows it: keep them in your reporting even when ETS or Auto-ARIMA wins, so the reader can see how much the better model bought you.

**Comparing forecast metrics across the wrong things.** RMSE and MAE are on the series' own scale, so a "better" number on a different series or group means nothing – use MASE for that. And never read a CV figure against a holdout figure: they're computed on different data, which is why the table keeps them in separate column groups and ranks on one of them only.

**Choosing the wrong break model.** The mean-shift model has no slope, so it explains any trend as a staircase of level steps and will happily report several breaks in a series that only trends. If the series trends, use [Level + trend](#b-level-trend) – and if the two models disagree about how many breaks exist, that disagreement is itself the finding.

**Reporting in-sample fit instead of out-of-sample error.** A low ARIMA AIC means the model fits the *training* data well; it doesn't tell you how the model will forecast. The forecasting card's holdout and rolling-origin CV column groups are the quantities to quote when the analysis is about prediction.
