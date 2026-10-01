---
title: Correlation analysis
description: Pearson, Spearman, Kendall, polychoric, information-theoretic, Chatterjee's ξ, and other association methods with matrix and long-format output in DataSuite 2.
---

# Correlation analysis

The **Correlation analysis** module measures the strength – and, where the measure has one, the direction – of the relationship between pairs of variables. Correlate every variable against every other or pick two lists, choose from a library of association measures – classical correlations, the latent-normal family, rank and concordance measures, contingency-table, information-theoretic and general-dependence measures – or let one of two automatic presets choose per pair, and read the result as a matrix, a long-format table or a network. {#correlation-analysis}

> **What is a correlation coefficient?** One number for how two variables go together – for the classical measures from −1 (perfect opposite movement) through 0 (no relationship) to +1 – see [r](./concepts/effect-sizes.md#b-r), and [correlation and association](./concepts/association.md) for every measure the module offers, by family.

> **Signed vs. unsigned measures.** A signed measure reports a direction on the −1 to +1 scale; an unsigned one reports strength alone on 0 to 1, because a category has no direction and a curve has none a single sign could carry – see [signed](./concepts/association.md#b-signed-measure) and [unsigned measure](./concepts/association.md#b-unsigned-measure).

1. [Select your variables](#setting-up) (or leave both lists empty to correlate [all available variables](./getting-started.md#choosing-variables))
2. Choose a [correlation method](#choosing-a-method)
3. Optionally [control for covariates](#controlling-for-covariates-partial-semi-partial-correlation) (partial / semi-partial) or [test for differences](#testing-differences-between-correlations) between cells
4. Adjust [display options](#display-options)
5. Click **Calculate correlations**

## Setting up

Two variable lists sit side by side under **Variable selection (optional)**:

- **Left variables (rows)** – the variables that become the rows of the matrix
- **Right variables (columns)** – the variables that become its columns

Both lists are optional. Leave both empty to correlate every variable against every other; fill one and the other defaults to every variable the method accepts. Click to select an item, drag across several to select a run.

The lists show only the variable types the chosen method accepts and refilter when the method changes; a warning appears when no variable qualifies. The third list, **Control for (Pearson/Spearman/Kendall only)**, turns the run into a [partial or semi-partial correlation](#controlling-for-covariates-partial-semi-partial-correlation).

## Choosing a method

**Correlation method.** The select lists every measure in three groups – the signed correlations, the unsigned dependence measures and the two automatic presets – and refilters the variable lists to what the choice accepts. Each measure has a row in the tables below, saying what it needs and what it measures, and an entry saying how the module computes and reports it; the [concept page](./concepts/association.md) explains the families from zero.

> **Which method to pick?** **Pearson's r** for two continuous variables in a straight-line relationship; **Spearman's ρ** or **Kendall's τ** for ordinal data, outliers or a curved but monotone trend; the latent-normal measures when ordered answers stand for a continuum a factor model will use; **Cramér's V** or the information-theoretic family when a side is categorical; **Chatterjee's ξ** or **Distance correlation** when the scatterplot shows structure that Pearson and Spearman both miss; a **Mixed/auto** preset for one matrix over mixed types – the [guide](./concepts/guide-analysis.md) and the [catalogue](./concepts/association.md) take each choice further.

### Signed correlations (−1 to +1)

| Method | Symbol | Variable types | Measures |
|---|---|---|---|
| **Pearson's r** (default) | r | Continuous + continuous | Linear association |
| **Spearman's ρ** | ρ | Continuous or ordinal | Monotonic association, on ranks |
| **Kendall's τ** | τ | Continuous or ordinal | Ordinal association, on concordant and discordant pairs |
| **Blomqvist's β** | β | Continuous + continuous | Median-quadrant association, robust to outliers |
| **Polychoric correlation** | ρ<sub>poly</sub> | Ordinal + ordinal | Correlation of the latent continua behind two ordered variables |
| **Tetrachoric correlation** | ρ<sub>tet</sub> | Binary + binary | The 2×2 case of the polychoric |
| **Polyserial correlation** | ρ<sub>ps</sub> | Continuous + ordinal | Correlation of a continuous variable with the latent continuum behind an ordered one |
| **Somers' D** | d<sub>yx</sub> | Continuous or ordinal | Directional ordinal association, ties on the predictor dropped |
| **Goodman & Kruskal's γ** | γ | Continuous or ordinal | Ordinal association, every tied pair dropped |
| **Point-biserial** | r<sub>pb</sub> | Continuous + binary | Pearson's r with the binary coded 0/1 |
| **Biserial** | r<sub>b</sub> | Continuous + binary | Correlation with the latent continuum behind an artificial binary |
| **Phi coefficient** | φ | Binary + binary | Pearson's r on two 0/1 variables |

- **Pearson's r** – the default: two continuous variables, a straight-line relationship, and both roughly normal with no outliers pulling the line – see [r](./concepts/effect-sizes.md#b-r). The [assumptions card](#ols-diagnostics-pearson) tests the line and its residuals for every Pearson pair. {#pearsons-r #r}
- **Spearman's ρ** – Pearson's r on the ranks: any monotone relationship, straight or curved, with an outlier reduced to its rank – see [Spearman's rho](./concepts/parametric-nonparametric.md#b-spearmans-rho). Heavy [ties](./concepts/parametric-nonparametric.md#b-ties) strain its p-value, not the coefficient; the [tie-burden check](#rank-ordinal-methods-tie-burden) flags them and a [permutation p-value](#p-value-method-pearson-rank-and-ordinal-methods) is the remedy. {#spearmans-ρ #ρ}
- **Kendall's τ** – the concordant share of pairs minus the discordant, in the τ-b form that adjusts for ties on either variable – see [Kendall's tau](./concepts/parametric-nonparametric.md#b-kendalls-tau). Smaller than ρ on the same data as a rule, better behaved on small samples, and read by the tie-burden check as ρ is. {#kendalls-τ #τ}
- **Blomqvist's β** – the medial correlation: the share of cases in the same median quadrant minus the share in opposite ones, so no single value can move it – see [Blomqvist's β](./concepts/association.md#b-blomqvists-β). Continuous variables only, since a binary or a pile-up at the median leaves the quadrants ill-defined; a sanity check for a Pearson's r that a few points seem to own. {#blomqvists-β #β}
- **Polychoric correlation** – the correlation of the latent normal continua behind two ordered variables (a binary counts as a two-level one) – see [polychoric correlation](./concepts/association.md#b-polychoric-correlation). Rests on [latent bivariate normality](./concepts/association.md#b-latent-bivariate-normality), which the [assumptions card](#latent-methods-bivariate-normality) tests per pair; a pair with more than 20 levels on a side is slow to fit, and the run says so before it starts. {#polychoric-correlation #ρpoly}
- **Tetrachoric correlation** – the polychoric for two binaries: right when each binary is a cut continuum, wrong for a genuine category, where it runs larger than φ by construction – see [tetrachoric correlation](./concepts/association.md#b-tetrachoric-correlation). {#tetrachoric-correlation #ρtet}
- **Polyserial correlation** – the correlation of a continuous variable with the latent continuum behind an ordered one – see [polyserial correlation](./concepts/association.md#b-polyserial-correlation); the latent preset's choice for every continuous × ordinal pair. {#polyserial-correlation #ρps}
- **Somers' D** – the directional concordance measure: pairs tied on the predictor are dropped, pairs tied on the outcome count against it, so D(row → column) and D(column → row) differ – see [Somers' D](./concepts/association.md#b-somers-d). Built for tied ordinal data, so the tie-burden check exempts it. {#somers-d #dyx}
- **Goodman & Kruskal's γ** – concordant minus discordant over the untied pairs alone, which is why it runs larger than τ on the same data and reaches ±1 as soon as the untied pairs all agree – see [Goodman & Kruskal's γ](./concepts/association.md#b-goodman-kruskals-γ). Tie-aware by construction, like Somers' D. {#goodman-kruskals-γ #γ}
- **Point-biserial** – Pearson's r between a continuous variable and a binary coded 0/1, algebraically the two-sample t-test as a correlation – see [point-biserial r](./concepts/effect-sizes.md#b-point-biserial-r). Its p-value and interval inherit the t-test's assumptions, which the [assumptions card](#mean-comparison-methods-point-biserial-and-ε²) checks. {#point-biserial #rpb}
- **Biserial** – the point-biserial's latent cousin: the correlation with the continuum behind an *artificial* binary (a score cut at a threshold), larger than the point-biserial by construction and meaningless for a category – see [biserial correlation](./concepts/association.md#b-biserial-correlation). {#biserial #rb}
- **Phi coefficient** – Pearson's r on two 0/1 variables, the signed form of Cramér's V on a 2×2 table, with a χ² test behind its p-value – see [phi coefficient](./concepts/association.md#b-phi-coefficient). Its sign follows the coding order; the [cell-count check](#contingency-table-methods-χ²-cell-counts) flags sparse tables. {#phi-coefficient #φ}

### Unsigned dependence measures (0 to 1)

| Method | Symbol | Variable types | Measures |
|---|---|---|---|
| **Cramér's V** | V | Categorical or binary | χ²-based association, any number of levels, bias-corrected |
| **Correlation ratio (ε²)** | ε² | Categorical + continuous | Variance in the continuous variable explained by the groups, bias-corrected |
| **Normalized mutual information** | NMI | Any + any | Shared information as a share of the average entropy |
| **Adjusted mutual information** | AMI | Any + any | Shared information less its chance expectation, over the larger entropy |
| **Rajski's coherence coefficient** | C<sub>R</sub> | Any + any | Shared information as a share of the joint entropy |
| **Theil's U** | U | Any + any | Directional – the share of one side's uncertainty the other removes |
| **Hoeffding's D** | D<sub>H</sub> | Continuous or ordinal | Independence against any alternative; ties attenuate it |
| **Chatterjee's ξ** | ξ | Continuous or ordinal | Directional – how far one variable is a function of the other, monotone or not |
| **Distance correlation** | dCor | Continuous + continuous | Zero only under full independence |

- **Cramér's V** – the χ²-based measure for two categorical variables with any number of levels, reported with Bergsma's bias correction so that it can read 0 under independence – see [Cramér's V](./concepts/effect-sizes.md#b-cramérs-v). It is also what an ε² run falls back to on a pair with two grouping sides; the [cell-count check](#contingency-table-methods-χ²-cell-counts) and the [Monte-Carlo p-value](#p-value-method-contingency-table-methods) cover its sparse tables. {#cramérs-v #v}
- **Correlation ratio (ε²)** – the share of a continuous variable's variance explained by the groups of a categorical one, reported as the bias-corrected ε² rather than the raw η² and tested with the one-way F – see [correlation ratio](./concepts/association.md#b-correlation-ratio-ε²). The grouping side is a categorical variable or a numeric one with at most 10 distinct values, whichever list it sits in, so the **Left variables (rows)** list offers only those; a pair with two grouping sides falls back to Cramér's V, and a pair with none cannot be formed. {#correlation-ratio-ε² #ε²}
- **Normalized mutual information** – mutual information divided by the average of the two entropies, 0 to 1, the family's general-purpose measure – see [normalized mutual information](./concepts/association.md#b-normalized-mutual-information). Any pair of variables: a continuous side is first cut into equal-frequency bins by the [discretization rule](#discretization-bins), a categorical one coded level for level. {#normalized-mutual-information #nmi}
- **Adjusted mutual information** – mutual information with its chance expectation removed, divided by the larger entropy; below NMI on every pair, and the measure to prefer when the pairs differ widely in their number of categories – see [adjusted mutual information](./concepts/association.md#b-adjusted-mutual-information). It can read slightly below 0 under independence; the table shows the raw value and the unsigned plots clamp it at 0. {#adjusted-mutual-information #ami}
- **Rajski's coherence coefficient** – mutual information divided by the joint entropy, the strictest normalisation: 1 only for two variables that are the same up to relabelling – see [Rajski's coherence coefficient](./concepts/association.md#b-rajskis-coherence-coefficient). {#rajskis-coherence-coefficient #cr}
- **Theil's U** – mutual information as a share of one side's entropy, the directional member of the family: the row → column cell is the share of the column variable's uncertainty the row variable removes – see [Theil's U](./concepts/association.md#b-theils-u). {#theils-u #u}
- **Hoeffding's D** – the classical test of independence against any alternative, on its own small scale with its own strength bands – see [Hoeffding's D](./concepts/association.md#b-hoeffdings-d). It assumes continuous data: ties attenuate the coefficient and make its test conservative, so on ordinal data the [tie-burden check](#rank-ordinal-methods-tie-burden) flags it and the value reads as a lower bound. A sample D can dip below 0 under independence; the table shows it, the unsigned plots clamp at 0. {#hoeffdings-d #dh}
- **Chatterjee's ξ** – how far the column variable is a function of the row variable, any function: 1 under determinism, 0 under independence, directional, and on its own bands – see [Chatterjee's ξ](./concepts/association.md#b-chatterjees-ξ). Ties in the row variable are broken at random under a fixed seed, so a cell on a tied predictor is one reproducible draw from a small family of values, and a caveat under the table says so whenever a cell has them. {#chatterjees-ξ #ξ}
- **Distance correlation** – 0 if and only if the two variables are independent, on the 0–1 scale a correlation reader expects – see [distance correlation](./concepts/association.md#b-distance-correlation). Two numeric variables, no binning; the value is the square root of the bias-corrected estimator, clamped at 0, and above 3,000 complete cases it is computed on a fixed-seed subsample of that size, with the subsample as the reported N. {#distance-correlation #dcor}

### Special

| Method | Symbol | Variable types | Measures |
|---|---|---|---|
| **Mixed/auto · observed scores** | varies | All | The best observed-score measure per pair (Pearson, Spearman, point-biserial, φ, Cramér's V, ε²) |
| **Mixed/auto · latent variables** | varies | All | The latent-normal measure per pair (Pearson, polychoric, polyserial, biserial, tetrachoric, Cramér's V, ε²) |

- **Mixed/auto · observed scores** – one method per pair from the two variables' types, keeping the measures that work on the values as observed – Pearson, Spearman, point-biserial, φ, Cramér's V, ε² – for exploration and reporting on what was actually measured; the [selection table](#mixed-auto-selection-logic) has every pair type, and the results card's **Method** column says which measure each cell got. {#mixed-auto-observed-scores-pearson-spearman-point-biserial-φ-cramérs-v-ε²}
- **Mixed/auto · latent variables** – the same dispatch with the latent-normal family in the ordered and binary slots – polychoric, polyserial, biserial, tetrachoric – for a coherent matrix to feed a [factor analysis](./factor-analysis.md) or an [SEM](./structural-equation-modeling.md), where every cell should estimate the correlation of the underlying continua. Rests on [latent bivariate normality](./concepts/association.md#b-latent-bivariate-normality); the card title calls it *latent · hetcor*. {#mixed-auto-latent-variables-pearson-polychoric-polyserial-biserial-tetrachoric-cramérs-v-ε²}

### Directional (asymmetric) methods

Three measures – **Somers' D**, **Theil's U** and **Chatterjee's ξ** – answer "how well does the row variable predict the column variable?", so the matrix is not symmetric: the cell at row A, column B is a different number from the cell at row B, column A – see [directional measure](./concepts/association.md#b-directional-measure). Every cell reads **row → column** (variable 1 → variable 2 in the long table), a direction caption under the table says so whenever one of the three is active, and the **Hide redundant values** checkbox is hidden for the run, since both triangles carry different information.

### Mixed/auto selection logic

Both presets choose a method per pair from the two variables' types – continuous, ordinal, binary or categorical – and differ only where an ordered or a binary variable is involved:

| Pair type | · observed scores | · latent variables |
|---|---|---|
| Continuous × continuous | Pearson's r | Pearson's r |
| Continuous × ordinal | Spearman's ρ | Polyserial correlation |
| Continuous × binary | Point-biserial | Biserial |
| Ordinal × ordinal, ordinal × binary | Spearman's ρ | Polychoric correlation |
| Binary × binary | Phi coefficient | Tetrachoric correlation |
| Categorical × (categorical / binary) | Cramér's V | *(same as observed)* |
| Continuous × categorical | Correlation ratio (ε²) | *(same as observed)* |
| Ordinal × categorical | Cramér's V | *(same as observed)* |

> **Observed or latent?** Observed scores describe the data you have and stay valid without a normal continuum under each category; latent variables estimate the correlation of the continua a factor model is about, at the price of the [latent-normality assumption](./concepts/association.md#b-latent-bivariate-normality), which the [assumptions card](#latent-methods-bivariate-normality) tests – the [latent-normal family](./concepts/association.md#the-latent-normal-family) section says when each reading is the right one.

Categorical combinations resolve identically under both presets, and neither preset ever picks a directional method – Somers' D, Theil's U and Chatterjee's ξ need an explicit choice. When a run would fit a polychoric pair with more than 20 levels on a side – under **Polychoric correlation** or the latent preset – an advisory before the run names how many such pairs there are and what to expect; it is a heads-up, not a block, and the run stays cancellable.

## Checking assumptions

Click **Check assumptions** to run every check that applies to every pair of selected variables – not only the checks behind the method you selected – and read the result in a *Correlation assumptions* card. The pass is advisory: it never changes the coefficients **Calculate correlations** computes, and it runs without them, so the diagnostics can be read before the matrix exists. An explicit method and a Mixed/auto preset follow the same path; the selection only decides which method each pair marks as *primary*. {#correlation-assumptions}

> **No method is assumption-free.** Pearson's r leans on a straight line and an even scatter, the rank methods on few [ties](./concepts/parametric-nonparametric.md#b-ties), the latent methods on [latent bivariate normality](./concepts/association.md#b-latent-bivariate-normality) – the card checks each on the pairs it applies to; see [what an assumption is](./concepts/assumptions.md#b-assumption).

When a grouped [comparison structure](#comparison-structures) (**Between groups** or **Equality across groups**) is active with a **Compare across** variable, every check runs separately within each group, on the same row subsets the per-group analysis uses, and the card shows one **Group: …** section per group with a note on top; the pooled rows are never checked. The compare-across variable is excluded from the checked pairs, while *which* checks apply to which pair is decided on the full data, so every group section carries the same rows and columns.

### The per-pair method-suitability matrix

**Per-pair method suitability.** The card leads with a matrix – one row per variable pair, the pair-level checks as columns, each a *Pass* / *Fail* / *N/A* verdict or `–` where the check does not apply to the pair, and a **Suitable methods** column that synthesizes them. A column that would read `–` in every row is dropped, so an all-continuous run shows no group, cell-count or latent column. Hover a verdict for the numbers behind it – the test statistic, its degrees of freedom and p, the Cook's and leverage counts, the χ² cell counts with the observed zeros, or the probe's Spearman ρ and residual dCor. The checks themselves are explained by family in the sections below. {#per-pair-method-suitability}

- **Pair** – the two variables, `A × B`. In a [semi-partial](#partial-vs-semi-partial) run the residualization-sensitive checks differ by which side was residualized, so such a pair takes two rows, each labelled *(variable residualized)*. {#pair #residualized}
- **Per-pair method suitability – N** – the pair's complete (listwise) cases. Below the [small-sample advisory floor](./settings.md#assumption-advisory-thresholds) (30 by default) the **Suitable methods** cell adds a non-dropping *small sample* advisory – every coefficient is unstable and every test under-powered there, whichever method is chosen.
- **Suitable methods** – every method whose data types fit the pair, the *primary* one first – the method you selected, or the best fit for the pair under Mixed/auto – and each with the caveats its checks produced.
	- Only a failed **Linearity (RESET)** check drops a method: Pearson's r moves to a parenthetical *not met: linearity*. Every other failure keeps the method listed and names a remedy the module ships.
	- A rejected bivariate normality or homoscedasticity adds *rejected – affects the interval and p, not the coefficient; select Bootstrap CI*; influential points add *these move r itself, not only its interval; select Bootstrap CI, or Kendall's τ, which resists them*.
	- Sparse expected counts leave φ / Cramér's V listed with *the analytic χ² p is unreliable; set the p-value method to Monte Carlo*; a failed latent goodness-of-fit adds *polychoric/polyserial estimates may be biased*, and observed zero cells *estimates may sit near the ±1 boundary*.
	- Unequal group variances add *affects the pooled t/F behind the p and the interval, not the coefficient; select Bootstrap CI* – and *Somers' D for a rank-based alternative* where it covers the pair; non-normal groups add *point-biserial/ε² inference may be unreliable*.
	- Heavy ties caveat the rank methods only: Spearman and Kendall *use permutation p-values*, Blomqvist's β *interpret with caution*, Hoeffding's D *D is attenuated and its test is conservative*; γ and Somers' D take none.
	- A sparse discretized grid adds one clause per pair for the information-theoretic measures, naming the realized bins and the smallest expected count; dependence beyond the monotone trend suggests *distance correlation, mutual information, or Hoeffding's D* unless the primary method already is one of them.
	- A check that applies but could not run – a batch error, too little data – leaves the method listed with *suitability check could not be run*, so an unassessed method reads differently from a passed one.

Two notes can appear under the matrix: one when a check's rejections across the assessed pairs are no more numerous than chance produces at your [assumption-test α](./settings.md#assumption-test-significance-level) – they stay visible in their column but are not counted against any method – and one when any pair exceeds N = 5000, explaining the *N/A* normality cells.

When [control variables](#controlling-for-covariates-partial-semi-partial-correlation) are active, the OLS-family checks, the marginal-normality table and the beyond-monotone probe are computed on residuals after regressing out the controls, so every check describes the conditional relationship the partial coefficient reports; a note under the matrix says so. The controls themselves are never checked – they are covariates, not subjects – and in semi-partial mode the pair matrix carries two rows per pair and the marginal-normality table tests a variable both residualized and raw.

### OLS diagnostics (Pearson)

For every continuous pair – whichever method you selected – the card runs the diagnostics of the line Pearson's r summarizes; RESET, Breusch-Pagan and Cook's D are fitted in both regression directions, and the pair fails if either direction does:

- **Bivariate normality** – [Mardia's test](./concepts/assumptions.md#b-mardias-test) of the pair's joint skewness and kurtosis; either rejecting fails it. A failure does not drop Pearson: it widens the interval and unsettles the p, not the coefficient, so the cell advises a [bootstrap interval](#confidence-intervals). {#bivariate-normality}
- **Linearity (RESET)** – Ramsey's [RESET test](./concepts/regression-basics.md#b-reset-test) for curvature the line misses; the one failure that drops Pearson from the suitable list, since under curvature r is no longer the [linear](./concepts/assumptions.md#b-linearity) summary its name claims. Spearman captures any monotonic relationship instead. {#linearity-reset #linearity}
- **Homoscedasticity (Breusch-Pagan)** – the [Breusch–Pagan test](./concepts/regression-basics.md#b-breusch-pagan-test) of whether the scatter is [even across the range](./concepts/assumptions.md#b-homoscedasticity); like normality, a failure affects the interval and the p and advises a bootstrap interval. {#homoscedasticity-breusch-pagan #homoscedasticity}
- **Influential points (Cook's D)** – *Fail* when any case has a [Cook's distance](./concepts/outliers-missing-data.md#b-cooks-distance) above 1; the tooltip adds the counts past the size-adjusted $4/(n - p)$ cutoff and the 2p/n [leverage](./concepts/outliers-missing-data.md#b-leverage) cutoff, which inform but never decide the verdict. An [influential point](./concepts/outliers-missing-data.md#b-influential-points) moves r itself, so Pearson stays listed with a caveat naming the bootstrap interval or Kendall's τ. {#influential-points-cooks-d #influential-points}

Above N = 5000 Mardia's column reads *N/A*, and a failed RESET or Breusch-Pagan no longer counts against Pearson, adding a *nonlinearity flagged* or *heteroscedasticity flagged – … oversensitive at this N* advisory instead; Cook's D is exempt and still caveats at any size.

**Marginal normality (Shapiro-Wilk).** A table below the matrix, one row per variable in a continuous pair, with the [Shapiro–Wilk](./concepts/distributions.md#b-shapiro-wilk-test) W and p, a verdict, and three reads of shape and concentration that are computed even where W is not (N > 5000, where the W column reads *N/A*). A note fires when any variable is range-restricted. {#marginal-normality-shapiro-wilk}

- **Variable** – the variable the row tests; a residualized row in a semi-partial run is labelled *variable | controls*.
- **Normal** – the Shapiro–Wilk verdict at your assumption-test α: *Pass*, *Fail*, or *N/A* below 3 or above 5000 values.
- **Skewness** – [asymmetry](./concepts/distributions.md#b-skewness): 0 is symmetric, positive a long right tail, negative a long left one.
- **Excess kurtosis** – [tailedness](./concepts/distributions.md#b-kurtosis) relative to a normal, which sits at 0: positive means heavier tails and a sharper peak, negative lighter tails and a flatter top.
- **Max value share** – the largest share of the observations held by any single value – the concentration read behind [range restriction](./concepts/association.md#b-range-restriction).
- **Adequate spread** – *Fail* when the max value share exceeds the [range-restriction advisory threshold](./settings.md#assumption-advisory-thresholds) (0.5 by default): a judgment threshold, not a test, applied identically in the tie-burden table.

> **Reading the distribution diagnostics.** W is sample-size sensitive – it flags trivial departures at large N and misses real ones at small N – so read a *Fail* beside the skewness and kurtosis, which say *how* non-normal the data are; see [Shapiro–Wilk](./concepts/distributions.md#b-shapiro-wilk-test). A variable can pass normality and still be [range-restricted](./concepts/association.md#b-range-restriction), which shrinks the correlation regardless of shape.

### Rank & ordinal methods (tie burden)

**Tie burden.** A table below the matrix, one row per variable in a pair Spearman's ρ, Kendall's τ, Goodman & Kruskal's γ or Somers' D can take – methods that make no normality demands but whose p-values assume relatively few [ties](./concepts/parametric-nonparametric.md#b-ties). Each row carries the variable's non-missing N, the tie profile below and the same **Adequate spread** verdict as the marginal-normality table. When any variable trips the tie threshold, a note recommends [permutation p-values](#p-value-method-pearson-rank-and-ordinal-methods) for Spearman and Kendall and exempts γ and Somers' D, whose standard errors are tie-aware; a separate note fires on range restriction. {#tie-burden}

- **Distinct values** – how many different values the variable takes; a small count relative to N signals coarse, tie-prone data.
- **Tie correction Σ(t³−t)/(n³−n)** – the tie term the rank statistics' variances actually use, summed over the groups of identical values (`t` the size of each): 0 with no ties, approaching 1 as one value takes over, and near 1/k² for k equally used levels.
- **Max single-value share** – the largest share held by any one value, which surfaces a floor or ceiling pile-up even when the overall tie correction looks moderate.
- **Acceptable ties** – *Fail* when the tie correction exceeds the [heavy-ties advisory threshold](./settings.md#assumption-advisory-thresholds) (0.10 by default – three or fewer effective levels, or a strongly piled-up binary or ordinal variable; a balanced 5-point scale passes). A judgment threshold, not a test.

> **Ties strain the p-value, not the coefficient.** Spearman's ρ and Kendall's τ apply a tie correction to the statistic itself; what suffers under heavy ties is the reference distribution behind the closed-form p-value – see [ties](./concepts/parametric-nonparametric.md#b-ties). Read a heavy-tie flag as "the coefficient is fine, double-check the p-value".

### Contingency-table methods (χ² cell counts)

Phi and Cramér's V test their significance by χ², whose approximation needs adequate [expected frequencies](./concepts/assumptions.md#b-expected-frequencies). For every contingency-table pair the card builds the table on the pair's complete cases, computes each cell's expected count under independence and applies Cochran's rule; the same pass runs over discrete × discrete latent pairs, where its observed zero cells feed the [latent boundary advisory](#latent-methods-bivariate-normality).

- **Adequate expected counts** – *Fail* when any expected count is below 1 or more than 20% of the cells are below 5; the tooltip carries the smallest expected count, the cells below 5 and the observed zero cells. A failure keeps φ / Cramér's V listed – it breaks the χ² approximation behind the p-value, not the coefficient – and points at the [Monte-Carlo p-value](#p-value-method-contingency-table-methods). {#adequate-expected-counts}

> **Why expected, not observed, counts?** The χ² reference holds when the counts *expected* under independence are large enough; a cell can be empty with a healthy expected count, or the reverse – see [expected frequencies](./concepts/assumptions.md#b-expected-frequencies). A [Monte-Carlo p](./concepts/parametric-nonparametric.md#b-monte-carlo) sidesteps the approximation.

### Information-theoretic methods (discretized grid)

NMI, AMI, Rajski's coherence and Theil's U read a discretized table (see [Discretization bins](#discretization-bins)), so a sparse grid inflates the coefficient itself, not only its p. The pre-flight discretizes each pair at the rule the run will use and, when the grid's smallest expected count under independence falls below 5, adds a clause to the pair's **Suitable methods** cell naming the realized bins and the count and suggesting fewer bins or collapsed categories. It is deliberately not a verdict – no *Pass* / *Fail* column – because there is no threshold at which the measure stops being valid: the grid is a choice, and the number says what it cost. The bins are the realized ones, since equal-frequency binning keeps tied values together and a tie-heavy variable lands fewer bins than the rule asked for.

### Latent methods (bivariate normality)

Polychoric, tetrachoric, polyserial and biserial coefficients estimate the correlation of two latent continuous variables and are only right when those are [jointly bivariate normal](./concepts/association.md#b-latent-bivariate-normality) – an assumption that biases the coefficient itself, not just its p. For every latent-applicable pair the card runs the estimator's own goodness-of-fit test on the pair's complete cases:

- **Latent bivariate normality** – the likelihood-ratio χ² `polycor` computes when it fits the pair, read at your assumption-test α: *Fail* means the data are inconsistent with a bivariate-normal latent structure, and the tooltip carries χ², df and p. A saturated table – a 2×2 tetrachoric fit, or any table with no residual degrees of freedom – reads *N/A*, never *Pass*. A failure keeps the method listed with the *estimates may be biased* advisory; a discrete × discrete pair with any observed zero cell (or a failed Cochran rule) adds the *may sit near the ±1 boundary* advisory too. {#latent-bivariate-normality}

> **Why doesn't this drop the method?** For two ordinal variables no assumption-free coefficient estimates the same latent association, so the card flags the estimate and leaves it your best available read – corroborate it with a rank measure on the same pair; see [latent bivariate normality](./concepts/association.md#b-latent-bivariate-normality).

Three details of the fit are disclosed here because the check reads the same table the coefficient does. An empty cell of a 2×2 table gets the standard +0.5 correction before the tetrachoric fit; wider tables get none. Polychoric and tetrachoric fits are seeded from `polycor`'s two-step estimate, and refit by full maximum likelihood only when a fit still pins at the boundary with a non-finite variance. Their p tests ρ = 0 by a 1-df likelihood-ratio test against independence, polyserial's and biserial's by `cor.test` on the continuous side – so a very strong association can show a tiny p beside a wide delta-method interval.

### Mean-comparison methods (point-biserial and ε²)

Point-biserial and the correlation ratio (ε²) summarize how far a continuous variable's mean shifts between the levels of a discrete one, so they inherit the assumptions of the t-test and one-way ANOVA. For each such pair the card runs two diagnostics on the pair's complete cases:

- **Equal group variances** – a [Brown–Forsythe Levene test](./concepts/assumptions.md#b-brown-forsythe-test) (median-centred) of whether the continuous variable's spread is the same across the groups; the tooltip carries the F, its df and p. A *Fail* keeps point-biserial / ε² listed with the *unequal group variances* advisory, which names the bootstrap interval and, where the grouping side is numeric enough for it, Somers' D. {#equal-group-variances}

**Within-group normality (Shapiro-Wilk).** A table below the matrix with one [Shapiro–Wilk](./concepts/distributions.md#b-shapiro-wilk-test) test per (variable × group): the group's N, W, p, skewness, excess kurtosis and a *Normal* verdict (*N/A* below 3 or above 5000 cases). A rejection counts against the pair only when the rejecting group is smaller than the [small-sample advisory floor](./settings.md#assumption-advisory-thresholds) and more such groups reject than chance produces at your assumption-test α; every rejection still shows, and a note under the table says when the pair verdict discounted them. When it counts, the cell adds *non-normal within groups – point-biserial/ε² inference may be unreliable*. {#within-group-normality-shapiro-wilk}

- **Grouping** – the discrete variable whose levels define the groups.
- **Group** – the level the row tests.

> **Why are these checked like a t-test?** [Point-biserial r](./concepts/effect-sizes.md#b-point-biserial-r) is Pearson's r on a 0/1-coded group variable – algebraically the two-sample t – and the [correlation ratio](./concepts/association.md#b-correlation-ratio-ε²) is the one-way ANOVA's share of variance explained, so "is each group roughly normal, with comparable spread?" is exactly their question.

### Non-monotonic dependence (dCor cross-check)

Pearson, Spearman and Kendall see only monotonic structure; a U-shape, a cycle or an oscillation riding on a trend can leave all three small while the variables are tightly dependent. For every continuous/ordinal pair the card probes for exactly that:

- **Dependence beyond monotone (dCor screen)** – both variables are ranked, an isotonic (monotone) regression of one rank on the other – rising or falling with the pair's Spearman sign – absorbs everything a monotone measure could see, and the [distance correlation](./concepts/association.md#b-distance-correlation) of the residuals measures what is left, on the same 0–1 scale as the main coefficient. Its p is a Monte-Carlo test against a null in which the pair's dependence is purely monotone, at the pair's own margins and ties; the tooltip carries the Spearman ρ, the residual dCor and the p. *Fail* when the residual dCor is both significant at your assumption-test α and at least *very weak* in size – the lowest of the [normalized-mutual-information bands](./settings.md#statistical-thresholds), 0.05 by default – so a trivial departure in a large sample does not fire it. *N/A* when the probe cannot run (n < 4, a constant side) or when α is finer than the draws can resolve. Above 1,000 rows the probe runs on a fixed-seed subsample of 1,000, and the tooltip says so. In a [partial or semi-partial](#controlling-for-covariates-partial-semi-partial-correlation) run both inputs are first rank-residualized on the controls, so the probe tests the conditional relationship the partial coefficient reports. {#dependence-beyond-monotone-dcor-screen}

A failure never drops a method – a monotonic coefficient is not wrong, only narrower than the data may demand – and the **Suitable methods** cell adds *consider distance correlation, mutual information, or Hoeffding's D*, unless the primary method is already an omnibus dependence measure (the information family, Chatterjee's ξ, Hoeffding's D, distance correlation).

> **It is a screen, not a calibrated test.** The column header says so in its tooltip: the p comes from a finite number of simulated draws, so a flag is a prompt to open the [scatterplot](#scatterplots), not evidence at a stated significance level.

### Control-variable collinearity (partial mode)

**Control-variable collinearity.** When a [partial or semi-partial correlation](#controlling-for-covariates-partial-semi-partial-correlation) is active, a section under the matrix reads the control set two ways, on the continuous controls and targets only. Pairwise, it correlates them and flags every pair involving at least one control whose |r| exceeds 0.90 (0.71 on Kendall's τ scale) – a target–target pair is never flagged, since it does not destabilize the conditioned estimate and already shows in the main matrix – and with nothing flagged reports the largest |r| instead. Jointly, it computes each variable's [VIF](./concepts/regression-basics.md#b-vif) against the control set and lists those at or above the *severe* [VIF threshold](./settings.md#statistical-thresholds) (10 by default), or the largest VIF when none is – a control set can be near-singular as a whole while every pair clears the cutoff. A partial coefficient conditioned on near-[collinear](./concepts/regression-basics.md#b-multicollinearity) controls is unstable: drop or combine the redundant control before trusting it. {#control-variable-collinearity}

- **Variable pair** – a flagged control–control or control–target pair, with its r.
- **Role** – whether a variable listed by its VIF is a *Control* or a *Target* in the run.

## Controlling for covariates (partial & semi-partial correlation)

A third list appears under the variable lists whenever the method is Pearson's r, Spearman's ρ or Kendall's τ – the only three the module can partial – and a mode switch appears under it once a covariate is chosen.

- **Control for (Pearson/Spearman/Kendall only)** – one or more numeric covariates whose linear (Pearson) or rank (Spearman, Kendall) influence is removed from every pair before it is correlated. The list offers numeric variables only, and a chosen control leaves the matrix axes – it appears as a covariate, never as a subject of correlation. A pair needs `k + 3` cases complete on both variables and every covariate, *k* the number of covariates; a case missing any one of them is dropped from that pair. {#control-for-pearson-spearman-kendall-only #control-for}

> **Why control for a covariate?** Two variables can go together only because a third drives both – see [confounder](./concepts/regression-basics.md#b-confounder); a [partial correlation](./concepts/regression-basics.md#b-partial-correlation) is what is left once that third is held constant, and a relationship that *grows* instead is [suppression](./concepts/regression-basics.md#b-suppression).

### Partial vs. semi-partial

- **Partial (residualize both)** – the partial correlation proper: the covariates' influence is removed from *both* variables and the residuals are correlated – see [partial correlation](./concepts/regression-basics.md#b-partial-correlation). Symmetric, the default, and the answer to "how strongly are X and Y related among cases alike on Z".
- **Semi-partial (residualize row variable only)** – the [part correlation](./concepts/regression-basics.md#b-part-correlation): the covariates are removed from the **row variable** (the left-list variable) only, and the residual is correlated with the raw **column variable**. Asymmetric – the cell at row A, column B differs from the cell at row B, column A – and the answer to "how much does the row variable add to the column variable over the covariates".
- **Semi-partial (residualize column variable only)** – the mirror: only the **column variable** is residualized.

In matrix display a semi-partial run behaves like the other asymmetric methods: both triangles hold different numbers, **Hide redundant values** is forced off and a *Direction: row → column* caption is added. A semi-partial cell reports the same p as the matching partial cell – both test whether the row variable adds anything over the covariates – and differs in its coefficient and interval: a Pearson semi-partial's analytic interval and [TOST](#negligible-correlation-margin-tost) p rest on a standard error of their own, and a Spearman or Kendall semi-partial has no analytic interval at all – `–` under *Analytic*, an interval under [*Bias-corrected percentile bootstrap*](#confidence-intervals) – while its TOST runs on a bootstrap standard error computed on demand whenever a margin is set.

Every cell and every long-format row also reports the zero-order coefficient – the same correlation computed *without* the covariates on the same complete cases – under a `₀` subscript (`ρ₀` for Spearman). Read the two together: "controlling for Z, the X–Y relationship moved from ρ₀ = 0.61 to ρ = 0.18" – the gap is the confounding or suppression story – see [zero-order correlation](./concepts/regression-basics.md#b-zero-order-correlation).

### Scatterplots under a partial run

With **Scatterplots** on, a Pearson or Spearman partial run draws residual–residual scatterplots: each axis shows the variable's residuals after the covariates are regressed out (in a semi-partial mode only the residualized side), the axes carry a `| covariates` suffix – `(ranks) | covariates` under Spearman, whose residuals are residuals of ranks – the OLS line has the slope of the partial regression coefficient, the `r` in the corner is the partial coefficient from the table and the analytic band uses the partial degrees of freedom, `n − 2 − k`. A Kendall partial run is not residualized: the points and the [LOWESS smoother](./concepts/regression-basics.md#b-lowess-smoother) show the zero-order relationship, the corner labels the partial τ as conditioned (`τ | covariates`, or `τ (variable | covariates)` in a semi-partial mode) and lists beside it the zero-order τ₀ the smoother actually shows, so the marginal-to-partial gap reads off the plot. The rank-based partials follow `ppcor`'s definitions – partial Spearman as a Pearson partial on ranks, partial Kendall as a closed form on the pairwise τ's – which are the common ones but not the only ones in the literature, so a partial τ from another tool may differ.

## Partial-correlation network

A network card is an option of its own, under the **Partial-correlation network** group of the correlation options: a coefficient matrix in which every cell is the correlation between two variables with *every other variable in the network* partialled out, a centrality table and a force graph of the same numbers – the [Gaussian graphical model](./concepts/association.md#b-gaussian-graphical-model) of the psychology network literature, which answers not "are these two related?" but "are they related *directly*, or only through the rest of the set?" {#partial-correlation-network}

> **Why a network rather than a matrix of pairs?** In a plain matrix a chain X → Y → Z shows three strong correlations and nothing says X and Z meet only through Y; conditioning every edge on every other variable at once collapses the chain to two edges – see [partial-correlation network](./concepts/association.md#b-partial-correlation-network).

- **Estimate a partial-correlation network** – the checkbox that adds the card, every edge of which is the correlation between two variables with all the others partialled out, so an edge survives only where the rest of the set does not explain the association. Needs Pearson's r, Spearman's ρ or Kendall's τ and at least three variables on both axes – with two there is nothing left to partial on – and the run's [control variables](#controlling-for-covariates-partial-semi-partial-correlation) join the network as nodes rather than conditioning it from outside, since a network already conditions on everything it contains; a note on the card says so. The sample is one set of cases complete on every node – a row missing any one of them is dropped, and a note reports how many – where the rest of the module deletes pairwise. {#estimate-a-partial-correlation-network}
- **Estimator** – which of two ways of fitting the network the card holds; they answer different questions, and a report says which was used – see [graphical lasso](./concepts/association.md#b-graphical-lasso) for the choice. {#estimator}
- **Unregularised (every edge estimated and tested)** – the default: every edge is estimated and carries a p-value on `n − p` degrees of freedom, so the card is a set of hypothesis tests. Any of the three methods; the choice for a sample comfortably larger than the number of edges. {#unregularised-every-edge-estimated-and-tested #unregularised}
- **Regularised – graphical lasso, penalty chosen by EBIC** – the [graphical lasso](./concepts/association.md#b-graphical-lasso): small edges are shrunk to exactly zero and the penalty is picked by the extended BIC, so the card is a selected model – no p-values, and a missing edge is a stronger claim than a non-significant one. Pearson or Spearman only; the choice for a network large relative to *n*, or for a readable graph. {#regularised-graphical-lasso-penalty-chosen-by-ebic #regularised}
- **EBIC tuning parameter γ** – shown under the regularised estimator: how heavily the criterion penalises a denser graph, from 0 (least conservative, more edges) to 1 (most conservative, fewer); 0.5 is the conventional choice and the default. {#ebic-tuning-parameter-γ}

The card refuses a run it cannot fit and says why: fewer than three nodes, and under the unregularised estimator a node set whose correlation matrix is singular – a variable that is a combination of others – or fewer complete cases than nodes plus one, each message pointing at the regularised estimator, which handles both. Two more cases fit and warn: an unregularised network with fewer cases than the saturated model's `p(p+1)/2` parameters, unstable edge by edge, and a regularised one whose penalty landed at the end of EBIC's search grid, whose edge count is then the sparsest (or densest) the grid could express rather than an optimum.

**Partial correlations.** The card's first section is the matrix of edges, in the layout of the main matrix: every cell a partial correlation with all other nodes partialled out, with a p-value under the unregularised estimator and none under the regularised one, where a blank cell is an edge shrunk to zero. A note above it gives the cases and nodes, and the degrees of freedom or the number of selected edges with the λ and γ that selected them. {#partial-correlations}

### Centrality and communities

**Centrality and communities.** One row per node ordered by strength, between the matrix and the graph, answering which node matters most and which nodes group together; the heading reads **Centrality** alone when no partition could be found. Notes above the table say what the sums run over – every edge at its coefficient under the unregularised estimator, the selected edges only under the regularised – and how far the partition may be read. {#centrality-and-communities #centrality}

- **Node** – the variable – see [node](./concepts/association.md#b-node).
- **Community** – the group the partition put the node in, the same partition the graph's node colours carry – see [community](./concepts/association.md#b-community).
- **Strength** – the sum of the *absolute* edge weights at the node – see [strength](./concepts/association.md#b-strength).
- **Expected influence** – the same sum taken *signed*; read the two as a pair, since a node whose positive and negative edges cancel has high strength and near-zero expected influence – see [expected influence](./concepts/association.md#b-expected-influence).
- **Edges** – how many selected edges touch the node; regularised estimator only, where the count means something – see [edge](./concepts/association.md#b-edge).

Both indices are raw sums on the coefficient's own scale, not standardised across nodes; a node with no edge scores 0 on both by construction, and a note says how many such nodes there are. Strength and expected influence are the only centralities the card reports.

The nodes are partitioned on the *signed* edge weights – a negative edge is a reason to separate two nodes, not a weight to take the sign off – by a spin-glass search of signed [modularity](./concepts/association.md#b-modularity), and the note above the table gives the number of communities and the modularity found: around 0 is no more grouping than the node strengths alone would produce. Under the unregularised estimator every pair is an edge, so the partition rests on the contrast between edge weights rather than on which edges the model kept; a network that falls into disconnected parts has no community spanning two of them, and the note names how many parts there are; and the search anneals from a random start, so it is pinned to the [**Reproducibility seed**](./settings.md#reproducibility-seed) – clear it and a re-run may return a different partition of the same network, which the note also says.

> **A community is not a factor count.** Community detection on a network is used elsewhere as a dimensionality method, which makes the number of communities tempting to read as "how many factors"; the partition describes *this* network under *this* estimator – see [community](./concepts/association.md#b-community), and [factor analysis](./factor-analysis.md) for the dimensionality question.

**Network.** The card's last section is the [force-directed graph](#force-directed-graph) of the edges: node colours carry the community partition, edge width the coefficient, and under the regularised estimator the graph draws the selected edges rather than gating on a p-value that was never computed. Edge-weight stability – bootstrapped edge intervals, the standard reviewer question about a published network – is not part of the card. {#network}

## Testing differences between correlations

The **Test for differences between correlations** card asks whether two correlations differ – whether X tracks Y more closely than Z, whether a pair's correlation is the same in every group, whether a whole matrix follows one pattern – and picks the test from the structure of the comparison. Its results arrive as the *Comparison of correlations* card. {#comparison-of-correlations}

> **Why a special test?** Two coefficients from one sample are themselves correlated and two from different samples are not, and the test has to allow for which – see [dependent](./concepts/association.md#b-dependent-correlations) and [independent correlations](./concepts/association.md#b-independent-correlations).

### Comparison structures

- **Comparison structure** – which cells are compared, and on what sample. *Pairwise* structures give one comparison per pair of cells; *Joint* structures give one omnibus statistic for the whole matrix (a [joint pattern test](./concepts/association.md#b-joint-pattern-test)). A structure the current matrix shape cannot use is hidden – *Within each row variable* needs two column variables under one row variable, *Against a reference cell* two distinct cells, the two cross-group structures a grouping variable with at least two groups – and a selection that turns unavailable falls back to *No comparison*.
- **No comparison** – the default: the run produces no comparison card.
- **Within each row variable** – every pair of cells that share a row variable – its correlation with one column variable against its correlation with another – on the full sample: dependent overlapping correlations, tested by the [Dependent test](#dependent-test-variant) variant you choose. An equality χ² per row variable leads the table.
- **Within each column variable** – the mirror: every pair of cells that share a column variable.
- **Against a reference cell** – every cell against the one **Reference cell** names, on the full sample. A pair that shares a variable gets the overlapping test and a pair that shares none the non-overlapping one, and one table can hold both.
- **Between groups** – the same cell in each pair of groups of the **Compare across (variable)** variable: independent correlations, Fisher's z for Pearson, Spearman, Kendall and point-biserial and a Wald z on the analytic SE for the seven other [closed-form methods](#method-coverage). With three or more groups a homogeneity χ² per cell leads the table.
- **Pattern equality (single sample)** – one joint χ² for the constraint set **Pattern** names, on the rows complete on every variable in the matrix – Steiger's pattern-equality test, or a bootstrap-calibrated Wald statistic under a bootstrap interval.
- **Equality across groups** – one joint test of whether the whole correlation matrix is the same in every group of the **Compare across (variable)** variable: Jennrich's χ² for two groups, a Wald χ² on the Olkin–Siotani covariance at the pooled matrix for three or more.
- **Reference cell** – shown under *Against a reference cell*. *Picked from the data* offers the strongest and the weakest cell; *Pre-specified cell* lists every cell the current row × column selection forms. Prefer a pre-specified cell: a data-driven pick is compared against the data that chose it, so its table carries an optimism note, while a pre-specified one is captioned *(pre-specified, …)* and carries none. A pre-specified cell that is no longer in the matrix, errored or has no usable coefficient is named with its reason instead of an empty table.
- **Strongest |r|** – the cell with the largest absolute coefficient; a tie breaks by variable name, so the pick is the same on every run.
- **Weakest |r|** – the cell with the smallest absolute coefficient, ties broken the same way.
- **Pattern** – shown under *Pattern equality (single sample)*: the constraint set the joint test evaluates. The two single-anchor options are hidden when they would form no constraint on the current matrix or would only restate compound symmetry – on a square symmetric matrix the three are one test. The card states the chosen pattern's H₀ in words and reports the constraint count as `df`.
- **All correlations equal (compound symmetry)** – the default: every correlation in the matrix equal – on a square symmetric matrix, the classic "every off-diagonal correlation is the same".
- **Equal within each row variable** – each row variable's correlations equal to one another, rows free to differ.
- **Equal within each column variable** – the column-wise mirror.
- **Compare across (variable)** – the categorical variable that splits the sample into groups, required by *Between groups* and *Equality across groups* and ignored by the other four; it leaves the matrix's axes, being constant within a group. Above 50 levels the run warns you to check that the variable is really categorical, since every level costs its own correlation batch.
- **Select a variable** – the placeholder: the two cross-group structures refuse to run until a variable is picked.

### Method coverage

Which cells get a difference test depends on the method, the structure and the **Confidence intervals** setting:

- **Closed-form path** – Pearson, Spearman, Kendall (their partials included) and point-biserial get a closed-form test in every structure; the variance is canonical for Pearson and a plug-in approximation for the other three, and a partial's test uses `df = n − k − 3` (`n − k − 4` for Kendall) – the footnote under the table says so where it applies.
- **Between-groups Wald path** – in *Between groups* and *Equality across groups* only, seven more methods get a closed-form test on their own analytic SE: polychoric, tetrachoric, polyserial, biserial, Goodman & Kruskal's γ, Somers' D and Blomqvist's β. Their same-sample comparisons stay bootstrap-only.
- **Bootstrap path** – every other method the bootstrap supports, the asymmetric ones included (each direction gets its own distribution), gets a difference test only when **Confidence intervals** is *Bias-corrected percentile bootstrap* – under *Analytic* or *None* those cells show no test and a note names the switch. Single-sample structures draw the same rows for every pair in an iteration and cross-group draws are independent per group; the single-sample *Pattern equality* joint test is kept as a Wald statistic calibrated against its own bootstrap distribution, so raise **Bootstrap replications** before reading its p near a threshold.
- **Semi-partial mode** – always routes through the bootstrap, whatever the method.
- **Mixed/Auto** – no difference test: the per-pair method dispatch cannot fold into one comparison statistic, and the card says so.

### Dependent-test variant

- **Dependent test** – for the same-sample structures (row-wise, column-wise, reference and pattern equality; hidden for the two cross-group ones), which average of the two coefficients the covariance under H₀ is evaluated at. It is one paired choice rather than four separate tests because the reference structure mixes overlapping and non-overlapping cells in one table.
- **Back-transformed average Fisher z (better under non-normality)** – the default: the two coefficients are averaged on the Fisher-z scale and mapped back. For overlapping cells this is Dunn & Clark's z as Hittner, May & Silver (2003) modified it, for non-overlapping ones Silver, Hittner & May's (2004) form; both are z statistics, so the table shows no df.
- **Raw average of the two coefficients (classic)** – the textbook pair, Williams' T2 for overlapping cells and Steiger's (1980) modification of Dunn & Clark's z for non-overlapping ones, both at $(r_1 + r_2)/2$. The two variants agree closely in practice: a reporting choice you can defend either way, not a correctness fix.

### Reading the comparison table

The card opens with a caption naming the structure. For the four pairwise structures it shows one row per comparison, with these columns:

- **Pair A** and **Pair B** – the two cells compared, as variable names. Under *Against a reference cell* the reference moves to a banner above the table – its coefficient, interval and p with it – and the rows show only the **Compared cell**; under *Between groups* the pair is spelled as **Variable 1** and **Variable 2**, plus **Group A** and **Group B** with three or more groups – with two, the group names go into the coefficient headers instead. {#pair-a #pair-b #compared-cell #group-a #group-b}
- **r (A)** and **r (B)** – the two coefficients, headed by the method's symbol; the reference structure shows the compared cell's alone under the bare symbol, and a two-group *Between groups* comparison names the groups instead (**{symbol} ({group})**, one column per group). {#r-a #r-b #ρ-a #ρ-b #τ-a #τ-b #rpb-a #rpb-b}
- **95% CI (A)** and **95% CI (B)** – each coefficient's own interval, the main matrix's, shown when **Confidence intervals** is on at the [confidence level](./settings.md#confidence-level) you set; the reference cell's moves to the banner, and a two-group comparison names the groups here too. {#95-ci-a #95-ci-b #ci-a #ci-b}
- **p (A)** and **p (B)** – each coefficient's own p against zero, from the matrix's significance family, so the [comparison adjustment](#p-value-adjustment-for-comparisons) never touches them; they follow the [adjustment display mode](./settings.md#multiple-comparison-adjustment) – batch-adjusted under *replacement* (within each group's own family in a *Between groups* comparison), raw under *addition*. The reference structure shows the compared cell's **p** alone, the reference's in the banner. {#p-a #p-b}
- **N** – the sample size the test ran at. In the single-sample pairwise structures it is the rows complete on *every* variable the comparison involves – below either cell's own n under pairwise deletion – and the **95% CI (Δ)** is built at the same n; in a *Between groups* table it is each group's own pairwise-complete n, as **N (A)** and **N (B)** or under the group names; in the joint and per-anchor tables it is the rows complete on the whole matrix, listed per group across groups. The bootstrap path carries no such n and drops the column. {#n #n-a #n-b}
- **Δr** – the difference r(A) − r(B) – see [Δr](./concepts/association.md#b-δr); under *Against a reference cell* the header reads **Δr (reference − cell)**, so the sign cannot be read backwards. A pair whose two cells were computed with different effective methods – an ε² cell against a Cramér's V fallback, an r²-scale number against an r-scale one – is marked *not comparable* and shows no Δr. {#δr #δρ #δτ #δrpb #δ-reference-cell}
- **95% CI (Δ)** – the interval for the difference itself: Zou's (2007) MOVER interval under *Analytic*, bias-corrected percentile quantiles of the resampled Δr under the bootstrap. **This is the interval to read for the comparison** – if it excludes 0 the difference is significant at that level, and it exists even where no closed-form statistic does. {#95-ci-δ #ci-δ}
- **Statistic** – the test statistic with significance stars. When one test runs throughout, its symbol heads the column – **t** for Williams' T2, **z** for every other closed form; the reference structure can mix both, and then the header reads **Statistic** and each cell carries its own letter. The bootstrap path drops the column and carries its inference in **Δr**'s interval and p. A cell with no test shows `–`, with a tooltip naming why.
- **df** – degrees of freedom, shown for Williams' T2 alone; the z tests and the bootstrap path carry none, and the column is omitted rather than filled with `–`.
- **p (Δ)** – the difference-test p-value, with **p (adj)** beside it when [adjustment](./settings.md#multiple-comparison-adjustment) is on in *addition* mode (under *replacement* the adjusted value takes its place). On the bootstrap path it is bias-corrected with the same recentring as the **95% CI (Δ)**, so `p (Δ) < α` exactly when the α-level interval excludes 0. A cell with no test names its obstacle in a tooltip: a coefficient at ±1, where Fisher's z is undefined, and too few complete cases in a group get a message of their own, since switching to the bootstrap would not rescue them; every other case points at the **Confidence intervals** switch.

Above the pairwise rows, two structures add a joint table of their own:

- **Homogeneity across all groups** – under *Between groups* with three or more groups: one χ² per cell (**Variable 1**, **Variable 2**, **Groups** – how many the cell pools – χ², df, p), testing H₀ *the correlation is the same in every group* with each group weighted by its own variance. Read it first, then the rows for where the difference sits. It is adjusted as its own family and skipped on the bootstrap path. {#homogeneity-across-all-groups #groups}
- **Equality within each row variable** – under *Within each row variable* and its column mirror: one Steiger pattern-equality χ² per anchor variable (**Variable**, χ², df, p, **N**), testing H₀ *that variable's correlations are all equal*, for anchors carrying at least two comparisons – with one the joint test would restate the pairwise row. Adjusted as its own family, skipped on the bootstrap path. {#equality-within-each-row-variable #equality-within-each-column-variable}

For the two joint structures the card shows a one-row table with the tested H₀ stated in words underneath, then the comparisons behind it:

- **Test** – which statistic ran: Steiger's pattern-equality χ², the bootstrap-calibrated pattern-equality Wald, Jennrich's χ² for two group matrices, the Wald χ² on the Olkin–Siotani Σ for more, or the Cauchy combination fallback below. Its **df** is the number of constraints and its **N** the rows complete on the whole matrix; the bootstrap-calibrated test carries no N and says instead how many usable replicates its covariance and p rest on. {#test #steiger-pattern-equality-χ² #pattern-equality-wald-bootstrap-calibrated #jennrich-χ²-equality-of-2-group-matrices #wald-χ²-on-olkin-siotani-σ-equality-of-group-matrices}
- **Cauchy combination** – the fallback when the joint test cannot be computed: a Cauchy combination (ACAT) of the component comparisons' p-values, and a note naming why the joint test was not used – no closed-form joint test for the method, bootstrap intervals active across groups, a missing or errored cell or a non-positive-definite matrix, too few complete cases, no equality constraints from the selected cells, a singular constraint covariance, or too few usable replicates. {#cauchy-combination #cauchy-combination-p-component-tests}
- **Per-group coefficients** – under *Equality across groups*, one row per cell with each group's coefficient and n side by side: the matrices the joint test compares, which the component rows spread over one comparison per pair of groups. A group whose matrix cannot be assembled is dropped and named, and the test runs on the rest as long as two survive.
- **Component comparisons** – the pairwise comparisons the joint test summarises, in the pairwise table's layout and with its adjustment, so a significant joint result can be traced to the cells driving it.

A footnote under the table names the test family used – Williams' T2, Steiger's z, their back-transformed variants, Fisher's z, the between-groups Wald z, or the bootstrap with its replication count – and the caveats that apply: the plug-in approximation for Spearman, Kendall and point-biserial, a partial's df, semi-partial routing, and asymmetric coefficients needing the bootstrap for their same-sample comparisons.

### P-value adjustment for comparisons

The same global [adjustment method](./settings.md#multiple-comparison-adjustment) that applies to the matrix is applied separately to the family of diff-test p-values – the matrix's p-values and the diff card's p-values are adjusted **independently**, since they answer different families of questions. Inside the diff card, all comparisons of a single structure are treated as one family.

### Reporting comparisons

When writing up a difference test, report: the comparison structure, the test family (Williams' T2 or Steiger's z, their back-transformed variants, Fisher's z, the between-groups Wald z, or the bootstrap with B) and the **Dependent test** variant, the two coefficients, Δr **and its confidence interval** (Zou or bootstrap), the test statistic with df, the p-value (raw and adjusted if applicable), and the sample size(s). For omnibus tests, report χ², df, p, and which omnibus variant was used (Steiger pattern, Jennrich, Wald on Olkin–Siotani, or ACAT fallback).

## Display options

The rest of the **Correlation options** card decides what each cell reports and how the run is shown – the method-specific options that appear under the method select, the table format, the visualizations, the confidence intervals, the negligible-correlation margin and the two matrix-display switches – listed here in the order the panel shows them.

### Append MI / Append entropies

Two checkboxes appear under the method select when an information-theoretic method – NMI, AMI, Rajski's coherence or Theil's U – is selected; both are off by default.

- **Append MI** – adds the [mutual information](./concepts/association.md#b-mutual-information) itself, in nats with the Miller–Madow correction, to every cell or long-format row: the absolute amount of shared information the normalized coefficient divides away, for reporting and for reconciling with other tools. It is the corrected value that reconciles with the appended entropies, not the plug-in MI the analytic χ² test runs on.
- **Append entropies** – adds H(row) and H(col), the two variables' marginal [entropies](./concepts/association.md#b-entropy), so a low NMI can be told apart from a variable that had little information to share in the first place.

### P-value method (IT methods only)

- **P-value method** – which test the p-value under each coefficient comes from. Four dropdowns carry this label, one per family of methods – the information-theoretic family here, then [distance correlation](#p-value-method-distance-correlation), the [Pearson, rank and ordinal methods](#p-value-method-pearson-rank-and-ordinal-methods) and the [contingency-table pair](#p-value-method-contingency-table-methods) – and the one shown belongs to the selected method. The coefficient is the same under either option of a dropdown; only the p-value changes.
- **Analytic χ² (fast, tests independence)** – the default for NMI, AMI, coherence and Theil's U: the χ² independence test on the discretized table, one closed-form call per pair. It tests independence rather than the size of the normalized coefficient in the cell, it degrades when the table's expected counts run low – a caveat under the table says so, and permutation is the remedy – and for **Adjusted mutual information** it is only ever approximate, which a caveat notes as well.
- **Permutation (slower, tests the reported coefficient)** – shuffles one variable and recomputes the chosen coefficient on every shuffle, so the p asks whether *this* NMI, AMI, coherence or Theil's U is larger than chance – see [permutation test](./concepts/parametric-nonparametric.md#b-permutation-test). Exact for every member of the family, AMI included. The shuffle count is sized to your [significance level](./settings.md#significance-level), with the [bootstrap replications](./settings.md#bootstrap-replications) setting as its floor and an inflation under [p-value adjustment](./settings.md#multiple-comparison-adjustment); the same count serves every permutation and Monte-Carlo option below.

### Discretization bins

The information-theoretic measures need a contingency table, so every continuous variable is first cut into equal-frequency bins; two controls under the IT options set how fine that grid is.

- **Discretization bins** – the rule that sets the number of bins per continuous variable. Every rule is capped at the variable's number of distinct values, and a variable with ten or fewer distinct values is coded level for level rather than binned, so the setting only ever moves genuinely continuous columns; a finer grid resolves more structure but sparsifies the joint table, which inflates the coefficient itself – see [discretization](./concepts/association.md#b-discretization).
- **Cube root of N (conservative)** – the default: about ∛n bins.
- **Rice rule (twice the cube root of N)** – 2·∛n bins, a grid twice as fine.
- **Sturges' rule (log₂ N + 1)** – log₂ n + 1 bins, the coarsest of the three on a large sample.
- **Fixed count** – the number you enter in **Bins per variable**.
- **Bins per variable** – shown under *Fixed count*: the exact number of bins, 2 to 50, every continuous variable is cut into.

> **Finer is not better.** A finer grid resolves more structure but scatters the same rows over more cells, and a sparse table inflates mutual information itself, so coefficients from runs at different bin settings are not comparable, and a caveat under the table names the rule whenever it is not the default – see [discretization](./concepts/association.md#b-discretization). The [pre-flight advisory](#information-theoretic-methods-discretized-grid) and the bootstrap intervals run on the same grid the coefficients do.

### P-value method (distance correlation)

Distance correlation's dropdown is the one that defaults to the slower option.

- **Permutation (slower, correctly sized)** – the default: shuffles one variable and rebuilds the distance covariance on every shuffle, so the reference distribution comes from your own data and the test holds its level. The shuffling runs inside compiled code that **Cancel** cannot reach, so the work is budgeted per cell: from about 1,600 rows at the default settings the shuffle count is traded down to fit – a caveat under the table reports the count actually used, and the p is correspondingly coarser – and above roughly 2,200 rows even the 199-shuffle resolution floor overruns it, so the cell reports *too many rows for an uninterruptible permutation test* and asks for the analytic route.
- **Analytic t (fast, anti-conservative in the tail)** – the *t* approximation, which rejects too often on the two-column pairs this module builds and does not improve as the sample grows: a fast screen whose tail you will not be reading, or the route for a sample the permutation test refuses.

### P-value method (Pearson, rank and ordinal methods)

The dropdown appears under **Pearson's r**, **Spearman's ρ**, **Kendall's τ**, **Goodman & Kruskal's γ** and **Somers' D**, and under **Mixed/auto · observed scores**, which dispatches among them.

- **Analytic (fast, approximate under ties, non-normality or small samples)** – the default: `cor.test`'s p-value for Pearson and the rank methods, a Wald test on the tie-aware standard error for γ and Somers' D. Reliable on mostly distinct, roughly normal data; the [tie-burden check](#rank-ordinal-methods-tie-burden) and a failed [OLS diagnostic](#ols-diagnostics-pearson) are its two reasons to switch, and for γ and Somers' D at ±1 – which γ reaches on any table with no discordant pairs – it can report no p-value, standard error or interval at all.
- **Permutation (slower, exact independence test)** – shuffles one variable and recomputes the coefficient on every shuffle, reporting the two-sided share of shuffles that reach the observed magnitude – see [permutation test](./concepts/parametric-nonparametric.md#b-permutation-test). An exact test of independence however heavy the ties, however skewed the marginals and however small the sample, and the only route to a p-value for a perfect γ or Somers' D. Kendall's τ costs O(n²) per shuffle, so selecting it warns you up front with the pair count, sample size and replication count.

With [control variables](#controlling-for-covariates-partial-semi-partial-correlation) active the permutation option stays available and switches to the Freedman–Lane scheme: the outcome is regressed on the controls, only the residuals are shuffled, and the coefficient is recomputed from that surrogate – mapped back onto the outcome's own values first, so a tie-normalized statistic keeps its scale. The null is then the conditional one, X ⊥ Y given Z, the test is approximate rather than exact, and a caveat under the table says so whenever covariates and permutation are both active.

### P-value method (contingency-table methods)

The φ coefficient and Cramér's V take their p-value from a χ² test on the pair's contingency table, and get a dropdown of their own.

- **Analytic χ² (fast, needs adequate expected counts)** – the default: `chisq.test`'s asymptotic p-value, reliable when the [expected cell counts](#contingency-table-methods-χ²-cell-counts) are adequate – the assumption card's *Adequate expected counts* verdict – and unreliable when they are not.
- **Monte Carlo (slower, valid on sparse tables)** – simulates tables with the observed margins and reports the share that reach the observed statistic, valid however sparse the table – see [Monte Carlo](./concepts/parametric-nonparametric.md#b-monte-carlo). It uses the same shuffle count as the permutation options and a pinned seed, so the result is reproducible. This is the remedy the sparse-cells advisory points at: switch here rather than dropping φ or Cramér's V from the analysis.

### Table format

- **Matrix** – the default: a correlation matrix with the variables on both axes – see [matrix format](#matrix-format).
- **Long format** – a flat table with one row per variable pair, each of the matrix cell's parts in a column of its own – see [long format](#long-format).

### Visualization

Five checkboxes add a plot card each; the plots, their options and their legends are described under [Visualizations](#visualizations).

- **Correlation network (edge bundling)** – a circular network of the significant pairs, the variables around a circle and curved edges bundled between them – see [edge bundling](#edge-bundling). Unavailable under a directional measure, where the checkbox is disabled with a note pointing at the force-directed graph.
- **Force-directed graph** – an interactive network in which a strong coefficient pulls its two variables close and a weak one lets them drift apart, drawn with arrowheads under an asymmetric method – see [force-directed graph](#force-directed-graph). {#force-directed-graph-option}
- **Correlogram** – a matrix of oriented ellipses, one per pair, every cell drawn and the non-significant ones dimmed – see [correlogram](#correlogram). {#correlogram-option}
- **Order variables by clustering** – a sub-option under the correlogram, off by default: clusters the variables on 1 − |r| and reorders both axes by the result, so related variables sit in contiguous blocks; needs the same variables on both axes – see [order variables by clustering](#order-variables-by-clustering).
- **Scatterplots** – one scatterplot per pair, with the overlay the method calls for – see [scatterplots](#scatterplots). {#scatterplots-option}

Both network graphs draw only the statistically significant pairs by default and carry a **Show non-significant links (faded)** checkbox beside them; the [partial-correlation network](#partial-correlation-network) brings a force graph of its own and is switched on separately.

### Confidence intervals

- **Confidence intervals** – whether each coefficient is reported with an interval, at your global [confidence level](./settings.md#confidence-level): an extra column in the long table, an extra line under the coefficient in matrix cells and, when a [difference test](#testing-differences-between-correlations) is active, per-coefficient and Δr intervals in the [comparison table](#reading-the-comparison-table). A method with no interval for the chosen mode shows `–`, and the column is dropped when no cell in the run produced one.
- **None** – the default: no intervals are computed. {#confidence-intervals-none}
- **Analytic (closed-form where supported)** – each method's own closed-form interval: Fisher's *z* for Pearson, Spearman, Kendall and point-biserial, an atanh-scale Wald interval for the latent methods, γ and Somers' D, an interval inverted from the coefficient's own test statistic for η², Cramér's V, the φ coefficient and Blomqvist's β, and a plain-scale Wald interval on an envelope standard error for Chatterjee's ξ. The information-theoretic family, Hoeffding's D, distance correlation and the Spearman and Kendall semi-partials have no closed form and show `–` here, with a caveat pointing at the bootstrap mode; a caveat also flags the intervals to read with care – ξ's, point-biserial's on a split more lopsided than about 20/80, a latent method's beside a near-perfect coefficient, and a latent pair with a many-category variable.
- **Bias-corrected percentile bootstrap (any method)** – resamples the data with replacement, [bootstrap replications](./settings.md#bootstrap-replications) times, and takes the recentred percentile interval of the resampled coefficients – see [bias-corrected percentile bootstrap](./concepts/confidence-intervals.md#b-bias-corrected-percentile-bootstrap). Available for every method, partials and semi-partials included, so it is the fallback for every coefficient with no closed form. The module raises a replication setting below 100 to 100, discloses the under-coverage of any setting below 1,000 in a caveat, and draws a cell's interval only when at least 80% of its resamples produced a usable value.

> **Which mode to pick?** Analytic is faster and narrower when its assumptions hold; bootstrap is slower and a little wider, and the honest choice for a small or non-normal sample or a method with no closed form – see [bootstrap](./concepts/confidence-intervals.md#b-bootstrap).

> **The replication count is part of the interval.** A percentile interval's endpoints are individual resamples out at the tails, so raise the [bootstrap replications](./settings.md#bootstrap-replications) before reporting one – see [bootstrap replications](./concepts/confidence-intervals.md#b-bootstrap-replications).

### Negligible-correlation margin (TOST)

- **Negligible-correlation margin (TOST)** – Δ, the largest coefficient you would still call practically zero; leave it empty (the default) to skip. Once set, every pair gets an [equivalence test](./concepts/hypothesis-testing.md#b-equivalence-test) and the table gains a **p (Δ)** column: the signed coefficients – Pearson, Spearman, Kendall, point-biserial, biserial, polyserial, polychoric, tetrachoric, Somers' D, Goodman & Kruskal's γ, Blomqvist's β and the φ coefficient – get the two-sided [TOST](./concepts/hypothesis-testing.md#b-tost) against −Δ and +Δ, **p (Δ)** the larger of its two one-sided p-values; the unsigned measures – η², Cramér's V, NMI, AMI, Rajski's coherence, Theil's U, Hoeffding's D, Chatterjee's ξ and distance correlation – get the single one-sided test of θ ≥ Δ. Both shapes are covered under Mixed/auto too. A caption under the table states the margin used, the null each family was tested against and the (1 − 2α) interval the verdict corresponds to. {#negligible-correlation-margin-tost #negligible-correlation-margin}

Δ is compared with the coefficient exactly as the table prints it – no measure is rescaled to a common scale first – so one margin marks out different amounts of association from method to method; a caption says which [strength scale](#interpretation) each family reads on and warns when one run's equivalence cells span more than one. Where the standard error behind **p (Δ)** is resampled – the six measures with no closed form (NMI, AMI, coherence, Theil's U, Hoeffding's D, distance correlation), the φ coefficient, the Spearman and Kendall semi-partials, and the whole signed family under the [bootstrap interval](#confidence-intervals) mode – setting a margin triggers that resample even with intervals off, and the p is floored at the resample's own resolution, $1/(B + 1)$, with a caveat naming the affected symbols. **p (Δ)** is [adjusted](./settings.md#multiple-comparison-adjustment) as a family of its own, never pooled with the significance p-values.

> **Choose Δ before the data.** Set it to the smallest coefficient that would matter in your field, before looking at the results – a margin picked to clear invalidates the test – see [equivalence margin](./concepts/hypothesis-testing.md#b-equivalence-margin).

> **A small p (Δ) says "negligible"; a large p does not.** A non-significant ordinary p never proves a correlation absent – see [negligible](./concepts/hypothesis-testing.md#b-negligible).

### P-value display

- **P-value display** – how the matrix shows its p-values; offered in matrix format only, since the long table carries p in a column of its own.
- **Separate p-value table** – the matrix shows only the coefficients, and separate p-value matrices appear below it.
- **Combined with correlation** – the default: each cell shows the coefficient with its significance stars on one line and the p-value below it.

### Hide redundant values

- **Hide redundant values** – on by default: when the same variables sit on both axes, only the lower triangle of the symmetric matrix is shown; untick it to see the full matrix. The checkbox disappears under an asymmetric method – Somers' D, Theil's U, Chatterjee's ξ – and in a semi-partial run, where both triangles hold genuinely different values and a *Direction: row → column* caption is added instead.

## Reading results

The results card, **Correlation analysis – ‹method›**, holds the table in the [format](#table-format) you chose, under the captions the run earned: the direction of an [asymmetric method](#directional-asymmetric-methods), the covariates of a [partial run](#controlling-for-covariates-partial-semi-partial-correlation), and the caveats the sections above describe – a non-default bin rule, a sparse table, an interval to read with care, the equivalence margin and its null. Both formats carry the same values per pair; the long table gives each its own column, so its entries below say what every value means.

### Matrix format

The default: the [left variables](#setting-up) down the rows, the right variables across the columns, one cell per pair. With the same variables on both axes, [**Hide redundant values**](#hide-redundant-values) keeps the lower triangle and the diagonal shows a dash – a variable's correlation with itself is trivially 1 – and when the two lists overlap without matching, a pair's second appearance is blanked the same way. Each cell holds the coefficient, labelled with its method's symbol – the pair's own under a preset or a fallback – and carrying the stars of your [significance settings](./settings.md#significance-formatting); under **Combined with correlation** the p-value follows on its own line, labelled *p*, or *p<sub>adj</sub>* when [adjustment](./settings.md#multiple-comparison-adjustment) runs in *replacement* mode, with a second *p<sub>adj</sub>* line under *addition*; then one line per optional value the run produced, each labelled as the [long table](#long-format) heads it – **N**, the *F* or *χ²* test statistic, the interval, **SE**, the zero-order coefficient under a `₀` subscript, *p<sub>Δ</sub>*, *MI* and *H<sub>row</sub>* / *H<sub>col</sub>*. A cell the method could not compute is red and names the reason in place – *Insufficient data*, *Not a 2×2 table*, *Constant variable – no information* – with the same message in its tooltip.

Under **Separate p-value table** the cells keep the coefficient and its stars, and the p-values move to a matrix of their own below:

- **p-value matrix** – one p per pair on the same grid, the same cells hidden; a pair with an error shows a dash. Under *replacement* it holds the adjusted p and takes the title **Adjusted p-value matrix**.
- **Adjusted p-value matrix** – under *addition*, a second matrix with the adjusted p below the raw one's. A pair the adjustment family skipped – one with no valid raw p – reads *N/A* rather than an unadjusted number.

Under an [asymmetric method](#directional-asymmetric-methods) – Somers' D, Theil's U, Chatterjee's ξ – and in a semi-partial run, a *Direction: row → column* caption stands above the matrix: each cell says how well the **row variable predicts the column variable**, so the two triangles carry different numbers and both are shown. A partial run's caption names the covariates and which side was residualized.

### Long format

One row per pair – both orderings as separate rows under an asymmetric method, with the caption reading *Direction: variable 1 → variable 2* – in these columns:

- **Variable 1** and **Variable 2** – the pair; under an asymmetric method the row reads as "Variable 1 → Variable 2", Variable 1 the predictor. {#variable-1 #variable-2}
- **Method** – shown under a [preset](#mixed-auto-selection-logic) and whenever a per-row fallback occurred – an ε² run falling back to Cramér's V on a pair with two grouping sides: the symbol of the method that computed the row, its full name in a tooltip.
- **N** – the complete cases the pair was computed on: under [pairwise deletion](#missing-data) the rows with both values, so it varies from pair to pair, and both the p-value and the interval's width depend on it. A [partial run](#controlling-for-covariates-partial-semi-partial-correlation) counts the rows complete on the pair and its covariates, Blomqvist's β leaves out the rows sitting exactly on a median, and distance correlation past its row cap reports the subsample it ran on – each with a caveat under the table where it matters. {#correlation-analysis-methodname-n}
- **Coefficient** – the coefficient with its significance stars, headed by the method's symbol (*r*, *ρ*, *τ*, …) in a single-method run and by **Coefficient** under a preset or a fallback, where the **Method** column carries each row's symbol; a pair the method could not compute shows the reason here, in red, with the message in a tooltip.
- **p** – the p-value against the null of no association, from the method's own test or the one its [P-value method](#p-value-method-pearson-rank-and-ordinal-methods) dropdown selects where it has one, formatted by your [p-value settings](./settings.md#p-value-settings); the stars and the **Interpretation** verdict follow it. Under [adjustment](./settings.md#multiple-comparison-adjustment) in *replacement* mode the column is headed **p (adj)** and holds the adjusted value; in *addition* mode a **p (adj)** column joins it – see [p (adj)](./concepts/hypothesis-testing.md#b-p-adj). {#correlation-analysis-methodname-p #correlation-analysis-methodname-p-adj}
- **Test statistic** – the omnibus test behind an effect-size coefficient, with the coefficient's stars: the correlation ratio shows its *F*(df₁, df₂), Cramér's V and the φ coefficient their *χ²*(df), each cell naming its own because a preset or a fallback can mix the two in one column. Present only when some cell has one.
- **95% CI** – the coefficient's interval at your [confidence level](./settings.md#confidence-level), present when [**Confidence intervals**](#confidence-intervals) is on; a cell whose method has no interval in the chosen mode shows `–`, and the column is dropped when no cell produced one. {#correlation-analysis-methodname-ci}
- **SE** – the coefficient's closed-form standard error, present for the methods that report one: the Wald SE of polychoric, tetrachoric, polyserial and biserial correlation, Goodman & Kruskal's γ and Somers' D, which complements the interval as a pooling-ready measure of precision, and Chatterjee's ξ's envelope SE – the one behind its interval and equivalence test, not the one its p-value rests on, so ξ ÷ SE does not reproduce the printed p; a caveat says so whenever a ξ cell shows one. {#correlation-analysis-methodname-se}
- **r₀** – the zero-order coefficient of a [partial run](#controlling-for-covariates-partial-semi-partial-correlation), headed by the run's symbol with a `₀` subscript (**ρ₀**, **τ₀**): the same pair without the covariates, on the same rows, so the gap between the two columns is what the covariates account for – see [zero-order correlation](./concepts/regression-basics.md#b-zero-order-correlation). {#r0 #ρ0 #τ0}
- **p (Δ)** – the [equivalence test](./concepts/hypothesis-testing.md#b-equivalence-test)'s p-value, present when a [**Negligible-correlation margin**](#negligible-correlation-margin-tost) is set: small when the coefficient is significantly inside the margin. Adjusted as a family of its own – under *replacement* the column is headed **p (Δ, adj)** and holds the adjusted value, under *addition* a **p (Δ, adj)** column joins it. {#correlation-analysis-methodname-p-δ #correlation-analysis-methodname-p-δ-adj #p-δ-adj}
- **MI (nats)** – the pair's [mutual information](./concepts/association.md#b-mutual-information), added by **Append MI** for the information-theoretic methods: the absolute amount of shared information the coefficient normalizes away, in nats, with the Miller–Madow correction, on the discretized variables – a caveat under the table restates that basis. {#mi-nats}
- **H(var₁) (nats)** and **H(var₂) (nats)** – the two variables' marginal [entropies](./concepts/association.md#b-entropy), added by **Append entropies** on the same basis, so a low coefficient can be told from a variable with little information to share; the matrix labels them *H<sub>row</sub>* and *H<sub>col</sub>*. An entropy slightly above log(k) for a k-bin variable is the correction, not an error. {#hvar₁-nats #hvar₂-nats}
- **Interpretation** – with the [interpretation column](./settings.md#significance-formatting) on, the row's verdict in words, read as [below](#interpretation); a pair with an error shows `–`, its reason staying in the **Coefficient** cell.

### Interpretation

Each verdict combines up to three readings: the *significance* – *Significant* or *Non-significant* against your [significance level](./settings.md#significance-level), read from the adjusted p under *replacement*, and omitted when the cell has no p at all; the *strength* – the band the coefficient falls in, from *negligible* to *very strong*, on the band set its method reads: the [correlation strength bands](./settings.md#statistical-thresholds) for the signed measures, the normalized-mutual-information bands for the information-theoretic family, and their own sets for the correlation ratio, Cramér's V and the φ coefficient, Hoeffding's D and Chatterjee's ξ; and, for the signed measures, the *direction* – *positive* or *negative*. "Significant moderate positive correlation" is a Pearson row; "Significant strong association" an η², NMI or ξ one.

Before the bands are applied, Kendall's τ and Blomqvist's β are converted to their *r*-equivalent and Rajski's coherence to its NMI-equivalent, so their labels report the strength the reference measure would; the displayed coefficient is untouched. Goodman & Kruskal's γ and Somers' D are labelled on the *r* bands as they stand, and a caveat under the table marks their labels approximate – as it marks Cramér's V's, whose cutoffs assume a large sample. The φ coefficient reads on Cramér's V's bands and keeps its sign, and the correlation ratio's bands read the bias-corrected ε² the module reports. Every cutoff is yours to change in [Settings](./settings.md#statistical-thresholds).

> **Non-significant is not "unrelated".** A p above α says the data did not rule the null out, not that the correlation is zero – see [statistical significance](./concepts/hypothesis-testing.md#b-statistical-significance); to claim a correlation negligible, set a [negligible-correlation margin](#negligible-correlation-margin-tost) and read its **p (Δ)**.

## P-value adjustment

A matrix is many tests at once – ten variables make 45 pairs – so the global [adjustment method](./settings.md#multiple-comparison-adjustment) applies, and a run started with none selected gets a warning – see [many tests at once](./concepts/hypothesis-testing.md#many-tests-at-once). The matrix's significance p-values are one family with each pair counted once: a symmetric method's mirror cell is never a second test, and under an asymmetric method the two orderings count separately except where they share one p by construction – a semi-partial run and Theil's U – and then share one adjusted value. The equivalence p-values are a [family of their own](#negligible-correlation-margin-tost), the [comparison card's](#p-value-adjustment-for-comparisons) another, and a grouped run adjusts within each group's matrix. Whether the adjusted p replaces the raw one or stands beside it is the same setting's display mode; the stars and the interpretation follow the p shown.

## Missing data

The global [missing data setting](./settings.md#missing-data) decides which rows a pair is computed on. Under **Pairwise deletion**, the default, each pair uses every row with both values, so **N** varies across the matrix and the matrix as a whole describes no single sample – see [pairwise deletion](./concepts/outliers-missing-data.md#b-pairwise-deletion); under **Listwise deletion** every pair runs on the rows complete on every variable selected in the [Variables dialog](./getting-started.md#choosing-variables), at one N – see [listwise deletion](./concepts/outliers-missing-data.md#b-listwise-deletion); under [imputation](./concepts/outliers-missing-data.md#b-imputation) the filled columns are correlated as if complete, which pulls a coefficient toward zero. Two parts of the module have rules of their own: a [partial pair](#controlling-for-covariates-partial-semi-partial-correlation) runs on the rows complete on the pair and its covariates, and the [partial-correlation network](#partial-correlation-network) is always fitted listwise.

## Visualizations

All visualizations can be resized by dragging the handle in the bottom-right corner, and each has its own SVG / PNG / JPG export buttons that appear beside it on hover. To save every figure at once instead, use the bulk export action – see [resizing and exporting charts](./getting-started.md#resizing-and-exporting-charts) – which captures every plot on the page in one step.

The three matrix-wide plots share one colour rule. A signed coefficient is drawn on a fixed blue-to-red diverging scale from −1 to +1, and its glyph – edge thickness, ellipse eccentricity, link distance – on the absolute |r|. An unsigned coefficient (Cramér's V, η², the information-theoretic family, Hoeffding's D, ξ, distance correlation) is drawn on a sequential ramp from 0 to the strongest value *that method* contributed to the run, colour and glyph size alike, so the ramp is normalized per method rather than per run; a method with a single plottable cell keeps the absolute 0…1 scale instead. The legend under each plot prints one strip per scale – **Correlation:** for the diverging scale, **Association:** for a ramp, titled with the method's symbol (*Association (η²):*) when the run carries more than one unsigned method – with the strip's top value at its right end and a caption saying that colour and glyph size share it. A Mixed/auto run shows both kinds of strip and colours its unsigned pairs green, so an unsigned 0.8 is never read as strongly positive. Compare glyphs within a strip, read the printed top before comparing across strips or across runs, and read each pair's actual method from its tooltip, which names it by its symbol.

### Edge bundling

**Correlation network.** A circular diagram of the significant pairs – the checkbox is **Correlation network (edge bundling)**, the card is titled *Correlation network*. The variables sit as labelled nodes around a circle, arranged so that each one's strongest partners are its neighbours, with the gap between two neighbours growing as their correlation weakens – a negative pair sits far apart, and under an unsigned method the gap shrinks with the strength alone – and a curved edge bundled towards the centre joins every pair drawn. Edge colour follows the [colour rule](#visualizations) – blue positive, red negative, grey near zero – and edge thickness the strength; a negative edge is dashed as well as red, so the sign survives a greyscale print or a colour-vision difference. Hover an edge to highlight it and read its coefficient and p in the tooltip; zoom with the mouse wheel or the +/−/↺ buttons in the top-right corner – resizing the chart resets the zoom, so the redrawn diagram always fits its frame. The checkbox is disabled under a directional measure – Somers' D, Theil's U, Chatterjee's ξ, a semi-partial run – with a note pointing at the force-directed graph, which shows direction. {#correlation-network}

### Force-directed graph

**Force-directed graph.** An interactive network in which a strong coefficient pulls its two variables close and a weak one lets them drift apart, whatever the sign: the nodes are pills with the variable name inside, the edges are coloured and sized by the [colour rule](#visualizations), and a negative edge is dashed here too. Drag a node to pin it where you drop it – a blue dashed border marks a pinned node – and click a pinned node to release it back into the simulation; the colour legend under the graph is captured by image exports. Under a directional measure – Somers' D, Theil's U, Chatterjee's ξ, or a semi-partial run, which residualizes only one side of each pair – the graph keeps both directions of every pair and draws them as gently bowed arcs with arrowheads, the tooltip spelling the direction out (`X → Y`); a symmetric run draws no arrowheads. Read the edge bundling for an overview of the structure and this graph for the specific relationships you can pull apart. {#force-directed-graph}

Both network graphs start from the significant pairs alone, and a note under each states the rule in force – *Only pairs with p ≤ 0.050 are drawn; the rest are omitted* – naming the **adjusted** p when [p-value adjustment](./settings.md#multiple-comparison-adjustment) is active, since that is the threshold applied.

- **Show non-significant links (faded)** – off by default; on, the pairs that missed the threshold are drawn faded (*Pairs with p > 0.050 are drawn faded*) and the layout is rebuilt for the fuller set – node order, spacing and forces all follow the visible links – while every edge keeps the colour and width it had, since both are scaled on the whole matrix, and a faded negative edge keeps its dash. A run with no significant pair still draws the card and the checkbox, so the faded links can be switched on to see what is there; only when no pair could be plotted at all does the card say so.

### Correlogram

**Correlogram.** A matrix of oriented ellipses, one per variable pair, both triangles drawn and no diagonal. The ellipse tilts up to the right (/) for a positive coefficient and down (\) for a negative one – an unsigned coefficient always tilts up – and its eccentricity encodes the strength on the same [scale](#visualizations) as its colour: a circle at 0, a thin line at ±1 or, for an unsigned method, at that method's top value. A non-significant pair is faded and drawn with a dashed border; a pair with no coefficient shows `–`. Under the matrix sit the colour legend and a key stating the α behind the fading – the adjusted p when adjustment is active – what the tilt encodes and, when the axes were reordered or could not be, which order you are looking at. A directional run carries the same *Direction: row → column* caption as the matrix, and each cell's tooltip names its pair with an arrow (`A → B`) rather than `A × B`, since the two triangles then hold different numbers. With **Scatterplots** also on, clicking a cell scrolls to that pair's scatterplot. {#correlogram}

#### Order variables by clustering

A correlogram drawn in selection order scatters whatever block structure the matrix holds. **Order variables by clustering**, the sub-option under the correlogram checkbox, clusters the variables on `1 − |r|` – average-linkage hierarchical clustering on the coefficients the run already computed, an unsigned method's coefficients first rescaled by their own top value, a missing or errored pair entered at the maximum distance, a directional pair's two readings averaged – and reorders both axes by the result, so related variables sit in contiguous blocks along the diagonal; a note under the plot says the axes were reordered. It needs the same variables on both axes: a rectangular run keeps its selection order and says so. Off by default, so a deliberate selection order – subscale by subscale, say – is not disturbed.

> **What the blocks mean.** A contiguous block of strongly coloured cells along the diagonal is a set of variables that agree with each other more than with anything else – a visual aid, not a model: for a fitted account of the same structure, use [factor analysis](./factor-analysis.md) or [variable clustering](./cluster-analysis.md#variable-clustering-specifics).

### Scatterplots

**Scatterplots.** One scatterplot per variable pair, each in a subsection titled with the two names – `A – B`, or `A → B` in a [directional run](#directional-asymmetric-methods), where both orderings appear as separate plots – showing the raw points, the overlay the method calls for (the table below) and, in the corner, the coefficient with the method's symbol, the p-value under the same [adjustment display](./settings.md#multiple-comparison-adjustment) rule as the tables, and the pair's *n* – the analysis sample for the pair, pairwise-complete after filters, so it matches the table rather than a raw point count. The axes are padded by one tick interval so no edge point is clipped. Point-biserial and biserial put the binary variable on the horizontal axis whichever list it was picked from, and polyserial keeps the continuous side there. A pair whose categories are string-valued on either side cannot be plotted, and its subsection says *Scatterplot is not applicable to categorical data* instead. Under a partial run the axes carry residuals – see [scatterplots under a partial run](#scatterplots-under-a-partial-run). {#scatterplots}

An OLS line carries a confidence band at your global confidence level when **Confidence intervals** is *Analytic* – the conditional-mean band on the fitted line – or *Bias-corrected percentile bootstrap* – the envelope of OLS lines refit on resamples – and none when intervals are off; the biserial line takes the bootstrap band only. A dashed [LOWESS smoother](./concepts/regression-basics.md#b-lowess-smoother) is overlaid beside the OLS line once the pair has five distinct x values – a Pearson pair, in practice, since the dichotomy the other two put on X never has them – so curvature the straight line cannot show is still visible.

| Method | Overlay |
|---|---|
| Pearson, point-biserial, biserial | OLS line, with its band and smoother |
| Spearman, Kendall, polychoric, polyserial, Somers' D, Goodman & Kruskal's γ, Hoeffding's D, Chatterjee's ξ, distance correlation | LOWESS smoother, no straight line; a full Spearman partial draws the OLS line instead |
| Blomqvist's β | median crosshairs – vertical at the median of X, horizontal at the median of Y |
| η² | a tick at each level's mean of the continuous side, joined by a dashed profile line |
| Tetrachoric, φ, Cramér's V, NMI, AMI, coherence, Theil's U | none – the points alone |

> **What the LOWESS smoother is.** A curve of local straight fits weighted towards the nearest points, assuming no shape and estimating nothing the tables report – a shape check, not a result – see [LOWESS smoother](./concepts/regression-basics.md#b-lowess-smoother).

#### Grouped scatterplots (between groups / equality across groups)

**Grouped scatterplots.** Under the **Between groups** structure or the across-groups omnibus the scatterplot card is this one: one subplot per variable pair, with the points and the overlay drawn separately for each group in its own colour – the project-wide palette, in the order the groups appear in the [comparison table](#reading-the-comparison-table) – the same method-specific overlay applied within each series, and a legend in the emptiest corner listing each group's coefficient with its significance stars and its *n* in the group's colour, so the legend doubles as the colour key; a Kendall partial adds each group's zero-order τ₀, as the single plot does. No confidence bands are drawn in this layout – the comparison table carries the formal Δr and its interval. Residualization for a Pearson or Spearman partial runs within each group, so each group's residual scatter reflects its own conditional relationship. The edge bundling, force-directed graph and correlogram are not drawn in a grouped run, being single-matrix displays; the single-sample pattern-equality omnibus has no comparison-aware scatter at all, and its picture is the correlogram. {#grouped-scatterplots}

#### Anchor-overlay scatterplots (within row / within column / against reference)

**Anchor-overlay scatterplots.** Under the **Within each row variable**, **Within each column variable** or **Against a reference cell** structure a second scatter card follows the comparison table: one subplot per shared anchor variable, the anchor on the X axis and every comparator variable overlaid as a coloured series of its own, with its own overlay line and its own coefficient and *n* in the legend; the Y axis is labelled *Comparator variables*, since it carries every series. Under a partial run the anchor and the comparators are residualized once, over the full sample, on the same covariates; in a semi-partial mode only one side of each pair is residualized, and the panel commits to one orientation for every series – taken from its first comparator – with the X axis label saying which side that is. {#anchor-overlay-scatterplots}

- **Anchored on {variable}** – each subplot's title names its anchor: the row variable under *within row*, the column variable under *within column* and, under *against reference*, the variable the reference cell shares with its comparators – a comparator sharing no variable with the reference has no honest shared-axis rendering and is left out of the card, though its Δr is still tested and reported in the table. The overlay per series is the method's usual one, so what you see matches the coefficient the comparison tests.

## Reporting checklist

Key things to include when writing up correlation results:

**Method:**
- The correlation method (Pearson, Spearman, …) and why – for a Mixed/auto run, that the method was chosen per pair by variable type
- Which [assumption checks](#checking-assumptions) were read on the reported pairs and what they flagged – a dropped Pearson, a tie burden, a sparse table, an influential point – and whether the flagged remedy (a rank method, the bootstrap interval, the Monte-Carlo χ²) was taken
- For partial / semi-partial analyses: the covariates controlled for, and whether the coefficient is [partial or semi-partial](#partial-vs-semi-partial) (and on which side)
- For a [partial-correlation network](#partial-correlation-network): the estimator (unregularised or regularised), for the regularised one the EBIC γ and the selected λ, the node set including any covariates folded into it, and the listwise-complete n with the number of rows dropped; if you report the [community partition](#centrality-and-communities), the seed it ran under, since the search is stochastic
- For difference tests: the [comparison structure](#comparison-structures), the test that ran and the [**Dependent test**](#dependent-test-variant) variant for a same-sample structure, the grouping variable for a cross-group one, whether a reference cell was pre-specified or picked from the data, and the pattern for a pattern-equality test – the [reporting note](#reporting-comparisons) under the comparison section lists them
- The p-value route wherever it is not the default: the analytic *t* for distance correlation, the Monte-Carlo χ² for φ / Cramér's V, a permutation p for the rank or information-theoretic methods – and, where covariates were active alongside a permutation p, that it followed the Freedman–Lane scheme and is approximate
- For the information-theoretic measures: the [discretization rule and bin count](#discretization-bins), since the coefficients are only comparable within one grid
- How [missing data](#missing-data) were handled (pairwise or listwise deletion, or imputation)
- The [p-value adjustment](#p-value-adjustment) method, if any
- The CI method (analytic / bootstrap, with the replication count) and the confidence level, if reporting intervals
- For a negligibility test: that you used TOST, the margin Δ, and that Δ was chosen a priori
- Sample size

**Results:**
- The coefficient with its symbol (r, ρ, τ, …) and, for a directional measure, its [direction](#directional-asymmetric-methods)
- Its confidence interval, if computed
- For partial analyses: the zero-order coefficient alongside, so readers can see the effect of controlling
- The p-value (exact or as an inequality), adjusted and raw if both are shown
- For a negligibility test: the equivalence p-value **p (Δ)** (raw and adjusted if both are shown), the margin Δ used, and whether the test was two-sided (signed coefficient) or one-sided (unsigned measure); a **p (Δ)** sitting at the $1/(B + 1)$ floor is reported as "≤ $1/(B + 1)$ at B replications", not as an exact value
- Sample size per pair, if pairwise deletion was used and N varies
- The strength label, if you read it – naming the band set it comes from for an unsigned measure
- For matrix output: whether the full matrix or selected pairs are reported
- For difference tests: both coefficients (or, for a joint test, the statistic alone), Δr with its confidence interval, the test statistic with its df, and the p-value – adjusted and raw if both are shown
- For a network: the edge weights, and for the regularised estimator the number of edges selected out of the possible total – stating that its absent edges were shrunk to zero rather than tested and found non-significant
- For a network's [centrality and communities](#centrality-and-communities): strength and expected influence together rather than strength alone, as raw sums on the coefficient's own scale, and the number of communities with the signed modularity beside it, described as a property of that network rather than as a factor count

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. Correlation analysis uses base R (`cor.test`) for Pearson, Spearman, Kendall and the point-biserial, `polycor` for the polychoric, polyserial and tetrachoric coefficients, `infotheo` and `aricode` for the information-theoretic family, `energy` for distance correlation, `Hmisc` for Hoeffding's D, `XICOR` for Chatterjee's ξ, `ppcor` for the partial and semi-partial coefficients and the unregularised [network](#partial-correlation-network), and `igraph` for the network's [community partition](#centrality-and-communities); Blomqvist's β, the correlation ratio, the signed φ, Goodman & Kruskal's γ and Somers' D, the rank and information-theoretic permutation tests, the equivalence tests, the graphical lasso and the signed modularity are computed in the module's own R code, with no further package. Two parts run in the browser on what R returns and so do not appear in the console: the network's strength and expected influence, summed from the edge list, and the [comparison card](#testing-differences-between-correlations)'s difference tests, joint tests and Δr intervals, which post-process the coefficients. Every resampling step – the bootstrap intervals, the permutation and Monte-Carlo p-values, the standard errors a TOST resamples on demand, the comparison card's bootstrap and the scatterplots' bootstrap bands – runs under [**Bootstrap seed**](./settings.md#bootstrap-seed), and the community search under [**Reproducibility seed**](./settings.md#reproducibility-seed), an empty one disclosed on the network card; Chatterjee's ξ and distance correlation's row subsample draw under fixed seeds of their own, so they repeat whatever the settings say. Citations for every method and package your analysis actually used – the coefficients, their interval and p-value routes, the comparison tests and the plots – appear automatically at the top of the output section. The decisions behind these choices – estimators, corrections, seeds, caps and what a run refuses – are argued in the [method notes](./methods/correlation-analysis.md).

## Common pitfalls

**Correlation is not causation.** Ice-cream sales and drownings rise together every summer without either causing the other: a coefficient measures association and says nothing about direction, and a third variable driving both is a [confounder](./concepts/regression-basics.md#b-confounder). A [partial correlation](#controlling-for-covariates-partial-semi-partial-correlation) removes the confounders you measured; a causal claim needs a design, not a coefficient.

**Pearson's r only captures linear relationships.** Two variables can be tightly dependent along a curve and still show r ≈ 0. Spearman's ρ and Kendall's τ rescue a [monotonic](./concepts/parametric-nonparametric.md#b-rank-correlation) curve – always rising or always falling – and nothing else: a U or an inverted U reverses direction halfway and reads near zero under all three, the case the [dependence detectors](./concepts/association.md#dependence-beyond-a-monotone-trend) exist for. Turn on [**Scatterplots**](#scatterplots) and read the smoother, or run **Check assumptions** – its [beyond-monotone screen](#non-monotonic-dependence-dcor-cross-check) flags exactly such a pair – before settling on a method.

**Large matrices require care, not avoidance.** A 30×30 matrix is 435 tests, and at α = 0.05 about 22 of them come out significant on pure noise – see [many tests at once](./concepts/hypothesis-testing.md#many-tests-at-once). Keep a [p-value adjustment](#p-value-adjustment) on for any full matrix, and say which kind of analysis it was: pairs picked *after* seeing the results are exploratory whatever the matrix size and are reported as such, while pairs motivated upfront, with a correction applied, can carry a confirmatory claim however large the matrix.

**Outliers can dominate Pearson's r.** One extreme point can inflate or erase a Pearson correlation. The assumptions card's [influential points](#b-influential-points-cooks-d) check names such a pair, and the robust choices are a rank method – Spearman's ρ, Kendall's τ – or Blomqvist's β, which reads only the medians; see [outlier](./concepts/outliers-missing-data.md#b-outlier). Look at the scatterplot before trusting a single number.

**Unsigned measures aren't comparable to signed ones.** A Pearson r of 0.5 and an NMI of 0.5 are different amounts of association: r's 0.5 is a moderate linear relationship, NMI's 0.5 says half of the two variables' average entropy is shared – a far stronger statement – and Cramér's V, ε², distance correlation and Hoeffding's D each sit on a scale of their own, which is why the [Interpretation](#interpretation) column bands each on its own cutoffs. Do not read a signed coefficient against an unsigned one across methods, and do not expect the two to agree on the same pair – see [signed](./concepts/association.md#b-signed-measure) and [unsigned measures](./concepts/association.md#b-unsigned-measure).

**Asymmetric measures need both directions.** Somers' D, Theil's U and Chatterjee's ξ answer "how well does the row variable predict the column variable?", so A → B and B → A are different numbers and both triangles of the matrix are filled and meaningful – see [directional measure](./concepts/association.md#b-directional-measure). A single reported number names its direction – "U(Y | X) = 0.42", never "U = 0.42" – and neither automatic preset ever picks one of the three, so an asymmetric run is always an explicit choice.

**Correlating two time-ordered series inflates *r*.** Two trending or seasonal series show a near-perfect Pearson correlation because they share the trend or the cycle, not because they move together at any given moment – the textbook case is per-capita cheese consumption against deaths by bedsheet entanglement. Detrend and de-seasonalise first – the [Time series analysis](./time-series-analysis.md#exploration) module's exploration view shows the decomposition components you can correlate instead – or compute the cross-correlation of the differenced series.
