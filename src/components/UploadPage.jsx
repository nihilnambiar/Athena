import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { 
  Upload, 
  FileText, 
  Image, 
  X, 
  CheckCircle, 
  Loader2,
  Brain,
  ArrowRight,
  Sparkles,
  Eye,
  Trash2
} from 'lucide-react'

const UploadPage = () => {
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [extractedText, setExtractedText] = useState('')
  const [currentStep, setCurrentStep] = useState(1)

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      type: file.type,
      name: file.name,
      size: file.size
    }))
    setFiles(prev => [...prev, ...newFiles])
    toast.success(`${acceptedFiles.length} file(s) uploaded successfully!`)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    multiple: true
  })

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const processFiles = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one file')
      return
    }
    setProcessing(true)
    setCurrentStep(2)
    try {
      let allText = ''
      for (const fileObj of files) {
        const formData = new FormData()
        formData.append(fileObj.type.startsWith('image/') ? 'image' : 'pdf', fileObj.file)
        let endpoint = fileObj.type.startsWith('image/') ? '/api/ocr' : '/api/pdf'
        
        console.log(`Processing ${fileObj.name} with endpoint ${endpoint}`)
        
        const { data } = await axios.post(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        if (data.text) {
          allText += data.text + '\n'
          console.log(`Successfully extracted text from ${fileObj.name}`)
        } else {
          console.warn(`No text extracted from ${fileObj.name}`)
        }
      }
      
      if (allText.trim()) {
        setExtractedText(allText)
        setCurrentStep(3)
        toast.success('Text extraction completed!')
      } else {
        throw new Error('No text could be extracted from the uploaded files')
      }
    } catch (error) {
      console.error('File processing error:', error)
      const errorMessage = error.response?.data?.error || error.message || 'Error processing files'
      const errorDetails = error.response?.data?.details || ''
      
      // Show both error message and details if available
      if (errorDetails) {
        toast.error(`${errorMessage}: ${errorDetails}`)
      } else {
        toast.error(errorMessage)
      }
      
      setCurrentStep(1) // Go back to upload step
    } finally {
      setProcessing(false)
    }
  }

  const continueToQuiz = () => {
    navigate('/generate', { 
      state: { 
        extractedText,
        files: files.map(f => ({ name: f.name, type: f.type }))
      }
    })
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
            Upload Your <span className="gradient-text">Study Materials</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload PDFs or images of your textbooks, notes, or any study content. 
            Our AI will extract the text and prepare it for quiz generation.
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
              { step: 1, title: 'Upload Files', icon: Upload },
              { step: 2, title: 'Processing', icon: Loader2 },
              { step: 3, title: 'Review Text', icon: Eye }
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

        {/* Upload Area */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <div
              {...getRootProps()}
              className={`card p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive ? 'ring-4 ring-primary-300 scale-105' : 'hover:scale-102'
              }`}
            >
              <input {...getInputProps()} />
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl mb-4">
                  <Upload className="w-10 h-10 text-primary-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                <p className="text-gray-600 mb-4">
                  or click to browse files
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>PDF</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Image className="w-4 h-4" />
                    <span>Images</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h3 className="text-xl font-semibold mb-4">Uploaded Files</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file) => (
                <div key={file.id} className="card p-4">
                  <div className="flex items-center space-x-3">
                    {file.preview ? (
                      <img 
                        src={file.preview} 
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Processing Section */}
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
                <h3 className="text-2xl font-semibold mb-2">Processing Your Files</h3>
                <p className="text-gray-600">
                  Our AI is extracting text and analyzing your content...
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          </motion.div>
        )}

        {/* Extracted Text Review */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="card p-8">
              <h3 className="text-2xl font-semibold mb-4">Extracted Text Preview</h3>
              <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm leading-relaxed">
                  {extractedText}
                </pre>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                {extractedText.split('\n').length} lines extracted from {files.length} file(s)
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center space-x-4"
        >
          {currentStep === 1 && files.length > 0 && (
            <button
              onClick={processFiles}
              className="btn-primary flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Process Files</span>
            </button>
          )}
          
          {currentStep === 3 && (
            <button
              onClick={continueToQuiz}
              className="btn-primary flex items-center space-x-2"
            >
              <span>Continue to Quiz Generation</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <div className="card p-6">
            <h4 className="font-semibold mb-3 text-gray-800">💡 Tips for Best Results</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Ensure your PDFs and images are clear and well-lit</li>
              <li>• For images, use high resolution for better text extraction</li>
              <li>• Include chapter titles and headings for better topic detection</li>
              <li>• You can upload multiple files at once</li>
              <li>• Supported formats: PDF, PNG, JPG, JPEG, GIF, BMP</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UploadPage 