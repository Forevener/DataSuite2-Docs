---
title: Getting started
description: Learn how to load data, configure variables, and run your first analysis in DataSuite 2 — a free browser-based statistics application.
---

# Getting started

DataSuite 2 is a statistics application that runs entirely in your browser. There is nothing to install — your data never leaves your computer, and all computations happen locally using an embedded R engine.

Whether you need a quick descriptive summary or a full confirmatory factor analysis, the workflow is the same: load your data, pick an analysis, and read the results. This page walks you through the basics.

## How the app loads

DataSuite loads its modules on demand — when you open an analysis for the first time, its code is fetched from the server. A loading indicator shows the progress for each file. If your connection drops or a file fails to download, the app retries automatically (up to three times with increasing delays). If all retries fail, a **Retry** button appears next to each failed item so you can try again manually once your connection is back.

> **Working offline:** add `?preload=all` to the address bar (e.g. `https://.../?preload=all`) to download every module at once. After the initial load completes, the app works fully offline. Note that R packages needed by specific analyses are not bundled — if you plan to use an analysis offline, open it at least once while connected, or install the required packages manually via the [R console](./r-console.md) using `ds_library(packageName)`.

## Loading data

Open the **Data upload & preview** view (the default view when you first visit). Click **Choose file** and select your data file.

Supported formats:

- **delimited text** — CSV, TSV, TXT
- **spreadsheets** — XLS, XLSX, ODS
- **JSON** — row-based, column-based, or a DataSuite project file that restores your entire previous session

After import, each variable is automatically classified as continuous or categorical based on its content. All variables are selected for analysis by default.

> **Tip:** if you have a saved DataSuite project file (.json), loading it restores everything — variable types, filters, transformation rules, and settings.

### Spreadsheet import options

When opening an XLSX or ODS file with multiple sheets (or a single sheet with ambiguous headers), an import modal appears with a live preview that updates as you change settings. Single-sheet files with clear headers skip the modal entirely.

**Sheet selection:** each sheet is listed with a checkbox and its dimensions. Select one or more sheets to import.

**Merge strategies** (when multiple sheets are selected):

- **Append rows** — stacks sheets vertically. Columns are matched by header name (case-insensitive, whitespace-normalized). The widest sheet is used as the canonical column set.
- **Join columns** — concatenates sheets side by side. A warning appears if sheets have different row counts, since alignment is positional.

**Column mapping** (shown automatically when appending sheets with mismatched columns): each unmatched column is listed with its source sheet and a dropdown offering three actions:

- **Keep as new column** — includes the column; sheets that don't have it get empty values
- **Exclude** — drops the column entirely
- **Merge with another column** — maps the column's data into an existing column. Targets are grouped into "matched" (columns present in the canonical sheet) and "unmatched" (orphan columns from other sheets).

**Grouping variable:** when appending, a checkbox adds a categorical column whose values identify which sheet each row came from. The column name (default: "Sheet") and per-sheet labels are configurable.

### Header detection

The app detects how many rows are headers by counting consecutive string values from the top of each column (skipping nulls), discarding entirely categorical columns, and taking the max. Multi-row headers are concatenated with " > ". You can override the detected value via a spinner in the import modal.

**Merged cells:** Excel/ODS merged cells are filled automatically — the top-left value is propagated across the merge range. This preserves multi-row grouped headers (e.g. a questionnaire name spanning several subscale columns) without bleeding into adjacent columns.

**Duplicate column names:** when multiple columns share the same header after collapsing, each group is disambiguated with a counter — e.g. "Score (1)", "Score (2)". Columns with unique names are left untouched.

> **Empty row/column cleanup:** leading and trailing empty rows and fully empty columns are removed from imported spreadsheet data automatically. This handles offset tables, stray spacer rows, and dirty trailing columns.

## Previewing your data

Once loaded, your data appears in a paginated table. You can choose to display 10, 25, 50, or 100 rows per page. Missing values are shown as "(missing)" in muted text.

## Choosing variables

Click the **Variables** button in the top bar. It shows a count like "5/12" when some variables are excluded.

The modal has two tabs:

- **Selection** — click or drag to pick which variables participate in analyses. Use the select all, deselect all, and invert selection buttons for quick adjustments.
- **Variable types** — assign each variable a measurement scale: continuous, ordinal, or categorical. Click a cell to change a single variable, or drag across a column to set several at once.

> **Do you need to manage variables?** Most of the time, no. Analysis modules automatically use whichever variables fit — continuous variables for a Pearson's correlation matrix, for example. You only need to deselect variables when they would add noise to a particular analysis (e.g. excluding an ID column from descriptive statistics).

If a variable contains non-numeric data, you won't be able to assign it a numeric type until you [transform](./data-transformation.md) the values first.

## Filtering cases

Click the **Cases** button to open the case filter. You can add two kinds of filters:

- **Categorical** — pick which values of a categorical variable to keep
- **Numerical** — set a condition like "greater than 50" or "between 10 and 20"

Multiple filters combine with AND logic — a row must pass all of them. Filters are saved inside project files, so they persist across sessions.

## Running an analysis

Open the **Menu** dropdown in the top bar and choose an analysis module:

- [Distribution analysis](./distribution-analysis.md) — normality tests, histograms, Q-Q plots
- [Descriptive statistics](./descriptive-statistics.md) — means, medians, frequencies, cross-tabulation
- [Comparison analysis](./comparison-analysis.md) — t-tests, ANOVA, Mann-Whitney, and more
- [Correlation analysis](./correlation-analysis.md) — Pearson, Spearman, Kendall, partial correlations
- [Reliability analysis](./reliability-analysis.md) — Cronbach's α, McDonald's ω, item analysis
- [Factor analysis](./factor-analysis.md) — exploratory factor analysis, principal component analysis
- [Confirmatory factor analysis](./confirmatory-factor-analysis.md) — CFA model specification and fit
- [Cluster analysis](./cluster-analysis.md) — k-means, hierarchical, biclustering
- [Regression analysis](./regression-analysis.md) — linear, logistic, ordinal, multinomial, regularized
- [Time to event analysis](./time-to-event-analysis.md) — Kaplan-Meier, Cox, parametric, and competing-risks survival models
- [Time series analysis](./time-series-analysis.md) — exploration, ARIMA / SARIMA, forecasting horse-race, periodograms, and change-points
- [Analysis planner](./analysis-planner.md) — sample size and power calculations

Each module has its own set of options. The general pattern is: select your variables, adjust any settings, and click the calculate button. Results appear in the output section below.

## Reading results

Results stack in the **output section** at the bottom of the page. A floating **table of contents** sidebar appears in the bottom left corner of the screen, letting you jump between results.

Each result card has a small **×** button (visible on hover) to remove it. To remove everything at once, click **Clear all results** (appears only when results exist). This resets the output section, citations, and table of contents back to their initial state. A confirmation prompt appears before clearing.

### Citations

A citations box appears below the results once any analysis uses an R package. It has a colored header reading "Please consider citing the works used in your analysis" and two lists:

- **Key references** — one primary citation per package
- **Additional references** — supplementary methodological papers (shown only when present)

Citations accumulate across the session and are not removed when individual result cards are deleted — they reflect all packages actually used. The citation box also appears in the table of contents for quick navigation.

### Exporting results

You can copy-paste tables and text directly from the output section into your document. Note that most word processors and presentation tools will strip some styling (colors, significance highlighting, table borders) during paste — the content and structure are preserved, but visual formatting may need minor touch-up.

For a cleaner export, click **Export to DOCX** at the top right corner of the output section. This downloads a Word document containing all current results, with plots, tables and formatting preserved as closely as possible. You can also use the bulk export controls next to it to export plots as individual files in a ZIP archive.

## Adjusting settings

Click the **Settings** button (wrench icon) in the top bar to configure:

- **Decimal places** — how many digits to show in output (0–10)
- **Confidence level** — 90%, 95%, 99%, or 99.9%
- **p-value display** — exact values, categories (e.g. "p < 0.05"), or hidden
- **Significance formatting** — bold, colored text, or highlighted background for significant results
- **Table style** — full borders, APA style, borderless, horizontal lines, or minimal
- **Missing data** — pairwise deletion, listwise deletion, or imputation (mean, median, mode, constant)
- **Language** — English, Russian, or Chinese

Changes apply immediately to all existing and future results.

## Saving your work

In the **Data upload & preview** view, use the **Download** card to export your data. The default format is a DataSuite project file (.json), which saves everything: your data, variable types, filters, transformation rules, and settings *(but not results!)*. Load this file later to pick up exactly where you left off.

You can also export in other formats — CSV, Excel, ODS, and more — if you just need the data.

## Next steps

- Learn how to reshape and recode data in [data transformation](./data-transformation.md)
- Score questionnaires step by step in the [questionnaire scoring guide](./questionnaire-scoring-guide.md)
- Explore specific analysis modules from the list above
- Use the [R console](./r-console.md) to run custom R code or inspect what DataSuite does under the hood
- Adjust [settings](./settings.md) to match your reporting style
