#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const args = process.argv.slice(2);
const isGlobal = args.includes('--global');

const pkgRoot = path.join(__dirname, '..');

let destDir, claudeMdPath;
if (isGlobal) {
  destDir = path.join(os.homedir(), '.claude', '.uplift');
  claudeMdPath = path.join(os.homedir(), '.claude', 'CLAUDE.md');
} else {
  destDir = path.join(process.cwd(), '.uplift');
  claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');
}

const filesToCopy = [
  'CLAUDE.md',
  'skills/uplift-audit/SKILL.md',
  'skills/uplift-fix/SKILL.md',
  'skills/uplift-init/SKILL.md',
  'skills/uplift-scan/SKILL.md',
  'skills/uplift-summary/SKILL.md',
];

for (const file of filesToCopy) {
  const src = path.join(pkgRoot, file);
  const dest = path.join(destDir, file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

const claudeRef = '@.uplift/CLAUDE.md';
if (fs.existsSync(claudeMdPath)) {
  const content = fs.readFileSync(claudeMdPath, 'utf8');
  if (!content.includes(claudeRef)) {
    const sep = content.endsWith('\n') ? '' : '\n';
    fs.appendFileSync(claudeMdPath, `${sep}${claudeRef}\n`);
    console.log(`✓ Added ${claudeRef} to ${claudeMdPath}`);
  } else {
    console.log(`  ${claudeRef} already in ${claudeMdPath}`);
  }
} else {
  fs.writeFileSync(claudeMdPath, `${claudeRef}\n`);
  console.log(`✓ Created ${claudeMdPath} with ${claudeRef}`);
}

console.log(`✓ Uplift installed → ${destDir}`);
console.log('');
console.log('Open a Claude Code session and run /uplift-init to begin.');
