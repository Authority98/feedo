const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

// Configuration for which console methods to remove
const METHODS_TO_REMOVE = ['log', 'debug'];
const PRESERVE_METHODS = ['error', 'warn'];

// File extensions to process
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Directories to exclude
const EXCLUDE_DIRS = ['node_modules', 'build', 'dist', 'scripts'];

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  return EXTENSIONS.includes(ext) && !EXCLUDE_DIRS.some(dir => filePath.includes(dir));
}

// Babel plugin to remove console statements
const removeConsolePlugin = () => ({
  visitor: {
    CallExpression(path) {
      if (
        path.node.callee.type === 'MemberExpression' &&
        path.node.callee.object.name === 'console' &&
        METHODS_TO_REMOVE.includes(path.node.callee.property.name)
      ) {
        path.remove();
      }
    }
  }
});

// Process a single file
async function processFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, 'utf-8');
    const result = await babel.transformAsync(code, {
      plugins: [removeConsolePlugin],
      presets: ['@babel/preset-react'],
      filename: filePath,
      sourceMaps: false,
      retainLines: true,
      configFile: false,
      babelrc: false,
    });

    if (result && result.code) {
      fs.writeFileSync(filePath, result.code);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Walk through directory recursively
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !EXCLUDE_DIRS.includes(file)) {
      walkDir(filePath, callback);
    } else if (stat.isFile() && shouldProcessFile(filePath)) {
      callback(filePath);
    }
  });
}

// Main execution
async function main() {
  const srcDir = path.join(process.cwd(), 'src');
  let processedFiles = 0;
  let successfulFiles = 0;

  console.log('Starting console.log removal process...');
  console.log(`Preserving console methods: ${PRESERVE_METHODS.join(', ')}`);
  console.log(`Removing console methods: ${METHODS_TO_REMOVE.join(', ')}`);

  walkDir(srcDir, async (filePath) => {
    processedFiles++;
    const success = await processFile(filePath);
    if (success) successfulFiles++;
    console.log(`Processing: ${path.relative(process.cwd(), filePath)} - ${success ? 'Success' : 'Failed'}`);
  });

  console.log('\nProcess completed!');
  console.log(`Processed ${processedFiles} files`);
  console.log(`Successfully modified ${successfulFiles} files`);
}

main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
}); 