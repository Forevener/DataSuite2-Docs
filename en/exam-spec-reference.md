---
title: Exam spec reference
description: The DataSuite 2 generator spec – factors, variables, distribution families, groups, predictors and experimental designs – for per-student exam datasets.
---

# Exam spec reference

The exam generator takes a **spec**: a JSON5 document describing a population, not a dataset. Each student's data is drawn from that population using their own name as the seed, so everyone gets numbers that are theirs alone while the structure you authored – the factors, the effects, the missingness – holds for all of them.

The same spec feeds both actions in the view. **Export exam link** turns it into a `?exam=` link students open; **Load mock data into app** draws one dataset and loads it straight into DataSuite, which is how you test a module against data with known properties.

> This page is about the dataset. For the graded questions that ride on top of it, see [exam question reference](./exam-question-reference.md). For what the student sees, see [taking an exam](./taking-an-exam.md).

## Quick start

```json5
{
	n: 200,
	factors: ["Physical", "Mental"],
	phi: { "Physical~Mental": 0.3 },
	defaults: { family: "beta", params: [2, 5], min: 0, max: 100, round: 0 },
	variables: {
		PF: { load: "Physical*0.80" },
		GH: { load: "Physical*0.55 + Mental*0.25" },
		MH: { load: "Mental*0.80" },
	},
	groups: {
		sex: { levels: ["F", "M"], effect: "Physical*-0.6" },
	},
}
```

That is a complete spec: two correlated latent factors, three questionnaire scales measuring them on a 0–100 skewed scale, and a sex difference of 0.6 SD on Physical.

JSON5 means unquoted keys, comments and trailing commas are all allowed – write it like code, not like a config file.

Press **Generate preview** to draw one student's dataset and read the realized numbers off it, and **Reroll** to re-seed and see how far they move from student to student. **Reset to example** restores the commented starter spec, which exercises most of the fields on this page.

## Two templates

A spec is one of two shapes, chosen by which key it carries.

| Template | Trigger | Shape | Analyze with |
|---|---|---|---|
| Factor model | `factors` + `variables` | Wide – one row per case, one column per variable | Everything: descriptives, correlation, comparison, factor analysis, reliability, regression, survival |
| Design | a `design` block | Long – one row per subject × within-cell, with a `subject` id | [Comparison](./comparison-analysis.md) – between / within / mixed ANOVA and MANOVA |

The factor model is the psychometric engine: latent variables that observed indicators load on. The design template is the experimental one: cell means over crossed factors. They are alternatives, not layers – a spec carrying `design` ignores the factor-model keys entirely.

## Fields every spec has

| Field | Meaning |
|---|---|
| `n` | Sample size, default 200. In a design this is the number of **subjects**, and the row count is `n × within-cells` |
| `id` | An optional title for the exam, stamped into the exported Word document's provenance line (factor model only) |
| `exam` | The graded questions – see [exam question reference](./exam-question-reference.md) |

## The factor model

### Factors and their correlations

```json5
factors: ["Physical", "Mental"],
phi: { default: 0.3, "Physical~Mental": 0.45 },
paths: { "Physical->Mental": 0.4 },
```

- `factors` – the latent variable names. They are never emitted as columns; only the indicators loading on them are.
- `phi` – factor correlations. A single number applies to every pair, or use `{ default: 0.3, "A~B": 0.45 }` to set pairs individually. Omitted, the factors are uncorrelated.
- `paths` – directed paths between factors, which turn the measurement model into a [structural one](./structural-equation-modeling.md). `{ "Physical->Mental": 0.4 }` makes Mental regress on Physical, so a predictor acting on Physical reaches Mental **indirectly** – that is a genuine mediation dataset. The model must be recursive (acyclic); a feedback loop is rejected by name. With `paths` present, `phi` is the correlation between the *disturbances* rather than between the factors themselves.

> **Mediation is the product of two paths.** An indirect effect is the predictor's slope onto Physical times the Physical→Mental path. Both get attenuated by measurement, so the realized coefficient a student recovers in [regression](./regression-analysis.md) is smaller than the authored one – load mock data and run the model to see the value you are actually asking about.

### Variables

Each entry under `variables` is one observed indicator. `load` is a factor expression giving its loading on each factor, and cross-loadings are first-class.

```json5
defaults: { family: "beta", params: [2, 5], min: 0, max: 100, round: 0 },
variables: {
	PF: { load: "Physical*0.80" },
	GH: { load: "Physical*0.55 + Mental*0.25", family: "normal", params: [50, 10] },
	MH: { load: "Mental*0.80", params: [5, 2] },
},
```

`defaults` is the output distribution every variable inherits; any of `family`, `params`, `min`, `max`, `round` can be overridden per variable. Factor names inside a `load` expression may not contain `+`, `−` or `*`.

> **Residual variance is derived, not authored.** An indicator's loadings fix how much of it the factors explain; the rest is noise, computed as `1 − h²`. Loadings that add up to almost all of the variance leave an indicator that is a near-deterministic function of the factors – the preview warns when this happens.

### Bulk item blocks

A questionnaire scale with a dozen items does not need a dozen entries. `count` spawns a block, and an **array** of sets makes that block a shuffle block.

```json5
variables: {
	WB: [
		{ count: 6, load: "Mental*0.65", jitter: 0.06 },
		{ count: 2, load: "Mental*-0.6" },
	],
},
```

- `count` – `WB: { count: 8, load: "Mental*0.7" }` makes `WB1` … `WB8`.
- An **array of sets** is shuffled per student: the items are scrambled inside the block, so a set with a **negative** load – a reverse-keyed item – lands at a different name for everyone. The answer to "which items are reverse-keyed?" then has to be found in the [reliability](./reliability-analysis.md) drop table, and cannot be shared between students.
- `jitter: 0.06` spreads the loadings within a set by a seeded amount, frozen at authoring time so the spec stays stable. `loadRange: [0.8, 0.4]` is a linear gradient across the set instead (single-factor loads only).

> Reverse-keyed is not a special knob – it is just a set whose loading is negative. Everything else about the item is ordinary.

### Distribution families

Every variable's standardized latent value is pushed through an inverse CDF to reach its output margin. `params` is positional per family.

| Family | `params` | Notes |
|---|---|---|
| `normal` | mean, sd | The default; omit `params` for (0, 1) |
| `beta` | shape1, shape2 | Scaled into `[min, max]` – give both. The natural choice for a bounded scale score |
| `gamma` | shape, rate | Positive, right-skewed |
| `lognormal` | meanlog, sdlog | Positive, heavier right tail |
| `poisson` | lambda | Counts |
| `negbin` | mean, size | Overdispersed counts |
| `zip` | lambda, prob-zero | Zero-inflated Poisson |
| `zinb` | mean, size, prob-zero | Zero-inflated negative binomial |
| `ordinal` | thresholds… | Cut points on the latent scale → Likert codes 1, 2, 3, … |
| `skew-normal` | location, scale, shape | True skew without clamping |
| `t` | df, location, scale | Heavy tails; location and scale are optional |
| `mixture` | weight, mean, sd × ≥ 2 | Multimodal – one triple per component |
| `binomial` | size, prob | `size: 1` is the 0/1 logistic-regression outcome |
| `bernoulli` | prob | Sugar for `binomial(1, prob)` |
| `exponential` | rate | Survival event time (memoryless) |
| `weibull` | shape, scale | Survival event time |
| `loglogistic` | shape, scale | Survival event time |
| `gompertz` | shape, rate | Survival event time (increasing hazard) |

`min` and `max` clamp the output and `round` sets its decimal places, applied after the family – except for `beta`, which already lands in range, and `ordinal`, whose codes are categorical. Clamping is what piles mass on a ceiling or floor, which the preview reports as `%=max`.

> **Non-normal margins warp correlations.** The latent structure is exactly what you authored, but pushing it through a non-linear margin moves the Pearson correlation off the authored value – hardest of all for binary outcomes, where the φ coefficient has a ceiling below 1. Rank structure survives. This is the main reason the preview's realized numbers, not the spec, are the answer key.

### Labels

`labels` names the levels of a `binomial` outcome, turning a numeric column into a categorical one.

```json5
Remission: { load: "Mental*0.70", family: "bernoulli", params: [0.4], labels: ["No", "Yes"] },
```

Omit it for a plain 0/1 column – which is what you want if the student is meant to run a logistic regression on it. One label per level, so `size: 1` takes two.

### Missing data

`missing` punches holes in a variable or a predictor, seeded by the student's name like everything else.

```json5
missing: 0.2,
missing: { mechanism: "mar", rate: 0.12, on: "age", slope: 0.8 },
```

- A bare number is an MCAR rate.
- `mechanism: "mar"` makes missingness depend on **another** column, named by `on`; `"mnar"` makes it depend on the variable's own value. `slope` is how strongly, on a logit scale.
- `rate` is the baseline rate, not the exact realized share once `slope` is non-zero. The preview reports the realized % missing.

Which cases actually take part in an analysis then depends on the student's [missing-data setting](./settings.md#missing-data), so a spec with missingness is also a spec that tests whether they noticed.

### Survival outcomes

`censor` turns a variable into a time-to-event outcome, emitting two columns: `<name>` (the observed time) and `<name>_event` (the status, `0` = censored, `1` = the event, `2…` = each competing cause). It needs a survival family.

```json5
TimeToRelapse: { load: "Mental*0.6", family: "weibull", params: [1.3, 40], censor: { mechanism: "random", rate: 0.02 } },
```

| `mechanism` | Extra fields | What it does |
|---|---|---|
| `random` | `rate` | An exponential censoring time competes with the event |
| `fixed` | `at` | An administrative cutoff – everyone still at risk at that time is censored |
| `type2` | `events` | Stop after k events; everyone past the k-th is censored |
| `competing` | `risks`, optional `at` | Independent competing causes, each with its own family and params; the soonest wins |

Covariates scale the time (an AFT model, not Cox proportional hazards), so the realized hazard ratio is what a student recovers in [time-to-event analysis](./time-to-event-analysis.md). The preview reports the realized event rate, median time and censored share.

### Categorical groups

```json5
groups: {
	condition: { levels: ["Healthy", "Chronic"], effect: "Physical*-0.8 + Mental*-0.3", spread: [1, 1.5] },
	sex: { levels: ["F", "M"] },
},
groupPhi: { "condition~sex": 0.35 },
```

- `levels` – the level labels, emitted as a categorical column.
- `effect` – a factor expression shifting the factor means between adjacent levels, in factor-SD units. For two levels that is Cohen's d directly; for more, it is a per-step shift with the levels centred.
- `spread` – one multiplier per level, scaling that level's **variance** only. A group can differ in spread without differing in mean, which is what makes a Welch-vs-Student question meaningful.
- `groupPhi` – associates the categorical variables with each other, so a χ² test of independence between two of them is not null by construction. Same shorthand as `phi`. It sets the latent correlation behind the categoricals; the realized χ² and Cramér's V are the answer key.

### Continuous predictors

Predictors are covariates that shift the factor means – the continuous analogue of a group `effect`, and each one is also emitted as its own column.

```json5
predictors: {
	age:    { family: "normal", params: [40, 12], effect: "Physical*-0.5" },
	visits: { family: "negbin", params: [4, 2],   effect: "Physical*-0.3" },
},
predictorPhi: { "age~visits": 0.3 },
interactions: { "age:condition": "Physical*-0.3" },
```

- `effect` – the slope on the latent factor, in SD units.
- Predictors do **not** inherit `defaults` – a 0–100 beta default would make a nonsense of "age" – so each carries its own `family` and `params`, defaulting to normal(0, 1).
- `predictorPhi` – correlations between predictors, same shorthand as `phi`. This is where collinearity comes from.
- `interactions` – product terms. The key joins two predictor or group names with `:`, and the value is the moderation slope on a factor. Any order of interaction is allowed.

> **A slope acts on the factor, not on the indicator.** Regressing one indicator on a predictor therefore recovers roughly `loading × slope`, attenuated by measurement. If you want a regression whose coefficient lands exactly where you put it, give the outcome its own single-indicator factor with a loading near 1.

### Clustering

Observations nest inside clusters – patients in clinics, pupils in classes – with random intercepts on the factors and optionally a random slope.

```json5
clustering: {
	cluster: "clinic", nClusters: 12,
	intercept: "Physical*0.4 + Mental*0.3",
	slope: { predictor: "age", factor: "Physical", sd: 0.15, corr: 0.3 },
	sizes: [30, 20, 20, 10],
},
```

- `cluster` / `nClusters` – the emitted id column and how many clusters to draw. `sizes` sets them explicitly instead of splitting evenly.
- `intercept` – the SD of the cluster random intercept per factor. This is what creates the within-cluster correlation; the preview reports the realized ICC.
- `slope` – an optional random slope on one predictor for one factor, with its own `sd` and its correlation `corr` with the intercept.

A cluster plus a time predictor plus a random slope is a long-format growth model.

### Time series

The `timeseries` block replaces the i.i.d. factor disturbance with a SARIMA process running over a time index.

```json5
timeseries: {
	time: "week", order: [1, 1, 1], ar: [0.6], ma: [-0.3],
	seasonal: [1, 0, 0], sar: [0.4], period: 12,
	unit: "store", units: 24,
	start: "2020-01-06", step: "week",
},
```

- `time` – the emitted time column's name. `order` is `[p, d, q]` and `seasonal` is `[P, D, Q]` at `period`, with one coefficient per order in `ar` / `ma` / `sar` / `sma`.
- `unit` + `units` make it a panel and emit a unit-id column (`sizes` sets per-unit lengths); give both or neither. Omit them for a single Box–Jenkins series, or to inherit the grouping from `clustering`.
- `start` (a `YYYY-MM-DD` date) + `step` (`day`, `week`, `month`, `quarter` or `year`) render the time index as real dates rather than integers. Give both or neither. It matters more than it looks: [time-series analysis](./time-series-analysis.md) reads the seasonal period off the column's spacing and can only do that for a column that parses as a date – a bare integer index always yields frequency 1.

A differenced series (`d` or `D` greater than 0) is non-stationary and has no fixed variance, so keep its indicators on a `normal` margin. One shared structure drives every factor's disturbance, and the realized lag-1 autocorrelation in the preview is the answer key – on short panels it is biased downward, which is a small-sample property of the estimator rather than a generator flaw.

### An explicit loadings matrix

`loadings` at the top level takes a plain rows × factors matrix and skips the `load` expressions entirely. It exists for round-tripping and for pasting a matrix out of a paper; it cannot be combined with bulk blocks, whose row counts it has no way to line up with.

## Experimental designs

Give a `design` block instead of `factors` / `variables` for long-format ANOVA and MANOVA data.

```json5
{
	n: 60,
	design: {
		between: { group: ["control", "treat"] },
		within: { time: ["pre", "mid", "post"] },
		outcomes: {
			anxiety: { mean: 50, sd: 10, effect: "group*0.6 + time*0.4 + group:time*0.5" },
			mood:    { mean: 20, sd: 4,  effect: "time*-0.3" },
		},
		cov: { type: "ar1", rho: 0.5 },
		outcomeCov: { "anxiety~mood": -0.4 },
	},
}
```

| Field | Meaning |
|---|---|
| `between` | Between-subjects factors; each subject is assigned one cell, balanced across the crossing |
| `within` | Within-subjects (repeated-measures) factors, fully crossed within each subject – one row per cell, plus a subject id column |
| `outcomes` | The dependent variables, one entry each |
| `cov` | The within-subject covariance Σ_W |
| `outcomeCov` | Cross-outcome correlation for a multi-DV MANOVA, same shorthand as `phi`; omitted → independent outcomes |
| `subject` | The subject-id column name, default `subject`, emitted only when there are within factors |

A design needs at least one `between` or `within` factor and at least one outcome. Pure-within is allowed.

### Outcomes

A `normal` outcome takes `mean` and `sd` plus either an `effect` expression or a `cells` table. Any other `family` takes `params` and goes through the same NORTA transform the factor model uses, so `mean`, `sd` and `cells` are normal-only.

- `effect` – a Cohen's-d expression over the between and within factor names, where `:` makes an interaction term: `"group*0.6 + time*0.4 + group:time*0.5"`. This is the parsimonious default.
- `cells` – an explicit cell-means table keyed by comma-joined level labels, for a pattern no linear expression describes: `{ "control,pre": 48, "control,post": 52 }`.
- `missing` and `labels` work per outcome exactly as they do on a factor-model variable, except that a `mar` reference `on` names another **outcome**.

> **Between effects land exactly here.** The cell means are deterministic, so an authored d of 0.6 is a d of 0.6 in the population – no loading to attenuate it. That is the one place in the generator where the authored number and the population number are the same thing. Non-normal margins and within-correlation-dependent tests still realize off it.

### Within-subject covariance

`cov` is one matrix with three constructions:

| Form | Meaning |
|---|---|
| `{ type: "cs", rho: 0.6 }` | Compound symmetry – one correlation between every pair of cells. The default, at ρ 0.5 |
| `{ type: "ar1", rho: 0.5 }` | ρ^\|i−j\|, so adjacent timepoints correlate more than distant ones. Needs a single ordered within factor |
| `{ "pre~post": 0.4 }` | Unstructured, keyed by within-cell labels |

It applies to the normal latent, so it is exact for normal outcomes and warps for the others.

Analyze the result with the [comparison module](./comparison-analysis.md): between factors map to the grouping variable, within factors to the condition, and the subject column to the subject id. That is the module's native layout, so nothing needs stacking.

## Realized, not authored

Every number in a spec describes the population. What a student analyzes is one sample from it, so a realized correlation of 0.42 under an authored 0.45 is not an error – it is the sampling variation that makes each student's dataset their own. Two consequences are worth internalizing:

**The preview is the answer key, not the spec.** Wherever a non-linear margin, a measurement model or a NORTA transform sits between what you wrote and what appears in a column, the realized value is the one that matters. Generate the preview and read it.

**Significance is emergent.** You set effect sizes; whether a given student's t-test clears α is the honest consequence of their sample. That is a feature – "it's variables 1 and 3" is not shareable between students – but it means an effect parked near the threshold makes the question a coin flip. Set effects comfortably far from zero unless the variation is the point.

## Guardrails

The Builder checks a spec before it generates, and reports the problem where you can act on it:

- A correlation matrix (`phi`, `predictorPhi`, `groupPhi`, `outcomeCov`) that is not positive-definite is rejected by name before generation, rather than surfacing as a raw solver error mid-draw.
- The preview warns when an indicator's loadings leave it almost no residual variance, which makes it a near-deterministic function of the factors. Lower the loadings if that was not deliberate.
- Unknown factor names, malformed mini-DSL expressions, a bad parameter count for a family and a cyclic `paths` block are all reported with the name of the entry that caused them.

## Tips

**Author the questions against the data you actually drew.** Write the spec, preview it, then write the `exam` block and press **Compute answer key**. A question is only as good as the realized dataset under it – a set question whose answer is the whole domain for every reroll is telling you the effects are too big.

**One link per block of assignments.** A link carries one dataset. Questions needing a different structure – repeated measures, a different grouping variable, a different instrument – belong in their own link with their own spec.

**Use `id` to label the exam.** It rides into the exported document's provenance line, which is what tells you which assignment a submitted file belongs to.

**Reroll before you export.** The pattern of significant results should shift between students. If it never does, every student has the same answers and the anti-copying property is gone.

**Mock data is the debugging tool.** Anything the preview does not report – a realized interaction, an indirect effect, an ICC on a specific indicator – is one **Load mock data into app** away from being measurable in the app itself.

## When to use which

**Factor model or design?** If the question is about measurement – reliability, factor structure, correlations between scales – it is a factor model. If it is about an experiment with conditions and cells, it is a design. Repeated measures is the clearest split: the design template emits the long format the comparison module reads natively, while the factor route would emit wide columns the student has to stack first.

**`effect` or `cells`?** An `effect` expression is shorter and says what you mean – mains and interactions in d units. Reach for `cells` only when the pattern is not linear: a crossover, a plateau, one cell that misbehaves.

**`groups` or `predictors`?** A group is categorical and emits levels; a predictor is continuous and emits a number. Both shift the factor means, so the choice is simply which analysis you want the student to run – a comparison, or a regression.

**A bulk block or listed items?** List them while every item differs meaningfully. Switch to a block as soon as they are variations of one loading, and use an array of sets the moment reverse-keyed items are in play – the per-student shuffle is what stops the answer from being shared.
