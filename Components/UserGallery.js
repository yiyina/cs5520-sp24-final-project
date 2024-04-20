import React, { useState, useEffect } from 'react';
import { ScrollView, View, Image, StyleSheet, Text } from 'react-native';
import Colors from '../Shared/Colors';
import { getUpdatedUserData } from '../Shared/updateUserData';

export default function UserGallery() {
  const [groupedImages, setGroupedImages] = useState({});

  // Assuming `gallery` is fetched and stored in state
  const { gallery } = getUpdatedUserData(); 

  useEffect(() => {
    // Group images by date
    const groups = gallery.reduce((acc, img) => {
      // Convert createdAt to a Date object and format it to a simple date string
      const date = img.createdAt.toDate().toDateString();
      
      // Initialize the array if the date key doesn't exist
      if (!acc[date]) {
        acc[date] = [];
      }

      // Push the current image to the correct date key
      acc[date].push(img);
      
      return acc;
    }, {});

    // Sort the groups by date
    const sortedGroups = Object.keys(groups).sort().reduce(
      (obj, key) => { 
        obj[key] = groups[key];
        return obj;
      }, 
      {}
    );

    setGroupedImages(sortedGroups);
  }, [gallery]);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {Object.entries(groupedImages).map(([date, images]) => (
          <View key={date} style={styles.dateGroup}>
            <Text style={styles.dateText}>{date}</Text>
            <View style={styles.imageGroup}>
              {images.map((img, index) => (
                <Image key={index} source={{ uri: img.url }} style={styles.image} />
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
  dateText: {
    fontSize: 16,
    color: Colors.TEXT_COLOR,
    width: 50, // Set a fixed width for the date column
  },
  imageGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10, // Give some space after the date column
  },
  image: {
    width: 100, 
    height: 100,
    margin: 5,
    borderWidth: 3,
    borderColor: Colors.WHITE,
  },
});
