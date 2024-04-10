import { StyleSheet, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import SearchBar from '../Components/Search/SearchBar'
import GoogleMapViewFull from '../Components/Search/GoogleMapViewFull'
import BusinessList from '../Components/Search/BusinessList'
import GlobalApi from '../Services/GlobalApi';
import { getUpdatedUserData } from '../Shared/updateUserData'

export default function Search() {
  const [placeList, setPlaceList] = useState([]);
  const { coords } = getUpdatedUserData();

  useEffect(() => {
    if (coords) {
      getNearbyPlaces('restaurant');
    }
  }
    , []);

  const getNearbyPlaces = (value) => {
    GlobalApi.searchByText(value)
      .then((response) => {
        setPlaceList(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching nearby places:', error);
      });
  };

  return (
    <View>
      <View style={{ position: 'absolute', zIndex: 10 }}>
        <SearchBar setSearchText={(value) => getNearbyPlaces(value)} />
      </View>
      <GoogleMapViewFull placeList={placeList}/>
      <View style={{ position: 'absolute', zIndex: 1, bottom: 0 }}>
        <BusinessList placeList={placeList} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})