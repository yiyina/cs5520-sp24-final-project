import { StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import GlobalApi from '../Services/GlobalApi'
import FirestoreService from '../firebase-files/FirebaseHelpers';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Weather() {
    const [coords, setCoords] = useState(null);
    const [temp, setTemp] = useState(null);
    const [precipitationProbability, setPrecipitationProbability] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!coords) {
                    const userCoords = await FirestoreService.getUserData();
                    setCoords(userCoords.coords);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchUserData();
    }, [coords]);

    useEffect(() => {
        const fetchWeatherData = async () => {
            if (coords) {
                try {
                    const response = await GlobalApi.getWeather(coords.latitude, coords.longitude);
                    const weatherData = response.data;

                    const currentTime = new Date().toISOString();
                    const closestTimeIndex = weatherData.hourly.time.findIndex(time => time >= currentTime);
                    const currentTemperature = weatherData.hourly.temperature_2m[closestTimeIndex];
                    const currentPrecipitationProbability = weatherData.hourly.precipitation_probability[closestTimeIndex];

                    setTemp(currentTemperature.toString());
                    setPrecipitationProbability(currentPrecipitationProbability);
                } catch (error) {
                    console.error('Error fetching weather data:', error);
                }
            }
        }
        fetchWeatherData();
    }, [coords]);

    const determineWeatherIcon = (temperature, precipitationProbability) => {
        if (precipitationProbability > 50) {
            return <MaterialCommunityIcons name="weather-rainy" size={24} color="blue" />;
        } else if (temperature > 20) {
            return <MaterialCommunityIcons name="weather-sunny" size={24} color="orange" />;
        } else {
            return <MaterialCommunityIcons name="weather-cloudy" size={24} color="gray" />;
        }
    };

    const weatherIcon = determineWeatherIcon(temp, precipitationProbability);

    return (
        <View style={styles.container}>
            {weatherIcon}
            <Text style={styles.currentTemperature}>{temp ? `${temp} °C` : 'Loading...'}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    currentTemperature: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
    },
})