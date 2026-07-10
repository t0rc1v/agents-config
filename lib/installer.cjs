const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const STATE_FILE = "manifest.json";

function hash(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function relativeFiles(root, prefix = "") {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.posix.join(prefix, entry.name);
    return entry.isDirectory() ? relativeFiles(path.join(root, entry.name), relative) : [relative];
  });
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw new Error(`Cannot read ${file}: ${error.message}`);
  }
}

function isNextProject(cwd) {
  const pkg = readJson(path.join(cwd, "package.json"));
  return Boolean(pkg && ((pkg.dependencies && pkg.dependencies.next) || (pkg.devDependencies && pkg.devDependencies.next)));
}

function sourceFiles(templateRoot, skipSkills) {
  return relativeFiles(templateRoot).filter((relative) => !(skipSkills && relative.startsWith(".agents/skills/")));
}

function ensureInside(root, relative) {
  const target = path.resolve(root, relative);
  if (!target.startsWith(`${path.resolve(root)}${path.sep}`)) throw new Error(`Unsafe template path: ${relative}`);
  return target;
}

function install({ command, cwd, templateRoot, version, force = false, dryRun = false, skipSkills = false, configDir = ".agents-config" }) {
  const statePath = path.join(cwd, configDir, STATE_FILE);
  const existing = readJson(statePath);
  if (command === "init" && existing && !force) {
    throw new Error(`Configuration already exists at ${path.relative(cwd, statePath)}. Use sync, or pass --force to reinitialize.`);
  }
  if (command === "sync" && !existing) throw new Error(`No managed configuration found. Run init first.`);

  const desired = new Map();
  for (const relative of sourceFiles(templateRoot, skipSkills)) {
    const content = fs.readFileSync(path.join(templateRoot, relative));
    desired.set(relative, { content, hash: hash(content) });
  }

  const prior = (existing && existing.files) || {};
  const actions = [];
  const conflicts = [];
  const nextFiles = { ...prior };
  for (const [relative, file] of desired) {
    const destination = ensureInside(cwd, relative);
    const current = fs.existsSync(destination) ? fs.readFileSync(destination) : null;
    const currentHash = current ? hash(current) : null;
    const previousHash = prior[relative];
    const isUnmanagedExisting = current && !previousHash;
    const isLocallyChanged = current && previousHash && currentHash !== previousHash;
    if ((isUnmanagedExisting || isLocallyChanged) && currentHash !== file.hash && !force) {
      conflicts.push(relative);
      continue;
    }
    if (!current || currentHash !== file.hash) actions.push({ type: "write", relative, content: file.content });
    nextFiles[relative] = file.hash;
  }

  if (command === "sync") {
    for (const [relative, previousHash] of Object.entries(prior)) {
      if (desired.has(relative) || (skipSkills && relative.startsWith(".agents/skills/"))) continue;
      const destination = ensureInside(cwd, relative);
      if (!fs.existsSync(destination)) {
        delete nextFiles[relative];
        continue;
      }
      const unchanged = hash(fs.readFileSync(destination)) === previousHash;
      if (unchanged || force) {
        actions.push({ type: "delete", relative });
        delete nextFiles[relative];
      } else conflicts.push(relative);
    }
  }

  if (!dryRun) {
    for (const action of actions) {
      const destination = ensureInside(cwd, action.relative);
      if (action.type === "write") {
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.writeFileSync(destination, action.content);
      } else fs.unlinkSync(destination);
    }
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.writeFileSync(statePath, `${JSON.stringify({ schemaVersion: 1, version, generatedAt: new Date().toISOString(), files: nextFiles }, null, 2)}\n`);
  }
  return { command, version, actions, conflicts, dryRun, nextProject: isNextProject(cwd), statePath };
}

function formatResult({ command, version, actions, conflicts, dryRun, nextProject, statePath }) {
  const mode = dryRun ? "Would apply" : "Applied";
  const detail = actions.length ? actions.map((action) => `${action.type} ${action.relative}`).join("\n  ") : "no file changes";
  const warning = nextProject ? "" : "\nWarning: package.json does not declare Next.js; install into a Next.js app when ready.";
  const conflictText = conflicts.length ? `\nConflicts preserved (${conflicts.length}):\n  ${conflicts.join("\n  ")}\nResolve them manually or rerun with --force.` : "";
  return `${mode} agents-config v${version} (${command}):\n  ${detail}\nState: ${statePath}${warning}${conflictText}`;
}

module.exports = { hash, install, formatResult, relativeFiles };
