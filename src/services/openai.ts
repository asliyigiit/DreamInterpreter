import CONFIG from '../config/config';
import { ChatResponse } from '../types';

class OpenAIService {
  private readonly headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${CONFIG.openai.apiKey}`,
    'OpenAI-Beta': 'assistants=v2',
  };

  private async createThread(): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      throw new Error(`Failed to create thread: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async addMessageToThread(threadId: string, content: string): Promise<void> {
    try {
      await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          role: 'user',
          content: content,
        }),
      });
    } catch (error) {
      throw new Error(`Failed to add message to thread: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async runAssistant(threadId: string, instructions?: string): Promise<string> {
    try {
      // Create a run
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          assistant_id: CONFIG.openai.assistantId,
          instructions,
        }),
      });

      if (!runResponse.ok) {
        throw new Error(`HTTP error! status: ${runResponse.status}`);
      }

      const runData = await runResponse.json();
      const runId = runData.id;

      // Poll for completion
      while (true) {
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
          headers: this.headers,
        });

        if (!statusResponse.ok) {
          throw new Error(`HTTP error! status: ${statusResponse.status}`);
        }

        const statusData = await statusResponse.json();
        if (statusData.status === 'completed') {
          break;
        } else if (statusData.status === 'failed' || statusData.status === 'cancelled') {
          throw new Error(`Run failed with status: ${statusData.status}`);
        }

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Get the latest message
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        headers: this.headers,
      });

      if (!messagesResponse.ok) {
        throw new Error(`HTTP error! status: ${messagesResponse.status}`);
      }

      const messagesData = await messagesResponse.json();
      return messagesData.data[0].content[0].text.value;
    } catch (error) {
      throw new Error(`Failed to run assistant: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async interpretDream(
    dream: string,
    analyst: string,
    preChatAnswers: Record<string, string>,
  ): Promise<ChatResponse> {
    try {
      const threadId = await this.createThread();
      
      const context = `Dream: ${dream}\nAdditional Context: ${JSON.stringify(preChatAnswers)}`;
      await this.addMessageToThread(threadId, context);

      const instructions = `You are ${analyst}, a renowned psychoanalyst. Analyze the following dream using your unique theoretical framework and methodology. Consider any additional context provided. IMPORTANT: Always answer in the same language the user just used. If the user writes in Turkish, answer in Turkish.`;
      
      const response = await this.runAssistant(threadId, instructions);
      
      return {
        text: response,
        threadId, // Store threadId for future reference
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
    threadId?: string,
  ): Promise<ChatResponse> {
    try {
      // If no threadId is provided, create a new thread and add conversation history
      const currentThreadId = threadId || await this.createThread();
      
      if (!threadId) {
        // Add conversation history to the new thread
        for (const message of conversation) {
          await this.addMessageToThread(currentThreadId, message);
        }
      }

      // Add the follow-up question
      await this.addMessageToThread(currentThreadId, question);

      const instructions = `You are ${analyst}, continuing a dream interpretation session. Maintain consistency with your previous analysis while addressing the follow-up question. IMPORTANT: Always answer in the same language the user just used. If the user writes in Turkish, answer in Turkish.`;
      
      const response = await this.runAssistant(currentThreadId, instructions);
      
      return {
        text: response,
        threadId: currentThreadId,
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