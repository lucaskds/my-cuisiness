const Redis = require('ioredis');

class CacheService {
    constructor(domain, expireTime) {
        const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
        this.redis = new Redis(redisUrl, {
            enableOfflineQueue: false,
            connectTimeout: 1000,
            keyPrefix: domain,
        });
        this.expireTime = expireTime;
    }

    async get(subdomain, key, storeFunction) {
        return this.redis.get(subdomain + key)
            .then((value) => {
                if (value) {
                    return Promise.resolve(value);
                }

                return storeFunction().then((result) => this.redis
                    .set(subdomain + key, result, 'EX', this.expireTime)
                    .then(() => result));
            })
            .catch(() => storeFunction().then((result) => result));
    }

    async del(subdomain, keys) {
        const keysToDelete = [];
        keys.forEach((key) => {
            keysToDelete.push(subdomain + key);
        });
        await this.redis.del(keysToDelete);
    }

    async closeConnection() {
        return this.redis.disconnect();
    }
}

module.exports = CacheService;
