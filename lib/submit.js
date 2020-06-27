module.exports = {
  name: 'submit run',
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

    const inquiry = async gameId => {
      const possible = queries.get('game').returnPoss(gameId);
      let submission = {
        "run": {}
      }
      const catString = queries.get('stringify').returnString(possible.categories);
      console.log(chalk.green('\nChoose a category:\n' + catString));
      const chosenCategory = rl.question(chalk.bgGreen.black('Category:') + ' ');
      if (possible.categories[chosenCategory - 1] === undefined) {
        console.log(chalk.red('Not a valid selection.'));
        return;
      }
      submission.run.category = possible.categories[chosenCategory - 1].id;
      if (possible.categories[chosenCategory - 1].subcategories.length > 0) {
        const subString = queries.get('stringify').returnString(possible.categories[chosenCategory - 1].subcategories[0].vals);
        console.log(chalk.green('\nChoose a subcategory:\n' + subString));
        const chosenSubcategory = rl.question(chalk.bgGreen.black('Subcategory:') + ' ');
        if (possible.categories[chosenCategory - 1].subcategories[0].vals[chosenSubcategory -1] === undefined) {
          console.log(chalk.red('Not a valid selection.'));
          return;
        }
        submission.run.variables = {
          [possible.categories[chosenCategory - 1].subcategories[0].id]: {
            "type": "pre-defined",
            "value": possible.categories[chosenCategory - 1].subcategories[0].vals[chosenSubcategory -1]
          }
        }
      }
      const timeNames = {
        "realtime": "Real Time",
        "realtime_noloads": "Real Time (no loads)",
        "ingame": "In-Game Time"
      }
      const timeFormat = possible.msBool ? 'HH:MM:SS.MS' : 'HH:MM:SS';
      possible.times.forEach(t => {
        const inputTime = rl.question(chalk.bgGreen.black());
      })
    }

    const getGame = async () => {
      // Get game from user
      const game = rl.question(chalk.bgGreen.black('Game:') + ' ');
      // Check abbreviation search (exact)
      const abbrGame = await queries.get('abbreviation').returnGame(game);
      if (abbrGame != undefined) {
        console.log(chalk.yellow('\nFound game: ' + abbrGame.name));
        inquiry(abbrGame.id);
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
          inquiry(games[0].id);
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
          inquiry(games[chosenGame - 1].id);
        }
      }
    }

    if (!fs.existsSync(path.join(__dirname, '../', '.env'))) {
      console.log(chalk.red('No API key set. Creating .env file.' + '\n' +
      'Get your API key: https://www.speedrun.com/api/auth'));
      const apiKey = rl.question(chalk.bgGreen.black('Input API key:') + ' ');
      fs.writeFileSync(path.join(__dirname, '../', '.env'), 'API=' + apiKey);
      getGame();
    } else getGame();
  }
};