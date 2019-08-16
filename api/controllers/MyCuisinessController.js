const ZomatoClient = require('../../ZomatoClient');

class MyCuisinessController {
  constructor() { 
    this.zomatoClient = new ZomatoClient();
  }

  async getCategories() {
    const response = await this.zomatoClient.categories();
    const categoriesObject = {};
    response.categories.forEach((category) => {
      categoriesObject[category.categories.id] = category.categories.name;
    });
    return categoriesObject;
  }
}

module.exports = MyCuisinessController;
