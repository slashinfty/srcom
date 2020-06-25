module.exports = {
  name: 'time',
  msToReadable: (time) => {
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
};