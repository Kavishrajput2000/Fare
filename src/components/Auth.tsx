'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuthModal } from '../Context/AuthContext'
import { useApiForm } from '../Helper/useApiForm'
import { signIn } from 'next-auth/react'

const Auth = () => {
  const { isAuthOpen, closeAuth } = useAuthModal()
  const [isLogin, setIsLogin] = useState(true)
  const [showOtp, setShowOtp] = useState(false) // New state for OTP UI
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const apiUrl = process.env.NEXT_PUBLIC_PROD_API_URL
  const endpoint = isLogin ? `${apiUrl}/auth/login` : `${apiUrl}/auth/register`

  const { execute, isLoading, reset } = useApiForm(
    endpoint,
    "POST",
    {
      showToast: true,
      defaultSuccessMsg: isLogin ? 'OTP sent to your email!' : 'Account created! Verify OTP.',
      onSuccess: () => {
        // Instead of closing, show OTP screen
        setShowOtp(true)
      }
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = isLogin ? { email: form.email, password: form.password } : form
    await execute(payload)
  }

  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return
    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalOtp = otp.join('')
    console.log("Verifying OTP:", finalOtp)
    // Add your OTP verification API call here
    // On Success: closeAuth()
  }

  const handleGoogleLogin = async () => {
    await signIn("google", {
      callbackUrl: "http://localhost:3000/",
      redirect: true,
    })
  }

  return (
    <AnimatePresence>
      {isAuthOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuth}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-[2.5rem] bg-[#111] border border-white/10 p-10 shadow-2xl"
          >
            <button onClick={closeAuth} className="absolute right-6 top-6 text-white/30 hover:text-white">
              <X size={24} />
            </button>

            {!showOtp ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                    {isLogin ? 'Welcome back' : 'Start your journey'}
                  </h2>
                </div>

                {/* Google Button with Icon */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-bold mb-6 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-full bg-white/10" />
                  <span className="text-xs text-white/30">OR</span>
                  <div className="h-px w-full bg-white/10" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <div className="relative">
                      <User className="absolute left-4 top-4 text-white/30" size={20} />
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full pl-12 py-4 rounded-2xl bg-white/5 text-white border border-transparent focus:border-yellow-400 outline-none"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-4 top-4 text-white/30" size={20} />
                    <input
                      type="email"
                      required
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-12 py-4 rounded-2xl bg-white/5 text-white border border-transparent focus:border-yellow-400 outline-none"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-4 text-white/30" size={20} />
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full pl-12 py-4 rounded-2xl bg-white/5 text-white border border-transparent focus:border-yellow-400 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-bold flex justify-center items-center gap-2 hover:bg-yellow-500 transition-transform active:scale-95"
                  >
                    {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
                    <ArrowRight size={16} />
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button onClick={() => { setIsLogin(!isLogin); reset(); }} className="text-white/40 text-sm hover:text-white transition-colors">
                    {isLogin ? "Don't have an account? SIGN UP" : "Already have an account? SIGN IN"}
                  </button>
                </div>
              </>
            ) : (
              /* OTP Verification UI */
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="text-yellow-400" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Verify Email</h2>
                <p className="text-white/40 text-center text-sm mb-8">
                  We've sent a 6-digit code to <br />
                  <span className="text-white font-medium">{form.email}</span>
                </p>

                <form onSubmit={handleVerifyOtp} className="w-full space-y-8">
                  <div className="flex justify-between gap-2">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={data}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        className="w-12 h-14 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:border-yellow-400 focus:bg-white/10 outline-none transition-all"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-bold hover:bg-yellow-500 transition-transform active:scale-95"
                  >
                    Verify & Proceed
                  </button>
                </form>

                <button 
                  onClick={() => setShowOtp(false)}
                  className="mt-6 text-white/30 text-sm hover:text-white"
                >
                  Back to {isLogin ? 'Login' : 'Register'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Auth