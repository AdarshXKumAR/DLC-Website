import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CreditCard, MapPin, Mail, Shield, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TutorialsSection: React.FC = () => {
  const { t } = useLanguage();

  const tutorials = [
    {
      icon: MessageCircle,
      titleKey: 'tutorials.whatsapp.title',
      descKey: 'tutorials.whatsapp.desc',
      gradient: 'from-green-500 to-emerald-400',
      type: 'whatsapp',
    },
    {
      icon: CreditCard,
      titleKey: 'tutorials.paytm.title',
      descKey: 'tutorials.paytm.desc',
      gradient: 'from-blue-500 to-cyan-400',
      type: 'paytm',
    },
    {
      icon: MapPin,
      titleKey: 'tutorials.maps.title',
      descKey: 'tutorials.maps.desc',
      gradient: 'from-red-500 to-orange-400',
      type: 'maps',
    },
    {
      icon: Mail,
      titleKey: 'tutorials.email.title',
      descKey: 'tutorials.email.desc',
      gradient: 'from-purple-500 to-pink-400',
      type: 'email',
    },
    {
      icon: Shield,
      titleKey: 'tutorials.social.title',
      descKey: 'tutorials.social.desc',
      gradient: 'from-indigo-500 to-blue-400',
      type: 'social',
    },
    {
      icon: ShoppingCart,
      titleKey: 'tutorials.shopping.title',
      descKey: 'tutorials.shopping.desc',
      gradient: 'from-amber-500 to-yellow-400',
      type: 'shopping',
    },
  ];

  const startTutorial = (type: string) => {
    // Placeholder for tutorial functionality
    const tutorialMessages = {
      whatsapp: [
        "Download WhatsApp from Play Store",
        "Enter your phone number for verification",
        "Set up your profile with name and photo",
        "Start chatting with contacts",
        "Learn to send photos and voice messages"
      ],
      paytm: [
        "Download Paytm app from Play Store",
        "Sign up with your mobile number",
        "Complete KYC verification",
        "Add money to your wallet",
        "Make your first payment"
      ],
      maps: [
        "Open Google Maps on your phone",
        "Allow location access",
        "Search for a destination",
        "Get directions and start navigation",
        "Save favorite locations"
      ],
      email: [
        "Create a Gmail account",
        "Learn the Gmail interface",
        "Compose and send your first email",
        "Organize emails with labels",
        "Stay safe from spam and phishing"
      ],
      social: [
        "Create strong passwords",
        "Adjust privacy settings",
        "Recognize fake accounts",
        "Report inappropriate content",
        "Safe sharing practices"
      ],
      shopping: [
        "Choose trusted shopping websites",
        "Search and compare products",
        "Read reviews and ratings",
        "Make secure payments",
        "Track your orders"
      ]
    };

    const tutorial = tutorialMessages[type as keyof typeof tutorialMessages];
    if (tutorial) {
      const title = t(`tutorials.${type}.title`);
      alert(`Starting ${title}!\n\nSteps:\n${tutorial.map((step, index) => `${index + 1}. ${step}`).join('\n')}`);
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
            {t('tutorials.title')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Master essential digital skills with our step-by-step tutorials designed for beginners
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative glass dark:glass-dark rounded-2xl p-8 card-hover overflow-hidden"
            >
              {/* Background gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tutorial.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 bg-gradient-to-r ${tutorial.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
                >
                  <tutorial.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {t(tutorial.titleKey)}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {t(tutorial.descKey)}
                </p>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startTutorial(tutorial.type)}
                  className={`w-full bg-gradient-to-r ${tutorial.gradient} text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                >
                  {t('tutorials.start')}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="glass dark:glass-dark rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Need More Help?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our AI assistant is here to answer your questions and provide personalized guidance
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-8 py-3"
            >
              Ask AI Assistant
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TutorialsSection;