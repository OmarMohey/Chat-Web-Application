import React from 'react';
import { db } from './firebase'

function ChatInputBox({ user,channelId }) {
  return (
    <form onSubmit={event => {
      //preventing the browser from doing the default event which is refreshing the web page
      event.preventDefault();
      // adding messages to the targeted channel
      const value = event.target.elements[0].value;
      db.collection('channels').doc(channelId).collection('messages').add({
        user : db.collection('users').doc(user.uid),
        text : value,
        createdAt : new Date()
      });
      event.target.reset();
    }} className="ChatInputBox">
      <input className="ChatInput" placeholder="Message #General" />
    </form>
  );
}

export default ChatInputBox;
