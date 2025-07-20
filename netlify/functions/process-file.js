const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

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
    const { fileType, fileData, fileName } = JSON.parse(event.body);

    if (!fileType || !fileData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing file data or type' })
      };
    }

    let extractedText = '';

    if (fileType === 'pdf') {
      try {
        // Convert base64 to buffer
        const buffer = Buffer.from(fileData, 'base64');
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text;
      } catch (error) {
        console.error('PDF parsing error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to parse PDF file' })
        };
      }
    } else if (fileType === 'image') {
      try {
        // Convert base64 to buffer
        const buffer = Buffer.from(fileData, 'base64');
        const result = await Tesseract.recognize(buffer, 'eng', {
          logger: m => console.log(m)
        });
        extractedText = result.data.text;
      } catch (error) {
        console.error('OCR error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Failed to extract text from image' })
        };
      }
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Unsupported file type' })
      };
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No text could be extracted from the file' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        text: extractedText,
        fileName: fileName || 'extracted_text',
        fileType: fileType,
        characterCount: extractedText.length
      })
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