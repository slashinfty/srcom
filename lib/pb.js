module.exports = {
  name: 'personal best',
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
    const displayRun = async (runnerObj, gameObj, categoryObj) => {
      const submitRun = categoryObj.hasOwnProperty('varId') ?
      {
        "runner": runnerObj.id,
        "game": gameObj.id,
        "category": categoryObj.id,
        "subCatKey": categoryObj.varId,
        "subCatVal": categoryObj.varVal
      } :
      {
        "runner": runnerObj.id,
        "game": gameObj.id,
        "category": categoryObj.id
      };
      queries.get('runs').returnPb(submitRun).then(runObject => {
        const emu = runObject.emulated ? '[EMU]' : '';
        const catName = categoryObj.hasOwnProperty('varName') ? categoryObj.name + ' (' + categoryObj.varName + ')' : categoryObj.name;
        console.log(chalk.cyan('\nGame: ' + gameObj.name + '\n' +
        'Category: ' + catName + '\n' +
        'Rank: ' + runObject.rank + '\n' +
        'Runner: ' + runnerObj.name + '\n' +
        'Time: ' + runObject.time + '\n' +
        'Date: ' + runObject.date + '\n' +
        'Played On: ' + runObject.platform + ' ' + runObject.region + ' ' + emu + '\n' +
        'Link: ' + runObject.url));
      });
    }

    // Function to list categories given a game
    const listCategories = async (runnerObj, gameObj, pbCats, pbVals) => {
      const filteredCategories = gameObj.categories.filter(cat => pbCats.includes(cat.id));
      let foundCategory;
      if (filteredCategories.length === 1) {
        console.log(chalk.yellow('\nFound category: ' + filteredCategories[0].name));
        foundCategory = filteredCategories[0];
      } else {
        const catString = queries.get('stringify').returnString(filteredCategories);
        // Get category from user
        console.log(chalk.green('\nChoose a category:\n' + catString));
        const chosenCategory = rl.question(chalk.bgGreen.black('Category:') + ' ');
        if (filteredCategories[chosenCategory - 1] === undefined) {
          console.log(chalk.red('Not a valid selection.'));
          return;
        }
        foundCategory = filteredCategories[chosenCategory - 1];
      }
      // Check for subcategories
      const subcategories = await queries.get('subcategory').returnList(foundCategory.id);
      if (subcategories === undefined) {
        displayRun(runnerObj, {
          "id": gameObj.id,
          "name": gameObj.name
        }, {
          "id": foundCategory.id,
          "name": foundCategory.name
        });
      }
      else { //TODO filter subcategories
        const filteredSubcategories = subcategories.subcategories.filter(sub => pbVals.includes(sub.id));
        let foundSubcategory;
        if (filteredSubcategories.length === 1) {
          console.log(chalk.yellow('\nFound subcategory: ' + filteredSubcategories[0].name));
          foundSubcategory = filteredSubcategories[0];
        } else {
          const subCatString = queries.get('stringify').returnString(filteredSubcategories);
          // Get subcategory from user
          console.log(chalk.green('\nChoose a subcategory:\n' + subCatString));
          const chosenSubcategory = rl.question(chalk.bgGreen.black('Subcategory:') + ' ');
          if (filteredSubcategories[chosenSubcategory - 1] === undefined) {
            console.log(chalk.red('Not a valid selection.'));
            return;
          }
          foundSubcategory = filteredSubcategories[chosenSubcategory - 1];
        }
        displayRun(runnerObj, {
          "id": gameObj.id,
          "name": gameObj.name
        }, {
          "id": foundCategory.id,
          "name": foundCategory.name,
          "varId": subcategories.id,
          "varVal": foundSubcategory.id,
          "varName": foundSubcategory.name
        });
      }
    }

    // Function to get game from user
    const getGame = async (runnerObj) => {
      // Get list of games with personal bests
      const pbGames = await queries.get('game').runnerGames(runnerObj.id);
      // Get game from user
      const game = rl.question(chalk.bgGreen.black('Game:') + ' ');
      // Check abbreviation search (exact)
      const abbrGame = await queries.get('abbreviation').returnGame(game);
      if (abbrGame != undefined) {
        console.log(chalk.yellow('\nFound game: ', abbrGame.name))
        if (!pbGames.games.includes(abbrGame.id)) {
          console.log(chalk.red(runnerObj.name + ' does not have a personal best in ' + abbrGame.name));
          return;
        }
        listCategories(runnerObj, abbrGame, pbGames.categories, pbGames.values);
      } else {
        // If no exact abbreviation match, search for game (fuzzy)
        const games = await queries.get('game').returnList(game);
        if (games === undefined) {
          console.log(chalk.red('Can not find any games matching ' + game));
          return;
        }
        if (games.length === 1) {
          console.log(chalk.yellow('\nFound game: ' + games[0].name));
          if (!pbGames.games.includes(games[0].id)) {
            console.log(chalk.red(runnerObj.name + ' does not have a personal best in ' + games[0].name));
            return;
          }
          listCategories(runnerObj, games[0], pbGames.categories, pbGames.values);
        } else {
          const gameString = queries.get('stringify').returnString(games);
          console.log(chalk.green('\nChoose a game:\n' + gameString));
          // Get game from user
          let chosenGame = rl.question(chalk.bgGreen.black('Game:') + ' ');
          if (games[chosenGame - 1] === undefined) {
            console.log(chalk.red('Not a valid selection.'));
            return;
          }
          if (!pbGames.games.includes(games[chosenGame - 1].id)) {
            console.log(chalk.red(runnerObj.name + ' does not have a personal best in ' + games[chosenGame - 1].name));
            return;
          }
          listCategories(runnerObj, games[chosenGame - 1], pbGames.categories, pbGames.values);
        }
      }
    }

    // Get runner from user
    const runner = rl.question(chalk.bgGreen.black('Runner:') + ' ');
    // Check Twitch search (exact)
    const twitchRunner = await queries.get('twitch').returnRunner(runner);
    if (twitchRunner != undefined) {
      console.log(chalk.yellow('\nFound runner: ', twitchRunner.name));
      getGame(twitchRunner);
    } else {
      // If no exact Twitch match, search for runner (contains)
      const runners = await queries.get('runner').returnRunner(runner);
      if (runners === undefined) {
        console.log(chalk.red('Can not find any runners matching ' + runner));
        return;
      }
      if (runners.length === 1) {
        // Found only one runner
        console.log(chalk.yellow('\nFound runner: ' + runners[0].name));
        getGame(runners[0]);
      } else {
        // Listing runners
        const runnerString = queries.get('stringify').returnString(runners);
        console.log(chalk.green('\nChoose a runner:\n' + runnerString));
        // Get runner from user
        let chosenRunner = rl.question(chalk.bgGreen.black('Runner:') + ' ');
        if (runners[chosenRunner - 1] === undefined) {
          console.log(chalk.red('Not a valid selection.'));
          return;
        }
        getGame(runners[chosenRunner - 1]);
      }
    }
  }
};