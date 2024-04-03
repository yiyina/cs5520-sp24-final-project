import { firestore, auth, storage, updateEmail } from "./FirebaseSetup";
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
    deleteField,
    setDoc
} from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

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
            console.error("getUserData Error fetching user data: ", error);
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
            if (!uid || (avatarUri !== null && typeof avatarUri !== 'string')) {
                throw new Error("Invalid parameters for updateUserAvatar");
            }

            let url = avatarUri;
            if (avatarUri) {
                url = await this.uploadToStorage(uid, avatarUri);
            }
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
            console.error("FirebaseHelper updateUserAvatar Error updating user avatar: ", error);
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
    },

    async removeAvatarFieldFromUser(uid) {
        try {
            if (!uid) {
                throw new Error("Invalid UID for removeAvatarFieldFromUser");
            }
            const userDocId = await this.getUserDocId(uid);
            if (userDocId) {
                const userDocRef = doc(firestore, "users", userDocId);
                // Correctly use deleteField() to remove the 'avatar' field
                await updateDoc(userDocRef, {
                    avatar: deleteField()
                });
            } else {
                console.error("No user document found for UID:", uid);
            }
        } catch (error) {
            console.error("Error removing avatar field:", error);
            throw error;
        }
    },
    async deleteAvatarFileFromStorage(uid) {
        try {
            const userDocData = await this.getUserData(uid);
            console.log("User data for UID:", uid, userDocData);
            if (!userDocData || !userDocData.avatar) {
                console.log("No avatar to delete for UID:", uid);
                return;
            }
            const filePath = userDocData.avatar;
            console.log("Deleting avatar from Firebase Storage for UID:", uid);
            const fileRef = storageRef(storage, filePath);
            await deleteObject(fileRef);
            console.log("Avatar successfully deleted from Firebase Storage for UID:", uid);
        } catch (error) {
            console.error("Error deleting avatar from Firebase Storage:", error);
            throw error;
        }
    },
    async doesEmailExist(email) {
        const querySnapshot = await getDocs(query(collection(firestore, "users"), where("email", "==", email)));
        return !querySnapshot.empty; // Returns true if an email exists, false otherwise
    },

    async updateEmailForUser(uid, newEmail) {
        console.log("Updating email for user: ", uid, newEmail);
        try {
            const user = auth.currentUser;
            if (user) {
                try {
                    updateEmail(user, newEmail);
                    console.log("Email updated successfully.");
                } catch (error) {
                    console.error("Error updating email: ", error);
                    throw error;
                }
            } else {
                console.error("Current user is not available.");
            }

            const userDocId = await this.getUserDocId(uid);
            if (!userDocId) {
                throw new Error("No user document found for UID: " + uid);
            }
            const userDocRef = doc(firestore, "users", userDocId);
            await updateDoc(userDocRef, { email: newEmail });
        } catch (error) {
            console.error("Error updating email for user: ", error);
            throw error;
        }
    },

    async updateDocuments(uid, fieldsToUpdate, subcollectionPath = null) {
        try {
            const userDocId = await this.getUserDocId(uid);
            if (!userDocId) {
                throw new Error("User document not found for UID: " + uid);
            }

            const collectionPath = subcollectionPath ?
                `users/${userDocId}/${subcollectionPath}` :
                `users/${userDocId}`;

            Object.keys(fieldsToUpdate).forEach(key => {
                if (fieldsToUpdate[key] === null) {
                    delete fieldsToUpdate[key];
                }
            });

            const docRef = doc(firestore, collectionPath);
            await updateDoc(docRef, fieldsToUpdate);
        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                console.log("There is no way to reauthenticate the user from here.");
            } else {
                console.error("Error updating documents: ", error);
                throw error;
            }
        }
    },

    async addSpinToUser(spin) {
        try {
            const userDocId = await this.getUserDocId(auth.currentUser.uid);
            if (!userDocId) {
                throw new Error("User document not found for UID: " + uid);
            }
            const spinsCollectionRef = collection(firestore, "users", userDocId, "spins");
            await addDoc(spinsCollectionRef, spin);
        } catch (error) {
            console.error("Error adding spin to user: ", error);
            throw error;
        }
    },

    async getSpinsCollection() {
        try {
            const userDocId = await this.getUserDocId(auth.currentUser.uid);
            if (!userDocId) {
                throw new Error("User document not found for UID: " + auth.currentUser.uid);
            }
            const spinsCollectionRef = collection(firestore, "users", userDocId, "spins");
            const querySnapshot = await getDocs(spinsCollectionRef);

            const spinData = [];
            querySnapshot.forEach((doc) => {
                const docId = doc.id;
                const docData = doc.data();
                docData.id = docId;
                spinData.push(docData);
            });
            return spinData;
        } catch (error) {
            console.error("Error getting spin collection: ", error);
            throw error;
        }
    }

}

export default FirestoreService;