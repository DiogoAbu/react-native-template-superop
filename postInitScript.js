#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = util.promisify(rl.question).bind(rl);
const exec = util.promisify(require('child_process').exec);

const rootDir = process.cwd();

const gitRemoteRegex = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\w.@:/\-~]+)(\.git)(\/)?/;

const bundleIdRegex = /^[a-z0-9.]{1,155}$/u;
const bundlePlaceholderId = 'bundlehelloidworld';

// Main
(async () => {
  try {
    const { gitRemote, repo } = await askGitRemote();
    await askBundleId();

    // Update package.json name
    const packageJsonFile = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
    packageJson.name = toKebabCase(repo || packageJson.name);
    fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2), 'utf8');

    // Prepare
    await exec('git init');

    // Install necessary deps
    await exec('npx install-peerdeps --yarn --dev eslint-config-superop');

    // Make first commit
    await exec('git add .');
    await exec('git commit -m "feat: :tada: initial commit [skip ci]" --no-verify');
    await exec('git tag -a v0.0.0 -m "release v0.0.0"');
    await exec('git branch -M main');

    // If has remote, add as origin and push
    if (gitRemote) {
      await exec(`git remote add origin ${gitRemote}`);

      try {
        await exec('git push --follow-tags --set-upstream --no-verify origin main');
        await exec('git checkout -b beta');
        await exec('git push --set-upstream --no-verify origin beta');
        await exec('git checkout main');
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  process.exit(0);
})();

/**
 * Ask the user a question
 * @param {string} text The question
 * @returns {Promise<string|undefined>} The answer
 */
async function ask(text) {
  let answer;
  try {
    console.log(`\n${text}`);
    answer = await question(`${text}`);
  } catch (err) {
    answer = err;
  }
  console.log('Answer:', answer);
  return answer;
}

/**
 * Ask what remote git url to add and replace with new user and repo in files
 * @returns {Promise<{ gitRemote?: string|undefined, repo?: string|undefined, user?: string|undefined }>}
 */
async function askGitRemote() {
  const gitRemote = await ask('Question: What remote git url to add as origin? (must end with .git)');
  if (!gitRemote) {
    return {};
  }

  try {
    if (!gitRemoteRegex.test(gitRemote)) {
      throw new Error('Remote git url is invalid');
    }

    const data = gitRemote.replace(/\.git$/g, '').split('/');
    const repo = data.pop();
    const user = data.pop();

    // Prepare to replace placeholder in these files
    const files = ['README.md', 'CONTRIBUTING.md'];

    files.forEach((filePath) => {
      const finalPath = path.join(rootDir, filePath);

      replaceNameInUTF8File(finalPath, user, '#CHANGE_GITHUB_USER');
      replaceNameInUTF8File(finalPath, repo, '#CHANGE_GITHUB_REPO');
    });

    return { gitRemote, repo, user };
  } catch (err) {
    console.log(err.message || err);
    return await askGitRemote();
  }
}

/**
 * Ask for the bundle id
 * @returns {Promise<string>}
 */
async function askBundleId() {
  const appNameDir = getAppNameDir();

  let bundleId = await ask(
    `Question: What bundle identifier you want? (1 to 155 chars, all lower, only letters and numbers, dots will be converted to folders. Ex: com.bundleid.${appNameDir})`,
  );
  bundleId = bundleId ? bundleId.toLowerCase() : undefined;

  try {
    if (!bundleId) {
      throw new Error('Bundle identifier must be set. Tips: Company name, git username');
    }
    if (!bundleIdRegex.test(bundleId)) {
      throw new Error(
        'Bundle identifier must be between 1 and 155 chars, only letters and numbers, dots will be converted to folders',
      );
    }

    // Prepare to replace placeholder in these files
    const files = [
      '.github/workflows/android.yml',
      'android/app/_BUCK',
      'android/app/build.gradle',
      'android/app/src/main/AndroidManifest.xml',
      `android/app/src/main/java/com/${bundlePlaceholderId}/${appNameDir}/MainActivity.java`,
      `android/app/src/main/java/com/${bundlePlaceholderId}/${appNameDir}/MainApplication.java`,
      `android/app/src/debug/java/com/${bundlePlaceholderId}/${appNameDir}/ReactNativeFlipper.java`,
    ];

    await Promise.all(
      files.map(async (filePath) => {
        const finalPath = path.join(rootDir, filePath);

        replaceNameInUTF8File(finalPath, bundleId, bundlePlaceholderId);

        if (finalPath.includes(bundlePlaceholderId)) {
          await renameFile(finalPath, bundlePlaceholderId, bundleId);
        }
      }),
    );

    // Remove placeholder directories
    fs.rmSync(`android/app/src/main/java/com/${bundlePlaceholderId}/`, {
      force: true,
      recursive: true,
      maxRetries: 2,
    });
    fs.rmSync(`android/app/src/debug/java/com/${bundlePlaceholderId}/`, {
      force: true,
      recursive: true,
      maxRetries: 2,
    });

    return bundleId;
  } catch (err) {
    console.log(err.message || err);
    return await askBundleId();
  }
}

/**
 * Get the directory name of the application
 * @returns {string}
 */
function getAppNameDir() {
  const dirPath = path.join(rootDir, 'android', 'app', 'src', 'main', 'java', 'com', bundlePlaceholderId);
  return fs.readdirSync(dirPath)[0];
}

/**
 * Replace placeholder string in a file
 * https://github.com/react-native-community/cli/blob/343b476cfcee006ff105deb655b3d2366b5b6cc6/packages/cli/src/commands/init/editTemplate.ts
 * @param {string} filePath Full path to file
 * @param {string} projectName String the placeholder will be replaced by
 * @param {string} templateName Placeholder to be replaced
 */
function replaceNameInUTF8File(filePath, projectName, templateName) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const replacedFileContent = fileContent
      .replace(new RegExp(templateName, 'g'), projectName)
      .replace(new RegExp(templateName.toLowerCase(), 'g'), projectName.toLowerCase());

    if (fileContent !== replacedFileContent) {
      fs.writeFileSync(filePath, replacedFileContent, 'utf8');
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * Rename a file/folder
 * https://github.com/react-native-community/cli/blob/343b476cfcee006ff105deb655b3d2366b5b6cc6/packages/cli/src/commands/init/editTemplate.ts
 * @param {string} filePath Full path to file/folder
 * @param {string} oldName String to replace
 * @param {string} newName String the placeholder will be replaced by
 */
async function renameFile(filePath, oldName, newName) {
  const dotsToFolder = path.join(...newName.split('.'));
  const newFileName = filePath.replace(new RegExp(oldName, 'g'), dotsToFolder);

  // Create the new folder(s)
  await exec(`npx mkdirp ${path.dirname(newFileName)}`);

  // Move to new location
  fs.renameSync(filePath, newFileName);
}

/**
 * Transform string to kebab-case
 * @param {string} str Some string
 * @returns {string} String in kebab-case
 */
function toKebabCase(str) {
  return str
    .replace(/([A-Z])([A-Z])/g, '$1-$2')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
