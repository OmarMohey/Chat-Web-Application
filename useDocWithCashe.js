import {useState,useEffect} from 'react';
import { db } from './firebase';



const cashe = {}
const pendingCashe = {}
export default function useDocWithCashe(path){
  const [doc, setDoc] = useState(cashe[path])
  useEffect(() =>{
    if(doc){
      return;
    }
    let stillMounted = true;
    const pending = pendingCashe[path]
    const promise = pending || (pendingCashe[path] = db.doc(path)
     .get());
     promise.then(doc =>{
      if(stillMounted){
        const user = {
          ...doc.data(),
          id: doc.id
        }
      setDoc(user)
      cashe[path]=user
    }
    });
    return () =>{
    stillMounted = false;
    };
  }, [path])

return doc;
}