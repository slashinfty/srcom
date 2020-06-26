module.exports = {
  name: 'twitch',
  returnRunner: async (user) => {
    const fetch = require('node-fetch');
    const querystring = require('querystring');

    const filter = querystring.stringify({twitch: user});
    const response = await fetch(`https://www.speedrun.com/api/v1/users?${filter}`);
    const runnerList = await response.json();

    if (runnerList.data.length === 0) return undefined;
    const runner = {
      "id": runnerList.data[0].id,
      "name": runnerList.data[0].names.international
    };
    return runner;
  }
};