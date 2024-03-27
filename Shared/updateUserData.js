import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase-files/FirebaseSetup';
import { onSnapshot, collection, query, where } from "firebase/firestore";

export const getUpdatedUserData = () => {
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [avatarUri, setAvatarUri] = useState(null);
    const [coords, setCoords] = useState(null);

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
                console.log("Query currentUser snapshot: ", querySnapshot.docs[0].data());
                setAvatarUri({ uri: querySnapshot.docs[0].data().avatar });
                setUsername(querySnapshot.docs[0].data().username);
                setEmail(querySnapshot.docs[0].data().email);
                setCoords(querySnapshot.docs[0].data().coords);
            },
            (error) => {
                console.error(error.message);
            }
        );
        return () => {
            unsubscribe();
        };
    }, []);

    return { username, avatarUri, email, coords};
};
