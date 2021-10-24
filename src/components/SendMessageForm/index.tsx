import React, { useState } from 'react';
import { Alert, Keyboard, TextInput, View } from 'react-native';
import { api } from '../../services/api';
import { COLORS } from '../../theme';
import { Button } from '../Button';
import { styles } from './styles';

export function SendMessageForm(){
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  async function handleMessageSubmit(){
    const messageFormatted = message.trim();

    if(messageFormatted.length > 0){
      setSendingMessage(true);

      await api.post('/messages', { message: messageFormatted });
      
      setMessage('');
      Keyboard.dismiss();
      setSendingMessage(false);
    }else{
      Alert.alert('Escreva a mensagem para enviar.');
    }
  }
  return (
    <View style={styles.container}>
      <TextInput
        keyboardAppearance="dark"
        placeholder="Qual a sua espectativa para o evento?"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        maxLength={140}
        multiline
        style={styles.input}

        value={message}
        onChangeText={setMessage}
        editable={!sendingMessage}
      />
      <Button 
        title="ENVIAR MENSAGE"
        color={COLORS.WHITE}
        backgroundColor={COLORS.PINK}
        isLoading={sendingMessage}
        onPress={handleMessageSubmit}
      />
    </View>
  );
}