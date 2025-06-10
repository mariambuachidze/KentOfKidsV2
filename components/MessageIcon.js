"use client";
import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import MessageBox from './MessageBox';

const MessageIcon = ({ userId }) => {
  const [showMessageBox, setShowMessageBox] = useState(false);
  
  const toggleMessageBox = () => {
    setShowMessageBox(!showMessageBox);
  };
  
  return (
    <div className="message-icon-container">
      <button 
        className="message-icon-button" 
        onClick={toggleMessageBox}
        aria-label="Messages"
      >
        <FaEnvelope size={24} />
      </button>
      
      {showMessageBox && (
        <MessageBox 
          userId={userId} 
          onClose={() => setShowMessageBox(false)} 
        />
      )}
    </div>
  );
};

export default MessageIcon;