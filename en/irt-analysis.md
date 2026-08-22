---
title: IRT analysis
description: Item response theory including multidimensional MIRT – Rasch, 2PL, 3PL, GRM, GPCM, Mokken, DIF, factor loadings, and Wright maps in DataSuite 2.
---

# IRT analysis

The **Item response theory** tab (inside the Reliability analysis module) fits unidimensional IRT and multidimensional IRT (MIRT) models to questionnaire, test, or survey items. Unlike [classical reliability metrics](./reliability-analysis.md), which summarize the scale as a whole, IRT models each item individually – estimating how difficult it is, how well it discriminates between respondents, and where each person falls on the latent trait.

> **CTT vs. IRT in one sentence:** Classical Test Theory asks "how reliable is the total score?"; Item Response Theory asks "how does each item behave across the full range of ability?"

> **What is θ?** θ (theta) is the estimated latent trait – ability, attitude, symptom severity, whatever the scale measures. It's on a standardised scale centred at 0 with SD ≈ 1 (positive values above average, negative below). Unlike raw scores, θ is on an interval scale: the distance between θ = 0.5 and 1.0 is the same as between 1.0 and 1.5.

## How to use

1. [Select your items](./getting-started.md#choosing-variables) – at least two numeric variables
2. Pick a [dimensionality mode](#dimensionality) (unidimensional, exploratory, or confirmatory)
3. Click **Diagnostics & Mokken** to [check data suitability](#preliminary-analysis) before fitting a model
4. Choose a [model type](#model-types), [estimation method](#estimation-method), and [scoring method](#scoring-method)
5. Optionally select a [grouping variable for DIF](#differential-item-functioning-dif)
6. Adjust [advanced tuning](#advanced-tuning) only if you know why you need to
7. Toggle [output options and plots](#output-options)
8. Click **Run IRT analysis**

## Requirements

- At least two numeric variables must be selected.
- Items must be dichotomous (two unique values) or polytomous (ordinal, or continuous with 3–10 integer categories). Variables with more than 10 unique values or non-integer values are excluded unless their type is explicitly set to ordinal in the data view.
- For confirmatory MIRT, each item must be assigned to at least one factor.
- At least one output option must be enabled.

> **Automatic item classification:** DataSuite inspects each variable before analysis. Binary variables are always treated as dichotomous. Ordinal variables are polytomous. Continuous variables with 3–10 unique integer values are inferred as polytomous – but you'll see a note when this happens. For best results, set variable types explicitly in the data view.

## Preliminary analysis

Click **Diagnostics & Mokken** to run a set of quick diagnostics *without* fitting an IRT model. This is a low-cost way to catch problems before committing to a full analysis.

### Item classification summary

Lists how each selected variable was classified (dichotomous, polytomous, or excluded) and why. Excluded variables show a reason – e.g. too many unique values or non-integer data.

### Sample size adequacy

Warns when the sample is too small for the selected model:

| Model | Recommended minimum N |
|---|---|
| Rasch / 1PL | 100 |
| 2PL | 200 |
| 3PL, 3PLu | 500 |
| 4PL | 1000 |

These are rough guidelines – smaller samples can work but produce less stable parameter estimates. Multidimensional models generally need larger samples too; the more factors and parameters, the more respondents you need.

### Item summary table

A per-item table showing the variable type, number of response categories, and missing data count and percentage.

### Unidimensionality check

Reports the first two eigenvalues of the inter-item correlation matrix, their ratio, and the percentage of total variance the first component explains. The verdict applies **Reckase's criterion for essential unidimensionality**, which takes both quantities together:

| Criterion | Threshold |
|---|---|
| Variance explained by the 1st component | ≥ 20% |
| First eigenvalue ÷ second eigenvalue | ≥ 3 |

- **Both met** – the item set is essentially unidimensional
- **One met** – the evidence is mixed
- **Neither met** – consider multidimensional models

If the second eigenvalue is not positive the correlation matrix is not positive definite, the ratio is undefined, and only the variance criterion is applied – the output says so.

A note under the table names the correlation estimator the eigenvalues came from: **polychoric** when every item is ordinal, a **mixed** matrix (polychoric between ordinal items, tetrachoric between binary ones, Pearson wherever an item has more than 8 categories), or plain **Pearson** when every item has more than 8 categories – which is the appropriate estimator there. If the categorical estimator fails, the output says that Pearson was used instead and shows the error.

> **Why unidimensionality matters:** unidimensional IRT models assume all items measure a single latent trait. If the data is substantially multidimensional, item parameter estimates become distorted and person scores lose meaning. When neither criterion is met, either explore the structure with [factor analysis](./factor-analysis.md) or switch to [exploratory or confirmatory MIRT](#dimensionality).

### Subject quality screening

Six flags identify respondents whose data may be unreliable. The table shows each index, the cutoff that was actually used on your data, how many respondents it flagged, and what share of the sample that is:

| Flag | Issue | Cutoff |
|---|---|---|
| **M** | High missing | > 50% of items missing |
| **L** | Longstring (consecutive identical responses) | Tukey fence |
| **V** | Low response variability (normalized IRV) | Tukey fence |
| **C** | Low person-total correlation | Tukey fence |
| **R** | Low resampled individual reliability | Tukey fence |
| **D** | Mahalanobis distance outlier | p < .001 |

> **What are these flags?** Longstring detects straight-lining – people who click the same answer repeatedly. IRV catches near-zero variability across items, normalized by the largest SD the response scale allows so that scales with different numbers of categories are comparable. Person-total correlation compares each person's response pattern to the rest of the sample, and RIR does the same using random subsamples for stability. Mahalanobis distance identifies multivariate outliers whose overall response pattern is unusually far from the sample center.

> **Why sample-derived cutoffs?** The absolute values these indices are usually quoted with (longstring ≥ 5, IRV < 0.5, r < 0.1 …) have no reference distribution behind them and flag between a quarter and two-fifths of perfectly clean data. Instead, four of the six cutoffs are **Tukey fences** (1.5 × IQR beyond the quartiles) on each index's own distribution *in your dataset*, so a flag means "unusual here" rather than "past a number someone once printed". A cutoff shown as "–", or one outside the range the index can even take, flags nobody: the index has too wide a spread, or none at all, for any case to fall outside its fence.

Three further notes appear when they apply:

- **All items dichotomous** – response variability is not screened at all. On a binary scale the IRV is a deterministic function of the sum score, so it carries no information the other indices don't already have.
- **Mahalanobis estimator** – distances use the **minimum covariance determinant** estimator, whose centre and scatter the outliers themselves cannot inflate. It needs more than twice as many complete cases as items and a non-singular robust covariance; when either fails (singularity is the norm on items with few response categories) the classical sample mean and covariance are used, and the note says which limitation applied.
- **Converging flags** – the summary counts respondents tripping **two or more** indices. That is what's worth reviewing before fitting a model; a single flag on a single index is expected in any sample.

A button below the results lets you **insert quality flags into the dataset** – two new columns are added: `IRT_QC_nFlags` (count of flags per person) and `IRT_QC_Flags` (the flag letters, e.g. "LV").

### Mokken scale analysis

A nonparametric IRT approach that doesn't assume a specific functional form for item response curves. Several analyses are reported – read them together to decide whether parametric IRT is worth attempting.

> **When to use Mokken vs. parametric IRT:** Mokken has weaker assumptions – it doesn't require items to follow a logistic function, only that item responses increase monotonically with the trait. Use it as a preliminary screen. If Mokken scalability is poor, parametric IRT is unlikely to fare better.

#### Scalability coefficients (Loevinger's H)

Per-item H*i* and the total scale H indicate how well items form a Guttman-like scale. Sijtsma and Molenaar's bands apply to the **scale** coefficient:

| H | Interpretation |
|---|---|
| ≥ 0.5 | Strong scalability |
| 0.4–0.5 | Moderate |
| 0.3–0.4 | Weak |
| < 0.3 | Unscalable |

For an **individual item** the criterion is different – not strength but admissibility: an item is admissible in the scale when H*i* ≥ 0.3, and inadmissible below it. The per-item rows are labelled accordingly.

> **Mokken runs on complete cases.** The `mokken` package does not accept missing responses, so every block in this section is computed on the complete rows only. When that is fewer than the full sample, a note gives both counts – the eigenvalue and subject-quality blocks above still use every row, so the two parts of the diagnostics can legitimately report different N.

#### Item-pair H matrix (H_ij)

A symmetric matrix of pairwise scalability coefficients. Useful for spotting item pairs that cluster together (high H_ij) versus pairs that barely scale together (low or negative H_ij). Negative values flag items that may need reverse scoring or exclusion.

#### Monotonicity check

Tests whether the probability of endorsing each item increases (or at least doesn't decrease) with the latent trait. Items with significant violations may not conform to a monotone homogeneity model. Only items with violations are listed.

> **Reading `crit`.** The Mokken checks summarise each item's violations in a single `crit` statistic, and Molenaar and Sijtsma's guidance reads it in bands rather than against one threshold: **below 40** is no serious violation, **40–80** is a minor one worth noting, and **above 80** is a serious violation. The same bands are used for the monotonicity, IIO, and nonintersection verdicts below.

#### Invariant item ordering (IIO)

Tests whether items maintain the same order of difficulty across respondents. The coefficient **H_T** summarises IIO across the scale:

- **H_T ≥ 0.3** – items order consistently; a single difficulty ranking applies to everyone
- **H_T < 0.3** – item ordering depends on who's responding

> **Why IIO matters:** when IIO holds you can say "item A is harder than item B" without qualification. When it fails, that statement is only true on average – some respondents find A easier than B. Required for nonparametric person ordering.

#### Local independence (rest-score method)

A nonparametric counterpart to the Q3 / LD-X² checks done in the main analysis. Item pairs whose conditional association exceeds chance (after controlling for rest-score) are flagged. Redundant pairs inflate reliability and should be reviewed.

#### Nonintersection (rest-score method)

Tests the second half of double monotonicity: whether the item step response functions cross. Non-crossing steps are what makes a single item ordering hold at every level of the trait – if they intersect, the double monotonicity assumption fails and the nonparametric person ordering IIO promises is only approximate. Read with the same `crit` bands as monotonicity.

#### Nonparametric reliability

Three model-free reliability estimates, reported side by side:

- **Molenaar–Sijtsma (ρ)** – the preferred nonparametric reliability for Mokken scales
- **α** – Cronbach's alpha, shown for reference
- **λ₂** – Guttman's lambda₂, typically a slightly higher lower bound than α

#### Automated item selection (AISP)

Assigns items to scales at a given H lowerbound *c*. Rather than reporting one partition, the table sweeps *c* from 0 to 0.55 in steps of 0.05 (plus your own value) and gives **one column per lowerbound**, so you can see at a glance whether a partition is stable or an artefact of where you set the threshold. A "–" means the item entered no scale at that *c*.

The verdict below the table is read at the **AISP lowerbound** you set in the output panel (default 0.3): all items in a single scale supports unidimensionality, several scales suggests multidimensional structure, and unselected items may not fit the scale at all. If your *c* exceeds the largest item-pair H, `aisp` does not search it – nothing would be scalable – and the output says so instead of showing an empty column.

> **A local optimum, not the best partition.** Items are selected by the sequential search procedure (Hemker, Sijtsma & Molenaar 1995), which is greedy: it can settle on a partition that is good rather than the best available. Treat a partition that changes between neighbouring columns as noise, and one that holds across several as a finding.

## Dimensionality

The **Dimensionality** selector at the top of the model settings controls the overall structure of the IRT model. The rest of the UI adapts to the choice.

### Unidimensional

All items measure a single latent trait. This is the standard IRT setting – suitable for well-targeted questionnaires and tests with a single intended construct.

### Exploratory

Fits an exploratory multidimensional IRT (MIRT) model. You pick:

- **Number of dimensions** – how many latent factors to extract
- **Rotation method** – how the factor solution is oriented (see below)

Exploratory MIRT is analogous to exploratory [factor analysis](./factor-analysis.md) but preserves the IRT likelihood. Use it when you suspect multiple traits but don't yet have a specific hypothesis about which item loads on which factor.

> **Rotation methods:**
>
> - **Orthogonal rotations** (Varimax, Quartimax, Equamax, Varimin, Minimum entropy, Tandem I, Tandem II, Geomin T, Bentler T, Crawford–Ferguson T, Infomax T, Bifactor) produce uncorrelated factors. Simpler to interpret; factor correlations are fixed at 0.
> - **Oblique rotations** (Oblimin, Promax, Oblimax, Quartimin, Simplimax, Cluster, Geomin Q, Bentler Q, Crawford–Ferguson Q, Infomax Q, Biquartimin) allow factors to correlate. More realistic for most psychological constructs – related traits usually *are* correlated. **Oblimin** is a sensible default.
> - **None (unrotated)** shows the raw solution, dominated by a general factor; rarely directly interpretable.

**Rotation governs the loadings solution only.** It reorients the factor loadings table, its heatmap, and the factor correlations. Person scores, reliability, expected scores, the Wright map, and the information curves are all reported in the **fitted basis** and do not move when you change the rotation – so a rotated loadings table and an unrotated θ are not an inconsistency.

### Confirmatory

Fits a confirmatory MIRT model using a factor structure that you specify. Two ways to define the structure:

- **Factor assignment widget** – a matrix of items (rows) × factors (columns). Click a cell to toggle whether an item loads on a factor. This is the same widget used in [CFA](./confirmatory-factor-analysis.md).
- **mirt syntax** – a text editor in the accordion. Syntax is `FactorName = item1, item2, ...` (one line per factor; items can be 1-based indices or variable names). Edit freely and click **Apply** to update the widget.

The **Correlated factors** checkbox controls whether factors are allowed to covary (oblique) or constrained to be orthogonal.

> **When to use confirmatory vs. exploratory MIRT:** confirmatory mode is appropriate when you have a theoretical model of which items tap which trait – e.g. an emotion questionnaire with a predefined positive/negative affect structure. Exploratory mode is appropriate when the structure is unknown or tentative.

## Model types

Select a model from the **Model type** dropdown. **Auto** detects the best fit based on item types: 2PL for dichotomous items, Graded Response Model for polytomous items. The dropdown disables options that don't match the current dimensionality mode (e.g. Rasch is only available in unidimensional; PC2PL/PC3PL only in MD).

### Dichotomous items

| Model | Parameters | When to use |
|---|---|---|
| **Rasch (1PL / PCM)** | Difficulty only | Equal discrimination assumed; measurement-focused applications, Rasch tradition (UD only) |
| **2PL** | Difficulty + discrimination | Standard choice for binary items when items may differ in discrimination |
| **3PL** | Difficulty + discrimination + guessing (lower asymptote) | Multiple-choice tests where guessing is plausible; requires N ≥ 500 (UD only) |
| **3PLu** | Difficulty + discrimination + upper asymptote | Items where even high-ability respondents sometimes "slip" (careless errors); requires N ≥ 500 (UD only) |
| **4PL** | All four asymptotes | Combines guessing and slipping; requires N ≥ 1000 (UD only) |
| **Ideal point (unfolding)** | Item location + latent distance | Attitude items where *both* low and high θ produce rejection (e.g. political scales); UD only |

### Polytomous items

| Model | Parameters | When to use |
|---|---|---|
| **Graded Response Model (GRM)** | Thresholds + discrimination | Ordinal response scales (Likert); most common polytomous choice |
| **GPCM** | Thresholds + discrimination | Alternative to GRM; models adjacent category logits rather than cumulative |
| **GPCM (IRT parameterization)** | Same model as GPCM | Use when you want difficulty-style thresholds rather than intercepts |
| **GRSM** | Shared rating-scale structure + discrimination | All items share a common threshold pattern; differ only in overall location (UD only) |
| **GRSM (IRT parameterization)** | Same model as GRSM | IRT-style parameters for GRSM (UD only) |
| **RSM (Andrich)** | Rasch rating scale | Shared thresholds *and* equal discrimination (UD only) |
| **Nominal** | Category-specific slopes | Categories have no assumed ordering; rarely needed for standard questionnaires |
| **GGUM** | Polytomous unfolding | Polytomous attitude items with nonmonotonic response curves (UD only) |
| **Sequential** | Step-wise transitions | Items where reaching category *k* requires passing *k − 1* (e.g. ordered achievements); UD only |

### Nonparametric items

These don't assume a parametric curve shape – they fit the item response function flexibly. Use when standard parametric models misfit but Mokken scalability is acceptable. Both are UD-only.

| Model | When to use |
|---|---|
| **Spline-based** | Flexible curves via B-splines; good for idiosyncratic item shapes |
| **Monotonic polynomial** | Monotone curves without assuming logistic form |

Choosing **Spline-based** reveals a **Spline interior knots** control (1, 2, or 3; default 3). Knots are placed evenly across the trait between −2 and +2, and each one costs a parameter per item – more knots buy a more flexible curve at the price of a harder fit and more to estimate per item. mirt itself places none by default, which fits a flat response curve carrying no information about the trait at all, so DataSuite always uses at least one.

> **What the spline family cannot report.** Because a basis expansion has no closed-form derivative with respect to θ in mirt, the spline model defines no item or test **information**. Marginal reliability, the information curves, and the conditional SEM are therefore withheld rather than printed as zero, and the output explains why. Characteristic and expected-score curves are estimated normally – read the items from those.

### Partially compensatory (MD only)

In standard MIRT, a high value on one dimension can "compensate" for a low value on another. Partially compensatory models restrict that trade-off – every dimension must contribute.

| Model | Description |
|---|---|
| **PC2PL** | Partially compensatory 2PL |
| **PC3PL** | Partially compensatory 3PL (adds a guessing parameter) |

> **Rasch vs. 2PL:** the Rasch model constrains all items to have equal discrimination – only difficulty varies. This has a practical advantage: raw total scores become sufficient statistics for the latent trait, meaning everyone with the same total score gets the same ability estimate. The 2PL model relaxes this, letting each item discriminate differently, which typically improves fit but means raw scores are no longer sufficient.

> **What is the guessing parameter?** In the 3PL model, the lower asymptote (*c*) represents the probability of answering correctly by chance. For a 4-option multiple-choice item, you'd expect *c* ≈ 0.25. This parameter is notoriously hard to estimate and requires large samples (N > 500). If your test isn't multiple-choice, use 2PL instead.

> **What is unfolding?** In standard (cumulative) IRT the probability of endorsing an item increases monotonically with θ. In unfolding (ideal-point) models it's single-peaked – respondents agree with items closest to their position and reject items too extreme *or* too moderate relative to their own view. Political attitude items often behave this way.

## Estimation method

The UI offers all of mirt's estimators. For most unidimensional models, the default **EM** is both fast and reliable. Multidimensional models typically need **MHRM** once you go beyond two dimensions.

| Method | Description |
|---|---|
| **EM** (default) | Expectation-Maximization – fast, deterministic. Very slow at 3+ dimensions |
| **MCEM** | Monte Carlo EM – stochastic E-step; useful when integration is hard |
| **QMCEM** | Quasi-Monte Carlo EM – more accurate high-dimensional integration than MCEM |
| **MHRM** | Metropolis-Hastings Robbins-Monro – stochastic; **recommended for 3+ dimensions**. Produces standard errors for item parameters in MIRT |
| **SEM** | Stochastic EM – faster than MHRM in some settings |
| **BL** | Bock-Lieberman – classic two-dimensional quadrature; mainly historical |

> **Standard errors in MIRT:** EM and QMCEM do not compute the information matrix for multidimensional models – you'll see a note when SEs are missing. Use MHRM if you need standard errors on item parameters.

## Scoring method

Controls how person ability (θ) is estimated after the model is fit:

| Method | Description |
|---|---|
| **EAP** (default) | Expected A Posteriori – Bayesian estimate using the full posterior; stable, slightly shrunk toward the mean |
| **MAP** | Maximum A Posteriori – Bayesian mode; less shrinkage than EAP but more variable |
| **MLE** | Maximum Likelihood – no prior; produces extreme (±∞) scores for perfect or zero response patterns, which are filtered from person-level results |
| **WLE** | Weighted Likelihood (Warm) – MLE with a bias correction; bounded for extreme patterns, no shrinkage toward the prior mean |

> **Which scoring method?** EAP is the safest default – it always produces a finite estimate and handles extreme response patterns gracefully. WLE is a good alternative if you want no Bayesian shrinkage but still want finite estimates. MLE is theoretically "purer" (no prior influence) but fails for people who answer everything correctly or incorrectly.

The choice is disclosed in the output, because it changes how the numbers should be read. Under **EAP** and **MAP** a note warns that Bayesian estimates are shrunk toward the prior mean, so the SD of θ *understates* the SD of the latent trait. Under **MLE** the note says estimates are unshrunk but that all-minimum and all-maximum patterns receive no finite estimate; those respondents are dropped from every person-level statistic and the count is reported. **WLE** scores those patterns and removes MLE's outward bias.

> **This matters for reliability.** Empirical reliability and separation are computed from θ and its standard errors, so a scoring method that shrinks θ also changes them. DataSuite computes the reliability formula appropriate to the scoring method you chose rather than assuming one – a point worth checking if you are comparing against a number from another package.

## Differential item functioning (DIF)

DIF tests whether items function differently across groups (e.g. gender, language). Select a categorical or binary **grouping variable** to enable DIF analysis. DataSuite uses Woods's (2009) **constrained-baseline** approach: a multiple-group model is fit with every item constrained equal across groups, then each non-anchor item's constraint is released one at a time and the resulting likelihood ratio is tested.

### Anchor items

When a DIF grouping variable is selected, an anchor items panel appears. Anchor items stay constrained across groups and are never tested; every other item is released in turn and tested against them. By default all items are anchors, which means each item is effectively anchored on all the others – deselect the ones you want tested, or deselect all to test every item.

> **What is DIF?** An item shows DIF when people from different groups with the *same ability level* have different probabilities of endorsing it. For example, if men and women of equal math ability have different chances of answering a particular math item correctly, that item has DIF. DIF doesn't necessarily mean bias – the item might legitimately measure something that differs between groups – but it warrants investigation.

Which parameters each test contrasts depends on the model, and the output names them: for Rasch and RSM/GRSM families (constrained discrimination) only the location parameters, for other unidimensional models discrimination and location jointly, and for multidimensional models every per-dimension discrimination plus the intercept. Graded families are tested on all of their thresholds, so the degrees of freedom count them.

### Empirical anchor selection (purification)

Checking **Select anchors empirically (purification)** replaces the designated-anchor design with the two-stage empirical one (Woods 2009): a preliminary all-other-items pass runs first, the items showing the *least* DIF become the anchor set, and every remaining item is then tested against that set. It applies only while nothing is selected in the anchor list below it, and it doubles the fitting cost. The output names the procedure and how many anchors it kept.

> **Designated or empirical?** Anchors you *know* to be invariant give the strongest inference and should be preferred when you have them. Purification is the honest fallback when you don't: it is better than anchoring every item on all the others, which lets a genuinely biased item contaminate the baseline it is measured against.

### Pairwise group comparisons

With three or more groups the main test is an **omnibus** one – it says an item differs somewhere, not between which groups. Checking **Add pairwise group comparisons** adds a table testing each item between each pair of groups, on a model refit to those two groups alone, plus per-pair effect sizes. Every item × pair test is corrected as a single family, and each pair's effect sizes are signed against the first of its two groups.

The cost is one model fit per pair and a larger family of simultaneous tests, so enable it when you actually need to localise the difference.

### Non-uniform DIF and effect sizes

When the fitted model has free discriminations, the DIF table adds a **Non-uniform** column group beside the overall test. Those columns release the slopes alone; what the overall test adds on top of them is uniform DIF.

Three effect sizes accompany the tests (Meade 2010):

- **SIDS** – the signed expected-score difference. A positive value means the item favours the focal group at equal levels of the trait.
- **UIDS** – its unsigned counterpart. A large UIDS beside a SIDS near zero marks DIF that *reverses direction* across the trait – the signed measure cancels out where the unsigned one does not.
- **ESSD** – the difference scaled by the expected-score standard deviation, so it is comparable across items and scales.

## Advanced tuning

These options live in the **Advanced tuning** accordion. Leave defaults unless you know why you're changing them.

| Setting | Options | When to adjust |
|---|---|---|
| **SE calculation** | Default / Sandwich (robust) / Cross-product / Complete-data | Sandwich SEs are robust to model misspecification; useful when you suspect the model is approximate |
| **Latent distribution** | Gaussian / Empirical histogram | Empirical histogram relaxes the normality assumption on θ; only available for unidimensional + EM |
| **Optimizer** | Default / Newton–Raphson / Nelder–Mead / L-BFGS-B | Try a different optimizer if estimation fails to converge |
| **Quadrature points** | Default / Fine (91) / Very fine (121) | Increase for more accurate integration (slower); helpful at the tails of the distribution |
| **EM accelerator** | Ramsay (default) / SQUAREM / None | SQUAREM can speed up convergence in difficult problems; None for debugging |
| **Convergence tolerance** | Numeric (mirt default: 1e-4) | Tighten for more precise estimates (slower) |
| **Max iterations** | Numeric (mirt default: 500) | Increase when you see a convergence warning but estimates look stable |

> **What "Default" optimizer means.** mirt picks BFGS when every parameter is unbounded and nlminb when any is bounded, so the default depends on the model type – there is no single one to name. The exception is **GGUM**: its discrimination is bounded, and the bounded default fails on it outright ("NA/NaN gradient evaluation"), so DataSuite fits GGUM with **L-BFGS-B** whenever you have not picked an optimizer yourself. An explicit choice always wins, and the output card names the optimizer when it was forced.

> **Standard-error types are not universally available.** Sandwich and cross-product SEs are refused by MCEM; a requested SE type the fit did not return is reported as such rather than silently dropped. Some model families (the basis expansions) cannot produce an information matrix for their items at all, and the output says so.

## Output options

### Tables

| Option | Default | What it shows |
|---|---|---|
| **Item parameters** | On | Discrimination (*a*), difficulty (*b*) or thresholds, intercepts (*d*), MDISC/MDIFF (MD), guessing (*c*), upper asymptote (*u*), with standard errors when available |
| **Model fit summary** | On | AIC, BIC, log-likelihood, M2 statistic with RMSEA, SRMSR, TLI, CFI |
| **Item fit statistics** | On | S-X² per item with *p*-value; infit/outfit MNSQ |
| **Person ability estimates (θ)** | On | Summary statistics of θ distribution (per dimension for MD) with option to insert scores into dataset |
| **Reliability and separation** | On | Marginal reliability, person/item separation, test targeting (per dimension for MD) |
| **Person fit statistics** | Off | Count of misfitting persons (\|Zh\| > 2, outfit > 1.5) |
| **Local dependence (Q3 and LD-X²)** | Off | Flagged item pairs violating local independence; reveals the **Bootstrap the Q3\* critical value** sub-option |
| **Model comparison (LR tests)** | Off | Rasch vs. 2PL (binary) or GRM vs. GPCM (polytomous) with AIC/BIC and likelihood ratio test (UD only) |
| **Score conversion table (raw → θ)** | Off | Maps every possible raw score to its θ estimate and SE (UD only) |
| **Factor loadings** | On (MD) | Standardised factor loadings from the rotated solution |
| **Factor correlations** | On (MD, oblique) | Correlation matrix of factors when an oblique rotation or correlated confirmatory factors are used |
| **Expected scores by dimension** | On (MD) | Expected total score as a function of each dimension, holding others at θ = 0 |
| **Compare dimensionalities** | Off (exploratory) | Fits exploratory models at neighbouring dimensionalities and compares AIC, BIC, LR test |
| **Compare against unconstrained exploratory** | Off (confirmatory) | Tests whether the confirmatory constraints are tenable vs. a matched exploratory fit at the same dimensionality |

### Plot options

| Plot | Default | What it shows |
|---|---|---|
| **Item characteristic curves (ICCs)** | On | Probability of each response as a function of θ – overlay for dichotomous items, separate category response curves + expected score curves for polytomous items |
| **Information and test characteristic curves** | On | Item and test information functions, standard error curve, Test Characteristic Curve |
| **Wright map (person-item map)** | On | Side-by-side display of person ability distribution and item difficulty on a shared θ scale |
| **Conditional reliability curve** | Off | Reliability as a function of θ, with a 0.70 reference line – where on the trait the test measures well (UD only) |
| **Factor loadings heatmap** | On (MD) | Visual summary of item-by-factor loadings |

## Reading results

### Model fit

Two tables appear when model fit is enabled:

**Information criteria** – AIC, BIC, and log-likelihood. Lower AIC/BIC values indicate better fit-complexity trade-offs. These are most useful when [comparing models](#model-comparison) or [dimensionalities](#dimensionality-comparison).

**Absolute fit** (M2 statistic):

| Index | Good fit | Acceptable fit | Poor fit |
|---|---|---|---|
| RMSEA | < 0.05 | 0.05–0.08 | ≥ 0.08 |
| SRMSR | < 0.05 | 0.05–0.08 | ≥ 0.08 |
| TLI | > 0.95 | 0.90–0.95 | < 0.90 |
| CFI | > 0.95 | 0.90–0.95 | < 0.90 |

> **What is the M2 statistic?** A limited-information goodness-of-fit test designed for IRT models. Unlike χ² tests that compare all possible response patterns, M2 uses first- and second-order margins, making it practical for tests with many items. A significant *p*-value suggests misfit, but with large samples even trivial misfit becomes significant – focus on RMSEA and CFI instead.

### Model comparison

Available for unidimensional models when enabled. DataSuite fits an alternative model and reports AIC, BIC, and (for nested models) a likelihood ratio test:

- **Dichotomous items:** Rasch vs. 2PL – tests whether allowing discrimination to vary improves fit
- **Polytomous items:** GRM vs. GPCM – compares the two common polytomous models
- **Mixed data:** 2PL + graded vs. 2PL + GPCM – the polytomous parametrisation is swapped; 2PL is kept for binary items in both fits

> **Reading the comparison:** if AIC and BIC both favour the simpler model, there's no reason to add complexity. If the likelihood ratio test is significant *and* AIC/BIC prefer the more complex model, the additional parameters are justified. When AIC and BIC disagree, BIC penalises complexity more heavily – lean toward the simpler model unless you have theoretical reasons for the complex one.

### Dimensionality comparison

(Exploratory mode.) Fits models at neighbouring dimensionalities and reports AIC, BIC, log-likelihood, and a likelihood ratio test between adjacent solutions. Answers the question "is the extra dimension worth it?"

### Confirmatory vs exploratory fit

(Confirmatory mode.) Compares your confirmatory solution against an unconstrained exploratory fit at the same dimensionality. A non-significant *p*-value indicates the constraints are tenable; a significant *p*-value suggests the data prefer a more flexible structure.

### Factor loadings

(MD only.) A table of rotated factor loadings – items in rows, factors in columns. Values > 0.3 are generally considered meaningful.

### Factor correlations

(MD, oblique only.) A correlation matrix showing how strongly the factors covary. High factor correlations (> 0.8) may indicate the factors are not well separated.

### Item statistics

A combined table with one row per item. Columns depend on which output options are enabled and on dimensionality.

**Unidimensional parameter columns:**
- **Discrimination (*a*)** – how sharply the item distinguishes between ability levels. Colour-coded: red for low (< 0.65), amber for moderate (0.65–1.0), no colour for high (> 1.0)
- **Difficulty (*b*)** – the θ level at which a person has a 50% probability of endorsing the item (dichotomous) or the expected response is at the midpoint (polytomous). Higher = harder
- **Threshold (*b1*, *b2*, ...)** – for polytomous items, the θ values where adjacent category probabilities cross
- **Guessing (*c*)** – lower asymptote (3PL, 4PL)
- **Upper asymptote (*u*)** – upper bound on endorsement probability (3PLu, 4PL)
- **SE columns** – standard error for each parameter

**Multidimensional parameter columns:**
- **a1, a2, ...** – discrimination on each dimension (slope vector)
- **d** or **d1, d2, ...** – intercept (or per-category intercepts for polytomous items); replaces the unidimensional *b*
- **MDISC** – multidimensional discrimination; vector length of the *a* parameters across dimensions
- **MDIFF** – multidimensional difficulty; −intercept / MDISC. Reported as "Mean location" and noted as approximate for polytomous items

**Family-specific parameter columns.** Several model families do not estimate a discrimination and a difficulty at all, so the table lays out what they *do* estimate and carries its own note in place of the discrimination/difficulty bands:

| Family | Columns | Note |
|---|---|---|
| **Nominal** | Category slope 1…*K*, category intercept 1…*K* | No assumed category order and no item location. SEs are omitted – mirt reports them in a different parameterisation from the estimates shown |
| **GGUM** | Discrimination (*a*), ideal point (*b*), latitude 1…*n* | An unfolding model: *b* is a position on the trait, not a difficulty; the latitudes are the subjective category thresholds either side of it |
| **Ideal point** | Slope (*a*), intercept (*d*), ideal point (θ) | The ideal point shown is −*d*/*a*, the θ at which the response probability peaks |
| **Spline / Monotonic polynomial** | The raw basis coefficients as estimated | A basis expansion has no discrimination or difficulty reading – read the item from its characteristic and expected-score curves |
| **Sequential** | Slope and thresholds, as the generic layout | – |

> **Unfolding families read as positions.** For GGUM and the ideal-point model the item location is a *position on the trait*, not a difficulty, and DataSuite treats it that way throughout: the Wright map axis is labelled **Trait / Ideal point (θ)** and the targeting verdict says whether items are centred on, near, below, or above the sample rather than "too easy" or "too hard".

**Fit columns:**
- **S-X²** – Orlando and Thissen's item-level fit statistic with degrees of freedom and *p*-value. A significant *p*-value suggests misfit
- **Infit MNSQ** / **Infit ZSTD** and **Outfit MNSQ** / **Outfit ZSTD** – Rasch-family mean-square fit statistics and their standardized forms, tested against ±2

> **Infit vs. outfit:** infit is information-weighted – it emphasises responses from people whose ability is near the item's difficulty level (where the item is most informative). Outfit is unweighted and sensitive to unexpected responses far from the item's difficulty. Values between 0.5 and 1.5 are considered productive for measurement. Values above 2.0 suggest the item is degrading rather than contributing to measurement. **For non-Rasch models,** the 0.5–1.5 band is shown for reference; with varying slopes these statistics have different distributional properties.

> **Interpreting discrimination:**
> - **> 1.0** – high discrimination; the item differentiates well between ability levels
> - **0.65–1.0** – moderate; adequate but less sharp
> - **< 0.65** – low; the item provides little information about the trait
> - **Negative** – the item is inversely related to the trait; check whether it needs reverse scoring

> **MDISC and MDIFF:** in a MIRT model an item has a *vector* of discriminations, one per dimension. MDISC collapses this vector into a single length, and MDIFF gives a corresponding overall difficulty. Think of them as "where does this item sit overall" summaries – useful for quick ranking, but you still need the per-dimension loadings to understand what the item actually measures.

### Local dependence

Flagged item pairs and their statistics:

- **Q3** – Yen's Q3, the correlation between item residuals after controlling for the latent trait
- **Q3\*** – mean-corrected Q3 (Marais 2013); the average off-diagonal Q3 is subtracted, making the threshold interpretable even when global residuals are slightly biased. \|Q3\*\| above the cutoff is flagged
- **LD-X²** – a chi-squared test of local dependence. *p* < .05 is flagged

If no pairs are flagged by either method, the local independence assumption is supported.

**Bootstrap the Q3\* critical value.** By default the cutoff is the 0.2 rule of thumb, which is a rule of thumb – it takes no account of how many items you have or how they are distributed. Ticking the sub-option instead simulates datasets from the fitted model, takes the largest \|Q3\*\| in each, and uses a high percentile of that distribution as the cutoff. It costs one model refit per replication (the [bootstrap replications setting](./settings.md)), and the output states the percentile and the replication count. On short scales the empirical cutoff is often *much* higher than 0.2, so pairs the rule of thumb flags can legitimately drop out. If the bootstrap fails, the output says so and falls back to 0.2.

> **What causes local dependence?** Two items may share variance beyond what the latent trait explains – for example, items with overlapping content ("I feel anxious" and "I feel nervous"), items sharing a common stimulus (a reading passage), or items that form a testlet. Local dependence inflates item parameter estimates and biases reliability upward. Consider combining dependent items into a testlet or removing one from each flagged pair.

### Person ability estimates

A summary table of the θ distribution:

- **Mean θ** – average ability in the sample (centred near 0 for well-targeted tests)
- **SD θ** – spread of ability estimates
- **Min / Max θ** – range of estimated abilities
- **Mean SE** – average standard error across all persons; smaller is more precise

In multidimensional mode, a row is shown per dimension (F1, F2, ...).

A button below the table **inserts θ and SE into the dataset**. If person fit is also enabled, the Zh statistic is inserted as well. Column names reflect the scoring method – e.g. `IRT_Theta_EAP`, `IRT_SE_EAP`, `IRT_Zh` (unidimensional) or `IRT_Theta1_EAP`, `IRT_SE1_EAP`, `IRT_Theta2_EAP`, ... (multidimensional).

If extreme response patterns were filtered (all-minimum or all-maximum responses under MLE), a note reports how many persons were excluded from person-level statistics.

### Person fit

Reports the count of misfitting persons using three criteria:

- **Zh < −2** – standardized log-likelihood; patterns the model fits poorly
- **Zh > 2** – patterns *more* consistent than the model expects (overfitting – often a sign of a too-regular response style)
- **Infit > 1.5** – unexpected responses on items near the person's ability level (Rasch convention)

The note beneath states how many respondents are expected past each Zh cutoff **by chance alone**, so a count in that neighbourhood is not a finding. Zh is computed on estimated θ rather than the true value, which makes it conservative: it under-detects misfit rather than over-reporting it.

> **What does person misfit mean?** A person whose responses don't match the model's expectations might be guessing randomly, responding carelessly, or have knowledge that doesn't align with the trait dimension (e.g. a specialist who aces hard items but misses easy ones). A small percentage of misfit (< 5%) is normal. Systematic patterns (e.g. all high-ability persons misfit) warrant investigation. For non-Rasch models, Zh is the more reliable person-fit indicator – the outfit > 1.5 threshold is a Rasch convention.

### Reliability and separation

| Index | What it measures |
|---|---|
| **Empirical reliability** | A *sample* quantity: computed from the estimated θ and their standard errors |
| **Marginal reliability** | A *model-based* quantity: the test information function integrated over the population distribution |
| **Person separation** | How many distinct ability strata the test can distinguish |
| **Number of strata** | The count of statistically distinct ability levels the test separates |
| **Item reliability** | Consistency of item difficulty estimates (whether items are stably ordered) |
| **Item separation** | How many distinct difficulty strata exist among items |
| **Test targeting** | Difference between mean person ability and mean item location |

> **Empirical vs. marginal.** They answer the same question from opposite directions and rarely agree exactly – the empirical one is what your sample achieved, the marginal one is what the model says the test achieves in the population it assumes. A large gap between them usually means the sample is not distributed the way the model's latent distribution assumes. Marginal reliability is blank for families with no test information (see [nonparametric items](#nonparametric-items)).

In MIRT, reliability, separation, and targeting are reported per dimension. Item reliability and item separation are Rasch-style indices; they appear with a "(Rasch-style)" label when the fitted model isn't Rasch.

Interpretation thresholds for reliability:

| Value | Label |
|---|---|
| ≥ 0.90 | Excellent |
| 0.80–0.90 | Good |
| 0.70–0.80 | Acceptable |
| 0.60–0.70 | Questionable |
| < 0.60 | Poor |

Person separation interpretation:

| Value | Label |
|---|---|
| ≥ 3 | High (≥ 4 strata) |
| 2–3 | Adequate (≥ 3 strata) |
| 1–2 | Low (2 strata) |
| < 1 | Very low (< 2 strata) |

Test targeting interpretation:

| Value | Label |
|---|---|
| \|diff\| < 0.5 | Well targeted |
| \|diff\| 0.5–1.0 | Moderately targeted |
| diff > 1.0 | Test too easy for sample |
| diff < −1.0 | Test too hard for sample |

For **unfolding families** (GGUM, ideal point) the same bands are read as positions rather than difficulty – *items centred on sample*, *items near sample*, *items below* or *above the sample's trait level* – because an ideal-point item has no difficulty to be too easy or too hard.

In multidimensional mode, targeting compares a dimension's person mean against the mean location of the items whose *highest* loading is on that dimension. A dimension that no item loads highest on therefore has no targeting value.

If respondents were dropped because θ or SE was non-finite (typically MLE on extreme patterns), a note reports the count and points out that EAP and MAP scoring keep those respondents by bounding the estimate.

> **What is person separation?** If person separation is 3, the test can distinguish about 4 distinct ability groups (strata ≈ (4 × separation + 1) / 3). A test that can only separate people into "high" and "low" (separation < 2) isn't very useful for individual-level decisions.

> **Test targeting:** when person mean and item mean are close (difference near 0), the test is well matched to the sample. A large positive difference means the test is too easy – most people are above the item difficulty range. A large negative difference means it's too hard.

### Score conversion table

(Unidimensional only.) Maps every possible raw (sum) score to a θ estimate and its standard error, using the test's expected score function (equating). When an EAPsum conversion is available, it appears in additional columns alongside the equating result.

> **The raw score is only sufficient under Rasch.** Under the Rasch family (Rasch, PCM, RSM) everyone with the same raw score gets the same θ, so the mapping is exact. Under 2PL, 3PL, or graded models two respondents sharing a raw score can legitimately receive different θ estimates – there the **EAPsum** column is the principled mapping and the equating column is an approximation. True-score equating is undefined at the extreme raw scores in either case.

> **Why convert raw to θ?** Raw scores are ordinal – the difference between 10 and 15 isn't necessarily the same as between 25 and 30. IRT θ scores are on an interval scale, meaning equal differences in θ represent equal differences in ability. The conversion table lets you translate familiar raw scores into this measurement-quality scale.

### Expected scores by dimension

(MD only.) Shows the expected total score as a function of each dimension while holding the other dimensions at θ = 0. Useful for understanding how each dimension contributes to observed scores.

### DIF results

A table with one row per tested item showing the χ² statistic, degrees of freedom, and *p*-value, with adjusted *p*-values when [multiple comparison adjustment](./settings.md#multiple-comparison-adjustment) is on. When the model has free discriminations, a **Non-uniform** column group sits beside the overall test, and an **Effect size** group carries SIDS, UIDS, and ESSD.

Above the table, a header line names the grouping variable, its groups, and the reference group whose latent mean and variance are fixed – every difference is expressed relative to that group. Below it, the output states which parameters each test contrasted (so you can read the degrees of freedom), and which anchor design was used: no anchors designated, anchors you selected, or anchors chosen empirically by [purification](#empirical-anchor-selection-purification) with their count.

When [pairwise comparisons](#pairwise-group-comparisons) are enabled, a second table follows – one row per item × group pair, corrected as a single family.

An item whose sub-model failed to converge keeps its row with a note saying its test rests on an unconverged fit, rather than being reported as if nothing had happened.

## Plots

All plots below are resizable and can be saved individually as SVG, PNG, or JPG using the export buttons beside each chart – see [resizing and exporting charts](./getting-started.md#resizing-and-exporting-charts). Multi-panel figures (the information curves) resize together from one handle.

### Item characteristic curves (ICCs)

**Dichotomous items:** a single overlay chart showing the probability of correct response (y-axis) across the ability range (x-axis) for all items. Each curve is a logistic function shaped by the item's parameters. Steeper curves indicate higher discrimination; curves shifted right indicate harder items.

**Polytomous items:** two chart types are drawn:

- **Category Response Curves** – one chart per item, showing the probability of each response category as a function of θ. The curves cross at the threshold parameters
- **Expected Score Curves** – one overlay chart showing the expected item score as a function of θ for all items. Useful for comparing item difficulty and discrimination at a glance

### Information curves

Several panels are drawn:

1. **Item information curves** – each item's contribution to measurement precision across the θ range. Peaked curves show where each item is most informative
2. **Test information curve** – the sum of all item information functions. Shows where the test as a whole measures most precisely
3. **Standard error curve** – the inverse square root of test information. Lower SE = more precise measurement
4. **Test Characteristic Curve** – expected total score as a function of θ. Shows the nonlinear relationship between ability and raw scores
5. **Conditional reliability** – drawn here as a panel when the standalone plot below is not enabled

For model families with no θ-derivative (the [basis expansions](#nonparametric-items)) information is undefined rather than zero, so these panels are withheld and a note explains why.

> **Reading the information curve:** the peak of the test information curve tells you *where* the test is most precise. A test designed for clinical screening (distinguishing disordered from non-disordered) should peak near the clinical cutoff. A test designed for general ability measurement should have a broad, flat information curve. Narrow peaks mean the test is precise for a small ability range but imprecise elsewhere.

### Conditional reliability curve

Reliability as a function of θ – `I(θ) / (I(θ) + 1/σ²θ)` – with a dashed reference line at 0.70. Enabling it in the plot options promotes it from a panel of the information figure to its own chart. In multidimensional mode one curve is drawn per dimension, each against that dimension's own latent variance.

> **Why this and not the information curve?** They carry the same information on different scales, but reliability is the scale most readers already have intuitions about. Reading it tells you the *range of the trait* over which the test measures acceptably – a test can have high marginal reliability overall and still be near-useless at the extremes where you happen to be making decisions.

### Wright map

A two-panel display with a shared θ axis:

- **Left panel** – a horizontal histogram of person ability estimates
- **Right panel** – item location markers with labels (de-clumped to avoid overlap). For polytomous items, ticks beside each marker show the item's category thresholds and the marker itself is their mean – a polytomous item is *summarised* on this axis rather than located exactly

For multidimensional models, separate person histograms and item locations are drawn for each dimension. For unfolding families the axis reads **Trait / Ideal point (θ)**, since the markers are positions rather than difficulties. Model families with no item location parameter draw no right panel at all, and the output says so instead of placing items arbitrarily.

> **Reading the Wright map:** items and persons are plotted on the same scale. Items at the same height as a cluster of persons are optimally targeted for those people – they provide maximum information. Items far above the person distribution are too hard (almost everyone gets them wrong); items far below are too easy (almost everyone gets them right). A well-targeted test has items spread across the person distribution.

### Factor loadings heatmap

(MD only.) Items on one axis, factors on the other, cell colour encoding loading magnitude. A quick visual summary of which items load on which factors – especially useful for exploratory MIRT after rotation.

## Assumptions

- **Unidimensionality** (UD mode) – all items measure a single latent trait. Use the [preliminary analysis](#preliminary-analysis) to check this before fitting a UD model. In MD mode this is replaced by the weaker assumption that items measure the specified number of traits.
- **Local independence** – after controlling for the latent trait(s), item responses are independent. Violated when items share content, share a stimulus, or form testlets. Check with the [local dependence](#local-dependence) output.
- **Monotonicity** – the probability of endorsing higher categories increases with ability. Checked via [Mokken analysis](#mokken-scale-analysis) in the preliminary analysis.
- **Correct model specification** – the chosen model (Rasch, 2PL, etc.) adequately describes the data. Check [model fit](#model-fit) and consider [model comparison](#model-comparison).
- **Sufficient sample size** – IRT parameters are estimated less precisely with small samples. See [sample size guidelines](#sample-size-adequacy).
- **Items should be scored in the same direction.** Negatively worded items need reverse scoring before IRT analysis – use the [questionnaire scoring guide](./questionnaire-scoring-guide.md) or the internal consistency tab's [reverse scoring feature](./reliability-analysis.md#reverse-scored-items).

## Missing data

Missing values are handled by the global [missing data setting](./settings.md#missing-data). With listwise deletion, any case missing a value on any item is excluded. The number of complete cases is reported in the output.

Within the [preliminary diagnostics](#preliminary-analysis) the two halves behave differently, and the output says which is which: the eigenvalue and subject-quality blocks keep every row, while the Mokken blocks run on complete cases only because the `mokken` package does not accept missing responses.

> **Missing data and IRT:** IRT handles missing data more gracefully than classical methods – person ability can still be estimated from the items a person did answer. However, DataSuite's current implementation uses listwise deletion for model fitting. If you're losing many cases, consider whether imputation is appropriate, but be aware that imputing item responses can distort IRT parameter estimates more than it would affect classical reliability.

## Reporting checklist

**Method:**
- Dimensionality (unidimensional, exploratory MIRT with *k* dimensions and rotation, or confirmatory MIRT with specified factor structure)
- IRT model used (e.g. "A graded response model was fit using the `mirt` R package")
- Estimation method (EM, QMCEM, MHRM, ...)
- Scoring method for person ability (EAP, MAP, MLE, WLE)
- Number of items and sample size (total and complete cases)
- Item types (dichotomous, polytomous, or mixed)
- How missing data were handled
- Any advanced tuning choices that deviate from defaults
- Software and R packages used

**Results:**
- Model fit indices (at minimum RMSEA, CFI; include AIC/BIC when comparing models or dimensionalities)
- Item parameter estimates with standard errors (per dimension for MD, plus MDISC/MDIFF)
- Item fit statistics (S-X², infit/outfit where applicable)
- Person ability distribution (mean, SD, range), per dimension for MD
- Marginal reliability and person separation, per dimension for MD
- Factor loadings (and correlations for oblique solutions) for MIRT
- Any problematic items (poor discrimination, misfit, local dependence)
- DIF results if applicable, including grouping variable and anchor strategy
- Wright map or other visualisations as figures

## R reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md). IRT analysis uses the `mirt` R package for model fitting, rotations, item and person parameters, fit statistics, DIF, and score conversion. Preliminary analysis additionally uses `mokken` for scalability, monotonicity, IIO, rest-score local independence, and nonparametric reliability. The robust Mahalanobis screen uses the minimum covariance determinant estimator from `MASS`. Citations for R packages appear automatically at the top of the output. The [Q3\* bootstrap](#local-dependence) is seeded by [**Bootstrap seed**](./settings.md#bootstrap-seed); the resampled individual reliability (RIR) sub-sample step and the MCD subsampling are seeded by [**Reproducibility seed**](./settings.md#reproducibility-seed) – set them for values that repeat across runs.

## Common pitfalls

**Running IRT without checking data first.** The preliminary analysis is there for a reason – it catches unidimensionality violations, careless responders, and items that don't fit a monotone model. Fitting an IRT model to unsuitable data produces parameters that look precise but mean nothing. Always run **Diagnostics & Mokken** first.

**Choosing 3PL by default.** The guessing parameter is appealing ("my test has multiple-choice items!") but extremely difficult to estimate. With fewer than 500 respondents, guessing parameters are often poorly identified and can destabilise the entire model. Start with 2PL; only add the guessing parameter if you have a large sample *and* the 2PL shows systematic misfit at low ability levels.

**Using EM at high dimensionality.** EM scales badly beyond two dimensions – it may be very slow or fail to converge. Switch to **MHRM** for 3+ dimensions; it's much faster and also gives you standard errors for item parameters.

**Reading MIRT loadings without rotation.** An unrotated MIRT solution is dominated by a general factor and isn't directly interpretable. Pick an oblique rotation (Oblimin is a sensible default) unless you have a specific reason to prefer orthogonal or unrotated output.

**Ignoring item fit.** A well-fitting model overall (good RMSEA) can still have individual items that misfit badly. Always check item-level S-X² and infit/outfit statistics. A single misfitting item can distort person scores for everyone near that item's difficulty level.

**Over-interpreting DIF.** A statistically significant DIF result doesn't automatically mean the item is biased. Small DIF effects become significant with large samples. Look at the magnitude of parameter differences between groups, not just the *p*-value. Items with DIF may legitimately measure a real group difference rather than a testing artifact.

**Treating IRT scores as "better" raw scores.** θ estimates have standard errors – they're not exact. Two people with θ = 0.5 and θ = 0.7 may not be meaningfully different if both have SE = 0.3. Always consider the SE when interpreting individual scores, and use the [conditional reliability curve](#information-curves) to understand where the test measures precisely and where it doesn't.

**Forcing a parametric model when Mokken fails.** If items don't form a scalable Mokken scale (H < 0.3), they're unlikely to fit a parametric IRT model either. Poor Mokken scalability usually indicates the items aren't measuring a single construct – consider [factor analysis](./factor-analysis.md) or switch to multidimensional IRT before attempting a single unidimensional parametric fit.
