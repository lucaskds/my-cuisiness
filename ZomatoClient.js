const zomato = require('zomato-api');
const userKey = process.env.ZOMATO_KEY;

class ZomatoClient {
  constructor() {
    this.client = zomato({ userKey });
  }

  async categories() {
    try {
      const categories = await this.client.getCategories();
      return categories;
    } catch(error) {
      console.log(error);
    }
  }
}

module.exports = ZomatoClient;