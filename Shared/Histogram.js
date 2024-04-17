import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import { BarChart } from "react-native-gifted-charts";
import Colors from './Colors';

const screenHeight = Dimensions.get('window').height;

export default function Histogram() {

  const data = [
    { value: 50, label: 'Mon' },
    { value: 70, label: 'Tue' },
    { value: 40, label: 'Wed' },
    { value: 95, label: 'Thu' },
    { value: 85, label: 'Fri' },
    { value: 10, label: 'Sat' },
    { value: 20, label: 'Sun' },
  ];

  useEffect(() => {
    console.log('Histogram unmounted');
  }, [data]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Spin Time</Text>
      <BarChart
        data={data}
        barWidth={30}
        yAxisThickness={0}
        xAxisThickness={1}
        noOfSections={5}
        barBorderRadius={5}
        frontColor={Colors.TEXT_COLOR} // Default front color
        yAxisLabelSuffix={''}
        yAxisLabelTextsStyle={styles.axisLabelStyle}
        xAxisLabelTextsStyle={styles.labelStyle}
        initialSpacing={10}
        showValuesOnTopOfBars={true}
      />
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
  labelStyle: {
    color: '#333',
    fontWeight: 'bold'
  },
  axisLabelStyle: {
    color: '#666'
  }
});