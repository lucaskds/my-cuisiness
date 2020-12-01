jest.mock('ioredis');

const CacheService = require('../../../api/services/CacheService');

const EXPIRE_TIME = 10;

beforeAll(() => {
    const domain = 'testDomain';
    const expireTime = EXPIRE_TIME;

    this.cacheService = new CacheService(domain, expireTime);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('CacheService', () => {
    describe('get', () => {
        it('Should return value when cache is set', async () => {
            const subDomain = 'testSubDomain';
            const key = 'testKey';
            const expected = 'Expected return';
            const storeFunction = jest.fn();
            this.cacheService.redis.get = jest.fn().mockResolvedValue(expected);

            expect(await this.cacheService.get(subDomain, key, storeFunction)).toBe(expected);
            expect(this.cacheService.redis.get).toHaveBeenCalledWith(subDomain + key);
        });

        it('Should save value on cache if not set', async () => {
            const subDomain = 'testSubDomain';
            const key = 'testKey';
            const expected = 'Expected return';
            const storeFunction = jest.fn().mockResolvedValue(expected);
            this.cacheService.redis.get = jest.fn().mockResolvedValue();

            expect(await this.cacheService.get(subDomain, key, storeFunction)).toBe(expected);
            expect(storeFunction).toHaveBeenCalled();
            expect(this.cacheService.redis.set).toHaveBeenCalledWith(subDomain + key, expected, 'EX', EXPIRE_TIME);
            expect(this.cacheService.redis.get).toHaveBeenCalledWith(subDomain + key);
        });

        it('Should return value on reject if cache not set', async () => {
            const subDomain = 'testSubDomain';
            const key = 'testKey';
            const expected = 'Expected return';
            const storeFunction = jest.fn().mockResolvedValue(expected);
            this.cacheService.redis.get = jest.fn().mockRejectedValue();

            expect(await this.cacheService.get(subDomain, key, storeFunction)).toBe(expected);
            expect(storeFunction).toHaveBeenCalled();
            expect(this.cacheService.redis.set).not.toHaveBeenCalledWith(subDomain + key, expected, 'EX', EXPIRE_TIME);
            expect(this.cacheService.redis.get).toHaveBeenCalledWith(subDomain + key);
        });
    });

    describe('del', () => {
        it('Should call redis.del passing all keys', async () => {
            const expected = [
                'testDomain1',
                'testDomain2',
                'testDomain3',
                'testDomain4',
            ];
            this.cacheService.redis.del = jest.fn();

            await this.cacheService.del('testDomain', [1, 2, 3, 4]);

            expect(this.cacheService.redis.del).toHaveBeenCalledWith(expected);
        });
    });

    describe('closeConnection', () => {
        it('Should close Redis connection', async () => {
            this.cacheService.redis.disconnect = jest.fn();

            await this.cacheService.closeConnection();

            expect(this.cacheService.redis.disconnect).toHaveBeenCalledWith();
        });
    });
});
