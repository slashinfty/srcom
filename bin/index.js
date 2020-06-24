#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const targetDir = path.join(__dirname, '../', 'lib');
let cmd = new Map();
let imports = fs.readdirSync(targetDir);
imports.forEach(file => {
  const com = require(path.join(targetDir, file));
  cmd.set(com.name, com);
});

const opt = cmd.get('welcome').exe();
switch (parseInt(opt)) {
  case 1:
    break;
  case 2:
    break;
  case 3:
    break;
  case 4:
    break;
}