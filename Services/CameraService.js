import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import FirestoreService from '../firebase-files/FirebaseHelpers';

class CameraService {


 static async checkPermissions() {
     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return false;
        }
        return true;
    }
    static async takePicture(cameraRef, type, location = null) {
         const hasPermission = await this.checkPermissions();
        if (!hasPermission) return;

        try {
            if (cameraRef.current) {
                let photo = await cameraRef.current.takePictureAsync();
                console.log("takePicture photo: ", photo);
                await this.handleImageCaptured(photo.uri, type,location);
            }
        } catch(error) {
            console.error("Error in taking picture:", error);
        }
    }

    static async pickImage(type, location = null) {
         const hasPermission = await this.checkPermissions();
        if (!hasPermission) return;
        try {
            let photo = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });
            if (photo && !photo.canceled) {
                if (photo.assets && photo.assets.length > 0) {
                    let photoUri = photo.assets[0].uri;
                    await this.handleImageCaptured(photoUri, type,location);
                } else {
                    console.error("No assets found in the photo response.");
                }
            }
        } catch (error) {
            console.error("Error in picking image from gallery:", error);
        }
    }

    static async handleImageCaptured(imageUri, type, location = null) {
         Alert.alert(
            "Upload Photo",
            `Do you want to upload this photo to your ${type}`,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Upload cancelled"),
                    style: "cancel"
                },
                { 
                    text: "Yes", 
                    onPress: async () => {
                        try {
                            let url;
                            if (type === 'avatar' || type === 'gallery') {
                                url = await FirestoreService.uploadToStorage(imageUri, type);
                                if (type === 'avatar') {
                                    await FirestoreService.updateUserAvatar(url);
                                    Alert.alert("Success", "Avatar updated successfully.");
                                } else if (type === 'gallery'&& location) {
                                    await FirestoreService.addPhotoToGallery(url,location);
                                    Alert.alert("Success", "Photo added to gallery successfully.");
                                }
                            }
                            console.log(`${type} updated:`, url);
                        } catch (error) {
                            console.error(`Error in handling image capture for ${type}:`, error);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    }
}

export default CameraService;