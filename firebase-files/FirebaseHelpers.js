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
    deleteDoc
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

    async getUserData() {
        try {
            const uid = auth.currentUser.uid;
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

    async uploadToStorage(fileUri, type) {
        try {
            const uid = auth.currentUser.uid;
            if (!uid || !fileUri) {
                throw new Error("Invalid parameters for uploadToStorage");
            }
    
            // Determine the storage path based on the type of image
            let storagePath;
            switch (type) {
                case 'avatar':
                    storagePath = `user_avatars/${uid}/`;
                    break;
                case 'gallery':
                    storagePath = `user_gallery/${uid}/`;
                    break;
                default:
                    throw new Error("Invalid image type for uploadToStorage");
            }
    
            const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
            const fileRef = storageRef(storage, `${storagePath}${fileName}`);
    
            // Convert the file URI to a blob for uploading
            const response = await fetch(fileUri);
            const blob = await response.blob();
    
            // Upload the file
            await uploadBytes(fileRef, blob);
    
            // After upload, get the file's download URL
            const downloadURL = await getDownloadURL(fileRef);
    
            return downloadURL;
        } catch (error) {
            console.error("Error uploading to storage:", error);
            throw error;
        }
    },


    async updateUserAvatar(avatarUri) {
        try {
            const uid = auth.currentUser.uid;
            if (!uid || (avatarUri !== null && typeof avatarUri !== 'string')) {
                throw new Error("Invalid parameters for updateUserAvatar");
            }

            let url = avatarUri;
            if (avatarUri) {
                url = await this.uploadToStorage(avatarUri, 'avatar');
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

    async addPhotoToGallery(fileUri) {
        console.log("Adding photo to gallery: ", fileUri);
        try {
            if (!fileUri) {
                throw new Error("Invalid file URI for addPhotoToGallery.");
            }
            const imageUrl = await this.uploadToStorage(fileUri, 'gallery');

            // Reference to the user's gallery collection
            const uid = auth.currentUser.uid;
            if (!uid) {
                throw new Error("Invalid parameters for addPhotoToGallery.");
            }
            const userDocId = await this.getUserDocId(uid);
            if (!userDocId) {
                throw new Error(`User document not found for UID: ${uid}`);
            }

            const galleryRef = collection(firestore, `users/${userDocId}/gallery`);

            // Add a new document in the gallery collection with the image URL
            const docRef = await addDoc(galleryRef, {
                url: imageUrl,
                createdAt: new Date()
            });

            console.log("Gallery image added with ID:", docRef.id);
        } catch (error) {
            console.error("Error adding photo to gallery:", error);
            throw error;
        }
    },

    async addCurrentLocation(location) {
        try {
            const uid = auth.currentUser.uid;
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

    async removeAvatarFieldFromUser() {
        try {
            const uid = auth.currentUser.uid;
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
    async deleteAvatarFileFromStorage() {
        try {
            const uid = auth.currentUser.uid;
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


    async updateEmailForUser(newEmail) {
        try {
            const user = auth.currentUser;
            console.log("Updating email for user: ", user.uid, newEmail);
            
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

            const userDocId = await this.getUserDocId(user.uid);
            if (!userDocId) {
                throw new Error("No user document found for UID: " + user.uid);
            }
            const userDocRef = doc(firestore, "users", userDocId);
            await updateDoc(userDocRef, { email: newEmail });
        } catch (error) {
            console.error("Error updating email for user: ", error);
            throw error;
        }
    },

    async updateDocuments(fieldsToUpdate, subcollectionPath = null) {
        try {
            const uid = auth.currentUser.uid;
            if (!uid) {
                throw new Error("User is not authenticated.");
            }
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

    async addSpinToUser(spin, spinId) {
        try {
            const uid = auth.currentUser.uid;
            if (!uid) {
                throw new Error("User is not authenticated.");
            }
            const userDocId = await this.getUserDocId(uid);
            if (!userDocId) {
                throw new Error("User document not found for UID: " + uid);
            }

            const spinsCollectionRef = collection(firestore, "users", userDocId, "spins");

            if (spinId) {
                const spinDocRef = doc(spinsCollectionRef, spinId);
                console.log("Updating spin: ", spinDocRef);
                await updateDoc(spinDocRef, spin);
            } else {
                await addDoc(spinsCollectionRef, spin);
            }
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

            const spinsData = querySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            });
            return spinsData;
        } catch (error) {
            console.error("Error getting spin collection: ", error);
            throw error;
        }
    },

    async deleteSpin(spinId) {
        try {
            const userDocId = await this.getUserDocId(auth.currentUser.uid);
            const spinDocRef = doc(firestore, "users", userDocId, "spins", spinId);
            await deleteDoc(spinDocRef);
        } catch (error) {
            console.error("Error deleting spin: ", error);
            throw error;
        }
    },

    async addSpinResultToUser(result) {
        try {
            const userDocId = await this.getUserDocId(auth.currentUser.uid);
            if (!userDocId) {
                throw new Error("User document not found for UID: " + uid);
            }
            const userDocRef = doc(firestore, "users", userDocId);
            const docSnapshot = await getDoc(userDocRef);
            if (!docSnapshot.exists()) {
                throw new Error("User document does not exist.");
            }
            const spinResults = docSnapshot.data().spinResults || {};
            const currentCount = spinResults[result] || 0;

            await updateDoc(userDocRef, {
                spinResults: {
                    ...spinResults,
                    [result]: currentCount + 1
                }
            });
        } catch (error) {
            console.error("Error updating spin results: ", error);
            throw error;
        }
    }
    // async getGalleryImages(uid) {
    //     try {
    //         const userDocId = await this.getUserDocId(uid);
    //         const galleryCollectionRef = collection(firestore, "users", userDocId, "gallery");
    //         const querySnapshot = await getDocs(galleryCollectionRef);
    //          console.log("querySnapshot: ", querySnapshot);


    //          const galleryData = querySnapshot.docs.map(doc => {
    //              return {
    //                  id: doc.id,
    //                  ...doc.data()
    //              };}        
    //         );
    //         return galleryData;
    //     } catch (error) {
    //         console.error("Error getting galley collection: ", error);
    //         throw error;
    //     }
    // },
}

export default FirestoreService;