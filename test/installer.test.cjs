const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { spawnSync } = require("node:child_process");
const { install } = require("../lib/installer.cjs");

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agents-config-"));
  const templates = path.join(root, "templates");
  fs.mkdirSync(path.join(templates, ".agents", "skills"), { recursive: true });
  fs.writeFileSync(path.join(templates, "AGENTS.md"), "first\n");
  fs.writeFileSync(path.join(templates, ".agents", "skills", "one.md"), "skill\n");
  const project = path.join(root, "project");
  fs.mkdirSync(project);
  fs.writeFileSync(path.join(project, "package.json"), JSON.stringify({ dependencies: { next: "latest" } }));
  return { root, templates, project };
}

test("init creates a manifest and managed files", () => {
  const { root, templates, project } = fixture();
  try {
    const result = install({ command: "init", cwd: project, templateRoot: templates, version: "1.0.0" });
    assert.equal(result.conflicts.length, 0);
    assert.equal(fs.readFileSync(path.join(project, "AGENTS.md"), "utf8"), "first\n");
    assert.equal(JSON.parse(fs.readFileSync(path.join(project, ".agents-config", "manifest.json"))).version, "1.0.0");
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("sync preserves a local edit and updates unchanged files", () => {
  const { root, templates, project } = fixture();
  try {
    install({ command: "init", cwd: project, templateRoot: templates, version: "1.0.0" });
    fs.writeFileSync(path.join(project, "AGENTS.md"), "local\n");
    fs.writeFileSync(path.join(templates, "AGENTS.md"), "second\n");
    fs.writeFileSync(path.join(templates, ".agents", "skills", "one.md"), "updated skill\n");
    const result = install({ command: "sync", cwd: project, templateRoot: templates, version: "1.1.0" });
    assert.deepEqual(result.conflicts, ["AGENTS.md"]);
    assert.equal(fs.readFileSync(path.join(project, "AGENTS.md"), "utf8"), "local\n");
    assert.equal(fs.readFileSync(path.join(project, ".agents", "skills", "one.md"), "utf8"), "updated skill\n");
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("init does not replace an unmanaged file", () => {
  const { root, templates, project } = fixture();
  try {
    fs.writeFileSync(path.join(project, "AGENTS.md"), "project rules\n");
    const result = install({ command: "init", cwd: project, templateRoot: templates, version: "1.0.0" });
    assert.deepEqual(result.conflicts, ["AGENTS.md"]);
    assert.equal(fs.readFileSync(path.join(project, "AGENTS.md"), "utf8"), "project rules\n");
    const manifest = JSON.parse(fs.readFileSync(path.join(project, ".agents-config", "manifest.json")));
    assert.equal(manifest.files["AGENTS.md"], undefined);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("bundled skills have discoverable metadata", () => {
  const skillsRoot = path.join(__dirname, "..", "templates", ".agents", "skills");
  for (const name of ["nextjs-architecture", "nextjs-quality", "nextjs-security"]) {
    const content = fs.readFileSync(path.join(skillsRoot, name, "SKILL.md"), "utf8");
    assert.match(content, new RegExp(`^---\\nname: ${name}\\ndescription: .+\\n---`, "s"));
  }
});

test("every locked skill is mirrored into the templates", () => {
  const root = path.join(__dirname, "..");
  const lock = JSON.parse(fs.readFileSync(path.join(root, "skills-lock.json"), "utf8"));
  for (const name of Object.keys(lock.skills)) {
    assert.equal(fs.existsSync(path.join(root, "templates", ".agents", "skills", name, "SKILL.md")), true, name);
  }
});

test("CLI exposes help without requiring a project", () => {
  const result = spawnSync(process.execPath, [path.join(__dirname, "..", "bin", "agents-config.cjs"), "--help"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage:/);
});
