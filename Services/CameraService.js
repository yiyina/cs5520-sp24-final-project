import * as ImagePicker from 'expo-image-picker';
import FirestoreService from '../firebase-files/FirebaseHelpers';
import { auth } from '../firebase-files/FirebaseSetup';

class CameraService {
    static async takePicture(cameraRef, type, handleImageAction) {
        if (cameraRef.current) {
            let photo = await cameraRef.current.takePictureAsync();
            console.log("takePicture photo: ", photo);
            handleImageAction(photo.uri, type);
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

   static async handleImageCaptured(imageUri, type) {
    try {
        const uid = auth.currentUser.uid;
        if (!uid) throw new Error("User not authenticated");

        // Now, use the 'type' to decide the next action
        if (type === 'avatar') {
            // Logic to update user's avatar
            const avatarUrl = await FirestoreService.uploadToStorage(uid, imageUri, 'avatar');
            await FirestoreService.updateUserAvatar(uid, avatarUrl);
            console.log("Avatar updated:", avatarUrl);
        } else if (type === 'gallery') {
            // Logic to add an image to the user's gallery
            const imageUrl = await FirestoreService.uploadToStorage(uid, imageUri, 'gallery');
            await FirestoreService.addPhotoToGallery(uid, imageUrl);
            console.log("Image added to gallery:", imageUrl);
        }
    } catch (error) {
        console.error("Error in handleImageCaptured:", error);
    }
}
}

export default CameraService;