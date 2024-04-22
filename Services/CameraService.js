import { Alert } from 'react-native';
import FirestoreService from '../firebase-files/FirebaseHelpers';
import * as ImagePicker from 'expo-image-picker';

class CameraService {
    static async handleImageCaptured(imageUri, type, location = null) {
        Alert.alert(
            "Upload Photo",
            `Do you want to upload this photo to your ${type}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        console.log("Yes pressed");
                        try {
                            let url;
                            if (type === 'avatar' || type === 'gallery') {
                                console.log("Calling uploadToStorage");
                                url = await FirestoreService.uploadToStorage(imageUri, type);
                                if (type === 'avatar') {
                                    await FirestoreService.updateUserAvatar(url);
                                    Alert.alert("Success", "Avatar updated successfully.");
                                } else if (type === 'gallery' && location) {
                                    await FirestoreService.addPhotoToGallery(url, location);
                                    Alert.alert("Success", "Photo added to gallery successfully.");
                                }
                            }
                            console.log(`${type} updated:`, url);
                        } catch (error) {
                            console.error(`Error in handling image capture for ${type}:`, error);
                            Alert.alert("Error", "Failed to upload the photo. Please try again.");
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    }

    static async takePicture(cameraRef, type, location = null) {
        if (!cameraRef.current) {
            console.error("No camera ref found.");
            return;
        }

        try {
            let photo = await cameraRef.current.takePictureAsync();
            console.log("Picture taken: ", photo.uri);
            // Correct static method call
            await CameraService.handleImageCaptured(photo.uri, type, location);
        } catch (error) {
            console.error("Error in taking picture:", error);
        }
    }

    static async pickImage(cameraRef, type, location = null) {
        try {
            let photo = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

            if (photo.canceled) {
                console.log("Image picking canceled.");
                return;
            }

            // console.log("Image picked: ", photo.assets[0].uri);
            let photoUri = photo.assets[0].uri;
            await CameraService.handleImageCaptured(photoUri, type, location);
        } catch (error) {
            console.error("Error in picking image from gallery:", error);
        }
    }
}

export default CameraService;