const ZomatoRepository = require('../../../api/repositories/ZomatoRepository');

beforeAll(() => {
    process.env.ZOMATO_KEY = 'b408d37bb175a5e2ecb109712b2220b2';
    const mockedCache = jest.fn({
        get: jest.fn(),
        del: jest.fn(),
    });
    this.zomatoRepository = new ZomatoRepository(mockedCache);
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('ZomatoRepository', () => {
    describe('getCategories', () => {
        it('It should NOT call Zomato when cache is set', async () => {
            this.zomatoRepository.cache.get = jest.fn(() => '{}');
            this.zomatoRepository.zomatoClient = jest.fn();
            await this.zomatoRepository.getCategories();
            expect(this.zomatoRepository.zomatoClient).not.toHaveBeenCalled();
        });

        it('It should call Zomato when cache is not set', async () => {
            this.zomatoRepository = new ZomatoRepository();
            this.zomatoRepository.zomatoClient.categories = jest.fn(() => [{ categories: { id: 0, name: 'test' } }]);
            await this.zomatoRepository.getCategories();
            expect(this.zomatoRepository.zomatoClient.categories).toHaveBeenCalledTimes(1);
            this.zomatoRepository.cache.closeConnection();
        });

        it('It should throw Error when Zomato returns error', async () => {
            try {
                this.zomatoRepository.zomatoClient.categories = jest.fn(() => {
                    throw new Error('Error thrown');
                });
                await this.zomatoRepository.getCategories();
            } catch (e) {
                expect(e.message).toEqual('Sorry, the third-party API is experiencing some issues :(');
            }
        });
    });

    describe('search', () => {
        it('It should search Zomato restaurants', async () => {
            const params = {
                category: 10,
                lat: '12.34567',
                lon: '-32.333',
                radius: 2000,
            };
            this.zomatoRepository.zomatoClient.search = jest.fn();
            await this.zomatoRepository.search(params);
            expect(this.zomatoRepository.zomatoClient.search).toHaveBeenCalledTimes(1);
            expect(this.zomatoRepository.zomatoClient.search).toHaveBeenCalledWith('lat=12.34567&lon=-32.333&radius=2000&category=10&sort=real_distance');
        });

        it('It should throw Error when Zomato returns error', async () => {
            try {
                this.zomatoRepository.zomatoClient.search = jest.fn(() => {
                    throw new Error('Error thrown');
                });
                await this.zomatoRepository.search();
            } catch (e) {
                expect(e.message).toEqual('Sorry, the third-party API is experiencing some issues :(');
            }
        });
    });
});
