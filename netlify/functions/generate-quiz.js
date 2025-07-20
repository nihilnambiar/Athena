const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { text, topic, questionCount = 5, difficulty = 'medium', questionTypes = ['multiple-choice'], includeExplanations = true } = JSON.parse(event.body);

    if (!text || !topic) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: text and topic' })
      };
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Groq API key not configured' })
      };
    }

    // Truncate text to avoid payload size limits
    const truncatedText = truncateTextForQuiz(text, 3000);
    
    const prompt = `You are an AI quiz generator. Based on the following study material, generate ${questionCount} questions about "${topic}". 

Study Material:
${truncatedText}

Requirements:
- Generate ${questionCount} questions
- Difficulty: ${difficulty}
- Question types: ${questionTypes.join(', ')}
- Include explanations: ${includeExplanations}

Return ONLY a valid JSON array of question objects with this exact structure:
[
  {
    "type": "multiple-choice|true-false|short-answer|fill-blank",
    "question": "Question text here",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": 0,
    "explanation": "Explanation here"
  }
]

For true-false questions, use options: ["True", "False"]
For short-answer and fill-blank, use options: ["Enter your answer"]
For fill-blank, use underscores in the question: "The capital of France is _______"`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `Groq API error: ${response.status}` })
      };
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the JSON response
    let questions;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        questions = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', content);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to parse quiz response' })
      };
    }

    // Normalize questions
    const normalizedQuestions = questions.map((q, index) => normalizeQuestion(q, index + 1));

    const quiz = {
      id: `quiz_${Date.now()}`,
      title: `${topic} Quiz`,
      topic: topic,
      questions: normalizedQuestions,
      totalQuestions: normalizedQuestions.length,
      difficulty: difficulty,
      timeLimit: questionCount * 30, // Default 30 seconds per question
      createdAt: new Date().toISOString()
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(quiz)
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

function truncateTextForQuiz(text, maxLength) {
  if (text.length <= maxLength) return text;
  
  // Try to truncate at sentence boundaries
  const truncated = text.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  const lastQuestion = truncated.lastIndexOf('?');
  const lastExclamation = truncated.lastIndexOf('!');
  
  const lastPunctuation = Math.max(lastSentence, lastQuestion, lastExclamation);
  
  if (lastPunctuation > maxLength * 0.8) {
    return truncated.substring(0, lastPunctuation + 1);
  }
  
  return truncated + '...';
}

function normalizeQuestion(question, index) {
  const normalized = {
    id: `q${index}`,
    type: question.type || 'multiple-choice',
    question: question.question || '',
    correctAnswer: question.correctAnswer || 0,
    explanation: question.explanation || '',
    options: question.options || []
  };

  // Handle true-false questions
  if (normalized.type === 'true-false') {
    normalized.options = ['True', 'False'];
    if (typeof normalized.correctAnswer === 'string') {
      normalized.correctAnswer = normalized.correctAnswer.toLowerCase() === 'true' ? 0 : 1;
    }
  }

  // Handle short-answer and fill-blank questions
  if (normalized.type === 'short-answer' || normalized.type === 'fill-blank') {
    normalized.options = ['Enter your answer'];
  }

  return normalized;
} 