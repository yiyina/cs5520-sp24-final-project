import * as Location from 'expo-location';
import FirestoreService from '../firebase-files/FirebaseHelpers';
import { auth } from '../firebase-files/FirebaseSetup';

export async function getLocation() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted') {
      console.log('Permission not granted');
      return null;
    }
    const location = await Location.getCurrentPositionAsync();
    FirestoreService.addCurrentLocation(auth.currentUser.uid, location);
    return location;
  } catch (error) {
    console.log(error);
  }
}
