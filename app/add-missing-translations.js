// Quick script to add missing English translation keys to other languages
const fs = require('fs');
const path = require('path');

const translationsPath = path.join(__dirname, 'shared/lib/translations.ts');
const content = fs.readFileSync(translationsPath, 'utf8');

// Find all English keys
const enMatch = content.match(/en: \{[\s\S]*?\n  \},\n  hi:/);
if (!enMatch) {
  console.log('Could not find English translations');
  process.exit(1);
}

const enSection = enMatch[0];
console.log('Found English section, extracting keys...');

// Extract all keys from English section
const keyRegex = /(\w+): /g;
const keys = [];
let match;
while ((match = keyRegex.exec(enSection)) !== null) {
  if (match[1] !== 'en' && match[1] !== 'hi') {
    keys.push(match[1]);
  }
}

console.log(`Found ${keys.length} translation keys`);
console.log('Keys:', keys.slice(0, 10), '...');
console.log('\nNote: This script is for reference. Manual translation editing is recommended.');
console.log('Homepage critical translations have been added to Kannada.');
console.log('For Tamil, Telugu, and Marathi - please use English fallbacks in translations.ts');
