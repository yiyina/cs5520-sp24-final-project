import { firestore } from "./FirebaseSetup";
import { collection, getDocs, addDoc, query, where, updateDoc, doc, deleteDoc, orderBy } from "firebase/firestore";

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

    async checkPassword(username, password) {
        try {
            const querySnapshot = await getDocs(query(collection(firestore, 'users'), where('username', '==', username)));
            if (querySnapshot.size === 0) {
                return false; // Username does not exist
            }
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            return userData.password === password;
        } catch (error) {
            console.error("Error checking password: ", error);
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
    }
}

export default FirestoreService;