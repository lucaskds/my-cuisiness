const ZomatoRepository = require('../../api/repositories/ZomatoRepository');

class MyCuisinessController {
  constructor() { 
    this.zomatoRepository = new ZomatoRepository();
  }

  async getRandomRestaurant(params) {
    const categories = await this.zomatoRepository.getCategories();
    const category = this.randomCategory(categories);
    
    Object.assign(params, { category, radius: 2000 })
    const restaurants = await this.zomatoRepository.search(params);
    const restaurant = this.randomRestaurant(restaurants);

    return {
      name: restaurant.name,
      location: restaurant.location
    };
  }

  randomCategory(categories) {
    const categoriesIds = Object.keys(categories);
    return categoriesIds[Math.floor(Math.random() * categoriesIds.length)];
  }

  randomRestaurant(restaurants) {
    return restaurants[Math.floor(Math.random() * restaurants.length)].restaurant;
  }
}

module.exports = MyCuisinessController;
