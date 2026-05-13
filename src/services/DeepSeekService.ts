import type { DeepSeekModel } from '@/types';

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
}

export interface DeepSeekRequest {
  systemPrompt: string;
  userMessage: string;
  model: DeepSeekModel;
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * DeepSeekService — OpenAI-compatible API client with streaming support.
 */
export class DeepSeekService {
  private abortController: AbortController | null = null;

  /**
   * Test API key validity by listing models
   */
  static async testConnection(apiKey: string): Promise<boolean> {
    try {
      const res = await fetch(`${DEEPSEEK_BASE_URL}/models`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  /**
   * Streaming chat completion
   */
  async streamChat(
    request: DeepSeekRequest,
    callbacks: StreamCallbacks,
  ): Promise<void> {
    this.abortController = new AbortController();

    try {
      const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${request.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model,
          messages: [
            { role: 'system', content: request.systemPrompt },
            { role: 'user', content: request.userMessage },
          ],
          stream: true,
          temperature: request.temperature ?? 0.3,
          max_tokens: request.maxTokens ?? 4096,
        }),
        signal: this.abortController.signal,
      });

      if (!res.ok) {
        const errorBody = await res.text().catch(() => 'Unknown error');
        throw new Error(`DeepSeek API error ${res.status}: ${errorBody}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          
          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              fullText += content;
              callbacks.onChunk(content);
            }
          } catch {
            // Skip malformed JSON chunks
          }
        }
      }

      callbacks.onComplete(fullText);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        callbacks.onComplete(''); // Cancelled, not an error
        return;
      }
      callbacks.onError(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Non-streaming chat completion (for simple requests)
   */
  static async chat(
    request: DeepSeekRequest,
  ): Promise<string> {
    const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${request.apiKey}`,
      },
      body: JSON.stringify({
        model: request.model,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.userMessage },
        ],
        stream: false,
        temperature: request.temperature ?? 0.3,
        max_tokens: request.maxTokens ?? 4096,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => 'Unknown error');
      throw new Error(`DeepSeek API error ${res.status}: ${errorBody}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  /**
   * Cancel an ongoing stream
   */
  cancel(): void {
    this.abortController?.abort();
    this.abortController = null;
  }
}
