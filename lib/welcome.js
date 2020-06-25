module.exports = {
  name: 'welcome',
  exe: () => {
    const figlet = require('figlet');
    const clear = require('clear');
    const chalk = require('chalk');
    const rl = require('readline-sync');
    clear();
    console.log(chalk.green.bold(figlet.textSync('srcom', {
    font: 'Isometric1',
    horizontalLayout: 'controlled smushing'
    })), '\n', '\n' +
    chalk.green('Choose an option:') + '\n' +
    chalk.green('[1] Lookup a world record') + '\n' +
    chalk.green('[2] Lookup a personal best') + '\n' +
    chalk.green('[3] Lookup information') + '\n' +
    chalk.green('[4] Submit a run') + '\n' +
    chalk.green('[5] About srcom'));
    return rl.question(chalk.bgGreen.black('Option:') + ' ');
  }
};