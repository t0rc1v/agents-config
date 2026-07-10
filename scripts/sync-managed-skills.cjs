#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sourceRoot = path.join(root, ".agents", "skills");
const destinationRoot = path.join(root, "templates", ".agents", "skills");
const lockPath = path.join(root, "skills-lock.json");
const checkOnly = process.argv.includes("--check");

function inside(rootPath, target) {
  const resolvedRoot = path.resolve(rootPath);
  const resolvedTarget = path.resolve(target);
  if (resolvedTarget !== resolvedRoot && !resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new Error(`Unsafe path outside ${resolvedRoot}: ${resolvedTarget}`);
  }
  return resolvedTarget;
}

function contentsMatch(left, right) {
  if (!fs.existsSync(left) || !fs.existsSync(right)) return false;
  const leftFiles = fs.readdirSync(left, { recursive: true }).sort();
  const rightFiles = fs.readdirSync(right, { recursive: true }).sort();
  if (leftFiles.length !== rightFiles.length || leftFiles.some((file, index) => file !== rightFiles[index])) return false;
  return leftFiles.every((file) => {
    const leftPath = path.join(left, file);
    const rightPath = path.join(right, file);
    return fs.statSync(leftPath).isDirectory() || fs.readFileSync(leftPath).equals(fs.readFileSync(rightPath));
  });
}

function main() {
  const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  if (lock.version !== 1 || !lock.skills || typeof lock.skills !== "object") throw new Error("Invalid skills-lock.json");
  const names = Object.keys(lock.skills).sort();
  const stale = [];
  for (const name of names) {
    const source = inside(sourceRoot, path.join(sourceRoot, name));
    const destination = inside(destinationRoot, path.join(destinationRoot, name));
    if (!fs.existsSync(path.join(source, "SKILL.md"))) throw new Error(`Source skill is missing SKILL.md: ${name}`);
    if (checkOnly) {
      if (!contentsMatch(source, destination)) stale.push(name);
      continue;
    }
    const stage = inside(destinationRoot, path.join(destinationRoot, `.${name}.staging`));
    fs.rmSync(stage, { recursive: true, force: true });
    fs.cpSync(source, stage, { recursive: true, force: true });
    fs.rmSync(destination, { recursive: true, force: true });
    fs.renameSync(stage, destination);
    process.stdout.write(`Mirrored ${name}\n`);
  }
  if (stale.length) throw new Error(`Distributed skill snapshots are stale: ${stale.join(", ")}. Run npm run sync:skills.`);
  if (checkOnly) process.stdout.write(`Verified ${names.length} managed skill snapshots.\n`);
}

try {
  main();
} catch (error) {
  process.stderr.write(`sync-managed-skills: ${error.message}\n`);
  process.exitCode = 1;
}
