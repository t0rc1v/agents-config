#!/usr/bin/env node

const path = require("node:path");
const { install, formatResult } = require("../lib/installer.cjs");

const HELP = `
Usage:
  npx github:t0rc1v/agents-config init [options]
  npx github:t0rc1v/agents-config sync [options]

Commands:
  init    Add the baseline agent configuration to the current project.
  sync    Update managed files while preserving local modifications.

Options:
  --force         Replace locally modified managed files.
  --dry-run       Report changes without writing files.
  --skip-skills   Do not install .agents/skills.
  --config-dir    Override the state directory (default: .agents-config).
  -h, --help      Show this help.

Versioned use:
  npx github:t0rc1v/agents-config#v1.0.0 init
`;

function parse(argv) {
  const [command = "init", ...rest] = argv;
  const options = { force: false, dryRun: false, skipSkills: false, configDir: ".agents-config" };
  if (command === "--help" || command === "-h") return { command: "init", options: { ...options, help: true } };
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === "--force") options.force = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--skip-skills") options.skipSkills = true;
    else if (arg === "--config-dir") {
      options.configDir = rest[index + 1];
      index += 1;
    } else if (arg === "--help" || arg === "-h") options.help = true;
    else throw new Error(`Unknown option: ${arg}`);
  }
  if (!options.configDir || path.isAbsolute(options.configDir) || options.configDir.includes("..")) {
    throw new Error("--config-dir must be a relative directory inside the project.");
  }
  return { command, options };
}

function main() {
  let parsed;
  try {
    parsed = parse(process.argv.slice(2));
    if (parsed.options.help) return process.stdout.write(HELP);
    if (!new Set(["init", "sync"]).has(parsed.command)) throw new Error(`Unknown command: ${parsed.command}`);
    const result = install({
      command: parsed.command,
      cwd: process.cwd(),
      templateRoot: path.resolve(__dirname, "..", "templates"),
      version: require("../package.json").version,
      ...parsed.options,
    });
    process.stdout.write(`${formatResult(result)}\n`);
    if (result.conflicts.length) process.exitCode = 2;
  } catch (error) {
    process.stderr.write(`agents-config: ${error.message}\n`);
    process.exitCode = 1;
  }
}

main();
