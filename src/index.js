#!/usr/bin/env node
// Technika11y — Menu Accessibility Engine CLI. lint a menu, or render it to accessible HTML.
import { readFileSync } from "node:fs";
import { lintMenu, hasErrors } from "./lint.js";
import { renderMenu } from "./render.js";

function parseArgs(argv) {
  const args = { command: null, file: null };
  for (const x of argv) {
    if (!args.command && (x === "lint" || x === "render")) args.command = x;
    else if (!x.startsWith("-")) args.file = x;
  }
  return args;
}

function main() {
  const { command, file } = parseArgs(process.argv.slice(2));
  if (!command || !file) {
    console.error("usage: menu-a11y-engine <lint|render> <menu.json>");
    return 2;
  }

  const menu = JSON.parse(readFileSync(file, "utf8"));
  const findings = lintMenu(menu);
  for (const f of findings) {
    console.error(`${f.severity.toUpperCase().padEnd(5)} ${f.rule}  ${f.path}  ${f.message}`);
  }

  if (command === "lint") return hasErrors(findings) ? 1 : 0;

  // render fails CLOSED: never emit a menu that hides allergen data behind an error.
  if (hasErrors(findings)) {
    console.error("refusing to render: menu has errors (fail closed — allergen & a11y safety)");
    return 1;
  }
  process.stdout.write(renderMenu(menu));
  return 0;
}

process.exit(main());
