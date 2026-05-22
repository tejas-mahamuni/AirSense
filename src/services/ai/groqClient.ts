const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function generateAIInsight(
  prompt: string,
  options?: { maxTokens?: number; jsonMode?: boolean }
): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API Key is not configured');
  }

  const maxTokens = options?.maxTokens ?? 300;
  const jsonMode = options?.jsonMode ?? false;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: jsonMode 
              ? 'You are an environmental intelligence AI. Provide direct, structured answers in JSON format.' 
              : 'You are an environmental intelligence AI. Provide direct, helpful, and concise answers.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: maxTokens,
        top_p: 1,
        response_format: jsonMode ? { type: 'json_object' } : undefined
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API Error:', errorData);
      throw new Error(`Failed to fetch AI insight: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error('[Groq Client Error]', err);
    throw err;
  }
}

