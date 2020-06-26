const pb = require('../pb');

module.exports = {
  name: 'game',
  returnList: async (game) => {
    const fetch = require('node-fetch');
    const querystring = require('querystring');

    const filter = querystring.stringify({name: game});
    const response = await fetch(`https://www.speedrun.com/api/v1/games?${filter}&embed=categories&max=10`);
    const gameList = await response.json();

    if (gameList.data.length === 0) return undefined;
    let games = [];
    for (let i = 0; i < gameList.data.length; i++) {
      games.push({
        "id": gameList.data[i].id,
        "name": gameList.data[i].names.international,
        "categories": gameList.data[i].categories.data
        .filter(cat => cat.type === 'per-game')
        .map(cat => ({
          "id": cat.id,
          "name": cat.name
        }))
      });
    }
    return games;
  },
  runnerGames: async (userId) => {
    const fetch = require('node-fetch');

    const response = await fetch(`https://www.speedrun.com/api/v1/users/${userId}/personal-bests`);
    const pbList = await response.json();

    if (pbList.data.length === 0) return undefined;
    let pbGames = [];
    let pbCategories = [];
    let pbValues = [];
    for (let i = 0; i < pbList.data.length; i++) {
      if (!pbGames.includes(pbList.data[i].run.game)) pbGames.push(pbList.data[i].run.game);
      pbCategories.push(pbList.data[i].run.category);
      Object.values(pbList.data[i].run.values).forEach(v => {
        if (!pbValues.includes(v)) pbValues.push(v);
      });
    }

    return {
      "games": pbGames,
      "categories": pbCategories,
      "values": pbValues
    };
  }
}