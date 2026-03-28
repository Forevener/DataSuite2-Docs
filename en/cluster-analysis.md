---
title: Cluster analysis
description: K-Means, K-Medoids, hierarchical clustering, biclustering, silhouette analysis, gap statistic, dendrograms, and heatmaps in DataSuite 2.
---

# Cluster analysis

The **Cluster analysis** module groups observations, variables, or both into clusters based on similarity. It supports three modes — case clustering, variable clustering, and bi-clustering — with multiple algorithms per mode. A three-step workflow walks you through choosing a method, finding the optimal number of clusters, and running the full analysis with validity metrics and visualizations.

> **What is cluster analysis?** Imagine you have survey responses from 500 people with 20 measured variables. Cluster analysis finds groups of people who answered similarly — without you telling it what the groups should be. Unlike classification (where you already know the categories), clustering discovers categories from the data. It's used in market segmentation ("what customer types do we have?"), biology ("which species are similar?"), and psychology ("are there distinct response profiles?").

1. [Select your variables](./getting-started.md#choosing-variables) (at least 2 numeric)
2. Choose a [clustering mode and algorithm](#step-1-method--settings)
3. Set the [cluster range](#step-2-determine-optimal-k) and click **Analyze & determine k** to find the best number of clusters
4. Set k, toggle [validity metrics and output options](#step-3-run-full-analysis)
5. Click **Run cluster analysis** (or **Run biclustering analysis**)

## Requirements

At least 2 numeric variables must be selected. Non-numeric variables are automatically excluded (and listed in the output).

## Step 1: Method & settings

### Clustering mode

| Mode | What it groups | When to use |
|---|---|---|
| **Case clustering** | Rows (observations) | "What types of participants are in my data?" |
| **Variable clustering** | Columns (variables) | "Which of my variables behave similarly?" — an alternative to [factor analysis](./factor-analysis.md) for grouping variables. |
| **Bi-clustering** | Rows and columns simultaneously | "Are there subsets of observations that are similar on a subset of variables?" — useful when the cluster structure doesn't span all variables. |

### Algorithms for case and variable clustering

| Algorithm | Description | Best for |
|---|---|---|
| **K-Means** | Assigns observations to the nearest cluster center, then recomputes centers. Fast and effective for large datasets. | Well-separated, roughly spherical clusters of similar size |
| **K-Medoids (PAM)** | Like K-Means, but uses actual data points as centers (medoids) instead of computed means. | Data with outliers — medoids are more robust than means |
| **Hierarchical** | Builds a tree (dendrogram) by progressively merging the most similar observations or splitting the most different ones. | Exploring cluster structure at multiple levels; small to medium datasets |

**K-Means settings:**

- **Initialization** — Hartigan-Wong (default), Lloyd, Forgy, or MacQueen
- **Random starts** (default 25) — runs the algorithm multiple times with different starting points and keeps the best result. Higher values reduce the chance of a suboptimal solution.
- **Maximum iterations** (default 100)

**K-Medoids** has no algorithm-specific settings beyond the distance metric.

**Hierarchical settings:**

- **Distance metric** — Euclidean (default), Manhattan, Maximum (Chebyshev), Canberra, or Minkowski
- **Linkage method** — how to measure distance between clusters:

| Linkage | How it works | Tends to produce |
|---|---|---|
| **Ward's D2** (default) | Minimizes the increase in total within-cluster variance at each merge | Compact, roughly equal-sized clusters |
| **Complete** | Distance = maximum distance between any two points in the clusters | Compact clusters, sensitive to outliers |
| **Average (UPGMA)** | Distance = average of all pairwise distances | Moderate-sized, balanced clusters |
| **Single** | Distance = minimum distance between any two points | Long, chain-like clusters — good for detecting elongated shapes, but prone to "chaining" |
| **Centroid** | Distance between cluster centroids | Can produce inversions in the dendrogram |
| **Median** | Like centroid but weights clusters equally regardless of size | Similar to centroid |
| **McQuitty (WPGMA)** | Like average but weights clusters equally | Similar to average |

A warning appears if Ward's linkage is combined with a non-Euclidean distance, since Ward's assumes Euclidean distances.

The distance metric selector is available for PAM and Hierarchical (K-Means uses its own internal distance).

**Assumptions:**
- **K-Means** assumes roughly spherical clusters of similar size and works best with continuous variables. It minimizes within-cluster variance (Euclidean distance), so it struggles with elongated, ring-shaped, or very unequal clusters.
- **PAM** makes the same distance-based assumptions but is more robust to outliers since it uses medoids.
- **Hierarchical** makes no distributional assumptions, but the choice of linkage method strongly shapes the result. Ward's assumes Euclidean distances; single linkage can produce chain-like artifacts.
- **All methods** assume the selected variables are relevant to the grouping structure. Irrelevant variables add noise and degrade cluster quality.

> **Which algorithm?** K-Means is the default for good reason — it's fast, scales well, and works for most situations. Use PAM when you have outliers or want interpretable cluster centers (actual data points). Use Hierarchical when you want to visually explore different numbers of clusters with the dendrogram, or when cluster shapes might not be spherical.

### Biclustering algorithms

Biclustering finds subgroups of observations that are similar on a *subset* of variables — unlike standard clustering, which uses all variables for every cluster.

| Algorithm | Description | Determines k automatically? |
|---|---|---|
| **BiMax** | Finds biclusters of maximal size in binarized data | No |
| **Plaid** | Additive model — each bicluster is a "layer" added to the background | Yes |
| **FABIA** | Factor model approach — finds sparse, overlapping biclusters | No |
| **Cheng & Church** | Finds biclusters with low mean squared residue (high coherence) | No |
| **Spectral** | Uses singular value decomposition to find checkerboard patterns | Yes |

**BiMax settings:**

- **Minimum rows** and **minimum columns** (default 2 each)
- **Binarization threshold** (default 0) — values above the threshold become 1, below become 0

**Plaid settings:**

- **Background model** — Row + Column effects (default) or Constant only
- **Maximum layers** (default 20)
- **Row/Column release** (default 0.7 each, range 0–1) — controls how aggressively rows/columns are pruned from layers

**FABIA settings:**

- **Sparseness prior for loadings** and **factors** (defaults 0.6 and 0.5) — higher values produce sparser (more selective) biclusters
- **Iterations** (default 500)

**Cheng & Church settings:**

- **Residue threshold (delta)** (default 1.5) — maximum allowed mean squared residue. Lower values demand more coherent biclusters.
- **Alpha** (default 1.5) — scaling factor for node deletion

**Spectral settings:**

- **Singular vectors** (default 3) — number of SVD dimensions to use
- **Normalization** — Log (default), IRRC, or Bistochastization

> **Which biclustering algorithm?** BiMax is a good starting point — simple and fast. Plaid works well when biclusters may overlap and you want the algorithm to decide how many there are. FABIA handles noisy data well due to its probabilistic model. Cheng & Church gives you direct control over coherence via the residue threshold. Spectral is useful for checkerboard-pattern data.

### Automatic standardization

Variables are automatically standardized (z-scores) if they have different ranges. This prevents variables with larger scales from dominating the distance calculations. When applied, it's noted in the output.

> **Why standardize?** If one variable ranges 0–100 (exam scores) and another ranges 1–5 (Likert scale), the first would dominate the clustering simply because its numbers are bigger. Standardization puts all variables on the same scale so each contributes equally.

## Step 2: Determine optimal k

Before running the full analysis, this step compares solutions across a range of cluster counts to help you choose k.

### Standard clustering (case / variable modes)

Set the **cluster range to test** (default 2–10) and click **Analyze & determine k**.

Four diagnostic plots can be toggled:

- **Elbow plot (within-cluster SS)** — total within-cluster sum of squares for each k. Look for the "elbow" where the curve bends — adding more clusters past that point gives diminishing returns.
- **Silhouette plot** — average silhouette score for each k. The best k (highest score) is highlighted. Reference lines at 0.25, 0.50, and 0.70 help judge quality.
- **Gap statistic plot** — compares within-cluster dispersion to what you'd expect from random (uniformly distributed) data. Error bars show uncertainty from Monte Carlo simulation (50 bootstrap samples).
- **Dendrogram** (Hierarchical only) — the full tree with a draggable cut line. Drag it up or down to explore different k values — branches are colored by cluster assignment in real time.

> **What is a silhouette score?** For each observation, the silhouette measures how similar it is to its own cluster compared to the nearest other cluster. Values range from −1 to +1: near +1 means the observation is well-placed, near 0 means it sits on the boundary between clusters, and negative values mean it's probably in the wrong cluster. The average across all observations summarizes overall cluster quality.

> **What is the gap statistic?** It compares the compactness of your clusters to what you'd get by clustering random noise. If your data has real structure, the gap (difference) will be large. The optimal k is the smallest value where the gap is within one standard error of the maximum — balancing cluster quality against parsimony.

#### Comparison table

A table with one row per k:

| Metric | Good value | What it measures |
|---|---|---|
| **Within SS** | Lower | Total within-cluster sum of squares — how tight the clusters are internally |
| **Silhouette** | Higher (≥ 0.50 reasonable, ≥ 0.70 strong) | How well-separated the clusters are |
| **Calinski-Harabasz** | Higher | Ratio of between-cluster to within-cluster variance — higher means tighter clusters that are farther apart |
| **Davies-Bouldin** | Lower | Average similarity between each cluster and its most similar neighbor — lower means clusters are more distinct |
| **Dunn** | Higher | Ratio of minimum between-cluster distance to maximum within-cluster diameter — sensitive to outliers |
| **Gap** | Higher | How much better your clustering is compared to random data |
| **Hartigan** | > 10 suggests adding another cluster | Whether the improvement from k to k+1 is worthwhile |

Best values are highlighted in green. Hartigan values above 10 are highlighted in yellow.

Below the table, suggestions show:

- **Suggested k (silhouette)** — the k with the highest average silhouette
- **Suggested k (gap statistic)** — using the firstSEmax criterion

> **Metrics disagree — which one do I trust?** They often do. Silhouette is the most intuitive and widely used — start there. Gap statistic tends to favor parsimony (fewer clusters). Calinski-Harabasz and Davies-Bouldin assume roughly spherical clusters, so they may mislead with elongated or irregular shapes. Use the comparison table as a guide, not a verdict — try the top 2–3 candidates and see which produces the most interpretable clusters.

### Biclustering (bi-clustering mode)

For algorithms that need a user-specified k (BiMax, FABIA, Cheng & Church), set the **bicluster range to test** (default 2–10) and click **Compare solutions**.

Diagnostic plots:

- **Variance explained** — percentage of total variance captured at each k
- **Coherence** — average mean squared residue (lower = more coherent biclusters)
- **Coverage** — three lines showing row, column, and cell coverage percentages

Three optional slower diagnostics (off by default):

- **Stability analysis** — bootstrap resampling to measure how consistently the same biclusters appear across samples (Jaccard similarity)
- **F-statistic diagnostics** — tests whether row and column effects within each bicluster are statistically significant. An 80% reference line helps gauge quality.
- **Consensus scoring** — runs the algorithm multiple times with different seeds and measures agreement between runs

#### Bicluster comparison table

| Metric | What it measures |
|---|---|
| **Found** | Actual number of biclusters discovered (may be less than requested) |
| **Variance explained (%)** | How much of the total variance the biclusters capture |
| **Incremental change** | Additional variance explained compared to the previous k |
| **Average MSR** | Mean squared residue — how coherent the biclusters are (lower = more coherent) |
| **Average overlap** | Jaccard similarity between biclusters — high overlap (> 0.3, shown in yellow) means biclusters share many members |
| **Cell coverage (%)** | Percentage of data cells included in at least one bicluster |

If stability, F-statistic, or consensus diagnostics were enabled, additional columns appear.

A **suggested k** is provided based on elbow detection in the variance explained curve.

For auto-k algorithms (Plaid, Spectral), Step 2 shows an informational note — the algorithm determines k on its own.

## Step 3: Run full analysis

Enter the number of clusters and click **Run cluster analysis** (or **Run biclustering analysis**).

### Validity metrics (case and variable clustering)

| Metric | Default | Good value | What it measures |
|---|---|---|---|
| **Silhouette analysis** | On | ≥ 0.50 reasonable, ≥ 0.70 strong | Overall cluster separation quality |
| **Calinski-Harabasz** | On | Higher is better | Between-cluster vs. within-cluster variance ratio |
| **Davies-Bouldin** | On | Lower is better | How similar each cluster is to its closest neighbor (lower = more distinct clusters) |
| **Dunn index** | Off | Higher is better | Ratio of smallest between-cluster distance to largest within-cluster diameter |

When [interpretation](./settings.md#significance-formatting) is enabled, silhouette values include labels:

| Value | Interpretation |
|---|---|
| ≥ 0.70 | Strong structure |
| ≥ 0.50 | Reasonable structure |
| ≥ 0.25 | Weak structure |
| < 0.25 | No substantial structure |

### Output options (case and variable clustering)

| Option | Default | What it shows |
|---|---|---|
| **Cluster profiles** | On | Mean of each variable within each cluster, plus the overall mean. Helps characterize what makes each cluster distinct. Not available in variable mode. |
| **Cluster sizes** | On | Number of observations and percentage in each cluster |
| **Within-cluster SS** | On | Sum of squares within each cluster and percentage of total — shows which clusters are tight vs. loose |
| **Between-cluster SS** | Off | Variance explained by the clustering — the proportion of total variance that falls *between* clusters rather than within them |
| **Cluster centers (medoids)** | PAM only | The actual data points used as cluster representatives, with their row indices |
| **Silhouette plot** | Off | Bar chart showing every observation's silhouette width, grouped by cluster |
| **Variable contribution** | Off | F-statistic and eta-squared for each variable — which variables best distinguish the clusters. Not available in variable mode. |

**Hierarchical-specific options:**

- **Dendrogram** (on by default) — tree diagram with branches colored by cluster
- **Optimize leaf ordering** — reorders leaves for cleaner visualization

> **Reading cluster profiles:** the profile table is often the most useful output. Look at which variables have high or low means in each cluster compared to the overall mean. If Cluster 1 has high anxiety, high stress, and low well-being while Cluster 2 shows the opposite pattern, you've found psychologically distinct groups. Name clusters by their defining characteristics, but remember — the labels are your interpretation, not the data's (same caveat as [factor naming](./factor-analysis.md#common-pitfalls)).

> **Variable contribution (eta-squared):** eta-squared tells you what proportion of a variable's variance is explained by cluster membership. A high value (e.g. 0.60) means the clusters differ sharply on that variable — it's a strong differentiator. A low value (e.g. 0.05) means the clusters are similar on that variable — it's not contributing much to the cluster structure.

### Variable clustering specifics

In variable clustering mode, the data matrix is transposed — variables become the "observations" being clustered. Distance between variables is based on their correlation across observations: highly correlated variables end up in the same cluster.

The output includes a **Variable cluster assignments** table showing which variables belong to each cluster. Cluster profiles and variable contribution options are hidden (not applicable). The silhouette plot and dendrogram use variable names as labels.

> **Variable clustering vs. factor analysis:** both group variables, but they work differently. [Factor analysis](./factor-analysis.md) models latent constructs — it assumes your variables are caused by underlying factors and estimates a formal model with loadings and communalities. Variable clustering is purely distance-based — it groups variables that correlate highly, without assuming any generative model. Use factor analysis when you want to model latent structure and compute factor scores. Use variable clustering when you just need a quick grouping — for example, to identify redundant variables before running another analysis, or to check whether your variables naturally fall into the subscales you expect.

If the dendrogram is enabled, variables that merge at low heights are the most similar (highest correlation). Look for distinct branches — each branch is a potential variable cluster. A variable that joins late (high merge height) may not belong clearly to any group.

### Output options (biclustering)

| Option | Default | What it shows |
|---|---|---|
| **Bicluster summary** | On | Each bicluster's row count, column count, total size, mean value, and mean squared residue |
| **Membership tables** | On | Which variables belong to which biclusters (checkmark matrix), plus a count column |
| **Bicluster profiles** | On | Mean of each variable within each bicluster (only variables that belong to that bicluster) |
| **Coherence per bicluster** | On | MSR, row variance, and column variance for each bicluster |
| **Overlap analysis** | Off | Jaccard similarity matrices showing how much biclusters share rows and columns |
| **Heatmap** | On | Color-coded matrix with bicluster membership shown as colored borders |

The heatmap supports optional row and column dendrograms (both on by default), uses a diverging color scale (blue–white–red for standardized data), and shows tooltips with row, column, value, and bicluster membership on hover.

#### Biclustering overview

Every run includes a summary showing variance explained (%), row coverage, column coverage, and cell coverage.

> **Biclustering coverage:** coverage tells you how much of your data is "explained" by the biclusters. Low cell coverage means the biclusters capture only a small part of the data — either the structure is sparse (which is fine for some applications) or k is too low. Row and column coverage tell you whether some observations or variables are left out entirely.

### Warnings

The analysis generates warnings for potentially problematic results:

- **Highly unbalanced clusters** — smallest cluster < 5% of cases
- **Very small clusters** — fewer than 10 observations
- **Extreme size imbalance** — largest cluster > 10× the smallest
- **Low silhouette** — below 0.25 ("no substantial structure") or 0.25–0.50 ("weak structure")
- **Many negative silhouettes** — more than 10% of observations have negative silhouette values (likely in the wrong cluster)
- **Low variance explained** — below 50%
- **Single-variable clusters** (variable mode) — a cluster containing only one variable may not be meaningful

### Inserting results into the dataset

**Case clustering:** click **Insert cluster assignments into dataset** to create a new categorical variable (e.g. `Cluster_k3`) with each observation's cluster number. Cases with missing data receive NA.

**Biclustering:** click **Insert bicluster memberships into dataset** to create one binary variable per bicluster (e.g. `BC1_k3`, `BC2_k3`). Each variable is 1 if the observation belongs to that bicluster, 0 otherwise.

Inserted variables can be used in further analyses — as grouping variables for [comparisons](./comparison-analysis.md), as predictors in [regression](./regression-analysis.md), or as group variables for [measurement invariance](./confirmatory-factor-analysis.md#measurement-invariance-testing) testing.

## Missing data

Missing values are handled by listwise deletion — only complete cases are used. When the number of complete cases differs from the total, the output reports both counts. A fixed random seed (42) ensures reproducible results.

> **Missing data and clustering:** unlike some analysis modules, cluster analysis does not support pairwise deletion. Every observation needs complete data on all selected variables. If missingness is widespread, consider reducing the number of variables or applying [imputation](./settings.md#missing-data) before running the analysis.

## Reporting checklist

Key things to include when writing up cluster analysis results:

**Method:**
- Clustering mode (case, variable, or bi-clustering)
- Algorithm used (K-Means, PAM, Hierarchical, or which biclustering algorithm)
- Distance metric and linkage method (for Hierarchical/PAM)
- Whether variables were standardized (and why, e.g. different measurement scales)
- How the number of clusters was determined — which metrics were consulted (silhouette, gap statistic, elbow, dendrogram) and how conflicts were resolved
- Sample size and number of variables
- How missing data were handled

**Results:**
- Number of clusters and cluster sizes
- Validity metrics — at minimum average silhouette width; consider also Calinski-Harabasz and Davies-Bouldin
- Cluster profiles (means per variable per cluster) — the core of interpretation
- Variance explained (between-cluster SS as percentage of total)
- Any warnings (imbalanced clusters, low silhouette, negative silhouettes)

**For biclustering:** report the algorithm, number of biclusters found, variance explained, cell coverage, and coherence (MSR). Include the membership table or heatmap.



## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) — you can inspect, copy, or re-run the exact commands. Cluster analysis uses base R functions (`kmeans`, `hclust`) and the `cluster` package (for PAM and silhouette); biclustering uses the `biclust` and `fabia` packages. Citations appear automatically at the top of the output section. A fixed random seed (42) ensures reproducible results across runs.

## Common pitfalls

Cluster analysis is exploratory by nature — it will always produce clusters, whether or not they're meaningful. Keep these points in mind:

**Clusters always exist — even in random data.** K-Means will partition random noise into k groups and report cluster centers with a straight face. A low silhouette score (< 0.25) or low variance explained (< 50%) are signs that the "clusters" may not reflect real structure. Always check validity metrics before interpreting.

**Results depend on the method.** K-Means, PAM, and Hierarchical can produce different clusterings from the same data. Different linkage methods within Hierarchical can produce different clusterings. Different distance metrics can produce different clusterings. If your clusters only appear with one specific combination of settings, they may not be robust. Try multiple approaches and look for consistent patterns.

**Too many variables can hurt.** With many variables, distances become dominated by noise — every observation looks equally far from every other one (the "curse of dimensionality"). If you have 50 variables, consider reducing them first with [factor analysis](./factor-analysis.md) or [PCA](./factor-analysis.md) and clustering on the factor scores instead.

**Don't test cluster differences on clustering variables.** If you cluster people using anxiety and depression scores, then run a t-test asking "do the clusters differ on anxiety?" — of course they do, you *made* them differ. Testing whether clusters differ on the variables used to create them is circular. Instead, validate clusters against *external* variables not used in the clustering (e.g. cluster on personality items, then check whether clusters differ on job performance).

**Clusters might be arbitrary cuts of a continuum.** Not all data has natural groups. Depression scores might form a smooth gradient from low to high rather than distinct "depressed" and "not depressed" clusters. Forcing this into two clusters creates an artificial boundary. A well-known example of this debate is personality typology: researchers have clustered Big Five scores into types like "resilient," "overcontrolled," and "undercontrolled" — but the Big Five dimensions themselves are continuously and normally distributed, so the "types" may simply be regions of a smooth space rather than natural categories. Check whether the silhouette plot shows clear separation or a muddy overlap.

**Cluster labels are interpretations.** Same caveat as [factor naming](./factor-analysis.md#common-pitfalls) — calling a cluster "Resilient High-Achievers" because it has above-average scores on several positive traits is your interpretation. Report the actual profile means so readers can judge for themselves.

**Sample-specific solutions.** Cluster structures are sensitive to sample composition. A 3-cluster solution in your sample might not replicate in a different population. If possible, split your data and check whether the same clusters emerge in both halves — or use the stability diagnostics in [biclustering comparison](#biclustering-bi-clustering-mode) as a model.