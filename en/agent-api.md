---
title: Agent API
description: How an AI agent or a browser automation script loads data, runs analyses and reads the results in DataSuite 2 through window.DataSuite.
---

# Agent API

DataSuite 2 has a JavaScript API, `window.DataSuite`, through which an AI agent or a browser automation script does what a user does with clicks: loads a table, picks an analysis and its options, runs it and reads the result cards, and types R into the page's console for what no analysis computes. It drives the page the user is looking at – its cards land in the same output log, under the same settings, and stay there for the user to read, export or save. Every statistic runs in the visitor's browser, on the R engine (compiled to WebAssembly) the app's own buttons use: there is no server endpoint to call, the data never leaves the machine, and the API exists only in a page where the app is open.

An agent's first call is `DataSuite.help()`. It returns a short Markdown guide fitted to the page as it stands – whether a dataset is loaded, the menu path to the file picker in the language the user's screen shows – with links to the docs.

## Quick start

1. Open DataSuite 2 in the browser the agent controls, and read `await DataSuite.help()`.
2. Get the data in – best by the user (see [getting the data in](#getting-the-data-in)) – and check it with `await DataSuite.describeData()`.
3. Find the analysis with `await DataSuite.listAnalyses()`, and what it takes with `await DataSuite.describeAnalysis(name)`.
4. Run it with `await DataSuite.run(name, { variables, config })`, which returns its cards as Markdown.
5. Read the output log again at any time with `await DataSuite.results()`.

```js
await DataSuite.describeData();            // say: score (continuous), group (categorical: A, B)
await DataSuite.describeAnalysis("comparison");
const reply = await DataSuite.run("comparison", {
	variables: ["score", "group"],
	config: { specificTest: "welchTTest" },
});
reply.cards.map((card) => card.markdown);
```

## The calls

Every call returns a promise, and all of them exist as soon as the page has loaded – the API's own code downloads on the first call.

| Call | Returns | Changes the page |
|---|---|---|
| `help()` | the agent's guide, as Markdown | no |
| `describeData()` | the dataset: its name, rows, cases in use, case filters, the selected variables, and per variable its type, its name in R (`rName`), n, missing count and a categorical's levels | no |
| `loadData(source)` | the new dataset as `describeData()` gives it, with its first and last rows as parsed | loads the dataset |
| `listAnalyses()` | every analysis: its `name`, its menu title, a one-line summary and its manual's URL | no |
| `describeAnalysis(name)` | the roles its columns can play and every option it takes | opens its view |
| `run(name, options)` | the cards the run drew, as Markdown, with its citations and warnings | draws the cards |
| `status()` | idle or busy, and a run's progress | no |
| `results(range)` | the output log, every run's cards in page order | no |
| `cancel()` | whether the API's run or console code stopped | stops the run |
| `console(code, options)` | what R printed, its errors and warnings, the cards the code drew and, on request, its value | runs the code in the user's R console |
| `getSettings()` | every app setting, under its key | no |
| `setSettings(values)` | the values it replaced | saves the settings |

## Getting the data in

There are three routes, in order of preference.

### The user opens the file

The user's own data is best opened by the user: **Menu** → **Data upload & preview** → **Choose file**, then the import dialog if one opens. `help()` gives the agent this request in the language of the user's screen, to relay. The file never passes through the agent, and the user answers the import's questions – which sheet, how many header rows – with the file in front of them. `describeData()` then confirms what arrived.

### Browser automation sets the file input

An agent whose automation can set a file input sets the file on `input#fileInput`, the hidden input behind **Choose file**, and the import runs exactly as the user's pick does. When the import needs an answer – which sheet of a workbook, how many header rows, which text encoding – the [import dialog](./getting-started.md#spreadsheet-import-options) opens and waits for its **Import** button.

### `loadData` for small tables and public files

`loadData` is the last resort, since a table the agent types costs a token per value and can silently alter one. It takes one of two sources:

- `text` – the table itself, as csv (the default), tsv, txt or json, up to 100,000 characters
- `url` – a public file over http or https, up to 25 MB, in any format the app imports (csv, tsv, txt, json, xlsx, xls, ods, sav, zsav, por, dta, sas7bdat, xpt), its format read from the path – `format` overrides it, and `name` supplies it where the path names none

Beside the source it takes `name` (the dataset's name – an extension the app imports, as in `survey.tsv`, states the format, and one that contradicts `format` or, without it, the url's extension is refused; any other extension stays part of the name), `format`, `sheet` (a workbook's sheet, by name or 0-based index), `headerRows` (0 to 10) and `encoding` (for a fetched csv, tsv or txt file that is not UTF-8). The table goes through the user's own import – the same parsers, type detection and import dialog – and a question the dialog asks that these arguments do not answer is refused, naming the choices. The page fetches a url itself, so the host must allow another site to read the file (CORS): GitHub raw files and most open-data portals do. A DataSuite project file is refused, since opening one replaces the whole session; the user opens it with **Choose file**.

The reply is what `describeData()` returns, with the first and last five rows as parsed – to check against the table that was meant – the import dialog's account of the import (`importNote`), and any notification the app showed while importing (`appSaid`).

## Describing and running an analysis

`listAnalyses()` reads the list without loading anything. Beside the statistical analyses it holds the [analysis planner](./analysis-planner.md)'s calculators, which read no dataset, and three entries of [data transformation](./data-transformation.md): one adds a transformation rule to the dataset, so the column it writes is there for every later run, one lists the rules and one removes a rule.

`describeAnalysis(name)` opens the analysis's view and returns, beside its `listAnalyses()` row:

- `variables` – what the flat `variables` list of a run is and how its columns are routed to the roles
- `roles` – the roles a column can play (a dependent variable, a grouping variable, predictors), each with its config key, whether it takes several columns, what it becomes when the config leaves it unset – drawn from `variables`, a default, or required – and the runs it applies to
- `columns` – the config paths that take a column's display name, `*` standing for any key or index; a path ending in `<key>` is an object whose keys are columns, written by display name too
- `options` – every option: its `type`, its `domain` or a number's bounds (or `shape`, a value's form in words), `off` (its value where it does not apply), `value` (the view's now), whether it `applies` under the view's configuration, and its widget's `label`; a list of entries gives its `element`, the options one entry takes, even while the list is empty; a dotted key is written nested in the config
- `readsData` – false for an entry that reads only its config, such as the planner's

`run(name, options)` runs the analysis as a press of its Run button does: under the loading overlay, which blocks the page and whose **Cancel** stops the run, its cards appended to the output log. One run goes at a time. The options are:

- `variables` – the columns to analyse, by display name; none runs on the current selection, and a list that differs from it replaces the selection the user sees
- `config` – options and roles as `describeAnalysis` lists them, columns by display name; an option left out keeps the value the view holds
- `raw` – true adds the run's own result object, columns by display name, a list of more than 100 values summarised by its length

The reply holds `cards`, each with its `index` (its place in the output log), `title` and `markdown`; `citations`, the references the run cited, sorted as the citation box sorts them into `methods`, `software` and `background`; `warnings`, what the run would have shown the user as notifications; and, for a batch with members that failed, `failures`. In the Markdown, a table cell whose content stacks on several lines in the page – a statistic over its p and effect size – reads as those lines joined by ` · `.

## The reply budget

A reply carries up to 20,000 characters of cards. Past that, the first card comes whole and the rest by title and size, and `more` names the exact `results({ from, count })` call that reads them.

`results({ from, count })` reads the output log in page order – the cards of every run, the user's included, each with the [setup card](./reading-results.md#setup-cards) recording the configuration it ran under – within the same budget: entries come whole up to it (the first card always), the rest by title and size, with `more` naming the next call. `from` is a card's index (0 by default), `count` how many (by default, to the end), and `total` in the reply is the log's card count.

## Slow first runs

The first run of an analysis installs its R packages into the browser, which can take a minute or more; later runs of it start at once. A call that times out on the agent's side does not stop the run. `status()` answers `busy` with the analysis, the seconds it has run, the overlay's message and progress, and `cards`, the count of cards in the log: read that count before the run, wait for `status()` to answer `idle`, and `results({ from: count })` returns what the run drew.

`cancel()` stops a run the API started – an analysis or [console](#the-r-console) code – as the overlay's **Cancel** does, and waits up to ten seconds for it to unwind; `stopped: false` means it had not, since compiled R code that never checks for an interrupt runs to its end. A run the user started is the user's to cancel.

## The R console

`console(code, { value })` is for what no analysis computes. It types the code into the page's [R console](./r-console.md) and runs it as the user's own – in their R session and global environment, under the loading overlay, kept in the console and its history for the user to read – so scratch work belongs in `local({ ... })`, not beside the user's objects. The code is R, several lines sent as one submission as a paste is, or a [slash command](./r-console.md#slash-commands): `/data` binds the cases in use as `df`, its columns named by each variable's `rName` in `describeData()` (`df$v_3_`), and `/output <expression>` draws a result card. Code that leaves a bracket or a string open is not sent at all, and a console still running a line the user typed refuses the call.

The reply gives `printed`, the console's text with variables by display name (its last 20,000 characters, `truncated` giving the whole length when it ran longer), `errors` and `warnings` apart, in R's own names, and the cards the code drew, as `run` returns them. `value: true` adds the last expression's value as data – a vector, list or data frame – or, when it cannot (a model fit, a value past the reply budget, code that failed), `valueError` saying what to return instead (`coef(fit)`, not `fit`). An error from code that used `df` before `/data`, or a display name where R knows the `rName`, comes with a `hint`.

## Settings

`getSettings()` returns every setting the [Settings](./settings.md) dialog saves, under its key. `setSettings({ key: value })` applies them as the dialog's **Save changes** does – the data re-prepared when the missing-data method changes, every result card redrawn – and stores them in this browser, where they outlast the page and apply to the user's later sessions, so an agent changes a setting only when the user wants it changed. There are no per-run settings. A wrong key or a value the dialog would refuse rejects the whole call, every problem listed and nothing changed; the reply is the values the call replaced, so they can be put back.

## Refusals

Nothing an agent passes is silently ignored. An unknown analysis, argument, option, setting or variable, or a value off its domain, rejects with an Error naming the nearest match and what is accepted – `unknown analysis "comparsion" – did you mean "comparison"?` – and an option that does not apply under the run's configuration is named in `warnings`. A role the analysis requires and the config leaves unset – a time-to-event run's time and event, say – is refused by name, never filled from some other column, and a setting written into `config` is refused with a pointer to `setSettings`.

The page is shared with the user, so the calls that change it – `loadData`, `describeAnalysis`, `run`, `console` and `setSettings` – are refused while a run is in flight, the API's or the user's. `setSettings` is also refused while the Settings dialog is open, since saving the dialog would revert the change.

## WebMCP

In a browser that offers [WebMCP](https://webmachinelearning.github.io/webmcp/), the page also registers the calls as tools, which an agent connected to the browser calls without running JavaScript in the page: `get_help`, `load_data`, `describe_data`, `list_analyses`, `describe_analysis`, `run_analysis`, `get_status`, `get_results`, `cancel_run`, `r_console`, `get_settings` and `set_settings`, each taking the arguments and returning the reply of the call it is named for. A refusal comes back as `{ error }` rather than as a failed call, since the browser hides a failed tool's reason.

WebMCP is off by default, and the user turns it on under [Settings › AI agents](./settings.md#b-accept-commands-from-ai-agents-webmcp). While it is off, every tool answers `{ error }` saying so – `set_settings` included, so an agent can turn WebMCP off but never on. The **WebMCP** button in the top bar shows the state – filled green while on, dimmed where the browser offers no WebMCP – and opens a panel telling the user what a connected agent can do. An agent that runs JavaScript in the page, as browser automation does, calls `window.DataSuite` directly and needs none of this.
