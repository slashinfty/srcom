module.exports = {
  name: 'post run',
  post: async (submission) => {
    const fetch = require('node-fetch');
    const chalk = require('chalk');
    require('dotenv').config();

    fetch(`https://www.speedrun.com/api/v1/runs`, {
      method: 'post',
      body:    JSON.stringify(submission),
      headers: { 'Accept': 'application/json',
                 'X-API-Key': process.env.API }
    }).then(res => res.json()).then(json => {
      if (json.status === 400) {
        console.log(chalk.red('There was a problem with your submission!'));
        json.errors.forEach(e => console.log(chalk.cyan(e)));
      } else {
        console.log(chalk.cyan('Success!\nView your submission: ' + json.data.weblink));
      }
    });
  }
}