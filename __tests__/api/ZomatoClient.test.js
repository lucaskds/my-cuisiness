jest.mock('axios');
jest.mock('ioredis');

const axios = require('axios');
const ZomatoClient = require('../../api/ZomatoClient');

beforeAll(() => {
    process.env.ZOMATO_KEY = 'b408d37bb175a5e2ecb109712b2220b2';
    this.zomatoClient = new ZomatoClient();
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('ZomatoClient', () => {
    describe('callZomato', () => {
        it('It should call Zomato given a path', async () => {
            axios.get = jest.fn(() => ({
                data: { msg: 'something' },
            }));
            const expectedPath = '/my/path';
            const expectedOptions = {
                headers: {
                    Accept: 'application/json',
                    'user-key': process.env.ZOMATO_KEY,
                },
            };

            expect(await this.zomatoClient.callZomato(expectedPath)).toEqual({ msg: 'something' });
            expect(axios.get).toHaveBeenCalledWith(expectedPath, expectedOptions);
        });
    });

    describe('categories', () => {
        it("It should call Zomato's categories path", async () => {
            const expectedPath = 'https://developers.zomato.com/api/v2.1/categories';
            this.zomatoClient.callZomato = jest.fn(() => ({ categories: [] }));

            expect(await this.zomatoClient.categories()).toEqual([]);
            expect(this.zomatoClient.callZomato).toHaveBeenCalledWith(expectedPath);
        });
    });

    describe('search', () => {
        it("It should call Zomato's search path", async () => {
            const params = '123';
            const expected = `https://developers.zomato.com/api/v2.1/search?${params}`;
            this.zomatoClient.callZomato = jest.fn(() => ({ restaurants: [] }));

            expect(await this.zomatoClient.search(params)).toEqual([]);
            expect(this.zomatoClient.callZomato).toHaveBeenCalledWith(expected);
        });
    });
});
