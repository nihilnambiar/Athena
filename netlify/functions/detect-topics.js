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
    const { text } = JSON.parse(event.body);

    if (!text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No text provided' })
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

    const prompt = `Analyze the following text and identify the main topics, subjects, or themes that would be suitable for creating educational quizzes. Return only a JSON array of topic names (strings), with no additional text or formatting.

Text to analyze:
${text.substring(0, 2000)}${text.length > 2000 ? '...' : ''}

Return format: ["Topic 1", "Topic 2", "Topic 3"]`;

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
        temperature: 0.3,
        max_tokens: 500
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
    let topics;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        topics = JSON.parse(jsonMatch[0]);
      } else {
        topics = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', content);
      
      // Fallback to heuristic topic detection
      topics = detectTopicsHeuristic(text);
    }

    // Add AI detection badge
    const topicsWithBadge = topics.map(topic => ({
      name: topic,
      aiDetected: true
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ topics: topicsWithBadge })
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

function detectTopicsHeuristic(text) {
  const commonTopics = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography',
    'Literature', 'Computer Science', 'Economics', 'Psychology', 'Philosophy',
    'Art', 'Music', 'Medicine', 'Engineering', 'Business', 'Law', 'Politics',
    'Sociology', 'Anthropology', 'Astronomy', 'Geology', 'Environmental Science'
  ];

  const lowerText = text.toLowerCase();
  const detectedTopics = [];

  commonTopics.forEach(topic => {
    const topicWords = topic.toLowerCase().split(' ');
    const hasTopic = topicWords.some(word => lowerText.includes(word));
    if (hasTopic) {
      detectedTopics.push(topic);
    }
  });

  // If no topics detected, return some general ones
  if (detectedTopics.length === 0) {
    return ['General Knowledge', 'Education', 'Study Material'];
  }

  return detectedTopics.slice(0, 5); // Limit to 5 topics
} 