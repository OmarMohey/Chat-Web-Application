import firebase from 'firebase/app';
import 'firebase/firestore';
import "firebase/auth";
import 'firebase/database';

const config = {
    apiKey: "AIzaSyAVCEbmroPuz5j5NKYfvjWeJtITe6v83wU",
    authDomain: "chatapp-1cd5d.firebaseapp.com",
    databaseURL: "https://chatapp-1cd5d.firebaseio.com",
    projectId: "chatapp-1cd5d",
    storageBucket: "chatapp-1cd5d.appspot.com",
    messagingSenderId: "220709925876",
    appId: "1:220709925876:web:22356ab26f18f7104effa1"
};

firebase.initializeApp(config);

const db = firebase.firestore();
const rtdb = firebase.database();

export function setupPresence(user){
    const isOfflineForRTDB = {
        state : "offline",
        lastChanged : firebase.database.ServerValue.TIMESTAMP
    };
    const isOnlineForRTDB = {
        state : "online",
        lastChanged : firebase.database.ServerValue.TIMESTAMP
    };
    const isOfflineForFirestore = {
        state : "offline",
        lastChanged : firebase.firestore.FieldValue.serverTimestamp()
    };
    const isOnlineForFirestore = {
        state : "online",
        lastChanged : firebase.firestore.FieldValue.serverTimestamp()
    };
    const rtdbRef = rtdb.ref(`/status/${user.uid}`);
    const userDoc = db.doc(`/users/${user.uid}`);
    rtdb.ref(".info/connected").on("value",async snapshot =>{
        if(snapshot.val()=== false){
            userDoc.update({
                status : isOfflineForFirestore
            });
            return;
        }
        await rtdbRef.onDisconnect().set(isOfflineForRTDB);
        rtdbRef.set(isOnlineForRTDB);
        userDoc.update({
          status : isOnlineForFirestore  
        });
    });
}

export { db, firebase };
