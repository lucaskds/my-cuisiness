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

    get(subdomain, key, storeFunction) {
        return this.redis.get(subdomain + key)
            .then((value) => {
                if (value) {
                    return Promise.resolve(value);
                }

                return storeFunction().then((result) => {
                    this.redis.set(subdomain + key, result, 'EX', this.expireTime);
                    return result;
                });
            })
            .catch(() => storeFunction().then((result) => result));
    }

    del(subdomain, keys) {
        const keysToDelete = [];
        keys.forEach((key) => {
            keysToDelete.push(subdomain + key);
        });
        this.redis.del(keysToDelete);
    }
}

module.exports = CacheService;
