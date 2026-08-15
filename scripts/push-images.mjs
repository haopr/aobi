import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const assetsDir = "wiki/.topwrite/assets";
const limit = 15 * 1024 * 1024;
const retries = 6;

function git(args, extra = {}) {
  return execFileSync("git", args, { encoding: "utf8", ...extra });
}

function sleep(seconds) {
  execFileSync("sleep", [String(seconds)]);
}

function aheadCount() {
  try {
    return git(["rev-list", "--count", "origin/main..HEAD"]).trim();
  } catch {
    return "1";
  }
}

function pushWithRetry() {
  if (aheadCount() === "0") {
    console.log("没有待推送的提交。");
    return;
  }

  const args = [
    "-c",
    "http.postBuffer=524288000",
    "-c",
    "http.version=HTTP/1.1",
    "push",
    "origin",
    "main",
  ];

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      console.log(`推送中（第 ${attempt}/${retries} 次）…`);
      execFileSync("git", args, { stdio: "inherit" });
      return;
    } catch {
      if (attempt === retries) {
        throw new Error("多次推送都超时，请检查到 GitHub 的网络后再运行这个脚本。");
      }
      const wait = attempt * 8;
      console.log(`推送失败，${wait} 秒后重试…`);
      sleep(wait);
    }
  }
}

console.log("先推送本地已有、但还没到 GitHub 的提交");
pushWithRetry();

const tracked = new Set(
  git(["ls-files", assetsDir])
    .split("\n")
    .filter(Boolean)
);

const files = fs
  .readdirSync(assetsDir)
  .filter((name) => name !== ".DS_Store")
  .map((name) => path.join(assetsDir, name))
  .filter((file) => fs.statSync(file).isFile() && !tracked.has(file))
  .sort();

if (!files.length) {
  console.log("没有待推送的图片。");
  process.exit(0);
}

const batches = [];
let current = [];
let size = 0;
for (const file of files) {
  const fileSize = fs.statSync(file).size;
  if (current.length && size + fileSize > limit) {
    batches.push(current);
    current = [];
    size = 0;
  }
  current.push(file);
  size += fileSize;
}
if (current.length) {
  batches.push(current);
}

console.log(`将分 ${batches.length} 批推送剩余图片`);

for (let i = 0; i < batches.length; i += 1) {
  const batch = batches[i];
  const index = i + 1;
  console.log(`\n== 批次 ${index}/${batches.length}：${batch.length} 个文件 ==`);
  execFileSync("git", ["add", "--", ...batch], { stdio: "inherit" });
  execFileSync("git", ["commit", "-m", `Add wiki images (${index}/${batches.length})`], {
    stdio: "inherit",
  });
  pushWithRetry();
  sleep(3);
}

console.log("\n图片已全部推送到 GitHub。");
