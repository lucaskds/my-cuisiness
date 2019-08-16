const ZomatoRepository = require('../../api/repositories/ZomatoRepository');

class MyCuisinessController {
  constructor() { 
    this.zomatoRepository = new ZomatoRepository();
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
