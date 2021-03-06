jest.mock('ioredis');

const MyCuisinessController = require('../../../api/controllers/MyCuisinessController');

beforeAll(async () => {
    this.myCuisinessController = new MyCuisinessController();
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('MyCuisinessController', () => {
    describe('getRandomRestaurant', () => {
        it('It returns a random Zomato restaurant', async () => {
            const mockCategories = jest.spyOn(this.myCuisinessController.zomatoRepository, 'getCategories');
            const mockSearch = jest.spyOn(this.myCuisinessController.zomatoRepository, 'search');
            const expectedReturn = { name: 'My First Restaurant', location: 'Somewhere' };
            mockCategories.mockReturnValue({ 0: 'test0', 1: 'test1' });
            mockSearch.mockReturnValue([{ restaurant: expectedReturn }]);

            expect(await this.myCuisinessController.getRandomRestaurant({ lat: 12, lon: 34 }))
                .toEqual(expectedReturn);
            expect(mockCategories).toHaveBeenCalled();
        });

        it('It calls Zomato again when no restaurants are returned', async () => {
            const expectedReturn = { name: 'My First Restaurant', location: 'Somewhere' };
            const mockSearch = jest.fn()
                .mockReturnValue([{ restaurant: expectedReturn }])
                .mockReturnValueOnce([]);
            const mockCategories = jest.spyOn(this.myCuisinessController.zomatoRepository, 'getCategories');
            this.myCuisinessController.zomatoRepository.search = mockSearch;
            mockCategories.mockReturnValue({ 0: 'test0', 1: 'test1' });

            expect(await this.myCuisinessController.getRandomRestaurant({ lat: 12, lon: 34 }))
                .toEqual(expectedReturn);
            expect(mockCategories).toHaveBeenCalledTimes(2);
        });

        it('It returns an object with an error key/value', async () => {
            try {
                this.myCuisinessController.zomatoRepository = jest.fn(() => {
                    throw new Error('This is an error');
                });
                await this.myCuisinessController.getRandomRestaurant({ lat: 12, lon: 34 });
            } catch (e) {
                expect(e).toEqual({ error: 'This is an error' });
            }
        });
    });
});
