module.exports = {
  name: 'stringify',
  returnString: (array) => {
    let str = '';
    array.forEach((el, i) => {
      let name = '[' + (i + 1) + '] ' + el.name;
      name += i === (array.length - 1) ? '' : '\n';
      str += name;
    })
    return str;
  }
};