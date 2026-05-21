const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function generateAIInsight(prompt: string): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API Key is not configured');
  }

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
          { role: 'system', content: 'You are an environmental intelligence AI. Provide direct, helpful, and concise answers.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 300,
        top_p: 1,
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
