# 🧠 AIthena - AI-Powered Quiz Generation Platform

<div align="center">

![AIthena Logo](https://img.shields.io/badge/AIthena-AI%20Quiz%20Generator-purple?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![AI](https://img.shields.io/badge/AI-Groq%20LLM-orange?style=for-the-badge&logo=openai)

**Transform your study materials into intelligent, interactive quizzes using artificial intelligence**

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>

---

## ✨ Features

### 🎯 **Smart Content Processing**

- **Multi-format Support**: Upload PDFs, images (JPEG, PNG, GIF, BMP)
- **Advanced OCR**: Text extraction from images using Tesseract.js
- **PDF Parsing**: Intelligent text extraction from PDF documents
- **AI-Powered Analysis**: Natural language processing to identify key concepts

### 🧠 **Intelligent Quiz Generation**

- **Multiple Question Types**: Multiple choice, true/false, short answer, fill-in-the-blank
- **Adaptive Difficulty**: Easy, medium, and hard levels
- **Customizable Settings**: Number of questions, time limits, explanations
- **Topic Detection**: AI automatically identifies chapters and subjects
- **Smart Truncation**: Handles large documents intelligently

### 🎮 **Interactive Learning Experience**

- **Real-time Quiz Taking**: Timer, progress tracking, immediate feedback
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Progress Analytics**: Track performance across subjects and time
- **Confetti Celebrations**: Celebrate achievements with visual rewards
- **Detailed Results**: Comprehensive performance analysis and improvement tips

### 📊 **Advanced Analytics & Results**

- **Performance Breakdown**: Question type analysis and scoring
- **Mistake Review**: Detailed explanations for incorrect answers
- **Improvement Tips**: Personalized advice based on performance
- **Visual Progress**: Animated charts and progress indicators

## 🛠️ Technology Stack

### **Frontend**

- **React 18** - Modern React with hooks and functional components
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Lucide React** - Beautiful & consistent icon toolkit
- **React Router** - Declarative routing
- **React Hot Toast** - Elegant notifications
- **React Confetti** - Celebration effects

### **Backend**

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Multer** - File upload handling
- **Tesseract.js** - OCR for image text extraction
- **PDF-Parse** - PDF text extraction
- **Groq LLM API** - AI-powered quiz generation
- **CORS** - Cross-origin resource sharing

### **AI & Machine Learning**

- **Groq LLM** - High-performance language model for quiz generation
- **Natural Language Processing** - Topic detection and content analysis
- **Intelligent Text Processing** - Smart truncation and content optimization

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Groq API key (for AI features)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/aithena.git
   cd aithena
   ```

2. **Install dependencies**

   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. **Set up environment variables**

   ```bash
   # Create .env file in backend directory
   echo "GROQ_API_KEY=your_groq_api_key_here" > backend/.env
   ```

4. **Start the development servers**

   ```bash
   # Terminal 1: Start backend server
   cd backend && npm start

   # Terminal 2: Start frontend server
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:9000
   - Backend: http://localhost:9001

## 📖 Usage Guide

### 1. **Upload Study Materials**

- Drag and drop PDFs or images into the upload area
- Supported formats: PDF, PNG, JPG, JPEG, GIF, BMP
- Multiple files can be uploaded simultaneously

### 2. **Configure Quiz Settings**

- Select detected topics or choose your own
- Set number of questions (5-20)
- Choose difficulty level (Easy, Medium, Hard)
- Select question types
- Set time limits per question

### 3. **Generate & Take Quiz**

- AI generates questions based on your content
- Take the quiz with real-time feedback
- Navigate between questions with progress tracking
- Submit answers and see immediate results

### 4. **Review Performance**

- View comprehensive analytics
- See detailed breakdown by question type
- Review mistakes with explanations
- Get personalized improvement tips

## 🎨 Features in Detail

### **Smart File Processing**

- **OCR Technology**: Extract text from images with high accuracy
- **PDF Parsing**: Handle complex PDF structures
- **Content Validation**: Ensure sufficient content for quiz generation
- **Error Handling**: Graceful handling of corrupted or invalid files

### **AI-Powered Quiz Generation**

- **Contextual Questions**: Questions based on actual content
- **Multiple Formats**: Various question types for comprehensive testing
- **Explanation Generation**: Detailed explanations for each answer
- **Intelligent Truncation**: Handle large documents efficiently

### **Interactive Quiz Experience**

- **Responsive Design**: Works on all devices
- **Smooth Animations**: Engaging user experience
- **Real-time Feedback**: Immediate response to user actions
- **Progress Tracking**: Visual progress indicators

### **Comprehensive Analytics**

- **Performance Metrics**: Detailed scoring and statistics
- **Question Analysis**: Breakdown by type and difficulty
- **Learning Insights**: Identify strengths and weaknesses
- **Improvement Suggestions**: Actionable advice for better performance

## 🔧 Configuration

### Environment Variables

```bash
# Backend (.env)
GROQ_API_KEY=your_groq_api_key_here
PORT=9001

# Frontend (vite.config.js)
VITE_API_URL=http://localhost:9001
```

### Customization

- **Theme Colors**: Modify `tailwind.config.js` for custom branding
- **Question Types**: Add new question types in backend logic
- **AI Models**: Switch between different LLM providers
- **UI Components**: Customize components in `src/components/`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** for providing the LLM API
- **Tesseract.js** for OCR capabilities
- **React Community** for the amazing ecosystem
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/aithena/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/aithena/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/aithena/discussions)
- **Email**: support@aithena.com

---

<div align="center">

**Made with ❤️ by the AIthena Team**

[⭐ Star this repo](https://github.com/yourusername/aithena) • [🔄 Fork this repo](https://github.com/yourusername/aithena/fork)

</div>
