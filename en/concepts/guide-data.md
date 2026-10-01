---
title: The café data
description: The café dataset behind the DataSuite 2 concept pages – its codebook, the three flaws to fix before analysing it, and the shapes each analysis needs.
---

# The café data

Every page in this section works one example: a small café with two branches that changed its menu and wants to know what happened. The data is one file, [`cafe.csv`](../../examples/cafe.csv) – download it, load it the way [Getting started](../getting-started.md#loading-data) describes, and every number quoted on these pages is one you can reproduce. This page is its codebook: where the data comes from, what each column holds, and the three things wrong with it that you will need to notice and fix before the numbers mean anything – which is exactly what a real file asks of you.

The data is synthetic. It was generated from the recipe stored beside it ([`cafe.json5`](../../examples/cafe.json5)), so it behaves like survey and till data – skewed waiting times, a few blanks, one absurd value – without being anyone's records.

## The story

The café has two branches, **Riverside** and **Station**. Eight weeks ago it changed its menu, and the owner wants to know whether that worked. Two sources of information exist. The till knows every loyalty-card member's spending: the average spent per visit and the number of visits, in the eight weeks before the change and the eight weeks after. And a short survey was e-mailed to the members afterwards: six agree–disagree questions about the food and the service, an overall satisfaction score, whether they would recommend the café, and how long they waited at their last visit. Each member is one row – 200 members, 15 columns.

The owner's questions, and the shape each of them has:

- **Did spending change after the menu?** Each member has a before value and an after value – the same people measured twice. The app calls this a *dependent samples* design: the members are the subjects, before and after are the conditions ([comparison analysis](../comparison-analysis.md#analysis-types)).
- **Do the two branches differ?** Riverside members and Station members are different people – *independent samples*, with `branch` as the grouping variable and whatever is being compared as the dependent variable ([comparison analysis](../comparison-analysis.md#analysis-types)).
- **What goes with overall satisfaction?** Whether the food items, the service items or the waiting time track the overall score, and by how much – [correlation](../correlation-analysis.md) and [regression](../regression-analysis.md).
- **Do the six questions measure two things, or one?** The survey was written with three food items and three service items; whether the answers agree with that design is a question for [reliability](../reliability-analysis.md) and [factor analysis](../factor-analysis.md), where the items are the variables and the answer is a structure rather than a difference.

## Codebook

After import the app reports 200 rows and 15 variables, every one of them typed continuous except `recommend`. Here is what they hold, as the file has them:

| Column | What it holds | Values | Blank |
|---|---|---|---|
| `taste` | "The food tasted good" | 1–5 | – |
| `fresh` | "The ingredients were fresh" | 1–5 | – |
| `value` | "The food was good value" | 1–5 | – |
| `friendly` | "The staff were friendly" | 1–5 | – |
| `quick` | "My order came quickly" | 1–5 | – |
| `slow` | "The service was slow" | 1–5, reverse-keyed | – |
| `overall` | "Overall, how satisfied are you with the café?" | 0–10 | 7 |
| `recommend` | "Would you recommend us to a friend?" | yes / no | – |
| `wait` | Minutes waited for the order at the last visit | 0.3–19.9 | 15 |
| `spend_before` | Average spend per visit in the eight weeks before the change | 1.50–18.94 | – |
| `spend_after` | Average spend per visit in the eight weeks after | 1.50–66.53 | – |
| `visits_before` | Visits in the eight weeks before | 0–42 | – |
| `visits_after` | Visits in the eight weeks after | 0–43 | – |
| `age` | Age in years, as entered on the loyalty form | 18–68, and 999 | – |
| `branch` | The branch the member joined at | 1 = Riverside, 2 = Station | – |

**The six survey items.** Each is answered 1 = strongly disagree to 5 = strongly agree, and members lean towards agreement: `friendly` has the highest mean (3.79), `taste` and `fresh` sit around 3.5, and between half and two thirds of the answers to each are 4 or 5. `slow` is the exception – mean 2.52, half the answers 1 or 2 – because it is *reverse-keyed*: it asks the same thing as `quick` from the other side, so a low score is good service. Before the six are summed or averaged it has to be flipped (6 − score), which is what [reliability analysis](../reliability-analysis.md) does with a reverse-keyed item. Three items are about the food and three about the service; that is the structure the survey was written to, and the one the [factor analysis](../factor-analysis.md) pages ask the data to confirm.

**Overall satisfaction and recommendation.** `overall` is a 0–10 score: mean 7.30, median 7, standard deviation 1.90, and seven members left it blank. `recommend` is yes or no – 135 yes, 65 no, so 67.5% would recommend. Both are summaries of the same experience the six items describe, which is why they make good outcomes for the [correlation](../correlation-analysis.md) and [regression](../regression-analysis.md) pages.

**Waiting time.** `wait` is minutes waited at the last visit, and looks the way waiting times always do: most are short, a few are long. The median is 4.9 minutes, the mean 5.20, the longest 19.9, and the distribution has a tail to the right – the page on [distributions and normality](./distributions.md) uses it as the variable that is plainly not normal. Fifteen members left it blank.

**Spend and visits.** The till columns come in pairs. `spend_before` and `spend_after` are the average spent per visit in currency units – means 8.71 before and, as the file stands, 10.03 after. `visits_before` and `visits_after` are counts – means 6.98 and 7.62, medians 6 and 6, with a handful of regulars above 20 and one or two above 40. Because both members of a pair belong to the same person, they are strongly related: a member who spent more than average before tends to spend more than average after (the correlation between the two spend columns is .69 once the catering order below is out of the way). That relatedness is what a paired design uses.

**Age.** `age` is what the member typed on the loyalty form. For those who gave it, it runs from 18 to 68 with a mean of 38.2 and a standard deviation of 10.1 – two rough groups, students and office workers. Five members declined, and the form stored 999 for them.

**Branch.** 101 members joined at Riverside and 99 at Station. Station is the busier branch, and the data was built so that its members spend more, wait longer and vary more – the differences the comparison pages test for.

## Three things to fix first

A real file rarely arrives ready. This one has three problems written into it on purpose, each of a kind you will meet again, and each with a fix in the app that takes a minute. Do them in this order, once, and every page in the section assumes you have.

**A code where a category should be.** The importer reads `branch` as a number, because 1 and 2 are numbers, and types it continuous. It is not a measurement – nobody is "1.5 branches" – and a mean of 1.495 says nothing. Left as it is, it will be offered as an outcome to compare and never as the grouping variable that splits the members into two groups. Open [Data transformation](../data-transformation.md#value-recode), choose **Value recode**, select `branch`, and give the two original values their names: 1 → Riverside, 2 → Station. Keep **Replace original values** and save the rule. The column turns categorical with two named levels, and every table and plot from then on says Riverside and Station instead of 1 and 2. (The [Variables dialog](../getting-started.md#choosing-variables) can set the type to categorical without recoding, which is quicker, but your results would then be labelled 1 and 2.)

**A sentinel where a blank should be.** Run [descriptive statistics](../descriptive-statistics.md) on `age` and the maximum reads 999, the mean 62.2 and the standard deviation 150.7 – for an age. A value that a form uses to mean "not given" is a *sentinel*, and the app cannot know that 999 is one; to it, five members are 999 years old. In [Data transformation](../data-transformation.md#missing-values) choose **Missing values**, the action **Declare missing codes**, enter `999` as the code and select `age`. The five cells become blank, and the column reads 195 members with a mean of 38.2 and a range of 18 to 68. It is not a cosmetic fix: the correlation between age and `spend_before` is .14 with the sentinels in and .23 with them out – five cells in two hundred, and a relationship that is two thirds hidden.

**A real value that answers the wrong question.** The maximum of `spend_after` is 66.53; the next highest member is at 20.08. Row 136 is a Station member who ordered the catering for an office party in the after window, and the till averaged it into their four visits. Nothing was typed wrongly – it is a real amount that a real person paid – but it is not what "average spend per visit" means for the question "did the menu change what people spend?". It is also loud: the standard deviation of the before-to-after change is 4.37 with it in and 2.86 with it out, so one row in two hundred inflates the spread by half. The way to notice it is the way you noticed 999 – look at the maximum, or at a [box plot](../distribution-analysis.md#box-plot), before you test anything ([outliers and missing data](./outliers-missing-data.md) has the rules the app offers). The way to handle it is a rule you can state in one sentence and repeat in the report: here, *an after-window average above 50 is not a per-visit spend*. A **Range recode** in [Data transformation](../data-transformation.md#range-recode) on `spend_after` with **Min** 50, **Max** blank and the output set to missing (the **∅** toggle) blanks that one cell and keeps everything else the member told us – their survey answers, their before-spend, their visits. (Excluding the member altogether, with a [case filter](../getting-started.md#filtering-cases) on `spend_after` **Less than (<)** 50, is the blunter alternative; it removes a good row from every analysis to fix one cell.) Never edit the file itself: the rule is the record of what you did.

**And the honest blanks.** `overall` has 7 empty cells and `wait` 15, plus the one you just made. These are not flaws – surveys have skipped questions – but they change the counts you will see. Under the default [missing data](../settings.md#missing-data) setting, *pairwise deletion*, each analysis uses the rows that are complete for *its* variables: 193 members for `overall`, 185 for `wait`, and 178 for the correlation between them. Under *listwise deletion* every analysis uses only the members complete on every selected variable at once – 172 when all fifteen are selected. Neither is wrong; the report just has to say which, and an *n* that is smaller than 200 is the first thing to check when a number surprises you.

## Wide and long

The file is *wide*: one row per member, with before and after side by side in separate columns. That is the right shape for most of what the section does – correlating columns, scoring the six items, comparing the branches – and the wrong shape for the paired comparison. [Comparison analysis](../comparison-analysis.md#analysis-types)'s dependent-samples design wants the data *long*: one row per member per occasion, a column that says which occasion the row is ("Before" or "After"), and a subject ID that says which rows belong to the same member.

The [table converter](../data-transformation.md#table-converter) in Data transformation does the reshaping. Set **Number of conditions** to 2 and the **Condition labels** to Before and After, select `spend_before`, `spend_after`, `visits_before` and `visits_after` under **Variables to stack**, keep the pattern that reads each variable's before and after as adjacent columns, and let the **Subject identifier** be generated from the row numbers, since the file holds one row per member. The preview shows the result before you apply it: 400 rows, one stacked column for spend and one for visits, the condition column, and the subject ID. Comparison analysis also opens the same tool from its **Convert to long format** button, which sits under the analysis-type radios for every design but one sample, whatever shape the loaded file is.

Applying the converter replaces the loaded dataset, so do the paired comparisons last, or save a project file first and come back to the wide file for everything else.

## What the pages assume

Unless a page says otherwise, its numbers come from the file with the three fixes above applied – `branch` recoded to names, 999 declared missing in `age`, and the catering order blanked in `spend_after` – under the app's default settings: pairwise deletion, a 95% confidence level, three decimal places for p-values and no multiple comparison adjustment. Where a page changes one of those, it says so at the number. [Hypothesis testing](./hypothesis-testing.md) uses the branch comparison on `spend_before`, the before-to-after change in spend and in visits, the six survey items compared between branches, the correlation between `age` and `overall`, and `overall` compared between the branches against an equivalence margin. [Choosing an analysis](./guide-analysis.md) takes the owner's four questions to their modules and results cards, and is the page to read next.
