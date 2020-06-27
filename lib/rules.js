module.exports = {
  name: 'rules',
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

    const displayRules = async (obj) => {
      queries.get('information').returnRules(obj.category.id, obj.subcategory).then(rulesObj => {
        let catName = obj.subcategory === null ? obj.category.name : obj.category.name + ' (' + obj.subcategory.name + ')';
        console.log(chalk.cyan('\nGame: ' + obj.game.name + '\n' +
        'Category: ' + catName + '\n' +
        'Rules: ' + rulesObj.rules + '\n' +
        'Link: ' + rulesObj.url));
      });
    }

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
      if (subcategories === undefined) {
        displayRules({
          'game': {
            'id': game.id,
            'name': game.name
          },
          'category': {
            'id': game.categories[chosenCategory - 1].id,
            'name': game.categories[chosenCategory - 1].name
          },
          'subcategory': null
        });
      } else {
        const subCatString = queries.get('stringify').returnString(subcategories.subcategories);
        // Get subcategory from user
        console.log(chalk.green('\nChoose a subcategory:\n' + subCatString));
        const chosenSubcategory = rl.question(chalk.bgGreen.black('Subcategory:') + ' ');
        if (subcategories.subcategories[chosenSubcategory - 1] === undefined) {
          console.log(chalk.red('Not a valid selection.'));
          return;
        }
        displayRules({
          'game': {
            'id': game.id,
            'name': game.name
          },
          'category': {
            'id': game.categories[chosenCategory - 1].id,
            'name': game.categories[chosenCategory - 1].name
          },
          'subcategory': {
            'id': subcategories.id,
            'val': subcategories.subcategories[chosenSubcategory - 1].id,
            'name': subcategories.subcategories[chosenSubcategory - 1].name
          }
        });
      }
    }

    // Get game from user
    const game = rl.question(chalk.bgGreen.black('Game:') + ' ');
    // Check abbreviation search (exact)
    const abbrGame = await queries.get('abbreviation').returnGame(game);
    if (abbrGame != undefined) {
      console.log(chalk.yellow('\nFound game: ' + abbrGame.name));
      listCategories(abbrGame);
    }
    else {
      // If no exact abbreviation match, search for game (fuzzy)
      const games = await queries.get('game').returnList(game);
      if (games === undefined) {
        console.log(chalk.red('Can not find any games matching ' + game));
        return;
      }
      if (games.length === 1) {
        // Found only one game
        console.log(chalk.yellow('\nFound game: ' + games[0].name));
        listCategories(games[0]);
      } else {
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
  }
};