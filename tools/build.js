const appRootDir = require('app-root-dir').get();
const { argv } = require('yargs');
const { execSync } = require('child_process');
const path = require('path');

const docsetDir = path.join(appRootDir, 'src', argv.docset);
const websiteDir = path.join(docsetDir, 'website');

console.log('Building...');

execSync(`yarn build`, { cwd: websiteDir });

console.log('Done.');
