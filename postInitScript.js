#!/usr/bin/env node

const util = require('util');
const exec = util.promisify(require('child_process').exec);

(async () => {
  console.info('');

  console.info('  - Initializing git');
  await exec('git init');

  console.info('  - Installing peerdeps for eslint-config-superop');
  await exec('npx install-peerdeps --yarn --dev eslint-config-superop');
})();
