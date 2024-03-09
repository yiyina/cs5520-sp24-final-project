import { firestore } from "./FirebaseSetup";
import { auth } from "./FirebaseSetup";
import {
    collection,
    getDoc,
    getDocs,
    addDoc,
    query,
    where,
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    updateDoc,
    doc,
    deleteDoc,
    orderBy,
    getFirestore,
} from "firebase/firestore";

const FirestoreService = {
    async addUser(user) {
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

    async checkUsernameExists(username) {
        try {
            const querySnapshot = await getDocs(query(collection(firestore, 'users'), where('username', '==', username)));
            return querySnapshot.size > 0;
        } catch (error) {
            console.error("Error checking username existence: ", error);
            throw error;
        }
    },

    async checkEmailExists(email) {
        try {
            const querySnapshot = await getDocs(query(collection(firestore, 'users'), where('email', '==', email)));
            return querySnapshot.size > 0;
        } catch (error) {
            console.error("Error checking email existence: ", error);
            throw error;
        }
    },

    async getUserData (userDocId) {
        try {
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

    async updateUserAvatar(uid, avatarUri) {
        try {
            const userDocId = await this.getUserDocId(uid);
            if (userDocId) {
                const firestore = getFirestore();
                const userDocRef = doc(firestore, "users", userDocId);
                await updateDoc(userDocRef, {
                    avatar: avatarUri
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

                await setDoc(newPhotoRef, {
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

}

export default FirestoreService;