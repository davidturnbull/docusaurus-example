const { argv } = require('yargs');
const { execSync } = require('child_process');
const appRootDir = require('app-root-dir').get();
const fs = require('fs-extra');
const glob = require('glob');
const matter = require('gray-matter');
const path = require('path');
const prettier = require('prettier');
const YAML = require('yamljs');

const contentDir = path.join(appRootDir, 'content');
const docsetDir = path.join(contentDir, argv.docset);
const websiteDir = path.join(appRootDir, 'website');
const outputDir = path.join(websiteDir, 'docs');

if (!fs.pathExistsSync(contentDir)) {
  console.log(`This "content" directory doesn't exist:`, contentDir);
  return;
}

if (!fs.pathExistsSync(docsetDir)) {
  console.log(`This "docset" directory doesn't exist:`, docsetDir);
  return;
}

if (!fs.pathExistsSync(websiteDir)) {
  console.log(`This "website" directory doesn't exist:`, websiteDir);
  return;
}

const versionDirs = fs
  .readdirSync(docsetDir)
  .filter((filePath) =>
    fs.statSync(path.join(docsetDir, filePath)).isDirectory()
  )
  .sort();

if (versionDirs.length < 1) {
  console.log(`There's no versions in this docset:`, docsetDir);
  return;
}

// Delete any existing documentation versions from Docusaurus
fs.removeSync(path.join(websiteDir, 'versioned_docs'));
fs.removeSync(path.join(websiteDir, 'versioned_sidebars'));
fs.removeSync(path.join(websiteDir, 'versions.json'));

versionDirs.forEach((versionDir) => {
  // Delete the existing contents of the "docs" directory
  fs.removeSync(outputDir);

  const versionDirPath = path.join(docsetDir, versionDir);
  const filePaths = glob.sync(path.join(versionDirPath, '**/*.md'));

  if (filePaths.length < 1) {
    console.log('No topics found for version:', versionDirPath);
    return;
  }

  filePaths.forEach((filePath) => {
    const file = fs.readFileSync(filePath, 'utf8');
    let { data, content } = matter(file);
    const newFilePath = path.join(outputDir, slugToFilename(data.path));
    const markdown = createMarkdownDocument(data, content);
    fs.outputFileSync(newFilePath, markdown);
  });

  const versionNumber = versionDir.replace('v', '').trim();
  const command = `yarn run docusaurus docs:version ${versionNumber}`;
  execSync(command, {
    cwd: websiteDir,
  });
});

function slugToFilename(slug) {
  return slug === '/' ? 'overview.md' : slug.replace(/\/$/, '') + '.md';
}

function createMarkdownDocument(frontmatter, content) {
  const yaml = YAML.stringify(frontmatter).trim();
  const markdown = ['---', yaml, '---', '', content].join('\n');
  return prettier.format(markdown, { parser: 'markdown' });
}

// function removePropertiesFromJsonCodeBlocks(opts) {
//   return (tree) => {
//     visit(tree, 'code', (node) => {
//       if (opts.properties.length < 1) {
//         return;
//       }

//       if (node.lang !== 'json') {
//         return;
//       }

//       const json = JSON.parse(node.value);

//       opts.properties.forEach((property) => {
//         delete json[property];
//       });

//       node.value = JSON.stringify(json, null, 2);
//     });
//   };
// }

// function fixInternalLinks() {
//   return (tree) => {
//     visit(tree, 'link', (node) => {
//       if (!node.url.startsWith('/')) {
//         return;
//       }

//       // FIXME: Anchor links get butchered

//       // Handle topic with root path
//       if (data.path === '/') {
//         node.url = slugToFilename(node.url).replace('/', '');
//         return;
//       }

//       // Set a relative URL
//       node.url = path
//         .relative(slugToFilename(data.path), slugToFilename(node.url))
//         .replace('../', './');
//     });
//   };
// }
