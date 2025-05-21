import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Chat = ({ appointmentId, userId, docId, backendUrl, token, otherUserName, otherUserImage }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Function to load messages
  const loadMessages = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/chat/user/messages`,
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        setMessages(data.messages || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error loading messages');
    }
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages on component mount and when appointmentId changes
  useEffect(() => {
    if (appointmentId) {
      loadMessages();
      // Set up polling for new messages every 5 seconds
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [appointmentId, token]);

  // Scroll to bottom when messages change
  useEffect(() => {
    // scrollToBottom();
  }, [messages]);

  // Function to send text message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/chat/user/send`,
        {
          appointmentId,
          content: newMessage,
          senderId: userId
        },
        { headers: { token } }
      );

      if (data.success) {
        setNewMessage('');
        loadMessages();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error sending message');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Function to upload file
  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('appointmentId', appointmentId);
    formData.append('senderId', userId);
    formData.append('content', newMessage || 'Sent a file');

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/chat/user/send-file`,
        formData,
        {
          headers: {
            token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (data.success) {
        setNewMessage('');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        loadMessages();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  // Function to format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Function to render file preview based on file type
  const renderFilePreview = (message) => {
    if (!message.fileUrl) return null;

    if (message.fileType === 'image') {
      return (
        <img 
          src={message.fileUrl} 
          alt={message.fileName || 'Image'} 
          className="max-w-xs max-h-40 rounded-md mt-1"
          onClick={() => window.open(message.fileUrl, '_blank')}
        />
      );
    } else {
      return (
        <a 
          href={message.fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-primary py-1 mt-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="underline">{message.fileName || 'Download document'}</span>
        </a>
      );
    }
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-lg bg-white">
      {/* Chat header */}
      <div className="p-3 border-b flex items-center gap-2 bg-gray-50">
        <img src={otherUserImage} alt={otherUserName} className="w-8 h-8 rounded-full" />
        <p className="font-medium text-gray-700">{otherUserName}</p>
      </div>

      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No messages yet. Start a conversation.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`mb-4 max-w-[85%] ${
                message.senderId === userId
                  ? 'ml-auto bg-primary text-white rounded-l-lg rounded-tr-lg'
                  : 'mr-auto bg-gray-100 text-gray-800 rounded-r-lg rounded-tl-lg'
              } p-3`}
            >
              <div className="text-sm">{message.content}</div>
              {renderFilePreview(message)}
              <div className={`text-xs mt-1 ${message.senderId === userId ? 'text-white/70' : 'text-gray-500'}`}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t">
        {file && (
          <div className="mb-2 p-2 bg-gray-50 rounded flex justify-between items-center">
            <div className="text-sm truncate">{file.name}</div>
            <button 
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-full"
            disabled={loading}
          />
          <div className="flex gap-1">
            <label className="p-2 text-primary cursor-pointer hover:bg-gray-100 rounded-full">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </label>
            {file ? (
              <button
                type="button"
                onClick={uploadFile}
                className="p-2 bg-primary text-white rounded-full hover:bg-primary/90"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                className="p-2 bg-primary text-white rounded-full hover:bg-primary/90"
                disabled={loading || !newMessage.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat; 