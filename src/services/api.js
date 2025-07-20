// API service for Netlify Functions
const API_BASE = '/.netlify/functions';

export const api = {
  // Health check
  health: async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  // Process file (PDF/Image)
  processFile: async (file) => {
    try {
      const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
      const fileData = await fileToBase64(file);
      
      const response = await fetch(`${API_BASE}/process-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileType,
          fileData,
          fileName: file.name
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process file');
      }

      return await response.json();
    } catch (error) {
      console.error('File processing error:', error);
      throw error;
    }
  },

  // Detect topics
  detectTopics: async (text) => {
    try {
      const response = await fetch(`${API_BASE}/detect-topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to detect topics');
      }

      return await response.json();
    } catch (error) {
      console.error('Topic detection error:', error);
      throw error;
    }
  },

  // Generate quiz
  generateQuiz: async (quizData) => {
    try {
      const response = await fetch(`${API_BASE}/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      return await response.json();
    } catch (error) {
      console.error('Quiz generation error:', error);
      throw error;
    }
  },
};

// Helper function to convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // Remove data URL prefix
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
} 