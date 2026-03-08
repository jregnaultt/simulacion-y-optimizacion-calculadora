const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "src");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith(".tsx") && !filePath.endsWith(".ts")) return;

  let content = fs.readFileSync(filePath, "utf8");
  let original = content;

  // Replace colors to make them more elegant/slate-based.
  // Dark mode text: purple-400 -> slate-300
  // Light mode text: purple-600 -> slate-800
  // Light mode bg: purple-50 -> slate-100
  // Light mode border: purple-100 -> slate-200
  // Backgrounds with opacity: purple-500/10 -> slate-500/10
  // Active/Focus states: purple-500 -> slate-400

  // Text colors
  content = content.replace(/text-purple-600/g, "text-slate-800");
  content = content.replace(/text-purple-700/g, "text-slate-800");
  content = content.replace(/text-purple-800/g, "text-slate-900");
  content = content.replace(/text-purple-500/g, "text-slate-700");
  content = content.replace(/text-purple-400/g, "text-slate-300");
  content = content.replace(/text-purple-300/g, "text-slate-400");

  // Backgrounds
  content = content.replace(/bg-purple-50/g, "bg-slate-100");
  content = content.replace(/bg-purple-100/g, "bg-slate-200");
  content = content.replace(/bg-purple-500\/10/g, "bg-slate-500/10");
  content = content.replace(/bg-purple-500\/20/g, "bg-slate-500/20");
  content = content.replace(/bg-purple-600/g, "bg-slate-800");
  content = content.replace(/bg-purple-900\/20/g, "bg-slate-800/20");
  content = content.replace(/bg-purple-900\/15/g, "bg-slate-800/15");
  content = content.replace(/bg-purple-900\/30/g, "bg-slate-800/30");

  // Borders
  content = content.replace(/border-purple-100/g, "border-slate-200");
  content = content.replace(/border-purple-500\/20/g, "border-slate-500/20");
  content = content.replace(/border-purple-800\/50/g, "border-slate-700/50");
  content = content.replace(/border-purple-800\/40/g, "border-slate-700/40");
  content = content.replace(/border-purple-900\/30/g, "border-slate-800/30");

  // Focus/Ring
  content = content.replace(/ring-purple-500\/40/g, "ring-slate-400/40");
  content = content.replace(/ring-purple-500\/20/g, "ring-slate-400/20");
  content = content.replace(/ring-purple-500\/10/g, "ring-slate-400/10");
  content = content.replace(/ring-purple-500/g, "ring-slate-400");
  content = content.replace(
    /focus:border-purple-500\/70/g,
    "focus:border-slate-500/70",
  );
  content = content.replace(
    /focus:border-purple-500/g,
    "focus:border-slate-500",
  );

  // Any remaining "purple-" that didn't match the specific rules
  content = content.replace(/purple-/g, "slate-");

  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${filePath}`);
  }
}

walkDir(srcDir, processFile);
console.log("Color updates complete.");
