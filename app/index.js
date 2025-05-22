import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getRedirectResult, onAuthStateChanged, getAuth } from 'firebase/auth';
import { Redirect } from 'expo-router';
import { firebaseapp } from '../FirebaseConfig';
import { auth } from '../FirebaseConfig';

export default function index() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const checkRedirect = async()=>{
      try{
        const result = await getRedirectResult(auth);
        if(result){
          const user = result.user;
          console.log('Google Sign-In was Successful: ', user);
        }
      }catch(e){
        console.error('Redirect Error:', e.message)
      }
    }
    //checkRedirect();

    const unsub = onAuthStateChanged(auth, (user)=>{
      setUser(user);
      setLoading(false);
    });
    return unsub;
  }, [])

  if(loading) return null
  return (
    <Redirect href={user?'/(app)/profile':'/login'}/>
  )
}