const fs = require("fs");
const path = require("path");

const IGNORE = ["index.html", "node_modules", ".git", "generate-index.js", "vercel.json", "package.json", "package-lock.json"];

function buildTree(dir, baseDir = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => !IGNORE.includes(e.name) && !e.name.startsWith("."));

  if (entries.length === 0) return "";

  let html = "<ul>";
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      html += `<li class="folder"><span>📁 ${entry.name}</span>${buildTree(fullPath, baseDir)}</li>`;
    } else {
      html += `<li class="file"><a href="/${relPath}">📄 ${entry.name}</a></li>`;
    }
  }
  html += "</ul>";
  return html;
}

const tree = buildTree(".");

const output = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Pagini</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #f5f5f4; padding: 2rem; color: #111; }
    h1 { font-size: 22px; font-weight: 500; margin-bottom: 1.5rem; }
    ul { list-style: none; padding-left: 1.25rem; border-left: 1px solid #ddd; margin-top: 4px; }
    ul > li { padding: 4px 0; font-size: 14px; }
    li.folder > span { font-weight: 500; color: #555; cursor: default; }
    li.file a { color: #1a73e8; text-decoration: none; }
    li.file a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>📂 Pagini</h1>
  ${tree}
</body>
</html>`;

fs.writeFileSync("index.html", output);
console.log("index.html generat.");
