module.exports = {
  name: 'welcome',
  exe: () => {
    const figlet = require('figlet');
    const clear = require('clear');
    const chalk = require('chalk');
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    clear();
    console.log(chalk.green.bold(figlet.textSync('srcom', {
    font: 'Isometric1',
    horizontalLayout: 'controlled smushing'
    })), '\n', '\n',
    chalk.green('Choose an option:'), '\n',
    chalk.green('[1] Get a world record'), '\n',
    chalk.green('[2] Get a personal best'), '\n',
    chalk.green('[3] Get information'), '\n',
    chalk.green('[4] Post a run'));
    rl.question(chalk.bgGreen.black('Option:'), answer => {
      if (!/^[1-4]$/.test(answer)) {
        console.log(chalk.red('Not a valid option.'));
        return undefined;
      } else return answer;
    });
  }
};