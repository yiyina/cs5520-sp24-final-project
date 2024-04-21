import React, { useState, useEffect } from 'react';
import { ScrollView, View, Image, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import Colors from '../Shared/Colors';
import { getUpdatedUserData } from '../Shared/updateUserData';
import FirestoreService from '../firebase-files/FirebaseHelpers'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation,useRoute } from '@react-navigation/native';


export default function UserGallery() {
  
  const [groupedImages, setGroupedImages] = useState({});
  const { gallery } = getUpdatedUserData();
  const navigation = useNavigation();




  useEffect(() => {
    groupImages(gallery);
  }, [gallery]);
  console.log("gallery: ", gallery);
  const groupImages = (gallery) => {
  const groups = gallery.reduce((acc, img) => {
    const date = img.createdAt.toDate().toDateString();
    if (!acc[date]) acc[date] = { images: [], locations: new Set() };
    acc[date].images.push(img);
    acc[date].locations.add(img.location || 'No location');  // Using Set to avoid duplicate locations
    return acc;
  }, {});

  const sortedGroups = Object.keys(groups).sort().reduce(
    (obj, key) => {
      obj[key] = {
        images: groups[key].images,
        locations: Array.from(groups[key].locations)  // Convert Set to Array for rendering
      };
      return obj;
    },
    {}
  );

  setGroupedImages(sortedGroups);
};


  const handleDelete = (image) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteImage(image) }
      ]
    );
  };

  const deleteImage = async (image) => {
    try {
      await FirestoreService.deletePhoto(image.id); // Make sure you have a method to delete the photo by ID
      const updatedGallery = gallery.filter(img => img.id !== image.id);
      groupImages(updatedGallery); // Re-group images without the deleted one
    } catch (error) {
      console.error("Error deleting the photo: ", error);
      Alert.alert("Error", "Failed to delete the photo.");
    }
  };
  



  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {Object.entries(groupedImages).map(([date, data]) => (
          <View key={date} style={styles.dateGroup}>
            <View style={styles.dateAndIconContainer}>
              <Text style={styles.dateText}>{date}</Text>
            </View>
            <View style={styles.imageGroup}>
              {data.images.map((img) => (
                <View key={img.id} style={styles.imageContainer}>
                  <Image source={{ uri: img.url }} style={styles.image} />
                  <Text style={styles.imageLocationText}>{img.location || 'No location'}</Text>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(img)}>
                    <Icon name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
  container: {
    padding: 10,
  },
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  dateAndIconContainer: {
    flexDirection: 'column',
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: Colors.TEXT_COLOR,
    width: 60,
    fontWeight: 'bold',
  },
  imageGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start', // Change here to align items at the start
    marginLeft: 10,
    marginRight: 20,
  },
  imageContainer: {
    position: 'relative',
    margin: 10,
    alignItems: 'center', // Center items vertically in the container
  },
  image: {
    width: 120,
    height: 120,
    borderWidth: 3,
    borderColor: Colors.WHITE,
  },
  imageLocationText: {
    marginTop: 5, // Margin to separate the text from the image
    fontSize: 12,
    color: Colors.TEXT_COLOR,
    textAlign: 'center', // Center the text under the image
    width: 120, // Match the width of the image
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
});
