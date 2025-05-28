import { createInterface } from "readline";
import { readdirSync, mkdirSync, linkSync, existsSync } from "fs";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Constants
const PACKAGE_ROOT = __dirname;
const SOURCE_DIRS = ["src/components", "src/hooks", "src/lib"];

// Prompt helper
function prompt(question: string, defaultValue: string): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${question} [default: ${defaultValue}]: `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

// Recursively hard-link all files from src to dest
function walkAndHardLinkRecursive(
  srcRoot: string,
  targetRoot: string,
  baseSrcDir: string,
) {
  const entries = readdirSync(srcRoot, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const srcPath = join(srcRoot, entry.name);
    const relPath = relative(baseSrcDir, srcPath);
    const destPath = join(targetRoot, relPath);

    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      walkAndHardLinkRecursive(srcPath, targetRoot, baseSrcDir);
    } else if (entry.isFile()) {
      mkdirSync(dirname(destPath), { recursive: true });
      try {
        linkSync(srcPath, destPath);
        console.log(`Hard linked: ${destPath} -> ${srcPath}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.code === "EEXIST") {
          console.warn(`Skipped (already exists): ${destPath}`);
        } else {
          console.error(`Error linking ${srcPath}:`, err);
        }
      }
    }
  }
}

// Main CLI logic
async function main() {
  const componentsJsonTarget = await prompt(
    "Where should components.json go?",
    "./components.json",
  );
  const foldersTarget = await prompt(
    "Where should the folders (components/hooks/lib) go?",
    "./src",
  );

  const componentsJsonSource = join(PACKAGE_ROOT, "components.json");

  if (!existsSync(componentsJsonSource)) {
    console.error("Error: components.json not found in package root.");
    process.exit(1);
  }

  // Link components.json
  mkdirSync(dirname(componentsJsonTarget), { recursive: true });
  try {
    linkSync(componentsJsonSource, componentsJsonTarget);
    console.log(
      `Hard linked: ${componentsJsonTarget} -> ${componentsJsonSource}`,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code === "EEXIST") {
      console.warn(`Skipped (already exists): ${componentsJsonTarget}`);
    } else {
      console.error(`Error linking components.json:`, err);
    }
  }

  // Link folders
  for (const folder of SOURCE_DIRS) {
    const fullSrcPath = join(PACKAGE_ROOT, folder);
    if (!existsSync(fullSrcPath)) {
      console.warn(`Skipping missing folder: ${fullSrcPath}`);
      continue;
    }
    walkAndHardLinkRecursive(
      fullSrcPath,
      foldersTarget,
      join(PACKAGE_ROOT, "src"),
    );
  }

  console.log("✅ Done!");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
