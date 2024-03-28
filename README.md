# App Name: SpinToSpot
### Our App SpinToSpot lets users explore the local area spontaneously and personalized. Simply tap and the user will find a bunch of nearby restaurants, cafes, and many other options which are categorized. Take advantage of the Spin Wheel feature to make choosing users' next outing an exhilarating game of chance, tailored just for users.This integration offers a more comprehensive solution, allowing users to seamlessly find locations without the need to switch between different apps.
###    Authors: Yina Yi, Wei Song

# Firebase Rules
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
# Describe the data model
### User Data Model:
- Each user is identified by a unique user ID (uid).
- Users have attributes such as email, username, avatar URI, and geographical coordinates (coords).
- Users also have subcollections associated with features like the Spin Wheel and Gallery.
- Users collection including 2 subcollections: Spin and Gallery
  
### Spin Wheel Data Model:
- Each user has one or more Spin Wheels associated with them. 
- Each Spin Wheel contains a unique spin ID (spinId) and a spin name (spinName).
- Spin Wheels have a subcollection called SpinDetails for storing more detailed information.
  
### SpinDetails Data Model:
- Each SpinDetails document contains a color scheme (colorSet) and a list of items on the spin (items).

### Photo Gallery Data Model:
- Each user has a gallery containing multiple photos.
- Each photo has a unique photo URI (photoUri), timestamp (timestamp), and description (description).

# Describe the Collections
### Users Collection (Completed in Iteration 1)
The Users collection is a top-level collection where each document represents an individual user in our database. Users can edit their profiles, including the uploading and deleting of avatars. The collection includes the following fields:

- uid: A unique identifier for each user (e.g., "user_unique_id").
- email: The user's email address (e.g., "user@example.com").
- username: The user name (e.g., "User Name").
- avatar: The URI of the user's avatar (e.g., "https://example.com/user_unique_id/avatar......").
- coords: Geographical coordinates of the user, formatted as "latitude, longitude" (e.g., "34.0522,-118.2437").
- Spins Collection: A subcollection within the Users Collection, detailing the user's interaction with the Spin Wheel feature.
- Gallery Collection: A subcollection within the Users Collection, managing the user's Photo Gallery.

### The Spin collection is a subcollection of the Users Collection. Each document in this collection represents a Spin Wheel associated with a user and contains:

- spinId: A unique identifier for each spin (e.g., "spin_unique_id").
- spinName: The name assigned to the spin (e.g., "name of a spin").
- SpinDetails Collection: A subcollection of the Spin Collection, providing more detailed information about each spin.

### The SpinDetails collection is a subcollection of the Spin Collection. Each document within this collection includes:

- colorSet: The color scheme used for the spin, like "Red, Blue, Green".
- items: A list of items available in the spin, for example, "Indian Food, Coffee, Chinese Food".

### The Photo collection is a subcollection of the Users Collection. Each document represents a photo in the user's Gallery, containing:

- photoUri: The URI of the photo (e.g., "https://example.com/user_unique_id/gallery/imageuri......").
- timestamp: The time and date when the photo was added or modified (e.g., "2024-03-27T14:00:00Z").
- description: A brief description or caption for the photo (e.g., "Today I came to an XXX restaurant, ...").
  
# CRUD Operations
Explain how Create, Read, Update, and Delete (CRUD) operations are implemented in your Firestore collections. For example:

### Users Collection:
-  Create: New user profiles are created upon registration.
-  Read: User profiles are retrievable for viewing and editing.
-  Update: Users can update their profile information and avatar.
-  Delete: Users can delete their avatar.

### Spins Collection:
-  Create: New spins can be created when the user chooses to add a new Spin Wheel.
-  Read: Each spin's information is viewable by the user.
-  Update: The color theme and the items of each spin can be edited.
-  Delete: Users can delete selected spin, or delete items in each spin

### Gallery Collection:
-  Create: Users can upload new photos to the gallery.
-  Read: Users can view their gallery.
-  Update: Users can edit photo descriptions.
-  Delete: Users can remove photos from their gallery.

# Screenshots
This screenshot showcases the user profile editing screen, providing users with access to their personal information. Here, they can update or delete their avatar and make modifications to other personal details. The second image demonstrates a successful update of the user's avatar.

<img src="https://github.com/yiyina/cs5520-sp24-final-project/assets/55360195/b0b70134-7bfe-4419-b5cc-aed983b0194e" width="30%">
<img src="https://github.com/yiyina/cs5520-sp24-final-project/assets/55360195/b7777fce-ab14-4116-af27-685fc84f4625" width="30%">

# Description of Member Contributions
| Contribution Area                  | Yina Yi                                                              | Wei Song                                                              |
| ---------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **UI Design**                      | Led the UI design process, ensuring a visually appealing experience. |                                                                       |
| **Login/Register Logic**           | Developed login and registration screen logic.                       |                                                                       |
| **Avatar Management**              | Implemented avatar upload to the cloud.                              | Developed functionality for avatar deletion from the cloud.          |
| **Additional Features**            | Integrated Google Maps into the Home screen.                         | Implemented user information updates in the Edit Profile screen.     |
| **Firebase Configuration**         |                                                                     | Set up Firebase for Cloud Firestore and Storage.                      |
| **Firebase Authentication**        |                                                                     | Implemented secure user authentication with Firebase.                 |


