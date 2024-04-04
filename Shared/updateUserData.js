import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase-files/FirebaseSetup';
import { onSnapshot, collection, query, where } from "firebase/firestore";
import FirestoreService from '../firebase-files/FirebaseHelpers';

export const getUpdatedUserData = () => {
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [avatarUri, setAvatarUri] = useState(null);
    const [coords, setCoords] = useState(null);
    // const [spins, setSpins] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(
                collection(firestore, "users"),
                where("uid", "==", auth.currentUser.uid)
            ),
            (querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log("Cannot find user data in firestore.");
                    return;
                }
                setAvatarUri({ uri: querySnapshot.docs[0].data().avatar });
                setUsername(querySnapshot.docs[0].data().username);
                setEmail(querySnapshot.docs[0].data().email);
                setCoords(querySnapshot.docs[0].data().coords);

                // const spinsData = await FirestoreService.getSpinsCollection();
                // setSpins(spinsData)
            },
            (error) => {
                console.error(error.message);
            }
        );
        return () => {
            unsubscribe();
        };
    }, []);

    return { username, avatarUri, email, coords };
};
