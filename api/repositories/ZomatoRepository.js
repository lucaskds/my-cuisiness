const ZomatoClient = require('../ZomatoClient');
const CacheService = require('../services/CacheService');

const DEFAULT_DATA_CACHE_EXPIRE = 24 * 60 * 60; // 1 day cache
const DEFAULT_ERROR_MSG = 'Sorry, the third-party API is experiencing some issues :(';

class ZomatoRepository {
    constructor(cacheService) {
        this.zomatoClient = new ZomatoClient();
        this.cache = cacheService || new CacheService('zomatoRepository', DEFAULT_DATA_CACHE_EXPIRE);
    }

    async getCategories() {
        try {
            const categories = await this.cache.get('categories', '', async () => {
                const response = await this.zomatoClient.categories();
                const categoriesObject = {};
                response.forEach((category) => {
                    categoriesObject[category.categories.id] = category.categories.name;
                });
                return JSON.stringify(categoriesObject);
            });
            return JSON.parse(categories);
        } catch (error) {
            throw new Error(DEFAULT_ERROR_MSG);
        }
    }

    async search(params) {
        try {
            const path = '';
            const searchPath = path.concat(`lat=${params.lat.replace(',', '.')}&`)
                .concat(`lon=${params.lon.replace(',', '.')}&`)
                .concat(`radius=${params.radius}&`)
                .concat(`category=${params.category}&`)
                .concat('sort=real_distance');

            return await this.zomatoClient.search(searchPath);
        } catch (error) {
            throw new Error(DEFAULT_ERROR_MSG);
        }
    }
}

module.exports = ZomatoRepository;
