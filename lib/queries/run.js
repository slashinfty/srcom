module.exports = {
  name: 'runs',
  returnTop: async (idObject) => {
    const fetch = require('node-fetch');
    
    const variableFilter = idObject.hasOwnProperty('variableId') ? '&var-' + idObject.variableId + '=' + idObject.variableVal : '';
    const response = await fetch(`https://www.speedrun.com/api/v1/leaderboards/${idObject.game}/category/${idObject.category}?top=1${variableFilter}&embed=game,category.variables,players,regions,platforms`);
    const run = await response.json();

    const convert = (time) => {
      let hr, min, sec, ms;
      let parts = time.toString().split('.');
      ms = parts.length > 1 ? parseInt((parts[1] + '00').substr(0,3)) : undefined;
      sec = parseInt(parts[0]);
      if (sec >= 60) {min = Math.floor(sec / 60); sec = sec < 10 ? '0' + (sec % 60) : sec % 60}
      if (min >= 60) {hr = Math.floor(min / 60); min = min < 10 ? '0' + (min % 60) : min % 60}
      ms = ms < 10 ? '00' + ms : ms < 100 ? '0' + ms : ms;
      if (min === undefined) return ms === undefined ? sec.toString() + 's' : sec.toString() + 's ' + ms.toString() + 'ms';
      else if (hr === undefined) return ms === undefined ? min.toString() + 'm ' + sec.toString() + 's' : min.toString() + 'm ' + sec.toString() + 's ' + ms.toString() + 'ms';
      else return ms === undefined ? hr.toString() + 'h ' + min.toString() + 'm ' + sec.toString() + 's' : hr.toString() + 'h ' + min.toString() + 'm ' + sec.toString() + 's ' + ms.toString() + 'ms';
    }

    return {
      "game": run.data.game.data.names.international,
      "category": variableFilter === '' ? run.data.category.data.name : run.data.category.data.name + ' (' + run.data.category.data.variables.data.find(o => o.id === idObject.variableId).values.choices[idObject.variableVal] + ')',
      "runner": run.data.players.data[0].rel === 'user' ? run.data.players.data[0].names.international : run.data.players.data[0].name,
      "time": convert(run.data.runs[0].run.times.primary_t),
      "date": run.data.runs[0].run.date,
      "platform": run.data.platforms.data.length > 0 ? run.data.platforms.data[0].name : '',
      "region": run.data.regions.data.length > 0 ? run.data.regions.data[0].name : '',
      "emulated": run.data.runs[0].run.system.emulated,
      "url": run.data.runs[0].run.weblink
    };
  }
};