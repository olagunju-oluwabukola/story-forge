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

    const response = await fetch('/api/generate-prompts', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch prompts: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }

    return data;

  } catch (error) {
    console.error('Error generating prompts:', error);
    return generateFallbackPrompts();
  }
}

export async function generateQuickStory(prompt: string): Promise<string> {

  const validation = validateStoryPrompt(prompt);
  if (!validation.valid) {
    throw new Error(validation.message);
  }

  try {
    console.log('Generating story from prompt:', prompt);

    const response = await fetch('/api/generate-quick-story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to generate story: ${response.status}`);
    }

    const data = await response.json();

    if (!data.story) {
      throw new Error('No story content returned from server');
    }

    const hasNarrativeElements = /\b(said|thought|walked|ran|looked|felt|saw|heard|knew|realized|discovered|found)\b/i.test(data.story);
    const hasDialogue = data.story.includes('"') || data.story.includes('"') || data.story.includes('"');

    if (!hasNarrativeElements && !hasDialogue && data.story.length < 200) {
      throw new Error('The generated content does not appear to be a proper story. Please provide a creative narrative prompt.');
    }

    console.log('Story generated successfully');
    return data.story;

  } catch (error) {
    console.error('Quick story generation error:', error);
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