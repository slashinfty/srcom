#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const targetDir = path.join(__dirname, '../', 'lib');
let cmd = new Map();
let imports = fs.readdirSync(targetDir).filter(file => file.endsWith('.js'));
imports.forEach(file => {
  const com = require(path.join(targetDir, file));
  cmd.set(com.name, com);
});
async function startHere() {
  const opt = cmd.get('welcome').exe();
  switch (opt) {
    case '1':
      cmd.get('world record').exe();
      break;
    case '2':
      cmd.get('personal best').exe();
      break;
    case '3':
      cmd.get('rules').exe();
      break;
    case '4':
      cmd.get('submit run').exe();
      break;
    case '5':
      const pkg = require(path.join(__dirname, '../', 'package.json'))
      console.log(chalk.yellow('Version: ' + pkg.version + '\n' + 'https://github.com/slashinfty/srcom'));
      if(fs.existsSync(path.join(__dirname, '../', '.env'))) console.log(chalk.yellow('API key can be found: ' + path.join(__dirname, '../', '.env')))
      return;
      break;
    default:
      console.log(chalk.red('Not a valid selection.'));
      return;
  }
}

startHere();