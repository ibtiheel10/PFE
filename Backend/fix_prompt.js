const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src', 'ai', 'ai.service.ts');

let content = fs.readFileSync(filePath, 'utf8');

// Show context around the problem area
const idx = content.indexOf("pour ce poste");
if (idx < 0) {
  console.log('ERROR: pattern not found');
  process.exit(1);
}
console.log('Context:', JSON.stringify(content.slice(idx, idx + 80)));

// Fix: remove the extra + sign
const badPattern = "pour ce poste:\\n' + +\r\n      jobDescription";
const goodPattern = "pour ce poste:\\n' +\r\n      jobDescription";
if (content.includes(badPattern)) {
  content = content.replace(badPattern, goodPattern);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('FIXED!');
} else {
  // Try without \r
  const badPattern2 = "pour ce poste:\\n' + +\n      jobDescription";
  if (content.includes(badPattern2)) {
    content = content.replace(badPattern2, "pour ce poste:\\n' +\n      jobDescription");
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('FIXED (LF only)!');
  } else {
    console.log('Pattern not found. Content snippet:', JSON.stringify(content.slice(idx, idx + 100)));
  }
}
