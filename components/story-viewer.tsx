import { Card, CardContent } from '@/components/ui/card';
import { StoryResult } from '@/lib/generate-story';
import { Lightbulb } from 'lucide-react';

interface StoryViewerProps {
  story: StoryResult;
  kidsMode?: boolean;
}

export default function StoryViewer({ story, kidsMode }: StoryViewerProps) {
  return (
    <div className="space-y-6">
      {/* Main Story Card */}
      <Card>
        <CardContent className="p-8 md:p-12">
          <article className="prose prose-lg max-w-none">
            <div
              className={`
                whitespace-pre-line
                leading-relaxed
                ${kidsMode ? 'text-xl' : 'text-lg'}
                text-gray-800
              `}
              style={{
                fontFamily: kidsMode ? "'Comic Sans MS', cursive" : "'Georgia', serif"
              }}
            >
              {story.story}
            </div>
          </article>
        </CardContent>
      </Card>

      {/* Moral/Lesson Card */}
      {story.moral && (
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex gap-4 items-start">
              <div className="bg-amber-500 p-2 rounded-lg flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-amber-900 mb-2">
                  {kidsMode ? 'What We Learned' : 'Story Moral'}
                </h3>
                <p className="text-amber-800 text-base leading-relaxed">
                  {story.moral}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}