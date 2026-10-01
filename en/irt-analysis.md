---
title: IRT analysis
description: Item response theory including multidimensional MIRT – Rasch, 2PL, 3PL, GRM, GPCM, Mokken, DIF, factor loadings, and Wright maps in DataSuite 2.
---

# IRT analysis

Item response theory fits unidimensional IRT and multidimensional IRT (MIRT) models to questionnaire, test, or survey items. Unlike the [classical reliability metrics](./reliability-analysis.md) of the Reliability analysis module, which summarize the scale as a whole, IRT models each item individually – estimating how difficult it is, how well it discriminates between respondents, and where each person falls on the latent trait. {#irt-analysis #item-response-theory}

> **CTT or IRT?** Classical test theory grades the total score, IRT each item across the whole range of the trait – see [item response theory](./concepts/latent-variables.md#b-item-response-theory) and [classical test theory](./concepts/latent-variables.md#b-classical-test-theory).

> **What is θ?** The person's estimated position on the trait, on a scale with mean 0 and SD 1 – see [θ](./concepts/latent-variables.md#b-θ).

## How to use

1. [Select your items](./getting-started.md#choosing-variables) – at least two that pass the [requirements](#requirements) – and declare any [negatively keyed](#negatively-keyed-items) ones
2. Click **Diagnostics & Mokken** to [check the items](#preliminary-analysis) before fitting a model
3. Pick a [dimensionality](#dimensionality), [model type](#model-types), [estimation method](#estimation-method) and [scoring method](#scoring-method)
4. Optionally select a [grouping variable for DIF](#differential-item-functioning-dif), and choose the [output options](#output-options)
5. Click **Run IRT analysis**

## Requirements

- At least two items that pass the checks below; with fewer, **Diagnostics & Mokken** and **Run IRT analysis** both stop with a message.
- An item is numeric, varies, and has at most half its responses missing – a selected variable that fails any of these is excluded, and the card lists it with the reason.
- An item with two distinct values is dichotomous, whatever its type. One typed Ordinal in the data view is polytomous. A Continuous one is taken as polytomous when its values are 3–10 distinct integers – a note on the card says the classification was inferred – and is excluded otherwise, with non-integer values or more than 10 of them; type it Ordinal to keep it.
- The grouping variable picked for DIF is never an item, even when it is selected.
- A confirmatory MIRT fits only the items assigned to a factor – an unassigned item is excluded and listed – see [Confirmatory](#confirmatory).

## Preliminary analysis

**IRT preliminary analysis.** The card **Diagnostics & Mokken** opens: quick checks on the selected items, run without fitting an IRT model, so that problems surface before a fit is committed to. A check that fails in R keeps its section and says *Could not compute* with R's message. {#irt-preliminary-analysis}

- **Diagnostics & Mokken** – runs the checks below on the items the [requirements](#requirements) admit, under the global [missing-data setting](./settings.md#missing-data): with listwise deletion every check but the missing-data counts sees only the complete cases. Of the model settings it reads only the model type, for the sample-size grade; the DIF grouping variable is left out of the items here too.
- **AISP lowerbound (H)** – the scalability bound *c* the [automated item selection](#automated-item-selection-aisp) verdict is read at; default 0.3, anything above 0.99 read as 0.99 and an empty field as 0.3. The table sweeps its own range of *c* whatever the value.

### Data summary

The card opens on the item count, split into dichotomous and polytomous, and the **Sample size** – every row, with the complete cases beside it under listwise deletion. A note follows when a classification was inferred rather than set, and **Excluded variables** lists each selected variable left out, with its reason: non-numeric, no variance, more than 50% of responses missing, non-integer values, or too many unique values.

### Sample size adequacy

**Sample size.** The N the diagnostics ran on – the complete cases under listwise deletion, every row otherwise – graded against the selected model type: a warning when it falls short, and a line saying N appears adequate when it does not.

| Selected model | Warning below |
|---|---|
| Any | 100 |
| 2PL, Auto (detect from data) | 200 |
| 3PL, 3PLu | 500 |
| 4PL | 1000 |

Every other model type warns only below 100. The grade ignores the dimensionality: a multidimensional model needs more respondents than its unidimensional counterpart, and the more factors the more it needs.

### Item summary

**Item summary.** One row per item.

- **Type** – *dichotomous* or *polytomous*, as classified under [Requirements](#requirements) {#item-summary-type}
- **Categories** – the number of distinct values the item takes {#item-summary-categories}
- **Missing** – the item's blank responses, and **Missing %** their share of all rows {#item-summary-missing}

### Unidimensionality check

**Unidimensionality check.** The two largest eigenvalues of the inter-item correlation matrix, read against Reckase's criterion for essential unidimensionality – see [unidimensionality](./concepts/latent-variables.md#b-unidimensionality) and [eigenvalue](./concepts/latent-variables.md#b-eigenvalue). Its **Metric** and **Value** columns hold the four rows below. {#unidimensionality-check #unidimensionality-check-metric #unidimensionality-check-value}

- **First eigenvalue** – the variance, in units of one item, that the first component carries; **Second eigenvalue** the same for the second {#first-eigenvalue #second-eigenvalue}
- **Ratio (1st / 2nd)** – the first eigenvalue over the second; the criterion asks for at least 3. It reads "–" when the second eigenvalue is not positive
- **Variance explained by 1st component** – the first eigenvalue as a percentage of the item count, which is the matrix's total variance; the criterion asks for at least 20%

The verdict under the table reads both: **both met** – the item set is essentially unidimensional; **one met** – the evidence is mixed; **neither met** – consider a multidimensional model. When the second eigenvalue is not positive the correlation matrix is not positive definite, the ratio is undefined, and only the variance criterion is judged – the note says so.

A last note names the correlations the eigenvalues came from: **polychoric** when no item has more than 8 categories, a **mixed** matrix – polychoric between ordinal items, tetrachoric between binary ones, Pearson for any item with more than 8 – when some do, and **Pearson** when every item does – see [polychoric correlation](./concepts/association.md#b-polychoric-correlation). When the categorical estimator fails, the note says Pearson was used instead and gives R's message.

> **Neither criterion met?** A unidimensional model's parameters and scores are distorted on a multidimensional item set – explore the structure with [factor analysis](./factor-analysis.md), or fit an [exploratory or confirmatory MIRT](#dimensionality).

### Subject quality screening

**Subject quality.** Six indices that flag respondents whose answers may not be trustworthy – careless, straight-lined or outlying, the patterns [careless responding](./concepts/outliers-missing-data.md#b-careless-responding) describes – each row giving the cutoff actually used on this data. The high-missing and Mahalanobis cutoffs are fixed; the other four are [Tukey's fences](./concepts/outliers-missing-data.md#b-tukeys-fences) on each index's own distribution in this dataset, so a flag means "unusual here". Longstring and IRV read the answers as given, the other indices the items as the [negatively keyed items](#negatively-keyed-items) list reverses them.

- **Flag** – the letter the index writes into the [flag columns](#b-insert-quality-flags-into-dataset): M, L, V, C, R or D, in the order below {#subject-quality-flag}
- **Issue** – what the index looks for – the six entries below {#subject-quality-issue}
- **Cutoff** – the bar applied: a respondent past it is flagged. A cutoff shown as "–", or one outside the range the index can take, flags nobody – the index has too wide a spread, or none at all, for any case to fall outside its fence {#subject-quality-cutoff}
- **Count** – the respondents the index flagged, and **% of sample** their share of the rows screened {#subject-quality-count #of-sample}

The six indices:

- **High missing** – more than 50% of the items left blank (M)
- **Longstring (consecutive identical responses)** – the longest run of identical answers in consecutive items, blanks skipped: straight-lining, the same answer clicked down the page; flagged above the fence (L) – see [longstring](./concepts/outliers-missing-data.md#b-longstring)
- **Low response variability (normalized IRV)** – the spread of the person's own answers, as a fraction of the largest spread the response scale allows, so that scales with different numbers of categories compare; flagged below the fence (V) – see [IRV](./concepts/outliers-missing-data.md#b-intra-individual-response-variability-irv). It is not screened when every item is dichotomous, and a note says so
- **Low person-total correlation** – how closely the person's answers follow the item means of the rest of the sample: a pattern that runs against everyone else's; flagged below the fence (C) – see [person-total correlation](./concepts/outliers-missing-data.md#b-person-total-correlation)
- **Low resampled individual reliability** – the consistency of the person's own answers between two random halves of the items, averaged over 30 splits; flagged below the fence (R) – see [resampled individual reliability](./concepts/outliers-missing-data.md#b-resampled-individual-reliability). It needs at least six items, and reads "–" with fewer
- **Mahalanobis distance outlier** – a complete response pattern unusually far from the sample's centre, at p < .001 (D) – see [Mahalanobis distance](./concepts/outliers-missing-data.md#b-mahalanobis-distance). A note names the estimator: the [minimum covariance determinant](./concepts/outliers-missing-data.md#b-minimum-covariance-determinant-mcd) when there are more than twice as many complete cases as items and its covariance is not singular, the sample mean and covariance otherwise, with the reason. With no more complete cases than items plus one, no distance is computed

A last note counts the respondents who trip **two or more** indices – the ones worth reviewing before a fit; a single flag on a single index is expected in any sample.

- **Insert quality flags into dataset** – adds two columns to the data: `IRT_QC_nFlags`, each respondent's flag count, and `IRT_QC_Flags`, a categorical column of their letters (for example `LV`, `-` for none). Under listwise deletion the rows left out of the screen get no value

### Mokken scale analysis

**Mokken scale analysis.** [Nonparametric IRT](./concepts/latent-variables.md#b-nonparametric-irt): whether the items form a [Mokken scale](./concepts/latent-variables.md#b-mokken-scale), on which the probability of a higher answer only rises with the trait, without assuming the logistic curve a parametric model fits. Read it as a screen – items that do not scale here rarely fit a parametric model. It runs on the complete cases only, and a note gives both counts when that is fewer than the rows the checks above used; with fewer than three complete cases, or an item with no variance among them, the section says so and stops.

The scalability table opens the section, one row per item and a **Total scale (H)** row under them, each with its SE.

- **Hi** – the item's scalability coefficient H*i*: how well it orders respondents consistently with the other items – see [Loevinger's H](./concepts/latent-variables.md#b-loevingers-h) {#hi}
- **Total scale (H)** – [Loevinger's H](./concepts/latent-variables.md#b-loevingers-h) for the whole scale
- **Interpretation** – shown when [interpretation](./settings.md#significance-formatting) is on: the scale row read in Sijtsma and Molenaar's bands below, an item row *Admissible* at H*i* ≥ 0.3 and *Inadmissible* under it {#mokken-scale-analysis-interpretation}

| H | Scale row |
|---|---|
| ≥ 0.5 | Strong |
| 0.4–0.5 | Moderate |
| 0.3–0.4 | Weak |
| < 0.3 | Unscalable |

#### Item-pair H matrix

**Item-pair scalability (H_ij).** A symmetric matrix of the pairwise scalability coefficients – [Loevinger's H](./concepts/latent-variables.md#b-loevingers-h) for each item pair – its diagonal "–". High values mark item pairs that scale together, values near zero pairs that barely do, and a negative value an item that may need reverse scoring or exclusion.

#### Violation checks

The three checks that follow list only the items with a violation, and print a line saying none was found when no item has one. Their tables share the columns:

- **Violations** – the item's violations counted above the package's minimum size
- **Significant violations** – how many of them are significant
- **Max violation** – the largest of them
- **z(max)** – the largest violation's test statistic; **t(max)** under invariant item ordering on polytomous items, which is tested by a t-test {#zmax #tmax}
- **crit** – the seriousness index that combines the columns before it. The note under the table grades the largest: below 40 no serious violation, 40–80 a minor one, above 80 a serious one

**Monotonicity.** Whether the probability of endorsing each item rises, or at least never falls, with the trait; a serious violation means the item does not conform to the [monotone homogeneity](./concepts/latent-variables.md#b-monotone-homogeneity) model.

**Invariant item ordering.** Whether the items keep the same order of difficulty for every respondent – when it holds, "item A is harder than item B" is true of everyone rather than on average, which interpreting the item order requires – see [invariant item ordering](./concepts/latent-variables.md#b-invariant-item-ordering-iio). A note under the table gives the scale's H_T coefficient, and values of 0.3 and above support the ordering.

**Nonintersection (rest-score method).** Whether the item step response functions cross – the second half of [double monotonicity](./concepts/latent-variables.md#b-double-monotonicity). Where they intersect, a single item ordering does not hold at every level of the trait.

#### Nonparametric reliability

**Nonparametric reliability.** Three model-free reliability estimates, side by side.

- **Molenaar–Sijtsma (ρ)** – the nonparametric reliability for Mokken scales, the one to report
- **α** – [Cronbach's alpha](./concepts/reliability.md#b-cronbachs-alpha), for reference {#nonparametric-reliability-α}
- **λ₂** – [Guttman's λ2](./concepts/reliability.md#b-guttmans-λ2), a lower bound never below α {#nonparametric-reliability-λ₂}

#### Automated item selection (AISP)

**Automated item selection (AISP).** Partitions the items into [Mokken scales](./concepts/latent-variables.md#b-mokken-scale) at a scalability lowerbound *c*, swept rather than read once: one column per *c* from 0 to 0.55 in steps of 0.05, plus the **AISP lowerbound (H)** you set, each cell the scale the item joined at that *c* and "–" where it joined none. A partition that holds across several neighbouring columns is a finding; one that changes between them is an artefact of the chosen *c*, since the search can settle on a partition that is good rather than the best available – see [automated item selection](./concepts/latent-variables.md#b-automated-item-selection).

The verdict under the table is read at your *c*: every item in a single scale supports unidimensionality, several scales suggest a multidimensional structure, and items that enter no scale may not fit it at all. A *c* above the largest item-pair H is not searched – nothing would be scalable – and its column is dropped, the note saying so in place of the verdict.

## Dimensionality

- **Dimensionality** – how many traits the model has, and whether you or the data say which item measures which. The rest of the panel follows the choice: the [model types](#model-types) a mode cannot fit are greyed out, and a selected one falls back to **Auto (detect from data)**; the [output options](#output-options) that belong to one structure appear only under it.
- **Unidimensional** – the default: every item measures one trait, θ – see [unidimensionality](./concepts/latent-variables.md#b-unidimensionality). The standard IRT setting, for a scale written to measure a single construct.
- **Exploratory** – a [multidimensional IRT](./concepts/latent-variables.md#b-multidimensional-irt) (MIRT) model with the number of dimensions you set and every item free to load on every dimension – the IRT counterpart of an [exploratory factor analysis](./concepts/latent-variables.md#b-efa), fitted to the item responses themselves rather than to a correlation matrix. For when several traits are suspected but not which item measures which.
- **Confirmatory** – a [MIRT](./concepts/latent-variables.md#b-multidimensional-irt) model with the structure you specify: each item loads only on the factors you assign it to – the IRT counterpart of a [confirmatory factor analysis](./concepts/latent-variables.md#b-cfa). For a scale whose subscales are known in advance. Only the assigned items are fitted.

### Exploratory

- **Number of dimensions** – how many latent traits to extract; default 2, and the run stops with a message below 2. Under **EM** a note under **Estimation method** warns from 3 dimensions on.
- **Rotation method** – the criterion the loadings are rotated to: orthogonal keeps the dimensions uncorrelated, oblique lets them correlate – see [rotation](./concepts/latent-variables.md#b-rotation). Default **Oblimin**. It orients the loadings solution alone – the factor loadings table, its heatmap and the factor correlations; person scores, reliability, expected scores, the Wright map and the information curves stay in the fitted, unrotated basis, so a rotated loadings table beside an unrotated θ is not an inconsistency. The factor correlations are offered under an oblique rotation only.
- **None (unrotated)** – the fitted solution as it stands, the first dimension carrying as much as it can; rarely interpretable beyond two dimensions.

Orthogonal:

- **Varimax** – each dimension gets a few large loadings and many small ones – see [varimax](./concepts/latent-variables.md#b-varimax). Run without Kaiser normalization.
- **Quartimax** – each item gets one large loading and small ones elsewhere, which tends to leave a general first dimension – see [quartimax](./concepts/latent-variables.md#b-quartimax).
- **Minimum entropy** – minimises the entropy of the squared loadings, another route to simple structure.
- **Tandem I** – Comrey's first tandem criterion: items that correlate are put on the same dimension, which favours a general dimension.
- **Tandem II** – Comrey's second tandem criterion: items that do not correlate are kept off the same dimension, which spreads the loadings over the dimensions; the usual follow-up when Tandem I leaves a general dimension.
- **Geomin T** – the orthogonal geomin: asks only that each item have one near-zero loading, so a real cross-loading survives – see [geomin](./concepts/latent-variables.md#b-geomin).
- **Bentler's Invariant T** – the orthogonal form of Bentler's invariant pattern simplicity criterion, in practice close to varimax – see [Bentler's invariant](./concepts/latent-variables.md#b-bentlers-invariant).
- **Crawford–Ferguson T** – the orthogonal Crawford–Ferguson family, which weighs item complexity against dimension complexity by [**Crawford–Ferguson κ**](#b-crawford-ferguson-κ); at the default κ = 0 it is quartimax and returns the **Quartimax** solution.
- **Infomax T** – the orthogonal form of McKeon's infomax criterion, which reads simple structure in information-theoretic terms.
- **Bifactor** – one general dimension on every item plus group dimensions, all uncorrelated – see [bifactor model](./concepts/latent-variables.md#b-bifactor-model). Set the number of dimensions to one more than the groups you expect.

Oblique:

- **Oblimin** – the default: simple structure with the dimensions free to correlate – see [oblimin](./concepts/latent-variables.md#b-oblimin). Its weight is [**Oblimin γ**](#b-oblimin-γ); at the default γ = 0 it is quartimin, so **Quartimin** returns the same solution.
- **Promax** – varimax first, then an oblique rotation toward a target in which the small loadings are squashed (power 4) – see [promax](./concepts/latent-variables.md#b-promax).
- **Quartimin** – the oblique counterpart of quartimax, and the same solution as **Oblimin** at its default γ – see [quartimin](./concepts/latent-variables.md#b-quartimin).
- **Oblimax** – maximises the kurtosis of the loadings, pushing each toward zero or toward a large value.
- **Simplimax** – rotates toward a target in which the smallest loadings are zero – see [simplimax](./concepts/latent-variables.md#b-simplimax).
- **Geomin Q** – the oblique geomin – see [geomin](./concepts/latent-variables.md#b-geomin).
- **Bentler's Invariant Q** – the oblique Bentler's invariant, in practice close to oblimin – see [Bentler's invariant](./concepts/latent-variables.md#b-bentlers-invariant).
- **Crawford–Ferguson Q** – the oblique Crawford–Ferguson family, weighted by [**Crawford–Ferguson κ**](#b-crawford-ferguson-κ); at the default κ = 0 it is quartimin and returns the **Quartimin** solution.
- **Infomax Q** – the oblique form of the infomax criterion.
- **Biquartimin** – the oblique counterpart of **Bifactor**: a general dimension plus group dimensions free to correlate – see [bifactor model](./concepts/latent-variables.md#b-bifactor-model).

Two families take a parameter, in a field under the rotation:

- **Oblimin γ** – shown for **Oblimin**: the oblimin family's weight, default 0. At 0 the rotation is quartimin, at 0.5 biquartimin and at 1 covarimin; a higher value lets the dimensions correlate more, a negative one less. A blank field stops the run with a message.
- **Crawford–Ferguson κ** – shown for **Crawford–Ferguson T** and **Crawford–Ferguson Q**: the weight between item complexity (κ = 0) and dimension complexity (κ = 1), from 0 to 1, default 0. At 0 the rotation is quartimax (T) or quartimin (Q); in the orthogonal form 1/p for p items is varimax and k/(2p) for k dimensions equamax. A blank or out-of-range value stops the run with a message.

### Confirmatory

- **Variable** – the first column of the model matrix, one row per selected numeric item; each further column is a factor, and a ticked cell makes the item load on it. The matrix, its factor columns and **Auto-detect from names** work as in [confirmatory factor analysis](./structural-equation-modeling.md#cfa-model-specification). A factor name starts with a letter and holds only letters, digits and underscores, and mirt's statement words (COV, MEAN, CONSTRAIN, PRIOR, START, FIXED) are refused. The run needs at least two factors with an item each; an item assigned to no factor is left out and listed.
- **Correlated factors (oblique)** – on by default: the factors' correlations are estimated; cleared, the factors are held uncorrelated. The factor correlations output is offered only while it is on.
- **mirt syntax** – the matrix as mirt model syntax, one `Factor = items` line per factor and a `COV` line when the factors correlate; kept in step with the matrix. Edit it and **Apply** writes it back into the matrix, the `COV` line setting **Correlated factors (oblique)**; **Cancel** discards the edit and **Copy** puts the text on the clipboard. Items are named, or numbered from 1 in the order the preview lists them, singly or as ranges (`1-4`). mirt's other statement lines (MEAN, PRIOR, …) are dropped, since the matrix cannot hold them; a line that cannot be read, or fewer than two factors, is named under the box and nothing is applied.

## Model types

- **Model type** – the IRT model fitted to every item. The dropdown greys out what the [dimensionality](#dimensionality) cannot fit: the rating-scale, unfolding and nonparametric models are unidimensional only, and the partially compensatory ones confirmatory only. A model written for one response format on items of the other – a dichotomous model on a 1–5 item – stops the run with a message naming the items.
- **Auto (detect from data)** – the default: **2PL** for each dichotomous item and **Graded Response Model (GRM)** for each polytomous one, mixed in one model when the scale holds both.

### Dichotomous items

For two-category items – right or wrong, yes or no.

- **Rasch (1PL)** – difficulty only, one discrimination shared by all items, so the raw total score carries all the information about θ – see [Rasch model](./concepts/latent-variables.md#b-rasch-model). On polytomous items it fits the [partial credit model](./concepts/latent-variables.md#b-partial-credit-model). Unidimensional only.
- **2PL** – difficulty and discrimination per item: the standard choice when items may differ in how sharply they separate people – see [2PL](./concepts/latent-variables.md#b-2pl). Dichotomous items only.
- **3PL** – the 2PL plus a lower asymptote for [guessing](./concepts/latent-variables.md#b-guessing): multiple-choice tests – see [3PL](./concepts/latent-variables.md#b-3pl). The preliminary check warns below 500 respondents.
- **3PLu (upper asymptote, no guessing)** – the 2PL plus an upper asymptote below 1: even the most able respondent sometimes misses the item ("slipping"). The preliminary check warns below 500.
- **4PL** – both asymptotes, guessing and slipping. The preliminary check warns below 1000.
- **Ideal point (unfolding)** – for attitude statements a respondent endorses most when the statement sits near their own position and rejects when it is too extreme in either direction, so the response curve is single-peaked rather than rising with θ – see [unfolding](./concepts/latent-variables.md#b-unfolding). Dichotomous items, unidimensional only.

### Polytomous items

For ordered categories – a Likert scale, a rating.

- **Graded Response Model (GRM)** – the 2PL for ordered categories: one discrimination per item and one threshold per step, modelling the chance of answering at or above each category – see [graded response model](./concepts/latent-variables.md#b-graded-response-model). The usual choice for rating items.
- **Generalized Partial Credit Model (GPCM)** – one discrimination per item, modelling each step between adjacent categories rather than the cumulative ones; the alternative to the graded model, and the two rarely disagree in substance – see [generalized partial credit model](./concepts/latent-variables.md#b-generalized-partial-credit-model). Its steps may come out of order – see [disordered steps](./concepts/latent-variables.md#b-disordered-steps).
- **GPCM (IRT parameterization)** – the same model reported as difficulty-style thresholds rather than intercepts.
- **Generalized Rating Scale Model (GRSM)** – every item shares one pattern of thresholds, shifted by an item location, with its own discrimination; for items written to one response format – see [generalized rating scale model](./concepts/latent-variables.md#b-generalized-rating-scale-model). Polytomous items, unidimensional only.
- **GRSM (IRT parameterization)** – the same model reported in IRT-style parameters. Polytomous items, unidimensional only.
- **Rating Scale Model (Andrich)** – the Rasch model for rating scales: shared thresholds and one discrimination for all – see [rating scale model](./concepts/latent-variables.md#b-rating-scale-model). Unidimensional only.
- **Nominal Response Model** – a slope for every category, assuming no order among them; for categories whose order is in doubt, and rarely needed for a rating scale – see [nominal response model](./concepts/latent-variables.md#b-nominal-response-model).
- **GGUM (polytomous unfolding)** – the unfolding model for rating items, whose agreement peaks near the respondent's own position – see **Ideal point (unfolding)** and [unfolding](./concepts/latent-variables.md#b-unfolding). Unidimensional only.
- **Sequential response model** – each category is reached by passing the one below it, step by step: for ordered achievements rather than degrees of agreement – see [sequential response model](./concepts/latent-variables.md#b-sequential-response-model).

### Nonparametric items

Response curves estimated flexibly rather than assumed logistic – for items a parametric model misfits while the [Mokken](#mokken-scale-analysis) scalability holds. Unidimensional only. Neither reports slopes and difficulties: the item parameter table shows the model's own coefficients.

- **Spline-based** – each item's curve built from B-spline pieces, for idiosyncratic item shapes. Dichotomous items only. It fits without standard errors and defines no item or test information, so marginal reliability, the information curves and the conditional SEM are withheld rather than printed as zero, and the card says why; the characteristic and expected-score curves are estimated as usual, and are what to read the items from.
- **Spline interior knots** – shown under **Spline-based**: 1, 2 or 3 knots (default 3), spaced evenly across the trait from −2 to +2. Each knot costs a parameter per item, buying a more flexible curve at the price of a harder fit; at least one is always used.
- **Monotonic polynomial** – a curve that only rises with θ, its shape a polynomial rather than a logistic.

### Partially compensatory (confirmatory only)

In a standard MIRT model a high value on one dimension can make up for a low value on another; in a [partially compensatory](./concepts/latent-variables.md#b-partially-compensatory-model) one every dimension has to contribute. Confirmatory only, dichotomous items only.

- **PC2PL** – the partially compensatory 2PL.
- **PC3PL** – the partially compensatory 3PL, with a guessing parameter.

## Estimation method

- **Estimation method** – the algorithm mirt fits the model with; default **EM**. Each runs at mirt's own settings for it unless [Advanced tuning](#advanced-tuning) overrides them. Above three dimensions the fit and the scoring integrate by quasi-Monte Carlo points rather than a full grid. Standard errors of the item parameters are computed for every unidimensional model but **Spline-based**; for a multidimensional one only under **MHRM**, or when an **SE calculation** other than the default is chosen, and the card says when they were skipped. **MCEM**, **MHRM** and **SEM** are stochastic and not seeded, so two runs differ slightly.
- **EM** – the default: expectation–maximization over a fixed grid of quadrature points. Fast and deterministic at one or two dimensions, but the grid grows with every dimension, so from three on the note under the control recommends another method.
- **MCEM** – Monte Carlo EM: the E-step integrates by random draws instead of a grid.
- **QMCEM** – quasi-Monte Carlo EM: integrates by a quasi-random point set, more even than MCEM's draws, and stays tractable in high dimensions.
- **MHRM** – Metropolis–Hastings Robbins–Monro: stochastic, the method for three dimensions and more, and the one that computes standard errors for a multidimensional model by default.
- **SEM** – stochastic EM: the first stages of MHRM alone, faster in some settings.
- **BL** – Bock–Lieberman: maximises the full marginal likelihood directly rather than through EM; suited to short tests only.

## Scoring method

- **Scoring method** – how each person's θ is estimated from the fitted model; default **EAP**. It changes the person scores and everything computed from them – reliability and separation, person fit, targeting – and a note on the card names the method used.
- **EAP (expected a posteriori)** – the default: the mean of the person's posterior – see [EAP](./concepts/latent-variables.md#b-eap). Always finite, [extreme patterns](./concepts/latent-variables.md#b-extreme-response-pattern) included; [shrunk](./concepts/latent-variables.md#b-score-shrinkage) toward the mean, so the SD of θ understates the SD of the trait, as the card's note says.
- **MAP (maximum a posteriori)** – the mode of the posterior: finite for every pattern, and shrunk toward the mean like EAP – see [MAP](./concepts/latent-variables.md#b-maximum-a-posteriori-map).
- **MLE (maximum likelihood)** – no prior, so no shrinkage; but an all-minimum or all-maximum pattern has no finite estimate, and those respondents are dropped from every person-level statistic, the card counting them – see [MLE](./concepts/latent-variables.md#b-mle).
- **WLE (Warm's weighted likelihood)** – maximum likelihood with Warm's correction: no shrinkage toward the mean, MLE's outward bias removed, and a finite score for the extreme patterns MLE leaves out – see [WLE](./concepts/latent-variables.md#b-wle).

## Advanced tuning

The **Advanced tuning** accordion overrides mirt's own settings for the fit. A control left at its first choice passes nothing, so the [estimation method](#estimation-method)'s own defaults apply; a changed one reaches every model the run fits – the DIF models, the comparison models and the Q3\* bootstrap refits included.

- **SE calculation** – how the standard errors of the item parameters are computed. A choice other than **Default** also makes a multidimensional fit compute them, which it otherwise skips outside **MHRM**. mirt refuses the other types on its stochastic methods, so all three are greyed out under **MHRM** and **SEM**, and **Sandwich (robust)** and **Cross-product** under **MCEM**; a greyed-out choice falls back to **Default**.
- **Default** – the control passes nothing, and mirt applies its own setting for the model and the estimation method; each control's entry says what that is. For **SE calculation** it is the Oakes information matrix under the EM family.
- **Sandwich (robust)** – the sandwich estimator, which stays valid when the model is only approximately right; for a fit you suspect is misspecified.
- **Cross-product** – the outer product of each respondent's score vector, the cheapest of the three to compute.
- **Complete-data** – the information of the complete-data likelihood, as if θ were observed; it ignores the uncertainty in θ, so its standard errors run small.
- **Latent distribution** – the shape the model assumes for θ in the population. The empirical histogram is offered under **Unidimensional** with **EM** only; elsewhere it is greyed out and the run uses **Gaussian**.
- **Gaussian** – the default: θ is normal.
- **Empirical histogram** – θ's distribution is estimated alongside the items, as a histogram over the quadrature points, for a trait that is skewed or bimodal in the population.
- **Optimizer** – the numerical routine that maximises the likelihood within each cycle. By default mirt picks BFGS when every parameter is unbounded and nlminb when any is bounded, so the default depends on the model type; **GGUM** is fitted with **L-BFGS-B** unless another is picked here, and the card says so. An explicit choice always wins. Try another when the fit fails to converge.
- **Newton–Raphson** – steps on the second derivatives: fast near the optimum.
- **Nelder–Mead** – a derivative-free simplex search: slow, and a fallback when the gradient-based routines fail.
- **L-BFGS-B** – a quasi-Newton routine that respects parameter bounds; the one **GGUM** takes by default.
- **Quadrature points** – how many points per dimension the EM family integrates θ over. **Default** is mirt's count, 61 on one dimension and fewer as dimensions are added (31 on two); the finer grids are offered under **Unidimensional** only, and greyed out otherwise.
- **Fine (91)** – 91 points: more accurate integration, the tails of the trait especially, at a proportional cost in time.
- **Very fine (121)** – 121 points, for the same gain again.
- **EM accelerator** – the acceleration applied to the EM cycles of **EM**, **QMCEM** and **MCEM**; the other methods ignore it.
- **Ramsay** – the default: mirt's Ramsay acceleration.
- **SQUAREM** – the squared iterative method, which can converge in fewer cycles on a slow problem.
- **None** – plain EM steps: the slowest, and a check that the acceleration is not what keeps a fit from converging.
- **Convergence tolerance** – the change between cycles below which the fit stops; empty is mirt's default, 0.0001 under the EM family and 0.001 under **MHRM**. Smaller is more precise and slower.
- **Max iterations** – the cap on cycles; empty is mirt's default, 500 under the EM family and 2000 under **MHRM**. Raise it when the card warns that the fit did not converge but the estimates look stable.

## Differential item functioning (DIF)

Selecting a grouping variable tests every item for [differential item functioning](./concepts/latent-variables.md#b-differential-item-functioning) across its groups: a multiple-group model is fitted with the latent mean and variance free in every group but the reference, and each tested item is compared between a model holding it equal across the groups and one letting it differ, by a likelihood-ratio χ². The test contrasts the item's free discriminations and intercepts, and the output names them; the results are under [DIF results](#dif-results).

- **Grouping variable** – the column that defines the groups; every categorical and every two-valued column is listed, and the chosen one leaves the item pool. Cases with no value are excluded, and a toast counts them. The run stops when fewer than two groups remain, and warns when the smallest group has fewer than 100 cases, since each group's item parameters rest on its own cases.
- **None** – the default: no DIF analysis. {#grouping-variable-none}
- **Anchor items** – shown once a grouping variable is picked: the items held equal across groups and never tested, which put the groups on one θ scale – see [anchor items](./concepts/latent-variables.md#b-anchor-items). None is selected by default, and then every item is tested against all the others; select the items you know to be free of DIF and every other item is tested against them alone. **Select all** and **Deselect all** work the list; a selection covering every item leaves nothing to test and stops the run.
- **Select anchors empirically (purification)** – with no anchor selected, a preliminary pass tests every item against all the others and the items with the least DIF become the anchor set – a fifth of the items, at least four and never all – against which the rest are then tested. It is ignored while any anchor is selected, it doubles the fitting cost, and the output names the anchors it kept.
- **Add pairwise group comparisons** – shown when the grouping variable has three or more groups, where the main test is omnibus: it says an item differs somewhere, not between which groups. Adds a table testing each item between each pair of groups, on a model refitted to those two groups alone, with each pair's effect sizes; every item × pair test is corrected as one family. It costs one model fit per pair.

## Negatively keyed items

**Negatively keyed items.** The items worded against the trait, which the view reverses itself: unidimensional fits and the diagnostics read them reversed, while the [careless-responding screen](#subject-quality-screening) reads the answers as given. Fitted as it stands, such an item gets a negative discrimination and reads as misfitting in Mokken's H and the person-total correlation – see [reverse-keyed item](./concepts/reliability.md#b-reverse-keyed-item). Keep the answers in the data as respondents gave them and declare the keying here: the screen needs them unreversed, and detection cannot see a reversal made before import or in [Data transformation](./data-transformation.md#standardize). Nothing is selected by default.

- **Detect** – fills the list from the data as it is, without running the analysis: the items keyed against the majority of the set. An item too weakly related to the rest to place is left unselected and named under the buttons as unclassifiable; when as many items point one way as the other, the line under the buttons names the item whose direction the selection keeps. Detection misses a reversed item when agreeing with everything is as strong a habit in the sample as the trait itself, so the list, not detection, decides – check it against the questionnaire's scoring key. Disabled while **Already reversed in the data** is ticked; **Deselect all** clears the list, and **Invert selection** swaps the ticked items for the unticked ones.
- **Already reversed in the data** – off by default. Ticked, the fit and the diagnostics read the selected items as they stand, and the careless-responding screen un-reverses them to read the answers as given. Detection cannot tell an item reversed earlier from a positively keyed one, so this is declared by hand; leaving the data unreversed is preferred.

**Response scale range.** The endpoints the reversal mirrors around, `lowest + highest − old` – the same for every selected item.

- **Lowest** – the lowest value the response scale allows (1 on a 1–5 item). Leave it empty to use the lowest response observed across all the items, which the empty field shows greyed.
- **Highest** – the highest value the response scale allows. Leave it empty to use the highest response observed across all the items, which the empty field shows greyed.

Both cards name the items the run reversed – *Negatively keyed items, reversed for this run: {items}*, or *… already reversed in the data: {items}* – and every run applies detection to the data as the analysis reads it: an item it still reads as keyed against the rest – keying forgotten, reversed twice, or only some items pre-reversed – is named in a note pointing back to this list. An exploratory or confirmatory model reads the data as it is, and a note says so.

## Output options

### Tables

- **Item parameters** – on by default: the item parameter table – discrimination and difficulty or thresholds, intercepts and MDISC/MDIFF for a multidimensional model, the guessing and upper asymptotes where the model has them – with standard errors when they were computed; see [item statistics](#item-statistics).
- **Model fit summary** – on: the information criteria (AIC, BIC, log-likelihood) and the M2 test with RMSEA, SRMSR, TLI and CFI; see [model fit](#model-fit).
- **Item fit statistics** – on: S-X² per item with its *p*, and the infit and outfit mean squares with their standardized forms.
- **Person ability estimates (θ)** – on: a summary of the θ distribution, per dimension for a multidimensional model, with a button that inserts θ and its SE into the dataset – and the person-fit statistics, when those were computed.
- **Reliability and separation indices** – on: marginal and empirical reliability, person and item separation, and test targeting; for a multidimensional model, empirical reliability, person separation and targeting per dimension.
- **Person fit statistics** – off: counts the respondents with *Zh* below −2 (misfitting) and above 2 (overfitting), and those with infit or outfit above 1.5.
- **Local dependence (Q3 and LD-X²)** – off: the item pairs whose Q3\* passes the cutoff, 0.2 unless bootstrapped, and those whose LD-X² is significant at *p* < .05 after the adjustment. Ticking it shows the [Bootstrap the Q3\* critical value](#b-bootstrap-the-q3-critical-value) sub-option; see [local dependence](#local-dependence). {#local-dependence-q3-and-ld-x2-option}
- **Model comparison (LR tests)** – off; unidimensional only, and hidden for the unfolding, sequential and nonparametric models. Refits the scale's standard pair and compares them: Rasch against 2PL on dichotomous items, with a likelihood-ratio test; the graded model against GPCM on polytomous items, and on a mixed scale with 2PL for the dichotomous items, by AIC and BIC alone, since the two are not nested. A fitted model outside the pair joins as its own row, tested against 2PL when it is 3PL, 3PLu or 4PL.
- **Score conversion table (raw → θ)** – off; unidimensional only: every possible raw score with its θ and SE by true-score equating, beside the EAPsum θ where the model allows it; see [score conversion table](#score-conversion-table). {#score-conversion-table-option}
- **Expected scores by dimension** – on; multidimensional only: the expected total score at θ = −3 to 3 on each dimension, the others held at 0; see [expected scores by dimension](#b-expected-scores-by-dimension). {#expected-scores-by-dimension-option}
- **Compare dimensionalities** – off; exploratory only: refits the model at every dimensionality from 1 up to the one chosen and compares AIC, BIC and log-likelihood, with a likelihood-ratio test between each adjacent pair.
- **Compare against unconstrained exploratory** – off; confirmatory only: fits an exploratory model with as many dimensions and tests whether the confirmatory constraints cost fit – by a likelihood-ratio test when the confirmatory model nests in it, the card saying when it does not.
- **Factor loadings** – on; multidimensional only: the standardized loadings, rotated for an exploratory model, with the communalities; see [factor loadings](#b-factor-loadings). {#factor-loadings-option}
- **Factor correlations** – on; shown only under an oblique rotation or correlated confirmatory factors: the correlation matrix of the factors; see [factor correlations](#b-factor-correlations). {#factor-correlations-option}

### Plot options

- **Item characteristic curves (ICCs)** – on: each item's response probabilities across θ – one overlay for dichotomous items, category response curves and expected-score curves when any item is polytomous; see [item characteristic curves](#b-item-characteristic-curves). {#item-characteristic-curves-iccs}
- **Information and test characteristic curves** – on: item and test information, the standard error of θ and the test characteristic curve, in one figure; see [information functions](#b-information-functions).
- **Wright map (person-item map)** – on: the persons' θ distribution and the item locations side by side on one θ axis; see [Wright map](#b-wright-map-person-item-map). {#wright-map-person-item-map-option}
- **Conditional reliability curve** – off; unidimensional only: reliability as a function of θ, with a reference line at 0.70, as a section of its own rather than a panel of the information figure; see [conditional reliability](#b-conditional-reliability).
- **Factor loadings heatmap** – on; multidimensional only: the loadings table as a colour grid; see [factor loadings heatmap](#b-factor-loadings-heatmap). {#factor-loadings-heatmap-option}

## Reading results

The card opens on the data summary and on any note about how the model was fitted, then shows the sections below in this order, each when its [output option](#output-options) is ticked and the model admits it. A section whose computation failed keeps its heading and gives R's message in place of its table.

### Model fit

**Model fit.** Two tables: the information criteria – **AIC**, **BIC** and **Log-likelihood**, under **Index** and **Value** – and the model's absolute fit, under **Statistic**, **Value** and **Detail**. The information criteria are printed whatever happens to the absolute fit; on their own they say nothing, and they are read against another model's in the [model comparison](#model-comparison) and the [dimensionality comparison](#dimensionality-comparison) – lower is better, see [AIC](./concepts/regression-basics.md#b-aic) and [BIC](./concepts/regression-basics.md#b-bic). {#model-fit #model-fit-index #model-fit-value #model-fit-statistic #model-fit-detail}

- **M2** – the limited-information goodness-of-fit χ² of the model, with its df under **Detail** and its p on the **p-value** row; headed **M2\*** when any item is polytomous. Like the [chi-square test of model fit](./concepts/latent-variables.md#b-chi-square-test-of-model-fit), a significant value says the model does not reproduce the data exactly, and in a large sample it nearly always is. When it cannot be computed, a note gives R's message in place of the table and the information criteria stand alone
- **RMSEA** – the root mean square error of approximation built on M2, with its 90% confidence interval under **Detail** – see [RMSEA](./concepts/latent-variables.md#b-rmsea). The note under the table grades it: good fit below 0.05, acceptable below 0.08, poor from 0.08 {#model-fit-rmsea}
- **SRMSR** – the standardized root mean square residual: the average gap between the item correlations the model implies and those observed – the [SRMR](./concepts/latent-variables.md#b-srmr) under mirt's spelling. Printed without a grade
- **TLI** – the Tucker–Lewis index built on M2, against a baseline in which the items are unrelated – see [TLI](./concepts/latent-variables.md#b-tli). Printed without a grade
- **CFI** – the comparative fit index on the same baseline – see [CFI](./concepts/latent-variables.md#b-cfi). Printed without a grade {#model-fit-cfi}

### Model comparison

**Model comparison.** The item set refitted as the standard pair of unidimensional models for its response format, under the same [estimation method](#estimation-method) and [tuning](#advanced-tuning), one table per pair, compared on **AIC** and **BIC** – lower favours the model. {#model-comparison}

- **Model** – the model on the row. The pair is **Rasch** and **2PL** when every item is dichotomous, **GRM** and **GPCM** when every item is polytomous, and **2PL + graded** against **2PL + GPCM** on a mixed scale. A fitted model outside its pair joins the table as a third row under its dropdown name, with a note saying which it is {#model-comparison-model}
- **2PL + graded** – the mixed scale with the graded response model for its polytomous items; the dichotomous items keep 2PL in both fits
- **2PL + GPCM** – the mixed scale with the generalized partial credit model for its polytomous items

The likelihood-ratio test – **χ²**, **df** and **p** – is printed where one model nests the other: on the 2PL row of the Rasch pair, where a significant result favours freely estimated discriminations, and on the row of a fitted 3PL, 3PLu or 4PL, tested against 2PL; a row without a test reads "–". GRM and GPCM are not nested, and neither are the two mixed fits, so those tables carry the information criteria alone – see [likelihood-ratio test](./concepts/regression-basics.md#b-likelihood-ratio-test) and [nested models](./concepts/regression-basics.md#b-nested-models).

> **Reading the comparison.** Keep the simpler model unless the test and both criteria favour the richer one; BIC charges more per parameter than AIC, so when the two disagree the data cannot decide – see [BIC](./concepts/regression-basics.md#b-bic).

### Dimensionality comparison

**Dimensionality comparison.** Exploratory only: the model refitted at every dimensionality from 1 up to the one chosen, one row per count, under the same model type, estimation method and tuning – the chosen count's row is the fitted model itself. Each row after the first carries a likelihood-ratio test – **χ²**, **df** and **p** – against the row above it, one dimension fewer; the first row reads "–". The extra dimension earns its place where AIC and BIC fall and the test is significant. {#dimensionality-comparison}

- **Dimensions** – the number of dimensions of the row's fit

### Confirmatory vs exploratory fit

**Confirmatory vs exploratory fit.** Confirmatory only: an unconstrained exploratory model with as many dimensions, fitted to the same items, beside the confirmatory one, compared on the information criteria and a likelihood-ratio test on the confirmatory row. A non-significant *p* says the specified constraints cost no fit that matters; a significant one that the data prefer the more flexible structure. When the specification frees as many parameters as the exploratory model or more – every item on every factor, with correlated factors – it is not a restriction of it: the test is omitted, and the note says to compare the information criteria instead. {#confirmatory-vs-exploratory-fit}

- **Structure** – *Exploratory* for the unconstrained fit, *Confirmatory* for the specified one; **Dimensions** is the same on both rows {#confirmatory-vs-exploratory-fit-structure}

### Factor loadings

**Factor loadings.** Multidimensional only: one row per item and one column per dimension, the standardized loadings – rotated by the chosen [rotation](#exploratory) for an exploratory model, unrotated for a confirmatory one – with the communality **h²**, the share of the item's variance the dimensions explain; see [factor loading](./concepts/latent-variables.md#b-factor-loading) and [communality](./concepts/latent-variables.md#b-communality). The note under the table reads a loading above 0.3 as meaningful.

### Factor correlations

**Factor correlations.** Multidimensional only, and shown only under an oblique rotation or for a confirmatory model with correlated factors: the correlations between the dimensions, one row and one column per **Factor** – the rotated solution's for an exploratory model, the estimated latent covariance for a confirmatory one; see [factor correlation](./concepts/latent-variables.md#b-factor-correlation). {#factor-correlations #factor-correlations-factor}

### Item statistics

**Item statistics.** One table, one row per item: the item parameters when **Item parameters** is ticked and the item fit when **Item fit statistics** is. Which parameter columns appear depends on the model and the dimensionality, as below. An **SE(…)** column follows each estimate when standard errors were computed, and a note under the table says why they were not: skipped to keep a multidimensional fit affordable, unavailable for the model family, or not computable because mirt could not invert the information matrix – which usually means the data do not identify the model.

**Unidimensional parameter columns:**

- **Discrimination (a)** – how sharply the item separates respondents either side of its location – see [discrimination](./concepts/latent-variables.md#b-discrimination). The cell is red below 0.65 and amber from 0.65 to below 1.35, Baker's bands, and the note under the table reads 1.35 and above as high; a negative value is an item running against the trait, usually one missing from the [negatively keyed items](#negatively-keyed-items)
- **SE(a)** – the standard error of the discrimination; **SE(b)** and **SE(b{n})** the same for the difficulty and each threshold {#sea #seb #sebn}
- **Difficulty (b)** – dichotomous items: the θ at which the keyed answer becomes more likely than not; higher is harder – see [difficulty](./concepts/latent-variables.md#b-difficulty)
- **Threshold {n}** – polytomous items: one column per step between adjacent categories, each the location on θ of that step – see [threshold](./concepts/latent-variables.md#b-threshold). Under the generalized rating scale model every row holds one shared set of thresholds shifted to the item's location, so the gaps between them are equal across items, and a note under the table says so
- **Guessing (c)** – the lower asymptote, where the model frees it (3PL, 4PL): the chance of the keyed answer at the bottom of the trait – see [guessing](./concepts/latent-variables.md#b-guessing). Its standard error, **SE(logit c)**, is on the logit scale the asymptote is estimated on, not the probability scale of the estimate {#guessing-c #selogit-c}
- **Upper asymptote (u)** – the upper asymptote, where the model frees it (3PLu, 4PL): the ceiling on the chance of the keyed answer at the top of the trait; **SE(logit u)** likewise on the logit scale {#upper-asymptote-u #selogit-u}

**Multidimensional parameter columns:**

- **a1, a2, …** – the slope on each dimension, headed by mirt's parameter names, with **SE(a1)**, … beside them {#slope-per-dimension}
- **Intercept (d)** – the item's intercept, which replaces the difficulty once there are several slopes; **Intercept {n}**, one per step, on a polytomous item – see [intercept](./concepts/latent-variables.md#b-intercept-d). Their standard errors are **SE(d)** and **SE(d{n})**. The ideal-point model prints the same column {#intercept-d #intercept-n #sed #sedn}
- **MDISC** – multidimensional discrimination: the length of the item's slope vector, $\sqrt{\sum_k a_k^2}$ – how sharply the item discriminates in the direction it measures best
- **MDIFF** – multidimensional difficulty, $-d/\text{MDISC}$: the item's location along that direction. On a polytomous item, with an intercept per step, the column is headed **Mean location** and holds $-\bar d/\text{MDISC}$ – an approximate summary rather than a standard IRT quantity, as the note under the table says {#mdiff #mean-location}

**Family-specific parameter columns.** Several model families do not estimate a discrimination and a difficulty at all, so on a scale fitted with one of them throughout the table lays out what they *do* estimate, and a note on the family replaces the discrimination and difficulty bands; a scale that mixes families falls back to the generic columns above.

| Family | Columns | Note |
|---|---|---|
| **Nominal** | Category slope 1…*K*, category intercept 1…*K* | No assumed category order and no item location; no standard errors |
| **GGUM** | Discrimination (*a*), ideal point (*b*), latitude 1…*n* | An unfolding model: *b* is a position on the trait, not a difficulty |
| **Ideal point** | Slope (*a*), intercept (*d*), ideal point (θ) | The ideal point is −*d*/*a* |
| **Spline / Monotonic polynomial** | The basis coefficients as estimated | No discrimination or difficulty reading |
| **Sequential** | Discrimination (*a*), intercept 1…*n* | The generic layout |

- **Category slope {n}** – nominal model: the slope of category *n*, one per category in place of a single discrimination. No standard errors are shown, since mirt reports them in a different parameterisation from the estimates
- **Category intercept {n}** – nominal model: the intercept of category *n*
- **Ideal point (b)** – GGUM: the item's position on the trait, where agreement peaks and falls away on both sides; its discrimination is **Discrimination (a)**, as above
- **Latitude {n}** – GGUM: the subjective category thresholds, placed either side of the ideal point
- **Slope (a)** – ideal-point model: the item's slope, beside its **Intercept (d)**
- **Ideal point (θ)** – ideal-point model: the θ at which the response probability peaks, −*d*/*a*
- **Basis coefficients** – spline and monotonic polynomial models: every coefficient under mirt's own name (**s1**, **s2**, … on a spline), as estimated, with its **SE(…)** beside it when one was computed. They have no discrimination or difficulty reading: read those items from their characteristic and expected-score curves

An unfolding item's location is a position on the trait wherever the card uses it – the targeting verdict below reads as positions, not as a test too easy or too hard.

**Fit columns:**

- **S-X²** – Orlando and Thissen's item-fit χ², with its **df** and **p**, the items adjusted as one family under [multiple comparison adjustment](./settings.md#multiple-comparison-adjustment) – see [S-χ²](./concepts/latent-variables.md#b-s-χ²). A significant value marks an item whose answers stray from its curve
- **Infit MNSQ** – the information-weighted mean-square fit, expected 1, which weighs the respondents near the item's location – see [infit](./concepts/latent-variables.md#b-infit)
- **Infit ZSTD** – the infit mean square standardized, read as a z against ±2
- **Outfit MNSQ** – the unweighted mean square, expected 1, more sensitive to unexpected answers far from the item's location – see [outfit](./concepts/latent-variables.md#b-outfit)
- **Outfit ZSTD** – the outfit mean square standardized, read as a z against ±2

The note under the table reads the mean squares for a Rasch-family model: 0.5–1.5 productive for measurement, above 2.0 degrading it. For any other model it shows the band for reference only.

### Local dependence

**Local dependence (Q3 and LD-X²).** The item pairs that either statistic flags, one row each; a pair flagged by one statistic only has no value under the other. When no pair is flagged, the section says so and that the local independence assumption is supported – see [local dependence](./concepts/latent-variables.md#b-local-dependence).

- **Item 1** – the first item of the pair; **Item 2** the second {#item-1 #item-2}
- **Q3** – Yen's Q3: the correlation between the two items' residuals once θ is accounted for – see [Yen's Q3](./concepts/latent-variables.md#b-yens-q3). Printed for reference; the flag reads Q3\*
- **Q3\*** – Q3 minus the mean of every off-diagonal Q3, a note under the table giving that mean. A pair is flagged when |Q3\*| exceeds the cutoff: 0.2, or the bootstrapped value below {#q3-star}
- **LD-X²** – Chen and Thissen's local-dependence χ² for the pair, with its **p**. A pair is flagged when its p, adjusted over every item pair as one family under [multiple comparison adjustment](./settings.md#multiple-comparison-adjustment), is below .05 – a fixed bar, not the significance level

**Bootstrap the Q3\* critical value.** The sub-option under **Local dependence (Q3 and LD-X²)**: in place of the 0.2 cutoff, the (1 − α) percentile – α the [significance level](./settings.md#significance-level) – of the largest |Q3\*| across datasets simulated from the fitted model, each refitted, one per [bootstrap replication](./settings.md#bootstrap-replications) and drawn under the [bootstrap seed](./settings.md#bootstrap-seed). A note gives the percentile and the replication count; if the bootstrap fails, the note gives the reason and the 0.2 cutoff is used.

> **Flagged pairs?** Two items that share wording, a stimulus or a second dimension – combine them into one item, drop one of the pair, or fit the dimension they share – see [local independence](./concepts/latent-variables.md#b-local-independence).

### Person ability estimates

**Person ability estimates.** A summary of the θ the [scoring method](#scoring-method) estimated – one column of **Statistic** and **Value** for a unidimensional model, one row per **Dimension** for a multidimensional one – with a note naming the scoring method and what it implies for the spread. Respondents with no finite θ – all-minimum or all-maximum patterns under MLE – are left out of every person-level statistic, and a note at the top of the card counts them. {#person-ability-estimates #person-ability-estimates-statistic #person-ability-estimates-value}

- **Mean θ** – the mean estimate; close to 0, where the model fixes the trait's mean
- **SD θ** – the spread of the estimates; under EAP and MAP it understates the trait's SD, since those estimates are shrunk toward the mean
- **Min θ** – the lowest estimate; **Max θ** the highest {#min-θ #max-θ}
- **Mean SE** – the average standard error of θ across the respondents; smaller is more precise – see [SE(θ)](./concepts/latent-variables.md#b-seθ)
- **Insert θ and SE into dataset** – adds each respondent's θ and its standard error to the data, named for the scoring method: `IRT_Theta_EAP` and `IRT_SE_EAP` for a unidimensional model, `IRT_Theta1_EAP`, `IRT_SE1_EAP`, `IRT_Theta2_EAP`, … for a multidimensional one. When person fit was computed the button reads **Insert θ, SE, and person fit into dataset** and adds `IRT_Zh`, `IRT_Infit` and `IRT_Outfit` as well. A row left out of the run gets no value {#insert-θ-and-se-into-dataset #insert-θ-se-and-person-fit-into-dataset}

### Person fit

**Person fit.** How many respondents answered in a pattern the model fits poorly, under **Criterion** and **Count**, each count out of the respondents scored – see [person fit](./concepts/latent-variables.md#b-person-fit). The note under the table says how many respondents fall past each Zh cutoff by chance alone – a count near it is no finding – and, for a model outside the Rasch family, that the 1.5 mean-square cutoffs are a Rasch convention and Zh the more reliable indicator. {#person-fit #person-fit-criterion #person-fit-count}

- **Persons with Zh < −2 (misfitting)** – Zh is the standardized log-likelihood of the respondent's answers: below −2 the pattern is less likely than the model expects – guessing, careless or idiosyncratic answering
- **Persons with Zh > 2 (overfitting)** – above 2 the pattern is more consistent than the model expects, as a rigidly regular response style is
- **Persons with infit > 1.5** – the respondent's information-weighted mean square above 1.5: unexpected answers on items near their own θ
- **Persons with outfit > 1.5** – the unweighted mean square above 1.5: unexpected answers on items far from their θ

### Reliability and separation

**Reliability and separation.** How precisely the test measures the sample and how finely it separates it, under **Index** and **Value**; on a multidimensional model one row per **Dimension**, with the person-side indices only and a note on how targeting is read there. With [interpretation](./settings.md#significance-formatting) on, an **Interpretation** column grades each index. {#reliability-and-separation #reliability-and-separation-index #reliability-and-separation-value}

- **Empirical reliability** – the reliability the sample's θ estimates achieved, from their variance and standard errors, in the form the [scoring method](#scoring-method) needs – see [empirical reliability](./concepts/latent-variables.md#b-empirical-reliability)
- **Marginal reliability** – the reliability the model implies for the population it assumes: the test information averaged over the latent distribution – see [marginal reliability](./concepts/latent-variables.md#b-marginal-reliability). Unidimensional only, and N/A for a model with no test information, the [spline family](#nonparametric-items)
- **Person separation** – the spread of the persons' θ in units of their measurement error, from the empirical reliability – see [person separation](./concepts/latent-variables.md#b-person-separation)
- **Number of strata** – how many statistically distinct levels of the trait the separation implies, $(4G + 1)/3$ for a separation *G*; graded by no verdict
- **Item reliability** – the same question asked of the items: how reproducibly their locations are ordered, from the spread of the locations against their standard errors. Unidimensional only; it needs the item parameters' standard errors and reads N/A without them. Headed **Item reliability (Rasch-style)** when the model is outside the Rasch family, whose index it is {#item-reliability #item-reliability-rasch-style}
- **Item separation** – the items' counterpart of person separation, from the item reliability; **Item separation (Rasch-style)** likewise outside the Rasch family {#item-separation #item-separation-rasch-style}
- **Test targeting (person − item mean)** – the mean θ minus the mean item location, in θ units: positive when the sample sits above the items, so the test is easy for it, negative when below – see [test targeting](./concepts/latent-variables.md#b-test-targeting). An item's location is its difficulty, the mean of its thresholds on a polytomous item, and its ideal point under the unfolding models; a family with no location parameter – nominal, spline – leaves the targeting N/A
- **Separation** – multidimensional: the person separation on the dimension {#reliability-and-separation-separation}
- **Strata** – multidimensional: the number of strata on the dimension {#reliability-and-separation-strata}
- **Targeting** – multidimensional: the dimension's person mean minus the mean location, on that dimension, of the items that load highest on it; a dimension no item loads highest on has none {#reliability-and-separation-targeting}
- **Interpretation** – the reliabilities on the shared reliability bands: *Unacceptable* below 0.50, *Poor* to 0.60, *Questionable* to 0.70, *Acceptable* to 0.80, *Good* to 0.90, *Excellent* from 0.90 and *Excellent (possible redundancy)* from 0.95; the separations and the targeting on the bands below. A multidimensional row joins its three verdicts {#reliability-and-separation-interpretation #high-ge-4-strata #adequate-ge-3-strata #low-2-strata #very-low-lt-2-strata #well-targeted #moderately-targeted #test-too-easy-for-sample #test-too-hard-for-sample #items-centred-on-sample #items-near-sample #items-below-the-samples-trait-level #items-above-the-samples-trait-level}

| Separation | Verdict |
|---|---|
| ≥ 3 | High (≥ 4 strata) |
| 2–3 | Adequate (≥ 3 strata) |
| 1–2 | Low (2 strata) |
| < 1 | Very low (< 2 strata) |

| Targeting | Verdict | Unfolding families |
|---|---|---|
| \|*t*\| < 0.5 | Well targeted | Items centred on sample |
| 0.5 ≤ \|*t*\| < 1.0 | Moderately targeted | Items near sample |
| *t* ≥ 1.0 | Test too easy for sample | Items below the sample's trait level |
| *t* ≤ −1.0 | Test too hard for sample | Items above the sample's trait level |

The unfolding verdicts apply when every item is fitted with GGUM or the ideal-point model, whose items have no difficulty to be too easy or too hard.

### Score conversion table

**Score conversion table (raw → θ).** Unidimensional only: every possible raw score, from the sum of the items' lowest observed values to the sum of their highest, with the θ it corresponds to and that θ's standard error.

- **Raw score** – the sum of a respondent's item scores – see [raw score](./concepts/latent-variables.md#b-raw-score)
- **θ (equating)** – the θ at which the model's expected total score equals the raw score – true-score equating – and **SE(θ) (equating)** its standard error, from the test information there. A raw score the expected-score curve never reaches, the lowest and the highest in practice, reads N/A {#θ-equating #seθ-equating}
- **θ (EAPsum)** – the mean of θ given the raw score, and **SE(θ) (EAPsum)** its standard error; shown when the model admits it {#θ-eapsum #seθ-eapsum}

> **Which column?** Under the Rasch family (Rasch, PCM, RSM) a raw score carries all the information about θ and the two agree in substance; under 2PL, 3PL or graded models two respondents with one raw score can differ in θ, and **θ (EAPsum)** is the mapping to read – see [raw score](./concepts/latent-variables.md#b-raw-score).

### Expected scores by dimension

**Expected scores by dimension.** Multidimensional only: the expected total score at θ = −3, −2, …, 3 on each dimension in turn, the others held at 0 – one row per **θ**, one column per dimension – so a column that climbs steeply is a dimension the total score is sensitive to; see [expected score](./concepts/latent-variables.md#b-expected-score).

### DIF results

**Differential item functioning (DIF).** One row per tested item, under a line naming the grouping variable, its groups with their sizes and the reference group, whose latent mean and variance are fixed – every difference is expressed relative to that group; see [differential item functioning](./concepts/latent-variables.md#b-differential-item-functioning). When the grouping variable leaves fewer than two groups, or the model has no slope or threshold to test, the section says so in place of the table.

- **Item** – the tested item; a † marks one whose model did not converge, so its test rests on an unconverged fit {#differential-item-functioning-dif-item}
- **Overall** – the likelihood-ratio test of every tested parameter of the item: **χ²**, **df** – the number of parameters contrasted – and **p**, with **p (adj)** beside it under [multiple comparison adjustment](./settings.md#multiple-comparison-adjustment) in addition mode {#differential-item-functioning-dif-overall}
- **Non-uniform** – the same test with the slopes alone released – see [non-uniform DIF](./concepts/latent-variables.md#b-non-uniform-dif); what the overall test adds on top of it is [uniform DIF](./concepts/latent-variables.md#b-uniform-dif). Printed when the model estimates slopes and something besides: one whose slopes are fixed (Rasch, the Andrich rating scale model) has no such split, and one whose only item parameters are slopes has nothing left over {#differential-item-functioning-dif-non-uniform}
- **Effect size** – with two groups only, the three expected-score effect sizes of Meade (2010) below; with three or more they are in the pairwise table instead {#differential-item-functioning-dif-effect-size}
- **SIDS** – the signed expected-score difference. A positive value means the item favours the focal group at equal levels of the trait
- **UIDS** – its unsigned counterpart. A large UIDS beside a SIDS near zero marks DIF that *reverses direction* across the trait – the signed measure cancels out where the unsigned one does not
- **ESSD** – the difference scaled by the expected-score standard deviation, so it is comparable across items and scales

The notes under the table name the parameters each test contrasted, which the df counts, and the anchor design: no anchors designated, so each item is anchored on all the others; the anchors you selected; or the anchors chosen by [purification](#b-select-anchors-empirically-purification), with their count.

When [pairwise comparisons](#b-add-pairwise-group-comparisons) are enabled, a second table follows: one row per item and pair of groups, each on a model refitted to those two groups alone, every item × pair test corrected as a single family, with the pair's effect sizes.

- **Groups** – the pair the row tests; its effect sizes are signed against the first of the two {#differential-item-functioning-dif-groups}

## Plots

Each plot is its own section of the card, in the order below, when its [plot option](#plot-options) is ticked and the model admits it. Every chart can be resized and saved as SVG, PNG or JPG from the buttons beside it – see [resizing and exporting charts](./getting-started.md#resizing-and-exporting-charts); a figure of several panels resizes from one handle. The curves are drawn over θ from −4 to 4, widened to one unit past the lowest and highest item location, and a multidimensional figure draws each curve along one dimension with the others held at 0, as the note under it says.

### Item characteristic curves

**Item characteristic curves.** The response probabilities of every item across θ – see [item characteristic curve](./concepts/latent-variables.md#b-item-characteristic-curve). When every item is dichotomous, one chart overlays the items: the probability of the higher of the two responses on the vertical axis, with a dashed line marking P = 0.5; a steeper curve is a more discriminating item, a curve further right a harder one. When any item is polytomous, every item is drawn in two panels instead: the *category response curves*, a small chart per item with one curve per response value – coloured by the value, so a category keeps its colour across items – and the *expected score curves*, one overlay of each item's expected score on its own response scale, which add up to the [test characteristic curve](#b-information-functions). On a multidimensional model each item's legend entry names the dimension its curve varies. {#item-characteristic-curves}

### Information functions

**Information functions.** A figure of up to three panels – see [item information](./concepts/latent-variables.md#b-item-information) and [test information](./concepts/latent-variables.md#b-test-information):

- *Information curves* – each item's information as a thin line and the test information as a thick one, one per dimension on a multidimensional model, with the [standard error of θ](./concepts/latent-variables.md#b-seθ), $1/\sqrt{I(\theta)}$, dashed against the right-hand axis
- *Test characteristic curve* – the expected total score across θ, on the items' own response scales; one curve per dimension on a multidimensional model
- *Conditional reliability* – the [conditional reliability](#b-conditional-reliability) curve: drawn here on a unidimensional model only while **Conditional reliability curve** is unticked, and always on a multidimensional one, one curve per dimension

A model fitted with the [spline family](#nonparametric-items) has no information function, so the section keeps its heading and a note says why in place of the figure; its characteristic curves are drawn as usual.

> **Reading the information curve.** The test measures most precisely where information peaks and the standard error dips – a screening test wants that peak at its cutoff, a general-purpose one a broad plateau; see [test information](./concepts/latent-variables.md#b-test-information).

### Wright map

**Wright map (person-item map).** The persons and the items on one θ axis – see [Wright map](./concepts/latent-variables.md#b-wright-map). On the left, *Persons*: a horizontal histogram of the θ estimates; on the right, *Items*: each item as a point at its location – its difficulty, the mean of its thresholds on a polytomous item, its ideal point under the unfolding models, where the axis reads *Trait / Ideal point (θ)* instead of *Ability / Difficulty (θ)* – with labels spread apart and tied to their points where they would overlap. A polytomous item's thresholds are ticks beside its point, and the note under the map says so. A multidimensional model draws one pair of panels per dimension, stacked, each holding the items whose largest slope is on that dimension; there are no threshold ticks, and a note says that a polytomous item's location averages its intercepts. A model with no item location parameter – on a unidimensional fit, the nominal and spline families – draws no map, and a note says why. {#wright-map-person-item-map}

> **Reading the map.** Items level with a cluster of persons measure those persons best, and persons with no item beside them are measured coarsely – see [test targeting](./concepts/latent-variables.md#b-test-targeting).

### Conditional reliability

**Conditional reliability.** Unidimensional only: the reliability of θ at each point of the trait, $I(\theta)/(I(\theta) + 1/\sigma^2_\theta)$, with a dashed reference line at 0.70 – where on the trait the test measures acceptably; a test with a high [marginal reliability](#b-marginal-reliability) can still measure poorly at the extremes. Ticking **Conditional reliability curve** draws it as its own section and drops it from the [information figure](#b-information-functions). A model with no information function (spline) keeps the heading with a note in its place, and a computation that failed gives R's message.

### Factor loadings heatmap

**Factor loadings heatmap.** Multidimensional only: the [factor loadings](#b-factor-loadings) table as a grid, one row per item and one column per dimension – rotated for an exploratory model, as in the table – each cell printing its loading and coloured by sign and size, blue positive and red negative, fading to white near 0.

## Assumptions

- **Unidimensionality** – a unidimensional model assumes the items measure one trait; check it with the [preliminary analysis](#unidimensionality-check) before fitting one. A multidimensional model assumes instead that they measure the dimensions it was given – see [unidimensionality](./concepts/latent-variables.md#b-unidimensionality)
- **Local independence** – once the trait is accounted for, the item responses are unrelated; items that share a stimulus, wording or content break it. Check it with the [local dependence](#local-dependence) output – see [local independence](./concepts/latent-variables.md#b-local-independence)
- **Monotonicity** – a higher trait makes the higher categories more likely; the unfolding models (GGUM, ideal point) assume a single-peaked curve instead. Checked by the preliminary analysis's [Monotonicity](#b-monotonicity) check {#assumptions-monotonicity}
- **Correct model specification** – the chosen model describes the data; check [model fit](#model-fit) and [item fit](#item-statistics), and weigh the [model comparison](#model-comparison)
- **Sufficient sample size** – parameters are estimated less precisely in small samples, and the richer models need more respondents; see [sample size adequacy](#sample-size-adequacy)
- **Items keyed in one direction** – a negatively worded item is reversed for a unidimensional fit, unless an unfolding model is used: select it under [negatively keyed items](#negatively-keyed-items) and leave the data as answered. **Detect** proposes the list, and the run names any item it still reads as reversed

## Missing data

The global [missing data setting](./settings.md#missing-data) decides which rows the model is fitted to. Under pairwise deletion, the default, every row is fitted, each person's θ estimated from the items they answered; under listwise deletion only the rows that answered every item are; under imputation the items are filled in before the fit and fitted as if observed. The card's data summary gives the sample size with the complete cases beside it.

In the [preliminary analysis](#preliminary-analysis) the eigenvalue and subject-quality blocks follow the same setting, while the Mokken blocks always run on the complete cases, since the `mokken` package does not accept missing responses; the output says which is which.

## Reporting checklist

**Method:**
- Dimensionality – unidimensional, exploratory with *k* dimensions and the rotation, or confirmatory with the factor structure and whether the factors correlate
- IRT model (e.g. "a graded response model was fitted with the `mirt` R package")
- Estimation method and scoring method for θ
- Number of items, their types (dichotomous, polytomous or mixed), and the sample size with its complete cases
- How missing data were handled
- The p-value adjustment applied to item fit, LD-X² and DIF
- Any advanced tuning that departs from the defaults
- Software and R packages used

**Results:**
- Model fit – M2 (M2\* with polytomous items) with its df and p, RMSEA with its 90% CI, SRMSR, TLI and CFI; AIC and BIC when comparing models or dimensionalities
- Item parameters with standard errors – per dimension for a multidimensional model, with MDISC and MDIFF
- Item fit – S-X² with its adjusted p, and infit and outfit where they apply
- The θ distribution (mean, SD, range), per dimension for a multidimensional model
- Reliability and separation – marginal reliability for a unidimensional model, empirical reliability and person separation per dimension for a multidimensional one
- Factor loadings, and factor correlations under an oblique rotation or correlated factors, for a multidimensional model
- Problem items – low discrimination, misfit, local dependence
- DIF, if tested – the grouping variable, the anchor design, the adjusted p and the effect sizes
- The Wright map or other plots as figures

## R reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md). IRT analysis uses the `mirt` R package for model fitting, rotations, item and person parameters, fit statistics, DIF, score conversion and the plotted curves. Preliminary analysis additionally uses `mokken` for scalability, monotonicity, IIO, nonintersection, nonparametric reliability and item selection, and `psych` for the polychoric and mixed correlations of the unidimensionality check. The robust Mahalanobis screen uses the minimum covariance determinant estimator from `MASS`. Citations for R packages appear automatically at the top of the output. The [Q3\* bootstrap](#local-dependence) is seeded by [**Bootstrap seed**](./settings.md#bootstrap-seed); the resampled individual reliability (RIR) sub-sample step and the MCD subsampling are seeded by [**Reproducibility seed**](./settings.md#reproducibility-seed) – set them for values that repeat across runs. The reasoning behind the thresholds, estimators, fallbacks and plots is in the [method notes](./methods/irt-analysis.md).

## Common pitfalls

**Running IRT without checking the data first.** The preliminary analysis catches unidimensionality violations, careless responders and items that do not fit a monotone model – problems that leave a fitted model's parameters looking precise and meaning nothing. Run **Diagnostics & Mokken** before the first fit.

**Choosing 3PL by default.** The guessing parameter is appealing for multiple-choice items but hard to estimate: below 500 respondents it is often poorly identified and can destabilise the whole model, which is why the [sample size check](#sample-size-adequacy) warns there. Start with 2PL, and add guessing only with a large sample *and* a 2PL that misfits systematically at low θ.

**Using EM at high dimensionality.** EM evaluates a full quadrature grid over every dimension, so from three dimensions on it may be very slow or fail to converge. Switch to QMCEM or MCEM, which integrate by sampling, or to **MHRM**, which is faster still and computes the item parameters' standard errors on a multidimensional model without being asked.

**Reading unrotated loadings.** An unrotated exploratory solution tends to put every item on the first dimension, so its loadings rarely show which items belong together. Keep the default **Oblimin**, or another rotation, unless you have a reason to read the fitted basis; the rotation reaches the loadings, their heatmap and the factor correlations alone.

**Ignoring item fit.** A model that fits well overall can still hold items that misfit badly, and one misfitting item distorts the θ of everyone near its location. Check S-X² and the infit and outfit statistics in the [item statistics](#item-statistics), not only the model fit.

**Over-interpreting DIF.** A significant DIF test does not by itself make an item biased: small differences become significant in large samples, and an item may reflect a real group difference rather than a testing artefact. Read the effect sizes in the [DIF results](#dif-results) beside the *p*-value.

**Treating θ as an exact score.** Every θ carries a standard error: two people at θ = 0.5 and θ = 0.7 are not meaningfully different when both have SE = 0.3. Read each θ with the SE [inserted](#b-insert-θ-and-se-into-dataset) beside it, and the [conditional reliability](#b-conditional-reliability) or the standard error curve of the [information functions](#b-information-functions) for where on the trait the test measures precisely.

**Forcing a parametric model when Mokken fails.** Items that do not form a scalable Mokken scale (H < 0.3) are unlikely to fit a parametric IRT model either; poor scalability usually means the items do not measure a single construct. Consider [factor analysis](./factor-analysis.md) or a multidimensional model before a unidimensional parametric fit.
