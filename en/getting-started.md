---
title: Getting started
description: Learn how to load data, configure variables, and run your first analysis in DataSuite 2 – a free browser-based statistics application.
---

# Getting started

DataSuite 2 is a statistics application that runs entirely in your browser. There is nothing to install – your data never leaves your computer, and all computations happen locally using an embedded R engine.

Whether you need a quick descriptive summary or a full confirmatory factor analysis, the workflow is the same: load your data, pick an analysis, and read the results. This page walks you through the basics.

## How the app loads

DataSuite loads its modules on demand – when you open an analysis for the first time, its code is fetched from the server. A loading indicator shows the progress for each file. If your connection drops or a file fails to download, the app retries automatically (up to three times with increasing delays). If all retries fail, a **Retry** button, marked ↻, appears next to each failed item so you can try again manually once your connection is back, and a **Retry All** button under the *Some modules failed to load* notice reloads the whole module.

> **Working offline:** add `?preload=all` to the address bar (e.g. `https://.../?preload=all`) to download every module at once. After the initial load completes, the app works fully offline. Note that R packages needed by specific analyses are not bundled – if you plan to use an analysis offline, open it at least once while connected, or install the required packages manually via the [R console](./r-console.md) using `ds_library(packageName)`.

## Loading data

Open the **Data upload & preview** view (the default view when you first visit). Click **Choose file** and select your data file – or several, which open in the [import modal](#spreadsheet-import-options) as sheets to append or join. A file among several that cannot be imported – an unsupported format, a project file (which opens on its own), a file that cannot be read – is left out, and the modal's footer names it with the reason.

**Upload data file.** The app reads one table: one row per case – a respondent, a patient, a sample – and one column per variable, with the variable names in the first row. Keep one value to a cell and leave a missing value's cell empty: a code such as 999 or −1 is a number to the app until you [declare it missing](./data-transformation.md#missing-values). Write numbers as plain numbers, with no units, thousands separators or comments typed into the cell – a column holding any text is read as categorical. A spreadsheet's number format (currency, percent, units) is fine, since the cell's value is read rather than its display. Categories may be text (*yes*, *no*) or numeric codes, which you then [set to categorical or recode](#choosing-variables). Keep totals, notes and second tables out of the sheet, since every non-empty row is read as a case. Repeated measurements are best stored side by side, one column per occasion: the modules that want them stacked one row per occasion convert them with the [table converter](./data-transformation.md#table-converter).

Supported formats:

- **delimited text** – CSV, TSV, TXT
- **spreadsheets** – XLS, XLSX, ODS
- **statistical packages** – SPSS (SAV, ZSAV, POR), Stata (DTA), SAS (SAS7BDAT, XPT)
- **JSON** – row-based (every field any record holds becomes a column), column-based, or a DataSuite project file that restores your entire previous session

After import, each variable is automatically classified by its content: continuous when every value in the column is a number, categorical otherwise. All variables are selected for analysis by default.

> **Empty rows and columns:** a row that is blank in every column is dropped on import, whatever the file format, so the case count never includes spacer rows. A column with no values at all is removed too, and a notification names it. Anything sparser is kept and selected like any other column – a mostly-empty column is often the point of the file (a skip-logic branch in a survey, a rarely reported statistic on an extraction sheet), so the app never guesses which columns you meant to use. If such columns get in the way under [listwise deletion](./settings.md#missing-data), the data preview says so.

> **Whitespace-only cells:** cells containing only spaces are kept exactly as imported (no trimming) and count as valid data points – never as numbers or as missing values. A column that looks numeric except for such cells is therefore classified as categorical, and a **Data import notes** card appears in the results area listing the affected columns – check the source data if those variables were meant to be numeric.

> **Yes/no columns:** TRUE/FALSE values – in a CSV, a spreadsheet or as JSON booleans – import as a continuous column of 1 and 0.

> **Decimal commas:** in a semicolon- or tab-separated file, a column of decimal-comma numbers (`172,5`, `1 234,5`) imports as numbers, and the **Data import notes** card names those columns. A column that breaks the pattern anywhere – multiple-response answers such as `1,3` – stays text.

> **Missing-value codes:** a column that is numeric apart from `NA`, `N/A`, `NaN`, `#N/A`, `NULL`, `null` or `.` imports as continuous, with a [Missing values](./data-transformation.md#missing-values) rule declaring those codes; a notification names the codes and columns, and removing the rule brings the text back. A spreadsheet's error cells (`#DIV/0!`, `#N/A`) import as missing values.

> **Identifiers and dates:** a column of zero-padded codes all of one width (`007`, `010`, postal codes) imports as categorical text with its zeros kept, and so do identifiers too long to hold as a number, hexadecimal codes and timestamps. Dates and times – spreadsheet date cells, SPSS, Stata and SAS date variables – import as ISO text (`2024-01-05`, `2024-01-05T10:00:00`, `10:00:00`), which [time series](./time-series-analysis.md) and the [formula's date functions](./formula-reference.md) read as dates.

> **Tip:** if you have a saved DataSuite project file (.json), loading it restores everything – variable types (those you set on recoded and rule-created variables included), filters, transformation rules, and settings. Stored variable types are re-validated against the data on load; a stored numeric type that no longer matches its data is reset to categorical, with a **Data import notes** card explaining what changed. The same card names the variables the rules read that hold no values at all – damage from an earlier version that lost recoded variables' original values on saving – and says how to restore them from the original data file.

### Spreadsheet import options

An import modal with a live preview, which updates as you change settings, opens whenever the file has several sheets or its header is not clear-cut – for a CSV, TSV or TXT file as much as for an XLSX or ODS workbook, since a delimited file is read as a one-sheet workbook. A file loads without the modal only when it has one sheet, exactly one header row is detected without ambiguity, and the first row is not sparse. Otherwise the footer under the preview says why the modal opened, one line per reason:

- the file holds several sheets – choose which to import
- the number of header rows is unclear – check the variable names in the preview
- no header row was detected, so the first row is read as data under generated names (`VAR0001`, `VAR0002` …) – a file with no header and a file whose header is all numbers (years, item numbers) look the same to the detection; if the first row holds the names, set **Header rows** to 1
- more than one header row was detected, and their cells are joined into each variable name
- the first row looks like a title – at most half as many of its cells are filled as in the row below; to read past a title line above a one-row header, set **Header rows** to 2
- the file is not in UTF-8 – check that the preview reads correctly, or choose another **Encoding**

**Sheet selection:** each sheet is listed with a checkbox and its dimensions. Select one or more sheets to import.

**Encoding:** shown when a CSV, TSV or TXT file is not in UTF-8 (a Windows-1251 save from Excel, Shift_JIS, KOI8-R). It is preset from the browser's language, the preview re-reads the file as you change it, and the **Data import notes** card names the encoding used. Files in UTF-8 or UTF-16 with a byte-order mark need no choice.

> **Broken quotes:** a delimited file with a quoted value that is never closed reads the lines after it into a single cell. The **Data import notes** card names the file and the line the quote opens on – fix the quote in the file and import it again.

**Merge strategies** (when multiple sheets are selected):

- **Append rows** – stacks sheets vertically. Columns are matched by header name (case-insensitive, whitespace-normalized). The widest sheet is used as the canonical column set. Two headers of one sheet that differ only in case or spacing (`Score`, `score`) stay two columns, each filled from the column of the same spelling in the other sheets.
- **Join columns** – places sheets side by side. Pick a **Key column for row matching** (**+ Add key** for a composite key) and rows are matched by its values: the **Main sheet** – by default the one with the most rows – sets the row order, rows of the other sheets without a match are appended at the end, and a warning appears if the key is not unique in the main sheet. With no key, rows are matched by position, and a warning appears if the sheets have different row counts.

**Column mapping** (shown automatically when appending sheets with mismatched columns): each unmatched column is listed with its source sheet and a dropdown offering three actions:

- **Keep as new column** – includes the column; sheets that don't have it get empty values
- **Exclude** – drops the column entirely
- merge into an existing column – pick the target column: the list groups them under **Merge with matched column** (columns present in the canonical sheet) and **Merge with unmatched column** (orphan columns from other sheets)

**Grouping variable:** when appending, a checkbox adds a categorical column whose values identify which sheet each row came from. The column name (default: "Sheet") and per-sheet labels are configurable.

### Header detection

The app detects how many rows are headers by counting consecutive string values from the top of each column (skipping nulls) and discarding entirely categorical columns. It then takes the deepest count that at least a quarter of the remaining columns agree on – a real header row is text across many columns at once, so a single column whose first data value happens to be free text ("8 h out of 8" in a column that is otherwise numeric) can't push the whole sheet down by a row. Multi-row headers are concatenated with " > ". You can override the detected value via the **Header rows** spinner in the import modal.

**One header depth for stacked sheets:** sheets you append are one table split into parts, so **Append rows** applies the depth most of them report (ties go to the shallower one) rather than letting each sheet split itself. Setting **Header rows** by hand overrides it for every selected sheet at once – reach for it if a sheet was split at the wrong row.

**Merged cells:** Excel/ODS merged cells are filled automatically – the top-left value is propagated across the merge range. This preserves multi-row grouped headers (e.g. a questionnaire name spanning several subscale columns) without bleeding into adjacent columns.

**Duplicate column names:** when multiple columns share the same header after collapsing, each group is disambiguated with a counter – e.g. "Score (1)", "Score (2)". Columns with unique names are left untouched.

> **Empty row/column cleanup:** leading and trailing empty rows and fully empty columns are removed from imported spreadsheet data automatically. This handles offset tables, stray spacer rows, and dirty trailing columns.

## Previewing your data

Once loaded, your data appears in the **Data preview** card as a paginated table, one column per variable; before any file is loaded the table is empty. Missing values are shown as "(missing)" in muted text. Numbers show four decimals – a nonzero value that would round to 0 shows four significant digits instead (`0.00004`) – and dates show in ISO form. {#data-preview #upload-a-file-to-see-data}

- **Rows per page** – how many rows each page of the table shows: 10 (default), 25, 50, or 100. The arrows under the table step through the pages.

When [listwise deletion](./settings.md#missing-data) is the active missing-data method and it has removed all cases, or left half of them or fewer, a warning appears above the table naming the selected variables with the most missing values – deselect them, or switch back to pairwise deletion.

## Choosing variables

Click the **Variables** button in the top bar. It shows a count like "5/12" when some variables are excluded. {#variables}

The modal has three tabs:

- **Selection** – click or drag to pick which variables participate in analyses. Use the select all, deselect all, and invert selection buttons for quick adjustments.
- **Variable types** – assign each variable a measurement scale: continuous, ordinal, or categorical. Click a cell to change a single variable, or drag across a column to set several at once. A type you set is kept when the transformation rules re-run, as long as the data still fits it – see [managing rules](./data-transformation.md#managing-rules). {#variable-types #type #variable #con #ord #cat}
- **Organize** – rename a variable, drag it by its handle into a new position, or delete it outright. Names must be filled in, and you can't give a variable a name another one already uses. {#organize #name #reorder #delete}

Everything in these tabs is *staged*: your edits live in the dialog until you click **Apply**, and **Cancel** or the **×** discards them. A rename reaches the data table, the variable lists in every analysis module, exported files, and any output card drawn afterwards – cards already on screen keep the names they were drawn with. Reordering sets the column order used by the data table and every export. Deleting removes a column from the dataset for the rest of the session; re-import the file to get it back. All three are saved inside project files, so they persist across sessions.

> **Some variables can't be renamed or deleted here.** A column that a [transformation rule](./data-transformation.md) reads or writes is protected, because editing it would break the rule – the control is disabled and its tooltip names the reason. Change or remove the rule first. Reordering such a column is still allowed.

> **Do you need to manage variables?** Most of the time, no. Analysis modules automatically use whichever variables fit – continuous variables for a Pearson's correlation matrix, for example. You only need to deselect variables when they would add noise to a particular analysis (e.g. excluding an ID column from descriptive statistics).

If a variable contains non-numeric data, you won't be able to assign it a numeric type until you [transform](./data-transformation.md) the values first.

> **A numeric type means numeric values.** Whenever a column is typed **continuous** or **ordinal** – on import, on project reload, after a transformation, or when you set it by hand – any values still held as text (`"10"`, `"20"`) are converted to real numbers, so the declared type and the stored data can never disagree. This matters downstream: a numeric column that reaches the statistics engine as text is treated as a set of labels rather than as a measurement. One visible consequence is that a padded identifier given a numeric type loses its padding – `007` reads back as `7`. Import keeps a column of codes all of one width categorical, zeros and all, but reads codes of mixed widths (`05`, `12`, `7`) as numbers. If the padding carries meaning, leave the column **categorical**.

## Filtering cases

Click the **Cases** button to open **Select cases** and restrict which rows feed your analyses; the button shows a count like "101/200" while a filter is active. Add one or more conditions with **+ Add categorical filter** and **+ Add numerical filter**: {#select-cases}

- **Categorical filter** – pick which values of a categorical variable to keep, listed in the order tables and plots use (numeric codes numerically: 1, 2, … 12), with **Select all**, **Deselect all**, and **Invert selection** shortcuts. A **(missing)** entry appears when the variable has blanks; toggle it to keep or drop missing rows.
- **Numerical filter** – set a condition such as **Greater than** 50 or **Between** 10 and 20. The **Is missing** and **Is not missing** operators match only blank or only non-blank rows.

Choose how conditions combine with the **Match** selector at the top: **all conditions (AND)** (the default – a row must pass every condition) or **any condition (OR)** (a row passes if it meets at least one). You can add several conditions on the same variable – for example `age > 5` and `age ≠ 13`, or two ranges joined with **any**. {#match #all-conditions-and #any-condition-or}

Filters are *staged* while the dialog is open and take effect only when you click **Apply filters**; an incomplete condition (no value selected, or a blank number) blocks Apply with a prompt so a filter is never silently dropped. **Cancel** or the **×** discards your edits since opening the dialog, and **Clear all filters** empties the conditions – click **Apply filters** afterwards to commit the cleared state. Filters are saved inside project files, so they persist across sessions, and they apply to the [data frame in the R console](./r-console.md).

> **Missing values, however they're stored.** A blank can be recorded as an empty cell, a null, or `NaN` (the last often from a failed [formula transformation](./data-transformation.md)). The **(missing)** toggle and the **Is missing** / **Is not missing** operators treat all of these alike, so "keep missing" always means every blank row.

> **Need OR across groups, or other complex logic?** Grouped conditions like "(A and B) or C" aren't expressible here. Create an indicator variable with [Data transformation](./data-transformation.md) – for example a formula returning 1/0 – and filter on it.

> **When your data changes:** if a transformation alters a filtered variable, conditions on variables that disappear or switch between numeric and categorical are dropped (with a notice). Newly appearing categories are **excluded** by default and a notice points you back to **Select cases** – unless you had *all* values selected, in which case new categories are kept automatically.

## Running an analysis

Open the **Menu** dropdown in the top bar and choose an analysis module:

- [Distribution analysis](./distribution-analysis.md) – normality tests, histograms, Q-Q plots
- [Descriptive statistics](./descriptive-statistics.md) – means, medians, frequencies, cross-tabulation
- [Comparison analysis](./comparison-analysis.md) – t-tests, ANOVA, Mann-Whitney, and more
- [Correlation analysis](./correlation-analysis.md) – Pearson, Spearman, Kendall, partial correlations
- [Reliability analysis](./reliability-analysis.md) – Cronbach's α, McDonald's ω, item analysis
- [Reproducibility & agreement](./reproducibility-analysis.md) – ICC, kappa, Krippendorff's α, SEM and SDC, Bland-Altman limits
- [Item response theory](./irt-analysis.md) – Rasch, 2PL/3PL, graded and partial-credit models, DIF, Wright maps
- [Factor analysis](./factor-analysis.md) – exploratory factor analysis, principal component analysis
- [Structural equation modeling](./structural-equation-modeling.md) – confirmatory factor analysis, structural and path models, mediation, measurement invariance
- [Cluster analysis](./cluster-analysis.md) – k-means, hierarchical, biclustering
- [Regression analysis](./regression-analysis.md) – linear, logistic, ordinal, multinomial, regularized
- [Time to event analysis](./time-to-event-analysis.md) – Kaplan-Meier, Cox, parametric, and competing-risks survival models
- [Time series analysis](./time-series-analysis.md) – exploration, ARIMA / SARIMA, forecasting horse-race, periodograms, and change-points
- [Meta-analysis](./meta-analysis.md) – effect-size conversion, fixed- and random-effects pooling, forest and funnel plots, moderators, small-study effects
- [Analysis planner](./analysis-planner.md) – sample size and power calculations

Each module has its own set of options. The general pattern is: select your variables, adjust any settings, and click the calculate button. Results appear in the output section below. A number field holding a value it can't take – outside its range, a decimal where a whole count is asked for, or not a number at all – is outlined in red with a message naming the allowed range. The analysis won't run until it is fixed: clicking the calculate button shows a message naming the field and brings it into view, opening its section if it is collapsed. A field hidden by the current options is not checked.

## Reading results

Results stack in the **output section** at the bottom of the page, one card per run, with a floating table of contents in the bottom left corner to jump between them. What every card shares – the marks it can carry on a number or a changed setting, the citations box, and exporting tables and charts – is on its own page, [Reading results](./reading-results.md).

## Adjusting settings

Click the **Settings** button (wrench icon) in the top bar to configure:

- **Precision mode** – decimal places or significant figures, with the precision set separately for descriptives, statistics and p-values
- **Confidence level** – 90%, 95%, 99%, or 99.9%
- **p-value display format** – exact values, categories (e.g. "p ≤ 0.05"), or hidden
- significance formatting – bold, colored text, or highlighted background for significant p-values
- **Table style** – full borders, APA style, borderless, horizontal lines, or minimal
- **Missing data** – pairwise deletion, listwise deletion, or imputation (mean, median, mode, constant)
- **Language** – English, Russian, or Chinese

Once you click **Save changes**, results already on the page redraw with the new settings. A setting that changes what is computed – the confidence level, a replication count, a seed, the p-value adjustment, the missing-data handling – applies from the next run: a card already on the page keeps what it was computed under, and the [setup card](./reading-results.md#b-setup-changed) before the next result names the change; see [how a save applies](./settings.md#how-a-save-applies).

## Saving your work

In the **Data upload & preview** view, use the **Download** card to export your data. The default format is a DataSuite project file (.json), which saves everything: your data, variable types, filters, transformation rules, and settings *(but not results!)*. Load this file later to pick up exactly where you left off.

You can also export in other formats – CSV, Excel, ODS, and more – if you just need the data:

- **Select desired file format** – the format **Download** writes, the working dataset with its current variable names and transformations. **JSON (project)**, the default, is the whole session as above. The data-only formats are delimited text – **CSV** (comma separated), **CSV-2** (semicolon separated, with decimal commas, for locales where the comma is the decimal mark, saved as `.csv`), **TSV** (tab separated) and **TXT** (comma separated, saved as `.txt`) – spreadsheets – **XLSX**, the older **XLS**, the binary **XLSB**, **ODS** and an **HTML table** – and JSON as an array of row objects or as one array per column. Missing values, and the not-a-number or infinite results of a failed formula, are written as empty cells in every format.

## Next steps

- Learn how to reshape and recode data in [data transformation](./data-transformation.md)
- Score questionnaires step by step in the [questionnaire scoring guide](./questionnaire-scoring-guide.md)
- Explore specific analysis modules from the list above
- Use the [R console](./r-console.md) to run custom R code or inspect what DataSuite does under the hood
- Let an AI agent load data and run analyses on this page through the [agent API](./agent-api.md)
- Adjust [settings](./settings.md) to match your reporting style
