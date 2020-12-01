const axios = require('axios');

class ZomatoClient {
    constructor() {
        this.config = {
            headers: {
                Accept: 'application/json',
                'user-key': process.env.ZOMATO_KEY,
            },
        };
    }

    async callZomato(path) {
        const response = await axios.get(path, this.config);
        const { data } = response;
        return data;
    }

    async categories() {
        const path = 'https://developers.zomato.com/api/v2.1/categories';

        const categories = await this.callZomato(path);
        return categories.categories;
    }

    async search(params) {
        const path = 'https://developers.zomato.com/api/v2.1/search?';

        const restaurants = await this.callZomato(path.concat(params));
        return restaurants.restaurants;
    }
}

module.exports = ZomatoClient;
