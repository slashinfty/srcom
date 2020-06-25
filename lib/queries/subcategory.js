module.exports = {
  name: 'subcategory',
  returnList: async (category) => {
    const fetch = require('node-fetch');
    
    const response = await fetch(`https://www.speedrun.com/api/v1/categories/${category}/variables`);
    const subList = await response.json();

    let subcategories;
    for (let i = 0; i < subList.data.length; i++) {
      if (subList.data[i]['is-subcategory']) {
        subcategories = {
          "id": subList.data[i].id,
          "subcategories": Object.keys(subList.data[i].values.choices).map(key => ({
            "id": key,
            "name": subList.data[i].values.choices[key]
          }))
        }
      }
    }
    return subcategories;
  }
};