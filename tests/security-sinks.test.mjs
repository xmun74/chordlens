import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url).pathname;
const sourceRoot = join(root, "src");
const docsRoot = join(root, "docs");
const scannedRoots = [sourceRoot, docsRoot];
const scannedExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".md", ".mdx"]);
const unsafeHtmlSinks = [
  /\binnerHTML\b/,
  /\bouterHTML\b/,
  /\binsertAdjacentHTML\b/,
  /\bdangerouslySetInnerHTML\b/,
  /\bdocument\.write\b/,
];

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return walk(path);
    const ext = path.slice(path.lastIndexOf("."));
    return scannedExtensions.has(ext) ? [path] : [];
  });
}

test("source and docs do not use raw HTML insertion sinks", () => {
  const offenders = [];

  for (const scannedRoot of scannedRoots) {
    for (const file of walk(scannedRoot)) {
      const text = readFileSync(file, "utf8");
      const lines = text.split("\n");
      lines.forEach((line, index) => {
        if (unsafeHtmlSinks.some((pattern) => pattern.test(line))) {
          offenders.push(`${relative(root, file)}:${index + 1}`);
        }
      });
    }
  }

  assert.deepEqual(offenders, []);
});

test("api routes avoid weak upstream URL and path segment handling", () => {
  const apiRoutes = walk(join(sourceRoot, "app", "api"));
  const routeText = apiRoutes.map((file) => readFileSync(file, "utf8")).join("\n");

  assert.doesNotMatch(routeText, /\.startsWith\(["']http["']\)/);
  assert.doesNotMatch(routeText, /\/results\/\$\{id\}/);
});
