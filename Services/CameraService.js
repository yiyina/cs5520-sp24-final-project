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

    static async handleImageCaptured(imageUri, setAvatarUri) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            const userDocId = await FirestoreService.getUserDocId(user.uid);
            if (userDocId) {
                setAvatarUri({ uri: imageUri });
            } else {
                console.error("No user document found for UID:", user.uid);
            }
        } catch (error) {
            console.error("Error updating user avatar: ", error);
        }
    }
}

export default CameraService;