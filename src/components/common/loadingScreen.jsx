import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="mx-auto w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-gray-500 font-medium">
          Loading...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingScreen;
