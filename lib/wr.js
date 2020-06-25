module.exports = {
  name: 'world record',
  exe: async () => {
    const chalk = require('chalk');
    const rl = require('readline-sync');
    const path = require('path');
    const fs = require('fs');

    let queries = new Map();
    let imp = fs.readdirSync(path.join(__dirname, '/queries'));
    imp.forEach(file => {
      const com = require(path.join(__dirname, '/queries/', file));
      queries.set(com.name, com);
    });

    // Function to display run
    const displayRun = async (gameId, categoryId, variables = null) => {
      const runObject = await variables === null ? 
      queries.get('runs').returnTop({
        "game": gameId,
        "category": categoryId
      }) :
      queries.get('runs').returnTop({
        "game": gameId,
        "category": categoryId,
        "variableId": variables.id,
        "variableVal": variables.val
      });
      let emu = runObject.emulated ? '[EMU]' : '';
      console.log(chalk.blue('Game: ' + runObject.game + '\n' +
      'Category: ' + runObject.category + '\n' + 
      'Runner: ' + runObject.runner + '\n' +
      'Time: ' + runObject.time + '\n' +
      'Date: ' + runObject.date + '\n' +
      'Played On: ' + runObject.platform + ' ' + runObject.region + ' ' + emu + '\n' +
      'Link: ' + runObject.url));
    }

    // Function to list categories given a game
    const listCategories = async game => {
      const catString = queries.get('stringify').returnString(game.categories);
      // Get category from user
      console.log(chalk.green('\nChoose a category:\n' + catString));
      const chosenCategory = rl.question(chalk.bgGreen.black('Category:') + ' ');
      if (game.categories[chosenCategory - 1] === undefined) {
        console.log(chalk.red('Not a valid selection.'));
        return;
      }
      // Check for subcategories
      const subcategories = await queries.get('subcategory').returnList(game.categories[chosenCategory - 1].id);
      if (subcategories === undefined) displayRun(game.id, game.categories[chosenCategory - 1].id)
      else {
        const subCatString = queries.get('stringify').returnString(subcategories.subcategories);
        // Get subcategory from user
        console.log(chalk.green('\nChoose a subcategory:\n' + subCatString));
        const chosenSubcategory = rl.question(chalk.bgGreen.black('Subcategory:') + ' ');
        displayRun(game.id, game.categories[chosenCategory - 1].id, {'id': subcategories.id, 'val': subcategories.subcategories[chosenSubcategory - 1]});
      }
    }

    // Get game from user
    const game = rl.question(chalk.bgGreen.black('Game:') + ' ');
    // Check abbreviation search (exact)
    const abbrGame = await queries.get('abbreviation').returnGame(game);
    if (abbrGame != undefined) listCategories(abbrGame);
    else {
      // If no exact abbreviation match, search for game (fuzzy)
      const games = await queries.get('game').returnList(game);
      if (games === undefined) {
        console.log(chalk.red('Can not find any games matching ' + game));
        return;
      }
      // Listing games
      const gameString = queries.get('stringify').returnString(games);
      console.log(chalk.green('\nChoose a game:\n' + gameString));
      // Get game from user
      let chosenGame = rl.question(chalk.bgGreen.black('Game:') + ' ');
      if (games[chosenGame - 1] === undefined) {
        console.log(chalk.red('Not a valid selection.'));
        return;
      }
      listCategories(games[chosenGame - 1]);
    }
  }
};