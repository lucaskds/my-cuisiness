const ZomatoRepository = require('../../api/repositories/ZomatoRepository');

class MyCuisinessController {
  constructor() { 
    this.zomatoRepository = new ZomatoRepository();
  }

  async getRandomRestaurant(params) {
    try {
      const categories = await this.zomatoRepository.getCategories();
      const category = this.randomCategory(categories);
      
      Object.assign(params, { category, radius: 2000 })
      const restaurants = await this.zomatoRepository.search(params);
      if (restaurants.length < 1) {
        return this.getRandomRestaurant(params);
      }
      const restaurant = this.randomRestaurant(restaurants);

      return {
        name: restaurant.name,
        location: restaurant.location
      };
    } catch {
      return { error: 'Sorry, something went wrong...' };
    }  
  }

  randomCategory(categories) {
    const categoriesIds = Object.keys(categories);
    return categoriesIds[Math.floor(Math.random() * categoriesIds.length)];
  }

  randomRestaurant(restaurants) {
    const restaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
    return restaurant.restaurant;
  }
}

module.exports = MyCuisinessController;
