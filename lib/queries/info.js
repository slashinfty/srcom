const { requiredOption } = require("commander")

module.exports = {
  name: 'information',
  returnRules: async (category, subcategory) => {
    const fetch = require('node-fetch');

    const response = await fetch(`https://www.speedrun.com/api/v1/categories/${category}?embed=variables`);
    const categoryInfo = await response.json();

    let rules = categoryInfo.data.rules;
    rules += subcategory === null ? '' : '\n' + categoryInfo.data.variables.data.find(sub => sub.id === subcategory.id).values.values[subcategory.val].rules;
    return {
      'rules': rules,
      'url': categoryInfo.data.weblink
    }
  }
}