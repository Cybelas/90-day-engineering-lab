# 90-Day Engineering Lab

A practical learning streak built from small, reviewable engineering exercises.
Each entry combines a working solution with a short note about the trade-offs,
mistakes, or surprises encountered along the way.

<!-- progress:start -->
![Progress: 3/90](https://img.shields.io/badge/progress-3%2F90-2563eb)

`█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░` **3%** — 3 of 90 exercises complete
<!-- progress:end -->

## What this covers

- Core programming and data transformations
- Testing, debugging, and reliability
- APIs, data handling, and integration design
- Performance, security, and system behavior
- Git, CI, observability, and delivery practices
- Refactoring, architecture, and technical communication

Exercises are intentionally language-neutral. Solutions can use the language
or stack most relevant to the learner, but should include something executable
or directly testable whenever possible.

## Daily workflow

```bash
# 1. Edit the next exercise and replace both TODO prompts.
# 2. Mark it complete and refresh the progress display.
node scripts/progress.mjs --complete 1

# 3. Verify the repository.
node scripts/progress.mjs --check

# 4. Commit the result. Include "Closes #123" when using a daily issue.
git add exercises/day-001.md README.md exercises/README.md
git commit -m "learn: complete day 001"
git push
```

The workflow in `.github/workflows/daily-learning.yml` opens one weekday prompt
for the next unfinished exercise. Set the optional repository variable
`LEARNER_LOGIN` to a GitHub username if the issue should be assigned
automatically.

## Quality bar

A completed entry should contain:

- A concrete solution, command, query, test, or design artifact
- Enough context for another developer to understand the choice
- One honest observation about a trade-off, failure, or new insight
- No secrets, proprietary code, or copied solution text

## Repository map

| Path | Purpose |
| --- | --- |
| [`exercises/`](exercises/) | The 90 prompts and completion index |
| [`scripts/progress.mjs`](scripts/progress.mjs) | Validation and progress updater |
| [`.github/workflows/daily-learning.yml`](.github/workflows/daily-learning.yml) | Weekday exercise prompt |
| [`.github/workflows/validate.yml`](.github/workflows/validate.yml) | Pull request and push validation |

## Why small exercises?

Consistency is easier when the next action is obvious. The short timebox keeps
the challenge sustainable, while the written reflection turns isolated snippets
into evidence of engineering judgment.

Released under the [MIT License](LICENSE).
