---
title: Cluster analysis
description: K-means, K-medoids, hierarchical clustering, biclustering, silhouette analysis, gap statistic, bootstrap stability, dendrograms, and heatmaps in DataSuite 2.
---

# Cluster analysis

The **Cluster analysis** module groups observations, variables, or both into clusters based on similarity. It supports three modes – case clustering, variable clustering, and biclustering – with multiple algorithms per mode. A three-step workflow walks you through choosing a method, finding the optimal number of clusters, and running the full analysis with validity metrics and visualizations.

> **What is cluster analysis?** Imagine you have survey responses from 500 people with 20 measured variables. Cluster analysis finds groups of people who answered similarly – without you telling it what the groups should be. Unlike classification (where you already know the categories), clustering discovers categories from the data. It's used in market segmentation ("what customer types do we have?"), biology ("which species are similar?"), and psychology ("are there distinct response profiles?").

1. [Select your variables](./getting-started.md#choosing-variables) (at least 2 numeric)
2. Choose a [clustering mode and algorithm](#step-1-method--settings)
3. Set the [cluster range](#step-2-determine-optimal-k) and click **Analyze & determine k** to find the best number of clusters
4. Set k, toggle [validity metrics and output options](#step-3-run-full-analysis)
5. Click **Run cluster analysis** (or **Run biclustering analysis**)

## Requirements

At least 2 numeric variables must be selected. Non-numeric variables are automatically excluded (and listed in the output), as are variables that turn out to be constant across the complete cases – at least two of the selected variables must actually vary.

## Step 1: Method & settings

### Clustering mode

| Mode | What it groups | When to use |
|---|---|---|
| **Case clustering** | Rows (observations) | "What types of participants are in my data?" |
| **Variable clustering** | Columns (variables) | "Which of my variables behave similarly?" – an alternative to [factor analysis](./factor-analysis.md) for grouping variables. |
| **Biclustering** | Rows and columns simultaneously | "Are there subsets of observations that are similar on a subset of variables?" – useful when the cluster structure doesn't span all variables. |

### Standardization

**Standardize variables (z-scores)** is on by default: every variable is centered and scaled before distances are computed, so none dominates because its numbers happen to be bigger. Turn it off only when your variables are already on a common, meaningful scale and their relative spread is part of what you want to cluster on. Whether standardization was applied is reported in every output card.

> **Why standardize?** If one variable ranges 0–100 (exam scores) and another ranges 1–5 (Likert scale), the first would dominate the clustering simply because its numbers are bigger. Standardization puts all variables on the same scale so each contributes equally.

In variable clustering mode the variables are standardized *before* the matrix is transposed, so the dissimilarity between two variables is computed from their standardized profiles – which is what makes Euclidean distance on standardized data equivalent to a correlation-based dissimilarity.

### Algorithms for case and variable clustering

| Algorithm | Description | Best for |
|---|---|---|
| **K-means** | Assigns observations to the nearest cluster center, then recomputes centers. Fast and effective for large datasets. | Well-separated, roughly spherical clusters of similar size |
| **K-medoids (PAM)** | Like K-means, but uses actual data points as centers (medoids) instead of computed means. | Data with outliers – medoids are more robust than means |
| **Hierarchical** | Builds a tree (dendrogram) by progressively merging the most similar observations or splitting the most different ones. | Exploring cluster structure at multiple levels; small to medium datasets |

**K-means settings:**

- **Initialization method** – Hartigan-Wong (default), Lloyd, Forgy, or MacQueen
- **Number of random starts** (default 25) – runs the algorithm multiple times with different starting points and keeps the best result. Higher values reduce the chance of a suboptimal solution.
- **Maximum iterations** (default 100). If the algorithm hits the limit without converging, the output says so and suggests raising the limit or the number of starts.

**K-medoids** has no algorithm-specific settings beyond the distance metric.

**Hierarchical settings:** the distance metric plus a **Linkage method** – how to measure distance between clusters:

| Linkage | How it works | Tends to produce |
|---|---|---|
| **Ward's (D2)** (default) | Minimizes the increase in total within-cluster variance at each merge | Compact, roughly equal-sized clusters |
| **Complete** | Distance = maximum distance between any two points in the clusters | Compact clusters, sensitive to outliers |
| **Average (UPGMA)** | Distance = average of all pairwise distances | Moderate-sized, balanced clusters |
| **Single** | Distance = minimum distance between any two points | Long, chain-like clusters – good for detecting elongated shapes, but prone to "chaining" |
| **Centroid** | Distance between cluster centroids | Can produce inversions in the dendrogram |
| **Median** | Like centroid but weights clusters equally regardless of size | Similar to centroid |
| **McQuitty (WPGMA)** | Like average but weights clusters equally | Similar to average |

Two warnings guard the linkage choice. Ward's assumes Euclidean distances, so combining it with another metric is flagged. Centroid and median linkage are defined for *squared* Euclidean distances; given a plain distance matrix they can merge at decreasing heights, and the dendrogram then shows inversions – a note appears above the plot when that happens.

### Distance metric

| Metric | Formula in words | When to use |
|---|---|---|
| **Euclidean** (default) | Straight-line distance | The default choice for continuous data |
| **Manhattan** | Sum of absolute differences | Less sensitive to a single large difference than Euclidean |
| **Maximum (Chebyshev)** | The largest single-variable difference | When one big discrepancy should decide |
| **Canberra** | Weighted sum of relative differences | Counts and non-negative data, where small values matter proportionally |
| **Minkowski** | Generalization of the two above | With **Minkowski exponent (p)** (default 2): p = 1 is Manhattan, p = 2 is Euclidean |
| **1 − r (correlation)** | One minus the correlation between two variables | Variable mode – groups variables that rise and fall together |
| **1 − \|r\| (absolute correlation)** | One minus the absolute correlation | Variable mode – groups variables that measure the same thing regardless of polarity |

The two correlation dissimilarities appear only in **Variable clustering** mode, where they are the established choice. `1 − r` keeps oppositely-signed variables apart; `1 − |r|` groups them together, which is usually what you want for reverse-keyed questionnaire items.

K-means minimizes Euclidean distance internally and cannot honour another metric, so in case mode the metric selector is shown for **K-medoids (PAM)** and **Hierarchical** only. In variable mode it stays visible under K-means as well, with the entries K-means cannot use disabled – on standardized variables, Euclidean K-means already reproduces the `1 − r` clustering, and the hint under the control says so.

**Assumptions:**
- **K-means** assumes roughly spherical clusters of similar size and works best with continuous variables. It minimizes within-cluster variance (Euclidean distance), so it struggles with elongated, ring-shaped, or very unequal clusters.
- **PAM** makes the same distance-based assumptions but is more robust to outliers since it uses medoids.
- **Hierarchical** makes no distributional assumptions, but the choice of linkage method strongly shapes the result. Ward's assumes Euclidean distances; single linkage can produce chain-like artifacts.
- **All methods** assume the selected variables are relevant to the grouping structure. Irrelevant variables add noise and degrade cluster quality.

> **Which algorithm?** K-means is the default for good reason – it's fast, scales well, and works for most situations. Use PAM when you have outliers or want interpretable cluster centers (actual data points). Use Hierarchical when you want to visually explore different numbers of clusters with the dendrogram, or when cluster shapes might not be spherical.

### Biclustering algorithms

Biclustering finds subgroups of observations that are similar on a *subset* of variables – unlike standard clustering, which uses all variables for every cluster.

| Algorithm | Description | Determines k automatically? |
|---|---|---|
| **Plaid** (default) | Additive model – each bicluster is a "layer" added to the background | Yes |
| **BiMax** | Finds biclusters of maximal size in binarized data | No |
| **FABIA** | Factor model approach – finds sparse, overlapping biclusters | No |
| **Cheng & Church** | Finds biclusters with low mean squared residue (high coherence) | No |
| **Spectral** | Uses singular value decomposition to find checkerboard patterns | Yes |

**Plaid settings:**

- **Background model** – Row + column effects (default) or Constant only
- **Maximum layers (biclusters)** (default 20) – upper limit for the automatic detection
- **Row release** and **Column release** (default 0.7 each, range 0–1) – control how aggressively rows and columns are pruned from layers

**BiMax settings:**

- **Minimum rows** and **Minimum columns** (default 2 each)
- **Binarization quantile** (default 0.5) – each variable is cut at this quantile *of its own values*: above becomes 1, below becomes 0. It is a quantile, not a raw value, so the same setting works whatever scale your variables are on.

**FABIA settings:**

- **Sparseness prior (loadings)** and **Sparseness prior (factors)** (defaults 0.6 and 0.5) – higher values produce sparser (more selective) biclusters
- **Number of iterations** (default 500)

**Cheng & Church settings:**

- **Residue threshold (δ)** (default 0.2, range 0.01–1) – the maximum mean squared residue a bicluster may have, expressed as a *fraction of the whole matrix's residue*. Lower values demand more coherent biclusters.
- **Alpha** (default 1.5) – scaling factor for node deletion

**Spectral settings:**

- **Number of singular vectors** (default 3) – how many SVD dimensions to use; it cannot exceed the smaller of the case and variable counts
- **Normalization method** – Log (default), IRRC, or Bistochastization
- **Maximum within-bicluster variance** (default 1) – a candidate is kept only if its variance stays below this. Since Spectral decides k for itself, this control is what really governs how many biclusters come back.
- **Minimum rows** and **Minimum columns** (default 2 each)

> **Which biclustering algorithm?** Plaid is the default because it models continuous data directly and picks the number of biclusters itself – there is no threshold to guess. BiMax and Cheng & Church need a threshold whose usable value depends on your data, so try them once you know what the structure looks like. FABIA handles noisy data well due to its probabilistic model. Spectral is useful for checkerboard-pattern data.

## Step 2: Determine optimal k

Before running the full analysis, this step compares solutions across a range of cluster counts to help you choose k.

### Standard clustering (case / variable modes)

Set the **Cluster range to test** (default 2–10) and click **Analyze & determine k**. In variable mode the maximum must be *fewer* than the number of variables; in case mode, fewer than the number of complete cases.

Four diagnostic plots can be toggled:

- **Show elbow plot (within-cluster SS)** – total within-cluster sum of squares for each k. Look for the "elbow" where the curve bends – adding more clusters past that point gives diminishing returns.
- **Show silhouette plot** – average silhouette score for each k. The best k (highest score) is highlighted. Reference lines at 0.25, 0.50, and 0.70 help judge quality.
- **Compute gap statistic (slower)** – compares within-cluster dispersion to what you'd expect from random (uniformly distributed) data. Error bars show uncertainty from the Monte Carlo simulation (100 reference samples). The k picked by the 1-standard-error rule is marked, which is not always the plain maximum.
- **Show dendrogram** (Hierarchical only) – the full tree with a draggable cut line. Drag it up or down to explore different k values – branches are colored by cluster assignment in real time.

> **What is a silhouette score?** For each observation, the silhouette measures how similar it is to its own cluster compared to the nearest other cluster. Values range from −1 to +1: near +1 means the observation is well-placed, near 0 means it sits on the boundary between clusters, and negative values mean it's probably in the wrong cluster. The average across all observations summarizes overall cluster quality.

> **What is the gap statistic?** It compares the compactness of your clusters to what you'd get by clustering random noise. If your data has real structure, the gap (difference) will be large. The optimal k is the smallest value where the gap is within one standard error of the maximum – balancing cluster quality against parsimony.

#### Cluster tendency

Before comparing solutions, the card reports whether the data looks clustered at all:

| Test | What it measures | Reading |
|---|---|---|
| **Hopkins statistic** | Whether points are packed more tightly than uniform random points over the same range | > 0.75 clustered structure; ≈ 0.5 no cluster tendency (what random data gives); < 0.25 regularly spaced |
| **Duda-Hart Je(2)/Je(1)** | Whether splitting the data in two beats leaving it whole, with a p-value | Significant = two clusters beat one; otherwise one cluster is not rejected |

> **Why check tendency first?** Every algorithm returns clusters, including on data that has none. Hopkins and Duda-Hart are the cheap sanity check that comes before the question "how many?" – if they say there is no structure, the rest of the table is describing arbitrary cuts.

#### Comparison table

A table with one row per k. When the range starts at 1, the k = 1 row describes the unpartitioned data – the separation indices need at least two clusters and read N/A there.

| Metric | Good value | What it measures |
|---|---|---|
| **Within SS** | Lower | Total within-cluster sum of squares – how tight the clusters are internally |
| **Variance explained (%)** | Higher | Share of total variance falling between clusters rather than within them |
| **Smallest cluster** / **Largest cluster** | – | Member counts of the extreme clusters, so you can spot a solution that only splits off a handful of cases |
| **Silhouette** | Higher (≥ 0.50 reasonable, ≥ 0.70 strong) | How well-separated the clusters are |
| **Calinski-Harabasz** | Higher | Ratio of between-cluster to within-cluster variance – higher means tighter clusters that are farther apart |
| **Davies-Bouldin** | Lower | Average similarity between each cluster and its most similar neighbor – lower means clusters are more distinct |
| **Dunn** | Higher | Ratio of minimum between-cluster distance to maximum within-cluster diameter – sensitive to outliers |
| **Gap** | Higher | How much better your clustering is compared to random data |
| **Hartigan** | > 10 suggests adding another cluster | Whether the improvement from k to k+1 is worthwhile |

Green marks the best value in a column, and Hartigan values above 10 are highlighted in yellow. Two columns are deliberately left unmarked: **Within SS** and **Variance explained (%)** both improve monotonically with k, so a "best" mark on either would simply point at the largest k tested. The **Gap** mark sits on the k the 1-standard-error rule picks, matching the suggestion below the table rather than the plain maximum.

Within SS, variance explained, Calinski-Harabasz and Hartigan are computed from centroids under Euclidean geometry whatever metric you selected – when you pick another metric, a note under the table says so.

Each row's **k** cell doubles as a control: click it to carry that cluster count into Step 3's **Number of clusters (k)** field instead of retyping it, with a toast confirming the new value.

Below the table, suggestions show:

- **Suggested k (silhouette)** – the k with the highest average silhouette
- **Suggested k (gap statistic)** – using the firstSEmax criterion. When the gap statistic favours no cluster structure at all, the card says so instead of naming a k.

A suggestion is the best of the range, which says nothing about whether the range holds structure at all – so if no k reaches a silhouette of 0.25, a caveat under the suggestions spells that out with the best score found.

> **Metrics disagree – which one do I trust?** They often do. Silhouette is the most intuitive and widely used – start there. Gap statistic tends to favor parsimony (fewer clusters). Calinski-Harabasz and Davies-Bouldin assume roughly spherical clusters, so they may mislead with elongated or irregular shapes. Use the comparison table as a guide, not a verdict – try the top 2–3 candidates and see which produces the most interpretable clusters.

#### Reading the dendrogram

The dendrogram in Step 2 is interactive. Drag the cut line to see how the tree splits at different k, then **click the cut line** to send that k straight to Step 3 – or use the **Move the cut to the suggested k** button to jump to the silhouette suggestion. Cluster numbering follows the order the clusters first appear along the tree, so the colors and labels on the plot match the numbers in every table.

### Biclustering (biclustering mode)

For algorithms that need a user-specified k (BiMax, FABIA, Cheng & Church), set the **Bicluster range to test** (default 2–10) and click **Compare solutions**.

Diagnostic plots:

- **Show variance explained plot** – percentage of total variance captured at each k
- **Show coherence plot** – average mean squared residue (lower = more coherent biclusters)
- **Show coverage plot** – three lines showing row, column, and cell coverage percentages

Three optional slower diagnostics (off by default):

- **Stability analysis (bootstrap, slower)** – bootstrap resampling to measure how consistently the same biclusters appear across samples (Jaccard similarity)
- **F-statistic diagnostics (slower)** – tests whether row and column effects within each bicluster are statistically significant. A reference line at 80% helps gauge quality.
- **Consensus scoring (slower)** – runs the algorithm with different seeds and measures agreement between runs. It is offered only for the stochastic algorithms; a deterministic one agrees with itself perfectly, and the card says so instead of plotting a flat line.

Stability and consensus each refit the biclustering once per bootstrap replicate, for every k in the range, so their cost is the width of the range times the [**Bootstrap replications**](./settings.md#bootstrap-replications) setting. Narrow the range before switching them on.

#### Bicluster comparison table

| Metric | What it measures |
|---|---|
| **Found** | Actual number of biclusters discovered (may be less than requested) |
| **Var. Expl. (%)** | How much of the total variance the biclusters capture |
| **Δ var. (%)** | Additional variance explained compared to the previous k |
| **Avg MSR** | Mean squared residue – how coherent the biclusters are (lower = more coherent) |
| **Avg overlap** | Jaccard similarity between biclusters – high overlap (> 0.3, shown in yellow) means biclusters share many members |
| **Cell cov. (%)** | Percentage of data cells included in at least one bicluster |

If stability, F-statistic, or consensus diagnostics were enabled, additional columns appear: **Stability** (Jaccard), **Avg row F** / **Avg col F** with **Row sig. (%)** / **Col sig. (%)**, and **Consensus** (Jaccard). Green marks the best value in a column; as in the standard table, click a row to carry its k into Step 3.

A **suggested k** is provided below the table, together with the rule that produced it – the highest bootstrap stability when that diagnostic ran, otherwise elbow detection in the variance explained curve, falling back to the smallest k tested when the curve has no clear elbow.

For auto-k algorithms (Plaid, Spectral), Step 2 shows an informational note instead – the algorithm determines k on its own. For Spectral the note adds that **Maximum within-bicluster variance** from Step 1 is what decides how many biclusters come back.

## Step 3: Run full analysis

Enter the number of clusters and click **Run cluster analysis** (or **Run biclustering analysis**). Long runs can be interrupted with the Cancel button on the progress overlay.

Every output card opens with the settings the run used – mode, algorithm, distance metric, linkage or K-means parameters, whether standardization was applied, the variables included, any excluded as non-numerical or constant, and the number of complete cases out of the total.

All diagnostic plots produced here and in step 2 (elbow, silhouette, gap, dendrogram, heatmap, and the rest) are resizable and can be saved individually as SVG, PNG, or JPG using the export buttons beside each chart – see [resizing and exporting charts](./getting-started.md#resizing-and-exporting-charts).

### Validity metrics (case and variable clustering)

| Metric | Default | Good value | What it measures |
|---|---|---|---|
| **Silhouette analysis** | On | ≥ 0.50 reasonable, ≥ 0.70 strong | Overall cluster separation quality |
| **Calinski-Harabasz index** | On | Higher is better | Between-cluster vs. within-cluster variance ratio |
| **Davies-Bouldin index** | On | Lower is better | How similar each cluster is to its closest neighbor (lower = more distinct clusters) |
| **Dunn index** | Off | Higher is better | Ratio of smallest between-cluster distance to largest within-cluster diameter |
| **Cluster stability (bootstrap Jaccard, slower)** | Off | ≥ 0.75 recovered, ≥ 0.85 highly stable | Whether each cluster survives resampling |

When [interpretation](./settings.md#significance-formatting) is enabled, silhouette values include labels:

| Value | Interpretation |
|---|---|
| ≥ 0.70 | Strong structure |
| ≥ 0.50 | Reasonable structure |
| ≥ 0.25 | Weak structure |
| < 0.25 | No substantial structure |

#### Cluster stability

Switching on **Cluster stability (bootstrap Jaccard, slower)** reveals a **Bootstrap replicates** field (default 100). Each replicate resamples the observations, reclusters them, and matches every original cluster to its best counterpart by Jaccard similarity. The result is a table with one row per cluster:

- **Mean Jaccard** — the average best-match similarity across replicates
- **Recovered** — replicates where the cluster came back with a Jaccard of 0.75 or more
- **Dissolved** — replicates where it scored 0.5 or less
- **Replicates scored** — how many replicates drew at least one of the cluster's members and could therefore score it

With interpretation enabled, each mean is labelled: ≥ 0.85 highly stable, ≥ 0.75 stable, above 0.5 "measures a pattern, but is not stable", and 0.5 or below dissolved. If any cluster dissolves, a warning names how many.

> **Why stability matters more than fit.** Silhouette, Calinski-Harabasz and the rest all grade the partition on the sample you already have – they cannot tell a real group from a lucky cut. The bootstrap asks a different question: would this cluster show up again in another sample from the same population? A cluster with a high silhouette and a mean Jaccard of 0.4 is a sample artifact with good geometry (Hennig, 2007).

### Output options (case and variable clustering)

| Option | Default | What it shows |
|---|---|---|
| **Cluster profiles (means per variable)** | On | Mean of each variable within each cluster, plus the overall mean. Helps characterize what makes each cluster distinct. Not available in variable mode. |
| **Cluster sizes and distribution** | On | Number of observations and percentage in each cluster, plus each cluster's average silhouette when the silhouette plot is requested |
| **Within-cluster sum of squares** | On | Sum of squares within each cluster and percentage of total – shows which clusters are tight vs. loose |
| **Between-cluster sum of squares** | Off | Variance explained by the clustering – the proportion of total variance that falls *between* clusters rather than within them |
| **Cluster centers (medoids)** | PAM only | The actual data points used as cluster representatives, identified by case number |
| **Silhouette plot** | Off | Bar chart showing every observation's silhouette width, grouped by cluster |
| **Variable contribution to clustering** | Off | F-statistic, degrees of freedom and eta-squared for each variable – which variables best distinguish the clusters. Not available in variable mode. |

Both sum-of-squares blocks are Euclidean whatever distance metric you chose, and they are computed on the analysis matrix – on the standardized values when standardization is on, not on the original scale of the profile table above them. A note under the tables says which case applies.

**Hierarchical-specific options:**

- **Dendrogram** (on by default) – tree diagram with branches colored by cluster
- **Optimize leaf ordering** – reorders leaves for cleaner visualization

> **Reading cluster profiles:** the profile table is often the most useful output. Look at which variables have high or low means in each cluster compared to the overall mean. If Cluster 1 has high anxiety, high stress, and low well-being while Cluster 2 shows the opposite pattern, you've found psychologically distinct groups. Name clusters by their defining characteristics, but remember – the labels are your interpretation, not the data's (same caveat as [factor naming](./factor-analysis.md#common-pitfalls)).

> **Variable contribution (eta-squared):** eta-squared tells you what proportion of a variable's variance is explained by cluster membership. A high value (e.g. 0.60) means the clusters differ sharply on that variable – it's a strong differentiator. A low value (e.g. 0.05) means the clusters are similar on that variable – it's not contributing much to the cluster structure. The accompanying F statistic is descriptive only: the clusters were built from these same variables, so it is inflated by construction and is not a valid significance test.

### Variable clustering specifics

In variable clustering mode, the data matrix is standardized and then transposed – variables become the "observations" being clustered. Distance between variables is based on their profiles across observations, so with the default settings highly correlated variables end up in the same cluster; the [correlation dissimilarities](#distance-metric) make that relationship explicit and let you ignore polarity.

The output includes a **Variable cluster assignments** table showing which variables belong to each cluster. Cluster profiles and variable contribution options are hidden (not applicable). The dendrogram labels its leaves with variable names; on the silhouette plot, hovering a bar reveals the corresponding variable name.

> **Variable clustering vs. factor analysis:** both group variables, but they work differently. [Factor analysis](./factor-analysis.md) models latent constructs – it assumes your variables are caused by underlying factors and estimates a formal model with loadings and communalities. Variable clustering is purely distance-based – it groups variables that correlate highly, without assuming any generative model. Use factor analysis when you want to model latent structure and compute factor scores. Use variable clustering when you just need a quick grouping – for example, to identify redundant variables before running another analysis, or to check whether your variables naturally fall into the subscales you expect.

If the dendrogram is enabled, variables that merge at low heights are the most similar (highest correlation). Look for distinct branches – each branch is a potential variable cluster. A variable that joins late (high merge height) may not belong clearly to any group.

### Output options (biclustering)

| Option | Default | What it shows |
|---|---|---|
| **Bicluster summary table** | On | Each bicluster's row count, column count, total size, mean value, and mean squared residue |
| **Membership tables (rows and columns)** | On | A **Case membership** table (checkmark grid by case number) and a **Variable membership** table, each with a count column |
| **Bicluster profiles (means per variable)** | On | Mean of each variable within each bicluster (only variables that belong to that bicluster) |
| **Coherence per bicluster** | On | MSR, variance of row means, and variance of column means for each bicluster |
| **Overlap analysis** | Off | Jaccard similarity matrices showing how much biclusters share rows and columns |
| **Heatmap visualization** | On | Color-coded matrix with bicluster membership shown as colored borders |

The heatmap supports optional **Row dendrogram** and **Column dendrogram** (both on by default), uses a diverging color scale (blue–white–red for standardized data), and carries a legend for the value ramp and the bicluster colors. Hovering a cell shows its row, column, value, and *every* bicluster that owns it. Large matrices are sampled down to a readable number of rows – a note reports how many of the total are shown – and per-cell tooltips are dropped past a cell count the note also names.

#### Biclustering overview

Every run includes a summary showing variance explained (%), row coverage, column coverage, cell coverage, and the number of complete cases out of the total.

> **Biclustering coverage:** coverage tells you how much of your data is "explained" by the biclusters. Low cell coverage means the biclusters capture only a small part of the data – either the structure is sparse (which is fine for some applications) or k is too low. Row and column coverage tell you whether some observations or variables are left out entirely.

### Warnings

The analysis generates warnings for potentially problematic results.

**Case and variable clustering:**

- **K-means did not converge** – the iteration limit was reached; raise it or the number of random starts
- **Highly unbalanced clusters** – smallest cluster < 5% of cases
- **Very small clusters** – fewer than 10 observations
- **Extreme size imbalance** – largest cluster > 10× the smallest
- **Low silhouette** – below 0.25 ("no substantial structure") or 0.25–0.50 ("weak structure")
- **Many negative silhouettes** – more than 10% of observations have negative silhouette values (likely in the wrong cluster)
- **Dissolved clusters** – with stability enabled, how many clusters fell to a mean Jaccard of 0.5 or below
- **Single-variable clusters** (variable mode) – a cluster containing only one variable may not be meaningful

**Biclustering:**

- **Fewer biclusters than requested** – the algorithm returned less than k
- **Degenerate biclusters** – some have fewer than two rows or two columns, so their MSR is undefined
- **Coverage too low** – under 25% of cells belong to any bicluster
- **Coverage too high** – over 90% of cells are covered, so the biclusters describe the matrix as a whole rather than local structure

### Inserting results into the dataset

**Case clustering:** click **Insert cluster assignments into dataset** to create a new categorical variable (e.g. `Cluster_k3`) with each observation's cluster number. Cases with missing data receive NA.

**Biclustering:** click **Insert bicluster memberships into dataset** to create one binary variable per bicluster (e.g. `BC1_k3`, `BC2_k3`). Each variable is 1 if the observation belongs to that bicluster, 0 otherwise.

Inserted variables can be used in further analyses – as grouping variables for [comparisons](./comparison-analysis.md), as predictors in [regression](./regression-analysis.md), or as group variables for [measurement invariance](./confirmatory-factor-analysis.md#measurement-invariance-testing) testing.

## Missing data

Missing values are handled by listwise deletion – only complete cases are used. When the number of complete cases differs from the total, the output reports both counts. Reproducibility is controlled by the [**Reproducibility seed**](./settings.md#reproducibility-seed) setting (default 42); the bootstrap diagnostics use [**Bootstrap seed**](./settings.md#bootstrap-seed) instead.

> **Missing data and clustering:** unlike some analysis modules, cluster analysis does not support pairwise deletion. Every observation needs complete data on all selected variables. If missingness is widespread, consider reducing the number of variables or applying [imputation](./settings.md#missing-data) before running the analysis.

## Reporting checklist

Key things to include when writing up cluster analysis results:

**Method:**
- Clustering mode (case, variable, or biclustering)
- Algorithm used (K-means, PAM, Hierarchical, or which biclustering algorithm)
- Distance metric and linkage method (for Hierarchical/PAM)
- Whether variables were standardized (and why, e.g. different measurement scales)
- How the number of clusters was determined – which metrics were consulted (silhouette, gap statistic, elbow, dendrogram) and how conflicts were resolved
- Sample size and number of variables
- How missing data were handled

**Results:**
- Cluster tendency (Hopkins, Duda-Hart) if you report it as a precondition
- Number of clusters and cluster sizes
- Validity metrics – at minimum average silhouette width; consider also Calinski-Harabasz and Davies-Bouldin
- Bootstrap stability per cluster, with the number of replicates, if the diagnostic was run
- Cluster profiles (means per variable per cluster) – the core of interpretation
- Variance explained (between-cluster SS as percentage of total)
- Any warnings (imbalanced clusters, low silhouette, negative silhouettes, dissolved clusters)

**For biclustering:** report the algorithm, number of biclusters found, variance explained, cell coverage, and coherence (MSR). Include the membership table or heatmap.


## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. Cluster analysis uses base R functions (`kmeans`, `hclust`) and the `cluster` package (for PAM, silhouette, and the gap statistic); biclustering uses the `biclust` and `fabia` packages. Citations appear automatically at the top of the output section. Clustering and biclustering steps are seeded by [**Reproducibility seed**](./settings.md#reproducibility-seed) (default 42); the bootstrap diagnostics – cluster stability, bicluster stability, and consensus – are seeded independently by [**Bootstrap seed**](./settings.md#bootstrap-seed) so you can vary one without the other.

## Common pitfalls

Cluster analysis is exploratory by nature – it will always produce clusters, whether or not they're meaningful. Keep these points in mind:

**Clusters always exist – even in random data.** K-means will partition random noise into k groups and report cluster centers with a straight face. A low Hopkins statistic, a low silhouette score (< 0.25), or clusters that dissolve under the bootstrap are signs that the "clusters" may not reflect real structure. Always check the tendency and validity output before interpreting.

**Results depend on the method.** K-means, PAM, and Hierarchical can produce different clusterings from the same data. Different linkage methods within Hierarchical can produce different clusterings. Different distance metrics can produce different clusterings. If your clusters only appear with one specific combination of settings, they may not be robust. Try multiple approaches and look for consistent patterns.

**Too many variables can hurt.** With many variables, distances become dominated by noise – every observation looks equally far from every other one (the "curse of dimensionality"). If you have 50 variables, consider reducing them first with [factor analysis](./factor-analysis.md) or [PCA](./factor-analysis.md) and clustering on the factor scores instead.

**Don't test cluster differences on clustering variables.** If you cluster people using anxiety and depression scores, then run a t-test asking "do the clusters differ on anxiety?" – of course they do, you *made* them differ. Testing whether clusters differ on the variables used to create them is circular. That is why the variable contribution table labels its F statistic descriptive only. Instead, validate clusters against *external* variables not used in the clustering (e.g. cluster on personality items, then check whether clusters differ on job performance).

**Clusters might be arbitrary cuts of a continuum.** Not all data has natural groups. Depression scores might form a smooth gradient from low to high rather than distinct "depressed" and "not depressed" clusters. Forcing this into two clusters creates an artificial boundary. A well-known example of this debate is personality typology: researchers have clustered Big Five scores into types like "resilient," "overcontrolled," and "undercontrolled" – but the Big Five dimensions themselves are continuously and normally distributed, so the "types" may simply be regions of a smooth space rather than natural categories. Check whether the silhouette plot shows clear separation or a muddy overlap.

**Cluster labels are interpretations.** Same caveat as [factor naming](./factor-analysis.md#common-pitfalls) – calling a cluster "Resilient High-Achievers" because it has above-average scores on several positive traits is your interpretation. Report the actual profile means so readers can judge for themselves.

**Sample-specific solutions.** Cluster structures are sensitive to sample composition. A 3-cluster solution in your sample might not replicate in a different population. Run the [cluster stability](#cluster-stability) diagnostic, and if possible split your data and check whether the same clusters emerge in both halves.
