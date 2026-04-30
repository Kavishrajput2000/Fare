'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useAuthModal } from '../Context/AuthContext'

const Hero = () => {
  const { openAuth } = useAuthModal();
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/Hero.jpg')", 
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 bg-black opacity-70" />

      {/* Content */}
      <div className="container relative z-20 mx-auto flex h-full items-center px-6">
        <div className="max-w-4xl">
          
          {/* Animated Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter"
          >
            Ride <br /> <span className="text-yellow-400">Simplified.</span>
          </motion.h1>
          
          {/* Animated Paragraph */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }} // Slight delay for stagger effect
            className="mt-8 max-w-xl text-xl leading-relaxed text-gray-200"
          >
            Professional drivers. Transparent pricing. Available 24/7. 
            Welcome to Fare, your premium mobility solution.
          </motion.p>
          
          {/* Animated Button */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }} // Longer delay
            className="mt-12"
          >
            <button onClick={openAuth} className="rounded-full bg-yellow-400 px-10 py-4 text-lg font-bold text-black transition-transform hover:scale-105 active:scale-95 shadow-lg">
              Book Your Ride
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default Hero