import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6"
    >
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 text */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="mb-8"
        >
          <h1 className="text-[120px] md:text-[180px] font-bold text-[var(--d4a-blue)] leading-none">
            404
          </h1>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-[var(--d4a-black)] mt-4"
          >
            Page Not Found
          </motion.h2>
        </motion.div>

        {/* Animated description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-gray-600 mb-10 max-w-md mx-auto"
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Animated buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary px-8 py-3 text-lg font-semibold"
          >
            Go Back
          </button>
          {/* <button
            onClick={() => navigate('/')}
            className="btn-secondary px-8 py-3 text-lg font-semibold"
          >
            Return Home
          </button> */}
        </motion.div>

        {/* Animated decorative elements */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 flex justify-center"
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-20"
          >
            <path
              d="M100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0ZM100 180C56.2 180 20 143.8 20 100C20 56.2 56.2 20 100 20C143.8 20 180 56.2 180 100C180 143.8 143.8 180 100 180Z"
              fill="var(--d4a-blue)"
            />
            <path
              d="M100 40C66.8629 40 40 66.8629 40 100C40 133.137 66.8629 160 100 160C133.137 160 160 133.137 160 100C160 66.8629 133.137 40 100 40ZM100 140C77.9086 140 60 122.091 60 100C60 77.9086 77.9086 60 100 60C122.091 60 140 77.9086 140 100C140 122.091 122.091 140 100 140Z"
              fill="var(--d4a-red)"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;