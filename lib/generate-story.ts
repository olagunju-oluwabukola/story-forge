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

export async function generateStory(params: StoryParams): Promise<StoryResult> {
  try {
    console.log('Generating story...');
    const response = await fetch('/api/generate-story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to generate story: ${response.status}`);
    }

    const data = await response.json();

    if (!data.title || !data.story) {
      throw new Error('Incomplete story data returned from server');
    }

    console.log('Story generated successfully');
    return data;

  } catch (error) {
    console.error('Story generation error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate story: ${error.message}`);
    }
    throw new Error('Failed to generate story. Please try again.');
  }
}

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