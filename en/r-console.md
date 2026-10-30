---
title: R console
description: Use the built-in R console in DataSuite 2 to run R commands directly in the browser, access your loaded data, and render results alongside your analyses.
---

# R console

DataSuite 2 includes a full R console powered by [WebR](https://docs.r-wasm.org/webr/latest/) – R running entirely in your browser. Click the **R console** button (monitor icon) in the top bar to open it.

## Why use the console?

**Every analysis you run in DataSuite prints its R code to the console.** When you click "Calculate" in any analysis module, the actual R commands appear in the console output – the same code you'd write yourself in RStudio or any other R environment.

This means you can:

- **Learn R by example** – run an analysis through the UI, then read the generated code to understand what happened under the hood
- **Verify the methodology** – see exactly which functions, parameters, and corrections were applied
- **Tweak and rerun** – copy a command from the console output, modify it (different parameters, a different model specification), and run it directly
- **Go beyond the UI** – the built-in modules cover common analyses, but R can do much more. Use the console for anything the modules don't offer.

You don't need to know R to use DataSuite – but if you're curious, the console is always there, showing you what's happening and letting you take the wheel when you want to.

## Running commands

Type R code in the input field and press **Ctrl+Enter** (**Cmd+Enter** on a Mac) to execute, or click the **Run** button. Results appear in the console output area above.

- **Enter** or **Shift+Enter** – insert a newline for multi-line input
- **Up/Down arrows** – on the first line (up) or the last line (down), step through command history (up to 50 commands, persistent across sessions)

```r
mean(c(1, 2, 3, 4, 5))
```

## Slash commands

Type `/` to see a list of special commands. Use **Up/Down** to navigate and **Tab** to autocomplete. A command that fails – `/reset` when the engine cannot start, `/data` when the data cannot be bound – prints *Command failed* with the reason in the console.

### `/data` – load your dataset into R

Makes the currently loaded DataSuite data available as a data frame called `df`. After running this, you can use standard R functions:

```r
/data
summary(df)
head(df)
str(df)
```

The data frame includes all variables currently selected in DataSuite, with any active [filters](./getting-started.md#filtering-cases) and [transformations](./data-transformation.md) applied.

### `/output <expression>` – render results in the output section

Takes an R object's name or any R expression – `/output model`, `/output head(df, 10)`, `/output summary(model)` – and displays the result as a formatted result card alongside your other analysis results. The expression runs once, as the console would run it, and leaves nothing behind in your workspace; a mistake in it prints R's own message, such as *object 'x' not found*.

```r
model <- lm(Score ~ Age + Group, data = df)
/output model
```

**R output: {name}.** The card `/output` draws, headed by the expression as you typed it, under the table-of-contents entry *R: {name}*. Like every card the console sends, it takes its help from this page, whichever analysis is open behind the console.

Different types are rendered differently:

- **Data frames and matrices** – formatted tables, with factor columns shown as their labels and dates and times as dates and times; row names, such as a correlation matrix's variables, lead each row as an unheaded label column, while R's automatic 1, 2, 3 … row names are left out; numbers print at **Precision: statistics & coefficients** and redraw on every settings save, while `TRUE`, `FALSE`, `NaN` and `Inf` print as R prints them
- **Named vectors** – key-value tables
- **Short unnamed vectors** – comma-separated values
- **Long unnamed vectors** (more than 20 elements) – truncated with a count
- **Lists** – rendered recursively, each element in its own subsection headed by its name as written, never translated, or by its position (`[2]`); every element is shown, repeated names included
- **Lists with a `ds_type`** – a card of your own design, see [Output cards built in R](#output-cards-built-in-r)

A data frame, matrix or named vector over 1,000 rows is refused, naming its size: output a part of it (`/output head(x, n)`), or draw it as a [table](#tables) with `max_rows`.

### `/upload` – bring in external files

Opens a file picker to upload a file into R's virtual filesystem (at `/home/web_user/`). You can then read it from R:

```r
/upload
external_data <- read.csv("myfile.csv")
```

### `/download <filename>` – save files from R

Downloads a file from R's virtual filesystem to your computer:

```r
write.csv(results, "output.csv")
/download output.csv
```

If the file isn't found, the console suggests running `list.files()` to see what's available.

### `/clear` – clear console output

Clears the console output area. Does not affect your R session or variables.

### `/reset` – restart R

Reinitializes the R engine from scratch. All variables, loaded packages, and session state are lost. Use this if something goes wrong or you want a clean slate.

### `/clearplots` – clear the plot gallery

Removes all plots from the **Plots** tab (see [plotting](#plotting) below).

### `/outputplot [n]` – send a plot to results

Sends a plot to the output section as a result card. Without an argument, sends the latest plot. With a number (e.g. `/outputplot 3`), sends that specific plot. With `all`, sends every plot in the gallery. A plot sent to results goes into the [Word report](./reading-results.md#exporting-results) as an image.

- **R plot #{n}** – the card of one plot, numbered as in the gallery; its table-of-contents entry reads *R: Plot {n}*, one per plot
- **R Plots** – the card `/outputplot all` sends, the whole gallery in one, under the table-of-contents entry *R: All plots* {#r-plots #r-all-plots}

### `/help` – show available commands

Displays all slash commands and links to R documentation resources:

- [CRAN: An Introduction to R](https://cran.r-project.org/doc/manuals/r-release/R-intro.html)
- [r-project.org documentation](https://www.r-project.org/other-docs.html)
- [rdrr.io](https://rdrr.io/)
- [rdocumentation.org](https://www.rdocumentation.org/)
- [devdocs.io/r](https://devdocs.io/r/)

## Output cards built in R

`/output` draws a list that carries a `ds_type` element as a result card of your own: a title, then paragraphs, notes, lists and tables formatted the way the app's analyses format theirs. The card follows the [settings](./settings.md) like every result card – precision, p-value display, significance marks and language redraw it on every save – and goes into the [Word report](./reading-results.md#exporting-results) with its captions and notes.

```r
/data
fit <- t.test(Score ~ Group, data = df)
res <- data.frame(t = unname(fit$statistic), df = unname(fit$parameter), p = fit$p.value,
	lo = fit$conf.int[1], hi = fit$conf.int[2])
card <- ds_card("Score by group",
	ds_text("Welch's *t*-test, two-sided."),
	ds_table(res,
		caption = "Difference in means",
		formats = list(t = list(type = "statistic", p = "p"), p = "p",
			lo = list(type = "ci", upper = "hi", level = 0.95)),
		notes = "Unequal variances assumed.")
)
/output card
```

**Computed in the R console.** Every card built in R closes on this line, and no node removes it.

### Nodes

Each node has a helper, which checks its arguments and stops with an R error naming the function and the argument:

| Node | Helper | Draws |
|---|---|---|
| `card` | `ds_card(title, ..., toc = NULL)` | the card – its title, then the nodes passed; `toc` is its table-of-contents entry, the title by default. The outermost node only |
| `section` | `ds_section(title, ...)` | a subsection heading over its nodes; a section inside a section draws as a smaller heading and nests no further |
| `text` | `ds_text(text)` | a paragraph |
| `note` | `ds_note(text)` | a small note, a note in the Word report too |
| `callout` | `ds_callout(text, kind = "info")` | a highlighted box, `"info"` or `"warning"` |
| `list` | `ds_list(..., title = NULL)` | a bulleted list of the strings passed, under an optional heading |
| `table` | `ds_table(data, ...)` | a table – see [Tables](#tables) |

A helper returns a plain list – `ds_text("Hi")` is `list(ds_type = "text", text = "Hi")`, and a card's or a section's nodes sit in an unnamed `content` list – so a node can be built by hand too, its fields named as the helper's arguments (a list's strings are its `items`), and `/output` holds it to the same rules. A node other than a card, given to `/output` alone or inside a plain list, draws as itself on an [R output](#b-r-output-name) card.

### Text and markup

Titles, text, notes, captions and list items print as written and are never translated. A fixed set of inline markup styles them:

- `*italic*` and `**bold**` – `*p*`, `*M*`, `*SD*` set in italics
- `` `code` `` – a code run
- `^superscript^` and `~subscript~` – `R^2^`, `H~0~`
- a blank line – a new paragraph; a title stays on one line
- `\` before a marker – the marker as typed, `\*`

A marker opens before a non-space and closes after one, so `a * b * c` and `y ~ x` print as typed, as does a marker left unclosed; the text is never read as HTML. The table of contents shows a title with its markers stripped.

### Tables

`ds_table(data, caption, formats, notes, groups, na, max_rows, triangle, diagonal)` draws a data frame or a matrix. Column and row names show as written – name them in R (`names(x) <- …`, `data.frame(…, check.names = FALSE)`); row names other than R's automatic 1, 2, 3 … lead each row as a label column. Numbers align right and text left.

- `caption` – a line above the table
- `notes` – one note or several, below the table
- `formats` – how a numeric column prints, by the column's name: a type, `formats = list(p = "p")`, or a list of the type and its parameters (below); a column with no format prints numbers at **Precision: statistics & coefficients** and anything else as written
- `groups` – spanning headers over side-by-side columns, `groups = list(control = c("m1", "sd1"), treatment = c("m2", "sd2"))`; a member given a name shows that name as its header under the group, so headers can repeat across groups – `control = c(Mean = "m1", SD = "sd1")`
- `na` – what a missing cell prints, *N/A* by default; set it here, since replacing `NA` in R turns a numeric column to text, which takes no format
- `max_rows` – how many rows to draw (see [the row limit](#b-first-rows-of-total-rows))
- `triangle`, `diagonal` – for a square matrix whose row names are its column names, such as a correlation matrix: `triangle` is `"both"` (the default), `"lower"` or `"upper"`, and `diagonal` is `"show"` (the default), `"hide"` or `"empty"`; a cell left out prints *-*

| Format | Prints | Parameters |
|---|---|---|
| `number` | a number | `digits` – `"statistic"` (the default) follows **Precision: statistics & coefficients**, `"descriptive"` follows **Precision: descriptives & percentages**, a whole number fixes the places |
| `integer` | a whole number | – |
| `percent` | a percentage, from a proportion between 0 and 1 | – |
| `p` | a p-value, as the app prints p-values | – |
| `statistic` | a test statistic, with significance marks | `p` – the column whose p-values set the marks |
| `ci` | the interval, both bounds in the lower bound's column | `upper` – the upper bound's column, which is not drawn; `level` – 0.95 for a 95% interval; `digits` – as for `number`; `header` |

`upper` and `level` are required. A `ci` column is headed by the app's own *{level}% CI* (*95% CI*), translated with the app, unless its format gives a `header`; a name the column is given in `groups` wins over both.

A column named `ds_row` in `data` styles the rows and is not drawn – each row `"heading"` (a bold group heading, its label cell alone), `"indent"` (the label cell indented, as levels under their predictor), `"emphasis"` (a bold row, as a total) or `NA` (a plain row).

**First {rows} of {total} rows.** A table over 1,000 rows is refused, naming its size, unless `max_rows` says what to draw: `max_rows = n` draws the first *n* rows over this note, `max_rows = Inf` draws them all.

A malformed node draws nothing: the console names it by its R path – `card$content[[2]]$formats[["p"]]` – and says what is wrong: an unknown `ds_type`, a field missing, of the wrong type, given twice or not one the node takes, a card below the outermost node, sections nested deeper than one level, a format on a column that is missing or not numeric, a column in two groups, a group whose columns don't sit side by side. The helpers catch most of these earlier, as R errors.

## Plotting

The console modal has two tabs: **Console** and **Plots**. Running an R plot command (e.g. `plot(1:10)`, `hist(df$Score)`) renders the result in the **Plots** tab gallery. Each plot is numbered (#1, #2, …). A notification dot appears on the **Plots** tab when a new plot arrives while you're viewing the console.

Use [`/outputplot`](#outputplot-n-send-a-plot-to-results) to send plots to the main output section, or [`/clearplots`](#clearplots-clear-the-plot-gallery) to clear the gallery.

## R formula notation

Many R functions – including `lm()`, `glm()`, `t.test()`, `aov()`, and plot functions – use a formula to describe relationships between variables. The general form is `response ~ terms`, read as "response is modeled by terms." DataSuite's [regression module](./regression-analysis.md) and [path analysis](./regression-analysis.md#path-analysis-advanced-mode) use the same notation.

### Operators

| Operator | Meaning | Example | Expands to |
|---|---|---|---|
| `~` | "is modeled by" – separates left (response) and right (predictors) sides | `Y ~ X` | Y predicted by X |
| `+` | include a term | `Y ~ A + B` | main effects of A and B |
| `-` | exclude a term | `Y ~ A*B - A:B` | A and B without their interaction |
| `*` | crossing – main effects plus interaction | `Y ~ A * B` | A + B + A:B |
| `:` | interaction only (no main effects) | `Y ~ A + B + A:B` | same as `A * B` |
| `^` | crossing up to a degree | `Y ~ (A + B + C)^2` | all main effects + all two-way interactions |
| `I()` | "as-is" – use arithmetic literally | `Y ~ X + I(X^2)` | linear and quadratic terms |
| `1` | intercept (included by default) | `Y ~ X - 1` | remove the intercept |
| `.` | all other variables in the data frame | `Y ~ .` | Y predicted by every other column |

### Common patterns

**Simple regression** – one predictor:

```r
Y ~ X
```

**Multiple regression** – several predictors:

```r
Y ~ A + B + C
```

**Interaction** – does the effect of A depend on B?

```r
Y ~ A * B          # same as A + B + A:B
```

**Polynomial** – quadratic or cubic terms:

```r
Y ~ X + I(X^2)              # quadratic
Y ~ X + I(X^2) + I(X^3)     # cubic
```

**Full factorial** – all interactions up to a given order:

```r
Y ~ (A + B + C)^2     # all main effects + all two-way interactions
Y ~ A * B * C          # all main effects + all two-way + three-way interaction
```

**No intercept** – force the line through the origin:

```r
Y ~ X - 1
```

**Everything** – predict from all other columns:

```r
Y ~ .
```

> **When to use `I()`:** R formula operators (`+`, `*`, `^`) have special meanings inside formulas. If you need the arithmetic version – for example, X squared – wrap it in `I()` so R treats it as a calculation rather than a formula operator. `Y ~ X^2` means "crossing X with itself" (which is just X), while `Y ~ I(X^2)` means "X squared as a predictor."

## Examples

### Explore your data

```r
/data
summary(df)           # descriptive overview of all variables
table(df$Gender)      # frequency table for a categorical variable
cor(df$Age, df$Score) # quick correlation between two variables
```

### Run a custom model

The built-in regression module covers common cases, but you can fit anything R supports:

```r
/data
model <- lm(Score ~ Age * Group + I(Age^2), data = df)
summary(model)
```

Use `/output model` to render the results as a formatted card alongside your other analyses.

### Tweak a generated analysis

Say you ran a t-test through the UI and the console shows:

```r
t.test(Score ~ Group, data = df, var.equal = FALSE)
```

You can copy that line, modify it, and rerun – for example, switch to a one-sided test:

```r
t.test(Score ~ Group, data = df, var.equal = FALSE, alternative = "greater")
```

### Create a quick plot

```r
/data
hist(df$Score, main = "Score distribution", col = "steelblue")
```

The plot appears in the **Plots** tab. Use `/outputplot` to send it to the output section alongside your other results.

> **Note:** plot rendering in WebR has some limitations compared to desktop R. Basic plots (`hist`, `plot`, `boxplot`, `barplot`) work well.

### Install and use a package

```r
ds_library(psych)
/data
describe(df)
```

Use `ds_library()` instead of `library()` to load packages. It installs the package if needed, retries automatically on network failures, and falls back to alternative repositories if the primary one is unavailable. Every install ends with one line naming the result – `Installed fpc 2.2.15 from r-wasm, with 12 dependencies` – or with an error naming the repositories tried; a fallback repository that cannot be reached is reported once, as `Repository yrosseel unreachable: its package index did not download`, and a package that is already installed is loaded without trying any repository. Most popular packages are available as WebR-compiled versions, but some may not be – see [Things to know](#things-to-know) below.

## Things to know

- **This is WebR, not desktop R.** Most base R and many CRAN packages work, but some packages that rely on system libraries or compiled code may not be available. If a package fails to load, it likely hasn't been compiled for WebR yet. A package that an analysis or a `pkg::` call installs on demand and that fails to install is not tried again in the same session – every later use fails at once with the same error; `ds_library()` tries again, and so does a fresh session after [`/reset`](#reset-restart-r) or a page reload.
- **`help()` and `?` are not available.** Use `example(functionName)` to see usage examples, or consult the documentation links above.
- **Your R session is temporary.** Variables and loaded packages don't persist across page reloads. Use `/download` to save any results you need to keep. (Command history *does* persist – see [running commands](#running-commands).)
- **The console shares the R engine with analyses.** If you run a heavy computation in the console, built-in analyses will wait until it finishes (and vice versa).
- **An agent's R runs here, as yours.** An AI agent connected through the [agent API](./agent-api.md) runs R by typing it into this console: each line it sends shows in the console and its history, and runs in your R session and workspace exactly as a line you typed would.
