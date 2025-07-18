import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Brain, 
  BookOpen, 
  Upload, 
  Zap, 
  Target, 
  Award, 
  Users, 
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles,
  Loader2
} from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()
  const [currentFeature, setCurrentFeature] = useState(0)
  const [clickedFeature, setClickedFeature] = useState(null)
  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload & Extract",
      description: "Upload PDFs or images. Our AI extracts text and identifies key concepts automatically."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Analysis",
      description: "Advanced NLP analyzes your content to understand topics, concepts, and learning objectives."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Smart Generation",
      description: "Generate diverse question types with customizable difficulty levels and explanations."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Interactive Learning",
      description: "Take quizzes with immediate feedback, track progress, and improve retention."
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleFeatureClick = async (featureTitle) => {
    setClickedFeature(featureTitle)
    
    // Add a small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 300))
    
    switch (featureTitle) {
      case "AI-Powered Analysis":
      case "Multiple Formats":
      case "Instant Generation":
        navigate('/upload')
        break
      case "Smart Difficulty":
      case "Progress Tracking":
        navigate('/dashboard')
        break
      case "Collaborative Learning":
        // For now, navigate to upload as collaborative features aren't implemented yet
        navigate('/upload')
        break
      default:
        navigate('/upload')
    }
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-secondary-400 to-accent-400 rounded-full opacity-20 blur-xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl mb-6 shadow-2xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-6">
              <span className="gradient-text">AIthena</span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your study materials into 
              <span className="text-gradient font-semibold"> intelligent quizzes</span> 
              with AI
            </p>
          </motion.div>

          {/* Feature Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: currentFeature === index ? 1 : 0.3,
                      scale: currentFeature === index ? 1 : 0.8
                    }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl text-white">
                      {feature.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Start Creating Quizzes</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
              <div className="text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">50K+</div>
              <div className="text-gray-600">Quizzes Generated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-dark-800 to-primary-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Why Choose <span className="gradient-text">AIthena</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of learning with our cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-12 h-12" />,
                title: "AI-Powered Analysis",
                description: "Advanced natural language processing extracts key concepts and generates contextually relevant questions.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Upload className="w-12 h-12" />,
                title: "Multiple Formats",
                description: "Support for PDFs, images, and text documents with OCR technology for seamless content extraction.",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <Target className="w-12 h-12" />,
                title: "Smart Difficulty",
                description: "Adaptive difficulty levels based on content complexity and student performance tracking.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <Award className="w-12 h-12" />,
                title: "Progress Tracking",
                description: "Comprehensive analytics and progress reports to monitor learning outcomes and improvement areas.",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: <Users className="w-12 h-12" />,
                title: "Collaborative Learning",
                description: "Share quizzes with classmates, create study groups, and learn together in an interactive environment.",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: <Zap className="w-12 h-12" />,
                title: "Instant Generation",
                description: "Generate comprehensive quizzes in seconds with detailed explanations and multiple question types.",
                color: "from-yellow-500 to-orange-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8 text-center group hover:scale-105 cursor-pointer transition-all duration-300 relative overflow-hidden"
                onClick={() => handleFeatureClick(feature.title)}
                whileHover={{ scale: clickedFeature === feature.title ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 text-white group-hover:shadow-lg transition-all duration-300`}>
                  {clickedFeature === feature.title ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    feature.icon
                  )}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {clickedFeature === feature.title ? (
                    <Loader2 className="w-5 h-5 text-primary-600 mx-auto animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-primary-600 mx-auto" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-dark-800 to-primary-900">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="card p-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to <span className="gradient-text">Transform</span> Your Learning?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students who are already using AIthena to ace their exams
            </p>
            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-xl px-10 py-5 flex items-center space-x-3 mx-auto"
              >
                <Sparkles className="w-6 h-6" />
                <span>Get Started Free</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 text-white py-12 px-4 border-t border-dark-700">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl mr-3">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold">AIthena</span>
          </div>
          <p className="text-gray-400 mb-6">
            Empowering students with AI-driven learning experiences
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage 