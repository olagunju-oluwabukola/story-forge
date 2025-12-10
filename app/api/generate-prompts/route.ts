import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_PROMPTS = [
  { title: "The Lost Key", description: "A mysterious key appears on your doorstep, opening doors to parallel worlds and forgotten memories." },
  { title: "Midnight Train", description: "A train that only appears at midnight takes passengers to their most cherished or painful memories." },
  { title: "The Painter", description: "An artist discovers their paintings predict the future, but each painting costs them a memory." },
  { title: "Silent Library", description: "In a library where books whisper secrets, one book calls your name with a warning." },
  { title: "Time's Echo", description: "You wake up to find you're living the same day, but each time something small changes." },
  { title: "The Last Star", description: "Humanity's last hope rests on a ship traveling to a dying star that holds ancient power." },
];

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        FALLBACK_PROMPTS.sort(() => Math.random() - 0.5).slice(0, 6)
      );
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
            content: 'You are a creative story idea generator. You ONLY generate story prompts and creative fiction ideas.'
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

Mix different genres: fantasy, sci-fi, mystery, romance, thriller, adventure.`
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

    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (Array.isArray(parsed)) {
      return NextResponse.json(parsed.slice(0, 6));
    } else if (parsed.prompts && Array.isArray(parsed.prompts)) {
      return NextResponse.json(parsed.prompts.slice(0, 6));
    } else if (parsed.stories && Array.isArray(parsed.stories)) {
      return NextResponse.json(parsed.stories.slice(0, 6));
    }

    return NextResponse.json(
      FALLBACK_PROMPTS.sort(() => Math.random() - 0.5).slice(0, 6)
    );

  } catch (error) {
    console.error('Error generating prompts:', error);
    return NextResponse.json(
      FALLBACK_PROMPTS.sort(() => Math.random() - 0.5).slice(0, 6)
    );
  }
}