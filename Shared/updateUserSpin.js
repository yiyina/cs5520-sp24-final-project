import { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase-files/FirebaseSetup';
import { onSnapshot, collection } from "firebase/firestore";
import FirestoreService from '../firebase-files/FirebaseHelpers';

export const getUpdatedUserSpin = () => {
    const [spins, setSpins] = useState(null);

    useEffect(() => {
        let unsubscribeSpins;

        const subscribeToSpins = (user) => {
            if (user) {
                FirestoreService.getUserDocId(user.uid).then(userDocId => {
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
                        console.error("User document ID not found for UID:", user.uid);
                    }
                }).catch(error => {
                    console.error("Error fetching user document ID:", error);
                    // Optionally handle specific errors
                });
            } else {
                // User is logged out, clean up any subscriptions
                if (unsubscribeSpins) {
                    unsubscribeSpins();
                }
                setSpins(null);
            }
        };

        // Subscribe to auth state changes
        const unsubscribeAuth = auth.onAuthStateChanged(subscribeToSpins);

        // Cleanup function
        return () => {
            unsubscribeAuth();
            if (unsubscribeSpins) {
                unsubscribeSpins();
            }
        };
    }, []);

    return { spins };
};
