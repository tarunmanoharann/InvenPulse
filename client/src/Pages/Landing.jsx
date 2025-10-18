// src/pages/Landing.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import Features from '../components/Features';

const Landing = () => {
  return (
    <div className="min-h-screen ">
      <Navbar />
      <HeroSection />
      <Features/>
      <Footer/>
    </div>
  );
};

export default Landing;