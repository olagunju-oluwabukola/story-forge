interface StoryPrompt {
  title: string;
  description: string;
}


export async function generateStoryPrompts(): Promise<StoryPrompt[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
      throw new Error('Missing API key');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a creative story idea generator. Generate unique, intriguing story prompts.'
          },
          {
            role: 'user',
            content: `Generate 6 unique and creative story prompts. Each should be intriguing and inspire imagination.

Return ONLY a JSON array (no markdown, no backticks):
[
  {
    "title": "Short catchy title (2-4 words)",
    "description": "One sentence description (15-20 words) that describes the story premise"
  }
]

Mix different genres: fantasy, sci-fi, mystery, romance, thriller, adventure. Make each one unique and compelling.`
          }
        ],
        temperature: 1.0,
        max_tokens: 800,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed)) {
        return parsed.slice(0, 6);
      } else if (parsed.prompts && Array.isArray(parsed.prompts)) {
        return parsed.prompts.slice(0, 6);
      } else if (parsed.stories && Array.isArray(parsed.stories)) {
        return parsed.stories.slice(0, 6);
      }
    } catch (e) {
      console.error('Failed to parse prompts:', e);
    }

    return generateFallbackPrompts();

  } catch (error) {
    console.error('Error generating prompts:', error);
    return generateFallbackPrompts();
  }
}


export async function generateQuickStory(prompt: string): Promise<string> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
      throw new Error('Missing API key');
    }

    console.log('Generating story from prompt:', prompt);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a talented creative writer. Write engaging, vivid short stories with strong narratives and emotional depth.'
          },
          {
            role: 'user',
            content: `Write a complete short story (400-600 words) based on this prompt:

"${prompt}"

Create a story with:
- A compelling opening that hooks the reader
- Well-developed characters with clear motivations
- Vivid descriptions and sensory details
- A clear conflict or challenge
- An engaging plot with rising action
- A satisfying resolution or thought-provoking ending

Write in an engaging narrative style. Return ONLY the story text, no titles or extra formatting.`
          }
        ],
        temperature: 0.9,
        max_tokens: 1500,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', errorText);
      throw new Error(`Failed to generate story: ${response.status}`);
    }

    const data = await response.json();
    const story = data.choices[0].message.content;

    if (!story) {
      throw new Error('No story content returned');
    }

    console.log('Story generated successfully');
    return story.trim();

  } catch (error) {
    console.error('Story generation error:', error);
    throw error;
  }
}


function generateFallbackPrompts(): StoryPrompt[] {
  const prompts = [
    { title: "The Lost Key", description: "A mysterious key appears on your doorstep, opening doors to parallel worlds and forgotten memories." },
    { title: "Midnight Train", description: "A train that only appears at midnight takes passengers to their most cherished or painful memories." },
    { title: "The Painter", description: "An artist discovers their paintings predict the future, but each painting costs them a memory." },
    { title: "Silent Library", description: "In a library where books whisper secrets, one book calls your name with a warning." },
    { title: "Time's Echo", description: "You wake up to find you're living the same day, but each time something small changes." },
    { title: "The Last Star", description: "Humanity's last hope rests on a ship traveling to a dying star that holds ancient power." },
    { title: "Mirror World", description: "Your reflection starts moving independently, trying to tell you something urgent about your life." },
    { title: "The Garden", description: "A hidden garden appears only to those who need it most, offering healing and impossible choices." },
    { title: "Forgotten Song", description: "A melody no one remembers holds the key to unlocking a world that was erased from history." },
    { title: "Shadow Walker", description: "You discover you can step into shadows and travel anywhere, but something follows you back." },
  ];


  return prompts
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);
}