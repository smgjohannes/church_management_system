import React from 'react';
import './DirectChat.css';

const DirectChat = () => {
  return (
    <div className='direct-chat'>
      <div className='chat-header'>Direct Chat</div>
      <div className='chat-messages'>
        <div className='message received'>
          <p>Hello! How can I help you today?</p>
          <span className='timestamp'>10:00 AM</span>
        </div>
        <div className='message sent'>
          <p>I have a question about the upcoming event.</p>
          <span className='timestamp'>10:05 AM</span>
        </div>
        {/* Add more messages as needed */}
      </div>
      <div className='chat-input'>
        <input type='text' placeholder='Type your message...' />
        <button>Send</button>
      </div>
    </div>
  );
};

export default DirectChat;
