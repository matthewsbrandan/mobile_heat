import React from 'react';
import { View, TouchableOpacity ,Text } from 'react-native';

import { UserPhoto } from '../UserPhoto';

import { styles } from './styles';

import LogoSvg from '../../assets/logo.svg';
import { useAuth } from '../../hook/auth';

export function Header(){
  const { user, signOut } = useAuth();
  return (
    <View style={styles.container}>
      <LogoSvg />

      <View style={styles.logouButton}>
        { user && 
          <TouchableOpacity onPress={signOut}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        } 
        
        <UserPhoto imageUri={user ? user.avatar_url : ''}/>
      </View>
    </View>
  );
}