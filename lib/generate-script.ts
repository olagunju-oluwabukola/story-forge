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

const SCRIPT_FORMATS = {
  short: `
Follow standard screenplay format:
- Scene headings (INT./EXT. LOCATION - TIME)
- Action lines (present tense, concise)
- Character names (centered, uppercase)
- Dialogue (centered under character name)
- Parentheticals for tone/action during dialogue
- Transitions (CUT TO:, FADE TO:, etc.)
`,
  scene: `
Write a complete single scene with:
- Clear scene heading
- Vivid action descriptions
- Natural, character-driven dialogue
- Emotional beats and subtext
`,
  feature: `
Create a complete feature film structure with:
- ACT I: Setup and inciting incident (pages 1-30)
- ACT II: Rising action and midpoint (pages 30-90)
- ACT III: Climax and resolution (pages 90-120)
- Include major plot points and character arcs
`,
  tv: `
Follow TV episode structure:
- Teaser/Cold open
- 3-4 Acts with commercial breaks
- Act breaks on cliffhangers
- Resolution/tag scene
`,
};

export async function generateScript(params: ScriptParams): Promise<string> {
  const { prompt, scriptType, genre } = params;

  const length = SCRIPT_LENGTHS[scriptType as keyof typeof SCRIPT_LENGTHS];
  const format = SCRIPT_FORMATS[scriptType as keyof typeof SCRIPT_FORMATS];

  const systemPrompt = `You are a professional screenwriter with expertise in writing ${genre} scripts. You understand screenplay formatting, pacing, dialogue, and story structure.`;

  const userPrompt = `Write a ${genre} ${scriptType === 'short' ? 'short film' : scriptType === 'scene' ? 'scene' : scriptType === 'feature' ? 'feature film' : 'TV episode'} script based on this premise:

${prompt}

Requirements:
- Length: ${length}
- Genre: ${genre}
${format}

Use proper screenplay format:
- Scene headings in ALL CAPS
- Action lines in present tense
- Character names CENTERED and IN CAPS above dialogue
- Dialogue formatted properly
- Include emotional beats and visual storytelling

Create a compelling, well-structured script with strong characters, engaging dialogue, and clear visual storytelling.`;

  try {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
      throw new Error('Missing NEXT_PUBLIC_GROQ_API_KEY in environment variables');
    }

    console.log('Generating script...');

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
        max_tokens: scriptType === 'feature' ? 8000 : scriptType === 'tv' ? 6000 : 4000,
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

    console.log('Script generated successfully');
    return script;

  } catch (error) {
    console.error('Script generation error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate script: ${error.message}`);
    }
    throw new Error('Failed to generate script. Please try again.');
  }
}