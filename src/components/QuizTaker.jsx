import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Confetti from 'react-confetti'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Home,
  Award,
  Brain,
  Timer,
  BarChart3
} from 'lucide-react'

const QuizTaker = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [quiz] = useState(location.state?.quiz)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(30)
  const [isPaused, setIsPaused] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  // Default time limit - can be overridden by quiz config
  const timeLimit = quiz?.timeLimit || 30

  useEffect(() => {
    if (!quiz) {
      console.error('No quiz data found')
      navigate('/')
      return
    }
    
    // Validate quiz structure
    if (!quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      console.error('Invalid quiz structure:', quiz)
      toast.error('Invalid quiz data. Please try again.')
      navigate('/')
      return
    }
    
    console.log('Quiz loaded successfully:', quiz)
    console.log('First question structure:', quiz.questions[0])
    console.log('All questions:', quiz.questions.map((q, i) => ({ 
      index: i, 
      hasQuestion: !!q.question, 
      hasOptions: !!q.options, 
      optionsLength: q.options?.length || 0 
    })))
  }, [quiz, navigate])

  useEffect(() => {
    if (!quizStarted || isPaused || showResults) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion()
          return timeLimit
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, isPaused, showResults, currentQuestion, timeLimit])

  const startQuiz = () => {
    setQuizStarted(true)
    setTimeLeft(timeLimit)
  }

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }))
  }

  const handleNextQuestion = () => {
    console.log('handleNextQuestion called. Current question:', currentQuestion, 'Total questions:', quiz.questions.length)
    
    if (!quiz || !quiz.questions) {
      console.error('Quiz or questions not available')
      toast.error('Quiz data error. Please try again.')
      navigate('/')
      return
    }
    
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => {
        const nextQuestion = prev + 1
        console.log('Moving to question:', nextQuestion)
        return nextQuestion
      })
      setTimeLeft(timeLimit)
    } else {
      console.log('Finishing quiz')
      finishQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setTimeLeft(timeLimit)
    }
  }

  const finishQuiz = () => {
    setShowResults(true)
    const score = calculateScore()
    if (score >= 80) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }

  const calculateScore = () => {
    let correct = 0
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index]
      if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
        if (question.type === 'short-answer' || question.type === 'fill-blank') {
          // For short answer questions, we'll consider any non-empty answer as "attempted"
          // In a real implementation, you might want to use AI to grade these
          correct += 1
        } else {
          // For multiple choice and true-false questions
          if (userAnswer === question.correctAnswer) {
            correct++
          }
        }
      }
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  const getQuestionTypeLabel = (type) => {
    return type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getQuestionTypeColor = (type) => {
    const colors = {
      'multiple-choice': 'from-blue-500 to-cyan-500',
      'true-false': 'from-green-500 to-emerald-500',
      'short-answer': 'from-purple-500 to-pink-500',
      'fill-blank': 'from-orange-500 to-red-500'
    }
    return colors[type] || 'from-gray-500 to-gray-600'
  }

  if (!quiz) {
    console.error('No quiz data available')
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Quiz Not Found</h1>
          <p className="text-gray-400 mb-6">The quiz data could not be loaded.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    console.error('Invalid quiz structure:', quiz)
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Quiz</h1>
          <p className="text-gray-400 mb-6">The quiz data is invalid or corrupted.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-12 text-center max-w-2xl bg-dark-800 border border-gray-700"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl mb-6 shadow-xl">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
            {quiz.title}
          </h1>
          <p className="text-gray-300 mb-8">
            Get ready to test your knowledge! This quiz contains {quiz.questions.length} questions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center space-x-2 mb-2">
                <Timer className="w-5 h-5 text-primary-400" />
                <span className="font-semibold text-white">Time Limit</span>
              </div>
              <p className="text-gray-300">{timeLimit} seconds per question</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-5 h-5 text-primary-400" />
                <span className="font-semibold text-white">Difficulty</span>
              </div>
              <p className="text-gray-300 capitalize">{quiz.difficulty || 'Medium'}</p>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            <span>Start Quiz</span>
          </button>
        </motion.div>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    
    // Calculate correct answers properly for different question types
    const correctAnswers = quiz.questions.reduce((count, question, index) => {
      const userAnswer = answers[index]
      if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
        if (question.type === 'short-answer' || question.type === 'fill-blank') {
          // For short answer questions, count as attempted
          return count + 1
        } else {
          // For multiple choice and true-false questions
          if (userAnswer === question.correctAnswer) {
            return count + 1
          }
        }
      }
      return count
    }, 0)

    // Calculate detailed analytics
    const questionAnalytics = quiz.questions.map((question, index) => {
      const userAnswer = answers[index]
      const isCorrect = question.type === 'short-answer' || question.type === 'fill-blank' 
        ? (userAnswer && userAnswer.trim() !== '')
        : userAnswer === question.correctAnswer
      
      return {
        question: question.question,
        type: question.type,
        userAnswer: userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      }
    })

    const correctQuestions = questionAnalytics.filter(q => q.isCorrect)
    const incorrectQuestions = questionAnalytics.filter(q => !q.isCorrect)
    const attemptedQuestions = questionAnalytics.filter(q => q.userAnswer !== undefined && q.userAnswer !== null && q.userAnswer !== '')

    // Generate improvement tips based on performance
    const getImprovementTips = () => {
      const tips = []
      
      if (score < 60) {
        tips.push("Focus on understanding the core concepts before moving to advanced topics")
        tips.push("Review your study materials more thoroughly")
      } else if (score < 80) {
        tips.push("Practice with more questions to reinforce your knowledge")
        tips.push("Pay attention to question details and keywords")
      } else {
        tips.push("Great job! Consider challenging yourself with more difficult questions")
        tips.push("Help others learn by explaining concepts you've mastered")
      }
      
      if (incorrectQuestions.length > 0) {
        tips.push("Review the explanations for questions you got wrong")
        tips.push("Take notes on concepts that need more practice")
      }
      
      return tips
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 py-12 px-4">
        {showConfetti && <Confetti />}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-center shadow-lg"
          >
            <div className="text-3xl font-bold text-white mb-2">{score}%</div>
            <div className="text-primary-100">Overall Score</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-center shadow-lg"
          >
            <div className="text-3xl font-bold text-white mb-2">{correctQuestions.length}</div>
            <div className="text-green-100">Correct</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-center shadow-lg"
          >
            <div className="text-3xl font-bold text-white mb-2">{incorrectQuestions.length}</div>
            <div className="text-red-100">Incorrect</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-center shadow-lg"
          >
            <div className="text-3xl font-bold text-white mb-2">{attemptedQuestions.length}</div>
            <div className="text-blue-100">Attempted</div>
          </motion.div>
        </div>

        {/* Performance Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Question Type Breakdown */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-dark-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary-400" />
              Question Type Performance
            </h3>
            <div className="space-y-4">
              {['multiple-choice', 'true-false', 'short-answer', 'fill-blank'].map((type, index) => {
                const typeQuestions = questionAnalytics.filter(q => q.type === type)
                if (typeQuestions.length === 0) return null
                
                const correct = typeQuestions.filter(q => q.isCorrect).length
                const percentage = Math.round((correct / typeQuestions.length) * 100)
                
                return (
                  <motion.div 
                    key={type} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-gray-300 capitalize">{type.replace('-', ' ')}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                        />
                      </div>
                      <span className="text-white font-semibold">{percentage}%</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Improvement Tips */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-dark-800 rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-primary-400" />
              Improvement Tips
            </h3>
            <div className="space-y-3">
              {getImprovementTips().map((tip, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 text-sm">{tip}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Detailed Review */}
        {incorrectQuestions.length > 0 && (
          <div className="bg-dark-800 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <XCircle className="w-5 h-5 mr-2 text-red-400" />
              Review Your Mistakes
            </h3>
            <div className="space-y-4">
              {incorrectQuestions.map((q, index) => (
                <div key={index} className="border border-red-500/20 rounded-lg p-4 bg-red-500/5">
                  <div className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">{q.question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-red-400">Your Answer:</span>
                          <p className="text-gray-300 mt-1">
                            {q.type === 'short-answer' || q.type === 'fill-blank' 
                              ? (q.userAnswer || 'No answer provided')
                              : q.userAnswer !== undefined 
                                ? `Option ${q.userAnswer + 1}`
                                : 'No answer provided'
                            }
                          </p>
                        </div>
                        <div>
                          <span className="text-green-400">Correct Answer:</span>
                          <p className="text-gray-300 mt-1">
                            {q.type === 'short-answer' || q.type === 'fill-blank'
                              ? 'See explanation below'
                              : `Option ${q.correctAnswer + 1}`
                            }
                          </p>
                        </div>
                      </div>
                      {q.explanation && (
                        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <span className="text-blue-400 text-sm font-medium">Explanation:</span>
                          <p className="text-gray-300 text-sm mt-1">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center space-x-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
  }

  const question = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  // Additional safety check
  if (!question) {
    console.error('Current question not found:', currentQuestion, 'Available questions:', quiz.questions.length)
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Question Not Found</h1>
          <p className="text-gray-400 mb-6">The current question could not be loaded.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Validate question structure
  if (!question.question || !question.options || !Array.isArray(question.options) || question.options.length === 0) {
    console.error('Invalid question structure:', question)
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Invalid Question</h1>
          <p className="text-gray-400 mb-6">The current question has invalid data structure.</p>
          <div className="text-sm text-gray-500 mb-4">
            <p>Question: {question.question ? 'Present' : 'Missing'}</p>
            <p>Options: {question.options ? `${question.options.length} items` : 'Missing'}</p>
          </div>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
              <p className="text-gray-300">Question {currentQuestion + 1} of {quiz.questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </button>
              <div className="flex items-center space-x-2 bg-red-900/50 px-3 py-2 rounded-lg border border-red-500/30">
                <Clock className="w-5 h-5 text-red-400" />
                <span className="font-semibold text-red-400">{timeLeft}s</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="card p-8 mb-8 bg-dark-800 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-gray-400">
                {getQuestionTypeLabel(question.type)}
              </span>
              <div className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getQuestionTypeColor(question.type)}`}>
                {question.type.replace('-', ' ')}
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-semibold mb-8 text-white leading-relaxed">
              {question.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-4">
              {question.type === 'short-answer' || question.type === 'fill-blank' ? (
                // Text input for short answer and fill in the blank questions
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={answers[currentQuestion] || ''}
                      onChange={(e) => {
                        handleAnswer(e.target.value)
                        // Auto-resize the textarea
                        e.target.style.height = 'auto'
                        e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
                      }}
                      placeholder="Enter your answer here..."
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 resize-none bg-gray-800 text-white placeholder-gray-400 ${
                        answers[currentQuestion] 
                          ? 'border-primary-500 bg-gray-700 shadow-lg' 
                          : 'border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                      }`}
                      rows={3}
                      style={{ minHeight: '120px', maxHeight: '200px' }}
                    />
                    {answers[currentQuestion] && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle className="w-5 h-5 text-primary-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    Type your answer in the text box above. Be as detailed as possible.
                  </div>
                </div>
              ) : (
                // Multiple choice options for other question types
                question.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(index)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      answers[currentQuestion] === index
                        ? 'border-primary-500 bg-gray-700 shadow-lg'
                        : 'border-gray-600 bg-gray-800 hover:border-primary-400 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion] === index
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-500'
                      }`}>
                        {answers[currentQuestion] === index && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-white">{option}</span>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2 text-sm text-gray-400">
            {Object.keys(answers).filter(key => {
              const answer = answers[key]
              return answer !== undefined && answer !== null && answer !== ''
            }).length} of {quiz.questions.length} answered
          </div>

          <button
            onClick={handleNextQuestion}
            className="btn-primary flex items-center space-x-2"
          >
            <span>{currentQuestion === quiz.questions.length - 1 ? 'Finish' : 'Next'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default QuizTaker 