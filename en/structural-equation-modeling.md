---
title: Structural equation modeling and confirmatory factor analysis
description: SEM and CFA in DataSuite 2 – measurement and structural models, mediation, multi-group fits, measurement invariance testing and model comparison.
---

# Structural equation modeling and confirmatory factor analysis

The **Structural equation modeling** (SEM) module fits a measurement model, a structural model, or both at once. You build the model with two interactive matrices (one for factor loadings, one for regression paths), a covariance list, a latent-interaction builder and a mediation helper for indirect effects. A lavaan syntax box stays in sync with the matrices – edit either, the other follows – and a live path diagram updates as you go. After running, you get fit indices, parameter estimates, optional reliability and discriminant validity, modification suggestions, and a path diagram with switchable standardization. The whole model can also be fitted across the groups of a categorical variable, with per-group estimates, diagrams and equality constraints you choose – see [structural equation modeling](./concepts/latent-variables.md#b-structural-equation-modeling). {#structural-equation-modeling}

> **CFA vs. SEM:** the [Confirmatory factor analysis](#confirmatory-factor-analysis) chapter covers the measurement-only case – testing whether a factor structure fits – see [confirmatory factor analysis](./concepts/latent-variables.md#b-cfa). SEM extends it with structural paths (`~`) between latent factors and observed variables, mediation with indirect effects, and a mean structure for latent mean comparisons – same module, same widgets; you add structural equations or `:=` definitions.

1. [Select your variables](./getting-started.md#choosing-variables) – at least 4 numeric for a measurement model, 2+ for path analysis without latents
2. Define your [measurement model](#measurement-model) (factors → indicators) if you have latents
3. Add [structural paths](#structural-model) – pick endogenous variables, tick predictors
4. Optionally specify [covariances](#covariances), [latent interactions](#latent-interactions), [indirect effects](#indirect-effects-and-defined-parameters), or paste lavaan syntax in the [text box](#lavaan-syntax-box)
5. Configure [estimation](#options), then click **Run SEM** for [results](#reading-results)

## Model specification

The editor is five cards down the left column, one accordion on the right and a preview underneath. **Model specification** is the measurement matrix (factor → indicators), **Structural model** the regression matrix (endogenous → predictors), **Covariances** the list of `~~` pairs, **Latent interactions** the product-indicator builder and **Indirect effects** the mediation helper; the **lavaan syntax** accordion holds the text every card draws from, and the **Diagram preview** below the row shows whatever currently parses.

Each matrix has its own **Clear** button that resets *that card only* – clearing the measurement matrix leaves your structural equations, covariances and `:=` lines standing. **Clear model**, in the options column beside **Run SEM**, is the one that wipes everything: both matrices, the covariance list, the interactions and the syntax box. Queued [comparison models](#model-comparison) survive both, since they belong to finished runs rather than to the draft.

### Measurement model

The card titled **Model specification** is the measurement matrix, the same in a CFA and an SEM – see [CFA model specification](#cfa-model-specification) for cell behavior, factor management, second-order factors and auto-detect from names; its cells take the [modifier popover](#constraints-and-modifiers) below. Anything you build there is part of the same model the structural matrix and the syntax box draw from. If you define no factors, the structural matrix still operates on observed variables alone – that is a path analysis model.

### Structural model

The **Structural model** matrix sits below the measurement matrix. Rows are endogenous variables – the left side of a `~` regression – and columns are the predictor pool: every selected numeric variable plus every latent factor you have defined, second-order factors included. {#predictor-pool}

- **Endogenous** – the row column: the variables being predicted, one row per equation, each with a **×** that removes the equation. Adding a variable here doesn't remove it from the predictor pool – a variable can be endogenous in one equation and a predictor in another.
- **Select endogenous variable...** – the placeholder of the dropdown under the matrix: pick an observed or latent variable and click **Add equation** to give it a row. A variable that already has a row is not offered again, and the button is disabled when nothing is left to add.
- **Tick a cell** to add that predictor to the equation. Clicking a ticked cell opens the [modifier popover](#constraints-and-modifiers), whose **×** removes the path again.
- **Self-edges are blocked** – the diagonal cell, where row and column name the same variable, is disabled. A variable cannot predict itself.
- **Cycles are flagged in red.** If your paths form a feedback loop (A → B → A, or A → B → C → A), every ticked cell on the loop highlights red. lavaan supports non-recursive models, so the loop is accepted – the highlight tells you to think about whether identification holds (see [common pitfalls](#common-pitfalls)).
- **References outside the variable pool stay visible.** If an equation names a variable that isn't in your current selection, the matrix grows a muted orphan column (or marks an orphan target row) for it rather than dropping the reference. You can clear a path from that column but not add one – reselect the variable to edit it normally. The column keeps its place in the header when the matrix repaints, so the ticks stay under the predictors they belong to.
- **The model runs on those references too.** A numeric column the dataset holds is resolved whether or not it is currently selected, and the fit is sent the selected columns plus whatever else the model names. A name the dataset doesn't have at all is underlined in the syntax box and closes **Run SEM**.
- **Cells are keyboard-operable.** Tab reaches each cell, Enter or Space toggles the one that has focus, and every cell announces the path it stands for to a screen reader. Focus stays where you left it when the matrix repaints after a toggle.

> **Path analysis vs. full SEM:** a model with only `~` lines on observed variables is a path analysis – see [path analysis](./concepts/latent-variables.md#b-path-analysis); add latent factors and you have full SEM. The module handles both – there is no separate mode to switch into.

### Covariances

The **Covariances** card takes any pair of variables you want to covary: two observed variables (a residual covariance, for indicators that share method variance), two factors (an explicit covariance between latents – lavaan already correlates exogenous latents, so a row is needed only when the default isn't what you want), or one of each. Add a residual pair only with a theoretical reason – shared method, similar wording, adjacent placement – and let the [modification indices](./concepts/latent-variables.md#b-modification-indices) suggest candidates rather than adding pairs to improve fit. {#covariances-card}

- **Select variable...** – the placeholder of an empty dropdown, here and in the [indirect effects](#indirect-effects-and-defined-parameters) form: pick an observed variable or a latent factor. Choose two different variables and click **Add**; a pair already listed is refused with a toast.

The list shows each pair as a badge, `x1 ~~ x2`; a line typed in the syntax box with a modifier (`x1 ~~ a*x2`, `x1 ~~ 0.3*x2`) shows the modifier on the badge's right-hand side. The card cannot edit modifiers – type them in the [syntax box](#lavaan-syntax-box) – but its **×** removes the line.

### Latent interactions

The **Latent interactions** card builds a moderation term between two latent factors as a latent variable of its own, measured by products of the two factors' indicators, and adds it to the predictor pool – regress an outcome on it in the [structural model](#structural-model) to test the moderation; see [moderation](./concepts/regression-basics.md#b-moderation). The interaction stays latent rather than being built from scale scores, and the construction is the product-indicator approach, fitted inside lavaan. Latent moderated mediation falls out of an interaction plus a `:=` line, with no extra machinery.

- **First factor** – one component of the interaction. The list offers first-order factors with at least one indicator – not second-order factors, whose indicators are latents with no column to multiply, and not interactions already defined.
- **Second factor** – the other component, from the same list. Choosing the same factor twice is refused.
- **Select factor...** – the placeholder of the two factor dropdowns: both have to be chosen before **Add interaction** does anything.
- **Name** – the new parameter's name, in this card and in the [indirect effects](#indirect-effects-and-defined-parameters) form. The suggestion follows what you pick – the two factors' names run together for an interaction (`XZ` for factors `X` and `Z`), `indirect` for an indirect effect – and steps to `XZ2`, `indirect2`, … when the name is taken. Like every name in the model it has to be free across the whole parameter namespace – variable and factor names, path labels and `:=` names alike – and to be a lavaan identifier: letters, digits, underscores and dots, not opening with a digit. A name you typed that is already in use is refused with "This name is already in use – choose another." rather than silently equating two parameters.
- **Indicator pairing** – how the product columns are formed from the two factors' indicators, taken in the order the measurement matrix lists them.
	- **Matched pairs** – the default: the indicators are paired off in order, each used once, so no residual covariances are needed. When the two factors carry different numbers of indicators the surplus stay unpaired, and the toast names them.
	- **All pairs** – every indicator of one factor crossed with every indicator of the other – all the available information in the product. Products that share an indicator covary through it, so the card adds the residual covariance (`~~`) row between every such pair to the [covariances](#covariances) list.
- **Centering** – what gets multiplied. The means are taken over the rows where both indicators are present – the sample the fit sees.
	- **Double mean centering** – the default: centers the indicators, multiplies, then centers the products again. It needs no mean structure and leaves the product with a mean of zero.
	- **Mean centering** – centers the indicators and multiplies. The product's mean is then the components' covariance, which the model has to absorb.
	- **Orthogonalizing (residual centering)** – regresses each raw product on its two components and keeps the residual, leaving a product uncorrelated with both. The run is refused when a pair's two indicators are perfectly collinear, since there is then nothing to separate – use double mean centering instead.

Clicking **Add interaction** adds the interaction to the measurement matrix as a factor measured by the product columns (`XZ.1`, `XZ.2`, …), adds the `~~` rows that all-pairs reuse requires, and writes the definition into the syntax box as a comment beside the `=~` line: `# @interaction XZ = X * Z (matched, dmc)`. That comment round-trips through copy, paste, re-parse and history restore exactly like the rest of the model, and editing it is how an interaction is changed after the fact; delete it and the `=~` line names columns nothing builds, which validation refuses by name. An interaction needs at least two product indicators to be identified, so a pair of factors that yields fewer is refused. The card lists every definition with its product count, pairing and centering, and its **×** removes the latent, the comment and the `~~` rows between its products.

The product columns are built when the model runs, from the rows that reach the fit, and never enter your dataset. An interaction latent is exempt from **Allow factors to correlate** being switched off: its covariances with its own two components are what the product-indicator approach estimates, not something it assumes away. Renaming an interaction in the measurement matrix carries through to the comment and to the product column names. After the fit, a *Latent interaction construction* section of the results lists every product indicator beside the two indicators it came from, so a reader can check what `XZ.1` actually was.

### Indirect effects and defined parameters

A defined parameter is a lavaan `:=` line – an expression built from other parameter labels that lavaan computes (and bootstraps, if requested) alongside the fit. The **Indirect effects** card is the GUI shortcut for mediation – one mediator, several in parallel, or a serial chain – see [mediation](./concepts/regression-basics.md#b-mediation).

- **Predictor (X)** – the variable whose effect is mediated; observed or latent.
- **Mediator (M)** – the variable the effect runs through. For one mediator, pick it and go on; for several, click **Add** beside the dropdown once per mediator – they collect in a list below the form, where the [parallel or serial](#several-mediators) choice is made.
- **Outcome (Y)** – the variable the effect lands on. Predictor, mediators and outcome must all be different.

The *Name* field is the one described under [latent interactions](#latent-interactions): it suggests `indirect`, then `indirect2`, … on collision, and refuses a typed name that is already taken.

Clicking **Add indirect effect** with one mediator makes sure the X→M, M→Y and X→Y paths exist as labelled structural regressions – labels `a`, `b`, `c`, … from the letters not already used anywhere in the model, then `m1`, `m2`, … once the alphabet is spent – and emits three lines: the indirect effect `name := a*b`, the direct effect `direct := c` and the total effect `total := c+a*b`. Reporting all three is what a mediation write-up needs, and computing them together means they share one bootstrap pass. Re-running with the same triple is idempotent – it won't duplicate paths, rename existing labels or stack a second definition of the same expression. If the direct X→Y path is pinned to a fixed coefficient or differs across groups, the form emits the indirect line alone and says so in the toast; a fixed or group-wise X→M or M→Y path stops the form instead, since no single label names it – edit it in the syntax box first.

#### Several mediators

Queue a mediator with **Add** and the chain list appears under the form with a **Parallel** / **Serial** toggle beside it. The toggle is enabled from the second mediator, because with one the two modes describe the same model – a single-mediator run emits exactly what it always did.

- **Parallel** – each mediator gets its own indirect effect, controlling for the others, and no mediator → mediator path is estimated. The form emits one `:=` per mediator, their sum as `totalIndirect`, plus `direct` and `total`.
- **Serial** – the mediators form an ordered chain (Hayes model 6). Drag the handles in the list to set the order; ordinals show there only in serial mode, since parallel mediators are exchangeable. The form writes the saturated forward set – every forward path among X, the mediators in order and Y – so the routes that skip a mediator stay estimated rather than being fixed at zero. It names one `:=` for the whole chain; `totalIndirect` sums every route through any subset of the mediators and `total` adds the direct path, while the shorter routes are what the [effect decomposition](#effect-decomposition) already prints, one row each.

The total is skipped, with a toast pointing you at the effect decomposition, when a serial chain has more than six mediators – too many routes to write as one expression – or when one of the routes is pinned to a fixed coefficient or differs across groups. A name you typed is honoured as typed for one mediator or a serial chain; with parallel mediators it is the base the per-mediator names are numbered from.

Auto-assigned path labels never collide with labels you typed by hand. Path labels, loadings, `~~` and `~1` modifiers, `:=` names and variable names share one namespace, and every generated label is minted against it – so a multi-mediator design, which mints several at once, is collision-safe by construction. Re-running a design is idempotent here too: the same buffer comes back, with nothing stacked.

For contrasts or any other custom expression, type `name := expression` directly into the [syntax box](#lavaan-syntax-box). It appears in the card's list with a remove (×) button, alongside the GUI-generated entries.

> **Bootstrap CIs come automatically.** With **Bootstrap confidence intervals** on in the [options](#options), lavaan computes an interval for every `:=` parameter from the same resampling pass – the right way to test an [indirect effect](./concepts/regression-basics.md#b-indirect-effect), which has no analytic SE.

### Lavaan syntax box

The **lavaan syntax** accordion (right column) holds the canonical model text. It is *not* a one-way preview – anything you type there flows back into the matrices, just as anything you do in the matrices flows into the text. There is no Apply/Cancel button – the matrices update automatically as you type.

Practical implications:

- **Paste a model from a publication** – drop the lavaan syntax in, the matrices reorganize to match. Useful when the literature reports a model in lavaan notation.
- **Type things the matrices don't model** – equality constraints (`a == 2*b`), inequalities against a label (`b > c`) or a constant (`p > 0.2`, `q < 0.9`), intercepts (`x1 ~ 1`), starting values, label names, fixed values, comments. They survive matrix edits because the parsed buffer is the source of truth, not what the matrices know how to render. An operator the widgets don't model at all – formative measurement (`<~`), thresholds (`|`), scaling factors (`~*~`) – is kept as text: a dismissible banner lists the statements kept text-only, and they reach lavaan exactly as written.
- **Comments survive too** – trailing ones (`F1 =~ x1 + x2 # first factor`) as well as whole-line ones, under both markers (`#` and `!`). A name that appears only inside a comment is not treated as part of the model: it is neither underlined as unknown nor allowed to pull the estimator to WLSMV.
- **A label that collides with a column name stays a label.** If your dataset has a column `a`, then in `F2 ~ a*F1 / ind := a*2 / a == 0.4` the measurement and structural sides are translated to the internal alias while `a` on the parameter side is left as the parameter it is.
- **Mid-typing safety** – if a line doesn't parse yet (you are in the middle of typing `F1 =~ x1 +`), the matrices freeze on the last good state instead of clearing, and a notice above them says the widgets are paused until the syntax parses again.
- **Multi-group notation round-trips.** With a [group variable](#multi-group-analysis) selected, per-group modifiers (`F1 =~ c(a1, a2)*x1`) and `group:` blocks are parsed, shown in the matrices as group-wise cells, and written back out – so a multi-group model pasted from a publication survives a matrix edit instead of being read as a malformed single-group one. A term written into only some `group:` blocks is rewritten into `c(...)` form so every group carries an entry, which lavaan may fit as a different model than the text suggested; a dismissible banner names the statements it did that to and asks you to check the free-parameter count before running.
- **The buffer is what gets fitted.** Everything the widgets can't show – `:=` definitions, `==` constraints, variance and covariance modifiers – reaches lavaan exactly as written. A `x1 ~~ 0.2*m1` line you type is fitted as a fixed covariance, not quietly re-freed. Variance-scaling markers (`F1 ~~ 1*F1`) are preserved as typed rather than regenerated, so an unrelated toggle doesn't hand every other latent a marker you never wrote; switching the **Factor scaling** radio does rewrite them for every latent, which is what that control is for.

The **Copy** button copies the current text to the clipboard. Editing is assisted: syntax highlighting, a lint gutter, underlines on names the dataset doesn't have, and completion for the selected variables, the factor names declared anywhere in the buffer and the five operators (`=~`, `~`, `~~`, `:=`, `==`) with a plain-language reading of each – **Tab** accepts the highlighted completion.

Column names that aren't legal lavaan identifiers – a space, a hyphen, a leading digit, an R reserved word – appear under an automatic alias (`Age (years)` → `Age__years_`) everywhere the buffer speaks: the syntax box, the completions, the diagram. The original header still resolves if you type it, so saved models and pasted configurations keep working. Rename a column in the data view and the buffer is rewritten to the new name instead of being left with a reference that no longer resolves; the rewrite is skipped while a parse is pending, a syntax error stands or a fit is running, so it can't discard an edit in progress.

When lavaan reports an error, it appears below the box with the offending token underlined at the position lavaan reported. The matrices stay frozen on the last successful parse – they don't go blank – and catch up automatically once the syntax parses again.

If the editor's self-test fails, the text box still runs. On load the module checks that lavaan reads its generated syntax the way it wrote it; if that check fails – or a later widget edit produces text lavaan reads back differently – the widgets are hidden and a banner says the visual editor can't be trusted, but the syntax box is then the model, and **Run SEM** fits exactly what it holds. Two things are missing in that mode, because both are projections of the spec the self-test rejected: the summary's factor list and the path diagram. Invariance testing is unavailable for the same reason, and a selected group variable is ignored with a warning.

### Constraints and modifiers

Click an already-ticked cell in either matrix to open a popover for that cell. It takes the modifier in lavaan's own notation, so what you type is what appears in the syntax box:

- **A number** (`1`, `1.5`, `-0.3`, `1e2`) – fixes the parameter to that value
- **A label** (`a`, `loading_anx_1`) – creates an equality constraint; every cell with the same label is forced to share one estimate
- **`NA*`** – frees a parameter the scaling convention would otherwise fix
- **`start(.7)`** – supplies a starting value, and combines with a label (`start(.7)*a`); the cell's badge shows it compactly as `~.7 a`
- **Leave empty + OK** – reverts to a plain free parameter
- **× button** – removes the parameter entirely (same as un-ticking the cell)

The modifier is a set rather than one value, so a label and a start value coexist and editing one doesn't discard the other. This is how you'd specify, say, two loadings constrained to be equal (`F1 =~ a*x1 + a*x2 + x3`) without touching the syntax box. Enter confirms from any field and Escape dismisses the popover.

With a [group variable](#multi-group-analysis) selected, the popover grows an **Equal across groups** checkbox, ticked by default. Untick it and you get one field per group, which lavaan receives as its `c(...)` vector notation (`F1 =~ c(a1, a2)*x1`). A cell whose modifier already differs by group shows the first group's value with a tooltip saying so, so a group-wise parameter is visible in the matrix rather than only in the syntax box – and it stays editable from the popover instead of sending you to the text.

### Diagram preview

Below the editor, the live diagram renders whatever currently parses. Latents are ellipses, observed variables are rectangles, structural arrows go between them, factor → indicator arrows go from each latent ellipse to its indicators stacked alongside it, covariance arcs curve out to the side and a feedback loop is drawn as an arc above the band. With no estimates yet, the edges show modifier labels (fixed values, label names) where present and stay unlabelled otherwise – on every edge kind, so a fixed structural path (`F3 ~ 0.5*F2`), a fixed higher-order loading and a fixed covariance (`x1 ~~ 0.2*x2`) are all marked, not just first-order loadings. After a fit, the same renderer shows the [post-fit diagram](#path-diagram) with estimates.

A model wider than the card scrolls horizontally inside the preview rather than pushing the page sideways. If your buffer doesn't parse yet, the preview keeps the last model that did – same logic as the matrices.

## Options

The right column holds every fit option, in the order below. The four buttons above them act elsewhere: **Check data** runs the [diagnostics](#check-data), **Run SEM** fits the model once the [validation rules](#validation-rules) pass, **Compare models** opens the [model comparison](#model-comparison), and **Clear model** wipes the draft (see [Model specification](#model-specification)). The panel serves the measurement-only case too; [CFA options](#cfa-options) says what reads differently there.

### Factor scaling

How each latent variable gets a scale – see [marker variable](./concepts/latent-variables.md#b-marker-variable). Switching the radio rewrites the `F ~~ 1*F` lines in the syntax box for every latent, second-order factors included, replacing whatever the buffer pinned.

- **Marker variable (first loading = 1)** (default) – the first indicator on each factor's `=~` line has its loading fixed to 1, so the factor is measured in that indicator's units; put another indicator first to make it the marker.
- **Fixed variance (factor variance = 1)** – every latent variance is fixed to 1 and all loadings are estimated: a `F ~~ 1*F` line per latent in the syntax box, `std.lv = TRUE` in the fit. Same fit and the same standardized estimates as the marker choice; the unstandardized loadings become comparable across indicators.

### Factor correlations

- **Allow factors to correlate** (on by default) – the exogenous latent variables covary freely, lavaan's default. Unticked, the syntax box gains a `F1 ~~ 0*F2` line for every pair of exogenous factors – an orthogonal model. An endogenous factor is untouched either way, since lavaan fixes its residual covariances at zero unless you add a `~~` pair, and so is a [latent interaction](#latent-interactions), whose covariances with its components stay free.

### Estimator

**Estimator.** Which lavaan estimator fits the model – see [estimator](./concepts/latent-variables.md#b-estimator). Two things override the pick, and the [model summary](#model-summary) names the estimator that actually ran: a variable *the model names* that is typed Ordinal in the data view puts the fit into categorical mode and substitutes WLSMV for any estimator outside the five least-squares ones, and selecting FIML under [Missing data](#missing-data) greys out MLM, MLMVS and MLMV, switching you to MLR if one of them was selected. A typed-ordinal column the model does not mention changes nothing, and picking WLSMV without typing the columns Ordinal fits them as continuous.

- **ML (maximum likelihood)** (default) – for continuous, roughly normal indicators; its χ² and standard errors assume multivariate normality, which the Mardia tests under [Check data](#check-data) judge.
- **MLR (robust ML, Huber-White)** – ML estimates with Huber–White (sandwich) standard errors and a Yuan–Bentler scaled χ². The one robust ML variant that accepts FIML, so the choice for data that are both non-normal and incomplete.
- **MLM (robust ML, Satorra-Bentler)** – ML estimates with robust standard errors and a Satorra–Bentler scaled χ², for continuous non-normal data under listwise deletion.
- **MLMVS (robust ML, Satterthwaite)** – MLM with a mean- and variance-adjusted χ² whose df is adjusted too, so the [fit table](#model-fit) shows a fractional test df beside the model's.
- **MLMV (robust ML, scale-shifted)** – MLM with a scale-shifted, mean- and variance-adjusted χ² that keeps the model's df.
- **WLSMV (robust DWLS, recommended for ordinal)** – diagonally weighted least squares with robust standard errors and a mean- and variance-adjusted χ²: the estimator for ordinal indicators, fitted on polychoric correlations and thresholds for the columns typed Ordinal, and the one the module substitutes when the model names a typed-ordinal variable.
- **ULSMV (robust ULS, mean+variance adjusted)** – unweighted least squares with the same robust corrections; an alternative for ordinal indicators.
- **DWLS (diagonally weighted LS)** – WLSMV's estimates without the robust standard errors and the adjusted χ².
- **ULS (unweighted LS)** – ULSMV's estimates without the robust corrections.
- **WLS (weighted LS)** – weighted least squares with the full asymptotic weight matrix, which needs a very large sample (N > 1000) to estimate.
- **GLS (generalized LS)** – generalized least squares for continuous data, asymptotically equivalent to ML under normality and with no robust variant; a FIML request falls back to listwise deletion under it, and the summary says so.

### Multi-group analysis

**Multi-group analysis.** Pick a variable from the dropdown to fit the model in each of its groups at once; the list offers the categorical and ordinal variables among those selected. What the run does depends on the model: a measurement-only model (no `~` line) runs the sequential [invariance cascade](#measurement-invariance-testing), while a model with structural equations is fitted once across the groups with the constraints you tick below, and every table, diagram and reliability block in the results takes the group dimension – see [Multi-group results](#multi-group-results). Changing the variable re-parses the syntax box, since a `c(…)` modifier has to match the group count. Under the dropdown a line lists the groups with their sizes – complete cases under listwise deletion – in amber below 50 cases and in red below the group's share of the free parameters, with a warning beneath in either case. The run refuses a variable with fewer than 2 distinct non-blank values, naming the count it found, and ignores the variable with a warning while the visual editor is disabled (see [the syntax box](#lavaan-syntax-box)).

- **Disabled** – no grouping: one fit on the whole sample.

**Constrain across groups.** Appears once a group variable is selected and the model has a structural equation – the cascade picks its own constraint levels rung by rung. Each box equates one family of parameters across the groups, one of lavaan's `group.equal` levels. Nothing ticked fits a configural model, every parameter free in every group: the right baseline, but it tests nothing by itself – ticking **Structural paths** is what asks whether the model works the same way in each group.

- **Factor loadings** – the indicator → factor loadings (`loadings`). {#constrain-across-groups-factor-loadings}
- **Indicator intercepts** – the observed `~ 1` intercepts (`intercepts`); ticking it turns the mean structure on inside lavaan. {#constrain-across-groups-indicator-intercepts}
- **Residual variances** – the indicators' residual variances (`residuals`). {#constrain-across-groups-residual-variances}
- **Latent variances** – the factor variances (`lv.variances`). {#constrain-across-groups-latent-variances}
- **Latent covariances** – the factor covariances (`lv.covariances`). {#constrain-across-groups-latent-covariances}
- **Structural paths** – the `~` regression coefficients (`regressions`). {#constrain-across-groups-structural-paths}

### Missing data

**Missing data.** How a case with a blank on a variable the model names is handled. FIML runs only under ML and MLR, so the mode that ran can differ from the one requested: the [model summary](#model-summary) reports it, with *(requested FIML; unavailable with …)* beside it, and its sample-size line follows the same resolution, so a downgraded run never reports an FIML N.

- **Listwise deletion** (default) – a case missing any variable the model names is dropped and the fit runs on the complete cases, reported out of the total rows – see [listwise deletion](./concepts/outliers-missing-data.md#b-listwise-deletion).
- **FIML (full information ML)** – every case contributes the likelihood of the values it has, so nothing is dropped and the summary's N is the whole sample, with the complete-case count beside it – see [FIML](./concepts/outliers-missing-data.md#b-fiml). Selecting it greys out MLM, MLMVS and MLMV in the estimator list and switches you to MLR if one of them was selected; under an ordinal model, where WLSMV is in force, it becomes pairwise deletion, and under GLS listwise. FIML also turns the mean structure on inside lavaan, so intercepts appear in the output without **Estimate intercepts** being ticked.

### Standardization

**Standardization.** Which standardized form the estimate tables and the path diagram open on. Both standardized solutions are always computed, so the choice sets the initial view only: the [toolbar](#standardized-estimates-toolbar) above the first estimate table shows or hides either standardized column group without a refit, and the diagram has its own picker.

- **Unstandardized** – raw-metric estimates only: both standardized column groups start hidden and the diagram opens on the unstandardized values.
- **Completely standardized** (default) – lavaan's `std.all`: latent and observed variables both scaled to unit variance, so a loading reads as the indicator–factor correlation and a path as a standardized regression coefficient – see [standardized loading](./concepts/latent-variables.md#b-standardized-loading).
- **Standardized (latent only)** – lavaan's `std.lv`: only the latent variables are scaled to unit variance and the observed ones keep their units, so a loading is the indicator's change per SD of its factor.

### Mean structure

- **Estimate intercepts** (off by default) – adds a mean structure to the model: intercepts (`~ 1`) for the modelled variables, governed by the two sub-options that appear when it is on, and an [Intercepts](#intercepts) table in the output. You need it for latent mean comparisons in a grouped structural model and wherever the means themselves matter – mediation involving means, a mean-based `:=` definition; under FIML lavaan turns it on by itself, so the box need not be ticked. In a single-group model with none of those it only adds parameters – leave it off. The [invariance cascade](#multi-group-analysis) sets its own mean structure and ignores this card.
- **Free observed-variable intercepts** (on by default) – the observed `~ 1` parameters are estimated; off fixes them at zero, which is rarely what you want.
- **Free latent-variable intercepts** (off by default) – the latent `~ 1` parameters are estimated, which is what puts latent means in the output. On together with free observed intercepts it is not identified in a single group, and **Run SEM** stays closed until one of the two is cleared (see [Validation rules](#validation-rules)); a pure path model has no latent means and runs with both.

### Bootstrap

- **Bootstrap confidence intervals** (off by default) – refits the model on resamples of the cases and takes the standard errors and confidence intervals of every estimate and every `:=` parameter from them; the replication count and the seed come from [Settings](./settings.md#bootstrap-replications), and the summary's estimator line shows the count. Every [estimator](#estimator) takes it: a robust one is bootstrapped as its base estimator with the same robust χ², so the bootstrap standard errors replace its robust ones – the estimator line says so – while every fit index is read from a fit without the bootstrap and equals the one a run without it prints. The interval type follows that count: BCa when there are more replications than analysed cases, a bias-corrected percentile interval otherwise, and a plain percentile interval as the floor – the CI column header names the one used. A notice on the card says when the count is below 1000, or too low for BCa; the shipped default of 100 is below both bars, so raise it before reporting bootstrap bounds – see [bootstrap](./concepts/confidence-intervals.md#b-bootstrap).

### Output options

Each box prints or withholds one part of the results card; none of them changes the fit, and the five that add computation – the decomposition, the modification indices, the reliability, residual-correlation and discriminant-validity blocks – run only when ticked.

- **Model fit indices** (on by default) – the [Model fit](#model-fit) table – see [model fit indices](./concepts/latent-variables.md#b-model-fit-indices).
- **Parameter estimates** (on by default) – the estimate tables: [structural regressions](#structural-regressions), [factor loadings](#factor-loadings), [covariances](#covariance-estimates), [defined parameters](#defined-parameters), [intercepts](#intercepts), [thresholds](#thresholds), the [variances](#factor-variances-latent-residual-variances-and-residual-variances) and R², with the [standardization toolbar](#standardized-estimates-toolbar) above the first – see [parameter estimates](./concepts/latent-variables.md#b-parameter-estimates).
- **Effect decomposition** (on by default) – the [Effect decomposition](#b-effect-decomposition) table of a structural model: total, direct and indirect effects for every pair of variables joined by at least one indirect route. It has its own switch, so it renders even with the estimate tables off. {#effect-decomposition-option}
- **Modification indices** (on by default) – the [Modification indices](#b-modification-indices) section – see [modification indices](./concepts/latent-variables.md#b-modification-indices). {#modification-indices-option}
- **Factor reliability (α, ω, AVE)** (on by default) – the [Factor reliability](#factor-reliability) table, one row per factor.
- **Residual correlation matrix** (off by default) – the [Residual correlations](#residual-correlations) matrix, one per group in a grouped fit.
- **Discriminant validity** (off by default) – the [Discriminant validity](#b-discriminant-validity) section: the factor correlations, HTMT2 and the Fornell–Larcker criterion – see [discriminant validity](./concepts/latent-variables.md#b-discriminant-validity). {#discriminant-validity-option}
- **Path diagram** (on by default) – the [Path diagram](#b-path-diagram) with its standardization picker – see [path diagram](./concepts/latent-variables.md#b-path-diagram). {#path-diagram-option}

## Check data

The **Check data** button runs the pre-flight battery described under [Data diagnostics](#data-diagnostics) without fitting anything, in a **Data diagnostics** card; it opens once two numerical variables are selected. When the model names at least two numerical variables – indicators plus the observed variables in the structural equations – those are what it checks, so a path model with no latents is covered too; otherwise it checks every selected numerical variable, and the card's scope line says which happened. A non-numerical column the model names is left out and named in a toast, so the battery runs end to end rather than stopping part-way. Two things differ from a plain variable check: the [sampling adequacy](#sampling-adequacy) block is skipped when the model has no latent factors, since a path model has nothing to factor, and sample-size adequacy is graded against **complete cases per free parameter** rather than per variable, on the free-parameter count the [model summary](#model-summary) reports – per variable again while a grouped model's count has not landed. A checked column typed Ordinal switches the adequacy battery to mixed (polychoric/polyserial) correlations. {#data-diagnostics}

## Validation rules

The **Run SEM** button opens only while the model passes every rule below, re-checked on every edit, and a run that still fails one is refused with a toast naming it. **Run SEM**, **Check data** and **Compare models** are closed for the duration of a fit, so a second click cannot start a second fit over the first one's workspace.

- Either at least one factor with **2+ indicators**, or at least one structural equation with **1+ predictor**. A factor row nothing has been assigned to emits no `=~` line and is skipped rather than failing the check, a factor with a single indicator fails it, and an equation with no ticked predictor emits no `~` line the same way.
- Each second-order factor with any loadings needs **2+ first-order factors**.
- Every name in the model must be a column of the dataset – not necessarily a selected one – a factor, a label or a `:=` name; unknown names are underlined in the syntax box and named in the toast.
- Every [latent interaction](#latent-interactions) must still be buildable from the measurement model – both component factors present, at least two product indicators between them; the toast names the interaction and the reason.
- The buffer must parse: with a syntax error standing, **Run SEM** toasts and fits nothing, rather than fitting the last model that parsed.
- With a mean structure on, **Free observed-variable intercepts** and **Free latent-variable intercepts** cannot both be ticked when the model has latents – in a single-group model and in a grouped structural model alike. A measurement-only model with a group variable gets a warning instead, since the [invariance cascade](#multi-group-analysis) sets its own mean structure; a pure path model has no latent means to conflict with and runs with both.
- The model must be at least just-identified (**df ≥ 0**). The count is lavaan's own, read back from each parse of the syntax box, so `==` constraints, labels and the mean structure are accounted for; a widget-side estimate fills the gap before the first parse lands, and a grouped model's df stays uncounted until lavaan's count lands, the gate quiet meanwhile. df = 0 runs, with a warning that the fit indices are not meaningful.
- A selected [group variable](#multi-group-analysis) must hold **2 or more distinct non-blank values**; the run is refused with the count found.

One more warning lets the run go ahead: a factor with exactly two indicators and no free link to another latent – no regression, no second-order loading, no free covariance – may not be identified. The **N : parameter ratio** is a summary line, not a gate – see [Model summary](#model-summary).

## Reading results

Results appear in a **Structural equation modeling** card, its sections in the order below. A model with no `~` line is fitted as a CFA and its card is titled **Confirmatory factor analysis**: the same summary, fit table and estimate tables, with the covariances and the modification indices split by kind as the CFA chapter's [single-group results](#single-group-results) describe. A fit lavaan refused shows its message under **Error** – with suggestions when the message is a known one, a non-positive-definite matrix or a convergence failure – and keeps the **Restore this model** button, so the model can be edited; a fit that ran to its iteration cap shows **Warning: Model did not converge** above whatever it returned – the estimates and the diagram, while the fit indices and every block that needs a converged solution (the decomposition, reliability, discriminant validity, modification indices, residuals) are skipped. lavaan's own warnings are listed under **Warnings**, and a bootstrapped run states under them when its replication count is below 1000, or too low for a BCa interval.

### Model summary

The lines at the top of the card describe the fit that ran, not the one requested: every count is lavaan's own, read from the fitted parameter table, so `==` constraints and the mean structure are already in it.

- **Factors** – the first-order factors of the measurement model, by name; **Second-order factors** lists the higher-order ones when the model has any
- **Structural equations** – how many `~` equations the model has
- **Estimator** – the estimator that ran, with *(requested …; substituted for ordinal indicators)* beside it when a typed-ordinal variable put the fit into categorical mode – see [Estimator](#estimator) – and the replication count when [bootstrap](#bootstrap) was on {#model-summary-estimator}
- **Missing data** – shown when FIML was requested: the mode lavaan applied – FIML, pairwise or listwise deletion – with *(requested FIML; unavailable with …)* when the estimator could not take it – see [Missing data](#missing-data); under listwise deletion, the default, the line is absent {#model-summary-missing-data}
- **Degrees of freedom** – the model's df – see [model degrees of freedom](./concepts/latent-variables.md#b-model-degrees-of-freedom); the fit table's χ² row can carry a different, adjusted df under MLMVS, and this is the one to report
- **Sample size** – the cases lavaan analysed: under FIML the whole sample, with the complete-case count beside it; under pairwise deletion the cases with data, the complete-case count beside it; under listwise deletion the complete cases, out of the total rows {#model-summary-sample-size}
- **Free parameters** – the parameters lavaan estimated – see [free parameters](./concepts/latent-variables.md#b-free-parameters)
- **N:parameter ratio** – the sample size divided by the free parameters, with *(potentially underpowered, recommend 5-10:1)* beside it below 5; the same guideline the [Check data](#check-data) card grades sample-size adequacy on
- **Restore this model** – reverts the editor to this run's state: buffer text, group variable and its **Constrain across groups** ticks included. Offered for failed fits too – a model that did not converge is the one you want back in the editor.
- **Add to comparison** – queues this run for the [model comparison](#model-comparison); the button reads **Remove from comparison** while it is queued, and a fit that failed or did not converge has no button, since it could only contribute an empty column {#add-to-comparison #remove-from-comparison}

### Model fit

**Model fit.** The fit of the whole model, one row per index, graded when [interpretation](./settings.md#significance-formatting) is on – see [model fit indices](./concepts/latent-variables.md#b-model-fit-indices) and the [fit-index cluster](./concepts/latent-variables.md#does-the-model-fit) the rows link. In a [grouped fit](#multi-group-results) the table stays one table, since the fit belongs to the model: the group sizes are stated above it and the χ² row carries each group's own contribution.

- **Model fit – Index** – the index's name; the χ² row reads **χ² (Chi-square)**, or **χ² (Scaled)** under a robust estimator, which is also when CFI, TLI and RMSEA are their robust or scaled versions and *Robust/scaled indices reported for the selected estimator* is stated above the table
- **Model fit – Value** – the index's value; the χ² row's carries [significance stars](./settings.md#significance-formatting) and its exact p in the hover, judged at the [assumption test significance level](./settings.md#assumption-test-significance-level) since its null is that the model fits exactly – see [which level a table reads](./concepts/hypothesis-testing.md#b-which-level-a-table-reads)
- **Model fit – Details** – the χ² row's df and p, each group's χ² contribution beside them in a grouped fit; RMSEA's 90% interval and *p-close*, the probability that the population RMSEA is below 0.05, read at the same level
- **Model fit – Interpretation** – the band the value falls in – *Excellent fit*, *Good fit*, *Mediocre fit* or *Poor fit*: CFI, TLI, RMSEA and SRMR against the [model fit cutoffs](./settings.md#statistical-thresholds) in force, GFI, AGFI, NFI, RFI and IFI against a fixed 0.95 / 0.90 / 0.85 scale, the rest ungraded. The column is dropped when the model has no degrees of freedom left (df ≤ 0), with a note that there is no fit to assess, and RMSEA's cell is left blank with a note when df < 50 and N is not above 200.

The rows:

- **χ² (Chi-square)** – the exact-fit test, whose Details hold its df and p; under a robust estimator the row reads **χ² (Scaled)** and holds the scaled statistic, whose df under MLMVS is the test's adjusted one rather than the model's – see [chi-square test of model fit](./concepts/latent-variables.md#b-chi-square-test-of-model-fit) {#χ²-chi-square #χ²-scaled}
- **CFI** – the comparative fit index – see [CFI](./concepts/latent-variables.md#b-cfi)
- **TLI (NNFI)** – the Tucker–Lewis index – see [TLI](./concepts/latent-variables.md#b-tli)
- **RMSEA** – the root mean square error of approximation, its 90% interval and p-close in Details – see [RMSEA](./concepts/latent-variables.md#b-rmsea)
- **SRMR** – the standardized root mean square residual – see [SRMR](./concepts/latent-variables.md#b-srmr)
- **GFI** – the goodness-of-fit index, the share of the observed covariances the model reproduces; graded on the fixed scale – see [GFI](./concepts/latent-variables.md#b-gfi)
- **AGFI** – GFI adjusted for the model's degrees of freedom; graded on the fixed scale – see [AGFI](./concepts/latent-variables.md#b-agfi)
- **NFI** – the normed fit index, the model's improvement over the [baseline model](./concepts/latent-variables.md#b-baseline-model) without a df correction; graded on the fixed scale – see [NFI](./concepts/latent-variables.md#b-nfi)
- **RFI** – the relative fit index, NFI with a df correction; graded on the fixed scale – see [RFI](./concepts/latent-variables.md#b-rfi)
- **IFI** – the incremental fit index, an NFI variant less affected by sample size; graded on the fixed scale – see [IFI](./concepts/latent-variables.md#b-ifi)
- **PNFI** – the parsimony-adjusted NFI, reported without a verdict – see [PNFI](./concepts/latent-variables.md#b-pnfi)
- **PGFI** – the parsimony-adjusted GFI, reported without a verdict – see [PGFI](./concepts/latent-variables.md#b-pgfi)
- **AIC** – see [AIC](./concepts/regression-basics.md#b-aic); for [comparing models](#model-comparison), not for judging one
- **BIC** – see [BIC](./concepts/regression-basics.md#b-bic); the same
- **Sample-adjusted BIC** – the BIC with a lighter penalty per parameter, for comparing models fitted to the same data; lower is better – see [sample-adjusted BIC](./concepts/latent-variables.md#b-sample-adjusted-bic) {#sample-adjusted-bic #ssa-bic}

### Multi-group results

With a [group variable](#multi-group-analysis) in force on a structural model, the card reports one fit for the model as a whole and gives everything parameter-level a group dimension. The [Model fit](#model-fit) table stays single; every per-parameter table – structural regressions, loadings, covariances, intercepts, thresholds, the variances, R² and factor reliability – keeps one row per parameter and spreads its value columns under a header spanning each group's block, and the standardized columns there are the estimates alone, without their SE, CI, z and p. The [defined parameters](#defined-parameters) stay a single-group table, since lavaan reports a `:=` parameter once for the whole model. The matrices – [discriminant validity](#discriminant-validity) and [residual correlations](#residual-correlations) – have no column dimension to spend, so each is repeated per group under a heading carrying the group's name, and the [path diagram](#path-diagram) is drawn once per group, in panels laid out up to two across and scaled to the card on one shared colour ramp, so the same structure is compared side by side. The [standardization toolbar](#standardized-estimates-toolbar) becomes a single **None** / **Latent only** / **Completely standardized** choice. {#multi-group-results}

A parameter you constrained reads identically in every group – that is what the constraint did – and an unconstrained one that happens to match looks the same on screen, so it is the **Constrain across groups** panel, not the table, that says which is which.

### Path diagram

**Path diagram.** The fitted model drawn as a picture – see [path diagram](./concepts/latent-variables.md#b-path-diagram): latents are blue ellipses, observed variables grey rectangles, structural paths arrows between them, loadings arrows from each ellipse to its indicators, and covariances arcs curving out to the side. Edges are coloured on the signed blue/red ramp the CFA diagram uses, the arrowhead taking its edge's colour, and their thickness follows the size of the estimate; a non-significant path is dashed at reduced opacity, judged at your [significance level](./settings.md#significance-level) and at the p of the standardization on screen, so a standardized path is tested against its own p. Every edge is labelled with its estimate – loadings and covariance arcs included – on a white backing, at the precision of the estimate tables and with [significance stars](./settings.md#significance-formatting) when they are on; a labelled parameter (`F2 ~ a*F1`) shows its label in italics in place of the estimate, so the terms of a `:=` line can be found on the picture. R² is written on each endogenous node. A picker of three radio buttons above the diagram – **Unstandardized**, **Latent only**, **Completely standardized** – switches between the three pre-rendered variants without a refit, opening on your [Standardization](#standardization) choice; each variant is resizable and exports (SVG / PNG / JPG, via the buttons beside it) under its own filename suffix. The legend lists only the keys the diagram used, and the picture is linked to the structural-regression, loading and covariance tables that describe it, so a screen reader is pointed at the numbers rather than at an unlabelled image.

What the layout does with the harder cases:

- Indicators sit on the side that keeps the structural arrows clear – left of a latent with no incoming paths, right of one with no outgoing paths, below one with both – and each column is as wide as its widest content, so a long factor name pushes the next column out rather than overlapping it.
- A cross-loading indicator is drawn once, in the stack of the first factor that loads it, and every further factor reaches it with its own edge.
- A covariance between variables that appear nowhere else in the model (`m1 ~~ m2`) still draws both boxes and the arc between them.
- A feedback loop is drawn: a non-recursive model's back-edges are lifted into their own lanes above the node band, so both directions of a cycle are visible.
- A fixed parameter takes a dotted stroke and the **Fixed parameter** legend key, on every edge kind – loadings of any order, structural paths, back-arcs and covariances; the unstandardized view labels it with the fixed value, a standardized view with the standardized estimate. A pair constrained to zero (`F1 ~~ 0*F2`) is a faint dashed arc labelled `0` with its own **Orthogonal (0)** key, before and after the fit, and a latent whose variance is fixed to 1 carries a **Scaling reference** mark.
- An estimate lavaan could not standardize is drawn as no estimate in the standardized views – a neutral grey line of fixed width with no label – and its tooltip quotes the unstandardized value and says so.

### Standardized estimates toolbar

A toolbar above the first estimate table – **Show standardized estimates:** with two checkboxes – shows or hides a standardization's whole column group, the estimate and its own CI, SE, z and p, across every estimate table at once, without a refit; the unstandardized **Estimate** column and its inference columns are always visible. Which group starts visible is your [Standardization](#standardization) choice.

- **Latent only** – the `std.lv` column group: the estimates with the latent variables scaled to unit variance and the observed ones in their own units – see [Standardized (latent only)](#b-standardized-latent-only). The second box, [Completely standardized](#b-completely-standardized), is the `std.all` group. Either label means the same wherever it appears – here, in the grouped picker and above the [path diagram](#path-diagram).
- **None** – in a [grouped fit](#multi-group-results), where the two checkboxes give way to a picker: unstandardized estimates only, the standardized columns hidden

### Estimate columns

Every estimate table – regressions, loadings, covariances, defined parameters and intercepts – shares one set of value columns; thresholds and variances carry the unstandardized half alone. **SE**, **z** and **p** are the unstandardized estimate's standard error, Wald z and p-value – see [standard error](./concepts/confidence-intervals.md#b-standard-error), [z](./concepts/hypothesis-testing.md#b-z) and [p](./concepts/hypothesis-testing.md#b-p).

- **Estimate** – the unstandardized estimate, in the variables' own units
- **{level}% CI** – the confidence interval, at the [confidence level](./settings.md#confidence-level) setting the header names; with [bootstrap](#bootstrap) on the header also names the interval lavaan produced – **{level}% CI (bootstrap, BCa)**, **{level}% CI (bootstrap, BC)** for the bias-corrected percentile interval, or **{level}% CI (bootstrap, percentile)** – see [BCa](./concepts/confidence-intervals.md#b-bca), [bias-corrected percentile bootstrap](./concepts/confidence-intervals.md#b-bias-corrected-percentile-bootstrap) and [percentile bootstrap](./concepts/confidence-intervals.md#b-percentile-bootstrap) {#level-ci #level-ci-bootstrap-bca #level-ci-bootstrap-bc #level-ci-bootstrap-percentile}
- **Std. (latent only)** – the estimate with the latent variables scaled to unit variance, `std.lv` – see [Standardized (latent only)](#b-standardized-latent-only)
- **Std. (completely)** – the estimate with latent and observed variables both scaled to unit variance, `std.all`: a loading reads as the indicator–factor correlation, a path as a standardized regression coefficient – see [Completely standardized](#b-completely-standardized). In the covariance tables the column is headed **Std. (correlation)**, since a completely standardized covariance is the correlation of the pair. {#std-completely #std-correlation}
- **{level}% CI ({qualifier})** – the interval of the standardized estimate whose column group it sits in, the qualifier repeating that column's wording, *latent only* or *completely*; bootstrapped, the header names the interval type the way the unstandardized column's does, and each standardized solution can settle on a different type from the unstandardized one – the headers say which {#level-ci-qualifier #level-ci-bootstrap-bca-qualifier #level-ci-bootstrap-bc-qualifier #level-ci-bootstrap-percentile-qualifier}
- **SE ({qualifier})** – the standardized estimate's own standard error, and beside it its own **z ({qualifier})** and **p ({qualifier})**: standardizing rescales the coefficient and its test with it, so these are not the unstandardized columns repeated, and a standardized estimate is read against them alone {#se-qualifier #z-qualifier #p-qualifier}

### Structural regressions

**Structural regressions.** One row per `~` path, shown first when the model has any, since the structural model is usually what you want to read at a glance; a standardized coefficient here is read like a standardized regression coefficient, one SD of the predictor in SDs of the outcome, its other predictors held constant – see [structural model](./concepts/latent-variables.md#b-structural-model).

- **Predictor** – the right-hand side of the regression, observed or latent
- **Outcome** – the left-hand side, the endogenous variable

### Factor loadings

**Factor loadings.** One row per `=~` loading, with the standardized columns and the [toolbar](#standardized-estimates-toolbar) shared with every other estimate table; the marker loading of each factor is fixed at 1 under [marker-variable scaling](#factor-scaling) and has no test – see [factor loading](./concepts/latent-variables.md#b-factor-loading) and [standardized loading](./concepts/latent-variables.md#b-standardized-loading).

- **Factor** – the factor the row's loading belongs to; **Indicator** is the observed variable loading on it

### Covariance estimates

**Covariances.** One table for every off-diagonal `~~` pair – residual–residual, factor–factor and mixed – with the same inference and standardized columns as the tables above; the completely standardized column is headed **Std. (correlation)**, since for a pair it is the correlation – see [factor covariance](./concepts/latent-variables.md#b-factor-covariance). In the CFA-mode card the same parameters are split into **Factor covariances/correlations**, **Residual covariances** and **Factor-indicator covariances** – see the CFA chapter's [parameter estimates](#parameter-estimates).

- **Variable 1** – the two sides of the pair, in the order the syntax box names them {#variable-1 #variable-2}

### Defined parameters

**Defined parameters.** One row per `:=` line – the [indirect effects](#indirect-effects-and-defined-parameters) form's indirect, direct and total effects, and any expression you typed – with the same columns as the estimate tables; a grouped fit keeps this table single, since lavaan reports a `:=` parameter once for the whole model. With [bootstrap](#bootstrap) on, its SE and CI come from the same resampling pass as the estimates'; without it they come from the delta method (Sobel), and a note under the table says so and recommends bootstrapping – see [indirect effect](./concepts/regression-basics.md#b-indirect-effect) and [Sobel test](./concepts/regression-basics.md#b-sobel-test).

- **Defined parameters – Name** – the parameter's name, the left-hand side of the `:=` line
- **Expression** – the lavaan expression that defines it, in the path labels the model uses

### Latent interaction construction

**Latent interaction construction.** Shown when the model has a [latent interaction](#latent-interactions): one row per product indicator, saying which two observed indicators it was built from, since the product columns exist only inside the fit and appear nowhere else. Under the table a line per interaction restates its definition – *XZ = X × Z, built by matched pairs under double mean centering* – and names any indicator left unpaired when the two factors carried different numbers of them.

- **Interaction** – the interaction latent the product belongs to
- **Product indicator** – the product column's name, `XZ.1`, `XZ.2`, …
- **First component** – the first factor's indicator in the product; **Second component** is the second factor's {#first-component #second-component}

### Effect decomposition

**Effect decomposition.** With the [Effect decomposition](#b-effect-decomposition-option) box on – it is by default – a structural model gets a table that walks the fitted paths and reports, for every pair of variables joined by at least one indirect route, the total effect, the direct path, the total indirect effect and each specific indirect route on a row of its own; a pair whose only route is the direct path gets no row. Nothing has to be typed: it is the arithmetic a `:=` line does, done for every pair at once, and where both are on screen they agree to the digit. The [indirect effects](#indirect-effects-and-defined-parameters) form is still what you want when an effect needs a name – to constrain it, contrast it or refer to it elsewhere. It renders after the estimate tables, with its own switch, so it appears even with the estimate tables off, and in a [grouped fit](#multi-group-results) it carries one column block per group. The interval is the decomposition's own – a [percentile bootstrap](./concepts/confidence-intervals.md#b-percentile-bootstrap) interval when bootstrapping is on, the delta method (Sobel) otherwise, with the same note under the table as the [defined parameters](#defined-parameters) carry – and its **Std. (latent only)** and **Std. (completely)** columns are point estimates alone. Two kinds of model get a note instead of a table, both pointing back at `:=`: a non-recursive model, whose feedback loop means the effects do not resolve into a finite set of routes, and a model with more than 500 directed routes, too many to enumerate.

- **Effect** – which of the four quantities below the row holds
	- **Total effect** – the sum over every route from predictor to outcome – see [total effect](./concepts/regression-basics.md#b-total-effect)
	- **Direct** – the one-step path, when the model has it – see [direct effect](./concepts/regression-basics.md#b-direct-effect)
	- **Total indirect** – the sum over the routes through at least one other variable – see [total indirect effect](./concepts/regression-basics.md#b-total-indirect-effect)
	- **Specific indirect** – one such route, its path spelled out in **Route**; the pair's specific indirect rows sum to its total indirect – see [indirect effect](./concepts/regression-basics.md#b-indirect-effect)
- **Route** – the route a specific indirect row follows, spelled out as `X → M1 → M2 → Y`; empty on the other rows

### Intercepts

**Intercepts.** Shown when the fit had a [mean structure](#mean-structure) – the option ticked, or FIML on, which turns it on inside lavaan: the `~ 1` parameters of every variable lavaan estimated an intercept for, the observed ones and, with **Free latent-variable intercepts** on, the latent means – see [intercept](./concepts/regression-basics.md#b-intercept). Same columns as the estimate tables, the row named by its variable.

### Thresholds

**Thresholds.** Shown for ordinal indicators: the estimated cut points on each item's underlying continuous response, k − 1 rows for a k-category item – the parameters WLSMV estimates in place of treating the answers as continuous – see [thresholds](./concepts/regression-basics.md#b-thresholds). Unstandardized columns only.

- **Threshold** – which cut point the row is, `t1`, `t2`, … from the lowest category upward; the row's variable names the item

### Factor variances, latent residual variances and residual variances

The `~~` diagonal splits three ways, each its own table, since the three answer different questions; all three carry the unstandardized columns alone, and the row is named by its variable under **Parameter**.

- **Factor variances** – exogenous latents, whose diagonal is the variance of the factor itself
- **Latent residual variances** – latents that something in the model predicts, through a `~` equation or a higher-order loading: their diagonal is the *disturbance*, the variance left after their predictors, not the factor's variance. In a second-order model this is where the first-order factors sit, leaving the higher-order factor alone under **Factor variances**.
- **Residual variances** – the observed indicators – see [residual variance](./concepts/latent-variables.md#b-residual-variance)

A negative estimate is a [Heywood case](./concepts/latent-variables.md#b-heywood-case): the cell is printed in bold red, a warning sits above the table, and with [interpretation](./settings.md#significance-formatting) on that table gains an **Interpretation** column reading *Heywood case (negative variance)* or *OK* per row – per group in a grouped fit, since a variance can go negative in one group only.

### R² (variance explained)

**R² (variance explained).** One row per endogenous variable – see [R² of an indicator](./concepts/latent-variables.md#b-r²-of-an-indicator). For an indicator the R² is the share of its variance its factor explains, its communality; for an endogenous latent, or an observed outcome of a structural equation, it is the share its predictors explain – two different quantities the **Type** column keeps from reading as one list. When the fit had ordered indicators the R² is computed on the underlying continuous response rather than on the observed categories, and the section is headed **R² (variance explained in the underlying continuous responses)**, as the diagram's legend says too, so the change of scale is on the card. {#r²-variance-explained #r²-variance-explained-in-the-underlying-continuous-responses}

- **Type** – *Indicator* for a variable that loads on a factor, *Latent variable* for an endogenous factor, *Observed variable* for an observed variable that is an outcome of a structural equation but loads on no factor

### Factor reliability

**Factor reliability.** One row per factor, with the [Factor reliability (α, ω, AVE)](#b-factor-reliability-α-ω-ave) box on – see [composite reliability](./concepts/latent-variables.md#b-composite-reliability-cr) and [average variance extracted](./concepts/latent-variables.md#b-average-variance-extracted). α, ω and AVE describe a factor's own observed indicators, whatever predicts the factor upstream; a second-order factor has none of its own, so its row reads N/A there and gets an **ω hierarchical** value instead, the column appearing only when the model has a higher-order factor. When the model covaries a latent variable with one of a factor's indicators, that factor's ω and AVE read N/A too, with a note naming the factors; α is unaffected. When a factor's standardized loadings disagree in sign – a reverse-keyed item loading against the rest – α, ω and ω hierarchical are computed with the indicators on the minority sign reversed (the negative ones on a tie), as if they had been reverse-scored in the data; the loadings and AVE stay as fitted, and a note under the table names each reversed indicator with its loading. The bands are the [reliability analysis](./reliability-analysis.md#reliability-metrics) module's.

- **Cronbach's α** – the tau-equivalent coefficient, assuming equal loadings – see [Cronbach's alpha](./concepts/reliability.md#b-cronbachs-alpha)
- **McDonald's ω (composite reliability)** – the congeneric coefficient from the factor's standardized loadings, which under a congeneric model is also its composite reliability, so it is reported once – see [McDonald's omega](./concepts/reliability.md#b-mcdonalds-omega)
- **AVE** – the average variance extracted, the mean squared standardized loading of the factor's indicators – see [average variance extracted](./concepts/latent-variables.md#b-average-variance-extracted)
- **ω hierarchical** – for a second-order factor: the share of its indicators' total variance the higher-order factor carries on its own – see [omega hierarchical](./concepts/reliability.md#b-omega-hierarchical)
- **Factor reliability – Interpretation** – with [interpretation](./settings.md#significance-formatting) on, one verdict per metric: α and ω on the reliability bands (*Unacceptable* below 0.50 up to *Excellent*), AVE *Adequate* at 0.50 or above and *Below threshold* under it, ω hierarchical *Strong general factor* at 0.75 or above, *Moderate general factor* at 0.50, *Weak general factor* below

### Discriminant validity

**Discriminant validity.** With the [Discriminant validity](#b-discriminant-validity-option) box on, three matrices asking whether the factors are distinct constructs – see [discriminant validity](./concepts/latent-variables.md#b-discriminant-validity) – each with a legend naming the cutoff its cells are coloured on, printed whether or not [interpretation](./settings.md#significance-formatting) is on. They read the model's own data – the fit's missing-data handling and, for ordinal indicators, its polychoric correlations – and leave second-order factors out. In a grouped fit the section is repeated per group.

- **Factor correlations** – the lower triangle of the inter-factor correlations, a pair at |r| ≥ 0.85 highlighted as too close to be told apart – see [factor correlation](./concepts/latent-variables.md#b-factor-correlation)
- **HTMT2 (heterotrait-monotrait ratio)** – the lower triangle of the HTMT2 ratios, coloured on the [HTMT thresholds](./settings.md#statistical-thresholds) setting: below the borderline value is good, between borderline and poor is borderline, at or above poor is a problem – see [HTMT](./concepts/latent-variables.md#b-htmt)
- **Fornell-Larcker criterion** – the factor correlations with √AVE on the diagonal, in bold; a correlation at or above the √AVE of either factor is highlighted as a violation – see [Fornell–Larcker criterion](./concepts/latent-variables.md#b-fornell-larcker-criterion)

### Modification indices

**Modification indices.** With the [Modification indices](#b-modification-indices-option) box on, the parameters that would improve fit most if freed – see [modification indices](./concepts/latent-variables.md#b-modification-indices) – filtered to MI > 3.84 and split into buckets, each showing up to 20 rows with a line stating the total when it was cut. A note under the heading states the two conventions – 3.84, the α = .05 value for a single test, and 10, the practical-significance rule the bold rows reach – and how many fixed parameters were tested, the multiplicity a single-test threshold ignores. A model with nothing above the filter says so in place of the buckets.

- **Suggested covariances** – `~~` pairs of any kind, under **Variable 1** and **Variable 2**; each row's **Apply** button adds the pair to the [covariances](#covariances) list. The CFA-mode card splits them into **Suggested residual covariances** and **Suggested factor covariances** – see [CFA modification indices](#cfa-modification-indices).
- **Suggested regression paths** – `~` paths, under **Predictor** and **Outcome**; **Apply** adds the path to the [structural matrix](#structural-model), and with [interpretation](./settings.md#significance-formatting) on a note under the table says that adding paths changes the structural model
- **Suggested cross-loadings** – `=~` cross-loadings, under **Factor** and **Indicator**; **Apply** adds the loading to the [measurement matrix](#measurement-model), and the note under the table says that cross-loadings change the factor structure
- **Other modification indices** – anything that fits no bucket above, under **Parameter** in lavaan notation, read-only
- **MI** – the modification index: the drop in χ² expected from freeing that one parameter; rows reaching 10 are set in bold
- **EPC** – the expected parameter change, the value the freed parameter would take – see [EPC](./concepts/latent-variables.md#b-epc)
- **Std. EPC** – the same change in completely standardized units, comparable across parameters on different scales

### Residual correlations

**Residual correlations.** With the [Residual correlation matrix](#b-residual-correlation-matrix) box on, the lower triangle of the residual correlations between indicators – the observed correlation minus the one the model reproduces – see [residual correlations](./concepts/latent-variables.md#b-residual-correlations). Each cell shows the residual correlation and, below it, its standardized residual z, and with [interpretation](./settings.md#significance-formatting) on a pair with |z| ≥ 1.96 is highlighted as localized misfit; when the estimator returns no standardized residuals the cells hold the correlation alone, flagged on the conventional |r| > 0.10 rule, and the legend says so. In a grouped fit one matrix is printed per group.

## Mediation walkthrough

A single-mediator model with bootstrap intervals, click by click – what the paths and effects mean is under [mediation](./concepts/regression-basics.md#b-mediation):

1. Build the measurement model in the top matrix, or skip it when X, M and Y are all observed
2. In the [**Indirect effects**](#indirect-effects-and-defined-parameters) form, pick **Predictor (X)**, **Mediator (M)** and **Outcome (Y)**, and click **Add indirect effect**
3. Tick [**Bootstrap confidence intervals**](#bootstrap) in the options
4. Raise [**Bootstrap replications**](./settings.md#bootstrap-replications) from its default of 100 – the card flags a count below 1000 and asks 2000–5000 for indirect effects, and a BCa interval needs more replications than analysed cases
5. Click **Run SEM**

In the results:

- The [Structural regressions](#structural-regressions) table shows the X→M, M→Y and X→Y paths the form labelled – `a`, `b` and `c` on a model with no labels yet – with their bootstrap intervals
- The [Defined parameters](#defined-parameters) table shows `indirect` (`a*b`), `direct` (`c`) and `total` (`c+a*b`), each with its bootstrap interval – the form writes all three, so there is nothing left to type
- The [Effect decomposition](#effect-decomposition) table reports the same total, direct and indirect split with no `:=` at all, one row per route
- A contrast between two indirect effects is a `:=` line typed into the syntax box, then a rerun

For more than one mediator, queue them with **Add** and pick [**Parallel** or **Serial**](#several-mediators) before clicking **Add indirect effect** – the rest of the walkthrough is unchanged. The decomposition still prints every route; the form's job is to give the ones you want to name, constrain or contrast a parameter of their own.

Bootstrap and [FIML](#missing-data) can be on together, each resample refitted under FIML; the run then costs a FIML fit per replication, so mind the count on a large model.

## Model comparison

**Model comparison.** Fits of either shape – measurement-only, structural, or one of each – can be set side by side in a card of that name: **Add to comparison** on a result card queues the fit, and **Compare models**, its badge counting the queue, opens once two or more are queued. Each model is refitted from the exact text that ran, with its own options and group variable but without its bootstrap, and the models are numbered by their position in the queue – always Model 1 … Model *k*, whatever was added and removed on the way. **Compare models** is closed while a fit is running, and it, **Add to comparison** and **Restore this model** refuse with a message once the dataset has changed since the model was fitted. [Comparing CFA models](#comparing-cfa-models) says which measurement-only pairs are tested although their factors are named differently.

- **Models compared** – the legend heading the card, one entry per model: the estimator and missing-data handling lavaan actually used (*Estimator: {estimator}. Missing data: {missing}.*), a *Requested: {estimator}, {missing}.* line when either was substituted, and the model's lavaan text. A model that failed reads *Did not fit.* with lavaan's own message beneath it, one that hit its iteration cap *Did not converge.*, and its column in the tables stays empty.
- **Model {n}** – a model's name in the legend and its column in the fit table: its position in the queue
- **Fit indices comparison** – one row per index, one column per model: **n**, the cases each fit analysed, first, since whether the rest can be compared turns on it; then χ² – **χ² (scaled)** when any fit used a robust estimator – df, p, CFI, TLI, RMSEA, SRMR, AIC, BIC and SSA-BIC, the information criteria empty under WLSMV. The p row is each model's exact-fit test, judged at the [assumption test significance level](./settings.md#assumption-test-significance-level) as in the [Model fit](#model-fit) table. The best value of CFI, TLI, RMSEA, SRMR and each information criterion is set in green bold – never χ², df, p or n – and only when every model is on a common scale: the same observed variables, the same resolved estimator and missing-data handling, the same mean-structure settings, ordinal indicators and group structure, and the same n. Otherwise nothing is marked, and a note under the table says why.
- **Chi-square difference tests** – one row for every pair of models. A pair is tested when both are on a common scale and one is [nested](./concepts/regression-basics.md#b-nested-models) in the other: its free parameters are a subset of the other's, it keeps every fixed value and equality the other imposes, and it has more degrees of freedom. A significant Δχ² says the more constrained model fits worse, judged at the [significance level](./settings.md#significance-level) – which model to keep is your hypothesis, not an assumption check – and a note under the table says so. When no pair is nested, a closing note points to AIC and BIC if the models are on a common scale, and otherwise names what differs and says that AIC and BIC cannot rank them either.
- **Comparison** – the pair, *Model {a} vs Model {b}*, the more constrained model first {#comparison #model-a-vs-model-b}
- **Δχ²** – the χ² difference between the two models, **Δdf** the difference in their degrees of freedom and **p** its p-value; under a robust estimator the Satorra–Bentler scaled difference rather than the difference of the two scaled χ² in the fit table, which a note under the table says – see [chi-square difference test](./concepts/latent-variables.md#b-chi-square-difference-test) {#chi-square-difference-tests-δχ² #chi-square-difference-tests-δdf #chi-square-difference-tests-p}
- **ΔCFI, ΔRMSEA** – the constrained model's CFI and RMSEA minus the free model's; both cells are highlighted when the constrained model is worse on both – ΔCFI at or below its cutoff and ΔRMSEA at or above its own, on the band for the fits' n that the note under the table quotes – see [ΔCFI](./concepts/latent-variables.md#b-δcfi) {#chi-square-difference-tests-δcfi #chi-square-difference-tests-δrmsea}
- **Note** – why a pair got no test: not fitted on the same variables, estimator, cases or group structure; a model that could not be parsed; neither model nested in the other; a model that did not fit or did not converge; different numbers of cases; equal degrees of freedom; or lavaan's own error, *Could not compute* when it gave none. On a tested pair it carries any warning lavaan raised, and says so when a model that merges factors was read as the other with the merged factors' correlations fixed at 1. {#chi-square-difference-tests-note}

A grouped structural fit is refitted grouped, and its group variable is part of the common scale: it pairs only with a fit grouped on the same variable. The **Constrain across groups** levels are not – two fits of one model that differ only in the levels they equated are tested against each other, the one equating more as the constrained model, so a fit with structural paths equated is read against its configural baseline here rather than by hand.

## Confirmatory factor analysis

Confirmatory factor analysis (CFA) tests whether a factor structure you state in advance – which indicators load on which factor – fits your data. In this module it is the measurement-only model: the same editor, options and **Run SEM**, on a model with no structural (`~`) equation, which the module fits with lavaan's `cfa()` and reports in a **Confirmatory factor analysis** card in place of the SEM one – fit indices, loadings and the other parameter estimates, factor reliability, discriminant validity, modification indices and a path diagram. Add a `~` line and the next run is an SEM; pick a group variable and it becomes a [measurement invariance](#measurement-invariance-testing) cascade; queue several runs and they can be [compared](#comparing-cfa-models). This chapter holds what reads differently for a measurement-only model and what only it has; the rest of the manual describes what it shares with a structural model – see [confirmatory factor analysis](./concepts/latent-variables.md#b-cfa). {#confirmatory-factor-analysis}

> **EFA or CFA?** [Exploratory factor analysis](./factor-analysis.md) finds a structure, CFA tests one you already have – from theory, the literature or an earlier EFA on *other* data, since confirming a structure on the sample that suggested it is circular; see [exploratory factor analysis](./concepts/latent-variables.md#b-efa).

1. [Select your variables](./getting-started.md#choosing-variables) – at least 4 numeric for a testable model
2. Assign indicators to factors in the [measurement matrix](#cfa-model-specification)
3. Optionally add [second-order factors](#second-order-factors) or [residual covariances](#residual-covariances)
4. Set the [estimation options](#cfa-options) – estimator, scaling, standardization
5. Click **Check data** for the [pre-flight diagnostics](#data-diagnostics), then **Run SEM** for the [results](#single-group-results)

### CFA model specification

**Model specification.** The measurement matrix: rows are the selected numerical variables, columns are factors, and each ticked cell is a loading – one term of a factor's `=~` line. It is the first card of the [editor](#model-specification) and writes into the same model text as the others, so the [lavaan syntax box](#lavaan-syntax-box), the [Covariances](#covariances) card and the cell's [modifier popover](#constraints-and-modifiers) are described there.

#### Defining loadings

Click an empty cell to add a free loading, shown as a ✓. Click a ticked cell to open its modifier popover – a fixed value, an equality label, `NA*`, a `start()` value, or **×** to remove the loading – as under [constraints and modifiers](#constraints-and-modifiers). The cells take the keyboard: Tab reaches each one, and Enter or Space acts as a click.

If the model names a variable that isn't in your current selection, the matrix keeps a muted orphan row for it rather than dropping it. You can clear a loading from that row but not add one – reselect the variable to edit it normally. The model still runs: a numerical column the dataset holds is resolved whether or not it is selected, and only a name the dataset doesn't have at all is underlined and closes **Run SEM**.

#### Managing factors

- Factor names are edited in the column headers; new factors are named F1, F2, … skipping names already taken. A name another factor already holds, first- or second-order, is refused with a toast and the field snaps back, and so is one lavaan cannot read as a name: it must start with a letter, hold only letters, digits, underscores and dots, and not be an R reserved word such as `TRUE` or `if`.
- **+** beside a factor name adds a new factor after it, and **×** removes the factor – the last one left is emptied instead of deleted.

#### Auto-detect from names

- **Auto-detect from names** – replaces the current model with one built from the variable names: the selected numerical variables are grouped by the part of the name before the first underscore, case-insensitively (`anx_1`, `anx_2` and `ANX_3` form one group), and every group of two or more becomes a factor named as its first variable spells the prefix (`anx`), or by its position (F1, F2, …) when the prefix is not a usable factor name, as `2019` is. A variable with no partner is left out, and when nothing groups a toast says how the names should look. Consistent `prefix_number` names, common in questionnaires, set up the whole model in one click.

#### Clear

- **Clear** – resets this card alone: one empty factor, no second-order factors; the covariances, structural equations, `:=` lines and everything else in the syntax box stay. **Clear model**, beside **Run SEM**, wipes the whole specification – see the [editor](#model-specification). Queued [comparison models](#model-comparison) survive both.

#### Second-order factors

**Second-order factors.** Appears under the matrix once two first-order factors exist: the same matrix one level up, its rows the first-order factors and its columns the second-order factors (G1, G2, …), each ticked cell a first-order factor loading on a higher-order one. Its headers, cells, popover and keyboard work as the first-order matrix's do. A loading whose target is itself a higher-order factor – a third-order line such as `G2 =~ G1 + F3` typed into the syntax box – has no cell, but is kept as written; the model summary lists the second-order factors a run fitted.

> **When to add one?** When the first-order factors correlate strongly and one broader construct should explain why – see [hierarchical factor model](./concepts/latent-variables.md#b-hierarchical-factor-model); a strong general factor in an EFA's [Schmid–Leiman transformation](./factor-analysis.md#schmid-leiman-transformation) is the usual cue.

#### Residual covariances

A residual covariance between two indicators – the usual `~~` pair of a measurement model, for items that share method variance such as similar wording or adjacent placement – is added in the [Covariances](#covariances) card below the matrices. Add one only with a reason, never to improve fit, and let the [modification indices](#modification-indices) suggest candidates.

### CFA options

The options column is shared with the SEM mode, and every control is described under [Options](#options). What follows is what reads differently for a measurement-only model.

#### Factor scaling in a CFA

Both [factor scaling](#factor-scaling) choices give the same fit and the same standardized loadings; marker-variable scaling is the published convention, and fixed variance makes the unstandardized loadings comparable across indicators – see [marker variable](./concepts/latent-variables.md#b-marker-variable).

#### Factor correlations in a CFA

With no `~` line every first-order factor is exogenous, so unticking [Allow factors to correlate](#factor-correlations) fixes the covariance of every pair at zero – an orthogonal model. A first-order factor that loads on a second-order factor is no longer exogenous and is left alone.

#### Estimator in a CFA

The eleven [estimators](#estimator) are the SEM mode's, with the same substitutions: a variable the model names that is typed Ordinal in the data view substitutes WLSMV, and FIML switches the MLM family to MLR. What a CFA assumes:

- ML assumes multivariate normality; the Mardia tests under [Check data](#data-diagnostics) judge it, and MLR (or MLM / MLMVS under listwise deletion) is the robust alternative when they reject it.
- WLSMV assumes ordinal indicators with continuous responses underneath – Likert items, and binary or coarse items that ML would treat as continuous. The [Check data](#data-diagnostics) diagnostics point out columns that look ordinal but aren't typed so.
- Every estimator assumes local independence – once the factors are accounted for, the indicators are uncorrelated; a [residual covariance](#residual-covariances) relaxes it for one pair – see [local independence](./concepts/latent-variables.md#b-local-independence).
- Every estimator assumes the model is correctly specified – a CFA tests the model you wrote, not whether a better one exists; [model comparison](#model-comparison) weighs rivals.

#### Missing data in a CFA

[Listwise deletion or FIML](#missing-data), as in the SEM mode, and the summary's Missing data line names what lavaan applied when a FIML request could not run as asked. The sample-size line follows the mode that ran.

#### Standardization in a CFA

The [standardization](#standardization) choice sets which standardized columns the estimate tables and the diagram open on; the [toolbar](#standardized-estimates-toolbar) above the tables shows or hides either column group afterwards without a refit. **Completely standardized** loadings read as indicator–factor correlations, the form a CFA usually reports.

#### Mean structure in a CFA

A single-group CFA rarely needs [Estimate intercepts](#mean-structure): its fit and loadings are the same without it. With a group variable the [invariance cascade](#measurement-invariance-testing) sets its own mean structure and ignores this card, and the **Constrain across groups** boxes stay hidden – they belong to a grouped structural model.

#### Bootstrap in a CFA

[Bootstrap confidence intervals](#bootstrap) work as in the SEM mode: the replication count comes from [Settings](./settings.md#bootstrap-replications), the CI header names the interval type used, and the card flags a count below 1000 or too low for BCa.

#### Output options in a CFA

The [output options](#output-options) are the SEM mode's eight boxes; **Effect decomposition** prints nothing for a CFA, which has no structural paths to decompose, and the others map onto the [single-group results](#single-group-results) below.

#### lavaan syntax

The model text behind the matrix is the [lavaan syntax box](#lavaan-syntax-box) – edit either and the other follows, so a CFA reported in lavaan notation can be pasted in and the matrix reorganizes to match.

### Data diagnostics

The **Check data** button runs the pre-flight battery in a **Data diagnostics** card without fitting a model – which variables it checks and when it opens are in [Check data](#check-data). The card opens on a line naming how many variables it checked and a status banner, then one section per check, each shown when it has something to report; a section whose check could not run says so rather than disappearing.

- **Issues detected** – the banner when any check raised a [recommendation](#b-recommendations); **Data looks good** when none did. Missing data raises one when the checked grid is more than 5% blank or any single variable more than 20%. {#issues-detected #data-looks-good}
- **Not assessed** – the row a section shows in place of its results when its check could not run, naming why: too few complete cases for the number of variables, a singular covariance matrix, no more complete cases than variables, a column with no variance, a correlation matrix that could not be built, or an error. A column with very little data is still described as far as its length allows – SD from two values, skewness from three, excess kurtosis from four – and one with fewer than three valid values gets a recommendation of its own.

**Sample size.** The case counts the fit will have to work with.

- **Sample size (n)** – the rows of the checked columns; **Complete cases** is the rows with a value on every one of them – see [complete cases](./concepts/outliers-missing-data.md#b-complete-cases) {#sample-size-n #sample-size-complete-cases}
- **Variables** – how many columns were checked, *p* {#sample-size-variables}
- **Complete cases per free parameter** – shown when a model is defined: the complete cases divided by the model's [free parameters](#b-free-parameters), the row above it; below 5 it raises a recommendation – the 5–10 cases per free parameter guideline
- **Complete cases per variable** – the complete cases divided by *p*; it raises the recommendation below 5 only while no model is defined, since a model's own count replaces it
- **Min. N for weight matrix (p(p+1)/2)** – the number of distinct variances and covariances among the checked variables; with complete cases at or below it a recommendation, and a note under the table when [interpretation](./settings.md#significance-formatting) is on, say WLS will fail and the robust corrections are less stable at that size

**Missing data.** How much of the checked data is blank – see [missing data](./concepts/outliers-missing-data.md#b-missing-data). {#data-diagnostics-missing-data}

- **Total missing** – the blank share of the whole grid, rows × checked variables
- **Missing cases** – in the per-variable table under it, which lists only the variables with a blank, worst first: the count of blank rows, and beside it **Missing %**, set in bold above 20% {#missing-cases #missing-data-missing}

#### Sampling adequacy

**Sampling adequacy.** Whether the correlation matrix of the checked variables can support latent factors at all – the factorability battery [exploratory factor analysis](./factor-analysis.md) runs. It is skipped when the model has no latent factors, and when a checked column is typed Ordinal the matrix is polychoric or mixed, with a note that Bartlett's test then holds only approximately.

- **Kaiser-Meyer-Olkin (KMO) measure** – the share of the correlations that is common rather than pairwise, amber below 0.6, where it also raises a recommendation – see [KMO](./concepts/latent-variables.md#b-kmo)
- **Bartlett's test of sphericity** – χ², df and p for whether the correlation matrix differs from an identity matrix, read at the [assumption test significance level](./settings.md#assumption-test-significance-level); a result that does not reject raises a recommendation – see [Bartlett's test of sphericity](./concepts/latent-variables.md#b-bartletts-test-of-sphericity)
- **Correlation matrix determinant** – approaches 0 as the matrix approaches singularity
- **Smallest eigenvalue (correlation matrix)** – green when positive, red when zero or negative: a matrix that is not [positive definite](./concepts/latent-variables.md#b-positive-definite) cannot be fitted as specified
- **Correlation matrix rank** – printed as *rank / variables*, red when short of full rank, which means some column is an exact combination of others – see [matrix rank](./concepts/latent-variables.md#b-matrix-rank)
- **Unreliable (singular matrix)** – printed in place of KMO when the matrix is singular or a pair of variables is perfectly correlated, and in place of Bartlett's test also when the matrix is not positive definite; the rank and the **Reproduced by** table are what to read then – see [singular matrix](./concepts/latent-variables.md#b-singular-matrix)
- **Reproduced by** – a table under the battery, shown when the rank falls short: each variable a combination of the others reproduces exactly, and which others. A total or composite score analysed beside its own items is the usual cause.

A pairs table follows when there are pairs to list – **Variable 1**, **Variable 2** and *r*: perfectly correlated pairs (r ≥ 0.9999) in red and pairs above |r| > 0.9 in amber, the two bars the matching recommendations use.

**Multivariate normality.** Mardia's two tests on the complete cases – see [Mardia's test](./concepts/assumptions.md#b-mardias-test); it needs more complete cases than variables. When the checked set includes ordinal columns, a note says their departure from normality is structural and that the remedy is WLSMV, not a robust continuous estimator.

- **Mardia's skewness (χ²)** – the multivariate skewness statistic with its df and p
- **Mardia's kurtosis (Z)** – the multivariate kurtosis as a z statistic with its p; it has no df
- **Result** – *Normal* or *Non-normal* per test, read at the [assumption test significance level](./settings.md#assumption-test-significance-level); a *Non-normal* raises a recommendation for a robust estimator {#multivariate-normality-result}

**Mahalanobis outlier detection.** Multivariate outliers among the complete cases, at p < .001 – see [Mahalanobis distance](./concepts/outliers-missing-data.md#b-mahalanobis-distance). A note under the table names the estimator that produced the distances, and the reason when it fell back.

- **Distance estimator** – *Robust (MCD)*, the [minimum covariance determinant](./concepts/outliers-missing-data.md#b-minimum-covariance-determinant-mcd), or *Classical (mean and covariance)* when MCD needs more than twice as many complete cases as variables and has fewer, cannot be computed, or returns a singular matrix
- **Cases checked** – the complete cases the distances were computed on
- **Chi-square threshold (p < .001)** – the cutoff an MCD distance is graded against; a classical distance is graded against the **Scaled beta threshold (p < .001)** instead {#chi-square-threshold-p-lt-001 #scaled-beta-threshold-p-lt-001}
- **Mahalanobis outlier detection – Degrees of freedom** – the number of variables checked, the df of the threshold
- **Outliers detected** – the cases beyond the threshold, in bold when there are any, and **Percentage** is their share of the cases checked {#outliers-detected #mahalanobis-outlier-detection-percentage}
- **Outlier cases** – a collapsed table of the flagged cases, largest distance first and capped at 50, the heading stating the total when it was cut: the case's **Row** in the data view, its **Mahal. Distance**, and its value on each checked variable {#outlier-cases #outlier-cases-showing-the-shown-largest-of-total #mahal-distance #outlier-cases-row #outlier-cases-showing-the-shown-largest-of-total-row}

**Non-normal variables.** The checked variables with |skewness| > 2 or |excess kurtosis| > 7, the value past its bar in bold. When some of them are ordinal, a note names those, whose non-normality is structural.

- **Skewness** – the G1 estimator the rest of the app uses, so it matches the one [descriptive statistics](./descriptive-statistics.md) reports for the column – see [skewness](./concepts/distributions.md#b-skewness)
- **Excess kurtosis** – the G2 estimator, 0 for a normal distribution – see [kurtosis](./concepts/distributions.md#b-kurtosis)

**Low variance variables.** Near-zero-variance columns: a constant column, or one whose most frequent value outnumbers the second by 19 to 1 while fewer than 10% of its values are distinct. The table gives each one's SD, Min and Max beside the two numbers the rule reads.

- **Frequency ratio** – the count of the most frequent value over the count of the second
- **Distinct values** – the distinct values as a percentage of the column's valid values

**Ordinal variables.** Checked columns typed Ordinal in the data view, and checked columns that look ordinal – integer-valued with 2 to 10 distinct values – with their Min and Max. A note under the table asks for the look-alikes alone to be retyped: a column typed Ordinal already puts the fit on WLSMV – see [Estimator](#estimator).

- **Source** – *User-marked* for a column typed Ordinal, *Auto-detected* for a look-alike not typed Ordinal {#ordinal-variables-source}

**Recommendations.** One line per finding, shown whenever the banner reads **Issues detected**: FIML for heavy missingness; columns with fewer than three valid values, or with near-zero variance; a robust estimator for univariate or multivariate non-normality; a matrix that is not positive definite, variables reproduced exactly by others, perfectly correlated pairs, pairs above |r| > 0.9, and variables the others predict almost perfectly, where a [Heywood case](./concepts/latent-variables.md#b-heywood-case) is likely; a KMO below 0.6 or a Bartlett's test that does not reject; the outlier count; fewer than 5 complete cases per free parameter (per variable while no model is defined), fewer than 100 complete cases, or too few for the weight matrix; and look-alike ordinal columns to retype.

### CFA validation rules

The rules that open **Run SEM** are the SEM mode's – see [validation rules](#validation-rules). For a measurement-only model that means every factor needs two or more indicators and every second-order factor with loadings two or more first-order factors, every name must be a column of the dataset, and the model must be at least just-identified, df = 0 running with a warning. **Free observed-variable intercepts** and **Free latent-variable intercepts** ticked together block a single-group run; with a group variable selected they only warn, since the [invariance cascade](#measurement-invariance-testing) sets its own mean structure. A factor with exactly two indicators and no free link to another latent runs with a warning that it may not be identified.

### Single-group results

Results appear in a **Confirmatory factor analysis** card: the SEM card's summary, fit table, estimate tables, reliability, discriminant validity, modification indices and residual correlations, in that order, described in [reading results](#reading-results), from the non-convergence handling to the **Restore this model** and **Add to comparison** buttons. What follows is what the measurement-only card does differently: one summary line, its own path diagram, the covariances split three ways, and the covariance suggestions split two ways.

#### CFA model summary

The [model summary](#model-summary) lines are the SEM card's, with one in place of **Structural equations**:

- **Indicators** – how many distinct observed variables the factors load on

#### Model fit indices

The **Model fit** table is the SEM card's – every row, band and withheld verdict is under [Model fit](#model-fit), and what the indices mean under [does the model fit?](./concepts/latent-variables.md#does-the-model-fit). A CFA is usually reported on χ² with its df and p, CFI, TLI, RMSEA with its 90% interval, and SRMR; AIC and BIC are for [comparing models](#model-comparison).

#### CFA path diagram

**CFA path diagram.** The measurement model drawn as a picture, the factor analysis module's diagram rather than the SEM card's – see [path diagram](./concepts/latent-variables.md#b-path-diagram). It has no standardization picker: every edge is the completely standardized estimate, labelled with its value, coloured on the signed blue/red ramp with its thickness following the size, and dashed at reduced opacity when non-significant – judged on the standardized estimate's own p at your [significance level](./settings.md#significance-level). The factors are blue ellipses widened to their names, the indicators grey boxes, the loadings arrows from each factor to its indicators, the [factor correlations](./concepts/latent-variables.md#b-factor-correlation) double-headed arcs on the left, and second-order factors ellipses further left whose loadings are drawn like any other. Each indicator has an orange error circle on its right labelled with its standardized residual variance, u² = 1 − R²; residual covariances are dashed double-headed arrows between indicators, and a factor–indicator covariance an arc bowed above its loading. The model's constraints are drawn too – a dotted stroke for a fixed loading or covariance, a mark inside the ellipse of a latent whose variance is fixed to 1, a faint dashed arc labelled 0 for a pair fixed to zero – and a loading lavaan could not standardize is a grey line of fixed width with no label. The legend lists only what was drawn, and the diagram is resizable and exports under its own filename. {#cfa-path-diagram}

#### CFA standardized estimates

The [toolbar](#standardized-estimates-toolbar) above the first estimate table is the SEM card's, and in a CFA **Std. (completely)** is the column to report: a loading there reads as the indicator–factor correlation – see [standardized loading](./concepts/latent-variables.md#b-standardized-loading).

#### Parameter estimates

The estimate tables and their columns are the SEM card's – see the [estimate columns](#estimate-columns), [factor loadings](#factor-loadings), thresholds, the three variance tables, where a negative estimate is flagged as a [Heywood case](./concepts/latent-variables.md#b-heywood-case), and R². The one difference is the `~~` pairs: where the SEM card prints one **Covariances** table, this card splits them by kind, each with the same inference and standardized columns and its completely standardized column headed **Std. (correlation)**.

- **Factor covariances/correlations** – one row per pair of factors; the standardized column is their correlation, and a pair close to 1 may not be two constructs – see [factor covariance](./concepts/latent-variables.md#b-factor-covariance) and [discriminant validity](#b-discriminant-validity)
- **Factor 1** – the two factors of the pair, in the order the syntax names them; the same pair of columns heads [Suggested factor covariances](#b-suggested-factor-covariances) {#factor-1 #factor-2}
- **Residual covariances** – one row per indicator pair you [covaried](#residual-covariances), under **Variable 1** and **Variable 2**; the standardized column is the residual correlation
- **Factor-indicator covariances** – `~~` pairs with a factor on one side and an indicator on the other, under **Variable 1** and **Variable 2**; they are neither residual nor factor covariances, and they make the owning factor's ω and AVE read N/A in [factor reliability](#factor-reliability)

#### CFA factor reliability

The **Factor reliability** table is the SEM card's – α, ω, AVE and, for a second-order factor, ω hierarchical, under [factor reliability](#factor-reliability); ω is the factor's [composite reliability](./concepts/latent-variables.md#b-composite-reliability-cr), and AVE its [average variance extracted](./concepts/latent-variables.md#b-average-variance-extracted).

#### CFA discriminant validity

The factor correlations, HTMT2 and Fornell–Larcker matrices are the SEM card's – see [discriminant validity](#discriminant-validity).

#### CFA modification indices

The **Modification indices** section is the SEM card's – the filter, the bold rows, the cap and the **MI**, **EPC** and **Std. EPC** columns are under [modification indices](#modification-indices). This card has no regression bucket, and splits the covariance suggestions in two:

- **Suggested residual covariances** – indicator pairs, under **Variable 1** and **Variable 2**; **Apply** adds the pair to the [Covariances](#covariances) card
- **Suggested factor covariances** – factor pairs, under **Factor 1** and **Factor 2**, which appear when factor correlations are off or a pair is fixed to zero; **Apply** frees the pair

A suggested covariance between a factor and an indicator goes to **Other modification indices**, which has no **Apply** button.

#### Residual correlation matrix

The residual correlations are the SEM card's – see [residual correlations](#residual-correlations).

### Measurement invariance testing

**Measurement invariance testing.** With a variable picked under [Multi-group analysis](#multi-group-analysis) and no `~` line in the model, **Run SEM** fits the invariance cascade across that variable's groups in place of a single CFA: the same measurement model fitted to every group at once, with more of its parameters held equal at each level – see [measurement invariance](./concepts/latent-variables.md#b-measurement-invariance). The card is titled **Measurement invariance testing**, with the number of freed parameters beside the title after a [partial-invariance](#partial-invariance) re-run. {#measurement-invariance-testing #measurement-invariance-testing-count-freed}

The levels, in cascade order, each nested in the one before it:

| Level | What's constrained | What it tests |
|---|---|---|
| **Configural** | Nothing – same structure in all groups | Do the groups share the factor pattern? |
| **Threshold invariance** | Item thresholds (ordinal indicators only) | Do the response categories sit at the same points of the underlying scale? |
| **Metric (weak)** | + loadings | Do the items relate to the factors the same way? |
| **Thresholds and loadings** | Thresholds + loadings, in one step (all-binary indicators) | The metric level of an all-binary item set |
| **Scalar (strong)** | + intercepts | Can the latent means be compared? |
| **Strict** | + residual variances | Is the measurement error the same? |
| **Structural** | + latent variances and covariances | Do the factors themselves vary and covary the same way? |

- **Configural** – the baseline: the same model in every group with every parameter free; the later levels are compared with it, and a configural model that fails to fit ends the run – see [configural invariance](./concepts/latent-variables.md#b-configural-invariance)
- **Threshold invariance** – added when at least one ordinal indicator has more than two categories: the items' thresholds equal across groups {#invariance-comparison-threshold-invariance}
- **Metric (weak)** – the loadings equal across groups, and on an ordinal cascade the thresholds with them – see [metric invariance](./concepts/latent-variables.md#b-metric-invariance)
- **Thresholds and loadings** – the metric level of a cascade whose ordinal indicators are all binary: a binary item's one threshold is identified only together with its loading, so both are equated in one step, with the residual variances held equal at 1 in every group, and the level's interpretation sentence and score tests cover both kinds
- **Scalar (strong)** – the intercepts equal as well, the level that licenses comparing latent means, and the one they are read from. An all-binary cascade runs it too, after **Thresholds and loadings**, equating the items' latent-response intercepts on top – see [scalar invariance](./concepts/latent-variables.md#b-scalar-invariance)
- **Strict** – the residual variances equal as well – see [strict invariance](./concepts/latent-variables.md#b-strict-invariance)
- **Structural** – the latent variances and covariances equal as well: a hypothesis about the constructs rather than the scale, decided on its χ² difference test alone and nominating no [partial-invariance](#partial-invariance) candidates; passing it puts the pooled denominator of the [latent mean differences](#latent-mean-differences) on one common metric – see [structural invariance](./concepts/latent-variables.md#b-structural-invariance)

Every level is fitted in turn until one fails to fit: a level lavaan refuses, or one that runs to its iteration cap without converging, is named in a message above the table and ends the cascade there, and a configural model that fails leaves the card holding that message alone. The cascade sets its own mean structure – free indicator intercepts, latent means fixed at 0 – so the [Mean structure](#mean-structure) card and the **Constrain across groups** boxes have no effect on it. It is fitted with analytic standard errors whatever [Bootstrap](#bootstrap) says; only the level the latent means come from is refitted with bootstrap standard errors. With ordinal indicators the levels are generated by `semTools::measEq.syntax()`: the **Threshold invariance** level is added, **Strict** and **Structural** are dropped when every indicator is a binary ordinal item, and a notice lists the lines of your model the generated syntax cannot carry – `:=` definitions, `==` constraints, fixed or labelled modifiers. In a second-order model the higher-order loadings stay free across groups, and a note under the table names them.

Above the table the card states:

- **Groups** – the group variable and each group's n: the cases lavaan analysed in that group, under listwise deletion the ones complete on the model's indicators
- **Per-group χ² contributions (configural)** – each group's share of the configural model's χ², which shows whether one group carries the misfit

lavaan's warnings follow, each under the level that first raised it, and a note when the configural model fits poorly – CFI below the acceptable [CFI fit cutoff](./settings.md#statistical-thresholds) or RMSEA above the poor RMSEA one (0.90 and 0.10 by default) – advising a better model before the invariance results are read.

#### Invariance comparison table

**Invariance comparison.** One row per level, in cascade order: the level's own fit on the left, and on the right the change from the level before it, which is what the verdict reads. The fit columns – df, CFI, RMSEA, SRMR, AIC, BIC and SSA-BIC – read as in the [Model fit](#model-fit) table, the information criteria blank under WLSMV; the configural row's change columns read –, since it has nothing to be compared with.

- **Level** – the level's name, as in the list above
- **χ²** – the level's χ²; under a robust estimator the header reads **χ² (scaled)** and the value is the scaled statistic {#invariance-comparison-χ² #invariance-comparison-χ²-scaled}
- **Δχ²** – the χ² difference test against the level before, **Δdf** its degrees of freedom; under a robust estimator the header reads **Δχ² (scaled)** and the value is the Satorra–Bentler scaled difference, not the difference of the two scaled χ² above it, which a note under the table says – see [chi-square difference test](./concepts/latent-variables.md#b-chi-square-difference-test) {#invariance-comparison-δχ² #invariance-comparison-δχ²-scaled #invariance-comparison-δdf}
- **p** – the Δχ² test's p, judged at the [assumption test significance level](./settings.md#assumption-test-significance-level), since its null is that the constraints hold – see [which level a table reads](./concepts/hypothesis-testing.md#b-which-level-a-table-reads) {#invariance-comparison-p}
- **ΔCFI, ΔRMSEA, ΔSRMR** – the change in each index from the level before, this level minus that one: the practical criteria the verdict reads beside the Δχ² – see [ΔCFI](./concepts/latent-variables.md#b-δcfi) {#invariance-comparison-δcfi #invariance-comparison-δrmsea #invariance-comparison-δsrmr}
- **Verdict** – *Baseline* on the configural row; below it *Pass* when neither the Δχ² test rejects nor the practical criteria fail, *Fail* when both do, and *Mixed* when only one does. The practical criteria fail only on a worsening – ΔCFI dropping past its cutoff, corroborated by ΔRMSEA or ΔSRMR rising past theirs – on the band the note under the table states for this sample: the stricter one at a total N of 300 or less, or when the largest group is more than twice the smallest. The **Structural** level reads its Δχ² alone, so it is never *Mixed*. A level after a *Fail* reads *Not evaluable*, and so does one after an *Error*, the verdict of a level whose comparison could not be computed; a level that could not be fitted reads *Did not converge* or *Did not fit*, and the rows after it are left empty

With [interpretation](./settings.md#significance-formatting) on, one sentence per level under the table says what held, what did not, and which levels could not be evaluated.

#### Partial invariance

**Parameter differences.** For each level whose verdict is *Fail* or *Mixed*, the **Structural** level excepted, a section titled after the level – **Metric invariance – parameter differences** and its siblings – lists the parameters the level equated, ranked by the score test for releasing each one's equality constraint, largest first – see [partial invariance](./concepts/latent-variables.md#b-partial-invariance). A note above the sections says that the nominations come from this sample, so a partial solution built on them is exploratory, that every factor needs two invariant indicators, and to free the top-ranked parameter and re-run before freeing the next. {#parameter-differences #threshold-invariance-parameter-differences #metric-invariance-parameter-differences #thresholds-and-loadings-parameter-differences #scalar-invariance-parameter-differences #strict-invariance-parameter-differences}

- **Parameter** – the parameter in lavaan notation: `F1=~x2` a loading, `x2~1` an intercept, `x2|t1` a threshold, `x2~~x2` a residual variance; one column per group beside it holds that parameter's estimate in the group, read from the level below, where it was still free {#threshold-invariance-parameter-differences-parameter #metric-invariance-parameter-differences-parameter #thresholds-and-loadings-parameter-differences-parameter #scalar-invariance-parameter-differences-parameter #strict-invariance-parameter-differences-parameter}
- **χ²** – the score test for releasing that one constraint, with its p beside it {#threshold-invariance-parameter-differences-χ² #metric-invariance-parameter-differences-χ² #thresholds-and-loadings-parameter-differences-χ² #scalar-invariance-parameter-differences-χ² #strict-invariance-parameter-differences-χ²}
- **Expected difference** – one column per group after the first: the parameter's expected value in that group minus the first group's once its constraint is released, in the units of the estimates beside it. Filled for the parameters whose p is below the significance level {#expected-difference}
- **Latent mean change** – one column per group after the first: how far releasing the parameter is expected to move the mean of the factor it measures, against the [latent mean differences](#latent-mean-differences) reported below. Shown at the levels that estimate the latent means, for the parameters whose p is below the significance level {#latent-mean-change}
- **Apply** – marks the parameter to be freed and shows **Re-run with freed parameters**; the button turns into a ✓. It is refused with a message when freeing the parameter would leave its factor with fewer than two invariant indicators at that level, except at the **Strict** level, which equates residual variances alone {#threshold-invariance-parameter-differences-apply #metric-invariance-parameter-differences-apply #thresholds-and-loadings-parameter-differences-apply #scalar-invariance-parameter-differences-apply #strict-invariance-parameter-differences-apply}
- **Re-run with freed parameters** – re-fits the whole cascade with every parameter marked so far released at its level and every level after it, in a new card. It re-fits the model this card was fitted from – its syntax, options and group variable – not whatever the editor holds by then.
- **Freed parameters** – the banner of a re-run card, listing what was released under **Thresholds freed**, **Loadings freed**, **Intercepts freed** and **Residual variances freed** {#freed-parameters #thresholds-freed #loadings-freed #intercepts-freed #residual-variances-freed}

#### Latent mean differences

**Latent mean differences.** Each factor's latent mean in every group against the reference group, whose means are fixed at 0 – see [latent mean](./concepts/latent-variables.md#b-latent-mean). The means come from the **Scalar (strong)** level alone, the first at which they are identified; when it did not fit, the section is left out rather than filled with means the earlier levels fix at 0. The reference group is the group variable's first level, in the order the variable itself defines rather than the order of the rows, and the note under the table names it with the level the means came from. A warning above the table names the first level up to that one that did not pass, since mean comparisons are then to be read with caution. Each group's columns sit under a header spanning its block.

- **Latent mean differences – Est.** – the group's latent mean, which is its difference from the reference group; the reference group's column reads *0 (ref)* {#latent-mean-differences-est #0-ref}
- **Latent SD** – the group's own latent standard deviation, shown for every group, the reference included, when all of them could be computed; a denominator shared across groups assumes these stay close
- **Std. ({denominator})** – the difference divided by the SD the **Effect-size denominator** picker names – *pooled SD*, *reference SD* or *own SD* in the header – a latent-scale effect size, and the column to report

SE, z and p are the latent mean's standard error, Wald z and p-value, bootstrap standard errors when [Bootstrap](#bootstrap) is on.

**Effect-size denominator.** A picker above the table, shown when more than one denominator can be computed; the note under the table restates the one in force.

- **Pooled SD** (default) – the latent SD pooled across groups, weighted by each group's n − 1, so every group's effect size is on one metric; it assumes equal latent variances, which the **Structural** level tests
- **Reference SD** – the reference group's latent SD
- **Own SD** – each group's own latent SD, lavaan's `std.all`, which is no longer a common metric once the latent variances differ

### Comparing CFA models

A CFA is queued and compared like any fit – **Add to comparison** on its card, then **Compare models** – and the card is read as [model comparison](#model-comparison) describes. An invariance run has no **Add to comparison** button; its own table compares its levels. What reads differently for measurement-only models is which pairs get a χ² difference test. The comparison a CFA most often wants – one factor against two over the same items, two against three – is paired although the two models name their factors differently: the model that merges factors is read as the other with the correlations among the merged factors fixed at 1, and the **Note** column says so. A second-order model against its correlated first-order factors, or a bifactor model against either, gets no test; compare those on AIC and BIC, or write the constrained model in the free model's parameter names.

### Missing data handling

The [Missing data](#missing-data) option decides: listwise deletion by default, or FIML under ML and MLR, with the model summary naming the mode that ran. The invariance cascade is fitted under the same option, and its group sizes are the cases lavaan analysed in each group. How many cases the model has to work with is graded where it is reported – complete cases per free parameter under [Check data](#data-diagnostics) and the N:parameter ratio in the model summary, both against 5 cases per free parameter, and the group sizes under **Multi-group analysis**, flagged below 50 cases per group.

### Reporting a CFA

Key things to include when writing up CFA results:

**Method:**
- Model specification – which indicators load on which factors (the [lavaan syntax](#lavaan-syntax) is a compact way to communicate this)
- Estimator and why, and whether it was substituted (WLSMV for ordinal indicators)
- Factor scaling method (marker variable or fixed variance)
- How missing data were handled (listwise or FIML) – the summary's Missing data line names the mode that ran
- Sample size and N-to-parameter ratio
- Any modifications made to the initial model and why (residual covariances, freed cross-loadings)

**Results:**
- Fit indices – at minimum chi-square (df, p), CFI, TLI, RMSEA (with 90% CI), SRMR; the scaled versions under a robust estimator
- Standardized factor loadings, with their own SEs or CIs (not the unstandardized ones)
- Factor correlations
- Factor reliability (α, ω, AVE) if reporting convergent/discriminant validity; ω hierarchical for a second-order factor
- Discriminant validity evidence (HTMT2 or Fornell-Larcker) if relevant, naming the thresholds you applied
- Modification indices applied (if any), with justification
- Competing models, if compared: each model's fit, and the χ² difference test for a nested pair or AIC and BIC for the others

**For measurement invariance:**
- Group variable, group sizes
- Fit indices at each invariance level actually run (configural, threshold for ordinal data, metric, scalar, strict, structural)
- The Δχ² test (Δdf, p), ΔCFI, ΔRMSEA and ΔSRMR for each comparison, and the cutoffs you judged them against
- Which parameters were freed for partial invariance (if any), and that they were selected post hoc
- Latent mean differences with the effect-size denominator you chose (if the level supporting them was established)

### CFA pitfalls

**Modification index chasing.** It's tempting to keep adding residual covariances and cross-loadings until CFI crosses the 0.95 threshold. The problem is that each data-driven modification capitalizes on sample-specific patterns that may not replicate. If you make modifications, limit them to theoretically justifiable changes, report every one, and acknowledge that the final model is exploratory rather than confirmatory.

**"Confirming" an EFA from the same data.** Running [EFA](./factor-analysis.md), finding 3 factors, and then running CFA on the same dataset to "confirm" the structure is circular – the model was extracted from that data, so good fit is expected. Split your sample (EFA on one half, CFA on the other) or use independent data. See also [EFA common pitfalls](./factor-analysis.md#common-pitfalls).

**Testing only one model.** CFA is most informative when comparing competing structures – does a 3-factor model fit better than a 2-factor? Is the second-order model better than the correlated-factors model? A single model that meets fit thresholds is consistent with the data, but there may be other models that fit equally well. Use [model comparison](#model-comparison) to evaluate alternatives.

**Reporting poor fit as acceptable.** Fit indices below standard thresholds (e.g. CFI < 0.90, RMSEA > 0.10) indicate meaningful misfit. If the model doesn't fit well, the options are to revise it (transparently), acknowledge the limitations, or reconsider the theoretical structure – not to relabel the thresholds.

**DWLS / WLSMV fit index inflation.** The DWLS family (including the recommended WLSMV variant for ordinal data) tends to produce higher CFI and lower RMSEA compared to ML on the same data. This is a known property of these estimators, not evidence of better fit. Some researchers have proposed stricter thresholds (e.g. CFI ≥ 0.99, RMSEA ≤ 0.03), though there's no universal consensus yet. Be cautious applying standard ML-derived cutoffs to DWLS or WLSMV results.

**CFA as evidence, not proof.** Good model fit means the data is consistent with your theory – it doesn't mean the theory is correct. Multiple different models can produce equivalent fit. CFA provides supporting evidence for a structure, not definitive validation. If your theory specifies *directional* relationships between factors (rather than just measurement structure), add them as [structural paths](#structural-model) – a CFA tests only the measurement part.

**Invariance testing as a checkbox.** Running the full cascade to the strict level is thorough, but the value lies in understanding *which* parameters differ across groups and *why* – not just whether each level passes or fails. When invariance fails, use [partial invariance](#partial-invariance) to investigate the substantive differences – and remember that a partial solution nominated from your own sample is a hypothesis, not a result.

## Reporting checklist

**Method:**
- Model – measurement and structural specification (the [lavaan syntax](#lavaan-syntax-box) is a compact way to communicate this)
- Estimator and why; whether it was substituted (e.g. WLSMV for ordinal indicators)
- Factor scaling (marker variable or fixed variance)
- How missing data were handled (listwise, FIML, or the pairwise deletion a FIML request falls back to under a least-squares estimator such as WLSMV) – when FIML was requested, the summary's Missing data line names the mode that ran
- Sample size and N : parameter ratio
- Multi-group: the grouping variable, the group sizes, and which parameters were constrained equal across groups
- Mediation: bootstrap method (BCa, BC, or percentile, as reported in the CI column header) and number of replications, plus the mediator design (single, parallel, or serial with its order)
- Latent interactions: the product-indicator approach, the pairing and the centering used, and how many product indicators each interaction carries
- Modifications applied to the initial model and why

**Results:**
- Fit indices – chi-square (df, p), CFI, TLI, RMSEA (with 90% CI), SRMR; report scaled versions when a robust estimator is used
- Standardized factor loadings (measurement), with their own SEs or CIs
- Standardized regression coefficients (structural), with CIs
- Indirect, direct and total effects with their bootstrap CIs – with more than one mediator, report each specific indirect route alongside the total indirect, as the [effect decomposition](#effect-decomposition) lays them out
- For a latent interaction: the interaction's own path coefficient with its CI, and the loadings of the product indicators
- Factor reliability (α, ω, AVE) if relevant
- For a multi-group fit: the constrained model's fit against the configural baseline, and the per-group estimates of every path you interpret
- Modification indices applied (if any), with theoretical justification

## Reproducibility

Every analysis prints the underlying R code to the [R console](./r-console.md) – inspect, copy, or re-run. SEM and CFA use the `lavaan` R package; reliability and discriminant validity metrics use `semTools`, which also generates the ordinal invariance cascade; robust outlier distances in [Check data](#data-diagnostics) use `MASS`. The citation box at the top of the output card carries both the **software** a run actually loaded (Rosseel's lavaan paper alongside the package release) and the **methods** the card reports – the estimator and its robust correction, FIML, the bootstrap interval type lavaan returned, every fit index printed, the reliability and discriminant-validity coefficients, modification indices and the EPC, the delta method behind an un-bootstrapped `:=` interval, the product-of-coefficients indirect effect, the effect decomposition and the path-analysis tradition it comes from, the product-indicator approach and whichever centering a latent interaction used, the N : parameter guideline, the diagnostics battery and the path-diagram convention, and for an invariance run the cascade, the χ² difference test, the ΔCFI, ΔRMSEA and ΔSRMR criteria, the score test, the expected parameter change beside it and its effect on the latent means, and the latent-mean effect size. Each is gated on the run having produced it. The lavaan syntax box also lets you export the model specification directly. When bootstrap SEs are enabled, lavaan's resamples – a fit's, and the latent-mean refit of an invariance run – are seeded by [**Bootstrap seed**](./settings.md#bootstrap-seed) – set it to make bootstrap SEs and indirect-effect CIs reproducible across runs; the MCD subsampling in the diagnostics is seeded by [**Reproducibility seed**](./settings.md#reproducibility-seed). The reasoning behind each section of this manual – every construction, default, threshold, refusal and fallback – is in the [method notes](./methods/structural-equation-modeling.md).

## Common pitfalls

**Causal language from cross-sectional data.** A `~` arrow in the syntax does not establish causation – it specifies a directional regression, but interpreting that directionally requires a research design that supports it (longitudinal data, experimental manipulation, an instrumental variable, or a strong theoretical / temporal argument). SEM fits the model you specify; it doesn't validate the direction.

**Indirect effects without coverage.** Judge an indirect effect on its bootstrap interval. With bootstrap off, the [Defined parameters](#defined-parameters) table's SE and interval are the delta method's, which a product of coefficients does not satisfy – a note under the table says so; see [Sobel test](./concepts/regression-basics.md#b-sobel-test). Bootstrap at the default 100 replications is not enough either: the card says when the count is below 1000 and when it is too low for BCa.

**A latent interaction read without its main effects, or fitted under plain ML.** An interaction coefficient means "the effect of X on Y changes with Z" only while X and Z are both in the equation – drop either main effect and the product absorbs it, and the moderation you report is partly a main effect in disguise. Product indicators are also non-normal by construction, whatever the components look like, so plain ML's normality assumption is violated the moment you add one: prefer a robust [estimator](#estimator) (MLR) for the standard errors.

**Modification index chasing on the structural side.** As tempting as it is to drop in suggested regression paths until CFI crosses 0.95, every data-driven path is a sample-specific decision that may not replicate. Apply only paths the theory supports, report every change, and consider the final model exploratory rather than confirmatory.

**Cycle that breaks identification.** The structural matrix accepts feedback loops (lavaan supports them), but identification requires extra constraints – typically instrumental variables or fixed parameters. The structural matrix highlights a loop's cells in red, but whether the loop is identified is not checked; convergence warnings or large standard errors are usually the first sign of trouble. A non-recursive model also gets no [effect decomposition](#effect-decomposition) – define the effects you want with `:=` lines.

**Mean structure left on by accident.** [**Estimate intercepts**](#mean-structure) adds an intercept for every modelled variable, and in a single-group model whose means nothing reads it buys only parameters. Leave it off unless the means matter – latent means in a grouped structural model, a mean-based `:=` definition; FIML needs no tick, since lavaan adds the mean structure itself, and the invariance cascade sets its own.

**A multi-group fit with nothing constrained.** Selecting a group variable and leaving every **Constrain across groups** box unticked fits the model separately in each group and stops there. Nothing is compared: every parameter is free in every group, so the estimates differ by construction and no test says whether the difference is real. Tick the constraints whose equality you actually want to test – **Structural paths** for "does the model work the same way in each group" – and read the constrained fit against that configural baseline: add both to the [model comparison](#model-comparison), which tests the pair.

**Constraining structural paths before the measurement model is invariant.** A path coefficient equated across groups is interpretable only if the latents mean the same thing in each group. Establish that first: clear the structural equations so the [invariance cascade](#measurement-invariance-testing) becomes available, check it reaches at least scalar invariance, then put the paths back and constrain them. Equated paths over a measurement model that isn't invariant compare quantities that aren't on a common scale.

**SEM as evidence, not proof.** Good fit means the data is consistent with the model – it doesn't prove the model is correct. Multiple alternative structures can produce equivalent fit. Use [model comparison](#model-comparison) to check competing structures and report the comparisons honestly.
