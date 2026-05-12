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
3. Adjust [display options](#display-options)
4. Click **Calculate correlations**

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
- **Correlation ratio (η²)** — the share of a continuous variable's variance that is explained by grouping on a categorical one. Mathematically equivalent to the `R²` of a one-way ANOVA. Use it when one side of the pair is truly categorical (not ordered) and the other is continuous — a case where Pearson simply doesn't apply.

**Information-theoretic.** All four are bounded `[0, 1]` and all share the same first step: discretize continuous variables into bins, compute the mutual information (MI) — the number of bits that knowing one variable tells you about the other — and then normalize in different ways.

- **Normalized mutual information (NMI)** — MI divided by the average of the two marginal entropies. Often called *symmetric uncertainty*. The safest default for "how much do these two variables share?"
- **Adjusted mutual information (AMI)** — NMI with a chance-correction subtracted off. Useful when variable pairs have very different numbers of categories, since unadjusted MI tends to inflate in high-cardinality settings.
- **Rajski's coherence** — MI divided by the *joint* entropy. Stricter than NMI: approaches 1 only when the two variables are nearly identical (modulo relabelling).
- **Theil's U** — MI divided by the entropy of one specific side. **Asymmetric** — U(Y given X) ≠ U(X given Y), so the matrix is not symmetric. Read as "fraction of Y's uncertainty that knowing X would eliminate".

**General-dependence detectors.** The classical correlations all miss non-monotonic patterns (a U-shape gives Pearson ≈ 0). These three don't.

- **Hoeffding's D** — a classical nonparametric test statistic that is zero under independence and positive under any form of dependence. Its p-value is especially well-calibrated.
- **Chatterjee's ξ** — introduced in 2021; reaches 1 when one variable is a perfect function of the other (even a wildly non-monotonic one) and 0 only under independence. **Asymmetric** — ξ(X → Y) tells you whether Y is a function of X, not the other way around.
- **Distance correlation (dCor)** — energy-distance-based; zero *if and only if* the two variables are independent. Picks up any dependence a classical correlation misses, at the cost of being harder to interpret as "strength".

> **When to reach for a general-dependence measure:** classical correlations all have one blind spot — they can't tell a strong U-shape or cyclic pattern apart from no relationship at all. If your scatterplot shows *structure* but Pearson and Spearman both come back near zero, Chatterjee's ξ or distance correlation will catch it. Hoeffding's D is the classical choice for hypothesis tests of "are these independent at all?"

### Directional (asymmetric) methods

**Somers' D**, **Theil's U**, and **Chatterjee's ξ** are *directional*: they answer "how well does X predict Y?" rather than "how related are X and Y?" The resulting matrix is **not symmetric** — the cell at row A, column B generally differs from the cell at row B, column A.

The convention used throughout this module is **row → column**: the value in cell `[row, col]` describes how well the row variable predicts (or explains) the column variable. A direction caption under the matrix reminds you of this whenever one of these three methods is active. The **Hide redundant values** checkbox is also automatically hidden — both triangles carry genuinely different information.

**Assumptions:**
- **Pearson's r** assumes both variables are continuous and roughly normally distributed, with a linear relationship between them. Violations (skewness, outliers, curvilinear patterns) can distort the coefficient.
- **Spearman's rho and Kendall's tau** only assume a monotonic relationship and ordinal-level data. No normality requirement — use these when Pearson's assumptions are violated.
- **Blomqvist's β** assumes continuous data but has no distributional requirements beyond a well-defined median — robust to outliers and heavy tails.
- **Polychoric and polyserial** assume ordinal variables reflect an underlying continuous normal distribution. This is generally reasonable for Likert-type items with 4+ response categories.
- **Point-biserial and biserial** assume the continuous variable is normally distributed within each group defined by the binary variable. Biserial additionally assumes the binary split is artificial (an underlying continuum was dichotomized).
- **Phi, Cramér's V, and the mutual-information family** all rest on a contingency-table framework — expected cell frequencies should ideally be ≥ 5 per cell. Continuous variables are auto-discretized into equal-frequency bins; with very small samples, the bins may be too sparse to trust.
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

### Include visualizations

Four visualization types are available as checkboxes: [edge bundling](#edge-bundling), [force-directed graph](#force-directed-graph), [correlogram](#correlogram), and [scatterplots](#scatterplots). Each produces a separate output card. All filter to statistically significant correlations where applicable.

## Reading results

### Matrix format

Each cell shows:

- The correlation coefficient with the method's symbol (r, ρ, τ, β, φ, V, D, γ, η², NMI, AMI, C<sub>R</sub>, U, D<sub>H</sub>, ξ, dCor)
- Significance stars based on your [significance settings](./settings.md#significance-formatting)
- The p-value (formatted according to your [p-value settings](./settings.md#p-value-settings))
- Adjusted p-value, if [adjustment](./settings.md#multiple-comparison-adjustment) is enabled in addition mode
- Raw MI and/or entropies, if **Append raw MI** / **Append entropies** is enabled (IT methods only)
- Diagonal cells show a dash (a variable's correlation with itself is always trivially 1)
- Error cells are highlighted in red — hover to see the specific reason (e.g. "Insufficient data", "Not a 2×2 table", "Constant variable — no information")

For asymmetric methods (Somers' D, Theil's U, Chatterjee's ξ), a small *Direction: row → column* caption appears above the matrix. Each cell's value describes how well the **row variable predicts the column variable** — so the lower and upper triangles carry different numbers.

### Long format

Columns include:

- **Variable 1** and **Variable 2** — for asymmetric methods, the row reads as "Variable 1 → Variable 2" (Variable 1 is the predictor), and both orderings of each pair appear as separate rows
- **Method** — shown only for Mixed/Auto; displays the symbol used for that pair, with the full method name in a tooltip
- **Coefficient** — the correlation value with significance stars
- **p-value** — and adjusted p-value if enabled in addition mode
- **MI, H(var₁), H(var₂)** — appended when the **Append raw MI** / **Append entropies** checkboxes are enabled for IT methods
- **Interpretation** — if the [interpretation setting](./settings.md#significance-formatting) is turned on. For failed pairs, this column shows the specific reason for the error instead.

### Interpretation

When enabled, each correlation receives a plain-language description combining:

- Significance — "Significant" or "Insignificant"
- Strength — negligible (< 0.1), very weak (0.1–0.3), weak (0.3–0.5), moderate (0.5–0.7), strong (0.7–0.9), or very strong (≥ 0.9)
- Direction — positive or negative (signed methods only; unsigned methods omit this)

For example: "Significant moderate positive correlation" (Pearson) or "Significant strong association" (η², NMI, Chatterjee's ξ, and other unsigned measures). Strength thresholds are configurable — see [settings](./settings.md) for the correlation and information-metric band options.

> **Why "insignificant" doesn't mean "no relationship":** a non-significant result means there isn't enough evidence to conclude a relationship exists *in the population* — not that the variables are definitely unrelated. With small samples, even moderate correlations can be non-significant simply because there isn't enough data. With very large samples, even tiny correlations can be significant while being practically meaningless. Always consider the coefficient size alongside the p-value.

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

All visualizations can be resized by dragging the handle in the bottom-right corner, and exported as SVG, PNG, or JPG via buttons below the chart. You can also export all plots at once — see [reading results](./getting-started.md#reading-results) for bulk export.

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
- An OLS regression line with a 95% confidence band
- The coefficient with the method's symbol (r, ρ, τ, …) and p-value in the corner — adjusted p-values follow the same [p-value adjustment display](./settings.md#multiple-comparison-adjustment) rule as the matrix and long-format tables
- Plot range is padded by one tick interval so edge points aren't clipped

## Reporting checklist

Key things to include when writing up correlation results:

**Method:**
- Correlation method used (Pearson, Spearman, etc.) and why
- How missing data were handled (pairwise or listwise deletion)
- P-value adjustment method, if any
- Sample size

**Results:**
- The correlation coefficient with its symbol (r, ρ, τ, etc.)
- P-value (exact or inequality)
- Sample size per pair (if pairwise deletion was used and N varies)
- Effect size interpretation, if relevant
- For matrix output: whether the full matrix or selected pairs are reported

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) — you can inspect, copy, or re-run the exact commands. Correlation analysis uses base R (`cor.test`) for the classical methods, plus `polycor` (polychoric and polyserial), `infotheo` (mutual information and entropy with Miller-Madow correction), `aricode` (adjusted mutual information), `energy` (distance correlation), and `Hmisc` (Hoeffding's D). Blomqvist's β, the correlation ratio η², and Chatterjee's ξ are implemented directly in base R. Citations for any package your analysis actually uses appear automatically at the top of the output section.

## Common pitfalls

**Correlation is not causation.** A strong correlation between ice cream sales and drowning rates doesn't mean ice cream causes drowning — both increase in summer. Correlation measures *association*, not causal direction. Establishing causation requires proper experimental design.

**Pearson's r only captures linear relationships.** Two variables can have a strong curvilinear relationship and still show r ≈ 0. Spearman's rho and Kendall's tau only help if the relationship is *monotonic* (consistently increasing or decreasing, even if non-linearly — e.g. exponential growth). They won't rescue you from a U-shaped or inverted-U pattern, which reverses direction and will produce near-zero coefficients with any of these methods. If you suspect a non-linear pattern, always visualize your data first — check the [distribution plots](./distribution-analysis.md#distribution-plots) or a scatter plot — before choosing a correlation method.

**Large matrices require care, not avoidance.** Running a 30×30 correlation matrix produces 435 tests — without correction, some will appear significant by chance. Always apply a multiple comparison correction when running a full matrix. The more important question is whether your analysis is hypothesis-driven or exploratory: if you're selecting "interesting" pairs after seeing the results, that's exploratory regardless of matrix size, and should be reported as such. If all pairs were theoretically motivated upfront and a correction was applied, a large matrix can support confirmatory claims.

**Outliers can dominate Pearson's r.** A single extreme point can inflate or deflate a Pearson correlation dramatically. If your data has outliers, Spearman's rho (which uses ranks) or Blomqvist's β (which uses only medians) is much more robust. Always visualize your data before trusting a single number.

**Unsigned measures aren't comparable to signed ones.** A Pearson *r* of 0.5 and an NMI of 0.5 mean very different things. Pearson's 0.5 is a moderate linear association; NMI's 0.5 says half of the combined variable entropy is shared — a much stronger statement. Don't treat the two scales as interchangeable when you're comparing across methods, and don't expect a signed method and an unsigned method to produce similar numbers on the same pair.

**Asymmetric measures need both directions.** When you use Somers' D, Theil's U, or Chatterjee's ξ, the value of "A → B" is generally **not** the same as "B → A". The upper and lower triangles of the matrix are both populated and both meaningful. If you're reporting a single number for an asymmetric measure, always specify which direction — "U(Y | X) = 0.42", not just "U = 0.42".

**Correlating two time-ordered series spuriously inflates *r*.** Two trending or seasonal series can show a near-perfect Pearson correlation just because they share the trend or cycle, not because they're related at any given moment. The classic textbook example is "US per-capita cheese consumption vs. deaths from bedsheet entanglement". Detrend and de-seasonalise first — the [Time series analysis](./time-series-analysis.md) module's exploration view shows the decomposition components you can correlate instead — or compute the cross-correlation of the differenced series.
