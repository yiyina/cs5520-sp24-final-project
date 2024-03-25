import * as ImagePicker from 'expo-image-picker';

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
}

export default CameraService;