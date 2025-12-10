"use client"

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateStory, generateCoverPlaceholder, StoryResult } from '@/lib/generate-story';
import StoryViewer from '@/components/story-viewer';
import DownloadPDF from '@/components/download-pdf';
import StoryAudio from '@/components/story-audio';
import { Button } from '@/components/ui/button';
import { Card, } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, RefreshCw, Copy, BookmarkPlus, BookMarked, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface SavedStory {
  title: string;
  story: string;
  moral?: string;
  character: string;
  setting: string;
  twist: string;
  template: string;
  kidsMode: boolean;
  savedAt: string;
}

function StoryContent() {
  const searchParams = useSearchParams();
  const [story, setStory] = useState<StoryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const character = searchParams.get('character') || '';
  const setting = searchParams.get('setting') || '';
  const twist = searchParams.get('twist') || '';
  const template = searchParams.get('template') || 'fantasy';
  const kidsMode = searchParams.get('kidsMode') === 'true';

  useEffect(() => {
    async function fetchStory() {
      try {
        setLoading(true);
        setError('');

        const result = await generateStory({
          character,
          setting,
          twist,
          template,
          kidsMode
        });

        setStory(result);

        if (typeof window !== 'undefined') {
          const savedStoriesStr = localStorage.getItem('stories') || '[]';
          const savedStories: SavedStory[] = JSON.parse(savedStoriesStr);
          const isAlreadySaved = savedStories.some((s) => s.title === result.title);
          setSaved(isAlreadySaved);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate story');
      } finally {
        setLoading(false);
      }
    }

    if (character && setting && twist) {
      fetchStory();
    }
  }, [character, setting, twist, template, kidsMode]);

  const handleCopy = () => {
    if (story) {
      navigator.clipboard.writeText(`${story.title}\n\n${story.story}${story.moral ? `\n\nMoral: ${story.moral}` : ''}`);
    }
  };

  const handleSave = () => {
    if (!story || typeof window === 'undefined') return;

    const savedStoriesStr = localStorage.getItem('stories') || '[]';
    const savedStories: SavedStory[] = JSON.parse(savedStoriesStr);

    if (saved) {

      const updated = savedStories.filter((s) => s.title !== story.title);
      localStorage.setItem('stories', JSON.stringify(updated));
      setSaved(false);
    } else {

      const storyData: SavedStory = {
        title: story.title,
        story: story.story,
        moral: story.moral,
        character,
        setting,
        twist,
        template,
        kidsMode,
        savedAt: new Date().toISOString()
      };
      savedStories.unshift(storyData);
      localStorage.setItem('stories', JSON.stringify(savedStories));
      setSaved(true);
    }
  };

  const handleRegenerate = () => {
    window.location.reload();
  };

  const coverGradient = generateCoverPlaceholder(template);

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin mx-auto text-blue-700" />
          <p className="text-xl font-medium text-gray-700">
            Crafting your story...
          </p>
          <p className="text-sm text-gray-500">
            This may take a moment
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Link href="/create">
              <Button>Try Again</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No story to display</p>
          <Link href="/create">
            <Button>Create a Story</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link href="/create">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleRegenerate} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>

            <Button onClick={handleCopy} variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>

            <Button
              onClick={handleSave}
              variant={saved ? "default" : "outline"}
              size="sm"
              className={saved ? "bg-blue-700" : ""}
            >
              {saved ? (
                <>
                  <BookMarked className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>

            <StoryAudio story={`${story.title}. ${story.story}`} />

            <DownloadPDF story={story} />
          </div>
        </div>


        <Card className="overflow-hidden">
          <div className={`h-48 bg-blue-700 flex items-center justify-center`}>
            <h1 className="text-4xl font-bold text-white text-center px-6">
              {story.title}
            </h1>

          </div>
  <div className="text-center text-sm text-gray-500">
          <span className='font-semibold'> Genre: </span>{template.charAt(0).toUpperCase() + template.slice(1)}
          {kidsMode && " • Kids Mode"}
        </div>
        </Card>

        <StoryViewer story={story} kidsMode={kidsMode} />

      </div>
    </div>
  );
}

export default function StoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen  flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-700" />
      </div>
    }>
      <StoryContent />
    </Suspense>
  );
}