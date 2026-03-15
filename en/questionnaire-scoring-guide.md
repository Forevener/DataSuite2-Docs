---
title: Questionnaire scoring guide
description: Step-by-step examples of scoring psychological questionnaires in DataSuite 2 — from Google Forms text responses to computed scale scores.
---

# Questionnaire scoring guide

This guide walks through three real-world scoring scenarios, from simple to advanced. Each builds on the [data transformation](./data-transformation.md) features, so you may want to read that page first.

The common starting point: you have a spreadsheet (e.g. from Google Forms) where each row is a participant and each column is a questionnaire item. The responses might be text labels ("Strongly agree") or already numeric — either way, you need scale scores for analysis.

## Example 1: PHQ-9 (simple sum)

The [PHQ-9](https://en.wikipedia.org/wiki/PHQ-9) is a 9-item depression screening tool. Each item asks how often a symptom occurred over the past two weeks. There are no reverse-scored items — just recode and sum.

**Response options:** Not at all (0), Several days (1), More than half the days (2), Nearly every day (3). Total score range: 0–27.

### Step 1: recode text to numbers

If your data already has numeric values 0–3, skip this step.

1. Open **Data transformation** and click **+ Value recode**
2. In the input panel, select all 9 PHQ items
3. The editor auto-fills the unique text values. Map them:

| Original value | New value |
|---|---|
| Not at all | 0 |
| Several days | 1 |
| More than half the days | 2 |
| Nearly every day | 3 |

4. Under output options, choose **Replace original values** — the text is no longer needed
5. Name the rule (e.g. "PHQ-9 recode") and click **Save rule**

### Step 2: compute the total score

1. Click **+ Formula**
2. Select the same 9 items as input
3. Enter the formula:

```
sum(v1:v9)
```

4. Under output options, choose **Create new variable** and name it `PHQ9_Total`
5. Save the rule

Done. You now have a `PHQ9_Total` column with scores from 0 to 27.

## Example 2: Rosenberg Self-Esteem Scale (mixed item directions)

The [Rosenberg Self-Esteem Scale](https://en.wikipedia.org/wiki/Rosenberg_self-esteem_scale) has 10 items on a 4-point scale. Items 3, 5, 8, 9, and 10 are negatively worded and need to be reversed before summing.

**Response options:** Strongly agree (3), Agree (2), Disagree (1), Strongly disagree (0). Total score range: 0–30.

### Approach A: reverse at scoring time (recommended)

This approach keeps the original item values intact — no recode step needed. The reversal happens inside the formula itself using the pattern `(max - item)`, where max is 3 for a 0–3 scale:

1. Click **+ Formula**
2. Select all 10 RSE items as input (in order)
3. Enter the formula:

```
v1 + v2 + (3-v3) + v4 + (3-v5) + v6 + v7 + (3-v8) + (3-v9) + (3-v10)
```

4. Create a new variable called `RSE_Total`
5. Save

The reversed items (v3, v5, v8, v9, v10) are flipped inline: a response of 0 becomes 3, 1 becomes 2, and so on. The original data stays unchanged, which makes it easier to verify individual items later.

### Approach B: recode first, then sum

If you prefer to have the reversed values stored explicitly:

1. **+ Value recode** — select only the 5 reversed items (3, 5, 8, 9, 10). Map: 0→3, 1→2, 2→1, 3→0. Choose **Replace original values**.
2. **+ Formula** — select all 10 items. Formula: `sum(v1:v10)`. Create a new variable `RSE_Total`.

Both approaches produce identical results. Approach A is more compact; approach B leaves the reversed values visible in the data table.

## Example 3: TIPI — Ten-Item Personality Inventory (multiple subscales)

The [TIPI](https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/) measures the Big Five personality traits with just 10 items — two per trait, one regular and one reverse-scored. The scale runs from 1 (Disagree strongly) to 7 (Agree strongly), and each subscale is the **average** of its two items.

Here's the structure:

| Trait | Regular item | Reversed item |
|---|---|---|
| Extraversion | 1. Extraverted, enthusiastic | 6. Reserved, quiet |
| Agreeableness | 7. Sympathetic, warm | 2. Critical, quarrelsome |
| Conscientiousness | 3. Dependable, self-disciplined | 8. Disorganized, careless |
| Emotional stability | 9. Calm, emotionally stable | 4. Anxious, easily upset |
| Openness | 5. Open to new experiences, complex | 10. Conventional, uncreative |

### Scoring with a multi-variable formula

This is a perfect use case for the `@` syntax — five subscales computed in a single rule.

1. Click **+ Formula**
2. Select all 10 TIPI items as input, in item order (1–10)
3. Enter the formula:

```
@Extraversion = (v1 + (8-v6)) / 2
@Agreeableness = ((8-v2) + v7) / 2
@Conscientiousness = (v3 + (8-v8)) / 2
@EmotionalStability = ((8-v4) + v9) / 2
@Openness = (v5 + (8-v10)) / 2
```

4. Save the rule (output options are automatic with `@` declarations)

The reversal pattern here is `(8 - item)` because the scale runs 1–7 (so max + 1 = 8). Each subscale score ranges from 1 to 7.

> **Why `(8 - v)` and not `(7 - v)`?** The reversal formula is always `(scaleMax + scaleMin) - value`. For a 1–7 scale that's `(7 + 1) - v = 8 - v`. For a 0–3 scale (like RSE above) it's `(3 + 0) - v = 3 - v`. This preserves the original range.

## General tips

- **Check your scale range.** The reversal formula depends on it: `(max + min) - value`. For 1–5 Likert it's `6 - v`, for 0–4 it's `4 - v`, for 1–7 it's `8 - v`. See the [formula reference](./formula-reference.md) for all available functions and syntax.
- **Keep originals intact when possible.** Using inline reversal (approach A) means you can always go back and inspect individual item responses without confusion about which values were recoded.
- **Name variables clearly.** Use descriptive names like `PHQ9_Total`, `RSE_Total`, `Extraversion` — you'll see these names in all analysis outputs.
- **Rules apply in order.** If you recode text to numbers in rule 1, rule 2's formula will see the numeric values. You can verify intermediate results in the [data preview](./getting-started.md#previewing-your-data) at any point.
- **Save as a project file.** Your transformation rules are saved inside the project file (.json), so you can reopen the project later with all rules intact. You can also store rules in the [rule library](./data-transformation.md#rule-library) for reuse across projects.
