module.exports = {
  name: 'abbreviation',
  returnGame: async (game) => {
    const fetch = require('node-fetch');
    const querystring = require('querystring');

    const filter = querystring.stringify({abbreviation: game});
    const response = await fetch(`https://www.speedrun.com/api/v1/games?${filter}&embed=categories`);
    const gameList = await response.json();

    if (gameList.data.length === 0) return undefined;
    const foundGame = {
      "id": gameList.data[0].id,
      "name": gameList.data[0].names.international,
      "categories": gameList.data[0].categories.data
      .filter(cat => cat.type === 'per-game')
      .map(cat => ({
        "id": cat.id,
        "name": cat.name
      }))
    }
    return foundGame;
  }
};