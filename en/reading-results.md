---
title: Reading results
description: How DataSuite 2 lays out results, builds verdicts and bands, marks a value at its cutoff, states the setup each result was computed under, and exports results.
---

# Reading results

Every analysis adds its results to the output section at the bottom of the page. This page covers what all the modules share: how the cards are laid out, how a verdict is built and what its bands rest on, the superscript on a number that sits at a verdict's cutoff, the setup cards and the settings popover that say what each result was computed under, the notes every module words alike, and how to take results out of the app. What a particular table or column means is in its module's manual.

## The output section

Results stack in the **output section** at the bottom of the page. A floating **table of contents** sidebar appears in the bottom left corner of the screen, letting you jump between results.

Each result card has a small **×** button (visible on hover or keyboard focus) to remove it, and beside it a **⚙** button that opens the [settings the result was computed under](#b-settings-this-result-was-computed-under). Between the results, [setup cards](#setup-cards) state the dataset, the cases and the run settings the results below them were computed under. To remove everything at once, click **Clear all results** (appears only when results exist). This resets the output section, setup cards included, citations, and table of contents back to their initial state. A confirmation prompt appears before clearing.

## Verdicts and bands

With [interpretation](./settings.md#b-show-interpretation-column-when-applicable) on, a results table reads its own numbers in words – a verdict in its **Interpretation** column, a badge on a fit index, a colour on a graded cell – and every module builds them by the same rules, so a reading learnt on one card holds on the next. With it off the verdicts, the bands and their legends go, and the numbers and the notes stating what the run did stay.

**A verdict is built from up to five parts.** They come in a fixed order, the first two joined by a comma and every later one by a semicolon – *Significant difference, A > B; small to large effect* – and a part the row has nothing for is left out.

- **Decision** – the test's conclusion, in the words of its hypothesis: *Significant difference*, *Residual autocorrelation remains*, *No significant trend*. It reads the p the highlight reads – the adjusted one when an [adjustment](./settings.md#multiple-comparison-adjustment) is on. A test that does not reject says so as *No evidence of …*, *… not rejected* or *No significant …*, never that an assumption is met. {#verdict-decision}
- **Direction** – which side is higher, *A > B*, printed only when a signed comparison rejected and never for an omnibus test. {#verdict-direction}
- **Band** – the magnitude of the point estimate on its source's benchmarks: *small effect*, *strong*, *Acceptable fit*. {#verdict-band}
- **Band across the CI** – when the graded statistic's confidence interval is on screen, the bands of the smallest and the largest magnitude the interval holds take the point's place: *small to large effect*, or *negligible effect across the CI* when both ends agree. An interval that reaches the value of no effect has a negligible end, so only *negligible effect across the CI* supports "no meaningful difference". The point's band stands instead when the row has no interval, when an adjusted p decides the row (the unadjusted interval stays on screen), and when the graded statistic has no interval of its own. {#verdict-band-across-the-ci}
- **Consequence** – for an assumption check, what its result means for the analysis that ran: [Pass, Caution or Fail](#b-pass-caution-and-fail). {#verdict-consequence}

**Pass, Caution and Fail.** The status of an assumption check: *Pass* when the check found nothing, *Fail* when it rejected and the rejection rules a test out – the note beside it names which – and *Caution* when it rejected but the analysis that ran does not treat the rejection as a violation, so it is a caveat to report rather than a reason to switch: a normality test failing in a group large enough for the central limit theorem, or no more rejections across many variables than chance alone produces. What each check's status covers is under [Status](./concepts/assumptions.md#b-status). {#pass-caution-and-fail}

**The test and the CI disagree.** Added to a verdict when the decision and the interval beside it rest on different quantities and point different ways – a Welch t beside a pooled-SD d, an odds ratio's own interval beside a χ² p, a bootstrap interval beside an asymptotic p – so that the test rejects while the interval reaches no effect, or the reverse; the verdict names the conflict rather than siding with one. A different confidence level and a one-sided test are not such a disagreement, and each has its note below. {#the-test-and-the-ci-disagree}

**One-sided test, two-sided interval.** A note always shown under a table whose F or χ² test sits beside a two-sided η², ω², ε², R², V, w or I² interval: the test is one-sided and the interval two-sided, so a significant row's lower limit can reach 0 when p lies between α/2 and α. A table whose interval method behaves differently words the note for that method. {#one-sided-test-two-sided-interval}

**Two levels.** When the [significance level](./settings.md#significance-level) and the [confidence level](./settings.md#b-confidence-level) do not match – α = 0.01 beside a 95% interval – a note under a table whose verdicts read an interval says which level does what: *Significance is judged at the 1% level; effect ranges read the 95% confidence interval.* The rows never name either level, and the note goes with the verdicts when interpretation is off. {#two-levels}

**Band legends.** Every graded table carries a legend under it: each band's bound, the source the bands come from, and – for a measure graded on another statistic's benchmarks through a conversion, such as Cliff's δ on Vargha and Delaney's A – the scale the bounds are printed on. Its lead differs by module: Correlation's opens *Strength bands:* and gives one line per band ladder its cells read, the source closing each line (*r, ρ: ○ < 0.1 negligible correlation, …; Cohen (1988).*), while Comparison's names the source and the measure first (*Bands on Cohen's (1988) benchmarks for d:*, *Bands on Schmidt's (1997) benchmarks for W:*) under every table that grades an effect size – the overall test's, a long post-hoc table and a matrix alike. The bounds are the source's printed numbers, and a value exactly on a cut falls on the side the source puts it. A statistic no source gives benchmarks for prints its number with no band. {#band-legends}

**Harvey balls.** A matrix cell has no room for a band's word, so the band rides after the number as a Harvey ball – ○ ◔ ◑ ◕ ●, empty for the bottom band and full for the top, spread over as many bands as the rule has – with the word as the ball's tooltip. The legend under the matrix then leads each band's bound and word with its ball, from the bottom band up. {#harvey-balls}

**Wording a verdict avoids.** No verdict calls an assumption met, holding or confirmed because its check did not reject; reads an interval's mechanics (*CI excludes 0*) in place of the finding (*Significant indirect effect*); calls the model an information criterion ranks first anything but *preferred*; prints observed power; or puts a probability on a magnitude (*likely beneficial*). Model fit gets one badge per index and no combined verdict. The reasons are in the [interpretation method notes](./methods/interpretation.md). {#wording-a-verdict-avoids}

**Too few replications.** A card whose bootstrap intervals come from fewer than 1,000 replications, or whose permutation p-values cannot reach the significance level at the count set, says so under its table – the count that ran always, the recommendation it falls short of with interpretation on. The app never raises a count you set; [Bootstrap replications](./settings.md#b-bootstrap-replications) and [Permutation replications](./settings.md#b-permutation-replications) name the cards that carry the note. {#too-few-replications}

## Boundary marker

A verdict printed beside a number – *Significant*, a fit band, a reliability tier, a correlation's strength – compares the number with a cutoff, and the app makes that comparison on the exact value rather than on the rounded one you see. The two almost always agree. When the exact value lies within rounding distance of the cutoff, though, the printed number can land on the other side of it, and then it carries a small superscript: ⁻ when the exact value lies just below the printed one, ⁺ when just above. A reliability of 0.8996 printed at three decimals reads `0.900⁻` beside *Good* rather than *Excellent*, since it falls just short of 0.90; at α = 0.05, p = 0.0504 reads `0.050⁺` and is not significant. Hover the number for its exact value. The [boundary marker](./settings.md#b-boundary-marker) entry in the settings says where the marker appears and where it never does.

Why the exact value: grading the printed number would tie the verdict to the display. The same coefficient of 0.8996 would read *Excellent* at two or three decimals and *Good* at four, so changing the precision setting – a choice of how many digits you want to see – would change a conclusion. Graded on the exact value, a verdict belongs to the result itself and stays the same at every precision. The cost is the rare number whose print and verdict disagree, and the marker is there so that the disagreement is explained on the screen rather than left looking like an error.

## Setup cards

A result is computed under a setup – the dataset, the cases that reached the analysis, the run settings – and the output section states it in **setup cards**, dashed cards tinted in the primary colour that stand between the results. They are derived from the results rather than stored: whenever a result is added, deleted or cleared they are worked out again, so deleting a result in the middle recomputes the difference between its neighbours, and a setup card goes with the last result it governed. A card computed under no setup – **Data import notes**, an R output or plot – neither gets a setup card nor breaks one.

**Setup.** The card before the first result: its dataset, its cases once a filter or a deletion cut them or imputation filled cells, and every run setting that applies. {#setup}

**Setup changed.** The card before a later result whose setup differs from the result above it, listing only what changed, each by its new value. A newly drawn seed opens none – the draw is [the result's own](#b-seed-drawn-for-this-run) – and neither does a change of a significance level, which is a display setting ([cards computed under earlier settings](#cards-computed-under-earlier-settings)). {#setup-changed}

A setup card lists its entries in four groups – data, variables, cases, run settings – in this order.

- **Dataset** – on the first setup card, the file the results read and its size, *survey.csv, 212 × 40*: a project is named after its project file, a multi-file import by its files, and data with no file behind it by its size alone.
- **New dataset** – a file or project loaded since the result above, named the same way. It replaces the variables group, since every column changed.
- **Data stacked** – a [wide-to-long reshape](./data-transformation.md#b-wide-to-long) since the result above, with the new size, *424 × 12*; it replaces the variables group too.
- **Data unstacked** – the long-to-wide reshape, likewise.
- **Values changed** – the columns whose values changed since the result above: a [transformation rule](./data-transformation.md#managing-rules) added, edited, deleted or dragged to a new place rewrote them, or read a column one did, or an analysis inserted the column again under its name. Only columns both results had are compared, so a new column, a first insert or a missing-data settings save lists nothing.
- **Types** – the columns whose [variable type](./getting-started.md#b-variable-types) changed, each by its new type, *Q3: ordinal*.
- **Filters** – the active [case filters](./getting-started.md#filtering-cases), joined by their match mode, *group ∈ {a, b} and 20 ≤ age ≤ 40.5*, or *none* once cleared.
- **Rows** – the row count from the source to the analysed data, *212 → 180 after listwise deletion → 154 after filters*. Under listwise deletion a change of the variable selection moves it.
- **Imputed** – the cells [imputation](./settings.md#missing-data) filled, *318 cells in 14 variables*.
- **Run settings** – the settings that change what an analysis computes, each by its name: **Confidence level**, **Bootstrap replications**, **Permutation replications**, **Bootstrap seed**, **Reproducibility seed**, **P-value adjustment method**, **Missing data**, and the **Imputation method** and **Constant value** while imputation is in use. An empty seed reads *random, drawn per result*, since each result under it draws its own.

**Settings this result was computed under.** The popover a card's **⚙** button opens: the card's own record of its setup, in up to four sections – **Data** (its dataset), **Variables** (the type each of the card's variables had when the run read it), **Cases** and **Run settings** – with every run setting that applies, an empty seed reading *random (drawn: 482913774)*. The settings the result's computation read are highlighted, and a legend says so. **Go to the setup card** scrolls to the setup card the result sits under. The popover reads the card alone, so it holds however far down the log the card is; Escape, a click outside or the button again closes it. {#settings-this-result-was-computed-under}

[Export to DOCX](#exporting-results) carries every setup card in its place, as its title and one line per entry. A setup card has no table-of-contents entry and no **×** button, and its text is ordinary text: Ctrl+F finds it, and it copies with the cards you select.

Why setup cards hold what they do: they state what every analysis shares, and an analysis's own options stay on its result card, beside the answer they shape. The first setup card lists every run setting that applies, whether or not the results below use it, so the full configuration always reaches your report; the [settings popover](#b-settings-this-result-was-computed-under) marks the ones a result used.

## Cards computed under earlier settings

Settings come in two kinds. Most change only how a result is shown – the precision, the significance levels and thresholds the verdicts read, the table style, the language – and pressing **Save changes** redraws every card already on the page with them. A few change what an analysis computes: the confidence level, the bootstrap and permutation replications, the seeds, the p-value adjustment and the missing-data handling. A card keeps what it computed under those: a change applies from the next run, the [setup card](#b-setup-changed) before that run's result names it, and each earlier card's [settings popover](#b-settings-this-result-was-computed-under) still lists what that card was computed under. A row computed at a significance level – an equivalence test's (1 − 2α) interval, a Johnson–Neyman region, a differencing order chosen at the assumption-test level – keeps the level it ran at and [says so](#b-the-level-the-analysis-ran-at). [How a save applies](./settings.md#how-a-save-applies) lists the settings of each kind.

Why the two kinds are treated differently: a card keeps the raw results of its run, and everything a display setting touches – the rounding, the verdicts, the highlights – can be read again from them, so the card follows those settings as you change them and never shows a verdict from the old setting beside a highlight from the new one. A run setting's effect cannot be read off what the card holds: a 99% interval, a new set of resamples, a differently adjusted p or another set of cases has to be computed again from the data, which may itself have changed since. Recomputing on its own would change numbers you may already have copied, and keeping the old numbers without a word would let the card claim a setting it was not computed at – so the card keeps its numbers, and the setup cards say which settings they belong to. Nor is an earlier card out of date: the output section is a log of what ran, in order, so a change is stated once, where it took effect, rather than flagged on every card above it.

**Column names on older cards.** A card names its columns as its run read them. A column renamed in the same dataset takes its new name on every card, but after a new dataset – a file or project load, a stack or unstack – or once a column is deleted, an older card, its setup card and its popover keep the names the run used, never the new dataset's column at the same place. {#column-names-on-older-cards}

## Notes on a card

A few notes are worded alike in every module, so a module's manual names them and links here.

**Seed drawn for this run.** A card whose computation drew random numbers under an empty [Bootstrap seed](./settings.md#b-bootstrap-seed-empty-random) or [Reproducibility seed](./settings.md#b-reproducibility-seed-empty-random) ends with the seed the run drew – *Bootstrap seed drawn for this run: 482913774*, *Reproducibility seed drawn for this run: …* – so entering that number as the seed and running again reproduces the result exactly. A card whose seed was set, or whose computation drew nothing, has no such line. The line stays with interpretation off and goes into the DOCX export. {#seed-drawn-for-this-run}

**Iteration limit.** An iterative fit – an estimation, a rotation, a k-means partition – that stops at its iteration limit before converging says so on its card and names the limit, *The model did not converge within its limit of 100 iterations*; a table comparing several fits marks the unconverged one with †. The estimates shown are where the fit stopped, and with interpretation on the note adds what rests on them and what may help it converge. {#iteration-limit}

**N under a table.** When a table's N column is turned off, a note under it still states the sample size, *N = 212 throughout this table* or *N varies from 180 to 212 across this table*. {#n-under-a-table}

**The level the analysis ran at.** A row computed at a significance level – an equivalence test's verdict, a Johnson–Neyman region, the parameters a score test selected, a differencing order chosen by KPSS – is computed when the analysis runs, and a note names the level it ran at: *Johnson-Neyman region at α = 0.05, the level the analysis ran at.* A later change of the level re-reads the card's other verdicts but leaves these rows at the run's level; run the analysis again to compute them at the new one. {#the-level-the-analysis-ran-at}

## Citations

A citations box appears below the results once an analysis has something to cite. It has a colored header reading "If you publish this analysis, please cite these works" and two lists:

- **Methods** – the literature behind the statistical methods that ran: who introduced each method, and whose algorithm the app actually used
- **Software** – the R packages that did the computing, each with the version that actually ran, plus WebR and D3

Every reference is curated by hand rather than generated, so each list appears only when it has something in it – a method nobody has curated references for yet shows nothing at all rather than a misfiled package entry. Libraries with no publication to cite (math.js, Papa Parse, SheetJS and the rest) are credited in the **Support the project** dialog instead. Citations accumulate across the session and are not removed when individual result cards are deleted – they reflect everything actually used. The citation box also appears in the table of contents for quick navigation.

## Exporting results

You can copy-paste tables and text directly from the output section into your document. Note that most word processors and presentation tools will strip some styling (colors, significance highlighting, table borders) during paste – the content and structure are preserved, but visual formatting may need minor touch-up.

For a cleaner export, click **Export to DOCX** at the top right corner of the output section. This downloads a Word document containing all current results and the [setup cards](#setup-cards) between them, with plots, tables and formatting preserved as closely as possible. Only what the page shows goes in: a plot variant or a table column hidden on screen stays out of the report. You can also use the bulk export controls next to it to export plots as individual files in a ZIP archive.

## Resizing and exporting charts

Every chart in DataSuite works the same way. **To resize**, drag the small handle in the chart's bottom-right corner – make it as large or small as you need. Multi-panel figures (such as the IRT information curves) resize together from a single handle.

**To export a single chart**, hover over it: a small toolbar appears just to its right with three buttons – **SVG**, **PNG**, and **JPG**. Click one to download that chart on its own. On a touch device, where there's no hover, the toolbar is always visible.

> **Which format?** **SVG** is a vector format – it stays sharp at any size and is the best choice for publication or further editing. **PNG** and **JPG** are pixel images, rendered at three times their on-screen size – handy for quickly pasting into slides or sharing.

To save *every* plot on the page in one step instead, use the bulk export (ZIP) controls or **Export to DOCX** described above.
