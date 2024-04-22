import React, { useState, useEffect } from 'react';
import { ScrollView, View, Image, StyleSheet, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import Colors from '../Shared/Colors';
import { getUpdatedUserData } from '../Shared/updateUserData';
import FirestoreService from '../firebase-files/FirebaseHelpers';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function UserGallery() {

  const [groupedImages, setGroupedImages] = useState({});
  const { gallery } = getUpdatedUserData();
  const navigation = useNavigation();

  const handleImagePress = (image) => {
    console.log("image: ", image);
    navigation.navigate('Search', { query: image.location });
  };

  useEffect(() => {
    groupImages(gallery);
  }, [gallery]);
  // console.log("gallery: ", gallery);
  const groupImages = (gallery) => {
    const groups = gallery.reduce((acc, img) => {
      const date = img.createdAt.toDate().toISOString().slice(0, 10);
      if (!acc[date]) acc[date] = { images: [], locations: new Set() };
      acc[date].images.push(img);
      acc[date].locations.add(img.location || 'No location');
      return acc;
    }, {});

    const sortedGroups = Object.keys(groups).sort((a, b) => b.localeCompare(a)).reduce(
      (obj, key) => {
        obj[key] = {
          images: groups[key].images,
          locations: Array.from(groups[key].locations)
        };
        return obj;
      }, {}
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
            <Text style={styles.dateText}>{date}</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.imageScrollView}>
              {data.images.map((img) => (
                <View key={img.id} style={styles.imageContainer}>
                  <TouchableOpacity key={img.id} onPress={() => handleImagePress(img)}>
                    <Image source={{ uri: img.url }} style={styles.image} />
                    <Text numberOfLines={1} style={styles.imageLocationText}>{img.location || 'No location'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(img)}>
                    <Icon name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    marginTop: Dimensions.get('window').height * 0.05,
  },
  container: {
    padding: 10,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: Colors.TEXT_COLOR,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageScrollView: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginRight: 10,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: 120,
    height: 120,
  },
  imageLocationText: {
    fontSize: 12,
    color: Colors.DARK_GRAY,
    marginTop: 5,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 3,
    backgroundColor: Colors.BORDER_GOLD,
    opacity: 0.8,
  },
});
