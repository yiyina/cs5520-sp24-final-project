import { firestore } from "./FirebaseSetup";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, orderBy } from "firebase/firestore";

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
    }
}