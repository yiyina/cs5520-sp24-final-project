import { StyleSheet, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import SearchBar from '../Components/Search/SearchBar'
import GoogleMapViewFull from '../Components/Search/GoogleMapViewFull'
import BusinessList from '../Components/Search/BusinessList'
import GlobalApi from '../Services/GlobalApi';
import { getUpdatedUserData } from '../Shared/updateUserData'
import { useRoute } from '@react-navigation/native'

export default function Search() {
  const route = useRoute();
  const { query } = route.params || {};

  const [placeList, setPlaceList] = useState([]);
  const { coords } = getUpdatedUserData();

  useEffect(() => {
    if (coords) {
      getNearbyPlaces('restaurant');
    }
  }, []);

  useEffect(() => {
    if (query && coords) {
      getNearbyPlaces(query);
    }
  }, [query, coords]);

  const getNearbyPlaces = (value) => {
    GlobalApi.searchByText(value)
      .then((response) => {
        const sortedPlace = response.data.results.sort((a, b) => {
          return a.user_ratings_total - b.user_ratings_total;
        }).slice(0, 10).reverse();
        setPlaceList(sortedPlace);
      })
      .catch((error) => {
        console.error('Error fetching nearby places:', error);
      });
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <SearchBar
          setSearchText={(value) => getNearbyPlaces(value)}
          spinValue={query}
          playList={placeList}
        />
      </View>
      <GoogleMapViewFull placeList={placeList} />
      <View style={{ position: 'absolute', zIndex: 1, bottom: 0 }}>
        <BusinessList placeList={placeList} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    zIndex: 1,
  },
})