import CONFIG from '../config/config';
import { ChatResponse } from '../types';

class OpenAIService {
  private readonly headers: HeadersInit = {
    'Content-Type': 'application/json',
    // CUSTOM_CONFIG HERE - Replace with your OpenAI API key
    'Authorization': `Bearer ${CONFIG.openai.apiKey}`,
  };

  async interpretDream(
    dream: string,
    analyst: string,
    preChatAnswers: Record<string, string>,
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(CONFIG.openai.endpoint, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: CONFIG.openai.model,
          messages: [
            {
              role: 'system',
              content: `You are ${analyst}, a renowned psychoanalyst. Analyze the following dream using your unique theoretical framework and methodology. Consider any additional context provided.`,
            },
            {
              role: 'user',
              content: `Dream: ${dream}\n\nAdditional Context: ${JSON.stringify(preChatAnswers)}`,
            },
          ],
          temperature: CONFIG.openai.temperature,
          max_tokens: CONFIG.openai.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.choices[0].message.content,
      };
    } catch (error) {
      return {
        text: '',
        error: error instanceof Error ? error.message : 'Failed to interpret dream',
      };
    }
  }

  async followUpQuestion(
    conversation: string[],
    question: string,
    analyst: string,
  ): Promise<ChatResponse> {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are ${analyst}, continuing a dream interpretation session. Maintain consistency with your previous analysis while addressing the follow-up question.`,
        },
        ...conversation.map((msg, i) => ({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: msg,
        })),
        {
          role: 'user',
          content: question,
        },
      ];

      const response = await fetch(CONFIG.openai.endpoint, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          model: CONFIG.openai.model,
          messages,
          temperature: CONFIG.openai.temperature,
          max_tokens: CONFIG.openai.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.choices[0].message.content,
      };
    } catch (error) {
      return {
        text: '',
        error: error instanceof Error ? error.message : 'Failed to answer follow-up question',
      };
    }
  }
}

export default new OpenAIService(); 