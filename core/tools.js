const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const db = require("./db");

function listFiles(dir = ".") {
  return fs.readdirSync(dir);
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
  return "FILE SAVED";
}

function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: process.cwd() }, (err, stdout, stderr) => {
      if (err) return reject(stderr || err.message);
      resolve(stdout);
    });
  });
}

async function queryDB(sql, params = []) {
  const [rows] = await db.query(sql, params);
  return rows;
}

module.exports = {
  listFiles,
  readFile,
  writeFile,
  runCommand,
  queryDB
};

const fs_tool_layer = require('fs');
const path_tool_layer = require('path');

function dhNormalizeRel(filePath) {
  return String(filePath || '')
    .replaceAll('\\', '/')
    .replace(/^\.\/+/, '')
    .replace(/^\/+/, '')
    .trim();
}

function dhAssertScope(filePath, scope = []) {
  const rel = dhNormalizeRel(filePath);
  const normalizedScope = (scope || []).map(dhNormalizeRel).filter(Boolean);

  if (!rel || rel.includes('..')) {
    throw new Error(`INVALID_FILE_PATH: ${rel}`);
  }

  if (!normalizedScope.length) {
    throw new Error('SCOPE_REQUIRED');
  }

  const ok = normalizedScope.some(item => rel === item || rel.startsWith(item.replace(/\/?$/, '/') ));

  if (!ok) {
    throw new Error(`OUT_OF_SCOPE: ${rel}`);
  }

  return rel;
}

function dhReadFile(filePath) {
  const rel = dhNormalizeRel(filePath);
  const full = path_tool_layer.join(process.cwd(), rel);
  if (!fs_tool_layer.existsSync(full)) return '';
  return fs_tool_layer.readFileSync(full, 'utf8');
}

function dhWriteFile(filePath, content, scope = []) {
  const rel = dhAssertScope(filePath, scope);
  const full = path_tool_layer.join(process.cwd(), rel);
  fs_tool_layer.mkdirSync(path_tool_layer.dirname(full), { recursive: true });

  if (fs_tool_layer.existsSync(full)) {
    fs_tool_layer.copyFileSync(full, `${full}.BACKUP_tools_${Date.now()}`);
  }

  fs_tool_layer.writeFileSync(full, String(content || ''), 'utf8');
  return rel;
}

module.exports.dhReadFile = dhReadFile;
module.exports.dhWriteFile = dhWriteFile;
module.exports.dhAssertScope = dhAssertScope;
