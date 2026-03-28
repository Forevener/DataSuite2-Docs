---
title: R console
description: Use the built-in R console in DataSuite 2 to run R commands directly in the browser, access your loaded data, and render results alongside your analyses.
---

# R console

DataSuite 2 includes a full R console powered by [WebR](https://docs.r-wasm.org/webr/latest/) — R running entirely in your browser. Click the **R console** button (monitor icon) in the top bar to open it.

## Why use the console?

**Every analysis you run in DataSuite prints its R code to the console.** When you click "Calculate" in any analysis module, the actual R commands appear in the console output — the same code you'd write yourself in RStudio or any other R environment.

This means you can:

- **Learn R by example** — run an analysis through the UI, then read the generated code to understand what happened under the hood
- **Verify the methodology** — see exactly which functions, parameters, and corrections were applied
- **Tweak and rerun** — copy a command from the console output, modify it (different parameters, a different model specification), and run it directly
- **Go beyond the UI** — the built-in modules cover common analyses, but R can do much more. Use the console for anything the modules don't offer.

You don't need to know R to use DataSuite — but if you're curious, the console is always there, showing you what's happening and letting you take the wheel when you want to.

## Running commands

Type R code in the input field and press **Enter** to execute (or click the **Run** button). Results appear in the console output area above.

- **Shift+Enter** — insert a newline for multi-line input
- **Up/Down arrows** — navigate through command history (up to 50 commands, persistent across sessions)

```r
mean(c(1, 2, 3, 4, 5))
```

## Slash commands

Type `/` to see a list of special commands. Use **Up/Down** to navigate and **Tab** to autocomplete.

### `/data` — load your dataset into R

Makes the currently loaded DataSuite data available as a data frame called `df`. After running this, you can use standard R functions:

```r
/data
summary(df)
head(df)
str(df)
```

The data frame includes all variables currently selected in DataSuite, with any active [filters](./getting-started.md#filtering-cases) and [transformations](./data-transformation.md) applied.

### `/output <variable>` — render results in the output section

Takes an R variable and displays it as a formatted result card alongside your other analysis results.

```r
model <- lm(Score ~ Age + Group, data = df)
/output model
```

Different types are rendered differently:

- **Data frames and matrices** — formatted tables
- **Named vectors** — key-value tables
- **Short unnamed vectors** — comma-separated values
- **Long vectors** (20+ elements) — truncated with a count
- **Lists** — rendered recursively, with each named element in its own subsection

### `/upload` — bring in external files

Opens a file picker to upload a file into R's virtual filesystem (at `/home/web_user/`). You can then read it from R:

```r
/upload
external_data <- read.csv("myfile.csv")
```

### `/download <filename>` — save files from R

Downloads a file from R's virtual filesystem to your computer:

```r
write.csv(results, "output.csv")
/download output.csv
```

If the file isn't found, the console suggests running `list.files()` to see what's available.

### `/clear` — clear console output

Clears the console output area. Does not affect your R session or variables.

### `/reset` — restart R

Reinitializes the R engine from scratch. All variables, loaded packages, and session state are lost. Use this if something goes wrong or you want a clean slate.

### `/clearplots` — clear the plot gallery

Removes all plots from the **Plots** tab (see [plotting](#plotting) below).

### `/outputplot [n]` — send a plot to results

Sends a plot to the output section as a result card. Without an argument, sends the latest plot. With a number (e.g. `/outputplot 3`), sends that specific plot. With `all`, sends every plot in the gallery.

### `/help` — show available commands

Displays all slash commands and links to R documentation resources:

- [CRAN: An Introduction to R](https://cran.r-project.org/doc/manuals/r-release/R-intro.html)
- [r-project.org documentation](https://www.r-project.org/other-docs.html)
- [rdrr.io](https://rdrr.io/)
- [rdocumentation.org](https://www.rdocumentation.org/)
- [devdocs.io/r](https://devdocs.io/r/)

## Plotting

The console modal has two tabs: **Console** and **Plots**. Running an R plot command (e.g. `plot(1:10)`, `hist(df$Score)`) renders the result in the **Plots** tab gallery. Each plot is numbered (#1, #2, …). A notification dot appears on the **Plots** tab when a new plot arrives while you're viewing the console.

Use [`/outputplot`](#outputplot-n--send-a-plot-to-results) to send plots to the main output section, or [`/clearplots`](#clearplots--clear-the-plot-gallery) to clear the gallery.

## R formula notation

Many R functions — including `lm()`, `glm()`, `t.test()`, `aov()`, and plot functions — use a formula to describe relationships between variables. The general form is `response ~ terms`, read as "response is modeled by terms." DataSuite's [regression module](./regression-analysis.md) and [path analysis](./regression-analysis.md#path-analysis-advanced-mode) use the same notation.

### Operators

| Operator | Meaning | Example | Expands to |
|---|---|---|---|
| `~` | "is modeled by" — separates left (response) and right (predictors) sides | `Y ~ X` | Y predicted by X |
| `+` | include a term | `Y ~ A + B` | main effects of A and B |
| `-` | exclude a term | `Y ~ A*B - A:B` | A and B without their interaction |
| `*` | crossing — main effects plus interaction | `Y ~ A * B` | A + B + A:B |
| `:` | interaction only (no main effects) | `Y ~ A + B + A:B` | same as `A * B` |
| `^` | crossing up to a degree | `Y ~ (A + B + C)^2` | all main effects + all two-way interactions |
| `I()` | "as-is" — use arithmetic literally | `Y ~ X + I(X^2)` | linear and quadratic terms |
| `1` | intercept (included by default) | `Y ~ X - 1` | remove the intercept |
| `.` | all other variables in the data frame | `Y ~ .` | Y predicted by every other column |

### Common patterns

**Simple regression** — one predictor:

```r
Y ~ X
```

**Multiple regression** — several predictors:

```r
Y ~ A + B + C
```

**Interaction** — does the effect of A depend on B?

```r
Y ~ A * B          # same as A + B + A:B
```

**Polynomial** — quadratic or cubic terms:

```r
Y ~ X + I(X^2)              # quadratic
Y ~ X + I(X^2) + I(X^3)     # cubic
```

**Full factorial** — all interactions up to a given order:

```r
Y ~ (A + B + C)^2     # all main effects + all two-way interactions
Y ~ A * B * C          # all main effects + all two-way + three-way interaction
```

**No intercept** — force the line through the origin:

```r
Y ~ X - 1
```

**Everything** — predict from all other columns:

```r
Y ~ .
```

> **When to use `I()`:** R formula operators (`+`, `*`, `^`) have special meanings inside formulas. If you need the arithmetic version — for example, X squared — wrap it in `I()` so R treats it as a calculation rather than a formula operator. `Y ~ X^2` means "crossing X with itself" (which is just X), while `Y ~ I(X^2)` means "X squared as a predictor."

## Examples

### Explore your data

```r
/data
summary(df)          # descriptive overview of all variables
table(df$Gender)     # frequency table for a categorical variable
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

You can copy that line, modify it, and rerun — for example, switch to a one-sided test:

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

Use `ds_library()` instead of `library()` to load packages. It installs the package if needed, retries automatically on network failures, and falls back to alternative repositories if the primary one is unavailable. Most popular packages are available as WebR-compiled versions, but some may not be — see [Things to know](#things-to-know) below.

## Things to know

- **This is WebR, not desktop R.** Most base R and many CRAN packages work, but some packages that rely on system libraries or compiled code may not be available. If a package fails to load, it likely hasn't been compiled for WebR yet.
- **`help()` and `?` are not available.** Use `example(functionName)` to see usage examples, or consult the documentation links above.
- **Your R session is temporary.** Variables and loaded packages don't persist across page reloads. Use `/download` to save any results you need to keep. (Command history *does* persist — see [running commands](#running-commands).)
- **The console shares the R engine with analyses.** If you run a heavy computation in the console, built-in analyses will wait until it finishes (and vice versa).
