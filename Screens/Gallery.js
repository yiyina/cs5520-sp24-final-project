import { StyleSheet, View, Dimensions } from 'react-native'
import React from 'react'
import Colors from '../Shared/Colors'
import UserGallery from '../Components/UserGallery';

export default function Gallery() {

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <UserGallery />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.MAIN_BACKGROUND,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.15,
    backgroundColor: Colors.WHITE,
  },
  userGalleryTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.TEXT_COLOR,
    paddingLeft: Dimensions.get('window').width * 0.05,
    paddingTop: Dimensions.get('window').height * 0.08,
  },
  body: {
    flex: 1,
    width: '100%',
    marginTop: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
