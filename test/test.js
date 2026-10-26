const fs = require('fs');
const path = require('path');

console.log('🛸 Starting Automated CI/CD Test Suite...\n');

let failedTests = 0;

function runTest(testName, testFn) {
  try {
    testFn();
    console.log(` ✅ PASS: ${testName}`);
  } catch (err) {
    console.error(` ❌ FAIL: ${testName} -> ${err.message}`);
    failedTests++;
  }
}

// Test 1: Critical File Integrity
runTest('Verify core project files exist', () => {
  const files = ['index.html', 'style.css', 'app.js', 'package.json', '.circleci/config.yml'];
  files.forEach(file => {
    const filePath = path.resolve(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing expected file: ${file}`);
    }
  });
});

// Test 2: HTML SEO & Semantics
runTest('Validate HTML meta tags and document structure', () => {
  const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
  if (!html.includes('<!DOCTYPE html>')) throw new Error('Missing DOCTYPE declaration');
  if (!html.includes('<title>') || !html.includes('</title>')) throw new Error('Missing <title> tag');
  if (!html.includes('name="viewport"')) throw new Error('Missing responsive viewport meta tag');
  if (!html.includes('id="telemetry-canvas"')) throw new Error('Missing telemetry canvas element');
});

// Test 3: CSS Design System Tokens
runTest('Verify CSS color variables and typography tokens', () => {
  const css = fs.readFileSync(path.resolve(__dirname, '../style.css'), 'utf-8');
  if (!css.includes('--bg-primary')) throw new Error('Missing primary theme variable');
  if (!css.includes('--accent-cyan')) throw new Error('Missing accent color definition');
  if (!css.includes('backdrop-filter')) throw new Error('Glassmorphism filter not defined in CSS');
});

// Test 4: JavaScript Logic & Syntax
runTest('Check JavaScript file integrity', () => {
  const js = fs.readFileSync(path.resolve(__dirname, '../app.js'), 'utf-8');
  if (js.length < 100) throw new Error('app.js appears suspiciously empty or truncated');
  if (!js.includes('DOMContentLoaded')) throw new Error('Missing DOM ready listener');
});

// Test 5: CircleCI Config exists & syntax check
runTest('Validate CircleCI workflow configuration file', () => {
  const circleCiPath = path.resolve(__dirname, '../.circleci/config.yml');
  const yamlContent = fs.readFileSync(circleCiPath, 'utf-8');
  if (!yamlContent.includes('version: 2.1')) throw new Error('CircleCI config requires version: 2.1');
  if (!yamlContent.includes('workflows:')) throw new Error('CircleCI config missing workflows definition');
});

console.log('\n----------------------------------------');
if (failedTests > 0) {
  console.error(`💥 Test Suite Finished with ${failedTests} failure(s).`);
  process.exit(1);
} else {
  console.log('✨ All 5 Test Suites Passed Successfully! Ready for CircleCI deployment.');
  process.exit(0);
}
