import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { character, setting, twist, template, kidsMode } = await request.json();

    if (!character || !setting || !twist || !template) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const TEMPLATE_STYLES: Record<string, string> = {
      fantasy: "magical and whimsical, with enchanting descriptions",
      horror: "dark and suspenseful, with eerie atmosphere",
      comedy: "humorous and lighthearted, with witty dialogue",
      scifi: "futuristic and imaginative, with advanced technology",
      adventure: "exciting and action-packed, with daring exploits",
      mystery: "intriguing and puzzling, with clever twists"
    };

    const styleGuide = TEMPLATE_STYLES[template] || TEMPLATE_STYLES.fantasy;

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
      return NextResponse.json(
        { error: `Groq API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No story content returned' },
        { status: 500 }
      );
    }

    try {
      const cleanContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      const parsed = JSON.parse(cleanContent);

      return NextResponse.json(parsed);
    } catch (e) {

      const titleMatch = content.match(/"title":\s*"([^"]+)"/);
      const storyMatch = content.match(/"story":\s*"((?:[^"\\]|\\.)*)"/);
      const moralMatch = content.match(/"moral":\s*"([^"]+)"/);

      if (titleMatch && storyMatch) {
        return NextResponse.json({
          title: titleMatch[1],
          story: storyMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"'),
          moral: moralMatch ? moralMatch[1] : undefined
        });
      }

      return NextResponse.json(
        { error: 'Could not parse story response' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}