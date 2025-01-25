const express = require('express');

const router = express.Router();

const axios = require('axios');

const Weather = require('../models/Weather');
const auth = require('../middleware/authMiddleware');

router.get('/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const apiKey = process.env.WEATHER_API_KEY;
        const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`);

        console.log('API Response:', response.data);  // Log the full API response

        const currentWeather = response.data.current;
        //const forecastWeather = response.data.forecast.forecastday;

        const weatherData = {
            city: response.data.location.name,
            temperature: currentWeather.temp_c,
            description: currentWeather.condition.text,
            icon: currentWeather.condition.icon
        };

        //console.log('Weather Data:', weatherData);  // Log the processed weather data

        res.json(weatherData);
    } catch (err) {
        console.log('Error:', err.message);
        res.status(500).send('Server error');
    }
});


router.post('/favorites', auth, async(req, res) => {
    try{
        const {city, temperature, description} = req.body;

        const newWeather = new Weather({
            city,
            temperature,
            description,
            user: req.user.id,
        });

        const weather = await newWeather.save();

        res.json(weather);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/search/:query', async(req, res) => {
    try{
        const query = req.params.query;
        const apiKey = process.env.WEATHER_API_KEY;
        const response = await axios.get(`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`);

        const suggestion = response.data.map(location => ({
            city:location.name,
            country:location.country
        }));

        res.json(suggestion);
    }catch(err){
        console.error('Error fetching city suggestions:', err.message);
        res.status(500).send('Server error');
    }
});

// Add this route to handle default city
router.get('/defaultCity', async (req, res) => {
    try {
        const defaultCity = 'London'; // You can change this to any city you want as default
        const response = await axios.get(
            `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${defaultCity}`
        );

        const weatherData = {
            city: response.data.location.name,
            temperature: response.data.current.temp_c,
            description: response.data.current.condition.text,
        };

        res.json(weatherData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


//Here we add code for the search suggestions functionality

// Add or update this route in weather.js
router.get('/search/suggestions/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const apiKey = process.env.WEATHER_API_KEY;
        const response = await axios.get(
            `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`
        );

        const suggestions = response.data.map(location => ({
            id: `${location.name}-${location.country}`,
            city: location.name,
            country: location.country,
            fullName: `${location.name}, ${location.country}`
        }));

        res.json(suggestions);
    } catch (err) {
        console.error('Error fetching city suggestions:', err);
        res.status(500).json({ message: 'Error fetching suggestions' });
    }
});


module.exports = router;
 
