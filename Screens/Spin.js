import { StyleSheet, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import SpinWheel from '../Animation/SpinWheel'
import Header from '../Components/Spin/Header'
import EditSpin from '../Components/Spin/EditSpin'
import ColorThemes from '../Components/Spin/DefaultColorSet'
import { defaultSpin } from '../Components/Spin/DefaultSpin'
import FirestoreService from '../firebase-files/FirebaseHelpers'
import { ActivityIndicator } from 'react-native'
import Colors from '../Shared/Colors'

export default function Spin() {
  const [spinItems, setSpinItems] = useState([])
  const [spinName, setSpinName] = useState('')
  const [spinColor, setSpinColor] = useState([])
  const [spinColorName, setSpinColorName] = useState('')
  const [spinId, setSpinId] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false);

  const originalSpin = {
    spinColor: ColorThemes.SPRINGFLOWER,
    spinItems: defaultSpin,
    spinName: 'FOOD',
  }

  const fetchData = async () => {
    try {
      const spinsCollection = await FirestoreService.getSpinsCollection();
      if (spinsCollection.length === 0) {
        await FirestoreService.addSpinToUser(originalSpin);
      } else {
        const firstSpin = spinsCollection[0];
        setSpinId(firstSpin.id);
        setSpinName(firstSpin.spinName);
        setSpinItems(firstSpin.spinItems);
        setSpinColor(firstSpin.spinColor);
        setSpinColorName(Object.keys(ColorThemes).find(key => JSON.stringify(ColorThemes[key]) === JSON.stringify(firstSpin.spinColor)));
      }
      setDataLoaded(true);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataLoaded]);

  const spinSelectHandler = async (spinId) => {
    try {
      const spins = await FirestoreService.getSpinsCollection();
      const selectedSpin = spins.find(s => s.id === spinId);
      if (selectedSpin) {
        console.log("Spin selectedSpin: ", selectedSpin);
        setSpinId(selectedSpin.id);
        setSpinName(selectedSpin.spinName);
        setSpinItems(selectedSpin.spinItems);
        setSpinColor(selectedSpin.spinColor);
        setSpinColorName(Object.keys(ColorThemes).find(key => JSON.stringify(ColorThemes[key]) === JSON.stringify(selectedSpin.spinColor)));
      } else {
        fetchData();
      }
    } catch (error) {
      console.log("Error selecting spin: ", error);
    }
  }

  return (
    <View style={styles.container}>
      {dataLoaded && (
        <>
          <Header spinSelectHandler={spinSelectHandler} />
          <SpinWheel spinName={spinName} spinItems={spinItems} spinColor={spinColor} />
          <EditSpin spinId={spinId} spinColorName={spinColorName} />
        </>
      )}
      {!dataLoaded &&
        <View style={styles.waitingView}>
          <ActivityIndicator size="large" color={Colors.DEEP_RED} />
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_BACKGROUND,
  },
  waitingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})