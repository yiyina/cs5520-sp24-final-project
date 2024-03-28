# App Name: SpinToSpot
### Our App SpinToSpot lets users explore the local area spontaneously and personalized. Simply tap and the user will find a bunch of nearby restaurants, cafes, and many other options which are categorized. Take advantage of the Spin Wheel feature to make choosing users' next outing an exhilarating game of chance, tailored just for users.This integration offers a more comprehensive solution, allowing users to seamlessly find locations without the need to switch between different apps.
###    Authors: Yina Yi, Wei Song

#### This app uses Firestore database.
#### This is our rule for firestore database:
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
#### This is our rule for firestore storage:
、、、
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match/user_avatars/{uid}/{allPaths=**} {
      allow read: if request.auth !=null;
      allow create,write,delete: if request.auth != null && request.auth.uid == uid ;
    }
  }
}
、、、
###  1. Users Collection(done iteration 1)
This is a top-level collection. Each document in the Users collection represents a user of our application.Through Edit Profile User can upload and delete her/his own avatar. 
It has these fields:

-   "uid": "user_unique_id",
-   "email": "user@example.com",
-   "username": "User Name",
-   "avatar": “avataruri”,
-   "coords":"latituide,longitude",
  
###  2. Spin Collection
Spin collection is a subcollection of the Users Collection. Each document in the Spin collection represents the Spin Wheel  for a user. 

-   "uid": "user_unique_id",
-   "spin":"spinitem"
  
###  3. Photo Collection
Photo collection is a subcollection of the Users Collection.Each document in the Photo collection represents the Photo Gallery for a user. 

-   "uid": "user_unique_id",
-   "photo":"imageuri"




