import React from 'react';
import { Link } from 'react-router-dom';
import doodleBg from '../assets/bgbg.jpg';
import RestaurantBg from '../assets/mockup.png';

export default function HeroSection() {
  return (
    // Outer wrapper with background
    <div 
      className="w-full bg-cover bg-center"
      style={{
        backgroundImage: `url(${doodleBg})`,
        backgroundAttachment: 'fixed',
      
      }}
    >
      {/* Inner content container */}
      <div className="mx-auto max-w-[1480px] pt-24 pb-8">
        <div className="relative rounded-lg overflow-hidden">
          <div className="grid h-[610px]">
            <div 
              className="relative bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${RestaurantBg})`
              }}
            />
          </div>

          {/* Overlay Content with Glassmorphism */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-5xl mx-4 p-10 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20">
              <div className="text-center">
                <h1 className="text-6xl md:text-7xl font-semibold text-white mb-4 leading-tight">
                  Powering{' '}
                  <span 
                    className="inline-block animate-gradient bg-gradient-to-r bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(-45deg, #6366f1, #3b82f6, #06b6d4)',
                      backgroundSize: '200% 200%',
                      animation: 'gradient 3s ease infinite'
                    }}
                  >
                    4 million
                  </span>{' '}
                  businesses Globally.
                </h1>
                <p className="text-4xl md:text-5xl text-white mb-8 font-light pb-3">
                  Ready for yours.
                </p>
                <div>
                  <Link
                    to="/dashboard/inventory"
                    className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-md text-lg font-medium hover:from-blue-700 hover:to-blue-900 transition-all transform hover:scale-105 shadow-md"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add the animation keyframes via a style tag */}
      <style>
        {`
          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>
    </div>
  );
}