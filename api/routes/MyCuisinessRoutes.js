const express = require('express');
const MyCuisinessController = require('../controllers/MyCuisinessController');

class MyCuisinessRoutes {
  constructor() {
    this.myCuisinessController = new MyCuisinessController();
    this.router = express.Router();
    this.categoriesRoute();
    this.citiesRoute();
  }

  getRoutes() {
    return this.router;
  }

  categoriesRoute() {
    this.router.get('/categories', async (req, res) => {
      try {
        const response = await this.myCuisinessController.getCategories();
        res.send({ categories: response });
      } catch(error) {
        console.log(error);
      }
    });
  }

  citiesRoute() {
    this.router.get('/cities', (req, res) => {
      this.myCuisinessController.getCategories().then((response) => {
        res.send({ categories: response });
      })
      .catch(error => console.log(error));
    });
  }
}

module.exports = MyCuisinessRoutes;