import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase-files/FirebaseSetup';
import { onSnapshot, collection } from "firebase/firestore";
import FirestoreService from '../firebase-files/FirebaseHelpers';

export const getUpdatedUserSpin = () => {
    const [spins, setSpins] = useState(null);

    useEffect(() => {
        let unsubscribeSpins;

        const uid = auth.currentUser?.uid;
        if (uid) {
            FirestoreService.getUserDocId(uid).then(userDocId => {
                if (userDocId) {
                    const spinsCollectionRef = collection(firestore, "users", userDocId, "spins");
                    unsubscribeSpins = onSnapshot(
                        spinsCollectionRef,
                        (querySnapshot) => {
                            const newSpins = querySnapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data()
                            }));
                            setSpins(newSpins);
                        },
                        (error) => {
                            console.error("Snapshot error:", error);
                        }
                    );
                } else {
                    console.error("User document ID not found for UID:", uid);
                }
            }).catch(error => {
                console.error("Error fetching user document ID:", error.code);
                if (error.code === 'permission-denied') {
                    unsubscribe();
                }
            });
        } else {
            // User is not logged in or the UID is null.
            setSpins(null);
        }

        // Cleanup function
        return () => {
            if (unsubscribeSpins) {
                unsubscribeSpins();
            }
        };
    }, [auth.currentUser]);

    return { spins };
};
