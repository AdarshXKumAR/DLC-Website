import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, CreditCard, MapPin, Mail, Shield, ShoppingCart, X, Maximize } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TutorialsSection: React.FC = () => {
  const { t } = useLanguage();

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const tutorials = [
    {
      icon: MessageCircle,
      titleKey: 'tutorials.whatsapp.title',
      descKey: 'tutorials.whatsapp.desc',
      gradient: 'from-green-500 to-emerald-400',
      type: 'whatsapp',
      video: 'https://www.youtube.com/embed/iHUBPKbRwFA?si=sKUqeiKs4wLVxmvt', // local path or change to YouTube link
    },
    {
      icon: CreditCard,
      titleKey: 'tutorials.paytm.title',
      descKey: 'tutorials.paytm.desc',
      gradient: 'from-blue-500 to-cyan-400',
      type: 'paytm',
      video: 'https://www.youtube.com/embed/zS-oRII-TCk?si=NFW2YjMc0KP5Pj9j',
    },
    {
      icon: MapPin,
      titleKey: 'tutorials.maps.title',
      descKey: 'tutorials.maps.desc',
      gradient: 'from-red-500 to-orange-400',
      type: 'maps',
      video: 'https://www.youtube.com/embed/tui9hq9lfsU?si=Hq84Ks2i3L6RAdbw',
    },
    {
      icon: Mail,
      titleKey: 'tutorials.email.title',
      descKey: 'tutorials.email.desc',
      gradient: 'from-purple-500 to-pink-400',
      type: 'email',
      video: 'https://www.youtube.com/embed/AijocwKlsUE?si=p8FFkchS_7RoA_4C',
    },
    {
      icon: Shield,
      titleKey: 'tutorials.social.title',
      descKey: 'tutorials.social.desc',
      gradient: 'from-indigo-500 to-blue-400',
      type: 'social',
      video: 'https://www.youtube.com/embed/2YSB468mn4M?si=IsUslQ-tVKLp87sB',
    },
    {
      icon: ShoppingCart,
      titleKey: 'tutorials.shopping.title',
      descKey: 'tutorials.shopping.desc',
      gradient: 'from-amber-500 to-yellow-400',
      type: 'shopping',
      video: 'https://www.youtube.com/embed/iSvRIeYYNl4?si=-nhSFriTwSlgWnRg',
    },
  ];

  const startTutorial = (type: string) => {
    const selected = tutorials.find((tut) => tut.type === type);
    if (selected?.video) {
      setVideoUrl(selected.video);
      setIsVideoOpen(true);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen().catch((err) => {
          console.error('Error attempting fullscreen:', err);
        });
      }
    }
  };

  const isYouTube = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');

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
              <div className={`absolute inset-0 bg-gradient-to-br ${tutorial.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
              </div>

              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 bg-gradient-to-r ${tutorial.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg`}
                >
                  <tutorial.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {t(tutorial.titleKey)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {t(tutorial.descKey)}
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startTutorial(tutorial.type)}
                  className={`w-full bg-gradient-to-r ${tutorial.gradient} text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  {t('tutorials.start')}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-2xl max-w-3xl w-full relative">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-3 right-3 text-gray-700 dark:text-white hover:text-red-500"
            >
              <X className="w-6 h-6" />
            </button>

            {!isYouTube(videoUrl) && (
              <button
                onClick={toggleFullscreen}
                className="absolute top-3 left-3 text-gray-700 dark:text-white hover:text-primary-500"
              >
                <Maximize className="w-6 h-6" />
              </button>
            )}

            <div className="mt-8">
              {isYouTube(videoUrl) ? (
                <iframe
                  src={videoUrl}
                  title="Tutorial Video"
                  className="w-full h-96 rounded-lg"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  controls
                  className="w-full h-96 rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialsSection;
