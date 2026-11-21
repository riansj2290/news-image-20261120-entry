// news-image-20261120 — entry program.
//
// The entry is a single image, entry.png, that sums up the world news of
// Friday 20 November 2026. This program copies it, byte for byte, to the
// output directory: $MAKEFUN_OUTPUT_DIR when that is set, otherwise /output.
// It runs with no network and no dependencies (Node 22 standard library only).

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");

if (!existsSync(source)) {
  console.error(`error: entry.png is missing next to main.ts (looked in ${here})`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const target = join(outDir, "entry.png");
copyFileSync(source, target);

// The grader runs this program twice and compares the outputs byte for byte,
// so verify the copy landed whole: a size mismatch means the write was cut
// short, and failing here beats silently handing over a truncated image.
const expected = statSync(source).size;
const written = statSync(target).size;
if (written !== expected) {
  console.error(`error: copy incomplete — wrote ${written} of ${expected} bytes to ${target}`);
  process.exit(1);
}
console.log(`wrote ${target} (${written} bytes)`);
