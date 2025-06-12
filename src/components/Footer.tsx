import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Phone, Facebook, Twitter, Instagram, Youtube, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const socialLinks = [
    { icon: Facebook, href: '#', color: 'hover:text-blue-500' },
    { icon: Twitter, href: '#', color: 'hover:text-sky-500' },
    { icon: Instagram, href: '#', color: 'hover:text-pink-500' },
    { icon: Youtube, href: '#', color: 'hover:text-red-500' },
  ];

  const quickLinks = [
    { labelKey: 'nav.home', href: '#' },
    { labelKey: 'nav.tutorials', href: '#' },
    { labelKey: 'nav.chat', href: '#' },
    { labelKey: 'nav.feedback', href: '#' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center space-x-3 mb-6">
                <motion.div
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center"
                >
                  <GraduationCap className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold gradient-text">
                    Digital Literacy Hub
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Empowering Digital Learning
                  </p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                {t('footer.about.desc')}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <Mail className="w-5 h-5 text-primary-400" />
                  <span>{t('footer.contact.email')}</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <Phone className="w-5 h-5 text-primary-400" />
                  <span>{t('footer.contact.phone')}</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <MapPin className="w-5 h-5 text-primary-400" />
                  <span>India</span>
                </motion.div>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <Clock className="w-5 h-5 text-primary-400" />
                  <span>24/7 AI Support</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">
                {t('footer.quick.title')}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li key={index} whileHover={{ x: 5 }}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2"
                    >
                      <span className="w-1 h-1 bg-primary-400 rounded-full" />
                      <span>{t(link.labelKey)}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-6 text-white">
                Resources
              </h4>
              <ul className="space-y-3">
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                    <span className="w-1 h-1 bg-primary-400 rounded-full" />
                    <span>Help Center</span>
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                    <span className="w-1 h-1 bg-primary-400 rounded-full" />
                    <span>Privacy Policy</span>
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                    <span className="w-1 h-1 bg-primary-400 rounded-full" />
                    <span>Terms of Service</span>
                  </a>
                </motion.li>
                <motion.li whileHover={{ x: 5 }}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2">
                    <span className="w-1 h-1 bg-primary-400 rounded-full" />
                    <span>Community Guidelines</span>
                  </a>
                </motion.li>
              </ul>
            </motion.div>
          </div>

          {/* Social Media Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 pt-8 border-t border-gray-700"
          >
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-6 text-white">
                {t('footer.social.title')}
              </h4>
              <div className="flex justify-center space-x-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 ${social.color}`}
                  >
                    <social.icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-700 py-6"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                {t('footer.copyright')}
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-sm text-primary-400">
                  Made with ❤️ for Digital Empowerment
                </span>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;