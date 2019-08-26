const axios = require('axios');
const userKey = process.env.ZOMATO_KEY;

class ZomatoClient {
  constructor() {
    this.config = {
      headers: {
        'Accept': 'application/json',
        'user-key': userKey
      }
    };
  }

  async callZomato(path) {
    try {
      const response = await axios.get(path, this.config);
      const data = response.data;
      return data;
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  async categories() {
    const path = 'https://developers.zomato.com/api/v2.1/categories';
    
    try {
      const categories = await this.callZomato(path);
      return categories.categories;
    } catch(error) {
      console.log('Error: ', error);
    }
  }

  async search(params) {
    const path = 'https://developers.zomato.com/api/v2.1/search?'
    
    try {
      const restaurants = await this.callZomato(path.concat(params));
      return restaurants.restaurants;
    } catch(error) {
      console.log('Error: ', error);
    }
  }
}

module.exports = ZomatoClient;