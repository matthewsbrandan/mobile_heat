import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import * as AuthSessions from 'expo-auth-session';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLIENT_ID = '434316f393ea9ac24109';
const SCOPE = 'user';

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}
type AuthContextData = {
  user: User | null;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

type AuthContextProviderProps = {
  children: ReactNode;
}

type AuthResponse = {
  token: string;
  user: User;
}

type AuthorizationResponse = {
  params: {
    code?: string;
    error?: string;
  },
  type?: string;
}

function AuthContextProvider({ children }: AuthContextProviderProps){
  const [user, setUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(true);

  async function signIn(){
    try{
      setIsSigningIn(true);
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;  
      const authSessionResponse = await AuthSessions.startAsync({ authUrl }) as AuthorizationResponse;

      if(
        authSessionResponse.type === 'success' &&
        authSessionResponse.params.error !== 'access_denied' &&
        authSessionResponse.params.code
      ){
        const authResponse = await api.post('/authenticate', { code:  authSessionResponse.params.code });
        const { user, token } = authResponse.data as AuthResponse;

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await AsyncStorage.setItem('@nlwheat:user', JSON.stringify(user));
        await AsyncStorage.setItem('@nlwheat:token', token);

        setUser(user);
      }
    }catch(e){ console.log(e); }

    setIsSigningIn(false);
  }
  async function signOut(){
    setUser(null);
    await AsyncStorage.removeItem('@nlwheat:user');
    await AsyncStorage.removeItem('@nlwheat:token');
    api.defaults.headers.common['Authorization'] = ``;
  }

  

  useEffect(() => {
    (async () => {
      const userStorage = await AsyncStorage.getItem('@nlwheat:user');
      const tokenStorage = await AsyncStorage.getItem('@nlwheat:token');
  
      if(userStorage && tokenStorage){
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`;    
        setUser(JSON.parse(userStorage));
      }
      setIsSigningIn(false);
    })();
  },[]);
  return (
    <AuthContext.Provider value={{
      user,
      isSigningIn,
      signIn,
      signOut
    }}>
      { children }
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

export { AuthContextProvider, useAuth };