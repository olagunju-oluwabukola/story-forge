interface ScriptParams {
  prompt: string;
  scriptType: string;
  genre: string;
}

const SCRIPT_LENGTHS = {
  short: '5-10 pages (approximately 5-10 minutes)',
  scene: '2-5 pages (single scene, 2-5 minutes)',
  feature: 'Full feature film script (90-120 pages)',
  tv: 'TV episode script (22-44 pages based on format)',
};


const MAX_TOKENS = {
  short: 3000,
  scene: 1500,
  feature: 30000,
  tv: 12000,
};

const SCRIPT_FORMATS = {
  short: `
Follow standard screenplay format:
- Scene headings (INT./EXT. LOCATION - TIME)
- Action lines (present tense, concise)
- Character names (centered, uppercase)
- Dialogue (centered under character name)
- Parentheticals for tone/action during dialogue
- Transitions (CUT TO:, FADE TO:, etc.)

CRITICAL: Write the COMPLETE script from beginning to end. Do not summarize or abbreviate. Include ALL scenes, ALL dialogue, and ALL action lines needed to tell the full story.
`,
  scene: `
Write a complete single scene with:
- Clear scene heading
- Vivid action descriptions
- Natural, character-driven dialogue
- Emotional beats and subtext

CRITICAL: Write the ENTIRE scene with full dialogue and action. Do not cut corners or summarize.
`,
  feature: `
Create a complete feature film structure with:
- ACT I: Setup and inciting incident (pages 1-30)
- ACT II: Rising action and midpoint (pages 30-90)
- ACT III: Climax and resolution (pages 90-120)
- Include major plot points and character arcs

CRITICAL: This must be a FULL-LENGTH feature script. Write every scene, every line of dialogue, every action beat. Do NOT summarize or skip ahead. Write the complete screenplay from FADE IN to FADE OUT.
`,
  tv: `
Follow TV episode structure:
- Teaser/Cold open (2-3 pages)
- Act 1 (8-10 pages)
- Act 2 (8-10 pages)
- Act 3 (8-10 pages)
- Act 4 if needed (6-8 pages)
- Tag/epilogue (1-2 pages)
- Act breaks on cliffhangers
- Full commercial break structure

CRITICAL: Write the COMPLETE episode from start to finish with all acts fully developed. Include ALL dialogue and scenes. Do not skip or abbreviate.
`,
};


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

  const length = SCRIPT_LENGTHS[scriptType as keyof typeof SCRIPT_LENGTHS];
  const format = SCRIPT_FORMATS[scriptType as keyof typeof SCRIPT_FORMATS];
  const maxTokens = MAX_TOKENS[scriptType as keyof typeof MAX_TOKENS];

  const systemPrompt = `You are a professional screenwriter with expertise in writing ${genre} scripts. You understand screenplay formatting, pacing, dialogue, and story structure.

CRITICAL INSTRUCTIONS:
- You MUST write COMPLETE scripts from beginning to end
- NEVER summarize, abbreviate, or skip scenes
- Write EVERY line of dialogue and EVERY action beat
- Do NOT use placeholders like "[more dialogue]" or "[scene continues]"
- If you reach a length limit, write "CONTINUED..." at the end
- ALWAYS aim for the FULL required page count

You ONLY generate scripts and screenplays. If a request is not related to script writing, politely decline.`;

  const scriptTypeDescription = {
    short: 'short film (5-10 pages, approximately 5-10 minutes of screen time)',
    scene: 'single scene (2-5 pages)',
    feature: 'FULL-LENGTH feature film (90-120 pages, approximately 90-120 minutes)',
    tv: 'complete TV episode (22-44 pages based on format)'
  };

  const userPrompt = `Write a ${genre} ${scriptTypeDescription[scriptType as keyof typeof scriptTypeDescription]} script based on this premise:

${prompt}

MANDATORY REQUIREMENTS:
- Target Length: ${length}
- Genre: ${genre}
- Format: Professional screenplay format
${format}

CRITICAL LENGTH REQUIREMENT:
${scriptType === 'feature' ? 'This MUST be a full-length feature film script of 90-120 pages. Write the ENTIRE movie from FADE IN to FADE OUT. Include every scene, every conversation, every moment.' : ''}
${scriptType === 'tv' ? 'This MUST be a complete TV episode of 22-44 pages with all acts fully written out. Do not skip or abbreviate any content.' : ''}
${scriptType === 'short' ? 'Write a complete 5-10 page short film. Every scene must be fully developed with complete dialogue.' : ''}

FORMATTING:
- Scene headings in ALL CAPS (INT./EXT. LOCATION - DAY/NIGHT)
- Action lines in present tense, left-aligned
- Character names CENTERED and IN CAPS above dialogue
- Dialogue centered below character names
- Include emotional beats, pauses, and visual storytelling
- Use proper transitions (CUT TO:, FADE TO:, DISSOLVE TO:)

Write the COMPLETE script. Do NOT stop early. Do NOT summarize. Write every single page required for the full story.`;

  try {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
      throw new Error('Missing NEXT_PUBLIC_GROQ_API_KEY in environment variables');
    }

    console.log(`Generating ${scriptType} script with max ${maxTokens} tokens...`);

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: maxTokens,
        top_p: 0.9,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', errorText);
      throw new Error(`Failed to generate script: ${response.status}`);
    }

    const data = await response.json();
    const script = data.choices[0].message.content;

    if (!script) {
      throw new Error('No script content returned from API');
    }

    const hasScriptFormat = /INT\.|EXT\.|FADE IN:|FADE OUT:/i.test(script);

    if (!hasScriptFormat) {
      throw new Error(
        "The generated content doesn't appear to be a properly formatted script. " +
        "Please try again with a clear story premise."
      );
    }


    const wasTruncated = data.choices[0].finish_reason === 'length';
    if (wasTruncated) {
      console.warn('Script was truncated due to token limit');

      return script + '\n\n[Note: Script generation reached token limit. Consider using a shorter format or breaking into multiple parts.]';
    }

    console.log('Script generated successfully');
    console.log(`Generated ${script.length} characters, finish reason: ${data.choices[0].finish_reason}`);

    return script;

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