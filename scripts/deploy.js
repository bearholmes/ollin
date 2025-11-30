#!/usr/bin/env node

/**
 * @file Automated Deployment Script
 * @description Automates version bumping and release process for Ollin
 * Usage: node scripts/deploy.js [major|minor|patch]
 */

import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

/**
 * Print colored message
 * @param {string} message - Message to print
 * @param {string} color - Color key
 */
function print(message, color = 'reset') {
  // eslint-disable-next-line no-console
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Execute shell command
 * @param {string} command - Command to execute
 * @returns {string} Command output
 */
function exec(command) {
  return execSync(command, { encoding: 'utf-8', cwd: rootDir }).trim();
}

/**
 * Ask user a question
 * @param {string} question - Question to ask
 * @returns {Promise<string>} User's answer
 */
function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`${colors.cyan}${question}${colors.reset} `, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Parse semantic version
 * @param {string} version - Version string (e.g., "0.6.0")
 * @returns {{major: number, minor: number, patch: number}}
 */
function parseVersion(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
}

/**
 * Bump version based on type
 * @param {string} version - Current version
 * @param {'major'|'minor'|'patch'} type - Bump type
 * @returns {string} New version
 */
function bumpVersion(version, type) {
  const { major, minor, patch } = parseVersion(version);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid version type: ${type}`);
  }
}

/**
 * Update package.json version
 * @param {string} newVersion - New version string
 */
async function updatePackageJson(newVersion) {
  const packagePath = join(rootDir, 'package.json');
  const content = await readFile(packagePath, 'utf-8');
  const pkg = JSON.parse(content);
  pkg.version = newVersion;
  await writeFile(packagePath, JSON.stringify(pkg, null, 2) + '\n');
  print(`✅ Updated package.json to v${newVersion}`, 'green');
}

/**
 * Update manifest.json version
 * @param {string} newVersion - New version string
 */
async function updateManifestJson(newVersion) {
  const manifestPath = join(rootDir, 'app', 'manifest.json');
  const content = await readFile(manifestPath, 'utf-8');
  const manifest = JSON.parse(content);
  manifest.version = newVersion;
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  print(`✅ Updated app/manifest.json to v${newVersion}`, 'green');
}

/**
 * Update README badges to match the version
 * @param {string} newVersion - New version string
 */
async function updateReadmeVersion(newVersion) {
  const readmeFiles = ['README.md', 'README.en.md'];

  for (const file of readmeFiles) {
    const path = join(rootDir, file);
    const content = await readFile(path, 'utf-8');
    const newContent = content.replace(/(version-)\d+\.\d+\.\d+/, `$1${newVersion}`);

    if (content === newContent) {
      print(`⚠️  No badge version found in ${file}`, 'yellow');
      continue;
    }

    await writeFile(path, newContent);
    print(`✅ Updated ${file} badge to v${newVersion}`, 'green');
  }
}

/**
 * Check if git working directory is clean
 * @returns {boolean}
 */
function isGitClean() {
  try {
    const status = exec('git status --porcelain');
    return status === '';
  } catch {
    return false;
  }
}

/**
 * Run pre-deployment checks
 */
async function runChecks() {
  print('\n🔍 Running pre-deployment checks...\n', 'bright');

  // Check git status
  print('📋 Checking git status...', 'blue');
  if (!isGitClean()) {
    print('⚠️  Warning: You have uncommitted changes', 'yellow');
    const answer = await ask('Continue anyway? (y/N):');
    if (answer.toLowerCase() !== 'y') {
      print('❌ Deployment cancelled', 'red');
      process.exit(1);
    }
  } else {
    print('✅ Git working directory is clean', 'green');
  }

  // Run tests
  print('\n🧪 Running tests...', 'blue');
  try {
    exec('npm test');
    print('✅ All tests passed', 'green');
  } catch {
    print('❌ Tests failed', 'red');
    const answer = await ask('Continue anyway? (y/N):');
    if (answer.toLowerCase() !== 'y') {
      print('❌ Deployment cancelled', 'red');
      process.exit(1);
    }
  }

  // Run lint
  print('\n🔎 Running ESLint...', 'blue');
  try {
    exec('npm run lint');
    print('✅ Linting passed', 'green');
  } catch {
    print('❌ Linting failed', 'red');
    const answer = await ask('Continue anyway? (y/N):');
    if (answer.toLowerCase() !== 'y') {
      print('❌ Deployment cancelled', 'red');
      process.exit(1);
    }
  }

  // Run build
  print('\n📦 Running build...', 'blue');
  try {
    exec('npm run build');
    print('✅ Build succeeded', 'green');
  } catch {
    print('❌ Build failed', 'red');
    print('Please fix build errors before deploying', 'red');
    process.exit(1);
  }
}

/**
 * Main deployment function
 */
async function deploy() {
  print('\n🚀 Ollin Deployment Script\n', 'bright');

  // Get current version
  const packagePath = join(rootDir, 'package.json');
  const packageContent = await readFile(packagePath, 'utf-8');
  const currentVersion = JSON.parse(packageContent).version;

  print(`📌 Current version: ${currentVersion}`, 'cyan');

  // Determine version type
  let versionType = process.argv[2];

  if (!versionType) {
    print('\n버전 업데이트 타입을 선택하세요:', 'bright');
    print('  1) patch - 버그 수정 (0.6.0 → 0.6.1)', 'blue');
    print('  2) minor - 기능 추가 (0.6.0 → 0.7.0)', 'blue');
    print('  3) major - 큰 변경사항 (0.6.0 → 1.0.0)', 'blue');

    const choice = await ask('\n선택 (1/2/3):');

    switch (choice) {
      case '1':
        versionType = 'patch';
        break;
      case '2':
        versionType = 'minor';
        break;
      case '3':
        versionType = 'major';
        break;
      default:
        print('❌ 잘못된 선택입니다', 'red');
        process.exit(1);
    }
  }

  if (!['major', 'minor', 'patch'].includes(versionType)) {
    print(`❌ Invalid version type: ${versionType}`, 'red');
    print('Usage: node scripts/deploy.js [major|minor|patch]', 'yellow');
    process.exit(1);
  }

  // Calculate new version
  const newVersion = bumpVersion(currentVersion, versionType);
  print(`\n📈 New version: ${newVersion}`, 'green');

  // Confirm
  const confirm = await ask('\n계속하시겠습니까? (y/N):');
  if (confirm.toLowerCase() !== 'y') {
    print('❌ Deployment cancelled', 'red');
    process.exit(0);
  }

  // Run checks
  await runChecks();

  // Update versions
  print('\n📝 Updating version files...', 'bright');
  await updatePackageJson(newVersion);
  await updateManifestJson(newVersion);
  await updateReadmeVersion(newVersion);

  // Git operations
  print('\n📤 Git operations...', 'bright');

  try {
    // Stage changes
    print('📋 Staging version changes...', 'blue');
    exec('git add package.json app/manifest.json README.md README.en.md');
    print('✅ Files staged', 'green');

    // Commit
    print('\n💾 Creating commit...', 'blue');
    const commitMessage = `chore: Bump version to ${newVersion}`;
    exec(`git commit -m "${commitMessage}"`);
    print(`✅ Commit created: "${commitMessage}"`, 'green');

    // Create tag
    print('\n🏷️  Creating git tag...', 'blue');
    const tagName = `v${newVersion}`;
    exec(`git tag ${tagName}`);
    print(`✅ Tag created: ${tagName}`, 'green');

    // Ask about pushing
    const pushAnswer = await ask('\n원격 저장소에 푸시하시겠습니까? (y/N):');
    if (pushAnswer.toLowerCase() === 'y') {
      print('\n🚀 Pushing to remote...', 'bright');

      // Push commits
      print('📤 Pushing commits...', 'blue');
      exec('git push -u origin HEAD');
      print('✅ Commits pushed', 'green');

      // Push tag (this triggers GitHub Release)
      print('\n🏷️  Pushing tag (this will trigger automated release)...', 'blue');
      exec(`git push origin ${tagName}`);
      print('✅ Tag pushed - GitHub Release will be created automatically', 'green');

      print('\n✨ Deployment complete!', 'bright');
      print(
        `\n📦 Check your GitHub Release: https://github.com/bearholmes/ollin/releases/tag/${tagName}`,
        'cyan'
      );
    } else {
      print('\n✅ Version updated and tagged locally', 'green');
      print(`\nTo push later, run:`, 'cyan');
      print(`  git push -u origin HEAD`, 'blue');
      print(`  git push origin ${tagName}`, 'blue');
    }

    print('\n🎉 Done!', 'bright');
  } catch (error) {
    print(`\n❌ Git operation failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run deployment
deploy().catch((error) => {
  print(`\n❌ Deployment failed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
