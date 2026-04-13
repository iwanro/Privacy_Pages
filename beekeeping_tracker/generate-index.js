const fs = require("fs");
const path = require("path");

const IGNORE = ["index.html", "node_modules", ".git", "generate-index.js", "vercel.json", "package.json", "package-lock.json"];

function buildTree(dir, baseDir = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => !IGNORE.includes(e.name) && !e.name.startsWith("."));

  let html = "<ul>";
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      html += `<li class="folder">📁 ${entry.name}${buildTree(fullPath, baseDir)}</li>`;
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
  <title>Fișierele mele</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #f5f5f4; padding: 2rem; }
    h1 { font-size: 22px; font-weight: 500; margin-bottom: 1.5rem; color: #111; }
    ul { list-style: none; padding-left: 1.25rem; }
    li { padding: 4px 0; font-size: 14px; }
    li.folder { color: #555; font-weight: 500; margin-top: 8px; }
    li.file a { color: #1a73e8; text-decoration: none; }
    li.file a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Fișierele mele</h1>
  ${tree}
</body>
</html>`;

fs.writeFileSync("index.html", output);
console.log("index.html generat cu succes.");
`;

fs.writeFileSync("index.html", output);
console.log("index.html generat.");
