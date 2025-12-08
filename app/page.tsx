"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, RefreshCw, Copy } from "lucide-react";
import { generateStoryPrompts, generateQuickStory } from "@/lib/generate-story-card";
import Why from "@/components/why-section"
import HowItWorks from "@/components/how-it-works";

interface StoryPrompt {
  title: string;
  description: string;
}

export default function Home() {
  const [promptInput, setPromptInput] = useState("");
  const [suggestions, setSuggestions] = useState<StoryPrompt[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [generatingStory, setGeneratingStory] = useState(false);
  const [generatedStory, setGeneratedStory] = useState("");

  // Generate suggestions on mount
  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const prompts = await generateStoryPrompts();
      setSuggestions(prompts);
    } catch (error) {
      console.error("Failed to load suggestions:", error);
      // Fallback suggestions
      setSuggestions([
        { title: "The Lost Key", description: "A mysterious key opens doors to parallel worlds" },
        { title: "Midnight Train", description: "A train that only appears at midnight takes passengers to their memories" },
        { title: "The Painter", description: "An artist discovers their paintings predict the future" },
      ]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleGenerate = async () => {
    if (!promptInput.trim()) return;

    setGeneratingStory(true);
    setGeneratedStory("");

    try {
      const story = await generateQuickStory(promptInput);
      setGeneratedStory(story);
    } catch (error) {
      console.error("Failed to generate story:", error);
      alert("Failed to generate story. Please try again.");
    } finally {
      setGeneratingStory(false);
    }
  };

  const handleSuggestionClick = async (suggestion: StoryPrompt) => {
    setPromptInput(suggestion.description);
    setGeneratingStory(true);
    setGeneratedStory("");

    try {
      const story = await generateQuickStory(suggestion.description);
      setGeneratedStory(story);
    } catch (error) {
      console.error("Failed to generate story:", error);
      alert("Failed to generate story. Please try again.");
    } finally {
      setGeneratingStory(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-32 text-center max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          AI Story Builder — Create Stories With One Click
        </h1>

        <p className="text-lg md:text-xl text-gray-700 mt-6">
          Instantly turn your ideas into original stories. Just type a prompt
          and let AI build a unique story filled with imagination and creativity.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-5xl mt-14">
        <div className="bg-white rounded-2xl border shadow-md p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Write a short story prompt…"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border border-dashed rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-700 "
              disabled={generatingStory}
            />

            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={!promptInput.trim() || generatingStory}
              className="sm:w-auto w-full border-2 border-blue-700 bg-transparent text-blue-700 font-semibold hover:text-white flex mx-auto items-center px-6 hover:bg-blue-700"
            >
              {generatingStory ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Story
                </>
              )}
            </Button>
          </div>


          {generatedStory && (
            <div className="mt-6 p-6  rounded-xl border border-blue-100">
              <h3 className="font-bold text-lg text-gray-900 mb-3">Your Story:</h3>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-line text-gray-800 leading-relaxed">
                  {generatedStory}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(generatedStory)}
                >
                  <Copy/>
                  Copy
                </Button>
              </div>
            </div>
          )}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Try these story ideas:
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={loadSuggestions}
                disabled={loadingSuggestions}
                className="text-xs"
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${loadingSuggestions ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {loadingSuggestions ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-xl p-4 h-24 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {suggestions.map((suggestion, index) => (
                  <StoryCard
                    key={index}
                    title={suggestion.title}
                    description={suggestion.description}
                    onClick={() => handleSuggestionClick(suggestion)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
  <div className="my-6 md:my-14 ">
 <Why/>
</div>

 <div className="my-6 md:my-14">
 <HowItWorks/>
</div>


 </div>

  );
}

function StoryCard({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-left hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm hover:shadow-md group"
    >
      <h4 className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-blue-700">
        {title}
      </h4>
      <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
    </button>
  );
}