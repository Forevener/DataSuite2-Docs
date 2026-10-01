---
title: Descriptive statistics – method notes
description: Why DataSuite 2's descriptive statistics module estimates, flags, falls back and refuses what it does – the decisions behind the module.
---

# Descriptive statistics – method notes

The decisions behind the [descriptive statistics](../descriptive-statistics.md) module – which estimator stands behind each statistic, where a floor, a flag or a fallback comes from, and the numbers that validate them, each computed on the example dataset ([`cafe.csv`](../../examples/cafe.csv), its spec beside it). Sections follow the manual's.

## Presets

**Both presets keep the sample size.** A preset is a distributional choice – mean and SD against median and quartiles – and *N* is a count, not a distributional choice, so it sits in both; a preset that dropped it would take a fresh page from "N, mean, median, …" to a table with no *N* at all. The two presentation toggles are outside a preset's reach for the opposite reason: picking a preset should not silently flip the denominator or the kurtosis form.

## Configuration

### Central tendency

**The trimmed mean collapses to the median at a 50% trim.** The trim count is $\lfloor n \cdot \text{percent} / 100 \rfloor$ from each end, so at 50% on an even *n* it would remove the whole sample; the module returns the median there, matching R's `mean(x, trim = 0.5)`, and on an odd *n* the one value the trim leaves is the median already. {#trimmed-mean #trim-percentage}

*Validation.* On the café's 185 waiting times the 10% trimmed mean is 4.93, between the mean of 5.20 and the median of 4.9, and R's `mean(x, trim = 0.1)` gives the same 4.93.

**The Hodges–Lehmann pseudomedian runs through `wilcox.test` with an off-data `mu`.** `stats::wilcox.test(x, conf.int = TRUE)` returns the pseudomedian and inverts the signed-rank distribution for its interval – exact for small samples without ties, a normal approximation otherwise, R's own rule across its ecosystem – so the module hands the column to R rather than re-implementing the inversion. `wilcox.test` discards every value equal to `mu` before it estimates, and its default `mu` is 0, so a column with zeros would lose them from the pseudomedian; the call sets `mu` to the sample minimum minus 1, which nothing equals, and the estimate covers every value. A bare `wilcox.test(x, conf.int = TRUE)` can therefore differ on data with zeros, by design. {#hodges-lehmann-pseudomedian #hl-pseudomedian #hl-ci-lower-level #hl-ci-upper-level}

*Validation.* The café's waits give a pseudomedian of 4.95 with a 95% interval of 4.55 to 5.40; the mean is 5.20, the median 4.9.

### Dispersion

**The winsorized SD keeps n − 1 as its denominator and is undefined once the tails meet.** Winsorizing keeps the sample size – the extreme values are set to the boundary value, not dropped – so the sample-statistics correction is the ordinary *n* − 1 and the degrees of freedom are not reduced for the winsorized count; the population form divides by *n*. The winsorization count is $\lfloor n \cdot \text{percent} / 100 \rfloor$ per tail, and when twice that count reaches *n* the low and high cut-offs cross and the winsorized sample is a meaningless permutation, so the statistic is **N/A** – at 50% on an even *n*, never on an odd one. {#winsorized-standard-deviation #winsorization-percentage #winsorized-sd-pct-s #winsorized-sd-pct-σ}

*Validation.* The waits' 10% winsorized SD is 2.30 against an SD of 2.91.

### Shape

**Skewness and kurtosis are the bias-corrected G₁ and G₂, whatever the sample toggle.** They are the estimators Excel, SPSS, SAS and R's `e1071::skewness(type = 2)` report by default, so a value quoted from the app matches the packages a reader is likely to check it in; the sample toggle does not reach them because the normal-theory standard errors and intervals are derived for these forms, and switching the point estimate under a fixed SE would misreport the interval. *G₁* needs three observations and *G₂* four, since their correction factors divide by *n* − 2 and *n* − 3; both are **N/A** at zero variance, where the standardised moments are undefined. {#skewness #kurtosis #excess-kurtosis #report-as-excess-kurtosis}

*Validation.* The waits have a skewness of 1.27 (normal-theory SE 0.18) and an excess kurtosis of 3.42 (SE 0.36); `e1071::skewness(x, type = 2)` on the same 185 values gives 1.27.

**The bootstrap standard error and interval are flagged at different floors, and the header says "bootstrap" rather than BCa.** The two quantities rest on different machinery. The SE is the SD of the finite replicates and settles by about 50 of them, so it is flagged below 50 – which takes a small or degenerate sample, since a resample on which skewness or kurtosis is undefined is dropped. The interval reads its endpoints off replicate percentiles, which at *B* = 100 are the third and ninety-eighth order statistics, two individual replicates carrying their own Monte-Carlo error; it is flagged below 1,000 replicates, so the shipped default of 100 flags it by design, and also when the jackknife yielded fewer than two finite leave-one-out values or the BCa transform was undefined ($1 - a(z_0 + z) \le 0$) and the interval fell back to the plain percentile one. The jackknife behind the acceleration evaluates every statistic on *n* leave-one-out samples of size *n* − 1 – quadratic in *n* and bounded by no setting, about 1.3 s for two statistics at *n* = 20 000 and growing from there – so above 20 000 observations the module skips it and takes the percentile interval at once, flagged, rather than stalling the run. Because the interval can fall back to the percentile form, the column header names the method as `bootstrap`, which stays true either way, rather than `BCa`. {#bootstrap-bca #standard-error-of-skewness #standard-error-of-kurtosis #se-skewness-method #se-kurtosis-method #ci-for-skewness #ci-for-kurtosis #skew-ci-lower-level-method #skew-ci-upper-level-method #kurt-ci-lower-level-method #kurt-ci-upper-level-method}

*Validation.* On the waits with the seed at 42 and 1,000 replicates, the bootstrap SE of the skewness is 0.42 against the normal-theory 0.18, and the BCa interval 0.57 to 2.17 against the normal-theory 0.92 to 1.62 – the wider intervals are the honest ones on a variable this skewed; the kurtosis reads SE 2.02 and −0.16 to 7.60. At the shipped 100 replicates the skewness SE reads 0.45 unflagged and the interval 0.59 to 2.11 flagged.

### Summary counts

**An outlier rule whose spread is zero reports N/A, not zero.** The 1.5·IQR and 3·IQR fences are built on the IQR and the modified Z-score on the median AD, and when that spread is 0 – at least half the data at one value for the IQR, more than half at the median for the MAD – the inlier band collapses to a point and every other value is "outside" it, which is not what an outlier count means. The count and the inlier range both print **N/A** with the reason on hover, rather than a count of 0 that would read as "no outliers". {#mild-outliers-15iqr #extreme-outliers-3iqr #modified-z-outliers-m-gt-35 #inlier-range-15iqr #inlier-range-3iqr #inlier-range-modified-z}

*Validation.* On the waits the fences are −2.85 to 12.75 and flag two values, 16.3 and 19.9; the extreme fences −8.7 to 18.6 flag the 19.9 alone; the modified Z rule, on a median of 4.9 and a median AD of 2.0, draws −5.48 to 15.28 and flags the same two.

### Diversity

**Diversity on a numeric variable is flagged from 90% distinct values, and H carries no small-sample correction.** With mostly unique values H approaches ln *n* and J approaches 1 whatever the shape of the data, which reads as "perfectly even" while only restating that the values are unique; the cells are annotated once the distinct share reaches 0.9, a ratio chosen to leave counts and other low-cardinality numerics unflagged. H is the plug-in estimate, without the Miller–Madow correction the [correlation module](./correlation-analysis.md) applies to its entropies: a descriptive table reports the sample's own diversity, not an estimate of a population's. {#shannon-entropy-h #shannon-h-nats #pielous-evenness-j #pielous-j #gini-simpson-1d}

*Validation.* The waits have 82 distinct values among 185 (44%, unflagged): H = 4.25 nats, J = 0.965, 1 − D = 0.984.

### Confidence intervals

**The median interval is exact by default and interpolated on request.** The exact interval takes the order statistics *x*₍ₗ₎ and *x*₍ᵤ₎ with *l* the largest *k* at which the Binomial(*n*, 0.5) lower tail stays within α ⁄ 2, plus one, and *u* = *n* − *k*; its coverage is whatever discrete level the binomial lands on, at or above the nominal one, so it is conservative and it is **N/A** when no pair reaches the level at all. The Hettmansperger–Sheather variant interpolates between that pair and the next pair inward, with the paper's nonlinear map from the coverage shortfall to the interpolation weight – plain linear interpolation in coverage undercorrects – so it lands closer to the nominal level. The exact form is the default because it never claims more than it has; the interpolated one is offered because the median notch of the box plot draws it, so a reader can make the table and the plot agree. Both are computed in log space, so a large *n* does not underflow the binomial. {#median-ci-method #exact-order-statistics #interpolated-hettmansperger-sheather #ci-for-median #median-ci-lower-level #median-ci-upper-level}

*Validation.* On the 185 waits both constructions give 4.3 to 5.3: the exact interval is the 79th and 107th order statistics, with a coverage of 96.1%, and each is tied with its inward neighbour, so the interpolation has nothing to move.

**The SD and variance intervals are Bonett's, not the χ² pivot.** The textbook interval inverts $(n - 1)s^2/\sigma^2 \sim \chi^2(n - 1)$, which assumes normality, and the assumption is not a technicality: the coverage of the χ² interval is driven by the fourth moment of the data, so under even mild excess kurtosis a nominal 95% interval delivers noticeably less, and unlike the *t* interval for the mean it does not improve as *n* grows. Bonett's (2006) interval is a log-scale interval whose width follows the sample's own kurtosis, so its coverage survives the departures that collapse the χ² pivot's. The kurtosis estimate is taken about a trimmed centre rather than the mean – about the mean, the same tail values that should widen the interval would also inflate the kurtosis that sets its width – and the trim proportion, $1 / (2\sqrt{n - 4})$, is what needs five observations; the variance interval is the SD interval's bounds squared. Both are defined on the sample SD, so the checkboxes are disabled and cleared under population statistics. The trade is comparability: a reader recomputing the interval in another package gets the χ² one and a different pair of numbers, which is why the column headers say `Bonett` and the header tooltip repeats the reason. {#ci-for-standard-deviation #ci-for-variance #std-dev-ci-lower-level-bonett #std-dev-ci-upper-level-bonett #variance-ci-lower-level-bonett #variance-ci-upper-level-bonett}

*Validation.* The waits' SD of 2.91 has a Bonett 95% interval of 2.47 to 3.47; the χ² interval would read 2.64 to 3.24, narrower on a variable with an excess kurtosis of 3.4.

**The proportion interval is Wilson's, and "binary" means exactly two distinct non-missing values.** The Wald interval $p \pm z\sqrt{p(1 - p)/n}$ collapses to zero width at *p* = 0 or 1 and crosses the 0–1 bounds near them; the Wilson score interval inverts the score test instead, stays inside [0, 1] without clamping and holds its coverage near the boundaries. A variable qualifies when its non-missing values take exactly two distinct values, whether categorical or numeric, so 0/1 dummies get the columns in the numeric table; the reference category is the more frequent level, the first met on a tie, and the **Category** column names it so the proportion is never read for the wrong level. With one level the proportion is trivially 1 and with three or more a single proportion no longer summarises the variable, so the cells read **N/A** with the reason on hover rather than reporting the largest level's share as if it were the whole story. {#ci-for-proportion #standard-error-of-proportion #se-proportion #proportion-ci-lower-level #proportion-ci-upper-level #category #proportion}

## Reproducibility

**A seeded run derives one stream per variable, keyed on its position in the selection.** One random stream shared across the run would make a variable's bootstrap interval depend on which other variables and statistics were selected alongside it – adding a statistic to a neighbour would shift every later draw – which defeats the reproducibility a pinned [bootstrap seed](../settings.md#bootstrap-seed) is meant to buy. Each variable therefore draws from its own streams, two of them (the median's SE and the shape bootstrap), derived from the seed and the variable's index in the selection; a variable's numbers stay bit-identical when a later variable is added, and move only when the selection is reordered, since the stream follows the position. Unseeded runs share `Math.random`, where none of this applies.
