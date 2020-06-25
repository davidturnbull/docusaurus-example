const { argv } = require('yargs');
const { execSync } = require('child_process');
const appRootDir = require('app-root-dir').get();
const fs = require('fs-extra');
const glob = require('glob');
const matter = require('gray-matter');
const path = require('path');
const prettier = require('prettier');
const remark = require('remark');
const YAML = require('yamljs');
const visit = require('unist-util-visit');

const contentDir = path.join(appRootDir, 'content');
const websiteDir = path.join(appRootDir, 'website');
const docsetDir = path.join(contentDir, argv.docset);
const outputDir = path.join(websiteDir, 'docs');

if (!fs.pathExistsSync(docsetDir)) {
  console.log(`This "docset" directory doesn't exist:`, docsetDir);
  return;
}

if (!fs.pathExistsSync(contentDir)) {
  console.log(`This "content" directory doesn't exist:`, contentDir);
  return;
}

// Sorted in REVERSE order
const versionDirs = fs
  .readdirSync(docsetDir)
  .filter((filePath) =>
    fs.statSync(path.join(docsetDir, filePath)).isDirectory()
  )
  .sort()
  .reverse();

if (versionDirs.length < 1) {
  console.log(`There's no versions in this docset:`, docsetDir);
  return;
}

// Create the "versions.json" file for Docusaurus
// const versionNumbers = versionDirs.map((version) => version.replace('v', ''));
// const versionsJson = JSON.stringify(versionNumbers, null, 4);
// fs.writeFileSync(path.join(websiteDir, 'versions.json'), versionsJson);

// Loop through each version of the docset
versionDirs.forEach((versionDir, versionIndex) => {
  fs.removeSync(outputDir);

  const versionDirPath = path.join(docsetDir, versionDir);
  const filePaths = glob.sync(path.join(versionDirPath, '**/*.md'));

  console.log('---');

  if (filePaths.length < 1) {
    console.log('No topics found for version:', versionDirPath);
    return;
  }

  console.log('[PROCESSING]', versionDirPath);

  filePaths.forEach((filePath) => {
    // Read the existing file
    const file = fs.readFileSync(filePath, 'utf8');
    let { data, content } = matter(file);
    // Write a new file
    const newFilePath = path.join(outputDir, slugToFilename(data.path));
    const markdown = createMarkdownDocument(data, content);
    fs.outputFileSync(newFilePath, markdown);
  });

  console.log('[BUILDING]', versionDirPath);

  const basePath = path.join(versionIndex === 0 && argv.docset, versionDir);
  const outDir = path.join('..', 'dist', basePath);

  const command = `yarn build --out-dir ${outDir}`;

  const opts = {
    cwd: websiteDir,
  };

  execSync(command, opts);

  console.log('[DONE]', versionDirPath);
});

console.log('---');

// const latestVersion = versionDirs[versionDirs.length - 1];
// const latestVersionDir = path.join(contentDir, latestVersion);

// const filePaths = glob.sync(path.join(latestVersionDir, '**/*.md'));

// if (filePaths.length < 1) {
//   console.log('No topics found for version:', latestVersionDir);
//   return;
// }

// filePaths.forEach((filePath) => {
//   // Read the existing file
//   const file = fs.readFileSync(filePath, 'utf8');
//   let { data, content } = matter(file);

//   let result;

//   // General processing
//   result = remark()
//     .use(removePropertiesFromJsonCodeBlocks, {
//       properties: ['$schema'],
//     })
//     .processSync(content);

//   // Docusaurus-specific processing
//   result = remark().use(fixInternalLinks).processSync(result.contents);

//   // Write a new file
//   const newFilePath = path.join(outputDir, slugToFilename(data.path));
//   const markdown = createMarkdownDocument(data, result.contents);
//   fs.writeFileSync(newFilePath, markdown);
// });

function slugToFilename(slug) {
  return slug === '/' ? 'overview.md' : slug.replace(/\/$/, '') + '.md';
}

function createMarkdownDocument(frontmatter, content) {
  const yaml = YAML.stringify(frontmatter).trim();
  const markdown = ['---', yaml, '---', '', content].join('\n');
  return prettier.format(markdown, { parser: 'markdown' });
}

function removePropertiesFromJsonCodeBlocks(opts) {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (opts.properties.length < 1) {
        return;
      }

      if (node.lang !== 'json') {
        return;
      }

      const json = JSON.parse(node.value);

      opts.properties.forEach((property) => {
        delete json[property];
      });

      node.value = JSON.stringify(json, null, 2);
    });
  };
}

function fixInternalLinks() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      if (!node.url.startsWith('/')) {
        return;
      }

      // FIXME: Anchor links get butchered

      // Handle topic with root path
      if (data.path === '/') {
        node.url = slugToFilename(node.url).replace('/', '');
        return;
      }

      // Set a relative URL
      node.url = path
        .relative(slugToFilename(data.path), slugToFilename(node.url))
        .replace('../', './');
    });
  };
}
