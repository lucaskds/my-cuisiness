const ZomatoRepository = require('../repositories/ZomatoRepository');

class MyCuisinessController {
    constructor() {
        this.zomatoRepository = new ZomatoRepository();
    }

    async getRandomRestaurant(params) {
        try {
            const categories = await this.zomatoRepository.getCategories();
            const category = MyCuisinessController.randomCategory(categories);

            Object.assign(params, { category, radius: 2000 });
            const restaurants = await this.zomatoRepository.search(params);
            if (restaurants.length < 1) {
                return this.getRandomRestaurant(params);
            }
            const restaurant = MyCuisinessController.randomRestaurant(restaurants);

            return {
                name: restaurant.name,
                location: restaurant.location,
            };
        } catch (error) {
            return { error };
        }
    }

    static randomCategory(categories) {
        const categoriesIds = Object.keys(categories);
        return categoriesIds[Math.floor(Math.random() * categoriesIds.length)];
    }

    static randomRestaurant(restaurants) {
        const restaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
        return restaurant.restaurant;
    }
}

module.exports = MyCuisinessController;
