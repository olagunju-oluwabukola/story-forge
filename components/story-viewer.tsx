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


      {story.moral && (
        <Card className="bg-blue-100">
          <CardContent className="p-6">
            <div className="flex gap-4 items-start">
              <div className="bg-blue-900 p-2 rounded-lg flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-blue-900 mb-2">
                  {kidsMode ? 'What We Learned' : 'Story Moral'}
                </h3>
                <p className="text-blue-950 text-base leading-relaxed">
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