'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Auth from './Auth'
import { useAuthModal } from '../Context/AuthContext'

const NAV_LINKS = [
  { name: 'Home', href: '#ride' },
  { name: 'Booking', href: '#drive' },
  { name: 'About Us', href: '#business' },
  { name: 'Contact', href: '#fleet' },
]

const Nav = () => {
  const { openAuth } = useAuthModal();
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [authopen,setAuthopen]=useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-3' : 'py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className={`flex items-center justify-between transition-all duration-700 ease-in-out ${
          isScrolled 
            ? 'bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-full px-6 py-2 shadow-2xl' 
            : 'bg-transparent px-2 py-2'
        }`}>
          
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer z-[60]">
            <div className="h-8 w-8 md:h-9 md:w-9 bg-yellow-400 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-transform duration-300">
              <span className="text-black font-black text-lg md:text-xl italic">F</span>
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tighter text-white">FARE</span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="group relative text-md font-medium text-white/70 hover:text-white transition-colors tracking-wide"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA Group */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={openAuth} className="text-md font-semibold text-white/80 hover:text-yellow-400 transition-colors">
              Log in
            </button>
            <button className="bg-yellow-400 px-6 py-2 rounded-full text-md font-bold text-black hover:bg-white transition-all active:scale-95">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden z-[60] p-2 text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-all ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-8 z-50 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-3xl font-bold text-white hover:text-yellow-400"
              >
                {link.name}
              </motion.a>
            ))}
            <button className="mt-4 bg-yellow-400 px-10 py-4 rounded-full text-xl font-bold text-black">
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Nav