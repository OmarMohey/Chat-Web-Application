import React, { useEffect,useRef } from 'react';
import useCollection from './useCollection';
import  useDocWithCashe  from './useDocWithCashe';
import formatDate from 'date-fns/format';
import isSameDay from 'date-fns/isSameDay';



function Messages({ channelId }) {
  const messages = useCollection(`channels/${channelId}/messages`,"createdAt");
  

  //mapping through messages to see if the message is the first one or it the later to show the avatar
  return (
    <ChatScroller className="Messages">
      <div className="EndOfMessages">That's every message!</div>
      {messages.map((message, index) =>{
        const previous = messages[index-1];
        const showDay = shouldShowDay(previous,message);
        const showAvatar = shouldShowAvatar(previous, message);
        return showAvatar ? (
          <FirstMessageFromUser
          key = {message.id}
          message = {message}
          showDay = {showDay}/>
        ) : (
      <div key={message.id}>
        <div className="Message no-avatar">
          <div className="MessageContent">{message.text}</div>
        </div>
      </div>
        )
      })}
    </ChatScroller>
  );
}

function FirstMessageFromUser({ message , showDay }){
  const writer = useDocWithCashe(message.user.path);
  return (
  <div key = {message.id}>
  {showDay && (
  <div className="Day">
    <div className="DayLine" />
    <div className="DayText">{new Date(message.createdAt.seconds * 1000).toLocaleDateString()}</div>
    <div className="DayLine" />
  </div>
  )}
  <div className="Message with-avatar">
    <div className="Avatar"
    style = {{
      backgroundImage: writer ?
       `url("${writer.photoUrl}")`
       : ""
    }}
     />
    <div className="Author">
      <div>
        <span className="UserName">{writer && writer.displayName}</span>
        {" "}
        <span className="TimeStamp">{formatDate(message.createdAt.seconds * 1000, "h:mm a")}</span>
      </div>
      <div className="MessageContent">{message.text}</div>
    </div>
  </div>
</div>
  );
}
//this function is to check if it's the first user to send messages or another user to send the message
//or 2 minutes have passed since last message to show the avatar
function shouldShowAvatar(previous, message){
  const isFirst = !previous;
  if (isFirst) {
    return true;
  }
  const differentUser = message.user.id !== previous.user.id;
  if (differentUser) {
    return true;
  }
  const hasBeenAWhile = message.createdAt.seconds - previous.createdAt.seconds > 120;
  return hasBeenAWhile;
}
//this function to see if a day has past to show the date
function shouldShowDay(previous,message){
  const isFirst = !previous;
  if (isFirst) {
    return true;
  }
  const isNewDay = !isSameDay(previous.createdAt.seconds *1000, message.createdAt.seconds *1000);
  return isNewDay;
}
//this function is to make the chat window scroll down to the last message when a new message added but not when
//you r scrolling through the chat
function ChatScroller(props){
  const ref = useRef();
  const shouldScrollRef = useRef(true)
  
  useEffect(() =>{
    if(shouldScrollRef.current){
    const node = ref.current;
    node.scrollTop = node.scrollHeight;
}})
  const handleScroll = () => {
    const node = ref.current;
    //scrollTop is the distance above the scrollbar
    //client height is the seen part of the screen
    //scrollHeight is the length of the whole window
    const {scrollTop, clientHeight, scrollHeight} = node
    const atBottom = scrollHeight === clientHeight + scrollTop
    shouldScrollRef.current = atBottom
  }
  return <div {...props} ref ={ref} onScroll={handleScroll}/>
}

export default Messages;
