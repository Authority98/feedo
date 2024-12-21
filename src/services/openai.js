import { tokenUsageService } from './tokenUsage';

export const generateProfessionalSummary = async (text, maxLength, userId) => {
  try {
    if (!text) {
      throw new Error('Text is required');
    }

    const response = await fetch('/.netlify/functions/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        maxLength,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to enhance text');
    }

    const { enhancedText, usage } = await response.json();

    // Update token usage if available
    if (usage && userId) {
      await tokenUsageService.updateTokenUsage(userId, usage.total_tokens);
    }

    return enhancedText;
  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      status: error.status,
      response: error.response,
      stack: error.stack
    });
    throw error;
  }
};