const Redis = require('ioredis');

class CacheService {
  constructor(domain, expireTime) {
    this.redis = new Redis(process.env.REDIS_URL, {
      enableOfflineQueue: false,
      connectTimeout: 1000,
      keyPrefix: domain
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
      .catch(() => {
        return storeFunction().then((result) => {
          return result;
        });
      });
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
