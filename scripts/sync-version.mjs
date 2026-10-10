#!/usr/bin/env node
// Reads the version from package.json and writes it to module.json.
// Runs automatically via the npm "version" lifecycle hook — do not call directly.

import { readFileSync, writeFileSync } from "fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const mod = JSON.parse(readFileSync("module.json", "utf8"));

mod.version = pkg.version;
writeFileSync("module.json", JSON.stringify(mod, null, 2) + "\n");

console.log(`module.json synced to ${pkg.version}`);
