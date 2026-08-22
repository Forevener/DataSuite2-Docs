---
title: Time series analysis
description: Time series analysis in DataSuite 2 – exploration, decomposition, stationarity tests, smoothing, ARIMA / SARIMA, forecasting, and change-point detection.
---

# Time series analysis

The **Time series analysis** module turns a column of numbers ordered by time into something you can reason about: cycles you can name, trends you can quantify, models you can forecast from, and break-points you can date. It bundles five workflows – exploration, smoothing, ARIMA / SARIMA, forecasting, and spectral / change-point analysis – behind a single variable picker and a shared transform stack.

> **What makes time series different?** Ordinary statistics treats observations as independent. In a time series, today's value depends on yesterday's, last week's, last year's – that dependence (autocorrelation) is the whole point. Methods that ignore it produce overconfident p-values, biased forecasts, and trends that look real but are just slow drift. Time series methods are the toolkit built to model that dependence directly.

1. Pick a [time variable](#time-variable) and one or more [series](#series)
2. Optionally add a [grouping variable](#grouping) or override the [auto-detected frequency](#frequency-override)
3. Click **Check data** for a [pre-flight diagnostic report](#pre-flight-check-data) – recommended before fitting anything
4. Choose an [analysis method](#analysis-methods) and toggle [transform-stack](#transform-stack) and method-specific options
5. Click **Calculate**

## Variable roles

The left column has the variable pickers; the right column has the method setup.

### Time variable

A required column that orders the observations. Three formats are accepted:

- **Date** strings (`2024-03-15`, `2024-03-15 14:30:00`)
- **Numeric index** (`1, 2, 3, …` or any monotone numeric column)
- **Datetime** parseable by JavaScript's `Date.parse`

The column's scale – date or numeric – is decided once from the column as a whole, and every row is then read on that scale only. A bare `1997` inside an otherwise ISO-dated column is a parse failure, not a year zero of the epoch. Rows whose time value can't be read are dropped and counted in the output under **Dropped rows (unparseable time)**. Rows are then sorted by time before any analysis runs, so the input doesn't have to be pre-sorted.

Date-only values (`2024-03-15`) are anchored at local midnight, so plot axes and result tables name the same calendar day regardless of your time zone.

After picking the time variable a frequency hint appears under the dropdown – see [frequency auto-detection](#frequency-auto-detection).

### Series

A multi-select list of one or more numeric variables. Each is analysed independently, but they're plotted together (faceted by default; toggle **Stack on one axis (overlay instead of facet)** to overlay).

Non-numeric variables are blocked at submission time with a toast – recode them first via [data transformation](./data-transformation.md).

### Grouping

Optional categorical variable. When set, every method runs **per group**: each group gets its own line plot, ACF, fit, forecast, or breakpoint analysis. The output is wrapped in **Group: {name}** sections so you can scan group boundaries at a glance.

Rows with a blank group value are dropped along with the unparseable ones, and the counter widens to **Dropped rows (unparseable time or missing group)** so the two causes stay in one number you can report.

> **Per-group time-axis stats:** when a grouping variable is set, the time-axis diagnostics (gaps, duplicates, regularity) are reported **per group** rather than across the pooled timeline. Two groups whose timestamps overlap would otherwise look like one series with massive duplicate counts and false gaps at every group transition.

### Frequency override

A manual seasonal period (positive integer) used by every method that cares about seasonality. Leave blank to use auto-detection.

> **What is "frequency" in time series?** It's the number of observations per natural cycle, *not* a sampling rate in Hz. Monthly data with a yearly cycle has frequency 12; quarterly data with a yearly cycle has frequency 4; daily data with a weekly cycle has frequency 7. SARIMA, Holt-Winters, STL decomposition, and the seasonal naïve forecast all use this number to decide what "one season" means.

#### Frequency auto-detection

When the time variable is a **date / datetime**, the median spacing between observations picks a default cycle. Spacing shorter than about seventeen hours is read as sub-daily and the cycle is the day itself; anything longer snaps to the nearest calendar cadence:

| Median spacing | Suggested frequency | Cycle |
|---|---|---|
| Sub-daily | observations per day (24 hourly, 3 for 8-hourly, …) | per-day |
| Daily | 7 | per-week |
| Weekly | 52 | per-year |
| Monthly | 12 | per-year |
| Quarterly | 4 | per-year |
| Yearly | 1 | none assumed |
| Indeterminate | 1 | none assumed |

When the time variable is **numeric**, the default is **1** (no seasonality assumed) – set the override if your numeric index has a natural cycle (e.g. `12` for a synthetic monthly index).

When a grouping variable is set, the spacing is measured **inside each group** and the per-group medians are pooled. The interleaved cross-group timeline carries the offsets *between* groups, not the cadence any one group was sampled at, so reading it directly would infer the wrong period whenever groups are staggered.

The active frequency is shown live under the dropdown; it also disables the seasonal `(P, D, Q)` row in ARIMA and the seasonal naïve / Holt-Winters / STL+ETS branches of the forecasting horse-race when it equals 1.

> **One frequency for every group.** The resolved period is global: all groups are modelled at the same seasonal period even when their cadences genuinely differ. When the per-group spacings imply different periods, every result card opens with a warning naming the periods found and the one actually used – split the analysis by cadence if the groups aren't comparable.

## Pre-flight (Check data)

Before fitting anything, click **Check data** to run the data-fitness diagnostic. It reports – per group when grouping is on, otherwise dataset-wide:

**Time axis:**
- **Observations** – rows surviving time-parse and (per-group) the group filter
- **Frequency used** – the active seasonal period
- **Regular spacing** – yes / no based on duplicate timestamps and gaps
- **Gap count** – count of inter-observation deltas wider than 1.5 × the median
- **Duplicate timestamps** – count of zero-width deltas
- **Dropped rows** – rows excluded at the start, labelled **(unparseable time)** or **(unparseable time or missing group)** depending on whether grouping is on

**Per series:**
- **Missing values** – count and percentage
- **Suggested d (ndiffs)** – number of regular differences `forecast::ndiffs` recommends to reach stationarity
- **Suggested D (nsdiffs)** – number of seasonal differences `forecast::nsdiffs` recommends (only when frequency > 1)
- **Box-Cox λ (auto)** – the Guerrero estimate of the variance-stabilising power transform. When no λ can be estimated, the cell says why instead of showing a dash: fewer than 10 non-missing values, non-positive values in the series, or an estimation failure.
- **Detected seasonal period** – the period `forecast::findfrequency` reads off this series' own spectrum, independent of the configured frequency. When it differs from the active frequency and exceeds 1, an **Apply** button sets the [frequency override](#frequency-override) to it.
- **Outliers detected** – count from `forecast::tsoutliers`
- **Outlier positions** – the timestamps of those outliers (first few, then *… and n more*), so you can look at the actual dates rather than a bare count

When any series has outliers, a single **Apply** row at the bottom of the card enables outlier replacement in the [transform stack](#transform-stack) for the next run, naming the run-wide total. The transform stack is one switch for the whole analysis, so the prompt is one per card rather than one per series.

A short recommendation follows each per-series block:

- **Strong seasonal pattern** – try SARIMA or Holt-Winters
- **Non-stationary** – try ARIMA with `d ≥ 1`
- **Stationary** – try exponential smoothing or stationary ARMA

Series with **fewer than 30 observations** also pick up a cautionary note about overfitting – SARIMA and Holt-Winters on short series are the classic over-parameterised trap.

> **Why "Check data" before fitting?** Most time-series failures come from data shape, not from picking the wrong model. A series with daily gaps fed to monthly seasonality will look stationary on every test and produce nonsense forecasts. The pre-flight surfaces those problems – irregular spacing, heavy missingness, near-constant variance with extreme outliers, length too short for seasonality – before you spend time on a fit that was always going to lie to you.

## Transform stack

A small stack of optional pre-modelling transforms shared by smoothing, ARIMA, forecasting, and spectral analysis. Exploration (which is descriptive) doesn't use it.

- **Replace outliers** – `forecast::tsclean` identifies points whose decomposition residual is extreme and replaces them by local interpolation. It also fills missing values along the way, which is reported separately. Useful when isolated spikes are dominating the fit but you don't want to drop the rows.
- **Box-Cox override** – applies a power transform stabilising the variance. With **λ value** blank, the Guerrero estimator picks λ automatically. Setting an explicit λ (e.g. `0` for log, `0.5` for square root, `1` for no transform) gives you reproducible control. Methods that already do an internal Box-Cox (`auto.arima`, ETS) honour the override.

The output card for every fitted method ends with a one-line **Transform stack** summary listing what actually applied – `2 outlier(s) replaced · 1 missing value(s) imputed · Box-Cox λ = 0.31`.

**A transform that couldn't be applied says so.** If Box-Cox is requested on a series with non-positive values, with fewer than 10 non-missing values, or where λ can't be estimated, the summary carries the skip reason rather than quietly leaving the series untransformed; the same holds when outlier replacement fails. On the plots, every replaced point is marked with an **Outlier replaced** symbol on the observed-vs-fitted overlay, so you can see exactly which observations the model saw differently from the raw line beneath it.

> **When does Box-Cox help?** When the variance grows with the level – a series whose swings are bigger when the level is higher. A log transform (λ = 0) is the workhorse; the Guerrero estimator picks something between log and identity based on the actual heteroscedasticity. Don't apply it to series that go through zero or take negative values – those need a shift first.

> **Manual differencing isn't here.** Pre-differencing a series before passing it to ETS, theta, or Holt-Winters is methodologically incorrect – those models fit the level directly and don't expect a stationary input. ARIMA's `d` order lives inside its own card for that reason. The transform stack only carries shape transforms that compose cleanly with every method.

## Analysis methods

| Method | What it produces | Required inputs |
|---|---|---|
| **Exploration** | Line plot, seasonal plot, ACF / PACF, decomposition, stationarity tests | Time, ≥ 1 series |
| **Smoothing** | Moving-average or exponential-smoothing curve overlaid on observed, plus residual diagnostics | Time, ≥ 1 series |
| **ARIMA / SARIMA modelling** | Coefficient table, IC and accuracy metrics, residual diagnostics | Time, ≥ 1 series |
| **Forecasting** | Horse-race across 7 forecasters with rolling-origin CV and holdout evaluation | Time, ≥ 1 series |
| **Spectral / change-points** | Tested periodogram peaks; Bai-Perron breakpoints with dated confidence intervals | Time, ≥ 1 series |

Pick **Exploration** first if you don't know your series – the ACF, decomposition, and stationarity verdict together tell you which of the modelling methods to reach for next.

### Exploration

Descriptive view of one or more series. Outputs (per group × series):

- **Series plot** – observed values over time, faceted by series unless **Stack on one axis** is on. Decomposition-residual anomaly points are marked when an STL is computed; positions that were interpolated to make the decomposition run are never flagged, since the "residual" there is an artefact of the interpolation.
- **Seasonal plot** – shown whenever frequency > 1. The series is cut into cycles of one seasonal period and the cycles are overlaid on a single period axis, coloured from the earliest cycle to the latest, with the per-position mean drawn over them. This is the fastest way to see whether the seasonal shape is stable, drifting, or growing with the level.
- **ACF / PACF** – sample autocorrelation and partial autocorrelation via `forecast::Acf` / `Pacf` on the series at its configured frequency, so the default lag range reaches the seasonal multiples that matter. Surfaces serial dependence and helps pick ARIMA orders.
- **Decomposition** – STL (recommended), classical additive, classical multiplicative, or skip:
  - **STL** – robust, handles non-constant seasonality, returns trend / seasonal / remainder components plus **trend strength** and **seasonal strength** on a 0–1 scale (Hyndman, 2008)
  - **Classical additive** – `observed = trend + seasonal + remainder`; assumes constant seasonal amplitude
  - **Classical multiplicative** – `observed = trend × seasonal × remainder`; requires strictly positive values
  - **Skip** – useful when you only want ACF and stationarity output
- **Stationarity tests** – any combination of:
  - **Augmented Dickey-Fuller (ADF)** – null = non-stationary (unit root, drift + trend model); rejecting means the series looks stationary
  - **KPSS** – null = stationary; rejecting means the series looks non-stationary. The **KPSS null hypothesis** selector chooses which flavour of stationarity is being tested – **Level-stationary** (stable mean) or **Trend-stationary** (stable around a deterministic trend).
  - **Phillips-Perron (PP)** – null = non-stationary; like ADF but with a non-parametric correction for serial correlation. Off by default.

  Each row names the null it tested and concludes **Stationary at α = …**, **Non-stationary at α = …**, or **Inconclusive**. The threshold is your [global significance level](./settings.md#significance-level), not a fixed 0.05.
- **Joint reading** – one note under the table combining the unit-root verdict with KPSS, since the two have opposite nulls and only the pair is decisive. It covers all four combinations (stationary, trend-stationary, unit root, and the both-reject case that points at a trend, a structural break, or changing variance), plus the uninformative-sample case and the case where ADF and PP disagree with each other and there is no single verdict to pair.
- **Raw Ljung-Box** – single-line summary asking whether *any* serial dependence exists in the series. A significant result means it's worth modelling; a non-significant one suggests the series is essentially white noise.
- **Decomposition strengths** – `Trend = max(0, 1 − Var(remainder) / Var(trend + remainder))`; same shape for **Seasonal**. Values close to 1 indicate a strong component. On a multiplicative decomposition the components are logged first, because the additive formula applied to multiplicative parts returns a number pinned at 1 regardless of the data.
- **Detected seasonal periods** – independent of the configured frequency, the periodogram is searched for all significant cycles via a stepwise [Fisher's g-test](#fishers-g-test). The output is a small table per series, one row per significant period, with columns:
  - **Period (obs)** – the cycle length in observation units, plus the Fourier-bin resolution as `P ± d` (or `≥ P` for the longest-period bin whose upper bound is unbounded)
  - **Cycles per obs** – the corresponding spectral frequency
  - **Fisher's g** – the test statistic; equivalently the share of total spectral variance concentrated at this peak
  - **Share of variance** – the same quantity expressed as a percentage
  - **p** – the peak's p-value, already family-wise adjusted (see below)
  - **Note** – `Harmonic of {P} (×n)` for rows whose period divides a stronger row's period by an integer ≥ 2, or `–` for fundamental cycles. Harmonic rows are visually muted.

  A footnote records how many peaks were tested. When no period reaches significance, a single line confirms that – *No additional significant seasonal periods detected for {name} at α = 0.05* – so the empty case is distinguishable from a skipped section.
- **Anomaly summary** – count of decomposition-residual outliers flagged in the plot.

> **ACF and PACF, briefly.** The ACF at lag *k* is the correlation between the series and itself shifted by *k* steps. A slow decay points to a non-stationary series; a single big spike at lag 12 (with frequency 12) points to seasonality; a sharp cut-off at lag *q* with PACF tailing off → MA(q); the mirror – PACF cuts off at *p*, ACF tails off → AR(p). They're rough guides, not contracts.

> **ADF vs KPSS – why run both?** They have opposite nulls. ADF rejects when the series looks stationary; KPSS rejects when it looks non-stationary. Agreement is a strong verdict; disagreement tells you the answer depends on whether trend or unit root is the right description. The **Joint reading** note works the pair out for you and names the practical consequence – difference it, detrend it, or collect more data. Match the KPSS null to the ADF model (which always includes drift and trend) with the **KPSS null hypothesis** selector, or the two tests aren't asking about the same alternative.

> **Bounded p-values.** `tseries` computes ADF, KPSS, and PP p-values by interpolating a published critical-value table, so a statistic outside the table's range can only be reported as a bound. Those cells render as `< 0.01` or `> 0.10` rather than as an exact number. KPSS's table spans only `[0.01, 0.10]`, so hitting a bound there is routine, not a sign of anything unusual.

> **Stationarity, in one paragraph.** A stationary series has a stable mean, stable variance, and an autocorrelation that depends only on the lag – not on absolute time. Most ARIMA / ARMA theory assumes stationarity. If a series isn't stationary, you difference it (subtract `y[t-1]` from `y[t]`) until it is. The suggested **d** in the pre-flight is exactly that recommendation.

When the stationarity table is empty, the reason is stated: no test selected, series shorter than 8 observations, or estimation failure.

#### Fisher's g-test

The **Detected seasonal periods** table is built by stepwise Fisher's g-test on the periodogram. At each step the procedure picks the largest remaining ordinate, computes `g = max(I_k) / sum(I_k)`, and gets a p-value from the closed-form null distribution under white noise. The peak's main lobe (±2 bins) is then dampened to the median and the procedure repeats, up to 10 iterations or until the next peak isn't worth testing. Survivors are filtered against your [significance level](./settings.md#significance-level); only periods between 2 observations and half the record length can appear.

The reported p **already accounts for the multiplicity of looking at the whole periodogram** – the closed-form g distribution is a Bonferroni bound across every ordinate, which is what makes "the largest peak in this spectrum" a testable claim in the first place. The [global p-value adjustment setting](./settings.md#multiple-comparison-adjustment) is therefore *not* applied on top of it; doing so would correct the same family twice. The footnote under the table reports how many peaks were tested so the search depth is visible.

> **Why fractional periods like 22.5?** The periodogram is evaluated at Fourier frequencies `f_k = k / N`, so the period of a peak is `N / k` – fractional whenever *k* doesn't divide *N* evenly. The `± d` annotation on each period is the bin half-width: a period of `22.7 ± 1.3` means the true cycle could lie anywhere in roughly `[21.4, 24.0]`. Spectral resolution is finite; this surfaces it honestly rather than implying a precision the data doesn't have.

> **Harmonics aren't independent seasons.** A non-sinusoidal cyclic signal of period *P* produces spectral peaks not just at *P* but at *P/2*, *P/3*, *P/4*, … (its harmonics). The test correctly flags them as significant – they are real spectral peaks – but they're derivatives of the same underlying cycle. The **Note** column marks each derivative row with its parent (e.g. *Harmonic of 45 (×3)* for a peak at period 15 when there's a stronger peak at 45). Use the fundamental rows to choose a frequency override; use the muted harmonic rows as confirmation that the fundamental is the right call.

> **Spectral concentration ≠ Hyndman's seasonal strength.** The Fisher table is about *spectral concentration* – how peaked the periodogram is at a given frequency – and is computed independently of the configured frequency. The seasonal-strength number reported above (when STL ran) is a different quantity: `1 − Var(remainder) / Var(seasonal + remainder)`, computed on the configured frequency. A series can have a strong, narrow spectral peak yet a modest Hyndman *Fs* if the seasonal amplitude varies a lot, and vice versa.

When ACF / PACF / stationarity ran on an interpolated series (because the series had missing values), a small note discloses it – those metrics are biased toward smoothness and stationarity vs. the raw series, so report the imputation count alongside.

### Smoothing

Fits a denoised curve to each series, overlays it on the observed values, and (for the model-based methods) checks the residuals it leaves behind. Methods:

- **Moving average** – symmetric centred mean over a window of size *k*. The **Moving-average window** input is seeded from the active seasonal period and requires ≥ 2; an even window is applied as the `2×m` weighted form, which is what keeps a monthly seasonal average centred on an observation. The curve's legend names the exact form used, e.g. `MA(12), centred 2×12`.
- **Simple exponential smoothing (SES)** – `ets(model = "ANN")`; weights past values geometrically. Best for series with no trend and no seasonality.
- **Holt** – `ets(model = "AAN")`; level + trend, no seasonality. Use when a trend is present but seasonality isn't.
- **Holt-Winters** – level + trend + seasonality. Available only when the seasonal period is between 2 and 24; outside that range the option is disabled with a note, and the picker falls back to SES.

Two options apply to the exponential-smoothing methods:

- **Seasonality** (Holt-Winters only) – **Additive** for a seasonal swing of constant size, **Multiplicative** for one that grows with the level. Multiplicative seasonality can't be combined with a Box-Cox transformation (the transform is already doing that job) and needs a strictly positive series; both cases are stated rather than silently ignored.
- **Damped trend** (Holt and Holt-Winters) – flattens the extrapolated trend rather than continuing it linearly. Almost always the safer choice for anything but a short horizon.

Each fit shows:

- **Observed vs smoothed plot** – observed line with the smoothed curve overlaid, plus **Outlier replaced** markers wherever the transform stack changed a point
- **Fit summary** – for a moving average, the **Window** and the number of **Smoothed points**; for the ETS methods, the fitted specification, **σ (residual scale)**, AIC / AICc / BIC, and training-set RMSE / MAE / MAPE
- **Parameter table** – the fitted smoothing weights (α, β, γ, φ) and initial states, each labelled by its **Role**
- **Diagnostics** – **Ljung-Box test on residuals** and **ACF of residuals** (both on by default), plus optional **Residual normality (Q-Q + Shapiro)**, and a residuals-over-time plot. Exponential smoothing is a fitted model with a residual stream, so the same checks that apply to ARIMA apply here.
- **Transform stack summary** – what the optional outlier-replacement and Box-Cox steps actually did
- **Skipped notice** – when the series is too short for the chosen method, contains missing values a method can't fit, falls outside Holt-Winters' seasonal range, or fitting failed numerically

> **A moving average has no likelihood.** It isn't a statistical model, just a filter, so no information criteria and no residual diagnostics are defined for it – the card says so instead of rendering blank cells. If you want IC comparisons or a whiteness test, use SES / Holt / Holt-Winters or the [ARIMA card](#arima-and-sarima-modelling).

> **MA + Box-Cox produces a median-scale curve.** Moving averages don't have a fitted residual variance you could plug into the Box-Cox bias-correction formula, so the back-transformed curve is on the **median** scale rather than the mean scale. SES, Holt, and Holt-Winters get a proper bias correction and remain mean-unbiased after back-transformation. A **"Curve is on the median scale"** note appears under MA + Box-Cox plots so you don't read the curve as a mean estimate.

> **When to pick which:** moving average for visual smoothing of an arbitrary series; SES when the series has no trend or seasonality but you want a one-step-ahead expectation; Holt when it has a trend; Holt-Winters when it has both a trend and a seasonal pattern. Holt-Winters on a short or noisy series almost always over-fits – fall back to SES or Holt and let auto-ARIMA handle seasonality from the [forecasting horse-race](#forecasting).

### ARIMA and SARIMA modelling

Fits an ARIMA(p, d, q) – and SARIMA(p, d, q)(P, D, Q)[m] when frequency > 1 – to each series.

**Specification:**
- **Auto** (default) – `forecast::auto.arima`, searching the order grid by a criterion you choose:
  - **Selection criterion** – **AICc** (default), **AIC**, or **BIC**. BIC penalises complexity harder and tends to return smaller models; the criterion that decided the fit is named in the summary table.
  - **Exhaustive search** (off by default) – scores every order in the space exactly instead of the greedy stepwise walk with an approximated criterion. It regularly finds a better model, and it is considerably slower on long or high-frequency series.
- **Manual** – you set `(p, d, q)` directly, plus `(P, D, Q)` when the active frequency is > 1. The seasonal row is auto-disabled and zeroed when frequency = 1. Orders are bounded (p, q ≤ 10; d ≤ 3; P, Q ≤ 5; D ≤ 2) and out-of-range values are rejected with a toast rather than passed through to R.
  - **Include constant / drift** (default on) – fits a mean on an undifferenced series and a drift term on a differenced one, exactly as `auto.arima` does. Turning it off forces the model through the origin of the differenced scale, which is rarely what you want unless you have a reason.

**Diagnostics** (each adds an output section):

- **Ljung-Box test on residuals** (default on) – single-row table with χ², df, lag, and p-value. The degrees of freedom are corrected for the parameters the fit consumed (`p + q + P + Q`), which is what makes the test valid on residuals rather than on raw data. Significant = remaining serial dependence → model is missing structure. When the series is too short to test more lags than the fit consumed degrees of freedom, the test is skipped with a note instead of reporting a meaningless df.
- **ACF of residuals** (default on) – visual companion to Ljung-Box. Bars within the dashed bounds = white-noise residuals.
- **Residual normality (Q-Q + Shapiro)** (default off) – Q-Q plot plus a Shapiro-Wilk row. Useful for prediction-interval validity but not strictly required for ARIMA point forecasts. Shapiro-Wilk caps at 5000 observations; beyond that a random draw is tested and the note says so.

Both diagnostics sections are preceded by a **residuals over time** plot, which is where a variance that grows with the level or a break in the residual mean shows up most plainly.

Output per series:

- **Specification** – `ARIMA(p, d, q)` or `ARIMA(p, d, q)(P, D, Q)[m]` for seasonal fits. A fitted constant is named in the card title too – *ARIMA(0,0,1)(0,1,1)[12] with drift*, *… with non-zero mean* – so the term isn't only visible as a coefficient row.
- **AIC**, **AICc**, **BIC** – information criteria, lower is better; the one that selected the model is labelled as the selection criterion
- **Log-likelihood**, **σ² (residual variance)** – model-fit summaries
- **RMSE / MAE / MAPE / MASE (training set)** – in-sample accuracy from `forecast::accuracy`. Under a Box-Cox transform these are the only original-scale numbers on the card, because `accuracy()` scores back-transformed fitted values.
- **Coefficient table** – one row per term: estimate, SE, confidence interval at your [global confidence level](./settings.md#confidence-level), *z*, p-value
- **Neighbouring orders (information criteria)** – manual mode only. Lists the IC for each order in a small grid around the chosen one, sorted by AICc, with the fitted row in bold and a caption saying so. Use this to check whether your manual pick is near the AICc-best fit; large IC gaps are a signal to switch to **Auto**.
- **Observed vs fitted** plot, with **Outlier replaced** markers where the transform stack changed a point
- **Residuals over time** / **Residual ACF** / **Ljung-Box** / **Q-Q + Shapiro** sections, when their toggles are on
- **Transform stack summary** at the bottom, including a note when the information criteria and residual diagnostics are on the Box-Cox scale while the fitted curve and accuracy row are back-transformed

> **AIC, AICc, BIC, briefly.** All three reward fit and penalise complexity, but they disagree on how. **AIC** ≈ goodness-of-fit penalised by the number of parameters; **AICc** is AIC with a small-sample correction (use it when *n* / parameters < 40, which is most time series); **BIC** penalises complexity more harshly and tends to pick smaller models. Lower is better for all three. Only compare IC values between models fitted to the *same* data on the same scale.

> **Reading a SARIMA spec.** `ARIMA(0, 1, 1)(0, 1, 1)[12]` means: regular differencing of order 1, seasonal differencing of order 1 over a period of 12, one MA term in the regular part, one MA term in the seasonal part. The bracketed `[m]` is the seasonal period. The famous "airline model" is exactly that.

> **Long seasonal periods break SARIMA.** Above a period of about 24 – daily data with a yearly cycle, hourly data with a weekly one – the automatic search tends to keep nothing but a seasonal difference, and a manual seasonal term usually fails to converge. The card warns when you're in that territory. Dynamic harmonic regression or an STL-based method is the usual alternative.

> **Significant Ljung-Box on residuals → bad fit.** If residuals retain serial dependence, the model is missing structure – usually a seasonal term or a higher AR order. Refit with **Auto** (it'll explore the order grid, and **Exhaustive search** will explore it properly) or extend the manual spec.

### Forecasting

Runs a **horse-race** across seven forecasters, ranks them by validation error, plots them together with the leader highlighted, and lets you swap the active method with a click.

**Methods raced:**

| Key | Method | Notes |
|---|---|---|
| `naive` | Naive | Last observed value carried forward; the "do nothing" baseline |
| `drift` | Drift | Naive plus a linear trend through the first and last observation |
| `snaive` | Seasonal naïve | Last value from the same season; needs frequency > 1 |
| `ets` | ETS | Automatic exponential smoothing, picks among the ETS error / trend / seasonal forms by AICc |
| `autoarima` | Auto-ARIMA | `auto.arima` over the same grid as the [ARIMA card](#arima-and-sarima-modelling) |
| `theta` | Theta | Decomposition into theta lines + SES; competitive on M3 / M4 |
| `stlf` | STL + ETS | STL decomposition followed by ETS on the seasonally-adjusted series; needs frequency > 1 and at least two full cycles |

**Options:**

- **Horizon** (default 12) – number of future periods to forecast
- **Evaluate on holdout** (default on) – splits off the last `min(horizon, ⌊0.2 × n⌋)` observations as a validation set, refits each method on the training portion, and scores it there. Requires at least 30 non-missing observations and a training slice of at least 10; when the series is too short, the card says so rather than silently dropping the column.
- **Rolling-origin cross-validation** (default on, default 5 origins, range 2–20) – refits at several origins and averages the errors. Origins sit a **full horizon apart**, so the evaluation windows are disjoint and no observation is scored twice. That costs length: one origin needs `horizon + 10` observations, two need `2 × horizon + 10`, and so on. When the series can't support the number you asked for, the achievable count is used and reported as *{a} of {n} origins*.
- **Flag in-sample anomalies (3·MAD)** (default on) – points whose in-sample residual exceeds 3 × the median absolute deviation are flagged on the plot for the active method.

Each series produces:

- **Forecast plot** – observed values plus every fitted method drawn in its own colour, with the active method thickened, banded with its prediction interval, and carrying the residual-outlier markers. Future timestamps are calendar-aware for monthly / quarterly / yearly cadences, stepping from the anchor date and clamping to each target month's length, so a forecast anchored on 31 January lands on 28 February rather than skipping the month.
- **Validation summary** – one line: rolling-origin CV origins × horizon, and / or holdout size. When CV or holdout was requested but couldn't run, the line names the length the gate actually requires.
- **Horse-race ranking table** – one row per method with rank, label, and the four accuracy metrics **RMSE**, **MAE**, **MASE**, **MAPE**, grouped under **Cross-validation** and **Holdout** headers. A block appears only when that validation ran, so CV numbers are never lined up against holdout numbers as if they were comparable. The **Rank** header names the metric that decided the order (**Rank (CV RMSE)** or **Rank (holdout RMSE)**); with no validation at all the column is blank rather than implying a winner. Rows a method never qualified for read **Not applicable** with the reason as a tooltip; rows whose fit broke read **Failed**. Click **Use** on any fitted row to make it active.
- **Forecast values table** – the active method's point forecast for each future period with **80% interval** and **95% interval** bounds, rebuilt whenever you press **Use**
- **Transform stack summary** at the bottom

> **RMSE, MAE, MASE, MAPE.** **RMSE** squares errors before averaging – it punishes large misses disproportionately. **MAE** averages absolute errors – the typical miss, in original units. Both are on the series' own scale, so they can't be compared across series. **MASE** divides the error by the in-sample error of a naive forecast: below 1 means you beat naive, above 1 means you didn't, and it's comparable across series and groups. **MAPE** is the average percentage error – readable, but undefined near zero and asymmetric between over- and under-forecasting. Use MASE when comparing series; RMSE or MAE within one.

> **Rolling-origin CV vs single holdout.** A single holdout tells you how the model did on one specific test window – it can be lucky or unlucky. Rolling-origin CV averages performance across several disjoint origins, which is closer to expected forecast error and far more stable. When both are reported and they disagree, trust the CV block – and note that the two are scored on different data, which is exactly why they're kept in separate column groups.

> **Naive isn't a strawman.** Beating naive (or seasonal naïve when frequency > 1) on a stable series is harder than it sounds. If your favourite ARIMA / ETS / theta fit doesn't outperform the naive baseline by a useful margin, the forecast value of the model is questionable – even if its in-sample fit looks good.

### Spectral / change-points

Frequency-domain and structural-break tools. Enable at least one of the two checkboxes – both off blocks submission with a toast.

Each card opens with a per-series line stating how many observations were actually observed out of the total, at what frequency – the length gates below count *real* values, not values that imputation filled in.

**Periodogram** (default on):
- A tapered, detrended periodogram from `stats::spec.pgram` on the true Fourier grid, plotted as the raw comb with a **modified-Daniell smoothed spectrum** drawn over it. The smooth is there to read shape; the peaks and their tests are taken from the raw ordinates, and the bandwidth used is stated under the plot.
- A **top-frequency table** of the highest local maxima, with columns:
  - **Period (observations)** – `1 / frequency`, in observation units
  - **Frequency (cycles/obs)** – raw spectral frequency
  - **Spectral power** – relative power at that frequency
  - **Fisher's g** and **p** – each peak tested against a white-noise spectrum, the same test the [Exploration card](#fishers-g-test) uses, so the two cards agree
- Peaks whose period exceeds half the record are dropped from the ranked list (they're one-cycle artefacts, not cycles you can estimate), though the plot keeps the whole spectrum
- Skipped, with the reason stated, when the series has fewer than 8 observed values or is constant

**Bai-Perron change-points** (default off):
- Breakpoint detection via `strucchange::breakpoints`, with the number of breaks selected by BIC
- **Break model** – **Mean shift (level only)** fits a constant within each segment; **Level + trend** fits a slope as well. Mean shift reads a trending series as a staircase of level steps, so use it only when you expect a flat-between-jumps series.
- **Minimum segment size (%)** (default 15, range 5–45) – the share of the series each segment must span, which also caps how many breaks can be placed. The card reports the resulting length in observations, so a clamped value is visible.
- A **breakpoint plot** showing the series with vertical dashed lines at each break, horizontal segment-mean lines, and a shaded 95 % confidence band for each break date
- A **breakpoint table** with **Observation** index, **Time**, **95% CI from** / **95% CI to**, and the segment means before and after each break
- Reports **No breakpoints detected** when none are found, naming what was stable – the mean, or the level and slope
- Requires the `strucchange` package; if it can't be loaded the periodogram still runs and the breakpoint section carries the warning
- Requires at least 20 observed values

> **Segment means are on the original scale.** When Box-Cox is active, the model sees the transformed series but the reported means are computed on the untransformed values, so they are ordinary arithmetic means of each segment – not a back-transformed median that would read low.

> **Periodogram vs ACF.** Both reveal cyclical structure, but at different resolutions. The ACF shows correlations at integer lags; the periodogram resolves all frequencies between 0 and the Nyquist limit. A clean periodogram peak at frequency 1/12 (= period 12) on monthly data is the spectral signature of a yearly cycle – the same structure that produces big ACF spikes at lag 12, 24, 36.

> **Bai-Perron change-points** detect shifts in the fitted relationship – the **mean level** under the mean-shift model, or the level *and* slope under the level + trend model. They don't detect changes in seasonality or variance; for those, run the search on the residual after removing trend and seasonality. The dates are read off your time variable, with the time of day included when the cadence is sub-daily.

## Imputation, missing data, and dropped rows

Time-series methods need a regularly-spaced numeric vector, which is why several pre-processing steps run silently:

- **Time-parse failures** – rows whose time value can't be read on the column's own scale (numeric or date) are dropped before anything else, together with rows whose group value is blank when grouping is on. Counted in the output as **Dropped rows**.
- **Internal interpolation** – `forecast::ndiffs`, `nsdiffs`, ACF / PACF, stationarity tests, and the spectral / breakpoint search can't tolerate `NA`, so series with missing values are linearly interpolated via `forecast::na.interp` *for those computations only*. A `{n} missing value(s) interpolated in {name}` note is added to the output. The original series is preserved for plotting and modelling – ARIMA, ETS, and the smoothing methods handle `NA` natively.
- **Length gates count real values** – the minimum-length checks on the spectral card are applied to the number of observed values, not the post-imputation length, so a 60-row series holding 4 real values is refused rather than analysed as if it had 60.
- **Outlier replacement** – only when the **Replace outliers** transform-stack option is on. Otherwise outliers pass through to the model.

The [global missing-data setting](./settings.md#missing-data) does **not** apply here – time-series analysis needs the original series shape preserved, and ad-hoc listwise / pairwise deletion would break the time index.

## Reporting checklist

**Method:**
- Time variable, series variables, grouping (if any)
- Frequency used, and whether it was auto-detected or overridden; note when groups disagreed on cadence
- Pre-flight summary: regularity, gaps / duplicates, missingness, and any outliers replaced
- Transforms applied (Box-Cox λ if used), and any that were requested but skipped
- Method (Exploration / Smoothing / ARIMA / Forecasting / Spectral) and any sub-options:
  - Decomposition type, stationarity tests run, and the KPSS null used
  - Smoothing method, window or seasonality type, and whether the trend was damped
  - ARIMA: auto vs manual; the selection criterion and whether the search was exhaustive; if manual, the chosen `(p, d, q)(P, D, Q)[m]` and whether a constant was included
  - Forecasting: methods raced, holdout size, CV origins achieved, horizon
  - Spectral: periodogram and / or breakpoints, with the break model and minimum segment size
- Number of rows analysed, with dropped-row count

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

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. The module uses `forecast` (decomposition, ndiffs / nsdiffs, ACF / PACF, ETS, auto-ARIMA, theta, STL+ETS, tsoutliers, tsclean, Box-Cox, accuracy, na.interp), `tseries` (ADF, KPSS, Phillips-Perron), `stats` (spectrum / periodogram, classical decomposition), and `strucchange` (Bai-Perron breakpoints and their confidence intervals). Stationarity verdicts and seasonal-period significance both use your [global significance level](./settings.md#significance-level); p-value formatting follows the [global p-value setting](./settings.md#display-format), and the [confidence-level setting](./settings.md#confidence-level) applies to ARIMA coefficient intervals. Forecast prediction intervals are reported at the conventional 80 % and 95 % levels. Citations for R packages and methods used in your analysis appear automatically at the top of the output card.

## Common pitfalls

**Misspecifying the frequency.** Frequency is observations per cycle, not a sampling rate. Picking 365 for daily data with a yearly cycle is correct; picking 1 silently disables seasonal naïve, Holt-Winters, STL+ETS, and the seasonal `(P, D, Q)` part of SARIMA. The auto-detected suggestion under the time picker covers the common cases, and the pre-flight's **Detected seasonal period** row offers a second opinion read off the series itself – override only when you have a non-standard cycle.

**SARIMA / Holt-Winters on a short series.** With *n* < 30, the seasonal parameters absorb noise rather than signal. The pre-flight calls this out, but it's worth saying twice: prefer naive baselines, ETS without seasonality, or simple exponential smoothing on short series, and only escalate to seasonal models when you have at least two full cycles of data plus a buffer.

**Reading ADF or KPSS as if one test settled it.** Both have low power on near-unit-root series, and a non-rejection isn't proof of stationarity – it's failure to reject. Read the **Joint reading** note rather than a single row, keep the KPSS null matched to the ADF model, and cross-check against the suggested `d`, the visual decay of the ACF, and substantive knowledge of the series.

**Forecasting without a baseline.** A model that doesn't beat naive (or seasonal naïve when frequency > 1) isn't earning its complexity. The horse-race always includes both – keep them in your reporting even when ETS or auto-ARIMA wins, so the reader can see how much the better model bought you.

**Comparing forecast metrics across the wrong things.** RMSE and MAE are on the series' own scale, so a "better" number on a different series or group means nothing – use MASE for that. And never read a CV figure against a holdout figure: they're computed on different data, which is why the table keeps them in separate blocks and ranks on one of them only.

**Choosing the wrong break model.** The mean-shift model has no slope, so it explains any trend as a staircase of level steps and will happily report several breaks in a series that only trends. If the series trends, use **Level + trend** – and if the two models disagree about how many breaks exist, that disagreement is itself the finding.

**Reporting in-sample fit instead of out-of-sample error.** A low ARIMA AIC means the model fits the *training* data well; it doesn't tell you how the model will forecast. The forecasting card's holdout and rolling-origin CV blocks are the quantities to quote when the analysis is about prediction.
