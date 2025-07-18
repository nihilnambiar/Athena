import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'

// Components
import LandingPage from './components/LandingPage'
import UploadPage from './components/UploadPage'
import QuizGenerator from './components/QuizGenerator'
import QuizTaker from './components/QuizTaker'
import Dashboard from './components/Dashboard'
import Navigation from './components/Navigation'

function App() {
  return (
    <div className="min-h-screen">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/generate" element={<QuizGenerator />} />
        <Route path="/quiz/:id" element={<QuizTaker />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App 