import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exerciseDir = path.join(root, "exercises");

const tasks = [
  ["Foundations", "Reverse words safely", "Write a function that reverses word order while handling repeated whitespace.", "Define the behavior for empty input and Unicode text."],
  ["Foundations", "Build a frequency map", "Count occurrences in a collection and return entries in a deterministic order.", "Compare the memory cost of two approaches."],
  ["Foundations", "Deduplicate without losing order", "Remove duplicate values while preserving the first occurrence of each value.", "Support objects using a caller-provided key function."],
  ["Foundations", "Validate balanced delimiters", "Detect balanced parentheses, brackets, and braces and report the first mismatch.", "Include the failing character position in the result."],
  ["Foundations", "Merge overlapping intervals", "Combine overlapping numeric or timestamp ranges into minimal disjoint ranges.", "Decide whether touching intervals should merge."],
  ["Foundations", "Read nested configuration", "Resolve a dotted path such as database.pool.size without throwing on missing keys.", "Support an explicit fallback value."],
  ["Foundations", "Paginate a collection", "Return a stable page of results plus useful pagination metadata.", "Handle invalid page sizes without surprising callers."],
  ["Foundations", "Retry with backoff", "Implement bounded retry behavior for an unreliable operation.", "Add jitter and explain why it matters."],
  ["Foundations", "Create a TTL cache", "Store values that expire after a configured duration.", "Make time injectable so the cache is easy to test."],
  ["Foundations", "Implement a token-bucket limiter", "Model a small rate limiter and demonstrate accepted and rejected requests.", "Explain one fairness limitation."],
  ["Foundations", "Summarize CSV data", "Parse a small CSV fixture and calculate grouped counts or totals.", "Handle quoted delimiters or document the limitation."],
  ["Foundations", "Parse structured logs", "Turn log lines into structured records and collect malformed lines separately.", "Add a severity filter."],
  ["Foundations", "Return useful validation errors", "Validate a small input object and return all field errors in one pass.", "Design an error shape suitable for an API."],
  ["Foundations", "Apply an immutable update", "Update a nested value without mutating the original structure.", "Demonstrate which references do and do not change."],
  ["Foundations", "Order a dependency graph", "Produce a valid build order or detect a dependency cycle.", "Return the cycle path when one exists."],

  ["Reliability", "Test boundary values", "Choose a small existing function and write tests around its important boundaries.", "Explain why each boundary is risky."],
  ["Reliability", "Turn a bug into a regression test", "Reproduce a realistic bug with a failing test, then implement the smallest fix.", "Record the root cause, not only the symptom."],
  ["Reliability", "Use table-driven tests", "Express several input/output cases in a compact table-driven test.", "Include one intentionally invalid case."],
  ["Reliability", "Test time-dependent behavior", "Test code that depends on the current time without adding real delays.", "Compare fake clocks with dependency injection."],
  ["Reliability", "Test an async failure", "Verify both success and failure paths of an asynchronous operation.", "Ensure the test cannot pass before the operation settles."],
  ["Reliability", "Design an idempotent operation", "Make a repeated command produce the same final state without duplicate effects.", "Show how the idempotency key is stored or checked."],
  ["Reliability", "Make cleanup unavoidable", "Open a resource and guarantee cleanup on success, failure, and cancellation.", "Prove cleanup occurs with a test or trace."],
  ["Reliability", "Classify transient errors", "Separate retryable errors from permanent failures using explicit rules.", "Handle an unknown error conservatively."],
  ["Reliability", "Add a circuit breaker", "Model closed, open, and half-open states around a failing dependency.", "Document the recovery threshold."],
  ["Reliability", "Validate invariants", "Identify and enforce three invariants for a small domain object.", "Prevent invalid state at the narrowest boundary."],
  ["Reliability", "Fuzz a parser", "Generate varied inputs for a parser and assert that it fails safely.", "Save one discovered edge case as a regression test."],
  ["Reliability", "Compare snapshot and semantic tests", "Test the same output once with a snapshot and once with focused assertions.", "Explain which version communicates intent better."],
  ["Reliability", "Detect flaky assumptions", "Create a test that exposes an ordering, timing, locale, or timezone assumption.", "Remove the nondeterminism rather than adding retries."],
  ["Reliability", "Design a health check", "Define shallow and deep health signals for a service with one dependency.", "Explain when the deep check could make an outage worse."],
  ["Reliability", "Write a failure runbook", "Document detection, diagnosis, mitigation, and recovery for one plausible failure.", "Include a rollback trigger."],

  ["Web and Data", "Design a REST resource", "Specify endpoints, request shapes, responses, and errors for a small resource.", "Include conditional or partial updates."],
  ["Web and Data", "Make pagination stable", "Design cursor pagination for records that can be inserted while clients are paging.", "Explain why offset pagination may duplicate results."],
  ["Web and Data", "Normalize API errors", "Map several downstream failures into a consistent public error contract.", "Keep diagnostic detail without leaking internals."],
  ["Web and Data", "Validate a webhook", "Verify a signed webhook payload and reject stale or replayed requests.", "Use constant-time signature comparison."],
  ["Web and Data", "Model optimistic concurrency", "Prevent one client from silently overwriting another client's update.", "Demonstrate the conflict response."],
  ["Web and Data", "Stream a large input", "Process input incrementally instead of loading the entire payload into memory.", "Measure or estimate peak memory usage."],
  ["Web and Data", "Join two datasets", "Combine two small datasets with missing and duplicate keys.", "State the chosen join semantics explicitly."],
  ["Web and Data", "Clean messy records", "Normalize casing, whitespace, missing values, and malformed identifiers.", "Preserve enough information to audit rejected rows."],
  ["Web and Data", "Design an upsert", "Implement or describe an atomic insert-or-update operation.", "Explain how concurrent requests behave."],
  ["Web and Data", "Prevent an N+1 query", "Show an inefficient data access pattern and replace it with bounded queries.", "Compare readability and expected query count."],
  ["Web and Data", "Add cache validation", "Use an entity tag or last-modified value to avoid sending unchanged content.", "Demonstrate the not-modified response."],
  ["Web and Data", "Handle partial failure", "Return or record useful results when one item in a batch fails.", "Decide whether retries operate per item or per batch."],
  ["Web and Data", "Version a contract", "Evolve an API or event schema without breaking an older consumer.", "Include a deprecation path."],
  ["Web and Data", "Protect a search endpoint", "Constrain an endpoint against expensive, malformed, or abusive queries.", "Define both validation and rate limits."],
  ["Web and Data", "Model eventual consistency", "Describe and simulate a write that becomes visible after a delay.", "Give the client a safe read-after-write strategy."],

  ["Systems", "Measure before optimizing", "Benchmark a small operation and capture a reproducible baseline.", "Separate warm-up effects from steady-state results."],
  ["Systems", "Reduce an algorithmic bottleneck", "Replace a quadratic operation with a more scalable approach.", "Show the input size where the difference matters."],
  ["Systems", "Bound concurrent work", "Process a queue with a fixed concurrency limit.", "Preserve results and errors without leaking tasks."],
  ["Systems", "Apply backpressure", "Prevent a fast producer from overwhelming a slow consumer.", "State what happens when the buffer is full."],
  ["Systems", "Cancel cooperative work", "Allow a long-running operation to stop promptly and cleanly.", "Test cancellation during more than one phase."],
  ["Systems", "Avoid a race condition", "Demonstrate a lost update and fix it with an appropriate synchronization strategy.", "Explain the remaining contention cost."],
  ["Systems", "Choose a consistency level", "Pick consistency guarantees for a concrete feature and defend the trade-off.", "Describe user-visible behavior during a partition."],
  ["Systems", "Partition a workload", "Distribute keys across workers with a stable, documented strategy.", "Show the impact of adding one worker."],
  ["Systems", "Design graceful shutdown", "Stop accepting work, finish or abandon in-flight tasks, and release resources.", "Add a maximum shutdown deadline."],
  ["Systems", "Make retries safe", "Combine retries with idempotency, timeouts, and an overall attempt budget.", "Prevent synchronized retry storms."],
  ["Systems", "Threat-model a feature", "List assets, trust boundaries, likely abuse cases, and mitigations for a small feature.", "Prioritize risks by likelihood and impact."],
  ["Systems", "Handle secrets correctly", "Replace hard-coded credentials with a secure configuration boundary.", "Describe rotation and accidental-exposure response."],
  ["Systems", "Prevent injection", "Parameterize an unsafe query or command construction example.", "Add a malicious input test."],
  ["Systems", "Authorize at the resource", "Enforce that a caller may act on one record but not another user's record.", "Distinguish authentication from authorization."],
  ["Systems", "Minimize sensitive logging", "Redact or omit secrets and personal data while preserving useful diagnostics.", "Test nested and partially masked values."],

  ["Delivery", "Write a useful commit", "Take a hypothetical mixed change and split it into reviewable commits with clear messages.", "Explain where you would keep changes together."],
  ["Delivery", "Resolve a merge conflict", "Create a small conflict, resolve it correctly, and record how you verified the result.", "Compare merge and rebase outcomes."],
  ["Delivery", "Build a minimal CI pipeline", "Define formatting, tests, and build checks with fast failure behavior.", "Cache one safe dependency directory."],
  ["Delivery", "Pin a workflow dependency", "Review an automation dependency and choose an appropriate pinning strategy.", "Describe how updates will be discovered."],
  ["Delivery", "Design a rollback", "Write deployment and rollback steps for a small service change.", "Include a backward-compatible data migration."],
  ["Delivery", "Use a feature flag", "Separate deployment from release for a risky behavior change.", "Plan flag ownership and removal."],
  ["Delivery", "Define service indicators", "Choose one availability and one latency indicator for a service.", "Turn them into a measurable objective."],
  ["Delivery", "Write an actionable alert", "Create an alert that describes impact and points to the first diagnostic step.", "Remove one noisy or non-actionable condition."],
  ["Delivery", "Trace a request", "Propagate a correlation identifier across three components.", "Handle calls originating without an identifier."],
  ["Delivery", "Compare logs, metrics, and traces", "Use one incident scenario to show what each signal reveals.", "Identify the cheapest first signal."],
  ["Delivery", "Inspect a container image", "Explain image layers and reduce avoidable size or attack surface.", "Run as a non-root user."],
  ["Delivery", "Set resource limits", "Choose initial CPU and memory requests or limits for a small workload.", "Describe the evidence needed to tune them."],
  ["Delivery", "Plan a zero-downtime migration", "Sequence a schema change so old and new application versions can coexist.", "Include cleanup after full rollout."],
  ["Delivery", "Automate a release note", "Generate a concise release summary from structured change metadata.", "Separate user-facing changes from internal work."],
  ["Delivery", "Review supply-chain risk", "Map dependencies, build inputs, credentials, and artifact publication for a project.", "Add one verification or provenance control."],

  ["Design", "Replace a long conditional", "Refactor branching logic into a clearer structure without changing behavior.", "Explain when the original conditional is preferable."],
  ["Design", "Make dependencies explicit", "Replace hidden global access with an explicit dependency boundary.", "Show how the change improves testing."],
  ["Design", "Separate policy from mechanism", "Extract a business rule from the code that executes it.", "Demonstrate a second policy using the same mechanism."],
  ["Design", "Design a small state machine", "Model legal states and transitions for an order, job, or document.", "Reject or explain illegal transitions."],
  ["Design", "Use composition", "Replace an inheritance-heavy example with small composed behaviors.", "Name one case where inheritance remains useful."],
  ["Design", "Wrap a third-party dependency", "Create an adapter that prevents vendor-specific details from spreading.", "Translate one vendor error into a domain error."],
  ["Design", "Introduce a domain type", "Replace an ambiguous primitive with a type that enforces meaning and validation.", "Prevent two similar values from being mixed accidentally."],
  ["Design", "Record an architecture decision", "Write a short context, decision, consequences, and alternatives record.", "Include what evidence would justify revisiting it."],
  ["Design", "Review an interface", "Reduce an overly broad interface to the capabilities each consumer needs.", "Show the testing benefit."],
  ["Design", "Make illegal states unrepresentable", "Redesign a model so contradictory field combinations cannot be created.", "Explain any serialization trade-off."],
  ["Design", "Estimate a feature", "Break a small feature into risks, dependencies, and independently deliverable slices.", "State confidence rather than false precision."],
  ["Design", "Write a technical proposal", "Propose a small change with context, goals, non-goals, design, risks, and rollout.", "Add one rejected alternative."],
  ["Design", "Review code constructively", "Write five specific review comments for a deliberately flawed example.", "Separate blocking issues from optional suggestions."],
  ["Design", "Explain a system simply", "Describe a familiar system for both a recruiter and an experienced engineer.", "Keep both explanations accurate at different depths."],
  ["Design", "Retrospect and choose what is next", "Review the previous exercises, identify recurring strengths and gaps, and choose a focused next project.", "Turn the next step into a scoped repository plan."]
];

if (tasks.length !== 90) {
  throw new Error(`Expected 90 tasks, found ${tasks.length}`);
}

fs.mkdirSync(exerciseDir, { recursive: true });

const rows = [];
for (const [index, [track, title, challenge, stretch]] of tasks.entries()) {
  const day = String(index + 1).padStart(3, "0");
  const filename = `day-${day}.md`;
  const target = path.join(exerciseDir, filename);
  const content = `---
day: ${day}
title: ${JSON.stringify(title)}
track: ${JSON.stringify(track)}
status: todo
---

# Day ${day}: ${title}

**Track:** ${track}  
**Timebox:** 15–25 minutes

## Challenge

${challenge}

## Definition of done

- [ ] Include a concrete solution, example, command, test, query, or diagram.
- [ ] Cover at least one edge case or trade-off.
- [ ] Keep the result understandable without private context.

## My solution

TODO: Add your solution here.

## What I learned

TODO: Add one honest sentence about a trade-off, mistake, or surprise.

## Stretch

${stretch}
`;

  if (!fs.existsSync(target)) {
    fs.writeFileSync(target, content, "utf8");
  }
  rows.push(`| ${day} | [${title}](${filename}) | ${track} | todo |`);
}

const index = `# Exercise index

Complete the exercises in order or choose the one most relevant to current work.
Run \`node scripts/progress.mjs --write\` after manual status changes to refresh this table.

| Day | Exercise | Track | Status |
| ---: | --- | --- | :---: |
${rows.join("\n")}
`;

const indexPath = path.join(exerciseDir, "README.md");
if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath, index, "utf8");
}

console.log(`Prepared ${tasks.length} exercises.`);
