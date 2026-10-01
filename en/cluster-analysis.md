---
title: Cluster analysis
description: K-means, K-medoids, hierarchical clustering, biclustering, silhouette analysis, gap statistic, bootstrap stability, dendrograms, and heatmaps in DataSuite 2.
---

# Cluster analysis

The **Cluster analysis** module groups observations, variables, or both into clusters based on similarity. It supports three modes – case clustering, variable clustering, and biclustering – with multiple algorithms per mode. A three-step workflow walks you through choosing a method, finding the optimal number of clusters, and running the full analysis with validity metrics and visualizations. {#cluster-analysis #cluster-analysis-results #variable-cluster-analysis-results #cluster-solution-comparison #variable-cluster-solution-comparison #biclustering-results #bicluster-solution-comparison}

> **What is cluster analysis?** It finds groups of cases that resemble each other without being told what the groups are – [clustering](./concepts/clustering.md#b-clustering) explains the idea, and [a cluster solution](./concepts/clustering.md#b-a-cluster-solution) what the result can and cannot claim.

1. [Select your variables](./getting-started.md#choosing-variables) (at least 2 – numeric, or mixed types under [Gower](#gower-and-mixed-type-data))
2. Choose a [clustering mode and algorithm](#step-1-method-settings)
3. Set the [cluster range](#step-2-determine-optimal-k) and click **Analyze & determine k** to find the best number of clusters
4. Set k, toggle [validity metrics and output options](#step-3-run-full-analysis)
5. Click **Run cluster analysis** (or **Run biclustering analysis**)

## Requirements

At least 2 variables must be selected, and by default they must be numeric – non-numeric variables are automatically excluded and listed in the output. The exception is the [Gower metric](#gower-and-mixed-type-data), which scores categorical and ordinal variables directly and so keeps them in the analysis. Either way, variables that turn out to be constant across the complete cases are dropped too, and listed as such – at least two of the selected variables must actually vary.

k must also be smaller than the number of objects being clustered: fewer than the variables in variable mode, and fewer than the complete cases in case mode, where every k in a Step 2 range is held to the same bound. Biclustering needs at least two complete cases and at least as many as the biclusters asked for, and FABIA cannot be asked for more biclusters than there are variables. Numeric fields are clamped to their own minimum and maximum, so a value typed outside the range is repaired rather than passed to R, and an emptied field runs at its default – except Step 3's two k fields, which refuse an empty value.

## Step 1: Method & settings

### Clustering mode

- **Clustering mode** – what the objects to be grouped are: rows, columns, or blocks of both ([clustering cases, variables or both](./concepts/clustering.md#b-clustering-cases-variables-or-both)). The choice switches the algorithm list and the Step 2 and Step 3 panels.
- **Case clustering** – groups the rows (observations) on the selected variables: "what types of participants are in my data?"
- **Variable clustering** – groups the columns: "which of my variables behave similarly?" – an alternative to [factor analysis](./factor-analysis.md) for finding sets of variables that move together. The variables are standardized, the matrix is transposed, and the dissimilarity is computed between the variables' profiles across the cases; the two [correlation dissimilarities](#distance-metric) are the established choice here.
- **Biclustering** – groups rows and columns at once, finding subsets of observations that are similar on a subset of variables – for a structure that does not span every variable ([a bicluster](./concepts/clustering.md#b-a-bicluster)). Its algorithms and settings are [below](#biclustering-algorithms).

### Standardization

- **Standardize variables (z-scores)** – on by default: every variable is centred and scaled before the distances are computed, so none dominates because its numbers happen to be bigger ([standardization before clustering](./concepts/clustering.md#b-standardization-before-clustering)). Turn it off only when your variables share a common, meaningful scale and their relative spread is part of what you want to cluster on. In **Variable clustering** the box is ticked and locked, since a correlation is defined on standardized columns; under **Gower (mixed types)** it is unticked and locked, since Gower divides each numeric variable by its own range as part of its definition. Whether the run standardized is reported on the output card – as *(standardized)* beside the variable list in case and variable mode, and as its own row in biclustering.

### Algorithms for case and variable clustering

- **Clustering algorithm** – how the clusters are built: K-means and K-medoids partition the objects into a fixed k, Hierarchical builds a tree and cuts it at k. All three assume the selected variables are relevant to the grouping – irrelevant variables add noise and degrade cluster quality.
- **K-means** – default; assigns each case to the nearest cluster centre and recomputes the centres until nothing moves ([k-means clustering](./concepts/clustering.md#b-k-means-clustering)). Fast, scales well and suits well-separated, roughly spherical clusters of similar size on continuous variables; it minimises within-cluster variance, so it struggles with elongated, ring-shaped or very unequal clusters. It works in Euclidean distance and cannot honour another metric, so **Distance metric** is hidden under it in case mode and pinned to **Euclidean** in variable mode; it is unavailable under Gower. Its random starts are seeded by the reproducibility seed in **Settings**.
- **K-medoids (PAM)** – like K-means, but the centres are actual cases – [medoids](./concepts/clustering.md#b-a-medoid) – so it runs on any distance metric, Gower included, and is more robust to outliers, since a far-out case cannot drag a medoid as it drags a mean. It has no settings of its own beyond the metric.
- **Hierarchical** – builds a tree ([a dendrogram](./concepts/clustering.md#b-a-dendrogram)) by progressively merging the most similar objects, and cuts it at k. It makes no distributional assumptions, but the **Linkage method** strongly shapes the result. Best for exploring the cluster structure at several levels on small to medium datasets, and when the cluster shapes may not be spherical.

> **Which algorithm?** K-means for speed on well-separated, round clusters; K-medoids when outliers or a non-Euclidean metric matter, or when you want real cases as cluster centres; Hierarchical to read the structure off a tree before fixing k – [the algorithms](./concepts/clustering.md#the-algorithms) explains each.

**K-means settings:**

- **K-means algorithm** – which of R's four k-means variants runs. All four minimise the same within-cluster sum of squares and usually agree; they differ in how the centres are updated.
- **Hartigan-Wong** – default; moves single cases between clusters whenever the move lowers the within-cluster sum of squares, and is the variant R's authors recommend. It is the one that reports its own convergence failures.
- **Lloyd** – the textbook batch algorithm: assigns every case to the nearest centre, then recomputes all centres, until the assignment stops changing.
- **Forgy** – the same batch procedure under its other name; R runs the two identically.
- **MacQueen** – updates the two centres involved each time a single case is reassigned, rather than every centre after a full pass.
- **Number of random starts** – default 25, from 1 to 100: how many random starting sets of centres are tried; the run with the lowest within-cluster sum of squares is kept. Higher values reduce the chance of a suboptimal solution.
- **Maximum iterations** – default 100, from 10 to 1,000: the pass limit per start. When the algorithm hits it without converging, a warning on the card says so and suggests raising the limit or the number of starts.

**Hierarchical settings:** the distance metric plus a linkage.

- **Linkage method** – how the distance between two *clusters* is measured from the distances between their members ([linkage](./concepts/clustering.md#b-linkage)); it decides the shape of the clusters that form. Two warnings guard the choice: Ward's assumes Euclidean distances, so it is flagged under another metric (Minkowski at p = 2 counts as Euclidean), and Centroid and Median are not monotone – a merge can sit below the pair it joins – so a warning says their dendrogram can show inversions, and a note on the plot reports them when they occur.
- **Ward's (D2)** – default; merges the pair whose union increases the total within-cluster variance the least ([Ward's method](./concepts/clustering.md#b-wards-method)) – compact, roughly equal-sized clusters. Assumes Euclidean distances.
- **Complete** – the distance between two clusters is the largest distance between any two of their members ([complete linkage](./concepts/clustering.md#b-complete-linkage)) – compact clusters, sensitive to outliers.
- **Average (UPGMA)** – the mean of all pairwise distances between the two clusters' members ([average linkage](./concepts/clustering.md#b-average-linkage)) – moderate-sized, balanced clusters.
- **Single** – the smallest distance between any two members ([single linkage](./concepts/clustering.md#b-single-linkage)) – long, chain-like clusters: good for detecting elongated shapes, prone to "chaining".
- **Centroid (UPGMC)** – the distance between the two clusters' centroids ([centroid linkage](./concepts/clustering.md#b-centroid-linkage)); can produce inversions in the dendrogram.
- **Median (WPGMC)** – like Centroid, but weights the two merged clusters equally regardless of size; can produce inversions too.
- **McQuitty (WPGMA)** – like Average, but weights the two merged clusters equally regardless of size ([McQuitty's linkage](./concepts/clustering.md#b-mcquittys-linkage)).

### Distance metric

- **Distance metric** – how far apart two objects are on the selected variables together ([distance](./concepts/clustering.md#b-distance)). In case mode the select is shown for **K-medoids (PAM)** and **Hierarchical**; in variable mode it stays visible under K-means as well, with the entries K-means cannot use disabled, since there the metric is what "similar variables" means.
- **Euclidean** – default; the straight-line distance ([Euclidean distance](./concepts/clustering.md#b-euclidean-distance)) – the choice for continuous data.
- **Manhattan** – the sum of absolute differences ([Manhattan distance](./concepts/clustering.md#b-manhattan-distance)) – less sensitive to a single large difference than Euclidean.
- **Maximum (Chebyshev)** – the largest single-variable difference ([Chebyshev distance](./concepts/clustering.md#b-chebyshev-distance)) – when one big discrepancy should decide.
- **Canberra** – the sum of relative differences ([Canberra distance](./concepts/clustering.md#b-canberra-distance)) – for counts and non-negative data, where small values matter proportionally. It is defined for values at or above zero, so run it with standardization off.
- **Minkowski** – the family Manhattan and Euclidean belong to ([Minkowski distance](./concepts/clustering.md#b-minkowski-distance)), with the exponent set by **Minkowski exponent (p)**.
- **Minkowski exponent (p)** – default 2, at least 1, in steps of 0.5: p = 1 is Manhattan, p = 2 is Euclidean, and larger values approach the Maximum. At p = 2 the metric counts as Euclidean for Ward's warning.
- **1 − r (correlation)** – one minus the correlation between two profiles ([correlation as a dissimilarity](./concepts/clustering.md#b-correlation-as-a-dissimilarity)) – in variable mode, groups variables that rise and fall together and keeps oppositely-signed ones apart.
- **1 − |r| (absolute correlation)** – one minus the absolute correlation – groups variables that measure the same thing regardless of polarity, which is usually what reverse-keyed questionnaire items need. Both correlation dissimilarities are the established choice in **Variable clustering**, and are offered in case mode for K-medoids and Hierarchical too: there they compare the *shape* of a case's profile across the variables rather than its level, so they need columns measured on a comparable scale.
- **Gower (mixed types)** – each variable scored on its own scale, then averaged across the variables ([Gower's coefficient](./concepts/clustering.md#b-gowers-coefficient)) – the only metric that admits categorical and ordinal variables. Choosing it changes four things, [below](#gower-and-mixed-type-data).

#### Gower and mixed-type data

Every other metric here is a distance between rows of numbers, which is why non-numeric variables are excluded before the data ever reaches R. **Gower (mixed types)** is the exception: it scores each variable on its own scale – a range-normalized absolute difference for numeric variables, a rank-based comparison for ordinal ones, and match-or-no-match for categorical ones – then averages across the variables, so a categorical variable enters the clustering instead of being dropped from it. Choosing it changes four things. Categorical and ordinal variables are kept: they are no longer listed as excluded, and each variable's Gower sub-type – interval, nominal or ordinal – is reported as a **Gower variable types** row on the output card, which is worth reading, since the sub-type decides how the variable was compared and an ordinal variable treated as nominal has its ordering silently discarded. Standardization is switched off and locked, for the reason given [above](#standardization). K-means becomes unavailable, since it needs centroids in Euclidean space – PAM and Hierarchical take a dissimilarity directly and are offered as usual – and variable clustering withdraws the metric. And the centroid-based outputs are left off: within SS, between-cluster SS, variance explained, Calinski-Harabasz, Hartigan, Hopkins, Duda-Hart, the gap statistic, the elbow plot and the [cluster biplot](#cluster-biplot) are not produced, and a note on the card says so rather than leaving them quietly missing; Davies-Bouldin stays, computed from cluster medoids instead of means, and silhouette, Dunn, the cophenetic correlation, bootstrap stability and the consensus partition read the dissimilarity directly and are unaffected. Cluster profiles and medoids report a modal level where a mean is undefined, and the variable contribution table leaves a categorical variable's F-statistic and Eta² empty and says so.

> **When is Gower the right call?** When at least one variable you want to cluster on is genuinely categorical – a diagnosis, a treatment arm, a region – and dropping it would change what the clusters mean; with all-numeric variables the ordinary metrics are better behaved and give the full validity table back – see [Gower's coefficient](./concepts/clustering.md#b-gowers-coefficient).

### Biclustering algorithms

Biclustering finds subgroups of observations that are similar on a *subset* of variables – unlike standard clustering, which uses all variables for every cluster.

- **Biclustering algorithm** – which search runs on the case × variable matrix. Plaid and Spectral decide the number of biclusters themselves, so Step 2's comparison is not offered for them and Step 3 takes no k; BiMax, FABIA and Cheng & Church take the k you set. Plaid is the default because it models continuous data directly and picks its own count – there is no threshold to guess; BiMax and Cheng & Church need a threshold whose usable value depends on your data, so try them once you know what the structure looks like; FABIA handles noisy data well through its probabilistic model; Spectral is for checkerboard-pattern data.
- **Plaid** – default; an additive model in which each bicluster is a "layer" added to the background ([the plaid model](./concepts/clustering.md#b-the-plaid-model)). Determines k automatically.
- **BiMax** – finds biclusters of maximal size in binarized data ([binarization](./concepts/clustering.md#b-binarization)). k is yours to set.
- **FABIA** – a factor model approach that finds sparse, overlapping biclusters ([sparse factor biclusters](./concepts/clustering.md#b-sparse-factor-biclusters)). k is yours to set.
- **Cheng & Church** – finds biclusters with a low [mean squared residue](./concepts/clustering.md#b-mean-squared-residue), that is, high coherence. k is yours to set.
- **Spectral** – uses a singular value decomposition to find checkerboard patterns ([checkerboard structure](./concepts/clustering.md#b-checkerboard-structure)). Determines k automatically.

**Plaid settings:**

- **Background layer** – whether a background is fitted to the whole matrix before the layers are searched for, so that the biclusters describe departures from it rather than from zero.
- **Row and column effects** – default; fits the background as a grand mean plus one effect per case and one per variable, and takes it out before the first layer is fitted. The output card's settings row reports the choice under the same name.
- **None** – no background is fitted, so the layers are fitted to the values as they stand. {#background-layer-none #none}
- **Maximum layers (biclusters)** – default 20, from 1 to 50 – the upper limit for the automatic detection.
- **Row release** – default 0.7, from 0 to 1 – how strictly cases are pruned from a layer as it is fitted: a case stays only when the layer accounts for at least this share of its variation across the layer's variables. Raise it to prune more aggressively, lower it to keep looser members.
- **Column release** – default 0.7, from 0 to 1 – the same rule for variables.

**BiMax settings:**

- **Minimum rows** – default 2 – the fewest cases a bicluster may have. BiMax keeps a block with at least this many rows; Spectral, which shares the control, keeps a candidate only when it has *more* rows than this, so its 2 keeps nothing smaller than three.
- **Minimum columns** – default 2 – the fewest variables a bicluster may have, read the same way: at least this many under BiMax, more than this under Spectral.
- **Binarization quantile** – default 0.5, from 0 to 1 – each variable is cut at this quantile *of its own values*: above becomes 1, at or below becomes 0. It is a quantile, not a raw value, so the same setting works whatever scale your variables are on.

**FABIA settings:**

- **Sparseness prior (loadings)** – default 0.6, from 0 to 2 – how strongly the case-side loadings are pushed towards zero; higher values produce sparser, more selective biclusters. It shapes the fit, not the membership cut – that is **Membership threshold**.
- **Sparseness prior (factors)** – default 0.5, from 0 to 2 – the same pressure on the variable-side factors.
- **Membership threshold** – default 0.5, from 0.1 to 2 – the cut point that turns FABIA's continuous factors into membership. Raising it admits more cases into each bicluster and fewer variables; set it too low and FABIA returns nothing at all.
- **Number of iterations** – default 500, from 100 to 2,000 in steps of 100 – the fitting cycles.

**Cheng & Church settings:**

- **Residue threshold (δ)** – default 0.2, from 0.01 to 1 – the largest mean squared residue a bicluster may have, expressed as a *fraction of the whole matrix's residue*. Lower values demand more coherent biclusters.
- **Alpha** – default 1.5, at least 1 – the scaling factor for multiple node deletion: rows and columns whose residue exceeds this multiple of the block's are removed together before the one-at-a-time deletion starts.

**Spectral settings:**

- **Number of row and column groups** – default 3 – rows and variables are each split into this many groups, and the biclusters are the group pairings that survive the size and spread filters below. The maximum offered is derived from your data: both counts and the two minimum-size filters bound it, so on a narrow dataset it is small.
- **Number of singular vectors** – default 3 – how many SVD dimensions to use; it cannot exceed the smaller of the case and variable counts.
- **Normalization method** – how the matrix is rescaled before its decomposition, so that the singular vectors reflect the block structure rather than the row and column totals.
- **Log** – default; shifts the matrix so its smallest value is 1 and takes logarithms, then removes the row and column means – the log-interactions normalization.
- **IRRC (independent rescaling)** – Kluger's *independent rescaling of rows and columns*: after shifting the matrix to be non-negative, each value is divided by the square root of its row total times its column total, once.
- **Bistochastization** – repeats that rescaling, aiming at a matrix whose rows and columns all sum to the same constant. Under it and IRRC the first singular vector carries the background and is discarded, so a single singular vector is raised to two.
- **Maximum within-bicluster spread** – default 0.5, at least 0 – the spread a candidate may carry and still be kept, as a fraction of the matrix's own spread. Raise it to accept more biclusters. Since Spectral decides k for itself, this control is what really governs how many come back.
- The **Minimum rows** and **Minimum columns** filters, [as under BiMax](#b-minimum-rows) but strict: a candidate is kept only when it has *more* rows (or variables) than the setting, so 2 keeps nothing smaller than three.

> **Which biclustering algorithm?** Plaid when you do not know how many blocks to expect; BiMax and Cheng & Church once you can set their threshold from what the structure looks like; FABIA for noisy data with overlapping patterns; Spectral for a matrix that is block-structured throughout – [a bicluster](./concepts/clustering.md#b-a-bicluster) and the blocks after it explain each model.

## Step 2: Determine optimal k

Before running the full analysis, this step compares solutions across a range of cluster counts to help you choose k.

### Standard clustering (case / variable modes)

Set the **Cluster range to test** and click **Analyze & determine k**. Every k in the range is clustered with the Step 1 settings and scored on the indices you leave on, one row per k.

- **Minimum** – the smallest count tested, default 2. It can be 1, in which case the k = 1 row describes the unpartitioned data. Under **Bicluster range to test** it is the smallest number of biclusters, with the same default.
- **Maximum** – the largest count tested, default 10. It must stay below the number of objects – the variables in variable mode, the complete cases in case mode – and a maximum at or below the minimum is raised to one above it, since a comparison needs a range. Under **Bicluster range to test** it is the largest number of biclusters, with the same default.

Under **Validity metrics**, each index you leave on is recomputed for every k in the range and becomes a column of the [comparison table](#comparison-table) – switching off the ones you will not read is what makes a wide range affordable. The same four checkboxes return in Step 3, where each is a row of the validity table.

- **Silhouette analysis** – the average silhouette width: how much closer each object sits to its own cluster than to the nearest other, averaged over the objects, from −1 to +1 ([the silhouette](./concepts/clustering.md#b-the-silhouette)). Higher is better – 0.50 and above reasonable, 0.70 and above strong. On by default; its column is headed **Silhouette**, it is what **Suggested k (silhouette)** reads, and switching it off withdraws the silhouette plot and that suggestion too. {#silhouette-analysis #solution-comparison-silhouette}
- **Calinski-Harabasz index** – between-cluster against within-cluster variation, each divided by its degrees of freedom ([the Calinski–Harabasz index](./concepts/clustering.md#b-the-calinski-harabasz-index)); higher is better. On by default; its column is headed **Calinski-Harabasz**. It is computed from cluster means, and is withdrawn under [Gower](#gower-and-mixed-type-data). {#calinski-harabasz-index #solution-comparison-calinski-harabasz}
- **Davies-Bouldin index** – each cluster's scatter set against its nearest neighbour's, averaged over the clusters ([the Davies–Bouldin index](./concepts/clustering.md#b-the-davies-bouldin-index)); lower is better. On by default; its column is headed **Davies-Bouldin**. It is measured in the selected distance metric, and from cluster medoids rather than means under Gower. {#davies-bouldin-index #solution-comparison-davies-bouldin}
- **Dunn index** – the smallest dissimilarity between two clusters over the largest within one ([the Dunn index](./concepts/clustering.md#b-the-dunn-index)); higher is better, and a single outlying object can move it a long way. Off by default; its column is headed **Dunn**. {#dunn-index #solution-comparison-dunn}

Under **Output options**, up to four plots are drawn beside the table:

- **Show elbow plot (within-cluster SS)** – on by default: the total within-cluster sum of squares against k, with a ring on the elbow – the k furthest from the straight line joining the first and last points – or a note that the curve bends too little to mark one ([the elbow method](./concepts/clustering.md#b-the-elbow-method)). Not drawn under Gower. {#show-elbow-plot-within-cluster-ss #elbow-plot-within-cluster-ss}
- **Show silhouette plot** – on by default, and offered while **Silhouette analysis** is on: the average silhouette width against k, the best k highlighted and guides at 0.25, 0.50 and 0.70 separating weak, reasonable and strong structure. {#show-silhouette-plot #silhouette-score-by-k}
- **Compute gap statistic (slower)** – on by default: how much tighter the clusters are than those of 100 uniform reference samples, at every k, measured with the dissimilarity the run clusters on ([the gap statistic](./concepts/clustering.md#b-the-gap-statistic)). It adds the **Gap** column, the plot and **Suggested k (gap statistic)**. On the plot the bars span ±1 SE and the highlighted k is the one Tibshirani's rule picks – the smallest k whose gap reaches the next k's gap less its standard error – which is not always the plain maximum; when the rule's k lies outside the range tested, nothing is highlighted and a note says so. Not computed under Gower. If the computation fails, the Gap column reads N/A and R's message is printed under the table and in place of the plot. {#compute-gap-statistic-slower #gap-statistic-by-k}
- **Show dendrogram** – Hierarchical only, on by default: the full tree with a draggable cut line – see [reading the dendrogram](#reading-the-dendrogram). It follows Step 3's **Optimize leaf ordering**, so both steps draw the same tree.

#### Cluster tendency

**Cluster tendency.** In case mode the card opens by asking whether the data look clustered at all – the check that comes before "how many?", since every algorithm returns clusters, including on data that has none ([clustering tendency](./concepts/clustering.md#b-clustering-tendency)). Both tests are Euclidean whatever the metric, with a note saying so under another; neither is reported in variable mode or under Gower. {#cluster-tendency}

- **Hopkins statistic** – how much closer the objects sit to one another than uniformly random points over the same range would ([the Hopkins statistic](./concepts/clustering.md#b-the-hopkins-statistic)): 0.75 or above reads *Clustered structure*, between 0.25 and 0.75 *Weak or unclear tendency* – 0.5 is what random data gives – and below 0.25 *Regularly spaced, not clustered*. It has no p-value.
- **Duda-Hart Je(2)/Je(1)** – the within-cluster sum of squares of the selected algorithm's two-cluster solution over the total sum of squares ([the Duda–Hart test](./concepts/clustering.md#b-the-duda-hart-test)), with a p-value: significant at the [significance level](./settings.md#significance-level) reads *Two clusters beat one*, otherwise *One cluster is not rejected*.
- **Cluster tendency – Value** – the test's statistic: the Hopkins ratio on its row, Je(2)/Je(1) on the Duda-Hart row.

The readings fill the **Interpretation** column when interpretation is enabled in [Settings](./settings.md#significance-formatting).

#### Comparison table

**Solution comparison.** One row per k tested and one column per index – the heading of the standard and the [biclustering](#bicluster-comparison-table) comparison alike. Green marks the best value in a column, and a note under the table says what else is marked. {#solution-comparison}

- **k** – the count the row describes. Click it to carry that k into Step 3's **Number of clusters (k)** field – or, on a biclustering card, **Number of biclusters (k)** – instead of retyping it, with a toast confirming the new value.
- **Within SS** – the total within-cluster sum of squares ([within-cluster dispersion](./concepts/clustering.md#b-within-cluster-dispersion)); lower means tighter clusters, but it falls with every cluster added, so it carries no best mark.
- **Variance explained (%)** – the share of the total sum of squares lying between the clusters rather than within them; it rises with every cluster added, so it carries no best mark either. {#solution-comparison-variance-explained}
- **Smallest cluster** – the member count of the smallest cluster, so a solution that only splits off a handful of objects stands out.
- **Largest cluster** – the member count of the largest cluster.
- **Gap** – the gap statistic at each k; higher means tighter than the reference, and the green mark sits on the k the 1-standard-error rule picks, matching **Suggested k (gap statistic)** rather than the column's maximum.
- **Hartigan** – Hartigan's index comparing each k with the next ([Hartigan's rule](./concepts/clustering.md#b-hartigans-rule)); a value above 10, highlighted in yellow, says another cluster is still worth adding. The last row reads N/A, having no next k to compare with.

The **Silhouette**, **Calinski-Harabasz**, **Davies-Bouldin** and **Dunn** columns are the [validity metrics](#b-silhouette-analysis) you left on. When the range starts at 1, the separation indices need at least two clusters and read N/A on the k = 1 row.

Within SS, variance explained, Calinski-Harabasz and Hartigan are computed under Euclidean geometry whatever metric you selected – when you pick another metric, a note under the table says so. The Gap statistic itself is computed on the dissimilarity you chose, but its reference sample is drawn uniformly, which is not a structureless null for `1 − r` or `1 − |r|`; a second note says so under those two metrics. Under [Gower](#gower-and-mixed-type-data) those four columns and the Gap column are left out of the table altogether, since mixed types give no centroid to compute them from.

Below the table, suggestions show:

- **Suggested k (silhouette)** – the k with the highest average silhouette, while **Silhouette analysis** is on.
- **Suggested k (gap statistic)** – the k the 1-standard-error rule picks: the smallest k whose gap reaches the next k's gap less its standard error. When the rule picks k = 1, the card says the gap statistic favours no cluster structure instead of naming a k.

A suggestion is the best of the range, which says nothing about whether the range holds structure at all – so if no k reaches a silhouette of 0.25, a caveat under the suggestions spells that out with the best score found.

> **Metrics disagree – which one do I trust?** They usually do, since each index measures something different; treat the table as a shortlist and choose among its top two or three k by interpretability and stability – see [when the indices disagree](./concepts/clustering.md#b-when-the-indices-disagree).

#### Reading the dendrogram

The dendrogram in Step 2 is interactive. Drag the cut line to see how the tree splits at different k, then **click the cut line** to send that k straight to Step 3 – or use the **Move the cut to the suggested k** button to jump to the silhouette suggestion. Cluster numbering follows the order the clusters first appear along the tree, so the colors and labels on the plot match the numbers in every table.

### Biclustering (biclustering mode)

For algorithms that need a user-specified k (BiMax, FABIA, Cheng & Church), set the **Bicluster range to test** – the same [Minimum](#b-minimum) and [Maximum](#b-maximum) as above, default 2–10 – and click **Compare solutions**.

- **Show variance explained plot** – on by default: the share of the matrix's variance the biclusters capture, against k – under FABIA, the share its own factorization captures. {#show-variance-explained-plot #variance-explained}
- **Show coherence plots (MSR and correlation)** – on by default: two plots across k, the average [mean squared residue](./concepts/clustering.md#b-mean-squared-residue) (lower = more coherent) and the average [within-bicluster correlation](./concepts/clustering.md#b-within-bicluster-correlation) (higher = more coherent). {#show-coherence-plots-msr-and-correlation #average-coherence-msr #average-coherence-correlation}
- **Show coverage plot** – on by default: three lines across k, the percentage of rows, of columns and of cells that fall in at least one bicluster. {#show-coverage-plot #coverage}

Three slower diagnostics are off by default. Each adds columns to the table and a plot of its own:

- **Stability analysis (bootstrap, slower)** – resamples the cases, refits the biclustering at every k and scores how much of each bicluster comes back, by Jaccard similarity; it adds the **Stability** column, and when it runs, the suggested k is the most stable one. {#stability-analysis-bootstrap-slower #stability-analysis-bootstrap}
- **F-statistic diagnostics (slower)** – row and column F statistics for every bicluster of at least two rows and two columns, with resampled p-values; it adds the **Avg row F**, **Avg col F**, **Row sig. (%)** and **Col sig. (%)** columns and a plot with a reference line at 80%. They are descriptive only, not a significance test – the biclusters were chosen to maximise exactly these effects – as the notes under the table and the plot say. {#f-statistic-diagnostics-slower #f-statistic-diagnostics}
- **Consensus scoring (slower)** – refits the algorithm repeatedly under different seeds at every k and scores how far the runs agree, by Jaccard similarity; it adds the **Consensus** column. Offered for Cheng & Church and FABIA: BiMax is deterministic and agrees with itself perfectly, so the box is hidden under it. This is a reproducibility score, not a new solution – the [consensus partition](#consensus-partition) offered for case and variable clustering is a different thing that happens to share the word. {#consensus-scoring-slower #consensus-scoring}
- **Bootstrap replications** – default 100, from 10 to 10,000, shown while any of the three is on: how many resamples stability and the F-statistic draw, and how many repeated runs consensus scoring compares. Stability and consensus refit the biclustering once per replicate for every k in the range, and the F-statistic diagnostics resample once per bicluster found at every k, so they cost the range width times the biclusters found times the replications – narrow the range before switching them on. Step 3 has fields of the same name, with the same default and range, for its own resampling outputs: one shared by **Cluster stability** and **Consensus partition**, and one under the bicluster summary's **Stability**.

#### Bicluster comparison table

Under the same **Solution comparison** heading, one row per k; the **k** cell carries its count into Step 3 as in the [standard table](#b-k).

- **Found** – how many biclusters the algorithm returned, which can be fewer than k: yellow marks a count it could not fill, and the row then repeats the largest solution it did find.
- **Var. Expl. (%)** – how much of the matrix's variance the biclusters capture. It carries no best mark: it tracks how much of the matrix the blocks happen to cover, so its extreme names the k the algorithm filled most, not a better fit.
- **Var. Expl. (model, %)** – the same column under FABIA, scoring the factorization FABIA fitted rather than the bicluster blocks – a note under the table says so.
- **Δ var. (%)** – the gain in variance explained over the previous k; the first row has none.
- **Avg MSR** – the average [mean squared residue](./concepts/clustering.md#b-mean-squared-residue) over the biclusters; lower is more coherent. It is undefined below two rows or two columns, so where only some biclusters qualify the cell names how many it averaged, e.g. `0.017 (3/4)`.
- **Avg r** – the average [within-bicluster correlation](./concepts/clustering.md#b-within-bicluster-correlation); higher is more coherent. Unlike MSR it ignores amplitude, so rows that move together at different scales still score well. Undefined below two rows or two columns like MSR, with the same `(3/4)` marker, and a row constant across a bicluster's columns is left out of its bicluster's average.
- **Avg overlap** – the average Jaccard similarity between the biclusters' cells, pair by pair; above 0.3 it is yellow, meaning the biclusters largely repeat one another.
- **Cell cov. (%)** – the percentage of data cells included in at least one bicluster.
- **Stability** – the mean bootstrap Jaccard of that k's biclusters, from **Stability analysis (bootstrap, slower)**; higher is better, and green marks the best. {#solution-comparison-stability}
- **Avg row F** – the row-effect F statistic averaged over the biclusters, from **F-statistic diagnostics (slower)**; descriptive only.
- **Avg col F** – the column-effect F statistic averaged the same way.
- **Row sig. (%)** – the share of biclusters whose row-effect p-value falls below the [significance level](./settings.md#significance-level) against the resampled null; green from 80%. Inflated by construction, so descriptive only.
- **Col sig. (%)** – the same share for the column effects.
- **Consensus** – the mean Jaccard agreement between the repeated runs at that k, from **Consensus scoring (slower)**; higher is better, and green marks the best. {#solution-comparison-consensus}

A k whose fit failed outright is drawn red, with R's message under the table. Warnings above the table say when no biclusters were found at any count, when every count overlaps above 0.3, and when stability was asked for but could not be measured at any count.

**Suggested k.** The count given below the table, with the rule that produced it: the highest bootstrap stability when that diagnostic ran, otherwise the variance-explained elbow – the last k before the gain in variance explained falls below half the gain before it. The elbow rule applies only once the curve has gained at least 5 percentage points across the range; when it has not, or no gain collapses, the suggestion is the smallest k tested.

For auto-k algorithms (Plaid, Spectral), Step 2 shows an informational note instead – the algorithm determines k on its own. For Spectral the note adds that **Maximum within-bicluster spread** from Step 1 is what decides how many biclusters come back.

## Step 3: Run full analysis

Enter the number of clusters and click **Run cluster analysis** (or **Run biclustering analysis**). Long runs can be interrupted with the Cancel button on the progress overlay.

Every output card opens with the settings the run used – mode, algorithm, distance metric, linkage or K-means parameters, whether standardization was applied, the variables included, any excluded as non-numerical or constant, and the number of complete cases out of the total – then any warnings (listed [below](#warnings)), then the sections the options ask for, in the order they are listed here.

All diagnostic plots produced here and in step 2 (elbow, silhouette, gap, dendrogram, heatmap, and the rest) are resizable and can be saved individually as SVG, PNG, or JPG using the export buttons beside each chart – see [resizing and exporting charts](./getting-started.md#resizing-and-exporting-charts).

### Case and variable clustering

- **Number of clusters (k)** – default 3, at least 2: how many clusters the run partitions the objects into. Clicking a **k** in Step 2's [comparison table](#b-k), or the dendrogram's cut line, fills it in. It must stay below the number of objects – the variables in variable mode, the complete cases in case mode – and a value that breaks either bound, or an empty field, is refused with a message rather than run.

Under **Validity metrics** the four checkboxes of [Step 2](#b-silhouette-analysis) return with the same defaults, each now a row of the [validity table](#cluster-validity-metrics) for the one k, and two resampling diagnostics join them:

- **Cluster stability (bootstrap Jaccard, slower)** – off by default: reclusters bootstrap resamples of the data and scores, cluster by cluster, how much of each comes back – the [stability table](#cluster-stability). The only diagnostic here that asks whether a cluster would reappear in another sample rather than how well it is cut in this one ([cluster stability](./concepts/clustering.md#b-cluster-stability)). {#cluster-stability-bootstrap-jaccard-slower #cluster-stability-bootstrap-jaccard}
- **Consensus partition (ensemble of resamples, slower)** – off by default: builds a second partition out of how often each pair of objects lands together across the resamples, and reports how far it agrees with the one the card shows – the [consensus section](#consensus-partition) ([a consensus partition](./concepts/clustering.md#b-a-consensus-partition)). {#consensus-partition-ensemble-of-resamples-slower #consensus-partition-ensemble-of-resamples}

Either box reveals a [**Bootstrap replications**](#b-bootstrap-replications) field, default 100, from 10 to 10,000; the two read the same resamples, so running both costs no more than running one. Both follow the **Bootstrap seed** in Settings.

Under **Output options**:

- **Cluster profiles (means per variable)** – on by default: each variable's mean within each cluster beside its overall mean, on the variables' original scale – usually the table that says what the clusters are. Under [Gower](#gower-and-mixed-type-data) a categorical variable has no mean, so its cells report the modal level and the section is titled *Cluster profiles (variable means and modal levels)*. Not offered in variable mode. {#cluster-profiles-means-per-variable #cluster-profiles-variable-means #cluster-profiles-variable-means-and-modal-levels}
- **Cluster sizes and distribution** – on by default: the **Cluster sizes** table, one row per cluster with its member count (**n**) and share of the objects (**%**), and each cluster's [average silhouette](#b-avg-silhouette) whenever the silhouette was computed. {#cluster-sizes-and-distribution #cluster-sizes}
- **Within-cluster sum of squares** – on by default: each cluster's [within-cluster sum of squares](#b-within-cluster-sum-of-squares-within-ss) and its share of the total, with a **Total** row – which clusters are tight and which loose. Not produced under Gower.
- **Between-cluster sum of squares** – off by default: the sum of squares lying between the clusters, and **Variance explained**, its percentage of the total – how much of the spread the partition accounts for. Not produced under Gower.
- **Cluster centers (medoids)** – off by default, offered for **K-medoids (PAM)** in case mode: the **Cluster medoids** section, each cluster's medoid – the actual case that represents it – with its values on the original scale beside the overall mean (under Gower, the overall mean or modal level, headed **Overall**), and a **Medoid cases** line naming the case numbers. {#cluster-centers-medoids #cluster-medoids}
- **Silhouette plot** – off by default: one bar per object, its silhouette width, grouped by cluster ([the silhouette](./concepts/clustering.md#b-the-silhouette)). A bar below zero is an object closer to another cluster than to its own; hovering a bar names the object, its width and its nearest other cluster. Titled *Variable silhouette plot* in variable mode. {#silhouette-plot #variable-silhouette-plot}
- **Multidimensional scaling plot** – off by default: the run's own dissimilarity placed in two dimensions, points coloured by cluster – see [multidimensional scaling](#multidimensional-scaling) ([what MDS shows](./concepts/clustering.md#b-multidimensional-scaling-mds)). {#multidimensional-scaling-plot #multidimensional-scaling}
- **Scaling** – shown while the MDS plot is on: which ordination draws it.
- **Classical (metric)** – default; reproduces the dissimilarities themselves, by eigendecomposition – exact, fast, and needs no iteration.
- **Non-metric (Kruskal)** – keeps only the *order* of the dissimilarities, minimising stress – for a dissimilarity whose ranking means more than its scale, such as Gower or ordinal data. Considerably slower.
- **Cluster biplot** – off by default: the cases on their first two [principal components](./concepts/latent-variables.md#b-pca), each clustering variable drawn as an arrow, so a separation between clusters can be traced to the variables that produce it – see [cluster biplot](#cluster-biplot) ([reading a biplot](./concepts/clustering.md#b-a-biplot)). Not offered in variable mode; under Gower the section still appears when the box is ticked, with a note saying why no plot is drawn.

Under **Hierarchical options**, shown for **Hierarchical**:

- **Dendrogram** – on by default: the tree with its branches coloured by cluster, cut at k ([a dendrogram](./concepts/clustering.md#b-a-dendrogram)); titled *Variable dendrogram* in variable mode, where the leaves are the variables. {#dendrogram #variable-dendrogram}
- **Optimize leaf ordering** – off by default, shown while **Dendrogram** is on: rotates the branches so neighbouring leaves are as similar as the tree allows. The search is exact, so it adds a real wait on several hundred objects, more under single linkage.

Under **Advanced options**, in case mode:

- **Variable contribution to clustering** – off by default: one row per variable with an **F-statistic**, its **df (between, within)** and **Eta²** – which variables separate the clusters most ([the columns](#variable-contribution)). The F statistic is descriptive only: the clusters were built from these same variables, so it is inflated by construction and is not a significance test, as a note under the table says.

#### Cluster validity metrics

**Cluster validity metrics.** One row per metric, with its value and, when [interpretation](./settings.md#significance-formatting) is enabled, a reading. **Calinski-Harabasz index**, **Davies-Bouldin index** and **Dunn index** are the [Step 2 entries](#b-calinski-harabasz-index), read the same way for the one k.

- **Average silhouette width** – the mean silhouette over all objects, from −1 to +1 ([the silhouette](./concepts/clustering.md#b-the-silhouette)); present while **Silhouette analysis** is on. Its reading is *Strong structure* from 0.70, *Reasonable structure* from 0.50, *Weak structure* from 0.25 and *No substantial structure* below that.
- **Cophenetic correlation** – hierarchical runs only, always reported: the correlation between the input dissimilarities and the heights at which the tree first joins each pair – how faithfully the tree reproduces the data ([the cophenetic correlation](./concepts/clustering.md#b-the-cophenetic-correlation)), 0.75 and above the usual mark of a good fit. It grades the tree rather than the cut, so it has no checkbox and does not change with k.

Under [Gower](#gower-and-mixed-type-data) a note under the table says the sums of squares and Calinski-Harabasz are left out and Davies-Bouldin comes from medoids; under any other non-Euclidean metric, that the sums of squares and Calinski-Harabasz are still Euclidean.

#### Cluster stability

**Cluster stability (bootstrap Jaccard).** One row per cluster: each replicate resamples the objects, reclusters them with the same settings, and matches every original cluster to its best counterpart by Jaccard similarity – the share of members two sets have in common. A note under the table restates the two cut-offs and the replicate count. {#-}

- **Mean Jaccard** – the average best-match similarity across the replicates; the cluster's stability score.
- **Recovered** – how many replicates brought the cluster back with a Jaccard of 0.75 or more.
- **Dissolved** – how many scored it 0.5 or less. It counts replicates, so it keeps its own, stricter meaning beside the mean.
- **Replicates scored** – how many replicates produced a solution to score the cluster against; a replicate whose refit failed scores nothing.
- **Interpretation** – with interpretation enabled, the mean read against Hennig's bands: *Highly stable* from 0.85, *Stable* from 0.75, *Indicates a pattern, but membership is doubtful* from 0.60, and *Not trustworthy* below. A warning above the card names how many clusters fell below 0.60. {#cluster-stability-bootstrap-jaccard-interpretation}

A cluster with a high silhouette and a low mean Jaccard is well cut in this sample and unlikely to reappear in another.

#### Consensus partition

**Consensus partition (ensemble of resamples).** The resamples are pooled into a co-association matrix – for every pair of objects, the share of replicates that put the two in one cluster – which is cut into k clusters of its own; the section reports how that consensus partition compares with the one the card shows. {#-}

- **Agreement with the reported solution (adjusted Rand)** – how closely the consensus partition reproduces the reported one, 1 for identical and near 0 for chance agreement. With interpretation enabled it reads *Excellent agreement* from 0.90, *Good agreement* from 0.80, *Moderate agreement* from 0.65 and *Poor agreement* below, and below 0.65 a warning above the card says the boundaries rest on this one fit.
- **Ambiguous pairs (PAC)** – the share of pairs whose co-association fell between 0.1 and 0.9, which the ensemble neither reliably kept together nor reliably separated. Lower is better: near zero, every pair was settled one way or the other.
- **Mean co-association** – in the per-cluster table beside each consensus cluster's size (**n**): the average co-association over the pairs inside it, near 1 when its members held together in nearly every resample; a one-member cluster has none.
- **Reported solution (rows) against the consensus partition (columns)** – a crosstab of the two partitions. Consensus clusters are numbered after the reported cluster each overlaps most, so the diagonal holds the objects both group alike, and the highlighted off-diagonal cells are the ones the ensemble would have placed elsewhere.

A low agreement does not make the consensus partition right and the reported one wrong – both are cuts of the same data. It says the data do not pin the grouping down, and is a reason to report the solution with caution rather than a different solution to report.

#### Sizes, profiles and sums of squares

- **Avg. silhouette** – in **Cluster sizes**, the mean silhouette width of the cluster's own members, which the overall average hides: a weak cluster shows here while the overall figure still looks acceptable. {#avg-silhouette}
- **Cluster** – in the stability, consensus and size tables, the cluster the row describes, numbered as in every table and plot of the card.
- **Variable** – in the profile, medoid, contribution and bicluster tables, the variable the row describes, by its display name.
- **Cluster {n}** – in the profile and medoid tables, the cluster's mean (or medoid value) on each variable. Read each against **Overall** to see what sets the cluster apart; the names you give clusters are your interpretation, not the data's.
- **Overall** – the whole sample's value on each variable – its mean, or under Gower the modal level of a categorical variable – in the profile, medoid and bicluster profile tables alike; headed **Overall mean** in the medoid table when every variable is numeric. {#overall #overall-mean}
- **Medoid cases** – the case numbers of the medoids, cluster by cluster.
- **Within-cluster sum of squares – Within SS.** Each cluster's sum of squared deviations from its centroid, with the sum over clusters in the **Total** row. {#within-cluster-sum-of-squares-within-ss}
- **Within-cluster sum of squares – % of total.** Each cluster's share of the total within-cluster sum of squares. {#within-cluster-sum-of-squares-of-total}

Both sum-of-squares blocks are Euclidean whatever distance metric you chose, and are computed on the analysis matrix – on the standardized values when standardization is on, not on the original scale of the profile table. A note under them says which applies; in variable mode it adds that the squares are taken over the *transposed* matrix, where each variable is a point in case space.

#### Variable contribution

The table compares the cluster means of each variable on its original scale, one row per variable.

- **Variable contribution to clustering – F-statistic.** Between-cluster against within-cluster variation of the variable, each over its degrees of freedom; larger means the clusters differ more on it. {#variable-contribution-to-clustering-f-statistic}
- **df (between, within)** – k − 1 and the number of complete cases less k, the same for every row.
- **Eta²** – the share of the variable's variance that cluster membership accounts for ([η²](./concepts/effect-sizes.md#b-η²)): near 0.60 the clusters differ sharply on the variable, near 0.05 it barely separates them. {#eta² #η²}

Under Gower a categorical variable's F-statistic and Eta² cells read –, since both compare means; the profile table shows how it separates the clusters.

#### Multidimensional scaling

The plot takes the dissimilarity the run already built – the same matrix the tree, the medoids and the validity indices read – and finds two-dimensional coordinates whose distances reproduce it as closely as two dimensions allow: it shows whether the clusters are separated in the data, or only in the partition table. The method is chosen under **Scaling** rather than inferred from the distance metric, so either question can be asked of any run.

Each method reports the fit it optimizes, in a note under the plot: classical scaling the share of the dissimilarity structure its two dimensions carry, non-metric scaling Kruskal's stress-1 with his reading – excellent at 0.025 or below, good at 0.05, fair at 0.1, poor past that. Read the fit before the picture: two dimensions carrying 40% of the structure, or a stress of 0.2, means points close on screen need not be close in the data.

Points are coloured by the cluster the run reported, and hovering one names it. Labels are placed furthest-from-centre first, at most 40, and those that would overlap are dropped, with a note saying how many were drawn; in variable mode the points are variables. Neither method can be interrupted once it starts, so above 1,000 objects the plot is replaced by a message saying so.

#### Cluster biplot

The [MDS plot](#multidimensional-scaling) shows *that* the clusters separate; the biplot shows *which variables* separate them. The cases are drawn on the first two principal components of the matrix the clustering ran on, coloured by cluster, and each clustering variable is an arrow pointing the way it increases.

An arrow pointing into a cluster's part of the plot is a variable that runs high in that cluster; two arrows at a narrow angle carry much the same information, two at right angles are largely unrelated. A long arrow is well represented by the two components on screen and a short one is not, so a short arrow's direction is the weakest claim on the plot. The axis labels carry each component's share of the variance – *Component 1 ({share}%)* – and whatever those two shares leave out is not in the picture.

The scaling is Gabriel's distance-preserving one, and a note on the plot names it: the distances between cases are the distances the components put them at, and arrow lengths are comparable with each other but not with the axes. A further note says when the run clustered on a non-Euclidean dissimilarity, since the projection always is Euclidean, and when a cloud past 5,000 cases has been thinned within each cluster. Arrow labels that would overlap are dropped and counted in a note; hovering an arrow names its variable.

### Variable clustering specifics

In variable clustering mode the data matrix is standardized and transposed – the variables become the objects being clustered – so with the default settings highly correlated variables end up in the same cluster, and the [correlation dissimilarities](#distance-metric) make that explicit and let you ignore polarity. For how this differs from grouping variables by [factor analysis](./factor-analysis.md), see [clustering cases, variables or both](./concepts/clustering.md#b-clustering-cases-variables-or-both).

- **Variable cluster assignments** – one row per cluster: its number, the **Variables** it holds and their **Count**. It takes the place of the profile table, which variable mode does not offer.
- **Variable cluster assignments – Variables.** The variables in the cluster, by name.
- **Variable cluster assignments – Count.** How many variables the cluster holds.

The warnings count variables rather than observations, and add one for a cluster holding a single variable. On the dendrogram, variables that merge low are the most similar and a variable that joins late belongs clearly to no group; on the silhouette plot, hovering a bar names its variable.

### Biclustering

- **Number of biclusters (k)** – default 3, at least 1: how many biclusters BiMax, FABIA and Cheng & Church search for. Clicking a **k** in Step 2's [bicluster comparison table](#bicluster-comparison-table) fills it in. Hidden for Plaid and Spectral, which decide the count themselves. A value below 1, an empty field, more biclusters than complete cases, or under FABIA more than there are variables, is refused with a message.

Under **Output options**:

- **Bicluster summary table** – on by default: the **Bicluster summary** section, one row per bicluster with its **Rows**, **Columns** and **Size** (rows × columns), its [mean value](#b-bicluster-summary-mean-value), its [MSR](#b-msr) and [MSR / matrix MSR](#b-msr-matrix-msr). {#bicluster-summary-table #bicluster-summary}
- **Stability (bootstrap Jaccard, slower)** – off by default, a sub-option of the summary table: refits the biclustering on each bootstrap resample of the cases and adds a [**Stability**](#b-bicluster-summary-stability) column. It reveals its own **Bootstrap replications** field, default 100, from 10 to 10,000.
- **Membership tables (rows and columns)** – on by default: **Case membership**, one row per case with a ✓ under each bicluster (**BC1**, **BC2**, …) it belongs to and a **Count** of them, and **Variable membership**, the same for the variables. A case or variable can belong to several biclusters or to none. {#membership-tables-rows-and-columns #case-membership #variable-membership}
- **Bicluster profiles (means per variable)** – on by default: each variable's mean within each bicluster (**Bicluster {n}**) on its original scale, beside the [overall](#b-overall) mean; a variable outside a bicluster reads – in its column. {#bicluster-profiles-means-per-variable #bicluster-profiles-variable-means}
- **Coherence per bicluster** – on by default: one row per bicluster with its [MSR](#b-msr), [MSR / matrix MSR](#b-msr-matrix-msr), [Avg r](#b-coherence-per-bicluster-avg-r) and the two [variances](#b-variance-of-row-means) – how tightly each block holds together. A bicluster with fewer than two rows or two columns reads – throughout.
- **Overlap analysis** – off by default, and drawn only when there are at least two biclusters: the **Overlap analysis (Jaccard Index)** section, three bicluster-by-bicluster matrices of Jaccard similarity – [row, column and cell overlap](#b-row-overlap). {#overlap-analysis #overlap-analysis-jaccard-index}
- **Heatmap visualization** – on by default: the **Heatmap**, the analysis matrix colour-coded, with each bicluster's cells outlined in its own colour – see [the heatmap](#the-heatmap). {#heatmap-visualization #heatmap}
- **Row dendrogram** – on by default, shown while the heatmap is on: orders the heatmap's rows by a tree of the cases and draws the tree beside them.
- **Column dendrogram** – on by default: the same for the variables, drawn above the columns.

#### Biclustering overview

**Overview.** The first section of every biclustering card: how much of the matrix the biclusters account for. The settings above it add the **Matrix size**, the complete cases out of the total and the number of **Biclusters found**; a run that finds none still gets its card, with those settings and a warning, so you can see what to change next. {#overview}

- **Overview – Variance explained.** The percentage of the matrix's variance the biclusters capture; under FABIA, as a note says, the share its own factorization captures – the same definition as the comparison table's [Var. Expl. (model, %)](#b-var-expl-model). {#overview-variance-explained}
- **Row coverage** – the percentage of cases that fall in at least one bicluster.
- **Column coverage** – the percentage of variables that do.
- **Cell coverage** – the percentage of the matrix's cells that do. Low cell coverage means the biclusters capture a small part of the data – a sparse structure, or too low a k; row and column coverage say whether some cases or variables are left out entirely.

#### Bicluster tables

- **Bicluster** – the bicluster a row or column describes, numbered as the algorithm returned them: a row of the summary and coherence tables, a **BC1**, **BC2**, … column of the membership tables, and a row and column of the overlap matrices.
- **Bicluster summary – Rows.** How many cases the bicluster holds.
- **Bicluster summary – Columns.** How many variables the bicluster spans.
- **Bicluster summary – Size.** The bicluster's cell count, rows × columns.
- **Bicluster summary – Mean value.** The mean of the bicluster's cells on the analysis matrix, headed **Mean value (z)** with a note when the run standardized, since the bicluster profiles report means on the original scale. {#bicluster-summary-mean-value #bicluster-summary-mean-value-z}
- **MSR** – the bicluster's [mean squared residue](./concepts/clustering.md#b-mean-squared-residue); lower is more coherent. Undefined, and shown as –, below two rows or two columns.
- **MSR / matrix MSR** – the bicluster's MSR over the whole matrix's: below 1 the block is more coherent than the matrix as a whole. MSR has no scale of its own, so this ratio is the column to read.
- **Case membership – Case.** The case's row number in the dataset.
- **Case membership – Count.** How many biclusters the case belongs to – 0 for a case no bicluster claims.
- **Variable membership – Count.** How many biclusters the variable belongs to.
- **Bicluster {n}** – in the bicluster profiles, each variable's mean within that bicluster, on the original scale; a variable outside the bicluster reads –.
- **Bicluster summary – Stability.** The bicluster's mean best-match Jaccard across the bootstrap resamples, a failed refit scoring 0; higher is better. With interpretation enabled an **Interpretation** column reads it against the [cluster stability bands](#b-cluster-stability-bootstrap-jaccard-interpretation). {#bicluster-summary-stability}
- **Coherence per bicluster – Avg r.** The average correlation over every pair of the bicluster's rows across its columns ([within-bicluster correlation](./concepts/clustering.md#b-within-bicluster-correlation)); higher is more coherent, and unlike MSR it ignores a difference in amplitude between rows. A row holding one value across the bicluster's columns correlates with nothing and is left out – a bracketed count, `(-2)`, says how many – and a bicluster left with fewer than two varying rows scores no r. {#coherence-per-bicluster-avg-r}
- **Variance of row means** – how much the bicluster's rows differ in level across its columns: a row effect inside the block.
- **Variance of column means** – the same for its columns.
- **Row overlap** – for each pair of biclusters, the Jaccard similarity of their case sets, 1 on the diagonal.
- **Column overlap** – the same for their variable sets.
- **Cell overlap** – the same for their cell sets – the quantity the comparison table reports as [Avg overlap](#b-avg-overlap). Two biclusters can share most of their rows and most of their columns and still barely intersect as blocks, as a note under the matrix says.

#### The heatmap

The heatmap draws the analysis matrix cell by cell on a diverging colour ramp – centred on zero when the run standardized, spanning the observed range otherwise – with a legend for the ramp and the bicluster colours. Hovering a cell shows its row, column, value and *every* bicluster that owns it. Past 320 rows the rows are sampled evenly and a note says how many of the total are drawn, and while they are sampled the row dendrogram is hidden, since its leaves would not line up with the drawn rows; past 8,000 drawn cells the per-cell tooltips are left off, and a note says that too.

### Warnings

The analysis generates warnings for potentially problematic results.

**Case and variable clustering:**

- **K-means did not converge** – the iteration limit was reached; raise it or the number of random starts
- **Unbalanced clusters** – one warning for the three views of the same problem: a smallest cluster under 5% of cases, one holding fewer than 10 observations, or a largest more than 10× the smallest. It names the smallest cluster's size and share and the largest-to-smallest ratio.
- **Low silhouette** – below 0.25 ("no substantial structure") or 0.25–0.50 ("weak structure")
- **Many negative silhouettes** – more than 10% of observations (or of variables, in variable mode) have negative silhouette values (likely in the wrong cluster)
- **Clusters that did not reproduce** – with stability enabled, how many fell below a mean Jaccard of 0.6 across resamples
- **Consensus disagrees** – with the consensus partition enabled, an adjusted Rand below 0.65
- **Single-variable clusters** (variable mode) – a cluster containing only one variable may not be meaningful

**Biclustering:**

- **Fewer biclusters than requested** – the algorithm returned less than k
- **Degenerate biclusters** – some have fewer than two rows or two columns, so neither MSR nor Avg r is defined for them
- **Heavy overlap** – the biclusters share more than 30% of their cells on average, so they largely repeat the same structure
- **Coverage too low** – under 25% of cells belong to any bicluster
- **Coverage too high** – over 90% of cells are covered, so the biclusters describe the matrix as a whole rather than local structure

Step 2's comparison card carries warnings of its own: no biclusters found at any k in the range, every k overlapping above 0.3, or stability requested but unmeasurable everywhere – in which case the suggested k quietly falls back to the variance-explained rule.

### Inserting results into the dataset

- **Insert cluster assignments into dataset** – at the foot of a case-clustering card: adds a categorical variable named after the algorithm and k (`Cluster_kmeans_k3`, `Cluster_pam_k3`, `Cluster_hierarchical_k3`) holding each case's cluster number; cases left out for missing data receive a missing value.
- **Insert bicluster memberships into dataset** – at the foot of a biclustering card: adds one variable per bicluster (`BC1_k3`, `BC2_k3`, …), 1 for a case in that bicluster and 0 otherwise.

Inserted variables can be used in further analyses – as grouping variables for [comparisons](./comparison-analysis.md), as predictors in [regression](./regression-analysis.md), or as group variables for [measurement invariance](./structural-equation-modeling.md#measurement-invariance-testing) testing.

## Missing data

Cluster analysis runs on complete cases only: a case blank on any variable that enters the run is left out of every step – the tendency tests, the comparison, the clustering and every diagnostic – whichever method the global [missing data setting](./settings.md#missing-data) names, since the setting's pairwise option is not offered here. The variables that enter are the ones the run keeps, so a non-numeric variable excluded under an ordinary metric drops no cases, while under Gower a blank categorical value does. With the setting on listwise deletion, the cases blank on any variable selected in the Variables dialog are already gone – a net at least as wide as the module's own; with imputation the blanks were filled before the module saw them and nothing is dropped. Every card's settings reports the complete cases out of the total, and a case left out receives a missing value when the cluster assignments are [inserted into the dataset](#inserting-results-into-the-dataset) – see [listwise deletion](./concepts/outliers-missing-data.md#b-listwise-deletion). If missingness is widespread, deselect the sparse variables rather than cluster a small remainder; imputation keeps every case, at the cost the [setting](./settings.md#missing-data) describes.

## Reporting checklist

Key things to include when writing up cluster analysis results:

**Method:**
- Clustering mode (case, variable, or biclustering)
- Algorithm used (K-means, K-medoids (PAM), Hierarchical, or which biclustering algorithm), with K-means' variant and number of random starts
- Distance metric (K-medoids and Hierarchical; K-means is Euclidean) and, for Hierarchical, the linkage method
- Under [Gower](#gower-and-mixed-type-data), which variables entered under which sub-type – the card's settings row gives you this, and an ordinal variable read as nominal is worth catching before it reaches print
- Whether variables were standardized (and why, e.g. different measurement scales)
- How the number of clusters was determined – which metrics were consulted (silhouette, gap statistic, elbow, dendrogram) and how conflicts were resolved
- Sample size and number of variables – the complete cases out of the total, and any variables excluded
- How missing data were handled
- The two seeds from **Settings**, if you report the run as reproducible

**Results:**
- Cluster tendency (Hopkins, Duda-Hart) if you report it as a precondition – case mode only, and not under Gower
- Number of clusters and cluster sizes
- Validity metrics – at minimum average silhouette width; consider also Calinski-Harabasz (not under Gower) and Davies-Bouldin
- Bootstrap stability per cluster, with the number of replicates, if the diagnostic was run
- The consensus partition's adjusted Rand and PAC, with the number of replicates, if it was run
- Cluster profiles (means per variable per cluster) – the core of interpretation
- Variance explained (between-cluster SS as percentage of total) – not produced under Gower
- If you show the [MDS plot](#multidimensional-scaling), the scaling method and its fit – the goodness-of-fit for classical, stress-1 for non-metric – since the picture is not interpretable without it
- If you show the [cluster biplot](#cluster-biplot), the share of variance on each axis and the fact that it is Gabriel's distance-preserving scaling – arrow length means a different thing under the other scaling
- Any [warnings](#warnings) the card printed – unbalanced clusters, a low silhouette or many negative ones, clusters that did not reproduce, a consensus that disagrees

**For biclustering:** report the algorithm, number of biclusters found, variance explained, cell coverage, and coherence – both MSR and Avg r, since they answer different questions. Include the membership table or heatmap, and the bicluster stability if it was run.

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. Cluster analysis uses base R functions (`kmeans`, `hclust`, `cmdscale` for classical scaling, and `prcomp` for the biplot) and the `cluster` package (for PAM, the silhouette, and `daisy` for the Gower dissimilarity); non-metric scaling uses `MASS::isoMDS`. The gap statistic and the optimal leaf ordering are computed in R by the module itself, which is what lets them honour the distance metric you chose. Biclustering uses the `biclust` package, plus `fabia` under FABIA. Citations appear automatically at the top of the output section and follow what the run did – the packages it loaded, the algorithm, linkage and metric, and each index, diagnostic and plot method only when it was computed – so the list can serve as the Method section's references. Clustering, the Hopkins and gap reference draws and the biclustering algorithms are seeded by [**Reproducibility seed**](./settings.md#reproducibility-seed) (default 42); the bootstrap diagnostics – cluster stability, the consensus partition, bicluster stability, and bicluster consensus scoring – by [**Bootstrap seed**](./settings.md#bootstrap-seed), empty by default, so you can vary one without the other; an empty seed draws fresh randomness each run. The reasoning behind the module's bounds, refusals, fallbacks and package arguments is in its [method notes](./methods/cluster-analysis.md).

## Common pitfalls

Cluster analysis is exploratory by nature – it will always produce clusters, whether or not they're meaningful. Keep these points in mind:

**Clusters always exist – even in random data.** K-means will partition random noise into k groups and report cluster centers with a straight face. A [Hopkins statistic](./concepts/clustering.md#b-the-hopkins-statistic) near 0.5, a low [silhouette](./concepts/clustering.md#b-the-silhouette) (below 0.25), clusters that fall below a mean Jaccard of 0.6 under the [bootstrap](#cluster-stability), or a [consensus partition](#consensus-partition) that regroups the same cases differently are signs that the "clusters" may not reflect real structure. Check the [cluster tendency](#cluster-tendency) and validity output before interpreting.

**Results depend on the method.** K-means, K-medoids (PAM) and Hierarchical can produce different clusterings from the same data. Different linkage methods within Hierarchical can produce different clusterings. Different distance metrics can produce different clusterings. If your clusters only appear with one specific combination of settings, they may not be robust. Try multiple approaches and look for consistent patterns.

**Too many variables can hurt.** With many variables, distances become dominated by noise – every observation looks equally far from every other one (the "curse of dimensionality"). If you have 50 variables, consider reducing them first with [factor analysis](./factor-analysis.md) or [PCA](./factor-analysis.md#extraction-method) and clustering on the factor or component scores instead.

**Don't test cluster differences on clustering variables.** If you cluster people using anxiety and depression scores, then run a t-test asking "do the clusters differ on anxiety?" – of course they do, you *made* them differ. Testing whether clusters differ on the variables used to create them is circular. That is why the variable contribution table labels its F statistic descriptive only. Instead, validate clusters against *external* variables not used in the clustering (e.g. cluster on personality items, then check whether clusters differ on job performance).

**Clusters might be arbitrary cuts of a continuum.** Not all data has natural groups. Depression scores might form a smooth gradient from low to high rather than distinct "depressed" and "not depressed" clusters. Forcing this into two clusters creates an artificial boundary. A well-known example of this debate is personality typology: researchers have clustered Big Five scores into types like "resilient," "overcontrolled," and "undercontrolled" – but the Big Five dimensions themselves are continuously and normally distributed, so the "types" may simply be regions of a smooth space rather than natural categories. Check whether the silhouette plot shows clear separation or a muddy overlap.

**Cluster labels are interpretations.** Same caveat as [factor naming](./factor-analysis.md#common-pitfalls) – calling a cluster "Resilient High-Achievers" because it has above-average scores on several positive traits is your interpretation. Report the actual profile means so readers can judge for themselves.

**Sample-specific solutions.** Cluster structures are sensitive to sample composition. A 3-cluster solution in your sample might not replicate in a different population. Run the [cluster stability](#cluster-stability) diagnostic, and if possible split your data and check whether the same clusters emerge in both halves.
