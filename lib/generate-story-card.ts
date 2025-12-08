interface StoryPrompt {
  title: string;
  description: string;
}

const STORY_KEYWORDS = [
  'story', 'tale', 'narrative', 'fiction', 'character', 'plot',
  'adventure', 'journey', 'fantasy', 'sci-fi', 'mystery', 'romance',
  'thriller', 'drama', 'horror', 'comedy', 'action', 'magical',
  'hero', 'villain', 'quest', 'world', 'legend', 'myth'
];


const BLOCKED_KEYWORDS = [
  'code', 'program', 'function', 'algorithm', 'recipe', 'cooking',
  'essay', 'article', 'blog', 'tutorial', 'instructions', 'guide',
  'math', 'calculate', 'solve', 'equation', 'formula', 'translate',
  'summarize', 'explain', 'define', 'how to', 'what is', 'homework',
  'research', 'analysis', 'report', 'documentation', 'manual'
];


function isStoryRelated(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();

  const hasBlockedKeyword = BLOCKED_KEYWORDS.some(keyword =>
    lowerPrompt.includes(keyword)
  );

  if (hasBlockedKeyword) {
    return false;
  }


  const hasStoryKeyword = STORY_KEYWORDS.some(keyword =>
    lowerPrompt.includes(keyword)
  );
  const hasNarrativeElements = /\b(about|where|when|who|meets|discovers|finds|escapes|fights|loves|travels|searches|becomes|loses|wins|dies|lives|dreams|fears|wants|needs)\b/i.test(prompt);
  const hasCreativeLanguage = /\b(magical|mysterious|ancient|hidden|secret|lost|forgotten|powerful|dangerous|beautiful|dark|bright|strange|unusual)\b/i.test(prompt);

  return hasStoryKeyword || (hasNarrativeElements && prompt.length > 20) || hasCreativeLanguage;
}


export function validateStoryPrompt(prompt: string): { valid: boolean; message?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return {
      valid: false,
      message: "Please enter a story idea or prompt."
    };
  }

  if (prompt.trim().length < 10) {
    return {
      valid: false,
      message: "Please provide a more detailed story idea (at least 10 characters)."
    };
  }

  if (!isStoryRelated(prompt)) {
    return {
      valid: false,
      message: "I can only generate creative stories and narratives. Please provide a story idea with characters, settings, or plot elements."
    };
  }

  return { valid: true };
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
            content: 'You are a creative story idea generator. You ONLY generate story prompts and creative fiction ideas. You do not write code, recipes, essays, or any non-fiction content.'
          },
          {
            role: 'user',
            content: `Generate 6 unique and creative STORY prompts. Each should be intriguing and inspire imagination.

Return ONLY a JSON array (no markdown, no backticks):
[
  {
    "title": "Short catchy title (2-4 words)",
    "description": "One sentence description (15-20 words) that describes the story premise"
  }
]

Mix different genres: fantasy, sci-fi, mystery, romance, thriller, adventure. Make each one unique and compelling. Focus on NARRATIVE stories with characters, conflicts, and plots.`
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
  // Strict validation before generating
  const validation = validateStoryPrompt(prompt);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

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
            content: `You are a talented creative writer who ONLY writes stories and narratives.

CRITICAL: You do NOT write:
- Code or programming content
- Recipes or cooking instructions
- Essays or academic papers
- Tutorials or how-to guides
- Technical documentation
- Any non-fiction content

You ONLY create engaging fictional stories with characters, plots, and narratives.`
          },
          {
            role: 'user',
            content: `Write a complete short story (400-600 words) based on this prompt:

"${prompt}"

Create a FICTIONAL NARRATIVE story with:
- A compelling opening that hooks the reader
- Well-developed characters with clear motivations
- Vivid descriptions and sensory details
- A clear conflict or challenge
- An engaging plot with rising action
- A satisfying resolution or thought-provoking ending

Write in an engaging narrative style. Return ONLY the story text, no titles or extra formatting. This must be a creative fiction story, not an essay, article, or non-fiction piece.`
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


    const hasNarrativeElements = /\b(said|thought|walked|ran|looked|felt|saw|heard|knew|realized|discovered|found)\b/i.test(story);
    const hasDialogue = story.includes('"') || story.includes('"') || story.includes('"');

    if (!hasNarrativeElements && !hasDialogue && story.length < 200) {
      throw new Error('The generated content does not appear to be a proper story. Please provide a creative narrative prompt.');
    }

    console.log('Story generated successfully');
    return story.trim();

  } catch (error) {
    console.error('Story generation error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate story. Please ensure your prompt is a creative story idea.');
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
    { title: "The Timekeeper", description: "A watchmaker discovers their clocks can steal time from one person and give it to another." },
    { title: "Whisper Woods", description: "Trees in an ancient forest hold the souls of storytellers, sharing their tales with those who listen." },
    { title: "The Collector", description: "A mysterious figure appears at yard sales, buying seemingly worthless items that hold magical properties." },
    { title: "Starbound", description: "A child born during a meteor shower develops the ability to communicate with distant alien civilizations." },
    { title: "The Dream Thief", description: "Someone is stealing people's dreams, leaving them unable to imagine or hope for anything better." },
  ];

  return prompts
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);
}

