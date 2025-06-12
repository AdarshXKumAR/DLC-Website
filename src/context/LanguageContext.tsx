import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'nav.home': 'Home',
    'nav.tutorials': 'Tutorials',
    'nav.chat': 'AI Chat',
    'nav.feedback': 'Feedback',
    
    // Hero
    'hero.title': 'Empowering Digital Literacy!',
    'hero.subtitle': 'Learn essential digital skills with easy-to-follow tutorials designed for parents and elderly users.',
    'hero.cta': 'Start Learning',
    
    // Tutorial Cards
    'tutorial.mobile.title': 'Mobile Apps',
    'tutorial.mobile.desc': 'Learn to use WhatsApp, Paytm, and other essential mobile applications.',
    'tutorial.ai.title': 'AI Assistant',
    'tutorial.ai.desc': 'Get instant help with our intelligent chatbot that understands your questions.',
    'tutorial.community.title': 'Community Support',
    'tutorial.community.desc': 'Share your feedback and help us improve our learning platform.',
    
    // Tutorials Section
    'tutorials.title': 'Learning Tutorials',
    'tutorials.whatsapp.title': 'WhatsApp Basics',
    'tutorials.whatsapp.desc': 'Learn to send messages, make calls, and share photos on WhatsApp.',
    'tutorials.paytm.title': 'Paytm & Digital Payments',
    'tutorials.paytm.desc': 'Master digital payments and money transfers safely.',
    'tutorials.maps.title': 'Google Maps Navigation',
    'tutorials.maps.desc': 'Find directions, locate places, and navigate with confidence.',
    'tutorials.email.title': 'Email & Gmail',
    'tutorials.email.desc': 'Send and receive emails, manage your inbox effectively.',
    'tutorials.social.title': 'Social Media Safety',
    'tutorials.social.desc': 'Stay safe on Facebook, Instagram, and other social platforms.',
    'tutorials.shopping.title': 'Online Shopping',
    'tutorials.shopping.desc': 'Shop safely on Amazon, Flipkart, and other e-commerce sites.',
    'tutorials.start': 'Start Tutorial',
    
    // Chat Section
    'chat.title': 'AI Assistant - TechBuddy',
    'chat.welcome.title': 'Hello! Welcome to TechBuddy',
    'chat.welcome.subtitle': 'What can I help you with today?',
    'chat.placeholder': 'Type your message...',
    'chat.clear': 'Clear Chat',
    'chat.send': 'Send Message',
    'chat.voice': 'Voice Input',
    'chat.attach': 'Attach File',
    
    // Feedback Section
    'feedback.title': 'Your Feedback Matters',
    'feedback.name': 'Name',
    'feedback.email': 'Email',
    'feedback.category': 'Feedback Category',
    'feedback.category.select': 'Select Category',
    'feedback.category.tutorial': 'Tutorial Feedback',
    'feedback.category.chatbot': 'Chatbot Experience',
    'feedback.category.website': 'Website Design',
    'feedback.category.suggestion': 'Suggestion',
    'feedback.category.bug': 'Report Issue',
    'feedback.rating': 'Overall Rating',
    'feedback.message': 'Your Message',
    'feedback.message.placeholder': 'Tell us about your experience...',
    'feedback.submit': 'Submit Feedback',
    
    // Footer
    'footer.about.title': 'About Digital Literacy Hub',
    'footer.about.desc': 'Empowering everyone with essential digital skills through easy-to-understand tutorials and AI-powered assistance.',
    'footer.quick.title': 'Quick Links',
    'footer.contact.title': 'Contact Us',
    'footer.contact.email': 'support@digitalliteracyhub.com',
    'footer.contact.phone': '+91 1234567890',
    'footer.social.title': 'Follow Us',
    'footer.copyright': '© 2024 Digital Literacy Hub. All rights reserved.',
    
    // Common
    'view.tutorials': 'View Tutorials',
    'chat.now': 'Chat Now',
    'give.feedback': 'Give Feedback',
  },
  hi: {
    // Header
    'nav.home': 'होम',
    'nav.tutorials': 'ट्यूटोरियल',
    'nav.chat': 'एआई चैट',
    'nav.feedback': 'फीडबैक',
    
    // Hero
    'hero.title': 'डिजिटल साक्षरता को सशक्त बनाना!',
    'hero.subtitle': 'माता-पिता और बुजुर्गों के लिए डिज़ाइन किए गए आसान ट्यूटोरियल के साथ आवश्यक डिजिटल कौशल सीखें।',
    'hero.cta': 'सीखना शुरू करें',
    
    // Tutorial Cards
    'tutorial.mobile.title': 'मोबाइल ऐप्स',
    'tutorial.mobile.desc': 'व्हाट्सऐप, पेटीएम और अन्य आवश्यक मोबाइल एप्लिकेशन का उपयोग करना सीखें।',
    'tutorial.ai.title': 'एआई सहायक',
    'tutorial.ai.desc': 'हमारे बुद्धिमान चैटबॉट से तुरंत सहायता प्राप्त करें जो आपके प्रश्नों को समझता है।',
    'tutorial.community.title': 'समुदायिक सहायता',
    'tutorial.community.desc': 'अपनी प्रतिक्रिया साझा करें और हमारे सीखने के मंच को बेहतर बनाने में मदद करें।',
    
    // Tutorials Section
    'tutorials.title': 'सीखने के ट्यूटोरियल',
    'tutorials.whatsapp.title': 'व्हाट्सऐप बेसिक्स',
    'tutorials.whatsapp.desc': 'व्हाट्सऐप पर संदेश भेजना, कॉल करना और फोटो साझा करना सीखें।',
    'tutorials.paytm.title': 'पेटीएम और डिजिटल भुगतान',
    'tutorials.paytm.desc': 'डिजिटल भुगतान और मनी ट्रांसफर को सुरक्षित रूप से मास्टर करें।',
    'tutorials.maps.title': 'गूगल मैप्स नेवीगेशन',
    'tutorials.maps.desc': 'दिशाएं खोजें, स्थान ढूंढें और आत्मविश्वास के साथ नेविगेट करें।',
    'tutorials.email.title': 'ईमेल और जीमेल',
    'tutorials.email.desc': 'ईमेल भेजें और प्राप्त करें, अपने इनबॉक्स को प्रभावी रूप से प्रबंधित करें।',
    'tutorials.social.title': 'सोशल मीडिया सुरक्षा',
    'tutorials.social.desc': 'फेसबुक, इंस्टाग्राम और अन्य सोशल प्लेटफॉर्म पर सुरक्षित रहें।',
    'tutorials.shopping.title': 'ऑनलाइन शॉपिंग',
    'tutorials.shopping.desc': 'अमेज़न, फ्लिपकार्ट और अन्य ई-कॉमर्स साइटों पर सुरक्षित खरीदारी करें।',
    'tutorials.start': 'ट्यूटोरियल शुरू करें',
    
    // Chat Section
    'chat.title': 'एआई सहायक - टेकबडी',
    'chat.welcome.title': 'नमस्ते! टेकबडी में आपका स्वागत है',
    'chat.welcome.subtitle': 'आज मैं आपकी किस चीज़ में मदद कर सकता हूँ?',
    'chat.placeholder': 'अपना संदेश टाइप करें...',
    'chat.clear': 'चैट साफ करें',
    'chat.send': 'संदेश भेजें',
    'chat.voice': 'वॉयस इनपुट',
    'chat.attach': 'फाइल संलग्न करें',
    
    // Feedback Section
    'feedback.title': 'आपकी प्रतिक्रिया मायने रखती है',
    'feedback.name': 'नाम',
    'feedback.email': 'ईमेल',
    'feedback.category': 'फीडबैक श्रेणी',
    'feedback.category.select': 'श्रेणी चुनें',
    'feedback.category.tutorial': 'ट्यूटोरियल फीडबैक',
    'feedback.category.chatbot': 'चैटबॉट अनुभव',
    'feedback.category.website': 'वेबसाइट डिज़ाइन',
    'feedback.category.suggestion': 'सुझाव',
    'feedback.category.bug': 'समस्या रिपोर्ट करें',
    'feedback.rating': 'समग्र रेटिंग',
    'feedback.message': 'आपका संदेश',
    'feedback.message.placeholder': 'हमें अपने अनुभव के बारे में बताएं...',
    'feedback.submit': 'फीडबैक जमा करें',
    
    // Footer
    'footer.about.title': 'डिजिटल लिटरेसी हब के बारे में',
    'footer.about.desc': 'समझने योग्य ट्यूटोरियल और एआई-संचालित सहायता के माध्यम से सभी को आवश्यक डिजिटल कौशल के साथ सशक्त बनाना।',
    'footer.quick.title': 'त्वरित लिंक',
    'footer.contact.title': 'संपर्क करें',
    'footer.contact.email': 'support@digitalliteracyhub.com',
    'footer.contact.phone': '+91 1234567890',
    'footer.social.title': 'हमें फॉलो करें',
    'footer.copyright': '© 2024 डिजिटल लिटरेसी हब। सभी अधिकार सुरक्षित।',
    
    // Common
    'view.tutorials': 'ट्यूटोरियल देखें',
    'chat.now': 'अभी चैट करें',
    'give.feedback': 'फीडबैक दें',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};