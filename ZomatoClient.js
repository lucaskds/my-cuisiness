const zomato = require('zomato-api');
const userKey = process.env.ZOMATO_KEY;

class ZomatoClient {
  constructor() {
    this.client = zomato({ userKey });
  }

  async categories() {
    try {
      const categories = await this.client.getCategories();
      return categories.categories;
    } catch(error) {
      console.log(error);
    }
  }

  async search(params) {
    try {
      const restaurants = await this.client.search(params);
      return restaurants.restaurants;
    } catch(error) {
      console.log(error);
    }
  }
}

module.exports = ZomatoClient;