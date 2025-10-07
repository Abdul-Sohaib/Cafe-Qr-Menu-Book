import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';

const AnimatedSplashScreenforcustomer = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#FBEEDE] overflow-hidden">
   

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* Coffee icon animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            duration: 0.8,
          }}
          className="flex justify-center mb-6"
        >
            <div className="relative">
            <Coffee className="w-24 h-24 text-[#552A0A]" strokeWidth={1.5} />
            
            {/* Steam animation */}
            {[0, 1, 2,3,4].map((i) => (
              <motion.div
                key={i}
                className="absolute top-0 left-1/2"
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0,1,0],
                  y: [-20, -40],
                  x: [-20 + i * 10, -20 + i * 5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
              >
                <div className="w-1 h-7 bg-gradient-to-t from-[#A8744A] to-transparent rounded-full blur-sm" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Welcome text animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#552A0A] via-[#552A0A] to-[#552A0A] mb-4"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            We Welcome You 
          </motion.h1>
          
          <motion.p
            className="text-2xl md:text-3xl text-[#552A09] font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            To Cafe Delight
          </motion.p>
        </motion.div>



        {/* Loading bar animation */}
        <motion.div
          className="mt-12 w-64 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#BD8F6E] via-[#824B24] to-[#673E20] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>


    </div>
  );
};

export default AnimatedSplashScreenforcustomer;