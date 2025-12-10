import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing prompt' },
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
      return NextResponse.json(
        { error: `Groq API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const story = data.choices[0].message.content;

    if (!story) {
      return NextResponse.json(
        { error: 'No story content returned' },
        { status: 500 }
      );
    }

    return NextResponse.json({ story: story.trim() });

  } catch (error) {
    console.error('Quick story generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    );
  }
}