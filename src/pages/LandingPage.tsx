import React from 'react';
import { motion } from 'framer-motion';


import { BackgroundBeams } from "../components/ui/background-beams";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col" >
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-64 relative">
        <BackgroundBeams className="opacity-30" />
        <div className="z-10">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Welcome to InvenPulse</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">Your inventory management solution</p>
          <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition duration-300">
            Get Started
          </button>
        </div>
      </section>


      {/* Animation Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            {['Idea', 'Planning', 'Development', 'Implementation', 'Product'].map((step, index) => (
              <React.Fragment key={step}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-2">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{step}</span>
                </motion.div>
                {index < 4 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: index * 0.2 + 0.1, duration: 0.5 }}
                    className="flex-1 h-1 bg-primary"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-center text-2xl font-semibold text-gray-800 dark:text-white">
            InvenPulse: Your Inventory Solution, Perfected Step-by-Step
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Why Choose InvenPulse?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Real-time Tracking', description: 'Monitor your inventory levels in real-time, ensuring you never run out of stock.' },
              { title: 'Advanced Analytics', description: 'Gain valuable insights into your inventory trends and make data-driven decisions.' },
              { title: 'Seamless Integration', description: 'Easily integrate with your existing systems for a smooth workflow.' },
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Optimize Your Inventory?</h2>
          <button className="px-8 py-3 bg-white text-primary font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;