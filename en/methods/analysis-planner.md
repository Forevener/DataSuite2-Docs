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

**A solved-for power reads against Cohen's 0.80 alone, in a neutral box.** A power is a property of the design, not a finding, so the result box takes no success or warning colour in any solve mode – a power of .12 is not good news in green. With interpretation on, a solved-for power reads one cut, meeting or below the conventional 0.80 (Cohen 1988, §2.4), a value of exactly 0.80 meeting it, and never "adequate": the convention is Cohen's own weighing of a miss against a false positive, not a standard a study passes. Cohen's book is cited only when that reading prints; a sample size, a detectable effect, or a power with interpretation off cites `pwr` alone, since no band renders. {#result}

## DIF power (IRT)

**The design is one common slope and an even spread of intercepts, and under Rasch the slope is the trait's spread.** The other items enter the power only through how precisely they place each person on the trait the studied item is matched on, which the test's length, slope and intercept range set; a per-item entry, or a distribution for the parameters, would ask a plan for numbers it seldom has, so the section takes one slope for the other items and spaces their intercepts evenly over the stated range, the studied item's two parameters entered apart. `mirt`'s Rasch model fixes every slope at 1 and frees the trait's variance, a reparameterisation of one common slope, so under Rasch the slope field is carried as the latent standard deviation, and the focal group's latent mean, entered in reference-group SDs, is scaled by it; the two groups share that spread. Only binary Rasch and 2PL items are offered, as in IRT analysis's [power row](./irt-analysis.md#b-power-to-detect-uniform-dif), since no sourced uniform-DIF size exists for the polytomous families. {#dif-power-irt #item-model #common-slope-a-of-every-item #intercepts-of-the-other-items #focal-groups-latent-mean}

**Power is IRT analysis's DIF noncentrality, computed once per case and scaled to the sample.** The model is built from the stated parameters and never estimated – `multipleGroup` with every value fixed – and handed to the routine behind IRT analysis's power row: the expected likelihood ratio of Zimmer, Draxler and Debelak (2023) at the ETS B and C intercept shifts, from 10,000 simulated response patterns per group under the reproducibility seed, with the same restricted refit and its few-percent overstatement. It is computed once, at the group shares 1 ⁄ (1 + r) and r ⁄ (1 + r) of a single case, r the size ratio: the restricted model's fit depends on the shares and not on the sample size, so the noncentrality grows in proportion to the total, and the required total is the noncentrality the target power needs on the test's df – 1 under Rasch, where only the intercept is compared, 2 under 2PL – divided by the per-case value. The reference size is that total over 1 + r, rounded up, and the focal size the reference size times r, rounded up, so the focal group can overshoot the ratio by under a case. The power table is the same noncentral χ² at its rows' totals, computed rather than interpolated. {#dif-power-results #dif-power-by-group-size #reference-n}

**A target power at or below α is refused.** At a noncentrality of zero the test already rejects at the rate α, so no sample size reaches a lower target and any sample meets an equal one; the run stops with a message rather than return a size of zero.

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

**NNT is Furukawa's, needs a base rate and is banded through its d.** Furukawa (1999) reads d as the shift of a normal latent response between the groups, so the treated group's event rate is $\Phi(d + \Phi^{-1}(\text{CER}))$ and NNT is one over its distance from the control rate; no NNT exists without a control event rate, and the field defaults to 0.50 when left blank. Kraemer and Kupfer's (2006) NNT, $1 / (2\Phi(d/\sqrt{2}) - 1)$, needs no rate but answers for a random treated–control pair rather than for a population at a known event rate; the converter already asks for the rate, so it takes the form that uses it, and Furukawa and Leucht (2011), who compare the two, are cited beside it. Running backwards, $d = \Phi^{-1}(\text{CER} + 1/\text{NNT}) - \Phi^{-1}(\text{CER})$ is the exact inverse, and an NNT whose implied treated rate reaches 1 admits no d, so the whole table reads *requires valid input* rather than the zero d that would read as "no effect". A d that lowers the event rate makes the difference negative: the row is relabelled NNH and prints its magnitude, rather than a negative NNT a reader would take for a benefit, and two rates within 0.001 of each other give an infinite NNT. Its band is the d it encodes, for an NNH as for an NNT – the [rows' banding](#b-interpretation) says why; the app has no sourced NNT ladder, and the d is exact: the d behind a Furukawa NNT is the converter's pivot itself, so the row reads d's band directly rather than through an inverse such as Kraemer and Kupfer's, which belongs to their NNT. {#nnt #nnh #control-event-rate-for-nnt}

*Validation.* d = 0.50 at a control event rate of 0.50 is an NNT of 5.22, medium.

**Every row is banded through the shared band rules, each on its own measure's benchmarks.** The converter grades with the rules every results card reads, so a converted number bands as the card that reported it would, and a value at a cut is on the rung the cut names. The r row is the point-biserial r of a two-group d, so it reads McGrath and Meyer's (2006) r_pb cuts, 0.10 ⁄ 0.24 ⁄ 0.37 – the r_pb of d's 0.2 ⁄ 0.5 ⁄ 0.8 at equal group sizes – rather than Cohen's r cuts, which would band the same effect a rung lower; R² is that r_pb squared, which is η², so it reads η²'s 0.01 ⁄ 0.06 ⁄ 0.14 rather than r's cuts squared. The odds ratio and the NNT take the band of the d they encode, through the logistic conversion and Furukawa's inverse, read on d itself, since the round trip back from either loses ulps at d's cuts. CLES is folded to max(c, 1 − c) and read on Vargha and Delaney's (2000) 0.56 ⁄ 0.64 ⁄ 0.71, the probabilities d's cuts imply – McGraw and Wong (1992) define the statistic and give no benchmarks. The f², w and Cramér's V rows keep their own published cuts, since those measures belong to designs other than the two-group comparison every row is derived from; their band can therefore differ from d's by a rung, and a note under the table says so. V reads w's cuts divided by √df. The published cuts are rounded, so right at one of d's cuts a row can still read a rung below d: d = 0.2 converts to an r of 0.0995, under r_pb's 0.10, and d = 0.5 to an η² of 0.0588 and a CLES of 0.638, under 0.06 and 0.64; the note's second sentence says so. The point-biserial and CLES benchmarks are cited only while the column is shown; the measures' own literature, and the odds ratio's conversion to d, on every run. {#interpretation}

*Validation.* At d = 0.50 the r (0.243), f (0.250), odds-ratio (2.477) and NNT (5.22) rows read medium with d; R² and η² (0.059) and CLES (0.638) read small, just under their rounded cuts, and f² (0.063) and w (0.243) small on their own.

**The converter's verdicts follow the interpretation setting; the quick reference does not.** The **Interpretation** column judges the user's own number, as a results card's verdict does, so it follows the [interpretation](../settings.md#b-show-interpretation-column-when-applicable) setting like one, and a row the converter could not fill moves its reason into the **Value** cell rather than losing it with the column. The quick-reference card of Cohen's benchmarks judges no result – it is reference material, the conventions themselves – so it stays shown either way. {#quick-reference-effect-size-conventions}

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
