# App Name: SpinToSpot
### Our App SpinToSpot lets users explore the local area spontaneously and personalized. Simply tap and the user will find a bunch of nearby restaurants, cafes, and many other options which are categorized. Take advantage of the Spin Wheel feature to make choosing users' next outing an exhilarating game of chance, tailored just for users.This integration offers a more comprehensive solution, allowing users to seamlessly find locations without the need to switch between different apps.
###    Authors: Yina Yi, Wei Song

#### This app uses Firestore database.
#### This is our rule for Cloud Firestore:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents { 
    match /users/{document=**} {
      allow read, create: if request.auth != null;
      allow write, delete: if request.auth != null && request.auth.uid == resource.data.uid;
    }
  }
}
```
#### This is our rule for Storage:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match/user_avatars/{uid}/{allPaths=**} {
      allow read: if request.auth !=null;
      allow create,write,delete: if request.auth != null && request.auth.uid == uid ;
    }
  }
}
```
## Users Collection (Completed in Iteration 1)
The Users collection is a top-level collection where each document represents an individual user in our database. Users can edit their profiles, including the uploading and deleting of avatars. The collection includes the following fields:

- uid: A unique identifier for each user (e.g., "user_unique_id").
- email: The user's email address (e.g., "user@example.com").
- username: The user name (e.g., "User Name").
- avatar: The URI of the user's avatar (e.g., "https://example.com/user_unique_id/avatar......").
- coords: Geographical coordinates of the user, formatted as "latitude, longitude" (e.g., "34.0522,-118.2437").
- Spins Collection: A subcollection within the Users Collection, detailing the user's interaction with the Spin Wheel feature.
- Gallery Collection: A subcollection within the Users Collection, managing the user's Photo Gallery.

## The Spin collection is a subcollection of the Users Collection. Each document in this collection represents a Spin Wheel associated with a user and contains:

- spinId: A unique identifier for each spin (e.g., "spin_unique_id").
- spinName: The name assigned to the spin (e.g., "name of a spin").
- SpinDetails Collection: A subcollection of the Spin Collection, providing more detailed information about each spin.

## The SpinDetails collection is a subcollection of the Spin Collection. Each document within this collection includes:

- colorSet: The color scheme used for the spin, like "Red, Blue, Green".
- items: A list of items available in the spin, for example, "Indian Food, Coffee, Chinese Food".

## The Photo collection is a subcollection of the Users Collection. Each document represents a photo in the user's Gallery, containing:

- photoUri: The URI of the photo (e.g., "https://example.com/user_unique_id/gallery/imageuri......").
- timestamp: The time and date when the photo was added or modified (e.g., "2024-03-27T14:00:00Z").
- description: A brief description or caption for the photo (e.g., "Today I came to an XXX restaurant, ...").
