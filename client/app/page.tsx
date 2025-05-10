'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroAnimation from '@/components/HeroAnimation';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface Testimonial {
  name: string;
  company: string;
  text: string;
  avatar: string;
}

export default function HomePage() {
  const features: Feature[] = [
    { title: 'Real-time Tracking', description: 'Monitor inventory levels across multiple locations in real-time, with customizable alerts for low stock.', icon: '📊' },
    { title: 'Predictive Analytics', description: 'Leverage AI-powered forecasting to optimize stock levels and reduce carrying costs.', icon: '🧠' },
    { title: 'Seamless Integration', description: 'Connect with your existing ERP, e-commerce, and POS systems for a unified workflow.', icon: '🔗' },
    { title: 'Automated Procurement', description: 'Set up intelligent reordering rules based on demand forecasts and lead times.', icon: '🔄' },
    { title: 'Multi-channel Management', description: 'Synchronize inventory across all sales channels, from brick-and-mortar to online marketplaces.', icon: '🌐' },
    { title: 'Mobile Accessibility', description: 'Manage your inventory on-the-go with our powerful mobile app, available for iOS and Android.', icon: '📱' },
  ];

  const testimonials: Testimonial[] = [
    { name: 'Sarah Johnson', company: 'TechNova Solutions', text: 'InvenPulse has transformed our supply chain management. The predictive analytics feature alone has saved us thousands in carrying costs.', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Michael Chang', company: 'Global Retail Corp', text: "Since implementing InvenPulse, our stockouts have decreased by 35% and our inventory turnover has improved significantly. It's been a game-changer for our operations.", avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Emily Rodriguez', company: 'Eco Logistics', text: 'The multi-channel management feature of InvenPulse has streamlined our entire fulfillment process. We now have a single source of truth for our inventory across all platforms.', avatar: 'https://i.pravatar.cc/150?img=3' },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <div className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <HeroAnimation />
        <div className="z-10 bg-black bg-opacity-70 p-14 rounded-xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Smart Inventory Management <span className="text-primary">Simplified</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Streamline your inventory operations with real-time tracking, automated replenishment, and powerful analytics.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
              Get Started Free
            </Link>
            <Link href="#features" className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <section id="features" className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            Powerful Features to <span className="text-primary">Transform</span> Your Inventory Management
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-8 rounded-xl shadow-md hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            Trusted by <span className="text-primary">Industry Leaders</span>
          </h2>
          <div className="relative h-96 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentTestimonial ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                  <div className="flex items-center mb-6">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{testimonial.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg italic">"{testimonial.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 