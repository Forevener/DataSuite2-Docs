---
title: EFA and PCA
description: Exploratory factor analysis & PCA – extraction methods, rotation, scree plots, Schmid-Leiman transformation, and factor scores in DataSuite 2.
---

# Exploratory factor analysis & principal component analysis

The **Factor analysis** module discovers latent structure in a set of variables. It supports both Principal Component Analysis (PCA) and nine Exploratory Factor Analysis (EFA) extraction methods, with orthogonal and oblique rotations. A three-step workflow walks you through choosing settings, determining the right number of factors, and running the full extraction with loadings, diagnostics, and optional factor scores. Once the structure is clear – a single dimension or several – you can take the items to [IRT analysis](./irt-analysis.md) for item-level modelling, including multidimensional IRT.

> **PCA vs. EFA – which do I need?** Both reduce many variables down to a smaller set of dimensions, but they answer different questions. PCA creates *components* – weighted combinations of your original variables that capture maximum variance. It's a data-reduction technique: "I have 20 survey items and want to summarize them with fewer scores." EFA extracts *factors* – hypothetical latent variables that explain why your items are correlated. It's a theory-building technique: "I think there are a few underlying traits driving the responses – what are they?" In practice, PCA and EFA often give similar results, but if you're developing a psychological scale or testing theoretical structure, EFA is the better choice.

1. [Select your variables](./getting-started.md#choosing-variables) (at least 3 numeric)
2. Pick a [correlation type, extraction method, and rotation](#step-1-method--settings)
3. Set the [factor range](#configuration) and toggle [parallel analysis / scree plot](#configuration) options
4. Click **Analyze & determine factors** to check [data suitability and compare solutions](#step-2-determine-number-of-factors)
5. Set the number of factors, toggle [output options](#output-options)
6. Click **Run full analysis** for [loadings, diagnostics, and scores](#step-3-run-full-analysis)

## Requirements

At least 3 numeric variables must be selected. Categorical variables are automatically excluded; any that you selected are listed as **Excluded (non-numerical)** in the results, so you can see exactly what was dropped.

There is also a ceiling on how many factors you can ask for, and it differs by method. For PCA it is the number of variables – you can extract as many components as you have variables. For EFA it is the **Ledermann bound**, which is noticeably tighter – 6 variables allow at most 3 factors, 10 allow 6, 20 allow 14. The three factor-count fields carry that ceiling as their own upper limit, so the spinners stop there and a value left over from a wider selection is clamped when you change variables or extraction method. Asking for more anyway – by typing it – is rejected by [Step 2](#step-2-determine-number-of-factors) and [Step 3](#step-3-run-full-analysis) with a message naming the computed maximum for your variable count.

> **Why EFA stops earlier than PCA.** A correlation matrix on *p* variables contains only *p*(*p* − 1)/2 distinct numbers, and the common-factor model has to pay for every loading and every unique variance out of that budget. Past the Ledermann bound it is estimating more parameters than the matrix determines, so infinitely many solutions fit equally well and the one you get is arbitrary. R doesn't refuse – it returns numbers with zero or negative degrees of freedom – which is exactly why the app blocks the request instead. PCA has no such limit: components are computed directly from the matrix rather than estimated, and all *p* of them are well defined – at *p* components the decomposition is lossless, reproducing the data exactly with 100% cumulative variance.

## Step 1: Method & settings

Three settings control how the analysis is run.

### Correlation type

| Type | When to use |
|---|---|
| **Pearson** | Continuous, roughly normally distributed variables (default) |
| **Spearman** | Continuous variables with non-linear relationships or outliers |
| **Mixed (polychoric/polyserial)** | Ordinal variables (e.g. Likert scales), or a mix of ordinal and continuous |

> **Why polychoric?** Standard Pearson correlations between ordinal items (1–5 Likert scales) underestimate the true relationships because they treat the discrete responses as continuous. Polychoric correlations estimate what the correlation *would be* if the underlying trait were measured continuously. For questionnaire data, Mixed is usually the most appropriate choice.

Under **Mixed**, each pair is estimated with the method that matches the two variables' measurement levels – and "ordinal" here means the type you set in the data view, not something inferred from the values. Two-category items are the case worth knowing about: they pair with other ordinal items through tetrachoric (which is what polychoric reduces to at two categories) and with continuous ones through biserial, following `psych`'s own convention for a dichotomy. A binary item left typed as continuous is correlated with plain Pearson instead, which is rarely what you want.

The ordinal estimators also have a ceiling of 8 distinct values – `psych`'s own limit, and the point past which categorical and continuous treatments converge anyway. A variable typed ordinal but carrying more categories than that (a 0–10 slider, say) is treated as continuous for the pair rather than stopping the analysis. If *no* selected variable reaches an ordinal estimator – all continuous, all above the ceiling, or a mix of the two – there is nothing polychoric left to compute, so the run falls back to ordinary Pearson correlations and an alert on the results card says so, rather than letting you read Pearson output as though it were polychoric.

### Extraction method

| Method | Description |
|---|---|
| **Principal Components (PCA)** | Not factor analysis – extracts components that maximize total variance. No model fit statistics. |
| **Maximum Likelihood (ML)** | Assumes multivariate normality. Produces a chi-square test and fit indices for model evaluation. |
| **Principal Axis Factoring (PA)** | Iteratively estimates communalities. No distributional assumptions. A solid default for EFA. |
| **Minimum Residual (MINRES)** | Minimizes off-diagonal residual correlations. Robust and widely recommended. |
| **Unweighted Least Squares (ULS)** | Similar to MINRES. Minimizes the sum of squared residuals. |
| **Weighted Least Squares (WLS)** | Weights residuals by the inverse of their variance. |
| **Generalized Least Squares (GLS)** | Similar to ML but more robust to non-normality. |
| **Minimum Chi-Square (MINCHI)** | Minimizes sample-size-weighted chi-square. |
| **Minimum Rank (MINRANK)** | Minimizes the rank of the residual correlation matrix. |
| **Alpha Factoring** | Maximizes the generalizability (alpha reliability) of the factors. |

When PCA is selected, the bifactor-family rotations (**Bifactor** and **Biquartimin**) and the Schmid-Leiman transformation are disabled. Oblique rotations stay available – see the note under [Rotation method](#rotation-method). So does the [extraction method comparison](#extraction-method-comparison): it compares your component solution against common-factor extractions rather than being withheld, which is the robustness check the literature actually asks of a PCA solution.

> **Which extraction method?** For most situations, MINRES or PA are safe defaults – they make no distributional assumptions and handle typical data well. Use ML when your data are approximately normal and you want formal fit tests (chi-square, RMSEA, CFI). If ML fails to converge (common with non-positive definite matrices), switch to MINRES or PA. ML, Alpha Factoring and Minimum Rank are the three methods that refuse a non-positive definite matrix outright – the rest let the app smooth it and carry on, though a severely non-definite matrix can still defeat one of them (WLS in particular), in which case you get the same named diagnosis rather than a raw R error.

### Rotation method

Rotation makes the factor solution easier to interpret by redistributing variance across factors.

**Orthogonal** – factors remain uncorrelated:

- **Varimax** (default) – maximizes the spread of high loadings within each factor. The most common choice.
- **Quartimax** – maximizes the spread of high loadings within each variable. Tends to produce one dominant general factor.
- **Equamax** – a compromise between Varimax and Quartimax.
- **Varimin**, **Geomin T**, **Bentler's invariant T** – less common alternatives.
- **Bifactor** – extracts a general factor plus specific group factors. If you expect 3 content dimensions, set the number of factors to 4 (one general + three specific). Requires at least 3 factors – a general factor plus 2 or more group factors (as does Biquartimin, its oblique counterpart) – so with fewer than 3 the analysis stops with an error; the same guard applies in the [extraction method comparison](#extraction-method-comparison). See [Schmid-Leiman transformation](#schmid-leiman-transformation) for a related approach.

**Oblique** – factors are allowed to correlate:

- **Oblimin** – the most common oblique rotation.
- **Promax** – a fast approximation of oblique rotation, starting from a Varimax solution.
- **Quartimin**, **Simplimax**, **Cluster**, **Geomin Q**, **Bentler's invariant Q**, **Biquartimin** – less common alternatives.

**None (unrotated)** – raw extraction results with no rotation applied.

> **Orthogonal vs. oblique:** if you expect your factors to be correlated (which is almost always true in psychology – anxiety and depression correlate, extraversion and sociability correlate), use an oblique rotation. It produces more realistic results and doesn't force an artificial independence. If factors turn out to be uncorrelated, oblique rotation will show near-zero factor correlations and the result will look like Varimax anyway. When in doubt, start with Oblimin.

> **Oblique rotation under PCA.** Every rotation except **Bifactor** and **Biquartimin** is available for PCA too. Unrotated components are orthogonal by construction, but nothing forces the *rotated* ones to stay that way – obliquely rotated principal components are standard practice (SPSS offers Direct Oblimin and Promax under PC extraction), and the app reports a component correlation matrix and a [structure matrix](#structure-matrix-oblique-rotations-only) for them just as it does for EFA. The bifactor family is the exception: it models a general factor alongside variable-specific variance, which components don't have.

## Step 2: Determine number of factors

Before running the full analysis, this step helps you decide how many factors or components to extract. It analyses data suitability and compares solutions across a range.

### Configuration

- **Factor/component range to test** – minimum (default: 1) and maximum (default: 6). The maximum must not exceed the [ceiling for your method and variable count](#requirements) – the number of variables for PCA, the Ledermann bound for EFA.
- **Run parallel analysis** (on by default) – compares your eigenvalues against randomly generated data. The number of random datasets drawn is the [**Parallel analysis draws**](./settings.md#parallel-analysis-draws) setting (default 100)
- **Show scree plot** (on by default)
- **Show per-variable MSA** (off by default) – sampling adequacy for each individual variable

Click **Analyze & determine factors** to run.

### Data suitability tests

A summary table with five checks:

- **Kaiser-Meyer-Olkin (KMO)** – overall sampling adequacy, ranging from 0 to 1. Higher is better.

| KMO | Interpretation |
|---|---|
| ≥ 0.90 | Marvelous |
| ≥ 0.80 | Meritorious |
| ≥ 0.70 | Middling |
| ≥ 0.60 | Mediocre |
| ≥ 0.50 | Miserable |
| < 0.50 | Unacceptable |

- **Bartlett's test of sphericity** – tests whether the correlation matrix differs from an identity matrix. A significant result (p < 0.05) means your variables are sufficiently correlated for factor analysis.
- **Correlation matrix determinant** – very small values (< 0.00001) suggest multicollinearity, which can cause estimation problems. The value and Field's threshold are always reported, but the *Multicollinearity detected* verdict and the alert beneath the table need a second, independent finding to agree with them – a redundant variable, a pair correlating above \|r\| = 0.9, or a variable with SMC > 0.99. See the note below for why. A companion alert names any individual variable pair correlating above \|r\| = 0.9. The two are complementary and either can fire on its own: the determinant grades redundancy across the whole matrix but names no variables, while the pair alert points at the two items to drop or merge – and a single near-duplicate pair in an otherwise healthy set often leaves the determinant comfortably above its bar. [Step 3](#diagnostics-and-warnings) runs the same pair check again.
- **Smallest eigenvalue** – the lowest eigenvalue of the correlation matrix, reported as *Matrix is positive definite* or *Matrix is not positive definite*. The verdict is graded against a small numerical tolerance rather than a bare zero, so a vanishingly small positive eigenvalue still reads as non-definite – see the note below.
- **Cases-to-variables ratio** – how many complete cases you have per variable, reported as *Adequate*, *Below the recommended 5:1* (ratio under 5), or *Sample too small* (fewer than 50 cases, which takes precedence). An alert beneath the table repeats the verdict when either check fires, so you learn the sample is thin here rather than after Step 3.

> **What do these tests tell me?** KMO measures whether the partial correlations among variables are small – if they are, the variables share common factors and factor analysis makes sense. Bartlett's test checks the bare minimum: are the variables correlated at all? If KMO is below 0.50, factor analysis is probably not appropriate for your data. If Bartlett's test is not significant, your variables may be too independent to yield meaningful factors.

If the "Use interpretation" [setting](./settings.md#significance-formatting) is enabled, the KMO, determinant, smallest-eigenvalue and cases-to-variables rows carry the verbal verdicts shown above; with it off, those rows report the numbers alone. The alerts beneath the table – an inadequate KMO, a non-significant Bartlett test, redundant variables, multicollinearity, high-correlation pairs, non-positive-definite, smoothed matrix, near-perfectly predicted variables, and sample size – appear either way. That matters most for the first two: KMO below 0.50 and a non-significant Bartlett test are the verdicts on whether your data are factorable at all, and with interpretation switched off the alert is the only place either one is spelled out.

> **Why the determinant needs a second opinion.** A correlation matrix's determinant shrinks geometrically with the number of variables whatever the data look like – at a uniform r = 0.3 it is about 3.1e-4 with 30 variables and 1.2e-5 with 40. Field's < 0.00001 rule of thumb is a fixed bar, so on the 40–60 item pools factor analysis routinely runs on, it is crossed by *every* dataset, redundant or not. The app therefore reports the number and the threshold but withholds the verdict unless one of the diagnostics that doesn't depend on the item count agrees – rank deficiency, a \|r\| > 0.9 pair, or an SMC above 0.99. When you see a tiny determinant and no alert, that is the app saying the small value is a size effect rather than evidence of redundancy.

> **Variables the rest of the set already predicts.** Beside the five checks, the card flags any variable whose squared multiple correlation with all the others exceeds 0.99 – it is almost perfectly reconstructible from the rest of your selection. That practically guarantees a [Heywood case](#diagnostics-and-warnings) in the extracted solution, so the alert appears here rather than only after Step 3, before you spend a parallel-analysis run on a solution that can't come out usable. Drop or combine the named variables and re-run.

> **Perfect correlations make KMO unreliable.** If two or more variables are perfectly or almost perfectly correlated, the correlation matrix is singular and the KMO and MSA statistics stop being trustworthy – KMO's own formula can even return a clean-looking 0.5 on a singular matrix. When that happens the suitability card marks the KMO and per-variable MSA values *Unreliable (singular matrix)*, names the offending pair(s), and still reports the determinant, Bartlett's test, and smallest eigenvalue so you keep the diagnostics that remain valid. Drop one variable from each flagged pair and re-run.

> **Redundancy no pair can show you.** A variable doesn't have to duplicate *one* other variable to break the matrix – it only has to be reproducible from a **combination** of them. Analyse a questionnaire's subscale scores together with the totals built from them, or include a variable that is the sum or difference of two others, and every pairwise correlation can sit comfortably below 0.9 while the matrix is still exactly singular. The card checks for this directly and reports the matrix's **rank**: when it comes out below the number of variables, a **Redundant variables detected** alert names each redundant variable and the variables it is reproduced from, written as `Total ← Item A, Item B, Item C`. Remove one variable from each group – usually the composite or total score, keeping its components – and re-run. This is the alert to act on first, because on a singular matrix nothing else in the card is measuring what it claims to: KMO and every MSA fall back to a placeholder 0.5, Bartlett's test returns NaN, and the extraction methods that can't smooth stop before fitting.

> **Why the other alerts go quiet on a singular matrix.** The near-perfectly-predicted-variables check and the per-variable MSA table both need the correlation matrix inverted, and on a singular one that inversion fails. The values that come back are not measurements – they are the statistics package's fallbacks, and they mislead in both directions: a variable that is an exact sum of five others can be reported with a *low* squared multiple correlation while genuinely healthy variables are flagged instead. So when the matrix can't be inverted the card withholds those two, along with the anti-image partial correlations, rather than printing numbers you would reasonably act on. The rank alert above names the real cause; fix that and the rest of the diagnostics become meaningful again.

> **Why the smallest eigenvalue matters here.** A correlation matrix is *positive definite* when every eigenvalue is above zero – the mathematical way of saying its correlations are mutually consistent. When one drops to zero or below, KMO, Bartlett's test and the determinant are computed on an impossible matrix and can silently come back as NaN or as a negative determinant. The check sits in this table so you see that before reading the other three numbers, and a warning appears beneath the table whenever the matrix fails it. It happens most often with **Mixed (polychoric/polyserial)** correlations, because each pair is estimated separately and nothing constrains the resulting matrix to hang together. It's usually not fatal: extraction smooths the matrix automatically for most methods, but [Maximum Likelihood, Alpha Factoring and Minimum Rank](#extraction-method) stop with an error instead – see [Diagnostics and warnings](#diagnostics-and-warnings). The test carries a small numerical tolerance rather than asking a bare "is it negative?", so a matrix whose smallest eigenvalue is positive but vanishingly small – one variable that is nearly an exact combination of the others – already counts as non-definite. That is deliberate: at that magnitude the extraction fails anyway, and the named diagnosis is more use than a raw R error. Every step grades the matrix against that same bar, so this row, the [model comparison table](#model-comparison-table) and [Step 3](#diagnostics-and-warnings) never disagree about the verdict.

> **When the eigenvalue can't tell you.** **Mixed** correlations are repaired one step earlier than the rest: if the estimated matrix comes back non-definite, it is smoothed on the spot, and the matrix the diagnostics see already has a (barely) positive smallest eigenvalue. The number in the table therefore looks fine even though the underlying pairwise estimates weren't. A separate alert beneath the table reports that, and the same alert appears above the [model comparison table](#model-comparison-table) and in the [extraction method comparison](#extraction-method-comparison) – every result computed downstream of a smoothed matrix says so.

### Per-variable MSA (optional)

A table sorted by MSA value (lowest first), showing each variable's individual sampling adequacy. Variables with MSA below 0.50 are highlighted in red, below 0.60 in yellow. Consider removing variables with MSA below 0.50 – they don't share enough variance with the other variables to contribute to a clean factor solution.

Beneath it, **Strongest anti-image partial correlations** lists the ten variable *pairs* with the largest anti-image partials, worst first, graded by absolute value against your [**Correlation strength bands**](./settings.md#statistical-thresholds) – yellow from **Moderate** (default 0.5), red from **Strong** (default 0.7). A note reports how many pairs exist in total when the list is truncated. Both tables ride the same checkbox, and both are withheld – checkbox or not – when the correlation matrix can't be inverted, because neither can be computed from it (see [Data suitability tests](#data-suitability-tests)).

> **The diagonal names the suspects, the off-diagonals name the culprits.** MSA tells you *which* variables are letting the set down; an anti-image partial tells you *why* – it is the correlation between two variables that survives after every other variable is partialled out, so a large one means those two share something no common factor accounts for. That is the pair dragging both their MSAs down, and it usually points at redundancy: two near-duplicate items, or a pair with a specific method effect (adjacent questions, reverse-worded twins) that the rest of the set doesn't share. Dropping or merging one of the pair typically lifts both MSA values at once. The full *p* × *p* matrix is in [Step 3](#anti-image-matrices); this list is here so you can act on it before committing to a factor count.

### Scree plot

An interactive chart showing eigenvalues across components. Look for the "elbow" – the point where eigenvalues drop off sharply.

The plot displays:

- **Actual eigenvalues** – blue line with hoverable data points
- **Correlation matrix** (EFA only) – muted grey line showing the eigenvalues of the *unreduced* correlation matrix. For PCA the two series are the same thing, so this line isn't drawn.
- **Elbow** – the detected elbow point is drawn as an enlarged dot, so you can see where the automatic detection landed rather than only reading the number below the chart. It sits on the series the elbow was detected on: the blue curve for PCA, the grey correlation-matrix curve for EFA
- **Kaiser criterion** – dashed red line at eigenvalue = 1
- **Empirical Kaiser** – brown dashed line: the per-position reference the empirical Kaiser criterion compares eigenvalues against. It starts above Kaiser's flat 1 and settles onto it further along
- **Hull method** – pink dashed *vertical* rule at the factor count the Hull method retains. It marks a count rather than an eigenvalue level, which is why it runs the other way from the reference lines. Drawn only when the count falls inside the displayed range
- **Simulated data (95th pct)** – purple dashed line (from parallel analysis, if enabled): the 95th percentile of the eigenvalues from multivariate-normal random data
- **Resampled data (95th pct)** – green dashed line (from parallel analysis, if enabled): the same percentile from datasets built by resampling your own data column by column, which keeps each variable's own distribution intact
- **Simulated data (mean)** and **Resampled data (mean)** – the same two nulls at their *average* eigenvalue, drawn faded because they are context rather than decision lines

> **Two nulls, two thresholds.** Parallel analysis needs a reference distribution for "what would eigenvalues this size look like if there were no structure?", and there are two reasonable ways to build one. Simulating multivariate-normal data is the classic answer (Horn, 1965); permuting your own data column by column is the answer that keeps your items' actual distributions – skew, ties, floor effects – and is the one recommended for ordinal or non-normal data (Buja & Eyuboglu, 1992). Both are computed, both get a threshold curve at full weight, and both report their own count in the recommendations. Where they disagree, the resampled count is the more conservative read for Likert-type items.

> **Read the threshold lines, not the mean ones.** The two **95th pct** curves are what the reported counts are computed against. The faded mean curves are the averages of those same distributions, drawn because they show how much spread there is between an average null eigenvalue and the decision threshold. Since a percentile always sits above its mean, reading the crossover off a mean curve suggests keeping more factors than the recommendation actually says.

Below the chart, a recommendations box summarizes seven methods:

- **Kaiser criterion** – count of factors whose *correlation matrix* eigenvalue exceeds 1 (tends to over-extract)
- **Empirical Kaiser criterion** – the same rule with the bar corrected for sampling variability and for the variance already taken by earlier factors (Braeken & van Assen, 2017). Read off the same eigenvalue series as Kaiser, and counted the way the paper defines it: factors are kept up to the *first* one that fails its reference value, not summed over every position that happens to clear it
- **Hull method** – the factor count at the elbow of the fit-versus-parsimony frontier (Lorenzo-Seva, Timmerman & Kiers, 2011). Unlike the others it is computed from fitted solutions rather than from eigenvalues, and it is omitted when that frontier has no turning point
- **Elbow method** – detected automatically using the acceleration method, on the same unreduced correlation-matrix series Kaiser reads (the label says so under EFA)
- **Parallel analysis (simulated data)** – factors with eigenvalues exceeding the 95th percentile of multivariate-normal random data (generally the most reliable method), drawn as many times as [**Parallel analysis draws**](./settings.md#parallel-analysis-draws) specifies
- **Parallel analysis (resampled data)** – the same rule against the permuted-data null instead, listed beside it whenever parallel analysis ran
- **Velicer's MAP** – the factor count with the lowest minimum average partial statistic, evaluated across the full eigenvalue spectrum down to a single factor (so it can point below the **Minimum** you set for the [range](#configuration), and above your **Maximum** too)

If some of the random draws failed – which happens on the polychoric/mixed path, where a resampled matrix can be impossible to estimate – a note beneath the recommendations reports how many of the requested draws actually produced eigenvalues. The percentiles are computed from the survivors, so a run that quietly lost half its draws would otherwise read exactly like a complete one.

> **Two eigenvalue series, and why Kaiser uses the second one.** For EFA the blue curve comes from the *reduced* correlation matrix – the one with squared multiple correlations replacing the 1s on the diagonal, which is what factor extraction actually works on. Kaiser's rule, though, is "keep factors above the average eigenvalue", and that average is 1 only for a correlation matrix with its unit diagonal. Applied to the reduced series, a flat cutoff of 1 is a much stricter bar than Kaiser intended and often recommends 0 factors on perfectly reasonable data. So the Kaiser count and the blue row highlight read the grey correlation-matrix series instead, while the curve and the **Eigenvalue** column keep reporting what the extraction sees. The empirical Kaiser criterion and the elbow read that same grey series, for the same reason: a reduced spectrum has negative eigenvalues by construction, and Cattell's scree test was never defined on one. Each of the three labels its recommendation *(correlation matrix)* so you can see which series it came from. For PCA nothing changes – there is only one series.

> **What the empirical Kaiser criterion fixes.** Kaiser's rule keeps every factor whose eigenvalue beats 1, the average eigenvalue of a correlation matrix. That bar would be right if your data were the population – but in a finite sample the largest eigenvalue of *pure noise* already exceeds 1, by more the fewer cases you have per variable. The empirical Kaiser criterion (Braeken & van Assen, 2017) replaces the flat 1 with a reference value derived from what random data of your exact size produce: the first one is the theoretical ceiling for noise at your *n* and *p*, and each later one is rescaled by the variance the preceding factors already claimed, never dropping below Kaiser's own 1. Comparing your eigenvalues against that sliding bar instead of a flat line is what removes most of Kaiser's over-extraction – on genuinely structureless data it typically recommends 0 factors where Kaiser still finds several. It costs nothing to compute (there is no simulation involved), and it reads the same eigenvalue series Kaiser does, so the two are directly comparable line by line.

> **What the Hull method does differently.** Every other criterion here reads eigenvalues. Hull (Lorenzo-Seva, Timmerman & Kiers, 2011) actually fits every solution the model can identify – from 0 factors up to the [ceiling for your method](#requirements) – and plots how well each reproduces your correlations against how many degrees of freedom it spends doing so. Solutions that buy no extra fit over a simpler one are dropped, and of those left, the one where the curve turns most sharply wins: past it, each further factor costs more parsimony than the fit it returns. It is the same "look for the elbow" idea as the scree plot, but applied to model fit rather than to eigenvalue size, and with the elbow located arithmetically instead of by eye. The fit measure is the share of your off-diagonal correlations the solution reproduces, which involves no chi-square – so unlike RMSEA or CFI it is equally meaningful for every extraction method the module offers, PCA included. Occasionally the frontier has no turning point at all (very few variables, or fit that climbs at a steady rate); the Hull line and recommendation are then simply left out rather than reported as a guess.

> **Which recommendation should I follow?** The seven counts often disagree. Parallel analysis is considered the most accurate and is the recommended starting point – read its two nulls together, and prefer the resampled one for ordinal items – with Velicer's MAP the usual second opinion – the two are the pair most often recommended together, and MAP tends to err towards *under*-extraction where the Kaiser criterion (eigenvalue > 1) errs towards too many factors. The empirical Kaiser criterion and the Hull method are the modern corrections to the two oldest rules on the list, and both perform competitively with parallel analysis in simulation studies – treat a three-way agreement between parallel analysis, MAP and Hull as strong evidence, and prefer the empirical Kaiser count to the plain Kaiser one wherever they differ. The elbow method is subjective but useful as a sanity check. When methods disagree, try the different numbers and see which solution produces the most interpretable factors.

> **What MAP actually measures.** Velicer's minimum average partial works backwards from the usual question. After partialling out the first *k* components, it averages the squared partial correlations still left among the variables. While *k* is smaller than the true number of factors, removing another component strips out more common variance and the average keeps falling; once you pass it, further components start eating into the variables' unique variance and the average climbs again. The turning point – the minimum – is the recommendation. Because it looks at what's left over rather than at eigenvalue size, it's an independent check on parallel analysis rather than a restatement of it.

The scree plot is resizable and can be exported as SVG, PNG, or JPG using the buttons beside it (see [resizing and exporting charts](./getting-started.md#resizing-and-exporting-charts)).

### Model comparison table

A table with one row per tested factor count:

- **N** – number of factors/components
- **Eigenvalue** – for that factor number (for EFA, eigenvalues come from the reduced correlation matrix with squared multiple correlations on the diagonal)
- **λ (correlation matrix)** (EFA only) – the same position in the unreduced correlation matrix's eigenvalue series. This is the number the Kaiser highlight reads – see [Scree plot](#scree-plot)
- **Last factor %** (**Last component %** under PCA) – the share of total variance explained by the *N*-th dimension alone. Every row here is a whole solution, so this is the last factor's own contribution, not that solution's total – the next column carries the total
- **Cumulative %** – running total, and equivalently the solution's mean communality: the share of the variables' variance it accounts for. Bolded from 70% up. For PCA this approaches 100% as factors are added; for EFA it plateaus at the common-variance ceiling (sum of communalities ÷ number of variables) and will not reach 100%

For EFA methods, additional fit indices appear:

| Index | Good value | What it measures |
|---|---|---|
| **df** | > 0 | Degrees of freedom left over after the model is estimated. At 0 or below the indices in this row can't be graded – see below |
| **χ²(df), p** | Not significant | Exact-fit test for that row's model – whether it reproduces the correlation matrix within sampling error. Reads *N/A* where df ≤ 0 |
| **RMSEA** | ≤ 0.08 | How well the model approximates the population covariance matrix (lower is better) |
| **CFI** | ≥ 0.90 | Improvement over a null model where all variables are uncorrelated |
| **TLI** | ≥ 0.90 | Same as CFI but penalizes model complexity |
| **BIC** | Lowest | Bayesian information criterion – balances fit against complexity. Bolded at its minimum |
| **EBIC** | Lowest | Empirical BIC – the same trade-off, computed from the residual correlations the solution leaves behind rather than from the maximum-likelihood objective. Bolded at its own minimum, which need not be BIC's row |
| **SABIC** | Lowest | Sample-size adjusted BIC |
| **ESABIC** | Lowest | Empirical sample-size adjusted BIC |
| **SRMR** | ≤ 0.08 | Average discrepancy between observed and predicted correlations, standardized the conventional way so the cutoff applies |
| **RMS residual (psych)** | Lower | `psych`'s own root-mean-square residual. Same residuals, a different divisor, so it reads a little higher than SRMR – reported as an extra diagnostic and deliberately not graded |
| **RMS residual, df-corrected** | Lower | The same summary divided by the model's degrees of freedom instead of by the number of residuals. Also ungraded |

For both PCA and EFA:

- **Complexity** – Hoffman's complexity (1.0 = each variable loads on exactly one factor; bold if ≤ 1.2)
- **Unassigned variables** – variables whose every loading falls short of 0.3 (bold if 0 – every variable loads somewhere). That 0.3 is the conventional salience cutoff, counts inclusively, and stays fixed; it does not follow the [loadings display threshold](#loadings-matrix)
- **VSS1 / VSS2** – Very Simple Structure criterion at complexity 1 and 2 (bold for the best value)
- **MAP** – Velicer's minimum average partial. The minimum is taken over every factor count from 1 up, not just the rows you asked for, and is bolded only when it actually falls inside them – so a blank MAP column means the optimum lies outside your range, and the [scree plot](#scree-plot) recommendation names where. The two can never disagree about the recommended count
- **Interpretation** – overall fit assessment (if [interpretation](./settings.md#significance-formatting) is enabled). It reads the worst band any of **RMSEA**, **CFI**, **TLI** and **SRMR** reaches in that row, so the verdict can never claim a better fit than the cells beside it – one poor index is enough to pull "Excellent fit" down

Values that meet "good fit" thresholds are shown in bold. Rows where the correlation matrix eigenvalue exceeds 1 are highlighted in blue.

Each row's **N** cell doubles as a control: click it to carry that factor count straight into [Step 3](#step-3-run-full-analysis) instead of retyping it. The **Number of factors/components** field is filled in, the options that depend on it are refreshed, and a toast confirms the new count. Rows marked *Fitting failed* or *Not fitted* have no count worth carrying over, so their **N** cell stays a plain label.

**Complexity** and **Unassigned variables** are simple-structure diagnostics, so they are read off a rotated solution here even though the eigenvalue columns come from the unrotated fit. That is what makes them the same numbers [Step 3](#solution-quality) reports for the count you finally pick, rather than two different values under one label.

`psych`'s VSS routine cannot run under every extraction – **Alpha Factoring** always fails it. When that happens the **VSS₁**, **VSS₂** and **MAP** columns are computed with MINRES instead of being left blank, and a legend line names the substitute. MAP doesn't depend on the extraction at all, so it is unaffected; the two VSS columns describe a MINRES solution rather than the one in the rest of the row, so read them as indicative. If the substitute fails too – or under PCA, which gets no retry – all three columns are blank for every row and a legend line says why, so a missing MAP is never left looking like an omission.

If the correlation matrix wasn't positive definite and had to be smoothed – either at estimation, for **Mixed** correlations, or before fitting these solutions (see [Data suitability tests](#data-suitability-tests)) – a warning appears above the table, and the fit indices in it reflect the smoothed matrix.

[Maximum Likelihood, Alpha Factoring and Minimum Rank](#extraction-method) can't be smoothed into working, so on a non-positive-definite matrix they are not attempted at all: every row is marked *Not fitted* and a warning above the table says so. This is a fast, deliberate stop rather than a series of failures – fitting each factor count in turn would only reproduce the same error once per row, and the fit columns would be empty either way. The **Eigenvalue** and **λ (correlation matrix)** columns and the [scree plot](#scree-plot) need no fit, so they are still computed and still worth reading; the recommendations drawn from them (Kaiser, parallel analysis, MAP) stand too. Fix the matrix – the suitability card above names what to remove – or switch to MINRES or PA, which will smooth it and fit.

A solution that was attempted and couldn't be fitted is marked *Fitting failed* in its **N** cell instead of being dropped from the table. Hover the label for the underlying R message – it usually distinguishes an over-parameterized model from a rotation that doesn't work at that factor count. The label deliberately doesn't name a cause: the row that hit the iteration limit but still returned numbers is the daggered one below, and these two failures are not the same thing.

A solution that *did* return numbers but hit the iteration limit on the way is a softer case, and gets a dagger (†) beside its **N** instead. Its fit indices are shown like any other row, but they describe a model that hadn't finished settling – so don't pick a factor count on the strength of a daggered row without re-running it, and a legend line beneath the table says the same. Hover the dagger for the note.

Rows with **df ≤ 0** are treated differently: their fit indices are still shown, but nothing is bolded as "good" and the **Interpretation** cell reads *Not interpretable (df ≤ 0)*. A legend line appears whenever the table contains such a row. These solutions reproduce the correlation matrix by construction rather than by fitting it well, so a near-perfect CFI or a near-zero SRMR there says nothing about the model – see [Model fit indices](#model-fit-indices).

Whenever the extraction is anything other than **ML**, a legend line qualifies the χ²-derived columns: χ², RMSEA, CFI, TLI, BIC and SABIC all come from the same maximum-likelihood discrepancy function, whichever method produced the loadings, so under any other extraction they are less favourable approximations and the grades in the **Interpretation** column are correspondingly conservative. The same note appears under the [Step 3 fit indices](#model-fit-indices) and in the [extraction comparison](#fit-metrics-comparison), where the reasoning is spelled out in full.

> **Reading fit indices:** no single index tells the whole story. A common approach is to look for convergence – if RMSEA, CFI, and TLI all point to the same number of factors, that's a strong signal. BIC is useful for comparing models directly (lower wins). A **Cumulative %** below 40 – the same thing as a mean communality below 0.40 – suggests your factors aren't explaining enough variance in the individual variables.

> **Why two BICs, and what it means when they disagree.** Both criteria trade fit against the number of parameters; they differ in which misfit they are told to count. BIC and SABIC build on the chi-square implied by the maximum-likelihood discrepancy – the criterion **ML** is optimizing and the others are merely graded on. EBIC and ESABIC build on the chi-square implied by the residual correlations your solution actually leaves behind, which is what you can see in the data whatever extraction produced it. The two minima usually land on the same row, and when they don't – it happens often enough to be worth checking – EBIC tends to favour the larger number of factors. Read a disagreement as a genuine ambiguity in the data rather than as one column being wrong, and settle it with the other evidence in this table plus parallel analysis and interpretability.

## Step 3: Run full analysis

Once you've decided on the number of factors, enter it and click **Run full analysis**.

### Analysis configuration

- **Number of factors/components** – default 3; must be at least 1 and no more than the [ceiling for your method](#requirements) (the number of variables for PCA, the Ledermann bound for EFA)
- **Compare extraction methods** button (EFA only) – [compare multiple methods](#extraction-method-comparison) side by side
- **Kaiser normalization** – rescales every variable's loadings to unit length before rotating, then undoes the scaling afterwards. Works with every rotation the module offers; the checkbox is greyed out under **None (unrotated)** and at a single factor, the two cases where no rotation happens for it to act on. Its default follows the rotation: on for **Varimax** (matching SPSS), off for the rest – picking a different rotation resets it, so set it after choosing the rotation rather than before.

> **One factor means no rotation, whatever you picked.** Rotation redistributes variance *between* factors, so with only one there is nothing to redistribute – the fit comes back unrotated, and no factor correlation matrix or structure matrix exists either. The rotation dropdown itself stays as you left it, ready for when you raise the count, but the options that depend on a rotation actually happening – **Kaiser normalization** and **Factor/component correlations** – switch themselves off and stay unavailable while the factor count is 1, rather than being accepted and then silently ignored.

> **What normalization actually changes.** Rotation criteria are driven by the size of the loadings, so without normalization the variables the factors explain best dominate the search for simple structure and a variable with a low communality has little say in where the axes land. Normalizing gives every variable an equal vote and then restores the original scale, which typically sharpens simple structure a little – slightly lower complexity, slightly cleaner primary loadings. It never changes communalities, variance explained, or any fit index: those are the same whichever way the factors are turned. The choice is a reporting convention as much as a statistical one – SPSS normalizes for Varimax by default, which is why the app does too, and papers commonly state which they used.

### Output options

| Option | Default | Notes |
|---|---|---|
| **Loadings matrix** | On | The core output – which variables load on which factors |
| **Communalities** | On | How much of each variable's variance the factors explain – a column in the loadings table, or [a table of their own](#communalities) when the loadings matrix is switched off |
| **Variance explained** | On | How much total variance each factor accounts for |
| **Factor/component correlations** | On with an oblique rotation | Only available with an oblique rotation and at least 2 factors – for PCA as well as EFA. The box ticks itself when the row appears, since Φ is the defining output of an oblique solution; clearing it afterwards sticks |
| **Schmid-Leiman transformation** | Hidden | Only available with oblique EFA rotations (except Quartimin and Biquartimin), and only from 2 factors upwards |
| **Schmid-Leiman factor scores** | Hidden | Only available when Schmid-Leiman is enabled |
| **Confidence intervals for omega coefficients** | Hidden | Bootstrap CIs for the omega coefficients; only available when Schmid-Leiman is enabled |
| **Residual correlations** | Off | The full residual matrix – observed correlations minus the ones the solution reproduces. See [Residual correlation matrix](#residual-correlation-matrix) |
| **Anti-image correlations** | Off | Useful for diagnosing individual variable adequacy |
| **Anti-image covariances** | Off | |
| **Factor/component scores** | Off | Computes per-case scores for use in further analyses |
| **Path diagram** | Off | Visual representation of the factor structure |
| **Show values on diagram** | Hidden | Sub-option of the path diagram – appears once **Path diagram** is ticked, and is on by default. Prints the numeric loading, correlation and uniqueness values beside the lines; turn it off for a cleaner picture of the structure alone |

When factor scores or Schmid-Leiman scores are enabled, a **Scoring method** dropdown appears:

| Method | Description |
|---|---|
| **Regression** | Maximizes correlation with the factor (default) |
| **Bartlett** | Produces unbiased estimates |
| **Anderson-Rubin** | Produces orthogonal (uncorrelated) scores |
| **Ten Berge** | Reproduces the factor correlations exactly – the correlation-preserving choice |

At a single factor the dropdown is fixed to **Regression** and greyed out, with a note saying why: with one column there is nothing to weight against anything else and all four methods return identical scores, so letting you pick "Bartlett" would only mislabel the column it inserts.

Choosing **Anderson-Rubin** together with an oblique rotation shows an inline caveat under the dropdown, because the two disagree by construction. It appears only when **Factor/component scores** is ticked – Schmid-Leiman scores are computed from an orthogonal hierarchy, so there are no factor correlations for them to contradict.

> **Uncorrelated scores from correlated factors.** Anderson-Rubin scores are built to be mutually uncorrelated. An oblique solution says the factors *are* correlated, and reports how much in the factor correlation matrix – so the scores contradict the model they came from (Grice, 2001). The combination is still allowed, and it's a sensible deliberate choice when you need uncorrelated predictors for a downstream [regression](./regression-analysis.md). Just don't read correlations among the saved scores as an estimate of the factor correlations – the module reports those score correlations for you, [beneath the score coefficients](#correlations-among-the-factor-scores), precisely so you can see how far apart the two are. If you want scores that respect the model, use **Regression** or **Bartlett** – or **Ten Berge**, which is the one method whose scores reproduce the factor correlations exactly rather than merely tracking them.

**Loadings display threshold** – loadings below this absolute value are hidden in the loadings table (default: 0.3). Keeping this at 0.3 or higher reduces clutter and makes the factor structure easier to read. Typed values outside 0–1 are clamped into range, and an empty field is read as 0 (show everything). The [path diagram](#path-diagram) reads the same threshold but treats it slightly differently: sub-threshold cross-loadings are dropped, while each variable's strongest loading is always drawn – faded and dashed if it falls below the cutoff – so no variable is left floating unconnected.

### Diagnostics and warnings

The analysis checks for several potential issues before and after extraction:

| Issue | Severity | Meaning |
|---|---|---|
| Non-positive definite matrix | Error (ML, Alpha, MINRANK) | The correlation matrix has a smallest eigenvalue that is negative, or so close to zero that the matrix is numerically singular, and these three methods can't run on it. They stop before fitting; any other method that nevertheless fails on such a matrix (WLS at severe levels) gets the same message afterwards. It names the method you chose and its smallest eigenvalue, and the advice adapts: normally it points you at MINRES or PA, but when one of those is itself what failed it points at linear dependencies among your variables instead, since there is no gentler extraction left to fall back on. |
| Non-positive definite matrix | Warning (other methods) | The matrix was automatically smoothed before extraction was attempted. Any resulting solution and fit indices are based on the smoothed matrix – interpret with caution. The check runs before the fit, so this warning also appears beside an error when the extraction then fails. |
| Constant variable | Error | One or more variables take the same value in every case, so no correlation can be computed for them. The message names them; remove them from the selection. |
| Too few cases for variables | Error | With cases ≤ variables the correlation matrix is singular. Add cases or reduce variables. |
| Correlation matrix not built | Error | The matrix was never computed – usually an R package that failed to load. Check the [R console](./r-console.md) for the underlying failure. |
| Perfect correlations | Error | Variable pairs with r = 1.0. Remove one from each pair. |
| Bifactor rotation with fewer than 3 factors | Error | Bifactor and Biquartimin need a general factor plus at least 2 group factors. Extract 3 or more, or choose a different rotation. |
| Bifactor rotation under PCA | Error | Bifactor and Biquartimin model a general factor alongside variable-specific variance, which components don't have. Step 1 already greys the pair out when PCA is selected; the analysis enforces the same rule on its own, so no route into the app can reach a "general component". Switch to an EFA extraction, or choose a different rotation. |
| Ultra-Heywood case | Error (EFA) | Communality exceeds 1.0 – a serious estimation problem. Try fewer factors or a different extraction method. |
| Heywood case | Warning (EFA) | Communality near 1.0 – the model may be overfitting a variable. |
| Extraction did not converge | Warning (EFA) | The iterative extraction ran out of communality iterations before settling. The communalities – and the loadings, fit indices and factor scores derived from them – may be unstable. Try a different extraction method or fewer factors. |
| Extraction retried with SMC = FALSE | Warning (EFA) | The extraction failed from its default start – squared multiple correlations as the initial communality estimates – and was retried from unit communalities instead. What you see is that retry: a valid fit, but one that began from different starting conditions than the ones you asked for, so it isn't strictly comparable with results from other extraction methods. Only **PA** and **Alpha Factoring** are retried this way, and the [extraction comparison](#fit-metrics-comparison) rescues the same failure the same way – so a method that succeeds there is no longer a dead end here. |
| High SMC | Warning | Squared multiple correlation > 0.99 – potential Heywood case. Also raised by the [suitability card](#data-suitability-tests) in Step 2, where it costs you nothing to act on. |
| Very high correlations | Warning | Variable pairs with \|r\| > 0.9 – possible multicollinearity. |
| Near-zero determinant | Warning | The correlation matrix determinant is below 0.00001 – the same multicollinearity check the [suitability table](#data-suitability-tests) runs, repeated here because redundancy spread across several variables can be invisible to the pairwise check above and can break extraction outright. It grades that redundancy without naming anyone; the rank check below does name the variables involved, so read that one first if both fire. Consider removing or combining the redundant variables. |
| Redundant variables | Warning | The correlation matrix is rank-deficient: at least one variable is an exact linear combination of others – a total score analysed beside its own components, say. The message names each redundant variable and what it is reproduced from. This is the only diagnosis that tells you *which* variable to drop, and no pairwise correlation can see it, which is why it runs here as well as in [Step 2](#data-suitability-tests). |
| Mixed correlations degraded to Pearson | Warning | **Mixed (polychoric/polyserial)** was selected, but no variable reached an ordinal estimator – each is typed continuous or has more than 8 distinct values – so ordinary Pearson correlations were computed instead. |
| Collapsed factors | Warning (EFA) | One or more of the extracted factors carries essentially no common variance – the solution kept a factor the data don't support. Extract fewer factors. |
| Saturated model (df = 0) | Warning (EFA) | The model reproduces the correlation matrix exactly, so its fit can't be tested. Extract fewer factors for a testable model. |
| Over-parameterized model (df < 0) | Warning (EFA) | More parameters are estimated than the correlation matrix determines – the solution isn't identified. Extract fewer factors. |
| Schmid-Leiman with 1 factor | Warning | The transformation is skipped – omega hierarchical is not meaningful for a single-factor solution. The checkbox is hidden while the factor count is 1, so this is a backstop rather than a normal outcome. |
| Schmid-Leiman with 2 factors | Warning | omega constrains the two group factors' loadings *on the general factor* to be equal; three factors are required for full identification. The item-level **g** column still varies, so don't read the constraint off it. Interpret the hierarchical solution with caution. |
| Schmid-Leiman reverse-scored items | Warning | `omega()` re-keys negatively-loading items before estimating the coefficients, which is the convention published omega values follow. The warning names the items it flipped. The loadings shown are restored to their original direction, so ωh, ωt and the subscale omegas describe the re-keyed composite while the table above shows the solution as you'd read it – see [Schmid-Leiman transformation](#schmid-leiman-transformation). |
| Schmid-Leiman did not converge | Warning | The `omega()` fit ran out of iterations, so the hierarchical loadings, the omega coefficients and the variance decomposition may be unstable. It is a separate fit from the primary solution, which may be perfectly fine – this warning appears on the hierarchical card and says so. |
| Schmid-Leiman ultra-Heywood | Error | A communality above 1.0 in the hierarchical solution – inadmissible, exactly as in the primary solution. The omega coefficients and the variance decomposition are unreliable. The primary solution is a separate fit and may be unaffected. |
| Schmid-Leiman Heywood | Warning | A communality near 1.0 in the hierarchical solution – interpret omega and the variance decomposition with caution. |
| Kaiser normalization not applied to SLT | Warning | Normalization was requested but reaches only the main solution – see [Schmid-Leiman transformation](#schmid-leiman-transformation). |
| Schmid-Leiman ran a different extraction | Warning | MINCHI was requested, but the transformation falls back to MINRES – see [Schmid-Leiman transformation](#schmid-leiman-transformation). |
| Schmid-Leiman factor scores failed | Warning | The hierarchical scores could not be computed, so that table is absent while the transformation above it stands. As with ordinary scores the message names the likely cause for the method you picked: **Bartlett** and **Anderson-Rubin** are the ones that usually fail here – within each item block, the Schmid-Leiman general column is nearly proportional to that block's group column by construction, which is exactly the collinearity those two can't handle – so switch to **Regression**. |
| Omega CIs could not be bootstrapped | Warning | The bootstrap confidence intervals for the omega coefficients failed; the point estimates are unaffected. |
| Anti-image matrices failed | Warning | The anti-image correlations/covariances could not be computed, so those tables are absent. The rest of the solution is unaffected. |
| Factor scores failed | Warning | The scores could not be computed, so that section is absent while the rest of the solution stands. Typical of **Bartlett** and **Anderson-Rubin** scoring on collinear loadings – switch to **Regression**. If **Regression** is what failed, the message says so instead and points at the multicollinearity diagnostics, since regression scoring inverts the correlation matrix and a near-singular one defeats it too. |
| No clear general factor (bifactor) | Warning | No column loads broadly enough with a consistent sign to be the general factor, so columns are left unlabeled – identify the general factor manually from the loadings. |
| Small sample size | Info | Fewer than 50 observations. Factor analysis typically needs 100+. |
| Low observations-to-variables ratio | Info | Ratio below 5:1 – results may be unstable. |

Everything that fires is collected into a **Diagnostics & warnings** section on the results card. The Schmid-Leiman entries above are the exception: whenever the [hierarchical card](#schmid-leiman-transformation) is rendered, they move into a diagnostics section of its own, beside the omega coefficients and the variance decomposition they qualify.

The same section appears when the analysis fails outright. Everything checked before the failure – multicollinearity, high SMC, very high correlations, a smoothed matrix, sample size – is reported alongside the error rather than discarded, and it usually names the reason the extraction couldn't run. The error card also lists the **Excluded (non-numerical)** variables, exactly as a successful run does: when a selection is quietly reduced to fewer variables than you thought you gave it, that is often the explanation for the failure staring back at you.

> **Heywood cases:** when a variable's communality reaches or exceeds 1.0, the model is claiming to explain more than 100% of that variable's variance – which is impossible. This usually means you're extracting too many factors, or one variable is nearly a perfect linear combination of others. Try reducing the number of factors, or check whether you have near-duplicate variables. The check applies to EFA only: a Heywood case is a common-factor pathology, and PCA has no unique variance to squeeze to zero. At the maximum number of components the decomposition is exact, so a communality of 1.0 there is the right answer, not a symptom.

### Model fit indices

A summary table showing:

- **Chi-square test** (df, p-value) – tests whether the model fits perfectly. Almost always significant with large samples – see note below.
- **RMSEA** with a 90% confidence interval – how much error remains per degree of freedom. Think of it as "how wrong is the model, on average, for each relationship it tries to explain?" Excellent ≤ 0.05, good ≤ 0.08, mediocre ≤ 0.10, poor > 0.10. The interval is pinned to 90% rather than following your [**Confidence level**](./settings.md#confidence-level) setting: Browne & Cudeck's cutoffs, and every published RMSEA interval you might compare yours against, were developed on a 90% interval.
- **CFI** – how much better your model fits compared to a baseline model where all variables are uncorrelated. Ranges from 0 to 1. Excellent ≥ 0.95, acceptable ≥ 0.90, mediocre ≥ 0.85, poor < 0.85.
- **TLI** – similar to CFI but penalizes model complexity, so adding useless factors won't inflate it. Same thresholds as CFI.
- **SRMR** – average discrepancy between the correlations your model predicts and the correlations actually observed. Same thresholds as RMSEA.
- **RMS residual (psych)** and **RMS residual, df-corrected** – two more summaries of the same residuals, on their own scales. Reported for reference and not graded – see the note below.
- **Residuals > 0.05** – how many of the off-diagonal residual correlations exceed 0.05 in absolute value, as a count and a share. Field's (2018) rule of thumb is that more than half of them above 0.05 means the retained factors aren't accounting for the correlation matrix, so the row is graded on that single bar
- **BIC**, **EBIC**, **SABIC** and **ESABIC** – balance fit against complexity. Lower is better, but only meaningful when comparing different models on the same data. The two empirical variants are derived from the residual correlations rather than the maximum-likelihood objective – see [Model comparison table](#model-comparison-table), where their minima are what pick a factor count.
- **Fit** (proportion of variance) and **Off-diagonal fit**
- **Objective function** value

Interpretations appear when the [interpretation setting](./settings.md#significance-formatting) is enabled – except when the model has no residual degrees of freedom, where every interpretation cell reads *Not interpretable (df ≤ 0)* instead of a fit label. The numbers themselves are still reported.

Under PCA the section is titled **Residual fit summary** and carries only the rows that are defined for a component solution: SRMR (reported but not graded, since its cutoffs are a common-factor convention), **RMS residual (psych)**, **Residuals > 0.05**, **Fit** and **Off-diagonal fit**. A note under the table explains the omissions – a component solution isn't fitted by minimizing a discrepancy function, so χ², RMSEA, CFI, TLI and the information criteria have nothing to measure there. What remains is the one question that *is* well posed: how much of the correlation matrix the retained components leave unreproduced.

Under any extraction other than **ML**, a note beneath the table qualifies the χ²-derived rows – χ², RMSEA, CFI, TLI, BIC and SABIC. `psych` reports them for every method, but they come from the maximum-likelihood discrepancy function that only ML is actually minimizing, so for the other eight extractions they are systematically less favourable approximations and the grades against the cutoff bands read more harshly than the solution deserves. The [extraction comparison](#fit-metrics-comparison) explains the mechanism in full.

> **Three residual numbers, and why only one is graded.** All three summarize the same thing – how far the correlations your model implies sit from the ones your data actually show – and differ only in what they divide that total by. The published SRMR cutoffs, and the [**Model fit cutoffs**](./settings.md#statistical-thresholds) setting that encodes them, were written for one particular divisor, and the row labelled **SRMR** is the one using it. That row is the only one graded, and it is the one to report. `psych` computes two variants of its own with different divisors, which land at slightly different values for the same model; they are kept so the output matches what you would see running `psych::fa()` yourself, but grading them against the SRMR bands would measure them with a ruler built for a different scale, so the app doesn't.

> **Why a saturated model looks like a perfect fit.** Fit indices measure how much of the observed correlation matrix your model fails to reproduce. When df = 0 the model has exactly as many free parameters as the matrix has information, so it reproduces the matrix perfectly no matter what the data look like – and when df < 0 it has more than enough. CFI near 1.00 and SRMR near 0 in those rows are arithmetic, not evidence. The app withholds the fit verdict there and shows a warning naming the condition; to get a testable model, extract fewer factors. The [Ledermann bound](#requirements) is exactly the count at which df reaches 0, so the top of the allowed EFA range always sits on this boundary.

> **Chi-square is almost always significant.** With large samples (N > 200), even tiny deviations from perfect fit produce significant chi-square values. Don't reject a model just because chi-square is significant – look at RMSEA, CFI, and TLI instead.

### Solution quality

Three summary numbers for the solution you actually ran – the same ones the [model comparison table](#model-comparison-table) reports for each candidate (mean communality under its **Cumulative %** heading), so you can see whether the count you settled on kept its promise:

- **Mean communality (h²)** – the average share of a variable's variance the factors explain. Below 0.40 on average means the factors aren't accounting for much of the individual variables
- **Mean complexity** – Hoffman's complexity averaged across variables. 1.0 means each variable loads on exactly one factor; higher values mean cross-loading
- **Variables with no salient loading** – how many variables fail to reach a loading of 0.3 on any factor. 0 is what you want

> **Salience is not the display cutoff.** This count uses the conventional 0.3 salience threshold and stays fixed no matter what you set as the [loadings display threshold](#loadings-matrix). Lowering the display threshold reveals more numbers in the loadings table but doesn't change how many variables count as unassigned – the two answer different questions, one about what's worth showing and one about whether a variable found a home at all.

### Variance explained

A table with one row per factor/component:

- **SS Loadings** – sum of squared loadings (the factor's "strength")
- **Proportion var** – percentage of the *total* variance of all variables that this factor explains
- **Cumulative var** – running total of the above
- **Proportion explained** – percentage of the variance the solution *actually explains* that this factor accounts for
- **Cumulative explained** – running total of the above; the last row is 100% by construction

A legend below the table restates which denominator each pair uses, and adds one more line under an oblique rotation. In a bifactor or Schmid-Leiman solution the rows are labelled the way the [loadings table](#loadings-matrix) labels its columns – **g** for the identified general factor, the rest renumbered – so the two tables on the same card never name the same factor differently.

> **What an oblique SS loadings column actually counts.** When factors are allowed to correlate, each factor's SS loadings value sums its pattern coefficients weighted by the structure coefficients (Σ pattern × structure), so it measures the variance that factor accounts for *including* what it shares with the factors it correlates with, rather than its own unique contribution. That is worth knowing when you compare two columns to each other – neither number is exclusive to its factor. What it does *not* mean is that the table over-counts: the columns still sum exactly to the total common variance, so the last **Cumulative var** cell is precisely the sum of the communalities divided by the number of variables, oblique or not.

> **Two denominators, two questions.** The first pair divides by everything – all the variance in all your variables – and answers "how much of my data does this factor capture?". The second divides only by what the model explains, and answers "of the structure the solution found, how much belongs to this factor?". In PCA the gap is modest. In EFA it is often large, because the common factor model only ever targets shared variance: with an average communality around 0.4, a perfectly sound 3-factor solution shows a **Cumulative var** well under 50% while **Cumulative explained** reaches 100%. Read the first pair against the "how much did I capture" guideline below; read the second to see how the explained structure is distributed across factors.

> **How much variance is enough?** In PCA, a common (rough) guideline is 60–70% cumulative variance. In EFA, the focus is on interpretability rather than a variance threshold – a 3-factor solution explaining 45% of variance is fine if the factors make theoretical sense. Don't add factors just to push the number higher.

### Loadings matrix

The loadings table is the core output – it shows how strongly each variable relates to each factor. Under an oblique rotation its heading reads **Factor loadings (pattern matrix)** (or **Component loadings (pattern matrix)**), naming the quantity explicitly rather than leaving you to infer it from the [structure matrix](#structure-matrix-oblique-rotations-only) further down; under an orthogonal rotation the two coincide and the heading stays **Factor loadings**.

Interactive controls above the table let you adjust:

- **Cutoff threshold** – loadings below this value are hidden (default: 0.3)
- **Highlight threshold** – loadings at or above this value are shown in bold (default: 0.6)
- **Sort by** – "Original order" or "Highest loading" (groups variables by their primary factor). In a bifactor solution the general factor is left out of that decision – it loads on nearly everything, so sorting by it would put every variable in one group – and variables group by their strongest *group* factor instead, matching how the [path diagram](#path-diagram) arranges them

Click **Update table** after changing controls. Both thresholds are clamped to 0–1, and a field left empty is read as 0. If a [path diagram](#path-diagram) is on screen, it is redrawn at the new cutoff too, so the two views never disagree about which loadings are hidden.

Each row is one variable, each column is one factor/component. If communalities are enabled, a final column shows each variable's communality (values below 0.40 are flagged in yellow). A communality that couldn't be computed at all reads *N/A* in red – an unknown value, not a poor one.

For bifactor rotations, the column that loads broadly across the variables with a consistent sign is identified as the general factor and labeled "g"; the remaining columns are numbered F1, F2, ... If no column qualifies as a clear general factor, every column is left numbered (F1…Fn) and a warning notes that the general factor could not be identified automatically.

> **Reading the loadings:** a loading is the correlation between a variable and a factor. Values above 0.40 are usually considered meaningful, above 0.60 strong. A variable that loads strongly on one factor and weakly on others has a clear identity – it "belongs" to that factor. A variable that loads moderately on two or more factors (cross-loading) is ambiguous and may need to be removed or reconsidered.

> **What is communality?** Communality (h²) is the proportion of a variable's variance explained by all the extracted factors combined. High communality (> 0.60) means the factors capture that variable well. Low communality (< 0.40) means the variable is mostly unique – the factors don't account for it. Consider removing low-communality variables and re-running the analysis.

A legend below the table explains the formatting.

### Communalities

With **Loadings matrix** on, communalities ride in that table as its final column and this section isn't drawn. With the loadings matrix off, they get a table of their own instead, so the **Communalities** checkbox does something whichever way the loadings checkbox is set:

- **Communality (h²)** – the share of the variable's variance the factors explain, flagged in yellow below 0.40 and in red when it couldn't be computed, exactly as in the loadings table
- **Uniqueness (u²)** – the complementary share, 1 − h², that the factors leave unexplained. Under PCA the column is headed **Unexplained variance** instead: a component model has no unique-variance parameter, so the quantity is simply the share of the variable the retained components don't reproduce, not an estimated uniqueness

### Structure matrix (oblique rotations only)

With an oblique rotation, a second table appears below the loadings matrix: the zero-order correlations between variables and factors (pattern loadings × factor correlations). It uses the same display threshold as the loadings matrix.

> **Pattern vs. structure:** with correlated factors, the pattern matrix (the main loadings table) shows each variable's *unique* relationship with a factor, controlling for the other factors. The structure matrix shows the *total* correlation, including what flows through the factor correlations. Structure values are typically larger, and the gap grows with the factor correlation – standard EFA reporting includes both.

### Path diagram

A visual representation of the factor structure:

- **Factors/Components** – blue ellipses on the left (PC1, PC2... for PCA; F1, F2... for EFA). A bifactor general factor is an orange "g", drawn on the opposite flank – see below
- **Variables** – grey rectangles in the next column along (long names are truncated; hover for full name)
- **Arrows** – representing loadings:
  - For EFA, pointing from factors to variables; for PCA, from variables to components (see below)
  - Blue for positive loadings, red for negative – the same diverging pair the [correlation](./correlation-analysis.md) graphs use for signed associations, chosen over red/green so the sign stays readable with red-green colour vision deficiency
  - Thickness proportional to loading strength
  - Straight lines for primary loadings, curved for cross-loadings
  - In a bifactor solution, the general factor's connections are drawn dashed and faded, so the fan of lines radiating from **g** stays distinguishable from the group factors' loadings
  - Numeric loading values are shown beside each connection, in that connection's own colour (darkened so small text stays legible) – where several fans pass through the same region, a label can be traced back to the line it belongs to. Untick **Show values on diagram** to drop the labels when a busy solution makes them more clutter than information; hovering a line still reports its value either way
  - Only loadings above the cutoff are shown. The diagram follows the [loadings table](#loadings-matrix)'s cutoff control – change it there, click **Update table**, and the diagram is redrawn to match
  - The one exception is each variable's strongest loading, which is always drawn – faint and dashed when it falls below the cutoff. That loading is what put the variable in that factor's row, so hiding it would leave the node floating under a factor with nothing to explain why. Cross-loadings below the cutoff stay hidden as intended
- **Error terms** (EFA only) – small circles on the far right, one per variable, carrying that variable's uniqueness (u² = 1 − h²): the share of its variance the factors don't account for. Hover a circle for the value.
- **Factor correlations** (oblique rotations) – curved double-headed arrows connecting factors on the left side, labelled *Factor correlation* in the legend, and coloured on the same blue/red sign scale as the loadings

The legend under the diagram names every line style in use, and only those in use: the dashed *General factor loadings* entry appears whenever a bifactor or hierarchical solution is drawn, *Residual variance (u²)* whenever the orange error circles are, the formative-arrows key (*Arrows run variables → components*) only under PCA, and *Primary loading below the cutoff* only when a faint dashed line was actually drawn – on a diagram where every primary loading cleared the cutoff, the entry stays out rather than describing something that isn't there. Under an oblique rotation its heading reads *Loadings (pattern):* rather than *Loadings:* – the arrows carry pattern coefficients, exactly as the [loadings table](#loadings-matrix) heading says, and an exported SVG travels without the page around it to make that clear.

**Bifactor and hierarchical solutions flank the general factor.** Where a general factor is identified – a bifactor rotation, or the [Schmid-Leiman transformation](#hierarchical-path-diagram) – **g** loads directly on *every* variable, so it is placed to the right of the variable column while the group factors stay on the left. The two fans then approach the variables from opposite sides instead of sharing one corridor and crossing in it. Error terms give up their column to make room: in these layouts each variable's error circle sits on a short 45° stub off its own top-right corner. Everything else – plain EFA, PCA, CFA, and a bifactor solution whose general factor [couldn't be identified](#loadings-matrix) – keeps the ordinary factors → variables → errors columns.

> **Why the PCA arrows point the other way.** In EFA the factors are latent causes: the model says a factor produces the observed scores, so the arrow runs factor → variable and each variable gets an error term for the part no factor explains. A principal component is the opposite – it's a weighted sum *of* the variables, computed from them rather than causing them. So the PCA diagram draws variable → component and has no error terms, because a component leaves nothing unexplained by construction. (`psych`'s own `fa.diagram` draws both the same way; DataSuite deliberately differs here.)

The path diagram is resizable and can be exported as SVG, PNG, or JPG using the buttons beside it (see [resizing and exporting charts](./getting-started.md#resizing-and-exporting-charts)). Exported files are named after the kind of diagram – `factor_path_diagram`, `component_path_diagram`, `bifactor_path_diagram`, `schmid_leiman_path_diagram` – so a run that draws two of them doesn't produce two identically named downloads.

### Factor/component correlations (oblique rotations only)

A symmetric matrix showing correlations between all factors, labelled the way the [loadings table](#loadings-matrix) labels its columns (so a bifactor solution's general factor reads **g** here too). The diagonal displays 1 in muted text, formatted to the same precision and decimal separator as every other cell.

> **High factor correlations:** if two factors correlate above 0.70, they may not be distinct enough to justify separate factors. Consider extracting one fewer factor, or using a [Schmid-Leiman transformation](#schmid-leiman-transformation) to separate the general and specific variance.

### Anti-image matrices

- **Anti-image correlation matrix** – the diagonal contains per-variable MSA values, shown in bold and graded on the same six-tier Kaiser scale as the overall [KMO](#data-suitability-tests): green from 0.70 (*middling* and above), yellow from 0.50 (*mediocre*, *miserable*), red below 0.50 (*unacceptable*). A legend under the table restates the six tiers. The off-diagonals are negated partial correlations and should be near zero; they are graded by absolute value against your [**Correlation strength bands**](./settings.md#statistical-thresholds) – yellow from **Moderate** (default 0.5), red from **Strong** (default 0.7) – so the problem pairs stand out without reading the whole grid. [Step 2](#per-variable-msa-optional) can list the worst of them on their own, before you pick a factor count.
- **Anti-image covariance matrix** – same layout without the MSA color coding.

> **N/A cells on a non-positive-definite matrix.** The anti-image is derived from the raw correlation matrix, so when that matrix isn't positive definite (common with **Mixed** correlations) some entries – including diagonal MSA values – can't be computed and are shown as *N/A* rather than a misleading number. A note under the table flags this when it happens.

> **What are anti-image matrices?** The anti-image of a correlation is the part of the variance that *can't* be predicted from the other variables. Small anti-image correlations (off-diagonal) mean the variables share a lot of common variance – good for factor analysis. Large values suggest a variable is too unique to fit the common factor model.

### Residual correlation matrix

Ticking **Residual correlations** adds the pair-by-pair form of the count in the fit table: for every pair of variables, the correlation you observed minus the one the solution reproduces. It is drawn as a lower triangle with an empty diagonal, and cells above 0.05 in absolute value are highlighted, graded on the value as printed.

> **The check that doesn't depend on an index.** Fit indices summarize the residuals into one number; this table shows you where they are. A solution can post an acceptable SRMR while leaving two particular items badly under-reproduced – and those two are usually a method effect, a reverse-worded pair, or a dimension the factor count missed. Read the highlighted cells as a shortlist of pairs to explain, and the **Residuals > 0.05** row as the overall verdict: more than half above the bar means the retained factors aren't accounting for the matrix (Field, 2018).

### Factor/component scores

A preview of the first 10 cases (or all of them, if fewer) with computed scores for each factor/component. A note shows the total number of scored cases and the scoring method used.

A **score determinacy** line beneath the preview reports each factor's ρ – the correlation between the scores the module computed and the true (but unobservable) factor scores. Higher is better: ρ ≥ 0.90 is the preferred bar and shows in green, ρ ≥ 0.80 is the accepted minimum and shows in yellow, anything lower in red. The value is computed from the scoring weights of the method you actually selected (Grice, 2001), so it grades the scores in the table above rather than the solution in the abstract – switching between **Regression**, **Bartlett**, **Anderson-Rubin** and **Ten Berge** changes it, and the gaps widen under an oblique rotation.

The line is not drawn for PCA. Components are exact weighted sums of the observed variables, so they are perfectly determined by construction and ρ would read 1.000 for every component – a constant that says nothing about your data.

> **Why determinacy matters.** Factor scores are estimates, not the latent values themselves, and for the same solution different scoring methods can rank the same cases differently. Determinacy says how tightly the estimated scores track the real ones: near 1.0 the scores are almost interchangeable with the latent variable, but a low value means two cases with very different true standings can still land on similar scores – so treat the saved scores, and anything built on them, with care. It is reported as the coefficient ρ rather than its square, because that is the scale Gorsuch's and Grice's ≥ .80 / ≥ .90 rules are written on and what other software prints as "factor determinacy" – so the number here is directly comparable with a published one (Grice, 2001).

The **Case** column gives each row's real position in the original dataset, not its position in the preview – and not its position in the filtered subset either, if a [case filter](./getting-started.md#filtering-cases) is active. If listwise deletion dropped rows with missing data, these numbers are non-consecutive – a preview reading 1, 3, 4, 5, 6, 11… tells you at a glance that cases 2 and 7–10 were excluded.

Click **Insert scores into dataset** to add the scores as new variables:

- PCA: PC1, PC2, ... (with method suffix for Bartlett or Anderson-Rubin)
- EFA: F1, F2, ... (same convention)

If variables with those names already exist, you'll be prompted to confirm overwriting. Cases with missing data receive NA values, and the scores land on the rows they were computed from even when listwise deletion shortened the working dataset.

Output cards stay on screen after the data changes, so the button records the shape of the dataset the scores were computed against. If you filter cases, transform variables or reload data and then come back to an older card, the insert is refused with a message asking you to re-run – silently writing scores onto rows they no longer describe is the one failure that wouldn't announce itself.

> **What are factor scores?** Each case (row) in your data gets a score on each factor, representing where that person or observation falls on the latent dimension. For example, in a personality questionnaire, a high F1 score might mean high extraversion. Inserting scores into the dataset lets you use them in further analyses – as predictors in [regression](./regression-analysis.md), for [clustering](./cluster-analysis.md), or for group comparisons.

### Factor/component score coefficients

Directly beneath the scores preview, on the same **Factor/component scores** checkbox, sits the coefficient matrix those scores were built from – SPSS calls it the *Factor Score Coefficient Matrix*. One row per variable, one column per factor (F1, F2… – PC1, PC2… under PCA).

Read each column as a recipe: standardize every variable (mean 0, SD 1), multiply each by its coefficient in that column, add the results, and you have that case's score in the table above. That makes the section the reproducibility record for the scores – it is what lets a reader recompute them, or apply your scoring to a fresh sample, without re-running the extraction.

> **Coefficients are not loadings.** A loading reads from the factor to the variable: how strongly the factor expresses itself in that item. A score coefficient runs the other way – it is the weight the variable gets when the score is computed back out of the variables – so it depends on the scoring method you chose and on how the variables overlap with each other, not on the factor structure alone. A variable with a large loading can end up with a modest coefficient when another variable already covers the same ground. Report loadings to describe the structure; report coefficients to describe how the scores were made.

### Correlations among the factor scores

Below the coefficients, on the same **Factor/component scores** checkbox, a symmetric matrix gives the correlations between the scores as they were actually computed – not the [factor correlations](#factorcomponent-correlations-oblique-rotations-only) of the model. It appears whenever at least 2 factors or components were extracted, whatever the rotation or method, and the diagonal shows 1 in muted text like every other correlation matrix in the app.

Read it as a check on the scoring method you picked:

- **Anderson-Rubin** scores are orthogonal by construction, so the off-diagonals should sit at 0.00. Anything else points at a numerical problem
- **Ten Berge** scores reproduce the factor correlations exactly, so this matrix should match the [factor correlation](#factorcomponent-correlations-oblique-rotations-only) one cell for cell
- **Regression** and **Bartlett** scores are correlated but do neither. Under an oblique rotation they track the factor correlations – roughly, not exactly – and under an orthogonal rotation they will still show some correlation even though the factors have none
- A gap between this matrix and the factor correlations is normal, and its size is the useful part: the wider it is, the less the saved scores behave like the latent variables they stand in for

The matrix is shown for PCA too. Component scores are exact, so under **Regression** or **Bartlett** they simply restate the component correlations – but **Anderson-Rubin** forces them to zero against a non-zero Φ, which is exactly the contradiction the caveat under the scoring dropdown warns about, and this is where you can see it.

> **Why the scores don't reproduce the model's correlations.** Factor scores are estimates of unobservable values, and the common factor model doesn't determine them uniquely – an infinite set of score vectors is equally consistent with the same solution (Grice, 2001). Every scoring method picks one of them by a different rule, and each rule trades something away: **Regression** buys correlation with the factor at the cost of bias, **Bartlett** buys unbiasedness, **Anderson-Rubin** buys orthogonality by forcing it. The correlations you see here are a property of the estimates the rule produced, not of the factors – which is exactly why the module shows them next to [determinacy](#factorcomponent-scores) rather than asking you to assume them.

## Schmid-Leiman transformation

Available for EFA with oblique rotations (except Quartimin and Biquartimin), and requires at least 2 factors – omega hierarchical is not meaningful for a single-factor solution, so the option is hidden while the factor count is 1. The Schmid-Leiman transformation takes an existing oblique solution and re-expresses it as a hierarchy: a general factor that influences all variables plus orthogonal group factors that capture what's left over. Unlike bifactor rotation (which estimates the general and group factors simultaneously during extraction), SLT is a post-hoc decomposition – you run a standard oblique EFA first, and SLT reinterprets the correlated factors as a hierarchy.

> **When to use Schmid-Leiman:** when you find correlated factors in EFA and want to know whether there's a single overarching dimension driving them all. For example, if your anxiety, depression, and stress factors all correlate 0.50+, the Schmid-Leiman transformation can reveal a general "psychological distress" factor underlying all three, with each original factor capturing specific variance beyond the general trend.

The transformation is a **separate fit**, not a rearrangement of the loadings you already saw – it re-runs the extraction internally to build the hierarchy. Two consequences are worth knowing:

- Its solution can carry a [Heywood case](#diagnostics-and-warnings) of its own even when the primary solution is clean, or the other way round. When that happens the omega coefficients and the variance decomposition below are unreliable, and a warning says so; the primary loadings above are unaffected.
- **Kaiser normalization** does not reach it. The `omega()` function that performs the transformation doesn't pass the option on to its internal rotation, so with normalization enabled the main loadings are normalized and the hierarchical ones are not. The app warns when you request that combination – the two loading matrices are then simply scaled differently, which matters if you compare them side by side.
- **Minimum Chi-Square (MINCHI)** does not reach it either. That method needs the pairwise sample sizes, which `omega()` doesn't accept, so the hierarchy is built with MINRES instead. A warning says so when you request the combination, and the hierarchical card's own title names MINRES rather than the method you picked; the primary solution above still uses MINCHI as you asked.
- It can hit the iteration limit on its own, and says so on its own card rather than in the primary solution's diagnostics – a converged main fit next to a warning about a fit that didn't converge is a real combination, not a contradiction.

> **Items omega reverse-scores for you.** `omega()` re-keys any item whose loading on the general factor is negative before it estimates the coefficients. That is the standard convention – published ωh values are computed on the re-keyed composite, and leaving a reverse-worded item unflipped would push ωh down for a reason that has nothing to do with reliability. It does mean the coefficients and the loadings answer to slightly different things: the loadings shown are restored to their original direction, so a negative **g** loading stays negative in the table, while ωh, ωt and the subscale omegas describe the version with that item flipped. When any item is flipped a warning names it, so you can see which ones the coefficients were computed on.

### Omega reliability coefficients

| Metric | What it tells you |
|---|---|
| **Omega Hierarchical (ωH)** | Reliability attributable to the general factor. ≥ 0.80 = strong, ≥ 0.50 = moderate, < 0.50 = weak. |
| **Omega Total (ωT)** | Total reliability from all factors combined. Same thresholds as standard [reliability metrics](./reliability-analysis.md#reliability-metrics). |
| **Explained Common Variance (ECV)** | Proportion of common variance from the general factor. *Essentially unidimensional* needs ECV ≥ 0.70 **and** corroboration – either PUC ≥ 0.80, or ωH ≥ 0.70 where PUC is lower. Otherwise ≥ 0.50 = moderate multidimensionality, < 0.50 = substantial multidimensionality. |
| **Coefficient H (g)** | Construct replicability (Hancock & Mueller, 1999): how well the general factor would be recovered by an optimally-weighted composite of its own indicators – i.e. how likely it is to reappear in another study. ≥ 0.80 = well defined, ≥ 0.70 = adequately defined, below = poorly defined. |
| **Omega hierarchical subscale (ωHS)** | Reliability of each group factor *beyond* the general factor – its specific variance with g partialled out. One value per group factor. |
| **Omega subscale (ωS)** | Total reliability of each subscale, general and specific variance together. One value per group factor, shown next to its ωHS. |
| **Coefficient H F*n*** | The same replicability measure for each group factor, computed from its own column of the hierarchical loadings. |

Rows whose coefficient came back missing – which happens when a group factor collapses – are still shown, with a muted *—* in place of the value. A silently absent ωHS row would be easy to read as "that subscale is fine".

> **ECV and unidimensionality:** if the ECV is above 0.70, the scale is *probably* dominated by a single general factor – the subscales add little beyond the overall score. This matters for scoring: with high ECV, a total score is sufficient; with low ECV, subscale scores carry distinct information worth reporting separately. The verdict here won't call a solution unidimensional on ECV alone, though: below PUC 0.80 it also wants ωH ≥ 0.70 to agree, because a high ECV computed on a matrix with few uncontaminated pairs overstates the case – see the PUC note under [Variance decomposition](#variance-decomposition).

> **Read ωHS and ωS as a pair.** The two answer different questions about the same subscale, and the gap between them is the point. ωS is what you'd report as that subscale's reliability if you scored it on its own – it counts everything the items share, general factor included. ωHS strips the general factor out and keeps only what's specific to that group. A subscale with ωS = 0.85 and ωHS = 0.15 is perfectly reliable as a score, but almost all of that reliability is the general factor showing through – it isn't measuring much of anything the total score doesn't already capture, so reporting it separately adds little. A large ωHS is what justifies treating a subscale as its own construct. No interpretation labels are shown for either, since the usual reliability cutoffs were written for scores like ωS and mislead when applied to ωHS.

When **Confidence intervals for omega coefficients** is ticked (the option appears under the output options only once Schmid-Leiman is available), a **CI** column is added to the table, giving a bootstrap interval for every coefficient – the three global ones (ωH, ωT, ECV) and each subscale's ωHS and ωS. The interval is a bias-corrected bootstrap: your cases are resampled with replacement [**Bootstrap replications**](./settings.md#bootstrap-replications) times, the correlation matrix is rebuilt with your chosen correlation type on each resample, and the Schmid-Leiman solution is re-fitted to trace the coefficient's sampling distribution. The [**Confidence level**](./settings.md#confidence-level) setting sets the width and [**Bootstrap seed**](./settings.md#bootstrap-seed) makes the interval reproducible; a note beneath the table restates the level and method.

> **Bias correction, and what it doesn't fix.** A plain percentile interval reads its bounds straight off the replicate distribution, which is only right if that distribution is centred on the point estimate. Omega coefficients are bounded and typically skewed, so it usually isn't – the bias correction measures how many replicates fall below the point estimate and shifts the target quantiles by that much. It costs no extra re-fits and the bounds are still real replicate values. What it does *not* buy you is a steadier endpoint: with the default 100 replications a 95% bound still rests on a handful of the most extreme resamples, and with [**Bootstrap seed**](./settings.md#bootstrap-seed) left empty you will see it move between runs. Raise **Bootstrap replications** if you need the endpoints to settle down – the note under the table points at that setting for exactly this reason.

> **The subscale intervals need extra caution.** ωH, ωT and ECV are single numbers that don't depend on how the group factors are ordered, so their intervals are straightforward. The per-subscale ωHS and ωS are tied to specific group factors, and those factors can swap places or flip sign from one resample to the next. Each resample's group factors are realigned to the original solution before its values are pooled, but that alignment is itself an estimate – so read the subscale intervals as rougher than the global ones.

Two practical notes. The bootstrap re-fits the entire hierarchy on every replication, so it is far slower than a plain correlation bootstrap – with **Mixed (polychoric/polyserial)** correlations, where each resample also re-estimates the matrix, a run can take several minutes. The loading overlay says so while it runs, rather than a toast you'd have no chance to read.

And every interval carries its own count of usable resamples, because a resample that produced a perfectly good ωh can still have lost a group factor and returned nothing for that subscale's ωHS. A note under the table reports the worst of them, in three tiers: below 50 usable resamples the affected bounds are shown as *—* and the note is a warning; if [**Bootstrap replications**](./settings.md#bootstrap-replications) is itself set below 50, nothing failed at all and the warning simply asks you to raise the setting; and if every interval cleared 50 but some resamples were still lost, the note is informational – the bounds stand, on fewer replications than you asked for.

### Variance decomposition

A table breaking down variance into the general factor and each group factor, with proportions. A highlighted total row at the bottom.

The variance being divided up is **common** variance only, not the number of variables – so a caption under the table says so. The total is the sum of the squared general- and group-factor loadings, which is what makes the general and group rows add up to it exactly. Six items with a mean communality of 0.59 give a total of about 3.5, and every percentage in the table is a share of that total, not of the six.

> **Why the total isn't quite the sum of the communalities.** It tracks that sum closely and you can read it that way for most purposes, but the two need not agree to the last decimal. The transformation builds each variable's general loading by summing across the first-order factors *before* squaring it, so a variable that cross-loads carries cross-factor terms into that square which the group-factor residuals don't reproduce. Under clean simple structure there are no such terms and the two totals coincide; the gap grows with cross-loading, and on a typical 5-factor solution it stays within a few percent for individual items.

Beneath the caption sits the **percent uncontaminated correlations (PUC)**: the share of item pairs whose two items belong to *different* group factors. The assignment is data-driven – each item counts as belonging to the group factor it loads on most strongly, which the legend states, since PUC is normally quoted against an a priori subscale key.

> **Read PUC next to ECV.** ECV says how much of the common variance the general factor owns; PUC says how much of the correlation matrix is in a position to reveal a group factor at all. A pair of items from the same group factor is "contaminated" – its correlation carries both general and group variance, so it can't distinguish them. When PUC is low, most pairs are of that kind, and a high ECV is then partly an artifact of a matrix that had little chance to show multidimensionality. High ECV with high PUC is a genuinely unidimensional scale; high ECV with low PUC overstates the case (Rodriguez, Reise & Haviland, 2016).

### Hierarchical factor loadings

An interactive table with the same cutoff, highlight, and sort controls as the standard loadings matrix (default highlight threshold: 0.40). Additional columns:

- **g** – general factor loading
- **F1, F2, ...** – group factor loadings
- **h²** – communality (variance explained by all factors)
- **u²** – uniqueness (variance *not* explained)
- **p²** – proportion of common variance from the general factor
- **com** – complexity (1 = loads on exactly one factor)

> **Empty group factor column?** SLT redistributes variance from the oblique factors into a general factor, which can leave some group factors with very small loadings – all below the display cutoff. This means the general factor absorbed most of that group's variance, and the group factor isn't carrying meaningful specific information. You can lower the cutoff threshold to see the residual loadings, but an empty column is usually a sign you should try extracting fewer factors – the dimension that disappeared likely wasn't distinct enough to stand on its own.

### Hierarchical path diagram

Similar to the standard path diagram, but with three levels laid out so the general factor faces the group factors across the variables:

- **Group factors** – blue ellipses on the left
- **Variables** – rectangles in the middle
- **General factor "g"** – orange ellipse on the far right, loading directly on every variable
- **Error terms** – circles on short 45° stubs off each variable's top-right corner, carrying that variable's u² from the hierarchical solution
- Dashed lines connect the general factor to variables, solid curved lines connect group factors to variables

Schmid-Leiman is what turns a second-order model into direct g → variable loadings, so this diagram has to draw a one-to-all fan on top of the group factors' own fans; putting **g** on the opposite flank is what keeps the two from crossing. The [standard path diagram](#path-diagram) section describes the layout in full – a bifactor rotation is drawn the same way.

### Schmid-Leiman factor scores

Same format as standard factor scores, but includes a "g" column plus group factor columns. Click **Insert SLT scores into dataset** to create variables named SLT_g, SLT_F1, SLT_F2, etc.

The same **score determinacy** line appears beneath the preview, on the same ρ scale and the same bands. It is worth reading here in particular: the general column and each block's group column are near-proportional by construction, so hierarchical scores are usually the least determinate ones the module produces – and determinacy is part of the standard bifactor reporting set alongside ωH, ECV and PUC (Reise, Bonifay & Haviland, 2013).

## Extraction method comparison

Accessed via the **Compare extraction methods** button in [Step 3](#step-3-run-full-analysis). A dialog lets you compare multiple methods side by side to see how much the choice of extraction matters.

### Method selection

Quick selection buttons:

- **Major 3 (ML, PA, MINRES)** – the three most widely used methods
- **Select all** / **Deselect all**

Plus individual checkboxes for all nine EFA methods. At least 2 must be selected. Click **Run comparison**.

A line at the top of the dialog names the settings the comparison will inherit – the factor count from [Step 3](#analysis-configuration) and the rotation from [Step 1](#rotation-method) – because neither field is reachable while the dialog is open. Those same settings are validated *before* the dialog opens, so an unusable factor count is reported while you can still act on it rather than after you have picked your methods.

> **Comparing from a PCA solution.** The comparison is available under PCA too, and it is the check the literature asks for there: whether your component structure survives a common-factor extraction. The compared rows are all EFA methods – a component solution has no unique variances, so χ², RMSEA, TLI and the information criteria are undefined for it and it gets no row in the fit table. Instead your `principal()` solution is fitted once as the **congruence anchor**: it heads every pair in the congruence table below, and an analysis-info line on the card names it. One consequence worth knowing: every compared row goes through common-factor extraction, so the factor count is bounded by the [Ledermann bound](#requirements) even though Step 3 accepted a larger number of components. The dialog says so if you hit it.

> **ULS and MINRES barely differ.** Both minimize squared residuals; the criteria differ only in what they sum over – ULS uses the full correlation matrix, MINRES only the off-diagonals. That is a real difference, but a small one: the loadings come back numerically near-identical (typically agreeing to four or five decimals) and their congruence rounds to 1.000, so pairing them rarely adds an independent check – it mostly reads as agreement between two methods that were never really disagreeing. The dialog notes this; both options stay available.

### Fit metrics comparison

A table with one row per method, showing RMSEA, CFI, TLI, the chi-square exact-fit test (χ² with degrees of freedom and p-value), BIC, SABIC, SRMR, complexity, **Cumulative %**, and unassigned variables (counted against the same fixed 0.3 salience cutoff the [model comparison table](#model-comparison-table) uses). This comparison runs under the rotation you chose in [Step 1](#rotation-method) and the **Kaiser normalization** setting from [Step 3](#analysis-configuration), so a row whose extraction matches the one you actually ran reports the same complexity and unassigned count as the main results card – it is your solution seen from another method's angle, not a differently configured one. **Cumulative %** is the share of the variables' variance the solution accounts for, the same quantity and the same unit as the [model comparison table](#model-comparison-table)'s column of that name; under an oblique rotation it accounts for the overlap between correlated factors, so it equals the mean communality either way. The best value for each metric is shown in bold. RMSEA, CFI, TLI and SRMR are coloured on top of that, against the same absolute cutoffs the rest of the module uses – green for good or excellent, yellow for mediocre, red for poor – so you can see whether the method bolded as best actually fits, or merely fits least badly. The colouring is skipped in rows with no residual degrees of freedom, where the indices aren't gradable at all. Methods that couldn't be fitted are labelled *Fitting failed* and shown in red, with the underlying R message on hover. Methods that produced a Heywood case are flagged as cautions, and ultra-Heywood solutions (communality > 1) are marked inadmissible and excluded from the best-value bolding.

A method name marked with an asterisk (\*) was fitted on a second attempt, after the default starting values failed: only **PA** and **Alpha Factoring** can be retried this way, and the retry uses different starting conditions from every other row. Hover the asterisk for the explanation. Treat that row's metrics and its congruence coefficients as indicative rather than strictly comparable.

A dagger (†) marks a method that hit the iteration limit before converging – the same marker the [model comparison table](#model-comparison-table) uses, for the same reason. It still returned loadings, so the row is fully populated and its congruence coefficients are computed like any other; they just rest on a model that hadn't finished settling.

If the correlation matrix isn't positive definite, or was smoothed at estimation as **Mixed** matrices can be, a warning appears above the table – this dialog doesn't run the [data suitability tests](#data-suitability-tests), so it's the only place that verdict shows up here.

The legend below the table explains the bolding, and the colour key whenever at least one row has gradable fit indices. Three caveats can join them: the note about likelihood-derived indices is always shown, the asterisk note only when a row was retried, and the df ≤ 0 note only when the comparison ran at a factor count with no residual degrees of freedom.

> **ML always wins the likelihood-based columns – by construction.** χ², RMSEA, CFI, TLI, BIC and SABIC all come from the same maximum-likelihood discrepancy function, evaluated at whatever loadings each method produced. ML is the method that minimizes exactly that function, so it necessarily scores best on it; the other methods are being graded on a criterion they were never optimizing. Those six columns are a genuine likelihood-ratio statistic only for ML, and systematically less favourable approximations for everything else – so read the bolding there as "closest to the ML objective", not "fits the data best". SRMR, complexity, **Cumulative %** and the unassigned count are not ML-derived and compare cleanly across methods.

> **All rows share one df.** Every method in the comparison is fitted at the same number of factors, so they all have the same degrees of freedom. If that df is 0 or below, the fit indices in *every* row reproduce the correlation matrix by construction and carry almost no information about fit – the comparison is then only meaningful on the non-ML-derived columns and on the congruence coefficients below. A legend line flags this case; extract fewer factors for a comparison that can distinguish the methods.

### Tucker's congruence coefficients

Measures how similar the factor solutions are across methods. Congruence is pairwise, so it needs at least two methods that actually produced a solution – if fewer converged, a short note replaces the section explaining why.

A summary shows the mean, minimum and maximum congruence across method pairs, plus the lowest coefficient any single factor reached in any pair:

| Congruence | Interpretation |
|---|---|
| ≥ 0.95 | Excellent – solutions are essentially equivalent |
| 0.85–0.94 | Good – solutions are fairly similar |
| < 0.85 | Poor – solutions differ substantially |

> **Why the worst single factor gets its own line.** "Can be considered equal" is a statement about a *factor*, not about a solution (Lorenzo-Seva & ten Berge, 2006). A three-factor comparison where two factors replicate at 0.99 and the third at 0.67 has a perfectly respectable mean – and one factor that isn't the same construct in the two solutions. The fourth figure is that worst coefficient, tier-coloured like the others, so a single non-replicating factor can't be averaged out of sight.

Every pair feeds those figures regardless of its flags, so the summary qualifies itself when it has to: if a contributing pair involves a Heywood or inadmissible solution, or a method rescued by an SMC = FALSE retry, the matching caution is appended right there rather than waiting for the legend under the detailed table.

A detailed table below shows congruence for each method pair, broken down by factor, plus that pair's **Mean**. The two are computed differently on purpose, and the legend says so:

- The **F1…Fn** columns carry one shared numbering. Every method's factors are matched one-to-one against a single **reference method**, so column **F1** is the same underlying factor in every row however many methods you compared. The reference is the method whose solution is closest to all the others (the medoid), or your PCA solution when it was fitted as the [congruence anchor](#method-selection) – the legend names which
- The **Mean** column is taken over each pair's *own* best factor matching, which is what Tucker's coefficient is defined on. So a row's Mean need not equal the average of that row's cells. The summary figures above follow the same per-pair matching

Values are color-coded: green (≥ 0.95), yellow (0.85–0.94), red (< 0.85).

> **Why the columns and the mean are matched differently.** Factor numbering is arbitrary: nothing makes one method's "first" factor correspond to another's. Textbook congruence between two solutions is computed after matching *those two* – anything else reports a lower bound rather than the coefficient. But if every row used its own matching, F1 in one row would not name the factor F1 names in the next, and with three or more methods the table would stop being readable across rows. So the table does both: one shared numbering keeps the columns meaning the same thing everywhere, and each row's headline figure is the conventional pairwise statistic. On well-behaved data the two agree exactly; where they diverge, the gap is telling you the shared alignment is not that particular pair's optimum.

Coefficients are reported as absolute values, and the legend says so. The sign of a factor is an arbitrary by-product of rotation – reflecting a factor flips every one of its loadings without changing the solution at all – so similarity has to be judged sign-free. It is worth knowing if you cross-check against `psych::factor.congruence()`, which reports the raw signed coefficient and will return a large negative number where this table shows a large positive one.

Method names carry the same *Heywood case*, *Inadmissible (ultra-Heywood)* and retry-asterisk (\*) flags as the [fit metrics table](#fit-metrics-comparison) above. A row is tinted when one of its two methods hit a Heywood case – yellow – or an ultra-Heywood one – red. A retry asterisk on its own leaves the row untinted, matching how the fit metrics table grades it: an SMC = FALSE retry is a comparability caveat, not an admissibility problem, and the marker plus the legend already carry it. A legend line explains what the flags mean for the row, and appears only when at least one row is flagged. The asterisk matters as much here as it does there: a method fitted from different starting values produced a different solution, so its congruence with the others measures that too.

> **What does congruence tell you?** If different extraction methods produce nearly identical factor structures (congruence ≥ 0.95), your results are robust – the factors aren't an artifact of the chosen method. If congruence is poor, the factor structure is unstable and you should investigate why (too few observations, poorly defined factors, wrong number of factors).

> **Congruence with an inadmissible solution.** A high coefficient means the two solutions agree with each other – nothing more. If one of them has a Heywood case, agreement says both landed in the same place, not that either is trustworthy; two methods can converge on the same impossible solution. Fix the admissibility problem first (usually by extracting fewer factors), then read the congruence.

## Setting interactions

Several settings affect each other:

- Choosing **PCA** disables the **Bifactor** and **Biquartimin** rotations and the Schmid-Leiman transformation; oblique rotations, component correlations and the extraction comparison stay available
- Choosing **None (unrotated)** disables **Kaiser normalization** – there is no rotation for it to act on. Every other rotation supports it, and switching rotation resets the checkbox to that rotation's default: on for **Varimax**, off for the rest
- Setting the factor count to **1** does the same, whatever the rotation dropdown says: a single factor is never rotated, so **Kaiser normalization** is disabled and unticked and the factor/component correlations option disappears. Raising the count again restores the checkbox *and* its rotation default, so a 3 → 1 → 3 round trip doesn't quietly drop Varimax's normalization. The scoring method is pinned to **Regression** at one factor, and the Anderson-Rubin caveat stands down – with no factor correlations in the solution, there is nothing for uncorrelated scores to contradict
- Choosing an **oblique rotation** reveals the factor/component correlations output option, for PCA as well as EFA, as long as at least 2 factors are requested – and ticks it, since Φ is what makes an oblique solution oblique. Clearing it afterwards sticks
- Changing the **variable selection** or the **extraction method** re-publishes the factor-count ceiling on all three count fields and clamps anything above it
- Choosing an **oblique EFA rotation** (except Quartimin and Biquartimin) reveals the Schmid-Leiman option, as long as at least 2 factors are requested – dropping the count back to 1 hides it again
- Enabling **Schmid-Leiman** reveals the Schmid-Leiman factor scores and omega confidence interval sub-options
- Enabling any **factor scores** option reveals the scoring method dropdown
- Enabling the **path diagram** reveals **Show values on diagram** – the sub-option means nothing while there is no diagram to label. Its own tick is left alone, so switching the diagram off and back on returns the sub-option exactly as you set it

## Missing data

Missing values are handled by the global [missing data setting](./settings.md#missing-data). Factor analysis requires a complete correlation matrix, so listwise deletion can reduce your sample size if missingness is spread across many variables.

> **Sample size for factor analysis:** rules of thumb vary widely – from 50 (absolute minimum) to 10 observations per variable to 300+ for stable results. More important than any ratio is the strength of the correlations: strong, clear factors emerge even from smaller samples, while weak factors need large samples to separate from noise. The KMO test in [Step 2](#data-suitability-tests) is a better guide than any fixed rule.

## Interpretation thresholds

When [interpretation](./settings.md#significance-formatting) is enabled, result tables include plain-language labels. Key thresholds:

| Metric | Thresholds |
|---|---|
| KMO | < 0.50 unacceptable, < 0.60 miserable, < 0.70 mediocre, < 0.80 middling, < 0.90 meritorious, ≥ 0.90 marvelous |
| RMSEA / SRMR | ≤ 0.05 excellent, ≤ 0.08 good, ≤ 0.10 mediocre, > 0.10 poor |
| CFI / TLI | ≥ 0.95 excellent, ≥ 0.90 acceptable, ≥ 0.85 mediocre, < 0.85 poor |
| Communality | ≥ 0.70 high, ≥ 0.40 adequate, < 0.40 low |
| Loading | ≥ 0.60 strong, ≥ 0.40 moderate, < 0.40 weak |
| Omega Hierarchical | ≥ 0.80 strong, ≥ 0.50 moderate, < 0.50 weak general factor |
| ECV | ≥ 0.70 essentially unidimensional (with PUC ≥ 0.80, or ωH ≥ 0.70 below that), ≥ 0.50 moderate, < 0.50 substantial multidimensionality |
| Coefficient H | ≥ 0.80 well-defined construct, ≥ 0.70 adequately defined, < 0.70 poorly defined |
| Score determinacy (ρ) | ≥ 0.90 preferred, ≥ 0.80 accepted minimum, < 0.80 too indeterminate to rely on |
| Residuals > 0.05 | more than half of them means the retained factors don't account for the correlation matrix |
| Tucker's congruence | ≥ 0.95 excellent, ≥ 0.85 good, < 0.85 poor |
| Cases-to-variables ratio | < 50 cases sample too small, ratio < 5:1 below the recommended minimum, otherwise adequate |

## Reporting checklist

Key things to include when writing up factor analysis results:

**Method:**
- Extraction method (e.g. MINRES, ML, PCA) and why it was chosen
- Rotation method (e.g. Oblimin, Varimax) and why, and whether Kaiser normalization was applied
- Correlation type (Pearson, polychoric, etc.)
- How the number of factors was determined (parallel analysis, Velicer's MAP, the empirical Kaiser criterion, the Hull method, scree plot, fit indices, theoretical reasoning) – for parallel analysis, the number of draws used
- Loadings display threshold used
- Sample size and N-to-variable ratio
- How missing data were handled

**Results:**
- KMO and Bartlett's test (data suitability)
- Fit indices (RMSEA with its 90% interval, CFI, TLI – for EFA)
- The residual summary: SRMR and the count of residuals above 0.05 – the one fit statement that means the same thing for PCA and EFA
- Total variance explained
- The full loadings matrix (or at least loadings above threshold), with communalities; for oblique rotations, both pattern and structure matrices
- Factor correlations (for oblique rotations)
- If factor scores were saved: the scoring method and the per-factor determinacy ρ, which is specific to that method – and the score coefficient matrix if anyone needs to reproduce or reapply the scoring. With two or more factors, the correlations among the scores themselves are worth reporting beside the factor correlations, since readers can't derive one from the other
- Any items removed and why

**For Schmid-Leiman:** omega hierarchical, omega total, ECV, PUC and coefficient H (with the bootstrap confidence intervals if you computed them), the per-subscale ωHS and ωS pair, the hierarchical loadings matrix, and – if any item was reverse-scored by `omega()` – which ones.

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. Factor analysis uses the `psych` R package, plus `GPArotation` whenever the rotation you chose is one `GPArotation` actually performs – which is every rotation the module offers except **Varimax**, **Cluster** and **None (unrotated)**, for PCA as well as EFA, and including any rotation run by the Schmid-Leiman transformation. Those three are the only ones `psych` computes end to end by itself; the rest hand off to `GPArotation` internally even where `psych` provides the entry point. Citations for the packages actually used in your analysis appear automatically at the top of the output section, so a Varimax run cites `psych` alone while an Oblimin run cites both. Parallel analysis (when enabled) draws [**Parallel analysis draws**](./settings.md#parallel-analysis-draws) Monte Carlo null datasets, seeded by [**Reproducibility seed**](./settings.md#reproducibility-seed) – leave the seed empty for fresh null distributions each run, or set an integer for stable comparisons.

## Common pitfalls

Factor analysis is one of the most powerful tools in the behavioral sciences – and one of the most misused. A few things to keep in mind before interpreting your results:

**EFA discovers, it doesn't confirm.** EFA finds *a* structure that fits your data, but the same data can produce different structures depending on extraction method, rotation, and number of factors. Treating an EFA solution as evidence that the structure is "real" is circular reasoning. If you want to test whether a hypothesized structure holds, use [confirmatory factor analysis](./confirmatory-factor-analysis.md) – ideally on a separate sample.

**Factor labels are your interpretation, not the data's.** Naming a factor "Emotional Intelligence" because it has loadings from empathy, self-awareness, and mood regulation items is a creative act, not a statistical finding. The math only says these variables share variance – the meaning is your claim. Readers should be able to see the loadings and judge whether your label is reasonable.

**Don't use EFA as a "better correlation."** EFA models latent structure – it assumes your variables are caused by underlying factors. If you just want to know which variables are related, use a [correlation matrix](./correlation-analysis.md). Running EFA on variables with no theoretical reason to share a common cause (GDP, temperature, and shoe size) will happily produce factors, but they'll be meaningless.

**PCA components are not latent factors.** PCA is a data-reduction tool – it creates weighted composites that maximize explained variance. It doesn't model underlying causes. Interpreting a principal component as if it's a latent trait ("the first component *is* general intelligence") is a stronger claim than PCA supports. Use EFA when you want to make claims about latent constructs.

**Don't chase clean loadings.** It's tempting to keep removing cross-loading or low-communality variables until every item loads neatly on exactly one factor. But this can produce a scale that only "works" on your sample – you're fitting the noise. Remove items for substantive reasons (poor wording, theoretical misfit, floor/ceiling effects), not just because the loadings look prettier.

**Don't EFA and CFA the same data.** A common pattern in published research: run EFA, find 3 factors, then run CFA on the same dataset to "confirm" the structure. This is circular – of course CFA will fit well, you just extracted the structure from the same data. Split your sample (EFA on one half, CFA on the other) or use an independent replication sample.

**More factors isn't better.** Adding factors will always improve variance explained, just as adding predictors always improves R² in regression. The question is whether each factor captures a *meaningful* dimension. A 7-factor solution that explains 75% of variance is worse than a 3-factor solution that explains 50% if those extra factors are uninterpretable or contain 1–2 items each. Factors with fewer than 3 items are generally unstable.

**Sample-specific solutions.** Factor structures can vary across samples, cultures, and contexts. A 5-factor personality model extracted from American college students may not replicate in a clinical population or a different culture. Always report your sample characteristics and consider [extraction method comparison](#extraction-method-comparison) to check whether the structure is robust even within your own data.
