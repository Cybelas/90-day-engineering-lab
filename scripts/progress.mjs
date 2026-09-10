import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const exerciseDir = path.join(root, "exercises");
const args = process.argv.slice(2);

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

const files = fs.existsSync(exerciseDir)
  ? fs.readdirSync(exerciseDir).filter((name) => /^day-\d{3}\.md$/.test(name)).sort()
  : [];

if (files.length !== 90) {
  fail(`expected 90 exercise files, found ${files.length}`);
}

const completeAt = args.indexOf("--complete");
if (completeAt !== -1) {
  const rawDay = args[completeAt + 1];
  const number = Number(rawDay);
  if (!Number.isInteger(number) || number < 1 || number > 90) {
    fail("--complete requires a day from 1 through 90");
  }

  const filename = `day-${String(number).padStart(3, "0")}.md`;
  const target = path.join(exerciseDir, filename);
  let content = fs.readFileSync(target, "utf8");
  if (content.includes("TODO: Add your solution here.")) {
    fail(`${filename} still contains the solution placeholder`);
  }
  if (content.includes("TODO: Add one honest sentence")) {
    fail(`${filename} still contains the reflection placeholder`);
  }
  content = content.replace(/^status: todo$/m, "status: complete");
  fs.writeFileSync(target, content, "utf8");
}

const exercises = files.map((filename) => {
  const content = fs.readFileSync(path.join(exerciseDir, filename), "utf8");
  const day = content.match(/^day: (\d{3})$/m)?.[1];
  const titleValue = content.match(/^title: (.+)$/m)?.[1];
  const trackValue = content.match(/^track: (.+)$/m)?.[1];
  const status = content.match(/^status: (todo|complete)$/m)?.[1];
  if (!day || !titleValue || !trackValue || !status) {
    fail(`${filename} has invalid front matter`);
  }
  let title;
  let track;
  try {
    title = JSON.parse(titleValue);
    track = JSON.parse(trackValue);
  } catch {
    fail(`${filename} has invalid quoted title or track`);
  }
  if (status === "complete" && content.includes("TODO:")) {
    fail(`${filename} is complete but still contains a TODO placeholder`);
  }
  return { filename, day, title, track, status };
});

const completed = exercises.filter((exercise) => exercise.status === "complete").length;
const percent = Math.round((completed / exercises.length) * 100);
const filled = Math.round((completed / exercises.length) * 30);
const bar = `${"█".repeat(filled)}${"░".repeat(30 - filled)}`;
const shouldWrite = args.includes("--write") || completeAt !== -1;

if (shouldWrite) {
  const readmePath = path.join(root, "README.md");
  let readme = fs.readFileSync(readmePath, "utf8");
  const progressBlock = `<!-- progress:start -->
![Progress: ${completed}/90](https://img.shields.io/badge/progress-${completed}%2F90-2563eb)

\`${bar}\` **${percent}%** — ${completed} of 90 exercises complete
<!-- progress:end -->`;
  const replaced = readme.replace(/<!-- progress:start -->[\s\S]*?<!-- progress:end -->/, progressBlock);
  if (replaced === readme && !readme.includes(progressBlock)) {
    fail("README progress markers are missing");
  }
  fs.writeFileSync(readmePath, replaced, "utf8");

  const rows = exercises.map(({ filename, day, title, track, status }) =>
    `| ${day} | [${title}](${filename}) | ${track} | ${status === "complete" ? "✅" : "todo"} |`
  );
  const index = `# Exercise index

Complete the exercises in order or choose the one most relevant to current work.
Run \`npm run progress\` after manual status changes to refresh this table.

| Day | Exercise | Track | Status |
| ---: | --- | --- | :---: |
${rows.join("\n")}
`;
  fs.writeFileSync(path.join(exerciseDir, "README.md"), index, "utf8");
}

console.log(`Progress: ${completed}/90 (${percent}%). Validation passed.`);
