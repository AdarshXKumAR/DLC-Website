import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 py-1">
      <motion.div
        className="w-2 h-2 bg-primary-500 rounded-full animate-typing"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 bg-primary-500 rounded-full animate-typing"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 bg-primary-500 rounded-full animate-typing"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  );
};

export default LoadingSpinner;