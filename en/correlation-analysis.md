---
title: Correlation analysis
description: Pearson, Spearman, Kendall, polychoric, information-theoretic, Chatterjee's ξ, and other association methods with matrix and long-format output in DataSuite 2.
---

# Correlation analysis

The **Correlation analysis** module measures the strength — and, where applicable, the direction — of relationships between pairs of variables. You can correlate all variables at once or pick specific subsets, choose from a broad library of association methods (classical correlations, rank-based, information-theoretic, and functional-dependence measures) or let the app pick automatically, and view results as a matrix, a long-format table, or a network visualization.

> **What is a correlation coefficient?** A number that describes how two variables move together. Classical correlations (Pearson's *r*, Spearman's ρ, Kendall's τ, and others) range from −1 to +1: +1 means perfect positive lockstep, −1 means perfect opposing movement, 0 means no pattern. In practice, you'll rarely see perfect values — something like 0.6 (e.g. height and weight) indicates a solid positive relationship, while 0.1 suggests the variables are barely related.

> **Signed vs. unsigned measures.** Some methods in this module are *unsigned* — they range from 0 to 1 and describe only the **strength** of association, not its direction. Cramér's V, the information-theoretic family (NMI, AMI, coherence, Theil's U), η², Hoeffding's D, Chatterjee's ξ, and distance correlation all fall into this camp. This is a feature, not a limitation: a sign is only meaningful when both variables are ordered, and many real-world associations (categorical data, non-monotonic shapes) have no natural "positive" or "negative".

1. [Select your variables](#setting-up) (or leave both lists empty to correlate [all available variables](./getting-started.md#choosing-variables))
2. Choose a [correlation method](#choosing-a-method)
3. Optionally [control for covariates](#controlling-for-covariates-partial--semi-partial-correlation) (partial / semi-partial) or [test for differences](#testing-differences-between-correlations) between cells
4. Adjust [display options](#display-options)
5. Click **Calculate correlations**

## Setting up

Two variable lists appear side by side:

- **Left variables** — appear as rows in the output matrix
- **Right variables** — appear as columns in the output matrix

Both lists are optional. Leave them empty to correlate all variables against each other. Select variables in only one list and the other defaults to all appropriate variables. Variables can be selected by clicking or drag-selecting across multiple items.

When you change the correlation method, the lists automatically filter to show only compatible variable types. A warning appears if no appropriate variables exist.

## Choosing a method

### Signed correlations (−1 to +1)

| Method | Symbol | Variable types | Measures |
|---|---|---|---|
| **Pearson's r** (default) | r | Continuous + continuous | Linear association |
| **Spearman's rho** | ρ | Continuous or ordinal | Monotonic association (rank-based) |
| **Kendall's tau** | τ | Continuous or ordinal | Ordinal association (concordant/discordant pairs) |
| **Blomqvist's beta** | β | Continuous + continuous | Median-based quadrant association, robust to outliers |
| **Polychoric** | ρ<sub>poly</sub> | Ordinal + ordinal | Association between latent continuous distributions |
| **Tetrachoric** | ρ<sub>tet</sub> | Binary + binary | The 2×2 special case of polychoric — assumes binaries dichotomize latent normals |
| **Polyserial** | ρ<sub>ps</sub> | Continuous + ordinal | Assumes a latent continuous variable underlies the ordinal one |
| **Somers' D** | D | Continuous or ordinal | Asymmetric ordinal association, adjusts for ties |
| **Goodman & Kruskal's gamma** | γ | Continuous or ordinal | Ordinal association, ignores ties |
| **Point-biserial** | r<sub>pb</sub> | Continuous + binary | Equivalent to Pearson's r with a dichotomous variable |
| **Biserial** | r<sub>b</sub> | Continuous + binary | Assumes the binary variable is a dichotomized continuous variable |
| **Phi coefficient** | φ | Binary + binary | Based on a 2×2 chi-square test |

### Unsigned dependence measures (0 to 1)

| Method | Symbol | Variable types | Measures |
|---|---|---|---|
| **Cramér's V** | V | Categorical + categorical | Chi-square-based, works with more than two levels |
| **Correlation ratio (η²)** | η² | Categorical + continuous | Variance in one variable explained by grouping on the other |
| **Normalized mutual information** | NMI | Any + any | Shared entropy as a fraction of total entropy (symmetric uncertainty) |
| **Adjusted mutual information** | AMI | Any + any | NMI corrected for chance overlap |
| **Rajski's coherence** | C<sub>R</sub> | Any + any | MI as a fraction of joint entropy |
| **Theil's U** | U | Any + any | Asymmetric — fraction of one variable's uncertainty explained by the other |
| **Hoeffding's D** | D<sub>H</sub> | Continuous + continuous | Nonparametric test against any dependence alternative |
| **Chatterjee's ξ** | ξ | Continuous + continuous | Asymmetric — detects any functional dependence, including non-monotonic |
| **Distance correlation** | dCor | Continuous + continuous | Energy-based; zero only under full independence |

### Special

| Method | Symbol | Variable types | Measures |
|---|---|---|---|
| **Mixed/Auto** | varies | All | Picks the best method for each pair automatically |

> **Which method to pick?** Start with **Pearson's r** for continuous data — it's the most common and easiest to interpret. If your data is ordinal (e.g. Likert scales) or you're worried about outliers, use **Spearman's rho** or **Blomqvist's β**. If you suspect a non-monotonic (curved, cyclical) relationship, try **Chatterjee's ξ** or **distance correlation**. If you have a mix of variable types and don't want to think about it, **Mixed/Auto** handles everything.

> **Pearson vs. Spearman vs. Kendall:** Pearson measures *linear* relationships — it can miss a strong curved pattern. Spearman and Kendall both use ranks, so they capture any monotonic relationship (consistently increasing or decreasing). Kendall is more robust with small samples and has a more intuitive interpretation, but Spearman is more widely used and slightly more powerful with larger samples.

### Beyond classical correlations

Several methods in the table above aren't taught in introductory statistics courses but fill genuine gaps left by Pearson, Spearman, and friends. They fall into three loose families.

**Robust and variance-based.**

- **Blomqvist's β** — also called *medial correlation*. Counts how often both variables land on the same side of their respective medians, then rescales to a `[-1, +1]` range. Because it uses only the sign of each value relative to the median (not its magnitude), it's highly resistant to outliers. A useful sanity check when Pearson's *r* seems dominated by a few extreme points.
- **Correlation ratio (η²)** — the share of a continuous variable's variance that is explained by grouping on a categorical one. Mathematically equivalent to the `R²` of a one-way ANOVA. Use it when one side of the pair is truly categorical (not ordered) and the other is continuous — a case where Pearson simply doesn't apply. If you ask for η² on a pair where both variables are categorical, the result falls back to Cramér's V automatically — assigning arbitrary numeric codes to one side would make η² depend on the labelling, which isn't a property you want. For mixed continuous/categorical pairs, the categorical side is always the grouping factor and the continuous side is the value; for two continuous variables, the side with fewer unique values is treated as the grouping factor. This choice depends only on the variables' intrinsic types, not on which one you put as "left" or "right", so the η² matrix is symmetric in input order. Note that η² is only meaningful when one side is genuinely categorical or low-cardinality: run it on two genuinely continuous variables and one of them becomes a grouping factor with roughly one observation per group, which drives η² toward 1 with a near-zero p-value — a degenerate result, not a real association. Use a correlation method (Pearson, Spearman) for two continuous variables instead.

**Information-theoretic.** All four are bounded `[0, 1]` and all share the same first step: discretize continuous variables into bins, compute the mutual information (MI) — the number of bits that knowing one variable tells you about the other — and then normalize in different ways.

- **Normalized mutual information (NMI)** — MI divided by the average of the two marginal entropies. Often called *symmetric uncertainty*. The safest default for "how much do these two variables share?"
- **Adjusted mutual information (AMI)** — NMI with a chance-correction subtracted off. Useful when variable pairs have very different numbers of categories, since unadjusted MI tends to inflate in high-cardinality settings.
- **Rajski's coherence** — MI divided by the *joint* entropy. Stricter than NMI: approaches 1 only when the two variables are nearly identical (modulo relabelling).
- **Theil's U** — MI divided by the entropy of one specific side. **Asymmetric** — U(Y given X) ≠ U(X given Y), so the matrix is not symmetric. Read as "fraction of Y's uncertainty that knowing X would eliminate".

**General-dependence detectors.** The classical correlations all miss non-monotonic patterns (a U-shape gives Pearson ≈ 0). These three don't.

- **Hoeffding's D** — a classical nonparametric test statistic that is zero under independence and positive under any form of dependence. Sample D can dip slightly below zero under independence — that's the noise floor around the null mean of 0, not anti-dependence — and the raw value is reported so you can see it. The unsigned visualizations clamp the display side at 0.
- **Chatterjee's ξ** — introduced in 2021; reaches 1 when one variable is a perfect function of the other (even a wildly non-monotonic one) and 0 only under independence. **Asymmetric** — ξ(X → Y) tells you whether Y is a function of X, not the other way around.
- **Distance correlation (dCor)** — energy-distance-based; zero *if and only if* the two variables are independent. Picks up any dependence a classical correlation misses, at the cost of being harder to interpret as "strength". The reported value is the bias-corrected estimator (the same one used by the t-approximation p-value), so under independence it can dip slightly below zero — that's noise around the null mean of 0, not anti-dependence. The unsigned visualizations clamp the display side at 0.

> **When to reach for a general-dependence measure:** classical correlations all have one blind spot — they can't tell a strong U-shape or cyclic pattern apart from no relationship at all. If your scatterplot shows *structure* but Pearson and Spearman both come back near zero, Chatterjee's ξ or distance correlation will catch it. Hoeffding's D is the classical choice for hypothesis tests of "are these independent at all?"

### Directional (asymmetric) methods

**Somers' D**, **Theil's U**, and **Chatterjee's ξ** are *directional*: they answer "how well does X predict Y?" rather than "how related are X and Y?" The resulting matrix is **not symmetric** — the cell at row A, column B generally differs from the cell at row B, column A.

The convention used throughout this module is **row → column**: the value in cell `[row, col]` describes how well the row variable predicts (or explains) the column variable. A direction caption under the matrix reminds you of this whenever one of these three methods is active. The **Hide redundant values** checkbox is also automatically hidden — both triangles carry genuinely different information.

**Assumptions:**
- **Pearson's r** assumes both variables are continuous and roughly normally distributed, with a linear relationship between them. Violations (skewness, outliers, curvilinear patterns) can distort the coefficient.
- **Spearman's rho and Kendall's tau** only assume a monotonic relationship and ordinal-level data. No normality requirement — use these when Pearson's assumptions are violated. They do assume relatively few ties, though; heavy ties strain their p-values (the [tie-burden check](#rank--ordinal-methods-tie-burden) flags this).
- **Blomqvist's β** assumes continuous data but has no distributional requirements beyond a well-defined median — robust to outliers and heavy tails.
- **Polychoric, polyserial, and tetrachoric** assume the discrete variables reflect underlying continuous normal distributions. Polychoric is generally reasonable for Likert-type items with 4+ response categories; tetrachoric is the 2×2 special case — sensible when the binary split is *artificial* (an underlying continuum was dichotomized), less so when the variable is genuinely binary by nature. **Phi** is a safer choice for genuine binaries; reach for tetrachoric when you have theoretical reason to believe the binary masks a continuum.
- **Point-biserial and biserial** assume the continuous variable is normally distributed within each group defined by the binary variable. Biserial additionally assumes the binary split is artificial (an underlying continuum was dichotomized).
- **Phi, Cramér's V, and the mutual-information family** all rest on a contingency-table framework — expected cell frequencies should ideally be ≥ 5 per cell (for Phi and Cramér's V, the [expected-cell-count check](#contingency-table-methods-χ²-cell-counts) flags when they aren't). Continuous variables are auto-discretized into equal-frequency bins; with very small samples, the bins may be too sparse to trust.
- **η² (correlation ratio)** relies on the one-way ANOVA framework — roughly equal variances across groups and approximately normal within-group distributions help the F-based p-value but don't affect the η² statistic itself.
- **Hoeffding's D, Chatterjee's ξ, and distance correlation** are nonparametric and make essentially no distributional assumptions beyond independent observations.
- **All methods** assume independent observations — each row should represent a separate case, not repeated measurements from the same subject.

### Mixed/Auto selection logic

When you select **Mixed/Auto**, the method for each pair is chosen based on variable types:

| Left variable | Right variable | Method used |
|---|---|---|
| Continuous | Continuous | Pearson's r |
| Ordinal | Ordinal | Polychoric |
| Continuous | Ordinal | Polyserial |
| Binary | Binary | Phi coefficient |
| Continuous | Binary | Point-biserial |
| Ordinal | Binary | Polychoric (binary treated as ordinal) |
| Categorical | Categorical | Cramér's V |
| Binary | Categorical | Cramér's V |
| Continuous | Categorical | Correlation ratio (η²) |
| Ordinal | Categorical | Normalized mutual information |

Asymmetric methods (Somers' D, Theil's U, Chatterjee's ξ) are never picked by Mixed/Auto — they require explicit user intent, since mixing a directional measure into an otherwise symmetric matrix would break the visual contract.

## Checking assumptions

Click **Check assumptions** to run a comprehensive diagnostic pass and surface a single *Correlation assumptions* card. Unlike **Calculate correlations**, it does **not** limit itself to the method you selected: for every pair of selected variables it runs *every check applicable to that pair*, so a failed primary test immediately shows which alternative methods would fit. Because the pass is comprehensive, **explicit methods and Mixed/Auto follow the same path** — the selected method only decides which method is marked *primary* per pair. It runs independently of **Calculate correlations**, so you can check the diagnostics without (or before) computing the matrix, and it is **advisory**: it never changes the coefficients you asked for — it tells you whether each method is on solid footing for your data and, when it isn't, which alternative fits.

> **No method is assumption-free.** Pearson's r leans hardest on distributional assumptions, but the rank methods are not immune — they assume relatively few *ties*, and that assumption breaks down for coarse ordinal or heavily repeated data. The comprehensive pass surfaces all of these at once.

### The per-pair method-suitability matrix

The card leads with a matrix — one row per variable pair, the pair-level checks as columns, and a **Suitable methods** column that synthesizes them:

- **N** — the number of complete (listwise) cases for the pair.
- **Bivariate normality**, **Linearity (RESET)**, **Homoscedasticity (Breusch-Pagan)**, **Influential points (Cook's D)** — the [OLS diagnostics](#ols-diagnostics-pearson), shown for continuous pairs (where Pearson applies). Each is a *Pass* / *Fail* / *N/A* verdict; a `—` means the check doesn't apply to that pair.
- **Adequate expected counts** — the [χ² cell-count](#contingency-table-methods-χ²-cell-counts) verdict, shown for contingency-table pairs (Phi / Cramér's V); `—` elsewhere.
- **Latent bivariate normality** — the [latent-normality goodness-of-fit](#latent-methods-bivariate-normality), shown for the pairs the latent methods fit (polychoric / tetrachoric / polyserial / biserial); `—` elsewhere. *Fail* means the assumed underlying bivariate normal is rejected.
- **Monotonic dependence (dCor)** — the [non-monotonic dependence cross-check](#non-monotonic-dependence-dcor-cross-check), shown for continuous/ordinal pairs; `—` for nominal pairs. *Fail* means the data carry dependence that a linear or monotonic measure would miss.
- **Suitable methods** — the synthesis. Every method whose data types fit the pair is listed, unless one of its assumption checks fails:
	- A **failed check drops the method** from the suitable list and shows it parenthetically with the reason — e.g. *Pearson's r: bivariate normality not met*, or *Cramér's V: sparse cells, use Monte-Carlo*.
	- **Rank methods stay listed even under heavy ties**, carrying a *use exact p-values* caveat — ties strain the p-value, not the estimate.
	- **Latent methods** (polychoric / tetrachoric / polyserial / biserial) stay listed when their types fit, even when their normality goodness-of-fit fails, but pick up a *bivariate normality rejected — estimates may be biased* advisory — the latent model is often the only option for the pair's types.
	- The **primary** method — the one you selected, or the best-fitting method for the pair under Mixed/Auto — is marked.

> **Why advisory rather than automatic?** Switching methods per pair would leave you reading a matrix where different cells use different measures — not comparable to one another. Keeping a single method across the matrix and flagging where it's strained preserves comparability while still steering you toward an alternative when the data warrant it. A failed linearity or normality check points to Spearman (it captures any monotonic relationship); heavy influential points point to Kendall (the most outlier-resistant).

### OLS diagnostics (Pearson)

For **every continuous pair** — regardless of the method you selected — the card runs Pearson's OLS-based diagnostics, so the matrix tells you whether Pearson would be sound even when you've asked for a rank method:

- **Bivariate normality** — Mardia's test of joint (skewness + kurtosis) normality of the pair.
- **Linearity (RESET)** — Ramsey's RESET test; a failure flags a curved relationship that Pearson would understate.
- **Homoscedasticity (Breusch-Pagan)** — whether the scatter is even across the range; a failure means the relationship is tighter in some regions than others.
- **Influential points (Cook's D)** — whether any single observation is strong enough (Cook's D > 1) to drive the result. The matrix reports the verdict; the supporting size-aware (4/(n−p−1)) and high-leverage (hat value > 2p/n) counts still inform it.

> **Both regression directions are checked.** RESET, Breusch-Pagan, and Cook's D are fit on a regression of one variable on the other, so their result depends on which variable is treated as the outcome — but correlation is symmetric and has no such direction. To keep the verdict from hinging on an arbitrary choice, each of these three checks is run in both directions and the pair is flagged if *either* direction violates the assumption.

A companion **Marginal normality (Shapiro-Wilk)** table appears below the matrix — one row per variable in a continuous pair, testing whether each variable's values are individually normally distributed. The diagnostics use the same active-filter sample as the correlations themselves.

### Rank & ordinal methods (tie burden)

**Spearman**, **Kendall**, **Goodman & Kruskal's γ**, and **Somers' D** work on ranks or ordered categories, so they make no normality demands — but they do assume relatively few *ties* (observations sharing an identical value). When ties are heavy, the asymptotic formulas these methods use to compute p-values become unreliable. A variable-level **Tie burden** table below the matrix reports one row per variable in a rank-applicable pair:

- **N** — the number of non-missing observations for the variable.
- **Distinct values** — how many different values appear; a small count relative to N signals coarse, tie-prone data.
- **Tied fraction** — the share of observations that share their value with at least one other. 0 means every value is unique; 1 means every observation is tied to some other.
- **Max single-value share** — the largest share held by any single value. This surfaces a dominant category (e.g. a floor or ceiling pile-up) even when the overall tied fraction looks moderate.
- **Heavy ties** — the advisory verdict: *Fail* when the tied fraction exceeds 0.5, otherwise *Pass*. This is a judgment threshold, not a formal test.

When any variable trips the threshold, a note recommends switching to **exact** or **permutation-based** p-values, which don't lean on the tie-sensitive asymptotic approximation.

> **Ties strain the p-value, not the coefficient.** Spearman's rho and Kendall's tau stay well-defined under ties — their formulas apply a tie correction to the statistic itself. What suffers is the *significance test*: with many ties, the reference distribution is no longer the smooth one the closed-form p-value assumes. Read a heavy-tie flag as "the coefficient is fine, but double-check the p-value."

### Contingency-table methods (χ² cell counts)

**Phi** and **Cramér's V** measure association in a cross-tabulation, and their significance test is a χ² test — which relies on a large-sample approximation that breaks down when the table's *expected* cell counts are small. For each contingency-table pair the card builds the table, computes the expected count of every cell under independence, and applies **Cochran's rule**: the pair fails when any expected count falls below 1, or more than 20% of cells fall below 5. The matrix's **Adequate expected counts** column reports that verdict, on the same complete-case sample the correlations use.

When the rule is violated, the **Suitable methods** column names the shape-aware alternative: **Fisher's exact test** for a 2×2 table, or a **Monte-Carlo / Fisher–Freeman–Halton** exact test for larger R×C tables.

> **Why expected, not observed, counts?** The χ² statistic compares observed counts to the counts you'd expect under independence, and its reference distribution is only approximately χ² when those *expected* counts are reasonably large. A cell can have zero observations yet a healthy expected count (or vice versa) — it's the expected values that govern whether the approximation holds. An exact test sidesteps the approximation entirely by enumerating (or simulating) the possible tables.

### Latent methods (bivariate normality)

**Polychoric** (two ordinal variables), **tetrachoric** (two binary), **polyserial** (one continuous, one ordinal), and **biserial** (one continuous, one binary) all estimate the correlation of a pair of *latent* continuous variables assumed to lie beneath the observed categories — and that estimate is only valid when those latent variables really are **jointly bivariate normal**. Unlike the rank or contingency-table assumptions, this one bites the *coefficient itself*: if the latent normal model is wrong, the estimate is biased, not just its p-value. For each latent-applicable pair the card runs a **χ² goodness-of-fit test of underlying bivariate normality** on the same complete-case sample the correlations use:

- The test reuses the likelihood-ratio χ² that `polycor` (`polychor` / `polyserial`) already computes when it fits the pair — so the check is the estimator's own internal test, not a separate model.
- **Fail** (p < your assumption-test α) means the data are inconsistent with a bivariate-normal latent structure; the latent estimate should be read with caution.
- A **saturated table reports *N/A*, never a *Pass*.** A 2×2 tetrachoric fit (and any table with zero residual degrees of freedom) has nothing left to test — the model fits perfectly by construction, so there is no evidence either way.

When a pair fails, the **Suitable methods** column keeps the latent method listed but adds a *bivariate normality rejected — estimates may be biased* advisory. Unlike the OLS and χ² checks, a failed latent-normality test does **not** drop the method: the latent model is frequently the only one whose data types fit the pair, so the matrix flags the strain rather than leaving you no candidate.

> **Why doesn't this drop the method?** For two ordinal variables there is no assumption-free alternative that estimates the same latent association — dropping polychoric would leave the cell empty. The advisory is the honest middle ground: the estimate may be biased, but it is still your best available read, and a strongly non-normal latent structure is the signal to corroborate it with a model that doesn't assume normality (e.g. a rank measure on the same pair).

### Non-monotonic dependence (dCor cross-check)

Pearson, Spearman, and Kendall only see *monotonic* structure: Pearson measures straight-line association, the rank methods measure consistently-increasing-or-decreasing association. A relationship that is strong but **non-monotonic** — a U-shape, a cycle, a fan — can leave all three near zero even though the variables are tightly dependent. For **every continuous/ordinal pair** the card runs an omnibus cross-check that no monotonic coefficient can:

- **Distance correlation** (`energy::dcorT.test`) is computed for the pair. Unlike a correlation coefficient, distance correlation is zero *only* under full independence, so it detects dependence of any shape (it needs n ≥ 4; the t-approximation is most reliable around n ≥ 20).
- **Spearman's |r|** is the monotonic reference — the broadest of the standard monotonic measures, and independent of whichever method you selected.

The pair is flagged **Fail** when distance correlation is significant (p < your assumption-test α) **yet** Spearman's |r| is below the *negligible* band (the lowest correlation-strength threshold, 0.1 by default) — i.e. there is real dependence that the monotonic measures are missing. When distance correlation can't be computed (n < 4) the cell is *N/A*, never a spurious *Pass*.

When a pair fails, the **Suitable methods** column adds an advisory pointing to shape-agnostic measures — **distance correlation**, **mutual information**, or **Hoeffding's D** — which capture dependence that Pearson/Spearman/Kendall understate. The cross-check never *drops* a method: a monotonic coefficient isn't wrong, it just answers a narrower question than your data may demand.

> **Significant dCor but a near-zero rho is the tell.** Either measure alone is ambiguous — a tiny Spearman could mean "no relationship" or "a non-monotonic one," and a significant distance correlation could simply be the same monotonic signal Spearman already caught. Reading them *together* isolates the case that matters: dependence is present (dCor) but the monotonic lens can't see it (rho ≈ 0).

## Controlling for covariates (partial & semi-partial correlation)

A **Control for** list appears under the variable selection when the chosen method is **Pearson**, **Spearman**, or **Kendall** — these are the only methods that support partialling in this module. Pick one or more numeric covariates from the list; the module will compute the correlation between each pair *after* removing the linear (or rank-based) influence of those covariates.

> **Why partial correlation?** Two variables can correlate strongly only because a third variable drives both. Controlling for that third variable strips out the shared influence and shows whether any direct relationship remains. The classic example is the ice-cream–drowning correlation: control for temperature and the correlation vanishes. Partial correlation is also how you detect *suppression*: cases where a relationship is hidden by a confounder and becomes visible (or even reverses) once the confounder is held constant.

### Partial vs. semi-partial

Once at least one covariate is selected, a mode radio appears:

- **Partial (residualize both)** — the canonical partial correlation: removes the covariates' influence from *both* variables, then correlates the residuals. Symmetric. Use this when you're asking "what is the direct relationship between X and Y, holding Z constant?"
- **Semi-partial (residualize variable 1 only)** — removes the covariates' influence only from Variable 1, then correlates the result with raw Variable 2. **Asymmetric** — the cell at row A / column B differs from the cell at row B / column A. Use this when you want to know how much *unique* variance Variable 1 contributes to Variable 2 above and beyond the covariates.
- **Semi-partial (residualize variable 2 only)** — the mirror: residualize Variable 2 only.

In matrix display, semi-partial output behaves like the other asymmetric methods — both triangles are populated with genuinely different numbers, the redundancy hider is forced off, and a *Direction: row → column* caption is added.

### Zero-order companion

Partial correlation is fundamentally a *comparative* statement, so each cell and each long-format row also reports the **zero-order** coefficient — the same correlation computed *without* the covariates, on the same complete-case sample. It's labeled with a `₀` subscript (e.g. `ρ₀` for Spearman). Read the result as "controlling for Z, the X–Y relationship moved from ρ₀ = 0.61 to ρ = 0.18" — the gap tells the confounding (or suppression) story directly.

### Sample size, missing data, and scatterplots

- Pairwise deletion now spans *all* involved variables — the pair (X, Y) and every covariate — so an observation missing any one of them is dropped. The minimum needed is `k + 3` complete cases, where *k* is the number of covariates.
- The control list shows only numeric variables. Categorical covariates aren't supported in this pass; you can numeric-code them upstream if needed.
- Control variables are excluded from the matrix axes — they appear *only* as covariates, never as subjects of correlation.
- Scatterplots under **Pearson** and **Spearman** partials become **residual–residual scatterplots**: each axis shows the residuals of that variable after regressing out the covariates (for *semi-partial* modes, only the residualized side is replaced). The OLS line on a partial-Pearson residual scatter then has the slope of the partial regression coefficient, and the `r` value displayed in the corner matches the partial coefficient in the table. Axes are relabelled with a `| covariates` suffix. **Kendall** partial scatterplots are *not* residualized — the raw data is shown with the usual Nadaraya-Watson kernel smoother, since there is no exact rank-based analogue to OLS residualization that would reproduce the partial-τ value.

> **A caveat on partial Spearman and partial Kendall.** Both rank-based partials are implemented via `ppcor` — partial Spearman as a Pearson partial on rank-transformed data (the residual scatter therefore shows residuals of **ranks**, with axis labels suffixed `(ranks) | covariates`), partial Kendall as a closed-form expression on pairwise τ's. These are common operational definitions but not the only ones in the literature; if your community uses a different convention (e.g. the Kendall partial τ derived from concordant/discordant triples), keep that in mind when comparing across tools.

## Testing differences between correlations

A correlation by itself often isn't the question — the real question is whether two correlations *differ*. Does X relate to Y more strongly than to Z? Did the X–Y correlation change across groups? Is the whole pattern of correlations the same in two samples? The **Test for differences between correlations** card lets you answer those questions directly, with the right test for each comparison structure.

> **Why a special test?** You can't just look at two correlations side by side and call them different — sampling variability matters, and so does whether the two coefficients share a sample. Two r's from the **same sample** are statistically dependent (they share rows and often share variables), so the test must account for that dependence. Two r's from **different samples** are independent and need a different test. The card picks the right family for you based on the comparison structure.

### Comparison structures

Pick one of six structures from the **Comparison structure** dropdown — grouped into **Pairwise** (one comparison per cell pair) and **Joint** (a single omnibus statistic for the whole matrix). The options that don't apply to your current matrix shape are hidden automatically — for example, *within each row variable* needs at least two column variables.

| Family | Structure | What it tests | Sample | Test family used |
|---|---|---|---|---|
| Pairwise | **Within each row variable** | All pairs of column-cells against each other (same row anchor) | Single | Williams' T2 (dependent overlapping) |
| Pairwise | **Within each column variable** | All pairs of row-cells against each other (same column anchor) | Single | Williams' T2 (dependent overlapping) |
| Pairwise | **Against a reference cell** | Every cell in the matrix against one chosen reference cell (**strongest |r|** or **weakest |r|**) | Single | Williams' T2 when cells share a variable; Steiger Z (Olkin–Finn covariance) when they don't |
| Pairwise | **Between groups** | For each cell, the same pair across two groups defined by a grouping variable | Two (independent) | Fisher *z* for independent correlations |
| Joint | **Pattern equality (single sample)** | All "the matrix is internally flat" constraint pairs at once — a single χ² for the whole matrix | Single | Steiger pattern-equality χ² |
| Joint | **Equality across groups** | Whole correlation matrix is the same in every group | k groups (independent) | Jennrich (1970) trace χ² for k = 2; Wald χ² on Olkin–Siotani covariance at the pooled R̄ for k ≥ 3 |

The **Between** and **Omnibus across groups** structures require a **Compare across (variable)** dropdown — pick the categorical variable that splits the sample into groups. The other four structures use the full sample.

> **Reference cell pickers.** *Strongest |r|* picks the largest absolute coefficient in the matrix as the reference; *weakest |r|* picks the smallest. Both break ties lexically by `(row, col)` name so the pick is deterministic across runs.

### Method coverage

- **Closed-form path** — covers **Pearson**, **Spearman**, and **Kendall** (including their partials). Closed-form variance is canonical for Pearson; Spearman and Kendall use it as an asymptotically valid plug-in approximation, and partials use it with `df = n − k − 3` (Wilcox 2009, §10.11).
- **Bootstrap path** — covers most other methods, including the asymmetric ones (Somers' D, Theil's U, Chatterjee's ξ — handled via an ordered pair grid so each direction gets its own distribution). The bootstrap path is only active when **Confidence intervals** is set to *Analytic* or *Percentile bootstrap*; with CIs off, only the closed-form-supported methods produce diff tests. Single-sample structures share a row-index draw across all pairs per iteration so within-sample dependence is preserved; between-group draws are independent per group.
- **Semi-partial mode** always routes through the bootstrap, since the closed-form Δr variance formulas are derived for symmetric (zero-order or canonical-partial) coefficients.
- **Mixed/Auto** has no diff test — the per-pair method dispatch can't be folded into a single comparison statistic. The card shows a warning if you try.

### Omnibus fallback

The pattern-equality and across-groups omnibus tests rely on a covariance matrix that can become rank-deficient on small samples or sparse group sizes. When that happens, the orchestrator falls back to a **Cauchy combination (ACAT, Liu & Xie 2020)** of the component pairwise tests — robust to arbitrary dependence between the components, at the cost of being less powerful than the proper joint test when the joint test is available. The output table labels which one was used.

### Reading the comparison table

For the four pairwise structures (row-wise, column-wise, reference, between), the output card shows one row per comparison with these columns:

- **Pair A** and **Pair B** — the two cells being compared (variable names). The *reference* structure replaces Pair A with a banner above the table and shows only the **Compared cell**. The *between* structure replaces them with **Variable 1**, **Variable 2**, **Group A**, **Group B**.
- **r (A)** and **r (B)** — the two coefficients (or just **r** in *reference* mode).
- **Δr** — the difference r(A) − r(B).
- **Statistic** — the test statistic with its label (e.g. `t = …` for Williams' T2, `Z = …` for Steiger / Fisher z, `Δr* = …` for the bootstrap), with significance stars.
- **df** — degrees of freedom (where applicable).
- **p-value** — raw p, plus adjusted p in a separate column if [adjustment](./settings.md#multiple-comparison-adjustment) is enabled in *addition* mode (otherwise the adjusted value replaces the raw one).

For omnibus structures, a single-row table shows the test label, χ², df, and p-value.

A footnote under the table identifies which test family was used (Williams' T2, Steiger Z, Fisher z, or percentile bootstrap with the replication count) and surfaces any plug-in caveats that apply (Spearman/Kendall plug-in approximation, partials' `n − k − 3` adjustment, semi-partial bootstrap routing).

### P-value adjustment for comparisons

The same global [adjustment method](./settings.md#multiple-comparison-adjustment) that applies to the matrix is applied separately to the family of diff-test p-values — the matrix's p-values and the diff card's p-values are adjusted **independently**, since they answer different families of questions. Inside the diff card, all comparisons of a single structure are treated as one family.

### Reporting comparisons

When writing up a difference test, report: the comparison structure, the test family (Williams T2 / Steiger Z / Fisher z / bootstrap with B), the two coefficients, Δr, the test statistic with df, the p-value (raw and adjusted if applicable), and the sample size(s). For omnibus tests, report χ², df, p, and which omnibus variant was used (Steiger pattern, Jennrich, Wald on Olkin–Siotani, or ACAT fallback).

## Display options

### Table format

- **Matrix** (default) — correlation matrix with variables on both axes
- **Long format** — flat table with one row per variable pair

### P-value display (matrix only)

- **Combined with correlation** (default) — each cell shows the coefficient with significance stars on one line and the p-value below it
- **Separate p-value table** — the matrix shows only coefficients, and separate p-value matrices appear below

### Hide redundant values

Enabled by default. When the matrix is symmetric (same variables on both axes), only the lower triangle is shown. Uncheck to see the full matrix. The checkbox is automatically hidden when an asymmetric method (Somers' D, Theil's U, Chatterjee's ξ) is selected — in those cases both triangles carry genuinely different values and neither is redundant.

### Append raw MI / Append entropies

Two checkboxes appear below the information-theoretic methods (NMI, AMI, coherence, Theil's U) when one of them is selected:

- **Append raw MI** — adds the raw mutual information (in nats, Miller-Madow corrected) to each cell or long-format row. Useful for reporting and for reconciling with other tools, since the normalized statistic alone hides the absolute information content.
- **Append entropies** — adds H(row) and H(col), the marginal entropies of each variable. Makes it easy to see whether a low NMI reflects genuine independence or just a low-entropy variable with little information to share in the first place.

Both are off by default to keep the default view uncluttered.

### P-value method (IT methods only)

A dropdown appears alongside the IT options when an information-theoretic method (NMI, AMI, coherence, Theil's U) is selected:

- **Analytic chi² (fast, tests independence)** — default. Uses the asymptotic result that `2n·MI ~ χ²((k_x−1)(k_y−1))` under independence. The test is correct for the *independence hypothesis* but its statistic is raw MI, not the normalized coefficient you see in the cell. Fast — single closed-form call per pair.
- **Permutation (slower, tests the reported coefficient)** — shuffles one variable many times and recomputes the chosen coefficient on each shuffle. The shuffle count is derived from your [significance level](./settings.md#significance-level) (at least `20/α` reps so the threshold can be resolved) with your [bootstrap-replications setting](./settings.md#bootstrap-replications) as a floor; when p-adjustment is active, the count is inflated by `√(number of pairs)` to maintain resolution after correction. The reported p-value is the fraction of shuffles whose coefficient reaches or exceeds the observed value (with the standard +1/+1 finite-sample correction). This directly tests "is the reported NMI/AMI/coherence/Theil's U larger than chance?", which is most defensible for AMI, where the chi² approximation is only loose.

Other methods (Pearson, Spearman, chi²-family, etc.) already have proper analytic or exact p-values and aren't affected by this setting.

### Confidence intervals

A dropdown controls whether each coefficient is reported with a confidence interval:

- **None** (default) — no CIs are computed.
- **Analytic (closed-form where supported)** — uses each method's natural closed-form CI: Fisher *z* transform for Pearson / Spearman (Bonett–Wright variance) / Kendall (Fieller) / point-biserial, and an **atanh-transformed (Fisher *z*) Wald interval with delta-method SE** for polychoric, polyserial, tetrachoric, biserial, Goodman & Kruskal's γ, and Somers' D — keeping the bounds inside the natural `[-1, 1]` range. Phi has no usable closed-form CI here (its asymptotic SE depends on the 2×2 marginal proportions, not just phi itself, so Fisher *z* bounds disagree with the chi² test) — use the bootstrap mode for phi.
- **Percentile bootstrap (any method)** — resamples the data with replacement (using the [bootstrap settings](./settings.md#bootstrap-replications) for replications) and takes empirical quantiles. Currently supported for Pearson, Spearman, Kendall, point-biserial, phi, and the partial / semi-partial Pearson / Spearman / Kendall variants. Other methods show `—` in this mode for now.

The confidence level is read from your global [confidence-level setting](./settings.md#confidence-level). CIs appear as an extra column in the long table and as an extra line under the coefficient in matrix cells. Methods without a supported CI for the chosen mode show `—`.

> **Which mode to pick?** Analytic is faster and produces narrower (more efficient) intervals when its assumptions hold. Bootstrap is more flexible but slower and a bit wider — useful when sample sizes are small, distributions are weird, or you simply don't trust the asymptotic approximation. For a quick check, analytic; for a final report on a small or non-normal dataset, bootstrap.

### Negligible-correlation margin (TOST)

By default, a correlation analysis can only tell you whether a relationship *exists* — a non-significant p-value never proves a correlation is absent (see the [note on interpretation](#interpretation)). The **Negligible-correlation margin** lets you make that positive claim. Enter a margin Δ — the largest |r| you'd still consider practically zero — and DataSuite runs a **TOST** (two one-sided tests) equivalence test for every supported pair. Leave it empty (the default) to skip.

The test pits H₀ |ρ| ≥ Δ against H₁ |ρ| < Δ: two one-sided tests on the Fisher-*z*–transformed coefficient against the bounds −Δ and +Δ, with the reported **p (Δ)** being the larger of the two. A small **p (Δ)** is positive evidence that the true correlation falls inside the band, and is therefore negligible.

- **Analytic only** — currently covers Pearson, Spearman, Kendall, point-biserial, biserial, polyserial, polychoric, tetrachoric, Somers' D, and Goodman & Kruskal's γ. Methods without analytic TOST show no **p (Δ)**.
- **Its own adjustment family** — because it asks the opposite question from the ordinary p-value, **p (Δ)** is [adjusted](./settings.md#multiple-comparison-adjustment) separately from the significance p-values, never pooled with them.

> **Choosing Δ:** set it to the smallest |r| that would be practically meaningful in your field, *before* looking at the results — picking a margin just wide enough to reach significance invalidates the test. A margin that's too wide makes negligibility easy to claim but unconvincing; too narrow demands very large samples. This is the correlation-scale analogue of the equivalence bound in [comparison analysis](./comparison-analysis.md#test-direction), where the same TOST logic is explained in more depth.

### Include visualizations

Four visualization types are available as checkboxes: [edge bundling](#edge-bundling), [force-directed graph](#force-directed-graph), [correlogram](#correlogram), and [scatterplots](#scatterplots). Each produces a separate output card. All filter to statistically significant correlations where applicable.

## Reading results

### Matrix format

Each cell shows:

- The correlation coefficient with the method's symbol (r, ρ, τ, β, φ, V, D, γ, η², ρ<sub>poly</sub>, ρ<sub>tet</sub>, ρ<sub>ps</sub>, NMI, AMI, C<sub>R</sub>, U, D<sub>H</sub>, ξ, dCor)
- Significance stars based on your [significance settings](./settings.md#significance-formatting)
- The p-value (formatted according to your [p-value settings](./settings.md#p-value-settings))
- Adjusted p-value, if [adjustment](./settings.md#multiple-comparison-adjustment) is enabled in addition mode
- Confidence interval, if **Confidence intervals** is set to *Analytic* or *Percentile bootstrap* (and the method supports it)
- Zero-order coefficient (with subscript ₀), if a partial / semi-partial run is active — the same correlation computed without the covariates
- The negligibility p-value **p (Δ)** (and **p (Δ, adj)** if adjustment is shown in addition mode), if a [**Negligible-correlation margin**](#negligible-correlation-margin-tost) is set and the method supports analytic TOST — a small value is evidence the correlation is practically zero
- Raw MI and/or entropies, if **Append raw MI** / **Append entropies** is enabled (IT methods only)
- Diagonal cells show a dash (a variable's correlation with itself is always trivially 1)
- Error cells are highlighted in red — hover to see the specific reason (e.g. "Insufficient data", "Not a 2×2 table", "Constant variable — no information")

For asymmetric methods (Somers' D, Theil's U, Chatterjee's ξ), a small *Direction: row → column* caption appears above the matrix. Each cell's value describes how well the **row variable predicts the column variable** — so the lower and upper triangles carry different numbers.

### Long format

Columns include:

- **Variable 1** and **Variable 2** — for asymmetric methods, the row reads as "Variable 1 → Variable 2" (Variable 1 is the predictor), and both orderings of each pair appear as separate rows
- **Method** — shown for Mixed/Auto, *and* whenever a per-row fallback occurred (e.g. η² automatically falls back to Cramér's V on categorical × categorical pairs); displays the symbol used for that pair, with the full method name in a tooltip
- **Coefficient** — the correlation value with significance stars
- **p-value** — and adjusted p-value if enabled in addition mode
- **CI** — confidence interval column, if **Confidence intervals** is enabled
- **r₀ (ρ₀, τ₀, …)** — zero-order coefficient, if partials are active
- **p (Δ)** (and **p (Δ, adj)**) — the negligibility / TOST equivalence p-value, shown when a [**Negligible-correlation margin**](#negligible-correlation-margin-tost) is set and the method supports analytic TOST
- **MI, H(var₁), H(var₂)** — appended when the **Append raw MI** / **Append entropies** checkboxes are enabled for IT methods
- **Interpretation** — if the [interpretation setting](./settings.md#significance-formatting) is turned on. For failed pairs, this column shows the specific reason for the error instead.

### Interpretation

When enabled, each correlation receives a plain-language description combining:

- Significance — "Significant" or "Insignificant"
- Strength — negligible (< 0.1), very weak (0.1–0.3), weak (0.3–0.5), moderate (0.5–0.7), strong (0.7–0.9), or very strong (≥ 0.9)
- Direction — positive or negative (signed methods only; unsigned methods omit this)

For example: "Significant moderate positive correlation" (Pearson) or "Significant strong association" (η², NMI, Chatterjee's ξ, and other unsigned measures). Strength thresholds are configurable — see [settings](./settings.md) for the correlation and information-metric band options.

> **Why "insignificant" doesn't mean "no relationship":** a non-significant result means there isn't enough evidence to conclude a relationship exists *in the population* — not that the variables are definitely unrelated. With small samples, even moderate correlations can be non-significant simply because there isn't enough data. With very large samples, even tiny correlations can be significant while being practically meaningless. Always consider the coefficient size alongside the p-value.

> **Proving a correlation is negligible:** if you actually want to claim two variables are *practically unrelated* — not merely "not significant" — use the [**Negligible-correlation margin**](#negligible-correlation-margin-tost) to run a formal equivalence test. Its **p (Δ)** turns "we found no significant correlation" into the defensible "the correlation is significantly within ±Δ of zero."

## P-value adjustment

Correlation matrices involve many simultaneous tests — a 10-variable matrix produces 45 unique pairs. Without adjustment, some results will appear significant by chance alone.

If no [adjustment method](./settings.md#multiple-comparison-adjustment) is selected, a warning appears recommending you consider one.

## Missing data

Missing values are handled by the global [missing data setting](./settings.md#missing-data):

- **Pairwise** (default) — each pair uses all cases where both variables have values
- **Listwise** — only cases complete across all selected variables are used
- **Imputation** — missing values are replaced with substitutes (mean, median, mode, or a constant) before analysis

> **Pairwise vs. listwise:** pairwise keeps more data but can produce correlation matrices that aren't internally consistent (e.g. variable A correlates with B and B with C, but the A–C correlation seems off because different subsets of cases were used). Listwise avoids this but may discard a lot of data if missingness is spread across many variables.

> **A note on imputation:** replacing missing values can artificially reduce variability, which tends to pull correlations toward zero. Mean and median imputation are the most prone to this. If you have a lot of missing data, consider whether pairwise deletion might be more appropriate for correlation analysis.

## Visualizations

All visualizations can be resized by dragging the handle in the bottom-right corner. To save figures, use the bulk export action — see [reading results](./getting-started.md#reading-results) — which captures every plot on the page in one step.

### Edge bundling

A circular network diagram. Variables are arranged as labeled nodes around a circle, ordered by correlation similarity so strongly correlated variables sit closer together. Curved edges connect pairs with statistically significant correlations.

- **Edge color** encodes direction and strength — blue for positive, red for negative, gray for near-zero. A color legend from −1 to +1 appears above the chart.
- **Edge thickness** reflects the absolute strength of the correlation
- **Hover** over an edge to highlight it
- **Zoom** with the mouse wheel or the +/−/reset buttons in the top-right corner

### Force-directed graph

An interactive network where positively correlated variables attract each other and negatively correlated ones repel. Nodes are pill-shaped with variable labels inside. Edges are colored and sized by correlation strength and sign.

- **Drag** a node to reposition it — it stays fixed in place (shown with a blue dashed border)
- **Click** a fixed node to release it back into the simulation
- **Zoom** and **resize** work the same as edge bundling

This visualization is automatically hidden when an asymmetric method (Somers' D, Theil's U, Chatterjee's ξ) is selected — an undirected graph layout can't faithfully render both directions of an asymmetric pair. Use the [correlogram](#correlogram) or the long-format table for those methods.

> **Edge bundling vs. force-directed:** the edge bundling layout is better for getting an overview of correlation structure — you can quickly see clusters of related variables. The force-directed graph is better for exploring specific relationships interactively, since you can pull nodes apart and rearrange the layout.

### Correlogram

A matrix of oriented ellipses — one per variable pair. The ellipse shape and orientation encode the correlation:

- **Positive correlations** tilt right (/) — **negative** tilt left (\)
- **Eccentricity** encodes absolute strength — a circle at r = 0, a thin line at r = ±1
- **Fill color** matches the correlation color scale (blue to red)
- **Insignificant correlations** are dimmed with dashed borders
- The full matrix is shown (no diagonal)

If scatterplots are also enabled, clicking a cell scrolls to the corresponding scatterplot.

### Scatterplots

One scatter plot per variable pair, each in its own subsection. Each plot shows:

- Scatter points for the raw data
- A reference line whose shape depends on the chosen method:
	- **Pearson** and **point-biserial** — OLS regression line. A confidence band is drawn at your global confidence level when **Confidence intervals** is set to *Analytic* (closed-form conditional-mean band on the fitted line) or *Percentile bootstrap* (envelope of OLS lines refit on bootstrap resamples); no band is drawn when CIs are off.
	- **Spearman**, **Kendall**, **polychoric**, **polyserial**, **biserial**, **Somers' D**, **Goodman & Kruskal's γ**, **Hoeffding's D**, **Chatterjee's ξ**, **distance correlation** — Nadaraya-Watson kernel smoother (no parametric line; reveals monotone or nonlinear structure)
	- **Blomqvist's β** — median crosshairs (vertical at median X, horizontal at median Y), since the coefficient itself is defined by sign agreement around those medians
	- **Phi**, **Cramér's V**, **η²**, **NMI**, **AMI**, **coherence**, **Theil's U** — no overlay; the pair is categorical and a continuous fit would mislead
- The coefficient with the method's symbol (r, ρ, τ, …) and p-value in the corner — adjusted p-values follow the same [p-value adjustment display](./settings.md#multiple-comparison-adjustment) rule as the matrix and long-format tables
- Plot range is padded by one tick interval so edge points aren't clipped

#### Grouped scatterplots (between groups / equality across groups)

When the active comparison structure is **Between groups** or the across-groups omnibus, the scatterplot card switches to a **grouped** layout — one subplot per variable pair, but with points and overlay lines colored by group. The single-sample pattern-equality omnibus has no comparison-aware scatter — its honest visualization is the correlogram.

- **Points and overlay** are drawn separately for each group, with the same method-specific overlay choice (OLS line / kernel smoother / median crosshairs / no overlay) applied within each series.
- **Colors** come from the project-wide Tableau-10 palette, in the same order the groups appear in the comparison table.
- **Per-group r** appears in the top-right legend, with each entry colored to match its series — so the legend doubles as the color key.
- **No confidence bands** are drawn in grouped mode — overlapping K bands is visually unreadable. Use the comparison table for the formal Δr statistic and its CI.
- **Residualization** for Pearson/Spearman partials runs *within each group*, so each group's residual scatter reflects its own conditional relationship (not a pooled residualization that would smear group differences).
- **Edge bundling, force-directed graph, and correlogram** are all skipped in grouped diff mode — they're inherently single-matrix displays and don't have a meaningful per-group rendering.

#### Anchor-overlay scatterplots (within row / within column / against reference)

When the active comparison structure is **Within each row variable**, **Within each column variable**, or **Against a reference cell**, the scatterplot card switches to an **anchor-overlay** layout — one subplot per shared anchor variable, with the comparator variables drawn as overlaid colored series on a shared X axis.

- **X axis** is the anchor (row variable in *within row*, column variable in *within column*, the shared variable in *against reference* when the reference and comparator share one). Each comparator variable contributes its own colored series with its own fit line and its own *r* in the legend.
- **Reference structure** only overlays pairs that share a variable with the reference cell. Non-overlapping comparators (no shared variable) have no honest shared-axis rendering and are omitted from the card; their Δr is still tested via Steiger Z and reported in the comparison table.
- **Residualization** for Pearson/Spearman partials runs once over the full sample (no group dimension), and each comparator series is residualized on the same covariates.
- The **same overlay choice** as the single-mode scatter is used per series (OLS line / kernel smoother / median crosshairs / no overlay), so what you see matches the comparison test's underlying coefficient.

## Reporting checklist

Key things to include when writing up correlation results:

**Method:**
- Correlation method used (Pearson, Spearman, etc.) and why
- For partial / semi-partial analyses: the covariates controlled for, and whether you used partial or semi-partial (and on which side)
- For difference tests: the comparison family (pairwise vs. joint) and structure (within row / within column / against reference / between groups / pattern equality / equality across groups), the test used (Williams T2, Steiger Z, Fisher z, Jennrich χ², or percentile bootstrap with B replications), and — for *between groups* / *equality across groups* — the grouping variable
- How missing data were handled (pairwise or listwise deletion)
- P-value adjustment method, if any
- CI method (analytic / bootstrap) and confidence level, if reporting intervals
- For a negligibility test: that you used TOST, the margin Δ, and that Δ was chosen a priori
- Sample size

**Results:**
- The correlation coefficient with its symbol (r, ρ, τ, etc.)
- Confidence interval, if computed
- For partial analyses: the zero-order coefficient alongside, so readers can see the effect of controlling
- P-value (exact or inequality)
- For a negligibility test: the equivalence p-value **p (Δ)** (raw and adjusted if both are shown) and the margin Δ used
- Sample size per pair (if pairwise deletion was used and N varies)
- Effect size interpretation, if relevant
- For matrix output: whether the full matrix or selected pairs are reported
- For difference tests: both r's (or, for omnibus, the test alone), Δr, the test statistic with df, and the p-value — adjusted and raw if both are shown

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) — you can inspect, copy, or re-run the exact commands. Correlation analysis uses base R (`cor.test`) for the classical methods, plus `polycor` (polychoric, polyserial, and tetrachoric), `infotheo` (mutual information and entropy with Miller-Madow correction), `aricode` (adjusted mutual information), `energy` (distance correlation), `Hmisc` (Hoeffding's D), `XICOR` (Chatterjee's ξ with ties-aware p-value), and `ppcor` (partial and semi-partial correlation for Pearson, Spearman, and Kendall). Blomqvist's β, the correlation ratio η², the signed φ coefficient, and Goodman & Kruskal's γ / Somers' D (with contingency-table ASE) are implemented directly in base R, as are all the correlation-comparison tests (Fisher *z*, Williams' T2, Steiger Z, Jennrich χ², the Wald χ² on Olkin–Siotani covariance, the Steiger pattern-equality χ², and the Cauchy combination fallback). The negligibility-margin (TOST) p-values are likewise computed directly in base R from the Fisher-*z* transform. Citations for any package your analysis actually uses appear automatically at the top of the output section.

## Common pitfalls

**Correlation is not causation.** A strong correlation between ice cream sales and drowning rates doesn't mean ice cream causes drowning — both increase in summer. Correlation measures *association*, not causal direction. Establishing causation requires proper experimental design.

**Pearson's r only captures linear relationships.** Two variables can have a strong curvilinear relationship and still show r ≈ 0. Spearman's rho and Kendall's tau only help if the relationship is *monotonic* (consistently increasing or decreasing, even if non-linearly — e.g. exponential growth). They won't rescue you from a U-shaped or inverted-U pattern, which reverses direction and will produce near-zero coefficients with any of these methods. If you suspect a non-linear pattern, always visualize your data first — check the [distribution plots](./distribution-analysis.md#distribution-plots) or a scatter plot — before choosing a correlation method.

**Large matrices require care, not avoidance.** Running a 30×30 correlation matrix produces 435 tests — without correction, some will appear significant by chance. Always apply a multiple comparison correction when running a full matrix. The more important question is whether your analysis is hypothesis-driven or exploratory: if you're selecting "interesting" pairs after seeing the results, that's exploratory regardless of matrix size, and should be reported as such. If all pairs were theoretically motivated upfront and a correction was applied, a large matrix can support confirmatory claims.

**Outliers can dominate Pearson's r.** A single extreme point can inflate or deflate a Pearson correlation dramatically. If your data has outliers, Spearman's rho (which uses ranks) or Blomqvist's β (which uses only medians) is much more robust. Always visualize your data before trusting a single number.

**Unsigned measures aren't comparable to signed ones.** A Pearson *r* of 0.5 and an NMI of 0.5 mean very different things. Pearson's 0.5 is a moderate linear association; NMI's 0.5 says half of the combined variable entropy is shared — a much stronger statement. Don't treat the two scales as interchangeable when you're comparing across methods, and don't expect a signed method and an unsigned method to produce similar numbers on the same pair.

**Asymmetric measures need both directions.** When you use Somers' D, Theil's U, or Chatterjee's ξ, the value of "A → B" is generally **not** the same as "B → A". The upper and lower triangles of the matrix are both populated and both meaningful. If you're reporting a single number for an asymmetric measure, always specify which direction — "U(Y | X) = 0.42", not just "U = 0.42".

**Correlating two time-ordered series spuriously inflates *r*.** Two trending or seasonal series can show a near-perfect Pearson correlation just because they share the trend or cycle, not because they're related at any given moment. The classic textbook example is "US per-capita cheese consumption vs. deaths from bedsheet entanglement". Detrend and de-seasonalise first — the [Time series analysis](./time-series-analysis.md) module's exploration view shows the decomposition components you can correlate instead — or compute the cross-correlation of the differenced series.
