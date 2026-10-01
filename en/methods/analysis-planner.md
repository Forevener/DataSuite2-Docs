---
title: Analysis planner – method notes
description: Why DataSuite 2's analysis planner solves, converts, rounds, caps and refuses what it does – the decisions behind each of its tools.
---

# Analysis planner – method notes

The decisions behind the [analysis planner](../analysis-planner.md) – which routine, rounding rule, ceiling or refusal stands behind each tool's answer, and the numbers that validate them, each computed at the planner's shipped defaults. Sections follow the manual's.

## Power analysis

**Factorial ANOVA is planned on the error df, and regression converts the df back to a sample size.** `pwr.f2.test` takes the numerator and denominator degrees of freedom, u and v, and no sample size, so both f² designs are solved for v. A regression's design is known from its inputs – u predictors and one intercept – so the module converts back, N = v + u + 1, and reports a sample size; a factorial design's cell structure is not entered here, so no N can be derived from its v, and the card reports the required error df, which is also the quantity the sensitivity table and the charts step through. {#factorial-anova #multiple-regression #numerator-df-effect #denominator-df-error #number-of-predictors}

*Validation.* At f² = 0.15, α = 0.05 and a power of 0.80, three predictors give v = 72.71 and a required sample of 77; a factorial effect on 2 df gives a required denominator df of 64.32, reported as 65.

**The total N is the rounded per-group n times the number of groups.** `pwr` returns a fractional per-group n, and the card rounds it up, since a fraction of a case cannot be recruited; the total in brackets is that whole number times two, or times k for one-way ANOVA, so the two figures in the box agree. Doubling the fractional n and rounding the product would sometimes read one case less than twice the per-group figure. {#sample-size-per-group}

*Validation.* At d = 0.50, α = 0.05 and a power of 0.80 the independent samples t-test needs 63.77 per group, reported as 64 (Total: 128); one-way ANOVA with three groups at f = 0.25 needs 52.40 per group, reported as 53 with a total of 159.

**A zero effect is refused before R runs.** The correlation field admits negative values, so its lower bound cannot stop a zero, and no design detects an effect of exactly zero – `pwr`'s root-finder has no solution to land on – so the module refuses the run with a message rather than pass the value on. {#effect-size-symbol}

**The sensitivity table recomputes power at five multiples of the rounded reference n, and feeds a solved effect back.** The reference is the card's rounded n, or the entered one, and the grid is that number times 0.5, 0.75, 1, 1.25 and 1.5, each rounded up and floored at 2, so the 100% row is the card's own figure and every cell is a fresh `pwr` power rather than an interpolation. When the run solved for the effect, the achieved effect is what the table is computed with, so its rows describe the design that was actually found. {#sensitivity-analysis}

*Validation.* The default t-test's table reads 32 → 0.504, 48 → 0.679, 64 → 0.801, 80 → 0.882 and 96 → 0.931.

**The power curve stops where power reaches 0.99, and the heatmap grid is fixed at seven sample sizes by six effects.** The curve is computed on 80 points from a fifth of the reference n (at least 4) to five times it, cut at the first point reaching 0.99 or the target power if that is higher – beyond it the curve is flat and would compress the region that matters – and its axis runs to the next round number, with one more point computed there so the line meets the edge. An all-NA grid draws nothing and says so, since d3 has no domain to scale from. The heatmap's grid is the reference n times 0.4, 0.6, 0.8, 1, 1.4, 2 and 3 (at least 4) by the entered effect times 0.4, 0.7, 1, 1.3, 1.6 and 2 (at least 0.01, duplicates dropped); a cell `pwr` cannot compute prints a dash on grey rather than failing the chart. {#show-power-curve #show-sensitivity-heatmap}

## Effect size converter

**Every conversion pivots through Cohen's d, read as the difference between two equal groups.** One pivot keeps fourteen rows mutually consistent, at the price of small rounding artefacts between two non-d measures. From d: $r = d / \sqrt{d^2 + 4}$, the point-biserial relation for equal groups; $\eta^2 = d^2 / (d^2 + 4)$ and R² = r²; f = d ⁄ 2 and f² its square; w = r, Cohen's w being φ on a 2 × 2 table; the odds ratio is $\exp(d\pi/\sqrt{3})$, the logistic relation; CLES is $\Phi(d/\sqrt{2})$. Each runs backwards for the input side. Cohen's h is taken as being on the d scale in both directions, and the h row is computed from the two proportions, $2\,|\arcsin\sqrt{p_1} - \arcsin\sqrt{p_2}|$, since a d alone gives no h. {#input-effect-size-type #correlation-r #r-squared-r² #cohens-f #cohens-f² #cohens-w #odds-ratio #cles #cohens-h #proportions-for-cohens-h}

*Validation.* d = 0.50 converts to r = 0.243, R² = 0.059, f = 0.250, f² = 0.063, w = 0.243, an odds ratio of 2.477 and a CLES of 0.638.

**The typed measure's row keeps the typed value.** Re-deriving the entered measure through d is not exact, so a value entered at a published cutoff came back a few ulps below it and bucketed one rung down – 0.50 reading "small" for d. The entered row carries the value as typed and is interpreted on it; every other row is derived. {#value}

**η² and partial η² coincide, and ω² is converted as η².** A single d describes one factor, so the design has no second effect to partial out and the two rows carry the same number, including when one of them was the input; ω² takes the same f relation, $f = \sqrt{\omega^2 / (1 - \omega^2)}$, and has no output row of its own, since the one-factor reading gives it nothing to add to η². {#eta-squared-η² #partial-η² #omega-squared-ω²}

*Validation.* d = 0.50 gives η² and partial η² of 0.059 each.

**Hedges' g is corrected at N − 2 degrees of freedom and needs six cases.** The correction is $J = 1 - 3 / (4(N - 2) - 1)$ with N the total across both groups – the independent-groups df, which is the design the d ↔ r constant already assumes – and it is applied only when N − 2 ≥ 4; with fewer cases g would pass through as d, so the converter refuses a g input below N = 6 rather than report an uncorrected number as a conversion. {#hedges-g #total-sample-size-both-groups}

*Validation.* d = 0.50 at N = 30 is g = 0.486 (J = 0.973).

**Cramér's V is bounded by the table's shape.** V = w ⁄ √df with df = min(rows − 1, columns − 1), and the converter's w is φ, which the 2 × 2 reading caps at 1, so a V at or above 1 ⁄ √df has no d behind it; the module refuses it with the bound named rather than print a table of blanks. Without dimensions the V row is unavailable, since the same df is needed to derive it from w. {#cramérs-v #table-dimensions-for-cramérs-v}

*Validation.* A 3 × 4 table admits V below 0.707; a 2 × k table below 1.

**NNT needs a base rate and reads on its own ladder.** The Kraemer–Kupfer relation gives the treated group's event rate as $\Phi(d/\sqrt{2} + \Phi^{-1}(\text{CER}))$ and NNT as one over its distance from the control rate, so no NNT exists without a control event rate; the field defaults to 0.50 when left blank, and a rate outside (0, 1) leaves the row unavailable. Running backwards, an NNT whose implied treated rate falls outside (0, 1) admits no d, and the whole table reads *requires valid input* rather than the zero d that would read as "no effect". The magnitude ladder runs the other way from every other measure – a smaller NNT is a stronger effect – so it has no registry family: above 50 negligible, above 10 small, above 4 medium, otherwise large. {#nnt #control-event-rate-for-nnt}

*Validation.* d = 0.50 at a control event rate of 0.50 is an NNT of 7.24, medium.

**Interpretations come from the app's magnitude registry, three measures rescaled first.** The cutoffs are the one registry every results card reads, so a converted number buckets as the card that reported it would, and a value at a cutoff is on the rung the cutoff names. Three measures are put on their family's scale before bucketing: the odds ratio is folded to max(OR, 1 ⁄ OR), since 0.5 and 2 are the same effect and a non-positive or infinite ratio is perfect separation; CLES to max(c, 1 − c), its magnitude living on [0.5, 1]; and Cramér's V is scaled back up by √df to meet the w cutoffs, the rule the comparison module applies. {#interpretation}

## Alpha correction planner

**Holm and Hochberg share one row, and Hommel has none.** Both step-wise procedures compare the i-th smallest p-value with $\alpha / (m - i + 1)$ and differ only in direction – Holm steps down from the smallest p and stops at the first failure, Hochberg steps up from the largest and stops at the first success – so one threshold column serves both and a second row would repeat it. Hommel's procedure is more powerful than either but rejects by closed testing over Simes intersections, not by comparing each p-value with a per-rank constant, so no threshold column describes it and listing one would misrepresent it; the note under the table says so, and the method is cited with the others because that note names it. {#method #holm-hochberg #threshold-at-rank-i}

*Validation.* Ten comparisons at α = 0.05 give the shared row 0.005 at rank 1, 0.008 at rank 5 and 0.050 at rank 10.

**Šidák and Benjamini-Yekutieli print their exact thresholds.** Šidák's is $1 - (1 - \alpha)^{1/m}$, the per-test level whose complement compounds to 1 − α over m independent tests, a little above α ⁄ m; Benjamini-Yekutieli's is the Benjamini-Hochberg threshold $(i/m)\,\alpha$ divided by the harmonic sum $\sum_{j=1}^{m} 1/j$, the factor that extends the guarantee to arbitrarily dependent tests. {#šidák #benjamini-yekutieli-by}

*Validation.* Ten comparisons at α = 0.05: Šidák 0.0051 against Bonferroni's 0.0050; Benjamini-Yekutieli 0.0017, 0.0085 and 0.0171 at ranks 1, 5 and 10, the harmonic sum being 2.929.

## Scale length planning (Spearman-Brown)

**The required count is rounded up and floored at one, and the projection table drops duplicate rows.** The length factor is $k = \rho_t(1 - \rho_c) / (\rho_c(1 - \rho_t))$ for a current reliability ρ_c and a target ρ_t, and the required count is the current count times k, rounded up, since a fraction of an item cannot be written, and never below one. The projection rows are half the current count (rounded down, at least one), the current count, one and a half times it (rounded up), twice it and the required count, sorted, with any coincidence – a required count equal to the current one, or to the doubled one – shown once; when the required count equals the current, the result says the target is already reached rather than reporting "0 more". {#current-number-of-items #target-reliability #items #projected-reliability}

*Validation.* From 0.70 on 10 items to a target of 0.80, k = 1.714 and 17.1 items round to 18; the table reads 5 → 0.538, 10 → 0.700, 15 → 0.778, 18 → 0.808 and 20 → 0.824.

## Correlation attenuation

**A disattenuated estimate outside [−1, 1] is flagged, not clipped.** Dividing an observed correlation by $\sqrt{r_{xx} r_{yy}}$ can exceed 1 in magnitude, and that is information: the reliabilities entered are too low to have produced the correlation observed under them, so at least one is understated. The module prints the estimate in red with that reading rather than clipping it to 1, which would hide the inconsistency. Reliabilities are accepted in (0, 1] and the correlation in [−1, 1]; nothing else is refused. {#disattenuate-observed-correlation-true #estimated-true-correlation}

*Validation.* An observed 0.50 under reliabilities of 0.40 and 0.50 has a factor of 0.447 and an estimate of 1.118, flagged.

## Precision planning (CI width)

**The mean's sample size iterates on t from a z start; the proportion's is the normal formula.** A mean's interval uses the t distribution at n − 1 df, and the closed z formula $n = (z\,\text{SD}/E)^2$ understates the sample for small n; the module takes it as a start and iterates $n = (t_{n-1}\,\text{SD}/E)^2$, rounded up, until the count stops changing, at most ten passes, with the df floored at 1. A proportion's interval is the Wald one, so its sample is $z^2 p(1 - p) / E^2$ directly. {#mean #proportion #expected-standard-deviation}

*Validation.* An SD of 1 with a margin of ± 0.50 at 95%: the z formula gives 16 and the t iteration 18, and the table reads 64, 30, 18, 13, 10 and 6 at the six margins; a proportion of 0.50 at ± 0.05 needs 385.

**The correlation's sample size is a bisection under a ceiling of 10 000, and a margin beyond it is reported unreachable.** The interval for r is built on Fisher's z, whose standard error is $1/\sqrt{n - 3}$, and the half-width of the back-transformed interval has no closed inverse in n, so the module bisects for the smallest n between 4 and 10 000 whose half-width is within the margin – the half-width is monotone in n, so the search is exact. A margin the ceiling itself cannot reach is reported as unreachable, in the result and as *Not reachable* in the table's rows, rather than the ceiling being returned as if it were the answer. {#correlation #expected-correlation}

*Validation.* r = 0.30 at 95% needs 320 cases for ± 0.10 and 1,274 for ± 0.05; ± 0.01 is not reachable within the ceiling.

## Group allocation optimizer

**The comparison rows split the entered total, rounding the first group down, and an arm below two cases has no power.** Every row is computed with `pwr.t2n.test` on the same total: the equal split is ⌊N ⁄ 2⌋ against the rest, and a ratio r₁ : r₂ gives n₁ = ⌊N r₁ ⁄ (r₁ + r₂)⌋ and n₂ = N − n₁, so when the total does not divide evenly in the ratio, mirror-image ratios differ by a case and their powers differ slightly. The entered allocation joins the table when it is none of the seven, its ratio reduced by the greatest common divisor unless a part would exceed 10, when the raw sizes are printed. An arm below two cases has no t distribution, so the row's power is unavailable; those rows are excluded from the ranking and trail the table rather than sort at an arbitrary position. The power loss is the difference between the equal split's power and the entered one's, in percentage points. {#ratio #group-sizes}

*Validation.* Two groups of 50 at d = 0.50 and α = 0.05 have a power of 0.697; on the same total 2:1 is 66 against 34 at 0.650 and 1:2 is 33 against 67 at 0.644.
