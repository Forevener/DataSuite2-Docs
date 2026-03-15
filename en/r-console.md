---
title: R console in DataSuite 2
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
- **Up/Down arrows** — navigate through command history (up to 50 commands are remembered within the session)

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

### `/help` — show available commands

Displays all slash commands and links to R documentation resources:

- [CRAN: An Introduction to R](https://cran.r-project.org/doc/manuals/r-release/R-intro.html)
- [r-project.org documentation](https://www.r-project.org/other-docs.html)
- [rdrr.io](https://rdrr.io/)
- [rdocumentation.org](https://www.rdocumentation.org/)
- [devdocs.io/r](https://devdocs.io/r/)

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
- **Your R session is temporary.** Variables and loaded packages don't persist across page reloads. Use `/download` to save any results you need to keep.
- **The console shares the R engine with analyses.** If you run a heavy computation in the console, built-in analyses will wait until it finishes (and vice versa).
