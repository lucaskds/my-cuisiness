const ZomatoClient = require('../ZomatoClient');
const CacheService = require('../services/CacheService');

const DEFAULT_DATA_CACHE_EXPIRE = 24 * 60 * 60; // 1 day cache

class ZomatoRepository {
    constructor() {
        this.zomatoClient = new ZomatoClient();
        this.cache = new CacheService('zomatoRepository', DEFAULT_DATA_CACHE_EXPIRE);
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
            console.log('Error: ', error);
        }
    }

    async search(params) {
        try {
            const path = '';
            const latPath = path.concat(`lat=${params.lat.replace(',', '.')}&`);
            const lonPath = latPath.concat(`lon=${params.lon.replace(',', '.')}&`);
            const radiusPath = lonPath.concat(`radius=${params.radius}&`);
            const categoryPath = radiusPath.concat(`category=${params.category}&`);

            return await this.zomatoClient.search(categoryPath);
        } catch (error) {
            console.log('Error: ', error);
        }
    }
}

module.exports = ZomatoRepository;
