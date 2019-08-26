const express = require('express');
const MyCuisinessController = require('../controllers/MyCuisinessController');

class MyCuisinessRoutes {
  constructor() {
    this.myCuisinessController = new MyCuisinessController();
    this.router = express.Router();
    this.rootRoute();
    this.randomRestaurantRoute();
  }

  getRoutes() {
    return this.router;
  }

  rootRoute() {
    this.router.get('', async (req, res) => {
      res.send({
        title: 'Hi!',
        message: 'Welcome to My Cuisiness API :)'
      })
    });
  }

  randomRestaurantRoute() {
    this.router.get('/surprise-me', async (req, res) => {
      const params = req.query;
      
      try {
        const response = await this.myCuisinessController.getRandomRestaurant(params);
        res.send(response);
      } catch(error) {
        console.log(error);
      }
    });
  }
}

module.exports = MyCuisinessRoutes;
