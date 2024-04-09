import * as ImagePicker from 'expo-image-picker';
import FirestoreService from '../firebase-files/FirebaseHelpers';
import { auth } from '../firebase-files/FirebaseSetup';

class CameraService {
    static async takePicture(cameraRef, type) {
        if (cameraRef.current) {
            let photo = await cameraRef.current.takePictureAsync();
            console.log("takePicture photo: ", photo);
            await this.handleImageCaptured(photo.uri, type);
        }
    }

    static async pickImage(type) {
        let photo = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });
        if (photo && !photo.canceled) {
            if (photo.assets && photo.assets.length > 0) {
                let photoUri = photo.assets[0].uri;
                await this.handleImageCaptured(photoUri, type);
            } else {
                console.error("No assets found in the photo response.");
            }
        }
    }

    static async handleImageCaptured(imageUri, type) {
        try {
            const uid = auth.currentUser.uid;
            if (!uid) throw new Error("User not authenticated");
            let url;
            // Decide action based on type and upload image if necessary
            if (type === 'avatar' || type === 'gallery') {
                url = await FirestoreService.uploadToStorage(uid, imageUri, type);
                if (type === 'avatar') {
                    await FirestoreService.updateUserAvatar(uid, url);
                } else if (type === 'gallery') {
                    await FirestoreService.addPhotoToGallery(uid, url);
                }
            }
            console.log(`${type} updated:`, url);
        } catch (error) {
            console.error(`Error in handling image capture for ${type}:`, error);
        }
    }
}

export default CameraService;