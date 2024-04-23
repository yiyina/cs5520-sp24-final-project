import axios from 'axios';
import { MY_API_KEY } from '@env';

const API_KEY = MY_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api/place/';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?'

// Get nearby places by latitude and longitude
const nearByPlace = (lat, lng, type) => axios.get(BASE_URL +
  "nearbysearch/json?location=" + lat + "," + lng +
  "&radius=1500" +
  "&type=" + type +
  "&key=" + API_KEY)

// Search places by text
const searchByText = (searchText) => axios.get(BASE_URL +
  "textsearch/json?query=" + searchText +
  "&key=" + API_KEY)

// Get weather by latitude and longitude
const getWeather = (lat, lon) => axios.get(WEATHER_URL +
  "latitude=" + lat + "&longitude=" + lon +
  "&hourly=temperature_2m,precipitation_probability")

export default { nearByPlace, searchByText, getWeather };