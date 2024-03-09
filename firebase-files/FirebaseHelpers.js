import { firestore } from "./FirebaseSetup";
import {
    collection,
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
    orderBy
} from "firebase/firestore";

const FirestoreService = {
    async addUser(user) {
        try {
            const docRef = await addDoc(collection(firestore, "users"), user);
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

    async getUsers() {
        try {
            const users = [];
            const querySnapshot = await getDocs(collection(firestore, "users"));
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            return users;
        } catch (error) {
            console.error("Error getting users: ", error);
            throw error;
        }
    },

    async uploadImage(userId, imageUri, imageType) {
        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const storage = getStorage();
            const imagePath = `users/${userId}/${imageType}/${new Date().toISOString()}`;
            const storageReference = ref(storage, imagePath);

            await uploadBytes(storageReference, blob);
            const url = await getDownloadURL(storageReference);
            return { url, imagePath };
        } catch (error) {
            console.error("Error uploading image: ", error);
            throw error;
        }
    },
}

export default FirestoreService;