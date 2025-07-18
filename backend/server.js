const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 9001;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: uploadsDir });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AIthena backend running!' });
});

// File upload endpoint (accepts PDF or image)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ filename: req.file.filename, originalname: req.file.originalname, mimetype: req.file.mimetype });
});

// OCR endpoint (extract text from image)
app.post('/api/ocr', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  
  console.log('Image upload received:', {
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
  
  try {
    const result = await Tesseract.recognize(
      req.file.path,
      'eng',
      { logger: m => console.log('OCR:', m) }
    );
    
    console.log('OCR completed, text length:', result.data.text?.length || 0);
    
    if (!result.data.text || result.data.text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'No text extracted from image', 
        details: 'The image appears to contain no readable text. Please ensure the image has clear, readable text content.' 
      });
    }
    
    res.json({ text: result.data.text });
  } catch (err) {
    console.error('OCR error:', err);
    
    let errorMessage = 'OCR failed';
    let details = err.message;
    
    if (err.message.includes('Image format not supported')) {
      errorMessage = 'Unsupported image format';
      details = 'The uploaded image format is not supported. Please use JPEG, PNG, GIF, or BMP formats.';
    } else if (err.message.includes('Image is empty')) {
      errorMessage = 'Empty image file';
      details = 'The uploaded image file is empty or corrupted. Please upload a valid image.';
    }
    
    res.status(500).json({ error: errorMessage, details });
  } finally {
    // Clean up uploaded file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log('Uploaded image cleaned up:', req.file.path);
    }
  }
});

// PDF text extraction endpoint
app.post('/api/pdf', upload.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No PDF uploaded' });
  
  console.log('PDF upload received:', {
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
  
  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    console.log('PDF file read, size:', dataBuffer.length);
    
    const data = await pdfParse(dataBuffer);
    console.log('PDF parsed successfully, text length:', data.text?.length || 0);
    
    if (!data.text || data.text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'No text extracted from PDF', 
        details: 'The PDF appears to be empty or contains no extractable text. Please ensure the PDF contains readable text content.' 
      });
    }
    
    res.json({ text: data.text });
  } catch (err) {
    console.error('PDF extraction error:', err);
    
    // Provide more specific error messages
    let errorMessage = 'PDF extraction failed';
    let details = err.message;
    
    if (err.message.includes('Invalid PDF structure')) {
      errorMessage = 'Invalid PDF file';
      details = 'The uploaded file is not a valid PDF or is corrupted. Please ensure you are uploading a valid PDF file.';
    } else if (err.message.includes('Password protected')) {
      errorMessage = 'Password protected PDF';
      details = 'The PDF is password protected. Please remove the password protection and try again.';
    } else if (err.message.includes('File is empty')) {
      errorMessage = 'Empty PDF file';
      details = 'The uploaded PDF file is empty. Please upload a PDF with content.';
    }
    
    res.status(500).json({ error: errorMessage, details });
  } finally {
    // Clean up uploaded file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log('Uploaded file cleaned up:', req.file.path);
    }
  }
});

// Function to intelligently truncate text for quiz generation
function truncateTextForQuiz(text, maxLength = 3000) {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Try to find a good breaking point
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let truncatedText = '';
  
  for (const sentence of sentences) {
    if ((truncatedText + sentence).length > maxLength) {
      break;
    }
    truncatedText += sentence + '. ';
  }
  
  // If we still don't have enough content, take the first part
  if (truncatedText.length === 0) {
    truncatedText = text.substring(0, maxLength - 100) + '...';
  }
  
  return truncatedText.trim();
}

// Quiz generation endpoint (Groq LLM)
app.post('/api/generate-quiz', async (req, res) => {
  const { text, topic, questionCount, difficulty, questionTypes, includeExplanations } = req.body;
  
  if (!text || !topic) {
    return res.status(400).json({ error: 'Missing required fields: text and topic' });
  }
  
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API key not configured. Please set GROQ_API_KEY environment variable.' });
  }
  
  try {
    // Truncate text to avoid payload size limits (Groq has limits)
    const truncatedText = truncateTextForQuiz(text, 3000);
    
    console.log(`Original text length: ${text.length}, Truncated to: ${truncatedText.length}`);
    
    const prompt = `You are an AI quiz generator. Based on the following study material, generate a quiz on the topic: "${topic}".\n\nStudy Material:\n${truncatedText}\n\nQuiz Requirements:\n- Number of questions: ${questionCount}\n- Difficulty: ${difficulty}\n- Question types: ${questionTypes.join(", ")}\n- Include explanations: ${includeExplanations ? 'yes' : 'no'}\n\nIMPORTANT: Return ONLY a valid JSON array of questions. Each question MUST have this exact structure:\n{\n  "type": "multiple-choice|true-false|short-answer|fill-blank",\n  "question": "The question text",\n  "options": ["Option A", "Option B", "Option C", "Option D"],\n  "correctAnswer": 0,\n  "explanation": "Explanation of the answer"\n}\n\nFor true-false questions, use options: ["True", "False"] and correctAnswer: 0 (for True) or 1 (for False).\nFor short-answer and fill-blank, you can use options: ["Enter your answer"] and correctAnswer: 0.\n\nReturn the JSON array without any additional text or formatting.`;

    const groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are an expert AI quiz generator.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2048,
        temperature: 0.7
      })
    });
    
    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      console.error('Groq API error response:', errorText);
      throw new Error(`Groq API error: ${groqRes.status} ${groqRes.statusText} - ${errorText}`);
    }
    
    const groqData = await groqRes.json();
    
    if (!groqData.choices || !groqData.choices[0] || !groqData.choices[0].message) {
      throw new Error('Invalid response from AI service');
    }
    
    let quizQuestions = [];
    // Try to parse the JSON from the LLM response
    try {
      const content = groqData.choices[0].message.content.trim();
      const match = content.match(/\[.*\]/s);
      quizQuestions = JSON.parse(match ? match[0] : content);
    } catch (e) {
      console.error('Failed to parse quiz from LLM:', e);
      console.error('Raw response:', groqData.choices[0].message.content);
      return res.status(500).json({ error: 'Failed to parse quiz from LLM', details: e.message });
    }
    
    // Validate quiz questions
    if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) {
      throw new Error('No valid questions generated');
    }
    
    // Normalize and validate each question
    quizQuestions = quizQuestions.map((question, index) => {
      console.log(`Normalizing question ${index + 1}:`, question);
      
      // Ensure required fields exist
      if (!question.question) {
        throw new Error(`Question ${index + 1} is missing the question text`);
      }
      
      // Normalize question structure based on type
      const normalizedQuestion = {
        id: `q${index + 1}`,
        type: question.type || 'multiple-choice',
        question: question.question,
        correctAnswer: question.correctAnswer !== undefined ? question.correctAnswer : 0,
        explanation: question.explanation || ''
      };
      
      console.log(`Question ${index + 1} type: ${normalizedQuestion.type}, original correctAnswer: ${question.correctAnswer}`);
      
      // Handle different question types
      switch (normalizedQuestion.type) {
        case 'multiple-choice':
          if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
            // Generate fallback options if missing
            normalizedQuestion.options = [
              'Option A',
              'Option B', 
              'Option C',
              'Option D'
            ];
          } else {
            normalizedQuestion.options = question.options;
          }
          break;
          
        case 'true-false':
          normalizedQuestion.options = ['True', 'False'];
          // Ensure correctAnswer is 0 or 1 for true/false
          if (typeof normalizedQuestion.correctAnswer === 'string') {
            normalizedQuestion.correctAnswer = normalizedQuestion.correctAnswer.toLowerCase() === 'true' ? 0 : 1;
          } else if (typeof normalizedQuestion.correctAnswer === 'boolean') {
            normalizedQuestion.correctAnswer = normalizedQuestion.correctAnswer ? 0 : 1;
          } else if (normalizedQuestion.correctAnswer !== 0 && normalizedQuestion.correctAnswer !== 1) {
            // Default to false (1) if invalid
            normalizedQuestion.correctAnswer = 1;
          }
          console.log(`True-false question ${index + 1} normalized:`, normalizedQuestion);
          break;
          
        case 'short-answer':
        case 'fill-blank':
          // For these types, options might not be needed, but we'll provide a placeholder
          normalizedQuestion.options = ['Enter your answer'];
          break;
          
        default:
          // Default to multiple choice if type is unknown
          normalizedQuestion.type = 'multiple-choice';
          if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
            normalizedQuestion.options = [
              'Option A',
              'Option B', 
              'Option C',
              'Option D'
            ];
          } else {
            normalizedQuestion.options = question.options;
          }
      }
      
      console.log(`Final normalized question ${index + 1}:`, normalizedQuestion);
      return normalizedQuestion;
    });
    
    // Add IDs to questions (redundant but keeping for consistency)
    quizQuestions = quizQuestions.map((question, index) => ({
      ...question,
      id: `q${index + 1}`
    }));
    
    const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      quiz: {
        id: quizId,
        title: `${topic} Quiz`,
        questions: quizQuestions,
        config: req.body,
        createdAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Quiz generation error:', err);
    res.status(500).json({ error: 'Quiz generation failed', details: err.message });
  }
});

// Topic detection endpoint
app.post('/api/detect-topics', async (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API key not configured. Please set GROQ_API_KEY environment variable.' });
  }

  try {
    const prompt = `Analyze the following text and identify the main topics, subjects, or themes that would be suitable for creating educational quizzes. Return only a JSON array of topic names (strings), with no additional text or formatting.

Text to analyze:
${text.substring(0, 2000)}${text.length > 2000 ? '...' : ''}

Return format: ["Topic 1", "Topic 2", "Topic 3"]`;

    const groqRes = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are an expert at analyzing educational content and identifying key topics for quiz generation. Always respond with only a valid JSON array of topic names.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    const groqData = await groqRes.json();
    
    if (!groqData.choices || !groqData.choices[0] || !groqData.choices[0].message) {
      throw new Error('Invalid response from AI service');
    }

    let topics = [];
    try {
      // Try to parse the JSON response
      const content = groqData.choices[0].message.content.trim();
      const match = content.match(/\[.*\]/s);
      if (match) {
        topics = JSON.parse(match[0]);
      } else {
        // Fallback: try to parse the entire response
        topics = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse topics:', parseError);
      // Fallback: extract topics using simple heuristics
      topics = extractTopicsFallback(text);
    }

    // Ensure we have valid topics
    if (!Array.isArray(topics) || topics.length === 0) {
      topics = extractTopicsFallback(text);
    }

    res.json({ topics });
  } catch (err) {
    console.error('Topic detection error:', err);
    // Fallback to simple topic extraction
    const fallbackTopics = extractTopicsFallback(text);
    res.json({ topics: fallbackTopics });
  }
});

// Fallback topic extraction function
function extractTopicsFallback(text) {
  const topics = [];
  const lines = text.split('\n').slice(0, 50); // Check first 50 lines
  
  // Look for common patterns that indicate topics
  const topicPatterns = [
    /^chapter\s+\d+[:\s]+(.+)$/i,
    /^section\s+\d+[:\s]+(.+)$/i,
    /^(\d+\.\s*[A-Z][^.!?]+)/,
    /^([A-Z][A-Z\s]{3,}[^.!?]+)/,
    /^introduction\s+to\s+(.+)$/i,
    /^fundamentals?\s+of\s+(.+)$/i,
    /^basics?\s+of\s+(.+)$/i
  ];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.length < 10 || trimmedLine.length > 100) continue;
    
    for (const pattern of topicPatterns) {
      const match = trimmedLine.match(pattern);
      if (match) {
        const topic = match[1] || match[0];
        const cleanTopic = topic.replace(/^[\d\.\s]+/, '').trim();
        if (cleanTopic.length > 3 && cleanTopic.length < 50 && !topics.includes(cleanTopic)) {
          topics.push(cleanTopic);
          break;
        }
      }
    }
  }

  // If no topics found, create generic ones based on content
  if (topics.length === 0) {
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const wordFreq = {};
    words.forEach(word => {
      if (!['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other', 'about', 'many', 'then', 'them', 'these', 'some', 'what', 'into', 'more', 'very', 'when', 'just', 'only', 'know', 'take', 'than', 'first', 'over', 'think', 'also', 'after', 'most', 'make', 'well', 'through', 'should', 'because', 'such', 'here', 'still', 'even', 'back', 'between', 'both', 'never', 'under', 'while', 'during', 'without', 'before', 'again', 'against', 'where', 'those', 'once', 'every', 'might', 'being', 'seem', 'those', 'often', 'however', 'therefore', 'further', 'indeed', 'meanwhile', 'furthermore', 'nevertheless', 'consequently', 'accordingly', 'moreover', 'similarly', 'likewise', 'additionally', 'furthermore', 'meanwhile', 'nevertheless', 'therefore', 'consequently', 'accordingly', 'moreover', 'similarly', 'likewise', 'additionally'].includes(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
    
    const sortedWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
    
    topics.push(...sortedWords);
  }

  return topics.slice(0, 6); // Return max 6 topics
}

app.listen(PORT, () => {
  console.log(`AIthena backend running on port ${PORT}`);
}); 