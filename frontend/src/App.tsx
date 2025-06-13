import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import TutorialsSection from './components/TutorialsSection';
import ChatSection from './components/ChatSection';
import FeedbackSection from './components/FeedbackSection';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

type Section = 'home' | 'tutorials' | 'chat' | 'feedback';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onNavigate={setActiveSection} />
          </motion.div>
        );
      case 'tutorials':
        return (
          <motion.div
            key="tutorials"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <TutorialsSection />
          </motion.div>
        );
      case 'chat':
        return (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ChatSection />
          </motion.div>
        );
      case 'feedback':
        return (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <FeedbackSection />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 transition-colors duration-500">
          <Header activeSection={activeSection} onNavigate={setActiveSection} />
          
          <main className="relative">
            <AnimatePresence mode="wait">
              {renderSection()}
            </AnimatePresence>
          </main>
          
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;