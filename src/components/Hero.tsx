import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Bot, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type Section = 'home' | 'tutorials' | 'chat' | 'feedback';

interface HeroProps {
  onNavigate: (section: Section) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Smartphone,
      titleKey: 'tutorial.mobile.title',
      descKey: 'tutorial.mobile.desc',
      actionKey: 'view.tutorials',
      action: () => onNavigate('tutorials'),
      gradient: 'from-blue-500 to-cyan-400',
    },
    {
      icon: Bot,
      titleKey: 'tutorial.ai.title',
      descKey: 'tutorial.ai.desc',
      actionKey: 'chat.now',
      action: () => onNavigate('chat'),
      gradient: 'from-purple-500 to-pink-400',
    },
    {
      icon: Users,
      titleKey: 'tutorial.community.title',
      descKey: 'tutorial.community.desc',
      actionKey: 'give.feedback',
      action: () => onNavigate('feedback'),
      gradient: 'from-green-500 to-emerald-400',
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-primary-400/20 to-secondary-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-accent-400/20 to-primary-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-secondary-400/10 to-accent-400/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-full border border-primary-200 dark:border-primary-800 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary-500 mr-2" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                Welcome to the Future of Digital Learning
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow-lg"
            >
              <span className="gradient-text">{t('hero.title')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('tutorials')}
                className="group btn-primary px-8 py-4 text-lg font-semibold flex items-center space-x-2 shadow-2xl animate-glow"
              >
                <span>{t('hero.cta')}</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('chat')}
                className="btn-secondary px-8 py-4 text-lg font-semibold"
              >
                Try AI Assistant
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="relative pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative glass dark:glass-dark rounded-2xl p-8 card-hover"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" 
                     style={{ background: `linear-gradient(135deg, ${feature.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.1)' : feature.gradient.includes('purple') ? 'rgba(147, 51, 234, 0.1)' : 'rgba(34, 197, 94, 0.1)'})` }} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    {t(feature.titleKey)}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {t(feature.descKey)}
                  </p>

                  <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={feature.action}
                    className="inline-flex items-center text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-300"
                  >
                    <span>{t(feature.actionKey)}</span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;