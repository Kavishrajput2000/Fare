'use client'
import React from 'react'
import Hero from './Hero'
// import VehicleSlider from './VehicleSlider'
import Auth from './Auth'
import { AuthProvider } from '../Context/AuthContext'

function PublicHome() {
  return (
    <AuthProvider>
      <div className="relative">
        <Hero />
        {/* <VehicleSlider/> */}
        <Auth />
      </div>
    </AuthProvider>
  )
}

export default PublicHome