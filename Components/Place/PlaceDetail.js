import { Platform, StyleSheet, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRoute } from '@react-navigation/native'
import PlaceDetailItem from './PlaceDetailItem'
import Colors from '../../Shared/Colors'
import GoogleMapView from '../Home/GoogleMapView'
import { Linking } from 'react-native'

export default function PlaceDetail() {
    const param = useRoute().params;
    console.log("PlaceDetail param", param);
    const [place, setPlace] = useState(param.place || {});

    useEffect(() => {
        if (param && param.place) {
          setPlace(param.place);
        }
    }, [param])
      

    const onDirectionClick = () => {
        const url=Platform.select({
            ios: "maps: " + place.geometry.location.lat + "," + place.geometry.location.lng + "?q=" + place.vicinity,
            android: "geo: " + place.geometry.location.lat + "," + place.geometry.location.lng + "?q=" + place.vicinity
        });

        Linking.openURL(url)
    }

    return (
        <ScrollView style={{padding:20, backgroundColor:Colors.WHITE, flex:1}}>
            <PlaceDetailItem place={place} onDirectionClick={()=>onDirectionClick()}/>
            <GoogleMapView placeList={[place]}/>
            {/* <TouchableOpacity 
                style={{
                    backgroundColor:Colors.PRIMARY, 
                    padding:15, 
                    alignContent:'center', alignItems:'center',
                    margin:8, 
                    borderRadius:50}} onPress={()=>onDirectionClick()}>
                <Text style={{fontFamily:'Raleway-Regular', textAlign:'center',color:Colors.WHITE}}>
                    Get Direction on Google Map
                </Text>
            </TouchableOpacity> */}
        </ScrollView>
    )
}

const styles = StyleSheet.create({})