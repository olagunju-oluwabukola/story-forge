"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Trash2, ArrowLeft, Calendar } from 'lucide-react';
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

export default function LibraryPage() {
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [selectedStory, setSelectedStory] = useState<SavedStory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStories = () => {
      // Load stories from localStorage
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('stories');
        if (saved) {
          try {
            const parsedStories = JSON.parse(saved);
            setStories(parsedStories);
          } catch (error) {
            console.error('Failed to parse saved stories:', error);
            localStorage.removeItem('stories');
          }
        }
      }
      setIsLoading(false);
    };

    loadStories();
  }, []);

  const handleDelete = (title: string) => {
    if (typeof window === 'undefined') return;

    const updated = stories.filter(s => s.title !== title);
    setStories(updated);
    localStorage.setItem('stories', JSON.stringify(updated));
    if (selectedStory?.title === title) {
      setSelectedStory(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Story Library</h1>
            <p className="text-gray-600">
              {stories.length} {stories.length === 1 ? 'story' : 'stories'} saved
            </p>
          </div>

          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>

        {stories.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No saved stories yet
            </h2>
            <p className="text-gray-500 mb-6">
              Create your first story and save it to see it here!
            </p>
            <Link href="/create">
              <Button>Create a Story</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Stories List */}
            <div className="lg:col-span-1 space-y-4">
              {stories.map((story, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedStory?.title === story.title ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedStory(story)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">
                      {story.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {story.template}
                        </Badge>
                        {story.kidsMode && (
                          <Badge variant="outline" className="text-xs bg-pink-50">
                            Kids
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(story.savedAt)}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(story.title);
                        }}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Story Viewer */}
            <div className="lg:col-span-2">
              {selectedStory ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">{selectedStory.title}</CardTitle>
                    <div className="flex gap-2 flex-wrap mt-2">
                      <Badge>{selectedStory.template}</Badge>
                      <Badge variant="outline">{selectedStory.character}</Badge>
                      <Badge variant="outline">{selectedStory.setting}</Badge>
                      {selectedStory.kidsMode && (
                        <Badge className="bg-pink-500">Kids Mode</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-lg max-w-none">
                      <p className="whitespace-pre-line leading-relaxed text-gray-700">
                        {selectedStory.story}
                      </p>

                      {selectedStory.moral && (
                        <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded">
                          <p className="font-semibold text-amber-900 mb-1">Moral:</p>
                          <p className="text-amber-800">{selectedStory.moral}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Select a story to read it
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}