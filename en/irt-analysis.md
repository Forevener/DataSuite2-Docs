---
title: IRT analysis in DataSuite 2
description: Item response theory (IRT) analysis — Rasch, 2PL, 3PL, GRM, GPCM, item and person fit, DIF, Wright maps, and diagnostic tools in DataSuite 2.
---

# IRT analysis

The **Item response theory** tab (inside the Reliability analysis module) fits IRT models to questionnaire, test, or survey items. Unlike [classical reliability metrics](./reliability-analysis.md), which summarize the scale as a whole, IRT models each item individually — estimating how difficult it is, how well it discriminates between respondents, and where each person falls on the latent trait.

> **CTT vs. IRT in one sentence:** Classical Test Theory asks "how reliable is the total score?"; Item Response Theory asks "how does each item behave across the full range of ability?"

## How to use

1. [Select your items](./getting-started.md#choosing-variables) — at least two numeric variables
2. Click **Preliminary analysis** to [check data suitability](#preliminary-analysis) before fitting a model
3. Choose a [model type](#model-types), [estimation method](#estimation-method), and [scoring method](#scoring-method)
4. Optionally select a [grouping variable for DIF](#differential-item-functioning-dif)
5. Toggle [output options and plots](#output-options)
6. Click **Run IRT analysis**

## Requirements

- At least two numeric variables must be selected.
- Items must be dichotomous (two unique values) or polytomous (ordinal, or continuous with 3–10 integer categories). Variables with more than 10 unique values or non-integer values are excluded unless their type is explicitly set to ordinal in the data view.
- At least one output option must be enabled.

> **Automatic item classification:** DataSuite inspects each variable before analysis. Binary variables are always treated as dichotomous. Ordinal variables are polytomous. Continuous variables with 3–10 unique integer values are inferred as polytomous — but you'll see a note when this happens. For best results, set variable types explicitly in the data view.

## Preliminary analysis

Click **Preliminary analysis** to run a set of quick diagnostics *without* fitting an IRT model. This is a low-cost way to catch problems before committing to a full analysis.

### Item classification summary

Lists how each selected variable was classified (dichotomous, polytomous, or excluded) and why. Excluded variables show a reason — e.g. too many unique values or non-integer data.

### Sample size adequacy

Warns when the sample is too small for the selected model:

| Model | Recommended minimum N |
|---|---|
| Rasch / 1PL | 100 |
| 2PL | 200 |
| 3PL | 500 |

These are rough guidelines — smaller samples can work but produce less stable parameter estimates.

### Item summary table

A per-item table showing the variable type, number of response categories, and missing data count and percentage.

### Unidimensionality check

Uses the eigenvalue ratio of the inter-item correlation matrix. The first eigenvalue divided by the second indicates how dominant the first factor is:

| Ratio | Interpretation |
|---|---|
| ≥ 3 | Strong evidence for unidimensionality |
| 2–3 | Moderate evidence |
| < 2 | Weak — consider multidimensional models |

> **Why unidimensionality matters:** standard IRT models assume all items measure a single latent trait. If the data is substantially multidimensional, item parameter estimates become distorted and person scores lose meaning. When the ratio is below 2, explore the structure with [factor analysis](./factor-analysis.md) before proceeding.

### Subject quality screening

Six flags identify respondents whose data may be unreliable:

| Flag | Issue | Threshold |
|---|---|---|
| **M** | High missing data | > 50% of items missing |
| **L** | Longstring | ≥ *k* consecutive identical responses (*k* = max of 5 or half the items) |
| **V** | Low response variability | Intra-individual SD < 0.5 |
| **C** | Low person-total correlation | r < 0.1 |
| **R** | Low resampled individual reliability | RIR < 0.3 |
| **D** | Mahalanobis distance outlier | p < .001 |

> **What are these flags?** Longstring detects straight-lining — people who click the same answer repeatedly. Low IRV catches near-zero variability across items. Person-total correlation compares each person's response pattern to the rest of the sample, and RIR does the same using random subsamples for stability. Mahalanobis distance identifies multivariate outliers whose overall response pattern is unusually far from the sample center.

A button below the results lets you **insert quality flags into the dataset** — two new columns are added: `IRT_QC_nFlags` (count of flags per person) and `IRT_QC_Flags` (the flag letters, e.g. "LV").

### Mokken scale analysis

A nonparametric IRT approach that doesn't assume a specific functional form for item response curves. Three analyses are reported:

**Scalability coefficients (Loevinger's H):** per-item H*i* and total scale H indicate how well items form a Guttman-like scale.

| H | Interpretation |
|---|---|
| ≥ 0.5 | Strong scalability |
| 0.4–0.5 | Moderate |
| 0.3–0.4 | Weak |
| < 0.3 | Unscalable |

**Monotonicity check:** tests whether the probability of endorsing each item increases (or at least doesn't decrease) with the latent trait. Items with significant violations may not conform to a monotone homogeneity model.

**Automated item selection (AISP):** assigns items to scales at H ≥ 0.3. If all items land in a single scale, that supports unidimensionality. Items assigned to scale 0 were not selected — they may not fit the scale.

> **When to use Mokken vs. parametric IRT:** Mokken analysis has weaker assumptions — it doesn't require items to follow a logistic function, only that item responses increase monotonically with the trait. Use it as a preliminary screen or when your items don't fit parametric models well. If Mokken scalability is poor, parametric IRT is unlikely to fare better.

## Model types

Select a model from the **Model type** dropdown. **Auto** detects the best fit based on item types: 2PL for dichotomous items, Graded Response Model for polytomous items.

| Model | Items | Parameters | When to use |
|---|---|---|---|
| **Auto** | Any | Varies | Let DataSuite choose — good default |
| **Rasch (1PL / PCM)** | Any | Difficulty only | Equal discrimination assumed; useful for measurement-focused applications, Rasch tradition |
| **2PL** | Dichotomous | Difficulty + discrimination | Standard choice for binary items when items may differ in discrimination |
| **3PL** | Dichotomous | Difficulty + discrimination + guessing | Multiple-choice tests where guessing is plausible; requires large N |
| **GRM** | Polytomous | Thresholds + discrimination | Ordinal response scales (e.g. Likert); most common polytomous model |
| **GPCM** | Polytomous | Thresholds + discrimination | Similar to GRM but models cumulative category probabilities differently |
| **GRSM** | Polytomous | Thresholds + shared discrimination | All items share the same discrimination; a constrained version of GRM |
| **Nominal** | Polytomous | Category-specific slopes | Categories have no assumed ordering; rarely needed for standard questionnaires |

> **Rasch vs. 2PL:** the Rasch model constrains all items to have equal discrimination — only difficulty varies. This is a strong assumption, but it has a practical advantage: raw total scores become sufficient statistics for the latent trait, meaning everyone with the same total score gets the same ability estimate regardless of which items they got right. The 2PL model relaxes this, letting each item discriminate differently, which typically improves fit but means raw scores are no longer sufficient.

> **What is the guessing parameter?** In the 3PL model, the lower asymptote (*c*) represents the probability of answering correctly by chance. For a 4-option multiple-choice item, you'd expect *c* ≈ 0.25. This parameter is notoriously hard to estimate and requires large samples (N > 500). If your test isn't multiple-choice, use 2PL instead.

## Estimation method

| Method | Description |
|---|---|
| **EM** (default) | Expectation-Maximization — fast, deterministic, works well for most models |
| **MHRM** | Metropolis-Hastings Robbins-Monro — stochastic; useful when EM has convergence issues |
| **MCMC** | Markov Chain Monte Carlo — full Bayesian estimation; slowest but most flexible |

## Scoring method

Controls how person ability (θ) is estimated after the model is fit:

| Method | Description |
|---|---|
| **EAP** (default) | Expected A Posteriori — Bayesian estimate using the full posterior; stable, slightly shrunk toward the mean |
| **MAP** | Maximum A Posteriori — Bayesian mode; less shrinkage than EAP but more variable |
| **MLE** | Maximum Likelihood — no prior; can produce extreme or undefined scores for perfect/zero response patterns |

> **Which scoring method?** EAP is the safest default — it always produces a finite estimate and handles extreme response patterns gracefully. MLE is theoretically "purer" (no prior influence) but fails for people who answer everything correctly or incorrectly. MAP is a middle ground. For most applications, EAP is recommended.

## Differential item functioning (DIF)

DIF tests whether items function differently across groups (e.g. gender, language). Select a categorical or binary **grouping variable** to enable DIF analysis.

### Anchor items

When a DIF grouping variable is selected, an anchor items panel appears. Anchor items are assumed to be DIF-free and serve as the reference for testing other items. By default, all items are anchors (free baseline approach). Deselect items you want to test for DIF — only non-anchor items will be tested.

> **What is DIF?** An item shows DIF when people from different groups with the *same ability level* have different probabilities of endorsing it. For example, if men and women of equal math ability have different chances of answering a particular math item correctly, that item has DIF. DIF doesn't necessarily mean bias — the item might legitimately measure something that differs between groups — but it warrants investigation.

## Output options

### Tables

| Option | Default | What it shows |
|---|---|---|
| **Item parameters** | On | Discrimination (*a*), difficulty (*b*) or thresholds, guessing (*c*), upper asymptote (*u*), with standard errors |
| **Model fit summary** | On | AIC, BIC, log-likelihood, M2 statistic with RMSEA, SRMSR, TLI, CFI |
| **Item fit statistics** | On | S-X² per item with *p*-value; infit/outfit MNSQ for Rasch models |
| **Person ability estimates (θ)** | On | Summary statistics of θ distribution (mean, SD, range, mean SE) with option to insert scores into dataset |
| **Reliability and separation** | On | Marginal reliability, person/item separation, test targeting |
| **Person fit statistics** | Off | Count of misfitting persons (|Zh| > 2, outfit > 1.5) |
| **Local dependence (Q3 and LD-X²)** | Off | Flagged item pairs violating local independence |
| **Model comparison (LR tests)** | Off | Rasch vs. 2PL (binary items) or GRM vs. GPCM (polytomous) with AIC/BIC and likelihood ratio test |
| **Conditional SEM per person** | Off | Standard error of measurement at each person's θ level |
| **Score conversion table (raw → θ)** | Off | Maps every possible raw score to its θ estimate and SE |

### Plot options

| Plot | Default | What it shows |
|---|---|---|
| **Item Characteristic Curves (ICCs)** | On | Probability of each response as a function of θ — overlay for dichotomous items, separate category response curves + expected score curves for polytomous items |
| **Information and test characteristic curves** | On | Item and test information functions, standard error curve, Test Characteristic Curve (expected total score vs. θ), conditional reliability curve |
| **Wright map (person-item map)** | On | Side-by-side display of person ability distribution and item difficulty on a shared θ scale |

## Reading results

### Model fit

Two tables appear when model fit is enabled:

**Information criteria** — AIC, BIC, and log-likelihood. Lower AIC/BIC values indicate better fit-complexity trade-offs. These are most useful when [comparing models](#model-comparison).

**Absolute fit** (M2 statistic):

| Index | Good fit | Acceptable fit | Poor fit |
|---|---|---|---|
| RMSEA | < 0.05 | 0.05–0.08 | ≥ 0.08 |
| SRMSR | < 0.05 | 0.05–0.08 | ≥ 0.08 |
| TLI | > 0.95 | 0.90–0.95 | < 0.90 |
| CFI | > 0.95 | 0.90–0.95 | < 0.90 |

> **What is the M2 statistic?** A limited-information goodness-of-fit test designed for IRT models. Unlike χ² tests that compare all possible response patterns, M2 uses first- and second-order margins, making it more practical for tests with many items. A significant *p*-value suggests misfit, but with large samples even trivial misfit becomes significant — focus on RMSEA and CFI instead.

### Model comparison

When enabled, DataSuite fits an alternative model and reports AIC, BIC, and (for nested models) a likelihood ratio test:

- **Dichotomous items:** Rasch vs. 2PL — tests whether allowing discrimination to vary improves fit
- **Polytomous items:** GRM vs. GPCM — compares two common polytomous models

> **Reading the comparison:** if AIC and BIC both favor the simpler model, there's no reason to add complexity. If the likelihood ratio test is significant *and* AIC/BIC prefer the more complex model, the additional parameters are justified. When AIC and BIC disagree, BIC penalizes complexity more heavily — lean toward the simpler model unless you have theoretical reasons for the complex one.

### Item statistics

A combined table with one row per item. Columns depend on which output options are enabled:

**Parameter columns:**
- **Discrimination (*a*)** — how sharply the item distinguishes between ability levels. Color-coded: red for low (< 0.65), amber for moderate (0.65–1.0), no color for high (> 1.0)
- **Difficulty (*b*)** — the θ level at which a person has a 50% probability of endorsing the item (dichotomous) or the expected response is at the midpoint (polytomous). Higher = harder
- **Threshold (*b1*, *b2*, ...)** — for polytomous items, the θ values where adjacent category probabilities cross
- **Guessing (*c*)** — lower asymptote (3PL only)
- **Upper asymptote (*u*)** — upper bound on endorsement probability (when estimated)
- **SE columns** — standard error for each parameter

**Fit columns:**
- **S-X²** — Orlando and Thissen's item-level fit statistic with degrees of freedom and *p*-value. A significant *p*-value suggests misfit
- **Infit MNSQ** and **Outfit MNSQ** — Rasch-family mean-square fit statistics

> **Infit vs. outfit:** infit is information-weighted — it emphasizes responses from people whose ability is near the item's difficulty level (where the item is most informative). Outfit is unweighted and sensitive to unexpected responses far from the item's difficulty. Values between 0.5 and 1.5 are considered productive for measurement. Values above 2.0 suggest the item is degrading rather than contributing to measurement.

> **Interpreting discrimination:**
> - **> 1.0** — high discrimination; the item differentiates well between ability levels
> - **0.65–1.0** — moderate; adequate but less sharp
> - **< 0.65** — low; the item provides little information about the trait
> - **Negative** — the item is inversely related to the trait; check whether it needs reverse scoring

### Local dependence

Two complementary statistics are reported for each flagged item pair:

- **Q3** — Yen's Q3, the correlation between item residuals after controlling for the latent trait. Pairs with |Q3| > 0.2 are flagged
- **LD-X²** — a chi-squared test of local dependence. Pairs with *p* < .05 are flagged

If no pairs are flagged by either method, the local independence assumption is supported.

> **What causes local dependence?** Two items may share variance beyond what the latent trait explains — for example, items with overlapping content ("I feel anxious" and "I feel nervous"), items sharing a common stimulus (a reading passage), or items that form a testlet. Local dependence inflates item parameter estimates and biases reliability upward. Consider combining dependent items into a testlet or removing one from each flagged pair.

### Person ability estimates

A summary table of the θ distribution:

- **Mean θ** — average ability in the sample (centered near 0 for well-targeted tests)
- **SD θ** — spread of ability estimates
- **Min / Max θ** — range of estimated abilities
- **Mean SE** — average standard error across all persons; smaller is more precise

A button below the table lets you **insert θ and SE into the dataset**. If person fit is also enabled, the Zh statistic is inserted as well. Columns are named by scoring method — e.g. `IRT_Theta_EAP`, `IRT_SE_EAP`, `IRT_Zh`.

### Person fit

Reports the count of misfitting persons using two criteria:

- **|Zh| > 2** — standardized person fit residual; aberrant response patterns
- **Outfit > 1.5** — unexpected responses on items far from the person's ability level

> **What does person misfit mean?** A person whose responses don't match the model's expectations might be guessing randomly, responding carelessly, or have knowledge that doesn't align with the trait dimension (e.g. a specialist who aces hard items but misses easy ones). A small percentage of misfit (< 5%) is normal. Systematic patterns (e.g. all high-ability persons misfit) warrant investigation.

### Reliability and separation

| Index | What it measures |
|---|---|
| **Marginal reliability** | Proportion of θ variance that is "true" variance (analogous to Cronbach's alpha but model-based) |
| **Person separation** | How many distinct ability strata the test can distinguish |
| **Item reliability** | Consistency of item difficulty estimates (whether items are stably ordered) |
| **Item separation** | How many distinct difficulty strata exist among items |
| **Test targeting** | Difference between mean person ability and mean item difficulty |

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
| |diff| < 0.5 | Well targeted |
| |diff| 0.5–1.0 | Moderately targeted |
| diff > 1.0 | Test too easy for sample |
| diff < −1.0 | Test too hard for sample |

> **What is person separation?** If person separation is 3, the test can distinguish about 4 distinct ability groups (strata ≈ (4 × separation + 1) / 3). A test that can only separate people into "high" and "low" (separation < 2) isn't very useful for individual-level decisions.

> **Test targeting:** when person mean and item mean are close (difference near 0), the test is well matched to the sample. A large positive difference means the test is too easy — most people are above the item difficulty range. A large negative difference means it's too hard.

### Score conversion table

Maps every possible raw (sum) score to a θ estimate and its standard error. DataSuite finds the θ at which the expected test score equals each raw score, using the test's expected score function.

> **Why convert raw to θ?** Raw scores are ordinal — the difference between 10 and 15 isn't necessarily the same as between 25 and 30. IRT θ scores are on an interval scale, meaning equal differences in θ represent equal differences in ability. The conversion table lets you translate familiar raw scores into this measurement-quality scale.

### DIF results

A table with one row per tested item showing the χ² statistic, degrees of freedom, and *p*-value. The grouping variable name is displayed above the table.

For Rasch/GRSM models (constrained discrimination), only difficulty parameters are tested. For other models, both discrimination and difficulty are tested simultaneously.

## Plots

### Item Characteristic Curves (ICCs)

**Dichotomous items:** a single overlay chart showing the probability of correct response (y-axis) across the ability range (x-axis) for all items. Each curve is a logistic function shaped by the item's parameters. Steeper curves indicate higher discrimination; curves shifted right indicate harder items.

**Polytomous items:** two chart types are drawn:

- **Category Response Curves** — one chart per item, showing the probability of each response category as a function of θ. The curves cross at the threshold parameters
- **Expected Score Curves** — one overlay chart showing the expected item score as a function of θ for all items. Useful for comparing item difficulty and discrimination at a glance

### Information curves

Four panels are drawn:

1. **Item information curves** — each item's contribution to measurement precision across the θ range. Peaked curves show where each item is most informative
2. **Test information curve** (bold black line) — the sum of all item information functions. Shows where the test as a whole measures most precisely
3. **Standard error curve** (dashed red, right axis) — the inverse square root of test information. Lower SE = more precise measurement
4. **Test Characteristic Curve** — expected total score as a function of θ. Shows the nonlinear relationship between ability and raw scores
5. **Conditional reliability curve** — reliability as a function of θ, computed as 1 − SE(θ)² / σ²θ. A dashed reference line marks 0.70. Shows which ability ranges the test measures reliably

> **Reading the information curve:** the peak of the test information curve tells you *where* the test is most precise. A test designed for clinical screening (distinguishing disordered from non-disordered) should peak near the clinical cutoff. A test designed for general ability measurement should have a broad, flat information curve. Narrow peaks mean the test is precise for a small ability range but imprecise elsewhere.

### Wright map

A two-panel display with a shared θ axis:

- **Left panel** — a horizontal histogram of person ability estimates
- **Right panel** — item difficulty markers with labels (de-clumped to avoid overlap)

> **Reading the Wright map:** items and persons are plotted on the same scale. Items at the same height as a cluster of persons are optimally targeted for those people — they provide maximum information. Items far above the person distribution are too hard (almost everyone gets them wrong); items far below are too easy (almost everyone gets them right). A well-targeted test has items spread across the person distribution.

## Assumptions

- **Unidimensionality** — all items measure a single latent trait. Use the [preliminary analysis](#preliminary-analysis) to check this before fitting a model.
- **Local independence** — after controlling for the latent trait, item responses are independent. Violated when items share content, share a stimulus, or form testlets. Check with the [local dependence](#local-dependence) output.
- **Monotonicity** — the probability of endorsing higher categories increases with ability. Checked via [Mokken analysis](#mokken-scale-analysis) in the preliminary analysis.
- **Correct model specification** — the chosen model (Rasch, 2PL, etc.) adequately describes the data. Check [model fit](#model-fit) and consider [model comparison](#model-comparison).
- **Sufficient sample size** — IRT parameters are estimated less precisely with small samples. See [sample size guidelines](#sample-size-adequacy).
- **Items should be scored in the same direction.** Negatively worded items need reverse scoring before IRT analysis — use the [questionnaire scoring guide](./questionnaire-scoring-guide.md) or the internal consistency tab's [reverse scoring feature](./reliability-analysis.md#reverse-scored-items).

## Missing data

Missing values are handled by the global [missing data setting](./settings.md#missing-data). With listwise deletion, any case missing a value on any item is excluded. The number of complete cases is reported in the output.

> **Missing data and IRT:** IRT handles missing data more gracefully than classical methods — person ability can still be estimated from the items a person did answer. However, DataSuite's current implementation uses listwise deletion for model fitting. If you're losing many cases, consider whether imputation is appropriate, but be aware that imputing item responses can distort IRT parameter estimates more than it would affect classical reliability.

## Reporting checklist

**Method:**
- IRT model used (e.g. "A graded response model was fit using the `mirt` R package")
- Estimation method (EM, MHRM, or MCMC)
- Scoring method for person ability (EAP, MAP, or MLE)
- Number of items and sample size (total and complete cases)
- Item types (dichotomous, polytomous, or mixed)
- How missing data were handled
- Software and R packages used

**Results:**
- Model fit indices (at minimum RMSEA, CFI; include AIC/BIC if comparing models)
- Item parameter estimates (discrimination and difficulty/thresholds) with standard errors
- Item fit statistics (S-X², infit/outfit for Rasch)
- Person ability distribution (mean, SD, range)
- Marginal reliability and person separation
- Any problematic items (poor discrimination, misfit, local dependence)
- DIF results if applicable, including grouping variable and anchor strategy
- Wright map or other visualizations as figures

## R reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md). IRT analysis uses the `mirt` R package for model fitting, item and person parameters, fit statistics, DIF, and score conversion. Preliminary analysis additionally uses `mokken` for scalability analysis. Citations for R packages appear automatically at the top of the output.

## Common pitfalls

**Running IRT without checking data first.** The preliminary analysis is there for a reason — it catches unidimensionality violations, careless responders, and items that don't fit a monotone model. Fitting an IRT model to unsuitable data produces parameters that look precise but mean nothing. Always run the preliminary analysis first.

**Choosing 3PL by default.** The guessing parameter is appealing ("my test has multiple-choice items!") but extremely difficult to estimate. With fewer than 500 respondents, guessing parameters are often poorly identified and can destabilize the entire model. Start with 2PL; only add the guessing parameter if you have a large sample *and* the 2PL shows systematic misfit at low ability levels.

**Ignoring item fit.** A well-fitting model overall (good RMSEA) can still have individual items that misfit badly. Always check item-level S-X² and infit/outfit statistics. A single misfitting item can distort person scores for everyone near that item's difficulty level.

**Over-interpreting DIF.** A statistically significant DIF result doesn't automatically mean the item is biased. Small DIF effects become significant with large samples. Look at the magnitude of parameter differences between groups, not just the *p*-value. Items with DIF may legitimately measure a real group difference rather than a testing artifact.

**Treating IRT scores as "better" raw scores.** θ estimates have standard errors — they're not exact. Two people with θ = 0.5 and θ = 0.7 may not be meaningfully different if both have SE = 0.3. Always consider the SE when interpreting individual scores, and use the [conditional reliability curve](#information-curves) to understand where the test measures precisely and where it doesn't.

**Forcing a parametric model when Mokken fails.** If items don't form a scalable Mokken scale (H < 0.3), they're unlikely to fit a parametric IRT model either. Poor Mokken scalability usually indicates that the items aren't measuring a single construct — go back to [factor analysis](./factor-analysis.md) before attempting IRT.
