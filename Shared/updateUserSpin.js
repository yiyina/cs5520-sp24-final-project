import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase-files/FirebaseSetup';
import { onSnapshot, collection, doc } from "firebase/firestore";
import FirestoreService from '../firebase-files/FirebaseHelpers';

export const getUpdatedUserSpin = () => {
    const [spins, setSpins] = useState(null);

    useEffect(() => {
        const fetchSpins = async () => {
            const uid = auth.currentUser.uid;
            const userDocId = await FirestoreService.getUserDocId(uid);
            if (!userDocId) {
                console.error("User document ID not found for UID:", uid);
                return;
            }
            const spinsCollectionRef = collection(firestore, "users", userDocId, "spins");

            // This returns the unsubscribe function
            return onSnapshot(
                spinsCollectionRef,
                (querySnapshot) => {
                    if (querySnapshot.empty) {
                        console.log("No spins data found in firestore for user:", uid);
                        return;
                    }
                    const spinsData = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setSpins(spinsData);
                },
                (error) => {
                    console.error("Error fetching spins data: ", error);
                }
            );
        };

        let unsubscribe;

        // Call the async function and store the unsubscribe function
        fetchSpins().then(unsub => {
            unsubscribe = unsub;
        });

        // Cleanup function
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    return { spins };
};