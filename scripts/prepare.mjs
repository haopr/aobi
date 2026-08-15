import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const wikiDir = path.join(root, "wiki");
const assetsLink = path.join(wikiDir, "assets");
const assetsTarget = path.join(wikiDir, ".topwrite", "assets");

if (!fs.existsSync(assetsTarget)) {
  throw new Error("未找到 wiki/.topwrite/assets，无法准备图片资源。");
}

if (fs.existsSync(assetsLink)) {
  const stat = fs.lstatSync(assetsLink);
  if (!stat.isSymbolicLink()) {
    throw new Error("wiki/assets 已存在且不是软链接，请先检查后重试。");
  }
} else {
  fs.symlinkSync(".topwrite/assets", assetsLink, "dir");
  console.log("已创建 wiki/assets -> .topwrite/assets");
}

const stylesDir = path.join(wikiDir, "styles");
fs.mkdirSync(stylesDir, { recursive: true });
console.log("Wiki 资源已就绪。");
