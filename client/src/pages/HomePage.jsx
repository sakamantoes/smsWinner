// src/App.jsx
import React, { useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import ThreeSection from '../components/ThreeSection';
import WhyUs from '../components/WhyUs';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

function App() {
  // Add smooth scroll behavior for anchor links
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.hash) {
        const hash = target.hash;
        if (hash === '#home' || hash === '#about' || hash === '#services' || hash === '#contact') {
          e.preventDefault();
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            // Update URL without jumping
            window.history.pushState(null, null, hash);
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    // Handle initial hash on load
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }

    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="bg-black overflow-x-hidden">
      <Navbar />
      
      {/* Add id attributes to each section for anchor linking */}
      <section id="home"><Hero /></section>
      <section id="about"><About /></section>
      <section id="services"><Services /></section>
      <ThreeSection />
      <WhyUs />
      <Testimonials />
      <Pricing />
      <section id="contact"><Contact /></section>
      <Footer />
    </div>
  );
}

export default App;