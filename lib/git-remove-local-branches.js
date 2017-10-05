#!/usr/bin/env node

const childProcess = require('child_process');
const assert = require('assert');
const folder = process.argv[2] || '.';

const handleBranchCleanup = (err, log) => {
  assert.equal(err, null);
  process.stdout.write(`git branch\n${log}\n`);

  const branches = log.split('\n');
  const deleteBranches = branches
    .map(b => b.trim())
    .filter(b => b.indexOf('master') === -1)
    .filter(b => b.length > 0);

  deleteBranches.forEach(b => {
    if (!spareBranches.includes(b)) {
      childProcess.exec(`git branch -D ${b}`, { cwd: folder }, (err, log) => {
        assert.equal(err, null);
        process.stdout.write(`git branch -D ${b}\n${log}`);
      });
    }
  });
}

childProcess.exec(`git fetch --prune`, { cwd: folder }, (err, log) => {
  assert.equal(err, null);
  process.stdout.write(`git fetch --prune\n${log}\n`);

  childProcess.exec(`git branch -r`, { cwd: folder }, (err, log) => {
    assert.equal(err, null);
    process.stdout.write(`git branch -r\n${log}\n`);

    const branches = log.split('\n');

    const spareBranches = branches
      .map(b => b.trim().replace('origin/', ''))
      .filter(b => b.length > 0)
      .filter(b => b.indexOf('HEAD') === -1);

    childProcess.exec(`git checkout master`, { cwd: folder }, (err, log) => {
      assert.equal(err, null);
      process.stdout.write(`git checkout master\n${log}\n`);

      childProcess.exec(`git branch`, { cwd: folder }, handleBranchCleanup);
    });
  });
});

process.on('uncaughtException', (err) => {
  process.stdout.write(err);
});
