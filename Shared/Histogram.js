import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { BarChart } from "react-native-gifted-charts";
import Colors from './Colors';
import { getUpdatedUserData } from './updateUserData';

export default function Histogram() {
  const { spinResults } = getUpdatedUserData();
  const [data, setData] = useState(null);
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
        onPress: () => console.log(`${key} was pressed with value ${value}`),}))
      .sort((a, b) => b.value - a.value);

    while (sortedResults.length < TOP) {
      sortedResults.push({ value: 0, label: '' });
    }
    console.log("sortedResults results: ", sortedResults);
    return sortedResults.slice(0, TOP);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Search Results</Text>
      {spinResults &&
        <BarChart
          key={JSON.stringify(data)}
          data={data}
          barWidth={Dimensions.get('window').width / 9}
          yAxisThickness={0}
          xAxisThickness={1}
          noOfSections={5}
          barBorderRadius={5}
          frontColor={Colors.TEXT_COLOR} 
          // yAxisLabelTextsStyle={styles.yLabelStyle}
          // xAxisLabelTextsStyle={styles.xLabelStyle}
          initialSpacing={10}
          showValuesOnTopOfBars={true}
        />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.TEXT_COLOR
  },
  xLabelStyle: {
    fontWeight: 'bold',
  },
  yLabelStyle: {
    color: '#666'
  }
});