import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SectionList, FlatList, View, Image, StyleSheet, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import Colors from '../Shared/Colors';
import { getUpdatedUserData } from '../Shared/updateUserData';
import FirestoreService from '../firebase-files/FirebaseHelpers';
import Icon from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// A single photo tile. Memoized so that re-rendering one day's strip does not
// re-render every thumbnail inside it.
const GalleryTile = React.memo(function GalleryTile({ img, onPress, onDelete }) {
  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={() => onPress(img)}>
        <Image source={{ uri: img.url }} style={styles.image} />
        <Text numberOfLines={1} style={styles.imageLocationText}>{img.location || 'No location'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(img)}>
        <Icon name="close" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
});

// One day's horizontal strip of photos.
const GalleryRow = React.memo(function GalleryRow({ images, onPress, onDelete }) {
  const renderTile = useCallback(
    ({ item }) => <GalleryTile img={item} onPress={onPress} onDelete={onDelete} />,
    [onPress, onDelete]
  );

  return (
    <FlatList
      data={images}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.imageScrollView}
      keyExtractor={(img) => img.id}
      renderItem={renderTile}
      removeClippedSubviews={true}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={5}
    />
  );
});

export default function UserGallery() {
  const [groupedImages, setGroupedImages] = useState({});
  const { gallery } = getUpdatedUserData();
  const navigation = useNavigation();

  // Function to handle the image press and navigate to the search screen
  const handleImagePress = useCallback((image) => {
    navigation.navigate('Search', { query: image.location });
  }, [navigation]);

  // Group the images by date
  useEffect(() => {
    groupImages(gallery);
  }, [gallery]);

  // Group the images by date and set the state
  const groupImages = (gallery) => {
    const groups = gallery.reduce((acc, img) => {
      const date = img.createdAt.toDate().toISOString().slice(0, 10);
      if (!acc[date]) acc[date] = { images: [], locations: new Set() };
      acc[date].images.push(img);
      acc[date].locations.add(img.location || 'No location');
      return acc;
    }, {});

    // Sort the groups by date in descending order
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

  // Function to delete the image from the gallery
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

  // Function to handle the delete button press
  const handleDelete = useCallback((image) => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to delete this photo?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteImage(image) }
      ]
    );
  }, [gallery]);

  // SectionList needs every section to carry an array of rows. Each day is a
  // section holding exactly one row, and that row is the day's horizontal strip.
  const sections = useMemo(
    () => Object.entries(groupedImages).map(([date, data]) => ({ date, data: [data.images] })),
    [groupedImages]
  );

  const renderRow = useCallback(
    ({ item }) => <GalleryRow images={item} onPress={handleImagePress} onDelete={handleDelete} />,
    [handleImagePress, handleDelete]
  );

  const renderSectionHeader = useCallback(
    ({ section }) => <Text style={styles.dateText}>{section.date}</Text>,
    []
  );

  return (
    <SectionList
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      sections={sections}
      keyExtractor={(item, index) => `row-${index}`}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderRow}
      stickySectionHeadersEnabled={false}
      removeClippedSubviews={true}
      initialNumToRender={3}
      maxToRenderPerBatch={3}
      windowSize={5}
    />
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
  dateText: {
    fontSize: 16,
    color: Colors.TEXT_COLOR,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageScrollView: {
    flexDirection: 'row',
    marginBottom: 20,
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
