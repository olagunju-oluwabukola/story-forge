interface ScriptParams {
  prompt: string;
  scriptType: string;
  genre: string;
}

const SCRIPT_KEYWORDS = [
  'script', 'screenplay', 'scene', 'dialogue', 'character', 'plot',
  'story', 'film', 'movie', 'tv', 'episode', 'drama', 'comedy',
  'action', 'thriller', 'horror', 'romance', 'sci-fi', 'fantasy',
  'write', 'create', 'generate', 'develop', 'short', 'feature'
];

const BLOCKED_KEYWORDS = [
  'code', 'program', 'recipe', 'essay', 'article', 'blog', 'tutorial',
  'instructions', 'guide', 'math', 'calculate', 'solve', 'translate',
  'summarize', 'explain', 'define', 'how to', 'what is', 'homework'
];

function isScriptRelated(prompt: string): boolean {
  const lowerPrompt = prompt.toLowerCase();

  const hasBlockedKeyword = BLOCKED_KEYWORDS.some(keyword =>
    lowerPrompt.includes(keyword)
  );

  if (hasBlockedKeyword) {
    return false;
  }

  const hasScriptKeyword = SCRIPT_KEYWORDS.some(keyword =>
    lowerPrompt.includes(keyword)
  );

  const hasNarrativeElements = /\b(about|where|when|who|two|three|meets|discovers|finds|escapes|fights|loves|hates|journey|adventure|conflict)\b/i.test(prompt);

  return hasScriptKeyword || (hasNarrativeElements && prompt.length > 20);
}

export async function generateScript(params: ScriptParams): Promise<string> {
  const { prompt, scriptType, genre } = params;

  // Client-side validation
  if (!isScriptRelated(prompt)) {
    throw new Error(
      "I can only generate scripts and screenplays. Your request doesn't appear to be related to script generation. " +
      "Please provide a story premise, character concept, or scene idea for a script."
    );
  }

  if (prompt.trim().length < 10) {
    throw new Error(
      "Please provide a more detailed premise for your script. " +
      "Include information about characters, setting, or conflict."
    );
  }

  try {
    console.log(`Generating ${scriptType} script...`);

    // Call the Next.js API route instead of Groq directly
    const response = await fetch('/api/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, scriptType, genre }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to generate script: ${response.status}`);
    }

    const data = await response.json();

    if (!data.script) {
      throw new Error('No script content returned from server');
    }

    // Validate script format
    const hasScriptFormat = /INT\.|EXT\.|FADE IN:|FADE OUT:/i.test(data.script);

    if (!hasScriptFormat) {
      throw new Error(
        "The generated content doesn't appear to be a properly formatted script. " +
        "Please try again with a clear story premise."
      );
    }

    if (data.truncated) {
      console.warn('Script was truncated due to token limit');
    }

    console.log('Script generated successfully');
    console.log(`Generated ${data.script.length} characters, finish reason: ${data.finishReason}`);

    return data.script;

  } catch (error) {
    console.error('Script generation error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate script: ${error.message}`);
    }
    throw new Error('Failed to generate script. Please try again.');
  }
}

export function validateScriptRequest(prompt: string): { valid: boolean; message?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return {
      valid: false,
      message: "Please enter a premise for your script."
    };
  }

  if (prompt.trim().length < 10) {
    return {
      valid: false,
      message: "Please provide a more detailed premise (at least 10 characters)."
    };
  }

  if (!isScriptRelated(prompt)) {
    return {
      valid: false,
      message: "I can only generate scripts and screenplays. Please provide a story premise, character concept, or scene idea."
    };
  }

  return { valid: true };
}