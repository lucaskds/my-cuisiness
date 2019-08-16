const ZomatoClient = require('../../ZomatoClient');
const CacheService = require('../../api/services/CacheService');

const DEFAULT_DATA_CACHE_EXPIRE = 24 * 60 * 60;  // 1 day cache

class ZomatoRepository {
  constructor() { 
    this.zomatoClient = new ZomatoClient();
    this.cache = new CacheService('zomatoRepository', DEFAULT_DATA_CACHE_EXPIRE);
  }

  async getCategories() {
    const categories = await this.cache.get('categories', '', async () => {
      const response = await this.zomatoClient.categories();
      const categoriesObject = {};
      response.forEach((category) => {
        categoriesObject[category.categories.id] = category.categories.name;
      });
      return JSON.stringify(categoriesObject);
    });
    return JSON.parse(categories);
  }

  async search(searchObject) {
    Object.assign(searchObject, { lon: parseFloat(searchObject.lon) })
    Object.assign(searchObject, { lat: parseFloat(searchObject.lat) })
    return await this.zomatoClient.search(searchObject);
  }
}

module.exports = ZomatoRepository;
