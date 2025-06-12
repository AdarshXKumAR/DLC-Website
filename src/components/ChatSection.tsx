import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Paperclip, Trash2, Bot, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from './LoadingSpinner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [sessionId] = useState(() => 'session_' + Date.now());

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = false;
      newRecognition.interimResults = false;
      newRecognition.lang = language === 'en' ? 'en-US' : 'hi-IN';
      
      newRecognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setInputValue(result);
        setIsListening(false);
      };

      newRecognition.onerror = () => {
        setIsListening(false);
      };

      newRecognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(newRecognition);
    }
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const messageText = inputValue.trim();
    setInputValue('');
    addMessage(messageText, 'user');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          session_id: sessionId,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      addMessage(data.response, 'bot');
    } catch (error) {
      console.error('Error calling chat API:', error);
      addMessage(
        language === 'en'
          ? "Sorry, I'm having trouble connecting right now. Please make sure the backend server is running on http://localhost:5000"
          : "क्षमा करें, मुझे अभी कनेक्ट करने में समस्या हो रही है। कृपया सुनिश्चित करें कि बैकएंड सर्वर http://localhost:5000 पर चल रहा है",
        'bot'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await fetch(`${API_BASE_URL}/clear-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
        }),
      });
    } catch (error) {
      console.error('Error clearing chat:', error);
    }

    setMessages([]);
  };

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', sessionId);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-file`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      addMessage(`📎 File uploaded: ${file.name}`, 'user');

      if (data.file_info.content_preview) {
        setIsLoading(true);
        const chatResponse = await fetch(`${API_BASE_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `I've uploaded a file: ${file.name}. Can you help me understand this content?`,
            session_id: sessionId,
            language: language,
            file_context: data.file_info.content_preview,
          }),
        });

        if (chatResponse.ok) {
          const chatData = await chatResponse.json();
          addMessage(chatData.response, 'bot');
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      addMessage(`❌ Error uploading file: ${error}`, 'bot');
    }

    // Reset file input
    event.target.value = '';
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {t('chat.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your intelligent digital learning companion
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass dark:glass-dark rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <Bot className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-white font-semibold">TechBuddy</h3>
                  <p className="text-white/80 text-sm">
                    Your Digital Learning Assistant
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearChat}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-300"
                title={t('chat.clear')}
              >
                <Trash2 className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-96 overflow-y-auto scrollbar-thin bg-gradient-to-b from-white/5 to-transparent dark:from-gray-900/5">
            <div className="p-6 space-y-4">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Bot className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('chat.welcome.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('chat.welcome.subtitle')}
                  </p>
                </motion.div>
              )}

              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start space-x-3 ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500'
                        : 'bg-gradient-to-r from-gray-500 to-gray-600'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white ml-auto'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl">
                    <LoadingSpinner />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Container */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="*/*"
              />
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-300"
                title={t('chat.attach')}
              >
                <Paperclip className="w-5 h-5" />
              </motion.button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chat.placeholder')}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleVoiceInput}
                className={`p-2 transition-colors duration-300 ${
                  isListening
                    ? 'text-red-500 animate-pulse'
                    : 'text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400'
                }`}
                title={t('chat.voice')}
              >
                <Mic className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                title={t('chat.send')}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatSection;