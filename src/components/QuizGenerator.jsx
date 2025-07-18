import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { 
  Brain, 
  Target, 
  Settings, 
  Play, 
  BookOpen, 
  Clock, 
  Users, 
  Zap,
  Sparkles,
  CheckCircle,
  Loader2,
  ArrowRight,
  Download,
  Share2,
  Eye,
  Edit3
} from 'lucide-react'

const QuizGenerator = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [quizConfig, setQuizConfig] = useState({
    topic: '',
    questionCount: 10,
    difficulty: 'medium',
    questionTypes: ['multiple-choice', 'true-false', 'short-answer'],
    includeExplanations: true,
    timeLimit: 30
  })
  const [generatedQuiz, setGeneratedQuiz] = useState(null)
  const [detectedTopics, setDetectedTopics] = useState([])
  const [detectingTopics, setDetectingTopics] = useState(false)

  const extractedText = location.state?.extractedText || ''

  useEffect(() => {
    if (extractedText) {
      detectTopics();
    }
  }, [extractedText])

  const detectTopics = async () => {
    setDetectingTopics(true);
    try {
      console.log('Detecting topics from extracted text...');
      const { data } = await axios.post('/api/detect-topics', {
        text: extractedText
      });
      
      if (data.topics && data.topics.length > 0) {
        console.log('Detected topics:', data.topics);
        setDetectedTopics(data.topics);
        setQuizConfig(prev => ({ ...prev, topic: data.topics[0] }));
      } else {
        // Fallback to generic topics if AI detection fails
        const fallbackTopics = ['General Content', 'Key Concepts', 'Main Topics'];
        setDetectedTopics(fallbackTopics);
        setQuizConfig(prev => ({ ...prev, topic: fallbackTopics[0] }));
      }
    } catch (error) {
      console.error('Topic detection failed:', error);
      // Fallback to generic topics
      const fallbackTopics = ['General Content', 'Key Concepts', 'Main Topics'];
      setDetectedTopics(fallbackTopics);
      setQuizConfig(prev => ({ ...prev, topic: fallbackTopics[0] }));
    } finally {
      setDetectingTopics(false);
    }
  }

  const generateQuiz = async () => {
    if (!quizConfig.topic) {
      toast.error('Please select a topic')
      return
    }
    
    if (!extractedText || extractedText.trim().length < 50) {
      toast.error('Not enough text content for quiz generation. Please upload more content.')
      return
    }
    
    // Notify user if content is very large
    if (extractedText.length > 3000) {
      toast.success(`Processing ${extractedText.length} characters of content. Large content will be intelligently summarized for optimal quiz generation.`)
    }
    
    setGenerating(true)
    setCurrentStep(2)
    try {
      console.log('Generating quiz with config:', quizConfig);
      console.log('Extracted text length:', extractedText.length);
      
      const { data } = await axios.post('/api/generate-quiz', {
        text: extractedText,
        topic: quizConfig.topic,
        questionCount: quizConfig.questionCount,
        difficulty: quizConfig.difficulty,
        questionTypes: quizConfig.questionTypes,
        includeExplanations: quizConfig.includeExplanations,
        timeLimit: quizConfig.timeLimit
      })
      
      console.log('Quiz generation response:', data);
      
      if (data.quiz && data.quiz.questions && data.quiz.questions.length > 0) {
        setGeneratedQuiz(data.quiz)
        setCurrentStep(3)
        toast.success('Quiz generated successfully!')
      } else {
        throw new Error('Invalid quiz data received from server')
      }
    } catch (error) {
      console.error('Quiz generation error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Error generating quiz';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setCurrentStep(1); // Go back to configuration step
    } finally {
      setGenerating(false)
    }
  }

  const startQuiz = () => {
    navigate(`/quiz/${generatedQuiz.id || '1'}`, { state: { quiz: generatedQuiz } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl mb-6 shadow-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Generate Your <span className="gradient-text">Quiz</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Customize your quiz settings and let our AI create engaging questions from your study materials.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 1, title: 'Configure Quiz', icon: Settings },
              { step: 2, title: 'Generating', icon: Loader2 },
              { step: 3, title: 'Review & Start', icon: Play }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= item.step 
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 border-transparent text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep === item.step && item.step === 2 ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : currentStep > item.step ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <item.icon className="w-6 h-6" />
                  )}
                </div>
                <span className={`ml-3 font-medium ${
                  currentStep >= item.step ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {item.title}
                </span>
                {index < 2 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > item.step ? 'bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quiz Configuration */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            {/* Left Column - Basic Settings */}
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary-600" />
                  Topic Selection
                  {detectedTopics.length > 0 && !detectingTopics && (
                    <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      AI Detected
                    </span>
                  )}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Topic
                    </label>
                    {detectingTopics ? (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Loader2 className="w-5 h-5 text-primary-600 animate-spin" />
                        <span className="text-gray-600">Analyzing content for topics...</span>
                      </div>
                    ) : (
                      <select
                        value={quizConfig.topic}
                        onChange={(e) => setQuizConfig(prev => ({ ...prev, topic: e.target.value }))}
                        className="input-field"
                      >
                        <option value="">Choose a topic...</option>
                        {detectedTopics.map((topic, index) => (
                          <option key={index} value={topic}>{topic}</option>
                        ))}
                      </select>
                    )}
                    {detectedTopics.length > 0 && !detectingTopics && (
                      <p className="text-sm text-gray-500 mt-2">
                        {detectedTopics.length} topics detected from your content
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Questions
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={quizConfig.questionCount}
                      onChange={(e) => setQuizConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>5</span>
                      <span className="font-medium">{quizConfig.questionCount}</span>
                      <span>20</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['easy', 'medium', 'hard'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setQuizConfig(prev => ({ ...prev, difficulty: level }))}
                          className={`p-3 rounded-lg text-sm font-medium transition-all ${
                            quizConfig.difficulty === level
                              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-600" />
                  Time Settings
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes per question)
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="15"
                    value={quizConfig.timeLimit}
                    onChange={(e) => setQuizConfig(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>15s</span>
                    <span className="font-medium">{quizConfig.timeLimit}s</span>
                    <span>60s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Advanced Settings */}
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
                  Question Types
                </h3>
                <div className="space-y-3">
                  {[
                    { id: 'multiple-choice', label: 'Multiple Choice', description: 'Classic multiple choice questions' },
                    { id: 'true-false', label: 'True/False', description: 'Simple true or false statements' },
                    { id: 'short-answer', label: 'Short Answer', description: 'Brief written responses' },
                    { id: 'fill-blank', label: 'Fill in the Blank', description: 'Complete missing words or phrases' }
                  ].map((type) => (
                    <label key={type.id} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quizConfig.questionTypes.includes(type.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setQuizConfig(prev => ({
                              ...prev,
                              questionTypes: [...prev.questionTypes, type.id]
                            }))
                          } else {
                            setQuizConfig(prev => ({
                              ...prev,
                              questionTypes: prev.questionTypes.filter(t => t !== type.id)
                            }))
                          }
                        }}
                        className="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <div>
                        <div className="font-medium text-gray-800">{type.label}</div>
                        <div className="text-sm text-gray-500">{type.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-primary-600" />
                  Additional Options
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quizConfig.includeExplanations}
                      onChange={(e) => setQuizConfig(prev => ({ ...prev, includeExplanations: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div>
                      <div className="font-medium text-gray-800">Include Explanations</div>
                      <div className="text-sm text-gray-500">Show detailed explanations for each answer</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Preview Card */}
              <div className="card p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Quiz Preview</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Topic:</span>
                    <span className="font-medium">{quizConfig.topic || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span className="font-medium">{quizConfig.questionCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <span className="font-medium capitalize">{quizConfig.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Limit:</span>
                    <span className="font-medium">{quizConfig.timeLimit}s per question</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Question Types:</span>
                    <span className="font-medium">{quizConfig.questionTypes.length} selected</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Generating Quiz */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <div className="card p-12 text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl mb-4">
                  <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Generating Your Quiz</h3>
                <p className="text-gray-600">
                  Our AI is analyzing your content and creating engaging questions...
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          </motion.div>
        )}

        {/* Quiz Review */}
        {currentStep === 3 && generatedQuiz && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">{generatedQuiz.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{generatedQuiz.questions.length} questions</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500 capitalize">{quizConfig.difficulty}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {generatedQuiz.questions.slice(0, 6).map((question, index) => (
                  <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Q{index + 1}</span>
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        {question.type.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-3">{question.question}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={startQuiz}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Quiz</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download PDF</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Share Quiz</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          {currentStep === 1 && (
            <button
              onClick={generateQuiz}
              disabled={!quizConfig.topic}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Quiz</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default QuizGenerator 