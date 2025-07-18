import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Brain, 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Award, 
  BookOpen,
  Calendar,
  Target,
  Zap,
  Play,
  Download,
  Share2,
  Plus,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const stats = {
    totalQuizzes: 24,
    averageScore: 78,
    studyTime: 12.5,
    streak: 7
  }

  const recentQuizzes = [
    {
      id: 1,
      title: 'Machine Learning Fundamentals',
      score: 85,
      date: '2024-01-15',
      timeSpent: '15 min',
      difficulty: 'medium'
    },
    {
      id: 2,
      title: 'Neural Networks Quiz',
      score: 92,
      date: '2024-01-14',
      timeSpent: '20 min',
      difficulty: 'hard'
    },
    {
      id: 3,
      title: 'Data Preprocessing Basics',
      score: 76,
      date: '2024-01-13',
      timeSpent: '12 min',
      difficulty: 'easy'
    }
  ]

  const savedQuizzes = [
    {
      id: 1,
      title: 'Advanced Machine Learning',
      topic: 'ML Algorithms',
      questions: 15,
      difficulty: 'hard',
      lastUsed: '2024-01-10'
    },
    {
      id: 2,
      title: 'Python Programming Basics',
      topic: 'Programming',
      questions: 10,
      difficulty: 'easy',
      lastUsed: '2024-01-08'
    }
  ]

  const progressData = [
    { subject: 'Machine Learning', progress: 85, color: 'from-blue-500 to-cyan-500' },
    { subject: 'Programming', progress: 72, color: 'from-green-500 to-emerald-500' },
    { subject: 'Mathematics', progress: 68, color: 'from-purple-500 to-pink-500' },
    { subject: 'Statistics', progress: 91, color: 'from-orange-500 to-red-500' }
  ]

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'from-green-500 to-emerald-500',
      medium: 'from-yellow-500 to-orange-500',
      hard: 'from-red-500 to-pink-500'
    }
    return colors[difficulty] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                Welcome back, <span className="gradient-text">Student!</span>
              </h1>
              <p className="text-xl text-gray-600">
                Track your progress and manage your learning journey
              </p>
            </div>
            <Link to="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Quiz</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { icon: BookOpen, label: 'Total Quizzes', value: stats.totalQuizzes, color: 'from-blue-500 to-cyan-500' },
            { icon: Award, label: 'Average Score', value: `${stats.averageScore}%`, color: 'from-green-500 to-emerald-500' },
            { icon: Clock, label: 'Study Time', value: `${stats.studyTime}h`, color: 'from-purple-500 to-pink-500' },
            { icon: TrendingUp, label: 'Current Streak', value: `${stats.streak} days`, color: 'from-orange-500 to-red-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-xl p-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'history', label: 'Quiz History', icon: Clock },
              { id: 'saved', label: 'Saved Quizzes', icon: BookOpen },
              { id: 'progress', label: 'Progress', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        {/* AnimatePresence mode="wait" is not imported, so it's removed. */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{quiz.title}</h4>
                      <p className="text-sm text-gray-500">{quiz.date} • {quiz.timeSpent}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium text-white bg-gradient-to-r ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                      <span className="font-semibold text-green-600">{quiz.score}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Subject Progress */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-primary-600" />
                Subject Progress
              </h3>
              <div className="space-y-4">
                {progressData.map((subject, index) => (
                  <motion.div
                    key={subject.subject}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{subject.subject}</span>
                      <span className="text-sm font-semibold text-gray-600">{subject.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${subject.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${subject.progress}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card p-6"
          >
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary-600" />
              Quiz History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Quiz</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuizzes.map((quiz) => (
                    <tr key={quiz.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-800">{quiz.title}</div>
                          <div className="text-sm text-gray-500">{quiz.difficulty}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-green-600">{quiz.score}%</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{quiz.timeSpent}</td>
                      <td className="py-3 px-4 text-gray-600">{quiz.date}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'saved' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {savedQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">{quiz.title}</h4>
                    <p className="text-sm text-gray-500">{quiz.topic}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium text-white bg-gradient-to-r ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Questions:</span>
                    <span className="font-medium">{quiz.questions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last used:</span>
                    <span className="font-medium">{quiz.lastUsed}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="btn-primary flex-1 flex items-center justify-center space-x-2 py-2">
                    <Play className="w-4 h-4" />
                    <span>Start</span>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'progress' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Weekly Progress Chart */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                Weekly Progress
              </h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chart visualization would go here</p>
              </div>
            </div>

            {/* Detailed Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {progressData.map((subject, index) => (
                <motion.div
                  key={subject.subject}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">{subject.subject}</h4>
                    <span className="text-2xl font-bold gradient-text">{subject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <motion.div
                      className={`h-3 rounded-full bg-gradient-to-r ${subject.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Quizzes taken:</span>
                      <span className="font-medium ml-2">12</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg score:</span>
                      <span className="font-medium ml-2">78%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard 