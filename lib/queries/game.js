module.exports = {
  name: 'game',
  returnList: async (game) => {
    const fetch = require('node-fetch');
    const querystring = require('querystring');

    const filter = querystring.stringify({name: game});
    const response = await fetch(`https://www.speedrun.com/api/v1/games?${filter}&embed=categories`);
    const gameList = await response.json();

    if (gameList.data.length === 0) return undefined;
    let games = [];
    const limit = gameList.data.length > 10 ? 10 : gameList.data.length;
    for (let i = 0; i < limit; i++) {
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
  }
}