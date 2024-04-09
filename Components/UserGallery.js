import React, { useState, useEffect } from 'react';
import { ScrollView, View, Image, StyleSheet, Text } from 'react-native';
import FirestoreService from '../firebase-files/FirebaseHelpers'; 
import { getUpdatedUserData } from '../Shared/updateUserData';

export default function UserGallery() {
    const { gallery } = getUpdatedUserData();


    // useEffect(() => {
    //     const fetchImages = async () => {
    //         try {
    //             const galleryImages = await FirestoreService.getGalleryImages(uid);
    //             console.log("Gallery Images: ", galleryImages);
    //             setImages(galleryImages);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };

    //     fetchImages();
    // }, [uid]);

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                {gallery.map((img, index) => (
                    <Image key={index} source={{ uri: img.url }} style={styles.image} />
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    image: {
        width: 100, // Adjust based on your needs
        height: 100,
        marginVertical: 10,
    },
});
