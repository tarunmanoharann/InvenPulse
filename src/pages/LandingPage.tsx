import React, { useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

import Footer from '@/components/Footer';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

interface Feature {
  title: string;
  description: string;
}

const LandingPage: React.FC = () => {
  const features: Feature[] = [
    { title: 'Real-time Tracking', description: 'Monitor your inventory levels in real-time, ensuring you never run out of stock.' },
    { title: 'Advanced Analytics', description: 'Gain valuable insights into your inventory trends and make data-driven decisions.' },
    { title: 'Seamless Integration', description: 'Easily integrate with your existing systems for a smooth workflow.' },
  ];

  const steps: string[] = ['Idea', 'Planning', 'Development', 'Implementation', 'Product'];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Hero Section */}
      <AnimatedSection className="flex-1 flex flex-col items-center justify-center text-center px-4 py-64 relative">
        <div className="z-10">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Welcome to InvenPulse</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8"> Your Inventory Solution, Perfected Step-by-Step</p>
          <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition duration-300">
            Get Started
          </button>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Why Choose InvenPulse?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Call to Action Section */}
      <AnimatedSection className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Optimize Your Inventory?</h2>
          <button className="px-8 py-3 bg-white text-primary font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
            Start Your Free Trial
          </button>
        </div>
      </AnimatedSection>

      <Footer/>
    </div>
  );
};

export default LandingPage;