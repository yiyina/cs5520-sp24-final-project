import { StyleSheet, View, Text,TouchableOpacity,Modal } from 'react-native'
import React,{ useState }  from 'react'
import Colors from '../Shared/Colors'
// import Avatar from '../Shared/Avatar';
// import { getUpdatedUserData } from '../Shared/updateUserData';
import UserGallery from '../Components/UserGallery';
import CameraScreen from './CameraScreen';
import CameraService from '../Services/CameraService';




export default function Gallery() {
  // const { avatarUri } = getUpdatedUserData();
  const [showCamera, setShowCamera] = useState(false);
 

  const toggleCamera = () => {
    setShowCamera(!showCamera);
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userGalleryTitle}>User Gallery</Text>
        {/* <TouchableOpacity style={styles.cameraButton} onPress={toggleCamera}>
                    <Text style={styles.cameraButtonText}>Open Camera</Text>
        </TouchableOpacity> */}
         <Modal
                visible={showCamera}
                animationType="slide"
                transparent={true}
            >
                <CameraScreen
                    showCamera={showCamera}
                    onCancel={() => setShowCamera(false)}
                    type={'gallery'} // Assume 'gallery' type for demonstration
                    onImageCaptured={(imageUri) => {
                        CameraService.handleImageCaptured(imageUri, 'gallery');
                        // Here you would handle the captured image URI, such as uploading it
                        setShowCamera(false);
                    }}
                />
            </Modal>
        {/* <View style={styles.avatarContainer}>
          <Avatar avatarUri={avatarUri} size={100} />
        </View> */}
      </View>
      <View style={styles.body}>
        <View style={styles.UserGallerycontainer}>
          <UserGallery />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    backgroundColor: Colors.MAIN_BACKGROUND,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  header: {
    position: 'absolute',
    zIndex: 1,
    marginTop: 50,
    // alignItems: 'center',
    left: 20,
    width: '100%',
  },
  // avatarContainer: {
  //   borderWidth: 5,
  //   borderColor: Colors.BORDER_GOLD,
  //   borderRadius: 100,
  //   backgroundColor: Colors.MAIN_BACKGROUND,
  // },
  // avatar: {
  //   width: 100,
  //   height: 100,
  //   borderRadius: 100,
  // },
  // editAvatar: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  body: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    marginTop: 100,
    marginBottom: 50,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.DEEP_RED,
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  UserGallerycontainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
  },
  userGalleryTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 50,
    color: Colors.TEXT_COLOR,
  },
   cameraButton: {
    backgroundColor: Colors.DEEP_RED, // Set button background color
    paddingVertical: 10, // Adjust button padding
    paddingHorizontal: 20,
    borderRadius: 10, // Apply border radius
  },
})