import React, {useState,useEffect} from 'react';
import Nav from './Nav';
import Channel from './Channel';
import { firebase , db, setupPresence } from './firebase';
import { Router, Redirect } from '@reach/router';

function App() {
  const user = useAuth();

  return user ? (
    <div className="App">
      <Nav user = {user} />
      <Router>
      <Channel path="channel/:channelId" user = {user} />
      <Redirect from ="/" to="channel/General" />
      </Router>
    </div>
  ) : (
    <Login />
  );
}
//loging in using firebase auth
function Login(){
  const [authError,setAuthError] = useState(null);
  const handleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    //handling login errors
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      setAuthError(error)
    }
 
  };
  return (
  <div className = "Login">
  <h1>ChatApp!</h1>
  <button onClick = {handleSignIn}>Sign in with Google Account</button>
  {authError && (
    <div>
      <p>sorry, there was a problem</p>
  <p><i>{authError.message}</i></p>
  <p>please try again</p>
    </div>
  )}
</div>
  );
}
//getting user information from firebase auth
function useAuth(){
  const [user,setUser] = useState(null);
  useEffect(()=>{
    return firebase.auth().onAuthStateChanged(firebaseUser =>{
      if(firebaseUser){
        const user = {
          displayName : firebaseUser.displayName,
          photoUrl : firebaseUser.photoURL,
          uid : firebaseUser.uid
        };
        setUser(user);
        //saving user data on firestore
        db.collection('users').doc(user.uid).set(user,{ merge : true })
        setupPresence(user)
      }
      else {
        setUser(null);
      }
    })
  }, [])
  return user
}

export default App;
