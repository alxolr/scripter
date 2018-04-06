#!/usr/bin/env node

const childProcess = require('child_process');
const fs = require('fs');

const folder = process.argv[2] || '.';

const cleanup = log => log.toString().split('\n')
  .filter(f => f.length)
  .join('');

const dirs = fs.readdirSync(folder);

dirs.forEach((dir) => {
  if (fs.lstatSync(`${folder}/${dir}`).isDirectory()) {
    const children = fs.readdirSync(`${folder}/${dir}`);
    if (children.includes('.git')) {
      const log = childProcess.execSync('git ls-files | xargs cat | wc -l', { cwd: `${folder}/${dir}` });
      console.log(`${dir} ${cleanup(log)}`);
    }
  }
});

process.on('uncaughtException', (err) => {
  console.log(err);
});
