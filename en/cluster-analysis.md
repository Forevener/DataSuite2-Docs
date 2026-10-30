---
title: Cluster analysis
description: K-means, K-medoids, hierarchical, mixture, fuzzy and density-based (DBSCAN, HDBSCAN) clustering, biclustering, silhouettes and stability in DataSuite 2.
---

# Cluster analysis

The **Cluster analysis** module groups observations, variables, or both into clusters based on similarity. It supports three modes – case clustering, variable clustering, and biclustering – with multiple algorithms per mode. A three-step workflow walks you through choosing a method, finding the optimal number of clusters – or, for the density-based methods, their density settings – and running the full analysis with validity metrics and visualizations. {#cluster-analysis #cluster-analysis-results #variable-cluster-analysis-results #cluster-solution-comparison #variable-cluster-solution-comparison #biclustering-results #bicluster-solution-comparison}

> **What is cluster analysis?** It finds groups of cases that resemble each other without being told what the groups are – [clustering](./concepts/clustering.md#b-clustering) explains the idea, and [a cluster solution](./concepts/clustering.md#b-a-cluster-solution) what the result can and cannot claim.

1. [Select your variables](./getting-started.md#choosing-variables) (at least 2 – numeric, or mixed types under [Gower](#gower-and-mixed-type-data))
2. Choose a [clustering mode and algorithm](#step-1-method-settings)
3. Set the [cluster range](#step-2-determine-optimal-k) and click **Analyze & determine k** to find the best number of clusters – under DBSCAN, **Draw k-distance plot** to choose eps
4. Set k (eps under DBSCAN, nothing under HDBSCAN), toggle [validity metrics and output options](#step-3-run-full-analysis)
5. Click **Run cluster analysis** (or **Run biclustering analysis**)

## Requirements

At least 2 variables must be selected, and by default they must be numeric – non-numeric variables are automatically excluded and listed in the output. The exception is the [Gower metric](#gower-and-mixed-type-data), which scores categorical and ordinal variables directly and so keeps them in the analysis. Either way, variables that turn out to be constant across the complete cases are dropped too, and listed as such – at least two of the selected variables must actually vary.

k must also be smaller than the number of objects being clustered: fewer than the variables in variable mode, and fewer than the complete cases in case mode, where every k in a Step 2 range is held to the same bound. **Fuzzy (FANNY)** is held lower still, to fewer clusters than half the objects – at most n/2 − 1, rounded down, for n objects – and a k or a Step 2 maximum above that is refused with a message naming the bound. DBSCAN and HDBSCAN take no k: their **Minimum points (minPts)** must be a whole number of at least 2 and no more than the complete cases, and DBSCAN's eps must be above 0. Biclustering needs at least two complete cases and at least as many as the biclusters asked for, and FABIA cannot be asked for more biclusters than there are variables. Every number field is checked against its own minimum and maximum, and a count field – k, a range bound, iterations, replications, a size minimum – takes whole numbers only: a value outside the range, a decimal in a count or an emptied field is flagged beside the field and blocks the step that reads it until corrected. Only the fields on screen for the chosen algorithm and options count.

## Step 1: Method & settings

### Clustering mode

- **Clustering mode** – what the objects to be grouped are: rows, columns, or blocks of both ([clustering cases, variables or both](./concepts/clustering.md#b-clustering-cases-variables-or-both)). The choice switches the algorithm list and the Step 2 and Step 3 panels.
- **Case clustering** – groups the rows (observations) on the selected variables: "what types of participants are in my data?"
- **Variable clustering** – groups the columns: "which of my variables behave similarly?" – an alternative to [factor analysis](./factor-analysis.md) for finding sets of variables that move together. The variables are standardized, the matrix is transposed, and the dissimilarity is computed between the variables' profiles across the cases; the two [correlation dissimilarities](#distance-metric) are the established choice here.
- **Biclustering** – groups rows and columns at once, finding subsets of observations that are similar on a subset of variables – for a structure that does not span every variable ([a bicluster](./concepts/clustering.md#b-a-bicluster)). Its algorithms and settings are [below](#biclustering-algorithms).

### Standardization

- **Standardization** – how the values are rescaled before the distances are computed: per variable, so that no variable dominates because its numbers happen to be bigger ([standardization before clustering](./concepts/clustering.md#b-standardization-before-clustering)), per case, so that cases are compared on the pattern of their values rather than their level, or not at all. In **Variable clustering** it is locked to **Per variable (z-scores)**, since a correlation is defined on standardized columns; under **Gower (mixed types)** it is locked to **None**, since Gower divides each numeric variable by its own range as part of its definition. A note under the select says which lock applies, and your own choice returns when it lifts. Under **Gaussian mixture (model-based)** the choice decides more than the scale: rescaling the variables leaves some covariance models' fit unchanged and changes the others', so it can change which model BIC prefers, and with it the clusters – a note under the select says so. Every output card names the choice that ran in a **Standardization** row of its settings, biclustering's included.
- **None** – the values as they stand: for variables that share one common, meaningful scale and whose differing spreads are part of what you want to cluster on. [Canberra](#b-canberra) needs it. {#standardization-none}
- **Per variable (z-scores)** – default; every variable is centred on its mean and divided by its standard deviation, so each enters the distances on the same footing.
- **Per case: centre** – each case's mean across the variables is subtracted from its values, so cases are grouped by the shape and spread of their profile rather than its level: two respondents who rise by the same amount from different starting points land together.
- **Per case: profile** – each case is divided by its Euclidean norm, the square root of its summed squared values, so cases are grouped by the proportions between their values rather than their size. A case whose every value is 0 has no profile: it is left out of the run and listed under [Cases excluded (every value 0, so no profile)](#b-cases-excluded-every-value-0-so-no-profile).

The two per-case entries read a case's values as one profile across the variables, so they suit variables measured on one scale – the waves of a repeated measure, the items of one questionnaire; [clustering trajectories](#clustering-trajectories) says which to choose. They are offered in case mode only, and are dropped from the select under **1 − r (correlation)** and **1 − |r| (absolute correlation)**, which already ignore each case's level and spread – a note under the select says so; a per-case choice withdrawn this way falls back to **Per variable (z-scores)**. Under a Gaussian mixture, centred cases leave the eight ellipsoidal covariance models unfittable, so the model table shows them without a BIC and the best of the other six is fitted.

### Algorithms for case and variable clustering

- **Clustering algorithm** – how the clusters are built: K-means and K-medoids partition the objects into a fixed k, Hierarchical builds a tree and cuts it at k, a Gaussian mixture fits a probability model of k components, FANNY gives every object a graded membership in each of k clusters, and the two [density-based](./concepts/clustering.md#b-clustering-by-density) methods grow clusters out of dense regions, find their number themselves and leave the cases in no dense region as [noise](./concepts/clustering.md#b-a-noise-case). All seven assume the selected variables are relevant to the grouping – irrelevant variables add noise and degrade cluster quality.
- **K-means** – default; assigns each case to the nearest cluster centre and recomputes the centres until nothing moves ([k-means clustering](./concepts/clustering.md#b-k-means-clustering)). Fast, scales well and suits well-separated, roughly spherical clusters of similar size on continuous variables; it minimises within-cluster variance, so it struggles with elongated, ring-shaped or very unequal clusters. It works in Euclidean distance and cannot honour another metric, so **Distance metric** is hidden under it in case mode and pinned to **Euclidean** in variable mode; a **Gower (mixed types)** choice made under another algorithm is set aside while K-means is selected, so the run is Euclidean and leaves the categorical variables out. Its random starts are seeded by the reproducibility seed in **Settings**.
- **K-medoids (PAM)** – like K-means, but the centres are actual cases – [medoids](./concepts/clustering.md#b-a-medoid) – so it runs on any distance metric, Gower included, and is more robust to outliers, since a far-out case cannot drag a medoid as it drags a mean. It has no settings of its own beyond the metric.
- **Hierarchical** – builds a tree ([a dendrogram](./concepts/clustering.md#b-a-dendrogram)) by progressively merging the most similar objects, and cuts it at k. It makes no distributional assumptions, but the **Linkage method** strongly shapes the result. Best for exploring the cluster structure at several levels on small to medium datasets, and when the cluster shapes may not be spherical.
- **Gaussian mixture (model-based)** – treats the data as drawn from k overlapping normal distributions, the mixture's *components*, and fits them by maximum likelihood with the `mclust` package; each case gets a *posterior probability* of belonging to each component and is assigned to the most probable one. Each component's spread is described by a covariance model – spherical, diagonal or ellipsoidal, with equal or varying volume, shape and orientation – and all fourteen models are fitted at every k, BIC choosing the model and k together. It suits clusters that are elliptical, tilted or unequal in spread, where k-means' round clusters fit badly. It reads the variables' values themselves, so **Distance metric** is hidden under it; it is offered in case mode only: **Variable clustering** drops it from the list, with a note, and a mixture already chosen falls back to **K-means**.
- **Fuzzy (FANNY)** – Kaufman and Rousseeuw's fuzzy analysis: instead of one label, each object gets a *membership* in every cluster, between 0 and 1 and summing to 1, so an object sitting between two groups shows as such rather than being forced into one. It works on the dissimilarity like K-medoids – any metric, Gower included, and in variable mode as well – and its partition is each object's largest membership. How soft the memberships are is set by **Membership exponent**.
- **Density-based (DBSCAN)** – Ester and colleagues' density-based clustering: a case with at least **Minimum points (minPts)** cases within **Neighbourhood radius (eps)** of it, itself included, is a [core point](./concepts/clustering.md#b-a-core-point); core points within eps of one another form one cluster, a case within eps of a core point joins its cluster as a [border point](./concepts/clustering.md#b-a-border-point), and every other case is *noise*, in no cluster. There is no k – the number of clusters is whatever the density set by [eps and minPts](./concepts/clustering.md#b-eps-and-minpts) yields – and a cluster can take any shape, elongated, curved or nested, as long as it is denser than the space around it. It works on the dissimilarity, any metric and Gower included, and is offered in case mode only; Step 2 helps choose eps rather than k – see [density-based clustering](#density-based-clustering-dbscan-and-hdbscan).
- **Density-based, hierarchical (HDBSCAN)** – Campello, Moulavi and Sander's extension of DBSCAN: instead of one eps it builds the clusters at every density level – a [density hierarchy](./concepts/clustering.md#b-a-density-hierarchy) – and keeps the most stable ones, so it finds clusters of different densities and takes **Minimum points (minPts)** alone. Like DBSCAN it leaves the cases in no dense region as noise, takes any metric, Gower included, and is offered in case mode only; it adds a membership strength and an outlier score per case and an optional [condensed cluster tree](#b-condensed-cluster-tree).

> **Which algorithm?** K-means for speed on well-separated, round clusters; K-medoids when outliers or a non-Euclidean metric matter, or when you want real cases as cluster centres; Hierarchical to read the structure off a tree before fixing k; a Gaussian mixture for elliptical or unequal clusters and a probability per case; FANNY when objects between groups should show as such; DBSCAN when clusters may take any shape and some cases may belong to none, HDBSCAN when their densities differ too – [the algorithms](./concepts/clustering.md#the-algorithms) explains K-means, K-medoids and Hierarchical, [density-based clustering](./concepts/clustering.md#density-based-clustering) DBSCAN and HDBSCAN.

**K-means settings:**

- **K-means algorithm** – which of R's four k-means variants runs. All four minimise the same within-cluster sum of squares and usually agree; they differ in how the centres are updated.
- **Hartigan-Wong** – default; moves single cases between clusters whenever the move lowers the within-cluster sum of squares, and is the variant R's authors recommend.
- **Lloyd** – the textbook batch algorithm: assigns every case to the nearest centre, then recomputes all centres, until the assignment stops changing.
- **Forgy** – the same batch procedure under its other name; R runs the two identically.
- **MacQueen** – updates the two centres involved each time a single case is reassigned, rather than every centre after a full pass.
- **Number of random starts** – default 25, from 1 to 100: how many random starting sets of centres are tried; the run with the lowest within-cluster sum of squares is kept. Higher values reduce the chance of a suboptimal solution.
- **Maximum iterations** – default 100, from 10 to 1,000: the pass limit per start. When the algorithm runs out of passes without converging, a warning on the card names the limit it stopped at and, with interpretation enabled, suggests raising it or the number of starts; a run that converges on its last allowed pass is not flagged. Step 2 holds every k's fit to the same limit and marks the ones that stop at it – see the [comparison table](#comparison-table).

**Hierarchical settings:** the distance metric plus a linkage.

- **Linkage method** – how the distance between two *clusters* is measured from the distances between their members ([linkage](./concepts/clustering.md#b-linkage)); it decides the shape of the clusters that form. Two warnings guard the choice: Ward's assumes Euclidean distances, so it is flagged under another metric (Minkowski at p = 2 counts as Euclidean), and Centroid and Median are not monotone – a merge can sit below the pair it joins – so a warning says their dendrogram can show inversions, and a note on the plot reports them when they occur.
- **Ward's (D2)** – default; merges the pair whose union increases the total within-cluster variance the least ([Ward's method](./concepts/clustering.md#b-wards-method)) – compact, roughly equal-sized clusters. Assumes Euclidean distances.
- **Complete** – the distance between two clusters is the largest distance between any two of their members ([complete linkage](./concepts/clustering.md#b-complete-linkage)) – compact clusters, sensitive to outliers.
- **Average (UPGMA)** – the mean of all pairwise distances between the two clusters' members ([average linkage](./concepts/clustering.md#b-average-linkage)) – moderate-sized, balanced clusters.
- **Single** – the smallest distance between any two members ([single linkage](./concepts/clustering.md#b-single-linkage)) – long, chain-like clusters: good for detecting elongated shapes, prone to "chaining".
- **Centroid (UPGMC)** – the distance between the two clusters' centroids ([centroid linkage](./concepts/clustering.md#b-centroid-linkage)); can produce inversions in the dendrogram.
- **Median (WPGMC)** – like Centroid, but weights the two merged clusters equally regardless of size; can produce inversions too.
- **McQuitty (WPGMA)** – like Average, but weights the two merged clusters equally regardless of size ([McQuitty's linkage](./concepts/clustering.md#b-mcquittys-linkage)).

**FANNY settings:**

- **Membership exponent** – default 2, strictly between 1 and 3, in steps of 0.1: how soft the memberships are. Near 1 they approach a hard partition, each object almost wholly in one cluster; larger values spread each object's membership more evenly across the clusters, and too large a value flattens every membership to 1/k – a fit that finds no partition at all (see [warnings](#warnings)). 2 is Kaufman and Rousseeuw's value. Step 2's comparison fits every k with the same exponent.

**DBSCAN settings:**

- **Minimum points (minPts)** – how many cases, the case itself included, must lie within eps of a case to make it a core point; a whole number of at least 2, and no more than the complete cases. Under DBSCAN it starts at twice the number of selected variables, at least 4, and follows that count until you edit it; a larger value asks for denser clusters and leaves more cases as noise. Under HDBSCAN the same field defaults to 5 whatever the variables and does two jobs: the neighbour count that sets each case's density, and the smallest group reported as a cluster. Eps itself is set in Step 3, after the [k-distance plot](#b-k-distance-plot).

**HDBSCAN settings:** the [Minimum points (minPts)](#b-minimum-points-minpts) field alone, default 5. There is no eps and no minimum cluster size apart from it.

### Distance metric

- **Distance metric** – how far apart two objects are on the selected variables together ([distance](./concepts/clustering.md#b-distance)). In case mode the select is shown for **K-medoids (PAM)**, **Hierarchical**, **Fuzzy (FANNY)** and the two density-based methods, and hidden under **Gaussian mixture (model-based)**, which reads no metric; in variable mode it stays visible under K-means as well, offering **Euclidean** alone, since there the metric is what "similar variables" means.
- **Euclidean** – default; the straight-line distance ([Euclidean distance](./concepts/clustering.md#b-euclidean-distance)) – the choice for continuous data.
- **Manhattan** – the sum of absolute differences ([Manhattan distance](./concepts/clustering.md#b-manhattan-distance)) – less sensitive to a single large difference than Euclidean.
- **Maximum (Chebyshev)** – the largest single-variable difference ([Chebyshev distance](./concepts/clustering.md#b-chebyshev-distance)) – when one big discrepancy should decide.
- **Canberra** – the sum of relative differences ([Canberra distance](./concepts/clustering.md#b-canberra-distance)) – for counts and non-negative data, where small values matter proportionally. It is defined for values at or above zero, so run it with **Standardization** at **None**.
- **Minkowski** – the family Manhattan and Euclidean belong to ([Minkowski distance](./concepts/clustering.md#b-minkowski-distance)), with the exponent set by **Minkowski exponent (p)**.
- **Minkowski exponent (p)** – default 2, at least 1, in steps of 0.5: p = 1 is Manhattan, p = 2 is Euclidean, and larger values approach the Maximum. At p = 2 the metric counts as Euclidean for Ward's warning.
- **1 − r (correlation)** – one minus the correlation between two profiles ([correlation as a dissimilarity](./concepts/clustering.md#b-correlation-as-a-dissimilarity)) – in variable mode, groups variables that rise and fall together and keeps oppositely-signed ones apart.
- **1 − |r| (absolute correlation)** – one minus the absolute correlation – groups variables that measure the same thing regardless of polarity, which is usually what reverse-keyed questionnaire items need. Both correlation dissimilarities are the established choice in **Variable clustering**, and are offered in case mode for K-medoids and Hierarchical too: there they compare the *shape* of a case's profile across the variables rather than its level, so they need columns measured on a comparable scale, and under 1 − |r| a profile and its mirror image count as identical – see [clustering trajectories](#clustering-trajectories).
- **Gower (mixed types)** – each variable scored on its own scale, then averaged across the variables ([Gower's coefficient](./concepts/clustering.md#b-gowers-coefficient)) – the only metric that admits categorical and ordinal variables. Choosing it changes four things, [below](#gower-and-mixed-type-data).

#### Gower and mixed-type data

Every other metric here is a distance between rows of numbers, which is why non-numeric variables are excluded before the data ever reaches R. **Gower (mixed types)** is the exception: it scores each variable on its own scale – a range-normalized absolute difference for numeric variables, a rank-based comparison for ordinal ones, and match-or-no-match for categorical ones – then averages across the variables, so a categorical variable enters the clustering instead of being dropped from it. Choosing it changes four things. Categorical and ordinal variables are kept: they are no longer listed as excluded, and each variable's Gower sub-type – interval, nominal or ordinal – is reported as a **Gower variable types** row on the output card, which is worth reading, since the sub-type decides how the variable was compared and an ordinal variable treated as nominal has its ordering silently discarded. **Standardization** is set to **None** and locked, for the reason given [above](#standardization). K-means and the Gaussian mixture cannot use it – K-means needs centroids in Euclidean space and the mixture reads no metric – so choosing either hides **Distance metric** and runs on Euclidean distance with the categorical variables left out again; PAM, Hierarchical, FANNY, DBSCAN and HDBSCAN take a dissimilarity directly and use Gower as chosen, and variable clustering withdraws the metric. And the centroid-based outputs are left off: within SS, between-cluster SS, variance explained, Calinski-Harabasz, Hartigan, Hopkins, Duda-Hart, the gap statistic, the elbow plot and the [cluster biplot](#cluster-biplot) are not produced, and a note on the card says so rather than leaving them quietly missing; Davies-Bouldin stays, computed from cluster medoids instead of means, and silhouette, Dunn, the cophenetic correlation, bootstrap stability and the consensus partition read the dissimilarity directly and are unaffected, while [DBCV](./concepts/clustering.md#b-the-dbcv-index), which reads density through the data's dimension, is not offered. Cluster profiles and medoids report a modal level where a mean is undefined, and the variable contribution table leaves a categorical variable's F-statistic and Eta² empty and says so.

> **When is Gower the right call?** When at least one variable you want to cluster on is genuinely categorical – a diagnosis, a treatment arm, a region – and dropping it would change what the clusters mean; with all-numeric variables the ordinary metrics are better behaved and give the full validity table back – see [Gower's coefficient](./concepts/clustering.md#b-gowers-coefficient).

#### Clustering trajectories

To cluster respondents measured on one scale over a few occasions – a score at each of three or four waves – select one column per wave and cluster in case mode. What the clusters group the trajectories by follows from the distance metric and the [standardization](#standardization):

- Under **Euclidean** with **None**, by level: high trajectories against low ones, the standard reading of a few repeated measurements. Trajectories at a similar level but with different slopes can share a cluster. The default **Per variable (z-scores)** rescales each wave on its own, which removes the sample's change from wave to wave, so set **None** when every wave is on one scale.
- Under **Euclidean** with **Per case: centre**, by shape and spread, each trajectory's own mean removed; with **Per case: profile**, by the proportions between its waves.
- Under **1 − r (correlation)**, by shape alone, level and spread dropped. With three or four waves the correlation between two trajectories says little more than its sign, and a respondent with the same score at every wave has no correlation at all.
- Under **1 − |r| (absolute correlation)**, a rising trajectory and its falling mirror image count as identical, so it is not for trajectories – it is meant for reverse-keyed items in variable mode.

Groups that differ by slope rather than level are what model-based growth clustering finds, which Time series fits as [growth mixture models](./time-series-analysis.md#growth-mixture-models), one person per group of its grouping variable; Time series also clusters whole series of 20 points or more on an elastic distance, under [Cluster series](./time-series-analysis.md#cluster-series).

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

Before running the full analysis, this step compares solutions across a range of cluster counts to help you choose k – or, under DBSCAN and HDBSCAN, which take no k, [the density settings](#density-based-clustering-dbscan-and-hdbscan).

### Standard clustering (case / variable modes)

Set the **Cluster range to test** and click **Analyze & determine k**. Every k in the range is clustered with the Step 1 settings and scored on the indices you leave on, one row per k.

- **Minimum** – the smallest count tested, default 2. It can be 1, in which case the k = 1 row describes the unpartitioned data. Under **Bicluster range to test** it is the smallest number of biclusters, with the same default.
- **Maximum** – the largest count tested, default 10. It must stay below the number of objects – the variables in variable mode, the complete cases in case mode – and a maximum at or below the minimum is refused with a message when you run the comparison, since a comparison needs a range. Under **Bicluster range to test** it is the largest number of biclusters, with the same default.

Under **Validity metrics**, each index you leave on is recomputed for every k in the range and becomes a column of the [comparison table](#comparison-table) – switching off the ones you will not read is what makes a wide range affordable. The same four checkboxes return in Step 3, where each is a row of the validity table.

- **Silhouette analysis** – the average silhouette width: how much closer each object sits to its own cluster than to the nearest other, averaged over the objects, from −1 to +1 ([the silhouette](./concepts/clustering.md#b-the-silhouette)). Higher is better – above 0.50 reasonable, above 0.70 strong. On by default; its column is headed **Silhouette**, it is what **Suggested k (silhouette)** reads, and switching it off withdraws the silhouette plot and that suggestion too. {#silhouette-analysis #solution-comparison-silhouette}
- **Calinski-Harabasz index** – between-cluster against within-cluster variation, each divided by its degrees of freedom ([the Calinski–Harabasz index](./concepts/clustering.md#b-the-calinski-harabasz-index)); higher is better. On by default; its column is headed **Calinski-Harabasz**. It is computed from cluster means, and is withdrawn under [Gower](#gower-and-mixed-type-data). {#calinski-harabasz-index #solution-comparison-calinski-harabasz}
- **Davies-Bouldin index** – each cluster's scatter set against its nearest neighbour's, averaged over the clusters ([the Davies–Bouldin index](./concepts/clustering.md#b-the-davies-bouldin-index)); lower is better. On by default; its column is headed **Davies-Bouldin**. It is measured in the selected distance metric, and from cluster medoids rather than means under Gower. {#davies-bouldin-index #solution-comparison-davies-bouldin}
- **Dunn index** – the smallest dissimilarity between two clusters over the largest within one ([the Dunn index](./concepts/clustering.md#b-the-dunn-index)); higher is better, and a single outlying object can move it a long way. Off by default; its column is headed **Dunn**. {#dunn-index #solution-comparison-dunn}

Under **Output options**, up to four plots are drawn beside the table:

- **Show elbow plot (within-cluster SS)** – on by default: the total within-cluster sum of squares against k, with a ring on the elbow – the k furthest from the straight line joining the first and last points – or a note that the curve bends too little to mark one ([the elbow method](./concepts/clustering.md#b-the-elbow-method)). Not drawn under Gower. {#show-elbow-plot-within-cluster-ss #elbow-plot-within-cluster-ss}
- **Show silhouette plot** – on by default, and offered while **Silhouette analysis** is on: the average silhouette width against k, the best k highlighted and, with interpretation enabled, guides at 0.25, 0.50 and 0.70 separating weak, reasonable and strong structure. {#show-silhouette-plot #silhouette-score-by-k}
- **Compute gap statistic (slower)** – on by default: how much tighter the clusters are than those of 100 uniform reference samples, at every k, measured with the dissimilarity the run clusters on ([the gap statistic](./concepts/clustering.md#b-the-gap-statistic)). It adds the **Gap** column, the plot and **Suggested k (gap statistic)**. On the plot the bars span ±1 SE, and with interpretation enabled the highlighted k is the one Tibshirani's rule picks – the smallest k whose gap reaches the next k's gap less its standard error – which is not always the plain maximum; when the rule's k lies outside the range tested, nothing is highlighted and a note says so. With interpretation off, no k is highlighted. Not computed under Gower, and under **Gaussian mixture (model-based)** the box is disabled, with a note saying why. If the computation fails, the Gap column reads N/A and R's message is printed under the table and in place of the plot. {#compute-gap-statistic-slower #gap-statistic-by-k}
- **Show dendrogram** – Hierarchical only, on by default: the full tree with a draggable cut line – see [reading the dendrogram](#reading-the-dendrogram). It follows Step 3's **Optimize leaf ordering**, so both steps draw the same tree.

#### Cluster tendency

**Cluster tendency.** In case mode the card opens by asking whether the data look clustered at all – the check that comes before "how many?", since every algorithm returns clusters, including on data that has none ([clustering tendency](./concepts/clustering.md#b-clustering-tendency)). Both tests are Euclidean whatever the metric, with a note saying so under another; neither is reported in variable mode or under Gower. {#cluster-tendency}

- **Hopkins statistic** – how much closer the objects sit to one another than points drawn uniformly over the data's bounding box would ([the Hopkins statistic](./concepts/clustering.md#b-the-hopkins-statistic)), in Cross and Jain's form, which raises each nearest-neighbour distance to the number of variables: 0.5 is what random data gives, and values towards 1 mean clustering. Its p-value is one-sided: significant at the [significance level](./settings.md#significance-level) reads *Clustering tendency*, otherwise *Spatial randomness is not rejected*. A note under the table names how many points were drawn against how many of the objects; below 20 objects too few can be drawn for the p-value, which is then left out and the note says why.
- **Duda-Hart Je(2)/Je(1)** – the within-cluster sum of squares of the selected algorithm's two-cluster solution over the total sum of squares ([the Duda–Hart test](./concepts/clustering.md#b-the-duda-hart-test)), with a one-sided p-value read at Milligan and Cooper's critical z = 3.20 (α ≈ 0.0007) rather than at the significance level, as a note under the table says: significant at that level reads *Two clusters beat one*, otherwise *One cluster is not rejected*, and the p cell is highlighted at the same level.
- **Cluster tendency – Value** – the test's statistic: the Hopkins ratio on its row, Je(2)/Je(1) on the Duda-Hart row.

The readings fill the **Interpretation** column when interpretation is enabled in [Settings](./settings.md#significance-formatting).

#### Comparison table

**Solution comparison.** One row per k tested and one column per index – the heading of the standard and the [biclustering](#bicluster-comparison-table) comparison alike. With [interpretation](./settings.md#b-show-interpretation-column-when-applicable) enabled, green marks the best value in a column, and a note under the table says what else is marked. {#solution-comparison}

- **k** – the count the row describes. Click it to carry that k into Step 3's **Number of clusters (k)** field – or, on a biclustering card, **Number of biclusters (k)** – instead of retyping it, with a toast confirming the new value.
- **Within SS** – the total within-cluster sum of squares ([within-cluster dispersion](./concepts/clustering.md#b-within-cluster-dispersion)); lower means tighter clusters, but it falls with every cluster added, so it carries no best mark.
- **Variance explained (%)** – the share of the total sum of squares lying between the clusters rather than within them; it rises with every cluster added, so it carries no best mark either. {#solution-comparison-variance-explained}
- **Smallest cluster** – the member count of the smallest cluster, so a solution that only splits off a handful of objects stands out.
- **Largest cluster** – the member count of the largest cluster.
- **Gap** – the gap statistic at each k; higher means tighter than the reference, and with interpretation enabled the green mark sits on the k the 1-standard-error rule picks, matching **Suggested k (gap statistic)** rather than the column's maximum.
- **Hartigan** – Hartigan's index comparing each k with the next ([Hartigan's rule](./concepts/clustering.md#b-hartigans-rule)); a value above 10, highlighted in yellow with interpretation enabled, says another cluster is still worth adding. The last row reads N/A, having no next k to compare with.
- **BIC** – under **Gaussian mixture (model-based)**, the Bayesian information criterion of the row's model as `mclust` reports it, twice the log-likelihood less a penalty per parameter, so *larger* is better – the reverse of the BIC other modules print, as a note under the table says. With interpretation enabled green marks the largest. In the model section of Step 3 and on the BIC plot it is the same quantity, model by model.
- **Model** – the covariance model with the largest BIC at that k, by `mclust`'s three-letter code: the letters fix each component's volume, shape and orientation as Equal, Varying or Identity, and a note under the table names every code shown in words (VEV – *ellipsoidal, equal shape*). A one-component row is named X…, having nothing to vary. In Step 3's model table it heads the fourteen rows, one per model.
- **ICL** – the integrated completed likelihood: BIC less a penalty for how uncertain the classification is, so it prefers well-separated components where BIC may split one cluster into several. Larger is better, the largest over every model at that k; with interpretation enabled green marks the largest.
- **F(k)** – under **Fuzzy (FANNY)**, Dunn's partition coefficient: the mean squared membership, 1/k when every object's membership is spread equally over the clusters and 1 for a hard partition; **F′(k)** beside it rescales it to run from 0 (entirely fuzzy) to 1 (hard). Both describe how fuzzy the memberships are, not how good the partition is, so neither carries a best mark. {#fk #dunns-partition-coefficient-fk #normalized-fk}

The **Silhouette**, **Calinski-Harabasz**, **Davies-Bouldin** and **Dunn** columns are the [validity metrics](#b-silhouette-analysis) you left on. When the range starts at 1, the separation indices need at least two clusters and read N/A on the k = 1 row.

Within SS, variance explained, Calinski-Harabasz and Hartigan are computed under Euclidean geometry whatever metric you selected – when you pick another metric, a note under the table says so. The Gap statistic itself is computed on the dissimilarity you chose, but its reference sample is drawn uniformly, which is not a structureless null for `1 − r` or `1 − |r|`; a second note says so under those two metrics. Under [Gower](#gower-and-mixed-type-data) those four columns and the Gap column are left out of the table altogether, since mixed types give no centroid to compute them from.

Under K-means every k's fit is checked for convergence, as the Step 3 run is ([iteration limit](./reading-results.md#b-iteration-limit)). A k whose fit stopped at the **Maximum iterations** limit has its row shaded red, a note under the table names the limit and those k values, and with interpretation enabled the shaded rows take no green mark and no suggested k – with no k converged, nothing is marked. The gap statistic runs k-means fits of its own, to the data and to each of its 100 reference sets: a Gap value resting on one that stopped short carries a †, and a note names the k values, whether the fit to the data stopped and how many reference sets did. Such a k keeps its gap and its place in the 1-standard-error rule.

Under a Gaussian mixture each row holds its best-BIC model's fit, and the size, sum-of-squares and validity columns read that fit's partition – each case in its most probable component. Under FANNY they read each object's largest membership. A FANNY fit that stopped at its iteration limit is shaded red like a stopped k-means fit, and so is a k whose memberships all collapsed to about 1/k – a fit that found no partition, whose largest memberships are an arbitrary tie-break; a note names those k and the membership exponent, and with interpretation enabled suggests a lower exponent. Shaded rows take no green mark and no suggested k.

**BIC by covariance model and k.** Under a Gaussian mixture a plot is drawn beside the table: one line per covariance model across the range, so you can see whether one model leads throughout or the lead changes with k, and, with interpretation enabled, a ring on the model and k that BIC prefers. A model that could not be fitted at some k has no point there.

With [interpretation](./settings.md#b-show-interpretation-column-when-applicable) enabled, suggestions show below the table:

- **Suggested k (silhouette)** – the k with the highest average silhouette, while **Silhouette analysis** is on, skipping any k whose k-means or FANNY fit did not converge or collapsed. Not given under a Gaussian mixture, where BIC makes the pick and the silhouette stays a column to cross-check it.
- **Suggested k and model (BIC)** – under a Gaussian mixture, the k and covariance model with the largest BIC over the whole range – the fit Step 3 reproduces at that k.
- **Suggested k and model (ICL)** – the same pick by ICL. When it names a smaller k than BIC, BIC is probably using several components to describe one cluster that is not normal in shape; when the two agree, the pick is the safer.
- **Suggested k (gap statistic)** – the k the 1-standard-error rule picks: the smallest k whose gap reaches the next k's gap less its standard error. When the rule picks k = 1, the card says the gap statistic favours no cluster structure instead of naming a k; when it picks a k whose k-means fit did not converge, no gap suggestion is given.

A suggestion is the best of the range, which says nothing about whether the range holds structure at all – so if no k exceeds a silhouette of 0.25, a caveat under the suggestions spells that out with the best score found.

> **Metrics disagree – which one do I trust?** They usually do, since each index measures something different; treat the table as a shortlist and choose among its top two or three k by interpretability and stability – see [when the indices disagree](./concepts/clustering.md#b-when-the-indices-disagree).

#### Reading the dendrogram

The dendrogram in Step 2 is interactive. Drag the cut line to see how the tree splits at different k, then **click the cut line** to send that k straight to Step 3 – or, with interpretation enabled, use the **Move the cut to the suggested k** button to jump to the silhouette suggestion. Cluster numbering follows the order the clusters first appear along the tree, so the colors and labels on the plot match the numbers in every table.

### Density-based clustering (DBSCAN and HDBSCAN)

Neither density method takes a k, so under them the range, the validity checkboxes, the tendency tests and the comparison table are not shown, and the step is retitled.

**Step 2: choose eps.** Under **Density-based (DBSCAN)** the step holds one button, **Draw k-distance plot**, which opens a card titled *Choosing eps for DBSCAN* with the run's settings and the plot below; the number of clusters is then whatever the eps you pick yields in Step 3. {#step-2-choose-eps #choosing-eps-for-dbscan #dbscan-eps}

- **k-distance plot** – every case's distance to its (minPts − 1)-th nearest neighbour, in the run's metric and on its standardized scale, sorted from the smallest: the objects run along the horizontal axis, the distance up the vertical. A case is a core point at any eps at or above its distance; past the knee the distances climb, and the cases there are noise unless a core point reaches them. With interpretation enabled a ring marks the knee – the object furthest from the straight line joining the first and last point, when the curve bends enough to have one – and a **Use the knee as eps in Step 3** button fills [Neighbourhood radius (eps)](#b-neighbourhood-radius-eps) with it, rounded to three significant figures. With interpretation off no knee is marked, and eps is read off the curve by eye.

**Step 2: nothing to choose.** Under **Density-based, hierarchical (HDBSCAN)** the step holds a note alone: HDBSCAN builds the clusters at every density level and keeps the most stable ones, so there is no radius and no count to choose – go on to Step 3.

### Biclustering (biclustering mode)

For algorithms that need a user-specified k (BiMax, FABIA, Cheng & Church), set the **Bicluster range to test** – the same [Minimum](#b-minimum) and [Maximum](#b-maximum) as above, default 2–10 – and click **Compare solutions**.

- **Show variance explained plot** – on by default: the share of the matrix's variance the biclusters capture, against k – under FABIA, the share its own factorization captures. {#show-variance-explained-plot #variance-explained}
- **Show coherence plots (MSR and correlation)** – on by default: two plots across k, the average [mean squared residue](./concepts/clustering.md#b-mean-squared-residue) (lower = more coherent) and the average [within-bicluster correlation](./concepts/clustering.md#b-within-bicluster-correlation) (higher = more coherent). {#show-coherence-plots-msr-and-correlation #average-coherence-msr #average-coherence-correlation}
- **Show coverage plot** – on by default: three lines across k, the percentage of rows, of columns and of cells that fall in at least one bicluster. {#show-coverage-plot #coverage}

Three slower diagnostics are off by default. Each adds columns to the table and a plot of its own:

- **Stability analysis (bootstrap, slower)** – resamples the cases, refits the biclustering at every k and scores how much of each bicluster comes back, by Jaccard similarity; it adds the **Stability** column, and when it runs, the suggested k is the most stable one. {#stability-analysis-bootstrap-slower #stability-analysis-bootstrap}
- **F-statistic diagnostics (slower)** – row and column F statistics for every bicluster of at least two rows and two columns, with resampled p-values; it adds the **Avg row F**, **Avg col F**, **Row sig. (%)** and **Col sig. (%)** columns and a plot of the two significant shares against k, its axis naming the level they are counted at – *Prop. significant (p ≤ {alpha})*, with no target line. They are descriptive only, not a significance test – the biclusters were chosen to maximise exactly these effects – as the notes under the table and the plot say. {#f-statistic-diagnostics-slower #f-statistic-diagnostics}
- **Consensus scoring (slower)** – refits the algorithm repeatedly under different seeds at every k and scores how far the runs agree, by Jaccard similarity; it adds the **Consensus** column. Offered for Cheng & Church and FABIA: BiMax is deterministic and agrees with itself perfectly, so the box is hidden under it and keeps its tick for when you return to the other two. This is a reproducibility score, not a new solution – the [consensus partition](#consensus-partition) offered for case and variable clustering is a different thing that happens to share the word. {#consensus-scoring-slower #consensus-scoring}
- **Bootstrap replications** – default 100, from 10 to 10,000, shown while any of the three is on: how many resamples stability and the F-statistic draw, and how many repeated runs consensus scoring compares. Stability and consensus refit the biclustering once per replicate for every k in the range, and the F-statistic diagnostics resample once per bicluster found at every k, so they cost the range width times the biclusters found times the replications – narrow the range before switching them on. Step 3 has fields of the same name, with the same default and range, for its own resampling outputs: one shared by **Cluster stability** and **Consensus partition**, and one under the bicluster summary's **Stability**.

#### Bicluster comparison table

Under the same **Solution comparison** heading, one row per k; the **k** cell carries its count into Step 3 as in the [standard table](#b-k).

- **Found** – how many biclusters the algorithm returned, which can be fewer than k: yellow marks a count it could not fill, and the row then repeats the largest solution it did find.
- **Var. Expl. (%)** – how much of the matrix's variance the biclusters capture. It carries no best mark: it tracks how much of the matrix the blocks happen to cover, so its extreme names the k the algorithm filled most, not a better fit.
- **Var. Expl. (model, %)** – the same column under FABIA, scoring the factorization FABIA fitted rather than the bicluster blocks – a note under the table says so.
- **Δ var. (%)** – the gain in variance explained over the previous k; the first row has none.
- **Avg MSR** – the average [mean squared residue](./concepts/clustering.md#b-mean-squared-residue) over the biclusters; lower is more coherent. It is undefined below two rows or two columns, so where only some biclusters qualify the cell names how many it averaged, e.g. `0.017 (3/4)`.
- **Avg r** – the average [within-bicluster correlation](./concepts/clustering.md#b-within-bicluster-correlation); higher is more coherent. Unlike MSR it ignores amplitude, so rows that move together at different scales still score well. Undefined below two rows or two columns like MSR, with the same `(3/4)` marker, and a row constant across a bicluster's columns is left out of its bicluster's average.
- **Avg overlap** – the average Jaccard similarity between the biclusters' cells, pair by pair; the higher it is, the more the biclusters repeat one another. It carries no mark.
- **Cell cov. (%)** – the percentage of data cells included in at least one bicluster.
- **Stability** – the mean bootstrap Jaccard of that k's biclusters, from **Stability analysis (bootstrap, slower)**; higher is better, and with interpretation enabled green marks the best. {#solution-comparison-stability}
- **Avg row F** – the row-effect F statistic averaged over the biclusters, from **F-statistic diagnostics (slower)**; descriptive only.
- **Avg col F** – the column-effect F statistic averaged the same way.
- **Row sig. (%)** – the share of biclusters whose row-effect p-value falls at or below the [significance level](./settings.md#significance-level) against the resampled null. Inflated by construction, so descriptive only, and never highlighted.
- **Col sig. (%)** – the same share for the column effects.
- **Consensus** – the mean Jaccard agreement between the repeated runs at that k, from **Consensus scoring (slower)**; higher is better, and with interpretation enabled green marks the best. {#solution-comparison-consensus}

A k whose fit failed outright is drawn red, with R's message under the table; a biclustering package that cannot be installed ends the comparison – and a Step 3 run alike – with one error naming it. Warnings above the table say when no biclusters were found at any count, and when stability was asked for but could not be measured at any count.

**Suggested k.** The count given below the table while interpretation is enabled, with the rule that produced it: the highest bootstrap stability when that diagnostic ran, otherwise the variance-explained elbow – the last k before the gain in variance explained falls below half the gain before it. The elbow rule applies only once the curve has gained at least 5 percentage points across the range; when it has not, or no gain collapses, the suggestion is the smallest k tested.

For auto-k algorithms (Plaid, Spectral), Step 2 shows an informational note instead – the algorithm determines k on its own. For Spectral the note adds that **Maximum within-bicluster spread** from Step 1 is what decides how many biclusters come back.

## Step 3: Run full analysis

Enter the number of clusters – under DBSCAN eps instead, and under HDBSCAN nothing – and click **Run cluster analysis** (or **Run biclustering analysis**). Long runs can be interrupted with the Cancel button on the progress overlay.

Every output card opens with the settings the run used – mode, algorithm, distance metric, linkage, K-means parameters, FANNY's **Membership exponent**, or the density methods' **Minimum points (minPts)** and DBSCAN's **Neighbourhood radius (eps)**, the **Standardization** that ran, the variables included, any excluded as non-numerical or constant, any cases a profile run left out, and the number of complete cases out of the total – then any warnings (listed [below](#warnings)), then the sections the options ask for, in the order they are listed here. Under [Gower](#gower-and-mixed-type-data) the **Gower variable types** row names every variable and how it was scaled, so it stands in for both the variable list and the standardization row; a Step 3 card also drops the list when a table it shows names every variable – the variable cluster assignments, the mixture components, the cluster profiles, the cluster medoids or the variable contribution table. The bicluster comparison names the **Resampling replications** whenever stability, the F-statistic or consensus scoring resampled.

- **Cases excluded (every value 0, so no profile)** – under **Per case: profile**, the case numbers of the cases whose every value is 0, which have no norm to divide by: they are left out of the run and of the complete-case count, and receive a missing value when the cluster assignments are [inserted into the dataset](#inserting-results-into-the-dataset).

All diagnostic plots produced here and in step 2 (elbow, silhouette, gap, dendrogram, heatmap, and the rest) are resizable and can be saved individually as SVG, PNG, or JPG using the export buttons beside each chart – see [resizing and exporting charts](./reading-results.md#resizing-and-exporting-charts).

### Case and variable clustering

- **Number of clusters (k)** – default 3, at least 2: how many clusters the run partitions the objects into. Clicking a **k** in Step 2's [comparison table](#b-k), or the dendrogram's cut line, fills it in. It must stay below the number of objects – the variables in variable mode, the complete cases in case mode – and under FANNY below half of them. A value below 2 or an empty field is flagged beside the field and blocks the run, and a k at or above the object count is refused with a message. Hidden under DBSCAN and HDBSCAN, which find the number of clusters themselves.
- **Neighbourhood radius (eps)** – under **Density-based (DBSCAN)**, in place of k: the distance within which a case's neighbours are counted, on the scale of the distance metric – after standardization when it applies. It has no default, since no value fits every scale: read it off the [k-distance plot](#b-k-distance-plot) in Step 2, whose button fills it in, or type it; an empty field or a value at or below 0 is flagged and refused. The number of clusters is whatever that density yields. Under **Density-based, hierarchical (HDBSCAN)** neither field is shown – the run takes [minPts](#b-minimum-points-minpts) alone.

Under **Validity metrics** the four checkboxes of [Step 2](#b-silhouette-analysis) return with the same defaults, each now a row of the [validity table](#cluster-validity-metrics) for the one k; under DBSCAN and HDBSCAN, which skip Step 2's comparison, a fifth follows them. Two resampling diagnostics join them all:

- **Density-based validity (DBCV)** – under DBSCAN and HDBSCAN, on by default: Moulavi and colleagues' index of how dense each cluster is inside against how sparse the gap to the nearest other cluster is, from −1 to +1, higher better ([the DBCV index](./concepts/clustering.md#b-the-dbcv-index)). Unlike the silhouette and the other indices, which favour compact round clusters and read the clustered cases alone, it is written for clusters of any shape and reads every case, so the noise counts against it. Not offered under Gower, as a note under the box says.
- **Cluster stability (bootstrap Jaccard, slower)** – off by default: reclusters bootstrap resamples of the data and scores, cluster by cluster, how much of each comes back – the [stability table](#cluster-stability). The only diagnostic here that asks whether a cluster would reappear in another sample rather than how well it is cut in this one ([cluster stability](./concepts/clustering.md#b-cluster-stability)). Not offered under HDBSCAN, and relabelled under DBSCAN, below. {#cluster-stability-bootstrap-jaccard-slower #cluster-stability-bootstrap-jaccard}
- **Cluster stability (subsample Jaccard, slower)** – the same box under **Density-based (DBSCAN)**: its replicates are subsamples of 80% of the cases, drawn without replacement, with eps re-set in each – the [stability table](#cluster-stability) says how they are scored. {#cluster-stability-subsample-jaccard-slower #cluster-stability-subsample-jaccard}
- **Consensus partition (ensemble of resamples, slower)** – off by default: builds a second partition out of how often each pair of objects lands together across the resamples, and reports how far it agrees with the one the card shows – the [consensus section](#consensus-partition) ([a consensus partition](./concepts/clustering.md#b-a-consensus-partition)). Under DBSCAN it reads the subsamples, with noise kept apart; not offered under HDBSCAN. {#consensus-partition-ensemble-of-resamples-slower #consensus-partition-ensemble-of-resamples}

Either box reveals a [**Bootstrap replications**](#b-bootstrap-replications) field, default 100, from 10 to 10,000; the two read the same resamples, so running both costs no more than running one. Both follow the **Bootstrap seed** in Settings.

**Subsample replications.** The same field under DBSCAN, with the same default and range: how many 80% subsamples stability and the consensus partition share, as a hint under it says.

Under **Output options**:

- **Cluster profiles (means per variable)** – on by default: each variable's mean within each cluster beside its overall mean, on the variables' original scale – usually the table that says what the clusters are. Under [Gower](#gower-and-mixed-type-data) a categorical variable has no mean, so its cells report the modal level and the section is titled *Cluster profiles (variable means and modal levels)*. Not offered in variable mode. Under DBSCAN and HDBSCAN a [Noise](#b-noise) column follows the clusters. {#cluster-profiles-means-per-variable #cluster-profiles-variable-means #cluster-profiles-variable-means-and-modal-levels}
- **Cluster sizes and distribution** – on by default: the **Cluster sizes** table, one row per cluster with its member count (**n**) and share of the objects (**%**), and each cluster's [average silhouette](#b-avg-silhouette) and count of [negative silhouettes](#b-negative-silhouettes) whenever the silhouette was computed. In case clustering with unequal sizes, a line under the table names the smallest cluster, its size and share, and how many times larger the largest is; with interpretation enabled, a second line gives that cluster's graded [mean Jaccard](#b-cluster-stability-bootstrap-jaccard-interpretation) when **Cluster stability (bootstrap Jaccard, slower)** ran, and when it was not requested, one line for the whole solution – equal sizes included – says that stability was not run and would show which clusters reappear in other samples. Under DBSCAN and HDBSCAN the rows are the clusters found and the percentages are of the clustered cases, with a note counting the noise, and the smallest-cluster lines are left off; HDBSCAN adds each cluster's [Stability](#b-cluster-sizes-stability) and [Median membership strength](#b-median-membership-strength), with a note saying what they measure. {#cluster-sizes-and-distribution #cluster-sizes}
- **Within-cluster sum of squares** – on by default: each cluster's [within-cluster sum of squares](#b-within-cluster-sum-of-squares-within-ss) and its share of the total, with a **Total** row – which clusters are tight and which loose. Not produced under Gower.
- **Between-cluster sum of squares** – off by default: the sum of squares lying between the clusters, and **Variance explained**, its percentage of the total – how much of the spread the partition accounts for. Not produced under Gower.
- **Cluster centers (medoids)** – off by default, offered for **K-medoids (PAM)** in case mode: the **Cluster medoids** section, each cluster's medoid – the actual case that represents it – with its values on the original scale beside the overall mean (under Gower, the overall mean or modal level, headed **Overall**), and a **Medoid cases** line naming the case numbers. {#cluster-centers-medoids #cluster-medoids}
- **Silhouette plot** – off by default: one bar per object, its silhouette width, grouped by cluster ([the silhouette](./concepts/clustering.md#b-the-silhouette)). A bar below zero is an object closer to another cluster than to its own; hovering a bar names the object, its width and its nearest other cluster. Titled *Variable silhouette plot* in variable mode. Under DBSCAN and HDBSCAN noise cases have no bar. {#silhouette-plot #variable-silhouette-plot}
- **Multidimensional scaling plot** – off by default: the run's own dissimilarity placed in two dimensions, points coloured by cluster – see [multidimensional scaling](#multidimensional-scaling) ([what MDS shows](./concepts/clustering.md#b-multidimensional-scaling-mds)). {#multidimensional-scaling-plot #multidimensional-scaling}
- **Scaling** – shown while the MDS plot is on: which ordination draws it.
- **Classical (metric)** – default; reproduces the dissimilarities themselves, by eigendecomposition – exact, fast, and needs no iteration.
- **Non-metric (Kruskal)** – keeps only the *order* of the dissimilarities, minimising stress – for a dissimilarity whose ranking means more than its scale, such as Gower or ordinal data. Considerably slower.
- **Cluster biplot** – off by default: the cases on their first two [principal components](./concepts/latent-variables.md#b-pca), each clustering variable drawn as an arrow, so a separation between clusters can be traced to the variables that produce it – see [cluster biplot](#cluster-biplot) ([reading a biplot](./concepts/clustering.md#b-a-biplot)). Not offered in variable mode; under Gower the section still appears when the box is ticked, with a note saying why no plot is drawn.
- **Classification uncertainty plot** – under **Gaussian mixture (model-based)**, on by default: the **Classification uncertainty** section, each case on the first two principal components of the analysis matrix, coloured by its most probable component and drawn larger and more opaque the further its largest posterior probability falls below 1 – the cases the mixture cannot place firmly stand out, usually where two components meet. The scale runs to the most uncertain a case can be at that k, 1 − 1/k, so two runs at the same k draw alike; hovering a point names the case, its component and its uncertainty, and the axis labels carry each component's share of the variance. {#classification-uncertainty-plot #classification-uncertainty}
- **Membership plot** – under **Fuzzy (FANNY)**, on by default: one stacked bar per object, its segments its membership in each cluster, the bars grouped by the cluster of their largest membership and that cluster's segment at the bottom, so the bar's lower edge reads the object's largest membership. A dashed line marks 0.5: a bar whose bottom segment ends below it belongs to no cluster by a majority. Hovering a bar names the object and lists its memberships; in variable mode the bars are variables.
- **Condensed cluster tree** – under **Density-based, hierarchical (HDBSCAN)**, on by default: the hierarchy HDBSCAN chooses its clusters from. Density λ = 1/eps rises down the vertical axis, and each branch is a bar as wide as the cases it still holds, narrowing as cases drop out and splitting where a cluster divides; the branches HDBSCAN selected are outlined in their cluster's colour and numbered, and a branch below a selected one takes its colour, faded. Hovering a branch gives its case count and the λ it spans. A long, wide branch is a stable cluster; one that thins out quickly is a weak one. {#condensed-cluster-tree #no-condensed-tree-available}

Under **Hierarchical options**, shown for **Hierarchical**:

- **Dendrogram** – on by default: the tree with its branches coloured by cluster, cut at k ([a dendrogram](./concepts/clustering.md#b-a-dendrogram)); titled *Variable dendrogram* in variable mode, where the leaves are the variables. {#dendrogram #variable-dendrogram}
- **Optimize leaf ordering** – off by default, shown while **Dendrogram** is on: rotates the branches so neighbouring leaves are as similar as the tree allows. The search is exact, so it adds a real wait on several hundred objects, more under single linkage.

Under **Advanced options**, in case mode:

- **Variable contribution to clustering** – off by default: one row per variable with an **F-statistic**, its **df (between, within)** and **Eta²** – which variables separate the clusters most ([the columns](#variable-contribution)). The F statistic is descriptive only: the clusters were built from these same variables, so it is inflated by construction and is not a significance test, as a note under the table says.

#### Density-based clustering

**Density-based clustering.** Under DBSCAN the card opens, after its settings and warnings, with what the density at eps made of the cases: the **Clusters found**, then the counts of **Core cases**, **border cases** and **noise**, the noise with its share of the cases. A sensitivity table below refits DBSCAN at 0.75, 1 and 1.25 times eps with minPts held, one row each with its eps, its clusters found and its noise share, the reported solution's row highlighted – how far the count and the noise move when eps does.

**Hierarchical density-based clustering.** Under HDBSCAN the card opens with the **Clusters found** and the **Noise** count with its share, a note that minPts is both the neighbour count that sets each case's density and the smallest group reported as a cluster, and a sensitivity table that refits HDBSCAN at ½, 1 and 2 times minPts – rounded, at least 2 – with the reported row highlighted. When either method finds fewer than two clusters, the card ends here, under its [warning](#warnings).

- **Clusters found** – how many clusters the density yielded, noise not counted; in the sensitivity tables, the count at each row's eps or minPts. Under both methods it is the k the rest of the card reads.
- **Noise** – the cases in no cluster: in the sensitivity tables, their share of the cases at each refit; in the [cluster profiles](#b-cluster-profiles-means-per-variable), a column of their own beside the clusters; in the [consensus crosstab](#b-reported-solution-rows-against-the-consensus-partition-columns), a row and column of their own. On the MDS plot and the biplot noise cases are drawn grey, last in the legend, and hovering one adds *(noise)* to its name. The sizes table leaves them out, its percentages taken over the clustered cases with a note counting the noise, and so does the silhouette plot. {#noise #label-noise}

#### Outlier scores (GLOSH)

**Outlier scores (GLOSH).** Under HDBSCAN, after the density section: the distribution of every case's GLOSH outlier score, noise included, as its minimum, 25%, median, 75%, 90% and maximum. A note under the table says the scores rank the cases rather than flag them. {#outlier-scores-glosh}

- **GLOSH score** – how much sparser a case's surroundings are than the densest part of the cluster it belongs to or falls away from: 0 for a case as dense as that part, towards 1 for one far sparser. No cutoff is defined, so no case is marked an outlier; the insert button writes every case's score to the dataset, where the highest can be picked out.

#### Fuzzy memberships

**Fuzzy memberships.** Under FANNY the card opens with how fuzzy the solution is: Dunn's partition coefficient and its normalized form, the [F(k) and F′(k)](#b-fk) of Step 2 for the one k; a line counting the objects whose largest membership is below 0.5, which belong to no cluster by a majority; and, when no object has its largest membership in some cluster, a line saying how many of the k clusters the largest-membership partition holds. A note under them says that the memberships sum to 1 and that the cluster assignments, and every index and table below, read each object's largest membership. The memberships themselves are not tabled on screen – the [Membership plot](#b-membership-plot) draws them, and the insert button writes them to the dataset.

#### Gaussian mixture model

**Gaussian mixture model.** Under a Gaussian mixture the card opens with the fitted model: its covariance model, its BIC, ICL, log-likelihood and number of parameters, a line counting the cases whose largest posterior probability is below 0.8 – the cases the mixture places with little certainty – and a table of all fourteen covariance models at the chosen k, the fitted one in bold. Each case's posterior probabilities are not tabled on screen: the [Classification uncertainty plot](#b-classification-uncertainty-plot) draws them, and the insert button writes them to the dataset.

- **Covariance model** – the model BIC chose at k, by its code and in words, e.g. *VEV (ellipsoidal, equal shape)*: components of varying volume and orientation but one common shape. The [Model](#b-model) entry explains the letters.
- **Log-likelihood** – the fitted mixture's log-likelihood, the quantity BIC and ICL penalise.
- **Parameters** – how many free parameters the mixture estimated – the component means, the covariance terms its model leaves free and the mixing proportions; the more flexible the model, the more of them, and the heavier BIC's penalty.
- **Covariance structure** – in the table of all fourteen models, each model's code in words.
- **ΔBIC** – each model's distance from the largest BIC at that k; the fitted model reads 0. With interpretation enabled an **Interpretation** column grades it on Raftery's grades of evidence against the model – *Preferred* at 0, *Weak evidence against* up to 2, *Positive evidence against* up to 6, *Strong evidence against* up to 10, *Very strong evidence against* beyond – with a legend under the table. A model with no BIC could not be fitted at this k. {#δbic #gaussian-mixture-model-interpretation}

#### Mixture components

**Mixture components.** One column per component and one row per variable, headed by a highlighted **Mixing proportion** row. These are the mixture's own estimates, each case weighted by its posterior probability, where the [cluster profiles](#b-cluster-profiles-means-per-variable) average the cases assigned to each cluster outright; on well-separated components the two agree, and where components overlap they differ.

- **Mixing proportion** – the share of the population the component accounts for, summing to 1 over the components. It is the mixture's estimate, so it need not equal the component's share of the cases in [Cluster sizes](#b-cluster-sizes), which counts each case once in its most probable component.
- **Component {n}** – the component's mean on each variable, on the variables' original scale; when the run standardized, the means are fitted on the standardized variables and transformed back, as a note under the table says. A per-case standardization has no inverse on the variables, so under it each mean is the average of the raw cases weighted by their posterior probabilities, and the note says that instead.

#### Cluster validity metrics

**Cluster validity metrics.** One row per metric, with its value and, when [interpretation](./settings.md#b-show-interpretation-column-when-applicable) is enabled, a reading. **Calinski-Harabasz index**, **Davies-Bouldin index** and **Dunn index** are the [Step 2 entries](#b-calinski-harabasz-index), read the same way for the one k; under DBSCAN and HDBSCAN, [Density-based validity (DBCV)](#b-density-based-validity-dbcv) joins them.

- **Average silhouette width** – the mean silhouette over all objects, from −1 to +1 ([the silhouette](./concepts/clustering.md#b-the-silhouette)); present while **Silhouette analysis** is on. Its reading is *Strong structure* above 0.70, *Reasonable structure* above 0.50, *Weak structure* above 0.25 and *No substantial structure* at or below that, an exact cut staying in the lower band; a legend under the table names Kaufman and Rousseeuw's bands.
- **Cophenetic correlation** – hierarchical runs only, always reported: the correlation between the input dissimilarities and the heights at which the tree first joins each pair – how faithfully the tree reproduces the data ([the cophenetic correlation](./concepts/clustering.md#b-the-cophenetic-correlation)). With interpretation enabled it reads *Very good fit of the tree* from 0.9, *Good fit of the tree* from 0.8, *Poor fit of the tree* from 0.7 and *Very poor fit of the tree* below, on Rohlf's bands; the legend under the table adds that a low value means distortion in the tree rather than a useless dendrogram, and that with poorly separated clusters the coefficient misleads as a measure of fit. It grades the tree rather than the cut, so it has no checkbox and does not change with k.

Under [Gower](#gower-and-mixed-type-data) a note under the table says the sums of squares and Calinski-Harabasz are left out and Davies-Bouldin comes from medoids; under any other non-Euclidean metric, that the sums of squares and Calinski-Harabasz are still Euclidean. Under DBSCAN and HDBSCAN a further note says that every index but DBCV reads the clustered cases alone, a noise case belonging to no cluster, and that DBCV counts the noise cases against its score.

#### Cluster stability

**Cluster stability (bootstrap Jaccard).** One row per cluster: each replicate resamples the objects, reclusters them with the same settings, and matches every original cluster to its best counterpart by Jaccard similarity – the share of members two sets have in common. A note under the table restates the two cut-offs and the replicate count. {#-}

- **Mean Jaccard** – the average best-match similarity across the replicates; the cluster's stability score.
- **Recovered** – how many replicates brought the cluster back with a Jaccard above 0.75.
- **Dissolved** – how many scored it 0.5 or less. It counts replicates, so it keeps its own, stricter meaning beside the mean.
- **Replicates scored** – how many replicates produced a solution to score the cluster against; a replicate whose refit failed scores nothing.
- **Interpretation** – with interpretation enabled, the mean read against Hennig's bands: *Highly stable* from 0.85, *Stable* from 0.75, *Indicates a pattern, but membership is doubtful* from 0.60, and *Not trustworthy* below. A warning above the card names how many clusters fell below 0.60. {#cluster-stability-bootstrap-jaccard-interpretation}

A cluster with a high silhouette and a low mean Jaccard is well cut in this sample and unlikely to reappear in another.

Under DBSCAN the section is titled **Cluster stability (subsample Jaccard)** and its replicates are subsamples: each draws 80% of the cases without replacement and refits DBSCAN with minPts held and eps re-set so that the same share of cases is core as in the full data. A cluster is compared with the subsample's clusters over the cases the subsample drew, never with its noise, and is scored only in the subsamples that drew at least one of its cases; a note under the table says so. The columns and bands are the same.

#### Consensus partition

**Consensus partition (ensemble of resamples).** The resamples are pooled into a co-association matrix – for every pair of objects, the share of replicates that put the two in one cluster – which is cut into k clusters of its own; the section reports how that consensus partition compares with the one the card shows. {#-}

- **Agreement with the reported solution (adjusted Rand)** – how closely the consensus partition reproduces the reported one, 1 for identical and near 0 for chance agreement. With interpretation enabled it reads *Excellent agreement* above 0.90, *Good agreement* above 0.80, *Moderate agreement* above 0.65 and *Poor agreement* at or below that – an exact cut stays in the lower band – and at or below 0.65 a warning above the card says the boundaries rest on this one fit.
- **Ambiguous pairs (PAC)** – the share of pairs whose co-association fell between 0.1 and 0.9, which the ensemble neither reliably kept together nor reliably separated. Lower is better: near zero, every pair was settled one way or the other.
- **Consensus noise** – under DBSCAN, a line under PAC: how many cases were noise in at least half the subsamples that drew them – the consensus partition's noise, left out of its cut – and how many were noise in at least one.
- **Mean co-association** – in the per-cluster table beside each consensus cluster's size (**n**): the average co-association over the pairs inside it, near 1 when its members held together in nearly every resample; a one-member cluster has none.
- **Reported solution (rows) against the consensus partition (columns)** – a crosstab of the two partitions. Consensus clusters are numbered after the reported cluster each overlaps most, so the diagonal holds the objects both group alike, and the off-diagonal cells, highlighted while interpretation is enabled, are the ones the ensemble would have placed elsewhere.

Under DBSCAN the ensemble reads the stability's subsamples, and noise changes it: a pair's co-association is the share of the subsamples drawing *both* cases that put them in one cluster, a noise case shares a cluster with no one, PAC is taken over the pairs outside the consensus noise, the crosstab gains a [Noise](#b-noise) row and column, and the adjusted Rand counts each noise case as a cluster of its own – notes under the tables say so. When fewer cases than the clusters found are left outside the consensus noise, no consensus partition is cut and the section stops at the noise line.

A low agreement does not make the consensus partition right and the reported one wrong – both are cuts of the same data. It says the data do not pin the grouping down, and is a reason to report the solution with caution rather than a different solution to report.

#### Sizes, profiles and sums of squares

- **Avg. silhouette** – in **Cluster sizes**, the mean silhouette width of the cluster's own members, which the overall average hides: a weak cluster shows here while the overall figure still looks acceptable. With interpretation enabled each cluster's figure is coloured on the bands of the [average silhouette width](#b-average-silhouette-width), and a legend under the table names them, as the app's extension of Kaufman and Rousseeuw's table for the overall average to a single cluster. {#avg-silhouette}
- **Negative silhouettes** – in **Cluster sizes**, how many of the cluster's members have a negative silhouette width – an object whose average dissimilarity to its own cluster exceeds that to the nearest other, so likely in the wrong cluster; a note under the table gives the count over all objects. Printed whenever the silhouette was computed, with no verdict.
- **Cluster sizes – Stability.** Under HDBSCAN, the cluster's stability: how long it persists as density rises, summed over its cases – the quantity HDBSCAN maximises in choosing its clusters. It has no fixed scale, so read it across the clusters of one run; a note under the table restates it. {#cluster-sizes-stability}
- **Median membership strength** – in **Cluster sizes** under HDBSCAN, the median of the cluster's cases' membership strengths. A case's strength runs from 0 to 1: it reaches 1 for a case still in its cluster when the cluster splits or vanishes, and is lower the earlier the case dropped out as density rose. It is a strength, not a probability.
- **Cluster** – in the stability, consensus and size tables, the cluster the row describes, numbered as in every table and plot of the card.
- **Variable** – in the profile, medoid, mixture component, contribution and bicluster tables, the variable the row describes, by its display name.
- **Cluster {n}** – in the profile and medoid tables, the cluster's mean (or medoid value) on each variable. Read each against **Overall** to see what sets the cluster apart; the names you give clusters are your interpretation, not the data's.
- **Overall** – the whole sample's value on each variable – its mean, or under Gower the modal level of a categorical variable – in the profile, medoid and bicluster profile tables alike; headed **Overall mean** in the medoid table when every variable is numeric. {#overall #overall-mean}
- **Medoid cases** – the case numbers of the medoids, cluster by cluster.
- **Within-cluster sum of squares – Within SS.** Each cluster's sum of squared deviations from its centroid, with the sum over clusters in the **Total** row. {#within-cluster-sum-of-squares-within-ss}
- **Within-cluster sum of squares – % of total.** Each cluster's share of the total within-cluster sum of squares. {#within-cluster-sum-of-squares-of-total}

Both sum-of-squares blocks are Euclidean whatever distance metric you chose, and are computed on the analysis matrix – on the standardized or per-case scaled values when a standardization ran, not on the original scale of the profile table. A note under them says which applies; in variable mode it adds that the squares are taken over the *transposed* matrix, where each variable is a point in case space. Under DBSCAN and HDBSCAN they are taken over the clustered cases alone, noise left out.

#### Variable contribution

The table compares the cluster means of each variable on its original scale, one row per variable.

- **Variable contribution to clustering – F-statistic.** Between-cluster against within-cluster variation of the variable, each over its degrees of freedom; larger means the clusters differ more on it. {#variable-contribution-to-clustering-f-statistic}
- **df (between, within)** – k − 1 and the number of complete cases less k, the same for every row; under DBSCAN and HDBSCAN, the clusters found less 1 and the clustered cases less the clusters found, since the noise cases are left out of the comparison.
- **Eta²** – the share of the variable's variance that cluster membership accounts for ([η²](./concepts/effect-sizes.md#b-η²)): near 0.60 the clusters differ sharply on the variable, near 0.05 it barely separates them. {#eta² #η²}

Under Gower a categorical variable's F-statistic and Eta² cells read –, since both compare means; the profile table shows how it separates the clusters.

#### Multidimensional scaling

The plot takes the dissimilarity the run already built – the same matrix the tree, the medoids and the validity indices read – and finds two-dimensional coordinates whose distances reproduce it as closely as two dimensions allow: it shows whether the clusters are separated in the data, or only in the partition table. The method is chosen under **Scaling** rather than inferred from the distance metric, so either question can be asked of any run, and the section's heading names the one that ran – *Multidimensional scaling (classical)* or *Multidimensional scaling (non-metric)*.

Each method reports the fit it optimizes, in a note under the plot: classical scaling the share of the dissimilarity structure its two dimensions carry, non-metric scaling Kruskal's stress-1, with his reading while interpretation is enabled – *excellent* at 0.025 or below, *good* at 0.05, *fair* at 0.10 and *poor* from 0.20, a value between two of those anchors taking both words: *good to excellent*, *fair to good*, *poor to fair*. Read the fit before the picture: two dimensions carrying 40% of the structure, or a stress of 0.2, means points close on screen need not be close in the data.

Points are coloured by the cluster the run reported – a DBSCAN or HDBSCAN noise case grey, as on the [biplot](#cluster-biplot) – and hovering one names it. Labels are placed furthest-from-centre first, at most 40, and those that would overlap are dropped, with a note saying how many were drawn; in variable mode the points are variables. Neither method can be interrupted once it starts, so above 1,000 objects the plot is replaced by a message saying so.

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

- **Number of biclusters (k)** – default 3, at least 1: how many biclusters BiMax, FABIA and Cheng & Church search for. Clicking a **k** in Step 2's [bicluster comparison table](#bicluster-comparison-table) fills it in. Hidden for Plaid and Spectral, which decide the count themselves. A value below 1 or an empty field is flagged beside the field and blocks the run; more biclusters than complete cases, or under FABIA more than there are variables, is refused with a message.

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

**Overview.** The first section of every biclustering card: how much of the matrix the biclusters account for. The settings above it add the complete cases out of the total and, under BiMax, FABIA and Cheng & Church, the **Biclusters requested**; the count found is in the card's title, and a run that finds none still gets its card, with those settings and a warning, so you can see what to change next. The variable list is left out when the membership or profile tables, which name every variable, are shown. {#overview}

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
- **Bicluster summary – Stability.** The bicluster's mean best-match Jaccard across the bootstrap resamples, a failed refit scoring 0; higher is better, and a note under the table gives the number of bootstrap resamples. With interpretation enabled an **Interpretation** column reads it against the [cluster stability bands](#b-cluster-stability-bootstrap-jaccard-interpretation). {#bicluster-summary-stability}
- **Coherence per bicluster – Avg r.** The average correlation over every pair of the bicluster's rows across its columns ([within-bicluster correlation](./concepts/clustering.md#b-within-bicluster-correlation)); higher is more coherent, and unlike MSR it ignores a difference in amplitude between rows. A row holding one value across the bicluster's columns correlates with nothing and is left out – a bracketed count, `(-2)`, says how many – and a bicluster left with fewer than two varying rows scores no r. {#coherence-per-bicluster-avg-r}
- **Variance of row means** – how much the bicluster's rows differ in level across its columns: a row effect inside the block.
- **Variance of column means** – the same for its columns.
- **Row overlap** – for each pair of biclusters, the Jaccard similarity of their case sets, 1 on the diagonal.
- **Column overlap** – the same for their variable sets.
- **Cell overlap** – the same for their cell sets – the quantity the comparison table reports as [Avg overlap](#b-avg-overlap). Two biclusters can share most of their rows and most of their columns and still barely intersect as blocks, as a note under the matrix says.

#### The heatmap

The heatmap draws the analysis matrix cell by cell on a diverging colour ramp – centred on zero when the run standardized, spanning the observed range otherwise – with a legend for the ramp and the bicluster colours. Hovering a cell shows its row, column, value and *every* bicluster that owns it. Past 320 rows the rows are sampled evenly and a note says how many of the total are drawn, and while they are sampled the row dendrogram is hidden, since its leaves would not line up with the drawn rows; past 8,000 drawn cells the per-cell tooltips are left off, and a note says that too.

### Warnings

The analysis generates warnings for potentially problematic results. Those that report what the run did – non-convergence, a single-variable cluster, biclusters missing or degenerate – always show, and drop their advice when [interpretation](./settings.md#b-show-interpretation-column-when-applicable) is off; those that read a value against a rule of thumb show only while it is on.

**Case and variable clustering:**

- **K-means did not converge** – the run stopped at the iteration limit, which the warning names; with interpretation enabled it adds: raise the limit or the number of random starts
- **FANNY memberships collapsed** – every membership flattened to about 1/k, so FANNY found no partition: the card stops at the warning and reports no partition, no index and no plot. With interpretation enabled it adds: lower the membership exponent or the number of clusters
- **FANNY did not converge** – the fit stopped at its iteration limit, which the warning names; the memberships reported are those it stopped at
- **DBSCAN found fewer than two clusters** – every case is noise, or one cluster holds them all, at the run's eps and minPts: the card stops at the warning and the density section, with no index, table or plot. With interpretation enabled it adds the remedy: raise eps or lower minPts when every case is noise, lower eps or raise minPts to split a single cluster
- **HDBSCAN found fewer than two clusters** – the same at the run's minPts; with interpretation enabled it adds: lower minPts, so that smaller clusters can form or split off
- **Low silhouette** – at or below 0.25 ("no substantial structure"), or above 0.25 and up to 0.50 ("weak structure")
- **Clusters that did not reproduce** – with stability enabled, how many fell below a mean Jaccard of 0.6 across resamples
- **Consensus disagrees** – with the consensus partition enabled, an adjusted Rand at or below 0.65
- **Single-variable clusters** (variable mode) – some cluster holds only one variable; with interpretation enabled the warning suggests fewer clusters

**Biclustering:**

- **Fewer biclusters than requested** – the algorithm returned less than k
- **Degenerate biclusters** – some have fewer than two rows or two columns, so neither MSR nor Avg r is defined for them

Step 2's comparison card carries warnings of its own: no biclusters found at any k in the range, or stability requested but unmeasurable everywhere – in which case the suggested k quietly falls back to the variance-explained rule.

### Inserting results into the dataset

- **Insert cluster assignments into dataset** – at the foot of a case-clustering card: adds a categorical variable named after the algorithm and k (`Cluster_kmeans_k3`, `Cluster_pam_k3`, `Cluster_hierarchical_k3`) holding each case's cluster number; cases left out for missing data receive a missing value. Under DBSCAN and HDBSCAN k is the number of clusters found (`Cluster_dbscan_k2`), and a noise case receives 0.
- **Insert cluster assignments and posterior probabilities into dataset** – the same button under **Gaussian mixture (model-based)**: beside `Cluster_gmm_k3` it adds `MaxPost_gmm_k3`, each case's largest posterior probability, and one column per component, `Post1_gmm_k3`, `Post2_gmm_k3`, …, holding the probability of belonging to it – the variables to filter or weight by when the uncertain cases matter.
- **Insert cluster assignments and memberships into dataset** – the same button under **Fuzzy (FANNY)**: beside `Cluster_fanny_k3` it adds `MaxMemb_fanny_k3`, each case's largest membership, and one column per cluster, `Memb1_fanny_k3`, `Memb2_fanny_k3`, …; a variable-mode card has no button, since its objects are not rows of the dataset.
- **Insert cluster assignments, membership strengths and outlier scores into dataset** – the same button under **Density-based, hierarchical (HDBSCAN)**: beside `Cluster_hdbscan_k2` it adds `Memb_hdbscan_k2`, each case's [membership strength](#b-median-membership-strength) – 0 for a noise case – and `Outlier_hdbscan_k2`, its [GLOSH score](#b-glosh-score), so the most outlying cases can be filtered on. {#insert-cluster-assignments-membership-strengths-and-outlier-scores-into-dataset #cluster-assignments-membership-strengths-and-outlier-scores}
- **Insert cluster assignments and noise frequencies into dataset** – the same button under **Density-based (DBSCAN)** when the [consensus partition](#consensus-partition) ran: beside `Cluster_dbscan_k2` it adds `NoiseFreq_dbscan_k2`, the share of the subsamples drawing each case that left it as noise. {#insert-cluster-assignments-and-noise-frequencies-into-dataset #cluster-assignments-and-noise-frequencies}
- **Insert bicluster memberships into dataset** – at the foot of a biclustering card: adds one variable per bicluster (`BC1_k3`, `BC2_k3`, …), 1 for a case in that bicluster and 0 otherwise.

Inserted variables can be used in further analyses – as grouping variables for [comparisons](./comparison-analysis.md), as predictors in [regression](./regression-analysis.md), or as group variables for [measurement invariance](./structural-equation-modeling.md#measurement-invariance-testing) testing.

## Missing data

Cluster analysis runs on complete cases only: a case blank on any variable that enters the run is left out of every step – the tendency tests, the comparison, the clustering and every diagnostic – whichever method the global [missing data setting](./settings.md#missing-data) names, since the setting's pairwise option is not offered here. The variables that enter are the ones the run keeps, so a non-numeric variable excluded under an ordinary metric drops no cases, while under Gower a blank categorical value does. With the setting on listwise deletion, the cases blank on any variable selected in the Variables dialog are already gone – a net at least as wide as the module's own; with imputation the blanks were filled before the module saw them and nothing is dropped. Every card's settings reports the complete cases out of the total, and a case left out receives a missing value when the cluster assignments are [inserted into the dataset](#inserting-results-into-the-dataset) – see [listwise deletion](./concepts/outliers-missing-data.md#b-listwise-deletion). If missingness is widespread, deselect the sparse variables rather than cluster a small remainder; imputation keeps every case, at the cost the [setting](./settings.md#missing-data) describes.

## Reporting checklist

Key things to include when writing up cluster analysis results:

**Method:**
- Clustering mode (case, variable, or biclustering)
- Algorithm used (K-means, K-medoids (PAM), Hierarchical, Gaussian mixture, FANNY, DBSCAN, HDBSCAN, or which biclustering algorithm), with K-means' variant and number of random starts
- For DBSCAN, eps and minPts and how eps was chosen – the k-distance plot's knee or otherwise; for HDBSCAN, minPts, which is also its smallest cluster size
- For a Gaussian mixture, that all fourteen covariance models were compared by BIC, the model chosen, and ICL beside it; for FANNY, the membership exponent
- Distance metric (K-medoids, Hierarchical, FANNY, DBSCAN and HDBSCAN; K-means is Euclidean) and, for Hierarchical, the linkage method
- Under [Gower](#gower-and-mixed-type-data), which variables entered under which sub-type – the card's settings row gives you this, and an ordinal variable read as nominal is worth catching before it reaches print
- The standardization – none, per variable, or per case by centring or profile – and why, e.g. different measurement scales, or a trajectory's shape rather than its level; under a profile run, any cases left out
- How the number of clusters was determined – which metrics were consulted (silhouette, gap statistic, elbow, dendrogram, or BIC and ICL under a mixture) and how conflicts were resolved; under DBSCAN and HDBSCAN, that the algorithm found it
- Sample size and number of variables – the complete cases out of the total, and any variables excluded
- How missing data were handled
- The two seeds from **Settings**, if you report the run as reproducible

**Results:**
- Cluster tendency (Hopkins, Duda-Hart) if you report it as a precondition – case mode only, and not under Gower
- Number of clusters and cluster sizes; under DBSCAN and HDBSCAN also the noise count and share, the sensitivity table, and that the indices read the clustered cases alone
- For DBSCAN and HDBSCAN, DBCV if it was computed; for HDBSCAN, each cluster's stability and median membership strength, and the GLOSH quantiles if outliers matter
- Validity metrics – at minimum average silhouette width; consider also Calinski-Harabasz (not under Gower) and Davies-Bouldin
- For a Gaussian mixture, the BIC and ICL of the chosen fit, the mixing proportions and component means, and the share of cases whose largest posterior probability is below 0.8; for FANNY, F(k) and F′(k) and the share of objects whose largest membership is below 0.5
- Bootstrap stability per cluster, with the number of replicates, if the diagnostic was run – under DBSCAN, subsample stability, with the subsample share
- The consensus partition's adjusted Rand and PAC, with the number of replicates, if it was run
- Cluster profiles (means per variable per cluster) – the core of interpretation
- Variance explained (between-cluster SS as percentage of total) – not produced under Gower
- If you show the [MDS plot](#multidimensional-scaling), the scaling method and its fit – the goodness-of-fit for classical, stress-1 for non-metric – since the picture is not interpretable without it
- If you show the [cluster biplot](#cluster-biplot), the share of variance on each axis and the fact that it is Gabriel's distance-preserving scaling – arrow length means a different thing under the other scaling
- Any [warnings](#warnings) the card printed – a low silhouette, clusters that did not reproduce, a consensus that disagrees – and the count of negative silhouettes

**For biclustering:** report the algorithm, number of biclusters found, variance explained, cell coverage, and coherence – both MSR and Avg r, since they answer different questions. Include the membership table or heatmap, and the bicluster stability if it was run.

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – you can inspect, copy, or re-run the exact commands. Cluster analysis uses base R functions (`kmeans`, `hclust`, `cmdscale` for classical scaling, and `prcomp` for the biplot) and the `cluster` package (for PAM, FANNY's `fanny`, the silhouette, and `daisy` for the Gower dissimilarity); the Gaussian mixture uses the `mclust` package (`Mclust`, with `mclustBIC` and `mclustICL` for Step 2's comparison); non-metric scaling uses `MASS::isoMDS`; DBSCAN and HDBSCAN use the `dbscan` package (`dbscan`, `hdbscan`, `kNNdist` for the k-distance plot and `dbcv` for DBCV). The gap statistic and the optimal leaf ordering are computed in R by the module itself, which is what lets them honour the distance metric you chose. Biclustering uses the `biclust` package, plus `fabia` under FABIA. Citations appear automatically at the top of the output section and follow what the run did – the packages it loaded, the algorithm, linkage and metric, and each index, diagnostic and plot method only when it was computed – so the list can serve as the Method section's references. Clustering, the Hopkins and gap reference draws, the Gaussian mixture's hierarchical start – which draws random numbers only past 2,000 cases, where `mclust` starts from a subset – and the biclustering algorithms are seeded by [**Reproducibility seed**](./settings.md#reproducibility-seed) (default 42); the resampling diagnostics – cluster stability, the consensus partition and DBSCAN's subsamples for both, bicluster stability, and bicluster consensus scoring – by [**Bootstrap seed**](./settings.md#bootstrap-seed), empty by default, so you can vary one without the other; an empty seed draws fresh randomness each run. DBSCAN and HDBSCAN themselves draw no random numbers, so their fits need no seed. The reasoning behind the module's bounds, refusals, fallbacks and package arguments is in its [method notes](./methods/cluster-analysis.md).

## Common pitfalls

Cluster analysis is exploratory by nature – it will always produce clusters, whether or not they're meaningful. Keep these points in mind:

**Clusters always exist – even in random data.** K-means will partition random noise into k groups and report cluster centers with a straight face. A [Hopkins statistic](./concepts/clustering.md#b-the-hopkins-statistic) near 0.5, a low [silhouette](./concepts/clustering.md#b-the-silhouette) (below 0.25), clusters that fall below a mean Jaccard of 0.6 under the [bootstrap](#cluster-stability), or a [consensus partition](#consensus-partition) that regroups the same cases differently are signs that the "clusters" may not reflect real structure. Check the [cluster tendency](#cluster-tendency) and validity output before interpreting.

**Results depend on the method.** Any two of the seven algorithms can produce different clusterings from the same data, and DBSCAN's clusters move with eps and minPts – read its [sensitivity table](#b-density-based-clustering) before trusting the count. Different linkage methods within Hierarchical can produce different clusterings. Different distance metrics can produce different clusterings. If your clusters only appear with one specific combination of settings, they may not be robust. Try multiple approaches and look for consistent patterns.

**Too many variables can hurt.** With many variables, distances become dominated by noise – every observation looks equally far from every other one (the "curse of dimensionality"). If you have 50 variables, consider reducing them first with [factor analysis](./factor-analysis.md) or [PCA](./factor-analysis.md#extraction-method) and clustering on the factor or component scores instead.

**Don't test cluster differences on clustering variables.** If you cluster people using anxiety and depression scores, then run a t-test asking "do the clusters differ on anxiety?" – of course they do, you *made* them differ. Testing whether clusters differ on the variables used to create them is circular. That is why the variable contribution table labels its F statistic descriptive only. Instead, validate clusters against *external* variables not used in the clustering (e.g. cluster on personality items, then check whether clusters differ on job performance).

**Clusters might be arbitrary cuts of a continuum.** Not all data has natural groups. Depression scores might form a smooth gradient from low to high rather than distinct "depressed" and "not depressed" clusters. Forcing this into two clusters creates an artificial boundary. A well-known example of this debate is personality typology: researchers have clustered Big Five scores into types like "resilient," "overcontrolled," and "undercontrolled" – but the Big Five dimensions themselves are continuously and normally distributed, so the "types" may simply be regions of a smooth space rather than natural categories. Check whether the silhouette plot shows clear separation or a muddy overlap.

**Cluster labels are interpretations.** Same caveat as [factor naming](./factor-analysis.md#common-pitfalls) – calling a cluster "Resilient High-Achievers" because it has above-average scores on several positive traits is your interpretation. Report the actual profile means so readers can judge for themselves.

**Sample-specific solutions.** Cluster structures are sensitive to sample composition. A 3-cluster solution in your sample might not replicate in a different population. Run the [cluster stability](#cluster-stability) diagnostic, and if possible split your data and check whether the same clusters emerge in both halves.

**A mixture component is not always a cluster.** A Gaussian mixture describes every cluster as a normal distribution, so a skewed or banana-shaped group is fitted with two or three components, and BIC counts each of them. When the ICL pick names fewer components than the BIC pick, or two components' means in [Mixture components](#mixture-components) sit close together, read them as one group described in pieces rather than as separate types.

**Memberships and posteriors are not the same thing.** A Gaussian mixture's posterior probability is a probability under a model – how likely the case is to have come from that component, if the model is right. A FANNY membership is a degree of belonging that the fit distributes to minimise its own criterion, and its spread follows the membership exponent you chose: the same data give flatter memberships at a higher exponent. Neither says how stable the cluster is – that is the [cluster stability](#cluster-stability) diagnostic's job.
