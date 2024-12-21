const OpenAI = require('openai');

const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { text, maxLength } = JSON.parse(event.body);

    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Text is required' }),
      };
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional writer helping to enhance text for job applications.',
        },
        {
          role: 'user',
          content: `Please enhance the following text to be more professional and impactful (maximum ${maxLength} characters): ${text}`,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    let enhancedText = completion.choices[0].message.content.trim();

    if (maxLength && enhancedText.length > maxLength) {
      enhancedText = enhancedText.substring(0, maxLength);
      const lastPeriod = enhancedText.lastIndexOf('.');
      if (lastPeriod > maxLength * 0.8) {
        enhancedText = enhancedText.substring(0, lastPeriod + 1);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        enhancedText,
        usage: completion.usage
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process request' }),
    };
  }
};

module.exports = { handler }; 