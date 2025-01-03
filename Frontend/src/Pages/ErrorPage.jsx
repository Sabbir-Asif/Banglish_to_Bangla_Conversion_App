"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
            transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 },
          }}
          className="flex justify-center mb-6"
        >
          <AlertCircle size={64} className="text-red-500" />
        </motion.div>
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Oops!
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-xl text-center text-gray-600 mb-6"
        >
          Sorry! The page is not found.
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex justify-center"
        >
          <a
            href="/"
            className="bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-600 transition duration-300 ease-in-out"
          >
            Go Home
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
