# My Cuisiness - Your Random Restaurant App

## Initial config:
You must have a .env file with this variables:
ZOMATO_KEY=<your-zomato-key-here>
REDIS_URL=redis://cache

## What can I do?
Given a latitude and longitude, I can show you a random restaurant to discover!

## How it works?
Send me a GET request in https://my-cuisiness.herokuapp.com/surprise-me

With this query parameters:
- lat: <your_latitude_here>
- lon: <your_longitude_here>

E.g: https://my-cuisiness.herokuapp.com/surprise-me?lat=<your_latitude_here>&lon=<your_longitude_here>
