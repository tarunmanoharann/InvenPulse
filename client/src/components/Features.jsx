import React, { useEffect, useRef, useState } from 'react';
import BgBg from '../assets/bgbg.jpg';

const DoodleSalesData = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    <path 
      d="M50 250 C100 200, 150 220, 200 180 S300 150, 350 100" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      className="text-blue-400"
      strokeLinecap="round"
      strokeDasharray="5,5"
    />
    <rect x="50" y="50" width="60" height="80" rx="8" 
      fill="none" 
      stroke="currentColor" 
      className="text-indigo-400"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="200" cy="150" r="40" 
      fill="none" 
      stroke="currentColor" 
      className="text-purple-400"
      strokeWidth="2"
    />
    <path 
      d="M280 120 Q310 80, 340 120 T400 120" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3"
      className="text-pink-400"
    />
  </svg>
);

const DoodleAnalysis = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    <path 
      d="M100 250 L100 150 L200 200 L300 100" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3"
      className="text-blue-400"
      strokeLinecap="round"
    />
    <circle cx="100" cy="150" r="8" 
      fill="currentColor" 
      className="text-indigo-400"
    />
    <circle cx="200" cy="200" r="8" 
      fill="currentColor" 
      className="text-purple-400"
    />
    <circle cx="300" cy="100" r="8" 
      fill="currentColor" 
      className="text-pink-400"
    />
    <path 
      d="M50 50 Q200 0, 350 50" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className="text-indigo-400"
      strokeDasharray="5,5"
    />
  </svg>
);

const DoodlePredictive = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    <path 
      d="M50 150 Q200 50, 350 150" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3"
      className="text-blue-400"
      strokeLinecap="round"
    />
    <path 
      d="M50 150 Q200 250, 350 150" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3"
      className="text-indigo-400"
      strokeLinecap="round"
    />
    <circle cx="200" cy="150" r="30" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      className="text-purple-400"
    />
    <path 
      d="M185 150 L215 150 M200 135 L200 165" 
      stroke="currentColor" 
      strokeWidth="2"
      className="text-pink-400"
    />
  </svg>
);

const DoodleScorecard = () => (
  <svg viewBox="0 0 400 300" className="w-full h-full">
    <rect x="100" y="50" width="200" height="200" rx="10" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3"
      className="text-blue-400"
    />
    <path 
      d="M120 100 L280 100 M120 150 L280 150 M120 200 L280 200" 
      stroke="currentColor" 
      strokeWidth="2"
      className="text-indigo-400"
      strokeDasharray="5,5"
    />
    <circle cx="150" cy="125" r="10" 
      fill="currentColor" 
      className="text-purple-400"
    />
    <path 
      d="M200 125 L260 125" 
      stroke="currentColor" 
      strokeWidth="3"
      className="text-pink-400"
      strokeLinecap="round"
    />
  </svg>
);

const FeatureBlock = ({ feature, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div 
      ref={ref}
      className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
        index % 2 === 0 ? '' : 'lg:flex-row-reverse'
      }`}
    >
      <div 
        className={`flex-1 space-y-4 transition-all duration-700 ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 w-16 h-1 rounded-full" />
        <h3 className="text-2xl font-bold text-white">
          {feature.title}
        </h3>
        <p className="text-gray-300 text-lg leading-relaxed">
          {feature.description}
        </p>
      </div>

      <div 
        className={`flex-1 relative h-[400px] transition-all duration-1000 ${
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-90'
        }`}
        style={{
          transitionDelay: '200ms'
        }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden">
          <feature.DoodleComponent />
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      title: "Sales Data Integration",
      description: "Upload and integrate your historical sales data seamlessly to enhance prediction accuracy. Our system analyzes your past performance to provide more precise forecasts.",
      DoodleComponent: DoodleSalesData
    },
    {
      title: "Impact Analysis Model",
      description: "Understand how external factors like local holidays, weather conditions, and cultural events affect your sales. Get detailed insights into seasonal variations and trends.",
      DoodleComponent: DoodleAnalysis
    },
    {
      title: "Predictive Sales Modeling",
      description: "Leverage advanced algorithms that analyze historical patterns and external factors to forecast future item-wise sales with high accuracy.",
      DoodleComponent: DoodlePredictive
    },
    {
      title: "Performance Scorecard",
      description: "Track prediction accuracy with detailed performance reports on daily, weekly, and monthly basis. Support continuous improvement with comprehensive analytics.",
      DoodleComponent: DoodleScorecard
    }
  ];

  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeaderVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  return (
    <section id="features" className="relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${BgBg})`
        }}
      />

      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div 
            ref={headerRef}
            className="text-center mb-16"
          >
            <div
              className={`transition-all duration-700 ${
                headerVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 -translate-y-8'
              }`}
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Powerful Features for Smart Predictions
              </h2>
              <p className="text-xl text-gray-300">
                Advanced tools to optimize your restaurant's operations
              </p>
            </div>
          </div>

          <div className="space-y-32">
            {features.map((feature, index) => (
              <FeatureBlock 
                key={index}
                feature={feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;