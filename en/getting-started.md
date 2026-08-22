---
title: Getting started
description: Learn how to load data, configure variables, and run your first analysis in DataSuite 2 – a free browser-based statistics application.
---

# Getting started

DataSuite 2 is a statistics application that runs entirely in your browser. There is nothing to install – your data never leaves your computer, and all computations happen locally using an embedded R engine.

Whether you need a quick descriptive summary or a full confirmatory factor analysis, the workflow is the same: load your data, pick an analysis, and read the results. This page walks you through the basics.

## How the app loads

DataSuite loads its modules on demand – when you open an analysis for the first time, its code is fetched from the server. A loading indicator shows the progress for each file. If your connection drops or a file fails to download, the app retries automatically (up to three times with increasing delays). If all retries fail, a **Retry** button appears next to each failed item so you can try again manually once your connection is back.

> **Working offline:** add `?preload=all` to the address bar (e.g. `https://.../?preload=all`) to download every module at once. After the initial load completes, the app works fully offline. Note that R packages needed by specific analyses are not bundled – if you plan to use an analysis offline, open it at least once while connected, or install the required packages manually via the [R console](./r-console.md) using `ds_library(packageName)`.

## Loading data

Open the **Data upload & preview** view (the default view when you first visit). Click **Choose file** and select your data file.

Supported formats:

- **delimited text** – CSV, TSV, TXT
- **spreadsheets** – XLS, XLSX, ODS
- **JSON** – row-based, column-based, or a DataSuite project file that restores your entire previous session

After import, each variable is automatically classified as continuous or categorical based on its content. All variables are selected for analysis by default.

> **Whitespace-only cells:** cells containing only spaces are kept exactly as imported (no trimming) and count as valid data points – never as numbers or as missing values. A column that looks numeric except for such cells is therefore classified as categorical, and a **Data import notes** card appears in the results area listing the affected columns – check the source data if those variables were meant to be numeric.

> **Tip:** if you have a saved DataSuite project file (.json), loading it restores everything – variable types, filters, transformation rules, and settings. Stored variable types are re-validated against the data on load; a stored numeric type that no longer matches its data is reset to categorical, with a **Data import notes** card explaining what changed.

### Spreadsheet import options

When opening an XLSX or ODS file with multiple sheets (or a single sheet with ambiguous headers), an import modal appears with a live preview that updates as you change settings. Single-sheet files with clear headers skip the modal entirely.

**Sheet selection:** each sheet is listed with a checkbox and its dimensions. Select one or more sheets to import.

**Merge strategies** (when multiple sheets are selected):

- **Append rows** – stacks sheets vertically. Columns are matched by header name (case-insensitive, whitespace-normalized). The widest sheet is used as the canonical column set.
- **Join columns** – concatenates sheets side by side. A warning appears if sheets have different row counts, since alignment is positional.

**Column mapping** (shown automatically when appending sheets with mismatched columns): each unmatched column is listed with its source sheet and a dropdown offering three actions:

- **Keep as new column** – includes the column; sheets that don't have it get empty values
- **Exclude** – drops the column entirely
- **Merge with another column** – maps the column's data into an existing column. Targets are grouped into "matched" (columns present in the canonical sheet) and "unmatched" (orphan columns from other sheets).

**Grouping variable:** when appending, a checkbox adds a categorical column whose values identify which sheet each row came from. The column name (default: "Sheet") and per-sheet labels are configurable.

### Header detection

The app detects how many rows are headers by counting consecutive string values from the top of each column (skipping nulls), discarding entirely categorical columns, and taking the max. Multi-row headers are concatenated with " > ". You can override the detected value via a spinner in the import modal.

**Merged cells:** Excel/ODS merged cells are filled automatically – the top-left value is propagated across the merge range. This preserves multi-row grouped headers (e.g. a questionnaire name spanning several subscale columns) without bleeding into adjacent columns.

**Duplicate column names:** when multiple columns share the same header after collapsing, each group is disambiguated with a counter – e.g. "Score (1)", "Score (2)". Columns with unique names are left untouched.

> **Empty row/column cleanup:** leading and trailing empty rows and fully empty columns are removed from imported spreadsheet data automatically. This handles offset tables, stray spacer rows, and dirty trailing columns.

## Previewing your data

Once loaded, your data appears in a paginated table. You can choose to display 10, 25, 50, or 100 rows per page. Missing values are shown as "(missing)" in muted text.

## Choosing variables

Click the **Variables** button in the top bar. It shows a count like "5/12" when some variables are excluded.

The modal has two tabs:

- **Selection** – click or drag to pick which variables participate in analyses. Use the select all, deselect all, and invert selection buttons for quick adjustments.
- **Variable types** – assign each variable a measurement scale: continuous, ordinal, or categorical. Click a cell to change a single variable, or drag across a column to set several at once.

> **Do you need to manage variables?** Most of the time, no. Analysis modules automatically use whichever variables fit – continuous variables for a Pearson's correlation matrix, for example. You only need to deselect variables when they would add noise to a particular analysis (e.g. excluding an ID column from descriptive statistics).

If a variable contains non-numeric data, you won't be able to assign it a numeric type until you [transform](./data-transformation.md) the values first.

> **A numeric type means numeric values.** Whenever a column is typed **continuous** or **ordinal** – on import, on project reload, after a transformation, or when you set it by hand – any values still held as text (`"10"`, `"20"`) are converted to real numbers, so the declared type and the stored data can never disagree. This matters downstream: a numeric column that reaches the statistics engine as text is treated as a set of labels rather than as a measurement. One visible consequence is that numeric-looking identifiers lose their padding – `007` reads back as `7`. Delimited-text and spreadsheet imports have always behaved this way; generated data and R-backed imports now match them. If the padding carries meaning, leave the column **categorical**.

## Filtering cases

Click the **Cases** button to open **Select cases** and restrict which rows feed your analyses; the button shows a count like "101/200" while a filter is active. Add one or more conditions with **+ Add categorical filter** and **+ Add numerical filter**:

- **Categorical filter** — pick which values of a categorical variable to keep, with **Select all**, **Deselect all**, and **Invert selection** shortcuts. A **(missing)** entry appears when the variable has blanks; toggle it to keep or drop missing rows.
- **Numerical filter** — set a condition such as **Greater than** 50 or **Between** 10 and 20. The **Is missing** and **Is not missing** operators match only blank or only non-blank rows.

Choose how conditions combine with the **Match** selector at the top: **all conditions (AND)** (the default — a row must pass every condition) or **any condition (OR)** (a row passes if it meets at least one). You can add several conditions on the same variable — for example `age > 5` and `age ≠ 13`, or two ranges joined with **any**.

Filters are *staged* while the dialog is open and take effect only when you click **Apply filters**; an incomplete condition (no value selected, or a blank number) blocks Apply with a prompt so a filter is never silently dropped. **Cancel** or the **×** discards your edits since opening the dialog, and **Clear all filters** empties the conditions — click **Apply filters** afterwards to commit the cleared state. Filters are saved inside project files, so they persist across sessions, and they apply to the [data frame in the R console](./r-console.md).

> **Missing values, however they're stored.** A blank can be recorded as an empty cell, a null, or `NaN` (the last often from a failed [formula transformation](./data-transformation.md)). The **(missing)** toggle and the **Is missing** / **Is not missing** operators treat all of these alike, so "keep missing" always means every blank row.

> **Need OR across groups, or other complex logic?** Grouped conditions like "(A and B) or C" aren't expressible here. Create an indicator variable with [Data transformation](./data-transformation.md) — for example a formula returning 1/0 — and filter on it.

> **When your data changes:** if a transformation alters a filtered variable, conditions on variables that disappear or switch between numeric and categorical are dropped (with a notice). Newly appearing categories are **excluded** by default and a notice points you back to **Select cases** — unless you had *all* values selected, in which case new categories are kept automatically.

## Running an analysis

Open the **Menu** dropdown in the top bar and choose an analysis module:

- [Distribution analysis](./distribution-analysis.md) – normality tests, histograms, Q-Q plots
- [Descriptive statistics](./descriptive-statistics.md) – means, medians, frequencies, cross-tabulation
- [Comparison analysis](./comparison-analysis.md) – t-tests, ANOVA, Mann-Whitney, and more
- [Correlation analysis](./correlation-analysis.md) – Pearson, Spearman, Kendall, partial correlations
- [Reliability analysis](./reliability-analysis.md) – Cronbach's α, McDonald's ω, item analysis
- [Factor analysis](./factor-analysis.md) – exploratory factor analysis, principal component analysis
- [Confirmatory factor analysis](./confirmatory-factor-analysis.md) – CFA model specification and fit
- [Cluster analysis](./cluster-analysis.md) – k-means, hierarchical, biclustering
- [Regression analysis](./regression-analysis.md) – linear, logistic, ordinal, multinomial, regularized
- [Time to event analysis](./time-to-event-analysis.md) – Kaplan-Meier, Cox, parametric, and competing-risks survival models
- [Time series analysis](./time-series-analysis.md) – exploration, ARIMA / SARIMA, forecasting horse-race, periodograms, and change-points
- [Analysis planner](./analysis-planner.md) – sample size and power calculations

Each module has its own set of options. The general pattern is: select your variables, adjust any settings, and click the calculate button. Results appear in the output section below.

## Reading results

Results stack in the **output section** at the bottom of the page. A floating **table of contents** sidebar appears in the bottom left corner of the screen, letting you jump between results.

Each result card has a small **×** button (visible on hover) to remove it. To remove everything at once, click **Clear all results** (appears only when results exist). This resets the output section, citations, and table of contents back to their initial state. A confirmation prompt appears before clearing.

### Citations

A citations box appears below the results once an analysis has something to cite. It has a colored header reading "If you publish this analysis, please cite these works" and two lists:

- **Methods** – the literature behind the statistical methods that ran: who introduced each method, and whose algorithm the app actually used
- **Software** – the R packages that did the computing, each with the version that actually ran, plus WebR and D3

Every reference is curated by hand rather than generated, so each list appears only when it has something in it – a method nobody has curated references for yet shows nothing at all rather than a misfiled package entry. Libraries with no publication to cite (math.js, Papa Parse, SheetJS and the rest) are credited in the **Support the project** dialog instead. Citations accumulate across the session and are not removed when individual result cards are deleted – they reflect everything actually used. The citation box also appears in the table of contents for quick navigation.

### Exporting results

You can copy-paste tables and text directly from the output section into your document. Note that most word processors and presentation tools will strip some styling (colors, significance highlighting, table borders) during paste – the content and structure are preserved, but visual formatting may need minor touch-up.

For a cleaner export, click **Export to DOCX** at the top right corner of the output section. This downloads a Word document containing all current results, with plots, tables and formatting preserved as closely as possible. You can also use the bulk export controls next to it to export plots as individual files in a ZIP archive.

### Resizing and exporting charts

Every chart in DataSuite works the same way. **To resize**, drag the small handle in the chart's bottom-right corner – make it as large or small as you need. Multi-panel figures (such as the IRT information curves) resize together from a single handle.

**To export a single chart**, hover over it: a small toolbar appears just to its right with three buttons – **SVG**, **PNG**, and **JPG**. Click one to download that chart on its own. On a touch device, where there's no hover, the toolbar is always visible.

> **Which format?** **SVG** is a vector format – it stays sharp at any size and is the best choice for publication or further editing. **PNG** and **JPG** are pixel images, handy for quickly pasting into slides or sharing.

To save *every* plot on the page in one step instead, use the bulk export (ZIP) controls or **Export to DOCX** described above.

## Adjusting settings

Click the **Settings** button (wrench icon) in the top bar to configure:

- **Decimal places** – how many digits to show in output (0–10)
- **Confidence level** – 90%, 95%, 99%, or 99.9%
- **p-value display** – exact values, categories (e.g. "p < 0.05"), or hidden
- **Significance formatting** – bold, colored text, or highlighted background for significant results
- **Table style** – full borders, APA style, borderless, horizontal lines, or minimal
- **Missing data** – pairwise deletion, listwise deletion, or imputation (mean, median, mode, constant)
- **Language** – English, Russian, or Chinese

Changes apply immediately to all existing and future results.

## Saving your work

In the **Data upload & preview** view, use the **Download** card to export your data. The default format is a DataSuite project file (.json), which saves everything: your data, variable types, filters, transformation rules, and settings *(but not results!)*. Load this file later to pick up exactly where you left off.

You can also export in other formats – CSV, Excel, ODS, and more – if you just need the data.

## Next steps

- Learn how to reshape and recode data in [data transformation](./data-transformation.md)
- Score questionnaires step by step in the [questionnaire scoring guide](./questionnaire-scoring-guide.md)
- Explore specific analysis modules from the list above
- Use the [R console](./r-console.md) to run custom R code or inspect what DataSuite does under the hood
- Adjust [settings](./settings.md) to match your reporting style
