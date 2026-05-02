---
title: Time series analysis
description: Time series analysis in DataSuite 2 — exploration, decomposition, stationarity tests, smoothing, ARIMA / SARIMA, forecasting, and change-point detection.
---

# Time series analysis

The **Time series analysis** module turns a column of numbers ordered by time into something you can reason about: cycles you can name, trends you can quantify, models you can forecast from, and break-points you can date. It bundles five workflows — exploration, smoothing, ARIMA / SARIMA, forecasting, and spectral / change-point analysis — behind a single variable picker and a shared transform stack.

> **What makes time series different?** Ordinary statistics treats observations as independent. In a time series, today's value depends on yesterday's, last week's, last year's — that dependence (autocorrelation) is the whole point. Methods that ignore it produce overconfident p-values, biased forecasts, and trends that look real but are just slow drift. Time series methods are the toolkit built to model that dependence directly.

1. Pick a [time variable](#time-variable) and one or more [series](#series)
2. Optionally add a [grouping variable](#grouping) or override the [auto-detected frequency](#frequency-override)
3. Click **Check data** for a [pre-flight diagnostic report](#pre-flight-check-data) — recommended before fitting anything
4. Choose an [analysis method](#analysis-methods) and toggle [transform-stack](#transform-stack) and method-specific options
5. Click **Calculate**

## Variable roles

The left column has the variable pickers; the right column has the method setup.

### Time variable

A required column that orders the observations. Three formats are accepted:

- **Date** strings (`2024-03-15`, `2024-03-15 14:30:00`)
- **Numeric index** (`1, 2, 3, …` or any monotone numeric column)
- **Datetime** parseable by JavaScript's `Date.parse`

Rows whose time value can't be parsed are silently dropped and counted under **Dropped rows (unparseable time)** in the output. Rows are then sorted by time before any analysis runs, so the input doesn't have to be pre-sorted.

After picking the time variable a frequency hint appears under the dropdown — see [frequency auto-detection](#frequency-auto-detection).

### Series

A multi-select list of one or more numeric variables. Each is analysed independently, but they're plotted together (faceted by default; toggle **Stack on one axis (overlay instead of facet)** to overlay).

Non-numeric variables are blocked at submission time with a toast — recode them first via [data transformation](./data-transformation.md).

### Grouping

Optional categorical variable. When set, every method runs **per group**: each group gets its own line plot, ACF, fit, forecast, or breakpoint analysis. The output is wrapped in **Group: {name}** sections so you can scan group boundaries at a glance.

> **Per-group time-axis stats:** when a grouping variable is set, the time-axis diagnostics (gaps, duplicates, regularity) are reported **per group** rather than across the pooled timeline. Two groups whose timestamps overlap would otherwise look like one series with massive duplicate counts and false gaps at every group transition.

### Frequency override

A manual seasonal period (positive integer) used by every method that cares about seasonality. Leave blank to use auto-detection.

> **What is "frequency" in time series?** It's the number of observations per natural cycle, *not* a sampling rate in Hz. Monthly data with a yearly cycle has frequency 12; quarterly data with a yearly cycle has frequency 4; daily data with a weekly cycle has frequency 7. SARIMA, Holt-Winters, STL decomposition, and the seasonal naïve forecast all use this number to decide what "one season" means.

#### Frequency auto-detection

When the time variable is a **date / datetime**, the median spacing between observations picks a default cycle:

| Median spacing | Suggested frequency | Cycle |
|---|---|---|
| Sub-hourly | 60 | per-hour |
| Hourly | 24 | per-day |
| Daily | 7 | per-week |
| Weekly | 52 | per-year |
| Monthly | 12 | per-year |
| Quarterly | 4 | per-year |
| Yearly | 1 | none assumed |

When the time variable is **numeric**, the default is **1** (no seasonality assumed) — set the override if your numeric index has a natural cycle (e.g. `12` for a synthetic monthly index).

The active frequency is shown live under the dropdown; it also disables the seasonal `(P, D, Q)` row in ARIMA and the seasonal naïve / Holt-Winters / STL+ETS branches of the forecasting horse-race when it equals 1.

## Pre-flight (Check data)

Before fitting anything, click **Check data** to run the data-fitness diagnostic. It reports — per group when grouping is on, otherwise dataset-wide:

**Time axis:**
- **Observations** — rows surviving time-parse and (per-group) the group filter
- **Frequency used** — the active seasonal period
- **Regular spacing** — yes / no based on duplicate timestamps and gaps
- **Gap count** — count of inter-observation deltas wider than 1.5 × the median
- **Duplicate timestamps** — count of zero-width deltas
- **Dropped rows (unparseable time)** — rows excluded at the start

**Per series:**
- **Missing values** — count and percentage
- **Suggested d (ndiffs)** — number of regular differences `forecast::ndiffs` recommends to reach stationarity
- **Suggested D (nsdiffs)** — number of seasonal differences `forecast::nsdiffs` recommends (only when frequency > 1)
- **Box-Cox λ (auto)** — the Guerrero estimate of the variance-stabilising power transform
- **Outliers detected** — count from `forecast::tsoutliers`. When non-zero an **Apply** button enables outlier replacement in the [transform stack](#transform-stack) for the next run.

A short recommendation follows each per-series block:

- **Strong seasonal pattern** — try SARIMA or Holt-Winters
- **Non-stationary** — try ARIMA with `d ≥ 1`
- **Stationary** — try exponential smoothing or stationary ARMA

Series with **fewer than 30 observations** also pick up a cautionary note about overfitting — SARIMA and Holt-Winters on short series are the classic over-parameterised trap.

> **Why "Check data" before fitting?** Most time-series failures come from data shape, not from picking the wrong model. A series with daily gaps fed to monthly seasonality will look stationary on every test and produce nonsense forecasts. The pre-flight surfaces those problems — irregular spacing, heavy missingness, near-constant variance with extreme outliers, length too short for seasonality — before you spend time on a fit that was always going to lie to you.

## Transform stack

A small stack of optional pre-modelling transforms shared by smoothing, ARIMA, forecasting, and spectral analysis. Exploration (which is descriptive) doesn't use it.

- **Replace outliers** — `forecast::tsoutliers` identifies points whose decomposition residual exceeds the 3·IQR rule; replacements come from local interpolation. Useful when isolated spikes are dominating the fit but you don't want to drop the rows.
- **Box-Cox override** — applies a power transform stabilising the variance. With **λ value** blank, the Guerrero estimator picks λ automatically. Setting an explicit λ (e.g. `0` for log, `0.5` for square root, `1` for no transform) gives you reproducible control. Methods that already do an internal Box-Cox (`auto.arima`, ETS) honour the override.

The output card for every fitted method ends with a one-line **Transform stack** summary listing what actually applied — `2 outlier(s) replaced · Box-Cox λ = 0.31` — so you can see at a glance whether the transforms reshaped the input.

> **When does Box-Cox help?** When the variance grows with the level — a series whose swings are bigger when the level is higher. A log transform (λ = 0) is the workhorse; the Guerrero estimator picks something between log and identity based on the actual heteroscedasticity. Don't apply it to series that go through zero or take negative values — those need a shift first.

> **Manual differencing isn't here.** Pre-differencing a series before passing it to ETS, theta, or Holt-Winters is methodologically incorrect — those models fit the level directly and don't expect a stationary input. ARIMA's `d` order lives inside its own card for that reason. The transform stack only carries shape transforms that compose cleanly with every method.

## Analysis methods

| Method | What it produces | Required inputs |
|---|---|---|
| **Exploration** | Line plot, ACF / PACF, decomposition, stationarity tests | Time, ≥ 1 series |
| **Smoothing** | Moving-average or exponential-smoothing curve overlaid on observed | Time, ≥ 1 series |
| **ARIMA / SARIMA modelling** | Coefficient table, IC metrics, residual diagnostics | Time, ≥ 1 series |
| **Forecasting** | Horse-race across 7 forecasters with rolling-origin CV and holdout evaluation | Time, ≥ 1 series |
| **Spectral / change-points** | Periodogram top frequencies; Bai-Perron breakpoints | Time, ≥ 1 series |

Pick **Exploration** first if you don't know your series — the ACF, decomposition, and stationarity verdict together tell you which of the modelling methods to reach for next.

### Exploration

Descriptive view of one or more series. Outputs (per group × series):

- **Series plot** — observed values over time, faceted by series unless **Stack on one axis** is on. Decomposition-residual anomaly points are marked when an STL is computed.
- **ACF / PACF** — sample autocorrelation and partial autocorrelation up to a default lag set by `forecast::Acf`. Surfaces serial dependence and helps pick ARIMA orders.
- **Decomposition** — STL (recommended), classical additive, classical multiplicative, or skip:
  - **STL** — robust, handles non-constant seasonality, returns trend / seasonal / remainder components plus **trend strength** and **seasonal strength** on a 0–1 scale (Hyndman, 2008)
  - **Classical additive** — `observed = trend + seasonal + remainder`; assumes constant seasonal amplitude
  - **Classical multiplicative** — `observed = trend × seasonal × remainder`; requires strictly positive values
  - **Skip** — useful when you only want ACF and stationarity output
- **Stationarity tests** — any combination of:
  - **Augmented Dickey-Fuller (ADF)** — null = non-stationary; rejecting means the series looks stationary
  - **KPSS** — null = stationary; rejecting means the series looks non-stationary
  - **Phillips-Perron (PP)** — null = non-stationary; like ADF but with a non-parametric correction for serial correlation. Off by default.

  Conclusions are reported as **Stationary at α = 0.05**, **Non-stationary at α = 0.05**, or **Inconclusive** based on the p-value and the test's null. The α = 0.05 threshold is fixed; the [global p-value display setting](./settings.md#display-format) controls how the p-values are formatted but not the cut-off.
- **Raw Ljung-Box** — single-line summary asking whether *any* serial dependence exists in the series. A significant result means it's worth modelling; a non-significant one suggests the series is essentially white noise.
- **Decomposition strengths** — `Trend = max(0, 1 − Var(remainder) / Var(trend + remainder))`; same shape for **Seasonal**. Values close to 1 indicate a strong component.
- **Detected seasonal periods** — independent of the configured frequency, the periodogram is searched for all significant cycles via a stepwise [Fisher's g-test](#fishers-g-test). The output is a small table per series, one row per significant period, with columns:
  - **Period (obs)** — the cycle length in observation units, plus the Fourier-bin resolution as `P ± d` (or `≥ P` for the longest-period bin whose upper bound is unbounded)
  - **Cycles per obs** — the corresponding spectral frequency
  - **Fisher's g** — the test statistic; equivalently the share of total spectral variance concentrated at this peak
  - **Share of variance** — the same quantity expressed as a percentage
  - **p-value** — raw p, plus the [adjusted p-value](./settings.md#multiple-comparison-adjustment) if a correction method is set
  - **Note** — `Harmonic of {P} (×n)` for rows whose period divides a stronger row's period by an integer ≥ 2, or `—` for fundamental cycles. Harmonic rows are visually muted.

  When no period reaches significance, a single line confirms that — *No additional significant seasonal periods detected for {name} at α = 0.05 ({adjustment})* — so the empty case is distinguishable from a skipped section.
- **Anomaly summary** — count of decomposition-residual outliers flagged in the plot.

> **ACF and PACF, briefly.** The ACF at lag *k* is the correlation between the series and itself shifted by *k* steps. A slow decay points to a non-stationary series; a single big spike at lag 12 (with frequency 12) points to seasonality; a sharp cut-off at lag *q* with PACF tailing off → MA(q); the mirror — PACF cuts off at *p*, ACF tails off → AR(p). They're rough guides, not contracts.

> **ADF vs KPSS — why run both?** They have opposite nulls. ADF rejects when the series looks stationary; KPSS rejects when it looks non-stationary. Agreement (both signal stationary, or both signal non-stationary) is a strong verdict; disagreement is a signal that the answer depends on whether trend or unit-root is the right description, and you should look at the differenced series. The "inconclusive" label in the output flags the disagreement directly.

> **Stationarity, in one paragraph.** A stationary series has a stable mean, stable variance, and an autocorrelation that depends only on the lag — not on absolute time. Most ARIMA / ARMA theory assumes stationarity. If a series isn't stationary, you difference it (subtract `y[t-1]` from `y[t]`) until it is. The suggested **d** in the pre-flight is exactly that recommendation.

#### Fisher's g-test

The **Detected seasonal periods** table is built by stepwise Fisher's g-test on the periodogram. At each step the procedure picks the largest remaining ordinate, computes `g = max(I_k) / sum(I_k)`, and gets a p-value from the closed-form null distribution under white noise. The peak's main lobe (±2 bins) is then dampened to the median and the procedure repeats, up to 10 iterations or until the next peak isn't worth testing. Collected raw p-values are corrected with your global [p-value adjustment method](./settings.md#multiple-comparison-adjustment) and filtered against the [significance level](./settings.md#significance-level); only survivors appear in the table.

> **Why fractional periods like 22.5?** The periodogram is evaluated at Fourier frequencies `f_k = k / N`, so the period of a peak is `N / k` — fractional whenever *k* doesn't divide *N* evenly. The `± d` annotation on each period is the bin half-width: a period of `22.7 ± 1.3` means the true cycle could lie anywhere in roughly `[21.4, 24.0]`. Spectral resolution is finite; this surfaces it honestly rather than implying a precision the data doesn't have.

> **Harmonics aren't independent seasons.** A non-sinusoidal cyclic signal of period *P* produces spectral peaks not just at *P* but at *P/2*, *P/3*, *P/4*, … (its harmonics). The test correctly flags them as significant — they are real spectral peaks — but they're derivatives of the same underlying cycle. The **Note** column marks each derivative row with its parent (e.g. *Harmonic of 45 (×3)* for a peak at period 15 when there's a stronger peak at 45). Use the fundamental rows to choose a frequency override; use the muted harmonic rows as confirmation that the fundamental is the right call.

> **Spectral concentration ≠ Hyndman's seasonal strength.** The Fisher table is about *spectral concentration* — how peaked the periodogram is at a given frequency — and is computed independently of the configured frequency. The seasonal-strength number reported above (when STL ran) is a different quantity: `1 − Var(remainder) / Var(seasonal + remainder)`, computed on the configured frequency. A series can have a strong, narrow spectral peak yet a modest Hyndman *Fs* if the seasonal amplitude varies a lot, and vice versa.

When ACF / PACF / stationarity ran on an interpolated series (because the series had missing values), a small note discloses it — those metrics are biased toward smoothness and stationarity vs. the raw series, so report the imputation count alongside.

### Smoothing

Fits a denoised curve to each series and overlays it on the observed values. Methods:

- **Moving average** — symmetric centred mean over a window of size *k* (default 7). Sets the **Moving-average window** input which is required ≥ 2 and rounded to an integer.
- **Simple exponential smoothing (SES)** — `ets(model = "ANN")`; weights past values geometrically. Best for series with no trend and no seasonality.
- **Holt** — `ets(model = "AAN")`; level + trend, no seasonality. Use when a trend is present but seasonality isn't.
- **Holt-Winters** — `ets(model = "AAA")`; level + trend + seasonality. Requires frequency > 1.

Each fit shows:

- **Observed vs smoothed plot** — black observed, blue smoothed
- **Transform stack summary** — what the optional outlier-replacement and Box-Cox steps actually did
- **Skipped notice** — when the series is too short for the chosen method, frequency is 1 for Holt-Winters, or fitting failed numerically

> **MA + Box-Cox produces a median-scale curve.** Moving averages don't have a fitted residual variance you could plug into the Box-Cox bias-correction formula, so the back-transformed curve is on the **median** scale rather than the mean scale. SES, Holt, and Holt-Winters get a proper bias correction and remain mean-unbiased after back-transformation. A **"Curve is on the median scale"** note appears under MA + Box-Cox plots so you don't read the curve as a mean estimate.

> **When to pick which:** moving average for visual smoothing of an arbitrary series; SES when the series has no trend or seasonality but you want a one-step-ahead expectation; Holt when it has a trend; Holt-Winters when it has both a trend and a seasonal pattern. Holt-Winters on a short or noisy series almost always over-fits — fall back to SES or Holt and let auto-ARIMA handle seasonality from the [forecasting horse-race](#forecasting).

### ARIMA and SARIMA modelling

Fits an ARIMA(p, d, q) — and SARIMA(p, d, q)(P, D, Q)[m] when frequency > 1 — to each series.

**Specification:**
- **Auto** (default) — `forecast::auto.arima`. Searches the order grid by AICc, with `stepwise = FALSE` and `approximation = FALSE` for thoroughness on small / medium series.
- **Manual** — you set `(p, d, q)` directly, plus `(P, D, Q)` when the active frequency is > 1. The seasonal row is auto-disabled and zeroed when frequency = 1.

**Diagnostics** (each adds an output section):

- **Ljung-Box test on residuals** (default on) — single-row table with χ², df, lag, and p-value. Significant = remaining serial dependence in the residuals → model is missing structure.
- **ACF of residuals** (default on) — visual companion to Ljung-Box. Bars within the dashed bounds = white-noise residuals.
- **Residual normality (Q-Q + Shapiro)** (default off) — Q-Q plot plus a Shapiro-Wilk row. Useful for prediction-interval validity but not strictly required for ARIMA point forecasts.

Output per series:

- **Specification** — `ARIMA(p, d, q)` or `ARIMA(p, d, q)(P, D, Q)[m]` for seasonal fits
- **AIC**, **AICc**, **BIC** — information criteria, lower is better
- **Log-likelihood**, **σ² (residual variance)** — model-fit summaries
- **Coefficient table** — one row per term: estimate, SE, *z*, p-value
- **Neighbouring orders (information criteria)** — manual mode only. Lists the IC for each order in a small grid around the chosen one, sorted by AICc, with the chosen row in bold. Use this to check whether your manual pick is near the AICc-best fit; large IC gaps are a signal to switch to **Auto**.
- **Observed vs fitted** plot
- **Residual ACF** / **Ljung-Box** / **Q-Q + Shapiro** sections, when their toggles are on
- **Transform stack summary** at the bottom

> **AIC, AICc, BIC, briefly.** All three reward fit and penalise complexity, but they disagree on how. **AIC** ≈ goodness-of-fit penalised by the number of parameters; **AICc** is AIC with a small-sample correction (use it when *n* / parameters < 40, which is most time series); **BIC** penalises complexity more harshly and tends to pick smaller models. Lower is better for all three. The AICc grid in the **Neighbouring orders** table is what `auto.arima` itself optimises.

> **Reading a SARIMA spec.** `ARIMA(0, 1, 1)(0, 1, 1)[12]` means: regular differencing of order 1, seasonal differencing of order 1 over a period of 12, one MA term in the regular part, one MA term in the seasonal part. The bracketed `[m]` is the seasonal period. The famous "airline model" is exactly that.

> **Significant Ljung-Box on residuals → bad fit.** If residuals retain serial dependence, the model is missing structure — usually a seasonal term or a higher AR order. Refit with **Auto** (it'll explore the order grid) or extend the manual spec.

### Forecasting

Runs a **horse-race** across seven forecasters, ranks them by validation error, plots the winner with prediction intervals, and lets you swap the active method on the plot with a click.

**Methods raced:**

| Key | Method | Notes |
|---|---|---|
| `naive` | Naive | Last observed value carried forward; the "do nothing" baseline |
| `drift` | Drift | Naive plus a linear trend through the first and last observation |
| `snaive` | Seasonal naïve | Last value from the same season; only when frequency > 1 |
| `ets` | ETS | Automatic exponential smoothing, picks among the ETS error / trend / seasonal forms by AICc |
| `autoarima` | Auto-ARIMA | `auto.arima` over the same grid as the [ARIMA card](#arima-and-sarima-modelling) |
| `theta` | Theta | Assouad-style decomposition + SES; competitive on M3 / M4 |
| `stlf` | STL + ETS | STL decomposition followed by ETS on the seasonally-adjusted series; only when frequency > 1 |

**Options:**

- **Horizon** (default 12) — number of future periods to forecast
- **Evaluate on holdout** (default on) — splits off the last `min(2 × horizon, ⌊n / 3⌋)` observations as a validation set, refits each method on the training portion, and reports holdout RMSE / MAE. Auto-disabled when the series is too short to leave a usable training set.
- **Rolling-origin cross-validation** (default on, default 5 origins, range 2–20) — slides the training window forward, refits at each origin, and averages RMSE / MAE across origins. More robust than a single holdout for short series.
- **Flag in-sample anomalies (3·MAD)** (default on) — points whose in-sample residual exceeds 3 × the median absolute deviation are flagged on the plot.

Each series produces:

- **Forecast plot** — observed values + the active method's mean line and prediction-interval band, drawn against an extended time axis. Calendar-aware future timestamps are used for monthly / quarterly / yearly cadences (so "Feb 1, Mar 1, Apr 1" stays aligned instead of drifting by median-millisecond stepping).
- **Validation summary** — one line: rolling-origin CV count × horizon, and / or holdout size. When the requested CV count couldn't be achieved (training too sparse, fits failed), the achieved-vs-requested gap is reported explicitly.
- **Horse-race ranking table** — one row per method with rank, label, **RMSE (CV)**, **RMSE (holdout)**, **MAE (CV)**, **MAE (holdout)**, and a **Use** button. The default active method is the rank-1 row; click **Use** on another row to swap the active forecast on the plot without re-running the analysis. Methods that failed to fit show **—** in the rank column and **Failed** instead of the button.
- **Transform stack summary** at the bottom

> **RMSE vs MAE.** Both measure forecast error; the difference is in how they treat large misses. **RMSE** squares errors before averaging — it punishes large errors disproportionately. **MAE** averages absolute errors — it's the average miss in original units. Use RMSE when occasional large misses are very costly; use MAE when you want a typical-error number you can quote in plain language.

> **Rolling-origin CV vs single holdout.** A single holdout tells you how the model did on one specific test window — it can be lucky or unlucky. Rolling-origin CV averages performance across multiple origins, which is closer to expected forecast error and far more stable on short series. When both are reported and they disagree, trust the CV column.

> **Naive isn't a strawman.** Beating naive (or seasonal naïve when frequency > 1) on a stable series is harder than it sounds. If your favourite ARIMA / ETS / theta fit doesn't outperform the naive baseline by a useful margin, the forecast value of the model is questionable — even if its in-sample fit looks good.

### Spectral / change-points

Frequency-domain and structural-break tools. Enable at least one of the two checkboxes — both off blocks submission with a toast.

**Periodogram** (default on):
- Smoothed spectral density estimate from `stats::spectrum`
- A **top-frequency table** of the highest-power frequencies, with columns:
  - **Period (observations)** — `1 / frequency`, in observation units
  - **Frequency (cycles/obs)** — raw spectral frequency
  - **Spectral power** — relative power at that frequency
- Skipped when the series has fewer than 8 observations

**Bai-Perron change-points** (default off):
- Mean-shift breakpoint detection via `strucchange::breakpoints`
- A **breakpoint plot** showing the series with vertical dashed lines at each break and horizontal segment-mean lines
- A **breakpoint table** with row index, time value, mean before, and mean after each break
- Reports **No breakpoints detected — series mean is stable** when none are found
- Requires the `strucchange` package (a warning surfaces if it can't be loaded) and at least 20 observations

> **Periodogram vs ACF.** Both reveal cyclical structure, but at different resolutions. The ACF shows correlations at integer lags; the periodogram resolves all frequencies between 0 and the Nyquist limit. A clean periodogram peak at frequency 1/12 (= period 12) on monthly data is the spectral signature of a yearly cycle — the same structure that produces big ACF spikes at lag 12, 24, 36.

> **Bai-Perron change-points** detect shifts in the **mean level** of the series — they answer "did the average move on date X?", not "did the trend or seasonality change?". Use them on the residual after removing trend and seasonality if you want to flag anomalies in dynamics rather than level. The dates are inferred from your time variable (`YYYY-MM-DD` for date axes; numeric otherwise).

## Imputation, missing data, and dropped rows

Time-series methods need a regularly-spaced numeric vector, which is why several pre-processing steps run silently:

- **Time-parse failures** — rows whose time value can't be parsed as numeric or `Date.parse`-able are dropped before anything else. Counted in the output as **Dropped rows (unparseable time)**.
- **Internal interpolation** — `forecast::ndiffs`, `nsdiffs`, ACF / PACF, and stationarity tests can't tolerate `NA`, so series with missing values are linearly interpolated via `forecast::na.interp` *for those tests only*. A `{n} missing value(s) interpolated in {name}` note is added to the exploration output. The original series is preserved for plotting and modelling — ARIMA, ETS, and the smoothing methods handle `NA` natively.
- **Outlier replacement** — only when the **Replace outliers** transform-stack option is on. Otherwise outliers pass through to the model.

The [global missing-data setting](./settings.md#missing-data) does **not** apply here — time-series analysis needs the original series shape preserved, and ad-hoc listwise / pairwise deletion would break the time index.

## Reporting checklist

**Method:**
- Time variable, series variables, grouping (if any)
- Frequency used, and whether it was auto-detected or overridden
- Pre-flight summary: regularity, gaps / duplicates, missingness, and any outliers replaced
- Transforms applied (Box-Cox λ if used)
- Method (Exploration / Smoothing / ARIMA / Forecasting / Spectral) and any sub-options:
  - Decomposition type and stationarity tests run
  - Smoothing method and window
  - ARIMA: auto vs manual; if manual, the chosen `(p, d, q)(P, D, Q)[m]`
  - Forecasting: methods raced, holdout size, CV origins, horizon
  - Spectral: periodogram and / or breakpoints
- Number of rows analysed, with dropped-row count

**Results:**
- Stationarity verdict per test (statistic, p-value, conclusion)
- Decomposition trend / seasonal strengths where reported
- Detected seasonal periods (period ± resolution, Fisher's g, adjusted p) — flagging the configured frequency, the strongest fundamental, and any harmonic structure
- For ARIMA: full specification, AIC / AICc / BIC, residual Ljung-Box result, and an explicit note on residual whiteness
- For forecasting: the winning method and its CV / holdout RMSE / MAE; report at least one baseline (naive or seasonal naïve) for context
- For periodogram: the dominant period(s) and their power
- For breakpoints: the dates of the breaks and the segment means

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) — you can inspect, copy, or re-run the exact commands. The module uses `forecast` (decomposition, stationarity tests, ndiffs / nsdiffs, ETS, auto-ARIMA, theta, STL+ETS, tsoutliers, na.interp), `stats` (spectrum / periodogram, ACF / PACF), and `strucchange` (Bai-Perron breakpoints). The fixed α threshold for stationarity verdicts is 0.05; p-value formatting follows the [global p-value setting](./settings.md#display-format), and the [confidence-level setting](./settings.md#confidence-level) applies to forecast prediction intervals. Citations for R packages used in your analysis appear automatically at the top of the output card.

## Common pitfalls

**Misspecifying the frequency.** Frequency is observations per cycle, not a sampling rate. Picking 365 for daily data with a yearly cycle is correct; picking 1 silently disables seasonal naïve, Holt-Winters, STL+ETS, and the seasonal `(P, D, Q)` part of SARIMA. The auto-detected suggestion under the time picker covers the common cases — override only when you have a non-standard cycle.

**SARIMA / Holt-Winters on a short series.** With *n* < 30, the seasonal parameters absorb noise rather than signal. The pre-flight calls this out, but it's worth saying twice: prefer naive baselines, ETS without seasonality, or simple exponential smoothing on short series, and only escalate to seasonal models when you have at least two full cycles of data plus a buffer.

**Reading ADF or KPSS as if α = 0.05 settled it.** Both tests have low power on near-unit-root series. A non-rejection isn't proof of stationarity; it's failure to reject. Use the suggested `d` from the pre-flight, the visual decay of the ACF, and substantive knowledge of the series — don't lean on a single p-value.

**Forecasting without a baseline.** A model that doesn't beat naive (or seasonal naïve when frequency > 1) isn't earning its complexity. The horse-race always includes both — keep them in your reporting even when ETS or auto-ARIMA wins, so the reader can see how much the better model bought you.

**Treating periodogram peaks as significant by inspection.** The spectral card's top-frequency table is descriptive — the heights aren't tested against any null. A peak that's "obviously above the rest" can be sampling artefact, especially on series shorter than a few hundred observations. Run [Exploration](#exploration) for the formal Fisher's g-test, which reports significant periods directly and flags harmonics. Cross-reference against the ACF too — if the same period shows up there, you're on firmer ground.

**Reporting in-sample fit instead of out-of-sample error.** A low ARIMA AIC means the model fits the *training* data well; it doesn't tell you how the model will forecast. The forecasting card's holdout and rolling-origin CV columns are the quantities to quote when the analysis is about prediction.
