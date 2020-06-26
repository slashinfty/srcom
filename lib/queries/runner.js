module.exports = {
  name: 'runner',
  returnRunner: async (user) => {
    const fetch = require('node-fetch');
    const querystring = require('querystring');

    const filter = querystring.stringify({name: user});
    const response = await fetch(`https://www.speedrun.com/api/v1/users?${filter}&max=10`);
    const runnerList = await response.json();

    if (runnerList.data.length === 0) return undefined;
    let runners = [];
    for (let i = 0; i < runnerList.data.length; i++) {
      runners.push({
        "id": runnerList.data[i].id,
        "name": runnerList.data[i].names.international
      });
    }
    return runners;
  }
};