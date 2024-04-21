import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { BarChart } from "react-native-gifted-charts";
import Colors from '../../Shared/Colors';
import { getUpdatedUserData } from '../../Shared/updateUserData';
import GlobalApi from '../../Services/GlobalApi';
import BarItemList from './BarItemList';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Histogram() {
  const { coords, spinResults } = getUpdatedUserData();
  const navigator = useNavigation();
  const [data, setData] = useState(null);
  const [placeList, setPlaceList] = useState([])
  const TOP = 5;

  useEffect(() => {
    const updatedChartData = processSpinResults(spinResults);
    setData([...updatedChartData]);
  }, [spinResults]);

  const processSpinResults = (spinResults) => {
    if (!spinResults) return [];
    const sortedResults = Object.entries(spinResults)
      .map(([key, value]) => ({
        label: key,
        value,
        onPress: () => setPlaceList(getNearBySearchPlace(key)),
      }))
      .sort((a, b) => b.value - a.value);

    while (sortedResults.length < TOP) {
      sortedResults.push({ value: 0, label: '' });
    }
    // console.log("sortedResults results: ", sortedResults);
    return sortedResults.slice(0, TOP);
  }

  const getNearBySearchPlace = (value) => {
    if (coords) {
      console.log("Histograom: coords: ", coords.latitude, coords.longitude, "value: ", value);
      GlobalApi.searchByText(value)
        .then(response => {
          // console.log("response: ", response.data)
          const sortedResults = response.data.results.sort((a, b) => {
            return a.user_ratings_total - b.user_ratings_total;
          }).reverse();
          setPlaceList(sortedResults);
        })
        .catch(error => {
          console.error("Error fetching nearby places:", error);
        });
    } else {
      console.log("Location is not available");
    }
  };

  const onPlaceClick = (item) => {
    navigator.navigate("place-detail", { place: item });
    console.log("Place clicked", item);
  }

  return (
    <View style={styles.container}>
      {spinResults ?
        <FlatList
          data={placeList}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <>
              <Text style={styles.title}>Top Search Results</Text>
              {spinResults && (
                <BarChart
                  data={data}
                  barWidth={Dimensions.get('window').width / 9}
                  yAxisThickness={0}
                  xAxisThickness={1}
                  noOfSections={5}
                  barBorderRadius={5}
                  frontColor={Colors.TEXT_COLOR}
                  initialSpacing={10}
                  showValuesOnTopOfBars={true}
                />
              )}
            </>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onPlaceClick(item)}
              style={{ marginTop: 20 }}>
              <BarItemList place={item} />
            </TouchableOpacity>
          )}
        />
        :
        <View style={styles.firstLogin}>
          <Entypo name="arrow-bold-up" size={24} color="black" />
          <Text style={styles.title}>Do your first Spin now!</Text>
          <Text style={styles.title}>Welcome to Spin to Explore!</Text>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: Dimensions.get('window').width * 0.9,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.TEXT_COLOR,
    alignSelf: 'center',
  },
  firstLogin: {
    flex: 1,
    alignItems: 'center',
    gap: 20,
  }
});