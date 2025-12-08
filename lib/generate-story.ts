export interface StoryParams {
  character: string;
  setting: string;
  twist: string;
  template: string;
  kidsMode: boolean;
}

export interface StoryResult {
  title: string;
  story: string;
  moral?: string;
  coverImage?: string;
}

const TEMPLATE_STYLES = {
  fantasy: "magical and whimsical, with enchanting descriptions",
  horror: "dark and suspenseful, with eerie atmosphere",
  comedy: "humorous and lighthearted, with witty dialogue",
  scifi: "futuristic and imaginative, with advanced technology",
  adventure: "exciting and action-packed, with daring exploits",
  mystery: "intriguing and puzzling, with clever twists"
};

export async function generateStory(params: StoryParams): Promise<StoryResult> {
  const { character, setting, twist, template, kidsMode } = params;

  const styleGuide = TEMPLATE_STYLES[template as keyof typeof TEMPLATE_STYLES] || TEMPLATE_STYLES.fantasy;

  const kidsInstruction = kidsMode
    ? `
IMPORTANT: This story is for children ages 5-10. Use:
- Simple vocabulary (no complex words)
- Short sentences
- Positive messages
- Age-appropriate themes
- A clear moral lesson about friendship, kindness, or bravery
`
    : `
Use vivid descriptions, complex vocabulary, and mature storytelling techniques.
Include emotional depth and nuanced character development.
`;

  const prompt = `Write an immersive ${kidsMode ? 'children\'s ' : ''}story (${kidsMode ? '400-500' : '600-800'} words) in the ${template} genre.

Story Elements:
- Character: ${character}
- Setting: ${setting}
- Plot twist: ${twist}

Style: ${styleGuide}

${kidsInstruction}

Create a complete story with:
- Engaging opening
- Clear character development
- Descriptive setting
- The specified plot twist
- Satisfying conclusion
${kidsMode ? '- A moral lesson' : '- Deep thematic resonance'}

Return ONLY a JSON object (no markdown, no backticks):
{
  "title": "An engaging title",
  "story": "The complete story text",
  "moral": "${kidsMode ? 'A simple moral lesson' : 'The story\'s deeper meaning'}"
}`;

  try {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
      throw new Error('Missing NEXT_PUBLIC_GROQ_API_KEY in environment variables');
    }

    console.log('API Call...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Fast and high quality
        messages: [
          {
            role: 'system',
            content: 'You are a creative storyteller. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 2500,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response');

    const content = data.choices[0].message.content;

    if (!content) {
      throw new Error('No story content returned from Groq API');
    }

    // Parse JSON response
    let parsed: StoryResult;
    try {
      // Remove any markdown formatting
      const cleanContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      parsed = JSON.parse(cleanContent);
    } catch (e) {
      console.error('Failed to parse JSON, attempting regex extraction');
      // Fallback: extract using regex
      const titleMatch = content.match(/"title":\s*"([^"]+)"/);
      const storyMatch = content.match(/"story":\s*"((?:[^"\\]|\\.)*)"/);
      const moralMatch = content.match(/"moral":\s*"([^"]+)"/);

      if (titleMatch && storyMatch) {
        parsed = {
          title: titleMatch[1],
          story: storyMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
          moral: moralMatch ? moralMatch[1] : undefined
        };
      } else {
        console.error('Content received:', content);
        throw new Error('Could not parse story response');
      }
    }

    return parsed;

  } catch (error) {
    console.error('Story generation error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate story: ${error.message}`);
    }
    throw new Error('Failed to generate story. Please check your API key and try again.');
  }
}

// Generate a simple cover image placeholder
export function generateCoverPlaceholder(template: string): string {
  const colors: Record<string, string> = {
    fantasy: 'from-purple-600 to-pink-600',
    horror: 'from-gray-800 to-black',
    comedy: 'from-yellow-500 to-orange-500',
    scifi: 'from-blue-600 to-purple-600',
    adventure: 'from-green-600 to-teal-600',
    mystery: 'from-indigo-700 to-purple-800'
  };

  return colors[template] || colors.fantasy;
}