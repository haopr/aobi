import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const siteDir = path.join(root, "site");

fs.mkdirSync(distDir, { recursive: true });
fs.copyFileSync(path.join(siteDir, "index.html"), path.join(distDir, "index.html"));
fs.copyFileSync(path.join(siteDir, "404.html"), path.join(distDir, "404.html"));
fs.writeFileSync(path.join(distDir, ".nojekyll"), "");

const wiki404 = path.join(distDir, "wiki", "404.html");
if (!fs.existsSync(wiki404)) {
  fs.copyFileSync(path.join(siteDir, "404.html"), wiki404);
}

function stripClosingImg(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      stripClosingImg(full);
      continue;
    }
    if (!entry.name.endsWith(".html")) {
      continue;
    }
    const text = fs.readFileSync(full, "utf8");
    const next = text.replace(/<\/img>/g, "");
    if (next !== text) {
      fs.writeFileSync(full, next);
    }
  }
}

stripClosingImg(distDir);
console.log("已写入仓库首页到 dist/");
