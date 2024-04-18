import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase-files/FirebaseSetup';
import { onSnapshot, collection, query, where,doc } from "firebase/firestore";
import FirestoreService from '../firebase-files/FirebaseHelpers';

export const getUpdatedUserData = () => {
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [avatarUri, setAvatarUri] = useState(null);
    const [coords, setCoords] = useState(null);
    const [gallery, setGallery] = useState([]);

    useEffect(() => {
        let galleryUnsubscribe;
        const unsubscribe = onSnapshot(
            query(collection(firestore, "users"), where("uid", "==", auth.currentUser.uid)),
            (querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log("Cannot find user data in firestore.");
                    return;
                }
                const userData = querySnapshot.docs[0].data();
                setAvatarUri(userData.avatar ? { uri: userData.avatar } : null);
                setUsername(userData.username);
                setEmail(userData.email);
                setCoords(userData.coords);
                setUpGalleryListener(querySnapshot.docs[0].id);
            },
            (error) => {
                console.error(error.message);
            }
        );

        const setUpGalleryListener = (userDocId) => {
            const galleryRef = collection(firestore, "users", userDocId, "gallery");
            galleryUnsubscribe = onSnapshot(galleryRef, (snapshot) => {
                const galleryImages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setGallery(galleryImages);
            });
        };

        return () => {
            unsubscribe();
            if (galleryUnsubscribe) galleryUnsubscribe();
        };
    }, []);

    return { username, avatarUri, email, coords, gallery };
};
