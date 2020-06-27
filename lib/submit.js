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
      queries.get('game').returnPoss(gameId).then(possible => {
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
              "value": possible.categories[chosenCategory - 1].subcategories[0].vals[chosenSubcategory -1].id
            }
          }
        }
        const convert = time => {
          let msSplit = time.split('.');
          let timeSplit = msSplit[0].split(':');
          let newTime = 0;
          timeSplit.forEach((t, i) => newTime += t * (60 ** (timeSplit.length - 1 - i)))
          newTime += msSplit.length > 1 ? parseFloat('.' + msSplit[1]) : 0;
          return newTime;
        }
        submission.run.times = {};
        const timeNames = {
          "realtime": "Real Time",
          "realtime_noloads": "Real Time (no loads)",
          "ingame": "In-Game Time"
        }
        const timeFormat = possible.msBool ? 'HH:MM:SS.MS' : 'HH:MM:SS';
        possible.times.forEach(t => {
          const inputTime = rl.question(chalk.bgGreen.black(timeNames[t] + ' (' + timeFormat + ')') + ' ');
          submission.run.times[t] = convert(inputTime);
        });
        console.log(chalk.yellow('Leave date blank for today\'s date.'));
        let d = new Date();
        submission.run.date = rl.question(chalk.bgGreen.black('Date (YYYY-MM-DD):') + ' ', {defaultInput: d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)});
        const platString = queries.get('stringify').returnString(possible.platforms);
        console.log(chalk.green('\nChoose a platform:\n' + platString));
        const chosenPlatform = rl.question(chalk.bgGreen.black('Platform:') + ' ');
        if (possible.platforms[chosenPlatform - 1] === undefined) {
          console.log(chalk.red('Not a valid selection.'));
          return;
        }
        submission.run.platform = possible.platforms[chosenPlatform - 1].id;
        if (possible.emuBool) {
          const emulated = rl.question(chalk.bgGreen.black('Emulated? (y/n):') + ' ');
          submission.run.emulated = /^[yY]$/.test(emulated);
        }
        const regString = queries.get('stringify').returnString(possible.regions);
        console.log(chalk.green('\nChoose a region:\n' + regString));
        const chosenRegion = rl.question(chalk.bgGreen.black('Region:') + ' ');
        if (possible.regions[chosenRegion - 1] === undefined) {
          console.log(chalk.red('Not a valid selection.'));
          return;
        }
        submission.run.region = possible.regions[chosenRegion - 1].id;
        submission.run.video = rl.question(chalk.bgGreen.black('Video link:') + ' ');
        submission.run.splitsio = rl.question(chalk.bgGreen.black('Splits.io:') + ' ');
        submission.run.comment = rl.question(chalk.bgGreen.black('Comments:') + ' ');
        queries.get('post run').post(submission);
      });
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