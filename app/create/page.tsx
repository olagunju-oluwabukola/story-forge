"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CharacterSelect from '@/components/character-select';
import SettingSelect from '@/components/setting-select';
import TwistSelect from '@/components/twist-select';
import GenerateButton from '@/components/generate-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Baby } from 'lucide-react';
import Link from 'next/link';

const TEMPLATES = [
  { id: 'fantasy', name: 'Fantasy', emoji: '🧙‍♂️', color: 'from-purple-500 to-pink-500' },
  { id: 'horror', name: 'Horror', emoji: '👻', color: 'from-gray-700 to-black' },
  { id: 'comedy', name: 'Comedy', emoji: '😂', color: 'from-yellow-500 to-orange-500' },
  { id: 'scifi', name: 'Sci-Fi', emoji: '🚀', color: 'from-blue-500 to-purple-600' },
  { id: 'adventure', name: 'Adventure', emoji: '⛰️', color: 'from-green-500 to-teal-600' },
  { id: 'mystery', name: 'Mystery', emoji: '🔍', color: 'from-indigo-600 to-purple-700' },
];

export default function CreatePage() {
  const router = useRouter();
  const [character, setCharacter] = useState('');
  const [setting, setSetting] = useState('');
  const [twist, setTwist] = useState('');
  const [template, setTemplate] = useState('fantasy');
  const [kidsMode, setKidsMode] = useState(false);

  const handleGenerate = () => {
    const params = new URLSearchParams({
      character,
      setting,
      twist,
      template,
      kidsMode: kidsMode.toString()
    });
    router.push(`/story?${params.toString()}`);
  };

  const isComplete = character && setting && twist;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>

          <Button
            variant={kidsMode ? "default" : "outline"}
            size="sm"
            onClick={() => setKidsMode(!kidsMode)}
            className={kidsMode ? "bg-pink-500 hover:bg-pink-600" : ""}
          >
            <Baby className="mr-2 h-4 w-4" />
            Kids Mode
          </Button>
        </div>

        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Build Your Story
          </h1>
          <p className="text-gray-600">
            Select your story elements and let AI create magic ✨
          </p>
        </div>

        {/* Template Selection */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Choose Story Template
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {TEMPLATES.map((temp) => (
              <Card
                key={temp.id}
                onClick={() => setTemplate(temp.id)}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  template === temp.id ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <CardContent className="p-4 text-center">
                  <div className={`text-3xl mb-2 bg-gradient-to-br ${temp.color} bg-clip-text text-transparent`}>
                    {temp.emoji}
                  </div>
                  <p className="text-sm font-medium">{temp.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Character Selection */}
        <CharacterSelect
          value={character}
          onChange={setCharacter}
          kidsMode={kidsMode}
        />

        {/* Setting Selection */}
        <SettingSelect
          value={setting}
          onChange={setSetting}
          kidsMode={kidsMode}
        />

        {/* Twist Selection */}
        <TwistSelect
          value={twist}
          onChange={setTwist}
          kidsMode={kidsMode}
        />

        {/* Generate Button */}
        <GenerateButton
          onClick={handleGenerate}
          disabled={!isComplete}
        />

        {/* Progress Indicator */}
        {!isComplete && (
          <div className="text-center text-sm text-gray-500">
            {!character && "→ Pick a character"}
            {character && !setting && "→ Choose a setting"}
            {character && setting && !twist && "→ Select a plot twist"}
          </div>
        )}
      </div>
    </div>
  );
}