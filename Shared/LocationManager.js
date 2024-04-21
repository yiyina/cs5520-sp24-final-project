import * as Location from 'expo-location';
import FirestoreService from '../firebase-files/FirebaseHelpers';

export async function getLocation() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted') {
      console.log('Permission not granted');
      return null;
    }
    const location = await Location.getCurrentPositionAsync();
    FirestoreService.addCurrentLocation(location);
    return location;
  } catch (error) {
    console.log(error);
  }
}
