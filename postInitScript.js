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

(async () => {
  const rootDir = process.cwd();

  try {
    let githubRemote;
    try {
      console.log('\nQuestion: What remote git url to add as origin? (must end with .git)');
      githubRemote = await question('Question: What remote git url to add as origin? (must end with .git)');
    } catch (err) {
      githubRemote = err;
    }

    console.log('Answer:', githubRemote);
    githubRemote = githubRemote && githubRemote.endsWith('.git') ? githubRemote : undefined;

    let repo;
    let user;
    if (githubRemote) {
      const data = githubRemote.replace(/\.git$/g, '').split('/');
      repo = data.pop();
      user = data.pop();

      // Prepare to replace placeholder in these files
      const files = ['README.md', 'CONTRIBUTING.md'];

      files.forEach((filePath) => {
        const finalPath = path.join(rootDir, filePath);

        replaceNameInUTF8File(finalPath, user, '#CHANGE_GITHUB_USER');
        replaceNameInUTF8File(finalPath, repo, '#CHANGE_GITHUB_REPO');
      });
    }

    const packageJsonFile = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, 'utf8'));
    packageJson.name = repo || toKebabCase(packageJson.name);
    fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2), 'utf8');

    await run('git init');

    await run(
      'yarn version --new-version 0.0.0 --ignore-script --no-git-tag-version --allow-same-version --silent',
    );

    await run('npx install-peerdeps --yarn --dev eslint-config-superop');

    await run('git add .');
    await run('git commit -m "feat: :tada: initial commit [skip ci]" --no-verify');
    await run('git tag -a v0.0.0 -m "release v0.0.0"');
    await run('git branch -M main');

    if (githubRemote) {
      await run(`git remote add origin ${githubRemote}`);

      try {
        await run('git push --follow-tags --set-upstream --no-verify origin main');
        await run('git checkout -b beta');
        await run('git push --set-upstream --no-verify origin beta');
        await run('git checkout main');
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

function run(command) {
  return exec(command);
}

// https://github.com/react-native-community/cli/blob/343b476cfcee006ff105deb655b3d2366b5b6cc6/packages/cli/src/commands/init/editTemplate.ts
function replaceNameInUTF8File(filePath, projectName, templateName) {
  const isPackageJson = path.basename(filePath) === 'package.json';
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const replacedFileContent = fileContent
    .replace(new RegExp(templateName, 'g'), projectName)
    .replace(new RegExp(templateName.toLowerCase(), 'g'), projectName.toLowerCase());

  if (fileContent !== replacedFileContent) {
    fs.writeFileSync(filePath, replacedFileContent, 'utf8');
  }

  if (isPackageJson) {
    fs.writeFileSync(filePath, fileContent.replace(templateName, projectName.toLowerCase()), 'utf8');
  }
}

function toKebabCase(str) {
  return str
    .replace(/([A-Z])([A-Z])/g, '$1-$2')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}
