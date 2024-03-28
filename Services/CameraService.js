import * as ImagePicker from 'expo-image-picker';
import FirestoreService from '../firebase-files/FirebaseHelpers';
import { auth } from '../firebase-files/FirebaseSetup';

class CameraService {
    static async takePicture(cameraRef, type, handleImageAction) {
        if (cameraRef.current) {
            let photo = await cameraRef.current.takePictureAsync();
            console.log("takePicture photo: ", photo);
            handleImageAction(photo.uri, type)
        }
    }

    static async pickImage(type, handleImageAction) {
        let photo = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if (photo && !photo.canceled) {
            if (photo.assets && photo.assets.length > 0) {
                let photoUri = photo.assets[0].uri;
                handleImageAction(photoUri, type);
            } else {
                console.error("No assets found in the photo response.");
            }
        }
    }

    static async handleImageCaptured(imageUri) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            const userDocId = await FirestoreService.getUserDocId(user.uid);
            console.log("handleImageCaptured User Doc ID: ", userDocId);
            if (userDocId) {
                console.log("Avatar Storage URI: ", imageUri);
            } else {
                console.error("No user document found for UID:", user.uid);
            }
        } catch (error) {
            console.error("CameraService handleImageCaptured Error updating user avatar: ", error);
        }
    }
}

export default CameraService;