import { firestore, auth, storage } from "./FirebaseSetup";
import {
    collection,
    getDoc,
    getDocs,
    addDoc,
    query,
    where,
    updateDoc,
    doc,
    getFirestore,
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const FirestoreService = {
    async addUser(user) {
        console.log("Adding user: ", user);
        try {
            const docRef = await addDoc(collection(firestore, "users"), {
                ...user,
                uid: auth.currentUser.uid,
            });
            console.log("Document written with ID: ", docRef.id);
            return docRef.id;
        } catch (error) {
            console.error("Error adding user: ", error);
            throw error;
        }
    },

    async getEmailByUsername(username) {
        console.log("Attempting to find email for username:", username);
        try {
            const querySnapshot = await getDocs(query(collection(firestore, "users"), where("username", "==", username)));
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                console.log("Found user data: ", userData);
                return userData.email;
            } else {
                console.log("No user found for username: ", username);
                return null;
            }
        } catch (error) {
            console.error("Error getting email by username: ", error);
            throw error;
        }
    },

    async getUserData(uid) {
        try {
            const userDocId = await this.getUserDocId(uid);
            const userDocRef = doc(firestore, "users", userDocId);
            const docSnapshot = await getDoc(userDocRef);
            if (docSnapshot.exists()) {
                return docSnapshot.data();
            } else {
                console.error("User document does not exist for id:", userDocId);
                return null;
            }
        } catch (error) {
            console.error("Error fetching user data: ", error);
            throw error;
        }
    },

    async getUserDocId(uid) {
        try {
            const firestore = getFirestore();
            const usersRef = collection(firestore, "users");
            const querySnapshot = await getDocs(query(usersRef, where("uid", "==", uid)));
            if (!querySnapshot.empty) {
                return querySnapshot.docs[0].id;
            } else {
                console.error("User not found for UID:", uid);
                return null;
            }
        } catch (error) {
            console.error("Error getting user: ", error);
            throw error;
        }
    },

    async uploadToStorage(uid, fileUri) {
        try {
            if (!uid || !fileUri) {
                throw new Error("Invalid parameters for uploadToStorage");
            }
    
            const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
            const ref = storageRef(storage, `user_avatars/${uid}/${fileName}`);
    
            const response = await fetch(fileUri);
            if (!response.ok) {
                throw new Error("Failed to fetch file for upload");
            }
    
            const blob = await response.blob();
            const snapshot = await uploadBytes(ref, blob);
            const downloadURL = await getDownloadURL(ref);
            const userDocId = await this.getUserDocId(uid);
            if (!userDocId) {
                throw new Error("No user document found for UID: " + uid);
            }
    
            const userDocRef = doc(firestore, "users", userDocId);
            await updateDoc(userDocRef, { avatar: downloadURL });
    
            return downloadURL;
        } catch (error) {
            console.error("Error uploading to storage: ", error);
            throw error;
        }
    },

    async updateUserAvatar(uid, avatarUri) {
        try {
            if (!uid || !avatarUri) {
                throw new Error("Invalid parameters for updateUserAvatar");
            }

            const url = await this.uploadToStorage(uid, avatarUri);
            const userDocId = await this.getUserDocId(uid);
            if (userDocId) {
                const firestore = getFirestore();
                const userDocRef = doc(firestore, "users", userDocId);
                await updateDoc(userDocRef, {
                    avatar: url
                });
            } else {
                console.error("No user document found for UID:", uid);
            }
        } catch (error) {
            console.error("Error updating user avatar: ", error);
            throw error;
        }
    },

    async addPhotoToGallery(uid, photoUri) {
        try {
            const userDocId = await this.getUserDocId(uid);
            if (userDocId) {
                const firestore = getFirestore();
                const galleryRef = collection(firestore, "users", userDocId, "gallery");
                const newPhotoRef = doc(galleryRef);

                await getDoc(newPhotoRef, {
                    url: photoUri,
                    date: new Date()
                });
            } else {
                console.error("No user document found for UID:", uid);
            }
        } catch (error) {
            console.error("Error adding photo to gallery: ", error);
            throw error;
        }
    },

    async addCurrentLocation(uid, location) {
        try {
            const userDocId = await this.getUserDocId(uid);
            if (userDocId) {
                const firestore = getFirestore();
                const userDocRef = doc(firestore, "users", userDocId);
                await updateDoc(userDocRef, {
                    coords: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    }
                });
                console.log("Location added for user:", userDocId);
            } else {
                console.error("No user document found for UID:", uid);
            }
        } catch (error) {
            console.error("Error updating user location: ", error);
            throw error;
        }
    }

}

export default FirestoreService;