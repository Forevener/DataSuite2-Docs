---
title: Taking an exam
description: How to open an exam link, answer questions in the exam panel, check your answers against the app's own numbers, and export a graded report in DataSuite 2.
---

# Taking an exam

Your instructor sends you a link. That link carries the whole exam – the dataset recipe and the questions – so there is nothing to download, no account to create, and nothing to upload. Everything runs in your browser, and your work stays on your machine.

## Quick start

1. **Open the link.** A dialog asks you to enter your name.
2. **Type your name exactly as your instructor expects it.** Your name is what builds your dataset, so a different spelling is a different dataset.
3. Your data loads and the **Exam** panel appears at the right of the screen.
4. For each question: run the analysis it names, read the number off the result card, type it into the panel, and press **Check**.
5. When enough questions have passed, export your report from the **Export** menu.

> **Why your numbers differ from everyone else's:** your name is turned into a random seed, and the data is drawn from that seed. Every student gets a dataset with the same *structure* but different values, so which variables come out significant is genuinely yours. Copying a classmate's answers cannot work, and neither can looking them up – but your own data is perfectly reproducible, so your instructor can regenerate it from your name and check your report against it.

## The exam panel

The panel floats over the app so you can keep working while it is open.

- The header shows **Exam** and your score as `passed / total`. Click it to collapse the panel out of the way; click again to bring it back.
- The body lists every question with its own input and its own **Check** button.
- The footer shows the export gate (see [exporting your report](#exporting-your-report)) and a **Restore the exam dataset** button.

The panel sits underneath dialogs, so the **Cases** and **Variables** modals stay reachable while it is open.

## Answering

Each question has one input, matched to what it asks for.

| The question asks for | You get | Notes |
|---|---|---|
| A number | a text field | Type it the way the app prints it – see [type what the app shows](#type-what-the-app-shows) |
| One of a fixed set of answers | a dropdown | For example a group name, or yes / no |
| Several variables or levels at once | a checkbox list | Marked as a whole, not per item |
| A small table | a grid, one row per variable | Each cell is marked separately |
| A choice that later questions build on | a dropdown or checkbox list | Not graded – it is an input, not an answer |
| A written interpretation | a reminder line | Your instructor grades this by hand |

An unanswered question reads **— not answered —**. A question that builds on an earlier one stays empty until you answer that one, and says so: *Answer the earlier question this one builds on first*.

> **Why a "pick one of the above" question is not graded:** questions like *pick one of the scales you just listed* exist so the questions after them run on **your** choice. There is no right answer to the pick itself – the grading happens on what you say about the variable you picked.

## Checking your answers

Press **Check** and the question is marked immediately: **Correct**, or *Not the app's number – read your output again*. A table is marked cell by cell, so you can see exactly which row is wrong.

- **Retries are unlimited and are not counted.** Nothing records how many times you pressed **Check**, and there is no penalty for pressing it early.
- **A mark you have earned is kept.** Once a question passes it stays passed, even if you change settings afterwards.
- **A set is marked as a whole.** If a checkbox question fails, one of your ticks is wrong – go back to your output and read the table again rather than guessing which one.
- **Changing an answer clears what depends on it.** If you change a pick, the questions built on it lose their answers and marks, because they were about a different variable.

Questions that need R run for a second or two behind the loading overlay – the panel says **Checking…** and the screen locks so a check can never collide with an analysis you started. **Cancel** stops it.

## Type what the app shows

Answers are compared against the app's own formatting of the true value, under **your** [precision settings](./settings.md#precision-settings). So you type what is on your screen and nothing else has to match: if you work at two decimals, you are graded at two decimals; if you work in significant figures, you are graded in significant figures.

- Below the p-value floor the app prints `< 0.001`, and that is an accepted answer – type it as shown.
- A comma decimal separator is accepted.
- Counts and other exact values are matched exactly.

> **A p-value on the boundary is yours to resolve.** If a question turns on whether p is below 0.05 and your screen shows exactly `0.05`, raise the precision in **Settings** and read it again. The grader follows your precision setting, so the extra digit is real, not a trick.

## Settings that change your answers

The exam grades you on the analysis **you** ran, so the settings you are working under are part of the answer. These are the ones that move a graded number:

- [Multiple comparison adjustment](./settings.md#multiple-comparison-adjustment) – if you switch to Holm, you are graded on Holm.
- [Significance level](./settings.md#significance-level) and the [precision settings](./settings.md#precision-settings).
- Missing data handling – on listwise deletion your cards are computed on fewer rows, and so is the answer key.
- [Parallel analysis draws](./settings.md#parallel-analysis-draws) and the [reproducibility seed](./settings.md#reproducibility-seed), for factor questions.

Some settings can make a question impossible rather than merely different, and the panel tells you which:

- *Turn p-value display on in Settings to answer this* – p-values are hidden entirely under the [display format](./settings.md#display-format) setting `none`.
- *Set p-value display to exact values in Settings to answer this* – the `category` format prints a band rather than a number.
- *Set a random seed in Settings to answer this* – a few questions draw random numbers, and with no [seed](./settings.md#reproducibility-seed) set they would give a different result every time you press **Check**.

The settings each answer was checked under are recorded with the mark and printed on your exported report, so your instructor can reproduce exactly what you did.

## Transforming and filtering data

Some questions ask you to change the data first – filter to one group in the **Cases** dialog, reverse-score an item, build a composite. Do it exactly as the question words it.

Your changes never corrupt the answer key: grading always runs against a pristine copy of your original dataset, kept aside when the exam opened. What matters is that **your** screen shows the right thing – a filter you forgot to clear is the usual reason a later answer stops matching.

If your data gets into a state you cannot untangle, press **Restore the exam dataset**. It redraws your original data from your name and discards every transformation and filter you have added; your answers and marks are kept. Reloading the exam link does the same thing.

See [data transformation](./data-transformation.md) for what the transformation rules do.

## Exporting your report

The panel footer tells you where you stand:

- **Export unlocked** / **Ready to export** – you have passed enough questions.
- **Export locked – n of m questions must pass** – the export is blocked until you do.
- **n of m questions should pass before you export** – you will be asked to confirm, but you can go ahead.

Your instructor chooses which of these applies. When you export to Word, the document carries an **answer sheet** appendix listing every question, your final answer and its mark – including the questions that are not graded, so the picks your other answers were built on are visible too. A provenance line in the page header and a short integrity hash tie the document to your dataset.

Write your interpretations into the document as the prose questions ask. The panel only certifies that you ran the analysis correctly; the reasoning is what your instructor reads.

## Common pitfalls

**A leftover filter.** The most common cause of a correct-looking answer that will not pass is a **Cases** filter left on from an earlier question. Check what is filtered before you blame the number.

**Typing the value you expected instead of the one on screen.** The grader compares against the app's own output. Round-tripping a number through your own arithmetic – converting a percentage, re-rounding – is what breaks an otherwise correct answer.

**Reading the wrong percentage.** A variable with missing values shows both a percentage of all rows and a valid percentage of the rows that have data. The question names which one it wants; read it again if your answer is close but not equal.

**Reading the wrong column in a reliability table.** Item-total correlations are printed in more than one form. Questions about reverse-keyed items mean the *corrected* item-total correlation, which is the one the module's own warning is based on.

**Assuming the exam is the same as a classmate's.** It is not – same questions, different numbers. If a question asks which variables differ significantly, your answer will not be theirs.
