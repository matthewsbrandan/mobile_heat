import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { api } from '../../services/api';
import { Message, MessageProps } from '../Message';
import { io } from 'socket.io-client';

import { styles } from './styles';
import { MESSAGES_EXAMPLE } from '../../utils/messages';

let messagesQueue : MessageProps[]= MESSAGES_EXAMPLE;
const socket = io(String(api.defaults.baseURL));

socket.on('new_message', (newMessage) => {
  messagesQueue.push(newMessage);
});

export function MessageList(){
  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    (() => {
      api.get<MessageProps[]>('messages/last3').then(response => {
        setCurrentMessages(response.data);
      });
    })();
  },[]);

  useEffect(() => {
    const timer = setInterval(() => {
      if(messagesQueue.length > 0) {
        setCurrentMessages(prevState => [
          messagesQueue[0],
          prevState[0],
          prevState[1]
        ].filter(Boolean));
        messagesQueue.shift();
      }
    }, 3000);

    return () => clearInterval(timer);
  },[]);
  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      { currentMessages.map(message => { return(
        <Message data={message} key={message.id} />
      );}) }
    </ScrollView>
  )
}